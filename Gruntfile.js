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
				files: { 'index.html': 'format.html' }
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

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-bake');
	grunt.registerTask('default', ['bake:dev']);
	grunt.registerTask('doc', ['yuidoc']);
	grunt.registerTask('release', ['bake:release']);
};
