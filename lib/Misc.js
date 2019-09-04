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

  if(arguments.length == 1) {

    var p = window.story.passage(arguments[0]);

    if(p != null) {

      return window.story.history.includes(p.id);

    } else {

      return false;
    }

  } else {

    for(var i = 0; i < arguments.length; i++) {

      var p = window.story.passage(arguments[i]);

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

  for(var i = 0; i < arguments.length; i++) {

    var p = window.story.passage(arguments[i]);

    if( p != null) {

      var count = window.story.history.filter(function(id) {

        return id == p.id;

      }).length;

      counts.push(count);

    }

  }

  return Math.min(...counts);

};
