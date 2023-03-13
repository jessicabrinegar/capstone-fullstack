import React, { useContext, useMemo, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, Outlet } from "react-router-dom";
import { Bookmark } from "../component/bookmark";
import { Controller } from "react-hook-form";

export const Bookmarks = () => {
  const { store, actions } = useContext(Context);
  const [bookmarks, setBookmarks] = useState([]);

  const user = useMemo(() => {
    if (!store) return null;
    else return store.user;
  });

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    const getBookmarks = async () => {
      const userID = user.id;
      try {
        const response = await actions.getBookmarks(
          userID,
          abortController.signal
        );
        if (isMounted && response.length > 0) {
          setBookmarks(response);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          // request was cancelled
          return;
        }
      }
    };
    if (user) {
      getBookmarks();
    }
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [user, actions, bookmarks]);

  if (!user) return null;
  return (
    <div>
      This is the Bookmarks page.
      {bookmarks.map((post) => (
        <Bookmark
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
