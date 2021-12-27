
function runAction() {
		
	for (var k=0; k<actions['background'].length; ++k) {
		act = actions['background'][k];
		eval(act['function']);
	}
	for (var k=0; k<actions['front'].length; ++k) {
		act = actions['front'][k];
		if ( colision([guy.X,guy.Y],[guy.DX,guy.DY],[act.X,act.Y],[act.DX,act.DY]) ) {
			eval(act['function']);
		}
	}

}

function menuCover() {
	
	// write start menu
	var cursor = (menuIndex==2) ? '>>||  ||  ' : ( (menuIndex==1) ? '  ||>>||  ' : '  ||  ||>>')
	writeText(cursor,233,62,'text_normal',false,false,false);
		
	if (actionOn) {
		if (chapter==0) { 
			if (menuIndex==2) {
				// let's go
				actionOn = false;
				preRoom = room;
				room = 'hotel_room';
				loadRoom()
			} else if (menuIndex==1) {
				// let's go for the menu
				blockKeys = true;
			} else if (menuIndex==0) {
				// let's restart
				actionOn = false;
				location.reload();
			}
		}
	} else {
		blockKeys = false;
	}
	
}
