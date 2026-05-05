type Props = { className?: string };

export function Waveform({ className }: Props) {
  const bars = [0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.3];
  return (
    <svg
      className={className}
      viewBox="0 0 28 16"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 4}
          y={8 - h * 7}
          width={2}
          height={h * 14}
          rx={1}
          className="wave-bar fill-current"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </svg>
  );
}
