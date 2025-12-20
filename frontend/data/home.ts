export type HomeTypes = {
    id: number;
    title: string;
    type: CategoryType;
    backgroundImage: any;
    logo: any;
};

export type CategoryType =
  | "new-releases"
  | "weekly-releases"
  | "pull-list"
  | "pre-order"
  | "wishlist"
  | "deals"
  | "graded"
  | "back-issues";


export const messages: HomeTypes[] = [
  {
    id: 1,
    title: "New to Duncanville Comics",
    type: "new-releases",
    backgroundImage: require("../assets/images/background-images/batman-background.png"),
    logo: require("../assets/images/logos/batman-logo.png"),
  },
  {
    id: 2,
    title: "Weekly Releases",
    type: "weekly-releases",
    backgroundImage: require("../assets/images/background-images/wolverine-background-v2.png"),
    logo: require("../assets/images/logos/wolverine-black-logo.png"),
  },
  {
    id: 3,
    title: "My Pull List",
    type: "pull-list",
    backgroundImage: require("../assets/images/background-images/spiderman-background.png"),
    logo: require("../assets/images/logos/spiderman-logo.png"),
  },
  {
    id: 4,
    title: "Pre-Order",
    type: "pre-order",
    backgroundImage: require("../assets/images/background-images/superman-background.png"),
    logo: require("../assets/images/logos/superman-logo.png"),
  },
  {
    id: 5,
    title: "My Wish List",
    type: "wishlist",
    backgroundImage: require("../assets/images/background-images/green-lantern-background.png"),
    logo: require("../assets/images/logos/green-lantern-logo.png"),
  },
  {
    id: 6,
    title: "Deal of the Week",
    type: "deals",
    backgroundImage: require("../assets/images/background-images/captain-america-background.png"),
    logo: require("../assets/images/logos/captain-america-logo.png"),
  },
  {
    id: 7,
    title: "CGC Graded Comics",
    type: "graded",
    backgroundImage: require("../assets/images/background-images/wonderwoman-background-v2.png"),
    logo: require("../assets/images/logos/wonder-woman-logo.png"),
  },
  {
    id: 8,
    title: "Newly Added Back Issues",
    type: "back-issues",
    backgroundImage: require("../assets/images/background-images/ironman-background.png"),
    logo: require("../assets/images/logos/iron-man-logo.png"),
  },
];
