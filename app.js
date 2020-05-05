var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;

var interval;
var lives;
var mainMusic = new Audio('./resources/pacmanMusic.mp3');
var loseSound;
var winSound;
var boing;
var numOfBalls;
var colorBall5;
var colorBall15;
var colorBall25;
var numOfMonsters;
var gameDuration;
var extraTime;
var keyUp;
var keyDown;
var keyRight;
var keyLeft;
var keyDirection;
var foodLeftOnBoard;

var monster1 = new Object();
var monster2 = new Object();
var monster3 = new Object();
var monster4 = new Object();
monster1.id = 101;
monster2.id = 102;
monster3.id = 103;
monster4.id = 104;
monster1.behind = false;
monster2.behind = false;
monster3.behind = false;
monster4.behind = false;
var intervalMonsters;
var star = new Object();
var starinGame;
var intervalStar;
star.notSeen = 0;
star.id = 8;

var cherry = new Object();
var strawberry = new Object();
var firstCherry;
var firstStrawberry;
var cherryInGame;
var strawberryInGame;
var intervalCherry;
var intervalStrawberry;
cherry.id = 500;
strawberry.id = 600;
var blocked;
var isMeut =false;
var disapeerBoom = new Object();
disapeerBoom.i = null;
disapeerBoom.j = null;

var intervalBoom;

/*$(document).ready(function() {
	context = canvas.getContext("2d");
	Start();
});*/
function newGame(){
	//mainMusic.pause();
	mainMusic.currentTime = 0;
	window.clearInterval(interval);
	window.clearInterval(intervalMonsters);
	window.clearInterval(intervalStar);
	window.clearInterval(intervalStrawberry);
	window.clearInterval(intervalCherry);
	window.clearInterval(intervalBoom);
	Start();
}

function mute(){
	mainMusic.pause();
	loseSound.pause();
	boing.pause();
	$("#mute").hide();
	$("#unmute").show();
	isMeut = true;	
}
function unmute (){
	mainMusic.play();
	loseSound.play();
	boing.play();
	$("#unmute").hide();
	$("#mute").show();	
	isMeut = false;	
}

function Start() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 140;
	var food_remain = numOfBalls;
	foodLeftOnBoard = numOfBalls;
	var food_5_remain = Math.floor(numOfBalls*0.6);
	var food_15_remain = Math.floor(numOfBalls*0.3);
	var food_25_remain = food_remain-food_5_remain-food_15_remain;
	var pacman_remain = 1;
	var monsterCounter = 101;
	var numOfMonstersTemp = numOfMonsters;
	start_time = new Date();
	extraTime = 0;
	lives = 5;
	starinGame = true;
	cherryInGame = false;
	strawberryInGame = false;
	firstCherry = true;
	firstStrawberry = true;

	if(!isMeut){
		mainMusic.play();
	}
	loseSound = new Audio('./resources/loseSound.mp3');
	winSound = new Audio('./resources/winSound.mp3');
	boing = new Audio('./resources/boing.mp3');

	keyUp = $("#up_key").val();
	keyDown = $("#down_key").val();
	keyRight = $("#right_key").val();
	keyLeft = $("#left_key").val();

	for (var i = 0; i < 14; i++) {
		board[i] = new Array();
		for (var j = 0; j < 8; j++) {
			// place of monsters
			if(((i == 0 && j == 0) || (i == 0 && j == 7) || (i == 13 && j == 0) || (i == 13 && j == 7)) && numOfMonstersTemp > 0){
				board[i][j] = monsterCounter;
				monsterCounter++;
				numOfMonstersTemp--;
			}
			// walls
			else if((i == 4 && j == 1) || (i == 4 && j == 2) || (i == 1 && j == 2) || (i == 7 && j == 2) ||
			(i==7 && j==3) || (i==6 && j==2) || (i==5 && j==5) || (i==5 && j==6) || (i==11 && j==5) || (i==11 && j==6)||
			(i==12 && j==6) || (i==13 && j==6) || (i==2 && j==6) || (i==2 && j==7) || (i==12 && j==1)){
				board[i][j] = 4;
			}
			//star - 50 point
			else if(i == 4 && j == 0){
				board[i][j] = 8;
				star.i = i;
				star.j =j;
			}
			else {
				var randomNum = Math.random();
				// balls
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					var num = Math.random();
					if(num < 0.6 && food_5_remain > 0){
						food_5_remain--;
						board[i][j] = 5;
					}
					else if(num < 0.9 && food_15_remain > 0){
						food_15_remain--;
						board[i][j] = 15;
					}
					else if (food_25_remain > 0){
						food_25_remain--;
						board[i][j] = 25;
					}
				//pacman
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		food_remain--;
		var num = Math.random();
		if(num < 0.6 && food_5_remain > 0){
			food_5_remain--;
			board[emptyCell[0]][emptyCell[1]] = 5;
		}
		else if(num < 0.9 && food_15_remain > 0){
			food_15_remain--;
			board[emptyCell[0]][emptyCell[1]] = 15;
		}
		else if (food_25_remain > 0){
			food_25_remain--;
			board[emptyCell[0]][emptyCell[1]] = 25;
		}
	}
	/*if (pacman_remain == 1){
		var emptyCell = findRandomEmptyCell(board);
		shape.i = emptyCell[0];
		shape.j = emptyCell[1];
		pacman_remain--;
		board[i][j] = 2;
	}*/

	// add clock
	var emptyCell = findRandomEmptyCell(board);
	board[emptyCell[0]][emptyCell[1]] = 9;

	keysDown = {};
	addEventListener("keydown",	function(e) {
		if(e.key == keyUp)
		keysDown[keyUp] = true;
		if(e.key == keyDown)
		keysDown[keyDown] = true;
		if(e.key == keyRight)
		keysDown[keyRight] = true;
		if(e.key == keyLeft)
		keysDown[keyLeft] = true;
	},
	false
	);
	addEventListener("keyup",function(e) {
		keysDown[e.keyCode] = false;
	},
	false
	);

	interval = setInterval(UpdatePosition, 5);
	intervalMonsters = setInterval(monstersMove, 700);
	intervalStar = setInterval(starMove, 650);
	intervalCherry = setInterval(cherryMove, 4000);
	intervalStrawberry = setInterval(strawberryMove, 5000);
	intervalBoom = setInterval(moveBoom,1500);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 14);
	var j = Math.floor(Math.random() * 8);
	while (board[i][j] != 0) {	
		i = Math.floor(Math.random() * 14);
		j = Math.floor(Math.random() * 8);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[keyUp]) {
		keyDirection = "up";
		return 1;
	}
	if (keysDown[keyDown]) {
		keyDirection = "down";
		return 2;
	}
	if (keysDown[keyRight]) {
		keyDirection = "right";
		return 3;
	}
	if (keysDown[keyLeft]) {
		keyDirection = "left";
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 14; i++) {
		for (var j = 0; j < 8; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) { //place of pacman
				context.beginPath();
				if(keyDirection === "up"){//pacman move up
					context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI); // half circle up   
				}
				else if(keyDirection === "down"){//pacman move down
					context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI); // half circle down
				}
				else if(keyDirection === "left"){//pacman move left
					context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI); // half circle left
				}
				else {//pacman move right	
					context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle right
				}
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				if(keyDirection === "up"){//pacman move up
					context.arc(center.x + 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
				}
				else if(keyDirection === "down"){//pacman move down
					context.arc(center.x - 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
				}
				else if(keyDirection === "left"){//pacman move left
					context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				}
				else {//pacman move right
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				}
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 5) { // place of ball 5
				context.beginPath();
				context.arc(center.x, center.y, 6, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBall5; //color of 5
				context.fill();
			}
			else if (board[i][j] == 15) { // place of ball 15
				context.beginPath();
				context.arc(center.x, center.y, 9, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBall15; //color of 15
				context.fill();
			}
			else if (board[i][j] == 25) { // place of ball 25
				context.beginPath();
				context.arc(center.x, center.y, 12, 0, 2 * Math.PI); // circle
				context.fillStyle = colorBall25; //color of 25
				context.fill();
			}
			//ghost1
			else if(board[i][j] == 101){
				var ghost1Img = new Image;
				monster1.i = i;
				monster1.j = j;
				ghost1Img.src = "./resources/ghost1.png";
				context.beginPath();
				context.drawImage(ghost1Img,center.x - 30, center.y - 30, 60, 60 * ghost1Img.height / ghost1Img.width);	
			} 
			//ghost2
			else if(board[i][j] == 102){
				var ghost2Img = new Image;
				monster2.i = i;
				monster2.j = j;
				ghost2Img.src = "./resources/ghost2.png";
				context.beginPath();
				context.drawImage(ghost2Img,center.x - 30, center.y - 30, 60, 60 * ghost2Img.height / ghost2Img.width);
			} 
			//ghost3
			else if(board[i][j] == 103){
				var ghost3Img = new Image;
				monster3.i = i;
				monster3.j = j;
				ghost3Img.src = "./resources/ghost3.png";
				context.beginPath();
				context.drawImage(ghost3Img,center.x - 30, center.y - 30, 60, 60 * ghost3Img.height / ghost3Img.width);
			} 
			//ghost4
			else if(board[i][j] == 104){
				var ghost4Img = new Image;
				monster4.i = i;
				monster4.j = j;
				ghost4Img.src = "./resources/ghost4.png";
				context.beginPath();
				context.drawImage(ghost4Img,center.x - 30, center.y - 30, 60, 60 * ghost4Img.height / ghost4Img.width);
			}
			//wall
			else if (board[i][j] == 4) {
				var wallImg = new Image;
				wallImg.src="./resources/wall.png"
				context.beginPath();
				context.drawImage(wallImg,center.x - 30, center.y - 30, 60, 60 * wallImg.height / wallImg.width);
			}
			//clock
			else if (board[i][j] == 9) {
				var clockImg = new Image;
				clockImg.src="./resources/clock.png"
				context.beginPath();
				context.drawImage(clockImg,center.x - 30, center.y - 30, 60, 60 * clockImg.height / clockImg.width);
			}
			//star
			else if(board[i][j] == 8 && starinGame){
				var starImg = new Image;
				starImg.src = "./resources/star.png";
				context.beginPath();
				context.drawImage(starImg,center.x - 30, center.y - 30, 60, 60 * starImg.height / starImg.width);
			}
			//Cherry
			else if(board[i][j] == 500){				
				var cherryImg = new Image;
				cherryImg.src = "./resources/cherry.png";
				context.beginPath();
				context.drawImage(cherryImg,center.x - 30, center.y - 30, 60, 60 * cherryImg.height / cherryImg.width);
			}
			//strawberry
			else if (board[i][j] == 600){
				var strawberryImg = new Image;
				strawberryImg.src = "./resources/strawberry.png";
				context.beginPath();
				context.drawImage(strawberryImg,center.x - 30, center.y - 30, 60, 60 * strawberryImg.height / strawberryImg.width);
			}
			//boom
			else if (board[i][j] == 700){
				var boom = new Image;
				boom.src = "./resources/boom.png";		
				context.beginPath();
				context.drawImage(boom,center.x - 30, center.y - 30, 60, 60 * boom.height / boom.width);
				disapeerBoom.i = i;
				disapeerBoom.j = j;	
			}
		}
	}
}

function moveBoom() {
	if (disapeerBoom.i != null && disapeerBoom.j){
		board[disapeerBoom.i][disapeerBoom.j] = 0;
	}
}

function monstersMove() {
	if (numOfMonsters == 1) {
		if (UpdateNextStepMonster(monster1) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			GhostEatMe();
			board[0][0] = 101;
		}
	}
	else if (numOfMonsters == 2) {
		if (UpdateNextStepMonster(monster1) == false || UpdateNextStepMonster(monster2) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			GhostEatMe();
			board[0][0] = 101;
			board[0][7] = 102;
		}
	}
	else if (numOfMonsters == 3) {
		if (UpdateNextStepMonster(monster1) == false || UpdateNextStepMonster(monster2) == false || UpdateNextStepMonster(monster3) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			board[monster3.i][monster3.j] = monster3.notSeen;
			GhostEatMe();
			board[0][0] = 101;
			board[0][7] = 102;
			board[13][0] = 103;
		}
	}
	else if (numOfMonsters == 4) {
		if (UpdateNextStepMonster(monster1) == false || UpdateNextStepMonster(monster2) == false || UpdateNextStepMonster(monster3) == false || UpdateNextStepMonster(monster4) == false) {
			board[monster1.i][monster1.j] = monster1.notSeen;
			board[monster2.i][monster2.j] = monster2.notSeen;
			board[monster3.i][monster3.j] = monster3.notSeen;
			board[monster4.i][monster4.j] = monster4.notSeen;
			GhostEatMe();
			board[0][0] = 101;
			board[0][7] = 102;
			board[13][0] = 103;
			board[13][7] = 104;
		}
	}
}


function strawberryMove(){
	if(foodLeftOnBoard <= 80){
		if (firstStrawberry){
			var emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = 600;
			strawberry.i = emptyCell[0];
			strawberry.j = emptyCell[1];
			firstStrawberry = false;
		}
		else{
			var ranNumStraw = Math.floor(Math.random() * (3 - 1) + 1);
			if (ranNumStraw == 2){
				var emptyCell = findRandomEmptyCell(board);
				board[strawberry.i][strawberry.j] = 0;
				board[emptyCell[0]][emptyCell[1]] = 600;
				strawberry.i = emptyCell[0];
				strawberry.j = emptyCell[1];
			}
			else{
				board[strawberry.i][strawberry.j] = 0;
			}
		}
	}
}
function cherryMove(){
	if(foodLeftOnBoard <= 80){
		if (firstCherry){
			var emptyCell = findRandomEmptyCell(board);
			board[emptyCell[0]][emptyCell[1]] = 500;
			cherry.i = emptyCell[0];
			cherry.j = emptyCell[1];
			firstCherry = false;
		}
		else{
			var ranNumCherry = Math.floor(Math.random() * (3 - 1) + 1);
			if (ranNumCherry == 2){
				var emptyCell = findRandomEmptyCell(board);
				board[cherry.i][cherry.j] = 0;
				board[emptyCell[0]][emptyCell[1]] = 500;
				cherry.i = emptyCell[0];
				cherry.j = emptyCell[1];
			}
			else{
				board[cherry.i][cherry.j] = 0;
			}
		}
	}
	
}

function starMove(){
	if(starinGame && UpdateNextStepMonster(star) == false){ //pacman eat me
		board[star.i][star.j] = 0;
		starinGame = false;
		score = score +50 +star.notSeen;
		star.notSeen = 0;
	}
}

function GhostEatMe(){
	//mainMusic.pause();
	board[shape.i][shape.j] = 700;
	//mainMusic.play();
	if(!isMeut){
		boing.play();
	}
	lives--;
	score = score - 10;
	var emptyCell = findRandomEmptyCell(board);
	shape.i = emptyCell[0];
	shape.j = emptyCell[1];
	board[shape.i][shape.j] = 2;
	document.getElementById('showScore').innerHTML = score;
	document.getElementById('showLives').innerHTML = lives;
}

function isMonster(monster){
	if(monster.id == 101 || monster.id == 102 || monster.id == 103 || monster.id == 104){
		return true;
	}
	return false;
}

function iAmClose(monster){
	if(isMonster(monster)){
		if(monster.j > shape.j){ //up
			return 1; 
		}
		if(monster.j < shape.j){ //down
			return 2;
		}
		if(monster.i < shape.i){ //right
			return 3; 
		}
		if(monster.i < shape.i){ //left
			return 4;
		}
	}
	else{
		return 0;
	}
}

function UpdateNextStepMonster(monster) {
	var x=monster.i;
	var y= monster.j;
	var move;
	var priority = iAmClose(monster);
	var monsterCanMove = false;
	var firstTry = true;
	var try1 = 0;
	var try2 = 0;
	var try3 = 0;
	var try4 = 0;
	var tryAllMoves = 0;
	while ((!monsterCanMove  && tryAllMoves < 10)){
		if(priority > 0 && firstTry){
			move = priority;
			firstTry = false;
		}
		else{
			move = Math.floor(Math.random() * 5 + 1);
		}
		
		if (move == 1) { // up
			if (y > 0 && board[x][y-1] != 4 && board[x][y-1]!= 3 && board[x][y-1] != 101 && board[x][y-1] != 102 && board[x][y-1] != 103 && board[x][y-1] != 104 && board[x][y-1] != 8 && board[x][y-1] != 9 && board[x][y-1] != 500 && board[x][y-1] != 600) {
				y = y -1;
				monsterCanMove=true;
				try1 = 1;
			}	
		}
		if (move == 2) { //down
			if (y < 7 &&  board[x][y+1] != 4 && board[x][y+1]!= 3 && board[x][y+1] != 101 && board[x][y+1] != 102 && board[x][y+1] != 103 && board[x][y+1] != 104 && board[x][y+1] != 8 && board[x][y+1] != 9 && board[x][y+1] != 500 && board[x][y+1] != 600) {
				y = y +1;
				monsterCanMove =true;
				tryAllMoves = tryAllMoves+2;
				try2 =2;
			}	
		} 
		if (move == 3) { //right
			if (x < 13 && board[x+1][y] != 4 && board[x+1][y]!= 3 && board[x+1][y] != 101 && board[x+1][y] != 102 && board[x+1][y] != 103 && board[x+1][y] != 104 && board[x+1][y] != 8 && board[x+1][y] != 9 && board[x+1][y] != 500 && board[x+1][y] != 600) {
				x = x +1;
				monsterCanMove =true;
				try3=3;
			}
		}
		if (move == 4) { //left
			if (x > 0 &&  board[x-1][y] != 4 && board[x-1][y]!= 3 && board[x-1][y]!= 101 && board[x-1][y]!= 102 && board[x-1][y]!= 103 && board[x-1][y]!= 104 && board[x-1][y] != 8 && board[x-1][y] != 9 && board[x-1][y] != 500 && board[x-1][y] != 600) {
				x = x -1;
				monsterCanMove =true;
				try4=4;
			}
		}
		tryAllMoves = try1+try2+try3+try4;	
	}
	board[monster.i][monster.j] = monster.notSeen;
	monster.i = x;
	monster.j = y;
	if (board[monster.i][monster.j] == 2) {	
		return false; //lose
	}
	else if (board[monster.i][monster.j] == 0 || board[monster.i][monster.j] == 5 || board[monster.i][monster.j] == 15 || board[monster.i][monster.j] == 25) {	
		monster.notSeen = board[monster.i][monster.j];
	}
	board[monster.i][monster.j] = monster.id;
	return true;
	}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 7 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i < 13 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
		
	}
	if (x == 4) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (board[shape.i][shape.j] == 5) {
		score+= 5;
		board[shape.i][shape.j] = 0;
		foodLeftOnBoard--;
	}
	else if(board[shape.i][shape.j] == 15){
		score+= 15;
		board[shape.i][shape.j] = 0;
		foodLeftOnBoard--;
	}
	else if(board[shape.i][shape.j] == 25){
		score+= 25;
		board[shape.i][shape.j] = 0;
		foodLeftOnBoard--;
	}
	else if(board[shape.i][shape.j] == 101 || board[shape.i][shape.j] == 102 || board[shape.i][shape.j] == 103 || board[shape.i][shape.j] == 104){
		monstersMove();
		board[shape.i][shape.j]=700;
	}
	else if(board[shape.i][shape.j] == 8){
		score+= 50;
		board[shape.i][shape.j] = star.notSeen;
		starinGame = false;
	}
	else if(board[shape.i][shape.j] == 9){
		extraTime = 20;
		board[shape.i][shape.j] == 0;
	}	
	else if(board[shape.i][shape.j] == 500){
		score = score + 30;
		board[shape.i][shape.j] = 0;
	}
	else if(board[shape.i][shape.j] == 600){
		score = score + 30;
		board[shape.i][shape.j] = 0;
	} 

	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = gameDuration + extraTime - (currentTime - start_time) / 1000;
	time_elapsed = time_elapsed.toFixed(2);
	document.getElementById('showTime').innerHTML = time_elapsed;
	document.getElementById('showScore').innerHTML = score;
	document.getElementById('showLives').innerHTML = lives;
	keysDown[keyUp] = false;
	keysDown[keyDown] = false;
	keysDown[keyRight] = false;
	keysDown[keyLeft] = false;
	/*if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}*/

	if(lives == 0){
		mainMusic.pause();
		mainMusic.currentTime = 0;
		if(!isMeut){
			loseSound.play();
		}
		window.alert("Loser!");
		window.clearInterval(interval);
		window.clearInterval(intervalMonsters);
		window.clearInterval(intervalStar);
		window.clearInterval(intervalStrawberry);
		window.clearInterval(intervalCherry);
		window.clearInterval(intervalBoom);

	}
	else if (time_elapsed <= 0.00){
		if (score < 100){
			mainMusic.pause();
			mainMusic.currentTime = 0;
			if(!isMeut){
				loseSound.play();
			}
			window.alert("You are better than " + score + " points!");
			window.clearInterval(interval);
			window.clearInterval(intervalMonsters);
			window.clearInterval(intervalStar);
			window.clearInterval(intervalStrawberry);
			window.clearInterval(intervalCherry);
			window.clearInterval(intervalBoom);

		}
		else{
			mainMusic.pause();
			mainMusic.currentTime = 0;
			if(!isMeut){
				winSound.play();
			}
			window.alert("Winner!!!");
			window.clearInterval(interval);
			window.clearInterval(intervalMonsters);
			window.clearInterval(intervalStar);
			window.clearInterval(intervalStrawberry);
			window.clearInterval(intervalCherry);
			window.clearInterval(intervalBoom);

		}
	}
	else {
		Draw();
	}
}
