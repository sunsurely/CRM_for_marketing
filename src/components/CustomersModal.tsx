import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Comment as CommentIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Note as NoteIcon,
} from '@mui/icons-material';
import axios from 'axios';

export interface ModalContentProps {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  location: string;
  email: string;
  comment?: string;
  status: string;
  note?: string; // 비고 필드 추가
}

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  modalContent: ModalContentProps | null;
  updateCustomer: (updatedCustomer: ModalContentProps) => void;
}

const ModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 700px;
  outline: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ModalHeader = styled(Typography)`
  font-size: 1.8rem;
  font-weight: bold;
  color: #007bff;
  text-align: center;
  margin-bottom: 20px;
`;

const InfoRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
`;

const Label = styled.span`
  font-weight: bold;
  color: #333;
  flex-shrink: 0;
  width: 120px;
`;

const Value = styled.span`
  color: #555;
  flex-grow: 1;
  word-wrap: break-word;
`;

const IconWrapper = styled(Box)`
  color: #007bff;
  font-size: 1.5rem;
`;

const ModalFooter = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const CustomersModal: React.FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  modalContent,
  updateCustomer,
}) => {
  const [status, setStatus] = useState<string>(modalContent?.status || '신규');
  const [comment, setComment] = useState<string>(modalContent?.comment || '');
  const [note, setNote] = useState<string>(modalContent?.note || '');
  const [isNoteEditable, setIsNoteEditable] = useState<boolean>(false);

  useEffect(() => {
    if (modalContent) {
      setNote(modalContent.note || '');
      setIsNoteEditable(false); // 초기화 시 수정 모드 비활성화
    }
  }, [modalContent]);

  const handleSave = async () => {
    if (!modalContent) return;

    const updatedCustomer = {
      ...modalContent,
      status,
      comment,
      note,
    };

    try {
      await axios.patch(`http://localhost:3000/customer/${modalContent.id}`, {
        status,
        comment,
        note,
      });
      updateCustomer(updatedCustomer);
      alert('변경사항을 저장했습니다.');
      setIsNoteEditable(false);
      onClose();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value);
  };

  const toggleNoteEdit = () => {
    if (isNoteEditable) {
      setIsNoteEditable(false);
    } else {
      // 수정 버튼 클릭 시
      setIsNoteEditable(true);
    }
  };

  if (!modalContent) return null;

  return (
    <Box
      sx={{
        display: isOpen ? 'block' : 'none',
      }}
    >
      <ModalContent>
        <ModalHeader>
          {modalContent.firstName} {modalContent.lastName}
        </ModalHeader>
        <InfoRow>
          <IconWrapper>
            <PersonIcon />
          </IconWrapper>
          <Label>Job Title:</Label>
          <Value>{modalContent.jobTitle}</Value>
        </InfoRow>
        <InfoRow>
          <IconWrapper>
            <BusinessIcon />
          </IconWrapper>
          <Label>Company:</Label>
          <Value>{modalContent.company}</Value>
        </InfoRow>
        <InfoRow>
          <IconWrapper>
            <EmailIcon />
          </IconWrapper>
          <Label>Email:</Label>
          <Value>{modalContent.email}</Value>
        </InfoRow>
        <InfoRow>
          <IconWrapper>
            <LocationOnIcon />
          </IconWrapper>
          <Label>Location:</Label>
          <Value>{modalContent.location}</Value>
        </InfoRow>
        <InfoRow>
          <IconWrapper>
            <ArrowDropDownIcon />
          </IconWrapper>
          <Label>Status:</Label>
          <Select
            value={status}
            onChange={handleStatusChange}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="신규">신규</MenuItem>
            <MenuItem value="이메일답장완료">이메일답장완료</MenuItem>
            <MenuItem value="미팅완료">미팅완료</MenuItem>
            <MenuItem value="진행중">진행중</MenuItem>
            <MenuItem value="거래완료">거래완료</MenuItem>
            <MenuItem value="거래취소">거래취소</MenuItem>
          </Select>
        </InfoRow>
        <InfoRow>
          <IconWrapper>
            <CommentIcon />
          </IconWrapper>
          <Label>Comment:</Label>
          <Value>{modalContent.comment || 'No comment available'}</Value>
        </InfoRow>
        <InfoRow>
          <IconWrapper>
            <NoteIcon />
          </IconWrapper>
          <Label>Note:</Label>
          {isNoteEditable ? (
            <TextField
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
            />
          ) : (
            <Value>{note || 'No notes available'}</Value>
          )}
          <Button onClick={toggleNoteEdit} variant="outlined">
            {isNoteEditable ? '완료' : '수정'}
          </Button>
        </InfoRow>

        <ModalFooter>
          <Button variant="outlined" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ backgroundColor: '#007bff' }}
          >
            저장
          </Button>
        </ModalFooter>
      </ModalContent>
    </Box>
  );
};

export default CustomersModal;
