import React, { useEffect } from "react";
import axios from "axios";
import { Box, Grid, Typography } from "@mui/material";

import PlaylistList from "./PlaylistList";
import ErrorMessage from "./ErrorMessage";
import OverallStatItemCard from "./analysisPageComponents/OverallStatItemCard";

const PlaylistContainer = ({ selectPlaylist }) => {
    const [playlists, setPlaylists] = React.useState([]);
    const [userShuffleCounter, setUserShuffleCounter] = React.useState(false);
    const [error, setError] = React.useState(false);

    const getPlaylistsCall = () => {
        axios
            .get(process.env.REACT_APP_BACKEND_PATH + `/api/playlist/me?include-stats=true`, { withCredentials: true })
            .then((result) => {
                setPlaylists(result.data.all_playlists);
                if ("user_shuffle_counter" in result.data) {
                    setUserShuffleCounter(result.data.user_shuffle_counter);
                }
                setError(false);
            })
            .catch((responseError) => {
                if (responseError && responseError.response && responseError.response.status === 401) {
                    setError({ message: "Unable to authenticate your account, please logout and try again" });
                } else {
                    setError({ message: "Unable to connect to Spotify, please try again later" });
                }
            });
    };

    useEffect(() => {
        getPlaylistsCall();
    }, []);

    return (
        <Box sx={{ paddingBottom: "10px" }}>
            {error !== false ? (
                <ErrorMessage error={error} isGeneric={false} />
            ) : playlists.length > 0 ? (
                <Box>
                    {userShuffleCounter !== false ?
                        <Grid
                            sx={{
                                margin: { sm: "auto", md: "0 auto", },
                                maxWidth: "600px"
                            }}
                            container
                            spacing={3}
                            justifyContent="center"
                            alignItems="flex-start"
                        >
                            <OverallStatItemCard title={"Playlists"} stat={userShuffleCounter.playlist_count} description={"Total number of playlists you've shuffled using True Shuffle"} />
                            <OverallStatItemCard title={"Tracks"} stat={userShuffleCounter.track_count} description={"Total number of tracks you've shuffled using True Shuffle"} />
                        </Grid>
                        :
                        <Box></Box>
                    }
                    <Typography variant='h4' component="div" sx={{ paddingTop: "30px", color: "white" }}>Select a playlist</Typography>
                    <PlaylistList playlists={playlists} selectPlaylist={selectPlaylist} />
                </Box>
            ) : (
                <Box>
                    <Typography variant='h4' component="div" sx={{ paddingTop: "30px", color: "white" }}>Select a playlist</Typography>
                    <PlaylistList loading={true} />
                </Box>
            )}
        </Box>
    );
};

export default PlaylistContainer;
