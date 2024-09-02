import { Optional } from "sequelize";

export interface UserAttributes {
  user_num: number;
  user_id: string;
  user_pw: string;
  user_gender: number;
  user_bd: Date;
  introduce?: string | null;
  profile_img: string | null;
  token?: string | null;
  prefer_genre?: string | null;
  mbti?: string | null;
  activate?: boolean;
  user_rating?: number | null;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'user_num' > {}



export interface postUserFields{
  user_id: string;
  user_pw: string;
  user_gender: number;
  user_bd: Date;
  introduce?: string | null;
  profile_img?: string | 'default';
  activate? : boolean;
}

export interface UpdatedUserFields {
  profile_img?: string;
  prefer_genre?: string;
  mbti?: string;
}

export interface UpdatedPasswordFields{
  user_pw?: string;
}

export interface userReviewObj {
  concert_num: number,
  writer: boolean,
  other_user: number,
  rating: number,
  created_at?: string
}

export interface findSquadInfoReturn {
  msg: string,
  userReviewList: Array<userReviewObj>
}


