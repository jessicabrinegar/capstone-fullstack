import React from "react";
import Logo from "../../img/n3logo.png";
import "../../styles/home.css";

export const Landing = () => {
  return (
    <div className="text-center w-100 mb-5 mx-0">
      <div className="col">
        <img src={Logo} />
      </div>
      <p>
        Stay up-to-date with the null results that are driving science forward.
        Sign up for free
      </p>
      <div className="row mt-5">
        <div className="col">
          <img src="https://via.placeholder.com/500x400" />
        </div>
        <div className="col d-flex align-items-center">
          <p>
            A statement about the importance of null results.. they have value
            and they deserve to be shared!
          </p>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col d-flex align-items-center">
          <p>
            A statement about the importance of replication.. we should be
            replicating studies more!
          </p>
        </div>
        <div className="col">
          <img src="https://via.placeholder.com/500x400" />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <img src="https://via.placeholder.com/500x400" />
        </div>
        <div className="col d-flex align-items-center">
          <p>
            A statement about the importance of interdisciplinary
            collaboration.. different fields need to be collaborating so that we
            come to a better understanding of how the world works by tying
            various theories in various fields together!
          </p>
        </div>
      </div>
    </div>
  );
};
