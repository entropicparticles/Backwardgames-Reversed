

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
	c = [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
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
	
    var r = 0-(XYZ2J(X,Y,0)/XYZ2J(5,5,0))*5 + 255*5;
    r = (r%255)/255
    
    //f1 = room['globalsets']['lamp']
    f1 = [0,1][0];
    
    if (!row) {
		var a = 0.95;
	} else {
		var L = 8;
		var a  = gauss([X,Y,0],[  L,  0,0],1.5*L)*180/2/255 +
			     gauss([X,Y,0],[2*L,  0,0],1.5*L)*180/2/255 +
			     gauss([X,Y,0],[  L,3*L,0],  4*L)*(205*f1+50)/255 +
			     gauss([X,Y,0],[4*L,  0,0],    L)*150*f1/255;
	
		a = ['people','objects','human'].includes(row['type']) ? a+5 : a ; 
		a = cl(a)
    }
	
	var lightColor = HSVtoRGB(r,cl(0.75+a/10),a  );
	lightColor.push(255);
	var darkColor  = HSVtoRGB(r,1        ,a/4);
	darkColor.push(255);
	
	return [[0,0,0,0],darkColor,lightColor,[0,0,0,255]];
		
	/*
	var png = [];
	for (var k=0; k<row['png'].length;  k++) {
		var RGBA = [0,0,0,0]; // transparent
		if (row['png'][k]==1) {
			RGBA = darkColor; 
		} else if (row['png'][k]==2) {
			RGBA = lightColor;
		}
		png.push(RGBA);
	}
	return png;
	*/
}
