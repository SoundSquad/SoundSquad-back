import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface UserAttributes {
  user_num?: number; // Make this optional
  user_id: string;
  user_pw: string;
  user_gender: number;
  user_bd: Date;
  profile_img?: string;
  credit?: number;
  prefer_genre?: string;
  mbti?: string;
  activate?: boolean;
  user_rating?: number;
  self_introduce?: string;
}

interface UserModel extends Model<UserAttributes>, UserAttributes {}

type UserStatic = ModelStatic<UserModel>;

const User = (sequelize: Sequelize): UserStatic => {
  const model = sequelize.define<UserModel>(
    'USER',
    {
      user_num: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // This makes it auto-generated
      },
      user_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      user_pw: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      user_gender: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_bd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      profile_img: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      credit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      prefer_genre: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      mbti: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      activate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      user_rating: {
        type: DataTypes.DECIMAL(3,2),
        allowNull: true,
        defaultValue: 0,
      },
      self_introduce: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return model;
};

export default User;