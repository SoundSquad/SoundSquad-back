import { Request, Response } from 'express';
import db from '../models';
import { Op, BulkCreateOptions } from 'sequelize';
import bcrypt from 'bcrypt';
import axios from 'axios';
import dotenv from 'dotenv';
import Artists from '../models/index';
import fs from 'fs';
import path from 'path';
import { ArtistAttributes, GenreDetail } from '../modules/artists';


// genre detail info
const genreList:GenreDetail[] = [
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

exports.getArtistsInit = async (req: Request, res: Response): Promise<void> => {
    try {
        let bulkArtists:ArtistAttributes[] = [];
        genreList.forEach((genre) => {
            // read each json files
            const readJsonFilePath = path.join(__dirname, `artists_${genre.name}.json`)
            const jsonFile = fs.readFileSync(readJsonFilePath);
            const jsonData = JSON.parse(jsonFile.toString());

            // insert artists into bulkArtists
            bulkArtists.push({
                artist_id: jsonData.artist_id,
                artist_name: jsonData.artist_name,
                artist_profile: jsonData.artist_profile,
                profile_click: 0
            });
        });

        const artists = await Artists.bulkCreate(bulkArtists);
        
        if(artists) {
            let text:string = "true";
            // res.text(text);
        }
        
    } catch (err) {
        // Handle any errors that occur
        console.error(err);
        // res.status(500).json({ success: "false", message: "An error occurred" });
    }
}