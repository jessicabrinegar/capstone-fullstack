import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Landing } from "./pages/landing";
import { Register } from "./pages/register";
import injectContext from "./store/appContext";
import { Login } from "./pages/login";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { MyFeed } from "./pages/myfeed";
import { Collabs } from "./pages/collabs";
import { CreateNewPost } from "./pages/newpost";
import { Bookmarks } from "./pages/bookmarks";
import { UserProfile } from "./pages/userprofile";
import { Verified } from "./pages/verified";
import { Upload } from "./pages/upload.js";

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myfeed" element={<MyFeed />} />
          <Route path="/collaborations" element={<Collabs />} />
          <Route path="/createpost" element={<CreateNewPost />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          {/* <Route path="/profile/:user" element={<UserProfile />} /> */}
          <Route path="/myprofile" element={<UserProfile />} />
          <Route path="verified" element={<Verified />} />
          <Route path="/upload" element={<Upload />} />
          {/* <Route path="*" element={<Error />} /> */}
        </Routes>
        <Footer />
      </ScrollToTop>
    </BrowserRouter>
  );
};

export default injectContext(Layout);
