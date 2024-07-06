"use client"
import React from "react";

const Heading = ({ headingName, headingPostion }) => {
  return (
    <div className={`text-${headingPostion} font-bold text-3xl `}>
      {headingName}
    </div>
  );
};

export default Heading;
