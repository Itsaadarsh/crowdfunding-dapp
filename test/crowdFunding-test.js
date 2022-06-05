const { expect } = require("chai");
const { utils } = require("ethers");
const { ethers } = require("hardhat");

describe("Crowd Funding Platform", function () {
  it("To Start a new project", async function () {
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    const cf = await CrowdFunding.deploy();
    await cf.deployed();

    await cf.startProject(
      "Demo Project",
      "Demo project for testing purpose",
      1653154189,
      100,
      "Ukrain",
      "War",
      "demo.image"
    )

    let projects = await cf.getAllProjects()


    projects = await Promise.all(projects.map(async prj => {
      return {
        projectID: prj.projectID.toString(),
        creator: prj.creator,
        title: prj.title,
        description: prj.description,
        targetAmount: prj.targetAmount.toString(),
        amountRaised: prj.amountRaised.toString(),
        deadline: prj.deadline.toString(),
        location: prj.location,
        category: prj.category,
        image: prj.image,
        state: prj.state,
        noOfContributors: prj.noOfContributors.toString(),
        requests: prj.requests,
        noOfRequests: prj.noOfRequests.toString()
      }
    }))
    console.log("before", projects[0].state);

    let res = await cf.contribute(projects[0].projectID, { value: "110" })
    let status = await cf.getProjectDetails(projects[0].projectID)
    console.log("after", status.state);

    expect(projects[0].state).to.be.equal(1);
  });
});
