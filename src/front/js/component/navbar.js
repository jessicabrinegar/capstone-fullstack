import React, { useContext, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { store, actions } = useContext(Context);

  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout().then(() => navigate("/"));
  };

  // useEffect(() => {
  //   if (!store.token && store.token == "" && store.token == undefined) {
  //     navigate("/");
  //   }
  // }, [store.token]);

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">N3</span>
        </Link>
        {/* Conditionally render buttons based on if user is logged in or not */}
        <div className="ml-auto">
          <Link to="/myfeed">
            <button className="navbar-toggler ms-3" type="button">
              My Feed
            </button>
          </Link>
          <Link to="/collaborations">
            <button className="navbar-toggler ms-3" type="button">
              Collabs
            </button>
          </Link>
        </div>
        <div className="ml-auto">
          <Link to="/login">
            <button className="btn btn-primary">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-primary">Register</button>
          </Link>
          <Link to="/login">
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </Link>
        </div>
        <Outlet></Outlet>
      </div>
    </nav>
  );
};
