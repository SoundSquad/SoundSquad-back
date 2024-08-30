import { Model, DataTypes, Sequelize } from 'sequelize';
import { UserReviewAttributes, UserReviewCreationAttributes } from '../modules/MuserReview';

class UserReview extends Model<UserReviewAttributes, UserReviewCreationAttributes> implements UserReviewAttributes {
  public ureview_num?: number;
  public writer_num?: number;
  public squad_num?: number;
  public opener_num?: number;
  public rating?: number;
  public activate?: boolean;

  static associate(models: any) {

    UserReview.belongsTo(models.User, {
      foreignKey: 'writer_num'
    });
    UserReview.belongsTo(models.User, {
      foreignKey: 'opener_num'
    });
    UserReview.belongsTo(models.SquadInfo, {
      foreignKey: 'squad_num'
    });
  }
}

export default (sequelize: Sequelize) => {
  UserReview.init(
    {
      ureview_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      writer_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      squad_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      opener_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    },
    {
      sequelize,
      modelName: 'USER_REVIEW',
      tableName: 'USER_REVIEW',
      timestamps: true,
    }
  );

  return UserReview;
};