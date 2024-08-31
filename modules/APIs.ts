export interface ArtistAttributes {
  artist_num?: number;
  artist_id: string;
  artist_name: string;
  artist_profile: string;
  profile_click: number;
  artist_desc: string;
  artist_genre:string;
}

export interface GenreDetail {
    name: string,
    id: string
};


export interface ConcertData {
  title: string;
  start_date: string;
  end_date: string;
  image_url: string;
  location: string;
  description: string;
  ticket_link: string;
}

export interface ArtistEventData {
  artist_num: number;
  artist_id: string;
  events: ConcertData[];
}

