export type MessageType = {
    id: number;
    date: string;
    title: string;
    shipping: string;
    backgroundImage: any;
    logo: any;
};

function daysFromNowISO(days: number, hour = 17) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export const messages: MessageType[] = [
    {
        id: 1,
        date: daysFromNowISO(2),
        title: "CAPE & COWL: LOW GRADE GOLDEN AGE GOLD",
        shipping: "SHIPS DIRECT FROM STORE",
        backgroundImage: require("../assets/images/background-images/batman-background.png"),
        logo: require("../assets/images/logos/cap-&-cowl.png"),
    },
    {
        id: 2,
        date: daysFromNowISO(3),
        title: "CLAWS ARE OUT: WOLVERINE RETURNS",
        shipping: "SHIPS DIRECT FROM STORE",
        backgroundImage: require("../assets/images/background-images/wolverine-background.png"),
        logo: require("../assets/images/logos/wolverinelogo.png"),
    },
    {
        id: 3,
        date: daysFromNowISO(1),
        title: "SPIDER-MAN: WEB OF SHADOWS",
        shipping: "SHIPS DIRECT FROM STORE",
        backgroundImage: require("../assets/images/background-images/spidermanbackground.png"),
        logo: require("../assets/images/logos/spiderman-logo.png"),
    },
    {
        id: 4,
        date: daysFromNowISO(0),
        title: "GODS AMOUNG US: SUPERMAN RISES",
        shipping: "SHIPS DIRECT FROM STORE",
        backgroundImage: require("../assets/images/background-images/superman-background.png"),
        logo: require("../assets/images/logos/superman-logo.png"),
    },
];