import { ethers } from "ethers";
import type { NextPage } from "next";
import { useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import Image from "next/image";
import { AiOutlineClockCircle } from "react-icons/ai";

const Campaign: NextPage = () => {
  return (
    <section className="my-20">
      <div className="flex justify-center flex-wrap">
        <div className="flex-col">
          <Image
            className="rounded-2xl"
            src="/assets/cardimg.jpg"
            width={550}
            height={400}
          ></Image>
          <div className="flex justify-between mt-5">
            <span>oX3809239083409832098324098324890</span>
            <span>12th May, 2022</span>
          </div>
        </div>
        <div className="ml-10 w-1/3 border-4 border-gray-300 shadow-lg flex flex-col justify-between p-4 rounded-md">
          <span className="text-pink-500 text-3xl font-semibold">
            Fund Raising
          </span>
          <h5 className="text-4xl font-bold tracking-tight text-gray-900 ">
            Ukraine Crisis - World War 3
          </h5>
          <div className="flex-col">
            <span className="text-base text-gray-900">
              <span className="font-bold">2700</span> MATIC of 4500 goal
            </span>
            <div className="bg-gray-400 rounded-full h-2.5 my-2">
              <div
                className="bg-pink-500 h-2.5 rounded-full"
                style={{
                  width: `62%`,
                }}
              ></div>
            </div>
            <span className="text-base text-gray-900">1800 contributors</span>
          </div>
          <button className="text-gray-900 hover:bg-green-300 border border-gray-200 font-medium rounded-md  py-4 text-center bg-pink-500">
            Donate now
          </button>
          <button className="text-gray-900 hover:bg-green-300 border border-gray-200 font-medium rounded-md py-4 text-center bg-pink-500">
            Share
          </button>
        </div>
        <div className="w-1/2 mt-16">
          <p className="font-bold text-lg mb-6">Campaign Description</p>
          <p>
            Hey, I am Daniel - Virtual reality (VR) is a simulated experience
            that can be similar to or completely different from the real world.
            Applications of virtual reality include entertainment (particularly
            video games), education (such as medical or military training) and
            business (such as virtual meetings). Other distinct types of
            VR-style technology include augmented reality and mixed reality,
            sometimes referred to as extended reality or XR. Currently, standard
            virtual reality systems use either virtual reality headsets or
            multi-projected environments to generate realistic images, sounds
            and other sensations that simulate a user's physical presence in a
            virtual environment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Campaign;
