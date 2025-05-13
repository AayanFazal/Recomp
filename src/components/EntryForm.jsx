import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import styled from 'styled-components';
import { theme } from '../theme';

const FormContainer = styled.div`
  padding: ${theme.spacing.lg};
  margin: ${theme.spacing.sm} auto;
  max-width: 600px;
  background-color: ${theme.colors.secondary};
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.medium};
`;

const Title = styled.h2`
  color: ${theme.colors.white};
  font-size: ${theme.typography.h2.fontSize};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
  font-weight: ${theme.typography.h2.fontWeight};
`;

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};
  max-width: 500px;
  margin: 0 auto;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const Label = styled.label`
  color: ${theme.colors.white};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 500;
`;

const StyledInput = styled.input`
  padding: 0.8rem;
  border: 2px solid ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium};
  background-color: ${theme.colors.white};
  font-size: ${theme.typography.body.fontSize};
  transition: ${theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(36, 72, 85, 0.1);
  }
  
  &::placeholder {
    color: ${theme.colors.secondary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
  grid-column: 1 / -1;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.variant === 'secondary' ? theme.colors.white : theme.colors.primary};
  color: ${props => props.variant === 'secondary' ? theme.colors.primary : theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  font-size: ${theme.typography.body.fontSize};
  font-weight: 500;
  transition: ${theme.transitions.default};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex: 1;
  
  &:hover {
    background-color: ${props => props.variant === 'secondary' ? theme.colors.background : '#1A3642'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EntryForm = ({ initialData, onSubmit, onCancel }) => {
  const { setEntries } = useContext(DataContext);
  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    weight: initialData?.weight || '',
    totalCalories: initialData?.totalCalories || '',
    cardioCalories: initialData?.cardioCalories || '',
    weightTrainingCalories: initialData?.weightTrainingCalories || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      ...formData,
      weight: parseFloat(formData.weight),
      totalCalories: parseInt(formData.totalCalories),
      cardioCalories: parseInt(formData.cardioCalories),
      weightTrainingCalories: parseInt(formData.weightTrainingCalories)
    };

    if (initialData) {
      setEntries(prev => prev.map(e => e.id === initialData.id ? entry : e));
    } else {
      setEntries(prev => [...prev, entry]);
    }

    if (onSubmit) {
      onSubmit(entry);
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        totalCalories: '',
        cardioCalories: '',
        weightTrainingCalories: ''
      });
    }
  };

  return (
    <FormContainer>
      <Title>{initialData ? 'Edit Entry' : 'Log Today\'s Data'}</Title>
      <StyledForm onSubmit={handleSubmit}>
        <InputGroup fullWidth>
          <Label>Date</Label>
          <StyledInput
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Weight (lbs)</Label>
          <StyledInput
            type="number"
            step="0.1"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Enter weight"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Total Calories</Label>
          <StyledInput
            type="number"
            name="totalCalories"
            value={formData.totalCalories}
            onChange={handleChange}
            placeholder="Enter total calories"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Cardio Calories</Label>
          <StyledInput
            type="number"
            name="cardioCalories"
            value={formData.cardioCalories}
            onChange={handleChange}
            placeholder="Enter cardio calories"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Weight Training Calories</Label>
          <StyledInput
            type="number"
            name="weightTrainingCalories"
            value={formData.weightTrainingCalories}
            onChange={handleChange}
            placeholder="Enter weight training calories"
            required
          />
        </InputGroup>
        <ButtonGroup>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {initialData ? 'Update Entry' : 'Submit Entry'}
          </Button>
        </ButtonGroup>
      </StyledForm>
    </FormContainer>
  );
};

export default EntryForm; 