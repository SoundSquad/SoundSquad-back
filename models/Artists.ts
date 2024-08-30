import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import {ArtistAttributes} from '../modules/artists';

// interface ArtistAttributes {
//   artist_num: number;
//   artist_id: string;
//   artist_name: string;
//   artist_profile: string;
//   profile_click?: number;
// }

interface ArtistModel extends Model<ArtistAttributes>, ArtistAttributes {}

type ArtistStatic = ModelStatic<ArtistModel>;

const Artists = (sequelize: Sequelize): ArtistStatic => {
  const model = sequelize.define<ArtistModel>(
    'ARTISTS',
    {
      artist_num: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      artist_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      artist_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      artist_profile: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      profile_click: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true, // 테이블 명 고정
      timestamps: false, // 데이터가 추가되고 수정된 시간을 자동으로 컬럼을 만들어서 기록
    }
  );

  return model;
};

export default Artists;