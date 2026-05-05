export type Award = {
  icon?: string;
  label: string;
};

export type Comic = {
  id: string;
  image: any;
  title: string;
  publisher: string;
  genre: string;
  pitch: string;
  readerNote: string;
  awards?: Award[];
};

export const comics: Comic[] = [
  {
    id: "1",
    image: require("../assets/images/comics/spiderman.jpg"),
    title: "Amazing Fantasy",
    publisher: "Marvel",
    genre: "Superhero Origin",
    pitch: "The kind of Silver Age key that still feels electric when you crack it open.",
    readerNote: "A great centerpiece for readers who love first appearances and the roots of Marvel.",
    awards: [
      { icon: "star", label: "Top Comic" },
      { icon: "flash", label: "Essential Read" },
    ],
  },
  {
    id: "2",
    image: require("../assets/images/comics/bone.jpg"),
    title: "Bone",
    publisher: "Cartoon Books",
    genre: "Fantasy Adventure",
    pitch: "A funny, adventurous all-ages epic that keeps broadening the deeper you get into it.",
    readerNote: "An easy hand-sell for new readers, families, and anyone who wants a long bingeable run.",
    awards: [{ label: "Fan Favorite" }],
  },
  {
    id: "3",
    image: require("../assets/images/comics/dark-knight.jpg"),
    title: "The Dark Knight Returns",
    publisher: "DC",
    genre: "Dark Superhero",
    pitch: "A bruising, iconic Batman story that still feels big and sharp decades later.",
    readerNote: "Perfect for readers who want a heavyweight Batman story with real attitude.",
    awards: [{ label: "Classic" }],
  },
  {
    id: "4",
    image: require("../assets/images/comics/kingdom-come.jpg"),
    title: "Superman: Kingdom Come",
    publisher: "DC",
    genre: "Epic Elseworlds",
    pitch: "Painterly, grand-scale superhero storytelling with huge emotional stakes.",
    readerNote: "A strong pick for readers who want something mythic and visually unforgettable.",
  },
  {
    id: "5",
    image: require("../assets/images/comics/preacher.jpg"),
    title: "Preacher",
    publisher: "Vertigo",
    genre: "Mature Road Story",
    pitch: "Wild, sharp, irreverent comics with heart under all the chaos.",
    readerNote: "Best for readers who want something bold, funny, and absolutely not safe.",
    awards: [{ label: "Collector's Choice" }],
  },
  {
    id: "6",
    image: require("../assets/images/comics/superman.jpg"),
    title: "All Star Superman",
    publisher: "DC",
    genre: "Superhero Classic",
    pitch: "Bright, heartfelt Superman comics that understand why the character lasts.",
    readerNote: "An easy recommendation when someone wants a Superman story that feels timeless.",
  },
  {
    id: "7",
    image: require("../assets/images/comics/watchmen.jpg"),
    title: "Watchmen",
    publisher: "DC",
    genre: "Groundbreaking Classic",
    pitch: "A landmark book that still invites close reads and big conversations.",
    readerNote: "Great for readers who want a classic that changed how comics were discussed.",
    awards: [
      { icon: "ribbon", label: "Award Winner" },
    ],
  },
  {
    id: "8",
    image: require("../assets/images/comics/sandman.jpg"),
    title: "Sandman",
    publisher: "Vertigo",
    genre: "Mythic Fantasy",
    pitch: "Dreamy, literary, and weird in the best possible way.",
    readerNote: "A strong fit for readers who want something moodier and more imaginative than capes.",
  },
];
