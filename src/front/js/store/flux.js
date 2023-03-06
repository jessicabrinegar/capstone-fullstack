import { Navigate } from "react-router-dom";

const registerURL =
  "https://3001-jessicabrin-capstoneful-tkbqih5kbhg.ws-us89.gitpod.io/api/register";
const loginURL =
  "https://3001-jessicabrin-capstoneful-tkbqih5kbhg.ws-us89.gitpod.io/api/token";

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
          // this console log isnt happening
          // console.log("Data from the backend: ", data);
          localStorage.setItem("user", data);
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
          localStorage.setItem("token", data);
          setStore({ token: data });
          // setStore({user:...}) here
          return data;
        } catch {
          (error) => console.log(error);
        }
      },

      logout: async () => {
        localStorage.removeItem("token");
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
        if (user && user != "" && user != undefined) {
          setStore({ user: user });
        }
      },

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
