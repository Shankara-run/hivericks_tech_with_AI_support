type Props = {
  size?: number;
  showWordmark?: boolean;
  wordmarkColor?: string;
  className?: string;
};

export function HivericksLogo({
  size = 32,
  showWordmark = true,
  wordmarkColor = "#ffffff",
  className,
}: Props) {
  return (
    <div className={"inline-flex items-center gap-2 " + (className ?? "")}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Hivericks"
      >
        <rect width="64" height="64" rx="12" fill="#0a0a0a" />
        {/* Left half of H — dark gray */}
        <path
          d="M14 12 L26 12 L26 28 L32 32 L26 36 L26 52 L14 52 Z"
          fill="#2a2a2a"
        />
        {/* Right half of H — brand blue */}
        <path
          d="M50 12 L38 12 L38 28 L32 32 L38 36 L38 52 L50 52 Z"
          fill="#48a0f8"
        />
        {/* Crossbar */}
        <rect x="22" y="29" width="20" height="6" fill="#48a0f8" />
      </svg>

      {showWordmark && (
        <span
          className="font-display font-extrabold tracking-tight"
          style={{
            color: wordmarkColor,
            fontSize: size * 0.62,
            letterSpacing: "-0.01em",
          }}
        >
          HIVERICKS
        </span>
      )}
    </div>
  );
}
