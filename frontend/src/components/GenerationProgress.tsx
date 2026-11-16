type GenerationProgressProps = {
  completed: number;
  total: number;
};

export function GenerationProgress({
  completed,
  total,
}: GenerationProgressProps) {
  const percentage =
    total > 0
      ? Math.min(100, Math.max(0, Math.round((completed / total) * 100)))
      : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-ink">
          {percentage === 100 ? "Generation Complete!" : "Generating..."}
        </span>
        <span className="font-semibold text-ink">{percentage}%</span>
      </div>

      <div
        role="progressbar"
        aria-label="Generation progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        className="h-10 overflow-hidden rounded-lg bg-[#251B32]"
      >
        <div
          className="relative h-full overflow-hidden rounded-lg transition-[width] duration-300"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, #6F3CFF, #A04DF5, #FF5FB2)",
          }}
        >
          {[15, 35, 55, 75, 90].map((left, index) => (
            <span
              key={left}
              aria-hidden="true"
              className="absolute h-2 w-2 rounded-full border border-white/70 animate-bounce motion-reduce:animate-none"
              style={{
                left: `${left}%`,
                top: index % 2 === 0 ? "55%" : "20%",
                animationDelay: `${index * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-muted">
        {completed} / {total} records
      </p>
    </div>
  );
}
