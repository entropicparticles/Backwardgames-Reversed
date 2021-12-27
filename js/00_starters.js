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
var songs = ['majestygood.mp3'];

// Define html elements: canvas, context and music
var     canvas,     context;
var  txtcanvas,  txtcontext;
var backcanvas, backcontext;
var music;
 
// Define the image dimensions
var LI = 320, LJ = 180, width, height, scale;

// time, chapter, rooms, room or cover?
var t, chapter, room, preRoom, RGBcover=0;

// Objects
var objects = ['mano','gun','maletin','roomkey'];

// List of text and properties
var listText = [];

// List of actions in the room
var actions = {'background':[],'front':[]};

// List of stuff in the room
var stuff = {'background':[],'front':[]};

// Keys down and other control variables
var keys = [];
var mute  = false;
var pause = false;
var blockKeys = false;
var menuIndex, objectIndex, songIndex;

// Actions are on?
var actionOn  = false;

// debugging
var tempo=0,n=0;

// Pixel functions
function B(a,b) {
	return 8*a+b;
}
function XY2I(x,y) {
    return (Math.round(x)-Math.round(y))*2;
}
function XYZ2J(x,y,z) {
    return Math.round(x)+Math.round(y)+Math.round(z);
}

				  
// START PRESSING ANY KEY (JUST ONCE) ---------------------------------------------------------------

var firstEntry = true;
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
	
	// Get the canvas and context
	canvas      = document.getElementById("canvas"); 
	context     = canvas.getContext("2d");
	txtcanvas   = document.getElementById("text"); 
	txtcontext  = txtcanvas.getContext("2d");
	backcanvas  = document.getElementById("back"); 
	backcontext = backcanvas.getContext("2d");
		
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
    menuIndex   = 2;
	objectIndex = 0;
	songIndex   = 0;
	
	// Initiate key list
	keys = [];
	for (var k = 0; k < 256; ++k) {
		keys[k] = 0;
	}	
 		
	// Initiate music
	music = document.getElementById('music');
	music.src = pathmusic+songs[songIndex];
	music.play();
	
	// enter in the room for the first time
	room = 'cover';
	preRoom = 'void';
	actions['background'] = [{'ID':'room','function':'loadRoom()'}]; 
 
    // Initiate loop
    canvas.interval = setInterval(updateit, 1000/60);
	
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
	updateAction();	
	updateImage();
	
}//----------------------------------------------------------------------------------------------

function updateKeys() {
	
	// Track which keys are down (we count it to detect the first time it's down)
    window.addEventListener('keydown', function (e) {
	
		keys[e.keyCode] += 1;
		
		// Pause, mute, +, - : have efect only the first time
		if        ( keys[actionKeys.pause] == 1 ) {
			pause = pause ? false : true;
		} else if ( keys[actionKeys.mute ] == 1 && !pause ) {
			mute = mute ? false : true;			
		} else if ( keys[actionKeys.plus ] == 1 ) {
			scale += 1;		
		} else if ( keys[actionKeys.minus] == 1 ) {
			scale = Math.max(1,scale-1);
		} else if ( keys[actionKeys.next] == 1 && !pause ) {
			songIndex = (songIndex+1)%songs.length;
		} else if ( keys[actionKeys.up]   == 1 && !pause && !blockKeys ) {
			menuIndex = Math.min(2,menuIndex+1);
		} else if ( keys[actionKeys.down] == 1 && !pause && !blockKeys ) {
			menuIndex = Math.max(0,menuIndex-1);
		} else if ( keys[actionKeys.right]   == 1 && !pause ) {
			objectIndex = Math.min(objects.length-1,objectIndex+1);
		} else if ( keys[actionKeys.left] == 1 && !pause ) {
			objectIndex = Math.max(0,objectIndex-1);
		} else if ( keys[actionKeys.act] == 1 && !pause ) {
			actionOn = actionOn ? false : true;	
		}				
		
    })
	//console.log(keys[actionKeys.esc] != 0)
	
	// Track which keys are up
    window.addEventListener('keyup', function (e) {
		keys[e.keyCode] = 0;
    })
	
}//----------------------------------------------------------------------------------------------

function updateMusic() {
	
	// change the song
	if (keys[actionKeys.next]) {
		music.pause();
		music.src = pathmusic+songs[songIndex];
		music.play();
	}
	
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
	
	runAction();
	
}//----------------------------------------------------------------------------------------------

function updateImage() {
	
	// set CSS to scale
	if (keys[actionKeys.minus]||keys[actionKeys.plus]) {
		setSize3()
	}
			
    // Create the image and draw the image data to the canvas
	if (!pause) {	
		drawCanvasTime(true)
	}
}//----------------------------------------------------------------------------------------------

function drawCanvasTime(bo) {
	if (bo) {
		var startTime = performance.now()
		drawCanvas()
		var endTime = performance.now()
		tempo += endTime - startTime
		++n
		console.log(`Call createImage ${endTime - startTime} ms`)
		console.log(tempo/n)	
	} else { 
		drawCanvas(); 
	}
}//----------------------------------------------------------------------------------------------





