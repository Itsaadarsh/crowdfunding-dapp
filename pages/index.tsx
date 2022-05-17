import { ethers } from "ethers";
import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { cfContractAddress } from "../config";
import CrowdFunding from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
import ProjectCard from "../components/ProjectCard";

export interface PROJECT {
  projectID: number;
  creator: string;
  title: string;
  description: string;
  targetAmount: number;
  amountRaised: number;
  deadline: string;
  location: string;
  category: string;
  image: string;
  state: string;
  noOfContributors: number;
}

const Home: NextPage = () => {
  const [frProjects, setFrProjects] = useState<PROJECT[]>([]);
  const [loadingState, setLoadingState] = useState<string>("not-loaded");

  useEffect(() => {
    loadFundRaisingProjects();
  }, []);

  function checkState(state: number): string {
    if (state == 0) {
      return "Successful";
    } else if (state == 1) {
      return "Fund Raising";
    } else {
      return "Expired";
    }
  }

  async function loadFundRaisingProjects() {
    const provider = new ethers.providers.JsonRpcProvider();
    const fundRaisingContract = new ethers.Contract(
      cfContractAddress,
      CrowdFunding.abi,
      provider
    );
    const data = await fundRaisingContract.getAllProjects();

    const items: PROJECT[] = await Promise.all(
      data.map(async (i: any) => {
        let item: PROJECT = {
          projectID: i.projectID.toNumber(),
          creator: i.creator,
          title: i.title,
          description: i.description,
          targetAmount: i.targetAmount.toNumber(),
          amountRaised: i.amountRaised.toNumber(),
          deadline: new Date(+i.deadline * 1000).toLocaleString(),
          location: i.location,
          category: i.category,
          image: i.image,
          state: checkState(i.state),
          noOfContributors: i.noOfContributors.toNumber(),
        };
        return item;
      })
    );
    setFrProjects(items);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !frProjects.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;

  return (
    <section>
      <div className="flex justify-around m-20">
        <div className="w-1/2">
          <p className="text-4xl my-20">
            Helping the needy always spreads smile on faces. Donate here to give
            them a better future.
          </p>
          <button
            type="button"
            className="text-gray-900 hover:bg-green-300 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-pink-500 "
          >
            Start your campaign
            <BsArrowRight size={20} className="ml-1" />
          </button>
        </div>
        <Image src="/assets/homebg.png" width={600} height={400}></Image>
      </div>
      <div className="m-10 ">
        {frProjects.map((project: PROJECT, index) => {
          return <ProjectCard key={index} data={project} />;
        })}
      </div>
    </section>
  );
};

export default Home;
