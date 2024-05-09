import React, { ReactNode } from 'react';
import BaseLayout from './base';

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`grid grid-cols-1 grid-rows-[70px,1fr] lg:grid-cols-[256px,1fr] lg:grid-rows-1`}
    >
      {children}
    </div>
  );
};

export default SidebarLayout;
