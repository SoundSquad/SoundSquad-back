import { Optional } from 'sequelize';

export interface CommentAttributes {
  comment_num?: number;
  article_num?: number;
  user_num?: number;
  comment_content?: string;
  activate?: boolean;
}

export interface CommentCreationAttributes extends Optional<CommentAttributes, 'comment_num'> {}

