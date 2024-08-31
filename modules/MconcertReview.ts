import { Model, Optional } from "sequelize";

export interface ConcertReviewAttributes {
  creview_num: number;
  user_num: number;
  concert_num: number;
  creview_content: string;
  activate: boolean;
}

export interface ConcertReviewCreationAttributes extends Optional<ConcertReviewAttributes, 'creview_num' > {}
