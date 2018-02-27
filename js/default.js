
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
	
}

window.addEventListener('load', onDefaultLoad);
