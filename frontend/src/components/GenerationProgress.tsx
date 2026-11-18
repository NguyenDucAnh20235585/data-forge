import { useTranslation } from "react-i18next";

type GenerationProgressProps = {
  completed?: number;
  total?: number;
  isComplete?: boolean;
};

export function GenerationProgress({
  completed,
  total,
  isComplete = false,
}: GenerationProgressProps) {
  const { t } = useTranslation();
  const hasProgress =
    completed !== undefined &&
    total !== undefined &&
    Number.isFinite(completed) &&
    Number.isFinite(total) &&
    total > 0;

  const percentage = hasProgress
    ? completed >= total
      ? 100
      : Math.min(99, Math.max(0, Math.round((completed / total) * 100)))
    : null;

  const confirmedComplete = isComplete && hasProgress && completed === total;

  const statusText =
    percentage === null
      ? t("generation.preparing")
      : confirmedComplete
        ? t("generation.complete")
        : completed === total
          ? t("generation.finishing")
          : t("generation.generating");

  return (
    <div className="w-full min-w-0 space-y-2">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="min-w-0 font-medium text-ink">{statusText}</span>

        {percentage !== null && (
          <span className="shrink-0 font-semibold tabular-nums text-ink">
            {percentage}%
          </span>
        )}
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage ?? undefined}
        aria-label={t("generation.progressLabel")}
        aria-valuetext={
          percentage === null
            ? t("generation.preparing")
            : confirmedComplete
              ? t("generation.complete")
              : t("generation.received", { completed, total })
        }
        className="relative h-8 w-full overflow-hidden rounded-full border border-fuchsia-400/20 bg-[#251B32] shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)] sm:h-10"
      >
        <div
          className="forge-energy-fill relative h-full overflow-hidden rounded-full transition-[width] duration-[1800ms] ease-out motion-reduce:transition-none"
          data-complete={confirmedComplete}
          style={{ width: `${percentage ?? 0}%` }}
        >
          {[15, 35, 55, 75, 90].map((left, index) => (
            <span
              key={left}
              aria-hidden="true"
              className="forge-energy-bubble absolute h-2 w-2 rounded-full border border-white/70"
              style={{
                left: `${left}%`,
                top: index % 2 === 0 ? "55%" : "20%",
                animationDelay: `${index * -0.25}s`,
              }}
            />
          ))}
        </div>

        {percentage === null && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="forge-energy-band">
              {[20, 45, 70, 85].map((left, index) => (
                <span
                  key={left}
                  aria-hidden="true"
                  className="forge-energy-bubble absolute h-2 w-2 rounded-full border border-white/70"
                  style={{
                    left: `${left}%`,
                    top: index % 2 === 0 ? "50%" : "20%",
                    animationDelay: `${index * -0.3}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {percentage !== null && (
        <p className="text-xs tabular-nums text-muted">
          {t("generation.records", { completed, total })}
        </p>
      )}
    </div>
  );
}
