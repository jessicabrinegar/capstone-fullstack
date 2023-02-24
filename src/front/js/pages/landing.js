import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Landing = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="text-center w-100 mb-5">
      <div className="col">Null Not Nothing</div>
      <p>
        Here will be the overarching mission statement of the website... Place a
        mission statement here...{" "}
      </p>
      <div className="row">
        <div className="col">
          <img src="https://via.placeholder.com/200" />
        </div>
        <div className="col d-flex align-items-center">
          <p>
            A statement about the importance of null results.. they have value
            and they deserve to be shared!
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col d-flex align-items-center">
          <p>
            A statement about the importance of replication.. we should be
            replicating studies more!
          </p>
        </div>
        <div className="col">
          <img src="https://via.placeholder.com/200" />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <img src="https://via.placeholder.com/200" />
        </div>
        <div className="col d-flex align-items-center">
          <p>
            A statement about the importance of cross-field collaboration..
            different fields need to be collaborating so that we come to a
            better understanding of how the world works by tying various
            theories in various fields together!
          </p>
        </div>
      </div>
      <div className="alert alert-info mt-5">
        {store.message ||
          "Loading message from the backend (make sure your python backend is running)..."}
      </div>
    </div>
  );
};
