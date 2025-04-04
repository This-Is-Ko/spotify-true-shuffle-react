import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid2';
import { Typography, Button, Box, TextField, Stack, Paper } from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Helmet } from "react-helmet";
import HowToModal from '../components/howToComponents/HowToModal';
import { HowToShareLikedTracksEntry } from '../components/howToComponents/HowToEntries';

import LoadingMessage from "../components/LoadingMessage";

import { checkPageAccessAndRedirect } from "../utils/SpotifyAuthService";

const ShareLikedTracksPage = ({ isAuth, loginUri }) => {
    const [auth, setAuth] = useState(
        document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth'))
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [step, setStep] = useState(1);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistUri, setPlaylistUri] = useState("");
    const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
    
    const [createLikedPlaylistTaskId, setCreateLikedPlaylistTaskId] = useState("");
    const [createLikedPlaylistState, setCreateLikedPlaylistState] = useState("");
    const [attemptCount, setAttemptCount] = useState(0);
    const [createLikedPlaylistStateMessage, setCreateLikedPlaylistStateMessage] = useState("");
    const [polling, setPolling] = useState(true);

    const handleHowToModalOpen = () => setIsHowToModalOpen(true);
    const handleHowToModalClose = () => setIsHowToModalOpen(false);

    const POLLING_INTERVAL = 2500;

    useEffect(() => {
        setAuth(document.cookie.split(';').some(cookie => cookie.trim().startsWith('trueshuffle-auth')));
    }, [isAuth]);

    const postCreateLikedTracksPlaylistsCall = () => {
        // Call create liked tracks playlist
        setIsLoading(true);
        axios
            .post(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/share/liked-tracks`,
                { playlist_name: playlistName },
                { headers: { "Content-Type": "application/json" }, withCredentials: true })
            .then(result => {
                setCreateLikedPlaylistTaskId(result.data.create_liked_playlist_id);
                setError(false);
            })
            .catch((responseError) => {
                setIsLoading(false);
                setError(error.message);
                if (responseError && responseError.response && responseError.response.status === 401) {
                    setError({ message: "Unable to authenticate your account, please logout and try again" });
                } else {
                    setError({ message: "Unable to connect to Spotify, please try again later" });
                }
            });
    }
    

    const getCreateLikedTracksPlaylistsStateCall = () => {
        if (isLoading === true && createLikedPlaylistTaskId !== null && createLikedPlaylistTaskId !== "") {
            axios
                .get(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/share/liked-tracks/` + createLikedPlaylistTaskId, { withCredentials: true })
                .then(result => {
                    setCreateLikedPlaylistState(result.data.state);
                    if (result.data.state === "SUCCESS") {
                        setIsLoading(false);
                        if (result.data.result.status === "success") {
                            setPlaylistUri(result.data.result.playlist_uri);
                            setError(false);
                            setPolling(false);
                            setStep(3);
                        } else {
                            setError({ message: "Error while creating a playlist from your liked songs. Please try again later" });
                        }
                    } else if (result.data.state === "PROGRESS") {
                        setCreateLikedPlaylistStateMessage(result.data.progress.state);
                        if (attemptCount >= 40) {
                            setError({ message: "Error while creating a playlist from your liked songs. Please try again later" });
                            setPolling(false);
                        }
                    } else if (result.data.state === "FAILURE") {
                        setIsLoading(false);
                        setError({ message: "Error while creating a playlist from your liked songs. Please try again later" });
                        setPolling(false);
                    } else if (result.data.state === "PENDING") {
                        setAttemptCount(attemptCount + 1);
                        if (attemptCount >= 20) {
                            setError({ message: "Error while creating a playlist from your liked songs. Please try again later" });
                            setPolling(false);
                        }
                    }
                })
                .catch((responseError) => {
                    setIsLoading(false);
                    if (responseError && responseError.response && responseError.response.status === 401) {
                        setError({ message: "Unable to authenticate your account, please logout and try again" });
                    } else {
                        setError({ message: "Unable to connect to Spotify, please try again later" });
                    }
                });
        } else {
            setAttemptCount(attemptCount + 1);
            if (attemptCount >= 20) {
                setIsLoading(false);
                setError({ message: "Error while creating a playlist from your liked songs. Please try again later" });
            }
        }
    };


    useEffect(() => {
      // Only start polling if it's active (polling state is true)
      if (!polling || !createLikedPlaylistTaskId) return;

      const interval = setInterval(() => {
          getCreateLikedTracksPlaylistsStateCall();
        }, POLLING_INTERVAL);

      // Clean up interval on component unmount or when polling stops
      return () => clearInterval(interval);
  }, [createLikedPlaylistTaskId, polling]);
  

    const copyToClipboard = () => {
        if (playlistUri !== "") {
            navigator.clipboard.writeText(playlistUri);
            alert("Link copied to clipboard");
        }
    }

    const handlePlaylistNameChange = (e) => {
        setPlaylistName(e.target.value);
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        setStep(2);
        setIsLoading(true);
        postCreateLikedTracksPlaylistsCall();
    };

    const handleRetry = async () => {
        setStep(1);
        setError(false);
        setIsLoading(false);
    };

    const renderSwitch = (step) => {
        switch (step) {
            case 1:
                return (
                    <Box sx={{ display: "block" }}>
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                color: "white",
                                bgcolor: "#1DB954",
                            }}
                            onClick={handleNext}
                        >
                            Start
                        </Button>
                    </Box>
                );
            case 2:
                return (
                    <div>
                        {isLoading ? (
                            <div>
                                <CircularProgress />
                                <LoadingMessage message={createLikedPlaylistState === 'PROGRESS' ? createLikedPlaylistStateMessage : "Creating playlist from your liked tracks..."}/>
                            </div>
                            ) : (
                            <Box sx={{ width: '100%' }}>
                                <Stack spacing={1}>
                                    <Box>
                                        <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                                            Enter a playlist name or leave as default
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <TextField
                                            id="filled-basic"
                                            label="Playlist Name"
                                            variant="filled"
                                            defaultValue="My Liked Songs"
                                            onChange={handlePlaylistNameChange}
                                            inputProps={{ style: { color: "white" } }}
                                            sx={{
                                                "& .MuiFormLabel-root": {
                                                    color: 'white'
                                                },
                                                "& .MuiFormLabel-root.Mui-focused": {
                                                    color: 'white'
                                                },
                                                "& .MuiInputBase-root.Mui-disabled": {
                                                    color: "white"
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            disableElevation
                                            sx={{
                                                my: 1,
                                                color: "white",
                                                bgcolor: "#1DB954",
                                            }}
                                            onClick={handleSubmit}
                                        >
                                            Create
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>
                        )}
                    </div>
                );
            case 3:
                return (
                    <Box
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid
                        sx={{ width: "100%", margin: "auto" }}
                        container
                        spacing={1}
                        justifyContent="center">
                            <Grid item
                              xs={12} sm={6}
                              sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  margin: "0 auto",
                              }}
                            >
                                <Button
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        my: 2, color: 'white', bgcolor: "#1DB954",
                                        width: "30rem", maxWidth: "300px"
                                    }}
                                    href={playlistUri} target="_blank">
                                    Open shuffled playlist
                                </Button>
                            </Grid>
                            <Grid item
                              xs={12} sm={6}
                              sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  margin: "0 auto",
                              }}
                            >
                                <Button
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        my: 2, color: 'white', bgcolor: "#1DB954",
                                        width: "30rem", maxWidth: "300px"
                                    }}
                                    onClick={() => copyToClipboard()}
                                >
                                    Copy To Clipboard
                                </Button>
                            </Grid>
                        </Grid>
                        <Typography variant='subtitle1' component="div" sx={{ paddingBottom: "5px", color: "white" }}>
                            <strong>Successfully created your new playlist</strong>
                        </Typography>
                    </Box>
                );
            default:
                return null;
        }
    }

    // Validate page access and redirect to Spotify login if required
    if (auth === false) {
        return checkPageAccessAndRedirect(auth, loginUri, "/share")
    } else {
        return (
            <main>
                <Helmet>
                    <title>Share Liked Songs | True Shuffle for Spotify</title>
                    <meta name="description" content="Share your liked songs from Spotify with True Shuffle." />
                    <meta name="robots" content="index, follow" />
                    <link rel="canonical" href="https://www.trueshuffle.top/share-liked-songs" />
                    <meta property="og:title" content="Share Liked Songs | True Shuffle for Spotify" />
                    <meta property="og:description" content="Share your liked songs from Spotify with True Shuffle." />
                    <meta property="og:url" content="https://www.trueshuffle.top/share-liked-songs" />
                    <meta property="og:type" content="website" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Helmet>

                <Paper component={Stack} sx={{ height: "90vh", alignItems: "center", justifyContent: "center", boxShadow: "none", backgroundColor: "#292e2f" }}>
                    <Typography variant='h2' component="div" sx={{ paddingTop: "20px", color: "white" }}>Share</Typography>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        paddingTop: "10px",
                        color: "white",
                        textAlign: "center",
                        maxWidth: "90%",
                        margin: "0 auto"
                      }}
                    >
                      Easily share your Spotify library by creating a playlist containing all your liked songs
                    </Typography>
                    <Box sx={{
                        width: "90%",
                    }}>
                        <Box sx={{
                            textAlign: "center",
                            display: "flex",
                            justifyContent: "center",
                        }}>
                            <Button
                                variant="contained"
                                disableElevation
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                    bgcolor: "#1DB954",
                                }}
                                onClick={handleHowToModalOpen}
                            >
                                How to
                            </Button>
                        </Box>
                        <HowToModal isModalOpen={isHowToModalOpen} handleClose={handleHowToModalClose} steps={HowToShareLikedTracksEntry}></HowToModal>
                    </Box>
                    <Box>
                        {!error && renderSwitch(step)}
                    </Box>
                    {error &&
                        <Box>
                            {/* <ErrorMessage error={isError} /> */}
                            <Typography variant='body1' component="div" sx={{ paddingTop: "5px", color: "white" }}>
                                Something went wrong. Please try again later.
                            </Typography>
                            <Button
                                variant="contained"
                                disableElevation
                                sx={{
                                    my: 2,
                                    color: "white",
                                    bgcolor: "#1DB954",
                                }}
                                onClick={handleRetry}
                            >
                                Retry
                            </Button>
                        </Box>
                    }
                </Paper>
            </main>
        )
    }
};

export default ShareLikedTracksPage;
