import React from "react";

export const Post = ({ id, author_id, fos, type, title, content }) => {
  return (
    <div className="card w-75" style={{ width: 1 + "rem" }}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{type}</h6>
        <h6 className="card-subtitle mb-2 text-muted">{fos}</h6>
        <p className="card-text">{content}</p>
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
