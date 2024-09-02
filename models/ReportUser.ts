import { Model, DataTypes, Sequelize } from 'sequelize';
import { ReportUserAttributes, ReportUserCreationAttributes } from '../modules/MreportUser';
class ReportUser extends Model<ReportUserAttributes, ReportUserCreationAttributes> implements ReportUserAttributes {
  public report_num!: number;
  public user_num!: number;
  public writer_num!: number;

  static associate(models: any) {
    ReportUser.belongsTo(models.User, {
      foreignKey: 'user_num'
    });
    ReportUser.belongsTo(models.User, {
      foreignKey: 'writer_num'
    });
  }
}

export default (sequelize: Sequelize) => {
  ReportUser.init(
    {
      report_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_num: {
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
      tableName: 'report_user',
      timestamps: true,
      underscored: true,
    }
  );

  return ReportUser;
};