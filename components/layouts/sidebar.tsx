import React, { ReactNode } from 'react';

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`font-geist grid min-h-[100dvh] grid-cols-1 bg-neutral-100 lg:grid-cols-[max-content,1fr] lg:grid-rows-1 lg:grid-rows-[70px,1fr]`}
    >
      {children}
    </div>
  );
};

export default SidebarLayout;
