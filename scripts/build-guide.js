var fs = require('fs');
var pkg = require('../package.json');
var twine = require('twine-utils');

var distPath = 'dist/' + pkg.name.toLowerCase() + '-' + pkg.version;
var encoding = { encoding: 'utf8' };
var format = new twine.StoryFormat(fs.readFileSync(distPath + '/format.js', encoding));
var guide = new twine.Story({ title: 'Snowman Guide' });

guide.mergeTwee(fs.readFileSync('guide/guide.txt', encoding));
guide.setStartByName('Welcome');
fs.writeFileSync('dist/guide.html', format.publish(guide), encoding);
