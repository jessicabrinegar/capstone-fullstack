import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Context } from "../store/appContext";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

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
  const [emailConfirmed, setEmailConfirmed] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const fetchUniversities = async () => {
      const response = await fetch(
        `https://api.data.gov/ed/collegescorecard/v1/schools.json?fields=school.name&school.name=${inputValue}&api_key=Dced9mxZyLP3S4hFeCtmTceVtEDBc2ztpeflkVqE`
      );
      const data = await response.json();
      setUniversities(
        data.results.map((element) => ({
          // value: element["school.name"],
          value: element["school.name"],
          label: element["school.name"],
        }))
      );
    };
    fetchUniversities();
  }, [inputValue]);

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };

  const onSubmit = (data) => {
    if (!data.university) {
      data.university = university;
    }
    console.log(data);
    actions.verifyEmail(data.email).then((resp) => {
      console.log(resp);
      if (resp.format == true && resp.disposable == false && resp.dns == true) {
        setEmailConfirmed(true);
        const registrationResponse = actions.register(
          data.firstname,
          data.lastname,
          data.username,
          data.email,
          data.fieldOfStudy,
          data.university,
          data.userType,
          data.password
        );
        if (registrationResponse) {
          return navigate("/verified");
        }
      } else {
        setEmailConfirmed(false);
        setEmail("");
      }
    });
  };

  return (
    <div className="container">
      <h3>Registration</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          required
          maxLength="25"
          type="text"
          placeholder="First Name"
          // ref={register({ required: true })}
          {...register("firstname")}
          value={firstname}
          onChange={(e) => setFirstName(e.target.value)}
        ></input>
        <input
          required
          maxLength="40"
          type="text"
          placeholder="Last Name"
          {...register("lastname")}
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
        ></input>
        <input
          required
          type="email"
          placeholder="Email"
          {...register("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          required
          type="text"
          minLength="5"
          maxLength="25"
          placeholder="Username"
          {...register("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <select
          required
          className="form-select"
          defaultValue="choose"
          onChange={(e) => setUserType(e.target.value)}
          {...register("userType")}
        >
          <option value="choose" disabled>
            Choose User Type
          </option>
          <option value="undergrad">Undergraduate Student</option>
          <option value="grad">Graduate Student</option>
          <option value="post-doc">Post-doc</option>
          <option value="professor">Professor/Scientist</option>
        </select>
        <Select
          required
          options={universities}
          onInputChange={handleInputChange}
          placeholder="Search for a university"
          name="university"
          {...register("university")}
          onChange={(selectedOption) => {
            setUniversity(selectedOption?.value);
          }}
        />
        <input
          required
          type="text"
          placeholder="Field of Study"
          {...register("fieldOfStudy")}
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
        ></input>
        <input
          required
          minLength="7"
          type="password"
          placeholder="Password"
          {...register("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
          required
          minLength="7"
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></input>
        <input type="submit"></input>
      </form>
      <Link to="/">
        <button className="btn btn-primary">Back home</button>
      </Link>
    </div>
  );
};
