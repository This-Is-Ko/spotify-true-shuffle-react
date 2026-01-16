import React, { useEffect, useState } from "react";
import { Typography, Box, Card, CardContent, CardActions, Button, Grid, CircularProgress } from "@mui/material";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { getAllArticles } from "../utils/articleUtils";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const GuidesPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadArticles = async () => {
            try {
                setLoading(true);
                const allArticles = await getAllArticles();
                setArticles(allArticles);
            } catch (error) {
                console.error('Error loading articles:', error);
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Getting Started': '#1DB954',
            'Educational': '#1DB954',
            'Tips & Tricks': '#1DB954',
        };
        return colors[category] || '#1DB954';
    };

    return (
        <Box>
            <Helmet>
                <title>Guides & Articles | True Shuffle for Spotify</title>
                <meta name="description" content="Learn how to use True Shuffle for Spotify with helpful guides and articles. Discover tips, tricks, and best practices for shuffling your playlists." />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.trueshuffle.top/guides" />
                <meta property="og:title" content="Guides & Articles | True Shuffle for Spotify" />
                <meta property="og:description" content="Learn how to use True Shuffle for Spotify with helpful guides and articles. Discover tips, tricks, and best practices for shuffling your playlists." />
                <meta property="og:url" content="https://www.trueshuffle.top/guides" />
                <meta property="og:type" content="website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>

            <Typography 
                variant='h2' 
                component="div" 
                sx={{ 
                    paddingTop: "20px", 
                    color: "white", 
                    textAlign: "center" 
                }}
            >
                Guides & Articles
            </Typography>

            <Typography 
                variant='body1' 
                component="div" 
                sx={{ 
                    paddingTop: "10px",
                    paddingBottom: "30px",
                    color: "white", 
                    textAlign: "center",
                    maxWidth: "800px",
                    margin: "0 auto",
                    px: 2
                }}
            >
                Learn how to get the most out of True Shuffle for Spotify. Our guides will help you understand how the website works, master playlist shuffling, and discover tips for the best listening experience.
            </Typography>

            <Box sx={{ 
                paddingBottom: "20px",
                paddingTop: "20px",
                display: "flex",
                justifyContent: "center",
                width: "100%",
                px: 2
            }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                        <CircularProgress sx={{ color: '#1DB954' }} />
                    </Box>
                ) : (
                    <Grid
                        container
                        spacing={3}
                        sx={{
                            width: { xs: "100%", sm: "100%", md: "90%", lg: "80%", xl: "70%" },
                            maxWidth: "1200px",
                            margin: "0 auto"
                        }}
                    >
                        {articles.map((article) => (
                            <Grid item xs={12} sm={6} md={4} key={article.slug}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backgroundColor: '#181818',
                                        borderRadius: '5px',
                                        border: '1px solid #333',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                                            borderColor: '#1DB954'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: getCategoryColor(article.category),
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 1
                                                }}
                                            >
                                                {article.category || 'Guide'}
                                            </Typography>
                                        </Box>
                                        
                                        <Typography
                                            variant="h5"
                                            component="h3"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                marginBottom: 1.5,
                                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                            }}
                                        >
                                            {article.title}
                                        </Typography>
                                        
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'lightgrey',
                                                marginBottom: 2,
                                                flexGrow: 1,
                                                lineHeight: 1.6
                                            }}
                                        >
                                            {article.description}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 'auto' }}>
                                            {article.readingTime && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AccessTimeIcon sx={{ color: 'lightgrey', fontSize: '1rem' }} />
                                                    <Typography variant="caption" sx={{ color: 'lightgrey' }}>
                                                        {article.readingTime} min read
                                                    </Typography>
                                                </Box>
                                            )}
                                            {article.date && (
                                                <Typography variant="caption" sx={{ color: 'lightgrey', marginLeft: 'auto' }}>
                                                    {formatDate(article.date)}
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                    
                                    <CardActions sx={{ padding: 2, paddingTop: 0 }}>
                                        <Button
                                            component={Link}
                                            to={`/guides/${article.slug}`}
                                            variant="contained"
                                            sx={{
                                                bgcolor: '#1DB954',
                                                color: 'white',
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    bgcolor: '#1ed760'
                                                }
                                            }}
                                        >
                                            Read More
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            {!loading && articles.length === 0 && (
                <Box sx={{ textAlign: 'center', padding: 4 }}>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                        No articles available at the moment. Please check back later!
                    </Typography>
                </Box>
            )}

            <Footer />
        </Box>
    );
};

export default GuidesPage;
