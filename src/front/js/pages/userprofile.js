import React, { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../store/appContext";
import { Post } from "../component/post.js";
import { UserPicture } from "../component/user_picture.js";
import { UserIcon } from "../component/user_icon.js";
import UniversityIcon from "../../img/icons8-university-30.png";
import { BookIcon } from "../component/book_icon.js";
import { StudentIcon } from "../component/student_icon.js";

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
      <div className="d-flex">
        {/* <img src={StudyIcon} /> */}
        <p>{user.firstname + " " + user.lastname}</p>
      </div>
      <div className="d-flex">
        <UserIcon />
        <p>{user.username}</p>
      </div>
      <div className="d-flex">
        <img src={UniversityIcon} />
        <p>{user.university}</p>
      </div>
      <div className="d-flex">
        <BookIcon />
        <p>{user.field_of_study}</p>
      </div>
      <div className="d-flex">
        <StudentIcon />
        <p>{user.user_type}</p>
      </div>
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
