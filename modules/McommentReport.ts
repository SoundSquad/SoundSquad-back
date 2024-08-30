import { Optional } from 'sequelize';

export interface CommentReportAttributes {
  comment_report_num?: number;
  comment_num?: number;
  writer_num?: number;
}

export interface CommentReportCreationAttributes extends Optional<CommentReportAttributes, 'comment_report_num'> {}
