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
import { FaHome, FaListAlt, FaChartBar, FaBullseye, FaFileExport } from 'react-icons/fa';

const TabBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${theme.colors.white};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  display: flex;
  justify-content: space-around;
  border-top: 1px solid ${theme.colors.secondary}20;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  
  @media (max-width: 430px) {
    padding: ${theme.spacing.xs} 0;
  }
`;

const TabLink = styled(Link)`
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.medium};
  transition: ${theme.transitions.default};
  font-size: ${theme.typography.small.fontSize};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${theme.colors.primary}20;
  }
  
  &.active {
    color: ${theme.colors.primary};
    background-color: ${theme.colors.primary}20;
  }
  
  @media (max-width: 430px) {
    padding: ${theme.spacing.xs} ${theme.spacing.xs};
    font-size: 0.7rem;
  }
`;

const PageContainer = styled.div`
  padding-bottom: 80px; // Space for the tab bar
  max-width: 100%;
  overflow-x: hidden;
  padding-top: ${theme.spacing.sm};
  
  @media (max-width: 430px) {
    padding-bottom: 70px;
  }
`;

const IconWrapper = styled.div`
  font-size: 1.3rem;
  margin-bottom: 5px;
  
  @media (max-width: 430px) {
    font-size: 1.1rem;
    margin-bottom: 3px;
  }
`;

const Tabs = () => {
  const location = useLocation();
  
  return (
    <TabBar>
      <TabLink to="/goals" className={location.pathname === '/goals' ? 'active' : ''}>
        <IconWrapper><FaBullseye /></IconWrapper>
        Goals
      </TabLink>
      <TabLink to="/entries" className={location.pathname === '/entries' ? 'active' : ''}>
        <IconWrapper><FaListAlt /></IconWrapper>
        Entries
      </TabLink>
      
    
      <TabLink to="/" className={location.pathname === '/' ? 'active' : ''}>
        <IconWrapper><FaHome /></IconWrapper>
        Home
      </TabLink>
      <TabLink to="/analytics" className={location.pathname === '/analytics' ? 'active' : ''}>
        <IconWrapper><FaChartBar /></IconWrapper>
        Analytics
      </TabLink>
      
      <TabLink to="/export" className={location.pathname === '/export' ? 'active' : ''}>
        <IconWrapper><FaFileExport /></IconWrapper>
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