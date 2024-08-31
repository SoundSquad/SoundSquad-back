
import { Model, DataTypes, Sequelize } from 'sequelize';
import { ConcertInfoAttributes, ConcertInfoCreationAttributes } from '../modules/MconcertInfo';
class ConcertInfo extends Model<ConcertInfoAttributes, ConcertInfoCreationAttributes> implements ConcertInfoAttributes {
  public concert_num!: number;
  public artist_num!: number;
  public concert_title!: string;
  public start_date!: Date;
  public end_date!: Date;
  public concert_image!: string;
  public concert_location!: string;
  public concert_genre!: string;
  public concert_detail!: string;
  public ticket_link!: string;
  public info_click!: number;

    associate(models: any) {
    ConcertInfo.belongsTo(models.Artist, {
      foreignKey: 'artist_num'
    });
    ConcertInfo.hasMany(models.ConcertReview, {
      foreignKey: 'concert_num'
    });
    ConcertInfo.hasMany(models.SquadInfo, {
      foreignKey: 'concert_num'
    });
  }
}

export default (sequelize: Sequelize) => {
  ConcertInfo.init(
    {
      concert_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      artist_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      concert_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      concert_image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      concert_location: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      concert_genre: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      concert_detail: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ticket_link: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      info_click: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'CONCERT_INFO',
      tableName: 'CONCERT_INFO',
      timestamps: false,
      underscored: true,
    }
  );

  return ConcertInfo;
};