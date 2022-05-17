//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract CrowdFunding {
    address payable owner;
    uint256 private totalFeeCollected;

    constructor() {
        owner = payable(msg.sender);
    }

    enum State {
        Successful,
        FundRaising,
        Expired
    }

    struct Project {
        uint256 projectID;
        address payable creator;
        string title;
        string description;
        uint256 targetAmount;
        uint256 amountRaised;
        uint256 deadline;
        string location;
        string category;
        string image;
        State state;
        uint256 noOfContributors;
        Request[] requests;
        uint256 noOfRequests;
    }

    struct Request {
        uint256 requestID;
        string reqDescription;
        uint256 reqAmount;
        bool reqStatus;
        uint256 noOfVoters;
    }

    struct Voters {
        uint256 requestID;
        mapping(address => bool) vote;
    }

    struct Contributions {
        uint256 projectID;
        mapping(address => uint256) contributions;
        Voters[] voters;
    }

    Contributions[] contributorsList;
    Project[] projectsList;

    event FundingReceived(address contributor, uint256 amountContributed, uint256 amountRaised);
    event CreatorPaid(address recipient);

    function startProject(
        string memory _title,
        string memory _desc,
        uint256 _deadline,
        uint256 _target,
        string memory _location,
        string memory _category,
        string memory _img
    ) public {
        projectsList.push();
        contributorsList.push();
        uint256 index = projectsList.length - 1;

        projectsList[index].projectID = index;
        projectsList[index].creator = payable(address(msg.sender));
        projectsList[index].title = _title;
        projectsList[index].description = _desc;
        projectsList[index].targetAmount = _target;
        projectsList[index].amountRaised = 0;
        projectsList[index].deadline = _deadline;
        projectsList[index].location = _location;
        projectsList[index].category = _category;
        projectsList[index].image = _img;
        projectsList[index].state = State.FundRaising;

        contributorsList[index].projectID = index;
    }

    function setProjectStatus(uint256 _projectID) public {
        if (projectsList[_projectID].amountRaised >= projectsList[_projectID].targetAmount) {
            projectsList[_projectID].state = State.Successful;
        } else if (projectsList[_projectID].deadline < block.timestamp) {
            projectsList[_projectID].state = State.Expired;
        } else {
            projectsList[_projectID].state = State.FundRaising;
        }
    }

    function contribute(uint256 _projectID) external payable returns (bool) {
        require(
            msg.sender != projectsList[_projectID].creator,
            "Project creator cannot contribute to the same project"
        );
        setProjectStatus(_projectID);
        require(
            projectsList[_projectID].state == State.FundRaising,
            "This project is not raising funds anymore"
        );

        projectsList[_projectID].amountRaised += msg.value;
        contributorsList[_projectID].contributions[msg.sender] += msg.value;
        emit FundingReceived(msg.sender, msg.value, projectsList[_projectID].amountRaised);
        if (contributorsList[_projectID].contributions[msg.sender] == 0) {
            projectsList[_projectID].noOfContributors += 1;
        }
        setProjectStatus(_projectID);
        return true;
    }

    function getRefund(uint256 _projectID) public returns (bool) {
        setProjectStatus(_projectID);
        require(
            projectsList[_projectID].state == State.Expired,
            "We cannot refund at the moment as this project is still raising funds"
        );

        require(
            contributorsList[_projectID].contributions[msg.sender] > 0,
            "You have not contributed to this project"
        );

        uint256 amountToBeRefunded = contributorsList[_projectID].contributions[msg.sender];
        contributorsList[_projectID].contributions[msg.sender] = 0;
        address payable sender = payable(msg.sender);

        if (!sender.send(amountToBeRefunded)) {
            contributorsList[_projectID].contributions[msg.sender] = amountToBeRefunded;
            return false;
        } else {
            projectsList[_projectID].amountRaised -= amountToBeRefunded;
            return true;
        }
    }

    function createRequest(
        uint256 _projectID,
        string memory _desc,
        uint256 _value
    ) public {
        require(
            projectsList[_projectID].state == State.Successful,
            "Project status is not successful yet, cannot create a request"
        );
        require(msg.sender == projectsList[_projectID].creator, "One project creator can create a request");
        require(
            _value <= projectsList[_projectID].amountRaised,
            "Withdrawal amount cannot be more than the amount raised"
        );

        projectsList[_projectID].requests.push();
        contributorsList[_projectID].voters.push();

        uint256 index = projectsList[_projectID].requests.length - 1;
        projectsList[_projectID].requests[index].requestID = index;
        projectsList[_projectID].requests[index].reqDescription = _desc;
        projectsList[_projectID].requests[index].reqAmount = _value;
        projectsList[_projectID].requests[index].reqStatus = false;
        projectsList[_projectID].noOfRequests += 1;
    }

    function sendPayout(
        uint256 _projectID,
        address payable _to,
        uint256 _value,
        uint256 _requestID
    ) private returns (bool) {
        Request storage req = projectsList[_projectID].requests[_requestID];
        require(
            req.noOfVoters * 2 >= projectsList[_projectID].noOfContributors,
            "Condition not fullfilled yet"
        );

        uint256 amountToTransfer = (_value * 95) / 100;
        uint256 fee = (_value * 5) / 100;
        totalFeeCollected += fee;

        if (_to.send(amountToTransfer)) {
            emit CreatorPaid(_to);
            owner.transfer(fee);
            projectsList[_projectID].amountRaised -= _value;
            return true;
        } else {
            return false;
        }
    }

    function createVote(uint256 _projectID, uint256 _requestID) public {
        require(
            projectsList[_projectID].state == State.Successful,
            "Project status is not successful yet, cannot create a vote"
        );

        require(
            contributorsList[_projectID].contributions[msg.sender] > 0,
            "You have not contributed to this project, so you cannot vote"
        );

        require(
            contributorsList[_projectID].voters[_requestID].vote[msg.sender] == false,
            "You've already voted"
        );

        projectsList[_projectID].requests[_requestID].noOfVoters += 1;
        contributorsList[_projectID].voters[_requestID].vote[msg.sender] = true;

        if (
            projectsList[_projectID].requests[_requestID].noOfVoters * 2 >=
            projectsList[_projectID].noOfContributors &&
            projectsList[_projectID].requests[_requestID].reqAmount <= projectsList[_projectID].amountRaised
        ) {
            projectsList[_projectID].requests[_requestID].reqStatus = true;
            sendPayout(
                _projectID,
                projectsList[_projectID].creator,
                projectsList[_projectID].requests[_requestID].reqAmount,
                _requestID
            );
        }
    }

    function getMyContributions(uint256 _projectID, address _address) public view returns (uint256) {
        return contributorsList[_projectID].contributions[_address];
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getAllProjects() public view returns (Project[] memory) {
        return projectsList;
    }

    function getAllRequest(uint256 _projectID) public view returns (Request[] memory) {
        return projectsList[_projectID].requests;
    }

    function getProjectDetails(uint256 _projectID) public view returns (Project memory) {
        return projectsList[_projectID];
    }
}
