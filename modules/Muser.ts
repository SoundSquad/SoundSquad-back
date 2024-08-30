import { Optional } from "sequelize";

export interface UserAttributes {
  user_num?: number;
  user_id?: string;
  user_pw?: string;
  user_gender?: number;
  user_bd?: Date;
  introduce?: string | null;
  profile_img?: string | null;
  token?: string | null;
  prefer_genre?: string | null;
  mbti?: string | null;
  activate?: boolean;
  user_rating?: number | null;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'user_num' > {}
