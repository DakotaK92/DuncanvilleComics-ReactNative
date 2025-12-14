export type Comic = {
  id: string;
  image: any;
  title: string;
};

export const comics: Comic[] = [
  {
    id: "1",
    image: require("../assets/images/comics/spiderman.jpg"),
    title: "Amazing Fantasy",
  },
  {
    id: "2",
    image: require("../assets/images/comics/bone.jpg"),
    title: "Bone",
  },
  {
    id: "3",
    image: require("../assets/images/comics/dark-knight.jpg"),
    title: "The Dark Knight Returns",
  },
  {
    id: "4",
    image: require("../assets/images/comics/kingdom-come.jpg"),
    title: "Kingdom Come",
  },
  {
    id: "5",
    image: require("../assets/images/comics/preacher.jpg"),
    title: "Preacher",
  },
  {
    id: "6",
    image: require("../assets/images/comics/superman.jpg"),
    title: "Superman",
  },
  {
    id: "7",
    image: require("../assets/images/comics/watchmen.jpg"),
    title: "Watchmen",
  },
  {
    id: "8",
    image: require("../assets/images/comics/sandman.jpg"),
    title: "Sandman",
  },
];
