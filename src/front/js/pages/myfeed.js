import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, Outlet } from "react-router-dom";
import { Post } from "../component/post.js";

export const MyFeed = () => {
  const { store, actions } = useContext(Context);
  const [posts, setPosts] = useState([]);

  const getAllPosts = () => {
    actions.getAllPosts().then((resp) => {
      setPosts(resp);
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="d-flex justify-content-around">
      <div className="d-flex flex-column">
        <div>
          <Link to="/createpost">Create New Post</Link>
        </div>
        <div>
          <Link to="/bookmarks">Bookmarks</Link>
        </div>
      </div>
      <Outlet></Outlet>
      <div>
        <p>This is the MyFeed page.</p>
        {posts.map((post) => (
          <Post
            key={post.id}
            post_id={post.id}
            author_id={post.author_id}
            content={post.content}
            fos={post.field_of_study}
            type={post.post_type}
            title={post.title}
          />
        ))}
      </div>
    </div>
  );
};
