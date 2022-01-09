
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
			console.log('1',im['ID'],go)
			// solid 
			if (go) {
				dz = goup <=3 ? goup : (godown >=-3 ? godown : 0 ) ;
				testa.Z  += dz;
				testa.ZM += dz;
				go = go && !space['solid'].some( obj => collision(testa,obj) && ((testa.Z>=obj.Z&&testa.Z<obj.ZM)||(testa.Z<=obj.Z && testa.ZM>obj.Z)) && im['ID']!=obj['ID'] );
				//console.log(space['solid'].filter( obj => collision(testa,obj)&& ((testa.Z>=obj.Z&&testa.Z<obj.ZM)||(testa.Z<=obj.Z && testa.ZM>obj.Z))&& im['ID']!=obj['ID'] ))
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
				console.log(n,'>',im['ID'],im['X'],im['Y'],im['Z'],[Math.floor(im['X']/8),Math.floor(im['Y']/8),Math.floor(im['Z']/8)],dz)
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
	for (var k=0;k<Math.abs(X/n);++k) xmove.push('walking("'+step+'",'+whoIndex+')');
	
	var step = Y>0?'upy'+n:'dwy'+n;
	var ymove = [];
	for (var k=0;k<Math.abs(Y/n);++k) ymove.push('walking("'+step+'",'+whoIndex+')');
	
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
	} else if (!(col)){
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


function getIndexFromID(id){
	return stuff['front'].flatMap((it, i) => it['ID'] == id ? i : []);
}

function whoTalks(who,txt,tt,point) {
	var st = stuff['front'][getIndexFromID(who)[0]];
	var lines = txt.split("|").length // make space if there are several lines
	var i = Math.floor((st['I0']+st['IM'])/2),
	    j = st['JM']+11*lines;  //put it on top of the one speaking
	listText.push({'text':txt,'I0':i,'J0':j,'type':'text_normal','centered':true,'bubble':true,'pointer':point,'time':tt,'who':who});
}

function getObject(item) {
	if (objects.includes(item)) {
		objects.splice(objects.indexOf(item),1);
		objectIndex = 0;
	} else {
		objects.push(item);
	}
}

function setFileByID(file,id) {
	setFile(file,getIndexFromID(id)[0]);
}
function setFile(file,ind) {
	stuff['front'][ind]['file'] = file;
}
function setStateByID(state,id) {
	stuff['front'][getIndexFromID(id)[0]]['state'] = state;
}

function hideshowItem(id,solid) {	

	var items = getIndexFromID(id);
	//console.log(items)
	for (var k=0;k<items.length;++k) {
		var st = stuff['front'][items[k]];
		st['visible'] = !st['visible'];
		if (solid) {
			st['solid'] = !st['solid'];
			if (!st['solid']) space['solid'] = space['solid'].filter(obj => obj['ID']!=st['ID']);
		}
	}
	//console.log(stuff['front'][items[0]])
	
}

function walkingByID(step,id){
	walking(step,getIndexFromID(id)[0])
}

function moveItemByID(step,id) {
	
	// get the index
	var indk = getIndexFromID(id)[0];	
	
	//define the deltas in IJ space
    var delta = {'upy':{'xyz':[ 0, 1, 0],'ij':[-2, 1]},
				 'dwy':{'xyz':[ 0,-1, 0],'ij':[ 2,-1]},
				 'upx':{'xyz':[ 1, 0, 0],'ij':[ 2, 1]},
				 'dwx':{'xyz':[-1, 0, 0],'ij':[-2,-1]},
				 'upz':{'xyz':[ 0, 0, 1],'ij':[ 0, 1]},
				 'dwz':{'xyz':[ 0, 0,-1],'ij':[ 0,-1]}};
	var move = delta[step.slice(0,-1)];
	
	// take how many pixels
	var q = step.slice(-1);
	
	// apply movement
	stuff['front'][indk]['X']  += q*move.xyz[0];
	stuff['front'][indk]['Y']  += q*move.xyz[1];
	stuff['front'][indk]['Z']  += q*move.xyz[2];
	stuff['front'][indk]['XM'] += q*move.xyz[0];
	stuff['front'][indk]['YM'] += q*move.xyz[1];
	stuff['front'][indk]['ZM'] += q*move.xyz[2];
	stuff['front'][indk]['I0'] += q*move.ij[0];		
	stuff['front'][indk]['J0'] += q*move.ij[1];
	stuff['front'][indk]['IM'] += q*move.ij[0];		
	stuff['front'][indk]['JM'] += q*move.ij[1];
	
}


// CINEMATIC EVENTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// FOR CINEMATICS join any new cinematics to the one running at that moment

function setCinematics(newcine) {
	cinematics = newcine.concat(cinematics)
	blockKeys  = true;
	actionOn   = false;
}

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
function walkout(col,Zbol,actOn) {
	if (chapter==0&&actOn) {
		++chapter;
		// 1. walk and take the maletin
		// 2. walk to the door, open it
		// 3. go and close the door, get the key
		// 4. move forward and stops
		
		var walkit1 = walkThere(guyIndex,B(2,4),B(2,4),1,0);
		var walkit2 = walkThereFrom(guyIndex,B(2,4),B(2,4),B(2,4),B(4,4),1,0);
		var walkit8 = Array(8).fill('walking("upy1",guyIndex)')
		var act = ['actionOn=true'];
		
		var walkit1 =  ['moveItemByID("upx2","guy");moveItemByID("dwy1","guy");whoTalks("girl","NOOOOOOOOOOOOOOOOOOOO!!",11,true);setFileByID("1_01N","girl")',
					    'moveItemByID("dwy1","guy")',
					    'moveItemByID("dwy1","guy")',
						'setFile("ff_00L",guyIndex);walking("upx2",guyIndex);moveItemByID("dwy1","guy");setFileByID("p0_00N","dealer");whoTalks("dealer","BANG!!",3,false)',
						'walking("upx1",guyIndex);moveItemByID("dwy1","guy")',
						'walking("upx1",guyIndex);moveItemByID("dwy1","guy")',
						'setFile("00_01N",guyIndex);walking("stp0",guyIndex);setFileByID("g0_00N","dealer")','',
						'setFile("ff_00L",guyIndex);walking("upx2",guyIndex);moveItemByID("dwy1","guy");setFileByID("p0_00N","dealer");whoTalks("dealer","BANG!!",10,false)',
						'walking("upx1",guyIndex);moveItemByID("dwy1","guy")',
						'walking("upx1",guyIndex);moveItemByID("dwy1","guy")',
						'setFile("00_01N",guyIndex);walking("stp0",guyIndex);setFileByID("g0_00N","dealer");setFileByID("0_01N","girl")'].concat(Array(15).fill(''));
		var talkit1 = ['actionOn=true'].concat(Array(4).fill('')).concat(['whoTalks("dealer","Put the case down, NOW!",40,true)']).concat(Array(44).fill(''));
		var talkit2 = ['whoTalks("dealer","Don'+"'"+'t move or she dies.",40,true)'].concat(Array(44).fill(''));
		var talkit3 = ['whoTalks("dealer","Surprise motherfucker",20,true)'].concat(Array(7).fill('walkingByID("upx1","dealer")'))
						.concat(['walkingByID("stp0","dealer");setFileByID("00_00N","dealer")','','','']);
		var enter1  = ['setFileByID("l0_00N","dealer");whoTalks("lamp","CLICK",6,false);setStateByID("off","lamp")'].concat(Array(5).fill(''));
		var enter2  = ['setFileByID("00_00N","dealer")'].concat(Array(8).fill(''));
		var walkit2  = ['setFileByID("1_01N","girl");whoTalks("girl","Behind you!!!",20,false);walking("dwy0",guyIndex);walking("stp0",guyIndex)']
						.concat(Array(20).fill(''));
		var walkit3  = ['setFileByID("0_01N","girl");whoTalks("guy","Babe, are you here?",20,false)'].concat(Array(14).fill('walking("dwy1",guyIndex)'));
		var walkit4  = ['actionOn=true;walking("dwy1",guyIndex)'].concat(Array(11).fill('walking("dwy1",guyIndex)'))
	.concat(['openclosedoor(true,true,true,"hotel_room_5","door","closed");whoTalks("guy","CLICK",5,false);objects.push("roomkey");objectIndex=3']);
		setCinematics(
					  walkit1.concat(talkit1).concat(talkit2).concat(talkit3).concat(enter1)
					  .concat(enter2).concat(walkit2).concat(walkit3).concat(walkit4)
					  );
		console.log(cinematics);
		
	}
}

function killthegangsterdude(col,Zbol,actOn) {
	
	if(actOn&&objects[objectIndex]=='gun'&&chapter<=1) {
		
		++chapter;
		
		guy = stuff['front'][guyIndex];		
		var walkit0a = walkThere(guyIndex,21,30,1,'y').concat(walkThereFrom(guyIndex,21,30,B(3,6),B(1,0),1,'y'));
		var walkit0b = walkThere(guyIndex,B(3,6),B(1,0),1,'y');
		var walkit1  = guy.X>21&&guy.Y>B(3,0) ? walkit0a : walkit0b ;
		var gunit    = ['walking("upx0",guyIndex)','setFile("mg_00N",guyIndex)'];
		var deaddude = Array(10*4).fill('');
		for (var k=0;k<8;++k) deaddude[4*k] = 'setFileByID("d'+k+'_00N","ddude")';
		var talk1    = ['whoTalks("ddude","F*CK! I'+"'"+'m dying...|you son of a...",40,true)'].concat(Array(50).fill(''));
		var shoots1  = ['hideshowItem("ddude",true);hideshowItem("dude",false);setFileByID("00_01N","dude")',
				'whoTalks("dude","AAARGG!!",15,true);setFile("mp_00N",guyIndex)','whoTalks("guy","BANG!!",10,false)','',
				'moveItemByID("dwy1","dude");moveItemByID("upx1","dude");setFileByID("ss_10R","dude");moveItemByID("upz2","tv");moveItemByID("upz2","box")',
				'moveItemByID("dwy1","dude");moveItemByID("upx1","dude");setFileByID("ss_10L","dude");moveItemByID("dwz1","box")',
				'moveItemByID("dwy1","dude");moveItemByID("upx1","dude");setFileByID("ss_10R","dude");moveItemByID("dwz1","box");moveItemByID("dwz1","tv")',
				'moveItemByID("dwz1","tv") ;setFileByID("ss_10L","dude")',
				'setStateByID("itsOn","tv");setFileByID("ss_10R","dude")','',
				'moveItemByID("dwy0","dude")','',
				'setFileByID("g0_01N","dude");setFile("mp_00N",guyIndex);setFile("mg_00N",guyIndex)'].concat(Array(10).fill(''));
		var shoots2  = ['whoTalks("dude","BANG!!",10,false);setFileByID("p0_01N","dude");moveItemByID("upz2","lamp");moveItemByID("dwx1","lamp");moveItemByID("upy1","lamp")',
						'moveItemByID("dwz1","lamp")','moveItemByID("dwz1","lamp")','setFileByID("lampon","lamp");setStateByID("on","lamp")',
						'','','','','','','setFileByID("g0_01N","dude")','whoTalks("dude","Then die, punk!",30,true)'].concat(Array(32).fill(''));
		var talk2    = ['whoTalks("guy","I'+"'"+'m not scared, you will|miss and I'+"'"+'ll shoot you.",50,true)'].concat(Array(52).fill(''));
		var talk3    = ['whoTalks("dude","Give me the case NOW or|I'+"'"+'ll kill you just here.",50,true)'].concat(Array(52).fill(''));
		var run      = ['setFile("m0_00N",guyIndex);setFileByID("00_01N","dude")']
						.concat(Array(7).fill('walkingByID("upy2","dude")'))
						.concat(['hideshowItem("dude",false)']);
		var walkit2  = walkThereFrom(guyIndex,B(3,6),B(1,0),B(2,2),B(5,0),2,'x');
						
		setCinematics(
					  walkit1.concat(gunit).concat(deaddude)
					  .concat(talk1)
					  .concat(shoots1).concat(shoots2)
					  .concat(talk2).concat(talk3)
					  .concat(run).concat(walkit2)
					  );
		console.log(cinematics);
		
	}
	
}

function dudegototoilet(col,Zbol,actOn) {
	
	if (chapter==2) {
		
		++chapter;
		
		var walk1 = Array(4).fill('walking("upy2",guyIndex);walkingByID("upx2","dude")');
		var talk1 = ['walking("dwx0",guyIndex);walking("stp0",guyIndex);walkingByID("stp0","dude")','','whoTalks("guy","Come and take it!",30,true)'].concat(Array(32).fill(''));
		var talk2 = ['whoTalks("dude","Did you bring the case? GIVE IT TO ME!",50,true);setFileByID("f0_00N","dude")'].concat(Array(52).fill(''));
		var talk3 = ['whoTalks("dude","Why are you dressed as one|of the El Jefe'+"'"+'s guys?",50,true);setFileByID("00_00N","dude")'].concat(Array(52).fill(''));
		var talk4 = ['whoTalks("dude","YOU! HAHAHA! You are dumber|than what I thought, punk!",50,true)'].concat(Array(54).fill(''));
		var talk5 = Array(11).fill('walkingByID("upx1","dude")')
					.concat(['walkingByID("stp0","dude");whoTalks("dude","HEY WHO ARE YOU!!",20,true)']).concat(Array(20).fill(''))
					.concat(Array(10).fill('walkingByID("upx1","dude")')).concat('whoTalks("toilet_5","FUSSSSHHHH",54,false);walkingByID("upx1","dude")')
					.concat(['openclosedoor(true,true,true,"toilet_5","door","closed");hideshowItem("dude",false)']);
		setCinematics(
					  walk1.concat(talk1).concat(talk2).concat(talk3).concat(talk4).concat(talk5)
					  );
		console.log(cinematics);
		
	}
	
}




















	
