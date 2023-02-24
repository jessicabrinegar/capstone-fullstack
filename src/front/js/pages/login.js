import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Login = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="text-center mt-5">
      <h1>Login</h1>
      <div>
        <input type="text"></input>
        <input type="password"></input>
        <button>Login</button>
      </div>
    </div>
  );
};
