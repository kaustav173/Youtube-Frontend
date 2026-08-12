export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailKey: string;
  videoKey?: string;
  category?: string;
  owner?: {
    name: string;
  };
}

export interface GetVideoResponse {
  _id: string;
  title: string;
  description: string;
  videoKey: string;
  thumbnailKey: string;
  category?: string;
  owner?: {
    name: string;
  };
}
