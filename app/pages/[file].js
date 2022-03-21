import Layout from "../components/Layout";
import { get_from_link } from "../components/api";
import { useRouter } from "next/router";
import { useState } from "react";
import DefaultErrorPage from 'next/error';
import DownloadIcon from "@mui/icons-material/Download";
import { Button, Grid, Paper, Typography } from "@mui/material";


export default function File() {
    const [data, setData] = useState(null);

    const router = useRouter();
    const url = router.query.file;

    get_from_link(url)
        .then(response => {
            setData(response.data)

        })
        .catch(() => {
            console.log("nop")

        })


    if (!data) {
        return (
            <Layout>
                <DefaultErrorPage statusCode={404} />
            </Layout>
        )
    }


    return (
        <Layout>
            {data && (
                <Paper elevation={3} sx={{
                    padding: 2,
                    width: "500px",
                    margin: "130px auto",
                    Height: "200px"
                }}>
                    <Grid
                        container
                        justifyContent="center"
                        alignContent="space-between"
                        height={1}
                        width={1}
                    >
                        <Grid item xs={12}>
                            <Grid container justifyContent="center">
                                <Button
                                    sx={{ textTransform: "none" }}
                                    endIcon={<DownloadIcon />}
                                    href={
                                        "/download?u=" + url
                                    }
                                >
                                    <Typography variant="body1">{data.file}</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" align="center">
                                Size: {data.size}
                            </Typography>
                        </Grid>
                    </Grid></Paper>
            )}

        </Layout>
    );
}
