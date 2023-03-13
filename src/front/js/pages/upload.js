import React, { useState } from "react";

export const Upload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Use the `FormData` object to send the file to the server
    const formData = new FormData();
    formData.append("file", file);

    // Use `fetch` or your favorite HTTP library to send the form data to the server
    fetch(process.env.BACKEND_URL + "/api/user/1/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
};
