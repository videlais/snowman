module.exports = function (grunt)
{
	grunt.initConfig({
		bake:
		{
			dev:
			{
				options:
				{
					content:
					{
						dev: true
					}
				},

				files:
				{
					'index.html': 'format.html'
				}
			},

			release:
			{
				files:
				{
					'index.html': 'format.html'
				}
			}
		},
		watch:
		{
			files: ['placeholders/*', 'format.html'],
			tasks: ['default']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bake');
	grunt.registerTask('default', ['bake:dev']);
	grunt.registerTask('release', ['bake:release']);
};
