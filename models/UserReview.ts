import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface UserReviewAttributes {
  ureview_num: number;
  squad_num: number;
  ureview_content?: string;
  writer_num: number;
  rating: number;
  review_null: boolean;
  activate: boolean;
  concert_num: number;
  reviewed_user:number;
}

interface UserReviewModel extends Model<UserReviewAttributes>, UserReviewAttributes {}

type UserReviewStatic = ModelStatic<UserReviewModel>;

const UserReview = (sequelize: Sequelize): UserReviewStatic => {
  const model = sequelize.define<UserReviewModel>(
    'USER_REVIEW',
    {
      ureview_num: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      squad_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ureview_content: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      review_null: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      activate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      concert_num: {
        type: DataTypes.INTEGER,
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

export default UserReview;