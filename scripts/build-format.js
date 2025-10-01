import cpx from 'cpx';
import ejs from 'ejs';
import { exec } from 'child-process-promise';
import fs from 'fs';
import pkg from '../package.json' with { type: 'json' };
import shell from 'shelljs';
import path from 'path';

var encoding = { encoding: 'utf8' };
var tempPath = "tmp";

function buildWithWebpack() {
	// Use webpack to build both JS and CSS
	return exec('npx webpack --config webpack.config.js', { maxBuffer: Infinity });
}

buildWithWebpack().then(function(result) {
	var distPath = 'dist/' + pkg.name.toLowerCase() + '-' + pkg.version;
	var htmlTemplate = ejs.compile(fs.readFileSync('src/index.ejs', encoding));
	
	// Read the webpack output files
	var scriptContent = fs.readFileSync(path.join(tempPath, 'script.bundle.js'), encoding);
	var styleContent = fs.readFileSync(path.join(tempPath, 'format.css'), encoding);
	
	var formatData = {
		author: pkg.author.replace(/ <.*>/, ''),
		description: pkg.description,
		image: 'icon.svg',
		name: pkg.name,
		proofing: false,
		source: htmlTemplate({
			style: styleContent,
			script: scriptContent
		}),
		url: pkg.repository,
		version: pkg.version
	};

	shell.mkdir('-p', distPath);
	fs.writeFileSync(
		distPath + '/format.js',
		'window.storyFormat(' + JSON.stringify(formatData) + ');'
	);
	cpx.copySync('src/icon.svg', distPath);

	// Clean up
	shell.rm('-R', tempPath);

}).catch(function(error) {
	console.error('Build failed:', error);
	process.exit(1);
});
