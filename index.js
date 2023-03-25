const { Client } = require('discord.js-selfbot-v13');
require("dotenv").config()
const fs = require("fs");
const client = new Client({});

client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);
})

let data = {
    question: "",
    aswer: "",
}
let isHave = false;

client.on("message", async (msg) => {
    const db = JSON.parse(fs.readFileSync("./db.json", "utf-8"))
    if (!msg.guild) {
        if (msg.author.id == process.env.TARGETID) { //get question
            if (data.question != msg.content && (!data.aswer || data.aswer == "")) {
                data.question += msg.content + "\n"
            }
            else if (data.question != msg.content && (data.aswer != "")) {
                if (data.question == "") return console.log("test");
                if (isHave) {
                    db.find(e => e.question === data.question).aswer.push(data.aswer)
                    fs.writeFileSync("./db.json", JSON.stringify(db, null, 4))
                    data = {
                        question: msg.content + '\n',
                        aswer: ""
                    }
                    console.log("[logs] add answer!")
                }
                else {
                    db.push({
                        question: data.question,
                        aswer: [
                            data.aswer
                        ]
                    })
                    fs.writeFileSync("./db.json", JSON.stringify(db, null, 4))
                    data = {
                        question: msg.content + '\n',
                        aswer: ""
                    }
                    console.log("[Logs] new save!")
                }
                isHave = false
            }
        }
        if (msg.author.id == process.env.YOURID) { //get answer
            if (db.find(e => e.question == data.question)) {
                isHave = true
            }
            if (data.question == "") return;
            data.aswer += msg.content + "\n"
        }

        let id = [ process.env.YOURID, process.env.TARGETID]
        if (id.includes(msg.author.id)) return console.log({ data: data, duplicate: isHave, index: isHave ? db.length : db.length + 1 })
    }
})

client.login(process.env.TOKEN);
