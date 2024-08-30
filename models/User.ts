import { Model, DataTypes, Sequelize } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from '../modules/Muser';
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_num!: number;
  public user_id!: string;
  public user_pw!: string;
  public user_gender!: number;
  public user_bd!: Date;
  public introduce!: string | null;
  public profile_img!: string | null;
  public token!: string | null;
  public prefer_genre!: string | null;
  public mbti!: string | null;
  public activate!: boolean;
  public user_rating!: number | null;


  // 타임스탬프 필드
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static associate(models: any) {
    // ConcertReview와의 관계
    User.hasMany(models.ConcertReview, {
      foreignKey: 'user_num'
    });

    // ReviewLikes와의 관계
    // User.hasMany(models.ReviewLikes, {
    //   foreignKey: 'user_num'
    // });

    // Community와의 관계
    User.hasMany(models.Community, {
      foreignKey: 'user_num'
    });

    // Comment와의 관계
    User.hasMany(models.Comment, {
      foreignKey: 'user_num'
    });

    // UserReview와의 관계 (작성자로서)
    User.hasMany(models.UserReview, {
      foreignKey: 'writer_num'
    });

    // UserReview와의 관계 (평가 대상으로서)
    User.hasMany(models.UserReview, {
      foreignKey: 'opener_num'
    });

    // ReportUser와의 관계 (신고 대상으로서)
    User.hasMany(models.ReportUser, {
      foreignKey: 'user_num',
    });

    // ReportUser와의 관계 (신고자로서)
    User.hasMany(models.ReportUser, {
      foreignKey: 'writer_num',
    });

    // CommunityReport와의 관계
    User.hasMany(models.CommunityReport, {
      foreignKey: 'writer_num',
    });

    // CommentReport와의 관계
    User.hasMany(models.CommentReport, {
      foreignKey: 'writer_num',
    });

    // SquadInfo와의 관계 (오프너로서)
    User.hasMany(models.SquadInfo, {
      foreignKey: 'opener_num',
    });

    // SquadInfo와의 관계 (멤버로서)
    User.hasMany(models.SquadInfo, {
      foreignKey: 'member_num',
    });
  }

}

export default (sequelize: Sequelize) => {
  User.init(
    {
      user_num: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      user_pw: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      user_gender: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_bd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      introduce: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profile_img: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      prefer_genre: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      mbti: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      activate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      user_rating: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'USER',
      tableName: 'USER',
      timestamps: true,
      underscored: true,
    }
  );

  return User;
};  