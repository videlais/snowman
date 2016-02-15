module.exports = function(grunt) {
	var pkg = require('../package.json');

	grunt.registerTask('package:icon', function() {
		grunt.file.copy('src/icon.svg', 'dist/' + pkg.name + '/icon.svg');
	});

	grunt.registerTask('package:format', function() {
		var formatData = {
			description: pkg.description,
			author: pkg.author.replace(/ <.*>/, ''),
			image: 'icon.svg',
			name: pkg.name,
			url: pkg.repository,
			version: pkg.version,
			proofing: false,
			source: grunt.file.read('build/format.html')
		};

		grunt.file.write(
			'dist/' + pkg.name + '/format.js',
			'window.storyFormat(' + JSON.stringify(formatData) + ');'
		);
	});

	grunt.registerTask('package', ['build:release', 'package:icon', 'package:format']);
};
