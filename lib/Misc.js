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
