import yaml from 'js-yaml';

/**
 * Parses frontmatter from markdown content
 * Browser-compatible frontmatter parser
 * @param {string} text - The markdown text with frontmatter
 * @returns {Object} Object with data (frontmatter) and content properties
 */
const parseFrontmatter = (text) => {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = text.match(frontmatterRegex);
    
    if (!match) {
        // No frontmatter found, return entire text as content
        return {
            data: {},
            content: text.trim(),
        };
    }
    
    const frontmatterYaml = match[1];
    const content = match[2].trim();
    
    try {
        const data = yaml.load(frontmatterYaml) || {};
        return {
            data,
            content,
        };
    } catch (error) {
        console.warn('Error parsing frontmatter YAML:', error);
        // If YAML parsing fails, return empty frontmatter
        return {
            data: {},
            content: text.trim(),
        };
    }
};

// List of all article slugs and their corresponding markdown file paths
// These files are served from the public/content/guides/ directory
const articleSlugs = [
    'how-to-shuffle-playlists',
    'understanding-playlist-shuffling',
    'shuffle-tips-and-tricks',
];

/**
 * Gets the path to an article markdown file
 * @param {string} slug - The article slug
 * @returns {string} Path to the markdown file
 */
const getArticlePath = (slug) => {
    // Files in public folder are served from root
    // Use absolute path starting with /
    return `/content/guides/${slug}.md`;
};

/**
 * Fetches and parses a markdown file for an article
 * @param {string} slug - The article slug
 * @returns {Promise<Object>} Promise that resolves to parsed article data
 */
export const getArticleBySlug = async (slug) => {
    if (!articleSlugs.includes(slug)) {
        throw new Error(`Article with slug "${slug}" not found`);
    }

    try {
        // Fetch the markdown file content from public folder
        const response = await fetch(getArticlePath(slug));
        
        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.statusText}`);
        }
        
        const text = await response.text();
        
        // Parse frontmatter and content
        const { data: frontmatter, content } = parseFrontmatter(text);
        
        return {
            slug,
            frontmatter,
            content,
        };
    } catch (error) {
        console.error(`Error loading article "${slug}":`, error);
        throw error;
    }
};

/**
 * Gets all articles with their metadata
 * @returns {Promise<Array>} Promise that resolves to array of article metadata
 */
export const getAllArticles = async () => {
    const articles = [];
    
    for (const slug of articleSlugs) {
        try {
            const path = getArticlePath(slug);
            const response = await fetch(path);
            
            if (!response.ok) {
                console.warn(`Failed to fetch article "${slug}": ${response.status} ${response.statusText}`);
                continue;
            }
            
            const text = await response.text();
            
            if (!text || text.trim().length === 0) {
                console.warn(`Article "${slug}" is empty`);
                continue;
            }
            
            const { data: frontmatter } = parseFrontmatter(text);
            
            // Ensure we have the required fields
            if (!frontmatter.title) {
                console.warn(`Article "${slug}" is missing title in frontmatter`);
                continue;
            }
            
            articles.push({
                slug,
                ...frontmatter,
            });
        } catch (error) {
            console.error(`Error loading article metadata for "${slug}":`, error);
        }
    }
    
    // Sort articles by date (newest first)
    articles.sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return dateB - dateA;
    });
    
    return articles;
};

/**
 * Gets article metadata by slug (without full content)
 * @param {string} slug - The article slug
 * @returns {Promise<Object>} Promise that resolves to article metadata
 */
export const getArticleMetadata = async (slug) => {
    if (!articleSlugs.includes(slug)) {
        throw new Error(`Article with slug "${slug}" not found`);
    }

    try {
        const response = await fetch(getArticlePath(slug));
        
        if (!response.ok) {
            throw new Error(`Failed to fetch article: ${response.statusText}`);
        }
        
        const text = await response.text();
        const { data: frontmatter } = parseFrontmatter(text);
        
        return {
            slug,
            ...frontmatter,
        };
    } catch (error) {
        console.error(`Error loading article metadata for "${slug}":`, error);
        throw error;
    }
};
