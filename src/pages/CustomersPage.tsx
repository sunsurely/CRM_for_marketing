import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import PaginatedTable, { CustomerType } from 'PagenatedTable';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { CalendarMonthOutlined, PeopleOutline } from '@mui/icons-material';

import axios from 'axios';
import { Box, Typography, Tooltip } from '@mui/material';
import DatePicker from 'components/DatePIcker';

const Container = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 20px;
`;

const Header = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
`;

const Title = styled(Typography)`
  font-size: 1.5em;
  font-weight: bold;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 25px;
`;

const FilterContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CustomersPage = () => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // const token = Cookies.get('jwt');
    // if (!token) {
    //   navigate('signin');
    // }//

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/customer');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <Container>
      <Header>
        <Title>
          <PeopleOutline fontSize="large" />
          고객관리
        </Title>
        <FilterContainer>
          <Tooltip title="날짜 필터" arrow>
            <CalendarMonthOutlined fontSize="medium" color="primary" />
          </Tooltip>
          <DatePicker setCustomers={setCustomers} />
        </FilterContainer>
      </Header>
      <PaginatedTable customers={customers} setCustomers={setCustomers} />
    </Container>
  );
};

export default CustomersPage;
