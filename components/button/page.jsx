import React from "react";

const Button = ({ name,btnStyle }) => {
  return <button className={`${btnStyle}`}>{name}</button>;
};

export default Button;
