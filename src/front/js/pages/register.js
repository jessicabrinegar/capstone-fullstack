import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Context } from "../store/appContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

// will likely want to put all this info in the store instead so it can be used in other pages
export const Register = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [university, setUniversity] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const schema = yup.object().shape({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    username: yup.string().required(),
    email: yup.string().email().required(),
    fieldOfStudy: yup.string().required(),
    university: yup.string().required(),
    userType: yup.string().required(),
    password: yup.string().min(7).max(25).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null])
      .required(),
  });

  const { store, actions } = useContext(Context);

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    actions.register(
      data.firstname,
      data.lastname,
      data.username,
      data.email,
      data.fieldOfStudy,
      data.university,
      data.userType,
      data.password
    );
    // .then(() => {
    //   navigate("/login");
    // });
  };

  return (
    <div className="container">
      <h3>Registration</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="First Name"
          {...register("firstname")}
          value={firstname}
          onChange={(e) => setFirstName(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Last Name"
          {...register("lastname")}
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Email"
          {...register("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Username"
          {...register("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="User Type"
          {...register("userType")}
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="University"
          {...register("university")}
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Field of Study"
          {...register("fieldOfStudy")}
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></input>
        {/* <Link to="/login"></Link> */}
        {/* <button onClick={handleClick}>Submit</button> */}
        <input type="submit"></input>
      </form>
      <Link to="/">
        <button className="btn btn-primary">Back home</button>
      </Link>
    </div>
  );
};
