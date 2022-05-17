import { ethers } from "ethers";
import type { NextPage } from "next";
import { useState } from "react";
import { cfContractAddress } from "../config";
import CrowdFunding from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

const Campaign: NextPage = () => {
  return <div>hey</div>;
};

export default Campaign;
