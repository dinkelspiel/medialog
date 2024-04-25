export type RatingStyle = 'range' | 'stars';

export interface User {
  id: number;
  username: string;
  email: string;
  ratingStyle: RatingStyle;
}
