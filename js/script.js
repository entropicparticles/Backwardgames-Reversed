var hash = window.location.hash.split("#");

// Number of web workers
var numWorkers = 5;
	
// Seed for Perlin noise (random, different in every reload)
var seed = Math.round(65536*Math.random());
// Initiating Perlin noise
noise.seed(seed);

// Set of parameters for generating lands
var contx=[]
contx[0] = Math.floor(Math.random()*3)+4;
for (var i=1; i<=5; i+=2) contx[i]=Math.random()-1;
for (var i=2; i<=6; i+=2) contx[i]=Math.random();
for (var i=7; i<=12;i++ ) contx[i]=Math.random()-0.5;
for (var i=13;i<=18;i++ ) contx[i]=Math.random()/2+0.5;

// Mapping for finding maximun and minimum for rescaling
var npoints = Math.pow(2,8);
var min = 1000000, max = -1000000;
for (var k=0; k < npoints*npoints*2; k++) {
  var i = k%(npoints*2);
  var j = Math.floor(k/(npoints*2));
  var cx = (-1.0 + (i + Math.random()-0.5)/npoints);
  var cy = (-0.5 + (j + Math.random()-0.5)/npoints);
  var iter = worldCreator(cx, cy, seed, contx);
  if(iter > max) max = iter;
  if(iter < min) min = iter;
}

var nivel8 = hash[1] || 12;
// Input parameters for the layers
var inputs = [];
for (var i=0; i<6; ++i){
  inputs[i] = {
    'type': 'perlin',
    'maxIter': Math.pow(2,12),
    'seed': seed,
    'sea':(max+min)/2,
    'max': 1.01*max,
    'ran': contx,
    'angle': 1.75,
    'nivel8': nivel8
  }
}
inputs[1].angle = 1.25;
inputs[2].angle = 0.75;
inputs[3].angle = 0.25;
inputs[4].type = 'perlin3';
inputs[5].type = 'perlin4';

// Let's go with the map!
var map = L.map('map', {
  minZoom:2,
  maxZoom:6
});

var reloadControl = L.Control.extend({
  options: {
    position: 'topright' 
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },
  onAdd: function (map) {
    var div = L.DomUtil.create('div', 'reload');
	div.innerHTML = '<input type="button" value="New map" onClick="window.location.reload()">';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
  }
});

var names = ["<i class='fa fa-cubes'></i> <i class='fa fa-location-arrow'></i>","<i class='fa fa-cubes'></i> <i class='fa fa-rotate-90 fa-location-arrow'></i>","<i class='fa fa-cubes'></i> <i class='fa fa-rotate-180 fa-location-arrow'></i>","&#8201;<i class='fa fa-globe'>&#8201; <i class='fa fa-location-arrow'></i>","<i class='fa fa-cubes'></i> <i class='fa fa-rotate-270 fa-location-arrow'></i>","<i class='fa fa-map'></i>"];	
var layerMaps = {}

for(var i=0;i<names.length;i++){
  layerMaps[names[i]] = L.tileLayer.fractalLayer(paletteController, numWorkers,inputs[i]);
}
var ini = hash[2] || 0;
layerMaps[names[ini]].addTo(map);

var lc=L.control.layers(layerMaps,{},{position:"topright",collapsed:false}).addTo(map);
map.setView([0, 0], 2).addControl(new PaletteControl(layerMaps, {position: "topright"})).addControl(new reloadControl() );






	