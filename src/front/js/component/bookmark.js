import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useReducer,
} from "react";
import { Context } from "../store/appContext";
import { DeleteBookmarkIcon } from "./delete_bookmark_icon";

export const Bookmark = ({ post_id, fos, type, title, content }) => {
  const { store, actions } = useContext(Context);

  const user = useMemo(() => {
    if (!store) return null;
    else return store.user;
  });

  const handleDeleteBookmark = () => {
    const user_id = user.id;
    actions.deleteBookmark(user_id, post_id).then((resp) => {
      console.log(resp);
    });
  };

  if (!user) return null;

  return (
    <div className="card w-75" style={{ width: 1 + "rem" }}>
      <div className="card-body">
        <button onClick={handleDeleteBookmark}>
          <DeleteBookmarkIcon />
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
