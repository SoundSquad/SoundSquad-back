import { Optional } from 'sequelize';

export interface ArtistAttributes {
  artist_num: number;
  updated_at: Date;
  artist_id: string;
  artist_name: string;
  artist_profile: string;
  profile_click: number;
  artist_desc: string;
  artist_genre: string;
  
}

export interface ArtistCreationAttributes extends Optional<ArtistAttributes, 'artist_num' | 'updated_at' | 'profile_click'> {}

export interface initArtist{
  artist_id : string;
  artist_profile : string;
  artist_name : string;
  profile_click : number | 0 ;
}

export interface updateCountA{
  profile_click : number;
}