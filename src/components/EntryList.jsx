import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import styled from 'styled-components';
import { theme } from '../theme';

const ListContainer = styled.div`
  padding: ${theme.spacing.lg};
  margin: ${theme.spacing.sm} auto;
  max-width: 600px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
`;

const Title = styled.h2`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.h2.fontSize};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
  font-weight: ${theme.typography.h2.fontWeight};
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.body.fontSize};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
`;

const StyledEntryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const EntryItem = styled.li`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  transition: ${theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const EntryDate = styled.strong`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.body.fontSize};
  display: block;
  margin-bottom: ${theme.spacing.xs};
`;

const EntryDetails = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.body.fontSize};
`;

const EntryList = () => {
  const { entries } = useContext(DataContext);

  if (!entries || entries.length === 0) {
    return (
      <ListContainer>
        <Title>Previous Entries</Title>
        <EmptyMessage>No entries yet. Start logging your data!</EmptyMessage>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <Title>Previous Entries</Title>
      <StyledEntryList>
        {entries.map((entry, idx) => (
          <EntryItem key={entry.date || idx}>
            <EntryDate>{entry.date}</EntryDate>
            <EntryDetails>
              Weight: {entry.weight} lbs | Total Calories: {entry.totalCalories} | 
              Cardio: {entry.cardioCalories} | Weight Training: {entry.weightTrainingCalories}
            </EntryDetails>
          </EntryItem>
        ))}
      </StyledEntryList>
    </ListContainer>
  );
};

export default EntryList; 