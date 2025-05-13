import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import styled from 'styled-components';

const FormContainer = styled.div`
  padding: 2rem;
  margin: 1rem auto;
  max-width: 600px;
  background-color: #FBE9D0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(36, 72, 85, 0.1);
`;

const Title = styled.h2`
  color: #244855;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 400px;
  margin: 0 auto;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #244855;
  font-size: 0.9rem;
  font-weight: 500;
`;

const StyledInput = styled.input`
  padding: 0.8rem;
  border: 2px solid #90AEAD;
  border-radius: 8px;
  background-color: white;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #244855;
    box-shadow: 0 0 0 3px rgba(36, 72, 85, 0.1);
  }
  
  &::placeholder {
    color: #90AEAD;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.variant === 'secondary' ? '#90AEAD' : '#244855'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#7A9493' : '#1A3642'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const GoalDisplay = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(36, 72, 85, 0.05);
`;

const GoalText = styled.p`
  color: #244855;
  font-size: 1.1rem;
  margin: 0.8rem 0;
  
  strong {
    color: #90AEAD;
    font-weight: 600;
  }
`;

const GoalForm = () => {
  const { goals, setGoals } = useContext(DataContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    targetWeight: '',
    targetDate: ''
  });

  // Load existing goal if available
  useEffect(() => {
    if (goals.targetWeight && goals.targetDate) {
      setFormData({
        targetWeight: goals.targetWeight,
        targetDate: goals.targetDate
      });
    }
  }, [goals]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGoals({
      targetWeight: parseFloat(formData.targetWeight),
      targetDate: formData.targetDate
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!isEditing && goals.targetWeight && goals.targetDate) {
    return (
      <FormContainer>
        <Title>Current Goal</Title>
        <GoalDisplay>
          <GoalText>
            <strong>Target Weight:</strong> {goals.targetWeight} lbs
          </GoalText>
          <GoalText>
            <strong>Target Date:</strong> {new Date(goals.targetDate).toLocaleDateString()}
          </GoalText>
          <Button variant="secondary" onClick={handleEdit}>Change Goal</Button>
        </GoalDisplay>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Title>{goals.targetWeight ? 'Update Your Goal' : 'Set Your Goal'}</Title>
      <StyledForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Target Weight (lbs)</Label>
          <StyledInput
            type="number"
            name="targetWeight"
            placeholder="Enter target weight"
            value={formData.targetWeight}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label>Target Date</Label>
          <StyledInput
            type="date"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <Button type="submit">
          {goals.targetWeight ? 'Update Goal' : 'Set Goal'}
        </Button>
      </StyledForm>
    </FormContainer>
  );
};

export default GoalForm; 