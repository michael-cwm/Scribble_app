import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { json } from "stream/consumers";

const CreateAccount = () => {
  const [aliasAlreadyExists, setAliasAlreadyExists] = useState<boolean>(false);
  const [passwordsDontMatch, setPasswordsDontMatch] = useState<boolean>(false);
  const [passwordTooShort, setPasswordTooShort] = useState<boolean>(false);

  const [cookie, setCookie] = useState("");
  const [values, setValues] = useState({
    alias: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAliasAlreadyExists(false);
    setPasswordTooShort(false);
    setPasswordsDontMatch(false);

    await axios
      .post("http://localhost:5000/users/register", { ...values })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          localStorage.setItem("token", response.data.token);
          navigate("/feed");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400) {
          console.log("nu blev det 400");
          setAliasAlreadyExists(true);
        }
        if (error.response.status === 401) {
          console.log("nu blev det 401");
          setPasswordTooShort(true);
        }
        if (error.response.status === 402) {
          console.log("nu blev det 402");
          setPasswordsDontMatch(true);
        }
      });
    // console.log("hej");

    // await axios
    //   .post("http://localhost:5000/users/register", {
    //     ...values,
    //   })
    //   .then((response) => {
    //     console.log(response);
    //   });
    // console.log("test");

    // console.log("reså", { response });
    // if (response.status === 400) {
    //   console.log("jag heter ernst");
    // }
    // if (response.status === 200) {
    //   // console.log(response);
    //   localStorage.setItem("token", response.data.token);
    //   navigate("/feed");
    // }
    // console.log("status: ", response.status);
  };

  return (
    <>
      <div className="illustration__wrapper">
        <img src="/assets/watercup.png" alt="watercups" />
      </div>
      <form onSubmit={handleSubmit} className="account__form">
        <input
          className="input-field"
          type="string"
          name="alias"
          placeholder="Alias"
          autoComplete="off"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [e.target.name]: e.target.value });
          }}
        />
        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="off"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [e.target.name]: e.target.value });
          }}
        />
        <input
          className="input-field"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          autoComplete="off"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [e.target.name]: e.target.value });
          }}
        />
        <button type="submit">Create account</button>
      </form>
      {aliasAlreadyExists && (
        <p style={{ color: "red", textAlign: "center", width: "100%" }}>
          Alias already exists
        </p>
      )}
      {passwordsDontMatch && (
        <p style={{ color: "red", textAlign: "center", width: "100%" }}>
          Passwords dont match
        </p>
      )}
      {passwordTooShort && (
        <p style={{ color: "red", textAlign: "center", width: "100%" }}>
          Password must be alteast 5 characters
        </p>
      )}
      <p className="small__paragraph">Terms and conditions</p>
    </>
  );
};

export default CreateAccount;
