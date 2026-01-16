import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography, Link, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * Custom component for rendering Markdown content with Material-UI styling
 * Matches the site's dark theme and typography
 */
const MarkdownContent = ({ content }) => {
    const navigate = useNavigate();

    // Custom renderers for Markdown elements
    const components = {
        // Headings
        h1: ({ node, ...props }) => (
            <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                    color: 'white', 
                    marginTop: 4, 
                    marginBottom: 2,
                    fontWeight: 'bold'
                }} 
                {...props} 
            />
        ),
        h2: ({ node, ...props }) => (
            <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                    color: 'white', 
                    marginTop: 3, 
                    marginBottom: 2,
                    fontWeight: 'bold'
                }} 
                {...props} 
            />
        ),
        h3: ({ node, ...props }) => (
            <Typography 
                variant="h3" 
                component="h3" 
                sx={{ 
                    color: 'white', 
                    marginTop: 3, 
                    marginBottom: 1.5,
                    fontWeight: 'bold'
                }} 
                {...props} 
            />
        ),
        h4: ({ node, ...props }) => (
            <Typography 
                variant="h4" 
                component="h4" 
                sx={{ 
                    color: 'white', 
                    marginTop: 2, 
                    marginBottom: 1,
                    fontWeight: 'bold'
                }} 
                {...props} 
            />
        ),
        h5: ({ node, ...props }) => (
            <Typography 
                variant="h5" 
                component="h5" 
                sx={{ 
                    color: 'white', 
                    marginTop: 2, 
                    marginBottom: 1,
                    fontWeight: 'bold'
                }} 
                {...props} 
            />
        ),
        h6: ({ node, ...props }) => (
            <Typography 
                variant="h6" 
                component="h6" 
                sx={{ 
                    color: 'white', 
                    marginTop: 2, 
                    marginBottom: 1,
                    fontWeight: 'bold'
                }} 
                {...props} 
            />
        ),
        
        // Paragraphs
        p: ({ node, ...props }) => (
            <Typography 
                variant="body1" 
                component="p" 
                sx={{ 
                    color: 'white', 
                    marginTop: 1.5, 
                    marginBottom: 1.5,
                    lineHeight: 1.7
                }} 
                {...props} 
            />
        ),
        
        // Links
        a: ({ node, href, children, ...props }) => {
            // Check if it's an internal link (starts with /)
            const isInternal = href && href.startsWith('/');
            
            if (isInternal) {
                return (
                    <Link
                        component="button"
                        variant="body1"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(href);
                        }}
                        sx={{
                            color: '#1DB954',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                                color: '#1ed760'
                            },
                            cursor: 'pointer'
                        }}
                        {...props}
                    >
                        {children}
                    </Link>
                );
            }
            
            return (
                <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        color: '#1DB954',
                        textDecoration: 'none',
                        '&:hover': {
                            textDecoration: 'underline',
                            color: '#1ed760'
                        }
                    }}
                    {...props}
                >
                    {children}
                </Link>
            );
        },
        
        // Lists
        ul: ({ node, ...props }) => (
            <Box
                component="ul"
                sx={{
                    color: 'white',
                    marginTop: 1.5,
                    marginBottom: 1.5,
                    paddingLeft: 3,
                    '& li': {
                        marginTop: 1,
                        marginBottom: 1
                    }
                }}
                {...props}
            />
        ),
        ol: ({ node, ...props }) => (
            <Box
                component="ol"
                sx={{
                    color: 'white',
                    marginTop: 1.5,
                    marginBottom: 1.5,
                    paddingLeft: 3,
                    '& li': {
                        marginTop: 1,
                        marginBottom: 1
                    }
                }}
                {...props}
            />
        ),
        li: ({ node, ...props }) => (
            <Typography
                component="li"
                variant="body1"
                sx={{
                    color: 'white',
                    lineHeight: 1.7
                }}
                {...props}
            />
        ),
        
        // Strong/Bold
        strong: ({ node, ...props }) => (
            <Box
                component="strong"
                sx={{
                    color: 'white',
                    fontWeight: 'bold'
                }}
                {...props}
            />
        ),
        
        // Emphasis/Italic
        em: ({ node, ...props }) => (
            <Box
                component="em"
                sx={{
                    color: 'white',
                    fontStyle: 'italic'
                }}
                {...props}
            />
        ),
        
        // Code blocks
        code: ({ node, inline, ...props }) => {
            if (inline) {
                return (
                    <Box
                        component="code"
                        sx={{
                            backgroundColor: '#2d2d2d',
                            color: '#f8f8f2',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '0.9em',
                            fontFamily: 'monospace'
                        }}
                        {...props}
                    />
                );
            }
            
            return (
                <Box
                    component="code"
                    sx={{
                        display: 'block',
                        backgroundColor: '#2d2d2d',
                        color: '#f8f8f2',
                        padding: 2,
                        borderRadius: '5px',
                        marginTop: 2,
                        marginBottom: 2,
                        overflow: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '0.9em',
                        lineHeight: 1.5
                    }}
                    {...props}
                />
            );
        },
        
        // Blockquotes
        blockquote: ({ node, ...props }) => (
            <Box
                component="blockquote"
                sx={{
                    borderLeft: '4px solid #1DB954',
                    paddingLeft: 2,
                    marginLeft: 0,
                    marginTop: 2,
                    marginBottom: 2,
                    fontStyle: 'italic',
                    color: '#e0e0e0'
                }}
                {...props}
            />
        ),
        
        // Horizontal rule
        hr: ({ node, ...props }) => (
            <Box
                component="hr"
                sx={{
                    border: 'none',
                    borderTop: '1px solid #444',
                    marginTop: 3,
                    marginBottom: 3
                }}
                {...props}
            />
        ),
    };

    return (
        <Box sx={{ color: 'white' }}>
            <ReactMarkdown components={components}>
                {content}
            </ReactMarkdown>
        </Box>
    );
};

export default MarkdownContent;
