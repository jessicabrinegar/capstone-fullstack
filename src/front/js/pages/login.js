import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Login = () => {
  const { store, actions } = useContext(Context);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };
    fetch(
      "https://3001-jessicabrin-capstoneful-tkbqih5kbhg.ws-us88.gitpod.io/api/token",
      opts
    )
      .then((resp) => {
        if (resp.status == 200) return resp.json();
        else alert("There has been an error.");
      })
      .then()
      .catch((error) => console.error("There was an error", error));
  };

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
