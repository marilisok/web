
$(() => {
    $(".portlet")
        .draggable({cursor: "move"})
        .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
        .find(".portlet-header")
        .addClass("ui-widget-header ui-corner-all")
        .prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $(".portlet-toggle").on("click", function () {
        var icon = $(this);
        icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
        icon.closest(".portlet").find(".portlet-content").toggle();
    });

    let isAuctionEnded = false;
    let isAuctionProcessed = false;
    let isTimeout = false;
    let isNextPic = false;
    let socket = io.connect("http://localhost:3030");

    socket.on("connect", () => {
        socket.json.emit("hello", {"user": "admin"});
    });

    socket.on("msg", (msg) => {addUL(msg);});
    socket.on("begin", (msg) => {addUL(msg, "blue");});
    socket.on("auctionProcess", (msg) => {
        if (!isAuctionProcessed)
            addUL(msg);
        isAuctionProcessed = true;
    });
    socket.on("timeout", (msg) => {
        if (!isTimeout)
            addUL(msg, "red");
        isTimeout = true;
        isAuctionProcessed = false;
    });
    socket.on("nextPic", (msg) => {
        if (!isNextPic)
            addUL(msg, "red");
        isNextPic = true;
        isTimeout = false;
    });
    socket.on("newPriceSet", (msg) => {addUL(msg, "yellow");});
    socket.on("end", (msg) => {
        if (!isAuctionEnded) {
            isAuctionEnded = true;
            addUL(msg, "red");
        }
    });

    socket.on("userBought", (msg) => {
        addUL(msg, "blue");
        for( let participant of ($("#dataParticipant").children())) {
            if (participant.innerHTML.indexOf(msg.user) != -1) {
                participant.innerHTML = `${msg.user} - ${msg.budget}`;
                break;
            }
        }

        for (let picture of ($("#dataPicture").children())) {
            if (picture.children[0].innerHTML.indexOf(msg.picture) != -1) {
                picture.children[2].innerHTML = `Продана участнику ${msg.user} за ${msg.price}`;
                break;
            }
        }
    });

    function addUL(msg, color = "black") {
        let li = document.createElement("li");
        li.style.color = color;
        li.innerHTML = `${new Date(msg.time).toLocaleTimeString()}: ${msg.msg}`;
        data.appendChild(li);
    }

    $.get("/participants").done((resData) => {
        for (let participant of resData) {
            let li = document.createElement("li");
            li.innerHTML = `${participant.name} - ${participant.budget}`;
            dataParticipant.appendChild(li);
        }
    });

    $.get("/pictures").done((resData) => {
        for (let picture of resData) {
            if (picture.is == "участвует") {
                let li = document.createElement("li");
                let div1 = document.createElement("div");
                div1.innerHTML = `"${picture.name}" - ${picture.author}`;
                let div2 = document.createElement("div");
                div2.innerHTML = `Стартовая цена продажи: ${picture.price}`;
                let div3 = document.createElement("div");
                div3.innerHTML = "Не продана";
                li.appendChild(div1);
                li.appendChild(div2);
                li.appendChild(div3);
                dataPicture.appendChild(li);
            }
        }
    });
})

require("../styles/adminPage.css");
require("../styles/jquery-ui.css");