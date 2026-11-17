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
      ? "Preparing data..."
      : confirmedComplete
        ? "Generation Complete!"
        : completed === total
          ? "Finalizing..."
          : "Generating...";

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
        aria-label="Generation progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage ?? undefined}
        aria-valuetext={
          percentage === null
            ? "Preparing data"
            : confirmedComplete
              ? `${completed} of ${total} records received. Generation complete`
              : `${completed} of ${total} records received`
        }
        className="relative h-8 w-full overflow-hidden rounded-full border border-fuchsia-400/20 bg-[#251B32] shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)] sm:h-10"
      >
        {percentage === null ? (
          <div className="relative h-full w-full overflow-hidden">
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
        ) : (
          <div
            className="forge-energy-fill h-full overflow-hidden rounded-full transition-[width] duration-300 ease-out"
            data-complete={confirmedComplete}
            style={{ width: `${percentage}%` }}
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
        )}
      </div>

      {percentage !== null && (
        <p className="text-xs tabular-nums text-muted">
          {completed} / {total} records
        </p>
      )}
    </div>
  );
}
