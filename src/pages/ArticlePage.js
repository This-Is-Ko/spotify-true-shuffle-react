import React, { useEffect, useState } from "react";
import { Typography, Box, Card, Button, CircularProgress, Chip } from "@mui/material";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import MarkdownContent from "../components/guides/MarkdownContent";
import { getArticleBySlug } from "../utils/articleUtils";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ArticlePage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadArticle = async () => {
            try {
                setLoading(true);
                setError(null);
                const articleData = await getArticleBySlug(slug);
                setArticle(articleData);
            } catch (err) {
                console.error('Error loading article:', err);
                setError(err.message || 'Article not found');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            loadArticle();
        }
    }, [slug]);

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

    if (loading) {
        return (
            <Box>
                <Helmet>
                    <title>Loading... | True Shuffle for Spotify</title>
                </Helmet>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '400px' 
                }}>
                    <CircularProgress sx={{ color: '#1DB954' }} />
                </Box>
                <Footer />
            </Box>
        );
    }

    if (error || !article) {
        return (
            <Box>
                <Helmet>
                    <title>Article Not Found | True Shuffle for Spotify</title>
                </Helmet>
                <Box sx={{ 
                    padding: 4,
                    textAlign: 'center',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <Typography variant="h2" sx={{ color: 'white', marginBottom: 2 }}>
                        Article Not Found
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', marginBottom: 3 }}>
                        {error || 'The article you\'re looking for doesn\'t exist or has been removed.'}
                    </Typography>
                    <Button
                        component={Link}
                        to="/guides"
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            bgcolor: '#1DB954',
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#1ed760'
                            }
                        }}
                    >
                        Back to Guides
                    </Button>
                </Box>
                <Footer />
            </Box>
        );
    }

    const { frontmatter, content } = article;

    return (
        <Box>
            <Helmet>
                <title>{frontmatter.title} | True Shuffle for Spotify</title>
                <meta name="description" content={frontmatter.description} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://www.trueshuffle.top/guides/${slug}`} />
                <meta property="og:title" content={`${frontmatter.title} | True Shuffle for Spotify`} />
                <meta property="og:description" content={frontmatter.description} />
                <meta property="og:url" content={`https://www.trueshuffle.top/guides/${slug}`} />
                <meta property="og:type" content="article" />
                <meta name="article:published_time" content={frontmatter.date} />
                {frontmatter.category && (
                    <meta name="article:section" content={frontmatter.category} />
                )}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                
                {/* Schema.org Article structured data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": frontmatter.title,
                        "description": frontmatter.description,
                        "datePublished": frontmatter.date,
                        "author": {
                            "@type": "Organization",
                            "name": "True Shuffle for Spotify"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "True Shuffle for Spotify",
                            "url": "https://www.trueshuffle.top"
                        }
                    })}
                </script>
            </Helmet>

            <Box sx={{ 
                width: { xs: "90%", sm: "90%", md: "70%", lg: "60%", xl: "50%" }, 
                margin: "auto",
                paddingTop: "20px",
                paddingBottom: "20px"
            }}>
                {/* Back to Guides button */}
                <Button
                    component={Link}
                    to="/guides"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        color: '#1DB954',
                        marginBottom: 3,
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: 'rgba(29, 185, 84, 0.1)'
                        }
                    }}
                >
                    Back to Guides
                </Button>

                {/* Article Header */}
                <Card
                    sx={{
                        backgroundColor: '#181818',
                        borderRadius: '5px',
                        padding: 3,
                        marginBottom: 3,
                        border: '1px solid #333'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        {frontmatter.category && (
                            <Chip
                                label={frontmatter.category}
                                sx={{
                                    bgcolor: getCategoryColor(frontmatter.category),
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    height: '24px'
                                }}
                            />
                        )}
                    </Box>

                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            color: 'white',
                            marginBottom: 2,
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            fontWeight: 'bold'
                        }}
                    >
                        {frontmatter.title}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'lightgrey',
                            marginBottom: 2,
                            fontSize: '1.1rem',
                            lineHeight: 1.6
                        }}
                    >
                        {frontmatter.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        {frontmatter.date && (
                            <Typography variant="caption" sx={{ color: 'lightgrey' }}>
                                Published: {formatDate(frontmatter.date)}
                            </Typography>
                        )}
                        {frontmatter.readingTime && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon sx={{ color: 'lightgrey', fontSize: '1rem' }} />
                                <Typography variant="caption" sx={{ color: 'lightgrey' }}>
                                    {frontmatter.readingTime} min read
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Card>

                {/* Article Content */}
                <Card
                    sx={{
                        backgroundColor: '#181818',
                        borderRadius: '5px',
                        padding: { xs: 2, md: 4 },
                        marginBottom: 3,
                        border: '1px solid #333'
                    }}
                >
                    <MarkdownContent content={content} />
                </Card>

                {/* Back to Guides footer */}
                <Box sx={{ textAlign: 'center', marginTop: 4, marginBottom: 2 }}>
                    <Button
                        component={Link}
                        to="/guides"
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            bgcolor: '#1DB954',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            paddingX: 3,
                            paddingY: 1.5,
                            '&:hover': {
                                bgcolor: '#1ed760'
                            }
                        }}
                    >
                        Back to All Guides
                    </Button>
                </Box>
            </Box>

            <Footer />
        </Box>
    );
};

export default ArticlePage;
