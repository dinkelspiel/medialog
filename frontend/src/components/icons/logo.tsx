import React, { type SVGProps } from "react";

const Logo = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="24"
      height="14"
      viewBox="0 0 24 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.3913 13.1739H0L3.13043 0H7.43478L10.1739 8.73913L12.913 0H17.8696V10.3043H24V13.1739H14.6087V3.65217L11.6087 13.1739H8.21739L5.73913 3.65217L3.3913 13.1739Z" />
    </svg>
  );
};

export default Logo;
