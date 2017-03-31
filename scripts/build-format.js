var cpx = require('cpx');
var ejs = require('ejs');
var exec = require('child-process-promise').exec;
var fs = require('fs');
var mkdirp = require('mkdirp');
var pkg = require('../package.json');
var twine = require('twine-utils');

var encoding = { encoding: 'utf8' };

Promise.all([
	exec('cssnano src/*.css'),
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

	mkdirp.sync(distPath);
	fs.writeFileSync(
		distPath + '/format.js',
		'window.storyFormat(' + JSON.stringify(formatData) + ');'
	);
	cpx.copySync('src/icon.svg', distPath);
});