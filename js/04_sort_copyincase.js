
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
    return A.Z  >= B.Z  ;
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
    
// sorting in isometric, aun falla en algunos casos, revisar en detalle
function compareIsometric(r2,r1) {
	var print = r1['ID']=='guy' 
    if (A0_detrasde_B0(r1,r2) && A0_detrasde_BM(r1,r2)) { 
        if (print) console.log(r1['ID'],r1['file'],' totalmente delante de ',r2['ID'],r2['file'])
        return true;
    } else if (A0_detrasde_B0(r2,r1) && A0_detrasde_BM(r2,r1)) {
        if (print) console.log(r1['ID'],r1['file'],' totalmente delante de ',r2['ID'],r2['file'])
        return false;
    } else if (A0_detrasde_B0(r2,r1) && AM_detrasde_BM(r1,r2) && A0_encimade_BM(r2,r1)) {
        if (print) console.log(r2['ID'],r2['file'],' pequeño sobre gran  ',r1['ID'],r1['file'])
        return true;
    } else if (A0_detrasde_B0(r1,r2) && AM_detrasde_BM(r2,r1) && A0_encimade_BM(r1,r2)) {
        if (print) console.log(r2['ID'],r2['file'],' > grande sostiene a pequeño ',r1['ID'],r1['file'])
        return false;
    } else if (A0_detrasde_B0(r2,r1) && AM_detrasde_BM(r1,r2) && A0_encimade_BM(r1,r2)) {
        if (print) console.log(r2['ID'],r2['file'],' > pequeño debajo de gran',r1['ID'],r1['file'])
        return false;
    } else if (A0_detrasde_B0(r1,r2) && AM_detrasde_BM(r2,r1) && A0_encimade_BM(r2,r1)) {
        if (print) console.log(r2['ID'],r2['file'],' grande cubriendo pequeño ',r1['ID'],r1['file'])
        return true;
    } else if ((A0_detrasde_B0(r1,r2) || A0_derechade_B0(r2,r1)) && AM_derechade_B0(r2,r1) && AM_detrasde_B0(r1,r2)) {
        if (print) console.log(r2['ID'],r2['file'],' en frente y/o hacia la derecha de ',r1['ID'],r1['file'])
        return true;
    } else if ((A0_detrasde_B0(r1,r2) || A0_derechade_B0(r1,r2)) && A0_derechade_BM(r1,r2) && AM_detrasde_B0(r1,r2)) {
        if (print) console.log(r2['ID'],r2['file'],' > en frente y/o hacia la izquierda de ',r1['ID'],r1['file'])
        return true;
    } else if ((A0_detrasde_B0(r2,r1) || A0_derechade_B0(r1,r2)) && AM_derechade_B0(r1,r2) && AM_detrasde_B0(r2,r1)) {
        if (print) console.log(r2['ID'],r2['file'],' detrás y a la izquierda de ',r1['ID'],r1['file'])
        return false;
    } else if ((A0_detrasde_B0(r2,r1) || A0_derechade_B0(r2,r1)) && A0_derechade_BM(r2,r1) && AM_detrasde_B0(r2,r1)) {
        if (print) console.log(r2['ID'],r2['file'],' detrás y a la derecha de ',r1['ID'],r1['file'])
        return false;
    } else if (A0_encimade_BM(r2,r1)) {
        if (print) console.log(r2['ID'],r2['file'],' vuela sobre ',r1['ID'],r1['file'])
        return true;
    } else if (A0_encimade_BM(r1,r2)) {
        if (print) console.log(r2['ID'],r2['file'],' debajo de ',r1['ID'],r1['file'])
        return false;
    } else if (r2.J0>r1.J0) {
		if (print) console.log('what? ',r2['ID'],r2['file'],' podría estar detrás de ',r1['ID'],r1['file']);
		return false;
	} else {
		if (print) console.log('what? ',r2['ID'],r2['file'],' podría estar delante de ',r1['ID'],r1['file']);
        return true;
	}
}

function printAllIsometric(objects,which) {
	
	//console.log(stuff['front'].length,mobiles.length);
	for (var k=0; k<objects.length; ++k) {
		
		var row = objects[k];
		if (row['visible']) {			
			
			var tilerow   = {};
			Object.assign(tilerow, tiles[row['type']][row['folder']][row['file']]);
			
			if (row['spin']==-1) tilerow['png'] = inverted(tilerow);
			
			for (var q=0;q<objects.length; q+=1) {
				obj = objects[q];
				if (k!=q && doOverlap(row,obj) && obj['visible'] ) {
					// is obj in front of row?
					var OBJinfrontofROW  = compareIsometric(row,obj);
					//console.log(obj['ID'],'in front of',row['ID'],'?',OBJinfrontofROW)
					if (OBJinfrontofROW) {
						var tileobj = {};
						Object.assign(tileobj, tiles[obj['type']][obj['folder']][obj['file']]);
						if (obj['spin']==-1) tileobj['png'] = inverted(tileobj);
						obj = {...obj, ...tileobj};
						row = {...row, ...tilerow};
						substractImage(row,obj);
					}
				} 
			}
			var the3colors = givemeColors(row);
			drawTile(tilerow,row['I0'],row['J0'],0,false,which,the3colors);
		}
	}	
	
}

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
	    j0obj = obj['J0']-row['J0'],
		imobj = obj['IM']-row['I0'],
	    jmobj = obj['JM']-row['J0'];
	// we check we the intersection starts and ends. Overlap is assumed. Loop runs only there.
	var i0u = Math.max(0,i0obj),
		j0u = Math.max(0,j0obj),
		imu = Math.min(row['DI'],imobj),
		jmu = Math.min(row['DJ'],jmobj);

	var png = {};
	Object.assign(png,row['png']);		
	for (var k=0; k<row['png'].length; ++k) {
		var irow = k%row['DI'],
		    jrow = Math.floor(k/row['DI']);
		var iobj = irow+row['I0']-obj['I0'],
		    jobj = jrow+row['J0']-obj['J0'];
		if ( iobj>=i0u && iobj<imu && jobj>=j0u && jobj<jmu) {
			var q = jobj*obj['DI']+iobj;
			if (obj['png'][q]!=0) png[k] = 0;
		}
	}
	return row['png'];
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