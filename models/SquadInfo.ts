import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface SquadInfoAttributes {
  squad_num: number;
  concert_num: number;
  opener_num: number;
  member_num: number;
}

interface SquadInfoModel extends Model<SquadInfoAttributes>, SquadInfoAttributes {}

type SquadInfoStatic = ModelStatic<SquadInfoModel>;

const SquadInfo = (sequelize: Sequelize): SquadInfoStatic => {
  const model = sequelize.define<SquadInfoModel>(
    'SQUAD_INFO',
    {
      squad_num: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      concert_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      opener_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      member_num: {
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

export default SquadInfo;