import { compile } from 'ejs';
import { exec } from 'child-process-promise';
import { readFileSync, writeFileSync } from 'fs';
import pkg from 'shelljs';
const { rm, cat, mkdir, cp } = pkg;
import CleanCSS from 'clean-css';

var encoding = { encoding: 'utf8' };

// Read the package.json file and convert to object
const packageJSON = JSON.parse(readFileSync('package.json', encoding));
const name = packageJSON.name;
const version = packageJSON.version;
const description = packageJSON.description;
const author = packageJSON.author;
const url = packageJSON.repository;

function buildCSS() {

	rm('-f', 'lib/src/format.css');
	cat('lib/src/*.css').to('lib/src/format.css');
  let file = readFileSync('lib/src/format.css');
  const output = new CleanCSS({level: 2}).minify(file);
	rm('-f', 'lib/src/format.css');
	return output.styles;

}

/** 
	buildCSS();
	const results = exec('browserify -g uglifyify lib/index.js -t [ babelify --presets [ @babel/env ] ]', { maxBuffer: Infinity });

	var distPath = 'dist/' + name.toLowerCase() + '-' + version;
	var htmlTemplate = compile(readFileSync('lib/src/index.ejs', encoding));
	var formatData = {
		author: author.replace(/ <.*>/, ''),
		description: description,
		image: 'icon.svg',
		name: name,
		proofing: false,
		source: htmlTemplate({
			style: results[0],
			script: results[1]
		}),
		url: url,
		version: version
	};

	mkdir('-p', distPath);

	writeFileSync(
		distPath + '/format.js',
		'window.storyFormat(' + JSON.stringify(formatData) + ');'
	);

	cp('lib/src/icon.svg', distPath + '/icon.svg');
	*/