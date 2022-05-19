import { ethers, utils } from "ethers";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Web3Modal from "web3modal";
import { cfContractAddress } from "../../config";
import CrowdFunding from "../../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { useRouter } from "next/router";

const PaymentModal: React.FC<any> = ({ data, setShowModal }) => {
  const [maticInput, updateMaticInput] = useState<string>("");
  const router = useRouter();

  async function contribute() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    await provider.send("eth_requestAccounts", []);
    const accountAddress = await signer.getAddress();

    let accountBalance: any = await provider.getBalance(accountAddress);
    accountBalance = utils.formatEther(accountBalance);

    const contract = new ethers.Contract(
      cfContractAddress,
      CrowdFunding.abi,
      signer
    );

    if (accountAddress.toLowerCase() == data.creator.toLowerCase()) {
      alert("Campaign creator cannot contribute to their own project");
    } else if (+accountBalance <= +maticInput) {
      alert("Insufficient MATIC in wallet to complete this contribution");
    } else if (maticInput == "" || +maticInput <= 0) {
      alert("Contribution has to be more than 0 MATIC");
    } else {
      try {
        const txn = await contract.contribute(+data.projectID, {
          value: utils.parseEther(maticInput),
        });

        await txn.wait();
      } catch (err) {
        console.log(err);
        alert(
          "This campiagn is now Expired / Successful, Please look for other campaigns to contribute"
        );
      }

      router.push(`/campaign/${data.projectID}`);
    }
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50">
        <div className="relative w-1/2 max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white">
            <button
              className="p-1 ml-auto mt-1 border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={() => setShowModal(false)}
            >
              <AiOutlineClose size={30} />
            </button>
            <div className="mx-12 my-4">
              <div className="flex justify-between">
                <Image
                  className=""
                  src={data.image}
                  width={230}
                  height={140}
                ></Image>
                <div className="w-1/2">
                  <p className="font-bold">{data.title}</p>
                  <br />
                  <p>
                    Category:
                    <span className="font-bold"> {data.category}</span>
                  </p>
                  <p>
                    Total Number of Contributors:
                    <span className="font-bold"> {data.noOfContributors}</span>
                  </p>
                  <p>
                    Your donation will benefit
                    <span className="font-bold">
                      {" "}
                      {data.creator.substring(0, 5) +
                        "....." +
                        data.creator.substring(
                          data.creator.length - 3,
                          data.creator.length
                        )}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex-col mt-10">
                <p className="font-bold">Enter Your Contribution</p>
                <input
                  type="number"
                  onChange={(e) => updateMaticInput(e.target.value)}
                  placeholder="Enter in MATIC"
                  className="my-5 px-3 py-3 placeholder-black  rounded text-lg border-2 border-black w-full"
                />
                <p>
                  *5% of total donation will go in the funds of CroudFunding as
                  royalty charges.
                </p>
              </div>
              <button
                onClick={contribute}
                className="text-gray-900 hover:bg-green-300 border border-gray-200 font-bold rounded-md py-3 text-center bg-pink-500 w-1/3 mt-8"
              >
                PAY
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default PaymentModal;
