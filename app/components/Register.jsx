import React, { useState, useEffect } from "react";
import TextInput from "./TextInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Alert } from "@mui/material";
import { whoAmI, signup } from "./api";
import DefaultErrorPage from 'next/error';

import styles from "../styles/Home.module.css"

const email_regexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const username_regexp = /[\t\r\n]|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*)\*\/)/gi

const validationSchema = Yup.object({
  username: Yup.string()
    .max(20, "Must be at most 20 characters")
    .test({
      name: "regex validator",
      test: function (value) {
        if (value && value.match(username_regexp)) {
          return this.createError({
            message: "I saw what you did there bastard",
          });
        }
        else {
          return true;
        }
      },
    })
    .required("Username is required"),
  email: Yup.string()
    .matches(email_regexp, {
      message: "Invalid email address",
      excludeEmptyStrings: true
    })
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Password is required"),
  confirmation: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Password and Confirmation do not match")
    .required("Confirmation is required")
});

function Register() {
  const [submitted, setSubmitted] = useState(false);
  const [usernameErrors, setUsernameErrors] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState(false);
  const [confirmationErrors, setConfirmationErrors] = useState(false);
  const [emailErrors, setEmailErrors] = useState(false);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const userObj = whoAmI();
    if (userObj) {
      setUser(userObj);
    }
  }, []);

  const submit = (values) => {
    const { username, email, password } = values;
    signup(username, email, password)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        setErrorMessage(null);
        setMessage("Created account successfully!");
        setTimeout(() => { window.location.href = process.env.basepath }, 500);

      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
      }
      )

  };

  if (user) {
    // redirect to home
    window.location.href = "/"
  }

  return (
    <div className="App">

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmation: ""
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          submit(values);
        }}
      >
        <Form className={styles.pepe}>
          <h2 style={{ "margin": "50px" }}>Sign up</h2>
          {errorMessage &&
            <Alert severity="error">{errorMessage}</Alert>}
          {message &&
            <Alert severity="success">{message}</Alert>}
          <TextInput
            name="username"
            type="text"
            placeholder="Your username..."
            submitted={submitted}
            setErrors={setUsernameErrors}
          />
          <TextInput
            name="email"
            type="email"
            placeholder="Your email..."
            submitted={submitted}
            setErrors={setEmailErrors}
          />
          <TextInput
            name="password"
            type="password"
            placeholder="Your password..."
            submitted={submitted}
            setErrors={setPasswordErrors}
          />
          <TextInput
            name="confirmation"
            type="password"
            placeholder="Your confirmation..."
            submitted={submitted}
            setErrors={setConfirmationErrors}
          />
          <div style={{ "margin": "30px" }}>
            <Button
              type="submit"
              variant="outlined"
              disabled={
                usernameErrors ||
                emailErrors ||
                passwordErrors ||
                confirmationErrors
              }
            >
              Submit
            </Button>
            <Button type="reset" color="error">
              Clear
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Register;
