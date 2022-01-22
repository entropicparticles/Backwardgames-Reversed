

// WRITE TEXT ------------------------------------------------------------------------------------

// Loop to draw all the text at the moment and update time
function drawText(which) {
	
	for (var k=0; k<listText.length; ++k) {
		var txt = listText[k];
		var tim = 'time' in txt ? txt['time'] : 0 ;
		if ( tim>=0 ) {
			if ('time' in txt ) { // time goes down until 0
				txt['time']+=-1;
			}
			if ('who' in txt) { // reposition if the guy is moving
				var st = stuff['front'][getIndexFromID(txt['who'])[0]];
				var lines = (txt['text'].split("|").length);
				var i = Math.floor((st['I0']+st['IM'])/2),
					j = st['JM']+11*lines;
				txt['I0'] = i;
				txt['J0'] = j;
			}
			if (txt['type']=='gothic') {
				writeGothic(txt['text'],txt['I0'],txt['J0'],which);
			} else {
				writeText(txt['text'],txt['I0'],txt['J0'],txt['type'],txt['centered'],txt['bubble'],txt['pointer'],which);
			}
		}
	}
	listText = listText.filter(it => !('time' in it) || ('time' in it && it['time']>=0));

} //----------------------------------------------------------------------------------------------	

function writeText(string,i,j,textType,align,bubble,pointer,which) {
	
	var contexts = {'final':finalcontext,'finalback':finalbackcontext};	
	var whichcontext = contexts[which];
	
	// give me the colors to use	
	var the3colors = givemeColors(false);
		
	// string: text; i,j: position; textType=['text_normal','text_gothic','text_gothic_fat']
	// align: centered?; bubble: around the letters; pointer: when someone talks
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
				jsize += dj;
				isize = Math.max(icum,isize);
				icum = 0;
			}		
		}
		jsize += dj	;
		isize = Math.max(icum,isize);
	}
	
	// set default values
	var icum0 = -Math.trunc(dp/2)-Math.trunc(isize/2), jcum0 = -Math.trunc(dp/5);
	
	
	// i0,j0 should be corrected to be inside canvas
	if (i+icum0-6<0) {
		icum0 += -icum0-i+7;
	} else if (i+isize+icum0+6>width) {
		icum0 += (width-i-isize-icum0)-6;
	}
	
	// correct j direction
	jj = height-dj-j;
	
	//console.log('in',i,icum0,isize,jj,jsize)
	//build bubble using native lines
	if (bubble) {		

		var box = Array((isize+2+4)*(jsize+1+4)).fill(2);
		box[0] = 0;
		box[(isize+2+4)-1] = 0;
		box[(isize+2+4)*(jsize+1+4-1)] = 0;
		box[(isize+2+4)*(jsize+1+4)-1] = 0;
		box={'DI':(isize+2+4),'DJ':(jsize+1+4),'png':box};
		drawTile(box,(i+icum0-2-2),height-(jsize+2)-(jj-2)-2,0,false,which,the3colors);

		var box = Array((isize+2)*(jsize+1)).fill(1);
		box={'DI':(isize+2),'DJ':(jsize+1),'png':box};
		drawTile(box,(i+icum0-2),height-(jsize+2)-(jj-2),0,false,which,the3colors);
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
		pointer={'DI':5,'DJ':8,'png':pointer};
		drawTile(pointer,i-2,j-jsize+3,0,false,which,the3colors)	;	
	}
	
	// Draw characters for the text. Changing line is with '|'
	icum = icum0, jcum = jcum0;
	for (var k=0; k<string.length; ++k) {
		var a = string.charAt(k);
		if (a!='|') {
			im = tiles['panel'][textType][a];
			drawTile(im,i+icum,j+jcum,0,false,which,the3colors);
			icum += im['DI']-dp;
		} else {
			jcum += -im['DJ']-dp;
			icum = icum0;
		}
	}
	
}

function writeGothic(string,i,j,which) {
	writeText(string,i,j,'text_gothic_fat',true,false,false,which);
	writeText(string,i,j,'text_gothic',true,false,false,which);	
} //----------------------------------------------------------------------------------------------

// WRITE PANELS ----------------------------------------------------------------------------------

function drawPanel(which) {
	
	// give me the colors to use	
	var the3colors = givemeColors(false);
		
	// Draw the frame border
	var im = tiles['panel']['panel']['frame'];
	//var tile = txtcontext.createImageData(im['DI'],im['DJ']);
	drawTile(im,0,0,0,false,which,the3colors);
	
	if (RGBcover==0) {
		
		// Draw the help menu, as open as menuIndex says (3 options)
		im = tiles['panel']['panel']['paneljs'];
		var dj = [im['DJ']-32,im['DJ']-(32+16),0][menuIndex];
		var di = menuIndex==0 ? (4-objects.length)*24 : 0 ;
		drawTile(im,-di,-dj,0,false,which,the3colors);
		
		// Write text for the items
		textobjects={'mano'  :'Interact / Talk','maletin':'THE case',
					 'gun'   :'A Beretta 92 FS','roomkey':'A hotel room key',
					 'report':'A police file'};
		writeText(textobjects[objects[objectIndex]],4,im['DJ']-(32+13)-dj,'text_normal',false,false,false,which);
		
		// Draw the objects and pointer	
		dj = [0,16,im['DJ']-32][menuIndex];
		
		im = tiles['panel']['objects']['marker'];
		k = objectIndex;
		di = 3+24*k+k;
		drawTile(im,di,3+dj,0,false,which,the3colors);
		
		for (var k = 0; k<objects.length; ++k) {
			var di = 3+24*k+k;
			im = tiles['panel']['objects'][objects[k]];
			drawTile(im,di,3+dj,0,false,which,the3colors);
		}
		
		im = tiles['panel']['objects']['markerL'];
		k = objectIndex;
		di = 2+24*k+k;
		drawTile(im,di,2+dj,0,false,which,the3colors);	
		
	
	} else {
		
		// Draw the help menu when asked
		// only appears after action at index=1 (2nd of menu of 3 options)
		if (menuIndex==1) {		
			im = tiles['panel']['panel']['panelcoverH'];
			drawTile(im,0,0,0,false,which,the3colors);	
		}
		
	}
		
} //----------------------------------------------------------------------------------------------

// WRITE STUFF ----------------------------------------------------------------------------------
function drawStuff(stf,which){
	printAllIsometric(stf,which);
}

// WRITE TILES -----------------------------------------------------------------------------------

function drawBackgroundRGB(which,where) {
	var contexts = {'final':finalcontext,'finalback':finalbackcontext};	
	var whichcontext = contexts[where];
	// Draw the RGB background
	var im = tiles['panel']['cover'][which];
	var tile = whichcontext.createImageData(scale0*im['DI'],scale0*im['DJ']);
	for (var k=0; k<scale0*scale0*im.png.length; k+=4){
		var ki = Math.floor(k/4)%(scale0*im['DI']);
		var kj = Math.floor(Math.floor(k/4)/(scale0*im['DI']));
		var kk = (Math.floor(kj/scale0)*im['DI'] + Math.floor(ki/scale0))*4;
		tile.data[k  ] = im.png[kk  ];
		tile.data[k+1] = im.png[kk+1];
		tile.data[k+2] = im.png[kk+2];
		tile.data[k+3] = im.png[kk+3];
		/*
		if (retro!=0&scale0==3) {
			var w = retro;//1-( Math.pow(kj/scale0-90,2) + Math.pow(ki/scale0-160,2) )/33700 ;
			//if (kj%3!=0) {tile.data[k  ] = Math.floor(w*tile.data[k  ]);}
			//if (kj%3!=1) {tile.data[k+1] = Math.floor(w*tile.data[k+1]);}
			//if (kj%3!=2) {tile.data[k+2] = Math.floor(w*tile.data[k+2]);}
			if (kj%3==0) {
				var w = retro;
				tile.data[k  ] = Math.floor(w*tile.data[k  ]);
				tile.data[k+1] = Math.floor(w*tile.data[k+1]);
				tile.data[k+2] = Math.floor(w*tile.data[k+2]);
			}
		}
		if (retro!=0&scale0==2) {
			var w = retro;//1-( Math.pow(kj/scale0-90,2) + Math.pow(ki/scale0-160,2) )/33700 ;
			if (kj%2==0) {
				tile.data[k  ] = Math.floor(w*tile.data[k  ]);
				tile.data[k+1] = Math.floor(w*tile.data[k+1]);
				tile.data[k+2] = Math.floor(w*tile.data[k+2]);
			}
		}
		*/
	}
	createImageBitmap(tile).then(img => whichcontext.drawImage(img,0,0));
}

function drawTile(im,i,j,didj,spined,which,the3colors,isStuff) {
	
	//spined and didj is obsolete

	var contexts = {'final':finalcontext,'finalback':finalbackcontext};	
	var whichcontext = contexts[which];
	
	//console.log(im)
	// im: tile; i,j: canvas position; 
	j = height-im['DJ']-j ;
	
	var tile = whichcontext.createImageData(scale0*im['DI'],scale0*im['DJ']);
	var png  = im['png'];
		
	for (var k=0; k<4*scale0*scale0*(png.length);k+=4) {
		
		var ki = Math.floor(k/4)%(scale0*im['DI']);
		var kj = Math.floor(Math.floor(k/4)/(scale0*im['DI']));
		var kk = (Math.floor(kj/scale0)*im['DI'] + Math.floor(ki/scale0));
		
		if (png[kk]!=0) {
			var RGBA = the3colors[png[kk]];
			//if (k==2344&&im['DJ']==16) console.log(RGBA)
			//RGBA = retroEffect(RGBA,ki,kj);
			//if (k==2344&&im['DJ']==16) console.log(RGBA)
			
			// Set the pixel data
			tile.data[k  ] = RGBA[0]; // Red
			tile.data[k+1] = RGBA[1]; // Green
			tile.data[k+2] = RGBA[2]; // Blue
			tile.data[k+3] = RGBA[3]; // Alpha
			/*
			if (!isStuff) {
				if (retro!=0&scale0==3) {
					//var w = retro;//1-( Math.pow(kj/scale0-90,2) + Math.pow(ki/scale0-160,2) )/33700 ;
					//if (kj%3!=0) {tile.data[k  ] = Math.floor(w*tile.data[k  ]);}
					//if (kj%3!=1) {tile.data[k+1] = Math.floor(w*tile.data[k+1]);}
					//if (kj%3!=2) {tile.data[k+2] = Math.floor(w*tile.data[k+2]);}
					if (kj%3==0) {
						var kki = i+ki/scale0, kkj = j+kj/scale0 ;
						var w = isStuff ? 0.9*(1-( Math.pow(kkj-90,2) + Math.pow(kki-160,2) )/33700)*retro/retro0 :  retro ;
						tile.data[k  ] = Math.floor(w*RGBA[0]);
						tile.data[k+1] = Math.floor(w*RGBA[1]);
						tile.data[k+2] = Math.floor(w*RGBA[2]);
					}
				}
				if (retro!=0&scale0==2) {
					if (kj%2==0) {
						var w = retro;
						tile.data[k  ] = Math.floor(w*RGBA[0]);
						tile.data[k+1] = Math.floor(w*RGBA[1]);
						tile.data[k+2] = Math.floor(w*RGBA[2]);
					}
				}
			}
			*/
		}		
	}
	createImageBitmap(tile).then(img => whichcontext.drawImage(img,scale0*i,scale0*j));
} 

//----------------------------------------------------------------------------------------------

function drawCursor(which) {
	var the3colors = givemeColors(false);
	var dij = {'upx':[4,-4],'dwx':[11,-4],'upy':[11,-4],'dwy':[4,-4],
			   'upp':[7,2],'dwn':[7,-8],'lft':[13,-5],'rgt':[-2,-5]}[pos];	
	if (pos!='stp') {drawTile(tiles['panel']['panel'][pos],userI-dij[0],height-userJ+dij[1],0,false,which,the3colors);}
}

 // SHIT HAPPENS HERE -----------------------------------------------------------------------------
 
function drawCanvas(t) {
	
	finalcontext.clearRect(0,0,scale0*width,scale0*height);
	drawStuff(stuff['front'],'final');
	drawPanel('final');
	drawText('final');
	if (mouseOn&&!intro) {drawCursor('final');}
	
	if (firstEntry) { 
		finalbackcontext.clearRect(0,0,scale0*width,scale0*height);
		if (RGBcover!=0) { drawBackgroundRGB(RGBcover,'finalback'); }
		drawStuff(stuff['background'],'finalback');
		firstEntry = false;
	}
		
}

