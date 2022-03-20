import React, { useState, useEffect } from "react";

import Login from "../components/Login";
import Layout from "../components/Layout";
import { whoAmI } from "../components/api";

export default function App() {
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

  const renderMain = () => {
    return <Login />;
  };


  return (
    <Layout title={"Login"}>
      {renderMain()}
    </Layout>
  );
}
