
// WRITE TEXT ------------------------------------------------------------------------------------

function writeText(string,i,j,textType,align,bubble,pointer) {
	
	// give me the colors to use	
	var the3colors = givemeColors(false);
		
	// string: text; i,j: position; textType=['text_normal','text_gothic','text_gothic_fat']
	// align: centered?; bubble: ariund the letters; pointer: when someone talks
	// if pointer==true, also bubble and align
	
	var dp = (textType == 'text_gothic_fat') ? 8 : 0;	
	var icum = 0, jcum = 0, isize = 0; jsize = 0; dj = 0;
	
	// get the hight of the letters (allways the same)
	dj = tiles['panel'][textType][string.charAt(0)]['DJ'];
	
	// Measure size
	if (align || bubble) {
		for (var k=0; k<string.length; ++k) {
			var a = string.charAt(k);
			if (a!='|') {
				var im = tiles['panel'][textType][a];
				icum += im['DI']-dp;
			} else {
				jsize += dj
				isize = Math.max(icum,isize)
				icum = 0
			}		
		}
		jsize += dj	
		isize = Math.max(icum,isize)
	}
	
	// set default values
	var icum0 = -Math.trunc(dp/2)-Math.trunc(isize/2), jcum0 = -Math.trunc(dp/5)
	
	
	// i0,j0 should be corrected to be inside canvas
	if (i+icum0<0) {
		icum0 += -icum0-i+7
	} else if (i+isize+icum0>width) {
		icum0 += (width-i-isize-icum0)-6
	}
	
	// correct j direction
	jj = height-dj-j
	
	//build bubble using native lines
	if (bubble) {		
		txtcontext.lineWidth = 4;
		txtcontext.strokeStyle = 'rgba('+the3colors[2].join(',')+')';
		txtcontext.beginPath();
		txtcontext.moveTo(i+icum0-3      ,jj+jsize);
		txtcontext.lineTo(i+icum0+2+isize,jj+jsize);
		txtcontext.stroke();
		txtcontext.beginPath();
		txtcontext.moveTo(i+icum0-3      ,jj-2);
		txtcontext.lineTo(i+icum0+2+isize,jj-2);
		txtcontext.stroke();
		txtcontext.beginPath();
		txtcontext.moveTo(i+icum0-2      ,jj+1+jsize);
		txtcontext.lineTo(i+icum0-2      ,jj-3);
		txtcontext.stroke();
		txtcontext.beginPath();
		txtcontext.moveTo(i+icum0+1+isize,jj+1+jsize);
		txtcontext.lineTo(i+icum0+1+isize,jj-3);
		txtcontext.stroke();
		
		txtcontext.fillStyle = 'rgba('+the3colors[1].join(',')+')';
		txtcontext.fillRect(i+icum0-2, jj-2, isize+3, jsize+2);
		txtcontext.fill();
	}
	
	// Draw pointer when people talks
	if (pointer) {
		//pointer
		var pointer =[2,1,1,1,2,
		              2,1,1,1,2,
					  2,2,1,2,2,
					  2,2,1,2,2,
					  0,2,2,2,0,
					  0,2,2,2,0,
					  0,0,2,0,0,
					  0,0,2,0,0];
		pointer={'DI':5,'DJ':8,'png':pointer}
		drawTile(pointer,i-2,j-jsize+3,0,false,'text',the3colors)		
	}
	
	// Draw characters for the text. Changing line is with '|'
	icum = icum0, jcum = jcum0
	for (var k=0; k<string.length; ++k) {
		var a = string.charAt(k);
		if (a!='|') {
			im = tiles['panel'][textType][a];
			drawTile(im,i+icum,j+jcum,0,false,'text',the3colors);
			icum += im['DI']-dp;
		} else {
			jcum += -im['DJ']-dp
			icum = icum0
		}
	}
	
}

function writeGothic(string,i,j) {
	writeText(string,i,j,'text_gothic_fat',true,false,false);
	writeText(string,i,j,'text_gothic',true,false,false);	
} //----------------------------------------------------------------------------------------------

// WRITE PANELS ----------------------------------------------------------------------------------

function drawBackgroundRGB(which) {
	// Draw the RGB background
	var im = tiles['panel']['cover'][which];
	var tile = backcontext.createImageData(width, height);
	for (var k=0; k<im.png.length; ++k){
		tile.data[k] = im.png[k]
	}
	backcontext.putImageData(tile, 0, 0);
}

function drawPanel() {
	
	// give me the colors to use	
	var the3colors = givemeColors(false);
		
	// Draw the frame border
	var im = tiles['panel']['panel']['frame'];
	//var tile = txtcontext.createImageData(im['DI'],im['DJ']);
	if (!testing) drawTile(im,0,0,0,false,'text',the3colors)
	
	if (RGBcover==0) {
		
		// Draw the help menu, as open as menuIndex says (3 options)
		im = tiles['panel']['panel']['paneljs']
		var dj = [im['DJ']-32,im['DJ']-(32+16),0][menuIndex]
		var di = menuIndex==0 ? (4-objects.length)*24 : 0 ;
		drawTile(im,-di,-dj,0,false,'text',the3colors)
		
		// Write text for the items
		textobjects={'mano'  :'Interact / Talk','maletin':'THE case',
					 'gun'   :'A Beretta 92 FS','roomkey':'A hotel room key',
					 'report':'A police file'}
		writeText(textobjects[objects[objectIndex]],4,im['DJ']-(32+13)-dj,'text_normal',false,false,false)
		
		// Draw the objects and pointer	
		dj = [0,16,im['DJ']-32][menuIndex]
		
		im = tiles['panel']['objects']['marker']
		k = objectIndex
		di = 3+24*k+k
		drawTile(im,di,3+dj,0,false,'text',the3colors)
		
		for (var k = 0; k<objects.length; ++k) {
			var di = 3+24*k+k
			im = tiles['panel']['objects'][objects[k]]
			drawTile(im,di,3+dj,0,false,'text',the3colors)
		}
		
		im = tiles['panel']['objects']['markerL']
		k = objectIndex
		di = 2+24*k+k
		drawTile(im,di,2+dj,0,false,'text',the3colors)	
		
	
	} else {
		
		// Draw the help menu when asked
		// only appears after action at index=1 (2nd of menu of 3 options)
		if (menuIndex==1) {		
			im = tiles['panel']['panel']['panelcoverjs']
			drawTile(im,0,0,0,false,'text',the3colors)		
		}
		
	}
		
} //----------------------------------------------------------------------------------------------


// WRITE TILES -----------------------------------------------------------------------------------

function drawTile(im,i,j,didj,spined,which,the3colors) {
	
	//console.log(im)
	// im: tile; i,j: canvas position; dj: cut some pixels from above
	di = didj==0 ? 0 : dj[0] ;
	dj = didj==0 ? 0 : dj[1] ;
	j = height-im['DJ']-j+dj ;
	
	var tile = context.createImageData(im['DI'],im['DJ']-dj*im['DI']);
	var png  = im['png'];
		
	for (var k=0; k<png.length-dj*im['DI'];  k++) {
		var q = spined ? (im['DI']-k%im['DI']-1) + im['DI']*Math.floor(k/im['DI']) : k ;
		var pixelindex = q*4;
		if (png[k]!=0) {
			var RGBA = the3colors[png[k]];
			// Set the pixel data
			tile.data[pixelindex  ] = RGBA[0]; // Red
			tile.data[pixelindex+1] = RGBA[1]; // Green
			tile.data[pixelindex+2] = RGBA[2]; // Blue
			tile.data[pixelindex+3] = RGBA[3]; // Alpha
		}		
	}
	if (which=='text') {
		createImageBitmap(tile).then(img => txtcontext.drawImage(img,i,j));
	} else if (which=='background') {
		createImageBitmap(tile).then(img => backcontext.drawImage(img,i,j));
	} else {
		createImageBitmap(tile).then(img => context.drawImage(img,i,j));
	}
} //----------------------------------------------------------------------------------------------

 // SHIT HAPPENS HERE -----------------------------------------------------------------------------
 
function drawCanvas(t) {

	// Initiate canvases and draw stuff
	txtcontext.clearRect(0, 0, width, height);
	context.clearRect(0, 0, width, height);
	if (firstEntry) { 
		backcontext.clearRect(0, 0, width, height);
		if (RGBcover!=0) { drawBackgroundRGB(RGBcover); }
		drawStuff(stuff['background'],'background');
		firstEntry = false;
	}
	//sortMobile();
	drawStuff(stuff['front'],'canvas');
	drawText();
	drawPanel();
	
}

function drawStuff(stf,which){
	printAllIsometric(stf,which);
}

// Loop to draw all the stuff at the room
function drawStuff_old(stf,which) {
	
	for (var k=0; k<stf.length; ++k) {
		s = stf[k];
		if (s['visible']) {
			the3colors = givemeColors(s);
			drawTile(tiles[s['type']][s['folder']][s['file']],s['I0'],s['J0'],0,s['spin']==-1,which,the3colors);
		}
	}	
	
}

// Loop to draw all the text at the moment and update time
function drawText() {
	
	for (var k=0; k<listText.length; ++k) {
		var txt = listText[k];
		var tim = 'time' in txt ? txt['time'] : 0 ;
		if ( tim>=0 ) {
			if (txt['type']=='gothic') {
				writeGothic(txt['text'],txt['I0'],txt['J0']);
			} else {
				writeText(txt['text'],txt['I0'],txt['J0'],txt['type'],txt['centered'],txt['bubble'],txt['pointer']);
			}
			if ('time' in txt ) txt['time']+=-1;
		}
	}
	
} //----------------------------------------------------------------------------------------------
