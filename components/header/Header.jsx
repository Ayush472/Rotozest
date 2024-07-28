// // components/Header.js
// import Image from 'next/image';
// import Link from 'next/link';
// import Logo from "../../assets/images/full Logo.svg";
// const Header = () => {
//   return (
//     <header className="bg-white shadow-md">
//       <div className="container mx-auto px-20 py-3 flex justify-between items-center">
//         <div className="flex items-center">
//           <Image src={Logo} alt="Logo" width={200}  />
//         </div>
//         <nav className="flex items-center space-x-4">
//           <Link href="/" className="text-gray-800 hover:text-gray-600">
//             Home
//           </Link>
//           <Link href="/about" className="text-gray-800 hover:text-gray-600">
//             About
//           </Link>
//           <Link href="/contact" className="text-gray-800 hover:text-gray-600">
//            Contact
//           </Link>
//         </nav>

//       </div>
//     </header>
//   );
// };

// export default Header;
// components/Header.js
"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiMenuBurger } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";

// import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Logo from "../../assets/images/full Logo.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 md:px-20 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Image src={Logo} alt="Logo" width={200} />
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/" className="text-gray-800 hover:text-gray-600">
            Home
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-gray-600">
            About
          </Link>
          <Link href="/contact" className="text-gray-800 hover:text-gray-600">
            Contact
          </Link>
        </nav>
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 hover:text-gray-600 focus:outline-none"
          >
            {isMenuOpen ? (
              <RxCross1 className="w-6 h-6" />
            ) : (
              <CiMenuBurger className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden ">
          <div className="px-6 py-3 space-y-2">
            <Link href="/" className="block text-gray-800 hover:text-gray-600">
              Home
            </Link>
            <Link
              href="/about"
              className="block text-gray-800 hover:text-gray-600"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-gray-800 hover:text-gray-600"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
