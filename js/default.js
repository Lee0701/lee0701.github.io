
var replacePunctuations = function() {
	var entries = document.getElementsByClassName("entry");
	for(var i in entries) {
		var entry = entries[i];
		var text = entry.innerHTML;
		if(text === undefined) continue;
		text = text.replace(/([^\w])\./g, function(match, g1) {return g1 + "<span class=\"punc\">。</span>";});
		text = text.replace(/([^\w])\,/g, function(match, g1) {return g1 + "<span class=\"punc\">、</span>";});
		text = text.replace(/([^\w])\?/g, function(match, g1) {return g1 + "？";});
		text = text.replace(/([^\w])\!/g, function(match, g1) {return g1 + "！";});
		entry.innerHTML = text;
	}
}

var onDefaultLoad = function() {
	replacePunctuations();
}

window.addEventListener('load', onDefaultLoad);
