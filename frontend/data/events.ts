export type EventTypes = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  time: string;
};

/**
 * Helper to create ISO dates X days from now
 */
function daysFromNowISO(days: number, hour = 18, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const events: EventTypes[] = [
  {
    id: "mon-1",
    title: "Magic: The Gathering – Commander Night",
    description: "Casual Commander games. New players welcome.",
    date: daysFromNowISO(0, 18),
    time: "6:00 PM",
  },
  {
    id: "mon-2",
    title: "Pokémon League",
    description: "League play with prizes.",
    date: daysFromNowISO(0, 18),
    time: "6:00 PM",
  },
  {
    id: "mon-3",
    title: "Board Game Free Play",
    description: "Open play for all board games.",
    date: daysFromNowISO(0, 20),
    time: "8:00 PM",
  },
  {
    id: "tue-1",
    title: "Open Tables",
    description: "Open gaming tables for various card games.",
    date: daysFromNowISO(1, 17),
    time: "5:00 PM",
  },
      {
    id: "tue-2",
    title: "Pokémon League",
    description: "League play with prizes.",
    date: daysFromNowISO(1, 18),
    time: "6:00 PM",
  },
  {
    id: "tue-3",
    title: "Magic: The Gathering – Standard Showdown",
    description: "Open play for all board games.",
    date: daysFromNowISO(1, 20),
    time: "8:00 PM",
  },
  {
    id: "wed-1",
    title: "Yu-Gi-Oh! Advanced Format",
    description: "Competitive play using the latest ban list.",
    date: daysFromNowISO(2, 18),
    time: "6:00 PM",
  },
      {
    id: "wed-2",
    title: "Pokémon League",
    description: "League play with prizes.",
    date: daysFromNowISO(2, 18),
    time: "6:00 PM",
  },
  {
    id: "wed-3",
    title: "Board Game Free Play",
    description: "Open play for all board games.",
    date: daysFromNowISO(2, 20),
    time: "8:00 PM",
  },
  {
    id: "thu-1",
    title: "Funko Pop! Trading Night",
    description: "Trade and collect Funko Pop! figures.",
    date: daysFromNowISO(3, 18),
    time: "6:00 PM",
  },
      {
    id: "thu-2",
    title: "Lorcana Disney Card Game League",
    description: "League play with prizes.",
    date: daysFromNowISO(3, 18),
    time: "6:00 PM",
  },
  {
    id: "fri-1",
    title: "Warhammer 40K Night",
    description: "Open play for all board games.",
    date: daysFromNowISO(3, 20),
    time: "8:00 PM",
  },
  {
    id: "fri-2",
    title: "Magic: The Gathering – Standard Showdown",
    description: "Open play for all board games.",
    date: daysFromNowISO(4, 18),
    time: "8:00 PM",
  },
  {
    id: "fri-3",
    title: "Warhammer 40K Night",
    description: "Open play for all board games.",
    date: daysFromNowISO(4, 20),
    time: "8:00 PM",
  },
  {
    id: "sat-1",
    title: "Dungeons & Dragons Campaign Session",
    description: "Ongoing campaign session. Limited seats available.",
    date: daysFromNowISO(5, 16),
    time: "4:00 PM",
  },
  {
    id: "sat-2",
    title: "Pokémon League",
    description: "League play with prizes.",
    date: daysFromNowISO(5, 18),
    time: "6:00 PM",
  },
  {
    id: "sun-1",
    title: "Board Game Sunday",
    description: "Open board game play for all ages.",
    date: daysFromNowISO(6, 14),
    time: "2:00 PM",
  },
  {
    id: "sun-3",
    title: "Board Game Free Play",
    description: "Open play for all board games.",
    date: daysFromNowISO(6, 20),
    time: "8:00 PM",
  },
];
