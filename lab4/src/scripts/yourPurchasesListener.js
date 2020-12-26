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

    $.get(`/purchases/pictures/${$("#name").text()}`).done((resData) => {
        for (let picture of resData) {
            let li = document.createElement("li");
            let div1 = document.createElement("img");
            div1.src = `${picture.src}`;
            div1.width = 400;
            div1.height = 400;
            let div2 = document.createElement("div");
            div2.innerHTML = `"${picture.name}" - ${picture.author}`;
            let div3 = document.createElement("div");
            div3.innerHTML = `Цена продажи: ${picture.price}`;
            li.appendChild(div1);
            li.appendChild(div2);
            li.appendChild(div3);
            $("li").css("float", "left")
            dataPicture.appendChild(li);
        }
    });
});

require("../styles/yourPurchases.css")
require("../styles/jquery-ui.css")