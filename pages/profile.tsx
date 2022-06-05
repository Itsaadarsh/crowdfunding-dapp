import { ethers, utils } from "ethers";
import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { cfContractAddress } from "../config";
import CrowdFunding from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";
import ProjectCard from "../components/ProjectCard";
import { checkState } from "../helper/checkState";
import { useRouter } from "next/router";

const Profile: NextPage = ({ data }: any) => {
  return (
    <section>
      <p></p>
    </section>
  );
};

export default Profile;
