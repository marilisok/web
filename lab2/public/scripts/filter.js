function callback(text) {
    document.body.parentElement.innerHTML=text;
}
function sorted_books(mode) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", mode, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            callback(xhr.responseText);
        }
    };
}


