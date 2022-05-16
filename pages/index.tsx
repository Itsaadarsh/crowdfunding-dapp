import { ethers } from "ethers";
import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import NavBar from "../components/Navbar";
import { cfContractAddress } from "../config";
import CrowdFunding from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
import ProjectCard from "../components/ProjectCard";

const Home: NextPage = () => {
  const [frProjects, setFrProjects] = useState([]);
  const [loadingState, setLoadingState] = useState<string>("not-loaded");

  useEffect(() => {
    loadFundRaisingProjects();
  }, []);

  async function loadFundRaisingProjects() {
    const provider = new ethers.providers.JsonRpcProvider();
    const fundRaisingContract = new ethers.Contract(
      cfContractAddress,
      CrowdFunding.abi,
      provider
    );
    const data = await fundRaisingContract.getAllProjects();
    console.log(data);

    // const items: NFTItem[] = await Promise.all(
    //   data.map(async (i: any) => {
    //     const tokenUri = await tokenContract.tokenURI(i.tokenId);
    //     const meta = await axios.get(tokenUri);
    //     let price = ethers.utils.formatUnits(i.price.toString(), "ether");
    //     let item = {
    //       price,
    //       tokenId: i.tokenId.toNumber(),
    //       seller: i.seller,
    //       owner: i.owner,
    //       image: meta.data.image,
    //       name: meta.data.name,
    //       description: meta.data.description,
    //     };
    //     return item;
    //   })
    // );
    // setFrProjects(items);
    // setLoadingState("loaded");
  }

  if (loadingState === "loaded" && !frProjects.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;

  return (
    <section>
      <NavBar />
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
        <ProjectCard />
      </div>
    </section>
  );
};

export default Home;
