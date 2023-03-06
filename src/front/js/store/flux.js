// import { getCacheDir } from "gh-pages";
import { Navigate } from "react-router-dom";

const registerURL =
  "https://3001-jessicabrin-capstoneful-tkbqih5kbhg.ws-eu89.gitpod.io/api/register";
const loginURL =
  "https://3001-jessicabrin-capstoneful-tkbqih5kbhg.ws-eu89.gitpod.io/api/token";
const privateURL =
  "https://3001-jessicabrin-capstoneful-tkbqih5kbhg.ws-eu89.gitpod.io/api/private";
const postPostURL =
  "https://3001-jessicabrin-capstoneful-tkbqih5kbhg.ws-eu89.gitpod.io/api/post";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      user: null,
      token: null,
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

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
          return data;
        } catch {
          (error) => console.log(error);
        }
      },

      getUser: async () => {
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
          const resp = await fetch(privateURL, opts);
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

      logout: async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("logout action called!");
      },

      syncTokenFromLocalStore: () => {
        const token = localStorage.getItem("token");
        if (token && token != "" && token != undefined) {
          setStore({ token: token });
        }
      },

      syncUserFromLocalStore: () => {
        const user = localStorage.getItem("user");
        if (user && user != "") {
          const userData = JSON.parse(user);
          setStore({ user: userData });
        }
      },

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

      // syncUserFromLocalStore: () => {
      //   const user = localStorage.getItem("user");
      //   if (user && user != "" && user != undefined) {
      //     setStore({ user: user });
      //   }
      // },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
    },
  };
};

export default getState;
