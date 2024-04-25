import {
  Header,
  HeaderDescription,
  HeaderHeader,
  HeaderTitle,
} from '@/components/header';

const Page = () => {
  return (
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
  );
};

export default Page;
