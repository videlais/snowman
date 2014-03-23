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
		}
	});

	grunt.loadNpmTasks('grunt-bake');
	grunt.registerTask('default', ['bake:dev']);
};
