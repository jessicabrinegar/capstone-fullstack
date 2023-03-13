import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, Outlet } from "react-router-dom";
import { Post } from "../component/post.js";

export const Collabs = () => {
  const { store, actions } = useContext(Context);
  const [collabs, setCollabs] = useState([]);

  const getAllPosts = () => {
    actions.getAllPosts().then((resp) => {
      const collaborations = resp.filter(
        (elem) => elem.post_type == "Collaboration Request"
      );
      setCollabs(collaborations);
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <div>
      This is the Collabs page
      {collabs.map((post) => (
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
  );
};
