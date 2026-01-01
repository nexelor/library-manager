export interface Anime {
  _id: string;
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  title_synonyms: string[];
  main_picture?: Picture;
  alternative_titles?: AlternativeTitles;
  synopsis?: string;
  background?: string;
  mean?: number;
  rank?: number;
  popularity?: number;
  num_list_users: number;
  num_scoring_users: number;
  scored_by?: number;
  favorites?: number;
  members?: number;
  nsfw?: string;
  genres: Genre[];
  explicit_genres: Genre[];
  themes: Genre[];
  demographics: Genre[];
  created_at?: string;
  updated_at?: string;
  media_type: string;
  type?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  aired?: Aired;
  year?: number;
  num_episodes?: number;
  episodes?: number;
  start_season?: Season;
  season?: string;
  broadcast?: Broadcast;
  source: string;
  average_episode_duration?: number;
  duration?: string;
  rating?: string;
  studios: Studio[];
  producers: Studio[];
  licensors: Studio[];
  pictures: Picture[];
  related_anime: RelatedAnime[];
  related_manga: RelatedManga[];
  relations: Relation[];
  external: ExternalLink[];
  streaming: StreamingPlatform[];
  statistics?: Statistics;
  theme?: Theme;
  trailer?: Trailer;
  images?: Images;
  url?: string;
  airing: boolean;
  approved: boolean;
}

export interface Picture {
  medium: string;
  large: string;
}

export interface AlternativeTitles {
  synonyms: string[];
  en?: string;
  ja?: string;
}

export interface Genre {
  id: number;
  name: string;
  type?: string;
  url?: string;
}

export interface Aired {
  from?: string;
  to?: string;
  prop?: AiredProp;
  string?: string;
}

export interface AiredProp {
  from?: DateProp;
  to?: DateProp;
}

export interface DateProp {
  day?: number;
  month?: number;
  year?: number;
}

export interface Season {
  year: number;
  season: string;
}

export interface Broadcast {
  day?: string;
  day_of_the_week?: string;
  time?: string;
  timezone?: string;
  start_time?: string;
  string?: string;
}

export interface Studio {
  id: number;
  name: string;
  type?: string;
  url?: string;
}

export interface RelatedAnime {
  node: AnimeNode;
  relation_type: string;
  relation_type_formatted: string;
}

export interface RelatedManga {
  node: MangaNode;
  relation_type: string;
  relation_type_formatted: string;
}

export interface AnimeNode {
  id: number;
  title: string;
  main_picture?: Picture;
}

export interface MangaNode {
  id: number;
  title: string;
  main_picture?: Picture;
}

export interface Relation {
  relation: string;
  entry: RelationEntry[];
}

export interface RelationEntry {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface ExternalLink {
  name: string;
  url: string;
}

export interface StreamingPlatform {
  name: string;
  url: string;
}

export interface Statistics {
  status: StatusStats;
  num_list_users: number;
}

export interface StatusStats {
  watching: string;
  completed: string;
  on_hold: string;
  dropped: string;
  plan_to_watch: string;
}

export interface Theme {
  openings: string[];
  endings: string[];
}

export interface Trailer {
  youtube_id?: string;
  url?: string;
  embed_url?: string;
  images?: TrailerImages;
}

export interface TrailerImages {
  image_url?: string;
  small_image_url?: string;
  medium_image_url?: string;
  large_image_url?: string;
  maximum_image_url?: string;
}

export interface Images {
  jpg?: ImageSet;
  webp?: ImageSet;
}

export interface ImageSet {
  image_url?: string;
  small_image_url?: string;
  large_image_url?: string;
}