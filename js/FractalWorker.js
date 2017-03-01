var palette = null;

//functions return number from 0 to (maxIter-1)/2
var perlinFunction = function(cx, cy, maxIter, seed, sea, max,contx) {
  var iter = worldCreator(cx, cy, seed, contx);
  iter = Math.max(0,iter-sea)/(max-sea);
  iter = Math.pow(iter,3-iter);		
  iter = Math.round(maxIter*Math.min(0.999,iter));
  return iter;
}

var commands = {
	
    palette: function(data, cb) {
        palette = new Uint32Array(data.palette);
    },
	
    render: function(data,cb) {
        if (!palette) {
            cb();
            return;
        };
        
        var scale = Math.pow(2, data.z - 1);
        var x0 = data.x / scale - 1;
        var y0 = data.y / scale - 1;
        var d = 1/(scale<<8);
        var pixels = new Array(65536);
		var voxel = Math.pow(2,9);
        var iter,i=65535;
		var nivel8  = 12; //pixeles a subir de tope

		var angle   = data.input.angle;
		var pMax    = data.input.max;
		var pSea    = data.input.sea;
		var pSeed   = data.input.seed;
		var rands   = data.input.ran;
        var maxIter = data.input.maxIter;
		var type    = data.input.type;
        
        var debugIter = [];

		if(type == "perlin" ||type == "perlin3" ) {
			
          var maxIterAltura = type == "perlin" ? 64:512;          
		  i = 0;
          while (i <65536+256*nivel8*scale) {
            var px = i%256;
            var py = (i-px)>>8;
            var cx = x0 + px*d;
            var cy = y0 + py*d;		  	
		  	var ccx = (Math.cos(angle*Math.PI)*cx-Math.sin(angle*Math.PI)*cy*2);
		  	var ccy = (Math.sin(angle*Math.PI)*cx+Math.cos(angle*Math.PI)*cy*2);
		  	if( type == "perlin" )	{
		  	  ccx = Math.round(voxel*ccx+0.5)/voxel;
		  	  ccy = Math.round(voxel*ccy+0.5)/voxel;
		  	}		  	
		  	
		  	if ( Math.abs(ccx)>1 || Math.abs(ccy)>0.5 ) { 
		  	  iter = null;
		  	} else {		  				
		  	  iter = perlinFunction(ccx, ccy, maxIter, pSeed, pSea, pMax,rands);
		  	  var iimax = Math.floor( Math.floor((iter/maxIter)*maxIterAltura)/maxIterAltura*nivel8*scale );				
		  	  if(iter>0 && type == "perlin3"){
		  	  	iter = Math.min(maxIter,Math.abs(Math.round( iter*(1+0.1*noise.perlin2( ccx*Math.pow(2,13), ccy*Math.pow(2,13))) ) ));
		  	  } else if(iter>0 && type == "perlin") {
		  	  	iter = Math.min(maxIter,Math.abs(Math.round( iter+1.5*noise.perlin2( cx*Math.pow(2,13), cy*Math.pow(2,13)) ) ));
		  	  }
		  	  if( iimax < 1 && i >= 0 && i < 65536 ) {
		  	  	pixels[i] = palette[iter];
		  	  } else {
		  	  	var ii = iimax;
		  	  	while( ii>=0 ) {
		  	  	  if( i-ii*256 >= 0 && i-ii*256 < 65536 ) { 
		  	  	    pixels[i-ii*256] = palette[Math.round( (iter - (iimax-ii)*maxIterAltura/(nivel8*scale)))]; 
		  	  	  }
		  	  	ii--;
		  	  	}
		  	  }
		  	}
		  	i++;
		  }

		} else if(type == "perlin2" || type == "perlin4") {
		  i = pixels.length-1;
		  while (i >= 0) {
		  	var px = i%256;
		  	var py = (i-px)>>8;
		  	var cx = (x0 + px*d);
		  	var cy = (y0 + py*d);
		  	var ccx = type == "perlin2" ? Math.round(voxel*cx+0.5)/voxel : cx;
		  	var ccy = type == "perlin2" ? Math.round(voxel*cy+0.5)/voxel : cy;
          
		  	if ( Math.abs(ccx)>1 || Math.abs(ccy)>0.5 ) { 
		  	  iter = null;
		  	} else {				
		  	  iter = perlinFunction(ccx, ccy, maxIter, pSeed, pSea, pMax,rands);
		  	  if(iter>0 && iter > 15 ){
		  	  	iter = Math.min(maxIter,Math.abs(Math.round( iter*(1+0.1*noise.perlin2( cx*Math.pow(2,13), cy*Math.pow(2,13))) ) ));
		  	  } else if(iter>0 && iter < 15 ) {
		  	  	iter = Math.min(maxIter,Math.abs(Math.round( iter+1.*noise.perlin2( cx*Math.pow(2,13), cy*Math.pow(2,13)) ) ));
		  	  }
		  	}
		  	pixels[i--] = palette[iter];
		  }			
		}
		
        var array = new Uint32Array(pixels);
        data.pixels = array.buffer;
        cb(data,[data.pixels]);
    }
}

function callBack(a,b){
    self.postMessage(a,b);
}

self.onmessage=function(e){
    var commandName = e.data.command;
    
    if (commandName in commands) {
        commands[commandName](e.data, callBack);
    }
};

importScripts('perlin.js');
importScripts('WorldCreator.js');