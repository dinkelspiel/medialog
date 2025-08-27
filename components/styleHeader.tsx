import React, { ReactNode } from 'react';

const StyleHeader = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="flex w-full justify-between border-b border-b-base-200 pb-2 font-dm-serif text-3xl font-semibold">
      {children}
    </div>
  );
};

export default StyleHeader;
