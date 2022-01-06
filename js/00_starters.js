// universal variables
let actionKeys = {esc:   27, //escape
				  mute:  77, //m
				  pause: 13, //enter 
				  act:   32, //space
				  stp:    0,
				  upx1:  80, //p
				  upx2:  79, //o
				  dwx1:  76, //l
				  dwx2:  75, //k
				  upy1:  81, //q
				  upy2:  87, //w
				  dwy1:  65, //a
				  dwy2:  83, //s
				  up:    38,
				  down:  40,
				  left:  37,
				  right: 39,
				  plus: 107, //+
				  minus:109, //-
				  next:  78  //n
				  };
				  
var pathmusic  = './music/';
var songs = {'cover'        :'majestygood.mp3',
			 'club'         :'sweet.mp3',
			 'policestation':'gangsta.mp3',
			 'motel'        :'nothing.mp3'};
			 
// Define html elements: canvas, context and music
var     canvas,     context;
var  txtcanvas,  txtcontext;
var backcanvas, backcontext;
var music;
 
// Define the image dimensions
var LI = 320, LJ = 180, width, height, scale;

// time, chapter, rooms, room or cover?
var t, chapter, room, preRoom, RGBcover=0;

// first frame in the room? first time in teleporter because you just apperaed there?
var firstEntry = true, 
	firstTimeOnTeleporter = true;

// Objects
var objects = ['mano','gun'], 
    objectIndex = 0;

// List of text and properties
var listText = [];

// List of actions in the room
var actions = [];

// List of stuff in the room. Index to find the guy in the list. The guy.
var stuff = {'background':[],'front':[]},
	guyIndex,
	guy   = {'folder':'guy_cool','file':'m0_01N','X':0,'Y':0,'Z':0,'state':0},
	space = {'open':[],'solid':[]};

// Keys down and other control variables
var keys = [],
	mute  = false,
	pause = false,
	menuIndex, songIndex;

// Actions are on? and other action stuff
var actionOn  = false; keyOn = 'stp0';

// Cinematics? Array witha sequence of actions. Keep keys block during cinematics.
var cinematics = [], 
	blockKeys = false;

// debugging
var tempo=0,nt=0;


// Pixel functions ----------------------------------------------------------------------------------
function B(a,b) {
	return 8*a+b;
}
function D(a,b) {
	return 12*a+b;
}
function XY2I(x,y) {
    return (Math.round(x)-Math.round(y))*2;
}
function XYZ2J(x,y,z) {
    return Math.round(x)+Math.round(y)+Math.round(z);
}

// Collision function -------------------------------------------------------------------------------
function collisionExtended(rect1,rect2) {
	return ( rect1.X <= rect2.XM && rect1.XM >= rect2.X &&
			 rect1.Y <= rect2.YM && rect1.YM >= rect2.Y    );	
}
function collision(rect1,rect2) {
	return ( rect1.X < rect2.XM && rect1.XM > rect2.X &&
			 rect1.Y < rect2.YM && rect1.YM > rect2.Y    );	
}
//--------------------------------------------------------------------------------------------------

				  
// START PRESSING ANY KEY (JUST ONCE) ---------------------------------------------------------------

document.addEventListener('keydown', function(e) {
	if (firstEntry) { 
		start(); 
	}
});

// Set CSS size
function setSize3(){
	    canvas.style.width  = (scale*width).toString()+"px"
	    canvas.style.height = (scale*height).toString()+"px"
	 txtcanvas.style.width  = canvas.style.width;
	 txtcanvas.style.height = canvas.style.height;
	backcanvas.style.width  = canvas.style.width;
	backcanvas.style.height = canvas.style.height;	
}

// GO FOR IT //--------------------------------------------------------------------------------------

function start() {
	
	// Get elements from html: canvas and context & music
	canvas      = document.getElementById("canvas"); 
	context     = canvas.getContext("2d");
	txtcanvas   = document.getElementById("text"); 
	txtcontext  = txtcanvas.getContext("2d");
	backcanvas  = document.getElementById("back"); 
	backcontext = backcanvas.getContext("2d");
	
	music = document.getElementById('music');
		
	// Define the image dimensions
	width  = canvas.width;
	height = canvas.height;
	
	// Set CSS size
	scale = 2;
	setSize3()
	
	// Initiate time
	t = 0; 
	chapter = 0;
		
	// Initiate indices
    menuIndex   = 0;
	objectIndex = 0;
	
	// Initiate key list
	keys = [];
	for (var k = 0; k < 256; ++k) {
		keys[k] = 0;
	}	 		
	
	// Initiate music
	//music.src = pathmusic+songs[songIndex];
	//music.play();
	
	// enter in the room for the first time
	objects = ['mano','gun'];
	room = 'void';
	preRoom = 'void';
	actions = [{'ID':'room','function':'changeroom','arguments':["hotel_room_5"]}]; 
	guy = {'folder':'guy_cool','file':'m0_01N','X':0,'Y':0,'Z':0,'state':0};
	 
    // Initiate loop
    canvas.interval = setInterval(updateit, 1000/15);
	
}
	
// MAIN LOOP //----------------------------------------------------------------------------------

function updateit() {

	// Update time to whatever is convenient
	if (!pause) {
		t = (t+1)%256;
	}
	
	// update all stuff
	updateKeys();	
	updateMusic();
	if (!pause) {	
		if (!blockKeys) walkingGuy();
		updateAction();	
		updateImage();
	}
	
}//----------------------------------------------------------------------------------------------

function updateKeys() {
	
	// Track which keys are down (we count it to detect the first time it's down)
    window.addEventListener('keydown', function (e) {
	
		keys[e.keyCode] += 1;
		
		// Pause, mute, +, - : have efect only the first time
		if        ( keys[actionKeys.pause] == 1 ) {                           // PAUSE
			pause = !pause;
		} else if ( keys[actionKeys.mute ] == 1 && !pause ) {                 // MUTE MUSIC
			mute = !mute;			
		} else if ( keys[actionKeys.plus ] == 1 ) {                           // RESOLUTION UP
			scale += 1;		
		} else if ( keys[actionKeys.minus] == 1 ) {                           // RESOLUTION DOWN
			scale = Math.max(1,scale-1);
		} else if ( keys[actionKeys.next] == 1 && !pause ) {                  // NEXT SONG
			songIndex = (songIndex+1)%songs.length;
		} else if ( keys[actionKeys.up]   == 1 && !pause && !blockKeys ) {    // MENU UP
			menuIndex = Math.min(2,menuIndex+1);
		} else if ( keys[actionKeys.down] == 1 && !pause && !blockKeys ) {    // MENU DOWN
			menuIndex = Math.max(0,menuIndex-1);
		} else if ( keys[actionKeys.right] == 1 && !pause ) {                 // OBJECT RIGHT
			objectIndex = Math.min(objects.length-1,objectIndex+1);
		} else if ( keys[actionKeys.left]  == 1 && !pause ) {                 // OBJECT LEFT
			objectIndex = Math.max(0,objectIndex-1);
		} else if ( keys[actionKeys.act] == 1 && !pause && !blockKeys  ) {    // ACTION
			actionOn = !actionOn;	
		}		
		
		
    })
	//console.log(keys[actionKeys.esc] != 0)
	
	// Track which keys are up
    window.addEventListener('keyup', function (e) {
		keys[e.keyCode] = 0;
    })
	
	// select key to action
	keyOn = 'stp0';
	var moves = [['upx1',keys[actionKeys.upx1]],['dwx1',keys[actionKeys.dwx1]],['upy1',keys[actionKeys.upy1]],['dwy1',keys[actionKeys.dwy1]],
	             ['upx2',keys[actionKeys.upx2]],['dwx2',keys[actionKeys.dwx2]],['upy2',keys[actionKeys.upy2]],['dwy2',keys[actionKeys.dwy2]]];
	moves.sort(function(a, b) {return a[1] < b[1];});
    for (var k=0;k<8; ++k) {
        if (moves[k][1] != 0) keyOn = moves[k][0];
    }
	//console.log(key,guyIndex)
	
}//----------------------------------------------------------------------------------------------

function updateMusic() {
	
	/*// change the song
	if (keys[actionKeys.next]) {
		music.pause();
		music.src = pathmusic+songs[songIndex];
		music.play();
	}*/
	
	// mute the song: times continues
	if (keys[actionKeys.mute] && mute) {
		music.volume=0;
	} else if (keys[actionKeys.mute] && !mute) {
		music.volume=1;
	}
	
	// pause the song: time stops
	if (keys[actionKeys.pause] && pause) {
		music.pause();
	} else if (keys[actionKeys.pause] && !pause) {
		music.play();
	}
	
}//----------------------------------------------------------------------------------------------



function updateAction() {
	
	
	// Evaluate cinematics if it's on
	if (cinematics.length>0) {
		
		//console.log(t,'A',cinematics.length,blockKeys,cinematics[0])
		eval(cinematics[0]+';');
		cinematics.shift();
		blockKeys = !(cinematics.length==0);
		
	}
	
	// Evaluate actions array
	for (var k=0; k<actions.length; ++k) {
		
		// Get guys position in case
		var g = stuff['front'][guyIndex];
		// get action and check collision if needed
		var act  = actions[k];
		var col  = 'Z' in act ? collision(g,act) : true ;
		var Zbol = 'Z' in act ? g.Z==act.Z       : true ;
		
		// add collision and Z as arguments to evaluate. Check numbers and strings in the argument list
		var args = [col,Zbol,actionOn];
		var argsact = act['arguments'].map(function(x){return (typeof x === 'string' || x instanceof String) ? '"'+x+'"' : x });
		
		// evaluate the function, taking care of the JS syntax
		eval(act['function']+'('+args.concat(argsact).join(',')+')');
	}	
		
	actionOn = false;

		
}//----------------------------------------------------------------------------------------------

function updateImage() {
	
	// set CSS to scale
	if (keys[actionKeys.minus]||keys[actionKeys.plus]) setSize3()
			
    // Create the image and draw the image data to the canvas
	drawCanvasTime(false)
}

function drawCanvasTime(bo) {
	if (bo) {
		var startTime = performance.now()
		drawCanvas()
		var endTime = performance.now()
		tempo += endTime - startTime
		++nt
		console.log(`Call createImage ${endTime - startTime} ms`)
		console.log(tempo/nt)	
	} else { 
		drawCanvas(); 
	}
}//----------------------------------------------------------------------------------------------





