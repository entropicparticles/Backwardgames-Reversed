
// overlap in (I,J) space?
function doOverlap(rect1,rect2) {
	return ( rect1.I0 < rect2.IM && rect1.IM > rect2.I0 &&
			 rect1.J0 < rect2.JM && rect1.JM > rect2.J0    );	
}

// Relative positions in XYZ space
function A0_detrasde_B0(A,B) {
    return A.X  - B.X  >= 0 && A.Y  - B.Y  >= 0;
}
function A0_detrasde_BM(A,B) {
    return A.X  - B.XM >= 0 && A.Y  - B.YM >= 0;
}
function AM_detrasde_B0(A,B) {
    return A.XM - B.X  >= 0 && A.YM - B.Y  >= 0;
}
function AM_detrasde_BM(A,B) {
    return A.XM - B.XM >= 0 && A.YM - B.YM >= 0;
}
function A0_derechade_B0(A,B) {
    return A.X  - B.X  >= 0 && A.Y  - B.Y  <= 0;
}
function A0_derechade_BM(A,B) {
    return A.X  - B.XM >= 0 && A.Y  - B.YM <= 0;
}
function AM_derechade_B0(A,B) {
    return A.XM - B.X  >= 0 && A.YM - B.Y  <= 0;
}
function AM_derechade_BM(A,B) {
    return A.XM - B.XM >= 0 && A.YM - B.YM <= 0;
}
function A0_encimade_B0(A,B) {
    return A.Z  > B.Z  ;
}
function A0_encimade_BM(A,B) {
    return A.Z  >= B.ZM ;
}
function AM_encimade_B0(A,B) {
    return A.ZM >= B.Z  ;
}
function AM_encimade_BM(A,B) {
    return A.ZM >= B.ZM ;
}
    
// Who is in front of whom? Isometric
function compareIsometric(r2,r1) {
	var print = r1['ID']=='guy' && false;
	var R1infrontofR2;
	
	if ( (r1.X==r1.XM && r1.XM==r2.X) || (r1.Y==r1.YM && r1.YM==r2.Y) ) {
        if (print) console.log(' 1',r1['ID'],r1['file'],' pegado en frente de ',r2['ID'],r2['file'])
        R1infrontofR2 = true;	
    } else if ( (r2.X==r2.XM && r2.XM==r1.X) || (r2.Y==r2.YM && r2.YM==r1.Y)) {
        if (print) console.log(' 1',r2['ID'],r2['file'],' pegado en frente de ',r1['ID'],r1['file'])
        R1infrontofR2 = false;	
    } else if (r1.Z==r1.ZM && r1.ZM==r2.Z) {
        if (print) console.log(' 1',r2['ID'],r2['file'],' pisa al plano ',r1['ID'],r1['file'])
        R1infrontofR2 = false;	
    } else if (r2.Z==r2.ZM && r2.ZM==r1.Z) {
        if (print) console.log(' 1',r1['ID'],r1['file'],' pisa al plano ',r2['ID'],r2['file'])
        R1infrontofR2 = true;	
    } else if (A0_detrasde_B0(r1,r2) && A0_detrasde_BM(r1,r2)) { 
        if (print) console.log(' 1',r2['ID'],r2['file'],' totalmente delante de ',r1['ID'],r1['file'])
        R1infrontofR2 = false;
    } else if ((A0_detrasde_B0(r1,r2) || A0_derechade_B0(r2,r1)) && AM_derechade_B0(r2,r1) && AM_detrasde_B0(r1,r2)) {
        if (print) console.log(' 2',r2['ID'],r2['file'],' en frente y/o hacia la derecha de ',r1['ID'],r1['file'])
        R1infrontofR2 = false;
    } else if ((A0_detrasde_B0(r1,r2) || A0_derechade_B0(r1,r2)) && A0_derechade_BM(r1,r2) && AM_detrasde_B0(r1,r2)) {
        if (print) console.log(' 3',r2['ID'],r2['file'],' > en frente y/o hacia la izquierda de ',r1['ID'],r1['file'])
        R1infrontofR2 = false;
    } else if (A0_detrasde_B0(r2,r1) && A0_detrasde_BM(r2,r1)) {
        if (print) console.log(' 4',r1['ID'],r1['file'],' totalmente delante de ',r2['ID'],r2['file'])
         R1infrontofR2 = true;
    } else if ((A0_detrasde_B0(r2,r1) || A0_derechade_B0(r2,r1)) && A0_derechade_BM(r2,r1) && AM_detrasde_B0(r2,r1)) {
        if (print) console.log(' 5',r2['ID'],r2['file'],' detrás y a la derecha de ',r1['ID'],r1['file'])
        R1infrontofR2 = true;
    } else if ((A0_detrasde_B0(r2,r1) || A0_derechade_B0(r1,r2)) && AM_derechade_B0(r1,r2) && AM_detrasde_B0(r2,r1)) {
        if (print) console.log(' 6',r2['ID'],r2['file'],' detrás y a la izquierda de ',r1['ID'],r1['file'])
        R1infrontofR2 = true;
    } else if (A0_encimade_BM(r2,r1)) {
        if (print) console.log('11',r2['ID'],r2['file'],' vuela sobre ',r1['ID'],r1['file'])
        R1infrontofR2 = false;
    } else if (A0_encimade_BM(r1,r2)) {
        if (print) console.log('12',r2['ID'],r2['file'],' debajo de ',r1['ID'],r1['file'])
        R1infrontofR2 = true;
    } else if (A0_detrasde_B0(r2,r1) && AM_detrasde_BM(r1,r2) && A0_encimade_BM(r2,r1)) {
        if (print) console.log(' 7',r2['ID'],r2['file'],' pequeño sobre gran  ',r1['ID'],r1['file'])
        R1infrontofR2 = false;
    } else if (A0_detrasde_B0(r1,r2) && AM_detrasde_BM(r2,r1) && A0_encimade_BM(r1,r2)) {
        if (print) console.log(' 8',r2['ID'],r2['file'],' > grande sostiene a pequeño ',r1['ID'],r1['file'])
        R1infrontofR2 = true;
    } else if (A0_detrasde_B0(r2,r1) && AM_detrasde_BM(r1,r2) && A0_encimade_BM(r1,r2)) {
        if (print) console.log(' 9',r2['ID'],r2['file'],' > pequeño debajo de gran',r1['ID'],r1['file'])
        R1infrontofR2 = true;
    } else if (A0_detrasde_B0(r1,r2) && AM_detrasde_BM(r2,r1) && A0_encimade_BM(r2,r1)) {
        if (print) console.log('10',r2['ID'],r2['file'],' grande cubriendo pequeño ',r1['ID'],r1['file'])
        R1infrontofR2 = false;
    } else if (A0_encimade_BM(r2,r1)) {
        if (print) console.log('11',r2['ID'],r2['file'],' vuela sobre ',r1['ID'],r1['file'])
        R1infrontofR2 = false;
    } else if (A0_encimade_BM(r1,r2)) {
        if (print) console.log('12',r2['ID'],r2['file'],' debajo de ',r1['ID'],r1['file'])
        R1infrontofR2 = true;
    } else if (r2.JC<=r1.JC) {
		if (print) console.log('13 No overlap! ',r2['ID'],r2['file'],' podría estar delante de ',r1['ID'],r1['file']);
		R1infrontofR2 = false;
	} else {
		if (print) console.log('14 No overlap! ',r2['ID'],r2['file'],' podría estar detras de ',r1['ID'],r1['file']);
        R1infrontofR2 = true;
	}
	if (print) console.log(' -> ',r1['ID'],' delante de ',r2['ID'],'?',R1infrontofR2)
	return R1infrontofR2
}

function printAllIsometric(objects,which) {
	
	// loop for all objects to draw, call it rows
	for (var k=0; k<objects.length; ++k) {
		
		var row = objects[k];
		if (row['visible']) {			
			
			// we create a copy of the object, and fusion with the tile info
			// reverse the image if spin=-1
			var tilerow   = {};
			Object.assign(tilerow, tiles[row['type']][row['folder']][row['file']]);			
			if (row['spin']==-1) tilerow['png'] = inverted(tilerow);
			var rowt = {...row, ...tilerow};
			
			// loop for all the other objects to be drawn and check those with tile overlap
			for (var q=0;q<objects.length; q+=1) {
				obj = objects[q];
				if (k!=q && doOverlap(row,obj) && obj['visible'] ) {
					// is obj in front of row?
					var OBJinfrontofROW  = compareIsometric(row,obj);
					
					// if we find that the object is in front of the row, we apply the image substraction
					if (OBJinfrontofROW) {
						
						// we create a copy otherwishe we mesh it up with the original png
						// again, reverse if spin=-1
						var tileobj = {};
						Object.assign(tileobj, tiles[obj['type']][obj['folder']][obj['file']]);
						if (obj['spin']==-1) tileobj['png'] = inverted(tileobj);
						var objt = {...obj, ...tileobj};
						
						rowt['png'] = substractImage(rowt,objt);
					}
				} 
			}
			
			// get the colors and draw it at the canvas
			var the3colors = givemeColors(row);
			drawTile(rowt,row['I0'],row['J0'],0,false,which,the3colors);
		}
	}	
	
}

// Mirrowing spin=-1 images
function inverted(im){
	var png2 = [];
	for (var k=0; k<im['png'].length;  k++) {
		var q = (im['DI']-k%im['DI']-1) + im['DI']*Math.floor(k/im['DI']);
		png2[q] = im['png'][k];
	}
	return png2;
}

function substractImage(row,obj) {
	// we take (0,0) respect to row's (0,0)
	var i0obj = obj['I0']-row['I0'],
	    j0obj = obj['JM']-row['JM']; //j goes the other way around in JS

	var o=0;
	var png = [...row['png']];	
	
	// loop for the object
	for (var k=0; k<obj['png'].length; ++k) {
		// get ij coordinates for object to know the ij for row and get its index q
		var iobj = k%obj['DI'],
		    jobj = Math.floor(k/obj['DI']);
		var irow = iobj+i0obj,
		    jrow = jobj-j0obj;
			
		// make sure q is in the range, otherwhise it creates copies
		if (jrow>=0 && jrow<row['DJ'] && irow>=0 && irow<row['DI']) {
			var q = jrow*row['DI']+irow;
		
			// here's where the magic happens
			if (obj['png'][k]!=0) {
				png[q] = 0;
				//console.log(t,k,q,o)
				++o;
			}
		}		
	}
	return png;
}

function sortMobile(sure) {
	
	if (sure) {

		// filter by mobile
		var mobiles    = stuff['front'].filter(function( obj ) { return  obj.mobile;});
		mobiles.sort((a, b) => (a.order > b.order) ? 1 : -1);
		stuff['front'] = stuff['front'].filter(function( obj ) { return !obj.mobile;});
		
		//console.log(JSON.stringify(mobiles));
		//console.log(JSON.stringify(stuff['background']));
		
		//console.log(stuff['front'].length,mobiles.length);
		for (var k=0; k<mobiles.length; ++k) {
			s = mobiles[k];
			//console.log(stuff['front'].length,'r1 es ',s['file'])
			var tellme=true;
			//for (var q=stuff['front'].length-1; q>=0; q+=-1) {
			for (var q=0;q<stuff['front'].length; q+=1) {
				r = stuff['front'][q];
				if (r['visible']) {
					//console.log(q,compareIsometric(s,r) && doOverlap(s,r));
					if ( (compareIsometric(r,s)) && doOverlap(s,r) ){
						stuff['front'].splice(q,0,s);
						tellme = false;
						break;
					}
				}
			}
			if (tellme) {
				stuff['front'].push(s);
			}
		}
		for (var k=0; k<stuff['front'].length; ++k) {
			s = stuff['front'][k];
			if (s['ID']=='guy') {
				guyIndex = k;
				break;
			}
		}
		//console.log(stuff['front'])
		
	} else {
		guyIndex = stuff['front'].flatMap((it, i) => it['ID'] == 'guy' ? i : [])[0];
	}
	
}