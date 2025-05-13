import React, { useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import styled from 'styled-components';
import { theme } from '../theme';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PageContainer = styled.div`
  padding: ${theme.spacing.md};
`;

const AnalyticsTitle = styled.h2`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.h2.fontSize};
  margin-bottom: ${theme.spacing.md};
  text-align: center;
  font-weight: ${theme.typography.h2.fontWeight};
`;

const ProgressContainer = styled.div`
  max-width: 800px;
  margin: 0 auto ${theme.spacing.lg};
  background-color: ${theme.colors.secondary};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
`;

const ProgressTitle = styled.h3`
  color: ${theme.colors.white};
  font-size: ${theme.typography.h3.fontSize};
  margin-bottom: ${theme.spacing.sm};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 24px;
  background-color: ${theme.colors.white}40;
  border-radius: ${theme.borderRadius.small};
  overflow: hidden;
  margin: ${theme.spacing.sm} 0;
`;

const Progress = styled.div`
  height: 100%;
  background-color: ${theme.colors.white};
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const ProgressValue = styled.div`
  font-size: ${theme.typography.h3.fontSize};
  color: ${theme.colors.white};
  text-align: center;
  font-weight: 600;
  margin-top: ${theme.spacing.sm};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};
  max-width: 800px;
  margin: 0 auto ${theme.spacing.lg};
`;

const StatCard = styled.div`
  background-color: ${theme.colors.secondary};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  color: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  aspect-ratio: 1;
  max-width: 200px;
  margin: 0 auto;
`;

const StatTitle = styled.div`
  font-size: ${theme.typography.small.fontSize};
  margin-bottom: ${theme.spacing.sm};
  opacity: 0.9;
`;

const StatValue = styled.div`
  font-size: 3.5rem;
  color: ${theme.colors.white};
  margin: ${theme.spacing.sm} 0;
  font-weight: 600;
  line-height: 1;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const TrendIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: 2rem;
  color: ${props => props.trend === 'up' ? '#dc3545' : '#28a745'};
  font-weight: 600;
`;

const GraphContainer = styled.div`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.small};
  max-width: 800px;
  margin: 0 auto;
`;

const AnalyticsPage = () => {
  const { entries, goals } = useContext(DataContext);

  const analytics = useMemo(() => {
    if (!entries || entries.length === 0) {
      return {
        currentWeight: 0,
        weeklyAverage: 0,
        dailyCaloriesAverage: 0,
        weightTrend: { value: 0, direction: 'neutral' },
        weightProgress: 0
      };
    }

    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Current weight (most recent entry)
    const currentWeight = sortedEntries[sortedEntries.length - 1].weight;

    // Weekly average (last 7 entries or all if less than 7)
    const recentEntries = sortedEntries.slice(-7);
    const weeklyAverage = recentEntries.reduce((sum, entry) => sum + entry.weight, 0) / recentEntries.length;

    // Daily calories average
    const dailyCaloriesAverage = entries.reduce((sum, entry) => sum + entry.totalCalories, 0) / entries.length;

    // Weight trend (comparing last two entries)
    let weightTrend = { value: 0, direction: 'neutral' };
    if (sortedEntries.length >= 2) {
      const lastEntry = sortedEntries[sortedEntries.length - 1];
      const previousEntry = sortedEntries[sortedEntries.length - 2];
      const difference = lastEntry.weight - previousEntry.weight;
      weightTrend = {
        value: Math.abs(difference),
        direction: difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral'
      };
    }

    // Calculate weight progress percentage
    const startWeight = sortedEntries[0].weight;
    const targetWeight = goals?.weightGoal || startWeight;
    
    // Calculate progress based on whether we're trying to lose or gain weight
    const isWeightLoss = targetWeight < startWeight;
    const totalToChange = Math.abs(startWeight - targetWeight);
    const currentChange = Math.abs(startWeight - currentWeight);
    
    let weightProgress;
    if (isWeightLoss) {
      // For weight loss, progress increases as weight decreases
      weightProgress = currentWeight <= targetWeight ? 100 : 
        (currentWeight >= startWeight ? 0 : 
        ((startWeight - currentWeight) / totalToChange) * 100);
    } else {
      // For weight gain, progress increases as weight increases
      weightProgress = currentWeight >= targetWeight ? 100 :
        (currentWeight <= startWeight ? 0 :
        ((currentWeight - startWeight) / totalToChange) * 100);
    }

    return {
      currentWeight,
      weeklyAverage,
      dailyCaloriesAverage,
      weightTrend,
      weightProgress: Math.min(100, Math.max(0, weightProgress))
    };
  }, [entries, goals]);

  const chartData = {
    labels: entries.map(entry => entry.date),
    datasets: [
      {
        label: 'Weight',
        data: entries.map(entry => entry.weight),
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '20',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: theme.colors.secondary + '20'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <PageContainer>
      <AnalyticsTitle>Analytics</AnalyticsTitle>
      
      <ProgressContainer>
        <ProgressTitle>Weight Progress</ProgressTitle>
        <ProgressBar>
          <Progress percentage={analytics.weightProgress} />
        </ProgressBar>
        <ProgressValue>{analytics.weightProgress.toFixed(1)}%</ProgressValue>
      </ProgressContainer>

      <StatsGrid>
        <StatCard>
          <StatTitle>Current Weight</StatTitle>
          <StatValue>{analytics.currentWeight.toFixed(1)}</StatValue>
          <StatTitle>lbs</StatTitle>
        </StatCard>
        <StatCard>
          <StatTitle>Weekly Average</StatTitle>
          <StatValue>{analytics.weeklyAverage.toFixed(1)}</StatValue>
          <StatTitle>lbs</StatTitle>
        </StatCard>
        <StatCard>
          <StatTitle>Daily Calories</StatTitle>
          <StatValue>{Math.round(analytics.dailyCaloriesAverage)}</StatValue>
          <StatTitle>calories</StatTitle>
        </StatCard>
        <StatCard>
          <StatTitle>Weight Trend</StatTitle>
          <StatValue>
            {analytics.weightTrend.direction !== 'neutral' && (
              <TrendIndicator trend={analytics.weightTrend.direction}>
                {analytics.weightTrend.direction === 'up' ? '↑' : '↓'}
                {analytics.weightTrend.value.toFixed(1)}
              </TrendIndicator>
            )}
            {analytics.weightTrend.direction === 'neutral' && '0.0'}
          </StatValue>
          <StatTitle>lbs</StatTitle>
        </StatCard>
      </StatsGrid>
      <GraphContainer>
        <Line data={chartData} options={chartOptions} />
      </GraphContainer>
    </PageContainer>
  );
};

export default AnalyticsPage; 