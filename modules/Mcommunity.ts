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
