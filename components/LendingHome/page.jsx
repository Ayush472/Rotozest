// "use client";
// import React from "react";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import ledningImage from "../../assets/images/header-section1.jpeg";
// import Heading from "../headerHeading/page";
// import sectionSecond from "../../assets/images/home-section-2.jpeg";
// import sectionSecondAbout from "../../assets/images/home-section-2-inner.jpeg";
// import { GoCheckCircle } from "react-icons/go";
// import Button from "../button/page";

// const LendingPage = () => {
//   return (
//     <>
//       <div>
//         <div className="text-center font-bold text-4xl mt-14 mb-10">
//           <h1>Welcome to our </h1>
//           <h1>Pumps industry</h1>
//         </div>
//         <Image
//           className="rounded-t-[50px] w-full h-[500px] px-[3px]		 aspect-[4/3] sm:h-64 bg-white"
//           src={ledningImage}
//           alt={"Welcome To Our Pump Industry"}

//           // height={500}
//         ></Image>
//       </div>
//       <section
//         className="bg-white  pt-6"
//         style={{
//           backgroundImage: `url(${sectionSecond.src})`,
//           backgroundRepeat: "no-repeat",
//         }}
//         title="About Our Industry"
//       >
//         <Heading
//           headingName={"About Our Industry"}
//           headingPosition ={"center"}
//         ></Heading>
//         <div className="container mx-auto px-40 py-3 flex gap-8	">
//           <div className="image-container">
//             <Image
//               className="rounded-lg aspect-[9/5]"
//               src={sectionSecondAbout}
//               alt={"About Our Industry"}
//             ></Image>
//           </div>
//           <div>
//             <p className="text-justify">
//               Welcome to our cutting-edge pumping solutions for the food,
//               pharmaceutical, and chemical industries. Engineered for top
//               hygiene, precision, and durability, our pumps ensure seamless
//               operations. Our pumps excel in compliance with industry standards,
//               guaranteeing sterility, accurate dosing, and the safe handling of
//               substances. Certified to ISO 9001:2015 standards, our innovative,
//               energy-efficient, and customizable pumps deliver exceptional
//               quality and reliability for all your processes.
//             </p>
//             <div>
//               <div className="flex items-center	 gap-3">
//                 <GoCheckCircle className="text-[#4F7EC3]" size={22} />
//                 <span className="text-lg">Building Quality Products</span>
//               </div>
//               <div className="flex items-center	 gap-3">
//                 <GoCheckCircle className="text-[#4F7EC3]" size={22} />
//                 <span className="text-lg">Quality control system</span>
//               </div>
//               <div className="flex items-center	 gap-3">
//                 <GoCheckCircle className="text-[#4F7EC3]" size={22} />
//                 <span className="text-lg">ISO certified</span>
//               </div>
//             </div>
//             <Button
//               name={"About Us"}
//               btnStyle={
//                 "px-6 py-2 bg-[#4F7EC3] text-xl	 text-white mt-2 font-bold border-[#4F7EC3] rounded-3xl"
//               }
//             />
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default LendingPage;
"use client";
import React from "react";
import Image from "next/image";
import ledningImage from "../../assets/images/header-section1.jpeg";
import Heading from "../headerHeading/page";
import sectionSecond from "../../assets/images/home-section-2.jpeg";
import sectionSecondAbout from "../../assets/images/home-section-2-inner.jpeg";
import { GoCheckCircle } from "react-icons/go";
import Button from "../button/page";

const LendingPage = () => {
  return (
    <>
      <div className="text-center font-bold text-4xl mt-14 mb-10">
        <h1>Welcome to our</h1>
        <h1>Pumps Industry</h1>
      </div>
      <Image
        className="rounded-t-[25px] w-full h-auto max-h-72 object-cover"
        src={ledningImage}
        alt="Welcome To Our Pump Industry"
      />
      <section
        className="bg-white pt-6 bg-cover bg-center"
        style={{
          backgroundImage: `url(${sectionSecond.src})`,
        }}
        title="About Our Industry"
      >
        <Heading headingName="About Our Industry" headingPosition="center" />
        <div className="container mx-auto px-4 sm:px-3 md:px-6 lg:px-20 py-3 flex flex-col md:flex-row gap-8">
          <div className="flex-1 max-w-full lg:max-w-[50%] xl:max-w-[40%]">
            <Image
              className="rounded-lg w-full h-auto object-cover"
              src={sectionSecondAbout}
              alt="About Our Industry"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center max-w-full lg:max-w-[50%]">
            <p className="text-justify mb-4">
              Welcome to our cutting-edge pumping solutions for the food,
              pharmaceutical, and chemical industries. Engineered for top
              hygiene, precision, and durability, our pumps ensure seamless
              operations. Our pumps excel in compliance with industry standards,
              guaranteeing sterility, accurate dosing, and the safe handling of
              substances. Certified to ISO 9001:2015 standards, our innovative,
              energy-efficient, and customizable pumps deliver exceptional
              quality and reliability for all your processes.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <GoCheckCircle className="text-[#4F7EC3]" size={22} />
                <span className="text-lg">Building Quality Products</span>
              </div>
              <div className="flex items-center gap-3">
                <GoCheckCircle className="text-[#4F7EC3]" size={22} />
                <span className="text-lg">Quality Control System</span>
              </div>
              <div className="flex items-center gap-3">
                <GoCheckCircle className="text-[#4F7EC3]" size={22} />
                <span className="text-lg">ISO Certified</span>
              </div>
            </div>
            <Button
              name="About Us"
              btnStyle="px-6 py-2 bg-[#4F7EC3] text-xl text-white mt-2 font-bold border-[#4F7EC3] rounded-3xl"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default LendingPage;
