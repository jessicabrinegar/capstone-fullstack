import React, { useContext, useMemo, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, Outlet } from "react-router-dom";
import { Post } from "../component/post.js";

export const Bookmarks = () => {
  const { store, actions } = useContext(Context);
  const [bookmarks, setBookmarks] = useState([]);

  const user = useMemo(() => {
    if (!store) return null;
    else return store.user;
  });

  useEffect(() => {
    const getBookmarks = () => {
      const userID = user.id;
      actions.getBookmarks(userID).then((resp) => {
        setBookmarks(resp);
      });
    };
    if (user) {
      getBookmarks();
    }
  }, [user]);

  if (!user) return null;
  return (
    <div>
      This is the Bookmarks page.
      {bookmarks.map((post) => (
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
