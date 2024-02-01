// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
// app config
const app = express();
const port = process.env.PORT || 9000;
// middlewares
app.use(express.json());

// DB config
const connection_url = 'mongodb+srv://momo:momo@cluster0.uifjyov.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url);

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
