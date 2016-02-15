module.exports = function(grunt) {
	var pkg = require('../package.json');

	grunt.config.merge({
		yuidoc: {
			default: {
				name: pkg.name,
				description: pkg.description,
				version: pkg.version,
				url: pkg.repository,
				options: {
					paths: 'src/',
					outdir: 'doc/'
				}
			}
		}
	});

	grunt.registerTask('doc', ['yuidoc']);
};
