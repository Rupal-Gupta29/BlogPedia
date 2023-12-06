import React from "react";
import errorImg from "../Assets/error.png";
import { NavLink } from "react-router-dom";

const Error = () => {
  return (
    <div className="errorContainer">
      <div>
        <img src={errorImg} alt="error-img" width={400} />
        <br />
        <NavLink to={"/home"}>Go to Home</NavLink>
      </div>
    </div>
  );
};

export default Error;
