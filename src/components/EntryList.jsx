const EntryItem = styled.li`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  transition: ${theme.transitions.default};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs}; /* Add gap between date and details */

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const EntryDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  width: 100%;
  justify-content: flex-start;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  min-width: 150px; /* Ensure labels and values align even if labels have longer text */
  font-size: ${theme.typography.body.fontSize};
  color: ${theme.colors.text.secondary};

  span:first-child {
    color: ${theme.colors.primary}; /* Make the value stand out */
    font-weight: 600;
    margin-left: 5px;
  }
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
              <DetailItem>
                <span>Weight:</span>
                <span>{entry.weight} lbs</span>
              </DetailItem>
              <DetailItem>
                <span>Total Cal::</span>
                <span>{entry.totalCalories}</span>
              </DetailItem>
              <DetailItem>
                <span>Cardio:</span>
                <span>{entry.cardioCalories}</span>
              </DetailItem>
              <DetailItem>
                <span>Weight Training:</span>
                <span>{entry.weightTrainingCalories}</span>
              </DetailItem>
            </EntryDetails>
          </EntryItem>
        ))}
      </StyledEntryList>
    </ListContainer>
  );
};

export default EntryList;
