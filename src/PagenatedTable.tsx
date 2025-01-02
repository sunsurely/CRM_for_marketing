import { Dispatch, SetStateAction, useState } from 'react';
import styled from '@emotion/styled';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  Checkbox,
  Button,
  Modal,
  Typography,
} from '@mui/material';
import CustomersModal, { ModalContentProps } from 'components/CustomersModal';

export interface CustomerType {
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  location: string;
  email: string;
  id: string;
  comment?: string;
  status: string;
  createdAt: string;
}

interface PaginatedTableProps {
  customers: CustomerType[];
  setCustomers: Dispatch<SetStateAction<CustomerType[]>>;
}

const Container = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
const StyledTableContainer = styled(TableContainer)`
  width: 95%;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;
const StyledTableHead = styled(TableHead)`
  background-color: #007bff;
  color: white;
  & th {
    color: white;
    font-weight: bold;
    font-size: 1em;
    text-align: center;
  }
`;
const StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: rgba(0, 123, 255, 0.1);
    cursor: pointer;
  }
`;
const ActionButton = styled(Button)`
  color: white;
  background-color: #d9534f;
  &:hover {
    background-color: #c9302c;
  }
`;
const PaginatedTable = ({ customers, setCustomers }: PaginatedTableProps) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ModalContentProps | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleFirstNameClick = (customer: CustomerType) => {
    setModalContent(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleUpdateCustomer = (updatedCustomer: ModalContentProps) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id
          ? { ...customer, ...updatedCustomer }
          : customer,
      ),
    );
  };

  const handleDeleteSelected = () => {
    setCustomers((prev) =>
      prev.filter((customer) => !selectedRows.has(customer.id)),
    );
    setSelectedRows(new Set());
    setIsDeleteModalOpen(false); // 모달 닫기
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Container>
        <StyledTableContainer>
          <Table aria-label="modern table">
            <StyledTableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ textAlign: 'center' }}>
                  <Checkbox
                    indeterminate={
                      selectedRows.size > 0 &&
                      selectedRows.size < customers.length
                    }
                    checked={selectedRows.size === customers.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(new Set(customers.map((c) => c.id)));
                      } else {
                        setSelectedRows(new Set());
                      }
                    }}
                  />
                </TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">First Name</TableCell>
                <TableCell align="center">Last Name</TableCell>
                <TableCell align="center">Job Title</TableCell>
                <TableCell align="center">Company</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Location</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {customers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => (
                  <StyledTableRow key={customer.id}>
                    <TableCell
                      padding="checkbox"
                      sx={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      <Checkbox
                        checked={selectedRows.has(customer.id)}
                        onChange={() => handleRowSelect(customer.id)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {new Date(customer.createdAt)
                        .toLocaleDateString('en-CA')
                        .replace(/-/g, '.')}
                    </TableCell>
                    <TableCell
                      onClick={() => handleFirstNameClick(customer)}
                      style={{ color: '#007bff', cursor: 'pointer' }}
                      align="center"
                    >
                      {customer.firstName}
                    </TableCell>
                    <TableCell align="center">{customer.lastName}</TableCell>
                    <TableCell align="center">{customer.jobTitle}</TableCell>
                    <TableCell align="center">{customer.company}</TableCell>
                    <TableCell align="center">{customer.email}</TableCell>
                    <TableCell align="center">{customer.location}</TableCell>
                    <TableCell align="center">{customer.status}</TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
            }}
          >
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={customers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <ActionButton
              onClick={openDeleteModal}
              disabled={selectedRows.size === 0}
            >
              삭제
            </ActionButton>
          </Box>
        </StyledTableContainer>
      </Container>

      {/* 삭제 확인 모달 */}
      <Modal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        aria-labelledby="delete-confirmation"
        aria-describedby="delete-confirmation-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography id="delete-confirmation" variant="h6" component="h2">
            정말 삭제하시겠습니까?
          </Typography>
          <Box
            sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleDeleteSelected}
            >
              네
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={closeDeleteModal}
            >
              아니요
            </Button>
          </Box>
        </Box>
      </Modal>

      <CustomersModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        modalContent={modalContent}
        updateCustomer={handleUpdateCustomer}
      />
    </>
  );
};

export default PaginatedTable;