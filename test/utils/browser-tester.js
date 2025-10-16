/**
 * Browser-based testing utilities for Snowman story format
 */

import { spawn } from 'child_process';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import path from 'path';

export class BrowserTester {
  
  constructor(options = {}) {
    this.port = options.port || 3000;
    this.browser = options.browser || 'chrome';
    this.server = null;
  }
  
  /**
   * Start a local server to serve HTML files
   */
  async startServer(distPath = './dist') {
    return new Promise((resolve, reject) => {
      this.server = createServer((req, res) => {
        let filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url);
        
        try {
          const content = readFileSync(filePath);
          const ext = path.extname(filePath);
          
          let contentType = 'text/html';
          if (ext === '.js') contentType = 'application/javascript';
          if (ext === '.css') contentType = 'text/css';
          
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        } catch {
          res.writeHead(404);
          res.end('File not found');
        }
      });
      
      this.server.listen(this.port, (error) => {
        if (error) {
          reject(error);
        } else {
          console.log(`🌐 Server running at http://localhost:${this.port}`);
          resolve();
        }
      });
    });
  }
  
  /**
   * Open browser for manual testing
   */
  async openBrowser(path = '/') {
    const url = `http://localhost:${this.port}${path}`;
    
    let command;
    switch (process.platform) {
      case 'darwin': // macOS
        command = 'open';
        break;
      case 'win32': // Windows
        command = 'start';
        break;
      default: // Linux
        command = 'xdg-open';
    }
    
    console.log(`🚀 Opening browser: ${url}`);
    spawn(command, [url], { detached: true });
  }
  
  /**
   * Stop the server
   */
  stopServer() {
    if (this.server) {
      this.server.close();
      console.log('🛑 Server stopped');
    }
  }
  
  /**
   * Create side-by-side comparison page
   */
  generateComparisonPage(generatedHTML, referenceHTML) {
    const comparisonHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Snowman HTML Comparison</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .comparison { display: flex; gap: 20px; }
        .panel { flex: 1; border: 1px solid #ccc; padding: 10px; }
        .panel h3 { margin-top: 0; background: #f5f5f5; padding: 10px; margin: -10px -10px 10px -10px; }
        .generated { border-color: #28a745; }
        .reference { border-color: #17a2b8; }
        iframe { width: 100%; height: 600px; border: none; }
        .code { background: #f8f9fa; padding: 10px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto; }
    </style>
</head>
<body>
    <h1>📊 Snowman HTML Output Comparison</h1>
    
    <div class="comparison">
        <div class="panel generated">
            <h3>🔧 Generated Output</h3>
            <iframe srcdoc="${generatedHTML.replace(/"/g, '&quot;')}"></iframe>
            <details>
                <summary>View Source</summary>
                <div class="code">${generatedHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </details>
        </div>
        
        <div class="panel reference">
            <h3>📋 Reference Output</h3>
            <iframe srcdoc="${referenceHTML.replace(/"/g, '&quot;')}"></iframe>
            <details>
                <summary>View Source</summary>
                <div class="code">${referenceHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </details>
        </div>
    </div>
    
    <script>
        // Add any comparison JavaScript here
        console.log('Comparison page loaded');
    </script>
</body>
</html>`;
    
    return comparisonHTML;
  }
}

// Example usage
export async function startBrowserComparison(generatedHTML, referenceHTML) {
  const tester = new BrowserTester();
  
  try {
    await tester.startServer();
    
    // Generate comparison page
    tester.generateComparisonPage(generatedHTML, referenceHTML);
    
    // You could save this to a file and serve it
    console.log('📊 Comparison ready at http://localhost:3000');
    
    return tester;
  } catch (error) {
    console.error('❌ Failed to start browser comparison:', error);
    throw error;
  }
}