/*
	Photoshop script to generate all iOS app icon PNGs
	https://github.com/jessesquires/app-icons-script

	See included README and LICENSE for details.

	Modifications
    Copyright (c) 2019 Richard Pilbery
		Copyright (c) 2014 Jesse Squires
		Copyright (c) 2012 Josh Jones

	Copyright (c) 2010 Matt Di Pasquale
*/

//	Turn debugger on
//	0 is off.
// 	$.level = 1;

var initialPrefs = app.preferences.rulerUnits;

function main() {
	//	prompt user to select source file, cancel returns null
	var sourceFile = File.openDialog("Select a 1:1 sqaure PNG file that is at least 1024x1024.", "*.png", false);
	if (sourceFile == null)  {
		// user canceled
		return;
	}

	var doc = open(sourceFile, OpenDocumentType.PNG);
	if (doc == null) {
		alert("Oh shit!\nSomething is wrong with the file. Make sure it is a valid PNG file.");
		return;
	}

	app.preferences.rulerUnits = Units.PIXELS;

	if (doc.width != doc.height || doc.width < 1024 || doc.height < 1024) {
		alert("What the fuck is this?!\nImage failed validation. Please select a 1:1 sqaure PNG file that is at least 1024x1024.");
		restorePrefs();
		return;
	}

	//	folder selection dialog
	var destFolder = Folder.selectDialog("Choose an output folder.\n*** Warning! ***\nThis will overwrite any existing files with the same name in this folder.");
	if (destFolder == null) {
		// user canceled
		restorePrefs();
		return;
	}

	//	save icons in PNG-24 using Save for Web
	var saveForWeb = new ExportOptionsSaveForWeb();
	saveForWeb.format = SaveDocumentType.PNG;
	saveForWeb.PNG8 = false;
	saveForWeb.transparency = true;

	//	delete metadata
	doc.info = null;

	var icons = [
		{"name": "icon-72x72", "size":72},
		{"name": "icon-96x96", "size":96},
		{"name": "icon-128x128", "size":128},
		{"name": "icon-144x144", "size":144},
		{"name": "icon-152x152", "size":152},
		{"name": "icon-192x192", "size":192},
		{"name": "icon-384x384", "size":384},
		{"name": "icon-512x512", "size":512},

	];

	var initialState = doc.activeHistoryState;

	for (var i = 0; i < icons.length; i++) {
		var eachIcon = icons[i];

		doc.resizeImage(eachIcon.size, eachIcon.size, null, ResampleMethod.BICUBICSHARPER);

		var destFileName = eachIcon.name + ".png";

		doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, saveForWeb);

		// undo resize
		doc.activeHistoryState = initialState;
	}

	alert("Success!\nAll ionic icons created and saved. Splendid. 🎉 🍺");

	doc.close(SaveOptions.DONOTSAVECHANGES);

	restorePrefs();
}

function restorePrefs() {
	app.preferences.rulerUnits = initialPrefs;
}

main();

