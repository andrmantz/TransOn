import React, { useState, useEffect } from "react";
// import "../App.css";
import { useField } from "formik";
import { TextField } from "@mui/material";
const hasError = (meta, submitted) => {
  return meta.error && (meta.touched || submitted);
};

const TextInput = ({ label, big, ...props }) => {
  const [field, meta] = useField(props);
  const [submitted, setSubmitted] = useState(Boolean(props.submitted));

  useEffect(() => {
    setSubmitted(Boolean(props.submitted));
  }, [props.submitted]);

  useEffect(() => {
    props.setErrors(Boolean(meta.error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.error]);

  const { setErrors, ...otherProps } = props;

  return (
    <div className="input-container">
      <TextField
        {...field}
        {...otherProps}
        error={hasError(meta, submitted)}
        label={hasError(meta, submitted) ? meta.error : field.name}
        style={{ margin: "10px 0px", "textAlign": "center" }}
        multiline={big === true}
        rows={big ? 5 : 1}
        fullWidth
      />
    </div>
  );
};

export default TextInput;
