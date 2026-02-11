import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { QCList } from '@/pages/qc/QCList';
import { QCDetail } from '@/pages/qc/QCDetail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/qc" replace />} />
          <Route path="/qc" element={
            <Layout>
              <QCList />
            </Layout>
          } />
          <Route path="/qc/:id" element={
            <Layout>
              <QCDetail />
            </Layout>
          } />
          <Route path="/print/:id" element={
            <QCDetail printMode={true} />
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
