var initialize = false;
var userColor = "";
var cpuColor = "";
var yourTurn = false;
var firstMove = false;
var board = [];
var cpuVictory = false;
var rowKey = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"];
var victory = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var sides = [1,3,5,7];
var corners = [0,2,6,8];
var cornerPairs = [[0,8],[2,6]];
var boardStart = ["Def", "Def", "Def", "Def", "Def", "Def", "Def", "Def", "Def"];
var timeoutID;
var timeoutIDTwo;


// Function to handle message changes.
var changeMessage = function(message){
  $("#message").animate({opacity: 0}, 250, function(){
      $("#message").text(message);
      $("#message").animate({opacity: 1}, 250);
  });
}

//Loads the choose color option onto the DOM
var setColor = function(){
  changeMessage("choose a color");
  $("body").append('<div id="choose"><div class="choice"><div class="circle blue" id="blue"></div></div><div class="choice"><div class="circle red" id="red"></div></div></div><div class="message-wrap"><p class="text-center" id="signature"><em>Tic Tac Toe</em> - written by QuanchiFootball</p></div>');
  $("#choose").hide().fadeIn(1000);
  $("#signature").hide().fadeIn(1000);
}

//Handles user color choice
var sidePicker = function(side){
  if(side == "red"){
    userColor = side;
    cpuColor = "blue";
  } else if (side == "blue"){
    userColor = side;
    cpuColor = "red";
  }
  initialize = true;
  loadBoard();
}
//Loads the game board
var loadBoard = function(){
  $("#choose").remove();
  $("#signature").remove();
  $("body").append('<div class="container" id="dividers"><table><tr id="rowZero"><td id="zero"></td><td id="one"></td><td id="two"></td></tr><tr id="rowOne"><td id="three"></td><td id="four"></td><td id="five"></td></tr><tr id="rowTwo"><td id="six"></td><td id="seven"></td><td id="eight"></td></tr></table></div>');
  $("#dividers").hide().fadeIn(1000);
  board = boardStart.slice();
  whoStarts();
}
//Flips a coin to determine who goes first.
var whoStarts = function(){
  yourTurn = (Math.round(Math.random()) == 1 ? true : true);
  if(yourTurn){
    changeMessage("your turn");
  } else {
    firstMove = true;
    timeoutID = window.setTimeout(cpuTurn, 1000);
  }
}
//sets the marker down on the chosen square
var drawCircle = function(numberString, color){
  $("#"+numberString).html('<div class="circle '+color+'"><div class="inner"></div></div>');
  $("#"+numberString + "> .circle").animate({opacity:1},500);
}
//Handles user turn sequence
var addMarker = function(spot){
  if(board[rowKey.indexOf(spot)] == "Def"){
    board[rowKey.indexOf(spot)] = "User";
  } else {
    return;
  }
  drawCircle(spot, userColor);
  timeoutID = window.setTimeout(gameOver, 500);
}
//Handles CPU turn sequence
var cpuTurn = function(){
  changeMessage("cpu turn");
  timeoutIDTwo = window.setTimeout(cpuTurnLogic, 600);
  timeoutID = window.setTimeout(gameOver, 1200);
  
}

var flash = function(playerString){
  victory.forEach(function(arr){
    var count = 0;
    arr.forEach(function(key){
      if(board[key]==playerString){
        count++;
      }
    });
    if(count == 3){
      $("#"+rowKey[arr[0]] + "> .circle").addClass("animated flash");
      $("#"+rowKey[arr[1]] + "> .circle").addClass("animated flash");
      $("#"+rowKey[arr[2]] + "> .circle").addClass("animated flash");
    }
  });
}

//Check whether user has won
var hasUserWon = function(){
  for(var i = 0; i<victory.length;i++){
    var count = 0;
    var arr = victory[i];
    for(var j = 0; j < arr.length; j++){
      if(arr[j] == "User"){
        count++
      }
    };
    if(count == 3){
      return true;
    }
  }
  return false;
}

//Check if the game will end in a draw.
var gameDraw = function(){
  if(!board.includes("Def")){
    return true;
  }
  return false;
}

//Handles game over sequence
var gameOver = function(){
  if(cpuVictory){
    changeMessage("sorry, cpu wins");
    flash("CPU");
    resetter();
    return;
  }
  if(hasUserWon()){
    changeMessage("congrats, you win");
    flash("User");
    resetter();
    return;
  }
  if(gameDraw()){
    changeMessage("it's a draw");
    resetter();
    return;
  }
  if(yourTurn){
    yourTurn = false;
    cpuTurn();
  } else {
    yourTurn = true;
    changeMessage("your turn");
  }
}

var resetter = function(){
  timeoutID = window.setTimeout(wiper, 3000);
}

var wiper = function(){
  initialize = false;
  userColor = "";
  cpuColor = "";
  yourTurn = false;
  firstMove = false;
  board = [];
  cpuVictory = false;
  $("#dividers").animate({opacity:0}, 500, function(){
    $("#dividers").remove();
    changeMessage("choose a color");
    setColor();
  });
}

//CPU TURN LOGIC BEGIN

var winOrBlock = function(spaceString){
  var count = 0;
  var def = 0;
  for(var i = 0; i < victory.length; i++){
    var arr = victory[i];
    var defKey = null;
    for(var j = 0; j<arr.length;j++){
      var key = arr[j];
      if(board[key] == spaceString){
        count++;
      } else if(board[key] == "Def") {
        def++;
        defKey = key;
      }
    };
    if(count == 2 && def == 1){
      board[defKey] = "CPU";
      drawCircle(rowKey[defKey], cpuColor);
      return true;
    }
    count = 0;
    def = 0;
  };
  return false;
}

var forkMove = function(){
  for(var i = 0; i<board.length; i++){
    if(board[i] == "Def"){
      board[i] = "CPU";
      if(forkCheckBoolean("CPU")){
        drawCircle(rowKey[i], cpuColor);
        return true;
      } else {
        board[i] = "Def";
      }
    }
  };
  return false;
}

var forkCheckBoolean = function(spotString){
  var count = 0;
  var def = 0;
  var opp = 0;
  victory.forEach(function(arr){
    arr.forEach(function(key){
      if(board[key] == spotString){
        count++;
      } else if(board[key] == "Def") {
        def++;
      }
    });
    if(count == 2 && def == 1){
      opp++;
    }
    count = 0;
    def = 0;
  });
  if(opp == 2){
    return true;
  } else {
    return false;
  }
}

var blockUserFork = function(){
  for(var i = 0; i<board.length; i++){
    var userCorners = 0;
    if(board[i] == "Def"){
      board[i] = "User";
      if(forkCheckBoolean("User")){
        board[i] = "Def";
        corners.forEach(function(key){
          if(board[key] == "User"){
            userCorners++;
          }
        });
        if(userCorners == 2){
          return empty(sides);
        } else {
          return empty(corners);
        }
      } else {
        board[i] = "Def";
      }
    }
  }
  return false;
}

var makeFirstMove = function(){
  if(!firstMove){
     return false;
  }
  firstMove = false;
  var coin = Math.round(Math.random());
  if(coin === 0){
    return centerMove();
  } else {
    var randomCorner = corners[Math.floor(Math.random()*corners.length)];
    board[randomCorner] = "CPU";
    drawCircle(rowKey[randomCorner], cpuColor);
    return true;
  }
}

var centerMove = function(){
  if(board[4] == "Def"){
    board[4] = "CPU";
    drawCircle(rowKey[4], cpuColor);
    return true;
  } else {
    return false;
  }
}

var cornerCheck = function(){
  for(var i = 0; i < cornerPairs.length; i++){
    var user = null;
    var def = null;
    for(var j = 0;j< cornerPairs[i].length;j++){
      var key = cornerPairs[i][j];
      if(board[key] == "User"){
        user = key;
      } else if(board[key] == "Def"){
        def = key;
      }
    }
    if(user != null && def != null){
      board[def] = "CPU";
      drawCircle(rowKey[def], cpuColor);
      return true;
    }
  }
  return false;
}

var empty = function(array){
  var emptySpaces = [];
  for(var i = 0; i<array.length;i++){
    var key = array[i]
    if(board[key] == "Def"){
      emptySpaces.push(key);
    }
  };
  if(emptySpaces.length > 0){
    var random = emptySpaces[Math.floor(Math.random()*emptySpaces.length)];
    board[random] = "CPU";
    drawCircle(rowKey[random], cpuColor);
    return true;
  }
  return false;
}

var cpuTurnLogic = function(){
  //WINNING MOVE
  var winGame = winOrBlock("CPU");
  if(winGame){
    cpuVictory = true;
    return true;
  }
  //BLOCK USER FROM WINNING
  var blockUser = winOrBlock("User");
  if(blockUser){
    return true;
  }
  //CREATE TWO ROWS WITH TWO MARKERS
  var tryForkMove = forkMove();
  if(tryForkMove){
    return true;
  }
  //BLOCK OPPONENT FROM FORKING
  var tryForkBlock = blockUserFork();
  if(tryForkBlock){
    return true;
  }
  // FIRST MOVE either corner or center
  if(makeFirstMove()){
    return true;
  };
  // CENTER
  var tryCenter = centerMove();
  if(tryCenter){
    return true;
  }
  // OPPOSITE CORNER
  var tryCornerCheck = cornerCheck();
  if(tryCornerCheck){
    return true;
  }
  // EMPTY CORNER
  var tryEmptyCorner = empty(corners);
  if(tryEmptyCorner){
    return true;
  }
  // EMPTY SIDE
  var tryEmptySide = empty(sides);
  if(tryEmptySide){
    return true;
  }
}

//CPU TURN STUFF END

$(document).ready(function(){
  setColor(); 
  $(document).on("click", ".circle", function(){
    if(!initialize){
      sidePicker($(this).attr('id'));
    }
  });
  
  $(document).on("click", "td", function(){
    if(yourTurn){
      addMarker($(this).attr('id'));
    }
  });
});