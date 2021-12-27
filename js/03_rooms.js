
function loadRoom() {
	
	var alltext=[],allstuff=[],allactionsBG=[],allactionsXY=[];
	var floor=[],walls=[],doors=[],people=[],structures=[];
	var LX,LY,I0,J0;
	RGBcover = 0;
	
	if (room=='cover') {
			
		RGBcover = 'RGB_cover';
		
		LX = 4, LY = 6;
		I0 = 0, J0 = 4;
		
		
		alltext = [
			//['  Created by|Backward Games',LI/4,50-6,'text_normal',true,true,true,-1],
			//['Created by| Backward|  Game',LI/2,50-6,'text_normal',true,true,true,-1],
			//[' Created by Backward Games ',10,100-28,'text_normal',true,true,true,-1],
			//[' Created by Backward Games ',300,100-28,'text_normal',true,true,true,-1],
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
			
		for (var x=0; x<LX; ++x) {
			for (var y=0; y<LY; ++y) {
				floor.push(
				['floor','floors','elevator','00', 1,B(x,0),B(y,0),0,true,false,false,true,0,-1,'BG']
				)
			}
		}
		allstuff = allstuff.concat(floor);
		
	} else {
		// wachup		
	}
	
	// Update stuff list
	stuff = {'background':[],'front':[]}
	var k0=0,k1=0,kk,label;
	for (var k=0; k<allstuff.length; ++k) {
		txt = allstuff[k];
		if (txt[14]=='BG') {
			label = 'background'; kk = k0; ++k0;
		} else {
			label = 'front'; kk = k1; ++k1;			
		}
		stuff[label][kk] = {'ID':txt[0],'type':txt[1],'folder':txt[2],'file':txt[3],'spin':txt[4],
							'X':txt[5],'Y':txt[6],'Z':txt[7],
							'visible':txt[8],'solid':txt[9],'mobile':txt[10],'walkable':txt[11],'state':txt[12],
							'order':txt[13]};
	}
	completeStuff(LX,LY,I0,J0);
	
	// Update text list
	listText = [];
	for (var k=0; k<alltext.length; ++k) {
		txt = alltext[k];
		listText[k] = {'text':txt[0],'I0':txt[1],'J0':txt[2],'type':txt[3],
					   'centered':txt[4],'bubble':txt[5],'pointer':txt[6],'time':txt[7]};
	}
	// Update action list
	actions = {'background':[],'front':[]};
	for (var k=0; k<allactionsBG.length; ++k) {
		txt = allactionsBG[k];
		actions['background'][k] = {'ID':txt[0],'function':txt[1]};
	}
	for (var k=0; k<allactionsXY.length; ++k) {
		txt = allactionsXY[k]
		actions['front'][k] = {'ID':txt[0],'function':txt[1],
							   'X':txt[2],'Y':txt[2],'Z':txt[2],'DX':txt[2],'DY':txt[2],'DZ':txt[2]};
	}
	
}

function completeStuff(LX,LY,I0,J0) {
	
	var labels = ['background','front']
	
	var jc = J0 == 0 ? (height - ((LX+LY)*8+12*6))/2 : J0 ;
	var ic = I0 == 0 ? LY*16 + (width-(LX+LY)*16)/2 : I0 ;
	for (var q=0; q<2; ++q) {
		label = labels[q];
		for (var k=0; k<stuff[label].length; ++k) {
			
			s = stuff[label][k];
			im = tiles[s['type']][s['folder']][s['file']];
			
			stuff[label][k]['XM'] = s['X']+im['DX'];
			stuff[label][k]['YM'] = s['Y']+im['DY'];
			stuff[label][k]['ZM'] = s['Z']+im['DZ'];
			
			var ir = im['spin'] == 1 ? im['I'] : im['DI']-im['I'] ;
			stuff[label][k]['I0'] = XY2I(s['X'],s['Y']) - ir + ic;
			stuff[label][k]['J0'] = XYZ2J(s['X'],s['Y'],s['Z']) - im['J'] + jc;
			
		}
		stuff[label].sort((a, b) => (a.order > b.order) ? 1 : -1);
		//console.log(stuff[label]);
	}
	
}
