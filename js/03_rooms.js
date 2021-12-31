



// SHIT HAPPENS HERE -----------------------------------------------------------------------------
function loadRoom(inroom) {
	console.log('ROOM > ',inroom);
	
	// set values after action
	preRoom     = room;
	room        = inroom;
	firstEntry  = true;
	
	var g = stuff['front'][guyIndex];
	if (g) guy = g;
	console.log('entry:',guy['ID'],guy['X'],guy['Y'],guy['Z']);
	
	// Get the door used to enter as future reference
	var entryPreDoor = stuff['front'].filter( it => it['ID']==room && it['state']=='closed' );
	if (entryPreDoor.length>0) entryPreDoor = entryPreDoor[0];
	
	var alltext=[],allstuff=[],allactions=[];
	var floors=[],walls=[],doors=[],people=[],structures=[];
	var LX,LY,I0=0,J0=0;
	var entryPoint = {};
	RGBcover = 0;
	actions = [];
	stuff   = {'background':[],'front':[]};
    space = {'open':[],'solid':[]};
	listText = [];
	
	playMusic(room);
	
	if (room=='cover') {  //------------------------------------------------------------- COVER	
	
		menuIndex   = 2;
		
		LX = 4, LY = 6;
		I0 = 170, J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint['void']={'X':B(2,2),'Y':B(3,1),'Z':3,'subfile':'m0_01N'};
		
		// just as example: get the position defined by the point of entrance
		var ep = entryPoint[preRoom in entryPoint ? preRoom : 'void'];
		guy.X = ep.X; guy.Y = ep.Y; guy.Z = ep.Z; guy.file = ep.subfile;
		
		alltext = [
			[' Created by Backward Games ',LI/2,100-4,'text_normal',true,true,false,-1],
			['Reversed',LI/2,110,'gothic',true,false,false,-1],
			['Start||Help||Quit',250,62,'text_normal',false,false,false,-1]];
			
		allactions = allactions.concat([['menu' ,'menuCover',[]]]);
	
		
		allstuff = [
			['limo'        ,'structures','vehicles'      ,'limo'    ,-1,B(-1,3),B(2,4) , 0,true,true,false,false,0,3,'VI'],
			['girl'        ,'people'    ,'kidnapped_girl','B_01N'   , 1,B(0,5) ,B(3,-2),12,true,true,false,false,0,5,'VI'],
			['dealer'      ,'people'    ,'drug_dealer'   ,'00_00N'  , 1,B(3,0) ,B(1,6) , 3,true,true,false,false,0,1,'VI'],
			['ganstergirl' ,'people'    ,'gangster_girl' ,'0g_00R'  , 1,B(3,-2),B(0,2) , 3,true,true,false,false,0,2,'VI'],
			['gangsterdude','people'    ,'gangster_dude' ,'00_10N'  , 1,B(1,0) ,B(0,0) , 0,true,true,false,false,0,4,'VI']
			];
		for (var y=0;y<LY;++y) {
			allstuff = allstuff.concat([
			['escala'      ,'objects'   ,'tables'        ,'1103'    , 1,B(2,0) ,B(y,0) , 0,true,false,false,true,0,0,'BG'],
			['escala'      ,'objects'   ,'tables'        ,'1103'    , 1,B(3,0) ,B(y,0) , 0,true,false,false,true,0,0,'BG']
			]);			
		}
		
			
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		allstuff = allstuff.concat(putWallAround([[],[],[],[]],'wall','room',false,LX,LY,0));

		
		
	} else if (room=='elevators') {  //------------------------------------------------- ROOM
	
		LX = 5, LY = 5;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint = {'X':B(3,1),'Y':B(3,1),'Z':0,'file':'m0_01N'};
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		
		// Walls	
		allstuff = allstuff.concat(putWallAround([[2],[2],[2],[2]],'wall','room',false,LX,LY,0));
		
		// Doors	
		//doors = putDoor(B(2,0) ,B(LY,0),0, 1,1,'other_hotel_room','elevatorhotel','elevator','front','closed',1);
		//allstuff = allstuff.concat(doors);                                               
		//doors = putDoor(B(LX,0),B(2,0) ,0,-1,1,'2matrix','elevatorhotel','elevator','front','closed',1);
		//allstuff = allstuff.concat(doors);                                               
		//doors = putDoor(B(1,0) ,B(0,0) ,0, 1,1,'box','elevatorhotel','elevator','back','closed',3);
		//allstuff = allstuff.concat(doors);
		doors = putDoor(B(0,0) ,B(2,0) ,0,-1,1,'matrix','elevatorhotel','elevator','back','closed',3);
		allstuff = allstuff.concat(doors);
		
	} else if (room=='2matrix') {  //------------------------------------------------- ROOM
	
		LX = 5, LY = 5;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint = {'X':B(2,2),'Y':B(3,1),'Z':0,'file':'m0_01N'};
								
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
		
		// Walls	
		allstuff = allstuff.concat(putWallAround([[2,3],[2,3],[2,3],[2,3]],'wall','room',false,LX,LY,0));
		
		// Doors	
		doors = putDoor(B(2,0) ,B(LY,0),0, 1,2,'matrix','maindoorhotel','automatic','front','closed',1);
		allstuff = allstuff.concat(doors);                                               
		//doors = putDoor(B(LX,0),B(2,0) ,0,-1,2,'box','maindoorhotel','automatic','front','closed',1);
		//allstuff = allstuff.concat(doors);                                               
		//doors = putDoor(B(1,0) ,B(0,0) ,0, 1,2,'elevators','maindoorhotel','automatic','back','closed',3);
		//allstuff = allstuff.concat(doors);
		//doors = putDoor(B(0,0) ,B(1,0) ,0,-1,2,'hotel_room','maindoorhotel','automatic','back','closed',3);
		//allstuff = allstuff.concat(doors);
		
	} else if (room=='matrix') {  //------------------------------------------------- ROOM
	
		LX = 5, LY = 5;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint = {'X':B(3,1),'Y':B(3,1),'Z':0,'file':'m0_01N'};
								
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
		
		// Walls	
		allstuff = allstuff.concat(putWallAround([[1],[2],[2],[2,3]],'wall','room',false,LX,LY,0));
		
		// Doors	
		doors = putDoor(B(1,0) ,B(LY,0),0, 1,1,'other_hotel_room','rooms','door','front','closed',1);
		allstuff = allstuff.concat(doors);                                               
		doors = putDoor(B(LX,0),B(2,0) ,0,-1,1,'elevators','elevatorhotel','elevator','front','closed',1);
		allstuff = allstuff.concat(doors);                                               
		doors = putDoor(B(2,0) ,B(0,0) ,0, 1,2,'2matrix','maindoorhotel','automatic','back','closed',3);
		allstuff = allstuff.concat(doors);
		doors = putDoor(B(0,0) ,B(2,0) ,0,-1,1,'box','rooms','door','back','closed',3);
		allstuff = allstuff.concat(doors);
		
	} else if (room=='box') {  //------------------------------------------------- ROOM
	
		LX = 5, LY = 5;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint = {'X':B(2,2),'Y':B(3,1),'Z':0,'file':'m0_01N'};
				
		allstuff = [
			['box'  ,'objects'   ,'tables'     ,'111'    ,-1,B(2,0),B(2,0),     0,true, true,false,false,   0, 2,'VI']
			];
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);	
		
		// Doors	
		//doors = putDoor(B(2,0) ,B(LY,0),0, 1,1,'other_hotel_room','rooms','door','front','closed',1);
		//allstuff = allstuff.concat(doors);                                               
		doors = putDoor(B(LX,0),B(2,0) ,0,-1,1,'matrix','rooms','door','front','closed',1);
		allstuff = allstuff.concat(doors);                                               
		//doors = putDoor(B(2,0) ,B(0,0) ,0, 1,1,'box','rooms','door','back','closed',3);
		//allstuff = allstuff.concat(doors);
		//doors = putDoor(B(0,0) ,B(2,0) ,0,-1,1,'2matrix','rooms','door','back','closed',3);
		//allstuff = allstuff.concat(doors);	
		
	} else if (room=='hotel_room') {  //------------------------------------------------- ROOM
	
		menuIndex   = 0;
		objectIndex = 0;
		objects     = ['mano','gun','maletin','roomkey']
		
		LX = 5, LY = 5;
		
		entryPoint = {'X':B(2,3),'Y':B(0,1),'Z':0,'file':'00_01N'};
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		allstuff = [
			['box'  ,'objects'   ,'tables'     ,'111'    ,-1,B(0,0),B(1,0),     0,true, true,false,false,   0, 10,'VI'],
			['table','objects'   ,'tables'     ,'05051'  ,-1,B(4,4),B(1,4),     0,true, true,false,false,   0,  5,'VI'],
			['table','objects'   ,'tables'     ,'05051'  ,-1,B(4,4),B(4,2),     0,true, true,false,false,   0,  1,'VI'],
			['phone','objects'   ,'phones'     ,'phone'  , 1,B(4,5),B(4,2),D(1,0),true,false,false,false,   0,  2,'VI'],
			['bed'  ,'objects'   ,'beds'       ,'bed'    , 1,B(3,1),B(2,2),     0,true, true,false,false,   0,  4,'VI'],
			['lamp' ,'objects'   ,'lamps'      ,'lamp'   , 1,B(0,2),B(4,2),     0,true, true,false,false,'on',  9,'VI'],
			['lock' ,'objects'   ,'lockers'    ,'00'     ,-1,B(4,6),B(0,4),D(0,6),true,false,false,false,   0,  1,'BG'],
			['case' ,'objects'   ,'case'       ,'maletin', 1,B(2,1),B(2,4),D(0,6),true,false,false,false,   0,  8,'VI'],
			['case' ,'structures','hotelwindow','window' , 1,B(1,0),B(0,-1),    0,true,false,false,false,   0, 11,'VI'],
			['case' ,'structures','hotelwindow','brillo' , 1,B(1,0),B(0,-1),    0,true,false,false,false,   0,  2,'BG'],
			['dude' ,'people'    ,'drug_dealer','g0_01N' , 1,B(1,1),B(3,5) ,    0,true, true,false,false,   0,  7,'VI'],
			['girl' ,'people' ,'kidnapped_girl','0_01N'  ,-1,B(4,2),B(0,4) ,    0,true, true,false,false,   0,  6,'VI']
			];
		
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','hotelfloor','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		allstuff = allstuff.concat(putWallAround([[2],[],[],[]],'wall','room',true,LX,LY,4.5));
		
		// Doors	
		doors = putDoor(B(2,0),B(LY,0),0,1,1,'hotelcorridor-5','rooms','door','front','closed',4);
		allstuff = allstuff.concat(doors);	
	
	} else if (room=='other_hotel_room') {
		
		LX = 5, LY = 5;
		
		entryPoint ={'X':B(1,2),'Y':B(0,-1),'Z':0,'file':'01N'};
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		allstuff = [
			['tv'   ,'objects','computers'    ,'tv'    ,-1,B(1,0),B(4,1),D(1,0), true,false,false,false,'broken', 6,'VI'],
			['box'  ,'objects','tables'       ,'111'   ,-1,B(1,0),B(4,0),     0, true, true,false,false,       0, 5,'VI'],
			['table','objects','tables'       ,'05051' ,-1,B(4,4),B(1,4),     0, true, true,false,false,       0, 4,'VI'],
			['table','objects','tables'       ,'05051' ,-1,B(4,4),B(4,2),     0, true, true,false,false,       0, 1,'BG'],
			['phone','objects','phones'       ,'phone' , 1,B(4,5),B(4,2),D(1,0), true,false,false,false,       0, 2,'BG'],
			['bed'  ,'objects','beds'         ,'bed'   , 1,B(3,1),B(2,2),     0, true, true,false,false,       0, 3,'VI'],
			['lamp' ,'objects','lamps'        ,'lamp'  , 1,B(4,2),B(0,4),     0, true, true, true,false,'broken', 7,'VI'],
			['ddude','people' ,'gangster_dude','dd_00N',-1,B(1,1),B(3,0),     0, true, true,false,false,       0, 8,'VI'],
			['dude' ,'people' ,'gangster_dude','g0_01N',-1,B(4,2),B(0,4),     0,false, true, true,false,       0, 8,'VI']
			];
		
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','hotelfloor','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		allstuff = allstuff.concat(putWallAround([[],[],[],[1]],'wall','room',true,LX,LY,0));
		
		// Doors	
		doors = putDoor(B(1,0),B(0,0),0,1,1,'matrix','rooms','door','back','open',10,2);
		allstuff = allstuff.concat(doors);	
		
	}
	
	makeStuff(allstuff);
	
	var s = 0;
	// check collision between guy and door
	for (var k=0; k<stuff['front'].length; ++k) {
		st = stuff['front'][k];
		if (st['ID']==preRoom && st['type']=='doors'){
			if (st['state']=='closed') {
				s = st['spin'];
				var ss = Math.round((1-s)/2);
				d = st['file'].split('_')[0]=='front' ? 0 : 1 ;
				var dx = (2)*(1-2*d)*ss,
				    dy = (2)*(1-2*d)*(1-ss);
				guy.X = st.X+dx+(1-ss)*(guy.X-entryPreDoor.X); 
				guy.Y = st.Y+dy+    ss*(guy.Y-entryPreDoor.Y); 
				guy.Z = st.Z;				
			}
			stuff['front'][k]['solid']   = st['state']=='open';
			stuff['front'][k]['visible'] = st['state']=='open';
		}
	}
	
	if (s==0) {
		ep = entryPoint;
		guy.X = ep.X; guy.Y = ep.Y; guy.Z = ep.Z; guy.file = ep.file;		
	}
	makeStuff([['guy','people',guy.folder,guy.file,1,guy.X,guy.Y,guy.Z,true,false,true,false,guy.state,-1,'VI']]);
	/*
	// now we look for the door of entry (preRoom) and give the guy the right entry position and open that door
	// if he's not coming from a door, we use entryPoint
	
	// 1. Take the entry door items
	// 2. Take the 'closed' as reference, we are putting the xyz info there
	// 3. make sure the door is open when entering
	var entryIndex = allstuff.flatMap((it, i) => it[1] == 'doors' && it[0] == preRoom ? i : []);
	if (entryIndex.length>0) {
		var entryDoor = allstuff.filter( (it, i) => entryIndex.includes(i) );
		var ed = entryDoor.find( it => it[12] == 'closed' );
		var s = ed[4];
		guy.X = ed[15]+(1+s)/2*(guy.X-entryPreDoor.X); 
		guy.Y = ed[16]+(1-s)/2*(guy.Y-entryPreDoor.Y); 
		guy.Z = ed[17];
		
		for (var kk=0;kk<entryIndex.length;++kk) {
			var ii = entryIndex[kk];
			allstuff[ii][8] = allstuff[ii][12]=='open';
			allstuff[ii][9] = allstuff[ii][12]=='open';
		}
	} else {
		ep = entryPoint;
		guy.X = ep.X; guy.Y = ep.Y; guy.Z = ep.Z; guy.file = ep.file;
	}
	
	// Put guy in the stuff list
	allstuff.unshift(['guy','people',guy.folder,guy.file,1,guy.X,guy.Y,guy.Z,true,false,true,false,guy.state,-1,'VI']);
	
	makeStuff(allstuff);
	*/
	
	completeStuff(LX,LY,I0,J0);	
	sortMobile();
	makeText(alltext);
	makeActions(allactions);	
	console.log(actions)
	makeSpace();
}

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}