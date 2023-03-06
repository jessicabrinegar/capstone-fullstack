import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const CreateNewPost = () => {
  const { store, actions } = useContext(Context);

  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState("");
  const [content, setContent] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");

  const authorID = store.user.id;

  const navigate = useNavigate();

  const handleSubmit = () => {
    actions
      .createPost(authorID, content, fieldOfStudy, postType, title)
      .then(() => {
        if (store.token && store.token != "" && store.token != undefined) {
          navigate("/myfeed");
        } else {
          setTitle("");
          setPostType("");
        }
      });
  };

  return (
    <div className="text-center mt-5">
      <h1>Create New Post</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Post Type"
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Field of Study"
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
        ></input>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};
