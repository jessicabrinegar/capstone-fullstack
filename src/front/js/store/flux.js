// import { getCacheDir } from "gh-pages";
import { get } from "react-hook-form";
import { Navigate } from "react-router-dom";

const registerURL = process.env.BACKEND_URL + "/api/register";
const loginURL = process.env.BACKEND_URL + "/api/token";
const postPostURL = process.env.BACKEND_URL + "/api/post";
const getAllPostsURL = process.env.BACKEND_URL + "/api/posts";
const createBookmarkURL = process.env.BACKEND_URL + "/api/bookmark";
const getBookmarksURL = process.env.BACKEND_URL + "/api/bookmark/";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      registered: false,
      user: null,
      token: null,
      bookmarks: null,
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },
      // VERIFY EMAIL
      verifyEmail: async (email) => {
        const opts = {
          method: "GET",
        };
        try {
          const resp = await fetch(
            `https://disify.com/api/email/${email}`,
            opts
          );
          const data = await resp.json();
          return data;
        } catch {
          (error) => console.log(error);
        }
      },
      // REGISTER USER
      register: async (
        firstname,
        lastname,
        username,
        email,
        fieldOfStudy,
        university,
        userType,
        password
      ) => {
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            field_of_study: fieldOfStudy,
            university: university,
            user_type: userType,
            password: password,
          }),
        };
        try {
          const resp = await fetch(registerURL, opts);
          if (resp.status !== 200) {
            alert("There has been an error in registering.");
            return false;
          }
          const data = await resp.json();
          console.log(data);
          return data;
        } catch {
          (error) => console.log(error);
        }
      },
      // GET A USER BY USERNAME
      getUser: async (username) => {
        const accessToken = localStorage.getItem("token");
        const opts = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + `/api/user/${username}`,
            opts
          );
          if (resp.status !== 200) {
            alert("There has been an error in fetching user by username.");
            return false;
          }
          const data = await resp.json();
          console.log("User data from the backend: ", data);
          return data;
        } catch {
          (error) => console.log(error);
        }
      },
      // GET A USER BY ID
      getUserByID: async (user_id) => {
        const accessToken = localStorage.getItem("token");
        const opts = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + `/api/user/${user_id}`,
            opts
          );
          if (resp.status !== 200) {
            alert("There has been an error in fetching user by ID.");
            return false;
          }
          const data = await resp.json();
          return data;
        } catch {
          (error) => console.log(error);
        }
      },
      // LOGIN / CREATE ACCESS_TOKEN
      login: async (username, password) => {
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        };
        try {
          const resp = await fetch(loginURL, opts);
          if (resp.status !== 200) {
            return false;
          }
          const data = await resp.json();
          console.log("Data from the backend: ", data);
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setStore({
            token: data.access_token,
            user: data.user,
          });
          return data;
        } catch {
          (error) => console.log(error);
        }
      },
      // LOGOUT
      logout: async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setStore({ token: null, user: null });
      },
      // CREATE POST
      createPost: async (author_id, content, fieldOfStudy, postType, title) => {
        const accessToken = localStorage.getItem("token");
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            author_id: author_id,
            content: content,
            field_of_study: fieldOfStudy,
            post_type: postType,
            title: title,
          }),
        };
        try {
          const resp = await fetch(postPostURL, opts);
          if (resp.status !== 200) {
            console.log("There has been an error in creating a post.");
            return false;
          }
          return true;
        } catch {
          (error) => console.log(error);
        }
      },
      // GET ALL POSTS
      getAllPosts: async () => {
        const accessToken = localStorage.getItem("token");
        const opts = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        try {
          const resp = await fetch(getAllPostsURL, opts);
          if (resp.status !== 200) {
            console.log("There has been an error in fetching all post data");
            return false;
          }
          const data = await resp.json();
          return data;
        } catch {
          (error) => console.log(error);
        }
      },
      // GET ALL POSTS BY USER
      getUserPosts: async (user_id) => {
        const accessToken = localStorage.getItem("token");
        const opts = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL + `/api/user/${user_id}/posts`,
            opts
          );
          if (resp.status !== 200) {
            console.log("There has been an error in fetching all post data");
            return false;
          }
          const data = await resp.json();
          return data;
        } catch {
          (error) => console.log(error);
        }
      },
      // CREATE BOOKMARK
      createBookmark: async (user_id, post_id) => {
        const accessToken = localStorage.getItem("token");
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user_id: user_id,
            post_id: post_id,
          }),
        };
        try {
          const resp = await fetch(createBookmarkURL, opts);
          if (resp.status !== 200) {
            console.log("There has been an error in posting a bookmark");
            return false;
          }
          const data = await resp.json();
          return data;
        } catch {
          (error) => console.log(error);
        }
      },
      // GET ALL BOOKMARKS BY USER
      getBookmarks: async (user_id, signal) => {
        const accessToken = localStorage.getItem("token");
        const opts = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          signal: signal,
        };
        try {
          const resp = await fetch(getBookmarksURL + user_id, opts);
          if (resp.status !== 200) {
            console.log("There has been an error in fetching bookmarks.");
            return false;
          }
          const data = await resp.json();
          // console.log(data);
          // localStorage.setItem("bookmarks", JSON.stringify(data));
          return data;
        } catch {
          (error) => console.log(error);
        }
      },
      // DELETE BOOKMARK
      deleteBookmark: async (user_id, post_id) => {
        const accessToken = localStorage.getItem("token");
        const opts = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        try {
          const resp = await fetch(
            process.env.BACKEND_URL +
              `/api/delete-bookmark/${user_id}/${post_id}`,
            opts
          );
          if (resp.status != 200) {
            console.log("There has been an error in deleting the bookmark.");
            return false;
          }
          const data = await resp.json();
          return data;
        } catch {
          (error) => console.log(error);
        }
      },
      // SYNC LOCAL STORAGE TO STORE ON RELOAD
      syncFromLocalStore: () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        // const bookmarks = localStorage.getItem("bookmarks");
        // const bookmarksParsed = JSON.parse(bookmarks);
        if (token && user) {
          const userData = JSON.parse(user);
          setStore({
            token: token,
            user: userData,
            // bookmarks: bookmarks,
          });
        }
      },
    },
  };
};

export default getState;
