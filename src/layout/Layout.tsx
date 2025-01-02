import { Outlet } from 'react-router-dom';
import Sidebar from 'layout/Sidebar';
import styled from '@emotion/styled';
import Header from './Header';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f1f3f5;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Layout = () => {
  return (
    <Container>
      <Header />
      <MainContainer>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </MainContainer>
    </Container>
  );
};

export default Layout;
