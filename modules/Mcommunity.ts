import { Optional } from 'sequelize';

export interface CommunityAttributes {
  article_num: number;
  user_num: number;
  category: string;
  article_title: string;
  article_content: string;
  created_at: Date;
  update_at: Date;
  activate: boolean;
}

export interface CommunityCreationAttributes extends Optional<CommunityAttributes, 'article_num' | 'created_at' | 'update_at'> {}
