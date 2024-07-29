const express = require('express');
const {getClient} = require('../database');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

async function searchBeer(req, res){
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

    const beer = await db.collection('Beer').find(filter).toArray();
    
    if(beer.length > 0){
        res.status(200).json({beer})
    }
    else{
        res.status(400).json({error:"No beers matched with the criteria"})
    }
}

module.exports = searchBeer;