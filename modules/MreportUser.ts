import { Optional } from "sequelize";

export interface ReportUserAttributes {
  report_num: number;
  user_num: number;
  writer_num: number;
}

export interface ReportUserCreationAttributes extends Optional<ReportUserAttributes, 'report_num'> {}
