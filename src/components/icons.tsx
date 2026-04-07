import type { SVGProps } from 'react';

export const Icons = {
  TotoLogo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Shield */}
      <path
        d="M10 10 L50 2 L90 10 L90 60 C 90 80, 50 98, 50 98 C 50 98, 10 80, 10 60 Z"
        fill="currentColor"
      />
      
      {/* Car icon inside shield */}
      <g transform="translate(26, 18) scale(1.8)">
        {/* Car body */}
        <path
          d="M3.88 14.12l-1.39-4.15A2.04 2.04 0 014.56 7h14.88a2.04 2.04 0 012.07 2.97l-1.39 4.15"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Roof */}
        <path
          d="M4 7V6a2 2 0 012-2h12a2 2 0 012 2v1"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Taxi sign */}
        <path d="M9 5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      {/* Text "TOTO" */}
      <text
        fill="white"
        xmlSpace="preserve"
        style={{ whiteSpace: 'pre' }}
        fontFamily="Inter, sans-serif"
        fontSize="18"
        fontWeight="bold"
        letterSpacing="0.04em"
        x="50"
        y="75"
        textAnchor="middle"
      >
        TOTO
      </text>
    </svg>
  ),
};
