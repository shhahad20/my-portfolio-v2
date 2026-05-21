import "./gooText.css";

const letters = "ShahadAltharwa".split("");

export default function GooText() {
  return (
    <svg
      viewBox="-500 -500 1000 1000"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMin slice"
      className="goo-svg"
    >
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -5"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>

      {/* <circle fill="hsla(0, 100%, 50%, 0.15)" cx={0} cy={0} r={300} /> */}

      <g filter="url(#goo)">
        {letters.map((char, i) => (
          <text
            key={i}
            x={i * 60 - (letters.length * 30)} // 👈 spread letters horizontally
            y={100}
            className="goo-letter"
          >
            {char}
          </text>
        ))}
      </g>
    </svg>
  );
}