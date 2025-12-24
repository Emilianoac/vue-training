export interface Challenge {
  title: string;
  slug: string
  cover: {
    url: string
  };
  category: {
    id: string;
    name: string;
    image: {
      url: string
    }
  };
  images: {url: string}[];
  level: "basic" | "intermediate" | "advanced";
  description: string;
  short_description: string;
  objectives: { data: string }[];  
  stackblitz: {
    challenge: string;
    solution: string;
  }
}
