import React from "react";
import { Redirect } from "react-router-dom";

const withAuth = (Component) => {
  const AuthRoute = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return <Redirect to="/" />;
    }
    return <Component />;
  };
  return AuthRoute;
};

export default withAuth;
