import React, {useEffect} from "react"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SpotifyLogin from "./SpotifyLogin";
import SpotifyLogout from "./SpotifyLogout";

const pages = [
  {
    "title": "Shuffle",
    "link": "/playlists"
  },
  {
    "title": "Contact",
    "link": "/contact"
  }
];

const Header = ({loginUri, isAuth}) => {
  const [auth, setAuth] = React.useState(localStorage.getItem("accessToken") != null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    setAuth(isAuth);
  }, [loginUri, isAuth]);

  return (
    <AppBar position="static" sx={{ bgcolor: "#161817" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ShuffleIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {xs: 'none', md: 'flex'},
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TRUE SHUFFLE
          </Typography>
          <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={handleCloseNavMenu}
                variant="contained"
                disableElevation
                sx={{my: 2, color: 'white', display: 'block', bgcolor: "#161817",
                  '&:hover': {backgroundColor: '#1DB954'}
                }}
                href={page.link}
              >
                {page.title}
              </Button>
            ))}
          </Box>
          <Box sx={{flexGrow: 0}}>
            {auth ?
              <SpotifyLogout/>
              :
              <SpotifyLogin loginUri={loginUri}/>
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header