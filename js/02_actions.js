
// ACTIONS ----------------------------------------------------------------------------------------
function playMusic(songIndex,loop) {
	music.pause();
	music = songs[songIndex];
	music.loop = loop;
	music.play();
	music.volume=mute?0:1;
}

function playIntroAndLoop(songIndex1,songIndex2) {
	music.pause();
	music = songs[songIndex1];
	music.play();	
	music.volume=mute?0:1;
	music.addEventListener('ended', (e) => {playMusic(songIndex2,true)})
}

/*
audioElement.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
*/

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
			//console.log(q,im['ID'],go)
			// solid 
			if (go) {
				dz = goup <=3 ? goup : (godown >=-3 ? godown : 0 ) ;
				testa.Z  += dz;
				testa.ZM += dz;
				
				var collide = space['solid'].some( obj => collision(testa,obj) && ((testa.Z>=obj.Z&&testa.Z<obj.ZM)||(testa.Z<=obj.Z && testa.ZM>obj.Z)) && im['ID']!=obj['ID'] );
				
				// solid only for non-guys, change it if necessary
				go = (im['ID']!='guy') || ( !collide && im['ID']=='guy' ) ;
				
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
				if (testing) console.log(n,'>',im['ID'],im['file'],im['X'],im['Y'],im['Z'],[Math.floor(im['X']/8),Math.floor(im['Y']/8),Math.floor(im['Z']/8)],dz)
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
	} else if (!(col&&Zbol) && !fullControl ){
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
	} else if (!(col&&Zbol) && !fullControl ){
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
	
	menuIndex = Math.max(1,Math.min(menuIndex,2));
	
	// write start menu
	var cursor = (menuIndex==2) ? '>>| | ' : ' | |>>' ;
	writeText(cursor,5,150,'text_normal',false,false,false);
	walking('upy0',guyIndex);
		
	if (actionOn) {
		if (chapter==0) { 
			if (menuIndex==2) {
				// let's go
				actionOn = false;
				loadRoom('hotel_room_5');
			} else if (menuIndex==1) {
				// let's go for the menu
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
	var i = Math.round((st['I0']+st['IM'])/2),
	    j = st['JM']+11*lines;  //put it on top of the one speaking
	listText.push({'text':txt,'I0':i,'J0':j,'type':'text_normal','centered':true,'bubble':true,'pointer':point,'time':tt,'who':who});
}

function chapterTitles(n,txt) {
	var i = width/2,
	    j = 100;  //put it on top of the one speaking
	listText.push({'text':'Chapter'+n+':','I0':i,'J0':j,'type':'gothic','centered':true,'bubble':false,'pointer':false,'time':100});
	listText.push({'text':txt,'I0':i,'J0':j/2,'type':'gothic','centered':true,'bubble':false,'pointer':false,'time':100});
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

function setFile02ByID(file,id) {
	setFile02(file,getIndexFromID(id)[0]);
}
function setFile02(file,ind) {
	setFile(file+"_"+stuff['front'][ind]['file'].substring(3,6),ind);
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
	moveItem(step,getIndexFromID(id)[0])
}

function moveItem(step,indk) {	
	//define the deltas in IJ space
    var delta = {'upy':{'xyz':[ 0, 1, 0],'ij':[-2, 1]},
				 'dwy':{'xyz':[ 0,-1, 0],'ij':[ 2,-1]},
				 'upx':{'xyz':[ 1, 0, 0],'ij':[ 2, 1]},
				 'dwx':{'xyz':[-1, 0, 0],'ij':[-2,-1]},
				 'upz':{'xyz':[ 0, 0, 1],'ij':[ 0, 1]},
				 'dwz':{'xyz':[ 0, 0,-1],'ij':[ 0,-1]}};
	var move = delta[step.slice(0,3)];
	
	// take how many pixels
	var q = step.slice(3);
	
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

function follows(col,Zbol,actOn,who,whom) {
	if (!memory[room]['istalking']) followMe(who,whom,false)
}
function followMe(who,whom,eachother) {
	
	var stwho  = stuff['front'].filter(it => it['ID']==who)[0];
	var stwhom = stuff['front'].filter(it => it['ID']==whom)[0];

	var X = stwhom.X-stwho.X,
	    Y = stwhom.Y-stwho.Y;

	var U = X-Y,
	    V = (X+Y)/2;
	
	var pos,last;
 
	//console.log(U,V)
    if (U<=0&&V<=0) {
		
		pos  = '00';
		last = 'N';
		if (stwho['file'].slice(-1)=='N'&&stwho['file'].slice(-3,-1)=='01') last = 'L';
		if (stwho['file'].slice(-1)=='N'&&stwho['file'].slice(-3,-1)=='10') last = 'R';
                
    } else if (U>0&&V<=0) {
		
		pos  = '01';
		last = 'N';
		if (stwho['file'].slice(-1)=='N'&&stwho['file'].slice(-3,-1)=='00') last = 'L';
		if (stwho['file'].slice(-1)=='N'&&stwho['file'].slice(-3,-1)=='11') last = 'R';
		                
    } else if (U>0&&V>0) {
		
		pos  = '11';
		last = 'N';
		if (stwho['file'].slice(-1)=='N'&&stwho['file'].slice(-3,-1)=='01') last = 'L';
		if (stwho['file'].slice(-1)=='N'&&stwho['file'].slice(-3,-1)=='10') last = 'R';
                
    } else if (U<=0&&V>0) {
		
		pos = '10';
		last = 'N';
		if (stwho['file'].slice(-1)=='N'&&stwho['file'].slice(-3,-1)=='11') last = 'L';
		if (stwho['file'].slice(-1)=='N'&&stwho['file'].slice(-3,-1)=='00') last = 'R';
		
	}
	//console.log(stwho['file'])
    stwho['file'] = stwho['file'].slice(0,3)+pos+last; 
	//console.log(stwho['file'])
	
	if (eachother) {

        if (U<=0&&V<=0) {
            pos = '11';          
        } else if (U>0&&V<=0) {
            pos = '10';             
        } else if (U>0&&V>0) {
            pos = '00';            
        } else if (U<=0&&V>0) {
            pos = '01';
		}
        stwhom['file'] = stwhom['file'].slice(0,3)+pos+stwhom['file'].slice(-1);
	
	}	
	
}

function turnItOnOff(col,Zbol,actOn,what,who,go) {

	if (col&&Zbol&&actOn&&go) {	
		if ( (objects[objectIndex]=='mano'&&who=='guy') || who!='guy' )  {	
			var lamp = stuff['front'].filter(it => it['ID']==what)[0];
			var fl = what;
			if (what=='lamp') {
				var st = lamp['state']=='off'?'on':'off';
				fl += st;
			} else if(what=='tv') {
				var st = lamp['state']=='itsOff'?'itsOn':'itsOff';
			}	
			//console.log(st)
			
			memory[room][what] = st;
			
			var dir = '00N';		
			
			var fil1 = '"mh_"+stuff["front"][getIndexFromID("'+who+'")]["file"].substring(3,5)+"N"';
			var fil2 = '"'+stuff["front"][getIndexFromID(who)]["file"].substring(0,3)+'"+stuff["front"][getIndexFromID("'+who+'")]["file"].substring(3,6)';
		
			var enter1  = ['followMe("'+who+'","'+what+'",false)',
						'setFileByID('+fil1+',"'+who+'")','whoTalks("'+what+'","CLICK",6,false)','setStateByID("'+st+'","'+what+'")','setFileByID("'+fl+'","'+what+'")']
							.concat(Array(5).fill(''));
			var enter2  = ['setFileByID('+fil2+',"'+who+'")'];
	
			setCinematics(enter1.concat(enter2));
			if (printcine) console.log(cinematics);
		
		} else {
			whoTalks("guy","This is not the way to turn the lights.",30,true);			
		}
	
	}	
	
}

// Take the case
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
		if (printcine) console.log(cinematics);
	
	}

}

// DIE, TAKE THE CASE AND LEAVE THE ROOM CHAPTER 0 ----------------------------------------------------------------------------------
function walkout(col,Zbol,actOn) {
	if (chapter==0) {
		++chapter;
		listText = [];
		// 1. walk and take the maletin
		// 2. walk to the door, open it
		// 3. go and close the door, get the key
		// 4. move forward and stops
		
		var walkit1 = walkThere(guyIndex,B(2,4),B(2,4),1,0);
		var walkit2 = walkThereFrom(guyIndex,B(2,4),B(2,4),B(2,4),B(4,4),1,0);
		var walkit8 = Array(8).fill('walking("upy1",guyIndex)')
		var act = ['actionOn=true'];
		
		var walkit1 =  ['','','','','','','','','whoTalks("girl","NOOOOOOOOOOOOOOOOOOOO!!",20,true);setFileByID("1_01N","girl")','','','','','','','','',
						'setFile("ff_00L",guyIndex);walking("upx2",guyIndex);moveItemByID("dwy1","guy");setFileByID("p0_00N","dealer");whoTalks("dealer","BANG!!",3,false)',
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
						.concat(['walkingByID("stp0","dealer");setFileByID("00_00N","dealer");followMe("guy","girl",false)','followMe("guy","girl",false)','','']);
		var enter1  = ['setFileByID("l0_00N","dealer");whoTalks("lamp","CLICK",6,false);setStateByID("off","lamp")'].concat(Array(5).fill(''));
		var enter2  = ['setFileByID("00_00N","dealer")'].concat(Array(8).fill(''));
		var walkit2  = ['setFileByID("1_01N","girl");whoTalks("girl","Behind you!!!",20,true)']
						.concat(Array(20).fill(''));
		var walkit3  = ['setFileByID("0_01N","girl");whoTalks("guy","Babe, are you here?",20,true)'].concat(Array(14).fill('walking("dwy1",guyIndex)'));
		var walkit4  = ['actionOn=true;walking("dwy1",guyIndex)'].concat(Array(11).fill('walking("dwy1",guyIndex)')).concat(['walking("stp0",guyIndex)'])
	.concat(['openclosedoor(true,true,true,"hotel_room_5","door","closed");whoTalks("guy","CLICK",10,false);objects.push("roomkey");objectIndex=3;setFile02("mo",guyIndex)']).concat(Array(10).fill(''));
	    var title = ['chapterTitles(4,"Death")'].concat(Array(99).fill('')).concat(['objectIndex=0;setFile02("m0",guyIndex)']);
		setCinematics(
					  walkit1.concat(talkit1).concat(talkit2).concat(talkit3).concat(enter1)
					  .concat(enter2).concat(walkit2).concat(walkit3).concat(walkit4).concat(title)
					  );
		if (printcine) console.log(cinematics);
		
	}
}

// THE GANSTER DUDE CHAPTER 1 ----------------------------------------------------------------------------------

function killthegangsterdude(col,Zbol,actOn) {
	
	if(actOn&&chapter<=1) {
		
		if (objects[objectIndex]=='gun') {
		
			listText = [];
			++chapter;
			
			guy = stuff['front'][guyIndex];		
			var walkit0a = walkThere(guyIndex,21,30,1,'y').concat(walkThereFrom(guyIndex,21,30,B(3,6),B(1,0),1,'y'));
			var walkit0b = walkThere(guyIndex,B(3,6),B(1,0),1,'y');
			var walkit1  = guy.X>21&&guy.Y>B(3,0) ? walkit0a : walkit0b ;
			var gunit    = ['walking("upx0",guyIndex)','setFile("mg_00N",guyIndex)'];
			var deaddude = Array(10*4).fill('');
			for (var k=0;k<8;++k) deaddude[4*k] = 'setFileByID("d'+k+'_00N","ddude")';
			var talk1    = ['whoTalks("ddude","F*CK! I'+"'"+'m dying...|you son of a...",40,true)'].concat(Array(50).fill(''));
			var shoots1  = ['hideshowItem("ddude",true);hideshowItem("dude",false);setFileByID("00_01N","dude");memory[room]["ddude"]=false',
					'whoTalks("dude","AAARGG!!",15,true);setFile("mp_00N",guyIndex)','whoTalks("guy","BANG!!",10,false)','',
					'moveItemByID("dwy1","dude");moveItemByID("upx1","dude");setFileByID("ss_10R","dude");moveItemByID("upz2","tv");moveItemByID("upz2","box")',
					'moveItemByID("dwy1","dude");moveItemByID("upx1","dude");setFileByID("ss_10L","dude");moveItemByID("dwz1","box")',
					'moveItemByID("dwy1","dude");moveItemByID("upx1","dude");setFileByID("ss_10R","dude");moveItemByID("dwz1","box");moveItemByID("dwz1","tv")',
					'moveItemByID("dwz1","tv") ;setFileByID("ss_10L","dude")',
					'setStateByID("itsOn","tv");memory[room]["tv"]="itsOn";setFileByID("ss_10R","dude")','',
					'moveItemByID("dwy0","dude")','',
					'setFileByID("g0_01N","dude");setFile("mp_00N",guyIndex);setFile("mg_00N",guyIndex)'].concat(Array(10).fill(''));
			var shoots2  = ['whoTalks("dude","BANG!!",10,false);setFileByID("p0_01N","dude");moveItemByID("upz2","lamp");moveItemByID("dwx1","lamp");moveItemByID("upy1","lamp")',
							'moveItemByID("dwz1","lamp")','moveItemByID("dwz1","lamp")','setFileByID("lampon","lamp");setStateByID("on","lamp");memory[room]["lamp"]="on"',
							'','','','','','','setFileByID("g0_01N","dude")','whoTalks("dude","Then die, punk!",30,true)'].concat(Array(32).fill(''));
			var talk2    = ['whoTalks("guy","I'+"'"+'m not scared, you will|miss and I'+"'"+'ll shoot you.",50,true)'].concat(Array(52).fill(''));
			var talk3    = ['whoTalks("dude","Give me the case NOW or|I'+"'"+'ll kill you just here.",50,true)'].concat(Array(52).fill(''));
			var run      = ['setFile("m0_00N",guyIndex);setFileByID("00_01N","dude")']
							.concat(Array(7).fill('walkingByID("upy2","dude")'))
							.concat(['hideshowItem("dude",false);memory["hotel_corridor_5"]["dude"]=[B(4,4),B(5,2),true]']);
			var walkit2  = walkThereFrom(guyIndex,B(3,6),B(1,0),B(2,2),B(5,0),2,'x');
							
			setCinematics(
						walkit1.concat(gunit).concat(deaddude)
						.concat(talk1)
						.concat(shoots1).concat(shoots2)
						.concat(talk2).concat(talk3)
						.concat(run).concat(walkit2)
						);
			if (printcine) console.log(cinematics);
			
		} else {
			whoTalks("guy","This is not what I need here.",30,true)
		}		
	}
	
}

function dudegototoilet(col,Zbol,actOn) {
	
	if (chapter==2) {
		
		++chapter;
		
		var walk1 = Array(4).fill('walking("upy2",guyIndex);walkingByID("upx2","dude")');
		var talk1 = ['walking("dwx0",guyIndex);walking("stp0",guyIndex);walkingByID("stp0","dude")','','whoTalks("guy","Come and take it!",30,true)'].concat(Array(32).fill(''));
		var talk2 = ['whoTalks("dude","Did you bring the case? GIVE IT TO ME!",60,true);setFileByID("f0_00N","dude")'].concat(Array(62).fill(''));
		var talk4 = ['whoTalks("dude","YOU! HAHAHA!! Did you make the|phone call? You are dumb, punk!",100,true);setFileByID("00_00N","dude")'].concat(Array(102).fill(''));
		var talk5 = Array(11).fill('walkingByID("upx1","dude")')
					.concat(['walkingByID("stp0","dude");whoTalks("dude","HEY WHO ARE YOU!!",20,true)']).concat(Array(20).fill(''))
					.concat(Array(10).fill('walkingByID("upx1","dude")')).concat('whoTalks("toilet_5","FUSSSSHHHH",54,false);walkingByID("upx1","dude")')
					.concat(['openclosedoor(true,true,true,"toilet_5","door","closed");hideshowItem("dude",false);memory[room]["dude"]=[0,0,false],memory[room]["time"] = new Date()']);
		setCinematics(
					  walk1.concat(talk1).concat(talk2).concat(talk4).concat(talk5)
					  );
		if (printcine) console.log(cinematics);;
		
	}
	
}

function dudegoout(col,Zbol,actOn,doit) {
	if(doit&&!memory["hotel_corridor_5"]["istalking"]&&room=="hotel_corridor_5") {
		listText = [];
		memory["hotel_corridor_5"]["istalking"]=true;
		var w = preRoom.slice(0,-2)=='stairs'? 'upy1' : 'upx1' ;
		var walk1 = ['followMe("dude","guy",true);followMe("dude","guy",true);walking("stp0",guyIndex);setFile02ByID("g0","dude")',
					 'whoTalks("dude","Private floor. Get the fuck out of here.",40,true)'].concat(Array(41).fill(''))
					 .concat(Array(8).fill('walking("'+w+'",guyIndex)')).concat(['openclosedoor(true,true,true,"hotel_corridor_5","door","closed");memory["hotel_corridor_5"]["istalking"]=false'])
		setCinematics(
					  walk1
					  );
		if (printcine) console.log(cinematics);;		
	}
}

// GANGSTER GIRL AT THE TOP ROOF ----------------------------------------------------------------------------------

function ggirltalks(col,Zbol,actOn) {
	
	if (chapter==1) {
		
		if (listText.length==0&&Math.random()<0.01) {
			var u = Math.random();
			if (u<0.25) {
				whoTalks("ggirl","Cops are coming, I can hear the sirens.",50,true);
			} else if (u<0.5) {
				whoTalks("ggirl","Are you OK? I heard two shoots.",50,true);
			} else if (u<0.75) {
				whoTalks("ggirl","That was anything but smooth!|Everyone heard the shoots.",50,true);
			} else {
				whoTalks("ggirl","He'll be expecting you.",50,true);
			}  
		}
	
		if (col&&Zbol&&actOn) {
			listText = [];
			if (objects[objectIndex]=='mano') {
				
				var talks1 = ['followMe("ggirl","guy",true);walking("stp0",guyIndex)',
							'whoTalks("guy","I know, I'+"'"+'ll take care of it.|Thanks for the help.",60,true)'].concat(Array(62).fill(''));
				var talks2 = ['whoTalks("ggirl","Told ya, but you'+"'"+'re not gonna|have it that easy now.",120,true)'].concat(Array(122).fill(''));
				var talks3 = ['whoTalks("guy","...I put him in front of the|   light, and indeed he missed. ",120,true)'].concat(Array(122).fill(''));
				var talks4 = ['whoTalks("guy","I know, there was no other way.|I did what you told me...",120,true)'].concat(Array(122).fill(''));
				var talks5 = ['whoTalks("ggirl","He knows you are here,|every one heard the shoots.",120,true)'].concat(Array(122).fill(''));
				setCinematics(
							talks1.concat(talks2).concat(talks3).concat(talks4).concat(talks5)
							);
				if (printcine) console.log(cinematics);
			
			} else {
				whoTalks("guy","This is not what I need from her now.",30,true);
			}
		}	
		
	} else if (chapter==3) {
		
		if (listText.length==0&&Math.random()<0.01&&!memory["hotel_street_6"]["istalking"]) {
			var u = Math.random();
			if (u<0.25) {
				whoTalks("ggirl","They're gonna fight. They can kill you.",50,true);
			} else if (u<0.5) {
				whoTalks("ggirl","Do what I told you, it's your only chance.",50,true);
			} else if (u<0.75) {
				whoTalks("ggirl","She's in the room, but he's also there.",50,true);
			} else {
				whoTalks("ggirl","Careful with that psyco.",50,true);
			}  
		}
	
		if (col&&Zbol&&actOn) {
			listText = [];
			if (objects[objectIndex]=='roomkey') {
				memory["hotel_street_6"]["istalking"] = true;
				fullControl = true;
				
				guy = stuff['front'][guyIndex];
				var girl = stuff['front'][getIndexFromID('ggirl')];
				
				var talks1 = 
						['followMe("ggirl","guy",true);walking("stp0",guyIndex);setFile02("mo",guyIndex)',
							'whoTalks("guy","I know, I'+"'"+'ll take care of it.|Thanks for the help.",60,true)'].concat(Array(62).fill(''))
					.concat(['whoTalks("ggirl","...Use the key to enter in the room,|but once inside, you are in your own.",120,true)'].concat(Array(122).fill('')))
					.concat(['whoTalks("ggirl","...If he is facing to the light he doesn'+"'"+'t|see shit, he will miss the shoot...",120,true)'].concat(Array(122).fill('')))
					.concat(['whoTalks("ggirl","...If you want to kill that psyco make sure you|enter in the corridor while he is in the toilet...",120,true)'].concat(Array(122).fill('')))
					.concat(['whoTalks("ggirl","It'+"'"+'s not gonna be that easy. They will|kill you as soon they see the case...",120,true)'].concat(Array(122).fill('')))
				
					.concat(['setFile02ByID("0f","ggirl")',
							'whoTalks("guy","It'+"'"+'s a deal.",60,true)'].concat(Array(31).fill(''))
							.concat(['setFile02("mf",guyIndex);objects[objectIndex]="report";setFile02ByID("0o","ggirl")'])).concat(Array(31).fill(''))
				
					.concat(['whoTalks("ggirl","She'+"'"+'s downstairs in one of the rooms. I can give|you the key but you give me the file NOW.",120,true)'].concat(Array(122).fill(''))
							.concat(['setFile02ByID("00","ggirl")']))
					.concat(['whoTalks("guy","Tell me where to find her and|I take care of the gang.",120,true)'].concat(Array(122).fill('')))
					.concat(['whoTalks("ggirl","I have a debt with the gang, just|like you! I can'+"'"+'t just leave!",120,true)'].concat(Array(122).fill('')))
					.concat(['whoTalks("guy","It'+"'"+'s your file from the police station.|Your daughter'+"'"+'s foster home address is there.",120,true)'].concat(Array(122).fill(''))
							.concat(['setFile02("m0",guyIndex)']))
				
					.concat(['whoTalks("ggirl","What makes you think I want what you have?",120,true)'].concat(Array(122).fill('')))
				
				if ( Math.abs(guy.Y-girl.Y)<4 && girl.X<guy.X ) {
					var dy = 8;
					var walks1 = Array(dy).fill('walkingByID("upy1","ggirl")').concat(['setFile02ByID("0l","ggirl");walkingByID("upx1","ggirl")']);
				} else {
					var dy = 0;
					var walks1 = ['walkingByID("upx1","ggirl")'];
				}
				
				talks1 = talks1.concat(walks1);
				//talks1 = walks1;
				
				talks1 = talks1.concat(Array(11).fill('walkingByID("upx1","ggirl")').concat(['setFile02ByID("00","ggirl");walkingByID("stp0","ggirl")']))	
				
					.concat(['whoTalks("ggirl","Fuck me! It'+"'"+'s you! Why you dress|as one of El Jefe'+"'"+'s chads?",100,true)'].concat(Array(102).fill('')))
				
					.concat(['setFile02ByID("0g","ggirl")'].concat(Array(8).fill('walkingByID("upx1","ggirl")')))
				
					.concat(['walkingByID("upx1","ggirl");whoTalks("ggirl","Don'+"'"+'t. Fucking. Move.",30,true)'])
				
				var dh1 = B(4,4)-21;
				talks1 = talks1.concat(Array(dh1).fill('walkingByID("upx1","ggirl")').concat('walkingByID("upy0","ggirl");walkingByID("stp0","ggirl");setFile02ByID("0q","ggirl")'))
				
				var dh2 = B(4,1)-dy-16;
				talks1 = talks1			
				
					.concat(Array(dh2).fill('walkingByID("upy1","ggirl")').concat(['walkingByID("stp0","ggirl")']).concat(Array(2+30-dh1-dh2).fill('')))
				
					.concat(['whoTalks("guy","I have something for you. Help me and it'+"'"+'s yours.",80,true)'].concat(Array(82).fill('')))
					
					.concat(['whoTalks("ggirl","HEY, WHO THE HELL ARE YOU?",30,true)'].concat(Array(32).fill('')))
				
					.concat(['setFile02ByID("00","ggirl")'].concat(Array(16).fill('walkingByID("upy1","ggirl")')))
					
					.concat(['hideshowItem("ggirl",true);openclosedoor(true,true,true,"stairs_6","door","open")','','','','','','','','fullControl=false;++chapter;subt=0'])
					
				
				setCinematics(talks1)
				if (printcine) console.log(cinematics);
						
			} else {
				whoTalks("guy","This is not what I need from her now.",30,true);
			}
		}
		
	} else if (chapter==4) {
		subt = Math.min(subt+1,132);
		//console.log(subt)
	}
}

// GIRL RUNNING UP THE STAIRS CHAPTER 4 ----------------------------------------------------------------------------------
function ggirlrun(col,Zbol,actOn) {
		
	var vector = Array(30).fill('walkingByID("upx1","ggirl")')
				.concat(Array(30).fill('walkingByID("upy1","ggirl")')).concat(Array(30).fill('walkingByID("dwx1","ggirl")'))
				.concat(Array(32).fill('walkingByID("dwy1","ggirl")'))
				.concat(['fullControl=true;openclosedoor(true,true,true,"hotel_corridor_5","door","open");walkingByID("dwy1","ggirl")',
						 'walkingByID("dwy1","ggirl")','walkingByID("dwy1","ggirl")','walkingByID("dwy1","ggirl")','hideshowItem("ggirl",false)','','',
						 'openclosedoor(true,true,true,"hotel_corridor_5","door","closed");fullControl=false'])
	
	if (subt<=131) {
		var gg = stuff['front'].filter(it=>it['ID']=='ggirl')[0];
		gg['visible']=true;
		if (firstEntry) {
			subt = Math.max(subt,75);
			for (var k=0;k<subt;++k) {
				//console.log('pre',k,vector[k]);
				eval(vector[k]);
			}
		}
		subt = Math.min(subt+1,132);
		//console.log(subt,vector[subt]);
		var txt = subt==60 || (firstEntry && subt>60 && subt<100) ? ';whoTalks("ggirl","HEY, STOP NOW!!",30,true)' : '' ;
		eval(vector[subt]+txt);
	} else if (subt==132){
		++chapter;
		subt = 133;
	}	
}

// LOBBY  --------------------------------------------------------------------------------------------------

function lobbyphone(col,Zbol,actOn) {
	
	if (listText.length==0&&Math.random()<0.01) {
		var u = Math.random();
		if (u<0.25) {
			whoTalks("phone","**Hello? Is anybody there?.**",50,false);
		} else if (u<0.5) {
			whoTalks("phone","**The police is coming, be safe.**",50,false);
		} else if (u<0.75) {
			whoTalks("phone","**How many shoots did you hear?**",50,false);
		} else {
			whoTalks("phone","**Are you there? We are sending help.**",50,false);
		}  
	}

	if (col&&Zbol&&actOn&&objects[objectIndex]=='mano') {
		listText = [];
		if (objects[objectIndex]=='mano') {
			var talks1 = ['setFileByID("phoneuse","phone");followMe("guy","phone",false);walking("stp0",guyIndex);setFile02("mt",guyIndex)',
						'whoTalks("phone","**Who are you?**",50,false)'].concat(Array(52).fill(''));
			var talks2 = ['whoTalks("guy","...And the third one will die by his|own hands in some minutes from now.",120,true)'].concat(Array(122).fill(''));
			var talks3 = ['whoTalks("guy","...Another will be shot soon|and pushed through the window...",120,true)'].concat(Array(122).fill(''));
			var talks4 = ['whoTalks("guy","...One is lying right now in|a room at the top floor...",120,true)'].concat(Array(122).fill(''));
			var talks5 = ['whoTalks("guy","Yes, there are three casualties...",70,true)'].concat(Array(72).fill(''));
			var talks6 = ['whoTalks("phone","**Hello sir, can you explain what did happen?**",70,false)'].concat(Array(72).fill(''));
			var end    = ['setFileByID("phoneoff","phone");setFile02("m0",guyIndex)'];
			setCinematics(
						talks1.concat(talks2).concat(talks3).concat(talks4).concat(talks5).concat(talks6).concat(end)
						);
			if (printcine) console.log(cinematics);
		} else {
			whoTalks("guy","This is not how to use a phone.",30,true);
		}		
	}
}

function nowayStaff(col,Zbol,actOn,now) {
	
	if (col&&Zbol&&now&&!memory['hotel_corridor_0']['istalking']) {
		listText = [];
		memory["hotel_corridor_0"]["istalking"]=true;
		var talks1 = ['walking("upx0",guyIndex);walking("stp0",guyIndex)',
					  'whoTalks("bellboy","Sorry sir, this area|is for staff only.",40,true)']
					 .concat(Array(42).fill(''));
		var talks2 = ['whoTalks("guy","Sure, my bad.",30,true)'].concat(Array(15).fill(''));
		var walks  = Array(4).fill('walking("upx1",guyIndex)');
		setCinematics(
					  talks1.concat(talks2).concat(walks).concat('memory["hotel_corridor_0"]["istalking"]=false')
					  );
		if (printcine) console.log(cinematics);
	}
	
}
function nowayGuest(col,Zbol,actOn,now) {
	
	if (col&&Zbol&&now&&!memory['hotel_corridor_0']['istalking']) {
		listText = [];
		memory["hotel_corridor_0"]["istalking"]=true;
		var talks1 = ['walking("dwx0",guyIndex);walking("stp0",guyIndex)',
					  'whoTalks("bellboy","Sorry sir, this area|is for guests only.",40,true)']
					 .concat(Array(42).fill(''));
		var talks2 = ['whoTalks("guy","Sure, my bad.",30,true)'].concat(Array(15).fill(''));
		var walks  = Array(4).fill('walking("dwx1",guyIndex)');
		setCinematics(
					  talks1.concat(talks2).concat(walks).concat('memory["hotel_corridor_0"]["istalking"]=false')
					  );
		if (printcine) console.log(cinematics);
	}
	
}

function bellboytalks(col,Zbol,actOn) {
	if (memory['hotel_corridor_0']['bellboy']=='enter') {
		if (preRoom!='toilet_0') whoTalks("bellboy","Goodbye, sir.",30,true);
		memory['hotel_corridor_0']['bellboy']='entered';
	}
	
	if (col&&Zbol&&actOn&&chapter>=3) {
		listText = [];
		
		if (objects[objectIndex]=='mano') {
			var talks1 = ['followMe("bellboy","guy",true);walking("stp0",guyIndex)',
						'whoTalks("guy","Thank you very much.",20,true)'].concat(Array(22).fill(''));
						
			if (chapter<8) {			  
				var talks2 = ['whoTalks("bellboy","I see. Your room is in the second|floor, the door at the left.",40,true)'].concat(Array(42).fill(''))
					.concat(['whoTalks("guy","Yes, sorry, I have memory issues:|I forgot the number of my room.",40,true)'].concat(Array(42).fill('')));
			} else {
				var talks2 = ['whoTalks("bellboy","Good, sir. I am at your|disposal if you need anything.",40,true)'].concat(Array(42).fill(''))
					.concat(['whoTalks("guy","No, I am fine.",40,true)'].concat(Array(42).fill('')));
			}
					
			var talks4 = ['whoTalks("bellboy","May I help you, sir?",20,true)'].concat(Array(22).fill(''));
			setCinematics(
						talks1.concat(talks2).concat(talks4)
						);
			if (printcine) console.log(cinematics);
		
		} else {
			whoTalks("guy","This is not what I need from them.",30,true);
		}	
	}
}

function recepcionisttalks(col,Zbol,actOn) {
	if (col&&Zbol&&actOn&&chapter>=3) {
		listText = [];
		if (objects[objectIndex]=='mano') {
			var walks1 = Array(4).fill('walkingByID("dwy1","recepcionist")');
			var talks1 = ['followMe("recepcionist","guy",true);walking("stp0",guyIndex)',
						'whoTalks("guy","Thank you very much.",20,true)'].concat(Array(22).fill(''));
						
			if (chapter<7) {
				var talks2 = ['whoTalks("recepcionist","Of course, your room is|in the second floor.",40,true)'].concat(Array(42).fill(''))
					.concat(['whoTalks("guy","Yes, sorry, I have memory issues:|I forgot the floor of my room.",40,true)'].concat(Array(42).fill('')));
			} else if (chapter==7) {
				++chapter;
				var talks2 = ['whoTalks("recepcionist","Yes sir, we were expecting you.|Your room number is 201.",40,true)'].concat(Array(42).fill(''))
					.concat(['whoTalks("guy","Hello, I come in name of El Jefe.",40,true)'].concat(Array(42).fill('')));
					
			} else {
				
				var talks2 = ['whoTalks("recepcionist","Do not hesitate to ask if we can help you.",40,true)'].concat(Array(42).fill(''))
					.concat(['whoTalks("guy","I am fine",20,true)'].concat(Array(22).fill('')));
				
			}
			
			var talks4 = ['whoTalks("recepcionist","Can I do something for you, sir?",20,true)'].concat(Array(22).fill(''));
			var walks2 = Array(4).fill('walkingByID("upy1","recepcionist")').concat('walkingByID("stp0","recepcionist")');
			setCinematics(
						walks1.concat(talks1).concat(talks2).concat(talks4).concat(walks2)
						);
			if (printcine) console.log(cinematics);
		} else {
			whoTalks("guy","This is not what I need from them.",30,true);
		}
	}
}


// GUY'S ROOM TO LOBBY CHAPTER 5-----------------------------------------------------------------------------------------------------

function roo1stfloorphone(col,Zbol,actOn) {
	
	if (col&&Zbol&&actOn) {
		if (objects[objectIndex]=='mano') {
			if (chapter==5&&!memory["other_hotel_room_1"]["phone"]) {
				
				actions = actions.filter(it=>it['function']!='openclosedoor');
				listText = [];
				var talks1 = ['setFileByID("phoneuse","phone");followMe("guy","phone",false);walking("stp0",guyIndex);setFile02("mt",guyIndex)',
							'whoTalks("phone","**Wait!!...**",30,false)'].concat(Array(32).fill(''));
				var talks2 = ['whoTalks("guy","El Jefe has a message to you: This|is the last time you fucked up.",120,true)'].concat(Array(122).fill(''));
				var talks3 = ['whoTalks("phone","**Who'+"'"+'s calling**",80,true)'].concat(Array(86).fill(''));
				var talks4 = ['whoTalks("phone","toooooot",30,true)'].concat(Array(32).fill(''));
				var talks5 = ['whoTalks("phone","CLICK CLICK CLICK",70,false)'].concat(Array(72).fill(''));
				var end    = ['setFileByID("phone","phone");setFile02("m0",guyIndex);memory["other_hotel_room_1"]["phone"]=true'];
				setCinematics(
							talks1.concat(talks2).concat(talks3).concat(talks4).concat(talks5).concat(end)
							);
				if (printcine) console.log(cinematics);
			
			} else {
				whoTalks("guy","It's not the moment for a call.",30,true);
			}
		} else {
			whoTalks("guy","This is not the way to use a phone.",30,true);
		}
	}
}

function gotolobby(col,Zbol,actOn) {
	
	if (chapter==5&&memory["other_hotel_room_1"]["phone"]&&memory["other_hotel_room_1"]["lamp"]=='on'&&col&&Zbol&&!memory["other_hotel_room_1"]["istalking"]) {
		++chapter;
		memory["other_hotel_room_1"]["istalking"] = true;
		var walks1 = ['hideshowItem("bellboy",false);fullControl=true;openclosedoor(true,true,true,"hotel_corridor_1","door","open")',
					  'followMe("guy","bellboy",false);walkingByID("dwy1","bellboy")','followMe("guy","bellboy",true);walkingByID("dwy1","bellboy")'
					  ].concat(Array(10).fill('walkingByID("dwy1","bellboy")')).concat(['walkingByID("upy0","bellboy");walkingByID("stp0","bellboy")'])
					  .concat(['whoTalks("bellboy","Enjoy your stay, sir.",40,true)']).concat(Array(42).fill(''))
					  .concat(Array(12).fill('walkingByID("dwx1","bellboy")'))
					  .concat(['walkingByID("upx0","bellboy");walkingByID("stp0","bellboy");turnItOnOff(true,true,true,"lamp","bellboy",true)'])
					  .concat(walkThere(guyIndex,B(2,2),B(5,0),1,'x')).concat(Array(11).fill('walking("upy1",guyIndex)'))
					  .concat(['walking("stp0",guyIndex)'])
					  .concat(Array(8).fill('walkingByID("upy1","bellboy")'))
					  .concat(['openclosedoor(true,true,true,"other_hotel_room_1","door","closed")',
					  'whoTalks("other_hotel_room_1","CLICK",20,false)'])
					  .concat(Array(8*2).fill('walking("upx1",guyIndex)'))
					  .concat(Array(8*2).fill('walkingByID("upx1","bellboy");walking("upx1",guyIndex)'))
					  .concat(Array(8*2).fill('walkingByID("upx1","bellboy");walking("dwy1",guyIndex)'))				  
					  .concat(Array(8*3).fill('walkingByID("dwy1","bellboy");walking("dwy1",guyIndex)'))
					  .concat(Array(3).fill('walkingByID("dwy1","bellboy");walking("upx1",guyIndex)'))				  
					  .concat(['walkingByID("dwy1","bellboy");walking("upx1",guyIndex);actionOn=true'])	
					  .concat(Array(4).fill('walkingByID("dwy1","bellboy");walking("upx1",guyIndex)'))				  					  
					  .concat(Array(8).fill('walkingByID("upx1","bellboy");walking("upx1",guyIndex)'))			  					  
					  .concat(['walkingByID("stp0","bellboy");walking("stp0",guyIndex)'])					  					  
					  .concat(Array(32).fill(''))				
					  .concat(['openclosedoor(true,true,true,"hotel_corridor_0","elevator","whatever")'])	  					  
					  .concat(Array(8).fill('walkingByID("dwx1","bellboy");walking("dwx1",guyIndex)'))				  					  
					  .concat(['loadRoom("hotel_corridor_0");fullControl=false'])					  					  
					  .concat(Array(8).fill('walkingByID("dwx1","bellboy");walking("dwx1",guyIndex)'))	
					  .concat(Array(8).fill('walkingByID("dwy1","bellboy");walking("dwx1",guyIndex)'))	
					  .concat(['walkingByID("stp0","bellboy");walking("upy0",guyIndex);walking("stp0",guyIndex);whoTalks("bellboy","This way, sir.",30,true)'])	
					  .concat(Array(20).fill(''))	
					  .concat(Array(8*3).fill('walkingByID("upy1","bellboy");walking("upy1",guyIndex)'))
					  .concat(Array(8).fill('walkingByID("upy1","bellboy");walking("dwx1",guyIndex)'))
					  .concat(Array(8*3-3).fill('walkingByID("dwx1","bellboy");walking("dwx1",guyIndex)'))	
					  .concat(['walkingByID("upx0","bellboy");walkingByID("stp0","bellboy");walking("dwx1",guyIndex)'])
					  .concat(Array(6).fill('walking("dwx1",guyIndex)'))
					  .concat(['walking("stp0",guyIndex);whoTalks("bellboy","Please, follow me. I will take you to your room.",50,true)']).concat(Array(52).fill(''))
					  .concat(['actionOn=true;memory["hotel_corridor_0"]["istalking"] = false;++chapter'])		
		setCinematics(
					  walks1
					  );
		if (printcine) console.log(cinematics);	
	}
	
}

// LIMO     -----------------------------------------------------------------------------------------------------

function watching(col,Zbol,actO,who) {
	if (!memory["hotel_street_0"]["istalking"]) {
		var iwho = stuff['front'].filter(it=>it['ID']==who)[0];
		if (iwho['file'].slice(-1)=='N' && Math.random()<0.02) iwho['file'] = iwho['file'].slice(0,-1)+'H';
		if (iwho['file'].slice(-1)=='H' && Math.random()<0.1) iwho['file'] = iwho['file'].slice(0,-1)+'N';
	}
}

function takelimo(col,Zbol,actO) {
	if (col&&Zbol&&actO&&objects[objectIndex]=='mano') {	
		if (objects[objectIndex]=='mano') {
			++chapter;
			memory["hotel_street_0"]["istalking"] = true;
			
			var walks1 = walkThere(guyIndex,77,35,1,'x')
						.concat(['setFileByID("limobackdoor","limo")']).concat(Array(8).fill(''))
						.concat(['hideshowItem("guy",false)']).concat(Array(8).fill(''))
						.concat(['setFileByID("limofrontdoor","limo");hideshowItem("limodoor",false)']).concat(Array(8).fill(''))
						.concat(['whoTalks("bodyguard","It'+"'"+'s clean, go ahead.",30,true)']).concat(Array(32).fill(''))					 
						.concat(['setFileByID("00_00H","bodyguard")']).concat(Array(8).fill(''))
						.concat(['setFileByID("00_00N","bodyguard")']).concat(Array(8).fill(''))
						.concat(['hideshowItem("bodyguard",false);setFileByID("limo_00L","limo");hideshowItem("limodoor",false)'])
						.concat(Array(24).fill('')).concat(['whoTalks("limo","BROOOOOOOOOOOOOOOOOOOM",50,false)'])				
						.concat(Array(16).fill(['walkingByID("upx0","limo")']))
						.concat(Array.from({length: 30}, (_, i) => 'walkingByID("upx'+Math.min(8,i+1)+'","limo")'))
						.concat(['chapterTitles(3,"Luck");playMusic("theend",false)']).concat(Array(120).fill(''))
						.concat([
'listText.push({"text":"        Thanks for playing!|      This is is a prototype|if you want to see the complete game|   support us at backwardgames.com", "I0":LI/2,"J0":110,"type":"text_normal","centered":true,"bubble":true,"pointer":false});pause=true'
]);
			setCinematics(
						walks1
						);
			if (printcine) console.log(cinematics);
		} else {
			whoTalks("guy","This is not the way to use a car.",30,true);			
		}
	}
	
}

// COVER ANIMATION     -----------------------------------------------------------------------------------------------------

function intro(col,Zbol,actO) {
	if (!memory['hotel_street_9']['isTalking']) {
		subt = 0;
		memory['hotel_street_9']['isTalking'] = true;
		var walks1 = Array(2*2).fill('').concat([
//				'listText.push({"text":"*","I0":155,"J0":50,"type":"text_normal","centered":true,"bubble":true,"pointer":false,"time":200})',
				'setFileByID("windowbroken2","windowguy");'+'hideshowItem("windowglass0",false);hideshowItem("windowglass1",false);hideshowItem("windowglass2",false);'+
				'memory["hotel_street_9"]["moveglass"]=true;'])
	
		cinematics = walks1.concat(cinematics);
		if (printcine) console.log(cinematics);
	}
	if (memory["hotel_street_9"]["moveglass"] && subt<70) {
		++subt;
		
		var glk012 = [getIndexFromID('windowglass0'),getIndexFromID('windowglass1'),getIndexFromID('windowglass2')];
		
		for (var kk=0;kk<3;++kk) {
			glk = glk012[kk];
			if (subt>=4*kk) {
				for (var k=0;k<glk.length;++k) {
					var rowt = stuff['front'][glk[k]];
					var IP = tiles[rowt['type']][rowt['folder']][rowt['file']]['I'];
					
					var dx = Math.round(rowt.X/8/6*Math.random());
					var stpx = "dwx"+dx
					moveItem(stpx,glk[k]);
					var sy = -15-IP;
					var dy = Math.round(Math.abs(sy)/15*rowt.X/8/6*Math.random()*Math.random());
					var stpy = (sy<0? 'dwy'+dy : 'upy'+dy);
					moveItem(stpy,glk[k]);
					var stpz = 'dwz'+Math.floor((dx+4-kk)*Math.random());
					moveItem(stpz,glk[k]);
					memory["hotel_street_9"]["posglass"][kk][k].push([stpx,stpy,stpz]);
				}
			}
		}
				
		if (subt==5) hideshowItem("guyfall",false);
		if (subt>5) {
			var guyfall = getIndexFromID('guyfall')[0];
			stpx = [7,9,11,13,16,20,25,31].includes(subt) ? "dwx1" : "dwx0" ;
			moveItem(stpx,guyfall);
			stpz = subt%2==0&&subt>7 ? "dwz1" : "dwz0" ; 
			moveItem(stpz,guyfall);
			memory["hotel_street_9"]["posguy"].push([stpx,stpz])
		}
	}
}
















	
