import { Sequelize } from 'sequelize';
import config from '../config/config';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env as keyof typeof config];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

// Import model functions
import UserModel from './User';
import UserReviewModel from './UserReview';
import ReportUserModel from './ReportUser';
import CommunityModel from './Community';
// import CommunityReportModel from './CommunityReport';
import CommentModel from './Comment';
import CommentReportModel from './CommentReport';
import ConcertReviewModel from './ConcertReview';
import ReviewLikesModel from './ReviewLikes';
import ConcertInfoModel from './ConcertInfo';
import SquadInfoModel from './SquadInfo';
import ArtistsModel from './Artists';

// Initialize models
const User = UserModel(sequelize);
const UserReview = UserReviewModel(sequelize);
const ReportUser = ReportUserModel(sequelize);
const Community = CommunityModel(sequelize);
// const CommunityReport = CommunityReportModel(sequelize);
const Comment = CommentModel(sequelize);
const CommentReport = CommentReportModel(sequelize);
const ConcertReview = ConcertReviewModel(sequelize);
const ReviewLikes = ReviewLikesModel(sequelize);
const ConcertInfo = ConcertInfoModel(sequelize);
const SquadInfo = SquadInfoModel(sequelize);
const Artists = ArtistsModel(sequelize);

// Sync function
async function syncModels() {
  try {
    const force = true;

    // User
    await User.sync({ force });
    console.log("*** User table created");

    await ReportUser.sync({ force });
    console.log("*** Report User table created");

    await UserReview.sync({ force });
    console.log("*** User Review table created");

    // Community
    await Community.sync({ force });
    console.log("*** Community table created");

    // await CommunityReport.sync({ force });
    // console.log("*** Community Report table created"); 

    await Comment.sync({ force });
    console.log("*** Comment table created");

    await CommentReport.sync({ force });
    console.log("*** Comment Report table created");

    // Concert
    await ConcertReview.sync({ force });
    console.log("*** Concert Review table created");

    await ReviewLikes.sync({ force });
    console.log("*** Review Likes Report table created");

    await ConcertInfo.sync({ force });
    console.log("*** Concert Info table created");

    await SquadInfo.sync({ force });
    console.log("*** Squad Info table created");

    await Artists.sync({ force });
    console.log("*** Artists table created");

    console.log("All tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

syncModels();

const db = {
  sequelize,
  Sequelize,
  User,
  ReportUser,
  UserReview,
  Community,
  // CommunityReport,
  Comment,
  CommentReport,
  ConcertReview,
  ReviewLikes,
  ConcertInfo,
  SquadInfo,
  Artists
};

export default db;