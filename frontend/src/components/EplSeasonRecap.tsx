import { useTranslation } from "react-i18next";
import type { EplSeasonResponse } from "../api/generatorApi";

type Props = {
  recap: EplSeasonResponse["recap"];
};

export default function EplSeasonRecap({ recap }: Props) {
  const { t } = useTranslation();

  const { champion, championsLeague, relegated, relegationBattle } = recap;

  const { survivor, firstRelegated } = relegationBattle;

  const survivorGD = survivor.goalsFor - survivor.goalsAgainst;
  const relegatedGD = firstRelegated.goalsFor - firstRelegated.goalsAgainst;

  const tieReason =
    survivorGD !== relegatedGD
      ? "eplRecap.tieGD"
      : survivor.goalsFor !== firstRelegated.goalsFor
        ? "eplRecap.tieGF"
        : "eplRecap.tieFurther";

  const styleName = (style: string) => t(`eplRecap.styles.${style}`);

  return (
    <section className="mt-6 rounded-xl border border-outline bg-surface p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-ink">{t("eplRecap.title")}</h2>

      <div className="mt-5 rounded-lg bg-surface-soft p-4">
        <p className="text-sm text-muted">{t("eplRecap.champion")}</p>

        <h3 className="mt-1 text-2xl font-semibold text-ink">
          {champion.club}
        </h3>

        <p className="mt-2 text-sm text-ink">
          {champion.points} Pts · {styleName(champion.style)}
        </p>

        <p className="mt-2 text-sm text-muted">
          {t("eplRecap.championDescription", {
            gf: champion.goalsFor,
            ga: champion.goalsAgainst,
          })}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-ink">
          {t("eplRecap.championsLeague")}
        </h3>

        <ul className="mt-2 divide-y divide-outline">
          {championsLeague.map((team, index) => (
            <li key={team.club} className="py-3">
              <div className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-sm text-muted">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{team.club}</p>
                  <p className="mt-1 text-xs text-muted">
                    {styleName(team.style)} · GF {team.goalsFor}
                    {" · "}GA {team.goalsAgainst}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                  {team.points} pts
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-ink">{t("eplRecap.relegated")}</h3>

        <ul className="mt-2 divide-y divide-outline">
          {relegated.map((team, index) => (
            <li key={team.club} className="py-3">
              <div className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-sm tabular-nums text-muted">
                  {index + 18}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{team.club}</p>

                  <p className="mt-1 text-xs text-muted">
                    {styleName(team.style)} · GF {team.goalsFor}
                    {" · "}GA {team.goalsAgainst}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                  {team.points} pts
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-outline pt-4">
        <h3 className="font-semibold text-ink">
          {t("eplRecap.relegationBattle")}
        </h3>

        <p className="mt-2 text-sm text-muted">
          {t(
            relegationBattle.pointsGap === 0
              ? tieReason
              : "eplRecap.relegationGap",
            {
              survivor: relegationBattle.survivor.club,
              relegated: relegationBattle.firstRelegated.club,
              gap: relegationBattle.pointsGap,
              points: relegationBattle.survivor.points,
            },
          )}
        </p>
      </div>
    </section>
  );
}
