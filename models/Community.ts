import { Model, DataTypes, Sequelize } from 'sequelize';
import { CommunityAttributes, CommunityCreationAttributes } from '../modules/Mcommunity';
class Community extends Model<CommunityAttributes, CommunityCreationAttributes> implements CommunityAttributes {
  public article_num?: number;
  public user_num?: number;
  public category?: string;
  public article_title?: string;
  public article_content?: string;
  public created_at?: Date;
  public update_at?: Date;
  public activate?: boolean;

  static associate(models: any) {
    Community.belongsTo(models.User, {
      foreignKey: 'user_num'
    });
    Community.hasMany(models.Comment, {
      foreignKey: 'article_num'
    });
    Community.hasMany(models.CommunityReport, {
      foreignKey: 'article_num'
    });
  }
}

export default (sequelize: Sequelize) => {
  Community.init(
    {
      article_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      article_title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      article_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      update_at: {
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
      modelName: 'COMMUNITY',
      tableName: 'COMMUNITY',
      timestamps: true,
      underscored: true,
    }
  );

  return Community;
};