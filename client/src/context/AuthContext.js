import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { json } from "stream/consumers";

export const AuthContext = React.createContext();

export const AuthProvider = (props) => {
  const [cookie, setCookie] = useState("");
  const [values, setValues] = useState({
    alias: "",
    password: "",
    confirmPassword: "",
  });

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  const newAccount = async (e) => {
    e.preventDefault();
    console.log(values);
    try {
      const response = await axios.post(
        "http://localhost:5000/users/register",
        {
          ...values,
        }
      );
      if (response.status === 201) {
        console.log(response.data.token);
        const token = localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ cookie, setCookie, values, setValues, newAccount }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

// export default CreateAccount;
