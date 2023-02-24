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

  // const history = useHistory();
  const navigate = useNavigate();

  const handleClick = () => {
    actions.login(username, password); //.then(()=>navigate("/myfeed"))
  };

  useEffect(() => {
    if (store.token && store.token != "" && store.token != undefined) {
      navigate("/myfeed");
    }
  }, [store.token]);

  return (
    <div className="text-center mt-5">
      <h1>Login</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button onClick={handleClick}>Login</button>
      </div>
    </div>
  );
};
