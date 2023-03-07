import React, { useReducer } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "setAuthorImage":
      return { ...state, authorImage: null };
    case "setTitle":
      return { ...state, title: null };
    case "setPostType":
      return { ...state, postType: null };
    case "setContent":
      return { ...state, content: null };
    case "setFieldOfStudy":
      return { ...state, fieldOfStudy: null };
  }
};

const initialValues = {
  authorImage: null,
  title: null,
  postType: null,
  content: null,
  fieldOfStudy: null,
};

export const Post = () => {
  const [state, dispatch] = useReducer(reducer, initialValues);

  return (
    <div className="card w-75" style={{ width: 1 + "rem" }}>
      <div className="card-body">
        <h5 className="card-title">Post Title</h5>
        <h6 className="card-subtitle mb-2 text-muted">Post type</h6>
        <h6 className="card-subtitle mb-2 text-muted">Field of study</h6>
        <p className="card-text">
          Some quick example text to make up the content of the post... Here's
          the post content...
        </p>
        <a href="#" className="card-link">
          A link
        </a>
        <a href="#" className="card-link">
          Another link
        </a>
      </div>
    </div>
  );
};
