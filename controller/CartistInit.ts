const axios = require('axios');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { Artists } = require('../models/index.ts');
const genreList:object[] = [
    {name: 'Alternative', id: 'KnvZfZ7vAvv'},
    {name: 'Ballads-Romantic', id: 'KnvZfZ7vAve'},
    {name: 'Blues', id: 'KnvZfZ7vAvd'},
    {name: 'Chanson Francaise', id: 'KnvZfZ7vAvA'},
    {name: 'Childrens Music', id: 'KnvZfZ7vAvk'},
    {name: 'Classical', id: 'KnvZfZ7vAeJ'},
    {name: 'Country', id: 'KnvZfZ7vAv6'},
    {name: 'Dance-Electronic', id: 'KnvZfZ7vAvF'},
    {name: 'Folk', id: 'KnvZfZ7vAva'},
    {name: 'Hip-Hop-Rap', id: 'KnvZfZ7vAv1'},
    {name: 'Holiday', id: 'KnvZfZ7vAvJ'},
    {name: 'Jazz', id: 'KnvZfZ7vAvE'},
    {name: 'Latin', id: 'KnvZfZ7vAJ6'},
    {name: 'Metal', id: 'KnvZfZ7vAvt'},
    {name: 'New Age', id: 'KnvZfZ7vAvn'},
    {name: 'Other', id: 'KnvZfZ7vAvl'},
    {name: 'Pop', id: 'KnvZfZ7vAev'},
    {name: 'R&B', id: 'KnvZfZ7vAee'},
    {name: 'Reggae', id: 'KnvZfZ7vAed'},
    {name: 'Religious', id: 'KnvZfZ7vAe7'},
    {name: 'Rock', id: 'KnvZfZ7vAeA'},
    {name: 'Undefined', id: 'KnvZfZ7vAe6'},
    {name: 'World', id: 'KnvZfZ7vAeF'},
];

exports.getArtistsInit = async (req: Request, res: Response) => {
    try {

    } catch (err) {

    }
}