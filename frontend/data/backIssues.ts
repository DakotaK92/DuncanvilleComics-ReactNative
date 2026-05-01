import { ComicBook } from "./categoryComics";

export const backIssues: ComicBook[] = [
  {
    id: "uncanny-xmen-266",
    title: "Uncanny X-Men",
    issue: 266,
    publisher: "Marvel",
    price: 24.99,
    coverImage: require("../assets/images/comics/dark-knight.jpg"),
  },
  {
    id: "batman-404",
    title: "Batman",
    issue: 404,
    publisher: "DC",
    price: 12.99,
    coverImage: require("../assets/images/comics/superman.jpg"),
  },
  {
    id: "sandman-8",
    title: "The Sandman",
    issue: 8,
    publisher: "DC",
    price: 7.99,
    coverImage: require("../assets/images/comics/preacher.jpg"),
  },
];
