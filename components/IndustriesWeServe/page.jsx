"use client";
import React from "react";
import Heading from "../headerHeading/page";
import bgImage from "../../assets/images/bg-1.png";
import bgImage2 from "../../assets/images/bg-2.png";
import Image from "next/image";
import section1 from "../../assets/images/section3-1.jpg";
import section2 from "../../assets/images/section3-2.jpg";
import section3 from "../../assets/images/section3-3.jpg";

const dataObject = [
  {
    image: section3,
    content:
      "In the chemical industry, rotary gear pumps are invaluable for their ability to handle a wide range of aggressive and corrosive fluids. They efficiently transfer acids, caustics, solvents, and various chemical solutions, ensuring a consistent and reliable flow. Their positive displacement mechanism allows for precise metering and dosing of chemicals, which is crucial for maintaining the accuracy and safety of chemical processes. The robust construction of these pumps ensures durability and longevity, even under harsh conditions. Additionally, their self-priming capability and ability to handle high-viscosity fluids make rotary gear pumps ideal for various chemical processing applications, from manufacturing and blending to distribution and storage.",
    heading: "Chemical industry",
  },
  {
    image: section2,
    content:
      "In the pharmaceutical industry, rotary gear pumps are crucial for their ability to handle high-viscosity fluids with precision and reliability. They are used to transfer medications, ointments, and other viscous pharmaceutical products, ensuring a consistent and accurate flow. The pumps' positive displacement mechanism allows for precise dosing and metering, essential for maintaining the integrity and efficacy of pharmaceutical formulations. Their hygienic design and compatibility with clean-in-place (CIP) systems ensure compliance with stringent sanitation standards, making rotary gear pumps indispensable for safe and efficient pharmaceutical manufacturing processes.",
    heading: "Pharmaceutical industry",
  },
  {
    image: section1,
    content:
      "In the food industry, rotary gear pumps are essential for handling a wide range of food products with varying viscosities, such as syrups, chocolate, vegetable oils, and sauces. Their ability to provide a consistent and smooth flow without pulsation is crucial for maintaining product quality and uniformity. These pumps are designed with hygienic materials and easy-to-clean features, ensuring compliance with food safety standards. Additionally, their self-priming capability and robust construction allow them to operate efficiently under different processing conditions, making rotary gear pumps indispensable for tasks such as transferring, mixing, and dosing food ingredients in production lines.",
    heading: "Food industry",
  },
];

const IndustryWeServe = () => {
  return (
    <div
      className="main-container bg-white"
      style={{
        backgroundImage: `url(${bgImage?.src}), url(${bgImage2?.src})`,
        backgroundPosition: "top left, bottom right",
        backgroundRepeat: "no-repeat, no-repeat",
      }}
    >
    <section title="Industries that we serve">

      <Heading
        headingName={"Industries that we serve"}
        headingPostion={"center"}
      />
    </section>
      <section className="card-container-indsturaction">
        {dataObject.map((item, index) => (
          <div className="container mx-auto px-40 py-3 flex gap-8" key={index}>
            {index % 2 === 0 ? (
              <>
                <div className="image-container">
                  <Image
                    src={item.image}
                    className="rounded-lg aspect-[20/10]"
                    alt={item.heading}
                  ></Image>
                </div>
                <div>
                  <div className="heading text-[#4F7EC3] font-bold text-lg">
                    {item.heading}
                  </div>
                  <p className="text-base text-justify">{item.content}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="heading text-[#4F7EC3] font-bold text-lg">
                    {item.heading}
                  </div>
                  <p className="text-base text-justify">{item.content}</p>
                </div>
                <div className="image-container">
                  <Image
                    src={item.image}
                    className="rounded-lg aspect-[20/12]"
                    alt={item.heading}
                  ></Image>
                </div>
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default IndustryWeServe;
