import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [values, setValues] = useState({
    alias: "",
    password: "",
  });

  const [loginFailed, setLoginFailed] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-account");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:5000/users/login", { ...values })
      .then((response) => {
        if (response.status === 200) {
          navigate("/feed");
          console.log("login succesful");
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setLoginFailed(true);
        }
      });
  };

  useEffect(() => {
    console.log(loginFailed);
  }, [loginFailed]);

  return (
    <>
      <div className="illustration__wrapper">
        <img src="/assets/coffee.png" alt="coffee" className="coffee__image" />
      </div>
      <form
        action=""
        className="account__form"
        onSubmit={(e) => handleLoginSubmit(e)}
      >
        <input
          type="text"
          placeholder="Alias"
          className="input-field"
          name="alias"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [e.target.name]: e.target.value });
          }}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          name="password"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [e.target.name]: e.target.value });
          }}
        />
        <button style={{ backgroundColor: "var(--lightmain)" }}>Log in</button>
      </form>
      {loginFailed && (
        <p style={{ color: "red", textAlign: "center", width: "100%" }}>
          Login failed
        </p>
      )}
      <p className="small__paragraph">Forgot password?</p>
      <p
        onClick={handleClick}
        className="small__paragraph"
        style={{ textDecoration: "underline 1.1px" }}
      >
        Create an account
      </p>
    </>
  );
};

export default Login;
