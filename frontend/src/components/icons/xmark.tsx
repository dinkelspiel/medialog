import React, { SVGProps } from "react";

const Xmark = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.70405 1.70779C10.0945 1.31735 10.0945 0.683273 9.70405 0.292831C9.3136 -0.0976105 8.67952 -0.0976105 8.28908 0.292831L5 3.58504L1.70779 0.295955C1.31735 -0.094487 0.683273 -0.094487 0.292831 0.295955C-0.0976105 0.686397 -0.0976105 1.32047 0.292831 1.71092L3.58504 5L0.295955 8.29221C-0.0944869 8.68265 -0.0944869 9.31673 0.295955 9.70717C0.686397 10.0976 1.32047 10.0976 1.71092 9.70717L5 6.41496L8.29221 9.70404C8.68265 10.0945 9.31673 10.0945 9.70717 9.70404C10.0976 9.3136 10.0976 8.67952 9.70717 8.28908L6.41496 5L9.70405 1.70779Z" />
    </svg>
  );
};

export default Xmark;
