import React from "react"

import Grid from '@mui/material/Grid';
import { Typography, Button } from "@mui/material";

const MainPageFeaturesItem = (props) => {
    return (
        <Grid item sx={{ width: "auto", maxWidth: "400px", textAlign: "left" }}>
            <img className={"featureIcon"}
                src={process.env.PUBLIC_URL + 'assets/icons/equalizer.png'} alt={"equalizer"} />
            <Typography variant='h4' component="div" sx={{ paddingTop: "20px", color: "white" }}>
                {props.feature.name}
            </Typography>
            <Typography variant='body1' component="div" sx={{ paddingTop: "10px", color: "white" }}>
                {props.feature.description}
            </Typography>
            <Button
                className={"normalButton"}
                variant="contained"
                disableElevation
                sx={{
                    my: 2, color: 'white', bgcolor: "#1DB954"
                }}
                href={props.feature.uri}
            >Select</Button>
        </Grid>
    );
}
export default MainPageFeaturesItem