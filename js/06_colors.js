 //------------------------------------------- RANDOM GENERATOR WITH SEED

//https://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator

function RNG(seed) {
  // LCG using GCC's constants
  this.m = 0x80000000; // 2**31;
  this.a = 1103515245;
  this.c = 12345;

  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}
RNG.prototype.nextInt = function() {
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state;
}
RNG.prototype.nextFloat = function() {
  // returns in range [0,1]
  return this.nextInt() / (this.m - 1);
}
RNG.prototype.nextRange = function(start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start;
  var randomUnder1 = this.nextInt() / this.m;
  return start + Math.floor(randomUnder1 * rangeSize);
}
RNG.prototype.choice = function(array) {
  return array[this.nextRange(0, array.length)];
}

/*
var rng = new RNG(20);
for (var i = 0; i < 10; i++)
  console.log(rng.nextRange(10, 50));

var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
for (var i = 0; i < 10; i++)
  console.log(rng.choice(digits));

console.log(rng.nextFloat())
*/

 //------------------------------------------- SPECIAL EFFECTS HERE!!!!

function specialEffects(rowt,idx) {
	
	
	// FOR RANDOM SERIES
	var rng = new RNG(rowt['X']+100*rowt['Y']+10000*rowt['Z']+100000);
	var png = [...rowt['png']];
	
	if (rowt['state'] == 'roaded') {
		
		for (var k=0; k<png.length; ++k) {
			if (png[k]==1 && rng.nextFloat()<0.005) {
				png[k] = 2;
				if (rng.nextFloat()<0.55) png[k+1] = 2;
			}
		}
		
	} if (rowt['state'] == 'whitenoised') {
		for (var k=0; k<png.length; ++k) {
			if (png[k]==3) {
				png[k] = Math.round(Math.random()) + 1;
			}
		}
				
	} if (rowt['state'] == 'itsOn' || rowt['state'] == 'itsOff') {
		for (var k=0; k<png.length; ++k) {
			if (png[k]==3) {
				png[k] = rowt['state'] =='itsOn'?2:1;
			}
		}
				
	}
	
	return png;
	
}

 //------------------------------------------- TRANSFORMATION COLOR FUNCTIONS

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

 //------------------------------------------- OTHER MATH


function cl(x) {
	return Math.min(Math.max(x,0),1);
}

function gauss(xyz,xyz0,sig) {
	return Math.exp(-(Math.pow(xyz[0]-xyz0[0],2)+Math.pow(xyz[1]-xyz0[1],2))/2/Math.pow(sig,2) );
}

function expx(xyz,xyz0,sig) {
	//return Math.exp(-(Math.pow(xyz[0]-xyz0[0],2)+Math.pow(xyz[1]-xyz0[1],2)+Math.pow(xyz[3]-xyz0[3],2))/2/Math.pow(sig,2) );
	return Math.exp(-xyz[0]/2/Math.pow(sig,2) );
}

 //------------------------------------------- COLORS!!!!

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
		
		
		if (!row) {
			
			var r = room.slice(-1)==6 ? 0.97 : 0.12;
			var a  = 1;
			var a2 = a;
			
		} else {
			
			var r = 50-(20*X+20*(Y-8*4)+Z)/200;
			r = (r%255)/255;
			
			var a  = 235-(XYZ2J(X,Y,0)/XYZ2J(35,35,0))*20;
			a = (a%255)/255;
			a = cl(a);
			var a2 = ['people','objects'].includes(row['type']) || ['street','firestairs','vehicles'].includes(row['folder']) ? 0.4 + 0.6*a : a ; 
		}
		
		ra =  [ [r+a*0.8,cl(0.8+a2/10),a2  ],   // ligtht
		        [r+a*0.8,1           ,a2/5]];  // dark
				
	} else if (room.slice(0,-2)=='toilet') {  //-------------------------------------------------------- TOILET
	
		var r = 175+(XYZ2J(X,Y,0)/XYZ2J(5,5,0))*5-room.slice(-1)*5;
		r = (r%255)/255;
		
		//f1 = room['globalsets']['lamp']
		f1 = [0,1][0];
		
		if (!row) {
			var a = 0.95;
		} else {
			var L = 8;
			var a  = 220;
			a = (a%255)/255;
			a = cl(a);
			a = ['people','objects','human'].includes(row['type']) ? 0.85 + 0.15*a : a ; 
		}  
				
		ra =  [ [r,cl(0.75+a/10),a  ],   // ligtht
		        [r,1            ,a/4]];  // dark
				
	} else if (room=='elevator') {  //----------------------------------------------------------------- ELEVATOR
	
		var r = 185+(XYZ2J(X,Y,0)/XYZ2J(5,5,0))*5;
		r = (r%255)/255;
		
		//f1 = room['globalsets']['lamp']
		f1 = [0,1][0];
		
		if (!row) {
			var a = 0.95;
		} else {
			var L = 8;
			var a  = 220;
			a = (a%255)/255;
			a = cl(a);
			a = ['people','objects','human'].includes(row['type']) ? 0.85 + 0.15*a : a ; 
		}  
				
		ra =  [ [r,cl(0.75+a/10),a  ],   // ligtht
		        [r,1            ,a/4]];  // dark
				
	} else if (room=='hotel_room_5') {  //-------------------------------------------------------------  ROOM
	
		if (row['ID']=='brillo') X = B(0,-1), Y = B(2,-1) ;
		
		var r = 220+(XYZ2J(Y,-0.5*Y+X,0)/XYZ2J(5,5,0))*3;
		r = (r%255)/255;
				
		if (!row) {
			var a = 0.95;
		} else {
			var lampon = stuff['front'][getIndexFromID('lamp')[0]]['state'] == 'on';
			var ll = lampon ? 170 : 0 ;
			var L = 8;
			var a  = gauss([X,Y],[4.5*L,1.5*L],3*L)*ll +  //lamp
					 gauss([X,Y],[3*L,3*L],3*L)*(50) + //centre
					 gauss([X,Y],[3*L,4*L],0.5*L)*(0) + //girl
					 gauss([X,Y],[0,2.5*L],2*L)*(160);  //window
			a = cl(a/255);
			if (lampon) {
				a = ['people'].includes(row['type']) ? 0.6 + 0.4*a : a ; 
				a = ['objects'].includes(row['type']) ? 0.2 + 0.8*a : a ;
				a = row['ID']=='lamp'  ? 0.2 + 0.8*a : a ; 
			} else {
				a = ['people','objects','human'].includes(row['type']) ? 0.2 + 0.8*a : a ; 
			}				
		}  
				
		ra =  [ [r,cl(0.75+a/10),a  ],   // ligtht
		        [r,1            ,a/4]];  // dark
				
	} else if (room=='other_hotel_room_1') {  //-------------------------------------------------------------  ROOM 2nd floor
	
		var r = 35+(XYZ2J(-0.5*X+Y,Y,0)/XYZ2J(5,5,0))*2;
		r = (r%255)/255;
				
		if (!row) {
			var a = 0.95;
		} else {
			var lampon = stuff['front'][getIndexFromID('lamp')[0]]['state'] == 'on';
			var ll = lampon ? 170 : 0 ;
			var L = 8;
			var a  = gauss([X,Y],[0.5*L,4.5*L],3*L)*ll +  //lamp
					 gauss([X,Y],[3*L,3*L],3*L)*(50) + //centre
					 gauss([X,Y],[4.5*L,4.5*L],0.5*L)*(100) + //phone
					 gauss([X,Y],[1.5*L,0],2*L)*(160);  //window
			a = cl(a/255);
			if (lampon) {
				a = ['people'].includes(row['type']) ? 0.6 + 0.4*a : a ; 
				a = ['objects'].includes(row['type']) ? 0.2 + 0.8*a : a ;
				a = row['ID']=='lamp'  ? 0.2 + 0.8*a : a ; 
			} else {
				a = ['people','objects','human'].includes(row['type']) ? 0.2 + 0.8*a : a ; 
			}
		}  
				
		ra =  [ [r,cl(0.75+a/10),a  ],   // ligtht
		        [r,1            ,a/4]];  // dark
				
	} else if (room=='other_hotel_room_5') {  //--------------------------------------------- OTHER ROOM 5
	
		// lights => tv and lamp. If tv is off, we have white noise, 
	
		var rng = new RNG(t);
		
				
		if (!row) {
			var r = 0.99;
			var a = 0.7;
			var b = 0.95
		} else {
			
			var r = 235-(XYZ2J(-X,Y,0)/XYZ2J(5,5,0))*2;
			r = (r%255)/255;
			
			var L = 8;
			var p = 8;
			var tvoff   = stuff['front'][getIndexFromID('tv')[0]]['state'];
			var lampoff = stuff['front'][getIndexFromID('lamp')[0]]['state'] != 'on';
			var tt = t%255;
			var T       = tvoff == 'whitenoised' ? (1 - 2*Math.abs(Math.round(tt/p)-tt/p))*0.5+0.2+0.1*rng.nextFloat() : (tvoff=='itsOn'?(tt%2?0.75:0.8):0);
			var K       = lampoff ? 0 : 150 ;
			var a  = gauss([X,Y],[1*L,4*L],3*L)*T*255 +  //tv
					 gauss([X,Y],[3*L,3*L],3*L)*(50) + //centre
					 gauss([X,Y],[4*L,0],4*L)*(10+K); //lamp
			a = cl(a/255*0.9);
			a = ['people','objects','human'].includes(row['type']) ? 0.2 + 0.8*a : a ;
			var b = cl(a*1.1)
			
		}  
				
		ra =  [ [r,cl(0.85+a/10),b  ],   // ligtht
		        [r,1            ,b/4]];  // dark
				
				
	} else if (room.slice(0,-2)=='hotel_corridor') {  //--------------------------------------- HOTEL CORRIDOR
	
		var level = room.slice(-1);
		if (level==0) {
			if (!row) {
				
				var r = 240;
				r = (r%255)/255;
				var a = 0.95;
				
			} else {
				
				var r = 255-(XYZ2J(X,Y,0)/XYZ2J(5,5,0))*5 ;
				r = (r%255)/255;
				
				if (chapter <=2) {
					var L = 8;
					var a = gauss([X,Y],[7.5*L,3.5*L],3*L)*200+40 ;
					a = cl(a/255);
					a = ['people','objects','human'].includes(row['type']) ? 0.05 + 0.95*a : a ; 					
				} else {
					var a = cl(220/255);
					a = ['people','objects','human'].includes(row['type']) ? 0.85 + 0.15*a : a ; 
				}
			}  
			
		} else {
			if (!row) {
				
				var r = 270-(level)*10 ;
				r = (r%255)/255;
				var a = 0.95;
				
			} else {
				
				var r = 255+50-(XYZ2J(X+Y,Y-X,0)/XYZ2J(7,7,0))*3+(-level)*10;
				r = (r%255)/255;
				var a = cl(220/255);
				a = ['people','objects','human'].includes(row['type']) ? 0.85 + 0.15*a : a ; 
			}  
		}
				
		ra =  [ [r,cl(0.8+a/10),a  ],   // ligtht
		        [r,1            ,a/4]];  // dark
				
	} else {  //------------------------------------------------------------------------ OTHERS
	
		var r = 255-(XYZ2J(X,Y,0)/XYZ2J(5,5,0))*5;
		r = (r%255)/255;
		
		//f1 = room['globalsets']['lamp']
		f1 = [0,1][0];
		
		if (!row) {
			
			var a = 0.95;
		} else {
			var L = 8;
			var a  = expx([X,Y,0],[  L,  0,0],1.5*L)*180/2 +
					 expx([X,Y,0],[2*L,  0,0],1.5*L)*180/2 +
					 expx([X,Y,0],[  L,3*L,0],  4*L)*(205*f1+50) +
					 expx([X,Y,0],[4*L,  0,0],    L)*150*f1;
			a = cl(a/255);
			a = ['people','objects','human'].includes(row['type']) ? 0.85 + 0.15*a : a ; 
		}  
				
		ra =  [ [r,cl(0.75+a/10),a  ],   // ligtht
		        [r,1            ,a/4]];  // dark
				
	}
	
	//console.log(ra)
	var lightColor = HSVtoRGB(ra[0][0],ra[0][1],ra[0][2]);
	var darkColor  = HSVtoRGB(ra[1][0],ra[1][1],ra[1][2]);
	
	return [[0,0,0,0],darkColor,lightColor,[0,0,0,255]];

}