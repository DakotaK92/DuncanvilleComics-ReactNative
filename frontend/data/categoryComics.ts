export type ComicBook = {
  id: string;
  title: string;
  issue: number;
  publisher: "Marvel" | "DC" | "Image" | "Other";
  coverImage: any;
  price: number;

  // Optional fields (used by certain categories)
  releaseDate?: string;
  dealPrice?: number;
  preorderRelease?: string;
  grade?: "9.8" | "9.6" | "9.4" | "9.2";
};
