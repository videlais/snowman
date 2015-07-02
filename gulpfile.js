var gulp = require('gulp');
var formatJson = require('./format.json');
var del = require('del');
var fs = require('fs');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var include = require('gulp-include');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');
var yuidoc = require('gulp-yuidoc');

gulp.task('jshint', function()
{
	gulp.src('js/*.js')
	    .pipe(plumber())
		.pipe(jshint({
			globals:
			{
				jQuery: true,
				$: true,
				_: true,
				marked: true,
				LZString: true,
				Passage: true,
				Story: true
			},
			globalstrict: true, // OK to use 'use strict'; instead of function
			"-W032": true, // Unnecessary semicolon
			browser: true,
			devel: true
		}))
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('doc', function()
{
	gulp.src('js/*.js')
	    .pipe(plumber())
		.pipe(yuidoc())
		.pipe(gulp.dest('doc/'));
});

gulp.task('clean', function (cb)
{
	del.sync('build/');
	del('dist/', cb);
});

// default bake bakes a development version to index.html

gulp.task('bake', function()
{
	gulp.src('format.html')
	    .pipe(plumber())
	    .pipe(include())
		.pipe(rename('index.html'))
		.pipe(gulp.dest('./'));
});

// bake for release replaces includes with actual placeholders
// and minifies the whole shebang into a single file in build/,
// which our build staging area

gulp.task('bake:release', function()
{
	return gulp.src('format.html')
	            .pipe(plumber())
		        .pipe(replace('//= include data/name.txt', '{{STORY_NAME}}'))
		        .pipe(replace('//= include data/passages.html', '{{STORY_DATA}}'))
		        .pipe(usemin({
			    	css: [minifyCss()],
			    	html: [minifyHtml()],
			    	js: [uglify()]
		        }))
		        .pipe(gulp.dest('build/'));
});

gulp.task('copy', function()
{
	return gulp.src(formatJson.image)
	           .pipe(gulp.dest('dist/' + formatJson.name));
});

gulp.task('release', ['bake:release', 'copy'], function (cb)
{
	// merge format.html into format.json

	formatJson.source = fs.readFileSync('build/format.html', 'utf-8');

	// inline CSS and JS

	var css = fs.readFileSync('build/min.css', 'utf-8');
	var js = fs.readFileSync('build/min.js', 'utf-8');

	formatJson.source = formatJson.source.replace(/<link .*?min\.css.*?>/i, '<style>' + css + '</style>');
	formatJson.source = formatJson.source.replace(/<script .*?min\.js.*?>/i, '<script>' + js + '</script>');

	// save it to dist/Snowman/format.js

	var distPath = 'dist/' + formatJson.name + '/';

	if (! fs.existsSync(distPath))
		fs.mkdirSync(distPath);

	fs.writeFileSync(distPath + 'format.js', 'window.storyFormat(' + JSON.stringify(formatJson) + ')');
	cb();
});

gulp.task('default', ['jshint', 'bake', 'doc']);

gulp.task('watch', function()
{
	gulp.watch(['js/*.js', 'format.html', 'data/*'], ['bake']);
	gulp.watch('js/*.js', ['jshint', 'doc']);
});
