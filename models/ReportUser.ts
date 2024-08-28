import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface ReportUserAttributes {
  report_num: number;
  user_num: number;
  writer_num: number;
}

interface ReportUserModel extends Model<ReportUserAttributes>, ReportUserAttributes {}

type ReportUserStatic = ModelStatic<ReportUserModel>;

const ReportUser = (sequelize: Sequelize): ReportUserStatic => {
  const model = sequelize.define<ReportUserModel>(
    'REPORT_USER',
    {
      report_num: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_num: {
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

export default ReportUser;