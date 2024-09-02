import { Model, DataTypes, Sequelize } from 'sequelize';
import { CommentReportAttributes, CommentReportCreationAttributes } from '../modules/McommentReport';

class CommentReport extends Model<CommentReportAttributes, CommentReportCreationAttributes> implements CommentReportAttributes {
  public comment_report_num!: number;
  public comment_num!: number;
  public writer_num!: number;

  static associate(models: any) {
    CommentReport.belongsTo(models.Comment, {
      foreignKey: 'comment_num'
    });
    CommentReport.belongsTo(models.User, {
      foreignKey: 'writer_num'
    });
  }
}

export default (sequelize: Sequelize) => {
  CommentReport.init(
    {
      comment_report_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      comment_num: {
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
      tableName: 'comment_report',
      timestamps: true,
      underscored: true,
    }
  );

  return CommentReport;
};