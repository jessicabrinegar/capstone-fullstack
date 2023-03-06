import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, Outlet } from "react-router-dom";

export const MyFeed = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="d-flex">
      <div>
        <div>
          <Link to="createpost">Create New Post</Link>
        </div>
        <div>
          <Link to="bookmarks">Bookmarks</Link>
        </div>
      </div>
      <Outlet></Outlet>
      <div>
        <p>This is the MyFeed page.</p>
      </div>
    </div>
  );
};
