import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  MenuItem,
  Select,
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios, { AxiosError } from 'axios';

interface ScheduleType {
  id: string;
  title: string;
  date: string;
  time: string;
  personInCharge: string;
  status: string;
  memo?: string;
}

const Container = styled(Box)`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  margin-bottom: 20px;
`;

const Title = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const IconWrapper = styled(Box)`
  font-size: 2.5rem;
  color: #007bff;
`;

const CalendarWrapper = styled(Box)`
  .fc {
    background-color: #fffacd; /* 포스트잇 색상 */
    border-radius: 8px;

    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .fc-toolbar {
    background-color: #ffebcd; /* 밝은 포스트잇 색상 */
    border-radius: 8px;
    margin-bottom: 10px;
  }
`;

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<ScheduleType[]>([
    {
      id: '1',
      title: '고객 미팅',
      date: '2025-01-05',
      time: '14:00',
      personInCharge: '김철수',
      status: '신규',
      memo: '서울 사무실에서 진행',
    },
    {
      id: '2',
      title: '프로젝트 점검 회의',
      date: '2025-01-10',
      time: '10:00',
      personInCharge: '이영희',
      status: '진행 중',
    },
    {
      id: '3',
      title: '일본 출장',
      date: '2025-01-15',
      time: '09:00',
      personInCharge: '홍길동',
      status: '완료',
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/schedule');
        setSchedules(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchData();
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentEdit, setCurrentEdit] = useState<ScheduleType | null>(null);

  const handleEventClick = (clickInfo: any) => {
    const schedule = schedules.find(
      (sched) => String(sched.id) === clickInfo.event.id,
    );

    if (schedule) {
      setCurrentEdit(schedule);
      setIsEditModalOpen(true);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    setCurrentEdit({
      id: '',
      title: '',
      date: selectInfo.startStr.split('T')[0],
      time: selectInfo.startStr.split('T')[1] || '',
      personInCharge: '',
      status: '신규',
      memo: '',
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEdit(null);
  };

  const handleSaveEdit = async () => {
    if (currentEdit) {
      if (currentEdit.id) {
        try {
          const { id, ...rest } = currentEdit;
          const response = await axios.patch(
            `http://localhost:3000/schedule/${id}`,
            rest,
          );
        } catch (error) {
          if (axios.isAxiosError(error)) {
            // Axios 에러인 경우
            console.error(
              'Error fetching customers:',
              error.response?.data?.message ||
                error.message ||
                'An unknown error occurred',
            );
          } else {
            // 일반 에러인 경우
            console.error(
              'An unexpected error occurred:',
              (error as Error).message,
            );
          }
        }
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.id === currentEdit.id ? currentEdit : schedule,
          ),
        );
      } else {
        try {
          const { id, ...rest } = currentEdit;
          const response = await axios.post(
            'http://localhost:3000/schedule',
            rest,
          );

          console.log(response.data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            // Axios 에러인 경우
            console.error(
              'Error fetching customers:',
              error.response?.data?.message ||
                error.message ||
                'An unknown error occurred',
            );
          } else {
            // 일반 에러인 경우
            console.error(
              'An unexpected error occurred:',
              (error as Error).message,
            );
          }
        }
        setSchedules((prev) => [
          ...prev,
          { ...currentEdit, id: (prev.length + 1).toString() },
        ]);
      }
    }
    closeEditModal();
  };

  const events = schedules.map((schedule) => ({
    id: schedule.id,
    title: schedule.title,
    start: `${schedule.date}T${schedule.time}`,
    color:
      schedule.status === '신규'
        ? '#007bff'
        : schedule.status === '진행 중'
        ? '#ffc107'
        : schedule.status === '완료'
        ? '#28a745'
        : '#dc3545',
  }));

  return (
    <Container>
      <Header>
        <Title>
          <IconWrapper>
            <EventNoteIcon />
          </IconWrapper>
          일정관리
        </Title>
      </Header>

      <CalendarWrapper>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable
          selectable
          events={events}
          eventClick={handleEventClick}
          select={handleDateSelect}
          headerToolbar={{
            start: 'today prev,next',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="auto"
        />
      </CalendarWrapper>

      {/* 수정 모달 */}
      <Modal open={isEditModalOpen} onClose={closeEditModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            minWidth: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {currentEdit?.id ? '일정 수정' : '새 일정 추가'}
          </Typography>
          <TextField
            fullWidth
            label="제목"
            value={currentEdit?.title || ''}
            onChange={(e) =>
              setCurrentEdit((prev) =>
                prev ? { ...prev, title: e.target.value } : null,
              )
            }
            margin="normal"
          />
          <TextField
            fullWidth
            type="date"
            label="날짜"
            InputLabelProps={{ shrink: true }}
            value={currentEdit?.date || ''}
            onChange={(e) =>
              setCurrentEdit((prev) =>
                prev ? { ...prev, date: e.target.value } : null,
              )
            }
            margin="normal"
          />
          <TextField
            fullWidth
            type="time"
            label="시간"
            InputLabelProps={{ shrink: true }}
            value={currentEdit?.time || ''}
            onChange={(e) =>
              setCurrentEdit((prev) =>
                prev ? { ...prev, time: e.target.value } : null,
              )
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="담당자"
            value={currentEdit?.personInCharge || ''}
            onChange={(e) =>
              setCurrentEdit((prev) =>
                prev ? { ...prev, personInCharge: e.target.value } : null,
              )
            }
            margin="normal"
          />
          <Select
            fullWidth
            value={currentEdit?.status || '신규'}
            onChange={(e) =>
              setCurrentEdit((prev) =>
                prev ? { ...prev, status: e.target.value } : null,
              )
            }
          >
            <MenuItem value="신규">신규</MenuItem>
            <MenuItem value="진행 중">진행 중</MenuItem>
            <MenuItem value="완료">완료</MenuItem>
            <MenuItem value="취소">취소</MenuItem>
          </Select>
          <TextField
            fullWidth
            label="메모"
            multiline
            rows={3}
            value={currentEdit?.memo || ''}
            onChange={(e) =>
              setCurrentEdit((prev) =>
                prev ? { ...prev, memo: e.target.value } : null,
              )
            }
            margin="normal"
          />
          <Box
            sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
          >
            <Button variant="contained" onClick={handleSaveEdit}>
              저장
            </Button>
            <Button variant="outlined" onClick={closeEditModal}>
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default ScheduleManagement;
