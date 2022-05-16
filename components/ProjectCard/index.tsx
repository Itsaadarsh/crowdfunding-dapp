import type { NextPage } from "next";
import Image from "next/image";
import { AiOutlineClockCircle } from "react-icons/ai";

const ProjectCard: NextPage = () => {
  return (
    <>
      <a
        href="#"
        className="flex items-center border-2 border-gray-400 bg-white rounded-lg flex-row max-w-xl "
      >
        <Image
          className="object-cover rounded-tl-lg rounded-bl-lg"
          src="/assets/cardimg.jpg"
          width={550}
          height={600}
        ></Image>
        <div className="flex flex-col justify-between p-4 leading-normal">
          <span className="text-pink-500 font-bold">Fund Raising</span>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
            Building House Ukraine War
          </h5>
          <p className="mb-3 font-normal text-gray-700 ">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-gray-900">
              57 MATIC raised
            </span>
            <span className="text-sm font-medium text-gray-900">45%</span>
          </div>
          <div className="w-full bg-gray-400 rounded-full h-2.5 mb-5">
            <div
              className="bg-pink-500 h-2.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
          <div className="flex">
            <AiOutlineClockCircle className="mt-1" />
            <p className="ml-1">27 days left</p>
          </div>
        </div>
      </a>
    </>
  );
};

export default ProjectCard;
