import type { SVGProps } from 'react';

export const Icons = {
  TotoLogo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 10 L50 2 L90 10 L90 60 C 90 80, 50 98, 50 98 C 50 98, 10 80, 10 60 Z"
        fill="currentColor"
      />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        fill="white"
        fontSize="24"
        fontFamily="Inter, sans-serif"
        fontWeight="bold"
      >
        TOTO
      </text>
    </svg>
  ),
};
