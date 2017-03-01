var paletteController = {
	
    //each generator receives index from 0 to 1 and return RGBA values (as array of 4 numbers 0<= x <= 255)
    _paletteGenerators: {
		
        'land': function(colorIndex) {
            var value = colorIndex;
			var op = 255;
			if(value<0) { value=Math.abs(value);}
			// RGB and scale values for the color palette
			var cRed   = [0    ,0.7  ,0.133,0.2  ,0.35 ,0.7  ,1    ,1];
			var cGreen = [0.1  ,0.6  ,0.2  ,0.3  ,0.3  ,0.6  ,1    ,1];
			var cBlue  = [0.24 ,0.4  ,0.067,0.1  ,0.2  ,0.4  ,1    ,1];
			var w      = [0.000,0.002,0.003,0.150,0.300,0.500,0.700,1.000];
			// Asigning colors
			var kk = 0;
			while( value >= w[kk] ) {kk++;}
			kk--;
			rr = (value-w[kk])/(w[kk+1]-w[kk])*(cRed[kk+1]  -cRed[kk]  )+cRed[kk];
			gg = (value-w[kk])/(w[kk+1]-w[kk])*(cGreen[kk+1]-cGreen[kk])+cGreen[kk];
			bb = (value-w[kk])/(w[kk+1]-w[kk])*(cBlue[kk+1] -cBlue[kk] )+cBlue[kk];
			return[Math.round(255*rr),Math.round(255*gg),Math.round(255*bb),Math.round(op)];
        },
		
        'matrix': function(colorIndex) {
            var rr = colorIndex;
			var a = 0.7;
			if (rr>a) { 
			  return[Math.round( 255*(rr-a)/(1-a) ),255,Math.round( 255*(rr-a)/(1-a) ),255]; 
			} else {
			  return[0,Math.round( 255*rr/a ),0,255];
			}
        }
		
    },
	
    addPalette: function(paletteName, paletteGenerator) {
        this._paletteGenerators[paletteName] = paletteGenerator;
    },
	
    getPaletteAsBuffer: function(paletteName, numIndexes) {
        if (!(paletteName in this._paletteGenerators)) {
            return;
        }
        var generator = this._paletteGenerators[paletteName];
        var res = new Array(numIndexes+1);
        for (var c = 0; c < numIndexes+1; c++) {
            var color = generator(c / numIndexes);
            res[c] = color[0] + (color[1]<<8) + (color[2]<<16) + (color[3]<<24);
        }
        return (new Uint32Array(res)).buffer;
    },
	
    forEach: function(callback) {
        for (var p in this._paletteGenerators) {
            callback(p);
        }
    }
}
