import { useTranslation } from "react-i18next";
import type { EplSeasonResponse } from "../api/generatorApi";

type Props = {
  recap: EplSeasonResponse["recap"];
};

export default function EplSeasonRecap({ recap }: Props) {
  const { t } = useTranslation();

  const { champion, championsLeague, relegated, relegationBattle } = recap;

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

        <ul className="mt-3 space-y-2">
          {championsLeague.map((team, index) => (
            <li key={team.club} className="text-sm text-ink">
              {index + 1}. {team.club} — {team.points} Pts
              <span className="block text-muted">
                {styleName(team.style)} · GF {team.goalsFor}
                {" · "}GA {team.goalsAgainst}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-ink">{t("eplRecap.relegated")}</h3>

        <ul className="mt-3 space-y-2">
          {relegated.map((team, index) => (
            <li key={team.club} className="text-sm text-ink">
              {index + 18}. {team.club} — {team.points} Pts
              <span className="block text-muted">
                {styleName(team.style)} · GF {team.goalsFor}
                {" · "}GA {team.goalsAgainst}
              </span>
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
              ? "eplRecap.relegationTie"
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
