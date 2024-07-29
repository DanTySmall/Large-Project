const express = require('express');
const {getClient} = require('../database');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

async function getBeerComments(req, res){
    const db = getClient().db('AlcoholDatabase');
    const { _id } = req.query; // Use req.query to get the parameter from the query string
    const BeerId = ObjectId.createFromHexString(_id);

    // const beer = await db.collection('Beer').findOne({ _id: BeerId });
    const result = await db.collection('Beer').aggregate([
        { $match: { _id: BeerId } },
        {
            $project: {
                _id: 1,
                comments: {
                    $cond: {
                        if: { $gt: [{ $size: "$Ratings" }, 0] },
                        then: "$Ratings",
                        else: []
                    }
                }
            }
        }
    ]).toArray();

    if (result.length > 0) {
        // res.status(200).json({ comments: beer.Ratings });
        const comments = result[0].comments;
        res.status(200).json({ comments });
    } else {
        res.status(400).json({ message: "Comments could not be retrieved." });
    }
}

module.exports = getBeerComments;