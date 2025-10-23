/**
 * Browser-compatible Extwee implementation for Snowman interactive examples
 * 
 * This module provides Twee compilation functionality in the browser,
 * allowing real-time compilation of Twee source code using Snowman format.js files.
 */

class SnowmanTweeCompiler {
    constructor() {
        this.format = null;
        this.storyData = null;
    }

    /**
     * Load a Snowman format.js file
     * @param {string} formatUrl - URL to the format.js file
     * @returns {Promise<Object>} The loaded format data
     */
    async loadFormat(formatUrl) {
        try {
            // Create a unique callback name to avoid conflicts
            const callbackName = 'storyFormatCallback_' + Date.now();
            
            return new Promise((resolve, reject) => {
                // Set up temporary global callback
                window[callbackName] = (formatData) => {
                    this.format = formatData;
                    delete window[callbackName]; // Clean up
                    resolve(formatData);
                };

                // Fetch the format.js file
                fetch(formatUrl)
                    .then(response => response.text())
                    .then(formatCode => {
                        // Replace the storyFormat call with our callback
                        const modifiedCode = formatCode.replace(
                            /window\.storyFormat\s*\(/,
                            `window.${callbackName}(`
                        );
                        
                        // Execute the modified code
                        const script = document.createElement('script');
                        script.textContent = modifiedCode;
                        document.head.appendChild(script);
                        document.head.removeChild(script);
                    })
                    .catch(reject);

                // Timeout after 10 seconds
                setTimeout(() => {
                    if (window[callbackName]) {
                        delete window[callbackName];
                        reject(new Error('Format loading timeout'));
                    }
                }, 10000);
            });
        } catch (error) {
            throw new Error(`Failed to load format: ${error.message}`);
        }
    }

    /**
     * Parse Twee source code into passage objects
     * @param {string} tweeSource - The Twee source code
     * @returns {Array<Object>} Array of passage objects
     */
    parseTwee(tweeSource) {
        const passages = [];
        const lines = tweeSource.split('\n');
        let currentPassage = null;
        let passageContent = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Check for passage header (:: PassageName [tags])
            if (line.startsWith('::')) {
                // Save previous passage if exists
                if (currentPassage) {
                    currentPassage.text = passageContent.join('\n').trim();
                    passages.push(currentPassage);
                }

                // Parse passage header
                const headerMatch = line.match(/^::\s*([^\[\s]+)(?:\s*\[([^\]]*)\])?/);
                if (headerMatch) {
                    const name = headerMatch[1];
                    const tags = headerMatch[2] ? headerMatch[2].split(/\s+/).filter(t => t) : [];
                    
                    currentPassage = {
                        name: name,
                        tags: tags,
                        pid: passages.length + 1,
                        text: ''
                    };
                    passageContent = [];
                }
            } else if (currentPassage) {
                // Add content to current passage
                passageContent.push(lines[i]); // Keep original line (including indentation)
            }
        }

        // Don't forget the last passage
        if (currentPassage) {
            currentPassage.text = passageContent.join('\n').trim();
            passages.push(currentPassage);
        }

        return passages;
    }

    /**
     * Create story data structure from passages
     * @param {Array<Object>} passages - Array of passage objects
     * @param {Object} options - Story options (name, startPassage, etc.)
     * @returns {Object} Story data structure
     */
    createStoryData(passages, options = {}) {
        const storyName = options.name || 'Interactive Example';
        const startPassage = options.startPassage || (passages.length > 0 ? passages[0].name : 'Start');
        
        // Find start passage ID
        let startPid = 1;
        const startPassageObj = passages.find(p => p.name === startPassage);
        if (startPassageObj) {
            startPid = startPassageObj.pid;
        }

        this.storyData = {
            name: storyName,
            startnode: startPid.toString(),
            creator: 'Snowman Interactive Examples',
            'creator-version': '1.0.0',
            ifid: this.generateIFID(),
            zoom: 1,
            format: this.format?.name || 'Snowman',
            'format-version': this.format?.version || '2.0.0',
            passages: passages
        };

        return this.storyData;
    }

    /**
     * Generate a unique IFID for the story
     * @returns {string} IFID string
     */
    generateIFID() {
        // Generate a UUID-like string for IFID
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    }

    /**
     * Compile Twee source to HTML using the loaded format
     * @param {string} tweeSource - The Twee source code
     * @param {Object} options - Compilation options
     * @returns {string} Complete HTML document
     */
    compile(tweeSource, options = {}) {
        if (!this.format) {
            throw new Error('No format loaded. Call loadFormat() first.');
        }

        // Parse Twee into passages
        const passages = this.parseTwee(tweeSource);
        
        if (passages.length === 0) {
            throw new Error('No passages found in Twee source');
        }

        // Create story data
        const storyData = this.createStoryData(passages, options);

        // Create tw-storydata element
        const storyDataXml = this.createStoryDataXml(storyData);

        // Get the format template
        let template = this.format.source;

        // Replace template placeholders
        template = template.replace(/\{\{STORY_NAME\}\}/g, storyData.name);
        template = template.replace(/\{\{STORY_DATA\}\}/g, storyDataXml);

        return template;
    }

    /**
     * Create tw-storydata XML element
     * @param {Object} storyData - Story data object
     * @returns {string} XML string for tw-storydata
     */
    createStoryDataXml(storyData) {
        const escapeXml = (text) => {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        };

        let xml = `<tw-storydata name="${escapeXml(storyData.name)}" `;
        xml += `startnode="${storyData.startnode}" `;
        xml += `creator="${escapeXml(storyData.creator)}" `;
        xml += `creator-version="${storyData['creator-version']}" `;
        xml += `ifid="${storyData.ifid}" `;
        xml += `zoom="${storyData.zoom}" `;
        xml += `format="${escapeXml(storyData.format)}" `;
        xml += `format-version="${storyData['format-version']}" `;
        xml += `options="" hidden>`;

        // Add style elements (empty for now)
        xml += '<style role="stylesheet" id="twine-user-stylesheet" type="text/twine-css"></style>';

        // Add script elements (empty for now)
        xml += '<script role="script" id="twine-user-script" type="text/twine-javascript"></script>';

        // Add passages
        storyData.passages.forEach(passage => {
            xml += `<tw-passagedata pid="${passage.pid}" `;
            xml += `name="${escapeXml(passage.name)}" `;
            xml += `tags="${escapeXml(passage.tags.join(' '))}" `;
            xml += `position="10,10" size="100,100">`;
            xml += escapeXml(passage.text);
            xml += '</tw-passagedata>';
        });

        xml += '</tw-storydata>';
        return xml;
    }

    /**
     * Get available format versions
     * @returns {Array<Object>} Array of format information
     */
    static getAvailableFormats() {
        return [
            { 
                name: 'Snowman 1.X', 
                version: '1.X',
                url: '../../builds/1.X/format.js',
                description: 'Legacy version with original API'
            },
            { 
                name: 'Snowman 2.X', 
                version: '2.X',
                url: '../../builds/2.X/format.js',
                description: 'Current version with enhanced features and utility functions'
            },
            { 
                name: 'Snowman 3.X', 
                version: '3.X',
                url: '../../builds/3.X/format.js',
                description: 'Latest version with modern JavaScript features'
            }
        ];
    }
}

// Export for use in modules or make globally available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnowmanTweeCompiler;
} else {
    window.SnowmanTweeCompiler = SnowmanTweeCompiler;
}