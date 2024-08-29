import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface CommunityAttributes {
  article_num?: number;
  user_num: number;
  category: string;
  article_title: string;
  article_content: string;
  activate?: boolean;
}

interface CommunityModel extends Model<CommunityAttributes>, CommunityAttributes {}

type CommunityStatic = ModelStatic<CommunityModel>;

const Community = (sequelize: Sequelize): CommunityStatic => {
  const model = sequelize.define<CommunityModel>(
    'COMMUNITY',
    {
      article_num: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      activate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      freezeTableName: true, // 테이블 명 고정
      timestamps: true, // 데이터가 추가되고 수정된 시간을 자동으로 컬럼을 만들어서 기록
    }
  );

  return model;
};

export default Community;