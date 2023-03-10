import React, { useContext, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import NoTextLogo from "../../img/logo-no-text.png";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const [auth, setAuth] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout().then(() => navigate("/"));
    setAuth(false);
  };

  useEffect(() => {
    if (store.token && store.token != "") {
      setAuth(true);
    } else setAuth(false);
  }, [store.token]);

  return auth == true ? (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <div className="ml-auto">
          <div>Hello {store.user.firstname}</div>
        </div>
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
          <Link to="/myprofile">
            <button className="btn btn-primary">My Profile</button>
          </Link>
          <Link to="/">
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </Link>
        </div>
        <Outlet></Outlet>
      </div>
    </nav>
  ) : (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0">
            <img src={NoTextLogo} style={{ width: "2rem" }} />
          </span>
        </Link>
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
