import { Optional } from 'sequelize';

export interface CommunityReportAttributes {
  community_report_num?: number;
  article_num?: number;
  writer_num?: number;
}

export interface CommunityReportCreationAttributes extends Optional<CommunityReportAttributes, 'community_report_num'> {}
