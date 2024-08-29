import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import url from 'url';

dotenv.config();

export const testApi = async (req: Request, res: Response) => {
  try {
    console.log('req >>>> ', req);  
  } catch (err) {
    console.error(err);
  }
};