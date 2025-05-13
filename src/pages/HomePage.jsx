import React from 'react';
import EntryForm from '../components/EntryForm';
import StreakCounter from '../components/StreakCounter';
import styled from 'styled-components';
import { theme } from '../theme';

const PageContainer = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const Title = styled.h1`
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.primary};
  border-bottom: 2px solid ${theme.colors.secondary};
  padding-bottom: ${theme.spacing.xs};
`;

const HomePage = () => {
  return (
    <PageContainer>
      <Title>RECOMP</Title>
      <EntryForm />
    </PageContainer>
  );
};

export default HomePage; 