"use client"
import React from "react";

const Heading = ({ headingName, headingPosition  }) => {
  return (
    <h2 className={`text-${headingPosition } font-bold text-3xl `}>
      {headingName}
    </h2>
  );
};

export default Heading;
