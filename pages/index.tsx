import { ethers } from "ethers";
import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { cfContractAddress } from "../config";
import CrowdFunding from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
import ProjectCard from "../components/ProjectCard";
import { checkState } from "../helper/checkState";
import { useRouter } from "next/router";

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

  const router = useRouter();

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

  return (
    <section className="mx-28 my-10">
      <div className="flex">
        <div className="w-1/2">
          <p className="text-4xl my-20">
            Helping the needy always spreads smile on faces. Donate here to give
            them a better future.
          </p>
          <button
            type="button"
            onClick={() => {
              router.push("/create");
            }}
            className="text-gray-900 hover:bg-green-300 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-pink-500 "
          >
            Start your campaign
            <BsArrowRight size={20} className="ml-1" />
          </button>
        </div>
        <Image src="/assets/homebg.png" width={650} height={400}></Image>
      </div>
      <p className="font-bold text-4xl mt-20">Current Fundraisers</p>
      {loadingState === "loaded" && !frProjects.length ? (
        <h1 className="py-3 text-2xl">
          Loading data from blockchain! Please wait!
        </h1>
      ) : (
        <div className="flex flex-row flex-wrap">
          {frProjects.map((project: PROJECT, index) => {
            return <ProjectCard key={index} data={project} />;
          })}
        </div>
      )}
    </section>
  );
};

export default Home;
