
function putSquareFloor(lx0,lx,ly0,ly,z,ids,b,c,vi,rank,bg) {
	
	var array = [];
	
	for (var x=0; x<lx; ++x) {
		for (var y=0; y<ly; ++y) {
			array.push(
				[ids,'floors',b,c,1,B(x,0),B(y,0),z,true,false,false,vi,0,rank,bg]
			);
		}
	}
	
	return array;
}

function putWallLine(door,xy,lxy0,lxy,lyx,z,ids,b,vis,sol,rank) {
	
	var s = xy=='x' ? 1 : -1 ;
	var array = [];
	
	var fil = door.includes(0) ? '00_top' : '10' ;
	var BG  = door.includes(1) ? 'FF' : 'BG' ;
	var posx = xy == 'x' ? B(lxy0,0) : B(lyx,0) ;
	var posy = xy == 'y' ? B(lxy0,0) : B(lyx,0) ;
	array.push([ids,'walls',b,fil,s,posx,posy,z,vis,sol,false,false,0,rank,BG]);	
	
	for (var x=lxy0+1; x<lxy-1; ++x) {
		fil = door.includes(x) ? '00_top' : '00' ;
	    BG  = door.includes(x+1) ? 'FF' : 'BG' ;
	    posx = xy == 'x' ? B(x,0) : B(lyx,0) ;
		posy = xy == 'y' ? B(x,0) : B(lyx,0) ;
		array.push(
			[ids,'walls',b,fil,s,posx,posy,z,vis,sol,false,false,0,rank,BG]
		);			
	}
	
	fil = door.includes(lxy-1) ? '00_top' : '01' ;
	posx = xy == 'x' ? B(lxy-1,0) : B(lyx,0) ;
	posy = xy == 'y' ? B(lxy-1,0) : B(lyx,0) ;
	array.push([ids,'walls',b,fil,s,posx,posy,z,vis,sol,false,false,0,rank,'BG']);
	
	return array;
}

function putDoor(x,y,z,w,s,id,b,type,side,st,rank) {
	var dx1 = s==1 ? 8*w : 0   ;
	var dy1 = s==1 ? 0   : 8*w ;
	var dx2 = type=='door' ? dy1 : 0 ;
	var dy2 = type=='door' ? dx1 : 0 ;
	var array = [
			[id,'doors' ,b+"_"+type+"_"+side,'closed',s,x    ,y    ,z,st!='open',st!='open',false,false,'closed',rank    ,'VI'],
			[id,'doors' ,b+"_"+type+"_"+side,'frame' ,s,x+dx1,y+dy1,z,st=='open',false     ,false,false,'open'  ,rank-0.5,'VI'],
			[id,'doors' ,b+"_"+type+"_"+side,'open'  ,s,x-dx2,y-dy2,z,st=='open',st=='open',false,false,'open'  ,rank+0.5,'VI']
			];
			
	actions['front'].push({'ID':id,'function':'open_close_door('+id+','+type+')',
							'X':x-dy1-2,'Y':y-dx1-2,'Z':z,'DX':10,'DY':10,'DZ':0})
	return array;
}

function loadRoom() {
	
	var alltext=[],allstuff=[],allactionsBG=[],allactionsXY=[];
	var floors=[],walls=[],doors=[],people=[],structures=[];
	var LX,LY,I0=0,J0=0;
	RGBcover = 0;
	actions = {'background':[],'front':[]};
	stuff   = {'background':[],'front':[]};
	listText = [];
	
	if (room=='cover') {
			
		RGBcover = 'RGB_cover';
		
		LX = 4, LY = 6;
		J0 = 4;		
		
		alltext = [
			[' Created by Backward Games ',LI/2,100-4,'text_normal',true,true,false,-1],
			['Reversed',LI/2,110,'gothic',true,false,false,-1],
			['Start||Help||Quit',250,62,'text_normal',false,false,false,-1]];
			
		allactionsBG = allactionsBG.concat([['menu','menuCover()']]);
	
		allstuff = [
			['limo'        ,'structures','vehicles'      ,'limo'    ,-1,B(-1,0),B(2,4) , 0,true,false,false,false,0,3,'BG'],
			['guy'         ,'people'    ,'guy_cool'      ,'m0_01N'  , 1,B(1,6) ,B(2,6) , 0,true,false,false,false,0,1,'BG'],
			['girl'        ,'people'    ,'kidnapped_girl','B_01N'   , 1,B(0,0) ,B(3,-2),12,true,false,false,false,0,5,'BG'],
			['dealer'      ,'people'    ,'drug_dealer'   ,'00_00N'  , 1,B(3,0) ,B(1,6) , 0,true,false,false,false,0,0,'BG'],
			['ganstergirl' ,'people'    ,'gangster_girl' ,'0g_00R'  , 1,B(3,-2),B(0,2) , 0,true,false,false,false,0,2,'BG'],
			['gangsterdude','people'    ,'gangster_dude' ,'00_10N'  , 1,B(1,0) ,B(0,0) , 0,true,false,false,false,0,4,'BG']
			];
			
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,-1,'BG');
		allstuff = allstuff.concat(floors);
		
	} else if (room=='hotel_room') {
	
		LX = 5, LY = 5;
		
		allstuff = [
			['box'  ,'objects'   ,'tables'     ,'111'    ,-1,B(0,0),B(1,0),     0,true, true,false,false,   0, 10,'VI'],
			['table','objects'   ,'tables'     ,'05051'  ,-1,B(4,4),B(1,4),     0,true, true,false,false,   0,  5,'VI'],
			['table','objects'   ,'tables'     ,'05051'  ,-1,B(4,4),B(4,2),     0,true, true,false,false,   0,  2,'BG'],
			['phone','objects'   ,'phones'     ,'phone'  , 1,B(4,5),B(4,2),D(1,0),true,false,false,false,   0,  3,'BG'],
			['bed'  ,'objects'   ,'beds'       ,'bed'    , 1,B(3,1),B(2,2),     0,true, true,false,false,   0,  4,'VI'],
			['lamp' ,'objects'   ,'lamps'      ,'lamp'   , 1,B(0,2),B(4,2),     0,true, true,false,false,'on',  9,'VI'],
			['lock' ,'objects'   ,'lockers'    ,'00'     ,-1,B(4,6),B(0,4),D(0,6),true,false,false,false,   0,  4,'BG'],
			['case' ,'objects'   ,'case'       ,'maletin', 1,B(2,1),B(2,4),D(0,6),true,false,false,false,   0,8.5,'VI'],
			['case' ,'structures','hotelwindow','window' , 1,B(1,0),B(0,-1),    0,true,false,false,false,   0, 11,'VI'],
			['case' ,'structures','hotelwindow','brillo' , 1,B(1,0),B(0,-1),    0,true,false,false,false,   0, 11,'BG'],
			['dude' ,'people'    ,'drug_dealer','g0_01N' , 1,B(1,1),B(3,5) ,    0,true, true,false,false,   0,  8,'VI'],
			['girl' ,'people' ,'kidnapped_girl','0_01N'  ,-1,B(4,2),B(0,4) ,    0,true, true,false,false,   0,  7,'VI']
			];
		
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','hotelfloor','00',true,-1,'BG');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		walls = putWallLine([2],'x',0,LX,LY,0,'wall','room',true,false,-1);
		allstuff = allstuff.concat(walls);
		
		walls = putWallLine([],'y',0,LY,LX,0,'wall','room',true,false,-1);
		allstuff = allstuff.concat(walls);	
		
		// Doors	
		doors = putDoor(B(2,0),B(LY,0),0,1,1,'hotelcorridor-5','rooms','door','front','closed',4);
		allstuff = allstuff.concat(doors);	
	
	/*
            actions = {'killingmesoftly':{ 
                       'killingmesoftly()':[{'xyz':BBD([2.3,0.1,0]),'dxyz':[1,1,1],'walkway':True}]
                        }}   
        doors = {'doors': [{ 
                    'rooms-door-front'  :[{'ID':'hotelcorridor-5','xyz':[ 2,LY,0],'spin': 1,'width':1,'state':'open','order':4}]
                 }]}

        people['people'][0] = {**people['people'][0],
                             **{ 'kidnapped_girl': [{'ID':'girl'  ,'xyz':BBD([4.2,0.4,0]),'spin':-1,'file':'0_01N','order':7}],
                                 'drug_dealer'   : [{'ID':'dealer','xyz':BBD([1.1,3.5,0]),'spin': 1,'file':'g0_01N','order':8,'mobile':True}]
                                } }
								*/
	
	}
	
	// Update stuff list
	var label;
	for (var k=0; k<allstuff.length; ++k) {
		txt = allstuff[k];
		label = (txt[14]=='BG') ? 'background' : 'front' ;
		stuff[label].push({'ID':txt[0],'type':txt[1],'folder':txt[2],'file':txt[3],'spin':txt[4],
							'X':txt[5],'Y':txt[6],'Z':txt[7],
							'visible':txt[8],'solid':txt[9],'mobile':txt[10],'walkable':txt[11],'state':txt[12],
							'order':txt[13]});
	}
	completeStuff(LX,LY,I0,J0);
	//console.log(stuff)
	
	// Update text list
	for (var k=0; k<alltext.length; ++k) {
		txt = alltext[k];
		listText.push({'text':txt[0],'I0':txt[1],'J0':txt[2],'type':txt[3],
					   'centered':txt[4],'bubble':txt[5],'pointer':txt[6],'time':txt[7]});
	}
	// Update action list
	for (var k=0; k<allactionsBG.length; ++k) {
		txt = allactionsBG[k];
		actions['background'].push({'ID':txt[0],'function':txt[1]});
	}
	for (var k=0; k<allactionsXY.length; ++k) {
		txt = allactionsXY[k]
		actions['front'].push({'ID':txt[0],'function':txt[1],
							   'X':txt[2],'Y':txt[2],'Z':txt[2],'DX':txt[2],'DY':txt[2],'DZ':txt[2]});
	}
	
}

function completeStuff(LX,LY,I0,J0) {
	
	var labels = ['background','front']
	
	var jc = J0 == 0 ? (height - ((LX+LY)*8+12*5))/2 : J0 ;
	var ic = I0 == 0 ? LY*16 + (width-(LX+LY)*16)/2 : I0 ;
	for (var q=0; q<2; ++q) {
		label = labels[q];
		for (var k=0; k<stuff[label].length; ++k) {
			
			s = stuff[label][k];
			//console.log(s);
			im = tiles[s['type']][s['folder']][s['file']];
			
			stuff[label][k]['XM'] = s['X']+im['DX'];
			stuff[label][k]['YM'] = s['Y']+im['DY'];
			stuff[label][k]['ZM'] = s['Z']+im['DZ'];
			
			var ir = s['spin'] == 1 ? im['I'] : im['DI']-im['I'] ;
			stuff[label][k]['I0'] = XY2I(s['X'],s['Y']) - ir + ic;
			stuff[label][k]['J0'] = XYZ2J(s['X'],s['Y'],s['Z']) - im['J'] + jc;
			
		}
		stuff[label].sort((a, b) => (a.order > b.order) ? 1 : -1);
		//console.log(stuff[label]);
	}
	
}