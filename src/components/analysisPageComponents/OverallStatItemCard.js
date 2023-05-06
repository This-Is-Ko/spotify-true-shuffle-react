import React from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";

const OverallStatItemCard = ({ title, stat, description }) => {
    return (
        <Grid item>
            <Card sx={{
                textAlign: "left",
                backgroundColor: "#1DB954",
                borderRadius: "5px",
                height: "auto",
                maxHeight: "360px",
                width: "auto",
                maxWidth: "270px"
            }}>
                <CardContent>
                    <Typography sx={{ fontFamily: "'Questrial', sans-serif;" }} variant="subtitle1" color="text.secondary" gutterBottom>
                        <strong>{title}</strong>
                    </Typography>
                    {
                        stat.length > 9 ? 
                        <Typography sx={{ color: "white", textAlign: "center" }} variant="h4" component="div">
                            <strong>{stat}</strong>
                        </Typography>
                        : stat.length > 8 ?
                        <Typography sx={{ color: "white", textAlign: "center" }} variant="h3" component="div">
                            <strong>{stat}</strong>
                        </Typography>
                        : 
                        <Typography sx={{ color: "white", textAlign: "center" }} variant="h2" component="div">
                            <strong>{stat}</strong>
                        </Typography>
                    }
                    <Typography variant="body2" color="black">
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default OverallStatItemCard;