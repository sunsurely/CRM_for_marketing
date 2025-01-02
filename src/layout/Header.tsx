import styled from '@emotion/styled';
import { Box, Button } from '@mui/material';
import logo from '../images/logo.png';

const HeaderContainer = styled(Box)`
  width: 100%;
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(224, 223, 223, 0.05);
  padding: 0 20px;
  z-index: 10;
`;

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoImage = styled.div`
  width: 100px;
  height: 100px;
  margin-left: 25px;
  background-image: url(${logo});
  background-size: cover;
`;

const LogoutButton = styled(Button)`
  background-color: #d9534f;
  color: white;
  &:hover {
    background-color: #c9302c;
  }
`;

const Header = () => {
  const handleLogout = () => {
    alert('로그아웃 되었습니다.');
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <LogoImage />
      </LogoContainer>
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
    </HeaderContainer>
  );
};

export default Header;
