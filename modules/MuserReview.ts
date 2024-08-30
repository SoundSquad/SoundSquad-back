import { Optional } from "sequelize";

export interface UserReviewAttributes {
  ureview_num: number;
  writer_num: number;
  squad_num: number;
  reviewed_user: number;
  rating: number;
  activate: boolean;
  concert_num: number;
}

export interface UserReviewCreationAttributes extends Optional<UserReviewAttributes, 'ureview_num'> {}
