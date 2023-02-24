import React from "react";
import { Link, Outlet } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">N3</span>
        </Link>
        {/* Conditionally render MyFeed & Collab buttons based on if user is logged in */}
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
        </div>
        <Outlet></Outlet>
      </div>
    </nav>
  );
};
