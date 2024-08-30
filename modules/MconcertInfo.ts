import { Optional } from 'sequelize';

export interface ConcertInfoAttributes {
  concert_num?: number;
  artist_num?: number;
  concert_title?: string;
  start_date?: Date;
  end_date?: Date;
  concert_image?: string;
  concert_location?: string;
  concert_genre?: string;
  concert_detail?: string;
  ticket_link?: string;
  info_click?: number;
}

export interface ConcertInfoCreationAttributes extends Optional<ConcertInfoAttributes, 'concert_num' | 'info_click'> {}