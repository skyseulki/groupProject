const express   = require('express');
const router    = express.Router();
const Users     = require('../models/users');
const Events    =require('../models/events');

router.get('/', (req, res) => {
    res.send('users index')
})

router.get('/:id' , async(req,res) =>{
    try{
        const foundUser     = await Users.findById(req.params.id).populate("events");
        const usersEvents   = await foundUser.events;
        console.log(req.session.logged)
        res.render('users/index.ejs',{
            user : foundUser,
            events: usersEvents,
            logged: req.session.logged
        });
    }catch(err){
        console.log('error happening')
        res.send(err);
    }
})

router.post('/:id', async(req,res)=>{
    const currentUser       = await Users.findById(req.session.usersDbId);
    const foundEvent        = await Events.findById(req.params.id);


    currentUser.events.push(foundEvent);
    currentUser.save();
    console.log(currentUser.events);
    foundEvent.users.push(req.session.usersDbId);
    foundEvent.save();
    console.log(foundEvent, "<=------ this is the found event")
    res.redirect(`/users/${currentUser._id}`);
})

router.delete('/:id',async(req,res)=>{
    try{
        const currentUser       = await Users.findById(req.session.usersDbId);
        const foundEvent        = await Events.findById(req.params.id);
        console.log(currentUser, '<---this is current user')
        currentUser.events.remove(req.params.id);
        await currentUser.save();

        foundEvent.users.remove(currentUser._id);
        await foundEvent.save();


        res.redirect(`/users/${currentUser._id}`);
    }catch(err){
        res.send(err);
    }
})
module.exports = router;