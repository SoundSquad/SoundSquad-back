import { join } from "path";
import { Optional } from "sequelize";

export interface SquadInfoAttributes {
  squad_num: number;
  concert_num: number;
  opener_num: number;
  member_num: number;
}

export interface SquadInfoCreationAttributes extends Optional<SquadInfoAttributes, 'squad_num'> {}

export interface exSquadAttributes{
  member_num : number ;
}

export interface avgRatingUpdateObj{
  user_rating : number;
}