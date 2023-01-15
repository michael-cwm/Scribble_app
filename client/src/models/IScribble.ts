export interface IScribble {
  _id?: string;
  content: string;
  time: string;
  author: string;
  votes?: number;
  comments?: object;
}
