import Image from "next/image";
import { AiOutlineClockCircle } from "react-icons/ai";
import { daysLeftCalc } from "../../helper/daysLeftCalc";
import { PROJECT } from "../../pages";

const ProjectCard: React.FC<{ data: PROJECT }> = ({ data }) => {
  function cutDescription(des: string): string {
    if (des.length > 30) {
      des = des.substring(0, 55) + "...";
    }
    return des;
  }

  return (
    <a
      href={"/campaign/" + data.projectID}
      className="flex border-2 border-gray-400 bg-white rounded-lg flex-row max-w-xl my-10 mr-32"
    >
      <Image
        className="object-cover rounded-tl-lg rounded-bl-lg"
        src={data.image}
        width={450}
        height={500}
      ></Image>
      <div className="flex flex-col justify-between p-4 w-96">
        <span className="text-pink-500 font-bold">{data.state}</span>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
          {data.title}
        </h5>
        <p className="mb-3 font-normal text-gray-700">
          {cutDescription(data.description)}
        </p>
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-gray-900">
            {data.amountRaised} MATIC raised
          </span>
          <span className="text-sm font-medium text-gray-900">
            {((data.amountRaised / data.targetAmount) * 100).toFixed(2)}%
          </span>
        </div>
        <div className="w-full bg-gray-400 rounded-full h-2.5 mb-5">
          <div
            className="bg-pink-500 h-2.5 rounded-full"
            style={{
              width: `${(data.amountRaised / data.targetAmount) * 100}%`,
            }}
          ></div>
        </div>
        <div className="flex">
          <AiOutlineClockCircle className="mt-1" />
          <p className="ml-1">{daysLeftCalc(data.deadline)}</p>
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
