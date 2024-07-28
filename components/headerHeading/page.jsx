"use client"
import React from "react";

const Heading = ({ headingName, headingPostion }) => {
  return (
    <h2 className={`text-${headingPostion} font-bold text-3xl `}>
      {headingName}
    </h2>
  );
};

export default Heading;
