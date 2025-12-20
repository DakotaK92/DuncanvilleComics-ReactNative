export type Award = {
  icon?: string;
  label: string;
};

export type Comic = {
  id: string;
  image: any;
  title: string;
  awards?: Award[];
};

export const comics: Comic[] = [
  {
    id: "1",
    image: require("../assets/images/comics/spiderman.jpg"),
    title: "Amazing Fantasy",
    awards: [
      { icon: "star", label: "Top Comic" },
    ],
  },
  {
    id: "2",
    image: require("../assets/images/comics/bone.jpg"),
    title: "Bone",
    awards: [{ label: "Fan Favorite" }],
  },
  {
    id: "3",
    image: require("../assets/images/comics/dark-knight.jpg"),
    title: "The Dark Knight Returns",
    awards: [{ label: "Classic" }],
  },
  {
    id: "4",
    image: require("../assets/images/comics/kingdom-come.jpg"),
    title: "Superman: Kingdom Come",
  },
  {
    id: "5",
    image: require("../assets/images/comics/preacher.jpg"),
    title: "Preacher",
    awards: [{ label: "Collector's Choice" }],
  },
  {
    id: "6",
    image: require("../assets/images/comics/superman.jpg"),
    title: "All Star Superman",
  },
  {
    id: "7",
    image: require("../assets/images/comics/watchmen.jpg"),
    title: "Watchmen",
    awards: [
      { icon: "ribbon", label: "Award Winner" },
    ],
  },
  {
    id: "8",
    image: require("../assets/images/comics/sandman.jpg"),
    title: "Sandman",
  },
];
