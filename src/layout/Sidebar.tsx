import styled from '@emotion/styled';
import { useState } from 'react';
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CampaignIcon from '@mui/icons-material/Campaign';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 15%;
  height: 100vh;
  background-color: #f9f9fc;
  box-shadow: 1px 0 2px rgba(0, 0, 0, 0.041);
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  font-family: 'Arial', sans-serif;
`;

const SidebarHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: #007bff;
  margin-bottom: 30px;
`;

const StyledList = styled(List)`
  width: 100%;
  padding: 0;
`;

const StyledListItem = styled(ListItem)<{ selected: boolean }>`
  color: ${(props) => (props.selected ? '#ffffff' : '#333')};
  background-color: ${(props) => (props.selected ? '#007bff' : 'transparent')};
  &:hover {
    background-color: ${(props) =>
      props.selected ? '#0056b3' : 'rgba(0, 123, 255, 0.1)'};
  }
  border-radius: 8px;
  padding: 10px 15px;
  cursor: pointer;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
`;

const icons = [
  <PersonIcon />,
  <CalendarMonthIcon />,
  <QueryStatsIcon />,
  <ShoppingCartIcon />,
  <CampaignIcon />,
  <BusinessCenterIcon />,
  <BarChartIcon />,
];

const listItems = [
  { name: '고객관리', link: '/' },
  { name: '일정관리', link: '/schedule' },
  { name: '문의관리', link: '/' },
  { name: '상품판매관리', link: '/' },
  { name: '마케팅관리', link: '/' },
  { name: '영업관리', link: '/' },
  { name: '통계/분석', link: '/' },
];

const Sidebar = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleSelect = (index: number, link: string) => {
    setSelected(index);
    navigate(link);
  };

  return (
    <Container>
      <SidebarHeader>관리 패널</SidebarHeader>
      <StyledList>
        {listItems.map((item, index) => (
          <StyledListItem
            key={item.name}
            selected={selected === index}
            onClick={() => handleSelect(index, item.link)}
            tabIndex={0}
          >
            <ListItemIcon>{icons[index]}</ListItemIcon>
            <ListItemText primary={item.name} />
          </StyledListItem>
        ))}
      </StyledList>
    </Container>
  );
};

export default Sidebar;
