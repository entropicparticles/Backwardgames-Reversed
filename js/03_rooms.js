



// SHIT HAPPENS HERE -----------------------------------------------------------------------------
function loadRoom(inroom) {
	console.log('ROOM > ',inroom);
	
	// set values after action
	preRoom     = room;
	room        = inroom;
	firstEntry  = true;
	
	// define guy if pre-exists and standrad entryPoint
	var g = stuff['front'][guyIndex];
	if (g) {
		guy = g;
	} else {
		g = {'file':'m0_01N'};
	}
	var entryPoint = {'X':0,'Y':0,'Z':0,'file':guy.file,'must':false};
	
	// Get the door used in the previous room for future reference
	var entryPreDoor = stuff['front'].filter( it => it['ID']==room && it['state']=='closed' );
	if (entryPreDoor.length>0) entryPreDoor = entryPreDoor[0];
		
	var alltext=[],allstuff=[],allactions=[];
	var floors=[],walls=[],doors=[],people=[],structures=[];
	var LX,LY,I0=0,J0=0;
	RGBcover = 0;
	actions = [];
	stuff   = {'background':[],'front':[]};
    space   = {'open':[],'solid':[]};
	listText = [];
	
	playMusic(room);
	
	if (room=='cover') {  //------------------------------------------------------------- COVER	
	
		menuIndex   = 2;
		
		LX = 4, LY = 6;
		I0 = 170, J0 = 4;		
			
		RGBcover = 'RGB_LA';
		entryPoint['X']    = B(2,2);
		entryPoint['Y']    = B(3,1);
		entryPoint['Z']    = 3;
		entryPoint['file'] = 'm0_01N';
		
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
		allstuff = allstuff.concat(putWallAround([[],[],[],[]],'wall','room',false,LX,LY,0,0));

		
		
	} else if (room=='elevators') {  //------------------------------------------------- ELEVATORS ROOM
	
		LX = 5, LY = 5;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint['X']    = B(3,1);
		entryPoint['Y']    = B(3,1);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		
		// Walls	
		allstuff = allstuff.concat(putWallAround([[2],[2],[2],[2]],'wall','room',false,LX,LY,0,0));
		
		// Doors	
		//doors = putDoor(B(2,0) ,B(LY,0),0, 1,1,'other_hotel_room_5','elevatorhotel','elevator','front','closed',1);
		//allstuff = allstuff.concat(doors);                                               
		//doors = putDoor(B(LX,0),B(2,0) ,0,-1,1,'2matrix','elevatorhotel','elevator','front','closed',1);
		//allstuff = allstuff.concat(doors);                                               
		//doors = putDoor(B(1,0) ,B(0,0) ,0, 1,1,'box','elevatorhotel','elevator','back','closed',3);
		//allstuff = allstuff.concat(doors);
		doors = putDoor(B(0,0) ,B(2,0) ,0,-1,1,'matrix','elevatorhotel','elevator','back','closed',3);
		allstuff = allstuff.concat(doors);
		
	} else if (room=='2matrix') {  //------------------------------------------------- MATRIX 2 ROOM
	
		LX = 5, LY = 5;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint['X']    = B(2,2);
		entryPoint['Y']    = B(3,1);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
								
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
		
		// Walls	
		allstuff = allstuff.concat(putWallAround([[2,3],[2,3],[2,3],[2,3]],'wall','room',false,LX,LY,0,0));
		
		// Doors	
		doors = putDoor(B(2,0) ,B(LY,0),0, 1,2,'matrix','maindoorhotel','automatic','front','closed',1);
		allstuff = allstuff.concat(doors);                                               
		//doors = putDoor(B(LX,0),B(2,0) ,0,-1,2,'box','maindoorhotel','automatic','front','closed',1);
		//allstuff = allstuff.concat(doors);                                               
		//doors = putDoor(B(1,0) ,B(0,0) ,0, 1,2,'elevators','maindoorhotel','automatic','back','closed',3);
		//allstuff = allstuff.concat(doors);
		//doors = putDoor(B(0,0) ,B(1,0) ,0,-1,2,'hotel_room','maindoorhotel','automatic','back','closed',3);
		//allstuff = allstuff.concat(doors);
		
	} else if (room=='matrix') {  //------------------------------------------------- MATRIX ROOM
	
		LX = 5, LY = 5;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint['X']    = B(3,1);
		entryPoint['Y']    = B(3,1);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
								
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
		
		// Walls	
		allstuff = allstuff.concat(putWallAround([[1],[2],[2],[2,3]],'wall','room',false,LX,LY,0,0));
		
		// Doors	
		doors = putDoor(B(1,0) ,B(LY,0),0, 1,1,'other_hotel_room_5','rooms','door','front','closed',1);
		allstuff = allstuff.concat(doors);                                               
		doors = putDoor(B(LX,0),B(2,0) ,0,-1,1,'elevators','elevatorhotel','elevator','front','closed',1);
		allstuff = allstuff.concat(doors);                                               
		doors = putDoor(B(2,0) ,B(0,0) ,0, 1,2,'2matrix','maindoorhotel','automatic','back','closed',3);
		allstuff = allstuff.concat(doors);
		doors = putDoor(B(0,0) ,B(2,0) ,0,-1,1,'box','rooms','door','back','closed',3);
		allstuff = allstuff.concat(doors);
		
	} else if (room=='box') {  //------------------------------------------------- BOX ROOM
	
		LX = 5, LY = 5;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint['X']    = B(2,2);
		entryPoint['Y']    = B(3,1);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
				
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
		
	} else if (room=='impossible') {  //------------------------------------------------- IMPOSSIBLE ROOM
	
		LX = 6, LY = 6;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint['X']    = B(1,0);
		entryPoint['Y']    = B(1,0);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
				
		allstuff = [
			['box','objects','tables','211', 1,B(2,0),B(2,0),D(0,0),true,true,false,false,0,0,'VI'],
			['box','objects','tables','211',-1,B(3,3),B(2,0),D(1,0),true,true,false,false,0,0,'VI'],
			['box','objects','tables','112', 1,B(2,-2),B(3,1),D(0,0),true,true,false,false,0,0,'VI']
			];   

		// doors
		doors = putDoor(B(1,0),B(0,0) ,0,1,1,'matrix','rooms','door','back','closed',1);
		allstuff = allstuff.concat(doors);
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);	
		
	} else if (room=='dabox') {  //------------------------------------------------- DABOX
	
		LX = 5, LY = 5;	
			
		RGBcover = 'RGB_cover';
		entryPoint = {'X':B(1,0),'Y':B(1,0),'Z':0,'file':'m0_01N'};
		entryPoint['X']    = B(1,0);
		entryPoint['Y']    = B(1,0);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
				
		allstuff = [
			['box'  ,'objects'   ,'tables'     ,'111'    ,-1,B(2,0),B(2,0),D(0,0),true,true,false,false,   0, 2,'VI'],
			//['box'  ,'structures'   ,'stairs','locker',1,B(2,0),B(2,0),D(0,0),true,true,false,false,   0, 2,'VI']
			];
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
		
	} else if (room=='elevator') {  //--------------------------------------------------------------- ELEVATOR ------------------------------
	
		LX = 2, LY = 2;	
			
		entryPoint = {'X':B(0,2),'Y':B(0,6),'Z':0,'file':guy.file};
		entryPoint['X']    = B(0,2);
		entryPoint['Y']    = B(0,6);
		entryPoint['Z']    = 0;
		entryPoint['must'] = true;
		
		var levelIn  = preRoom.slice(-1);
		var levelOut = levelIn == 0 ? 5 : 0 ;
		
		allactions = allactions.concat([['mirrow','elevatorMirror',[]]]);
				
		allstuff = [
			['leftwall'  ,'structures','elevator','leftwall'  , 1,B(0,0),B(2, 0),D(0,0), true,false,false,false,   0, 2,'BG'],
			['reflection','structures','elevator','reflection', 1,B(2,0),B(2, 0),D(0,0), true,false,false,false,   0, 2,'BG'],
			['mirror'    ,'structures','elevator','mirror'    , 1,B(2,0),B(0, 0),D(0,0), true,false,false,false,   0, 2,'VI'],
			['reflection','people'    ,'guy_cool','m0_01N'    , 1,B(2,4),B(0, 6),D(0,0), true,false, true,false,   0, 2,'VI'],
			['dark'      ,'structures','elevator','darkness'  , 1,B(0,0),B(0,-1),D(0,0), true,false,false,false,   0, 2,'VI']
			];
						
		// Floors
		floors   = putSquareFloor(0,2*LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
		
		// Walls	
		walls    = putWallAround([[],[],[0,1],[]],'wall','room',false,LX,LY,0,0).concat(
				   putWallLine([0.5],'y', -0.5,LY+0.5, 0,0,'wall','room',false,true,0,0,0));
		allstuff = allstuff.concat(walls);
		
		// Doors	
		doors = putDoor(B(0,0),B(0,4),0,-1,1,'hotel_corridor_'+levelOut,'elevatorhotel','elevator','back','closed',0);
		allstuff = allstuff.concat(doors);

		
	} else if (room=='hotel_room_5') {  //------------------------------------------------- ROOM
	
		menuIndex   = 0;
		objectIndex = 0;
		objects     = ['mano','gun','maletin','roomkey']
		
		LX = 5, LY = 5;
		
		entryPoint['X']    = B(2,3);
		entryPoint['Y']    = B(0,1);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		allstuff = [
			['box'  ,'objects'   ,'tables'     ,'111'    ,-1,B(0,0),B(1,0),     0,true, true,false,false,   0, 0,'VI'],
			['table','objects'   ,'tables'     ,'05051'  ,-1,B(4,4),B(1,4),     0,true, true,false,false,   0, 0,'VI'],
			['table','objects'   ,'tables'     ,'05051'  ,-1,B(4,4),B(4,2),     0,true, true,false,false,   0, 0,'BG'],
			['phone','objects'   ,'phones'     ,'phone'  , 1,B(4,5),B(4,2),D(1,0),true,false,false,false,   0, 0,'BG'],
			['bed'  ,'objects'   ,'beds'       ,'bed'    , 1,B(3,1),B(2,2),     0,true, true,false,false,   0, 0,'VI'],
			['lamp' ,'objects'   ,'lamps'      ,'lamp'   , 1,B(0,2),B(4,2),     0,true, true,false,false,'on', 0,'VI'],
			['lock' ,'objects'   ,'lockers'    ,'00'     ,-1,B(4,6),B(0,4),D(0,6),true,false,false,false,   0, 0,'BG'],
			['case' ,'objects'   ,'case'       ,'maletin', 1,B(2,1),B(2,4),D(0,6),true,false,false,false,   0, 0,'VI'],
			['case' ,'structures','hotelwindow','window' , 1,B(1,0),B(0,-1),    0,true,false,false,false,   0, 0,'VI'],
			['case' ,'structures','hotelwindow','brillo' , 1,B(1,0),B(0,-1),    0,true,false,false,false,   0, 0,'BG'],
			['dude' ,'people'    ,'drug_dealer','g0_01N' , 1,B(1,1),B(3,5) ,    0,true, true,false,false,   0, 0,'VI'],
			['girl' ,'people' ,'kidnapped_girl','0_01N'  ,-1,B(4,2),B(0,4) ,    0,true, true,false,false,   0, 0,'VI']
			];
		
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','hotelfloor','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		allstuff = allstuff.concat(putWallAround([[2],[],[],[]],'wall','room',true,LX,LY,0,0));
		
		// Doors	
		doors = putDoor(B(2,0),B(LY,0),0,1,1,'hotel_corridor_5','rooms','door','front','closed',4);
		allstuff = allstuff.concat(doors);	
	
	} else if (room=='other_hotel_room_5') {  //------------------------------------------------- OTHER ROOM
		
		LX = 5, LY = 5;
		
		entryPoint['X']    = B(1,2);
		entryPoint['Y']    = B(0,1);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		allstuff = [
			['tv'   ,'objects','computers'    ,'tv'    ,-1,B(1,0),B(4,1),D(1,0), true,false,false,false,'broken', 0,'VI'],
			['box'  ,'objects','tables'       ,'111'   ,-1,B(1,0),B(4,0),     0, true, true,false,false,       0, 0,'VI'],
			['table','objects','tables'       ,'05051' ,-1,B(4,4),B(1,4),     0, true, true,false,false,       0, 0,'VI'],
			['table','objects','tables'       ,'05051' ,-1,B(4,4),B(4,2),     0, true, true,false,false,       0, 0,'BG'],
			['phone','objects','phones'       ,'phone' , 1,B(4,5),B(4,2),D(1,0), true,false,false,false,       0, 0,'BG'],
			['bed'  ,'objects','beds'         ,'bed'   , 1,B(3,1),B(2,2),     0, true, true,false,false,       0, 0,'VI'],
			['lamp' ,'objects','lamps'        ,'lamp'  , 1,B(4,2),B(0,4),     0, true, true, true,false,'broken', 0,'VI'],
			['ddude','people' ,'gangster_dude','dd_00N',-1,B(1,1),B(3,0),     0, true, true,false,false,       0, 0,'VI'],
			['dude' ,'people' ,'gangster_dude','g0_01N',-1,B(4,2),B(0,4),     0,false, true, true,false,       0, 0,'VI']
			];
		
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','hotelfloor','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		allstuff = allstuff.concat(putWallAround([[],[],[],[1]],'wall','room',true,LX,LY,0,0));
		
		// Doors	
		doors = putDoor(B(1,0),B(0,0),0,1,1,'hotel_corridor_5','rooms','door','back','open_always',10,2);
		allstuff = allstuff.concat(doors);	
		
	} else if (room.slice(0,-2)=='toilet') {  //------------------------------------------------- TOILET
		
		var level = room.slice(-1) ;
		
		LX = 2, LY = 3;
		
		entryPoint['X']    = B(0,2);
		entryPoint['Y']    = B(1,2);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		allstuff = [
			['wc'    ,'objects','toilet','WC'    , 1,B(1, 2),B(0,4),     0, true, true,false,false,0,0,'VI'],
			['mirrow','objects','toilet','mirrow',-1,B(2,-1),B(1,6),D(2,0), true,false,false,false,0,0,'VI'],
			['grifo' ,'objects','toilet','grifo' , 1,B(1, 2),B(1,6),     0, true, true,false,false,0,0,'VI']
			];
		
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','tiles','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		allstuff = allstuff.concat(putWallAround([[],[],[1],[]],'wall','toilet',true,LX,LY,0,0));
		
		// Doors	
		doors = putDoor(B(0,0),B(1,0),0,-1,1,'hotel_corridor_'+level,'rooms','door','back','closed',10,2);
		allstuff = allstuff.concat(doors);	
	
	} else if ( room.slice(0,-2)=='hotel_corridor' && room.slice(-1)!=0 ) {  //------------------------------------------------- CORRIDOR
		
		var level = room.slice(-1);
	
		LX = 8, LY = 7;
		
		entryPoint['X']    = B(5,2);
		entryPoint['Y']    = B(5,2);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
		
		// sliders at the corridor corner
		allactions = allactions.concat([['sliderA' ,'sliders',['dwx','upy'],B(6,1),B(5,0),0,B(6,2),B(5,1)],
										['sliderB' ,'sliders',['dwy','upx'],B(6,0),B(5,1),0,B(6,1),B(5,2)]]);
		
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		allstuff = [
			['tv'   ,'objects','signs','roomnumber', 1,B(1,2),B(6,7),D(3,1), true,false,false,false,0, 6,'BG'],
			['box'  ,'objects','signs','exit'      , 1,B(6,2),B(6,7),D(3,2), true,false,false,false,0, 5,'BG'],
			['box'  ,'objects','signs','toilet'    ,-1,B(7,7),B(5,1),D(3,2), true,false,false,false,0, 4,'BG'],
			];
			
		// Floors
		floors   = putSquareFloor(   0,LX,LY-2,LY  ,0,'floor','hotelfloor','00',true,0,'BG').concat(
				putSquareFloor(LX-2,LX,   0,LY-2,0,'floor','hotelfloor','00',true,0,'BG'));
		allstuff = allstuff.concat(floors);
			
		// Walls	
		walls    = putWallAround([[1,6],[5,1],[],[]],'wall','room',true,LX,LY,0,0).concat(
				putWallLine([2],'x', 0,LX-2, 5,0,'wall','room',false,true,0,0,0)).concat(
				putWallLine([ ],'y', 0,   5, 6,0,'wall','room',false,true,0,0,0));
		allstuff = allstuff.concat(walls);
		
		// Doors	
		doors = putDoor(B( 1,0),B(LY,0),0, 1,1,'other_hotel_room_'+level,'rooms'        ,'door'    ,'front','open_always',1).concat(
				putDoor(B( 6,0),B(LY,0),0, 1,1,'stairs_'+level          ,'rooms'        ,'door'    ,'front','closed'     ,1)).concat(
				putDoor(B(LX,0),B( 5,0),0,-1,1,'toilet_'+level          ,'rooms'        ,'door'    ,'front','open',1)).concat(
				putDoor(B(LX,0),B( 1,0),0,-1,1,'elevator'               ,'elevatorhotel','elevator','front','closed'     ,1)).concat(
				putDoor(B( 2,0),B( 5,0),0, 1,1,'hotel_room_'+level      ,'rooms'        ,'door'    ,'back' ,'closed'     ,1));
		allstuff = allstuff.concat(doors);	

	} else if (room == 'hotel_corridor_0') {  //----------------------------------------------------------------- LOBBY
		
		LX = 8, LY = 7;
		J0 = 5;
		
		entryPoint['X']    = B(6,2);
		entryPoint['Y']    = B(5,4);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		allstuff = [
			['sofa' ,'objects','sofas'    ,'111'     , 1,B(5,2),B(0,2),     0, true, true,false,false,0, 0,'VI'],
			['sofa' ,'objects','sofas'    ,'111'     ,-1,B(3,6),B(1,6),     0, true, true,false,false,0, 0,'VI'],
			['table','objects','tables'   ,'1105'    , 1,B(3,6),B(0,2),     0, true, true,false,false,0, 0,'VI'],
			['plan' ,'objects','plants'   ,'05051'   , 1,B(7,2),B(2,2),     0, true, true,false,false,0, 0,'VI'],
			['cola' ,'objects','machines' ,'cola'    , 1,B(7,0),B(3,0),     0, true, true,false,false,0, 0,'VI'],
			['desk' ,'objects','hoteldesk','desk'    , 1,B(0,0),B(5,0),     0, true, true,false,false,0, 0,'VI'],
			['box'  ,'objects','signs'    ,'stairs'  , 1,B(6,2),B(6,7),D(3,2), true,false,false,false,0, 5,'BG'],
			['box'  ,'objects','signs'    ,'toilet'  ,-1,B(7,7),B(5,1),D(3,2), true,false,false,false,0, 4,'BG'],
			['phone','objects','phones'   ,'phone'   , 1,B(2,4),B(5,0),D(1,0), true, true,false,false,0, 0,'VI'],
			['keys' ,'objects','keyshell' ,'keyshell', 1,B(2,4),B(6,4),     0, true, true,false,false,0, 0,'VI']
			];
		
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','hotelfloor','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		allstuff = allstuff.concat(putWallAround([[1,6],[1,5],[],[1,2]],'wall','room',true,LX,LY,0,0));
		
		// Doors	
		doors = putDoor(B( 1,0),B(LY,0),0, 1,1,'impossible'    ,'rooms'        ,'door'     ,'front','closed'       ,0,1).concat(
		        putDoor(B( 6,0),B(LY,0),0, 1,1,'stairs_0'      ,'rooms'        ,'door'     ,'front','closed'       ,0,1)).concat(
				putDoor(B(LX,0),B( 5,0),0,-1,1,'toilet_0'      ,'rooms'        ,'door'     ,'front','closed'       ,0,1)).concat(
				putDoor(B(LX,0),B( 1,0),0,-1,1,'elevator'      ,'elevatorhotel','elevator' ,'front','closed'       ,0,1)).concat(
				putDoor(B( 1,0),B( 0,0),0, 1,2,'hotel_street_0','maindoorhotel','automatic','back' ,'closed'       ,0,1));
		allstuff = allstuff.concat(doors);			
		
	} else if (room.slice(0,-2)=='stairs') {  //------------------------------------------------- STAIRS
		
		var level       = room.slice(-1);
		var screenLevel = Math.floor(level/2)*2;
		console.log(level,screenLevel)
		
		LX = 5, LY = 5;
		J0 = 10 - 60*screenLevel;
		
		// For teleporters: if guy arrives from the same room, use his XYZ as it is
		if (preRoom.slice(0,-2)!='stairs') {
			entryPoint['X']    = B(2,2);
			entryPoint['Y']    = B(2,2);
			entryPoint['Z']    = 0;
			entryPoint['file'] = 'm0_01N'; 
		} else {
			entryPoint['X']    = guy.X;
			entryPoint['Y']    = guy.Y;
			entryPoint['Z']    = guy.Z;	
			entryPoint['must'] = true;	
		}
		//allactions = allactions.concat([['sliderA' ,'sliders',['dwx','upy'],B(6,1),B(5,0),0,B(6,3),B(5,1)],
		//								['sliderB' ,'sliders',['dwy','upx'],B(6,0),B(5,1),0,B(6,1),B(5,2)]]);

		// teleporter between levels Move it strategically
		/*allactions = allactions.concat([
										['from012to234','changeroom', [screenLevel == 0 ? 'stairs_2' : 'stairs_0'] ,
											B(1,4),B(0,0),60*2+(screenLevel == 0 ? 0 : -3),B(2,0),B(1,4)],
										['from234to456','changeroom', [screenLevel == 2 ? 'stairs_4' : 'stairs_2'] ,
											B(1,4),B(0,0),60*4+(screenLevel == 2 ? 0 : -3),B(2,0),B(1,4)],
										['from456to6'  ,'changeroom', [screenLevel == 4 ? 'stairs_6' : 'stairs_4'] ,
											B(1,4),B(0,0),60*6+(screenLevel == 4 ? 0 : -3),B(2,0),B(1,4)]
									   ]);*/
		allactions = allactions.concat([
										['from012to234','changeroom', [screenLevel == 0 ? 'stairs_2' : 'stairs_0'] ,
											B(2,4),B(3,4),60  +30-3+(screenLevel == 0 ? 0 : -3),B(3,0),B(5,0)],
										['from234to456','changeroom', [screenLevel == 2 ? 'stairs_4' : 'stairs_2'] ,
											B(2,4),B(3,4),60*3+30-3+(screenLevel == 2 ? 0 : -3),B(3,0),B(5,0)],
										['from456to6'  ,'changeroom', [screenLevel == 4 ? 'stairs_6' : 'stairs_4'] ,
											B(2,4),B(3,4),60*5+30-3+(screenLevel == 4 ? 0 : -3),B(3,0),B(5,0)]
									   ]);
									   

		
		// internal walls (mind the first floor distribution)
		fakeWalls = [{'ID':'fake','X':B(1,2),'Y':B(1,4),'Z': 0,'XM':B(1, 4),'YM':B(4,-1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(1,4),'Y':B(3,4),'Z': 0,'XM':B(3, 4),'YM':B(4,-1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(3,4),'Y':B(1,4),'Z': 0,'XM':B(4,-1),'YM':B(4,-1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(3,4),'Y':B(0,0),'Z': 0,'XM':B(3, 4),'YM':B(4,-1),'ZM':12*3  ,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(1,2),'Y':B(1,2),'Z':45,'XM':B(4,-1),'YM':B(1, 4),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false}];
		stuff['background'] = stuff['background'].concat(fakeWalls);
		
		// external walls (mind the door)
		fakeWalls = [{'ID':'fake','X':B( 0,0),'Y':B(LY,0),'Z':0,'XM':B(LX,1),'YM':B(LY,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(LX,0),'Y':B( 0,0),'Z':0,'XM':B(LX,1),'YM':B(LY,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B( 0,0),'Y':B( 0,0),'Z':0,'XM':B( 0,1),'YM':B(LY,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B( 1,0),'Y':B( 0,0),'Z':0,'XM':B(LX,1),'YM':B( 0,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false}];
		stuff['background'] = stuff['background'].concat(fakeWalls);

		var zmin = Math.max(0,level-3),
		    zmax = Math.min(6,level+3);
		for (var z=zmin; z<zmax; ++z) {
			
			var Z = z*5;
			
			// 0 level
			if (z==0) {
				
				// Floors
				floors   = putSquareFloor(0,LX,0,LY,0,'floor','tiles','00',true,0,'BG');
				allstuff = allstuff.concat(floors);
			
			// 0th floor images
				allstuff = allstuff.concat([
					['STAIRS0','structures','stairs','3halfsquare2halfhigh', 1,B(0,0),B(3,4),  0, true,false,false,false,0, 0,'VI'],
					['STAIRS0','structures','stairs','stairs0leftwallA'    , 1,B(1,4),B(3,4),  0, true,false,false,false,0, 0,'VI'],
					['STAIRS0','structures','stairs','stairs0leftwallB'    , 1,B(2,4),B(3,4),  0, true,false,false,false,0, 0,'VI'],
					//['STAIRS0','structures','stairs','3halfsquare2halfhigh',-1,B(3,4),B(3,4), 15, true,false,false,false,0, 0,'VI'],			
					['STAIRS0','structures','stairs','stairs0rightwallA'   ,-1,B(3,4),B(0,4),  0, true,false,false,false,0, 0,'VI'],			
					['STAIRS0','structures','stairs','stairs0rightwallA'   ,-1,B(3,4),B(1,4),  0, true,false,false,false,0, 0,'VI'],			
					['STAIRS0','structures','stairs','stairs0rightwallB'   ,-1,B(3,4),B(2,4),  0, true,false,false,false,0, 0,'VI'],			
					['STAIRS0','structures','stairs','3halfsquareveryhigh' ,-1,B(3,4),B(0,0),  0, true,false,false,false,0, 0,'VI']			
				]);			
				
			}		
			
			// level sign
			allstuff.push(['sign','objects','signs','floor_'+(z+1),1,B(0,4),B(5,-1),D(1+Z+2,6), true,false,false,false,0, 0,'BG'])
			
			// Walls
			for (var k=0;k<5;++k) {
				walls    = walls.concat([
					['STAIRSWALLS','structures','stairs','left_wall_last_'+k , 1,B(k,0),B(5,0),D(1+Z,3), true,false,false,false,0, 0,'BG'],
					['STAIRSWALLS','structures','stairs','right_wall_last_'+k,-1,B(5,0),B(k,0),D(1+Z,3), true,false,false,false,0, 0,'BG']
				]);
			}
			allstuff = allstuff.concat(walls);
			
			// Doors	
			doors = putDoor(B(0,0),B(0,0),D(Z,0),1,1,'hotel_corridor_'+z,'rooms','door','back','closed',0);
			if (z==5) doors = doors.concat(putDoor(B(0,0),B(0,0),D(30,0),1,1,'hotel_corridor_6','rooms','door','back','closed',0));
			allstuff = allstuff.concat(doors);		
			
			// Stairs & railing (manubrio)
			var stairs = []
			for (var k=0;k<4;++k) {
				var step1 = z==0 ? 'step_k'+k : 'step_front' ; 
				stairs = stairs.concat([
					['STAIRS' ,'structures','stairs', step1          , 1,B(0,0),B(1,4)+4*k,   3*k    +D(Z,0), true, true,false, true,0, 0,'VI'],
					['railing','structures','stairs','manubrio_unitA', 1,B(1,2),B(1,4)+4*k,   3*k    +D(Z,3), true,false,false,false,0, 0,'VI'],
					['STAIRS' ,'structures','stairs','step_front'    ,-1,B(1,4)+4*k,B(3,4),15+3*k    +D(Z,0), true, true,false, true,0, 0,'VI'],
					['railing','structures','stairs','manubrio_unitA',-1,B(1,4)+4*k,B(3,6),15+3*k    +D(Z,3), true,false,false,false,0, 0,'VI'],
					['STAIRS' ,'structures','stairs','step_back'     , 1,B(3,4),B(1,4)+4*k,45-3*(k+2)+D(Z,0), true, true,false, true,0, 0,'VI'],
					['railing','structures','stairs','manubrio_unitB',-1,B(3,4),B(1,6)+4*(k-1),45-3*(k+1)+D(Z,3), true,false,false,false,0, 0,'VI'],
					['STAIRS' ,'structures','stairs','step_back'     ,-1,B(1,4)+4*k,B(0,0),60-3*(k+2)+D(Z,0), true, true,false, true,0, 0,'VI'],
					['railing','structures','stairs','manubrio_unitB', 1,B(1,4)+4*k,B(1,2),60-3*(k+2)+D(Z,3), true,false,false,false,0, 0,'VI']
					]);
			}
			stairs = stairs.concat([
					['railing','structures','stairs','manubrio_cornerAA' ,1,B(1,2),B(3,4),15+D(Z,0),true,false,false,false,0,0,'VI'],
					['railing','structures','stairs','manubrio_cornerAB1',1,B(3,4),B(3,4),30+D(Z,0),true,false,false,false,0,0,'VI'],
					['railing','structures','stairs','manubrio_cornerBB' ,1,B(3,4),B(1,2),45+D(Z,0),true,false,false,false,0,0,'VI'],
					['railing','structures','stairs','manubrio_cornerAB2',1,B(1,2),B(1,2),60+D(Z,0), z<5,false,false,false,0,0,'VI'],
					]);
			if (z==5) stairs.push(['railing','structures','stairs','manubrio_last',1,B(0,0),B(1,2),D(30,0),true,true,false,false,0,0,'VI']);
			
			allstuff = allstuff.concat(stairs)
			
			// platforms
			squares = [
						['STAIRS','structures','stairs','3halfsquarelines', 1,B(0,0),B(0,0),D(Z,60-6), true, true,false, true,0, 0,'VI'],
						['STAIRS','structures','stairs','3halfsquarelines', 1,B(3,4),B(0,0),D(Z,45-6), z!=0, true,false, true,0, 0,'VI'],
						['STAIRS','structures','stairs','3halfsquare'     ,-1,B(3,4),B(3,4),D(Z,30-6), true, true,false, true,0, 0,'VI'],
						['STAIRS','structures','stairs','3halfsquare'     , 1,B(0,0),B(3,4),D(Z,15-6), z!=0, true,false, true,0, 0,'VI'],
						];
			allstuff = allstuff.concat(squares);
			
		}
		
	}

	
	// SHIT ENDS HERE -----------------------------------------------------------------------------

	
	makeStuff(allstuff);
	putGuyAtRoom(entryPoint,entryPreDoor,entryPoint);
	completeStuff(LX,LY,I0,J0);	
	//sortMobile(false);
	makeText(alltext);
	makeActions(allactions);	
	console.log(actions)
	makeSpace();
}

function putGuyAtRoom(entryPoint,entryPreDoor,entryPoint) {
	
	// now we look for the door of entry (preRoom) and give the guy the right entry position and open that door
	// if he's not coming from a door, we use entryPoint
	
	var ep = entryPoint;
	if (ep.must) {
		
		guy.X = ep.X; guy.Y = ep.Y; guy.Z = ep.Z; guy.file = ep.file;	
		
	} else {
		
		// look for an exact match between door and preRoom
		var entryDoorIncices = stuff['front'].flatMap(
									(it, i) => it['ID'] == preRoom && it['type'] == 'doors' ? i : []);
		
		// if not match, look for those with floors
		if (entryDoorIncices.length==0) entryDoorIncices = stuff['front'].flatMap(
									(it, i) => it['ID'].slice(0,-2) == preRoom.slice(0,-2) && it['type'] == 'doors' ? i : []);
									
		if (entryDoorIncices.length!=0) {
			
			for (var k=0; k<entryDoorIncices.length; ++k) {
				var q = entryDoorIncices[k];
				st = stuff['front'][q];
				if (st['state']=='closed') {
					var ss = Math.round((1-st['spin'])/2);
					d = st['file'].split('_')[0]=='front' ? 0 : 1 ;
					var dx = (2)*(1-2*d)*ss,
						dy = (2)*(1-2*d)*(1-ss);
					guy.X = st.X+dx+(1-ss)*(guy.X-entryPreDoor.X); 
					guy.Y = st.Y+dy+    ss*(guy.Y-entryPreDoor.Y); 
					guy.Z = st.Z;				
				}
				stuff['front'][q]['solid']   = st['state']=='open';
				stuff['front'][q]['visible'] = st['state']=='open';
			}
			
		} else {
			
			guy.X = ep.X; guy.Y = ep.Y; guy.Z = ep.Z; guy.file = ep.file;		
			
		}
	}
	
	
	makeStuff([['guy','people',guy.folder,guy.file,1,guy.X,guy.Y,guy.Z,true,false,true,false,guy.state,-1,'VI']]);
	
	console.log('entry:',guy['ID'],guy['X'],guy['Y'],guy['Z']);
}






	/*
	var entryIndex = allstuff.flatMap((it, i) => it[1] == 'doors' && it[0] == preRoom ? i : []);
		var entryDoor = allstuff.filter( (it, i) => entryIndex.includes(i) );
		var ed = entryDoor.find( it => it[12] == 'closed' );

	// Put guy in the stuff list
	allstuff.unshift(['guy','people',guy.folder,guy.file,1,guy.X,guy.Y,guy.Z,true,false,true,false,guy.state,-1,'VI']);
	*/