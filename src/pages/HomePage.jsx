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

const Title = styled.h2`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.h2.fontSize};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
  font-weight: ${theme.typography.h2.fontWeight};
`;

const HomePage = () => {
  return (
    <PageContainer>
      <Title>Today's Progress</Title>
      <StreakCounter />
      <EntryForm />
    </PageContainer>
  );
};

export default HomePage; 