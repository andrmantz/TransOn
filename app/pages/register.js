import React, { useState, useEffect } from "react";

import Register from "../components/Register";
import { whoAmI } from "../components/api";
import Layout from "../components/Layout";
export default function Signup() {
  const [currPage, setCurrPage] = useState("login");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userObj = whoAmI();
    if (userObj) {
      setUser(userObj);
    }
  }, [currPage]);

  const redirectTo = (page) => {
    if (page === "logout") {
      localStorage.removeItem("token");
      window.location.reload();
    } else {
      setCurrPage(page);
    }
  };

  return (
    <Layout title={"Register"}>
      <Register />
    </Layout>
  );
}
