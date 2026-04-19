import type { SVGProps } from 'react';

export const Icons = {
  TotoLogo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="50" cy="50" r="45" fill="currentColor" />
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fill="white"
        fontSize="30"
        fontFamily="Inter, sans-serif"
        fontWeight="bold"
      >
        TOTO
      </text>
    </svg>
  ),
};
