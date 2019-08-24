var cpx = require('cpx');
var ejs = require('ejs');
var exec = require('child-process-promise').exec;
var fs = require('fs');
var pkg = require('../package.json');
var shell = require('shelljs');
var path = require('path');

var encoding = { encoding: 'utf8' };
var tempPath = "";

function buildCSS() {
	tempPath = 'tmp';
	var cssPath = path.join(tempPath, 'format.css');

	shell.mkdir('-p', tempPath);
	shell.rm('-f', cssPath);
	shell.cat('src/*.css').to(cssPath);

	return exec('cssnano ' + cssPath);
}

Promise.all([
	buildCSS(),
	exec('browserify -g uglifyify src/index.js', { maxBuffer: Infinity })
]).then(function(results) {
	var distPath = 'dist/' + pkg.name.toLowerCase() + '-' + pkg.version;
	var htmlTemplate = ejs.compile(fs.readFileSync('src/index.ejs', encoding));
	var formatData = {
		author: pkg.author.replace(/ <.*>/, ''),
		description: pkg.description,
		image: 'icon.svg',
		name: pkg.name,
		proofing: false,
		source: htmlTemplate({
			style: results[0].stdout,
			script: results[1].stdout
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

});
