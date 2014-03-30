module.exports = function (grunt)
{
	grunt.initConfig({
		bake:
		{
			dev:
			{
				options:
				{
					content: { dev: true }
				},

				files: { 'index.html': 'format.html' }
			},

			release:
			{
				files: { 'dist/format.html': 'format.html' }
			}
		},
		clean:
		{
			release: ['dist/', 'build/']
		},
		cssmin:
		{
			release:
			{
				files: { 'build/min.css': 'css/*' }
			}
		},
		uglify:
		{
			release:
			{
				files: { 'build/min.js': ['lib/*.js', 'js/*.js'] }
			}
		},
		watch:
		{
			files: ['placeholders/*', 'format.html'],
			tasks: ['default']
		},
		yuidoc:
		{
			compile:
			{
				options: { paths: 'js/', outdir: 'doc/' }
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-bake');
	grunt.registerTask('default', ['bake:dev']);
	grunt.registerTask('doc', ['yuidoc']);
	grunt.registerTask('release', ['clean', 'cssmin', 'uglify', 'bake:release']);
};
