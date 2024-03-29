import React from 'react';
import { Typography, Box } from '@mui/material';
import MuiLink from '@mui/material/Link';
import { Link } from "react-router-dom";

function Footer(props) {
    return (
        <footer>
            <Box sx={{ paddingTop: "20px" }}>
                <Typography sx={{ color: "lightgrey" }} variant="caption" component="div">
                    <Link className="footer-links" to="/">True Shuffe for Spotify</Link>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <Link className="footer-links" to="/shuffle">Shuffle</Link>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <Link className="footer-links" to="/faq">FAQ</Link>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <Link className="footer-links" to="/about">About</Link>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <MuiLink sx={{ color: "lightgrey" }} variant="caption" underline="none" href={"mailto:" + process.env.REACT_APP_CONTACT_EMAIL_ADDRESS}>Contact</MuiLink>
                </Typography>
                <Typography sx={{ color: "lightgrey", paddingBottom: "5px" }} variant="caption" component="div">
                    All images belong to their rightful owners
                </Typography>
            </Box>
        </footer>
    );
};

export default Footer;