 
// SHIT HAPPENS HERE -----------------------------------------------------------------------------
function loadRoom(inroom) {
	
	// set values after action
	preRoom     = room;
	room        = inroom;
	firstEntry  = true;
	var g = stuff['front'][guyIndex];
	if (g) guy = {'folder':g.folder,'file':g.file,'X':g.X,'Y':g.Y,'Z':g.Z,'state':g.state}
	
	var alltext=[],allstuff=[],allactionsBG=[],allactionsXY=[];
	var floors=[],walls=[],doors=[],people=[],structures=[];
	var LX,LY,I0=0,J0=0;
	var entryPoint = {};
	RGBcover = 0;
	actions = {'background':[],'front':[]};
	stuff   = {'background':[],'front':[]};
    space = {'open':[],'solid':[]};
	listText = [];
	
	if (room=='cover') {  //------------------------------------------------------------- COVER		
		
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
			
		allactionsBG = allactionsBG.concat([['menu','menuCover()']]);
	
		
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
		entryPoint['void']={'X':B(2,2),'Y':B(3,1),'Z':0,'subfile':'m0_01N'};
		
		// just as example: get the position defined by the point of entrance
		var ep = entryPoint[preRoom in entryPoint ? preRoom : 'void'];
		guy.X = ep.X; guy.Y = ep.Y; guy.Z = ep.Z; guy.file = ep.subfile;
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		
		// Walls	
		allstuff = allstuff.concat(putWallAround([[2],[2],[1],[1]],'wall','room',false,LX,LY,0));
		
		// Doors	
		doors = putDoor(B(2,0) ,B(LY,0),0, 1,1,'hotel_room','elevatorhotel','elevator','front','open',1);
		allstuff = allstuff.concat(doors);                                               
		doors = putDoor(B(LX,0),B(2,0) ,0,-1,1,'matrix','elevatorhotel','elevator','front','open',1);
		allstuff = allstuff.concat(doors);                                               
		doors = putDoor(B(1,0) ,B(0,0) ,0, 1,1,'matrix','elevatorhotel','elevator','back','open',3);
		allstuff = allstuff.concat(doors);
		doors = putDoor(B(0,0) ,B(1,0) ,0,-1,1,'matrix','elevatorhotel','elevator','back','open',3);
		allstuff = allstuff.concat(doors);
		
	} else if (room=='2matrix') {  //------------------------------------------------- ROOM
	
		LX = 5, LY = 5;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint['void']={'X':B(2,2),'Y':B(3,1),'Z':0,'subfile':'m0_01N'};
		
		// just as example: get the position defined by the point of entrance
		var ep = entryPoint[preRoom in entryPoint ? preRoom : 'void'];
		guy.X = ep.X; guy.Y = ep.Y; guy.Z = ep.Z; guy.file = ep.subfile;
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		
		// Walls	
		allstuff = allstuff.concat(putWallAround([[2,3],[2,3],[1,2],[1,2]],'wall','room',false,LX,LY,0));
		
		// Doors	
		doors = putDoor(B(2,0) ,B(LY,0),0, 1,2,'hotel_room','maindoorhotel','automatic','front','open',1);
		allstuff = allstuff.concat(doors);                                               
		//doors = putDoor(B(LX,0),B(2,0) ,0,-1,2,'elevators','maindoorhotel','automatic','front','open',1);
		//allstuff = allstuff.concat(doors);                                               
		doors = putDoor(B(1,0) ,B(0,0) ,0, 1,2,'matrix','maindoorhotel','automatic','back','open',3);
		allstuff = allstuff.concat(doors);
		//doors = putDoor(B(0,0) ,B(1,0) ,0,-1,2,'2matrix','maindoorhotel','automatic','back','open',3);
		//allstuff = allstuff.concat(doors);
		
	} else if (room=='matrix') {  //------------------------------------------------- ROOM
	
		LX = 5, LY = 5;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint['void']={'X':B(2,2),'Y':B(3,1),'Z':0,'subfile':'m0_01N'};
		
		// just as example: get the position defined by the point of entrance
		var ep = entryPoint[preRoom in entryPoint ? preRoom : 'void'];
		guy.X = ep.X; guy.Y = ep.Y; guy.Z = ep.Z; guy.file = ep.subfile;
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		
		// Walls	
		allstuff = allstuff.concat(putWallAround([[2],[2],[1],[1]],'wall','room',false,LX,LY,0));
		
		// Doors	
		doors = putDoor(B(2,0) ,B(LY,0),0, 1,1,'hotel_room','rooms','door','front','open',1);
		allstuff = allstuff.concat(doors);                                               
		doors = putDoor(B(LX,0),B(2,0) ,0,-1,1,'elevators','rooms','door','front','open',1);
		allstuff = allstuff.concat(doors);                                               
		doors = putDoor(B(1,0) ,B(0,0) ,0, 1,1,'matrix','rooms','door','back','open',3);
		allstuff = allstuff.concat(doors);
		doors = putDoor(B(0,0) ,B(1,0) ,0,-1,1,'2matrix','rooms','door','back','open',3);
		allstuff = allstuff.concat(doors);
		
	} else if (room=='box') {  //------------------------------------------------- ROOM
	
		LX = 5, LY = 5;
		I0 = 0,J0 = 4;		
			
		RGBcover = 'RGB_cover';
		entryPoint['void']={'X':B(2,2),'Y':B(3,1),'Z':0,'subfile':'m0_01N'};
		
		// just as example: get the position defined by the point of entrance
		var ep = entryPoint[preRoom in entryPoint ? preRoom : 'void'];
		guy.X = ep.X; guy.Y = ep.Y; guy.Z = ep.Z; guy.file = ep.subfile;
		
		allstuff = [
			['box'  ,'objects'   ,'tables'     ,'111'    ,-1,B(2,0),B(2,0),     0,true, true,false,false,   0, 2,'VI']
			];
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);		
		
	} else if (room=='hotel_room') {  //------------------------------------------------- ROOM
	
		menuIndex   = 0;
		objectIndex = 0;
		objects     = ['mano','gun','maletin','roomkey']
		
		LX = 5, LY = 5;
		
		entryPoint['cover']={'X':B(2,3),'Y':B(0,1),'Z':0,'subfile':'00_01N'};
		
		// just as example: get the position defined by the point of entrance
		var ep = entryPoint[preRoom in entryPoint ? preRoom : 'cover'];
		guy.X = ep.X; guy.Y = ep.Y; guy.Z = ep.Z; guy.file = ep.subfile // guy.file.slice(0,-3)+ep.subfile;
		
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
	
	}
	
	// Put guy in the stuff list
	allstuff.unshift(['guy','people',guy.folder,guy.file,1,guy.X,guy.Y,guy.Z,true,false,true,false,guy.state,-1,'VI']);
	
	makeStuff(allstuff);
	completeStuff(LX,LY,I0,J0);	
	sortMobile();
	makeText(alltext);
	makeActions(allactionsBG,allactionsXY);	
	console.log(actions)
	makeSpace();
}
