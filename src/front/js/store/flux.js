// import { getCacheDir } from "gh-pages";
import { Navigate } from "react-router-dom";

const registerURL = process.env.BACKEND_URL + "/api/register";
const loginURL = process.env.BACKEND_URL + "/api/token";
// const privateURL = process.env.BACKEND_URL + "/api/private";
const postPostURL = process.env.BACKEND_URL + "/api/post";
const getAllPostsURL = process.env.BACKEND_URL + "/api/posts";
const emailAPI_accessKey = "BQrnUUYUa37fqdqYL2xij6WIjrhrXY2S";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      registered: false,
      user: null,
      token: null,
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
          const data = await resp.json();
          setStore({ registered: true });
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
            process.env.BACKEND_URL + `/user/${username}`,
            opts
          );
          if (resp.status !== 200) {
            alert("There has been an error.");
            return false;
          }
          const data = await resp.json();
          console.log("User data from the backend: ", data);
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
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        };
        try {
          const resp = await fetch(loginURL, opts);
          if (resp.status !== 200) {
            alert("There has been an error.");
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
        console.log("logout action called!");
      },
      // SYNC TOKEN ON RELOAD
      syncTokenFromLocalStore: () => {
        const token = localStorage.getItem("token");
        if (token && token != "" && token != undefined) {
          setStore({ token: token });
        }
      },
      // SYNC USER DATA ON RELOAD
      syncUserFromLocalStore: () => {
        const user = localStorage.getItem("user");
        if (user && user != "") {
          const userData = JSON.parse(user);
          setStore({ user: userData });
        }
      },
      // CREATE POST
      createPost: async (author_id, content, fieldOfStudy, postType, title) => {
        const accessToken = localStorage.getItem("token");
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
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
            alert("There has been an error.");
            return false;
          }
          const data = await resp.json();
          console.log("Post data from the backend: ", data);
          // setStore({ posts: data });
          return data;
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
            // "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        try {
          const resp = await fetch(getAllPostsURL, opts);
          if (resp.status !== 200) {
            alert("There has been an error.");
            return false;
          }
          const data = await resp.json();
          console.log("All post data from the backend: ", data);
          // setStore({ posts: data });
          return data;
        } catch {
          (error) => console.log(error);
        }
      },
    },
  };
};

export default getState;
