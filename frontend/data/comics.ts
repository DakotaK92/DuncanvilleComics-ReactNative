export type Award = {
  icon?: string;
  label: string;
  color?: string;
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
      { icon: "star", label: "Top Comic", color: "yellow-400" },
    ],
  },
  {
    id: "2",
    image: require("../assets/images/comics/bone.jpg"),
    title: "Bone",
    awards: [{ label: "Fan Favorite", color: "pink-400" }],
  },
  {
    id: "3",
    image: require("../assets/images/comics/dark-knight.jpg"),
    title: "The Dark Knight Returns",
    awards: [{ label: "Classic", color: "gray-400" }],
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
    awards: [{ label: "Collector's Choice", color: "orange-400" }],
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
      { icon: "ribbon", label: "Award Winner", color: "purple-400" },
    ],
  },
  {
    id: "8",
    image: require("../assets/images/comics/sandman.jpg"),
    title: "Sandman",
  },
];
