import React, { useState, useEffect } from "react";

export const UserPicture = ({ userID }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    fetch(process.env.BACKEND_URL + `/api/user/${userID}/profile_picture`)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Profile picture not found.");
        }
      })
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setProfilePicture(imageUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userID]);
  if (!profilePicture) return null;

  const styles = {
    image: {
      height: "10rem",
      borderRadius: "50%",
    },
  };

  return (
    <div>
      {profilePicture && (
        <img src={profilePicture} alt="Profile Picture" style={styles.image} />
      )}
    </div>
  );
};
