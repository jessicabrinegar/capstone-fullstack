import React, { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../store/appContext";
import { Post } from "../component/post.js";
import { UserPicture } from "../component/user_picture.js";

export const UserProfile = () => {
  const { store, actions } = useContext(Context);
  const [posts, setPosts] = useState([]);

  const user = useMemo(() => {
    if (!store) return null;
    else return store.user;
  });

  const getUserPosts = () => {
    const user_id = user.id;
    actions.getUserPosts(user_id).then((resp) => {
      setPosts(resp);
    });
  };

  useEffect(() => {
    if (user) {
      getUserPosts();
    }
  }, [user]);

  const styles = {
    profileImage: {
      height: "10rem",
      borderRadius: "50%",
    },
  };

  if (!user) return null;
  return (
    <div>
      <UserPicture userID={user.id} imageStyles={styles.profileImage} />
      <div>{user.firstname + " " + user.lastname}</div>
      <div>{user.username}</div>
      <div>{user.university}</div>
      <div>{user.field_of_study}</div>
      <div>{user.user_type}</div>
      <div>
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
