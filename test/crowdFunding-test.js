const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowd Funding Platform", function () {
  it("To Start a new project", async function () {
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    const cf = await CrowdFunding.deploy();
    await cf.deployed();

    await cf.startProject(
      "Demo Project",
      "Demo project for testing purpose",
      1652438700,
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
    console.log(projects[0].amountRaised);
    expect(projects[0].noOfContributors).to.be.equal("1");
  });
});
