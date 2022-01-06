
// ACTIONS ----------------------------------------------------------------------------------------

function playMusic(songIndex) {
	if (songIndex in songs) {
		music.pause();
		music.src = pathmusic+songs[songIndex];
		music.play();
	}
}

function walkingGuy() {
	if (guyIndex>=0) walking(keyOn,guyIndex);
}

function walking(step,indk) {

	var im = stuff['front'][indk];
	// define all possible movements and effects in XYZ and IJ spaces
    var F1 = im['file'].slice(0,-3);
	var F2 = im['file'].slice(-1);
    var delta = {'upy':{'xyz':[ 0, 1, 0],'ij':[-2, 1],'file':F1+'01','pos':['R','L']},
				 'dwy':{'xyz':[ 0,-1, 0],'ij':[ 2,-1],'file':F1+'10','pos':['R','L']},
				 'upx':{'xyz':[ 1, 0, 0],'ij':[ 2, 1],'file':F1+'00','pos':['R','L']},
				 'dwx':{'xyz':[-1, 0, 0],'ij':[-2,-1],'file':F1+'11','pos':['R','L']},
				 'stp':{'xyz':[ 0, 0, 0],'ij':[ 0, 0],'file':im['file'].slice(0,-1),'pos':['N']}};
				 
	// apply the movement
	var move = delta[step.slice(0,-1)];	
	
    // update pose
    var p = (step=='stp0' || F2=='L') ? 0 : 1 ;
    stuff['front'][indk]['file'] = move['file']+move['pos'][p];	
	
	if (step!='stp0') {

		// go for the movement		
		// test move: we loop for all pixels done in the same movement
		var qm  = step.slice(-1); 
		var q = 0
		for (n=1;n<=qm;++n) { 
		
			var go     = false;
			var godown = -8;
			var goup   =  8;
			var testa = {'X' :im['X']  + move.xyz[0],'Y' :im['Y']  + move.xyz[1],'Z' :im['Z'] ,
						 'XM':im['XM'] + move.xyz[0],'YM':im['YM'] + move.xyz[1],'ZM':im['ZM']};
						
			// we check Z to know if he has to go down a maximum of 3 pixels only if there is no dz=0
			// to go up, just one dz=3 up is enough
			for (var k=0; k<space['open'].length; ++k) {
				var obj = space['open'][k];
				var col = collision(testa,obj);
				if (col) {
					var dz = obj.ZM-testa.Z;
					if (dz<=0) godown = Math.max(godown,dz);
					if (dz> 0) goup   = Math.min(goup,dz);
					go = true;
					//console.log('dz',dz,'up',goup,'down',godown);
					//console.log('col ->',obj.Z);
					//console.log(obj.ZM,testa.Z,dz,godown,goup);
					//console.log('XYZ: ',im['X'],im['Y'],im['Z']);
				}
			}
			// if in the next move there is only floor lower than 3 or hight than 3 (rare), it's too much
			go = !(godown < -3);
			
			// solid 
			if (go) {
				dz = goup <=3 ? goup : (godown >=-3 ? godown : 0 ) ;
				testa.Z  += dz;
				testa.ZM += dz;
				go = go && !space['solid'].some( obj => collision(testa,obj) && ((testa.Z>=obj.Z&&testa.Z<obj.ZM)||(testa.Z<=obj.Z && testa.ZM>obj.Z)) );
			}
			
			// if go, check action and continue; if not, stop here
			if (go) {
				
				stuff['front'][indk]['X']  += move.xyz[0];
				stuff['front'][indk]['Y']  += move.xyz[1];
				stuff['front'][indk]['Z']  += dz;
				stuff['front'][indk]['XM'] += move.xyz[0];
				stuff['front'][indk]['YM'] += move.xyz[1];
				stuff['front'][indk]['ZM'] += dz;
				stuff['front'][indk]['I0'] += move.ij[0];		
				stuff['front'][indk]['J0'] += move.ij[1]+dz;
				stuff['front'][indk]['IM'] += move.ij[0];		
				stuff['front'][indk]['JM'] += move.ij[1]+dz;
				im = stuff['front'][indk];
				console.log(n,'>',stuff['front'][indk]['ID'],stuff['front'][indk]['X'],stuff['front'][indk]['Y'],stuff['front'][indk]['Z'],
								  [Math.floor(stuff['front'][indk]['X']/8),Math.floor(stuff['front'][indk]['Y']/8),Math.floor(stuff['front'][indk]['Z']/8)],dz)
				//updateAction();	
				if (firstEntry) break; //stop loop if room changed
				
			} else {
				
				break;
				
			}
			
		}		
	}
	
}

// walk form an itial point to a destination point in manhattan metric without obstacles
function walkThereFrom(whoIndex,x0,y0,x,y,n,first) {
	
	var X = x - x0,
		Y = y - y0;
	//console.log('X',X,'Y',Y)
		
	var step = X>0?'upx'+n:'dwx'+n;
	var xmove = [];
	for (var k=0;k<Math.abs(X);++k) xmove.push('walking("'+step+'",'+whoIndex+')');
	
	var step = Y>0?'upy'+n:'dwy'+n;
	var ymove = [];
	for (var k=0;k<Math.abs(Y);++k) xmove.push('walking("'+step+'",'+whoIndex+')');
	
	var allmoves = [];
	if (first=='x') {
		allmoves = xmove.concat(ymove);
	} else if (first=='y') {
		allmoves = ymove.concat(xmove);		
	} else if (Math.abs(X)>Math.abs(Y)) {
		allmoves = xmove.concat(ymove);		
	} else {
		allmoves = ymove.concat(xmove);			
	}
	
	//console.log(allmoves)
	return allmoves;
}

// walk to a destination point in manhattan metric without obstacles
function walkThere(whoIndex,x,y,n,first) {
	var g = stuff['front'][whoIndex];
	return walkThereFrom(whoIndex,g.X,g.Y,x,y,n,first);	
}

// DOOR ACTION STUFF >>>>>>>>>>>>>>>>>>>

function sliders(col,Zbol,acton,key1,key2) {
	if (col&Zbol) {
		//console.log(key1,'->',key2)
		if (keyOn.slice(0,-1)==key1) walking(key2+'1',guyIndex);
	}
}

function changeroom(col,Zbol,actOn,which) {
	if (col&&Zbol) loadRoom(which);
}

function teleporter(col,Zbol,actOn,room1,room2){
	if (col&&Zbol&&!firstTimeOnTeleporter) {
		firstTimeOnTeleporter = true;
		var which =  room1==room ? room2 : room1 ;
		loadRoom(which);
	} else if (!col&&!Zbol) {
		firstTimeOnTeleporter = false;		
	}
}

function openclosedoor(col,Zbol,actOn,id,type,keepit) {
	if (type=='automatic') {
		automaticdoor(col,Zbol,id);
	} else if (type=='door') {
		normaldoor(col,Zbol,actOn,id,keepit);
		//elevatordoor(col,Zbol,actOn,id);
	} else if (type=='elevator') {
		elevatordoor(col,Zbol,actOn,id);
	}
	makeSpace();
}

function normaldoor(col,Zbol,actOn,id,keepit) {	
	if (col&&Zbol&&actOn) {		
		// check collision between guy and door
		var ind = stuff['front'].flatMap((s, i) => s['ID']==id && s['type']=='doors' && !collision(s,stuff['front'][guyIndex]) ? i : []);
		//console.log(ind)
		if (ind.length==3) {
			for (var k=0; k<ind.length; ++k) {
				stuff['front'][ind[k]]['solid']   = !stuff['front'][ind[k]]['solid'];
				stuff['front'][ind[k]]['visible'] = !stuff['front'][ind[k]]['visible'];
				actionOn = false;
			}
		}
	} else if (!(col&&Zbol)){
		// close door when guy outside the square
		for (var k=0; k<stuff['front'].length; ++k) {
			s = stuff['front'][k];
			if (s['ID']==id && s['type']=='doors'){
				stuff['front'][k]['solid']   = s['state']==keepit;
				stuff['front'][k]['visible'] = s['state']==keepit;
			}
		}	
	}
}

function elevatordoor(col,Zbol,actOn,id) {	
	if (col&&Zbol&&actOn) {
		for (var k=0; k<stuff['front'].length; ++k) {
			s = stuff['front'][k];
			if (s['ID']==id && s['type']=='doors'){
				stuff['front'][k]['solid']   = s['state']=='open';
				stuff['front'][k]['visible'] = s['state']=='open';	
			}
		}
	} else if (!(col&&Zbol)){
		// close door when guy outside the square
		for (var k=0; k<stuff['front'].length; ++k) {
			s = stuff['front'][k];
			if (s['ID']==id && s['type']=='doors'){
				stuff['front'][k]['solid']   = s['state']=='closed';
				stuff['front'][k]['visible'] = s['state']=='closed';
			}
		}	
	}
}

function automaticdoor(col,Zbol,id) {
	
	// check collision between guy and door
	for (var k=0; k<stuff['front'].length; ++k) {
		s = stuff['front'][k];
		if (s['ID']==id && s['type']=='doors'){
			if (col&&Zbol) {
				stuff['front'][k]['solid']   = s['state']!='closed';
				stuff['front'][k]['visible'] = s['state']!='closed';
			} else {
				stuff['front'][k]['solid']   = s['state']=='closed';
				stuff['front'][k]['visible'] = s['state']=='closed';
			}
		}
	}
	
}
	
function verynormaldoor(col,Zbol,actOn,id) {
	// good
	if (col&&Zbol&&actOn) {
		for (var k=0; k<stuff['front'].length; ++k) {
			s = stuff['front'][k];
			if (s['ID']==id && s['type']=='doors'){
				
				stuff['front'][k]['solid']   = !s['solid'];
				stuff['front'][k]['visible'] = !s['visible'];
				
				g = stuff['front'][guyIndex];
				console.log(s)
				// Move the guy if it collaps with the door
				if (collision(s,g)) {
					var steps = ['upx'+(s['XM']-g['X']),'upy'+(s['YM']-g['Y'])]
					var step = (s['state']=='open' ^ s['spin']==1) ? steps[1] : steps[0] ;
					walking(step,guyIndex);
				}				
			}
		}
	}	
}


// DOOR ACTION STUFF <<<<<<<<<<<<<<<<<<<<<<<


// SPECIAL ACTIONS/ROOMS >>>>>>>>>

function menuCover() {
	
	// write start menu
	var cursor = (menuIndex==2) ? '>>||  ||  ' : ( (menuIndex==1) ? '  ||>>||  ' : '  ||  ||>>')
	writeText(cursor,233,62,'text_normal',false,false,false);
		
	if (actionOn) {
		if (chapter==0) { 
			if (menuIndex==2) {
				// let's go
				actionOn = false;
				loadRoom('hotel_room_5');
			} else if (menuIndex==1) {
				// let's go for the menu
			} else if (menuIndex==0) {
				// let's restart
				actionOn = false;
				location.reload();
			}
		}
	} else {
		blockKeys = false;
	}
	
}

function elevatorMirror(){
	
	var mirroredIndex = stuff['front'].flatMap((it, i) => it['ID'] == 'reflection' ? i : [])[0];
	guy = stuff['front'][guyIndex];
	
    var x  = B(4,0)-2-guy['X'],
	    y  = guy['Y'];
    var pm = {'01':'00','00':'10','11':'01','10':'11'}[guy['file'].slice(-3,-1)];
    pm=guy['file'].slice(0,-3)+pm+guy['file'].slice(-1);
	
	stuff[label][mirroredIndex]['file'] = pm;
	stuff[label][mirroredIndex]['spin'] = -1;
	stuff[label][mirroredIndex]['X'] = x;
	stuff[label][mirroredIndex]['Y'] = y;	
	
	completeStuffItem(mirroredIndex,2,2,0,0);
	
}


// FUNCTIONS RELATED WITH CHANGES IN STUFF STATE >>>>>

function getObject(item) {
	if (objects.includes(item)) {
		objects.splice(objects.indexOf(item),1);
		objectIndex = 0;
	} else {
		objects.push(item);
	}
}

function setFile(file,ind) {
	stuff['front'][ind]['file'] = file;
}

function hideshowItem(id,solid) {	

	var items = stuff['front'].flatMap((it, i) => it['ID'] == id ? i : []);
	//console.log(items)
	for (var k=0;k<items.length;++k) {
		stuff['front'][items[k]]['visible'] = !stuff['front'][items[k]]['visible'];
		if (solid) stuff['front'][items[k]]['solid']   =  stuff['front'][items[k]]['visible'];
	}
	//console.log(stuff['front'][items[0]])
	
}

// FOR CINEMATICS join any new cinematics to the one running at that moment
function setCinematics(newcine) {
	cinematics = newcine.concat(cinematics)
	blockKeys  = true;
	actionOn   = false;
}

// CINEMATIC EVENTS >>>>>>>>>>>>>>>>>>>>>>>>>
function takethecase(col,Zbol,actOn,X,Y) {
	
	if (col&&Zbol&&actOn&&(!objects.includes('maletin')||objects[objectIndex]=='maletin')) {		

		var file = stuff['front'][guyIndex]['file'].slice(0,2)=='00'?'m0_01N':'00_01N';
		var walkit = walkThere(guyIndex,X+2,Y,1,0);
		var takeit = ['walking("upy0",guyIndex)',
					  'walking("stp0",guyIndex)',
					  'setFile("w0_01N",guyIndex)',
					  'hideshowItem("case",false)',
					  'setFile("'+file+'",guyIndex);getObject("maletin")'];
		setCinematics(walkit.concat(takeit));
		console.log(cinematics)
	
	}

}

// Take the case and leave the room
function walkout(col,Zbol,actOn,startgame) {
	if (startgame&&actOn) {
		// 1. walk and take the maletin
		// 2. walk to the door, open it
		// 3. go and close the door, get the key
		// 4. move forward and stops
		
		var walkit1 = walkThere(guyIndex,B(2,4),B(2,4),1,0);
		var walkit2 = walkThereFrom(guyIndex,B(2,4),B(2,4),B(2,4),B(4,4),1,0);
		var walkit8 = Array(8).fill('walking("upy1",guyIndex)')
		var act = ['actionOn=true'];
		setCinematics(
					  walkit1.concat(act)
					  .concat(walkit2).concat(act)
					  .concat(walkit8).concat('walking("stp0",guyIndex)').concat(act)
					  .concat('getObject("roomkey")')
					  .concat(walkit8)
					  );
		console.log(cinematics);
		
	}
}



















	
