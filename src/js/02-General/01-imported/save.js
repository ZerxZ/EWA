window.prepareSaveDetails = function (forceRun){
	if("ewaSaveDetails" in localStorage === false || forceRun === true){
		var saveDetails = {autosave: null, slots:[null,null,null,null,null,null,null,null,null,null]}
		var SugarCubeSaveDetails = Save.get();
		if(SugarCubeSaveDetails.autosave != null){
			saveDetails.autosave = {
				title:SugarCubeSaveDetails.autosave.title,
				date:SugarCubeSaveDetails.autosave.date,
				metadata:SugarCubeSaveDetails.autosave.metadata
			}
			if(saveDetails.autosave.metadata === undefined){
				saveDetails.autosave.metadata = {saveName:""};
			}
			if(saveDetails.autosave.metadata.saveName === undefined){
				saveDetails.autosave.metadata.saveName = "";
			}
		}
		for (var i=0; i<SugarCubeSaveDetails.slots.length;i++){
			if(SugarCubeSaveDetails.slots[i] !== null){
				saveDetails.slots[i] = {
					title:SugarCubeSaveDetails.slots[i].title,
					date:SugarCubeSaveDetails.slots[i].date,
					metadata:SugarCubeSaveDetails.slots[i].metadata
				};
				if(saveDetails.slots[i].metadata === undefined){
					saveDetails.slots[i].metadata = {saveName:"old save", saveId:0}
				}
				if(saveDetails.slots[i].metadata.saveName === undefined){
					saveDetails.slots[i].metadata.saveName = "old save";
				}
			}else{
				saveDetails.slots[i] = null;
			}
		}

		localStorage.setItem("ewaSaveDetails" ,JSON.stringify(saveDetails));
	}
	return;
}

window.setSaveDetail = function (saveSlot, metadata, story){
	var saveDetails = JSON.parse(localStorage.getItem("ewaSaveDetails"));
	if(saveSlot === "autosave"){
		saveDetails.autosave = {
			title:SugarCube.Story.get(V.passage).description(),
			date:Date.now(),
			metadata:metadata
		};
	}else{
		var slot = parseInt(saveSlot);
		saveDetails.slots[slot] = {
			title:SugarCube.Story.get(V.passage).description(),
			date:Date.now(),
			metadata:metadata
		};
	}
	localStorage.setItem("ewaSaveDetails" ,JSON.stringify(saveDetails));
}

window.getSaveDetails = function (saveSlot){
	if("ewaSaveDetails" in localStorage) return JSON.parse(localStorage.getItem("ewaSaveDetails"));
}

window.deleteSaveDetails = function (saveSlot){
	var saveDetails = JSON.parse(localStorage.getItem("ewaSaveDetails"));
	if(saveSlot === "autosave"){
		saveDetails.autosave = null;
	}else{
		var slot = parseInt(saveSlot);
		saveDetails.slots[slot] = null;
	}
	localStorage.setItem("ewaSaveDetails" ,JSON.stringify(saveDetails));
}

window.deleteAllSaveDetails = function (saveSlot){
	var saveDetails = {autosave: null, slots:[null,null,null,null,null,null,null,null,null,null]};
	localStorage.setItem("ewaSaveDetails" ,JSON.stringify(saveDetails));
}

window.returnSaveDetails = function () {
	return Save.get();
}

window.resetSaveMenu = function () {
	new Wikifier(null, '<<resetSaveMenu>>');
}

window.loadSave = function (saveSlot, confirm) {
	if (V.confirmLoad === true && confirm === undefined) {
		new Wikifier(null, '<<loadConfirm ' + saveSlot + '>>');
	} else {
		if (saveSlot === "auto") {
			Save.autosave.load();
		} else {
			Save.slots.load(saveSlot);
		}
	}
}

window.save = function (saveSlot, confirm, saveId, saveName) {
	if (saveId == null) {
		new Wikifier(null, '<<saveConfirm ' + saveSlot + '>>');
	} else if ((V.confirmSave === true && confirm != true) || (V.saveId != saveId && saveId != null)) {
		new Wikifier(null, '<<saveConfirm ' + saveSlot + '>>');
	} else {
		if (saveSlot != undefined) {
			updateSavesCount();
			Save.slots.save(saveSlot, null, { "saveId": saveId, "saveName": saveName });
			setSaveDetail(saveSlot, { "saveId": saveId, "saveName": saveName })
			V.currentOverlay = null;
			overlayShowHide("customOverlay");
		}
	}
}

window.deleteSave = function (saveSlot, confirm) {
	if (saveSlot === "all") {
		if (confirm === undefined) {
			new Wikifier(null, '<<clearSaveMenu>>');
			return;
		} else if (confirm === true) {
			Save.clear();
			deleteAllSaveDetails();
		}
	} else if (saveSlot === "auto") {
		if (V.confirmDelete === true && confirm === undefined) {
			new Wikifier(null, '<<deleteConfirm ' + saveSlot + '>>');
			return;
		} else {
			Save.autosave.delete();
			deleteSaveDetails("autosave");
		}
	} else {
		if (V.confirmDelete === true && confirm === undefined) {
			new Wikifier(null, '<<deleteConfirm ' + saveSlot + '>>');
			return;
		} else {
			Save.slots.delete(saveSlot);
			deleteSaveDetails(saveSlot)
		}
	}
	new Wikifier(null, '<<resetSaveMenu>>');
}

window.importSave = function (saveFile) {
	if (!window.FileReader) return; // Browser is not compatible

	var reader = new FileReader();

	reader.onloadend = function () {
		DeserializeGame(this.result);
	}

	reader.readAsText(saveFile[0]);
}

window.SerializeGame = function () { return Save.serialize(); }; window.DeserializeGame = function (myGameState) { return Save.deserialize(myGameState) };

window.getSaveData = function () {
	var input = document.getElementById("saveDataInput");
	updateExportDay();
	input.value = Save.serialize();
}

window.loadSaveData = function () {
	var input = document.getElementById("saveDataInput");
	var result = Save.deserialize(input.value);
	if (result === null) {
		input.value = "Invalid Save."
	}
}

window.clearTextBox = function (id) {
	document.getElementById(id).value = "";
}

window.topTextArea = function (id) {
	var textArea = document.getElementById(id);
	textArea.scroll(0, 0);
}

window.bottomTextArea = function (id) {
	var textArea = document.getElementById(id);
	textArea.scroll(0, textArea.scrollHeight);
}

window.copySavedata = function (id) {
	var saveData = document.getElementById(id);
	saveData.focus();
	saveData.select();

	try {
		var successful = document.execCommand('copy');
	} catch (err) {
		var copyTextArea = document.getElementById("CopyTextArea");
		copyTextArea.value = "Copying Error";
		console.log('Unable to copy: ', err);
	}
}

window.copySavedata = function (id) {
	var saveData = document.getElementById(id);
	saveData.focus();
	saveData.select();

	try {
		var successful = document.execCommand('copy');
	} catch (err) {
		var copyTextArea = document.getElementById("CopyTextArea");
		copyTextArea.value = "Copying Error";
		console.log('Unable to copy: ', err);
	}
}

window.updateExportDay = function(){
	if(V.saveDetails != undefined && SugarCube.State.history[0].variables.saveDetails != undefined){
		V.saveDetails.exported.days = clone(V.days);
		SugarCube.State.history[0].variables.saveDetails.exported.days = clone(SugarCube.State.history[0].variables.days);
		V.saveDetails.exported.count++;
		SugarCube.State.history[0].variables.saveDetails.exported.count++;
		V.saveDetails.exported.dayCount++;
		SugarCube.State.history[0].variables.saveDetails.exported.dayCount++;
		var sessionJson = sessionStorage.getItem(SugarCube.Story.domId + ".state");
		if(sessionJson != undefined){
			var session = JSON.parse(sessionJson);
			session.delta[0].variables.saveDetails.exported.days = clone(V.days);
			session.delta[0].variables.saveDetails.exported.dayCount++;
			session.delta[0].variables.saveDetails.exported.count++;
			sessionStorage.setItem(SugarCube.Story.domId + ".state", JSON.stringify(session));
		}
	}
}

window.updateSavesCount = function(){
	if(V.saveDetails != undefined && SugarCube.State.history[0].variables.saveDetails != undefined){
		V.saveDetails.slot.count++;
		SugarCube.State.history[0].variables.saveDetails.slot.count++;
		V.saveDetails.slot.dayCount++;
		SugarCube.State.history[0].variables.saveDetails.slot.dayCount++;
		var sessionJson = sessionStorage.getItem(SugarCube.Story.domId + ".state");
		if(sessionJson != undefined){
			var session = JSON.parse(sessionJson);
			session.delta[0].variables.saveDetails.slot.dayCount++;
			session.delta[0].variables.saveDetails.slot.count++;
			sessionStorage.setItem(SugarCube.Story.domId + ".state", JSON.stringify(session));
		}
	}
}

window.importSettings = function (data, type) {
	switch(type){
		case "text":
			V.importString = document.getElementById("settingsDataInput").value
			new Wikifier(null, '<<displaySettings "importConfirmDetails">>');
			break;
		case "file":
			var reader = new FileReader();
			reader.addEventListener('load', function (e) {
				V.importString = e.target.result;
				new Wikifier(null, '<<displaySettings "importConfirmDetails">>');
			});
			reader.readAsBinaryString(data[0]);
			break;
		case "function":
			importSettingsData(data);
			break;
	}
}

var importSettingsData = function (data) {
	var S = null;
	var result = data;
	if (result != null && result != undefined) {
		//console.log("json",JSON.parse(result));
		S = JSON.parse(result);
		if (V.passage === "Start" && S.starting != undefined) {
			S.starting = settingsConvert(false, "starting", S.starting)
		}
		if(S.general != undefined){
			S.general = settingsConvert(false, "general", S.general)
		}

		if (V.passage === "Start" && S.starting != undefined) {
			var listObject = settingsObjects("starting");
			var listKey = Object.keys(listObject);
			var namedObjects = ["player", "skinColor"];

			for (var i = 0; i < listKey.length; i++) {
				if (namedObjects.includes(listKey[i]) && S.starting[listKey[i]] != undefined) {
					var itemKey = Object.keys(listObject[listKey[i]]);
					for (var j = 0; j < itemKey.length; j++) {
						if (V[listKey[i]][itemKey[j]] != undefined && S.starting[listKey[i]][itemKey[j]] != undefined) {
							if (validateValue(listObject[listKey[i]][itemKey[j]], S.starting[listKey[i]][itemKey[j]])) {
								V[listKey[i]][itemKey[j]] = S.starting[listKey[i]][itemKey[j]];
							}
						}
					}
				} else if (!namedObjects.includes(listKey[i])) {
					if (V[listKey[i]] != undefined && S.starting[listKey[i]] != undefined) {
						if (validateValue(listObject[listKey[i]], S.starting[listKey[i]])) {
							V[listKey[i]] = S.starting[listKey[i]];
						}
					}
				}
			}
		}

		if (S.general != undefined) {
			var listObject = settingsObjects("general");
			var listKey = Object.keys(listObject);
			var namedObjects = ["map", "skinColor", "shopDefaults"];

			for (var i = 0; i < listKey.length; i++) {
				if (namedObjects.includes(listKey[i]) && S.general[listKey[i]] != undefined) {
					var itemKey = Object.keys(listObject[listKey[i]]);
					for (var j = 0; j < itemKey.length; j++) {
						if (V[listKey[i]][itemKey[j]] != undefined && S.general[listKey[i]][itemKey[j]] != undefined) {
							if (validateValue(listObject[listKey[i]][itemKey[j]], S.general[listKey[i]][itemKey[j]])) {
								V[listKey[i]][itemKey[j]] = S.general[listKey[i]][itemKey[j]];
							}
						}
					}
				} else if (!namedObjects.includes(listKey[i])) {
					if (V[listKey[i]] != undefined && S.general[listKey[i]] != undefined) {
						if (validateValue(listObject[listKey[i]], S.general[listKey[i]])) {
							V[listKey[i]] = S.general[listKey[i]];
						}
					}
				}
			}
		}

		if (S.npc != undefined) {
			var listObject = settingsObjects("npc");
			var listKey = Object.keys(listObject);
			for (var i = 0; i < V.NPCNameList.length; i++) {
				if (S.npc[V.NPCNameList[i]] != undefined) {
					for (var j = 0; j < listKey.length; j++) {
						//Overwrite to allow for "none" default value in the start passage to allow for rng to decide
						if (V.passage === "Start" && ["pronoun","gender"].includes(listKey[j]) && S.npc[V.NPCNameList[i]][listKey[j]] === "none"){
							V.NPCName[i][listKey[j]] = S.npc[V.NPCNameList[i]][listKey[j]];
						}
						else if (validateValue(listObject[listKey[j]], S.npc[V.NPCNameList[i]][listKey[j]])) {
							V.NPCName[i][listKey[j]] = S.npc[V.NPCNameList[i]][listKey[j]];
						}
					}
				}
			}
		}
	}
}

window.validateValue = function (keys, value) {
	//console.log("validateValue",keys,value);
	var keyArray = Object.keys(keys);
	var valid = false;
	if (keyArray.length === 0) {
		valid = true;
	}
	if (keyArray.includes("min")) {
		if (keys.min <= value && keys.max >= value) {
			valid = true;
		}
	}
	if (keyArray.includes("decimals") && value != undefined) {
		if (value.toFixed(keys.decimals) != value) {
			valid = false;
		}
	}
	if (keyArray.includes("bool")) {
		if (value === true || value === false) {
			valid = true;
		}
	}
	if (keyArray.includes("boolLetter")) {
		if (value === "t" || value === "f") {
			valid = true;
		}
	}
	if (keyArray.includes("strings") && value != undefined) {
		if (keys.strings.includes(value)) {
			valid = true;
		}
	}
	return valid;
}

window.loadExternalExportFile = function () {
	importScripts("ewaSettingsExport.json")
		.then(function () {
			var textArea = document.getElementById("settingsDataInput");
			textArea.value = JSON.stringify(ewaSettingsExport);
		})
		.catch(function (err) {
			//console.log(err);
			var button = document.getElementById("LoadExternalExportFile");
			button.value = "Error Loading";
		});
}

// !!Hack warning!! Don't use it maybe?
window.updateMoment = function () {
	// change last (and only) moment in local history
	State.history[State.history.length - 1].variables = JSON.parse(JSON.stringify(V));
	// prepare the moment object with modified history
	let moment = SugarCube.State.marshalForSave();
	// replace moment.history with moment.delta, because that's what SugarCube expects to find
	// this is a bad thing to do probably btw, because while history and delta appear to look very similar,
	// they're not always the same thing, SugarCube actually decodes delta into history (see: https://github.com/tmedwards/sugarcube-2/blob/36a8e1600160817c44866205bc4d2b7730b2e70c/src/state.js#L527)
	// but for my purpose it works (i think?)
	delete Object.assign(moment, {delta: moment.history}).history;
	// replace saved moment in session with the new one
	let gameName = SugarCube.Story.domId;
	sessionStorage[gameName + ".state"] = JSON.stringify(moment);
	// it appears that this line is not necessary for it to work
	//SugarCube.session._engine[gameName + ".state"] = JSON.stringify(moment);

	// Voilà! F5 will reload the current state now without going to another passage!
}

window.isJsonString = function(s) {
	try {
		JSON.parse(s);
	} catch (e) {
		return false;
	}
	return true;
}
