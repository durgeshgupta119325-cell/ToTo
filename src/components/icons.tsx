import type { SVGProps } from 'react';

export const Icons = {
  TotoLogo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 107 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        fill="currentColor"
        xmlSpace="preserve"
        style={{ whiteSpace: 'pre' }}
        fontFamily="Inter, sans-serif"
        fontSize="32"
        fontWeight="bold"
        letterSpacing="0.04em"
      >
        <tspan x="0" y="29.184">
          TOTO
        </tspan>
      </text>
    </svg>
  ),
};
