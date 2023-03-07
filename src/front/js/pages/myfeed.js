import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, Outlet } from "react-router-dom";
import { Post } from "../component/post.js";

export const MyFeed = () => {
  const { store, actions } = useContext(Context);
  const { posts, setPosts } = useState(null);

  const getAllPosts = () => {
    actions.getAllPosts().then((resp) => {
      console.log(resp);
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="d-flex justify-content-around">
      <div className="d-flex flex-column">
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
        <Post />
      </div>
    </div>
  );
};
