



// SHIT HAPPENS HERE -----------------------------------------------------------------------------
function loadRoom(inroom) {
	console.log('ROOM > ',inroom, 'CHAPTER:',chapter);
	
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
			
		RGBcover = 'RGB_cover';
		entryPoint['X']    = B(2,2);
		entryPoint['Y']    = B(3,1);
		entryPoint['Z']    = 3;
		entryPoint['file'] = '00_01N';
		
		objects = ['mano','gun'];
		
		alltext = [
			[' Created by Backward Games ',LI/2,100-4,'text_normal',true,true,false],
			['Reversed',LI/2,110,'gothic',true,false,false],
			['Start||Help||Quit',250,62,'text_normal',false,false,false]];
			
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
		entryPoint['X']    = 22;
		entryPoint['Y']    = 24;
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
				
		allstuff = [
			['box','objects','tables','211', 1,B(2,0),B(2,0),D(0,0),true,true,false,false,0,0,'VI'],
			['box','objects','tables','211',-1,B(3,2),B(2,4),D(1,0),true,true,false,false,0,0,'VI'],
			['box','objects','tables','112', 1,B(2,-2),B(3,1),D(0,0),true,true,false,false,0,0,'VI']
			];   

		// doors
		doors = putDoor(B(1,0),B(0,0) ,0,1,1,'matrix','rooms','door','back','closed',1);
		allstuff = allstuff.concat(doors);
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','elevator','00',true,0,'BG');
		allstuff = allstuff.concat(floors);	
		
	} else if (room=='dabox') {  //------------------------------------------------- DABOX
	
		LX = 12, LY = 13;	
			
		RGBcover = 'RGB_cover';
		entryPoint = {'X':B(1,0),'Y':B(1,0),'Z':0,'file':'m0_01N'};
		entryPoint['X']    = B(1,0);
		entryPoint['Y']    = B(1,0);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
			
		/*
		allstuff = [
			['box'  ,'objects'   ,'tables'     ,'111'    ,-1,B(2,0),B(2,0),D(0,0),true,true,false,false,   0, 2,'VI'],
			//['box'  ,'structures'   ,'stairs','locker',1,B(2,0),B(2,0),D(0,0),true,true,false,false,   0, 2,'VI']
			];*/
						
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','tiles','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
		

		/*		
				// Floors
				floors   = putSquareFloor(0,LX,0,LY,0,'floor','tiles','00',true,0,'BG');
				allstuff = allstuff.concat(floors);
			
			// 0th floor images
				allstuff = allstuff.concat([
					['STAIRS0','structures','stairs','3halfsquare2halfhigh', 1,B(0,0),B(3,4),  0, true,true,false,false,0, 0,'VI'],
					['STAIRS0','structures','stairs','stairs0leftwallA'    , 1,B(1,4),B(3,4),  0, true,true,false,false,0, 0,'VI'],
					['STAIRS0','structures','stairs','stairs0leftwallB'    , 1,B(2,4),B(3,4),  0, true,true,false,false,0, 0,'VI'],	
					['STAIRS0','structures','stairs','stairs0rightwallA'   ,-1,B(3,4),B(1,4),  0, true,true,false,false,0, 0,'VI'],			
					['STAIRS0','structures','stairs','stairs0rightwallB'   ,-1,B(3,4),B(2,4),  0, true,true,false,false,0, 0,'VI'],			
					['STAIRS0','structures','stairs','3halfsquareveryhigh' ,-1,B(3,4),B(0,0),  0, true,true,false,false,0, 0,'VI'],			
					['STAIRS0','structures','stairs','thingsonthewall'      ,-1,B(3,4),B(0,1), 7, true,true,false,false,0, 0,'VI']			
				]);		

		*/
	} else if (room=='elevator') {  //--------------------------------------------------------------- ELEVATOR ------------------------------
	
		LX = 2, LY = 2;	
			
		entryPoint = {'X':B(0,2),'Y':B(0,6),'Z':0,'file':guy.file};
		entryPoint['X']    = B(0,2);
		entryPoint['Y']    = B(0,6);
		entryPoint['Z']    = 0;
		entryPoint['must'] = true;

		
		var levelIn  = preRoom.slice(-1);
		var levelOut = levelIn == 0 ? (chapter<5? 5 : 1) : 0 ; // the elevator goes to first floor after talking with ggirl
		
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
		
		if (chapter==6) {
			entryPoint['X']    = B(1,3);
			entryPoint['Y']    = B(0,6);
			allstuff.push(['bellboy','people','bellboy','00_00N',1,B(0,5),B(0,6),0,true,false,false,false,0, 0,'VI'])
		}
		
	} else if (room=='other_hotel_room_1') {  //------------------------------------------------- ROOM 2nd floor
			
		LX = 5, LY = 5;
		
		entryPoint['X']    = B(2,3);
		entryPoint['Y']    = B(0,1);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
		
		if (!(room in memory)) {	
			memory[room] = {'lamp':'off','phone':false,'istalking':false}
		}
		var lp = memory[room]['lamp'];
		
		// turn the lamp
		allactions = allactions.concat([['godown','gotolobby',[],B(0,0),B(0,0),0,B(5,0),B(2,4)],
										['turnthelamp','turnItOnOff',['lamp','guy',true],B(0,0),B(3,6),0,B(1,3),B(5,0)],
										['thephone','roo1stfloorphone',[],B(4,-1),B(4,-1),0,B(5,0),B(5,0)] 
										]);
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		allstuff = [
			['sofa' ,'objects'   ,'sofas'      ,'111'    , 1,B(1,3),B(0,1),     0,true, true,false,false,   0, 0,'VI'],
			['box'  ,'objects'   ,'tables'     ,'111'    ,-1,B(0,0),B(0,3),     0,true, true,false,false,   0, 0,'VI'],
			['table','objects'   ,'tables'     ,'05051'  ,-1,B(4,4),B(1,5),     0,true, true,false,false,   0, 0,'VI'],
			['table','objects'   ,'tables'     ,'05051'  ,-1,B(4,4),B(4,2),     0,true, true,false,false,   0, 0,'BG'],
			['phone','objects'   ,'phones'     ,'phone'  , 1,B(4,5),B(4,2),D(1,0),true,false,false,false,   0, 0,'BG'],
			['bed'  ,'objects'   ,'beds'       ,'bed'    , 1,B(3,1),B(2,2),     0,true, true,false,false,   0, 0,'VI'],
			['lamp' ,'objects'   ,'lamps'      ,'lamp'+lp,-1,B(0,2),B(4,2),     0,true, true,false,false,lp, 0,'VI'],
			['lock' ,'objects'   ,'lockers'    ,'00'     ,-1,B(5,-1),B(0,6),D(0,6),true,false,false,false,   0, 0,'BG'],
			['bellboy','people'  ,'bellboy'    ,'00_01N' , 1,B(2,2),B(5,-1),     0,false,false,false,false,0, 0,'VI']
			];
		
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','hotelfloor','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		allstuff = allstuff.concat(putWallAround([[2],[],[],[]],'wall','room',true,LX,LY,0,0));
		
		// Doors	
		doors = putDoor(B(2,0),B(LY,0),0,1,1,'hotel_corridor_1','rooms','door','front','closed',4);
		allstuff = allstuff.concat(doors);	
		
		for (var k=0;k<allstuff.length;++k) {
			allstuff[k][14] = 'VI';
		}
	
	} else if (room=='hotel_room_5') {  //------------------------------------------------- ROOM
	
		menuIndex   = 0;
		objectIndex = 0;
		objects     = ['mano','gun']
		
		LX = 5, LY = 5;
		
		entryPoint['X']    = B(0,0);
		entryPoint['Y']    = B(3,3);
		entryPoint['Z']    = 0;
		entryPoint['file'] = '00_01N';
		
		// take the case
		allactions = allactions.concat([['case'   ,'takethecase',[B(1,0),B(2,2)],B(1,0),B(2,0),0,B(1+1,6),B(3+1,0)],
										['startit','walkout',[]]
										]);
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		// put maletin if the guy doesn't have it already
		var cased = !objects.includes('maletin');
		allstuff = [
			['table' ,'objects'   ,'tables'     ,'05051'  ,-1,B(4,4),B(4,2),     0, true, true,false,false,   0, 0,'VI'],
			['phone' ,'objects'   ,'phones'     ,'phone'  , 1,B(4,5),B(4,2),D(1,0), true,false,false,false,   0, 0,'VI'],
			['bed'   ,'objects'   ,'beds'       ,'bed'    , 1,B(3,1),B(2,2),     0, true, true,false,false,   0, 0,'VI'],
			['lamp'  ,'objects'   ,'lamps'      ,'lampon' , 1,B(4,2),B(1,1),     0, true, true,false,false,'on', 0,'VI'],
			['lock'  ,'objects'   ,'lockers'    ,'00'     ,-1,B(4,6),B(0,4),D(0,6), true,false,false,false,   0, 0,'VI'],
			['case'  ,'objects'   ,'case'       ,'maletin', 1,B(1,0),B(2,2),     0,cased,false,false,false,   0, 0,'VI'],
			['win'   ,'structures','hotelwindow','window' ,-1,B(0,-1),B(2,-1),   0, true,false,false,false,   0, 0,'VI'],
			['brillo','structures','hotelwindow','brillo' ,-1,B(2,0),B(2,-1),   0, true,false,false,false,   0, 0,'VI'],
			['dealer','people'    ,'drug_dealer','g0_00N' , 1,B(3,3),B(0,1) ,    0, true, true,false,false,   0, 0,'VI'],
			['girl'  ,'people' ,'kidnapped_girl','0_01N'  , 1,B(3,2),B(4,2) ,    0, true, true,false,false,   0, 0,'VI']
			];
		
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','hotelfloor','00',true,0,'VI');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		allstuff = allstuff.concat(putWallAround([[],[],[],[1]],'wall','room',true,LX,LY,0,0));
		
		// Doors	
		doors = putDoor(B(1,0),B(0,0),0,1,1,'hotel_corridor_5','rooms','door','back','closed',0);
		allstuff = allstuff.concat(doors);	
		
		for (var k=0;k<allstuff.length;++k) {
			allstuff[k][14] = 'VI';
		}
	
	} else if (room=='other_hotel_room_5') {  //------------------------------------------------- OTHER ROOM
	
		if (!(room in memory)) {	
			if (chapter<=1) { 
				memory[room] = {'tv':'whitenoised','lamp':'broken','ddude':true}
			} else { 
				memory[room] = {'tv':'itsOn'      ,'lamp':'on'    ,'ddude':false}
			}
		}
		var tv  = memory[room]['tv'],
		    lst = memory[room]['lamp'],
			dd  = memory[room]['ddude'];
		
		LX = 5, LY = 5;
		
		entryPoint['X']    = B(1,2);
		entryPoint['Y']    = B(0,1);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
		
		// take the case
		allactions = allactions.concat([['killhim','killthegangsterdude',[]],
										['turnthelamp','turnItOnOff',['lamp','guy',lst!='broken'    ],B(3,7),B(0,0),0,B(5,0),B(1,3)],
										['turnthetv'  ,'turnItOnOff',['tv'  ,'guy',tv!='whitenoised'],B(0,5),B(3,6),0,B(2,0),B(5,0)]
										]);
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
			
		
		var l   = tv=='broken'? 0 : 1;
		    lfl = lst=='broken'? 'lampshoot' : (lst=='on'? 'lampon' : 'lampoff');
			
		allstuff = [
			['tv'   ,'objects','computers'    ,'tv'    ,-1,B(0,7),B(4,1),D(1,0), true,false,false,false,tv , 0,'VI'],
			['box'  ,'objects','tables'       ,'111'   ,-1,B(0,7),B(4,0),     0, true, true,false,false,0  , 0,'VI'],
			['table','objects','tables'       ,'05051' ,-1,B(4,4),B(1,4),     0, true, true,false,false,0  , 0,'VI'],
			['lock' ,'objects','lockers'      ,'00'    ,-1,B(4,6),B(4,0),D(0,6), true,false,false,false,0  , 0,'VI'],
			['phone','objects','phones'       ,'phone' , 1,B(4,4),B(1,4),D(1,0), true,false,false,false,0  , 0,'VI'],
			['bed'  ,'objects','beds'         ,'bed'   , 1,B(3,1),B(2,2),     0, true, true,false,false,0  , 0,'VI'],
			['lamp' ,'objects','lamps'        ,lfl     , 1,B(4,3-l),B(0,1+l), 0, true, true, true,false,lst, 0,'VI'],
			['ddude','people' ,'gangster_dude','d0_00N',-1,B(1,0),B(2,6),     0,   dd,   dd,false,false,0  , 0,'VI'],
			['dude' ,'people' ,'gangster_dude','g0_01N', 1,B(1,6),B(3,3),     0,false,false, true,false,0  , 0,'VI']
			];
		
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','hotelfloor','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		allstuff = allstuff.concat(putWallAround([[2],[],[],[]],'wall','room',true,LX,LY,0,0));
		
		// Doors	
		doors = putDoor(B(2,0),B(LY,0),0,1,1,'hotel_corridor_5','rooms','door','front','open_always',10,2);
		allstuff = allstuff.concat(doors);	
		
		for (var k=0;k<allstuff.length;++k) {
			allstuff[k][14] = 'VI';
		}
		
	} else if (room.slice(0,-2)=='toilet') {  //------------------------------------------------- TOILET
		
		var level = room.slice(-1) ;
		
		LX = 3, LY = 3;
		
		entryPoint['X']    = B(0,2);
		entryPoint['Y']    = B(1,2);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		allstuff = [
			['wc'    ,'objects','toilet','WC'    , 1,B(2, 2),B(0,4),     0, true, true,false,false,0,0,'VI'],
			['mirrow','objects','toilet','mirrow',-1,B(3,-1),B(1,6),D(2,0), true,false,false,false,0,0,'VI'],
			['grifo' ,'objects','toilet','grifo' , 1,B(2, 2),B(1,6),     0, true, true,false,false,0,0,'VI'],
			['grifo' ,'objects','toilet','towel' , 1,B(2,-1),B(3,0),D(0,6), true,false,false,false,0,0,'VI']
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
		console.log(room in memory)
		if ( !(room in memory) ) {
			
			var name1 = ('other_hotel_room_'+level), name2 = ('toilet_'+level)
			memory[room] = {'dude':[0,0,false],'ggirl':[0,0,false],name1:'closed',name2:'closed','istalking':false};
			
			if ( level==5 ) {	
		
				memory[room] = {'dude':[0,0,false],'ggirl':[0,0,false],'toilet_5':'open_always','hotel_room_5':'closed_always','other_hotel_room_5':'open_always'};
			
				if (chapter==2) { 
					memory[room]['dude'] = [B(4,4) ,B(5,2),true];
				} else if (chapter>=4) { 
					memory[room]['ggirl'] = [B(7,-2),B(3,2),true];
					memory[room]['dude'] = [B(7,-2),B(3,2),true];
					memory[room]['toilet_5'] = 'closed_always';
				}
			
			} 
			
		} else {
			
			if ('time' in memory[room]) {
				var tt = new Date()
				var tim = (tt-memory[room]['time'])/1000;
				if (tim>10){
					if (chapter>=5) memory[room]['ggirl'] = [B(5,-2),B(6,-2),true];
					memory[room]['dude'] = [B(7,-2),B(3,2),true];
					memory[room]['toilet_5'] = 'closed_always';					
				}
			} else {
				if (chapter>=4 && level==5) {
					if (chapter>=5) memory[room]['ggirl'] = [B(5,-2),B(6,-2),true];
					memory[room]['dude'] = [B(7,-2),B(3,2),true];
					memory[room]['toilet_5'] = 'closed_always';						
				}
			}
			memory[room]["istalking"]=false;
			
		}
		console.log(memory[room])
	
		var dudepos = memory[room]['dude'];
		var ggpos   = memory[room]['ggirl'];
		var tst = memory[room]['toilet_'+level];	
		var rst = memory[room]['other_hotel_room_'+level];
			
	
		LX = 8, LY = 7;
		
		entryPoint['X']    = B(5,2);
		entryPoint['Y']    = B(5,2);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
		
		// sliders at the corridor corner
		allactions = allactions.concat([['sliderA' ,'sliders',['dwx','upy'],B(6,1),B(5,0),0,B(6,2),B(5,1)],
										['sliderB' ,'sliders',['dwy','upx'],B(6,0),B(5,1),0,B(6,1),B(5,2)]]);
		if (level==5) {
			allactions = allactions.concat([['dudetoilet','dudegototoilet',[]],
											['dude','dudegoout',[chapter>=4||tim>10]]]);
		}
		
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		allstuff = [
			['tv'   ,'objects','signs'        ,'roomnumber', 1,B(1,2),B(6,7),D(3,1), true,false,false,false,0, 6,'BG'],
			['box'  ,'objects','signs'        ,'exit'      , 1,B(6,2),B(6,7),D(3,2), true,false,false,false,0, 5,'BG'],
			['box'  ,'objects','signs'        ,'toilet'    ,-1,B(7,7),B(5,1),D(3,2), true,false,false,false,0, 4,'BG'],
			['dude' ,'people' ,'gangster_dude','00_00N'    , 1,dudepos[0],dudepos[1],0,dudepos[2],false,true,false,0, 0,'VI'],
			['ggirl','people' ,'gangster_girl','0l_00N'    ,-1,ggpos[0]  ,ggpos[1]  ,0,ggpos[2]  ,false,true,false,0, 0,'VI']
			];
			
		if (chapter==6&&level==1){
			allstuff.push(['bellboy','people','bellboy','00_01N',1,B(2,2),B(4,4),0,true,false,false,false,0, 0,'VI']);
		}
		
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
		var tst = chapter<=2 && level==5 ? 'open_always' : (level==5?'closed_always':'closed');	
		var rst = level==5?'open_always':(level==1?'closed':'closed_always');		
		doors = putDoor(B( 1,0),B(LY,0),0, 1,1,'hotel_room_'+level,'rooms'        ,'door'    ,'front','closed_always',1).concat(
				putDoor(B( 6,0),B(LY,0),0, 1,1,'stairs_'+level    ,'rooms'        ,'door'    ,'front','closed',1)).concat(
				putDoor(B(LX,0),B( 5,0),0,-1,1,'toilet_'+level    ,'rooms'        ,'door'    ,'front',tst     ,1)).concat(
				putDoor(B(LX,0),B( 1,0),0,-1,1,'elevator'         ,'elevatorhotel','elevator','front','closed',1)).concat(
				putDoor(B( 2,0),B( 5,0),0, 1,1,'other_hotel_room_'+level,'rooms','door','back',rst,1));
		allstuff = allstuff.concat(doors);	
		

	} else if (room == 'hotel_corridor_0') {  //----------------------------------------------------------------- LOBBY
	
	
		var ch2 = chapter<=2;
		if ( !(room in memory) || firstEntry ) {
			memory[room] = {'bellboy':chapter==6?'entered':'enter','istalking':chapter==6};
		}	
		
		LX = 8, LY = 7;
		J0 = 5;
		
		entryPoint['X']    = B(6,2);
		entryPoint['Y']    = B(5,4);
		entryPoint['Z']    = 0;
		entryPoint['file'] = 'm0_01N';
		
		if (!ch2) {
			allactions = allactions.concat([  ['hefollows','follows',['bellboy','guy']],
													['belly','bellboytalks'     ,[],B(3,0),B(4,-1),0,B(4,5),B(5,3)],
													['recep','recepcionisttalks',[],B(1,2),B(4,2),0,B(2,2),B(5,0)],
													['stop1','nowayStaff',[!ch2&&chapter<7],B(4,2),B(5,2),0,B(5,0),B(7,0)],
													['stop2','nowayGuest',[chapter>=6],B(4,2),B(0,0),0,B(5,0),B(7,0)]
												]);
		} else {
			allactions = allactions.concat([  ['thephone','lobbyphone',[],B(2,0),B(4,-1),0,B(4,0),B(7,0)] ]);
		}
		
				
		//{'ID', 'type':,'folder','file','spin', 'X','Y','Z', 'visible','solid','mobile','walkable', 'state','order','BG'}
		
		var fp = ch2 ? 'phoneoff': 'phone' ;
		var bell = chapter==6 ? [B(7,0),B(1,2)] : [B(3,4),B(4,3)] ;
		allstuff = [
			['sofa' ,'objects','sofas'    ,'111'     , 1,B(5,0),B(0,2),     0, true, true,false,false,0, 0,'VI'],
			['sofa' ,'objects','sofas'    ,'111'     ,-1,B(3,4),B(1,6),     0, true, true,false,false,0, 0,'VI'],
			['table','objects','tables'   ,'1105'    , 1,B(4,-2),B(0,2),     0, true, true,false,false,0, 0,'VI'],
			['plan' ,'objects','plants'   ,'05051'   , 1,B(7,2),B(2,2),     0, true, true,false,false,0, 0,'VI'],
			['cola' ,'objects','machines' ,'cola'    , 1,B(7,0),B(3,0),     0, true, true,false,false,0, 0,'VI'],
			['desk' ,'objects','hoteldesk','desk'    , 1,B(0,0),B(5,0),     0, true, true,false,false,0, 0,'VI'],
			['box'  ,'objects','signs'    ,'stairs'  , 1,B(6,2),B(6,7),D(3,2), true,false,false,false,0, 5,'BG'],
			['box'  ,'objects','signs'    ,'toilet'  ,-1,B(7,7),B(5,1),D(3,2), true,false,false,false,0, 4,'BG'],
			['phone','objects','phones'   ,fp        , 1,B(2,4),B(5,0),D(1,0), true, true,false,false,0, 0,'VI'],
			['keys' ,'objects','keyshell' ,'keyshell', 1,B(2,4),B(6,4),     0, true, true,false,false,0, 0,'VI'],
			['bellboy'      ,'people','bellboy'      ,'00_01N', 1,bell[0],bell[1],0,!ch2,!ch2,false,false,0, 0,'VI'],
			['recepcionist' ,'people','recepcionist' ,'00_01N', 1,B(1,2),B(6,1),0,!ch2,!ch2,false,false,0, 0,'VI']
			];
		
		// Floors
		floors   = putSquareFloor(0,LX,0,LY,0,'floor','hotelfloor','00',true,0,'BG');
		allstuff = allstuff.concat(floors);
			
		// Walls	
		allstuff = allstuff.concat(putWallAround([[1,6],[1,5],[],[1,2]],'wall','room',true,LX,LY,0,0));
		
		// Doors	
		var strt = ch2?'_always':'';
		doors = putDoor(B( 1,0),B(LY,0),0, 1,1,'dabox'         ,'rooms'        ,'door'     ,'front','closed'       ,0,1).concat(
		        putDoor(B( 6,0),B(LY,0),0, 1,1,'stairs_0'      ,'rooms'        ,'door'     ,'front','closed'       ,0,1)).concat(
				putDoor(B(LX,0),B( 5,0),0,-1,1,'toilet_0'      ,'rooms'        ,'door'     ,'front','closed'       ,0,1)).concat(
				putDoor(B(LX,0),B( 1,0),0,-1,1,'elevator'      ,'elevatorhotel','elevator' ,'front','closed'       ,0,1)).concat(
				putDoor(B( 1,0),B( 0,0),0, 1,2,'hotel_street_0','maindoorhotel','automatic','back' ,'closed'+strt  ,0,1));
		allstuff = allstuff.concat(doors);			
		
	} else if (room.slice(0,-2)=='stairs') {  //------------------------------------------------- STAIRS
		
		var level       = room.slice(-1);
		var screenLevel = Math.floor(level/2)*2;
		console.log(level,screenLevel)
		
		LX = 5, LY = 5;
		J0 = 10 - 60*screenLevel + 5*level;
		
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

		allactions = allactions.concat([
										['from012to234','changeroom', [screenLevel == 0 ? 'stairs_2' : 'stairs_0'] ,
											B(2,4),B(3,4),60  +30-3+(screenLevel == 0 ? 0 : -3),B(3,0),B(5,0)],
										['from234to456','changeroom', [screenLevel == 2 ? 'stairs_4' : 'stairs_2'] ,
											B(2,4),B(3,4),60*3+30-3+(screenLevel == 2 ? 0 : -3),B(3,0),B(5,0)],
										['from456to6'  ,'changeroom', [screenLevel == 4 ? 'stairs_6' : 'stairs_4'] ,
											B(2,4),B(3,4),60*5+30-3+(screenLevel == 4 ? 0 : -3),B(3,0),B(5,0)]
									   ]);

		if (chapter==4 && subt<=131) {
			// gangster girl
			allactions = allactions.concat([['ggirlrun','ggirlrun', []]]);		
			allstuff.push(['ggirl','people','gangster_girl','00_10N',1,B(0,2),B(0,4),D(30,0),true,false,false,false,0,0,'VI']);
		}									   

		
		// internal walls (mind the first floor distribution) // rehacer esta parte por el filtro de pantalla
		fakeWalls = [{'ID':'fake','X':B(1,2),'Y':B(1,4),'Z': 0,'XM':B(1, 4),'YM':B(4,-1),'ZM':12*6*7,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(1,4),'Y':B(3,4),'Z': 0,'XM':B(3, 4),'YM':B(4,-1),'ZM':12*6*7,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(3,4),'Y':B(1,4),'Z': 0,'XM':B(4,-1),'YM':B(4,-1),'ZM':12*6*7,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(3,4),'Y':B(0,0),'Z': 0,'XM':B(3, 4),'YM':B(4,-1),'ZM':12*3  ,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(1,2),'Y':B(1,2),'Z':45,'XM':B(4,-1),'YM':B(1, 4),'ZM':12*6*7,'visible':false,'solid':true,'walkable':false}];
		stuff['background'] = stuff['background'].concat(fakeWalls);
		
		// external walls (mind the door)
		fakeWalls = [{'ID':'fake','X':B( 0,0),'Y':B(LY,0),'Z':0,'XM':B(LX,1),'YM':B(LY,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B(LX,0),'Y':B( 0,0),'Z':0,'XM':B(LX,1),'YM':B(LY,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B( 0,0),'Y':B( 0,0),'Z':0,'XM':B( 0,1),'YM':B(LY,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false},
					 {'ID':'fake','X':B( 1,0),'Y':B( 0,0),'Z':0,'XM':B(LX,1),'YM':B( 0,1),'ZM':12*6*6,'visible':false,'solid':true,'walkable':false}];
		stuff['background'] = stuff['background'].concat(fakeWalls);

		var zmin = 0,
		    zmax = 6;
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
					['STAIRS0','structures','stairs','stairs0rightwallA'   ,-1,B(3,4),B(1,4),  0, true,false,false,false,0, 0,'VI'],			
					['STAIRS0','structures','stairs','stairs0rightwallB'   ,-1,B(3,4),B(2,4),  0, true,false,false,false,0, 0,'VI'],			
					['STAIRS0','structures','stairs','3halfsquareveryhigh' ,-1,B(3,4),B(0,0),  0, true,false,false,false,0, 0,'VI'],			
					['STAIRS0','structures','stairs','thingsonthewall'      ,-1,B(3,4),B(0,1), 7, true,false,false,false,0, 0,'VI']			
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
			if (z==5) doors = doors.concat(putDoor(B(0,0),B(0,0),D(30,0),1,1,'hotel_street_6','street','door','back','closed',0));
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
	
	} else if (room.slice(0,-2)=='hotel_street') {  //------------------------------------------------- HOTEL STREET
		
		var level = room.slice(-1);
		
		if (level==0) {
			I0 = 160,J0 = -60;
		} else if (level==6) {
			I0 = 210, J0 = -500;
		} else if (level==1) {
			I0 = 350,J0 = -140;
		} else if (level==2) {
			I0 = -50,J0 = -145
		} else if (level==3) {
			I0 = -150,J0 = -240;
		} else {
			I0 = 400, J0 = -1;
		}
		
		// For teleporters: if guy arrives from the same room, use his XYZ as it is
		if (preRoom.slice(0,-2)!='hotel_street') {
			entryPoint['X']    = B( 6,6);
			entryPoint['Y']    = B( 7,2);
			entryPoint['Z']    = 3;
			entryPoint['file'] = 'm0_01N';
		} else {
			entryPoint['X']    = guy.X;
			entryPoint['Y']    = guy.Y;
			entryPoint['Z']    = guy.Z;	
			entryPoint['must'] = true;	
		}		
		
		var delta  = (level==0?0:5);
		var delta1 = (level==2?0:5);
		allactions = allactions.concat([
										['from0to1_3','changeroom', [level == 0 ? 'hotel_street_1' : 'hotel_street_0'] ,
											B(4,0),B(13,4)-delta,3,B(6,0),B(13,5)-delta] ,
										['from0to1_0','changeroom', [level == 0 ? 'hotel_street_1' : 'hotel_street_0'] ,
											B(3,0),B(13,4)-delta,0,B(4,0),B(13,5)-delta] ,
											
										['from0to2_3','changeroom', [level == 0 ? 'hotel_street_2' : 'hotel_street_0'] ,
											B(15,0)-delta,B(8,0),3,B(15,1)-delta,B(10,0)],
										['from0to2_0','changeroom', [level == 0 ? 'hotel_street_2' : 'hotel_street_0'] ,
											B(15,0)-delta,B(4,0),0,B(15,1)-delta,B(8,0)],
											
										['from2to3_3','changeroom', [level == 2 ? 'hotel_street_3' : 'hotel_street_2'] ,
											B(26,0)-delta1,B(5,0),3,B(26,1)-delta1,B(11,0)],
										['from2to3_0','changeroom', [level == 2 ? 'hotel_street_3' : 'hotel_street_2'] ,
											B(26,0)-delta1,B(4,0),0,B(26,1)-delta1,B(5,0)]
									   ]);
									   
		
		// Ground base
		var ground = tiles['panel']['blueprints']['RGB_hotelground'];
		floors = createRoadSquaresFloorFromRGB(ground,0,-5,-5);
		
		// Fake Walls	
		walls = walls.concat(putWallLine([],'x',3.5,34, 4.25,0,'wall','room',false,true,0,0,0));
		walls = walls.concat(putWallLine([],'y',4.5,25, 3.25,0,'wall','room',false,true,0,0,0));
		walls = walls.concat(putWallLine([],'x',3.5, 5,25,0,'wall','room',false,true,0,0,0));
		walls = walls.concat(putWallLine([],'y',4.5, 6,33,0,'wall','room',false,true,0,0,0));		
								
		// Main Doors	
		doors = putDoor(B(7,4) ,B(10,0),3, 1,2,'hotel_corridor_0','maindoorhotel','automatic','front','closed',1);
		
		allstuff = allstuff.concat([
						['cars','structures','vehicles','truck_back', 1,B( 7,0),B(26,4),0,true,false,false,false,0,0,'BG'],
						['cars','structures','vehicles','taxi'      , 1,B(13,0),B( 6,-2),0,true, true,false,false,0,0,'VI'],
						['cars','structures','vehicles','taxi'      , 1,B(20,0),B( 6,-4),0,true, true,false,false,0,0,'VI'],
						['cars','structures','vehicles','heisenberg',-1,B(24,0),B(11,4),0,true,false,false,false,0,0,'BG'],
						['cars','structures','vehicles','normal'    ,-1,B(20,6),B(11,7),0,true,false,false,false,0,0,'BG'],
						['cars','structures','vehicles','limo'      , 1,B( 6,0),B(2,3),0,true,true,false,false,0,0,'VI'],
		]);
		
		// Road lines
		for (var x=0; x<36; x+=3) floors.push(['lines','floors','road','line', 1,B( x,0),B(2,-3),0,true,false,false,false,0,0,'BG']);
		for (x=0; x<13; x+=1) floors.push(['lines','floors','road','line', 1,B(12+x,0),B(5,0),0,true,false,false,false,0,0,'BG']);
		for (x=0; x<6; x+=1) {
			for (var y=0; y<4; y+=1) floors.push(['lines','floors','road','white', 1,B(3-x,0),B(5+y,4),0,true,false,false,false,0,0,'BG']);
		}
		
		// ---------------------------------------- INFRASTRUCTURE >>
		
		
        function cartelLetra(z,Q){
			return ['letters','objects','signs','cartel_'+Q ,1,B(6,0),B(13,0),D(z,0),true,false,false,false,0,0,'VI'];
		}
		var z = 4;
		allstuff = allstuff.concat([
									cartelLetra(z+2*12+1,'P'),
								    cartelLetra(z+2*11+1,'A'),
								    cartelLetra(z+2*10+1,'S'),
								    cartelLetra(z+2*9 +1,'A'),
								    cartelLetra(z+2*8 +1,'D'),
								    cartelLetra(z+2*7 +1,'E'),
								    cartelLetra(z+2*6 +1,'N'),
								    cartelLetra(z+2*5 +1,'A'),
								    cartelLetra(z+2*4   ,'H'),
								    cartelLetra(z+2*3   ,'O'),
								    cartelLetra(z+2*2   ,'T'),
								    cartelLetra(z+2*1   ,'E'),
								    cartelLetra(z       ,'L')
								]);
		
		allstuff = allstuff.concat([
		['fence','walls','fence','10' ,1,B(27,0),B(10,4),0,true,true,false,false,0,0,'BG']
								]);

		allstuff = allstuff.concat([
			['stuff','structures','street','parking'     , 1,B(26,0),B( 6,0), 3,true, true,false,false,0,0,'VI'],
			['stuff','structures','street','light'       ,-1,B(21,0),B( 8,4), 3,true, true,false,false,0,0,'VI'],
			['stuff','structures','street','taxisign'    , 1,B(13,5),B( 8,4), 3,true, true,false,false,0,0,'VI'],
			['stuff','structures','street','postbox'     , 1,B(16,5),B( 9,4), 3,true, true,false,false,0,0,'VI'],
			['stuff','structures','street','trafficlight', 1,B( 4,4),B( 9,0), 3,true, true,false,false,0,0,'VI'],
			['stuff','structures','street','light'       , 1,B( 4,4),B(13,4), 3,true, true,false,false,0,0,'VI'],
			['stuff','structures','street','light'       , 1,B( 4,4),B(23,0), 3,true, true,false,false,0,0,'VI'],
			['stuff','structures','street','container'   ,-1,B( 5,1),B(23,0), 3,true, true,false,false,0,0,'VI'],
			['stuff','structures','street','container'   ,-1,B( 5,0),B(24,5), 3,true, true,false,false,0,0,'VI'],
			['stuff','structures','street','postersonthewall',-1,B( 6,0),B(15,7),D(1,3),true,false,false,false,0,0,'VI'],
			['stuff','structures','street','postersonthewall',-1,B( 6,0),B(14,2),D(1,3),true,false,false,false,0,0,'VI'],
			['stuff','structures','street','postersonthewall',-1,B( 6,0),B(12,7),D(1,2),true,false,false,false,0,0,'VI'],
			['stuff','structures','street','postersonthewall',-1,B( 6,0),B(11,2),D(1,3),true,false,false,false,0,0,'VI'],
			['stuff','structures','street','pasadena_hotel_83',1,B(6,5),B(9,-1),D(4,3),true,false,false,false,0,0,'VI'],
			['stuff','objects'   ,'plants','05051'       , 1,B( 6,6),B( 9,2), 3,true, true,false,false,0,0,'VI'],
			['stuff','objects'   ,'plants','05051'       , 1,B( 9,6),B( 9,2), 3,true, true,false,false,0,0,'VI']
		]);
				
		
		// Walls 
		
		// Fence to the right
		for (var x=0; x<9; ++x)  walls.push(['fence','walls','fence','00',1,B(18+x,0),B(10,4),3,true,true,false,false,0,0,x<7?'BG':'VI']);		
		allstuff = allstuff.concat([	
						['fence','walls','fence','10' ,1,B(27,0),B(10,4),0,true,true,false,false,0,0,'BG'],
						['fence','walls','fence','01' ,1,B(28,0),B(10,4),0,true,true,false,false,0,0,'BG'],
						['fence','walls','fence','10P',1,B(29,0),B(10,4),0,true,true,false,false,0,0,'BG'],
						['fence','walls','fence','01P',1,B(30,0),B(10,4),0,true,true,false,false,0,0,'BG'],
						['fence','walls','fence','00' ,1,B(31,0),B(10,4),3,true,true,false,false,0,0,'BG'],
							]);
		// Fence to the left
		for (var x=1; x<8; ++x){
			walls.push(['fence','walls','fence','00',-1,B(6,4),B(22+x,0),3,true, true,false,false,0,0,'BG']);
			walls.push(['fence','walls','fence','00', 1,B(5+x,4),B(30,0),3,true,false,false,false,0,0,'BG']);	
		}
		
		// TRAIN

		// concrete
		walls.push(['trainwall','walls','concrete','10shadow' ,1,B(32,0),B(5,0),0,true, true,false,false,0,0,'BG']);
		walls.push(['trainwall','walls','concrete','00Bshadow',1,B(33,0),B(5,0),0,true, true,false,false,0,0,'BG']);
		walls.push(['trainwall','walls','concrete','00Ashadow',1,B(34,0),B(5,0),0,true, true,false,false,0,0,'BG']);
		walls.push(['trainwall','walls','concrete','01shadow' ,1,B(35,0),B(5,0),0,true, true,false,false,0,0,'BG']);
		for (var x=0; x<11; ++x){
			walls.push(['trainwall','walls','concrete','10' ,-1,B(32,0),B(5+4*x,0),0,true, true,false,false,0,0,'BG']);
			walls.push(['trainwall','walls','concrete','00B',-1,B(32,0),B(6+4*x,0),0,true, true,false,false,0,0,'BG']);
			walls.push(['trainwall','walls','concrete','00A',-1,B(32,0),B(7+4*x,0),0,true, true,false,false,0,0,'BG']);
			walls.push(['trainwall','walls','concrete','01' ,-1,B(32,0),B(8+4*x,0),0,true, true,false,false,0,0,'BG']);			
		}
		for (var x=0; x<4; ++x) walls.push(['lisghts','structures','street','lights' ,1,B(32,-2),B(1+12*x,3),D(8,1),true, false,false,false,0,0,x==0?'VI':'BG']);	
		
		// train
		for (var x=-2; x<11; ++x) {
			walls.push(['trainA','structures','train','trainA',1,B(32,-2),B(5+4*x  ,0),D(5,5),true,false,false,false,0,0,x<=-1?'VI':'BG']);
			walls.push(['trainB','structures','train','trainB',1,B(32,-2),B(5+4*x+2,0),D(5,5),true,false,false,false,0,0,x<=-1?'VI':'BG']);
		}			
		
		// LOOP Z
		var zmin = Math.max(0,level-3-6),
		    zmax = Math.min(7,level+3+6);
		for (var z=zmin; z<zmax; ++z) {
			
			var Z = z*5;
		
			// Walls
			// Bricks to the left
			var sub = z==6 ? '_roof' : '' ;
			walls.push(['hotelwall','walls','hotel','10'+sub,-1,B(6,0),B(10,0),D(Z,3),true,z==0||z==6,false,false,0,0,'BG']);	
			for (var x=1; x<12; ++x) walls.push(['hotelwall','walls','hotel','00'+sub,-1,B(6,0),B(10+x,0),D(Z,3),true,z==0||z==6,false,false,0,0,'BG']);			
			walls.push(['hotelwall','walls','hotel','01'+sub,-1,B(6,0),B(22,0),D(Z,3),true,z==0||z==6,false,false,0,0,Z==0?'VI':'BG']);
			
			// Bricks to the right
			walls.push(['hotelwall','walls','hotel','10'+sub,1,B(6,0),B(10,0),D(Z,3),true,z==0||z==6,false,false,0,0,Z==0?'VI':'BG']);	
			if (Z==0) {
				walls.push(['hotelwall','walls','hotel','00_top_10'  ,1,B(7,0),B(10,0),D(Z,3),true,false,false,false,0,0,'VI']);	
				walls.push(['hotelwall','walls','hotel','00_top_10_f',1,B(7,0),B(10,0),D(Z,3),true,false,false,false,0,0,'VI']);	
				walls.push(['hotelwall','walls','hotel','00_top'     ,1,B(8,0),B(10,0),D(Z,3),true,false,false,false,0,0,'BG']);	
				walls.push(['hotelwall','walls','hotel','00_top_01'  ,1,B(9,0),B(10,0),D(Z,3),true,false,false,false,0,0,'BG']);	
			}
			for (var x= Z==0 ? 4 : 1; x<11; ++x) walls.push(['hotelwall','walls','hotel','00'+sub,1,B(6+x,0),B(10,0),D(Z,3),true,z==0||z==6,false,false,0,0,'BG']);			
			walls.push(['hotelwall','walls','hotel','01'+sub,1,B(17,0),B(10,0),D(Z,3),true,z==0||z==6,false,false,0,0,z==0?'VI':'BG']);
			
			// windows						
			if (z!=6) {
				walls.push(['window','structures','hotelwindow','window2', 1,z>0 ? B(7,4) : B(11,4),B(10,0),D(Z+1.5,3),true,false,false,false,0,0,'BG']);
				walls.push(['window','structures','hotelwindow','window2',-1,B(6,0),B(19,4),D(Z+1.5,3),true,false,false,false,0,0,'BG']);
				walls.push(['window','structures','hotelwindow','window1',-1,B(6,0),B(16,0),D(Z+1.5,3),z>0,false,false,false,0,0,'VI']);
			}
			
			// firestairs
			if (z!=0 && z<6) {
				walls.push(['fire','structures','firestairs','emergency'   ,1,B(13,0),B(10,0),D(Z,3+7),true,false,false,false,0,0,'BG']);
				walls.push(['fire','structures','firestairs','fireexitlastA',1,B(12,4),B( 9,0),D(Z,3+1),true,false,false,false,0,0,'VI']);
				walls.push(['fire','structures','firestairs','fireexitlastB',1,B(13,7),B( 9,0),D(Z,3+1),true,false,false,false,0,0,'VI']);
			} else if (z==6) {
				walls.push(['fire','structures','firestairs','fireexitlastAB' ,1,B(12,4),B( 9,0),D(Z,3+1),true,false,false,false,0,0,'VI']);	
				walls.push(['fire','structures','firestairs','firestairs_sort',1,B(13,0),B(10,0),D(Z,3+12),true,false,false,false,0,0,'BG']);			
			} else if (z==0) {
				walls.push(['fire','structures','firestairs','firestairs',-1,B(15,1),B( 9,2),D(3,0),true,false,false,false,0,0,'VI']);			
			}

		}
		
		// ---------------------------------------- ROOF STUFF >>
		// Roof Wall 
		// Bricks to the left
		for (var x=1; x<11; ++x) walls.push(['hotelwall','walls','hotel','00_roof_back',-1,B(6+x,0),B(22,4),D(Z,3),true,true,false,false,0,0,'BG']);
		walls.push(['hotelwall','walls','hotel','10_roof_back',-1,B(17,0),B(22,4),D(Z,3),true,true,false,false,0,0,'BG']);		
		// Bricks to the right
		for (var x=1; x<12; ++x) walls.push(['hotelwall','walls','hotel','00_roof_back',1,B(17,4),B(10+x,0),D(Z,3),true,true,false,false,0,0,'BG']);
		walls.push(['hotelwall','walls','hotel','10_roof_back',1,B(17,4),B(22,0),D(Z,3),true,true,false,false,0,0,'BG']);	
		
		Z=Z+2.5;
		// Roof Floors
		floors   = floors.concat(putSquareFloor( 6.5,11,10.5,22,D(Z  ,3),'floor','road','00',true,'roaded','VI'));
		floors.push(['floor','floors','road','00',1,B(11,4),B(10,4),D(Z,3),true,false,false,true,0,0,'BG']); // SPACE FOR STAIRS
		floors.push(['floor','floors','road','00',1,B(11,4),B(11,4),D(Z,3),true,false,false,true,0,0,'BG']);
		floors.push(['floor','floors','road','00',1,B(11,4),B(12,4),D(Z,3),true,false,false,true,0,0,'BG']);
		floors   = floors.concat(putSquareFloor(11.5,12,14  ,17,D(Z-2,3+10),'floor','road','00',true,'roaded','BG')); // FLOOR FOR STAIRS
		floors   = floors.concat(putSquareFloor(12.5,17,10.5,22,D(Z  ,3),'floor','road','00',true,'roaded','BG'));
		floors.push(['floor','floors','hotelfloor','00',1,B(14,2),B(14,6),D(Z,3),true,false,false,false,0,0,'VI']);
		floors.push(['floor','floors','hotelfloor','00',1,B(9,0),B(14,4),D(Z,3),true,false,false,false,0,0,'VI']);
		floors.push(['floor','floors','hotelfloor','00',1,B( 7,4),B(17,0),D(Z,3),true,false,false,false,0,0,'VI']);
		
		// Roof stairs
		for (var x=0;x<4;++x) walls.push(['hotelwall','walls','hotel','00mini',-1,B(12,4),B(13+x,0),D(Z-1,3),true,true,false,false,0,0,'BG']);
		for (var x=0;x<4;++x) walls.push(['hotelwall','walls','hotel','00mini',-1,B(12,4),B(13+x,0),D(Z-2,3),true,true,false,false,0,0,'BG']);
		for (var x=4;x<9;++x) walls.push(['stairs','structures','stairs','step1',1,B(11,5),B(13,2*x-4),D(Z,3-3*x+10-1),true,true,false,true,0,0,'BG']);
		
		// Roof Door	
		doors = doors.concat(putDoor(B(11,4),B(16,0),D(Z-2,3+10), 1,1,'stairs_6','street','door','front','closed',1));
		
		// Roof varanda
		allstuff.push(['varanda','structures','stairs','varanda',1,B(12,4),B(13,4),D(Z,3),true,true,false,false,0,0,'VI'])
		allstuff.push(['varanda','structures','stairs','varanda',1,B(11,1),B(13,4),D(Z,3),true,true,false,false,0,0,'VI'])
		
		
		// gangster girl action stuff
		if ( !(room in memory) || firstEntry ) {
			memory[room] = {'ggirl':'enter','istalking':false};
		}	
		
		if (level==6 && chapter<=3) {
			allactions = allactions.concat([['shefollows','follows',['ggirl','guy']],
										    ['shetalks'  ,'ggirltalks',[],B(6,3),B(10,3),D(Z,3),B(8,7),B(12,7)]]);
		
			// gangster girl
			allstuff.push(['ggirl','people','gangster_girl','00_10N',1,B(7,3),B(11,3),D(Z,3),true,true,false,false,0,0,'VI']);
		}
			
		
		// Roof boxes		
		allstuff = allstuff.concat([	
					['boxes','structures','street','box111',1,B(15,5),B(11,0),D(Z,3),true,true,false,false,0,0,'VI'],
					['boxes','structures','street','box111',1,B(15,5),B(12,0),D(Z,3),true,true,false,false,0,0,'VI'],
					['boxes','structures','street','box111',1,B(16,5),B(11,0),D(Z,3),true,true,false,false,0,0,'VI'],
					['boxes','structures','street','box111',1,B(16,5),B(12,0),D(Z,3),true,true,false,false,0,0,'VI'],
					['boxes','structures','street','box111',1,B(16,5),B(13,0),D(Z,3),true,true,false,false,0,0,'VI'],
					['boxes','structures','street','box111',1,B( 6, 5),B(19,0),D(Z,3),true,true,false,false,0,0,'VI'],
					['boxes','structures','street','box111',1,B( 7, 6),B(19,0),D(Z,3),true,true,false,false,0,0,'VI'],
					['boxes','structures','street','box111',1,B( 8, 6),B(19,0),D(Z,3),true,true,false,false,0,0,'VI'],
					['boxes','structures','street','box111',1,B(10,-1),B(19,0),D(Z,3),true,true,false,false,0,0,'VI'],
					['boxes','structures','street','box111',1,B(10,-1),B(18,0),D(Z,3),true,true,false,false,0,0,'VI']
						]);
		
		// Extra Roof Wall 
		// Bricks to the left
		walls.push(['hotelwall','walls','hotel','10_roof',-1,B(11,0),B(16,0),D(Z,3),true,true,false,false,0,0,'VI']);	
		for (var x=0; x<5; ++x) walls.push(['hotelwall','walls','hotel','00_roof',-1,B(11,0),B(17+x,0),D(Z,3),true,true,false,false,0,0,'VI']);
		walls.push(['hotelwall','walls','hotel','01_roof',-1,B(11,0),B(22,0),D(Z,3),true,true,false,false,0,0,'VI']);
		for (var x=0; x<5; ++x) walls.push(['hotelwall','walls','hotel','00_roof_back',-1,B(12+x,0),B(22,4),D(Z,3),true,true,false,false,0,0,'VI']);
		walls.push(['hotelwall','walls','hotel','10_roof_back',-1,B(17,0),B(22,4),D(Z,3),true,true,false,false,0,0,'VI']);	
		
		// Bricks to the right
		walls.push(['hotelwall','walls','hotel','10_roof',1,B(11,0),B(16,0),D(Z,3),true,false,false,false,0,0,'VI']);	
		for (var x=1; x<6; ++x) walls.push(['hotelwall','walls','hotel','00_roof',1,B(11+x,0),B(16,0),D(Z,3),true,x!=1,false,false,0,0,'VI']);			
		walls.push(['hotelwall','walls','hotel','01_roof',1,B(17,0),B(16,0),D(Z,3),true,true,false,false,0,0,'VI']);
		for (var x=1; x<6; ++x) walls.push(['hotelwall','walls','hotel','00_roof_back',1,B(17,4),B(16+x,0),D(Z,3),true,true,false,false,0,0,'VI']);
		walls.push(['hotelwall','walls','hotel','10_roof_back',1,B(17,4),B(22,0),D(Z,3),true,true,false,false,0,0,'VI']);
		
		Z=6*5+5;
		// Roof Floors
		floors   = floors.concat(putSquareFloor(11.5,17,16.5,22,D(Z,3),'floor','road','00',true,'roaded','BG'));
	
		
		// ---------------------------------------- ROOF STUFF <<
		
		
		
		allstuff = allstuff.concat(floors);	
		allstuff = allstuff.concat(walls); 
		allstuff = allstuff.concat(doors);  

	}

	
	// SHIT ENDS HERE -----------------------------------------------------------------------------

	// Consolide all stuff
	makeStuff(allstuff);
	completeStuff(LX,LY,I0,J0);	
	
	if (!testing) {
		// Keep only what is in the screen
		stuff['background'] = stuff['background'].filter(st => doOverlap(st,{'I0':0,'J0':0,'IM':320,'JM':180}) || st['ID']=='fake' );
		stuff['front'] = stuff['front'].filter(st => doOverlap(st,{'I0':0,'J0':0,'IM':320,'JM':180}) || st['ID']=='fake' );
	}
	
	// Now the guy;
	putGuyAtRoom(entryPoint,entryPreDoor,entryPoint);
	completeStuffItem(guyIndex,LX,LY,I0,J0);	
		
	// All other things
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
	
	var txt = ['guy','people',guy.folder,guy.file,1,guy.X,guy.Y,guy.Z,true,false,true,false,guy.state,-1,'VI']
	stuff['front'].push({'ID':txt[0],'type':txt[1],'folder':txt[2],'file':txt[3],'spin':txt[4],'X':txt[5],'Y':txt[6],'Z':txt[7],
							'visible':txt[8],'solid':txt[9],'mobile':txt[10],'walkable':txt[11],'state':txt[12],'order':txt[13]});
	guyIndex = stuff['front'].length-1;
	
	console.log('entry:',guy['ID'],guy['X'],guy['Y'],guy['Z']);
}






	/*
	var entryIndex = allstuff.flatMap((it, i) => it[1] == 'doors' && it[0] == preRoom ? i : []);
		var entryDoor = allstuff.filter( (it, i) => entryIndex.includes(i) );
		var ed = entryDoor.find( it => it[12] == 'closed' );

	// Put guy in the stuff list
	allstuff.unshift(['guy','people',guy.folder,guy.file,1,guy.X,guy.Y,guy.Z,true,false,true,false,guy.state,-1,'VI']);
	*/