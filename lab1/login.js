function store(source) {
    let username = document.getElementById(source).value;
    localStorage.setItem("tetris.username", username);
}
function read(source) {
    let storedVal = localStorage["tetris.username"];
    if(storedVal){
        let name = document.getElementById(source);
        name.value = storedVal
    }
}

function nextPage() {
    document.location.href = "/mainPart/main.html";
    return false;
}