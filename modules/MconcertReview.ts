import { Optional } from "sequelize";

export interface ConcertReviewAttributes {
  creview_num?: number;
  user_num?: number;
  concert_num?: number;
  creview_content?: string;
  created_at?: Date;
  updated_at?: Date;
  activate?: boolean;
}

export interface ConcertReviewCreationAttributes extends Optional<ConcertReviewAttributes, 'creview_num' | 'created_at' | 'updated_at'> {}
