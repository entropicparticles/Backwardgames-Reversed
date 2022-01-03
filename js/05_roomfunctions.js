
 
 // FUNCTIONS TO PUT SHIT TOGETHER ----------------------------------------------------------------

function makeSpace() {
	 
	space = {'open':[],'solid':[]};
	var labels = ['background','front']
	for (var q=0; q<2; ++q) {
		label = labels[q];
		for (var k=0; k<stuff[label].length; ++k) {
			s = stuff[label][k];
			if (s['walkable']) space['open'].push(s);
			if (s['solid'])    space['solid'].push(s);
		}
	}
	//console.log(space['open'])
}

function makeStuff(allstuff) {
	
	// Update stuff list & walkables & solid spaces
	var label;
	for (var k=0; k<allstuff.length; ++k) {
		txt = allstuff[k];
		label = (txt[14]=='BG') ? 'background' : 'front' ;
		stuff[label].push({'ID':txt[0],'type':txt[1],'folder':txt[2],'file':txt[3],'spin':txt[4],'X':txt[5],'Y':txt[6],'Z':txt[7],
							'visible':txt[8],'solid':txt[9],'mobile':txt[10],'walkable':txt[11],'state':txt[12],'order':txt[13]});
	}
}

function completeStuff(LX,LY,I0,J0) {
	
	// Add the other parameters from tiles
	var labels = ['background','front']
	
	// Where we set the (0,0) in canvas. If 00, we center the image
	var jc = J0 == 0 ? (height - ((LX+LY)*8+12*5))/2 : J0 ;
	var ic = I0 == 0 ?  LY*16 + (width-(LX+LY)*16)/2 : I0 ;

	for (var q=0; q<2; ++q) {
		label = labels[q];
		for (var k=0; k<stuff[label].length; ++k) {
			
			s = stuff[label][k];
			//console.log(s);
			
			// if the tile exists, complete info; if not, not needed.
			if (s['ID']!='fake') {
				
				im = tiles[s['type']][s['folder']][s['file']];
			
				var d1 = s['spin'] == 1 ? im['DX'] : im['DY'];
				var d2 = s['spin'] == 1 ? im['DY'] : im['DX'];		
				stuff[label][k]['XM'] = s['X']+d1;
				stuff[label][k]['YM'] = s['Y']+d2;
				stuff[label][k]['ZM'] = s['Z']+im['DZ'];
				
				var ir = s['spin'] == 1 ? im['I'] : im['DI']-im['I'] ;
				stuff[label][k]['IC'] = XY2I(s['X'],s['Y']);
				stuff[label][k]['JC'] = XYZ2J(s['X'],s['Y'],0);
				stuff[label][k]['I0'] = XY2I(s['X'],s['Y']) - ir + ic;
				stuff[label][k]['J0'] = XYZ2J(s['X'],s['Y'],s['Z']) - im['J'] + jc;
				stuff[label][k]['IM'] = stuff[label][k]['I0'] + im['DI'];
				stuff[label][k]['JM'] = stuff[label][k]['J0'] + im['DJ'];
			}
			
		}
		//stuff[label].sort((a, b) => (a.order > b.order) ? 1 : -1);
	}
	// get where is the guy
	guyIndex = stuff['front'].flatMap((it, i) => it['ID'] == 'guy' ? i : [])[0];
}

function completeStuffItem(k,LX,LY,I0,J0) {
		
	var label = 'front';
	// Where we set the (0,0) in canvas. If 00, we center the image
	var jc = J0 == 0 ? (height - ((LX+LY)*8+12*5))/2 : J0 ;
	var ic = I0 == 0 ?  LY*16 + (width-(LX+LY)*16)/2 : I0 ;

	s = stuff[label][k];
	//console.log(s);
	im = tiles[s['type']][s['folder']][s['file']];
		
	var d1 = stuff[label][k]['spin'] == 1 ? im['DX'] : im['DY'];
	var d2 = s['spin'] == 1 ? im['DY'] : im['DX'];		
	stuff[label][k]['XM'] = s['X']+d1;
	stuff[label][k]['YM'] = s['Y']+d2;
	stuff[label][k]['ZM'] = s['Z']+im['DZ'];
	
	var ir = s['spin'] == 1 ? im['I'] : im['DI']-im['I'] ;
	stuff[label][k]['IC'] = XY2I(s['X'],s['Y']);
	stuff[label][k]['JC'] = XYZ2J(s['X'],s['Y'],0);
	stuff[label][k]['I0'] = XY2I(s['X'],s['Y']) - ir + ic;
	stuff[label][k]['J0'] = XYZ2J(s['X'],s['Y'],s['Z']) - im['J'] + jc;
	stuff[label][k]['IM'] = stuff[label][k]['I0'] + im['DI'];
	stuff[label][k]['JM'] = stuff[label][k]['J0'] + im['DJ'];
	
}

function makeText(alltext) {	
	// Update text list
	for (var k=0; k<alltext.length; ++k) {
		txt = alltext[k];
		listText.push({'text':txt[0],'I0':txt[1],'J0':txt[2],'type':txt[3],'centered':txt[4],'bubble':txt[5],'pointer':txt[6],'time':txt[7]});
	}
}

function makeActions(allactions){
	
	// Update action list
	for (var k=0; k<allactions.length; ++k) {
		txt = allactions[k];
		if (txt.length==3) {
			actions.push({'ID':txt[0],'function':txt[1],'arguments':txt[2]});
		} else {
			actions.push({'ID':txt[0],'function':txt[1],'arguments':txt[2],'X':txt[3],'Y':txt[4],'Z':txt[5],'XM':txt[6],'YM':txt[7]});
		}
		
	}
}

 // PROCEDURES FOR WALLS, FLOORS AND DOORS --------------------------------------------------------
 
function putSquareFloor(lx0,lx,ly0,ly,z,ids,b,c,vi,rank,bg) {
	
	var array = [];	
	for (var x=lx0; x<lx; ++x) {
		for (var y=ly0; y<ly; ++y) {
			array.push(
				[ids,'floors',b,c,1,B(x,0),B(y,0),z,true,false,false,vi,0,rank,bg]
			);
		}
	}	
	return array;
}

function putWallAround(door,fol,fil,vis,LX,LY,z,rank) {
	
		var	walls =          putWallLine(door[0],'x',z,LX,LY,0,fol,fil,  vis,true,rank,0,0);
		walls = walls.concat(putWallLine(door[3],'x',z,LX, 0,0,fol,fil,false,true,rank,0,0));
		walls = walls.concat(putWallLine(door[1],'y',z,LY,LX,0,fol,fil,  vis,true,rank,0,0));
		walls = walls.concat(putWallLine(door[2],'y',z,LY, 0,0,fol,fil,false,true,rank,0,0));
		return walls;	
		
}

function putWallLine(door,xy,lxy0,lxy,lyx,z,ids,b,vis,sol,rank,shiftx,shifty) {
	
	var s = xy=='x' ? 1 : -1 ;
	var array = [];
	
	var fil = door.includes(0) ? '00_top' : '10' ;
	var BG  = door.includes(1) ? 'FF' : 'BG' ;
	var posx = xy == 'x' ? B(lxy0,shiftx) : B(lyx,shiftx) ;
	var posy = xy == 'y' ? B(lxy0,shifty) : B(lyx,shifty) ;
	array.push([ids,'walls',b,fil,s,posx,posy,z,vis,!(sol&&door.includes(0)),true,false,0,rank,BG]);	
	
	for (var x=lxy0+1; x<lxy-1; ++x) {
		fil = door.includes(x) ? '00_top' : '00' ;
	    BG  = door.includes(x+1) ? 'FF' : 'BG' ;
	    posx = xy == 'x' ? B(x,shiftx) : B(lyx,shiftx) ;
		posy = xy == 'y' ? B(x,shifty) : B(lyx,shifty) ;
		array.push(
			[ids,'walls',b,fil,s,posx,posy,z,vis,!(sol&&door.includes(x)),true,false,0,rank,BG]
		);			
	}
	
	fil = door.includes(lxy-1) ? '00_top' : '01' ;
	posx = xy == 'x' ? B(lxy-1,shiftx) : B(lyx,shiftx) ;
	posy = xy == 'y' ? B(lxy-1,shifty) : B(lyx,shifty) ;
	array.push([ids,'walls',b,fil,s,posx,posy,z,vis,!(sol&&door.includes(lxy-1)),false,false,0,rank,'BG']);
	
	return array;
}

function putDoor(x,y,z,s,w,id,b,type,side,st,rank) {
	
	var st0 = st.split('_')[0]
	var ss = Math.round((1-s)/2);   // for right/left -> true/false -> it works as logic gates
	var d = side=='front' ? 0 : 1 ; // for top/bottom -> true/false
	var Ddoor = type=='door' ? [8*ss,8*(1-ss)] : [0,0] ;
	
	// tell where the guy appears
	var entryx = x ,//- 8*(1-2*d)*ss     - 4*(1-d)*ss     + 0*(1-ss) , 
	    entryy = y ,//- 8*(1-2*d)*(1-ss) - 4*(1-d)*(1-ss) + 0*ss,
		entryz = z;
	
	// objects
	var array = [
			[id,'doors' ,b+"_"+type+"_"+side,'closed',s,x-(1-2*d)*ss           ,y-(1-2*d)*(1-ss)             ,z,st0!='open',st0!='open',false,false,'closed',rank    ,'VI',entryx,entryy,entryz,w],
			[id,'doors' ,b+"_"+type+"_"+side,'frame' ,s,x-(1-2*d)*ss+w*8*(1-ss),y-(1-2*d)*(1-ss)+w*8*ss      ,z,st0=='open',st0=='open',false,false,'open'  ,rank-0.1,'VI'],
			[id,'doors' ,b+"_"+type+"_"+side,'open'  ,s,x-(1-2*d)*ss-Ddoor[0]  ,y-(1-2*d)*(1-ss)-Ddoor[1]    ,z,st0=='open',st0=='open',false,false,'open'  ,rank    ,'VI']
			];
			
	// put some extra floor deep under the door, visible only at ground level
	for (var k=0;k<w;++k) {
		array = array.concat([[id,'floors','dark','00',1,x-8*d*ss+8*k*(1-ss),y-8*d*(1-ss)+8*k*ss,z,z<12*4,false,false,true,0,0,'BG']]);
	}
	
	// sliders from sides
	var stp1A=['upx','upy'];
	var stp1B=[['dwy','dwx'],['upy','upx']];
	var stp2A=['dwx','dwy'];
	var acts = [{'ID':id+'_bor1A','function':'sliders','arguments':[stp1A[ss],stp1B[d][ss]],
				 'X':x-ss*(1-2*d)-(1-ss)        ,'Y':y-(1-ss)*(1-2*d)-ss        ,'Z':z,'DX':1,'DY':1,'DZ':0},
				{'ID':id+'_bor2A','function':'sliders','arguments':[stp2A[ss],stp1B[d][ss]],
				 'X':x-ss*(1-2*d)+(1-ss)*(w*8+1),'Y':y-(1-ss)*(1-2*d)+ss*(w*8+1),'Z':z,'DX':1,'DY':1,'DZ':0}];
				 
	// sliders from front
	var stp1A=['upx','upy'];
	var stp1B=[['dwy','dwx'],['upy','upx']];
	var stp2A=['dwx','dwy'];
	acts = acts.concat([{'ID':id+'_bor1B','function':'sliders','arguments':[stp1B[1-d][ss],stp1A[ss]],
					         'X':x-2*ss*(1-2*d)           ,'Y':y-2*(1-ss)*(1-2*d)       ,'Z':z,'DX':1,'DY':1,'DZ':0},
						{'ID':id+'_bor2B','function':'sliders','arguments':[stp1B[1-d][ss],stp2A[ss]],
					         'X':x-2*ss*(1-2*d)+(1-ss)*w*8,'Y':y-2*(1-ss)*(1-2*d)+ss*w*8,'Z':z,'DX':1,'DY':1,'DZ':0}]);
	
	
	// this actions only for doors than can be used 
	if (st!='closed_always') {
		// 1 square up to 4px inside the door gate, 1 square for open/close around
		acts = acts.concat([{'ID':id,'function':'changeroom','arguments':[id],
							 'X':x-w*8*d*ss+3*(1-2*d)*ss,'Y':y-w*8*d*(1-ss)+3*(1-2*d)*(1-ss),'Z':z,'DX':w*8+1,'DY':w*8+1,'DZ':0}]);
		if (st!='open_always') {
			acts = acts.concat([{'ID':id,'function':'openclosedoor','arguments':[id,type,st],
					             'X':x-w*8*(1-d)*ss-(1-d)*(1-ss),'Y':y-w*8*(1-d)*(1-ss)-(1-d)*ss,'Z':z,'DX':w*8+2,'DY':w*8+2,'DZ':0}]);	
		}
	}
	// complete ojects
	for (var k=0;k<acts.length;++k) {
		act = acts[k];
		act['XM'] = act['X'] + act['DX'];
		act['YM'] = act['Y'] + act['DY'];
		actions.push(act);
	}
	
	return array;
}


function createRoadSquaresFloorFromRGB(ground) {

		var floors;
		for (var k=0; k<obj['png'].length; ++k) {
			if (ground['png'][k]!=[0,0,0,0]) {
				var x = k%ground['DI'],
					y = Math.floor(k/ground['DI']);
				var road      = (ground['png'][k] == [0,0,0,255]),
					squares   = (ground['png'][k] == [255,0,0,255]),
					squaresBG = (ground['png'][k] == [255,0,0,255]);
				var folder = road ? 'road' : 'squares' ;
				
				if (road) {
				
					floors.push(['road','floors','road','00',1,B(x,0),B(ground['DJ']-y,0),z,true,false,false,true,0,0,'BG']);
				
				} else {
					
					var file = '0000',
					    spin = 1;
					var qnorth     = ground['png'][(y-1)*ground['DI']+x  ] == [0,0,0,255],
						qsouth     = ground['png'][(y+1)*ground['DI']+x  ] == [0,0,0,255],
						qeast      = ground['png'][y*ground['DI']+x+1    ] == [0,0,0,255],
						qwest      = ground['png'][y*ground['DI']+x-1    ] == [0,0,0,255],
					    qnortheast = ground['png'][(y-1)*ground['DI']+x+1] == [0,0,0,255],
						qsoutheast = ground['png'][(y+1)*ground['DI']+x+1] == [0,0,0,255],
						qnorthwest = ground['png'][(y-1)*ground['DI']+x-1] == [0,0,0,255],
						qsouthwest = ground['png'][(y+1)*ground['DI']+x-1] == [0,0,0,255];
					
					if ( !qnorth && !qsouth && !qeast && !qwest && !qnortheast && qsoutheast && !qnorthwest && !qsouthwest ) {
						file = '0001'; spin = 1;
					} else if ( !qnorth && !qsouth && !qeast && !qwest && !qnortheast && !qsoutheast && !qnorthwest && qsouthwest ) {
						file = '0010'; spin = 1;
					} else if ( !qnorth && qsouth && !qeast && !qwest && !qnortheast && !qsoutheast && !qnorthwest && !qsouthwest ) {
						file = '0011'; spin = 1;
					} else if ( !qnorth && !qsouth && !qeast && !qwest && qnortheast && !qsoutheast && !qnorthwest && !qsouthwest ) {
						file = '0100'; spin = 1;
					} else if ( !qnorth && !qsouth && qeast && !qwest && !qnortheast && !qsoutheast && !qnorthwest && !qsouthwest ) {
						file = '0011'; spin = 1;
					} else if ( !qnorth && qsouth && qeast && !qwest && !qnortheast && qsoutheast && !qnorthwest && !qsouthwest ) {
						file = '0111'; spin = 1;
					} else if ( !qnorth && qsouth && !qeast && qwest && !qnortheast && !qsoutheast && !qnorthwest && qsouthwest ) {
						file = '1011'; spin = 1;
					} else if ( qnorth && !qsouth && qeast && !qwest && qnortheast && !qsoutheast && !qnorthwest && !qsouthwest ) {
						file = '1101'; spin = 1;
					} else if ( !qnorth && !qsouth && !qeast && !qwest && !qnortheast && !qsoutheast && qnorthwest && !qsouthwest ) {
						file = '0001'; spin = -1;
					} else if ( !qnorth && !qsouth && !qeast && qwest && !qnortheast && !qsoutheast && !qnorthwest && !qsouthwest ) {
						file = '0011'; spin = -1;
					} else if ( qnorth && !qsouth && !qeast && !qwest && !qnortheast && !qsoutheast && !qnorthwest && !qsouthwest ) {
						file = '0011'; spin = -1;
					} else if ( qnorth && !qsouth && !qeast && qwest && !qnortheast && !qsoutheast && qnorthwest && !qsouthwest ) {
						file = '0111'; spin = -1;
					}
					floors.push(['road','floors','squares',file,spin,B(x,0),B(ground['DJ']-y,0),z,true,false,false,true,0,0,squaresBG ? 'BG' : 'VI']);					
				}
			}
		}
		
		return floors;
}
