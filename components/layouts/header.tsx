import React, { ReactNode } from 'react';

const HeaderLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid h-screen grid-rows-[max-content,1fr] gap-4 overflow-y-scroll 2xl:grid-rows-[73px,1fr]">
      {children}
    </div>
  );
};

export default HeaderLayout;
