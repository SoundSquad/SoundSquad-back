import { Model, DataTypes, Sequelize } from 'sequelize';
import { ConcertReviewAttributes, ConcertReviewCreationAttributes } from '../modules/MconcertReview';

class ConcertReview extends Model<ConcertReviewAttributes, ConcertReviewCreationAttributes> implements ConcertReviewAttributes {
  public creview_num?: number;
  public user_num?: number;
  public concert_num?: number;
  public creview_content?: string;
  public created_at?: Date;
  public updated_at?: Date;
  public activate?: boolean;

  static associate(models: any) {
    ConcertReview.belongsTo(models.User, {
      foreignKey: 'user_num'
    });
    ConcertReview.belongsTo(models.ConcertInfo, {
      foreignKey: 'concert_num'
    });
    // ConcertReview.hasMany(models.ReviewLikes, {
    //   foreignKey: 'creview_num'
    // });
  }
}

export default (sequelize: Sequelize) => {
  ConcertReview.init(
    {
      creview_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      concert_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      creview_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      activate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'CONCERT_REVIEW',
      tableName: 'CONCERT_REVIEW',
      timestamps: true,
      underscored: true,
    }
  );

  return ConcertReview;
};