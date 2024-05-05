import { ReactNode, Suspense } from 'react';
import {
  Header,
  HeaderDescription,
  HeaderHeader,
  HeaderTitle,
} from '@/components/header';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <>
          <Header>
            <HeaderHeader>
              <HeaderTitle>My Media</HeaderTitle>
              <HeaderDescription>
                Search through your entire media catalogue
              </HeaderDescription>
            </HeaderHeader>
          </Header>
        </>
      }
    >
      {children}
    </Suspense>
  );
};

export default Layout;
