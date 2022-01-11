
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
	console.log(file)
	setFile(file,getIndexFromID(id)[0]);
}
function setFile(file,ind) {
	stuff['front'][ind]['file'] = file;
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

function follows(col,Zbol,actOn,who,whom) {
	followMe(who,whom,false)
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
	
		var lamp = stuff['front'].filter(it => it['ID']==what)[0];
		var fl = what;
		if (what=='lamp') {
			var st = lamp['state']=='off'?'on':'off';
			fl += st;
		} else if(what=='tv') {
			var st = lamp['state']=='itsOff'?'itsOn':'itsOff';
		}
		
		memory[room][what] = st;
		
		var dir = '00N';		
		
		var fil1 = '"mh_"+stuff["front"][getIndexFromID("'+who+'")]["file"].substring(3,5)+"N"';
		var fil2 = '"'+stuff["front"][getIndexFromID(who)]["file"].substring(0,3)+'"+stuff["front"][getIndexFromID("'+who+'")]["file"].substring(3,6)';
	
		var enter1  = ['followMe("guy","'+what+'",false)',
					   'setFileByID('+fil1+',"'+who+'")','whoTalks("'+what+'","CLICK",6,false)','setStateByID("'+st+'","'+what+'")','setFileByID("'+fl+'","'+what+'")']
						.concat(Array(5).fill(''));
		var enter2  = ['setFileByID('+fil2+',"'+who+'")'];

		setCinematics(enter1.concat(enter2));
		console.log(cinematics)
	
	}	
	
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
		var walkit4  = ['actionOn=true;walking("dwy1",guyIndex)'].concat(Array(11).fill('walking("dwy1",guyIndex)')).concat(['walking("stp0",guyIndex)'])
	.concat(['openclosedoor(true,true,true,"hotel_room_5","door","closed");whoTalks("guy","CLICK",5,false);objects.push("roomkey");objectIndex=3']);
	    var title = ['chapterTitles(4,"Death")'].concat(Array(20).fill(''));
		setCinematics(
					  walkit1.concat(talkit1).concat(talkit2).concat(talkit3).concat(enter1)
					  .concat(enter2).concat(walkit2).concat(walkit3).concat(walkit4).concat(title)
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
					.concat(['openclosedoor(true,true,true,"toilet_5","door","closed");hideshowItem("dude",false);memory[room]["dude"]=[0,0,false]']);
		setCinematics(
					  walk1.concat(talk1).concat(talk2).concat(talk3).concat(talk4).concat(talk5)
					  );
		console.log(cinematics);
		
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
		console.log(cinematics);
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
		console.log(cinematics);
	}
	
}

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
			var talks1 = ['followMe("ggirl","guy",true);walking("stp0",guyIndex)',
						'whoTalks("guy","I know, I'+"'"+'ll take care of it.|Thanks for the help.",60,true)'].concat(Array(62).fill(''));
			var talks2 = ['whoTalks("ggirl","Told ya, but you'+"'"+'re not gonna|have it that easy now.",120,true)'].concat(Array(122).fill(''));
			var talks3 = ['whoTalks("guy","...I put him in front of the|   light, and indeed he missed. ",120,true)'].concat(Array(122).fill(''));
			var talks4 = ['whoTalks("guy","I know, there was no other way.|I did what you told me...",120,true)'].concat(Array(122).fill(''));
			var talks5 = ['whoTalks("ggirl","He knows you are here,|every one heard the shoots.",120,true)'].concat(Array(122).fill(''));
			setCinematics(
						talks1.concat(talks2).concat(talks3).concat(talks4).concat(talks5)
						);
			console.log(cinematics);
		}	
		
	} else if (chapter==3) {
		
		if (listText.length==0&&Math.random()<0.01) {
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
			var talks1 = ['followMe("ggirl","guy",true);walking("stp0",guyIndex)',
						'whoTalks("guy","I know, I'+"'"+'ll take care of it.|Thanks for the help.",60,true)'].concat(Array(62).fill(''));
			var talks3 = ['whoTalks("ggirl","...Use the jey to enter in the room, but|   once inside, you are in your own.",120,true)'].concat(Array(122).fill(''));
			var talks3 = ['whoTalks("ggirl","...If he is looking to the light without his|  sunglasses, he will miss the shoot...",120,true)'].concat(Array(122).fill(''));
			var talks3 = ['whoTalks("ggirl","...If you want to kill that psyco make sure you|   enter in the corridor while he is in the toilet...",120,true)'].concat(Array(122).fill(''));
			var talks3 = ['whoTalks("ggirl","It'+"'"+'s not gonna be that easy. They will kill you for the case...",120,true)'].concat(Array(122).fill(''));
			var talks5 = ['whoTalks("guy","It'+"'"+'s a deal.",120,true)'].concat(Array(122).fill(''));
			var talks5 = ['whoTalks("ggirl","She'+"'"+'s downstairs in one of the rooms.|I can give you the key but you give me the file NOW.",120,true)'].concat(Array(122).fill(''));
			var talks2 = ['whoTalks("guy","...Tell me where to find her and I take care of the gang.",120,true)'].concat(Array(122).fill(''));
			var talks5 = ['whoTalks("ggirl","I have a debt with the gang, just like you! I can'+"'"+'t just leave!",20,true)'].concat(Array(22).fill(''));
			var talks2 = ['whoTalks("guy","...It'+"'"+'s your file from the police station.|   Your daughter'+"'"+'s foster home address is there...",120,true)'].concat(Array(122).fill(''));
			var talks3 = ['whoTalks("guy","I have something for you. Help me and it'+"'"+'s yours...",120,true)'].concat(Array(122).fill(''));
			var talks5 = ['whoTalks("ggirl","Fuck me! It'+"'"+'s you! You|idiot, you came for her...",20,true)'].concat(Array(22).fill(''));
			var talks5 = ['whoTalks("ggirl","WHO THE HELL ARE YOU?",20,true)'].concat(Array(22).fill(''));
			var talks5 = ['whoTalks("ggirl","DON'+"'"+'T MOVE!!",20,true)'].concat(Array(22).fill(''));
			setCinematics(
						talks1.concat(talks2).concat(talks3).concat(talks4).concat(talks5)
						);
			console.log(cinematics);
		}	
	}
}

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

	if (col&&Zbol&&actOn) {
		listText = [];
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
		console.log(cinematics);
		
	}
}

function bellboytalks(col,Zbol,actOn) {
	if (memory['hotel_corridor_0']['bellboy']=='enter') {
		if (preRoom!='toilet_0') whoTalks("bellboy","Goodbye, sir.",30,true);
		memory['hotel_corridor_0']['bellboy']='entered';
	}
	
	if (col&&Zbol&&actOn&&chapter>=3) {
		listText = [];
		var talks1 = ['followMe("bellboy","guy",true);walking("stp0",guyIndex)',
					  'whoTalks("guy","Thank you very much.",20,true)'].concat(Array(22).fill(''));
		var talks2 = ['whoTalks("bellboy","I see. Your room is in the second|floor, the door at the left.",40,true)'].concat(Array(42).fill(''));
		var talks3 = ['whoTalks("guy","Yes, sorry, I have memory issues:|I forgot the number of my room.",40,true)'].concat(Array(42).fill(''));
		var talks4 = ['whoTalks("bellboy","May I help you, sir?",20,true)'].concat(Array(22).fill(''));
		setCinematics(
					  talks1.concat(talks2).concat(talks3).concat(talks4)
					  );
		console.log(cinematics);
		
	}
}

function recepcionisttalks(col,Zbol,actOn) {
	if (col&&Zbol&&actOn&&chapter>=3) {
		listText = [];
		var walks1 = Array(4).fill('walkingByID("dwy1","recepcionist")');
		var talks1 = ['followMe("recepcionist","guy",true);walking("stp0",guyIndex)',
					  'whoTalks("guy","Thank you very much.",20,true)'].concat(Array(22).fill(''));
		var talks2 = ['whoTalks("recepcionist","Of course, your room is|in the second floor.",40,true)'].concat(Array(42).fill(''));
		var talks3 = ['whoTalks("guy","Yes, sorry, I have memory issues:|I forgot the floor of my room.",40,true)'].concat(Array(42).fill(''));
		var talks4 = ['whoTalks("recepcionist","May I help you, sir?",20,true)'].concat(Array(22).fill(''));
		var walks2 = Array(4).fill('walkingByID("upy1","recepcionist")').concat('walkingByID("stp0","recepcionist")');
		setCinematics(
					  walks1.concat(talks1).concat(talks2).concat(talks3).concat(talks4).concat(walks2)
					  );
		console.log(cinematics);
		
	}
}




















	
