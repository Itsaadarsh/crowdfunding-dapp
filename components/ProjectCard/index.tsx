import Image from "next/image";
import { AiOutlineClockCircle } from "react-icons/ai";
import { PROJECT } from "../../pages";

const ProjectCard: React.FC<{ data: PROJECT }> = ({ data }) => {
  function daysLeftCalc(deadline: string): string {
    const dl = new Date(deadline).getTime() / 1000;
    const now = Math.round(Date.now() / 1000);
    const inHours = (dl - now) / 60 / 60;
    const inDays = inHours / 24;
    if (parseInt(inDays.toString()) == 0) {
      if (parseInt(inHours.toString()) == 0) {
        return `Less than 1 hour left`;
      } else if (parseInt(inHours.toString()) == 1) {
        return `${parseInt(inHours.toString())} hour left`;
      }
      return `${parseInt(inHours.toString())} hours left`;
    } else if (parseInt(inDays.toString()) == 1) {
      return `${parseInt(inDays.toString())} day left`;
    } else {
      return `${parseInt(inDays.toString())} days left`;
    }
  }

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
          <span className="text-pink-500 font-bold">{data.state}</span>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
            {data.title}
          </h5>
          <p className="mb-3 font-normal text-gray-700 ">{data.description}</p>
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-gray-900">
              {data.targetAmount} MATIC raised
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
            <p className="ml-1">{daysLeftCalc(data.deadline)}</p>
          </div>
        </div>
      </a>
    </>
  );
};

export default ProjectCard;
