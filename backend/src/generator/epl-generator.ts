import { getFaker, type DataLocale } from './faker-locale';
import { EPL_CLUBS } from './epl-clubs';

type TeamStats = {
  club: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

function playMatch(
  home: TeamStats,
  away: TeamStats,
  faker: ReturnType<typeof getFaker>,
) {
  const possibleGoals = [0, 0, 0, 1, 1, 1, 2, 2, 3, 4];

  const homeGoals = faker.helpers.arrayElement(possibleGoals);
  const awayGoals = faker.helpers.arrayElement(possibleGoals);

  home.played++;
  away.played++;

  home.goalsFor += homeGoals;
  home.goalsAgainst += awayGoals;

  away.goalsFor += awayGoals;
  away.goalsAgainst += homeGoals;

  if (homeGoals > awayGoals) {
    home.won++;
    home.points += 3;
    away.lost++;
  } else if (homeGoals < awayGoals) {
    away.won++;
    away.points += 3;
    home.lost++;
  } else {
    home.drawn++;
    away.drawn++;
    home.points++;
    away.points++;
  }
}

export function generateEplTable(locale: DataLocale = 'en') {
  const faker = getFaker(locale);

  const clubs = faker.helpers.shuffle([...EPL_CLUBS]).slice(0, 20);

  const table: TeamStats[] = clubs.map((club) => ({
    club,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  }));

  // Each pair plays twice: home and away.
  for (let i = 0; i < table.length; i++) {
    for (let j = i + 1; j < table.length; j++) {
      playMatch(table[i], table[j], faker);
      playMatch(table[j], table[i], faker);
    }
  }

  table.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
      b.goalsFor - a.goalsFor ||
      a.club.localeCompare(b.club),
  );

  return table.map((team, index) => ({
    Pos: index + 1,
    Club: team.club,
    P: team.played,
    W: team.won,
    D: team.drawn,
    L: team.lost,
    GF: team.goalsFor,
    GA: team.goalsAgainst,
    GD: team.goalsFor - team.goalsAgainst,
    Pts: team.points,
  }));
}
