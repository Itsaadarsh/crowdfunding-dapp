import { ethers, utils } from "ethers";
import type { NextPage } from "next";
import Image from "next/image";
import { cfContractAddress } from "../../config";
import CrowdFunding from "../../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
import { PROJECT } from "..";
import { checkState } from "../../helper/checkState";
import { useEffect, useState } from "react";
import PaymentModal from "../../components/PaymentModal";
import RequestModal from "../../components/RequestModal";
import Web3Modal from "web3modal";

const Campaign: NextPage = ({ campaign }: any) => {
  const [showModal, setShowModal] = useState("");
  const [account, setAccount] = useState<string>();

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      await provider.send("eth_requestAccounts", []);
      const accountAddress = await signer.getAddress();
      setAccount(accountAddress);
    };
    connectWalletOnPageLoad();
  }, []);

  return (
    <section className="my-20">
      {!campaign ? (
        <h1 className="text-center text-2xl">
          Loading data from blockchain! Please wait!
        </h1>
      ) : (
        <div className="flex justify-center flex-wrap">
          <div className="flex-col">
            <Image
              className="rounded-2xl"
              src={campaign.image}
              width={550}
              height={400}
            ></Image>
            <div className="flex justify-between mt-5">
              <span>{campaign?.creator}</span>
              <span>12th May, 2022</span>
            </div>
          </div>
          <div className="ml-10 w-1/3 border-4 border-gray-300 shadow-lg flex flex-col justify-between p-4 rounded-md">
            <span className="text-pink-500 text-3xl font-semibold">
              {campaign?.state.toUpperCase()}
            </span>
            <h5 className="text-4xl font-bold tracking-tight text-gray-900 ">
              {campaign?.title}
            </h5>
            <div className="flex-col">
              <span className="text-base text-gray-900">
                <span className="font-bold">{campaign?.amountRaised}</span>{" "}
                MATIC of {campaign?.targetAmount} goal
              </span>
              <div className="bg-gray-400 rounded-full h-2.5 my-2">
                <div
                  className="bg-pink-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (campaign!.amountRaised / campaign!.targetAmount) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-base text-gray-900">
                {campaign?.noOfContributors} contributors
              </span>
            </div>
            <span className="text-base text-gray-900">
              Deadline: {campaign?.deadline}
            </span>
            {campaign.creator.toLowerCase() === account?.toLowerCase() ? (
              <button
                className="text-gray-900 hover:bg-green-300 border border-gray-200 font-medium rounded-md  py-4 text-center bg-pink-500"
                type="button"
                onClick={() => setShowModal("request")}
              >
                Request
              </button>
            ) : (
              <button
                className="text-gray-900 hover:bg-green-300 border border-gray-200 font-medium rounded-md  py-4 text-center bg-pink-500"
                type="button"
                onClick={() => setShowModal("donate")}
              >
                Donate Now
              </button>
            )}
            {showModal === "donate" ? (
              <PaymentModal
                data={{
                  image: campaign.image,
                  title: campaign.title,
                  creator: campaign.creator,
                  category: campaign.category,
                  noOfContributors: campaign.noOfContributors,
                  projectID: campaign.projectID,
                }}
                setShowModal={setShowModal}
              />
            ) : null}
            {showModal === "request" ? (
              <RequestModal
                data={{
                  image: campaign.image,
                  title: campaign.title,
                  amountRaised: campaign.amountRaised,
                  creator: campaign.creator,
                  state: campaign.state,
                  category: campaign.category,
                  noOfContributors: campaign.noOfContributors,
                  projectID: campaign.projectID,
                }}
                setShowModal={setShowModal}
              />
            ) : null}
            <button className="text-gray-900 hover:bg-green-300 border border-gray-200 font-medium rounded-md py-4 text-center bg-pink-500">
              Share
            </button>
          </div>
          <div className="w-1/2 mt-16">
            <p className="font-bold text-lg mb-6">Campaign Description</p>
            <p>{campaign?.description}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export async function getStaticPaths() {
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

  const paths = items.map((cam) => ({
    params: {
      id: `${cam.projectID}`,
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }: any) {
  const { id } = params;
  let campaignData = null;
  try {
    const provider = new ethers.providers.JsonRpcProvider();
    const fundRaisingContract = new ethers.Contract(
      cfContractAddress,
      CrowdFunding.abi,
      provider
    );

    const data = await fundRaisingContract.getProjectDetails(+id!);

    campaignData = {
      projectID: data.projectID.toNumber(),
      creator: data.creator,
      title: data.title,
      description: data.description,
      targetAmount: data.targetAmount.toNumber(),
      amountRaised: data.amountRaised.toNumber(),
      deadline: new Date(+data.deadline * 1000).toLocaleString(),
      location: data.location,
      category: data.category,
      image: data.image,
      state: checkState(data.state),
      noOfContributors: data.noOfContributors.toNumber(),
    };
    console.log(campaignData);
  } catch (err) {
    console.log(err);
  }

  return {
    props: { campaign: campaignData },
  };
}

export default Campaign;
