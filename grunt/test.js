module.exports = function(grunt) {
	grunt.config.merge({
		eslint: {
			target: ['src/**/*.js'],
			options: {}
		}
	});

	grunt.registerTask('lint', ['eslint']);
};
