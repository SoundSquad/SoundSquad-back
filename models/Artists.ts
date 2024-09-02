import { Model, DataTypes, Sequelize } from 'sequelize';
import { ArtistsAttributes, ArtistsCreationAttributes } from '../modules/Martists';
class Artists extends Model<ArtistsAttributes, ArtistsCreationAttributes> implements ArtistsAttributes {
  public artist_num!: number;
  public updated_at!: Date;
  public artist_id!: string;
  public artist_name!: string;
  public artist_profile!: string;
  public profile_click!: number;
  public artist_desc!: string;
  public artist_genre!: string;

  static associate(models: any) {
    Artists.hasMany(models.ConcertInfo, {
      foreignKey: 'artist_num'
    });
  }
}

export default (sequelize: Sequelize) => {
  Artists.init(
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
      tableName: 'artists',
      timestamps: false,
      underscored: true,
    }
  );

  return Artists;
};