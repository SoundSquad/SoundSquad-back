import { Model, DataTypes, Sequelize } from 'sequelize';
import { SquadInfoAttributes, SquadInfoCreationAttributes } from '../modules/MsquadInfo';

class SquadInfo extends Model<SquadInfoAttributes, SquadInfoCreationAttributes> implements SquadInfoAttributes {
  public squad_num!: number;
  public concert_num!: number;
  public opener_num!: number;
  public member_num!: number;
  public show_time!: Date;

  static associate(models: any) {
    SquadInfo.belongsTo(models.ConcertInfo, {
        foreignKey: 'concert_num'
    });
    SquadInfo.belongsTo(models.User, {
      foreignKey: 'opener_num'
    });
    SquadInfo.belongsTo(models.User, {
      foreignKey: 'member_num'
    });
  }
}

export default (sequelize: Sequelize) => {
  SquadInfo.init(
    {
      squad_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      show_time:{
        type :DataTypes.DATE,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'SQUAD_INFO',
      tableName: 'SQUAD_INFO',
      timestamps: true,
      underscored: true,
    }
  );

  return SquadInfo;
};