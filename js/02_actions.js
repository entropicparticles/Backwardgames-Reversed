
// ACTIONS ----------------------------------------------------------------------------------------

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
		var xyz = move.xyz;
		var ij  = move.ij;
		var qm  = step.slice(-1); 
		
		// test move: we loop for all pixels done in the same movement
		var q = 0
		for (n=1;n<=qm;++n) { 
		
			var go     = false;
			var godown = -8;
			var goup   = 8;
			var testa = {'X' :im['X']  + n*move.xyz[0],'Y' :im['Y']  + n*move.xyz[1],'Z' :im['Z'] ,
						 'XM':im['XM'] + n*move.xyz[0],'YM':im['YM'] + n*move.xyz[1],'ZM':im['ZM']};
						
			// we check Z to know if he has to go down a maximum of 3 pixels only if there is no dz=0
			// to go up, just one dz=3 up is enough
			// solid don't care about Z for simplicity, let' be aware of that
			for (var k=0; k<space['open'].length; ++k) {
				var obj = space['open'][k];
				var col = collision(testa,obj);
				if (col) {
					var dz = obj.ZM-testa.Z;
					if (dz<=0) godown = Math.max(godown,dz);
					if (dz> 0) goup   = Math.min(goup,dz);
					go = col;
					//console.log(obj.ZM,testa.Z,dz,godown,goup);
					//console.log('XYZ: ',im['X'],im['Y'],im['Z']);
				}
			}
			// if in the next move there is only floor lower than 3 or hight than 3 (rare), it's too much
			if (godown < -3) go = false;
			
			// solid don't care about Z for simplicity, let' be aware of that
			if (go) {
				for (var k=0; k<space['solid'].length; ++k) {
					go = go && !collision(testa,space['solid'][k]);
					if (!go) break;
				}
			}
			
			// if go, continue; if not, stop here
			if (go) {
				++q;
			} else {
				break;
			}
			
		}
		dz = goup <=3 ? goup : (godown >=-3 ? godown : 0 );
		//console.log(goup,godown,dz,q)
		// update position
		stuff['front'][indk]['X']  += q*move.xyz[0];
		stuff['front'][indk]['Y']  += q*move.xyz[1];
		stuff['front'][indk]['Z']  += dz;
		stuff['front'][indk]['XM'] += q*move.xyz[0];
		stuff['front'][indk]['YM'] += q*move.xyz[1];
		stuff['front'][indk]['ZM'] += dz;
		stuff['front'][indk]['I0'] += q*move.ij[0];		
		stuff['front'][indk]['J0'] += q*move.ij[1]+dz;
		stuff['front'][indk]['IM'] += q*move.ij[0];		
		stuff['front'][indk]['JM'] += q*move.ij[1]+dz;
		
		console.log(stuff['front'][indk]['ID'],stuff['front'][indk]['X'],stuff['front'][indk]['Y'],stuff['front'][indk]['Z'])
	}
	
	
}

function sliders(key1,key2) {
    if (keyOn.slice(0,-1)==key1) walking(key2+keyOn.slice(-1),guyIndex)
}

function changeroom(which) {
	loadRoom(which);
}

function openclosedoor(id,type) {
	if (type=='automatic'){
		automaticdoor(id);
	} else {
		normaldoor(id);
	}
}

function automaticdoor(id) {
	
	// check collision between guy and door
	for (var k=0; k<stuff['front'].length; ++k) {
		s = stuff['front'][k];
		if (s['ID']==id && s['type']=='doors'){
			var act = actions['background'].filter(function( obj ) { return  obj.ID==id;})[0];
		    var g = stuff['front'][guyIndex];
			if (collisionExtended(act,g)) {
				stuff['front'][k]['solid']   = s['file']!='closed';
				stuff['front'][k]['visible'] = s['file']!='closed';
			} else {
				stuff['front'][k]['solid']   = s['file']=='closed';
				stuff['front'][k]['visible'] = s['file']=='closed';
			}
		}
		// not very optimal
		space = {'open':[],'solid':[]};
		makeSpace();
		actionOn = false;
	}	
	
}
	
function normaldoor(id) {
	// good
	if (actionOn) {
		for (var k=0; k<stuff['front'].length; ++k) {
			s = stuff['front'][k];
			if (s['ID']==id && s['type']=='doors'){
				stuff['front'][k]['solid']   = !s['solid'];
				stuff['front'][k]['visible'] = !s['visible'];
			}
		}
		// not very optimal
		space = {'open':[],'solid':[]};
		makeSpace();
		actionOn = false;
	}	
}

function menuCover() {
	
	// write start menu
	var cursor = (menuIndex==2) ? '>>||  ||  ' : ( (menuIndex==1) ? '  ||>>||  ' : '  ||  ||>>')
	writeText(cursor,233,62,'text_normal',false,false,false);
		
	if (actionOn) {
		if (chapter==0) { 
			if (menuIndex==2) {
				// let's go
				actionOn = false;
				loadRoom('hotel_room');
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
