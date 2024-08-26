'use strict';

const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.json')['development'];
const db = {};

let sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  config
);

// User
const UserModel = require('./User')(sequelize, Sequelize);
const UserReviewModel = require('./UserReview')(sequelize, Sequelize);
const ReportUserModel = require('./ReportUser')(sequelize, Sequelize);

// Community
const CommunityModel = require('Community')(sequelize, Sequelize);
const CommunityReportModel = require('./CommunityReport')(sequelize, Sequelize);
const CommentModel = require('./Comment')(sequelize, Sequelize);
const CommentReportModel = require('./CommentReport')(sequelize, Sequelize);

// Concert
const ConcertReviewModel = require('./ConcertReview')(sequelize, Sequelize);
const ReviewLikes = require('./ReviewLikes')(sequelize, Sequelize);
const ConcertInfoModel = require('./ConcertInfo')(sequelize, Sequelize);
const SquadInfoModel = require('./SquadInfo')(sequelize, Sequelize);
const ArtistsModel = require('./Artists')(sequelize, Sequelize);


// Sync 
async function syncModels() {
  try {
    let flag = true;

    // User
    await UserModel.sync({ force: flag });
    console.log("*** User table created");

    await ReportUserModel.sync({ force: flag });
    console.log("*** Report User table created");

    await UserReviewModel.sync({ force: flag });
    console.log("*** User Review table created");

    // Community
    await CommunityModel.sync({ force: flag });
    console.log("*** Community table created");

    await CommunityReportModel.sync({ force: flag });
    console.log("*** Community Report table created"); 

    await CommentModel.sync({ force: flag });
    console.log("*** Comment table created");

    await CommentReportModel.sync({ force: flag });
    console.log("*** Comment Report table created");

    // Concert
    await ConcertReviewModel.sync({ force: flag });
    console.log("*** Concert Review table created");

    await ReviewLikes.sync({ force: flag });
    console.log("*** Review Likes Report table created");

    await ConcertInfoModel.sync({ force: flag });
    console.log("*** Concert Info table created");

    await SquadInfoModel.sync({ force: flag });
    console.log("*** Squad Info table created");

    await ArtistsModel.sync({ force: flag });
    console.log("*** Artists table created");

    console.log("All tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

syncModels();

// UserModel.hasMany(UserReviewModel, { 
//   foreignKey: 'user_num',
//   sourceKey: 'user_num',
//   onDelete: 'cascade',
//   onUpdate: 'cascade'
// });
// UserReviewModel.belongsTo(UserModel, { 
//   foreignKey: 'user_num',
//   targetKey: 'user_num'
// });

// UserModel.hasMany(ConcertReviewModel, { 
//   foreignKey: 'user_num',
//   sourceKey: 'user_num',
//   onDelete: 'cascade',
//   onUpdate: 'cascade' 
// });
// ConcertReviewModel.belongsTo(UserModel, { 
//   foreignKey: 'user_num',
//   targetKey: 'user_num'
// });

// ConcertReviewModel.hasMany(ReviewLikesModel, { 
//   foreignKey: 'creview_num',
//   sourceKey: 'creview_num',
//   onDelete: 'cascade',
//   onUpdate: 'cascade' 
// });
// ReviewLikesModel.belongsTo(ConcertReviewModel, { 
//   foreignKey: 'creview_num',
//   targetKey: 'creview_num',
// });

// UserModel.hasMany(ReviewLikesModel, { 
//   foreignKey: 'user_num',
//   sourceKey: 'user_num',
//   onDelete: 'cascade',
//   onUpdate: 'cascade' 
// });
// ReviewLikesModel.belongsTo(UserModel, { 
//   foreignKey: 'user_num',
//   targetKey: 'user_num', 
// });

// ConcertReviewModel.hasMany(ConcertImgModel, { 
//   foreignKey: 'creview_num',
//   sourceKey: 'creview_num',
//   onDelete: 'cascade',
//   onUpdate: 'cascade' 
// });
// ConcertImgModel.belongsTo(ConcertReviewModel, { 
//   foreignKey: 'creview_num',
//   targetKey: 'creview_num',
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// User
db.User = UserModel;
db.ReportUser = ReportUserModel;
db.UserReview = UserReviewModel;
// Community
db.Community = CommunityModel;
db.CommunityReport = CommunityReportModel;
db.Comment = CommentModel;
db.CommentReport = CommentReportModel;
// Concert
db.ConcertReview = ConcertReviewModel;
db.ReviewLikes = ReviewLikes;
db.ConcertInfo = ConcertInfoModel;
db.SquadInfo = SquadInfoModel;
db.Artists = ArtistsModel;

module.exports = db;
