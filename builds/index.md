---
layout: default
title: "Build Files & Downloads"
permalink: /builds/
---

<style>
.version-section {
    margin: 30px 0;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}
.file-links {
    margin: 15px 0;
}
.file-links a {
    display: inline-block;
    margin: 5px 10px 5px 0;
    padding: 8px 12px;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 14px;
}
.file-links a:hover {
    background-color: #2980b9;
}
.url-section {
    margin-top: 15px;
}
.url-input {
    width: 70%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: monospace;
    background-color: #f8f8f8;
}
.copy-btn {
    padding: 8px 12px;
    margin-left: 10px;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.copy-btn:hover {
    background-color: #229954;
}
.version-info {
    margin-top: 10px;
    padding: 10px;
    background-color: #e8f4fd;
    border-left: 4px solid #3498db;
    border-radius: 4px;
}
.status {
    margin-top: 10px;
    padding: 10px;
    border-radius: 4px;
}
.status.loading {
    background-color: #fff3cd;
    border-left: 4px solid #ffc107;
}
.status.success {
    background-color: #d4edda;
    border-left: 4px solid #28a745;
}
.status.error {
    background-color: #f8d7da;
    border-left: 4px solid #dc3545;
}
.docs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 30px 0;
}
.docs-card {
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    padding: 20px;
    background-color: white;
}
.docs-card h3 {
    margin-top: 0;
    color: #2c3e50;
}
</style>

# Snowman Story Format - Build Files

This page provides access to the compiled Snowman story format files that can be imported into Twine 2.

## Version Downloads

<div class="version-section">
    <h3>🔧 Snowman 1.X</h3>
    <div id="version-info-1x" class="version-info">
        <span class="loading">⏳ Loading version information...</span>
    </div>
    <div class="file-links">
        <a href="1.X/format.js" download="snowman-1x-format.js">📥 Download format.js</a>
        <a href="1.X/" target="_blank">📁 Browse Files</a>
    </div>
    <div class="url-section">
        <label for="url-1x"><strong>📋 Copy format.js URL:</strong></label><br>
        <input type="text" id="url-1x" class="url-input" readonly>
        <button onclick="copyToClipboard('url-1x')" class="copy-btn">📋 Copy</button>
    </div>
</div>

<div class="version-section">
    <h3>🔧 Snowman 2.X</h3>
    <div id="version-info-2x" class="version-info">
        <span class="loading">⏳ Loading version information...</span>
    </div>
    <div class="file-links">
        <a href="2.X/format.js" download="snowman-2x-format.js">📥 Download format.js</a>
        <a href="2.X/" target="_blank">📁 Browse Files</a>
    </div>
    <div class="url-section">
        <label for="url-2x"><strong>📋 Copy format.js URL:</strong></label><br>
        <input type="text" id="url-2x" class="url-input" readonly>
        <button onclick="copyToClipboard('url-2x')" class="copy-btn">📋 Copy</button>
    </div>
</div>

<div class="version-section">
    <h3>🔧 Snowman 3.X (Development)</h3>
    <div id="version-info-3x" class="version-info">
        <span class="loading">⏳ Loading version information...</span>
    </div>
    <div class="file-links">
        <a href="3.X/format.js" download="snowman-3x-format.js">📥 Download format.js</a>
        <a href="3.X/" target="_blank">📁 Browse Files</a>
    </div>
    <div class="url-section">
        <label for="url-3x"><strong>📋 Copy format.js URL:</strong></label><br>
        <input type="text" id="url-3x" class="url-input" readonly>
        <button onclick="copyToClipboard('url-3x')" class="copy-btn">📋 Copy</button>
    </div>
</div>

## 📚 Documentation Downloads

<div class="docs-grid">
    <div class="docs-card">
        <h3>📖 Version 1.X Documentation</h3>
        <p><a href="/1/" style="color: #3498db;">📖 View Online</a></p>
        <p><a href="https://download-directory.github.io/?url=https://github.com/videlais/snowman/tree/gh-pages/1" target="_blank" style="color: #27ae60;">📦 Download Docs Only</a></p>
        <p><a href="https://github.com/videlais/snowman/archive/gh-pages.zip" target="_blank" style="color: #7f8c8d; font-size: 0.9em;">🔗 Full Repository ZIP</a></p>
    </div>
    
    <div class="docs-card">
        <h3>📖 Version 2.X Documentation</h3>
        <p><a href="/2/" style="color: #3498db;">📖 View Online</a></p>
        <p><a href="https://download-directory.github.io/?url=https://github.com/videlais/snowman/tree/gh-pages/2" target="_blank" style="color: #27ae60;">📦 Download Docs Only</a></p>
        <p><a href="https://github.com/videlais/snowman/archive/gh-pages.zip" target="_blank" style="color: #7f8c8d; font-size: 0.9em;">🔗 Full Repository ZIP</a></p>
    </div>
</div>

## How to Install

1. **Download** the format.js file for your desired version
2. **Open Twine 2** and go to the story list
3. **Click the "Formats" button** in the sidebar
4. **Click "Add a New Format"**
5. **Paste the format.js URL** or upload the downloaded file
6. **Select Snowman** as your story format when creating new stories

---

<div id="status" class="status" style="display: none;"></div>

<p style="text-align: center; margin-top: 40px; font-size: 0.9em; color: #666;">
    <strong>📅 Last Updated:</strong> <span id="last-updated"></span>
</p>

<script>
// Set up format.js URLs
const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '');
document.getElementById('url-1x').value = baseUrl + '/1.X/format.js';
document.getElementById('url-2x').value = baseUrl + '/2.X/format.js';
document.getElementById('url-3x').value = baseUrl + '/3.X/format.js';

// Copy to clipboard function
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    element.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        showStatus('📋 URL copied to clipboard!', 'success');
    } catch (err) {
        showStatus('❌ Failed to copy URL', 'error');
    }
}

// Show status messages
function showStatus(message, type) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = 'status ' + type;
    statusElement.style.display = 'block';
    
    setTimeout(() => {
        statusElement.style.display = 'none';
    }, 3000);
}

// Load version information from format.js files
function loadVersionInfo(versionFolder, elementId) {
    const infoElement = document.getElementById(elementId);
    const formatUrl = baseUrl + '/' + versionFolder + '/format.js';
    
    // Create script element to load JSONP
    const script = document.createElement('script');
    const callbackName = 'formatCallback_' + versionFolder.replace('.', '_');
    
    // Define callback function
    window[callbackName] = function(data) {
        try {
            if (data && data.version) {
                infoElement.innerHTML = `<strong>📦 Version:</strong> ${data.version}`;
            } else {
                infoElement.innerHTML = '<span class="error">⚠️ Version information not available</span>';
            }
        } catch (error) {
            infoElement.innerHTML = '<span class="error">❌ Could not load version information</span>';
        }
        // Clean up
        document.head.removeChild(script);
        delete window[callbackName];
    };
    
    script.src = formatUrl + '?callback=' + callbackName;
    script.onerror = function() {
        infoElement.innerHTML = '<span class="error">❌ Could not load version information</span>';
        document.head.removeChild(script);
        delete window[callbackName];
    };
    
    document.head.appendChild(script);
}

// Load version information for each build
loadVersionInfo('1.X', 'version-info-1x');
loadVersionInfo('2.X', 'version-info-2x');
loadVersionInfo('3.X', 'version-info-3x');

// Set last updated date
document.getElementById('last-updated').textContent = new Date().toLocaleDateString();

// Add keyboard support for copy buttons
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === '1') {
            e.preventDefault();
            copyToClipboard('url-1x');
        } else if (e.key === '2') {
            e.preventDefault();
            copyToClipboard('url-2x');
        } else if (e.key === '3') {
            e.preventDefault();
            copyToClipboard('url-3x');
        }
    }
});
</script>