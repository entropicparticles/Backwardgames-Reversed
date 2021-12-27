
// ACTIONS ----------------------------------------------------------------------------------------

function menuCover() {
	
	// write start menu
	var cursor = (menuIndex==2) ? '>>||  ||  ' : ( (menuIndex==1) ? '  ||>>||  ' : '  ||  ||>>')
	writeText(cursor,233,62,'text_normal',false,false,false);
		
	if (actionOn) {
		if (chapter==0) { 
			if (menuIndex==2) {
				// let's go
				actionOn    = false;
				preRoom     = room;
				room        = 'hotel_room';
				firstEntry  = true;
				menuIndex   = 0;
				objectIndex = 0;
				objects     = ['mano','gun']
				loadRoom();
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
