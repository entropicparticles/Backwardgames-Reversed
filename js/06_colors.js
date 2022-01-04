

// From Parthik Gosar's link in this comment with slight modification to let you 
// enter each value independently or all at once as an object

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
	c = [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 255 ];
    return c;
}


function cl(x) {
	return Math.min(Math.max(x,0),1);
}

function gauss(xyz,xyz0,sig) {
	//return Math.exp(-(Math.pow(xyz[0]-xyz0[0],2)+Math.pow(xyz[1]-xyz0[1],2)+Math.pow(xyz[3]-xyz0[3],2))/2/Math.pow(sig,2) );
	return Math.exp(-xyz[0]/2/Math.pow(sig,2) );
}

function givemeColors(row) {
		
	var X = row['X'] ? row['X'] : 0 ;
	var Y = row['Y'] ? row['Y'] : 0 ;
	var Z = row['Z'] ? row['Z'] : 0 ;
	var ra = [[250,10,0],[50,5,0]];
	
	if (room.slice(0,-2)=='stairs') { //------------------------------------------- STAIRS

		var r = -50-(XYZ2J(X,Y,Z)/XYZ2J(5,5,0))+255*10;
		r = (r%255)/255;
		r = (row['ID']=='railing') ? r-0.02 : r ; 
		r = cl(r);
		
		if (!row) {
			var a = 0.95;
		} else {
			a = 235-(XYZ2J(X,Y,0)/XYZ2J(4,4,0))*20;
			a = cl(a/255);		
			a = Math.max(a,0.2);
			a = (row['ID']=='railing') ? 0.5 + 0.5*a : a ; 
			a = (row['type']=='objects') ? 0.2 + 0.8*a : a ; 
			a = (row['ID']=='guy') ? 0.3 + 0.7*a : a ; 
		}
		
		ra =  [ [r,cl(0.75+a/10),a  ],   // ligtht
		        [r,1            ,a/4]];  // dark		
	
	} else if (room.slice(0,-2)=='hotel_street') { //--------------------------------- HOTEL STREET
		
		var r = 50-(20*X+20*(Y-8*4)+Z)/200;
		r = (r%255)/255;
		
		if (!row) {
			var a  = 0.95;
			var a2 = a;
		} else {
			var a  = 235-(XYZ2J(X,Y,0)/XYZ2J(45,45,0))*20;
			a = (a%255)/255;
			a = cl(a);
			var a2 = ['people','objects'].includes(row['type']) || ['street','firestairs','vehicles'].includes(row['folder']) ? 0.4 + 0.6*a : a ; 
		}
		
		ra =  [ [r+a*0.8,cl(0.8+a2/10),a2  ],   // ligtht
		        [r+a*0.8,1           ,a2/5]];  // dark
	} else {  //------------------------------------------------------------------------ OTHER ROOMS
	
		var r = 255-(XYZ2J(X,Y,0)/XYZ2J(5,5,0))*5;
		r = (r%255)/255;
		
		//f1 = room['globalsets']['lamp']
		f1 = [0,1][0];
		
		if (!row) {
			var a = 0.95;
		} else {
			var L = 8;
			var a  = gauss([X,Y,0],[  L,  0,0],1.5*L)*180/2 +
					 gauss([X,Y,0],[2*L,  0,0],1.5*L)*180/2 +
					 gauss([X,Y,0],[  L,3*L,0],  4*L)*(205*f1+50) +
					 gauss([X,Y,0],[4*L,  0,0],    L)*150*f1;
			a = (a%255)/255;
			a = cl(a);
			a = ['people','objects','human'].includes(row['type']) ? 0.85 + 0.15*a : a ; 
		}  
		
		//---------------------------------------------------------------------------------------------
		
		ra =  [ [r,cl(0.75+a/10),a  ],   // ligtht
		        [r,1            ,a/4]];  // dark
	}
	//console.log(ra)
	var lightColor = HSVtoRGB(ra[0][0],ra[0][1],ra[0][2]);
	var darkColor  = HSVtoRGB(ra[1][0],ra[1][1],ra[1][2]);
	
	return [[0,0,0,0],darkColor,lightColor,[0,0,0,255]];

}