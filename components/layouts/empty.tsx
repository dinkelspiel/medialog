import React, { ReactNode } from 'react';
import BaseLayout from './base';

const EmptyLayout = ({ children }: { children: ReactNode }) => {
  return <BaseLayout>{children}</BaseLayout>;
};

export default EmptyLayout;
