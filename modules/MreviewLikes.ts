import { Optional } from "sequelize";

export interface ReviewLikesAttributes {
  like_num?: number;
  user_num?: number;
  creview_num?: number;
}

export interface ReviewLikesCreationAttributes extends Optional<ReviewLikesAttributes, 'like_num'> {}
