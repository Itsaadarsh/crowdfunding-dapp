import { ethers } from "ethers";
import type { NextPage } from "next";
import { useState } from "react";
import { cfContractAddress } from "../config";
import CrowdFunding from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

const client = ipfsHttpClient({ url: "https://ipfs.infura.io:5001/api/v0" });

interface FORMINPUT {
  title: string;
  description: string;
  deadline: string;
  target: string;
  location: string;
  category: string;
}

const Create: NextPage = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [formInput, updateFormInput] = useState<FORMINPUT>({
    title: "",
    description: "",
    category: "",
    deadline: "",
    location: "",
    target: "",
  });
  const router = useRouter();

  async function onChange(e: any) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createProject() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      cfContractAddress,
      CrowdFunding.abi,
      signer
    );

    const txn = await contract.startProject(
      formInput.title,
      formInput.description,
      new Date(formInput.deadline).getTime() / 1000,
      formInput.target,
      formInput.location,
      formInput.category,
      fileUrl
    );

    await txn.wait();

    router.push("/");
  }

  return (
    <div className="w-1/2 mx-auto">
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900 ">
          Title
        </label>
        <input
          type="text"
          onChange={(e) =>
            updateFormInput({ ...formInput, title: e.target.value })
          }
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
        ></input>
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900 ">
          Description
        </label>
        <textarea
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 "
        ></textarea>
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900 ">
          Deadline
        </label>
        <input
          type="datetime-local"
          onChange={(e) =>
            updateFormInput({ ...formInput, deadline: e.target.value })
          }
          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded m-0 "
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900 ">
          Target amount to be raised (in MATIC)
        </label>
        <input
          type="text"
          onChange={(e) =>
            updateFormInput({ ...formInput, target: e.target.value })
          }
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
        ></input>
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900 ">
          Location
        </label>
        <input
          type="text"
          onChange={(e) =>
            updateFormInput({ ...formInput, location: e.target.value })
          }
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
        ></input>
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900 ">
          Category
        </label>
        <select
          onChange={(e) =>
            updateFormInput({ ...formInput, category: e.target.value })
          }
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
        >
          <option>Reconstruction</option>
          <option>Food and Drinks</option>
          <option>Hardware and Electronics</option>
          <option>Others</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900 ">
          Upload image
        </label>
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
      </div>
      {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
      <button
        onClick={createProject}
        className="text-white bg-blue-700 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center"
      >
        Submit
      </button>
    </div>
  );
};

export default Create;
