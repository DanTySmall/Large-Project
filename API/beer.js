const express = require('express');
const {getClient} = require('../database');
const  searchBeerController  = require('./searchBeerController');
const  getBeerCommentsController  = require('./getBeerCommentsController');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

//Beer Partial-Match Search - Users can use multiple parameters to find their drinks
router.post('/searchBeer', searchBeerController);

//Retrieves all Beers in the database
router.get('/getAllBeers', async (req, res) => {
    const db = getClient().db('AlcoholDatabase'); // Replace with your database name
    const beers = await db.collection('Beer').find({}).toArray();

    if(beers.length > 0){
        res.status(200).json({beers})
    }
    else{
        res.status(400).json({error:"Couldn't retrieve all beers..."})
    }
});

//User can favorite Beer by adding UserId to the Drink's Favorite array
router.post('/favoriteBeer', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const {_id, UserId} = req.body
    const BeerId = ObjectId.createFromHexString(_id)
    const favorite = await db.collection('Beer').updateOne( //Adds User Id to array
        { _id: BeerId },
        { $addToSet: { Favorites: UserId } }) // to avoid duplicates

    if (favorite.modifiedCount > 0) {
        res.status(200).json({favorite, message:"User has favorited their beer"})
    }
    else{
        res.status(400).json({message:"User could not favorite their beer"})
    }
})

//User can unfavorite Beer by deleting UserId from the Drink's Favorite array
router.post('/unfavoriteBeer', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const {_id, UserId} = req.body
    const BeerId = ObjectId.createFromHexString(_id)

    const unfavorite = await db.collection('Beer').updateOne(
        { _id: BeerId }, 
        { $pull: { Favorites: UserId } }); //Removes UserId from array

    if (unfavorite.modifiedCount > 0) {
        res.status(200).json({unfavorite, message:"User has unfavorited their beer"})
    }
    else{
        res.status(400).json({message:"User could not unfavorite their beer"})
    }
})

//User can comment and add a star rating. The rating, comment, and User Id gets added to array.
router.post('/rateBeer', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const {_id, UserId, Stars, Comment} = req.body
    const BeerId = ObjectId.createFromHexString(_id)

    const updateRating = await db.collection('Beer').updateOne(  //Checks if User already rated beer. If rating already exists, the rating gets updated.
        { _id: BeerId, 'Ratings.UserId': UserId },
        { $set: { 'Ratings.$.Rating': Stars, 'Ratings.$.Comment': Comment } }
    );

    if(updateRating.matchedCount === 0) { //If user has not rated the beer, it adds the User Id with their rating into the Ratings array.
        const addRating = await db.collection('Beer').updateOne(
            { _id: BeerId },
            { $push: { Ratings: { UserId: UserId, Rating: Stars, Comment: Comment } } }
        )
        res.status(200).json({addRating, message:"User has added their rating."})
    }
    else{
        res.status(200).json({updateRating, message:"User has updated their rating."})
    }
})

// Gets user's rating for a specific beer
router.get('/userBeerRating', async (req, res) => {
    const db = getClient().db('AlcoholDatabase');
    const { UserId, _id } = req.query;
    const BeerId = ObjectId.createFromHexString(_id);

    try {
        const result = await db.collection('Beer').aggregate([
            { $match: { _id: BeerId } },
            { $unwind: { path: "$Ratings", includeArrayIndex: "index" } },
            { $match: { "Ratings.UserId": UserId } }, // Match the specific UserId
            { $project: { 
                _id: 0,
                rating: "$Ratings.Rating", 
                comment: "$Ratings.Comment",
                index: 1 // Include the index field
            }}
        ]).toArray();

        if (result.length > 0) {
            const userRating = result[0].rating;
            const comment = result[0].comment;
            const index = result[0].index;

            res.status(200).json({ userRating, comment, index, message: "User's rating, comment, and index have been retrieved." });
        } else {
            res.status(404).json({ message: "Rating for the specified user could not be found." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while retrieving the rating.", error: error.message });
    }
});

//Averages the total ratings users have given for a Beer
router.get('/beerRatings', async(req, res) => {
    const db = getClient().db('AlcoholDatabase')
    const { _id } = req.query;
    const BeerId = ObjectId.createFromHexString(_id)

    const result = await db.collection('Beer').aggregate([ //Using MongoDB aggregation, able to filter document to avg and only display ratings.
        {$match: {_id: BeerId}},
        { $project: { 
            _id: 1, 
            avgRating: { 
                $cond: { 
                    if: { $gt: [{ $size: "$Ratings" }, 0] }, 
                    then: { $avg: "$Ratings.Rating" }, 
                    else: 0 
                } 
            } 
        }}
    ]).toArray()

    if(result.length > 0){
        const avgRating = result[0].avgRating
        res.status(200).json({avgRating, message:"Beer's average rating has been calculated."})
    }
    else{
        res.status(400).json({message:"Average rating could not be retrieved."})
    }
})

router.get('/getBeerComments', getBeerCommentsController);

module.exports = router
