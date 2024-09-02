import { Sequelize } from 'sequelize';

import artistsModel from './Artists';
import concertInfoModel from './ConcertInfo';
import userModel from './User';
import concertReviewModel from './ConcertReview';
// import reviewLikesModel from './ReviewLikes';
import communityModel from './Community';
import commentModel from './Comment';
import reportUserModel from './ReportUser';
import communityReportModel from './CommunityReport';
import commentReportModel from './CommentReport';
import squadInfoModel from './SquadInfo';
import userReviewModel from './UserReview';

import * as envConfog from '../config/envConfig';

const env = process.env.NODE_ENV || 'development';

const dbConfig = envConfog.dbConfig[env];

const sequelize = new Sequelize(
  dbConfig.database, 
  dbConfig.username, 
  dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    timezone: '+09:00',
    logging: console.log
});

const db = {
  sequelize,
  Sequelize,
  Artists: artistsModel(sequelize),
  ConcertInfo: concertInfoModel(sequelize),
  User: userModel(sequelize),
  ConcertReview: concertReviewModel(sequelize),
  Community: communityModel(sequelize),
  Comment: commentModel(sequelize),
  ReportUser: reportUserModel(sequelize),
  CommunityReport: communityReportModel(sequelize),
  CommentReport: commentReportModel(sequelize),
  SquadInfo: squadInfoModel(sequelize),
  UserReview: userReviewModel(sequelize),
};

// Sync function
async function syncModels() {
  try {
    const force = false;

// 1. 독립적인 테이블 먼저 생성
await db.User.sync({ force });
console.log("*** User table created");

await db.Artists.sync({ force });
console.log("*** Artists table created");

// 2. User를 참조하는 테이블들
await db.ReportUser.sync({ force });
console.log("*** Report User table created");

// 3. Artists를 참조할 수 있는 ConcertInfo
await db.ConcertInfo.sync({ force });
console.log("*** Concert Info table created");

// 4. ConcertInfo를 참조하는 SquadInfo
await db.SquadInfo.sync({ force });
console.log("*** Squad Info table created");

// 5. User와 SquadInfo를 참조하는 UserReview
await db.UserReview.sync({ force });
console.log("*** User Review table created");

// 6. User를 참조하는 Community
await db.Community.sync({ force });
console.log("*** Community table created");

// 7. Community를 참조하는 테이블들
await db.CommunityReport.sync({ force });
console.log("*** Community Report table created"); 

await db.Comment.sync({ force });
console.log("*** Comment table created");

await db.CommentReport.sync({ force });
console.log("*** Comment Report table created");

// 8. User와 ConcertInfo를 참조할 수 있는 ConcertReview
await db.ConcertReview.sync({ force });
console.log("*** Concert Review table created");

  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

async function checkAssociations() {
  // console.log(db.Comment.associations);
  // console.log(db.Artists.associations);
  // console.log(db.ConcertInfo.associations);
  // console.log(db.User.associations);
  // console.log(db.Community.associations);
  // console.log(db.ReportUser.associations);
  // console.log(db.ConcertReview.associations);
}


Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});



syncModels().then(checkAssociations);

export default db;