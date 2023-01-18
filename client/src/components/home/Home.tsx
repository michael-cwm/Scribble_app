import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleClickCreate = () => {
    navigate("/create-account");
  };

  const handleClickLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/feed");
    }
  });

  return (
    <>
      <div className="image__wrapper">
        <img src="assets/cups.png" alt="" />
      </div>
      <div className="button__wrapper">
        <button className="create-account__button" onClick={handleClickCreate}>
          <p>Create account</p>
        </button>
        <button className="login__button" onClick={handleClickLogin}>
          <p>Log in</p>
        </button>
      </div>
    </>
  );
};

export default Login;
