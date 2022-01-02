



// SHIT HAPPENS HERE -----------------------------------------------------------------------------
function loadRoom(inroom) {
	console.log('ROOM > ',inroom);
	
	// set values after action
	preRoom     = room;
	room        = inroom;
	firstEntry  = true;
	// Get the door used to enter as future reference
	var entryPreDoor = stuff['front'].filter( it => it['ID']==room && it['state']=='closed' );
	if (entryPreDoor.length>0) entryPreDoor = entryPreDoor[0];
	
	var g = stuff['front'][guyIndex];
	if (g) guy = g;
	console.log('entry:',guy['ID'],guy['X'],guy['Y'],guy['Z']);
		
	var alltext=[],allstuff=[],allactions=[];
	var floors=[],walls=[],doors=[],people=[],structures=[];
	var LX,LY,I0=0,J0=0;
	var entryPoint = {};
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
		entryPoint = {'X':B(2,2),'Y':B(3,1),'Z':3,'file':'m0_01N'};
		
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
		entryPoint = {'X':B(3,1),'Y':B(3,1),'Z':0,'file':'m0_01N'};
						
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
		entryPoint = {'X':B(2,2),'Y':B(3,1),'Z':0,'file':'m0_01N'};
								
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
		entryPoint = {'X':B(3,1),'Y':B(3,1),'Z':0,'file':'m0_01N'};
								
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
		
	} else if (room=='impossible') {  //------------------------------------------------- IMPOSSIBLE ROOM
	
		LX = 6, LY = 6;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint = {'X':B(1,0),'Y':B(1,0),'Z':0,'file':'m0_01N'};
				
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
				
		allstuff = [
			['box'  ,'objects'   ,'tables'     ,'111'    ,-1,B(2,0),B(2,0),D(0,0),true,true,false,false,   0, 2,'VI'],
			//['box'  ,'structures'   ,'stairs','locker',1,B(2,0),B(2,0),D(0,0),true,true,false,false,   0, 2,'VI']
			];
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
		
	} else if (room=='elevator') {  //--------------------------------------------------------------- ELEVATOR ------------------------------
	
		LX = 2, LY = 2;	
			
		entryPoint = {'X':B(0,2),'Y':B(0,6),'Z':0,'file':'m0_01N'};
		
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
		
		entryPoint = {'X':B(2,3),'Y':B(0,1),'Z':0,'file':'00_01N'};
				
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
		
		entryPoint ={'X':B(1,2),'Y':B(0,-1),'Z':0,'file':'00_01N'};
				
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
		
		entryPoint ={'X':B(0,2),'Y':B(1,2),'Z':0,'file':'00_01N'};
				
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
		
		entryPoint ={'X':B(7,0),'Y':B(5,2),'Z':0,'file':'00_01N'};
		
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
		
		entryPoint ={'X':B(6,2),'Y':B(5,4),'Z':0,'file':'00_01N'};
				
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
		
		var level = room.slice(-1) ;
		
		LX = 5, LY = 5;
		J0 = 10;
		
		// sliders at the corridor corner
		//allactions = allactions.concat([['sliderA' ,'sliders',['dwx','upy'],B(6,1),B(5,0),0,B(6,2),B(5,1)],
		//								['sliderB' ,'sliders',['dwy','upx'],B(6,0),B(5,1),0,B(6,1),B(5,2)]]);
		
		// sliders at the corridor corner
		allactions = allactions.concat([['camera','cameraZ',[]]]);
		
		
		entryPoint ={'X':B(2,2),'Y':B(2,2),'Z':0,'file':'00_01N'};
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		// 0th floor images
		allstuff = [
			['STAIRS0','structures','stairs','stairs0leftdownwall' , 1,B(0,0),B(1,4),  0, true,false,false,false,0, 0,'VI'],
			['STAIRS0','structures','stairs','3halfsquare2halfhigh', 1,B(0,0),B(3,4),  0, true,false,false,false,0, 0,'VI'],
			['STAIRS0','structures','stairs','stairs0leftwall'     , 1,B(1,4),B(3,4),  0, true,false,false,false,0, 0,'VI'],
			['STAIRS0','structures','stairs','3halfsquare2halfhigh',-1,B(3,4),B(3,4), 15, true,false,false,false,0, 0,'VI'],			
			['STAIRS0','structures','stairs','stairs0rightwall'    , 1,B(3,4),B(1,4),  0, true,false,false,false,0, 0,'VI'],			
			['STAIRS0','structures','stairs','3halfsquareveryhigh' ,-1,B(3,4),B(0,0),  0, true, true,false,false,0, 0,'VI'],
			['lock'  ,'objects'   ,'lockers','00'                  ,-1,B(3,2),B(0,4),  3, true,false,false,false,0, 0,'VI']			
			];
				
		// internal walls (mind the first floor distribution)
		fakeWalls = [{'ID':'fake','X':B(1,2),'Y':B(1,5),'Z': 0,'XM':B(1, 4),'YM':B(4,-1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(1,4),'Y':B(3,4),'Z': 0,'XM':B(3, 4),'YM':B(4,-1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(3,4),'Y':B(1,4),'Z': 0,'XM':B(4,-1),'YM':B(4,-1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(3,4),'Y':B(0,0),'Z': 0,'XM':B(1, 4),'YM':B(4,-1),'ZM':12*6  ,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(1,5),'Y':B(1,2),'Z':45,'XM':B(4,-1),'YM':B(1, 4),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false}];
		stuff['background'] = stuff['background'].concat(fakeWalls);
		
		// external walls (mind the door)
		fakeWalls = [{'ID':'fake','X':B( 0,0),'Y':B(LY,0),'Z':0,'XM':B(LX,1),'YM':B(LY,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(LX,0),'Y':B( 0,0),'Z':0,'XM':B(LX,1),'YM':B(LY,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B( 0,0),'Y':B( 0,0),'Z':0,'XM':B( 0,1),'YM':B(LY,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B( 1,0),'Y':B( 0,0),'Z':0,'XM':B(LX,1),'YM':B( 0,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false}];
		stuff['background'] = stuff['background'].concat(fakeWalls);
		
								
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','tiles','00',true,0,'BG');
		allstuff = allstuff.concat(floors);

        /*  objects['objects'][0]['signs'] += [
        {'file':'floor_'+str(k//5+1),'spin': 1,'ID':0,'order': -1.5,'solid':False,'BG':True,
         'xyz':[B(0,4),B(5,0),D(1+k+2,6)]}
            ]*/
			
		for (var z=0; z<6; ++z) {
			
			var Z = z*5;
			
			// level
			allstuff.push(['sign','objects','signs','floor_'+(z+1),1,B(0,4),B(5,-1),D(1+Z+2,6), true,false,false,false,0, 0,'BG'])
			
			// Walls
			var n = z==5 ? '_last' : '' ;
			walls    = walls.concat([
				['STAIRS0','structures','stairs','left_wall'+n , 1,B(0,0),B(5,0),D(1+Z,3), true,false,false,false,0, 0,'BG'],
				['STAIRS0','structures','stairs','right_wall'+n, 1,B(5,0),B(0,0),D(3+Z,9), true,false,false,false,0, 0,'BG']
			]);
			allstuff = allstuff.concat(walls);
			
			// Doors	
			doors = putDoor(B(0,0),B(0,0),D(Z,0),1,1,'hotel_corridor_'+z,'rooms','door','back','closed',0);
			allstuff = allstuff.concat(doors);		
			
			// Stairs
			for (var k=0;k<4;++k) {
				var step1 = k==0 && z==0 ? 'step_first' : 'step_front' ; 
				allstuff = allstuff.concat([
							['STAIRS0','structures','stairs', step1      , 1,B(0,0),B(1,4)+4*k,   3*k    +D(Z,0), true, true,false, true,0, 0,'VI'],
							['STAIRS0','structures','stairs','step_front',-1,B(1,4)+4*k,B(3,4),15+3*k    +D(Z,0), true, true,false, true,0, 0,'VI'],
							['STAIRS0','structures','stairs','step_back' , 1,B(3,4),B(1,4)+4*k,45-3*(k+2)+D(Z,0), true, true,false, true,0, 0,'VI'],
							['STAIRS0','structures','stairs','step_back' ,-1,B(1,4)+4*k,B(0,0),60-3*(k+2)+D(Z,0), true, true,false, true,0, 0,'VI']]);
										
			}
			
			// platforms
			squares = [
						['STAIRS0','structures','stairs','3halfsquarelines', 1,B(0,0),B(0,0),D(Z,60-6), true, true,false, true,0, 0,'VI'],
						['STAIRS0','structures','stairs','3halfsquare'     , 1,B(3,4),B(0,0),D(Z,45-6), z!=0, true,false, true,0, 0,'VI'],
						['STAIRS0','structures','stairs','3halfsquare'     ,-1,B(3,4),B(3,4),D(Z,30-6), z!=0, true,false, true,0, 0,'VI'],
						['STAIRS0','structures','stairs','3halfsquarelines', 1,B(0,0),B(3,4),D(Z,15-6), z!=0, true,false, true,0, 0,'VI'],
						];
			allstuff = allstuff.concat(squares);
			
			// railing
			var manubrio = z==0 ? 'manubrio_1stfloor' : 'manubrio' ;
			allstuff = allstuff.concat([
							['STAIRS0','structures','stairs', manubrio      , 1,B(1,3),B(1,3),D(Z  ,3), true,false,false,false,0, 0,'VI'],
							['STAIRS0','structures','stairs','manubrio_alto', 1,B(1,0),B(1,0),D(Z+5,3), true,false,false,false,0, 0,'VI']]);
					
		}
		// Doors	
		doors = putDoor(B(0,0),B(0,0),D(30,0),1,1,'hotel_top','rooms','door','back','closed',0);
		allstuff = allstuff.concat(doors);	
	}

	
	// SHIT ENDS HERE -----------------------------------------------------------------------------

	
	makeStuff(allstuff);
	putGuyAtRoom(entryPoint,entryPreDoor);
	completeStuff(LX,LY,I0,J0);	
	//sortMobile(false);
	makeText(alltext);
	makeActions(allactions);	
	console.log(actions)
	makeSpace();
}

function putGuyAtRoom(entryPoint,entryPreDoor) {
	
	// now we look for the door of entry (preRoom) and give the guy the right entry position and open that door
	// if he's not coming from a door, we use entryPoint (s tell us)
	var s = 0;
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
	
	console.log('entry:',guy['ID'],guy['X'],guy['Y'],guy['Z']);
}






	/*
	var entryIndex = allstuff.flatMap((it, i) => it[1] == 'doors' && it[0] == preRoom ? i : []);
		var entryDoor = allstuff.filter( (it, i) => entryIndex.includes(i) );
		var ed = entryDoor.find( it => it[12] == 'closed' );

	// Put guy in the stuff list
	allstuff.unshift(['guy','people',guy.folder,guy.file,1,guy.X,guy.Y,guy.Z,true,false,true,false,guy.state,-1,'VI']);
	*/