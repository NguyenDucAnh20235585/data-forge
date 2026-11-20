import { generateEplTable } from './epl-generator';
import { EPL_CLUBS } from './epl-clubs';

jest.mock('./faker-locale', () => ({
  getFaker: () => {
    let index = 0;

    return {
      helpers: {
        shuffle: <T>(items: T[]) => [...items],

        arrayElement: <T>(items: readonly T[]) => items[index++ % items.length],
      },
    };
  },
}));

describe('EPL table preset', () => {
  it('generates one valid 20-club league table', () => {
    const table = generateEplTable();

    expect(table).toHaveLength(20);
    expect(new Set(table.map((row) => row.Club)).size).toBe(20);

    expect(
      table.every((row) =>
        EPL_CLUBS.includes(row.Club as (typeof EPL_CLUBS)[number]),
      ),
    ).toBe(true);

    for (const [index, row] of table.entries()) {
      expect(row.Pos).toBe(index + 1);
      expect(row.P).toBe(38);
      expect(row.W + row.D + row.L).toBe(38);
      expect(row.Pts).toBe(row.W * 3 + row.D);
      expect(row.GD).toBe(row.GF - row.GA);
    }

    expect(table.reduce((sum, row) => sum + row.GF, 0)).toBe(
      table.reduce((sum, row) => sum + row.GA, 0),
    );

    expect(table.reduce((sum, row) => sum + row.W, 0)).toBe(
      table.reduce((sum, row) => sum + row.L, 0),
    );

    expect(table.reduce((sum, row) => sum + row.P, 0) / 2).toBe(380);
  });

  it('sorts by points, goal difference, then goals scored', () => {
    const table = generateEplTable();

    for (let i = 1; i < table.length; i++) {
      const before = table[i - 1];
      const after = table[i];

      expect(
        before.Pts > after.Pts ||
          (before.Pts === after.Pts && before.GD > after.GD) ||
          (before.Pts === after.Pts &&
            before.GD === after.GD &&
            before.GF >= after.GF),
      ).toBe(true);
    }
  });
});
