import React from "react";
import { Link, Outlet } from "react-router-dom";

export const MyFeed = () => {
  return (
    <div>
      <p>This is the MyFeed page.</p>
      <div>
        <Link to="createpost">Create New Post</Link>
      </div>
      <div>
        <Link to="bookmarks">Bookmarks</Link>
      </div>
      <Outlet></Outlet>
    </div>
  );
};
