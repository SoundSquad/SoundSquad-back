export interface updatedFields {
    profile_img?: string,
    user_pw?: string,
    prefer_genre?: string,
    mbti?: string
};

export interface userReviewObj {
    concert_num: number,
    writer: boolean,
    other_user: number,
    rating: number,
    created_at?: string
}

export interface findSquadInfoReturn {
    msg: string,
    userReviewList: Array<userReviewObj>
}