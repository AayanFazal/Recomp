import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import styled from 'styled-components';
import { theme } from '../theme';

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

const GoalsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: ${theme.colors.secondary};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
`;

const Form = styled.form`
  display: grid;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  color: ${theme.colors.white};
  font-size: ${theme.typography.body.fontSize};
  font-weight: 500;
`;

const Input = styled.input`
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
`;

const Button = styled.button`
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

const GoalInfo = styled.div`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.medium};
  margin-top: ${theme.spacing.lg};
`;

const InfoTitle = styled.h3`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.h3.fontSize};
  margin-bottom: ${theme.spacing.md};
  font-weight: ${theme.typography.h3.fontWeight};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};
`;

const InfoCard = styled.div`
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.secondary}10;
  border-radius: ${theme.borderRadius.medium};
`;

const InfoLabel = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.small.fontSize};
  margin-bottom: ${theme.spacing.xs};
`;

const InfoValue = styled.div`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.h3.fontSize};
  font-weight: 600;
`;

const GoalsPage = () => {
  const { entries, goals, setGoals } = useContext(DataContext);
  const [formData, setFormData] = useState({
    targetWeight: goals?.targetWeight || '',
    targetDate: goals?.targetDate || '',
  });

  // Update form data when goals change
  useEffect(() => {
    if (goals) {
      setFormData({
        targetWeight: goals.targetWeight || '',
        targetDate: goals.targetDate || '',
      });
    }
  }, [goals]);

  const currentWeight = entries.length > 0 ? entries[entries.length - 1].weight : 0;

  const calculateGoalInfo = () => {
    if (!formData.targetWeight || !formData.targetDate || !currentWeight) {
      return null;
    }

    const targetWeight = parseFloat(formData.targetWeight);
    const targetDate = new Date(formData.targetDate);
    const today = new Date();
    
    // Calculate weeks until target date
    const weeksUntilTarget = Math.max(1, Math.ceil((targetDate - today) / (7 * 24 * 60 * 60 * 1000)));
    
    // Calculate total weight to lose/gain
    const totalWeightChange = targetWeight - currentWeight;
    
    // Calculate weekly rate
    const weeklyRate = totalWeightChange / weeksUntilTarget;
    
    // Calculate daily calorie deficit/surplus needed
    // 1 pound = 3500 calories
    const dailyCalorieChange = (weeklyRate * 3500) / 7;

    return {
      weeksUntilTarget,
      totalWeightChange,
      weeklyRate,
      dailyCalorieChange
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGoals({
      targetWeight: parseFloat(formData.targetWeight),
      targetDate: formData.targetDate
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const goalInfo = calculateGoalInfo();

  return (
    <PageContainer>
      <Title>Set Your Goals</Title>
      <GoalsContainer>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Current Weight</Label>
            <Input
              type="number"
              value={currentWeight}
              disabled
              placeholder="Enter your current weight"
            />
          </InputGroup>
          <InputGroup>
            <Label>Target Weight (lbs)</Label>
            <Input
              type="number"
              step="0.1"
              name="targetWeight"
              value={formData.targetWeight}
              onChange={handleChange}
              placeholder="Enter your target weight"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Target Date</Label>
            <Input
              type="date"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </InputGroup>
          <Button type="submit">{goals ? 'Update Goal' : 'Set Goal'}</Button>
        </Form>

        {goalInfo && (
          <GoalInfo>
            <InfoTitle>Goal Breakdown</InfoTitle>
            <InfoGrid>
              <InfoCard>
                <InfoLabel>Weeks Until Target</InfoLabel>
                <InfoValue>{goalInfo.weeksUntilTarget} weeks</InfoValue>
              </InfoCard>
              <InfoCard>
                <InfoLabel>Total Weight Change</InfoLabel>
                <InfoValue>
                  {goalInfo.totalWeightChange > 0 ? '+' : ''}
                  {goalInfo.totalWeightChange.toFixed(1)} lbs
                </InfoValue>
              </InfoCard>
              <InfoCard>
                <InfoLabel>Weekly Rate</InfoLabel>
                <InfoValue>
                  {goalInfo.weeklyRate > 0 ? '+' : ''}
                  {goalInfo.weeklyRate.toFixed(1)} lbs/week
                </InfoValue>
              </InfoCard>
              <InfoCard>
                <InfoLabel>Daily Calorie Change</InfoLabel>
                <InfoValue>
                  {goalInfo.dailyCalorieChange > 0 ? '+' : ''}
                  {Math.round(goalInfo.dailyCalorieChange)} cal/day
                </InfoValue>
              </InfoCard>
            </InfoGrid>
          </GoalInfo>
        )}
      </GoalsContainer>
    </PageContainer>
  );
};

export default GoalsPage; 