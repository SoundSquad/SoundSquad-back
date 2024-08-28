import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface ReviewLikesAttributes {
  like_num: number;
  user_num: number;
  creview_num: number;
}

interface ReviewLikesModel extends Model<ReviewLikesAttributes>, ReviewLikesAttributes {}

type ReviewLikesStatic = ModelStatic<ReviewLikesModel>;

const ReviewLikes = (sequelize: Sequelize): ReviewLikesStatic => {
  const model = sequelize.define<ReviewLikesModel>(
    'REVIEW_LIKES',
    {
      like_num: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      freezeTableName: true, // 테이블 명 고정
      timestamps: false, // 데이터가 추가되고 수정된 시간을 자동으로 컬럼을 만들어서 기록
    }
  );

  return model;
};

export default ReviewLikes;