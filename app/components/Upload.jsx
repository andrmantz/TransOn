import React, { useState, useEffect } from "react";

import { upload, whoAmI } from "./api";
import { Paper, Grid, IconButton, Input, Tooltip, Typography, Button, Dialog, DialogContent, Snackbar, Alert, Slide } from "@mui/material";
import { Clear, ContentCopy, AddCircle, Upload } from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';
function UploadPage() {

    const [submitted, setSubmitted] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [url, setUrl] = useState(null);
    const [user, setUser] = useState(null);
    const [snackContent, setSnackContent] = useState(null);
    const [loading, setLoading] = useState(null);

    const handleClose = () => setIsModalOpen(false);
    const handleShow = () => setIsModalOpen(true);

    const closeSnack = () => {
        setSnackContent(null);
    };



    function TransitionUp(props) {
        return <Slide {...props} direction="up" />;
    }


    useEffect(() => {
        const userObj = whoAmI();
        if (userObj) {
            setUser(userObj);
        }
    }, []);

    const submit = (event) => {
        event.preventDefault();
        setLoading(true);

        const input = submitted;
        console.log(submitted)
        let file = null;
        if (input.files.length) {
            file = input.files[0];
        }

        if (!user && file.size > 52428800) {
            setSnackContent({
                text: "File size limit exceeded. Create a free account to send larger files!",
                severity: "error"
            });
            setLoading(false);
            return;

        }

        upload(file, file.name, file.type)
            .then(response => {
                setUrl(window.location.protocol + '//' + window.location.host + '/' + window.location.pathname.split('/')[1] + '/' + response.data.url);
                handleShow();
                setLoading(false);

            })
            .catch((error) => {
                if (error.response.status == 500) {
                    <Layout>
                        <DefaultErrorPage statusCode={500} />
                    </Layout>
                }

                if (error.response.status == 413) {
                    setSnackContent({
                        text: "File is too large for us to handle!",
                        severity: "error"
                    });
                }
                setLoading(false);
            })
    }

    const copy = (event) => {
        event.preventDefault();
        setSnackContent({
            text: "Copied to clipboard"
        });
        navigator.clipboard.writeText(url);

    }
    return (
        <>
            <Paper
                elevation={3}
                sx={{
                    padding: 2,
                    width: "500px",
                    margin: "130px auto",
                    height: "200px"
                }}
            >
                <Grid
                    container
                    justifyContent="center"
                    alignItems="space-between"
                    height={1}
                    width={1}
                >
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="center">
                            {!submitted && (
                                <label htmlFor="file" style={{ fontSize: 20 }}>
                                    <Input
                                        accept="*"
                                        id="file"
                                        type="file"
                                        sx={{ display: "none" }}
                                        onChange={(e) =>
                                            setSubmitted(document.getElementById("file"))
                                        }
                                    />
                                    <Tooltip arrow title="Upload Files" fontSize="large">
                                        <IconButton component="span">
                                            <AddCircle sx={{ fontSize: 80 }} />
                                        </IconButton>
                                    </Tooltip>
                                    Choose Files
                                </label>
                            )}
                            {submitted && (
                                <>
                                    <Grid item>
                                        <Typography variant="h6">
                                            {submitted.files[0].name || setSubmitted(null)}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <IconButton
                                            component="span"
                                            size="small"
                                            onClick={(e) => setSubmitted(null)}
                                        >
                                            <Clear />
                                        </IconButton>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid
                            container
                            height={1}
                            justifyContent="center"
                            alignContent="flex-end"
                        >
                            <LoadingButton
                                onClick={submit}
                                variant="outlined"
                                endIcon={<Upload />}
                                disabled={!submitted}
                                loading={loading}
                                loadingPosition="end"
                            >
                                Upload
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <Dialog open={isModalOpen} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogContent
                    style={{ fontSize: 18, textAlign: "left", float: "left" }}
                >
                    <Button
                        href={url}
                        style={{
                            textTransform: "none",
                            color: "black",
                            fontSize: 18,
                            textAlign: "left",
                            backgroundColor: "transparent"
                        }}
                    >
                        {url}
                    </Button>
                    <IconButton
                        onClick={copy}
                        component="span"
                        style={{ float: "right" }}
                    >
                        <ContentCopy />
                    </IconButton>
                </DialogContent>
            </Dialog>
            {snackContent && (
                <Snackbar
                    open={true}
                    autoHideDuration={4000}
                    onClose={closeSnack}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    TransitionComponent={TransitionUp}
                >
                    <Alert
                        onClose={closeSnack}
                        severity={snackContent?.severity || "info"}
                    >
                        {snackContent?.text}
                    </Alert>
                </Snackbar>
            )}
        </>
    );
}

export default UploadPage;