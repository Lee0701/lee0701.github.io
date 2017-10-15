
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
var widthMode = 0;

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

var replaceFullWidths = function() {
	var entries = document.getElementsByClassName("half-entry");
	for(var i in entries) {
		var entry = entries[i];
		if(entry.style === undefined) continue;
		if(window.getComputedStyle(entry).writingMode != "vertical-rl") continue;
		var txt = entry.innerHTML;
		if(txt === undefined) continue;
		txt = txt.replace(/(<[^>]*>)+|([\u0030-\u0039\u0041-\u005a\u0061-\u007a])/g, function(match, g1, g2, g3) {return !g2 ? match : String.fromCharCode(g2.charCodeAt(0) + 0xfee0);});
		entry.innerHTML = txt;
	}
}

var replacePunctuations = function() {
	var entries = document.getElementsByClassName("punc-entry");
	for(var i in entries) {
		var entry = entries[i];
		if(entry.style === undefined) continue;
		if(window.getComputedStyle(entry).writingMode != "vertical-rl") continue;
		var txt = entry.innerHTML;
		if(txt === undefined) continue;
		txt = txt.replace(/([^\w])\./g, function(match, g1) {return g1 + "<span class=\"punc\">。</span>";});
		txt = txt.replace(/([^\w])\,/g, function(match, g1) {return g1 + "<span class=\"punc\">、</span>";});
		txt = txt.replace(/([^\w])\?/g, function(match, g1) {return g1 + "？";});
		txt = txt.replace(/([^\w])\!/g, function(match, g1) {return g1 + "！";});
		entry.innerHTML = txt;
	}
}

var replaceHanjaTable = function(txt, table, regex, ruby=false) {
	txt = txt.replace(new RegExp(regex, 'g'), function(matched) {
    if(ruby) return '<ruby>' + matched + '<rp>(</rp><rt>' + table[matched] + '</rt><rp>)</rp></ruby>';
		else return table[matched];
	});
	return txt;
}

var replaceRemainingHanjas = function(txt) {
}

var replaceHanja = function(table, regex, ruby=false) {
	var entries = document.getElementsByClassName("hanja-entry");
	var len = entries.length;
	for(var i = 0 ; i < len ; i++) {
		var entry = entries[i];
		if(entry.style === undefined) continue;
		var txt = entry.innerHTML;
		if(txt === undefined) continue;
		txt = replaceHanjaTable(txt, table, regex, ruby);
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
		hanjaRegex = '(?!<ruby>.*)(' + hanjaRegex.join('|') + ')(?!.*<\/ruby>)';
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
	if(hanjaMode == 4 && hanjaWordsLoaded) {
		replaceHanja(hanjaWords, hanjaWordsRegex, true);
		replaceHanja(hanja, hanjaRegex, true);
	}
}

var onHanjaWordsReady = function() {
	hanjaWordsLoaded = true;
	if(hanjaMode == 1 && hanjaLoaded) {
		replaceHanja(hanjaWords, hanjaWordsRegex);
		replaceHanja(hanja, hanjaRegex);
	}
	if(hanjaMode == 4 && hanjaLoaded) {
		replaceHanja(hanjaWords, hanjaWordsRegex, true);
		replaceHanja(hanja, hanjaRegex, true);
	}
}

var onShinjacheReady = function() {
	if(hanjaMode == 2) replaceHanja(shinjache, shinjacheRegex);
}

var onKanchejaReady = function() {
	if(hanjaMode == 3) replaceHanja(kancheja, kanchejaRegex);
}

var registerComment = function() {
  var name = document.getElementById("comment-name");
  var email = document.getElementById("comment-email");
  var content = document.getElementById("comment-content");
  var btn = document.getElementById("comment-submit");
  var message = '';
  var failed = false;
  
  if(!name.value) message += ", 이름";
  if(!email.value) message += ", 전자 메일";
  if(!content.value) message += ", 내용";
  
  if(message) {
    message = message.substring(2);
    message += "을 입력해 주십시오.";
    btn.innerText = message;
    btn.style.backgroundColor = "#d50000";
    btn.style.color = "#ffffff";
    return false;
  } else {
    return true;
  }
}

var onDefaultLoad = function() {
	
	if(typeof(Storage) !== "undefined") {
		if(localStorage.getItem("hanjaMode") == undefined) localStorage.setItem("hanjaMode", "1");
		if(localStorage.getItem("widthMode") == undefined) localStorage.setItem("widthMode", "0");
		hanjaMode = parseInt(localStorage.getItem("hanjaMode"));
    widthMode = parseInt(localStorage.getItem("widthMode"));
	}
	  
  if(widthMode == 1) replaceFullWidths();
  
	replacePunctuations();

	setTimeout(function() {
		loadDics();
	}, 0);
}

window.addEventListener('load', onDefaultLoad);
