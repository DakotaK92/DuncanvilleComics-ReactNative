export type Comic = {
  id: string;
  image: any;
  title: string;
};

export const comics: Comic[] = [
  {
    id: "1",
    image: require("../assets/images/comics/amazing-fantasy-15.jpg"),
    title: "Amazing Fantasy #15",
  },
  {
    id: "2",
    image: require("../assets/images/comics/amazing-fantasy-15.jpg"),
    title: "Avengers #1",
  },
  // etc...
];
