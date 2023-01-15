import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { json } from "stream/consumers";

const CreateAccount = () => {
  const [cookie, setCookie] = useState("");
  const [values, setValues] = useState({
    alias: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/users/register",
        {
          ...values,
        }
      );
      if (response) {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        navigate("/feed");
      }
    } catch (error) {
      console.log(error);
    }
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
      <p className="small__paragraph">Terms and conditions</p>
    </>
  );
};

export default CreateAccount;
