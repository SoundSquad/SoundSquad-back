import { Optional } from 'sequelize';

export interface CommunityAttributes {
  article_num: number;
  user_num: number;
  category: string;
  article_title: string;
  article_content: string;
  activate: boolean;
}

export interface CommunityCreationAttributes extends Optional<CommunityAttributes, 'article_num' > {}

export interface UpdateTargetComment { // 추후 분리 예정
  comment_content : string;
}


export interface DeleteTarget { // 추후 분리 예정
  activate:boolean;
}

export interface UpdateTargetCommunity { // 추후 분리 예정
  category: string;
  article_title: string;
  article_content: string;
}