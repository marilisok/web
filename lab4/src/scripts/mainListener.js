$(() =>
{
    $("#enterAuction").on("click", () => {
        window.location = `user/${$("#name").val()}`;
    });
});

require("../styles/index.css");

