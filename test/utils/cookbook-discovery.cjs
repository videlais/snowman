/**
 * Cookbook Discovery Utility
 * Discovers and categorizes all Twine Cookbook examples for testing
 */

const fs = require('node:fs');
const path = require('path');

class CookbookDiscovery {
    constructor(cookbookDir = path.join(__dirname, '../cookbook')) {
        this.cookbookDir = cookbookDir;
    }

    /**
     * Discover all cookbook examples
     * @returns {Array} Array of example objects with metadata
     */
    discoverExamples() {
        const examples = [];
        
        if (!fs.existsSync(this.cookbookDir)) {
            console.warn(`Cookbook directory not found: ${this.cookbookDir}`);
            return examples;
        }

        const directories = fs.readdirSync(this.cookbookDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
            .map(dirent => dirent.name);

        for (const exampleName of directories) {
            const exampleDir = path.join(this.cookbookDir, exampleName);
            
            // Check for snowman versions
            const snowmanDir = path.join(exampleDir, 'snowman');
            const snowman2Dir = path.join(exampleDir, 'snowman_2');
            
            if (fs.existsSync(snowmanDir)) {
                const snowmanExample = this.analyzeExampleDirectory(snowmanDir, exampleName, 'snowman');
                if (snowmanExample) {
                    examples.push(snowmanExample);
                }
            }
            
            if (fs.existsSync(snowman2Dir)) {
                const snowman2Example = this.analyzeExampleDirectory(snowman2Dir, exampleName, 'snowman_2');
                if (snowman2Example) {
                    examples.push(snowman2Example);
                }
            }
        }

        return examples.sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * Analyze a specific example directory
     * @param {string} exampleDir - Path to example directory
     * @param {string} exampleName - Name of the example
     * @param {string} version - Snowman version (snowman or snowman_2)
     * @returns {Object|null} Example metadata or null if invalid
     */
    analyzeExampleDirectory(exampleDir, exampleName, version) {
        const files = fs.readdirSync(exampleDir);
        
        // Find Twee and HTML files
        const tweeFile = files.find(f => f.includes('twee') && f.endsWith('.txt')) || 
                        files.find(f => f.endsWith('.twee.txt')) || 
                        files.find(f => f.endsWith('.tw'));
        const htmlFile = files.find(f => f.endsWith('.html'));
        const mdFile = files.find(f => f.endsWith('.md'));
        
        if (!tweeFile) {
            console.warn(`No Twee file found in ${exampleDir}`);
            return null;
        }

        const example = {
            name: exampleName,
            version: version,
            displayName: this.formatDisplayName(exampleName),
            directory: exampleDir,
            files: {
                twee: path.join(exampleDir, tweeFile),
                html: htmlFile ? path.join(exampleDir, htmlFile) : null,
                markdown: mdFile ? path.join(exampleDir, mdFile) : null
            },
            metadata: this.extractTweeMetadata(path.join(exampleDir, tweeFile))
        };

        return example;
    }

    /**
     * Extract metadata from a Twee file
     * @param {string} tweeFilePath - Path to Twee file
     * @returns {Object} Metadata object
     */
    extractTweeMetadata(tweeFilePath) {
        const metadata = {
            hasUserScript: false,
            hasHeader: false,
            passages: [],
            startPassage: null,
            dependencies: []
        };

        try {
            const content = fs.readFileSync(tweeFilePath, 'utf8');
            const lines = content.split('\n');
            
            let currentPassage = null;
            let inPassage = false;
            
            for (const line of lines) {
                const trimmed = line.trim();
                
                // Check for passage headers
                if (trimmed.startsWith('::')) {
                    if (currentPassage) {
                        metadata.passages.push(currentPassage);
                    }
                    
                    // Parse passage header
                    const passageMatch = trimmed.match(/^::\s*([^\[\{]+?)(?:\s*\[([^\]]*)\])?(?:\s*\{([^\}]*)\})?$/);
                    if (passageMatch) {
                        currentPassage = {
                            name: passageMatch[1].trim(),
                            tags: passageMatch[2] ? passageMatch[2].split(/\s+/).filter(t => t) : [],
                            metadata: passageMatch[3] ? passageMatch[3].trim() : '',
                            content: ''
                        };
                        
                        // Check for special passages
                        if (currentPassage.name === 'UserScript') {
                            metadata.hasUserScript = true;
                        } else if (currentPassage.name === 'Header') {
                            metadata.hasHeader = true;
                        } else if (currentPassage.name === 'Start') {
                            metadata.startPassage = currentPassage.name;
                        }
                        
                        inPassage = true;
                    }
                } else if (inPassage && currentPassage) {
                    currentPassage.content += line + '\n';
                }
            }
            
            // Add the last passage
            if (currentPassage) {
                metadata.passages.push(currentPassage);
            }
            
            // Detect common dependencies from content
            const fullContent = content.toLowerCase();
            if (fullContent.includes('jquery') || fullContent.includes('$')) {
                metadata.dependencies.push('jquery');
            }
            if (fullContent.includes('lodash') || fullContent.includes('_')) {
                metadata.dependencies.push('lodash');
            }
            
        } catch (error) {
            console.warn(`Error reading Twee file ${tweeFilePath}:`, error.message);
        }

        return metadata;
    }

    /**
     * Format display name from directory name
     * @param {string} name - Directory name
     * @returns {string} Formatted display name
     */
    formatDisplayName(name) {
        return name
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Get examples by category
     * @returns {Object} Examples grouped by category
     */
    getExamplesByCategory() {
        const examples = this.discoverExamples();
        const categories = {};
        
        for (const example of examples) {
            const category = this.categorizeExample(example.name);
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(example);
        }
        
        return categories;
    }

    /**
     * Categorize an example based on its name
     * @param {string} name - Example name
     * @returns {string} Category name
     */
    categorizeExample(name) {
        const categoryMap = {
            'arrays': 'Data Structures',
            'audio': 'Media',
            'conditionalstatements': 'Control Flow',
            'cycling': 'Interactive Elements',
            'cssselectors': 'Styling',
            'datetime': 'Utilities',
            'delayedtext': 'Text Effects',
            'dropdown': 'User Interface',
            'dungeon': 'Game Examples',
            'fairmath': 'Mathematics',
            'googlefonts': 'Styling',
            'headersfootes': 'Layout',
            'hiddenlink': 'Interactive Elements',
            'images': 'Media',
            'keyboardevents': 'User Input',
            'limitingrange': 'Validation',
            'loadingscreen': 'User Interface',
            'lockkey': 'Game Mechanics',
            'looping': 'Control Flow',
            'modal': 'User Interface',
            'modularity': 'Code Organization',
            'passagevisits': 'Story Navigation',
            'passageevents': 'Story Navigation',
            'passagetransitions': 'Story Navigation',
            'passagesinpassages': 'Story Navigation',
            'playerstats': 'Game Mechanics',
            'programmaticundo': 'Story Navigation',
            'renderpassagetoelement': 'Advanced Features',
            'savinggames': 'Game Mechanics',
            'settingshowing': 'Story Navigation',
            'sidebar': 'User Interface',
            'spaceexploration': 'Game Examples',
            'statichealthbars': 'User Interface',
            'storypassageapi': 'Advanced Features',
            'stylemarkup': 'Styling',
            'timedpassages': 'Text Effects',
            'timedprogressbars': 'User Interface',
            'turncounter': 'Game Mechanics',
            'typewritereffect': 'Text Effects',
            'variablestorystyling': 'Styling'
        };
        
        return categoryMap[name] || 'Other';
    }

    /**
     * Generate summary report
     * @returns {Object} Summary statistics
     */
    generateSummary() {
        const examples = this.discoverExamples();
        const categories = this.getExamplesByCategory();
        
        const summary = {
            totalExamples: examples.length,
            snowmanVersions: {
                snowman: examples.filter(e => e.version === 'snowman').length,
                snowman_2: examples.filter(e => e.version === 'snowman_2').length
            },
            categories: Object.keys(categories).length,
            examplesWithHTML: examples.filter(e => e.files.html).length,
            examplesWithUserScript: examples.filter(e => e.metadata.hasUserScript).length,
            examplesWithHeader: examples.filter(e => e.metadata.hasHeader).length,
            categoryBreakdown: Object.fromEntries(
                Object.entries(categories).map(([cat, examples]) => [cat, examples.length])
            )
        };
        
        return summary;
    }
}

module.exports = { CookbookDiscovery };