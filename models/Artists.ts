import { Model, DataTypes, Sequelize } from 'sequelize';
import { ArtistAttributes, ArtistCreationAttributes } from '../modules/Martists';
class Artist extends Model<ArtistAttributes, ArtistCreationAttributes> implements ArtistAttributes {
  public artist_num!: number;
  public updated_at!: Date;
  public artist_id!: string;
  public artist_name!: string;
  public artist_profile!: string;
  public profile_click!: number;
  public artist_desc!: string;
  public artist_genre!: string;

  static associate(models: any) {
    Artist.hasMany(models.ConcertInfo, {
      foreignKey: 'artist_num'
    });
  }
}

export default (sequelize: Sequelize) => {
  Artist.init(
    {
      artist_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      artist_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      artist_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      artist_profile: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      profile_click: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      artist_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      artist_genre: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ARTISTS',
      tableName: 'ARTISTS',
      timestamps: false,
      underscored: true,
    }
  );

  return Artist;
};