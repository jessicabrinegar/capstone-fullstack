import React, { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../store/appContext";
import { BookmarkIcon } from "./bookmark_icon";
import { DeleteBookmarkIcon } from "./delete_bookmark_icon";

export const Post = ({ post_id, fos, type, title, content }) => {
  const { store, actions } = useContext(Context);

  const handleSetBookmark = () => {
    const userID = user.id;
    actions.createBookmark(userID, post_id).then((resp) => {
      console.log(resp);
    });
  };

  return (
    <div className="card w-75" style={{ width: 1 + "rem" }}>
      <div className="card-body">
        <button onClick={handleSetBookmark}>
          <BookmarkIcon />
        </button>
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
