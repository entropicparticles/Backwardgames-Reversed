
// Create the image TEST PSICODELIC
function createImage() {
	
	var offset = t
	// Create the ImageData object which will carry the image
	var tile = context.createImageData(width, height);
	
	// whatever rule for the keys
	var ix = 0, iy = 0
	if (keys[actionKeys.up   ]) {iy += 50; }
	if (keys[actionKeys.down ]) {iy +=-50; }
	if (keys[actionKeys.right]) {ix +=-50; }
	if (keys[actionKeys.left ]) {ix += 50; }
	
	// Loop over all of the pixels to create image
	for (var x=0; x<width;  x++) {
		for (var y=0; y<height; y++) {
	
			// Get the pixel index
			var pixelindex = (y * width + x ) * 4;
	
			// Generate a xor pattern with some random noise
			var red   = ((  x+offset+ix) % 256) ^ ((  y+offset+iy) % 256);
			var green = ((2*x+offset+ix) % 256) ^ ((2*y+offset+iy) % 256);
			var blue  = ((4*y+offset+iy) % 256) ^ ((4*x+offset+ix) % 256);	
			
			var RGBA = [red,green,blue,255];
	
			// Set the pixel data
			tile.data[pixelindex  ] = RGBA[0]; // Red
			tile.data[pixelindex+1] = RGBA[1]; // Green
			tile.data[pixelindex+2] = RGBA[2]; // Blue
			tile.data[pixelindex+3] = RGBA[3]; // Alpha
		}
	}
	context.putImageData(tile, 0, 0);
	
}