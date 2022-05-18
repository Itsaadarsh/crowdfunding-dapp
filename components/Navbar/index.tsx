import type { NextPage } from "next";
import { BsLink45Deg } from "react-icons/bs";
import Link from "next/link";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const NavBar: NextPage = () => {
  const [account, setAccount] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      const walletID = localStorage?.getItem("walletID");
      if (walletID!.length > 0) {
        setAccount(walletID!);
      }
    };
    connectWalletOnPageLoad();
  }, []);

  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "33ea574828fa4d6ab1aa5182d939c38a",
          },
        },
      },
    });
    return web3Modal;
  }

  async function connect() {
    try {
      const web3Modal = await getWeb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      localStorage.setItem("walletID", accounts[0]);
      setAccount(accounts[0]);
    } catch (err) {
      console.log("error", err);
    }
  }

  async function disconnect() {
    localStorage.setItem("walletID", "");
    router.reload();
  }

  return (
    <nav className="flex text-center flex-row  justify-between py-4 px-32 bg-white shadow items-baseline w-full">
      <div className="mb-2 sm:mb-0">
        <span className="text-2xl no-underline text-pink-500 font-bold">
          CrowdFunding.
        </span>
      </div>
      <div>
        <Link href="/">
          <a className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-10">
            Home
          </a>
        </Link>
        <Link href="/create">
          <a className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-10 pr-10">
            Create
          </a>
        </Link>
        {account && (
          <div className="dropdown inline-block relative">
            <button className="text-gray-900  border border-gray-200  font-medium rounded-lg text-sm px-5 py-2.5  bg-pink-500 ">
              <span className="mr-1">
                {" "}
                {account.substring(0, 5) +
                  "....." +
                  account.substring(account.length - 3, account.length)}
              </span>
            </button>
            <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
              <li className="">
                <button
                  className="rounded-t bg-green-200 hover:bg-pink-400 py-2 px-4 block whitespace-no-wrap"
                  onClick={disconnect}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        )}
        {!account && (
          <button
            type="button"
            onClick={connect}
            className="text-gray-900 hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-pink-500 "
          >
            <BsLink45Deg size={20} className="mr-1" />
            Connect wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
