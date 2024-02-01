// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
// app config
const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
    appId: "1750392",
    key: "b0b14468ad9da69f01ae",
    secret: "c6c2a5eee2105e25175c",
    cluster: "eu",
    useTLS: true
  });
// middlewares
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    next();
})

// DB config
const connection_url = 'mongodb+srv://momo:momo@cluster0.uifjyov.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url);

const db = mongoose.connection 
db.once('open', () => {
    console.log("db is connected");
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();
    changeStream.on("change", (change) => {
        // check the message when change happen
        // console.log(change); 
        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message
            })
        } else {
            console.log("Error triggering Pusher");
        }
    })
})

// ??????

// api routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages/sync", async (req, res) => {
    try {
    const messages = await Messages.find();
    res.status(200).json(messages);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
})

app.post("/messages/new", async (req, res) => {
    try {
        const dbMessage = req.body;
        const messageRes = await Messages.create(dbMessage);
        res.status(201).json(messageRes);

    }catch(error){
        res.status(500).json({error: error.message});
    }
    
})
// listener
app.listen(port, () => console.log(`Listening on port ${port}`));
