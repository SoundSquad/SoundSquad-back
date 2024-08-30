import { Optional } from "sequelize";

export interface UserReviewAttributes {
  ureview_num?: number;
  writer_num?: number;
  squad_num?: number;
  opener_num?: number;
  rating?: number;
  activate?: boolean;
}

export interface UserReviewCreationAttributes extends Optional<UserReviewAttributes, 'ureview_num'> {}
