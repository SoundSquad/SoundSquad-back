import { Optional } from "sequelize";

export interface SquadInfoAttributes {
  squad_num?: number;
  concert_num?: number;
  opener_num?: number;
  member_num?: number;
}

export interface SquadInfoCreationAttributes extends Optional<SquadInfoAttributes, 'squad_num'> {}
