﻿if (document.location.href.toLowerCase().includes("/temp/") || document.location.href.toLowerCase().includes("/private/") || hasOwnProperty.call(window, "storyFormat")) {
	// Change this to the path where this HTML file is
	// located if you want to run this from inside Twine.
	setup.Path = "H:/_EWA/dist/";  // Running inside Twine application
} else {
	setup.Path = "";  // Running in a browser
}
setup.ImagePath = setup.Path + "image/";
setup.SoundPath = setup.Path + "sound/";

/* Load jQuery UI - Start */
setup.JSLoaded = false;
importStyles(setup.Path + "CSS/jquery-ui.css");
importScripts(setup.Path + "CSS/jquery-ui.js")
	.then(function() {
		setup.JSLoaded = true;
	}).catch(function(error) {
		alert(error);
	}
);
/* Load jQuery UI - End */

window.ImgExist = function(url) {
    var img = new Image();
	
    img.onload = function () {
        if (this.complete == true){
            // 改了这里
            return true;
        }
    }
    img.onerror = function () {
        return false;
    }

	img.src = url;
	
	if (img.complete) {
	  return true;
	} else {
	  img.onload = () => {
		return true;
	  };
	  img.onerror = () => {
		return false;
	  };
	}
}

// volume slider, by chapel; for sugarcube 2
// version 1.1 - modified by HiEv for SugarCube v2.28.0+
// For custom CSS for slider use: http://danielstern.ca/range.css/#/

// create namespace
setup.vol = {};

// options object
setup.vol.options = {
	current	 : 5,
	rangeMax : 10,
	step	 : 1
};

setup.vol.last = setup.vol.options.current;
setup.vol.start = setup.vol.last / setup.vol.options.rangeMax;

postdisplay['volume-task'] = function (taskName) {
	delete postdisplay[taskName];
	SimpleAudio.volume(setup.vol.start);
};

!function () {
	$(document).on('input', 'input[name=volume]', function() {
		// grab new volume from input
		var volRef		= setup.vol.options;
		var change		= $('input[name=volume]').val();
		var newVol		= change / volRef.rangeMax;
		volRef.current	= newVol.toFixed(2);
		// change volume; set slider position
		SimpleAudio.volume(newVol);
		setup.vol.last = change;
	});
}();  // jshint ignore:line

Macro.add('volume', {
	handler : function () {
		// set up variables
		var $wrapper  = $(document.createElement('span'));
		var $slider   = $(document.createElement('input'));
		var volRef    = setup.vol.options;
		// create range input
		$slider
			.attr({
				id    : 'volume-control',
				type  : 'range',
				name  : 'volume',
				min   : '0',
				max   : volRef.rangeMax,
				step  : volRef.step,
				value : setup.vol.last
			}).addClass('VolumeSlider');
		// class '.macro-volume' and id '#volume-control' for styling
		// output
		$wrapper
			.append($slider)
			.appendTo(this.output);
	}
});

function Lang(CN,EN) {
  if(V.lang=="CN")return CN;
  if(V.lang=="EN")return EN;
}
window.Lang = Lang
DefineMacroS("lang", Lang)
