import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { CommunityReportAttributes, CommunityReportCreationAttributes } from '../modules/McommunityReport';

class CommunityReport extends Model<CommunityReportAttributes, CommunityReportCreationAttributes> implements CommunityReportAttributes {
  public community_report_num!: number;
  public article_num!: number;
  public writer_num!: number;

  static associate(models: any) {
    CommunityReport.belongsTo(models.Community, {
      foreignKey: 'article_num'
    });
    CommunityReport.belongsTo(models.User, {
      foreignKey: 'writer_num'
    });
  }
}

export default (sequelize: Sequelize) => {
  CommunityReport.init(
    {
      community_report_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      article_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      writer_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'community_report',
      timestamps: true,
      underscored: true,
    }
  );

  return CommunityReport;
};