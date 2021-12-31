
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

    if (A0_detrasde_B0(r1,r2) && A0_detrasde_BM(r1,r2)) { 
        //console.log('r2 es: ',r2['file'],' > r2 totalmente delante de r1')
        return true;
    } else if (A0_detrasde_B0(r2,r1) && A0_detrasde_BM(r2,r1)) {
        //console.log('r2 es: ',r2['file'],' > r1 totalmente delante de r2')
        return false;
    } else if (A0_detrasde_B0(r2,r1) && AM_detrasde_BM(r1,r2) && A0_encimade_BM(r2,r1)) {
        //console.log('r2 es: ',r2['file'],' > pequeño r2 sobre gran  r1')
        return true;
    } else if (A0_detrasde_B0(r1,r2) && AM_detrasde_BM(r2,r1) && A0_encimade_BM(r1,r2)) {
        //console.log('r2 es: ',r2['file'],' > gran r2 sostiene a pequeño r1')
        return false;
    } else if (A0_detrasde_B0(r2,r1) && AM_detrasde_BM(r1,r2) && A0_encimade_BM(r1,r2)) {
        //console.log('r2 es: ',r2['file'],' > pequeño r2 debajo de gran r1')
        return false;
    } else if (A0_detrasde_B0(r1,r2) && AM_detrasde_BM(r2,r1) && A0_encimade_BM(r2,r1)) {
        //console.log('r2 es: ',r2['file'],' > gran r2 cubriendo pequeño r1')
        return true;
    } else if ((A0_detrasde_B0(r1,r2) || A0_derechade_B0(r2,r1)) && AM_derechade_B0(r2,r1) && AM_detrasde_B0(r1,r2)) {
        //console.log('r2 es: ',r2['file'],' > r2 en frente y/o hacia la derecha de r1')
        return true;
    } else if ((A0_detrasde_B0(r1,r2) || A0_derechade_B0(r1,r2)) && A0_derechade_BM(r1,r2) && AM_detrasde_B0(r1,r2)) {
        //console.log('r2 es: ',r2['file'],' > r2 en frente y/o hacia la izquierda de r1')
        return true;
    } else if ((A0_detrasde_B0(r2,r1) || A0_derechade_B0(r1,r2)) && AM_derechade_B0(r1,r2) && AM_detrasde_B0(r2,r1)) {
        //console.log('r2 es: ',r2['file'],' > r2 detrás y a la izquierda de r1')
        return false;
    } else if ((A0_detrasde_B0(r2,r1) || A0_derechade_B0(r2,r1)) && A0_derechade_BM(r2,r1) && AM_detrasde_B0(r2,r1)) {
        //console.log('r2 es: ',r2['file'],' > r2 detrás y a la derecha de r1')
        return false;
    } else if (A0_encimade_BM(r2,r1)) {
        //console.log('r2 es: ',r2['file'],' > r2 vuela sobre r1')
        return true;
    } else if (A0_encimade_BM(r1,r2)) {
        //console.log('r2 es: ',r2['file'],' > r2 debajo de r1')
        return false;
    } else if (r2.J0>r1.J0) {
		//console.log('r2 es: ',r2['file'],' > what: r2 podría estar detrás de r1');
		return false;
	} else {
		//console.log('r2 es: ',r2['file'],' > what: r2 podría estar delante de r1');
        return true;
	}
}

function sortMobile() {

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
	
}