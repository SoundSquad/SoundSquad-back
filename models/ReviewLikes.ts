import { Model, DataTypes, Sequelize } from 'sequelize';
import { ReviewLikesAttributes, ReviewLikesCreationAttributes } from '../modules/MreviewLikes';
class ReviewLikes extends Model<ReviewLikesAttributes, ReviewLikesCreationAttributes> implements ReviewLikesAttributes {
  public like_num!: number;
  public user_num!: number;
  public creview_num!: number;

  static associate(models: any) {
    ReviewLikes.belongsTo(models.User, {
      foreignKey: 'user_num'
    });
    ReviewLikes.belongsTo(models.ConcertReview, {
      foreignKey: 'creview_num'
    });
  }
}

export default (sequelize: Sequelize) => {
  ReviewLikes.init(
    {
      like_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      creview_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'REVIEW_LIKES',
      tableName: 'REVIEW_LIKES',
      timestamps: true,
      underscored: true,
    }
  );

  return ReviewLikes;
};