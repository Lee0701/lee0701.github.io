
var hanja = {};
var hanjaRegex = [];
var hanjaWords = {};
var hanjaWordsRegex = [];
var shinjache = {};
var shinjacheRegex = [];
var kancheja = {};
var kanchejaRegex = [];

var hanjaLoaded = false;
var hanjaWordsLoaded = false;

var hanjaMode = 0;

var getText = function(path, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success)
					success(xhr.responseText);
			} else {
				if (error)
					error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}

var replacePunctuations = function() {
	var entries = document.getElementsByClassName("entry");
	for(var i in entries) {
		var entry = entries[i];
		var txt = entry.innerHTML;
		if(txt === undefined) continue;
		txt = txt.replace(/([^\w])\./g, function(match, g1) {return g1 + "<span class=\"punc\">。</span>";});
		txt = txt.replace(/([^\w])\,/g, function(match, g1) {return g1 + "<span class=\"punc\">、</span>";});
		txt = txt.replace(/([^\w])\?/g, function(match, g1) {return g1 + "？";});
		txt = txt.replace(/([^\w])\!/g, function(match, g1) {return g1 + "！";});
		entry.innerHTML = txt;
	}
}

var replaceHanjaTable = function(txt, table, regex) {
	txt = txt.replace(new RegExp(regex, 'g'), function(matched) {
		return table[matched];
	});
	return txt;
}

var replaceRemainingHanjas = function(txt) {
}

var replaceHanja = function(table, regex) {
	var entries = document.getElementsByClassName("entry");
	var len = entries.length;
	for(var i = 0 ; i < len ; i++) {
		var entry = entries[i];
		var txt = entry.innerHTML;
		if(txt === undefined) continue;
		txt = replaceHanjaTable(txt, table, regex);
		entry.innerHTML = txt;
	}
}

var loadDics = function() {
	getText('/assets/hanja.txt', function(data) {
		var lines = data.split('\n');
		for(var i in lines) {
			var line = lines[i];
			if(line.charAt(0) == '#') continue;
			var splitted = line.split('\t');
			if(splitted.length <= 1) continue;
			if(splitted[0].length == 0 || splitted[1].length == 0) continue;
			hanjaRegex.push(splitted[0]);
			hanja[splitted[0]] = splitted[1];
		}
		hanjaRegex = hanjaRegex.join('|');
		setTimeout(onHanjaReady, 0);
	});
	getText('/assets/hanjaWords.txt', function(data) {
		var lines = data.split('\n');
		for(var i in lines) {
			var line = lines[i];
			if(line.charAt(0) == '#') continue;
			var splitted = line.split('\t');
			if(splitted.length <= 1) continue;
			if(splitted[0].length == 0 || splitted[1].length == 0) continue;
			hanjaWordsRegex.push(splitted[0]);
			hanjaWords[splitted[0]] = splitted[1];
		}
		hanjaWordsRegex = hanjaWordsRegex.join('|');
		setTimeout(onHanjaWordsReady, 0);
	});
	getText('/assets/shinjache.txt', function(data) {
		var lines = data.split('\n');
		for(var i in lines) {
			var line = lines[i];
			if(line.charAt(0) == '#') continue;
			var splitted = line.split('\t');
			if(splitted.length <= 1) continue;
			if(splitted[0].length == 0 || splitted[1].length == 0) continue;
			shinjacheRegex.push(splitted[0]);
			shinjache[splitted[0]] = splitted[1];
		}
		shinjacheRegex = shinjacheRegex.join('|');
		setTimeout(onShinjacheReady, 0);
	});
	getText('/assets/kancheja.txt', function(data) {
		var lines = data.split('\n');
		for(var i in lines) {
			var line = lines[i];
			if(line.charAt(0) == '#') continue;
			var splitted = line.split('\t');
			if(splitted.length <= 1) continue;
			if(splitted[0].length == 0 || splitted[1].length == 0) continue;
			kanchejaRegex.push(splitted[0]);
			kancheja[splitted[0]] = splitted[1];
		}
		kanchejaRegex = kanchejaRegex.join('|');
		setTimeout(onKanchejaReady, 0);
	});
}

var onHanjaReady = function() {
	hanjaLoaded = true;
	if(hanjaMode == 1 && hanjaWordsLoaded) {
		replaceHanja(hanjaWords, hanjaWordsRegex);
		replaceHanja(hanja, hanjaRegex);
	}
}

var onHanjaWordsReady = function() {
	hanjaWordsLoaded = true;
	if(hanjaMode == 1 && hanjaLoaded) {
		replaceHanja(hanjaWords, hanjaWordsRegex);
		replaceHanja(hanja, hanjaRegex);
	}
}

var onShinjacheReady = function() {
	if(hanjaMode == 2) replaceHanja(shinjache, shinjacheRegex);
}

var onKanchejaReady = function() {
	if(hanjaMode == 3) replaceHanja(kancheja, kanchejaRegex);
}

var onDefaultLoad = function() {
	
	if(typeof(Storage) !== "undefined") {
		if(localStorage.getItem("hanjaMode") == undefined) localStorage.setItem("hanjaMode", "1");
		hanjaMode = parseInt(localStorage.getItem("hanjaMode"));
	}
	
	replacePunctuations();
	setTimeout(function() {
		loadDics();
	}, 0);
}

window.addEventListener('load', onDefaultLoad);
