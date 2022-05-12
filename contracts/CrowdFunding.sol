//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

contract CrowdFunding {
    using Counters for Counters.Counter;
    address payable owner;
    uint256 private totalFeeCollected;

    enum State {
        Successful,
        FundRaising,
        Expired
    }

    constructor() {
        owner = payable(msg.sender);
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
    Counters.Counter private counterProjectID;

    event FundingReceived(
        address contributor,
        uint256 amountContributed,
        uint256 amountRaised
    );

    event CreatorPaid(address recipient);

    function startProject(
        string memory _title,
        string memory _desc,
        uint256 _deadline,
        uint256 _target,
        string memory _location,
        string memory _category,
        string memory _img
    ) public {}

    function checkProjectStatus(uint256 _projectID) public {}

    function contribute(uint256 _projectID) external payable returns (bool) {}

    function getRefund(uint256 _projectID) public returns (bool) {}

    function getProjectDetails(uint256 _projectID)
        public
        view
        returns (Project memory)
    {}

    function createRequest(
        uint256 _projectID,
        string memory _desc,
        uint256 _value
    ) public {}

    function sendPayout(
        uint256 _projectID,
        address payable _to,
        uint256 _value,
        uint256 _requestID
    ) private returns (bool) {}

    function createVote(uint256 _projectID, uint256 _requestID) public {}

    function getContractBalance() public view returns (uint256) {}

    function getAllProjects() public view returns (Project[] memory) {}

    function getAllRequest(uint256 _projectID)
        public
        view
        returns (Request[] memory)
    {}

    function getMyContributions(uint256 _projectID, address _address)
        public
        view
        returns (uint256)
    {}
}
