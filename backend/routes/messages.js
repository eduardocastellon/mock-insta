const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET /messages/:userId/:otherUserId
// return messages sorted oldest to newest
router.get('/messages/:userId/:otherUserId', async(req, res) => {

    const {userId, otherUserId} = req.params;
    try{
        const messages = await Message.find({
            $or: [
                { from: userId, to: otherUserId },
                { from: otherUserId, to: userId },
            ],}).sort({ createdAt: 1 });
        return res.status(200).json(messages);
    }
    catch(err){
        return res.status(500).json({ message: 'cant find messages' });
    }
});

// POST /messages
// Body: { from: string (user_id), to: string (user_id), text: string }
router.post('/messages', async (req, res) =>{
    const { from, to, text } = req.body;

    if(!from || !to || !text || !text.trim()){
        return res.status(400).json({ message: 'from, to, and non-empty text are required' });
    }
    try{
        const msg = new Message({from, to, text: text.trim(),});

        await msg.save();
        return res.status(201).json(msg);
    }
    catch(err){
        return res.status(500).json({ message: 'message cant be created' });
    }
});
module.exports = router;
