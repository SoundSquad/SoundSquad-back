import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface ConcertReviewAttributes {
  creview_num: number;
  user_num: number;
  concert_num: number;
  creview_content: string;
  activate: boolean;
}

interface ConcertReviewModel extends Model<ConcertReviewAttributes>, ConcertReviewAttributes {}

type ConcertReviewStatic = ModelStatic<ConcertReviewModel>;

const ConcertReview = (sequelize: Sequelize): ConcertReviewStatic => {
  const model = sequelize.define<ConcertReviewModel>(
    'CONCERT_REVIEW',
    {
      creview_num: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      activate: {
        type: DataTypes.BOOLEAN,
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

export default ConcertReview;