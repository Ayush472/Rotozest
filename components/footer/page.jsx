import Image from "next/image";
import React from "react";
import Logo from "../../assets/images/FooterLogo.svg";
import header from "../../assets/images/full Logo.svg";
import Link from "next/link";
import { FaPhone } from "react-icons/fa6";
import { IoMailUnread } from "react-icons/io5";
import callLogo from "../../assets/images/Call.svg";
import emailLogo from "../../assets/images/Email.svg";
const Footer = () => {
  let date = new Date();

  return (
    <>
      <footer className="bg-[#333333] shadow-md">
        <div className="container mx-auto px-20 py-10 flex justify-between items-center">
          <div className="w-1/3 px-3">
            <Image src={Logo} alt={"Rotozest Logo"} />
            <div className="text-white	">
              Experience excellence with Rotozest Industries. Explore our
              premium products and services tailored to seamlessly meet your
              industrial needs.
            </div>
          </div>
          <div className="w-1/3 px-3 pl-8">
            <h1 className="text-white text-start font-bold text-lg py-3">
              Quick Links
            </h1>
            <div>
              <Link
                className="text-white text-start font-medium text-base py-3"
                href="/"
              >
                {" "}
                Home
              </Link>
            </div>
            <div>
              <Link
                className="text-white text-start font-medium text-base py-3"
                href="/"
              >
                {" "}
                About
              </Link>
            </div>{" "}
            <div>
              <Link
                className="text-white text-start font-medium text-base py-3"
                href="/"
              >
                {" "}
                Contact Us
              </Link>
            </div>
          </div>
          <div className="w-1/3">
            <h1 className="text-white text-start font-bold text-lg py-3">
              Reach Us At{" "}
            </h1>
            <div className="flex my-2">
              <Image src={callLogo} className="mr-2" alt="+91 9974017582" />

              <Link
                className="text-white text-start font-medium text-base py-3"
                href="/"
              >
                {" "}
                +91 9974017582
              </Link>
            </div>
            <div className="flex my-2">
              <Image
                src={callLogo}
                className="mr-2"
                alt="+91 9974017583"
              />

              <Link
                className="text-white text-start font-medium text-base py-3"
                href="/"
              >
                {" "}
                +91 9974017583
              </Link>
            </div>
            <div className="flex my-2">
              <Image src={emailLogo} className="mr-2" alt="info@rotozest.com" />

              <Link
                className="text-white text-start font-medium text-base py-3"
                href="/"
              >
                {" "}
                info@rotozest.com{" "}
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center text-white">
          &#169; {date.getFullYear()} - All rights are reserved by{" "}
          <span className="text-[#4F7EC3]">Rotozest Industries</span> .
        </div>
      </footer>
    </>
  );
};

export default Footer;
