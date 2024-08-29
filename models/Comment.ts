import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface CommentAttributes {
  comment_num?: number;
  article_num: number;
  user_num: number;
  comment_content: string;
  activate?:boolean;
}

interface CommentModel extends Model<CommentAttributes>, CommentAttributes {}

type CommentStatic = ModelStatic<CommentModel>;

const Comment = (sequelize: Sequelize): CommentStatic => {
  const model = sequelize.define<CommentModel>(
    'COMMENT',
    {
      comment_num: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        type:DataTypes.BOOLEAN,
        allowNull: true,
      }
    },
    {
      freezeTableName: true, // 테이블 명 고정
      timestamps: true, // 데이터가 추가되고 수정된 시간을 자동으로 컬럼을 만들어서 기록
    }
  );

  return model;
};

export default Comment;