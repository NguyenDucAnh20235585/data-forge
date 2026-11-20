import { getFaker, type DataLocale } from './faker-locale';
import { EPL_CLUBS } from './epl-clubs';

const TACTICAL_STYLES = [
  'attacking',
  'defensive',
  'gegenpressing',
  'counter',
  'possession',
  'adaptive',
] as const;

type TacticalStyle = (typeof TACTICAL_STYLES)[number];

type TacticalProfile = {
  style: TacticalStyle;
  attack: number;
  defense: number;
};

type TeamStats = {
  club: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  tactics: TacticalProfile;
};

function toRecapTeam(team: TeamStats) {
  return {
    club: team.club,
    style: team.tactics.style,
    points: team.points,
    goalsFor: team.goalsFor,
    goalsAgainst: team.goalsAgainst,
  };
}

function calculateChances(
  team: TeamStats,
  opponent: TeamStats,
  isHome: boolean,
): number {
  const { style, attack } = team.tactics;
  const rivalStyle = opponent.tactics.style;

  const qualityGap = (attack - opponent.tactics.defense) / 7;
  let modifier = isHome ? 1 : 0;

  // Tactical identity
  if (style === 'attacking') modifier += 2;
  if (style === 'defensive') modifier -= 2;
  if (style === 'gegenpressing') modifier += 1;
  if (style === 'counter') modifier -= 1;
  if (style === 'possession') modifier += 1;

  // Tactical matchup
  if (rivalStyle === 'defensive') modifier -= 2;
  if (rivalStyle === 'attacking') modifier += 1;

  if (
    style === 'counter' &&
    (rivalStyle === 'attacking' || rivalStyle === 'gegenpressing')
  ) {
    modifier += 3;
  }

  if (style === 'gegenpressing' && rivalStyle === 'possession') {
    modifier += 2;
  }

  if (style === 'adaptive' && rivalStyle === 'attacking') {
    modifier += 1;
  }

  return Math.max(2, Math.min(18, Math.round(9 + qualityGap + modifier)));
}

function convertChancesToGoals(
  chances: number,
  faker: ReturnType<typeof getFaker>,
): number {
  let goals = 0;

  for (let i = 0; i < chances; i++) {
    if (faker.number.float({ min: 0, max: 1 }) < 0.14) {
      goals++;
    }
  }

  return goals;
}

function playMatch(
  home: TeamStats,
  away: TeamStats,
  faker: ReturnType<typeof getFaker>,
) {
  const homeChances = calculateChances(home, away, true);
  const awayChances = calculateChances(away, home, false);

  const homeGoals = convertChancesToGoals(homeChances, faker);
  const awayGoals = convertChancesToGoals(awayChances, faker);

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

export function generateEplSeason(locale: DataLocale = 'en') {
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
    tactics: {
      style: faker.helpers.arrayElement(TACTICAL_STYLES),
      attack: faker.helpers.arrayElement([40, 45, 50, 55, 60, 65, 70, 75, 80]),
      defense: faker.helpers.arrayElement([40, 45, 50, 55, 60, 65, 70, 75, 80]),
    },
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

  const standings = table.map((team, index) => ({
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

  const recap = {
    champion: toRecapTeam(table[0]),
    championsLeague: table.slice(0, 4).map(toRecapTeam),
    relegated: table.slice(17).map(toRecapTeam),
    relegationBattle: {
      survivor: toRecapTeam(table[16]),
      firstRelegated: toRecapTeam(table[17]),
      pointsGap: table[16].points - table[17].points,
    },
  };

  return { standings, recap };
}

export function generateEplTable(locale: DataLocale = 'en') {
  return generateEplSeason(locale).standings;
}
