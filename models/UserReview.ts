import { Model, DataTypes, Sequelize } from 'sequelize';
import { UserReviewAttributes, UserReviewCreationAttributes } from '../modules/MuserReview';


class UserReview extends Model<UserReviewAttributes, UserReviewCreationAttributes> implements UserReviewAttributes {
  public ureview_num!: number;
  public writer_num!: number;
  public squad_num!: number;
  public rating!: number;
  public activate!: boolean;
  public reviewed_user!: number;
  public concert_num!: number;

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
        primaryKey : true,
        autoIncrement: true,
      },
      writer_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reviewed_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      squad_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      concert_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'USER_REVIEW',
      tableName: 'USER_REVIEW',
      timestamps: true,
      underscored: true,
    }
  );

  return UserReview;
};