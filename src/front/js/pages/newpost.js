import React, { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const postTypeOptions = [
  { value: "Null Results", label: "Null Results" },
  { value: "Collaboration Request", label: "Collaboration Request" },
  { value: "Replication Request", label: "Replication Request" },
  { value: "General Update", label: "General Update" },
];

export const CreateNewPost = () => {
  const { store, actions } = useContext(Context);

  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState("");
  const [content, setContent] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [fieldInputValue, setFieldInputValue] = useState("");
  const [fieldsData, setFieldsData] = useState([]);

  const author = useMemo(() => {
    if (!store) return null;
    else return store.user;
  });
  // useEffect(() => {
  //   if (store) {
  //     console.log("Store.user.id from createNewPost component: ", author);
  //   }
  // }, [store, author]);

  const navigate = useNavigate();

  const handleFieldChange = (newValue) => {
    setFieldInputValue(newValue);
  };

  useEffect(() => {
    const fetchFieldsOfStudy = async () => {
      const opts = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
      const response = await fetch(
        process.env.BACKEND_URL + `/api/find-field?query=${fieldInputValue}`,
        opts
      );
      const data = await response.json();
      setFieldsData(
        data.map((element) => ({
          value: element["field"].toLowerCase(),
          label: element["field"].toLowerCase(),
        }))
      );
    };
    if (store) fetchFieldsOfStudy();
  }, [store, fieldInputValue]);

  const handleSubmit = () => {
    const author = store.user.id;
    if (!fieldOfStudy) {
      fieldOfStudy = fieldOfStudy;
    }
    actions
      .createPost(author, content, fieldOfStudy, postType, title)
      .then((resp) => {
        if (resp) {
          navigate("/myfeed");
        } else {
          setTitle("");
          setPostType("");
          alert("There has been an error.");
        }
      });
  };
  if (!author) return null;
  return (
    <div className="text-center mt-5">
      <h1>Create New Post</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <Select
          required
          options={postTypeOptions}
          placeholder="Choose a post type"
          name="postType"
          onChange={(selectedOption) => {
            setPostType(selectedOption.value);
          }}
        />
        <input
          type="text"
          placeholder="Type your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></input>
        <Select
          required
          defaultValue={author.field_of_study}
          options={fieldsData}
          onInputChange={handleFieldChange}
          placeholder="Search for a field of study"
          name="fieldOfStudy"
          onChange={(selectedOption) => {
            setFieldOfStudy(selectedOption?.value);
          }}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};
