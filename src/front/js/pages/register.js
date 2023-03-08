import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Context } from "../store/appContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

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

  const [emailConfirmed, setEmailConfirmed] = useState(null);

  const [universities, setUniversities] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchUniversities = async () => {
      const response = await fetch(
        `https://api.data.gov/ed/collegescorecard/v1/schools.json?fields=school.name&school.name=${inputValue}&api_key=Dced9mxZyLP3S4hFeCtmTceVtEDBc2ztpeflkVqE`
      );
      const data = await response.json();
      setUniversities(
        data.results.map((element) => ({
          value: element["school.name"],
          label: element["school.name"],
          name: element["school.name"],
        }))
      );
    };
    fetchUniversities();
  }, [inputValue]);

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };
  const handleChange = (choice) => {
    setUniversity(choice.target.value);
    // const name = choice.name || "university";
    // const field = get(name);
    // field.setUniversity(name);
  };

  const { store, actions } = useContext(Context);
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

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    actions.verifyEmail(data.email).then((resp) => {
      console.log(resp); // {format: true, domain: 'email.com', disposable: false, dns: true}
      if (resp.format == true && resp.disposable == false && resp.dns == true) {
        setEmailConfirmed(true);
        actions
          .register(
            data.firstname,
            data.lastname,
            data.username,
            data.email,
            data.fieldOfStudy,
            data.university,
            data.userType,
            data.password
          )
          .then(() => navigate("/verified"));
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
        <select
          className="form-select"
          defaultValue="choose"
          onChange={(e) => setUserType(e.target.value)}
          {...register("userType")}
        >
          <option value="choose">Choose User Type</option>
          <option value="undergrad">Undergraduate Student</option>
          <option value="grad">Graduate Student</option>
          <option value="post-doc">Post-doc</option>
          <option value="professor">Professor/Scientist</option>
        </select>
        <Select
          options={universities}
          onInputChange={handleInputChange}
          onChange={handleChange}
          name="university"
          placeholder="Search for a university"
          {...register("university")}
        />
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
        <input type="submit"></input>
      </form>
      <Link to="/">
        <button className="btn btn-primary">Back home</button>
      </Link>
    </div>
  );
};
