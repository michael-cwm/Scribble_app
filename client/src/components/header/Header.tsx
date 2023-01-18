import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleClickHome = () => {
    if (token) {
      navigate("/feed");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="header__wrapper">
      <h1>
        <span
          className="bg-clip-text font-bold text-transparent bg-gradient-to-b from-[var(--borders)] to-white"
          onClick={handleClickHome}
        >
          scribble
        </span>
      </h1>
    </div>
  );
};

export default Header;
