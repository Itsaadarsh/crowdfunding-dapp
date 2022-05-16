import type { NextPage } from "next";
import { BsLink45Deg } from "react-icons/bs";

const NavBar: NextPage = () => {
  return (
    <nav className="flex text-center flex-row  justify-between py-4 px-32 bg-white shadow items-baseline w-full">
      <div className="mb-2 sm:mb-0">
        <span className="text-2xl no-underline text-pink-500 font-bold">
          CrowdFunding.
        </span>
      </div>
      <div>
        <a
          href="/one"
          className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-10"
        >
          Home
        </a>
        <a
          href="/two"
          className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-10 pr-10"
        >
          Create
        </a>
        <button
          type="button"
          data-modal-toggle="crypto-modal"
          className="text-gray-900 hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-pink-500 "
        >
          <BsLink45Deg size={20} className="mr-1" />
          Connect wallet
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
