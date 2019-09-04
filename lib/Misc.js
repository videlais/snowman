// Define either()
window.either = function() {

  var tempArray = [];
  var tPosition = 0;

  for(var i = 0; i < arguments.length; i++) {

    if(!(arguments[i] instanceof Array) ) {

      tempArray.push(arguments[i]);

    } else {

      for(var k = 0; k < arguments[i].length; k++) {

        tempArray.push(arguments[i][k]);

      }

    }

  }

  tPosition = _.random(tempArray.length - 1);
  return tempArray[tPosition];

};

// Define hasVisited()
window.hasVisited = function() {

  var p = null;

  if(arguments.length == 1) {

    p = window.story.passage(arguments[0]);

    if(p != null) {

      return window.story.history.includes(p.id);

    } else {

      return false;
    }

  } else {

    for(var i = 0; i < arguments.length; i++) {

      p = window.story.passage(arguments[i]);

      if(p == null || window.story.history.includes(p.id) == false) {
        return false;
      }

    }

    return true;

  }

};

// Define visited()
window.visited = function() {

  var counts = [];
  var count = [];

  for(var i = 0; i < arguments.length; i++) {

    var p = window.story.passage(arguments[i]);

    if( p != null) {

      count = window.story.history.filter(function(id) {

        return id == p.id;

      });

    }

    counts.push(count.length);

  }

  return Math.min(...counts);

};

window.renderToSelector = function(selector, passage) {

  var p = window.story.passage(passage);

  if(p != null) {

    $(selector).html(p.render());

  }

};

window.getStyles = function() {

  return $.when.apply($,
        $.map(arguments, function(url) {
            return $.get(url, function(css) {
                $("<style>" + css + "</style>").appendTo("head");
            });
        })
    );

};
