import React, { SVGProps } from "react";

const Calendar = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width="36"
      height="42"
      viewBox="0 0 36 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.71429 2.57143V5.14286H3.85714C1.72768 5.14286 0 6.87054 0 9V12.8571H36V9C36 6.87054 34.2723 5.14286 32.1429 5.14286H28.2857V2.57143C28.2857 1.14911 27.1366 0 25.7143 0C24.292 0 23.1429 1.14911 23.1429 2.57143V5.14286H12.8571V2.57143C12.8571 1.14911 11.708 0 10.2857 0C8.86339 0 7.71429 1.14911 7.71429 2.57143ZM36 15.4286H0V37.2857C0 39.4152 1.72768 41.1429 3.85714 41.1429H32.1429C34.2723 41.1429 36 39.4152 36 37.2857V15.4286Z"
        fill="black"
      />
    </svg>
  );
};

export default Calendar;
