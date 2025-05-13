import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import styled from 'styled-components';
import { theme } from '../theme';
import EntryForm from '../components/EntryForm';

const PageContainer = styled.div`
  padding: ${theme.spacing.md};
`;

const Title = styled.h2`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.h2.fontSize};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
  font-weight: ${theme.typography.h2.fontWeight};
`;

const AddButton = styled.button`
  display: block;
  margin: 0 auto ${theme.spacing.md};
  padding: 0.8rem 1.5rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${theme.typography.body.fontSize};
  font-weight: 500;
  transition: ${theme.transitions.default};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background-color: #1A3642;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ListContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const EntryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const EntryItem = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  overflow: hidden;
`;

const EntryHeader = styled.div`
  background-color: ${theme.colors.secondary};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EntryDate = styled.div`
  color: ${theme.colors.white};
  font-weight: 500;
  font-size: ${theme.typography.body.fontSize};
`;

const EntryActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.white};
  cursor: pointer;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.typography.small.fontSize};
  opacity: 0.8;
  transition: ${theme.transitions.default};
  
  &:hover {
    opacity: 1;
  }
`;

const EntryDetails = styled.div`
  padding: ${theme.spacing.md};
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.md};
`;

const DetailItem = styled.div`
  text-align: center;
`;

const DetailLabel = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.small.fontSize};
  margin-bottom: ${theme.spacing.xs};
`;

const DetailValue = styled.div`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.body.fontSize};
  font-weight: 500;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
`;

const EntriesPage = () => {
  const { entries, setEntries } = useContext(DataContext);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  const handleDelete = (index) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (entry, index) => {
    setEditingEntry({ ...entry, index });
  };

  const handleUpdate = (updatedEntry) => {
    setEntries(prev => prev.map((entry, index) => 
      index === editingEntry.index ? updatedEntry : entry
    ));
    setEditingEntry(null);
  };

  const handleAdd = (newEntry) => {
    setEntries(prev => [...prev, newEntry]);
    setIsAddingEntry(false);
  };

  if (editingEntry) {
    return (
      <PageContainer>
        <Title>Edit Entry</Title>
        <EntryForm 
          initialData={editingEntry}
          onSubmit={handleUpdate}
          onCancel={() => setEditingEntry(null)}
        />
      </PageContainer>
    );
  }

  if (isAddingEntry) {
    return (
      <PageContainer>
        <Title>Add New Entry</Title>
        <EntryForm 
          onSubmit={handleAdd}
          onCancel={() => setIsAddingEntry(false)}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title>Previous Entries</Title>
      <AddButton onClick={() => setIsAddingEntry(true)}>
        Add New Entry
      </AddButton>
      <ListContainer>
        {!entries || entries.length === 0 ? (
          <EmptyMessage>No entries yet. Start logging your data!</EmptyMessage>
        ) : (
          <EntryList>
            {entries.map((entry, index) => (
              <EntryItem key={entry.date || index}>
                <EntryHeader>
                  <EntryDate>{entry.date}</EntryDate>
                  <EntryActions>
                    <ActionButton onClick={() => handleEdit(entry, index)}>
                      Edit
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(index)}>
                      Delete
                    </ActionButton>
                  </EntryActions>
                </EntryHeader>
                <EntryDetails>
                  <DetailItem>
                    <DetailLabel>Weight</DetailLabel>
                    <DetailValue>{entry.weight} lbs</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Total Calories</DetailLabel>
                    <DetailValue>{entry.totalCalories}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Cardio</DetailLabel>
                    <DetailValue>{entry.cardioCalories}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Weight Training</DetailLabel>
                    <DetailValue>{entry.weightTrainingCalories}</DetailValue>
                  </DetailItem>
                </EntryDetails>
              </EntryItem>
            ))}
          </EntryList>
        )}
      </ListContainer>
    </PageContainer>
  );
};

export default EntriesPage; 