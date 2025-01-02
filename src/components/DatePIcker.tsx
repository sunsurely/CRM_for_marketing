import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { CustomerType } from 'PagenatedTable';

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DateDisplay = styled.div`
  font-size: 1em;
  border: 2px solid #7e797937;
  border-radius: 5px;
  padding: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Modal = styled.div`
  position: absolute;
  top: 8%;
  right: 3%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 300px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
`;

const getLastDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

interface DatePickerType {
  setCustomers: Dispatch<SetStateAction<CustomerType[]>>;
}

const DatePicker = ({ setCustomers }: DatePickerType) => {
  const currentDate = new Date();
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(currentDate.getMonth() - 1);

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

  const [startDate, setStartDate] = useState(formatDate(previousMonthDate));
  const [endDate, setEndDate] = useState(formatDate(currentDate));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      const startYear = parseInt(startDate.split('-')[0], 10);
      const startMonth = parseInt(startDate.split('-')[1], 10);
      const endYear = parseInt(endDate.split('-')[0], 10);
      const endMonth = parseInt(endDate.split('-')[1], 10);

      const formattedStartDate = `${startYear}-${String(startMonth).padStart(
        2,
        '0',
      )}-01`;
      const lastDayOfEndMonth = getLastDayOfMonth(endYear, endMonth);
      const formattedEndDate = `${endYear}-${String(endMonth).padStart(
        2,
        '0',
      )}-${lastDayOfEndMonth}`;

      const start = new Date(formattedStartDate);
      const end = new Date(formattedEndDate);

      // Validation: End date should not be earlier than start date
      if (end < start) {
        alert('종료 날짜는 시작 날짜보다 이전일 수 없습니다.');
        return;
      }

      // Validation: Range should not exceed 3 months
      const diffMonths =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      if (diffMonths > 3) {
        alert('기간은 3개월을 초과할 수 없습니다.');
        return;
      }

      console.log(
        `Sending Dates: ${formattedStartDate} to ${formattedEndDate}`,
      );
      const response = await axios.post(
        'http://localhost:3000/customer/date-range-data',
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      );

      if (response.data.success) {
        alert('기간 설정이 성공적으로 저장되었습니다.');
        setCustomers(response.data.data);
      } else {
        throw new Error('기간 설정 중 오류 발생');
      }
      closeModal();
    } catch (error) {
      console.error('Error sending date range:', error);
      alert('기간 설정 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <DateDisplay>
        {`${startDate.replace('-', '.')} ~ ${endDate.replace('-', '.')}`}
      </DateDisplay>

      <Button onClick={openModal}>기간 설정</Button>

      {isModalOpen && (
        <>
          <Overlay onClick={closeModal} />
          <Modal>
            <h3>기간 설정</h3>
            <div>
              <label>
                시작 날짜:
                <Input
                  type="month"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                종료 날짜:
                <Input
                  type="month"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <Button onClick={handleSave}>저장</Button>
              <Button
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#d9534f',
                }}
                onClick={closeModal}
              >
                취소
              </Button>
            </div>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default DatePicker;
