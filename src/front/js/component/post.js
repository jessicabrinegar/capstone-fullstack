import React, { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../store/appContext";
import { BookmarkIcon } from "./bookmark_icon";
import { UserPicture } from "./user_picture";
import UniversityIcon from "../../img/icons8-university-30.png";

export const Post = ({ post_id, fos, type, title, content }) => {
  const { store, actions } = useContext(Context);

  const user = useMemo(() => {
    if (!store) return null;
    else return store.user;
  });

  const handleSetBookmark = () => {
    const userID = user.id;
    actions.createBookmark(userID, post_id).then((resp) => {
      console.log(resp);
    });
  };

  const styles = {
    profileImage: {
      height: "4rem",
      borderRadius: "50%",
    },
    button: {
      border: "none",
      background: "none",
    },
  };

  if (!user) return null;
  return (
    <div className="card w-75" style={{ width: 1 + "rem" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <UserPicture userID={user.id} imageStyles={styles.profileImage} />
            <div className="ms-2 text-center">
              <div>{user.firstname + " " + user.lastname}</div>
              <div>{user.username}</div>
            </div>
          </div>
          <button
            onClick={handleSetBookmark}
            style={styles.button}
            className="ms-5"
          >
            <BookmarkIcon />
          </button>
        </div>
        <div className="d-flex">
          <img src={UniversityIcon} />
          <div className="ms-2">{user.university}</div>
        </div>
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
