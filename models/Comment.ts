import { Model, DataTypes, Sequelize } from 'sequelize';
import { CommentAttributes, CommentCreationAttributes } from '../modules/Mcomment';

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public comment_num?: number;
  public article_num?: number;
  public user_num?: number;
  public comment_content?: string;
  public activate?: boolean;

  static associate(models: any) {
    Comment.belongsTo(models.Community, {
      foreignKey: 'article_num'
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'user_num'
    });
    Comment.hasMany(models.CommentReport, {
      foreignKey: 'comment_num'
    });
  }
}

export default (sequelize: Sequelize) => {
  Comment.init(
    {
      comment_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      article_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment_content: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      activate:{
        type: DataTypes.BOOLEAN,
        allowNull :true,
      }
    },
    {
      sequelize,
      modelName: 'COMMENT',
      tableName: 'COMMENT',
      timestamps: false,
    }
  );

  return Comment;
};