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
        title: "GOTHAM'S FINEST: THE CAPE & COWL COLLECTION",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/batman-background.png"),
        logo: require("../assets/images/logos/batman-logo.png"),
    },
    {
        id: 2,
        date: daysFromNowISO(3),
        title: "CLAWS ARE OUT: WOLVERINE RETURNS",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/wolverine-background.png"),
        logo: require("../assets/images/logos/wolverine-black-logo.png"),
    },
    {
        id: 3,
        date: daysFromNowISO(1),
        title: "SPIDER-MAN: WEB OF SHADOWS",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/spiderman-background.png"),
        logo: require("../assets/images/logos/spiderman-logo.png"),
    },
    {
        id: 4,
        date: daysFromNowISO(0),
        title: "GODS AMOUNG US: SUPERMAN RISES",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/superman-background.png"),
        logo: require("../assets/images/logos/superman-logo.png"),
    },
    {
        id: 5,
        date: daysFromNowISO(3),
        title: "BRIGHTEST DAY: GREEN LANTERN LEGACY",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/green-lantern-background.png"),
        logo: require("../assets/images/logos/green-lantern-logo.png"),
    },
    {
        id: 6,
        date: daysFromNowISO(2),
        title: "LEGACY OF A HERO: CAPTAIN AMERICA",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/captain-america-background.png"),
        logo: require("../assets/images/logos/captain-america-logo.png"),
    },
    {
        id: 7,
        date: daysFromNowISO(4),
        title: "QUEEN OF THE AMAZONS: WONDER WOMAN",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/wonderwoman-background.png"),
        logo: require("../assets/images/logos/wonder-woman-logo.png"),
    },
    {
        id: 8,
        date: daysFromNowISO(8),
        title: "SUIT OF ARMOR: IRONMAN INVINCIBLE",
        event: "STORE EVENT",
        backgroundImage: require("../assets/images/background-images/ironman-background.png"),
        logo: require("../assets/images/logos/iron-man-logo.png"),
    },
];