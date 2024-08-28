import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface CommentReportAttributes {
  comment_report_num: number;
  article_num: number;
  writer_num: number;
}

interface CommentReportModel extends Model<CommentReportAttributes>, CommentReportAttributes {}

type CommentReportStatic = ModelStatic<CommentReportModel>;

const CommentReport = (sequelize: Sequelize): CommentReportStatic => {
  const model = sequelize.define<CommentReportModel>(
    'COMMENT_REPORT',
    {
      comment_report_num: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      article_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      writer_num: {
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

export default CommentReport;