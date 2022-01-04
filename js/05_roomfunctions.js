
 
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

function putWallLine(door,xy,lxy0,lxy,lyx,z,ids,b,vis,sol,rank,shiftx,shifty,side) {
	
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
	array.push([ids,'walls',b,fil,s,posx,posy,z,vis,!(sol&&door.includes(lxy-1)),false,false,0,rank,side=='exterior'?'VI':'BG']);
	
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

const equals = (a, b) =>
  a.length === b.length &&
  a.every((v, i) => v === b[i]);
  
function createRoadSquaresFloorFromRGB(ground,z,lx,ly) {
	

		//console.log(ground['png'].length/4,ground['png'][-345])
		var floors = [];
		var kk=0;
		for (var k=0; k<ground['png'].length; k=k+4) {
			if (ground['png'][k+3]!=0) {
				
				++kk;
			//console.log(k/4,kk,ground['png'].slice(k,k+4),equals(ground['png'].slice(k,k+4),[0,0,0,255]),[0,0,0,255])
			
				var road      = equals(ground['png'].slice(k,k+4) , [0,0,0,255]),
					squares   = equals(ground['png'].slice(k,k+4) , [0,0,255,255]),
					squaresBG = equals(ground['png'].slice(k,k+4) , [255,0,0,255]);
					
				var folder = road ? 'road' : 'squares' ;
					
				var dy = ground['DJ'],
					dx = ground['DI'];
				var x = (k/4)%dx,
					y = Math.floor((k/4)/dx);
				
				if (road) {
					
					floors.push(['road','floors','road','00',1,B(lx+x,0),B(ly+dy-y,0),z,true,false,false,true,0,0,'BG']);
				
				} else {
					
						
					var n  = y-1>=0           ? 4*((y-1)*dx+x  ) : undefined , s  = y+1<dy           ? 4*((y+1)*dx+x  ) : undefined , 
					    e  =           x+1<dx ? 4*( y   *dx+x+1) : undefined , w  =           x-1>=0 ? 4*( y   *dx+x-1) : undefined ,
						ne = y-1>=0 && x+1<dx ? 4*((y-1)*dx+x+1) : undefined , se = y+1<dy && x+1<dx ? 4*((y+1)*dx+x+1) : undefined , 
						nw = y-1>=0 && x-1>=0 ? 4*((y-1)*dx+x-1) : undefined , sw = y+1<dy && x-1>=0 ? 4*((y+1)*dx+x-1) : undefined ;
					
					var qnorth     = equals( ground['png'].slice(n ,n +4) , [0,0,0,255] ),
						qsouth     = equals( ground['png'].slice(s ,s +4) , [0,0,0,255] ),
						qeast      = equals( ground['png'].slice(e ,e +4) , [0,0,0,255] ),
						qwest      = equals( ground['png'].slice(w ,w +4) , [0,0,0,255] ),
					    qnortheast = equals( ground['png'].slice(ne,ne+4) , [0,0,0,255] ),
						qsoutheast = equals( ground['png'].slice(se,se+4) , [0,0,0,255] ),
						qnorthwest = equals( ground['png'].slice(nw,nw+4) , [0,0,0,255] ),
						qsouthwest = equals( ground['png'].slice(sw,sw+4) , [0,0,0,255] );
					
					var file = '0000', spin = 1;
					       if ( !qnorth && !qsouth && !qeast && !qwest && !qnortheast &&  qsoutheast && !qnorthwest && !qsouthwest ) {
						file = '0001'; spin = 1;
					} else if ( !qnorth && !qsouth && !qeast && !qwest && !qnortheast && !qsoutheast && !qnorthwest &&  qsouthwest ) {
						file = '0010'; spin = 1;
					} else if ( !qnorth &&  qsouth && !qeast && !qwest && !qnortheast &&        true && !qnorthwest &&        true ) {
						file = '0011'; spin = 1;
					} else if ( !qnorth && !qsouth && !qeast && !qwest &&  qnortheast && !qsoutheast && !qnorthwest && !qsouthwest ) {
						file = '0100'; spin = 1;
					} else if ( !qnorth && !qsouth &&  qeast && !qwest &&        true &&        true && !qnorthwest && !qsouthwest ) {
						file = '0101'; spin = 1;
					} else if ( !qnorth &&  qsouth &&  qeast && !qwest &&        true &&  qsoutheast && !qnorthwest &&        true ) {
						file = '0111'; spin = 1;
					} else if ( !qnorth &&  qsouth && !qeast &&  qwest && !qnortheast &&        true &&        true &&  qsouthwest ) {
						file = '1011'; spin = 1;
					} else if (  qnorth && !qsouth &&  qeast && !qwest &&  qnortheast &&        true &&        true && !qsouthwest ) {
						file = '1101'; spin = 1;
					} else if ( !qnorth && !qsouth && !qeast && !qwest && !qnortheast && !qsoutheast &&  qnorthwest && !qsouthwest ) {
						file = '0001'; spin = -1;
					} else if ( !qnorth && !qsouth && !qeast &&  qwest && !qnortheast && !qsoutheast &&        true &&        true ) {
						file = '0011'; spin = -1;
					} else if (  qnorth && !qsouth && !qeast && !qwest &&        true && !qsoutheast &&        true && !qsouthwest ) {
						file = '0101'; spin = -1;
					} else if (  qnorth && !qsouth && !qeast &&  qwest &&        true && !qsoutheast &&  qnorthwest &&        true ) {
						file = '0111'; spin = -1;
					}
					/*
					console.log(k,4*(y*dx+x),x,y,dx,dy,qnorth,qsouth,qeast,qwest,qnortheast,qsoutheast,qnorthwest,qsouthwest)
					console.log(
						 ground['png'].slice(n ,n +4),
						 ground['png'].slice(s ,s +4),
						 ground['png'].slice(e ,e +4),
					     ground['png'].slice(w ,w +4),
						 ground['png'].slice(ne,ne+4),
						 ground['png'].slice(se,se+4),
						 ground['png'].slice(nw,nw+4),
					     ground['png'].slice(sw,sw+4))
					console.log(file)
					*/
					floors.push(['road','floors','squares',file,spin,B(lx+x,0),B(ly+dy-y,0),z,true,false,false,true,0,0,squaresBG ? 'BG' : 'VI']);					
				}
			}
		}
		//console.log(floors)
		
		return floors;
}
