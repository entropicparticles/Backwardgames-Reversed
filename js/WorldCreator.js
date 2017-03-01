//functions return number from 0 to (maxIter-1)
function worldCreator(cx, cy, perlinSeed, rands) {
  var iter,mount,continental;
  var ccx = cx;
  var ccy = cy;
		
  // Mountains
  mount = (noise.perlin2(ccx*2.,ccy*2.)+1)/12 + (noise.perlin2(ccx*16,ccy*16)+1)/8/16;
  mount = Math.pow(Math.abs((1-Math.abs((mount-0.1)/(0.23-0.1)))),14);
  
  var sum = 0;
  for(kk=0; kk < rands[0]; kk++ ) {
  	sum += Math.exp( -0.5*( Math.pow(ccx-0.75*rands[kk+1],2)+Math.pow(ccy-0.75*rands[kk+7],2) )/(2*0.01*rands[kk+13]) );
  }
  continental = Math.min( 0.75, sum );
  
  sum = 0;
  noise.seed(perlinSeed);
  for(kk=2; kk <= 6; kk+=2 ) {
  	q = Math.pow(2,kk);
  	sum +=  (noise.perlin2( ccx*q, ccy*q)+1)/2/Math.sqrt(q);
  }
  // Perlin plus some extra elevation for making an island (arbitrary)
  iter = sum*0.25*Math.pow(Math.abs(Math.cos((ccx)*Math.PI/2)*Math.cos((ccy)*Math.PI)),0.4);	
  iter = 0.9*iter + 0.9*(0.06*mount + 0.1*continental);
  return iter;
}