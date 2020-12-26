const express = require("express");
const domain = require("domain");
let d = domain.create();
let server;

d.run(() => {
    server = express();
});

let serv = server.listen(3010);

d.on("error", (err) => {
    console.log("Домен перехватил ошибку %s", err);
    rollbar.error(`Домен перехватил ошибку ${err}`);
    try {
        let killtimer = setTimeout(() => {
            process.exit(1);
        }, 30000);
        killtimer.unref();
        serv.close();
    } catch (er2) {
        console.error('Error sending 500!', er2.stack);
        rollbar.critical(`Error sending 500!`);
    }
});
d.add(server);

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.set("view engine", "pug");
server.set("views", "./views");
server.use("/public", express.static("public"));

const io = require("socket.io").listen(3030);

const optionsJSON = require("./src/json/options.json");
const participantsJSON = require("./src/json/participants.json");
const picturesJSON = require("./src/json/pictures.json");

var Rollbar = require("rollbar");
var rollbar = new Rollbar({
    accessToken: '41ec4077fde94168a28f0fa475c66770',
    captureUncaught: true,
    captureUnhandledRejections: true
});
rollbar.log('test12');

let beginTime = `${optionsJSON.options.date}T${optionsJSON.options.time}:00`;
let orderTimeArr = optionsJSON.options.orderTime.split(":");
let orderTime = parseInt(orderTimeArr[0]) * 60 * 1000 + parseInt(orderTimeArr[1]) * 1000;
let timeoutArr = optionsJSON.options.timeout.split(":");
let timeout = parseInt(timeoutArr[0]) * 60 * 1000 + parseInt(timeoutArr[1]) * 1000;
let lookingTimeArr = optionsJSON.options.lookingTime.split(":");
let lookingTime = parseInt(lookingTimeArr[0]) * 60 * 1000 + parseInt(lookingTimeArr[1]) * 1000;

let adminId = "";
let participantPriceUp = "";
let orders = [];

let lastPicId;
for(let picture of picturesJSON.pictures) {
    if(picture.is == "участвует") {
        lastPicId = picture.id;
    }
}

io.sockets.on("connection", (socket) => {
    socket.on("hello", (msg) => {
        socket["user"] = msg.user;
        if (msg.user == "admin") {
            adminId = socket.id;
        }
        send("msg", socket, `${msg.user} присоединился`);
    });

    socket.on("disconnect", (msg) => {
        send("msg", socket, `${socket["user"]} покинул аукцион`);
    });

    socket.on("newPrice", (msg) => {
        participantPriceUp = socket.id;
        socket.json.emit("newPriceSet", {"msg": `${msg.user} предложил больше на ${msg.up}`, "up": msg.up, "time": new Date()});
        socket.broadcast.json.emit("newPriceSet", {"msg": `${msg.user} предложил больше на ${msg.up}`, "up": msg.up, "time": new Date()})
    });

    socket.on("lookingTimeEnd", (msg) => {
        new Promise((resolve, reject) => {
            if(adminId != "") {
                if (io.sockets.sockets[adminId] == null)
                    throw new Error('Server error');
                io.sockets.sockets[adminId].json.emit("auctionProcess", {msg: "Торг по картине начался", "time": new Date()});
            }
            send("auctionProcess", socket, "Торг по картине начался", false);
            setTimeout(() => {
                if (socket.id == participantPriceUp) {
                    if (io.sockets.sockets[participantPriceUp] == null)
                        throw new Error('Server error');
                    io.sockets.sockets[participantPriceUp].json.emit("buyPicture", {"msg": ""});
                    participantPriceUp = "";
                }
                send("timeout", socket, "Время лота истекло", false);
                if(adminId != "") {
                    io.sockets.sockets[adminId].json.emit("timeout", {msg: `Время лота истекло`, "time": new Date()});
                }

                setTimeout( () => {
                    send("nextPic", socket, "Следующий лот", false)
                    if(adminId != "") {
                        io.sockets.sockets[adminId].json.emit("nextPic", {msg: `Следующий лот`, "time": new Date()});
                    }
                }, timeout);
            }, orderTime);
        }).catch((error) => server.emit('error', new Error(error.message)));
    });

    socket.on("auctionEnd", (msg) => {
        send("end", socket, "Аукцион закончился", false);
        if(adminId != "") {
            io.sockets.sockets[adminId].json.emit("end", {"msg": "Аукцион закончился", "time": new Date()});
        }
    });

    socket.on("userBoughtPic", (msg) => {
        orders.push({user: msg.user, id: msg.id, price: msg.price})
        if(adminId != "") {
            io.sockets.sockets[adminId].json.emit("userBought", {msg: `Участник ${msg.user} купил картину ${msg.picture} за ${msg.price}`,
                time: new Date(), user: msg.user, budget: msg.budget, picture: msg.picture, price: msg.price});
        }
    });

    let auctionExpecting = setInterval(() => {
        if(new Date() - Date.parse(beginTime) > 0 && new Date() - Date.parse(beginTime) <= 1000) {
            clearInterval(auctionExpecting);
            socket.json.emit("begin", {"msg": "Аукцион начался", "time": new Date(), "lookingTime": `${lookingTime}`});
        }
    }, 500);
});

function send(type, socket, msg, forAll = true) {
    socket.json.emit(type, {"msg": msg, "time": new Date()});
    if (forAll)
        socket.broadcast.json.emit(type, {"msg": msg, "time": new Date()});
}

server.get("/", (req, res) => {
    res.render("index");
})

server.get("/user/:name", (req, res) => {
    for(let participant of participantsJSON.participants) {
        if(participant.name === req.params.name) {
            res.render("userPage", {name: req.params.name, budget: participant.budget, lastPic: lastPicId, start_time: optionsJSON.options.time, date: optionsJSON.options.date});
            return;
        }
    }

    if(req.params.name === "ADMINUSHKA") {
        res.render("adminPage", {partners: participantsJSON.participants, arts: picturesJSON.pictures});
    }
    else {
        res.send("Вы не зарегестрированы на участие\nЖдём вас в следующий раз.");
    }
});

server.get("/picture/:id", (req, res) => {
    let index = parseInt(req.params.id);
    for (index; index < picturesJSON.pictures.length; index++){
        if (picturesJSON.pictures[index].is == "участвует"){
            res.json(picturesJSON.pictures[index]);
            return;
        }
    }
});

server.get("/participants", (req, res) => {
    res.json(participantsJSON.participants);
});

server.get("/pictures", (req, res) => {
    res.json(picturesJSON.pictures);
});

server.get("/purchases/:user", (req, res) => {
    res.render("yourPurchases", {name: req.params.user});
});

server.get("/purchases/pictures/:user", (req, res) => {
    let answer = {pictures: []};
    for (let order of orders){
        if (order.user == req.params.user){
            picturesJSON.pictures[order.id - 1].price = order.price;
            answer.pictures.push(picturesJSON.pictures[order.id - 1]);
        }
    }
    res.json(answer.pictures);
});

module.exports = {
    optionsJSON: optionsJSON,
    participantsJSON: participantsJSON,
    picturesJSON: picturesJSON
}