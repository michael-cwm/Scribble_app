import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleClickHome = () => {
    navigate("/");
  };

  return (
    <div className="header__wrapper">
      <h1>
        <span onClick={handleClickHome}>scribble</span>
      </h1>
    </div>
  );
};

export default Header;
