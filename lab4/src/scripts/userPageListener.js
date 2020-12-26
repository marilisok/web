$(() => {
    $(".portlet")
        .draggable({cursor: "move", scroll: false, containment: "parent" })
        .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
        .find(".portlet-header")
        .addClass("ui-widget-header ui-corner-all")
        .prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $(".portlet-toggle").on("click", function () {
        var icon = $(this);
        icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
        icon.closest(".portlet").find(".portlet-content").toggle();
    });

    $("#priceUpSlider").slider({
        slide: (event, ui) => {
            $("#newPrice").text(`Сумма повышения цены: ${ui.value}`);
        },
    });


    $("#toOrders").prop('disabled', true);



    let socket = io.connect("http://localhost:3030");
    socket.on("connect", () => {
        socket.json.emit("hello", {"user": $("#name").text()});
    });

    let lookingTime;
    let lastPicId = "0";
    let timePassedInterval;
    let auctionBeginTime;
    let isAllowToBuy = false;

    socket.on("msg", (msg) => {addUL(msg, "black");});
    socket.on("begin", (msg) => {
        //$("#start").hide();
        document.getElementById('start').hidden = true;
        auctionBeginTime = new Date();

        lookingTime = parseInt(msg.lookingTime);
        setTimeout(() => {send("lookingTimeEnd", "");}, lookingTime);
        addUL(msg, "blue");

        $.get(`/picture/${lastPicId}`).done((resData) => {
            $("#picture").attr("src", resData.src);
            $("#picture").css("display", "block");
            $("#pictureName").text(`"${resData.name}" - ${resData.author}`);
            $("#pictureStartPrice").text(`Начальная цена: ${resData.price}`);
            $("#pictureCurrentPrice").text(`Текущая цена: ${resData.price}`);
            $("#priceUpSlider").slider({
                value: parseInt(resData.minStep),
                max: parseInt(resData.maxStep),
                min: parseInt(resData.minStep)
            });
            $("#newPrice").text(`Сумма повышения цены: ${parseInt(resData.minStep)}`);

            timePassedInterval = setInterval(timePassed, 100);

            lastPicId = resData.id;
        });
    });

    socket.on("auctionProcess", (msg) => {
        isAllowToBuy = true;
        addUL(msg);
    });

    socket.on("newPriceSet", (msg) => {
        $("#pictureCurrentPrice").text(`Текущая цена: ${parseInt($("#pictureCurrentPrice").text().slice(14)) + parseInt(msg.up)}`);
        addUL(msg, "yellow");
    });

    socket.on("timeout", (msg) => {
        addUL(msg, "red");
        isAllowToBuy = false;
        $("#picture").css("display", "none");
        $("#pictureName").text(``);
        $("#pictureStartPrice").text(``);
        $("#pictureCurrentPrice").text('');
    });

    socket.on("nextPic", (msg) => {
        if(lastPicId != $("#lastPicId").text()) {
            setTimeout(() => {
                send("lookingTimeEnd", "");}, lookingTime);

            $.get(`/picture/${lastPicId}`).done((resData) => {
                $("#picture").attr("src", resData.src);
                $("#picture").css("display", "block");
                $("#pictureName").text(`"${resData.name}" - ${resData.author}`);
                $("#pictureStartPrice").text(`Начальная цена: ${resData.price}`);
                $("#pictureCurrentPrice").text(`Текущая цена: ${resData.price}`);
                $("#priceUpSlider").slider({
                    value: parseInt(resData.minStep),
                    max: parseInt(resData.maxStep),
                    min: parseInt(resData.minStep)
                });
                $("#newPrice").text(`Сумма повышения цены: ${parseInt(resData.minStep)}`);

                lastPicId = resData.id;
                addUL(msg, "red");
                $("#picture").css("display", "block");
            });
        } else {
            clearInterval(timePassedInterval);
            send("auctionEnd", "");
            $("#picture").css("display", "none");
            $("#pictureName").text(``);
            $("#pictureStartPrice").text(``);
            $("#pictureCurrentPrice").text('');
        }
    });

    socket.on("buyPicture", (msg) => {
        new Promise((resolve, reject) => {
            $("#budget").text(parseInt($("#budget").text()) - parseInt($("#pictureCurrentPrice").text().slice(14)));
            addUL({msg: `Картина куплена за ${$("#pictureCurrentPrice").text().slice(14)}`, time: new Date()}, "yellow");
            socket.json.emit("userBoughtPic", {user: $("#name").text(), budget:  $("#budget").text(), picture: $("#pictureName").text(), price: $("#pictureCurrentPrice").text().slice(14), id: lastPicId});
        }).then();
    });

    socket.on("end", (msg) => {
        addUL(msg, "red");
        $("#toOrders").prop('disabled', false);
    });

    function addUL(msg, color = "black") {
        let li = document.createElement("li");
        li.style.color = color;
        li.innerHTML = `${new Date(msg.time).toLocaleTimeString()}: ${msg.msg}`;
        data.appendChild(li);
    }

    function send(type, value) {
        if(socket) socket.json.emit(type, {"value": value});
    }

    function timePassed() {
        let time = new Date() - auctionBeginTime;
        let seconds = Math.round(time / 1000);
        let minutes = 0;
        if (seconds > 59) {
            minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
        }

        if (minutes < 10) {
            if (seconds < 10) {
                $("#time").text(`0${minutes}:0${seconds}`);
            } else {
                $("#time").text(`0${minutes}:${seconds}`);
            }
        } else {
            if (seconds < 10) {
                $("#time").text(`${minutes}:0${seconds}`);
            } else {
                $("#time").text(`${minutes}:${seconds}`);
            }
        }

    }


    $("#newPriceButton").on("click", () => {
        if(isAllowToBuy) {
            if(parseInt($("#budget").text()) - (parseInt($("#pictureCurrentPrice").text().slice(14)) + parseInt($("#priceUpSlider").slider("value"))) < 0) {
                window.alert("Недостаточно средств!");
                return;
            }
            socket.json.emit("newPrice", {"user": $("#name").text(), "up": $("#priceUpSlider").slider("value")});
        }
    });

    $("#toOrders").on("click", () => {
        window.location = `/purchases/${$("#name").text()}`;
    });
})

require("../styles/userPage.css")
require("../styles/jquery-ui.css")
