export interface Franchise {
    id: number;
    name: string;
    category: string;
    creators: string[];
    entries: {
      name: string;
      coverUrl: string;
      length: number;
      creators: { name: string }[];
    }
};