const ConcertInfo = (Sequelize, DataTypes) => {
    const model = Sequelize.define('CONCERT_INFO',
        {
            concert_num: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            artist_num: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            concert_title: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            concert_image: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            concert_location: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            concert_genre: {
                type: DataTypes.STRING(10),
                allowNull: true
            },
            concert_detail: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            ticket_link: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            info_click: {
                type: DataTypes.INT,
                allowNull: false,
                defaultValue: 0
            }
        },
        // param3: 모델 옵션 정의
        {
            freezeTableName: true, // 테이블 명 고정
            timestamps: false, // 데이터가 추가되고 수정된 시간을 자동으로 컬럼을 만들어서 기록
        }
    );
    return model;
}

module.exports = ConcertInfo;
