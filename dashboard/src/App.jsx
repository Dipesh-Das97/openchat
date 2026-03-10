import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import useAgentStore from './store/agentStore';

const ProtectedRoute = ({ children }) => {
  const token = useAgentStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

const HomeRoute = () => {
  const token = useAgentStore((state) => state.token);
  return token ? <Navigate to="/dashboard" replace /> : <Landing />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup" element={
          <ProtectedRoute>
            <Setup />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;