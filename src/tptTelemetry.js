//***
//examples and helper functions
//***

var g_savestate = {
	"tutorial_complete": {"LAND":false,"WATER":false,"MANMADE":false,"EXPERT":false},
	"terrain_unlocked": {"LAND":true,"WATER":false,"MANMADE":false,"EXPERT":false},
	"game_state": {"landType": "LAND", "diff": "TUTORIAL", "level": 0, "phase": "levelselect"},
	"telemetry": {"session_id":0},
	"clue_mastery_p1": "0",
	"clue_mastery_p2": "0",
	"search_mastery": "0",
	"clue_track_p1": [[],[],[],[]],
	"clue_track_p2": [[],[],[],[]],
	"search_track": [[],[],[],[]]
};

var g_startTime = (new Date).getTime();

var g_telemetry_cache = [];

clearSave = function(appRef) {
	g_savestate = {
		"tutorial_complete": {"LAND":false,"WATER":false,"MANMADE":false,"EXPERT":false},
		"terrain_unlocked": {"LAND":true,"WATER":false,"MANMADE":false,"EXPERT":false},
		"game_state": {"landType": "LAND", "diff": "TUTORIAL", "level": 0, "phase": "levelselect"},
		"telemetry": {"session_id":0},
		"clue_mastery_p1": "0",
		"clue_mastery_p2": "0",
		"search_mastery": "0",
		"clue_track_p1": [[],[],[],[]],
		"clue_track_p2": [[],[],[],[]],
		"search_track": [[],[],[],[]]
	};
	saveState(appRef);
};

var saveState = function(appRef) {
	g_savestate.game_state.landType = g_LevelTerrain;
	g_savestate.game_state.diff = g_selectedDifficulty;
	g_savestate.game_state.level = g_selectedLevel;
	//save local
	localStorage.setItem("savestate", JSON.stringify(g_savestate));
	//save remote
	appRef.container.send("game_data_save", {is_second_player: false, "game_data": JSON.stringify(g_savestate)});
};

var loadState = function() {
	//load save from BE if availible, otherwise fall back to localstorage
	if(typeof g_BEuserdata === "undefined") {
		g_savestate = (localStorage.getItem("savestate") == null) ? g_savestate : JSON.parse(localStorage.getItem("savestate"));
	} else {
		if(g_BEuserdata.data[0].game_data == "") {
			g_savestate = (localStorage.getItem("savestate") == null) ? g_savestate : JSON.parse(localStorage.getItem("savestate"));
		} else {
			g_savestate = JSON.parse(g_BEuserdata.data[0].game_data);
		}
	}
	g_LevelTerrain = g_savestate.game_state.landType;
	g_selectedDifficulty = g_savestate.game_state.diff;
	g_selectedLevel = g_savestate.game_state.level;
	if(g_savestate.telemetry === undefined) {
		g_savestate.telemetry = {};
		g_savestate.telemetry.session_id = 0;
	} else {
		g_savestate.telemetry.session_id += 1;
	}
};

var resumeState = function() {
	if(g_savestate.game_state !== undefined) {
		setToLevel(g_savestate.game_state.landType, g_savestate.game_state.diff, g_savestate.game_state.level, g_savestate.game_state.phase);
	} else {
		console.log("missing game state data");
	}	
};

//***
//samlePlayerObject
//**
player = (function() {
	var currentplayer = 1;

	var setPlayerImg_ = function() {
		if(currentplayer === 0) {
			jQuery("#playerIcon").html("");
		} else {
			jQuery("#playerIcon").html("<img style='width:100%;height:100%' src='assets/images/icon_p"+currentplayer+".png'>");
		}
	};
	
	var togglePlayer_ = function(callback) {
		currentplayer = currentplayer === 1 ? 2 : 1;
		setPlayerImg_();
		openPlayerModal_(callback);
	};
	var getPlayer_ = function() {
		return currentplayer;
	};
	var setPlayer_ = function(playerNum, callback) {
		currentplayer = playerNum;
		setPlayerImg_();
		openPlayerModal_(callback);
	};

	return {
		"togglePlayer":togglePlayer_,
		"getPlayer": getPlayer_,
		"setPlayer": setPlayer_
	};
})();

//***
//Main Utility
//***


var tptTelemetry = (function(){
	
	var last_five = [];

	var empty_tobj = {
		"event_name": "",
		"device_time_stamp": "",
		"time_played": "",
		"game_version": "0.1",
		"session_id": "",
		"task_id": "",
		"attempt_num": "",
		"pass_fail": "",
		"mastery_up": "",
		"as_mastery_p1": "",
		"as_mastery_p2": "",
		"rl_mastery": "",
		"correct_selection": "",
		"player_selection": ""
	};

	var container = { 
		"isSecondPlayer": false,
		"event_name": ""
	};

	//send telemetry event using springroll container
	var sendEvent = function(appRef, eventName, eventData){
		if(appRef === undefined) {
			return;
		}
		if(eventData === undefined){eventData = {};}
		if(eventName === undefined){eventName = "";}

		var eventObj = jQuery.extend({},container);

		eventObj.event_name = eventData.event_name;
		eventObj.event_data = JSON.stringify(eventData);

		//player
		eventObj.isSecondPlayer = (player.getPlayer() == 2);

		appRef.container.send(eventName, eventObj);
	};
	
	//create telemetry event object and store locally
	var createEvent = function(appRef, eventName, eventData){
		if(eventData === undefined){eventData = {};}
		if(eventName === undefined){eventName = "";}

		//fill passed event name
		var eventObj = JSON.parse(JSON.stringify(empty_tobj));
		eventObj.event_name = eventName;

		//fill time
		var timeobj = new Date();
		var datestr = "" + (timeobj.getMonth() + 1) + "/" + timeobj.getDate() + "/" + timeobj.getFullYear() + "/" + timeobj.getHours() + "/" + timeobj.getMinutes() + "/" + timeobj.getSeconds();
		eventObj.device_time_stamp = datestr;
		//fill task id
		eventObj.task_id = "";
		if(eventObj.event_name == "start_game" || eventObj.event_name == "quit_game") {
			//eventObj.task_id = "";
		} else {
			eventObj.task_id = g_leveldata[g_LevelTerrain][g_selectedDifficulty][parseInt(g_selectedLevel)].taskid;
		}

		eventObj.as_mastery_p1 = g_savestate.clue_mastery_p1;
		eventObj.as_mastery_p2 = g_savestate.clue_mastery_p2;
		eventObj.rl_mastery = g_savestate.search_mastery;
		//fill time played. currently in ms
		var timeplayedms = (new Date).getTime() - g_startTime;
		var seconds = parseInt(timeplayedms / 1000) % 60 ;
		var minutes = parseInt(timeplayedms / (1000*60)) % 60;
		var hours   = parseInt(timeplayedms / (1000*60*60)) % 24;
		eventObj.time_played = "" + hours + "/" + minutes + "/" + seconds;
		//session id
		eventObj.session_id = g_savestate.telemetry.session_id;

		//fill in passed event data
		var eventKeys = Object.keys(eventData);
		for(var i = 0; i < eventKeys.length; i++) {
			eventObj[eventKeys[i]] = eventData[eventKeys[i]];
		}

		g_telemetry_cache.push(eventObj); //store event info locally
		sendEvent(appRef, "telemetry_save", eventObj); //send event to container
	};
	
	//create csv report of local telemetry event cache
	var createLocalReport = function() {
		var reportKeys = Object.keys(empty_tobj);
		var blobout = "";

		//create csv headers
		for(var i = 0; i < reportKeys.length - 1; i++) {
			blobout += '"'+reportKeys[i]+'",';
		}
		blobout += '"'+reportKeys[reportKeys.length - 1]+'"\n';

		//create csv content
		for(var i = 0; i < g_telemetry_cache.length; i++) {
			for(var j = 0; j < reportKeys.length - 1; j++) {
				blobout += '"'+g_telemetry_cache[i][reportKeys[j]]+'",';
			}
			blobout += '"'+g_telemetry_cache[i][reportKeys[reportKeys.length - 1]]+'"\n';
		}

		//file out
		let f = new Blob([blobout], {type: "text/plain;charset=utf-8"});
		saveAs(f, "SampleTelemetry.csv");
	};

	//Allow user to type "print" to generate telemetry csv
	window.addEventListener('keyup',function(event){
		var kcode = event.keyCode;
		last_five.push(kcode);
		if(last_five.length > 5) {
			last_five.splice(0,1);
		}
		if(last_five.length == 5) {
			if(last_five[0] == 80 && last_five[1] == 82 && last_five[2] == 73 && last_five[3] == 78 && last_five[4] == 84) {
				last_five = [];
				createLocalReport();
			}
		}
	});

	return {
		"sendEvent":sendEvent,
		"createEvent":createEvent,
		"createLocalReport":createLocalReport
	};
})();