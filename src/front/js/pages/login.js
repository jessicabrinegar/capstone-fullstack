import React, { useContext, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { store, actions } = useContext(Context);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const handleLogin = () => {
    actions.login(username, password).then(() => navigate("/myfeed"));
    setUsername("");
    setPassword("");
  };

  // useEffect(() => {
  //   if (store.token && store.token != "" && store.token != undefined) {
  //     navigate("/myfeed");
  //   } else {
  //     navigate("/login");
  //   }
  // }, [store.token]);

  return (
    <div className="text-center mt-5">
      <h1>Login</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
        ></input>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};
