// "use client";
// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { CiMenuBurger } from "react-icons/ci";
// import { RxCross1 } from "react-icons/rx";
// import Logo from "../../assets/images/full Logo.svg";

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <header className="bg-white shadow-md">
//       <div className="container mx-auto px-6 md:px-20 py-3 flex justify-between items-center">
//         <div className="flex items-center">
//           <Image src={Logo} alt="Logo" width={200} />
//         </div>
//         <nav className="hidden lg:flex items-center space-x-4">
//           <Link href="/" className="text-gray-800 hover:text-gray-600">
//             Home
//           </Link>
//           <Link href="/about" className="text-gray-800 hover:text-gray-600">
//             About
//           </Link>
//           <Link href="/contact" className="text-gray-800 hover:text-gray-600">
//             Contact
//           </Link>
//         </nav>
//         <div className="lg:hidden flex items-center">
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="text-gray-800 hover:text-gray-600 focus:outline-none"
//           >
//             {isMenuOpen ? (
//               <RxCross1 className="w-6 h-6" />
//             ) : (
//               <CiMenuBurger className="w-6 h-6" />
//             )}
//           </button>
//         </div>
//       </div>
//       {isMenuOpen && (
//         <div className="lg:hidden absolute  left-0 w-full bg-white shadow-md z-20">
//           <div className="px-6 py-3 space-y-2">
//             <Link href="/" className="block text-gray-800 hover:text-gray-600">
//               Home
//             </Link>
//             <Link
//               href="/about"
//               className="block text-gray-800 hover:text-gray-600"
//             >
//               About
//             </Link>
//             <Link
//               href="/contact"
//               className="block text-gray-800 hover:text-gray-600"
//             >
//               Contact
//             </Link>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;
// "use client";
// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { CiMenuBurger } from "react-icons/ci";
// import { RxCross1 } from "react-icons/rx";
// import Logo from "../../assets/images/full Logo.svg";

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <header className="bg-white shadow-md">
//       <div className="container mx-auto px-6 md:px-20 py-3 flex justify-between items-center">
//         <div className="flex items-center">
//           <Image src={Logo} alt="Logo" width={200} />
//         </div>
//         <nav className="hidden lg:flex items-center space-x-4">
//           <Link href="/" className="text-gray-800 hover:text-gray-600">
//             Home
//           </Link>
//           <Link href="/about" className="text-gray-800 hover:text-gray-600">
//             About
//           </Link>
//           <Link href="/contact" className="text-gray-800 hover:text-gray-600">
//             Contact
//           </Link>
//         </nav>
//         <div className="lg:hidden flex items-center">
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="text-gray-800 hover:text-gray-600 focus:outline-none"
//           >
//             {/* {isMenuOpen ? (
//               <RxCross1 className="w-6 h-6" />
//             ) : ( */}
//             <CiMenuBurger className="w-6 h-6" />
//             {/* )} */}
//           </button>
//         </div>
//       </div>
//       <div
//         className={`lg:hidden fixed inset-0 p-3 bg-white shadow-md z-20 transform ${
//           isMenuOpen ? "translate-x-0" : "-translate-x-full"
//         } transition-transform duration-300 ease-in-out flex justify-between`}
//       >
//         <div className="px-6 py-3 ">
//           <Link
//             href="/"
//             className="block text-gray-800 hover:text-gray-600 text-xl"
//           >
//             Home
//           </Link>
//           <Link
//             href="/about"
//             className="block text-gray-800 hover:text-gray-600 text-xl"
//           >
//             About
//           </Link>
//           <Link
//             href="/contact"
//             className="block text-gray-800 hover:text-gray-600 text-xl"
//           >
//             Contact
//           </Link>
//         </div>
//         <div>
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="text-gray-800 hover:text-gray-600 focus:outline-none"
//           >
//             <RxCross1 className="w-6 h-6" />
//           </button>{" "}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiMenuBurger } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import Logo from "../../assets/images/full Logo.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 md:px-20 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Image src={Logo} alt="Logo" width={200} />
        </div>
        <nav className="hidden lg:flex items-center space-x-4">
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
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 hover:text-gray-600 focus:outline-none"
          >
            <CiMenuBurger className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div
        className={`lg:hidden fixed inset-0 bg-white shadow-md z-20 transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex justify-between p-4">
          <div>
            <Link
              href="/"
              className="block text-gray-800 hover:text-gray-600 text-xl mb-4"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block text-gray-800 hover:text-gray-600 text-xl mb-4"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-gray-800 hover:text-gray-600 text-xl"
            >
              Contact
            </Link>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-800 hover:text-gray-600 focus:outline-none"
          >
            <RxCross1 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
