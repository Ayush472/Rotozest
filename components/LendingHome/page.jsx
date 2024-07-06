"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ledningImage from "../../assets/images/header-section1.jpeg";
import Heading from "../headerHeading/page";
import sectionSecond from "../../assets/images/home-section-2.jpeg";
import sectionSecondAbout from "../../assets/images/home-section-2-inner.jpeg";
import { GoCheckCircle } from "react-icons/go";
import Button from "../button/page";

const LendingPage = () => {
  const animationVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };
  const words1 = ["Welcome", "to", "our"];
  const words2 = ["Pumping", "industry"];
  return (
    <>
      <div>
        <div className="text-center font-bold text-4xl mt-14 mb-10">
          <div className="flex justify-center space-x-2">
            {words1.map((word, index) => (
              <motion.span
                key={word}
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{ duration: 0.5, delay: index * 0.3 }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div className="flex justify-center space-x-2">
            {words2.map((word, index) => (
              <motion.span
                key={word}
                initial="hidden"
                animate="visible"
                variants={animationVariants}
                transition={{
                  duration: 0.5,
                  delay: words1.length * 0.3 + index * 0.3,
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>
        <Image
          className="rounded-t-[50px] w-full h-[500px] aspect-[4/3] bg-white"
          src={ledningImage}
          // height={500}
        ></Image>
      </div>
      <section
        className="bg-white  pt-6"
        style={{ backgroundImage: sectionSecond }}
      >
        <Heading
          headingName={"About Our Industry"}
          headingPostion={"center"}
        ></Heading>
        <div className="container mx-auto px-40 py-3 flex gap-8	">
          <div className="image-container">
            <Image
              className="rounded-lg aspect-[9/5]"
              src={sectionSecondAbout}
            ></Image>
          </div>
          <div>
            <p className="text-justify">
              Welcome to our cutting-edge pumping solutions for the food,
              pharmaceutical, and chemical industries. Engineered for top
              hygiene, precision, and durability, our pumps ensure seamless
              operations. Our pumps excel in compliance with industry standards,
              guaranteeing sterility, accurate dosing, and the safe handling of
              substances. Certified to ISO 9001:2015 standards, our innovative,
              energy-efficient, and customizable pumps deliver exceptional
              quality and reliability for all your processes.
            </p>
            <div>
              <div className="flex items-center	 gap-3">
                <GoCheckCircle className="text-[#4F7EC3]" size={22} />
                <span className="text-lg">Building Quality Products</span>
              </div>
              <div className="flex items-center	 gap-3">
                <GoCheckCircle className="text-[#4F7EC3]" size={22} />
                <span className="text-lg">Quality control system</span>
              </div>
              <div className="flex items-center	 gap-3">
                <GoCheckCircle className="text-[#4F7EC3]" size={22} />
                <span className="text-lg">ISO certified</span>
              </div>
            </div>
            <Button name={"About Us"}/>
          </div>

        </div>
      </section>
    </>
  );
};

export default LendingPage;
