const assert = require("assert");
const should = require("should");
tested = require("./main")

describe("main test", () => {
    it ("optionsJSON test", () => {
        tested.optionsJSON.options.should.have.properties(["date", "time", "timeout", "orderTime", "lookingTime"]);
    });

    it ("picturesJSON test", () => {
        for (let pic of tested.picturesJSON.pictures)
            pic.should.have.properties(["id", "name", "author", "description", "is", "price", "minStep", "maxStep", "src"]);
    });

    it ("participantsJSON test", () => {
        for (let part of tested.participantsJSON.participants)
            part.should.have.properties(["name", "budget"]);
    });
})