import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import CustomersPage from 'pages/CustomersPage';
import SigninPage from 'pages/SigninPage';
import ScheduleManagement from 'pages/ScheduleManagement';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route path="signin" element={<SigninPage />} /> */}
        <Route element={<Layout />}>
          <Route path="/" element={<CustomersPage />} />
          <Route path="/schedule" element={<ScheduleManagement />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
