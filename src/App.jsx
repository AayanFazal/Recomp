import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import GlobalStyle from './GlobalStyle';
import HomePage from './pages/HomePage';
import GoalsPage from './pages/GoalsPage';
import ExportPage from './pages/ExportPage';
import EntriesPage from './pages/EntriesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import styled from 'styled-components';
import { theme } from './theme';

const TabBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: transparent;
  padding: ${theme.spacing.sm};
  display: flex;
  justify-content: space-around;
  border-top: 1px solid ${theme.colors.secondary}20;
`;

const TabLink = styled(Link)`
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  transition: ${theme.transitions.default};
  font-size: ${theme.typography.small.fontSize};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background-color: ${theme.colors.primary}20;
  }
  
  &.active {
    color: ${theme.colors.primary};
    background-color: ${theme.colors.primary}20;
  }
`;

const PageContainer = styled.div`
  padding-bottom: 80px; // Space for the tab bar
`;

const Tabs = () => {
  const location = useLocation();
  
  return (
    <TabBar>
      <TabLink to="/" className={location.pathname === '/' ? 'active' : ''}>
        Home
      </TabLink>
      <TabLink to="/entries" className={location.pathname === '/entries' ? 'active' : ''}>
        Entries
      </TabLink>
      <TabLink to="/analytics" className={location.pathname === '/analytics' ? 'active' : ''}>
        Analytics
      </TabLink>
      <TabLink to="/goals" className={location.pathname === '/goals' ? 'active' : ''}>
        Goals
      </TabLink>
      <TabLink to="/export" className={location.pathname === '/export' ? 'active' : ''}>
        Export
      </TabLink>
    </TabBar>
  );
};

function App() {
  return (
    <DataProvider>
      <Router>
        <GlobalStyle />
        <PageContainer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/entries" element={<EntriesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
          <Tabs />
        </PageContainer>
      </Router>
    </DataProvider>
  );
}

export default App; 