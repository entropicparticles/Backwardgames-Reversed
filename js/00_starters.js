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
				  retro: 78 //n
				  };
				  
var pathmusic  = './music/';
var songs = {'cover'          : new Audio(pathmusic+'cover.mp3'         ),
			 'cover_loop'     : new Audio(pathmusic+'cover_loop.mp3'    ),
			 'cover_reversed' : new Audio(pathmusic+'cover_reversed.mp3'),
			 'beginning'      : new Audio(pathmusic+'beginning.mp3'     ),
			 'main_loop'      : new Audio(pathmusic+'main_loop.mp3'     ),
			 'theend'         : new Audio(pathmusic+'theend.mp3'        )};
var music = new Audio();
			 
// Define html elements: canvas, context and music
var     canvas,     context;
var  txtcanvas,  txtcontext;
var backcanvas, backcontext;
var finalcanvas, finalcontext;
var finalbackcanvas, finalbackcontext;
 
// Define the image dimensions
var LI = 320, LJ = 180, width = 320, height = 180, scale0=1, scale=3;

// time, chapter, rooms, room or cover?
var t, subt, room, preRoom, RGBcover=0;

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
	memory = {};

// Keys down and other control variables
var keys = [],
	mute  = false,
	pause = false,
	menuIndex, songIndex;

// Actions are on? and other action stuff
var actionOn  = false; keyOn = 'stp0';

// Cinematics? Array witha sequence of actions. Keep keys block during cinematics.
var cinematics = [], 
	blockKeys = false, fullControl = false, printcine = false, intro=false;

// debugging
var tempo=0,nt=0,testing=false;

// retro effect
var retro0 = 0.75;
var retro  = retro0;

var userI, preUserI, userJ, preUserJ, pos, mouseOn = false;


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

				 
// Set CSS size
function setSize3(ss){
	finalcanvas.style.width      = (ss*width).toString()+"px"
	finalcanvas.style.height     = (ss*height).toString()+"px"
	finalbackcanvas.style.width  = finalcanvas.style.width;
	finalbackcanvas.style.height = finalcanvas.style.height;
	effectcanvas.style.width     = finalcanvas.style.width;
	effectcanvas.style.height    = finalcanvas.style.height;
}

// MOUSE -------------------------------------------------------------------------------------------

function doMouseUp(event) {
	mouseOn = false;
	//console.log('last pos',userI,userJ)
}

function doMouseDown(event) {
	if (!blockKeys&&!intro) {mouseOn = true;}
	//console.log('click',userI,userJ)
}

function getPosXY(event) {
		var rect = finalcanvas.getBoundingClientRect();
		userI = Math.round((event.pageX - rect.left+0.5)/scale0/scale);
		userJ = Math.round((event.pageY - rect.top +0.5)/scale0/scale);
		//userI = preUserI, userJ = preUserJ;
	//if (mouseOn) console.log('pre',preUserI,preUserJ)
}

function do2Click(event) {
	if (!blockKeys&&!intro) {actionOn = true;}
}

/*
function doTouchStart(event) {
	event.preventDefault();
	userX = Math.round((event.targetTouches[0].pageX - rect.left+0.5)/scale0);
	userY = Math.round((event.targetTouches[0].pageY - rect.top +0.5)/scale0);
	console.log(userX,userY)
}
*/

// START PRESSING ANY KEY (JUST ONCE) ---------------------------------------------------------------
document.addEventListener("click"     , firstStart);
document.addEventListener('keydown'   , firstStart);
document.addEventListener('touchstart', firstStart);


// double clik with touch
var mylatesttap;
function touching(event) {
	var now = new Date().getTime();
	var timesince = now - mylatesttap;
	if((timesince < 100) && (timesince > 0)){
		do2Click(event);
	} else {
		doMouseDown(event);
	}
	mylatesttap = new Date().getTime();
}


function firstStart(e) {
	if (firstEntry) { 
		start(); 
	}
}

// GO FOR IT //--------------------------------------------------------------------------------------
function start() {
	
	// Get elements from html: canvas and context	
	finalcanvas      = document.getElementById("finalcanvas"); 
	finalcontext     = finalcanvas.getContext("2d");
	finalbackcanvas  = document.getElementById("finalbackcanvas"); 
	finalbackcontext = finalbackcanvas.getContext("2d");
	effectcanvas  = document.getElementById("effectcanvas"); 
	effectcontext = effectcanvas.getContext("2d");
	
	document.addEventListener("mousemove" , getPosXY   );	
	document.addEventListener("touchmove" , getPosXY   );
	document.addEventListener("mousedown" , doMouseDown);
	document.addEventListener('touchstart', touching);
	document.addEventListener("mouseup"   , doMouseUp  );
	document.addEventListener("touchend"  , doMouseUp  );
	document.addEventListener('dblclick' , do2Click   );
	//finalcanvas.addEventListener("touchstart", doTouchStart, false);
	
	finalcanvas.width      =   width;
	finalcanvas.height     =   height;
	finalbackcanvas.width  =   width;
	finalbackcanvas.height =   height;	
	effectcanvas.width     = 3*width;
	effectcanvas.height    = 3*height;	
	
	// Set CSS size
	setSize3(scale);

	// draw top effect forever
	var im = tiles['panel']['cover']['RGB_effect'];
	var tile = effectcontext.createImageData(im['DI'],im['DJ']);
	for (var k=0; k<im.png.length; k+=1){
		tile.data[k] = im.png[k];
	}
	createImageBitmap(tile).then(img => effectcontext.drawImage(img,0,0,width*scale,height*scale));
	effectcanvas.style.visibility = "visible";
	effectcanvas.style.visibility ="hidden"
		
	dcontext = [finalcontext,finalbackcontext,effectcontext];
	for (var k=0;k<dcontext.length;++k){
		dcontext[k].mozImageSmoothingEnabled    = false;
		dcontext[k].webkitImageSmoothingEnabled = false;
		dcontext[k].msImageSmoothingEnabled     = false;
		dcontext[k].imageSmoothingEnabled       = false;
	}			
	
	// Initiate time
	t = 0; 
		
	// Initiate indices
    menuIndex   = 1;
	objectIndex = 0;
	
	// Initiate key list
	keys = [];
	for (var k = 0; k < 256; ++k) {
		keys[k] = 0;
	}	 		
	
	// enter in the room for the first time	
	chapter = 8;	
	objects = ['mano','gun','maletin','report'];
	room = 'void';
	preRoom = 'void';
	actions = [{'ID':'room','function':'changeroom','arguments':["hotel_street_9"]}];    //start: "hotel_street_9"
	guy = {'folder':'guy_cool','file':'m0_01N','X':0,'Y':0,'Z':0,'state':0};
	
	actionOn = true;
	
    // Initiate loop
    finalcanvas.interval = setInterval(updateit, 1000/15);
	
}
	
// MAIN LOOP //----------------------------------------------------------------------------------

function updateit() {

	// Update time to whatever is convenient
	if (!pause) {
		t = (t+1)%(256*256);
	}
	
	// update all stuff
	updateKeys();	
	updateMusic();
	if (!pause) {	
		if (!blockKeys) {walkingGuy();}
		updateAction();	
		updateImage();
	}
	
}//----------------------------------------------------------------------------------------------

function updateKeys() {
	
	// Track which keys are down (we count it to detect the first time it's down)
    window.addEventListener('keydown', function (e) {
	
		keys[e.keyCode] += 1;
		
		// Pause, mute, +, - : have efect only the first time
		if        ( keys[actionKeys.pause] == 1 && room!='cover' ) {          // PAUSE
			pause = !pause;
		} else if ( keys[actionKeys.mute ] == 1 && !pause ) {                 // MUTE MUSIC
			mute = !mute;			
		} else if ( keys[actionKeys.plus ] == 1 ) {                           // RESOLUTION UP
			//if (scale>=1) {scale += 1;} else {scale = 1/(1/scale-1);}		
			scale += 1;
			setSize3(scale);			
		} else if ( keys[actionKeys.minus] == 1 ) {                           // RESOLUTION DOWN
			//if (scale>1) {scale = scale-1;} else {scale = 1/(1/scale+1);}
			scale = Math.max(3,scale-1);
			setSize3(scale);
		} else if ( keys[actionKeys.retro] == 1 ) {                           // RETRO EFFECT
			effectcanvas.style.visibility = effectcanvas.style.visibility=="hidden" ? "visible" : "hidden";
		} else if ( keys[actionKeys.up]   == 1 && !pause ) {                  // MENU UP
			menuIndex = Math.min(2,menuIndex+1);
		} else if ( keys[actionKeys.down] == 1 && !pause ) {                  // MENU DOWN
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
	keyOn = ['stp0'];
	var moves = [['upx1',keys[actionKeys.upx1]],['dwx1',keys[actionKeys.dwx1]],['upy1',keys[actionKeys.upy1]],['dwy1',keys[actionKeys.dwy1]],
	             ['upx2',keys[actionKeys.upx2]],['dwx2',keys[actionKeys.dwx2]],['upy2',keys[actionKeys.upy2]],['dwy2',keys[actionKeys.dwy2]]];
	moves.sort(function(a, b) {return a[1] < b[1];});
    for (var k=0;k<8; ++k) {
        if (moves[k][1] != 0) keyOn.push(moves[k][0]);
    }
	if (keyOn.length==1) {
		keyOn = keyOn[0];
	} else if (keyOn.length==2) {
		keyOn = keyOn[1];
	} else {	
		var key1 = keyOn[keyOn.length-1].slice(0,3),key2 = keyOn[keyOn.length-2].slice(0,3);
		if      (['upx','upy'].includes(key1)&&['upx','upy'].includes(key2)) { keyOn = 'upp1';}
		else if (['upx','dwy'].includes(key1)&&['upx','dwy'].includes(key2)) { keyOn = 'rgt1';}
		else if (['dwx','dwy'].includes(key1)&&['dwx','dwy'].includes(key2)) { keyOn = 'dwn1';}
		else if (['dwx','upy'].includes(key1)&&['dwx','upy'].includes(key2)) { keyOn = 'lft1';}
		else { keyOn = keyOn[keyOn.length-1];	}
	}
	
	//console.log(keyOn,guyIndex)
	
}//----------------------------------------------------------------------------------------------

function updateMusic() {
	
	// mute the song: times continues
	if (keys[actionKeys.mute] && mute) {
		music.volume=mute?0:1;
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
		var cine = cinematics[0];
		if (testing) {console.log(cine);}
		cinematics.shift();
		eval(cine+';');
		
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
	
    // Create the image and draw the image data to the canvas
	drawCanvasTime(false);
	
}

function drawCanvasTime(bo) {
	if (bo) {
		var startTime = performance.now();
		drawCanvas();
		var endTime = performance.now();
		tempo += endTime - startTime;
		++nt;
		console.log(`Call createImage ${endTime - startTime} ms`);
		console.log(tempo/nt);
	} else { 
		drawCanvas(); 
	}
}//----------------------------------------------------------------------------------------------





