const express = require('express');
const {getClient} = require('../database');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

//Wine Partial-Match Search - Users can use multiple parameters to find their drinks
router.post('/searchWine', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const {Name, Company, Style, Origin} = req.body

    let filter = {}
    if(Name){
        // filter.Name = {$regex: Name, $options: 'i'}
        const escapedName = Name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.Name = { $regex: escapedName, $options: 'i' };
    }
    if(Company){
        filter.Company = {$regex: Company, $options: 'i'}
    }
    if(Style){
        filter.Style = {$regex: Style, $options: 'i'}
    }
    if(Origin){
        filter.Origin = {$regex: Origin, $options: 'i'}
    }

    const wine = await db.collection('Wine').find(filter).toArray()
    
    if(wine.length > 0){
        res.status(200).json({wine})
    }
    else{
        res.status(400).json({error:"No wine matched with the criteria"})
    }
})

//Retrieves all Wines in the database
router.get('/getAllWines', async (req, res) => {
    const db = getClient().db('AlcoholDatabase'); 
    const wines = await db.collection('Wine').find({}).toArray();

    if(wines.length > 0){
        res.status(200).json({wines})
    }
    else{
        res.status(400).json({error:"Couldn't retrieve all wines..."})
    }
});

//User can favorite Wine by adding UserId to the Drink's Favorite array
router.post('/favoriteWine', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const {_id, UserId} = req.body
    const WineId = ObjectId.createFromHexString(_id)
    const favorite = await db.collection('Wine').updateOne( //Adds User Id to array
        { _id: WineId },
        { $addToSet: { Favorites: UserId } }) // to avoid duplicates

    if (favorite.modifiedCount > 0) {
        res.status(200).json({favorite, message:"User has favorited their wine"})
    }
    else{
        res.status(400).json({message:"User could not favorite their wine"})
    }
})

//User can unfavorite Wine by deleting UserId from the Drink's Favorite array
router.post('/unfavoriteWine', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const {_id, UserId} = req.body
    const WineId = ObjectId.createFromHexString(_id)
    const unfavorite = await db.collection('Wine').updateOne(
        {_id: WineId}, 
        {$pull: {Favorites: UserId,}}) //Removes UserId from array

    if (unfavorite.modifiedCount > 0) {
        res.status(200).json({unfavorite, message:"User has unfavorited their wine"})
    }
    else{
        res.status(400).json({message:"User could not unfavorite their wine"})
    }
})

module.exports = router