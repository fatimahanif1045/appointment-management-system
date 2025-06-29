import { ConfigProvider, Layout, Menu } from 'antd';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider, { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DoctorDirectory from './pages/DoctorDirectory';
import MyAppointments from './pages/MyAppointments';
import DoctorManagement from './pages/DoctorManagement';
import AdminDashboard from './pages/AdminDashboard';
import ManageAppointments from './pages/ManageAppointments';
import UserDashboard from './pages/UserDashboard';

const { Header, Content } = Layout;

function Nav() {
  const { user, logout } = useAuth();
  return (
    <Header>
      <Menu theme="dark" mode="horizontal" selectable={false}>
        <Menu.Item key="home">
          <Link to="/">Doctors</Link>
        </Menu.Item>

        {user?.role === 'user' && (
          <>
            <Menu.Item key="my">
              <Link to="/my-appointments">My Appointments</Link>
            </Menu.Item>
            <Menu.Item key="userDash">
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <Menu.Item key="dash">
              <Link to="/admin">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="manageDoctors">
              <Link to="/admin/doctors">Doctors</Link>
            </Menu.Item>
            <Menu.Item key="manageAppts">
              <Link to="/admin/appointments">Appointments</Link>
            </Menu.Item>
          </>
        )}

        <Menu.Item key={user ? 'logout' : 'login'} style={{ marginLeft: 'auto' }}>
          {user ? (
            <span onClick={logout} style={{ cursor: 'pointer' }}>Logout</span>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <AuthProvider>
          <Layout style={{ minHeight: '100vh' }}>
            <Nav />
            <Content style={{ padding: '24px 50px' }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<DoctorDirectory />} />
                  <Route path="/my-appointments" element={<MyAppointments />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                </Route>

                <Route element={<ProtectedRoute roles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/doctors" element={<DoctorManagement />} />
                  <Route path="/admin/appointments" element={<ManageAppointments />} />
                </Route>
              </Routes>
            </Content>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}
