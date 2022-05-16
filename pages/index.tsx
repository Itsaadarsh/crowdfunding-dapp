import type { NextPage } from "next";
import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";
import NavBar from "../components/Navbar";

const Home: NextPage = () => {
  return (
    <section>
      <NavBar />
      <div className="flex justify-around m-20">
        <div className="w-1/2">
          <p className="text-4xl my-20">
            Helping the needy always spreads smile on faces. Donate here to give
            them a better future.
          </p>
          <button
            type="button"
            className="text-gray-900 hover:bg-green-300 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-pink-500 "
          >
            Start your campaign
            <BsArrowRight size={20} className="ml-1" />
          </button>
        </div>
        <Image src="/./assets/homebg.png" width={600} height={400}></Image>
      </div>
    </section>
  );
};

export default Home;
