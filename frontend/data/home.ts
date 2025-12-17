export type HomeTypes = {
    id: number;
    date: string;
    title: string;
    event: string;
    backgroundImage: any;
    logo: any;
};

function daysFromNowISO(days: number, hour = 17) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export const messages: HomeTypes[] = [
   {
        id: 1,
        date: daysFromNowISO(2),
        title: "New to Duncanville Comics",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/batman-background.png"),
        logo: require("../assets/images/logos/batman-logo.png"),
    },
    {
        id: 2,
        date: daysFromNowISO(3),
        title: "Weekly Releases",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/wolverine-background.png"),
        logo: require("../assets/images/logos/wolverine-black-logo.png"),
    },
    {
        id: 3,
        date: daysFromNowISO(1),
        title: "My Pull List",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/spiderman-background.png"),
        logo: require("../assets/images/logos/spiderman-logo.png"),
    },
    {
        id: 4,
        date: daysFromNowISO(0),
        title: "Pre-Order",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/superman-background.png"),
        logo: require("../assets/images/logos/superman-logo.png"),
    },
    {
        id: 5,
        date: daysFromNowISO(3),
        title: "My Pull List",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/green-lantern-background.png"),
        logo: require("../assets/images/logos/green-lantern-logo.png"),
    },
    {
        id: 6,
        date: daysFromNowISO(2),
        title: "Deal of the Week",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/captain-america-background.png"),
        logo: require("../assets/images/logos/captain-america-logo.png"),
    },
    {
        id: 7,
        date: daysFromNowISO(4),
        title: "CGC Graded Comics",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/wonderwoman-background.png"),
        logo: require("../assets/images/logos/wonder-woman-logo.png"),
    },
    {
        id: 8,
        date: daysFromNowISO(8),
        title: "Newly Added Back Issues",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/ironman-background.png"),
        logo: require("../assets/images/logos/iron-man-logo.png"),
    },
];