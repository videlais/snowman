var ejs = require('ejs');
var exec = require('child-process-promise').exec;
var fs = require('fs');
var pkg = require('../package.json');
var shell = require('shelljs');
const CleanCSS = require('clean-css');

var encoding = { encoding: 'utf8' };

/**
 * Read through the 'src' and combine and process CSS files
 *
 * @function buildCSS
 * @returns {void} Does not return value
 */
function buildCSS () {
  shell.rm('-f', 'lib/src/format.css');
  shell.cat('lib/src/*.css').to('lib/src/format.css');
  const file = fs.readFileSync('lib/src/format.css');
  const output = new CleanCSS({ level: 2 }).minify(file);
  shell.rm('-f', 'lib/src/format.css');
  return output.styles;
}

Promise.all([
  buildCSS(),
  exec('browserify -g uglifyify lib/index.js -t [ babelify --presets [ @babel/env ] ]', { maxBuffer: Infinity })
]).then(function (results) {
  var distPath = 'dist/' + pkg.name.toLowerCase() + '-' + pkg.version;
  var htmlTemplate = ejs.compile(fs.readFileSync('lib/src/index.ejs', encoding));
  var formatData = {
    author: pkg.author.replace(/ <.*>/, ''),
    description: pkg.description,
    image: 'icon.svg',
    name: pkg.name,
    proofing: false,
    source: htmlTemplate({
      style: results[0],
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

  shell.cp('lib/src/icon.svg', distPath + '/icon.svg');
});
