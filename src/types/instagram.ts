export type InstagramContent = {
  id: string;
  thumbnail: string;
  views: number;
  caption: string;
  publishedAt: string;
};

export type InstagramProfile = {
  username: string;
  fullName: string;
  profilePic: string;
  totalViews: number;
  contents: InstagramContent[];
};
