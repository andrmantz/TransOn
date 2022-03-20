import React, { useState, useEffect } from "react";
import TextInput from "./TextInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { whoAmI, signin } from "./api";
import styles from "../styles/Home.module.css"


const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required")
});

function Register() {
  const [submitted, setSubmitted] = useState(false);
  const [usernameErrors, setUsernameErrors] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState(false);

  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const userObj = whoAmI();
    if (userObj) {
      setUser(userObj);
    }
  }, []);

  const submit = (values) => {
    const { username, password } = values;
    signin(username, password)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        window.location.href = process.env.basepath

      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
      }
      )

  };

  if (user) {
    // redirect to home
    return "Already logged in";
  }

  return (
    <div className="App">

      <Formik
        initialValues={{
          username: "",
          password: ""
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          submit(values);
        }}
      >
        <Form className={styles.pepe}>
          <h2 style={{ "margin": "50px" }}>Login</h2>
          {errorMessage &&
            <Alert severity="error">{errorMessage}</Alert>}

          <TextInput
            name="username"
            type="text"
            placeholder="Your username..."
            submitted={submitted}
            setErrors={setUsernameErrors}
          />
          <TextInput
            name="password"
            type="password"
            placeholder="Your password..."
            submitted={submitted}
            setErrors={setPasswordErrors}
          />

          <Button
            type="submit"
            variant="outlined"
            disabled={usernameErrors || passwordErrors}
          >
            Submit
          </Button>
          <Button type="reset" color="error">
            Clear
          </Button>
        </Form>
      </Formik>
    </div>
  );
}

export default Register;
