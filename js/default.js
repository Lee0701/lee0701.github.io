
var replacePunctuations = function() {
	var entries = document.getElementsByClassName("entry");
	for(var i in entries) {
		var entry = entries[i];
		var text = entry.innerHTML;
		text = text.replace(/([^\w])\./g, function(match, g1) {return g1 + "<sup class=\"punc\">。</sup>";});
		text = text.replace(/([^\w])\,/g, function(match, g1) {return g1 + "<sup class=\"punc\">、</sup>";});
		text = text.replace(/([^\w])\?/g, function(match, g1) {return g1 + "<sup class=\"punc\">？</sup>";});
		text = text.replace(/([^\w])\!/g, function(match, g1) {return g1 + "<sup class=\"punc\">！</sup>";});
		entry.innerHTML = text;
	}
}

var onDefaultLoad = function() {
	replacePunctuations();
}

window.addEventListener('load', onDefaultLoad);