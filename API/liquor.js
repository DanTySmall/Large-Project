const express = require('express');
const {getClient} = require('../database');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

//Liquor Partial-Match Search - Users can use multiple parameters to find their drinks
router.post('/searchLiquor', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const {Name, Company, Style, Origin} = req.body


    let filter = {}
    if(Name){
        filter.Name = {$regex: Name, $options: 'i'}
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

    const liquor = await db.collection('Liquor').find(filter).toArray()
    
    if(liquor.length > 0){
        res.status(200).json({liquor})
    }
    else{
        res.status(400).json({error:"No liquor matched with the criteria"})
    }
})

//Retrieves all Liquors in the database
router.get('/getAllLiquors', async (req, res) => {
    const db = getClient().db('AlcoholDatabase'); 
    const liquors = await db.collection('Liquor').find({}).toArray();

    if(liquors.length > 0){
        res.status(200).json({liquors})
    }
    else{
        res.status(400).json({error:"Couldn't retrieve all liquors..."})
    }
});

//User can favorite Liquors by adding UserId to the Drink's Favorite array
router.post('/favoriteLiquor', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const {_id, UserId} = req.body
    const LiquorId = ObjectId.createFromHexString(_id)
    const favorite = await db.collection('Liquor').updateOne( //Adds User Id to array
        { _id: LiquorId },
        { $addToSet: { Favorites: UserId } }) // to avoid duplicates

    if (favorite.modifiedCount > 0) {
        res.status(200).json({favorite, message:"User has favorited their liquor"})
    }
    else{
        res.status(400).json({message:"User could not favorite their liquor"})
    }
})

//User can unfavorite Liquor by deleting UserId from the Drink's Favorite array
router.post('/unfavoriteLiquor', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const {_id, UserId} = req.body
    const LiquorId = ObjectId.createFromHexString(_id)
    const unfavorite = await db.collection('Liquor').updateOne(
        {_id: LiquorId}, 
        {$pull: {Favorites: UserId,}}) //Removes UserId from array

    if (unfavorite.modifiedCount > 0) {
        res.status(200).json({unfavorite, message:"User has unfavorited their liquor"})
    }
    else{
        res.status(400).json({message:"User could not unfavorite their liquor"})
    }
})

module.exports = router