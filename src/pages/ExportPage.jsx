import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { DataContext } from '../context/DataContext';
import { theme } from '../theme';
import { exportToPdf } from '../utils/exportHelpers';
import { FaFileExport, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExportPageContainer = styled.div`
  padding: ${theme.spacing.md};
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 430px) {
    padding: ${theme.spacing.sm};
  }
`;

const PageTitle = styled.h1`
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.primary};
  border-bottom: 2px solid ${theme.colors.secondary};
  padding-bottom: ${theme.spacing.xs};
  text-align: center;
`;


const ExportSection = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadows.medium};
  margin-bottom: ${theme.spacing.md};
`;

const SectionTitle = styled.h2`
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.typography.h3.fontSize};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const DateRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  
  @media (min-width: 500px) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

const DateInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const DateLabel = styled.label`
  font-weight: 500;
  margin-bottom: ${theme.spacing.xs};
  color: ${theme.colors.text.primary};
`;

const DateInput = styled.input`
  padding: ${theme.spacing.xs};
  border: 1px solid ${theme.colors.secondary}80;
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.body.fontSize};
  background-color: ${theme.colors.background}50;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-weight: 600;
  transition: ${theme.transitions.default};
  margin-top: ${theme.spacing.md};
  
  &:hover {
    background-color: ${theme.colors.primary}e0;
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 430px) {
    width: 100%;
  }
`;

const DataPreviewContainer = styled.div`
  margin-top: ${theme.spacing.md};
  background-color: ${theme.colors.background}70;
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md};
  border: 1px dashed ${theme.colors.secondary}80;
`;

const ChartContainer = styled.div`
  margin-top: ${theme.spacing.md};
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.secondary}40;
  height: 300px;
  width: 100%;
  position: relative;
  overflow: hidden;
  canvas {
    max-width: 100%;
    height: auto !important;
  }
  
  @media (max-width: 430px) {
    height: 250px;
  }
`;

const ChartTitle = styled.h3`
  font-size: ${theme.typography.h4.fontSize};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const NoDataMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${theme.colors.secondary};
  font-style: italic;
`;

const DataItem = styled.div`
  margin-bottom: ${theme.spacing.sm};
  padding-bottom: ${theme.spacing.xs};
  border-bottom: 1px solid ${theme.colors.secondary}40;
  
  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const DataLabel = styled.span`
  font-weight: 500;
  margin-right: ${theme.spacing.xs};
  color: ${theme.colors.primary};
`;

const ExportPage = () => {
  const { entries } = useContext(DataContext);
  const [startDate, setStartDate] = useState(() => {
    // Default to 30 days ago to have more data points for the chart
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    // Default to today
    return new Date().toISOString().split('T')[0];
  });

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end day
    
    return entryDate >= start && entryDate <= end;
  });

  const chartRef = useRef(null);

  const calculateAverageWeight = (entries) => {
    if (!entries.length) return '--';
    const weightEntries = entries.filter(e => e.weight);
    if (!weightEntries.length) return '--';
    
    const sum = weightEntries.reduce((acc, curr) => acc + parseFloat(curr.weight), 0);
    return (sum / weightEntries.length).toFixed(1);
  };

  const calculateTotalCalories = (entries) => {
    if (!entries.length) return '--';
    const calorieEntries = entries.filter(e => e.totalCalories);
    if (!calorieEntries.length) return '--';
    
    return calorieEntries.reduce((acc, curr) => acc + parseFloat(curr.totalCalories), 0).toFixed(0);
  };

  // Prepare chart data for weight
  const prepareChartData = () => {
    if (!filteredEntries.length) return null;
    
    // Sort entries by date
    const sortedEntries = [...filteredEntries].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    const labels = sortedEntries.map(entry => 
      new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    
    const weightData = sortedEntries.map(entry => entry.weight || null);
    const caloriesData = sortedEntries.map(entry => entry.totalCalories || null);
    
    return {
      labels,
      datasets: [
        {
          label: 'Weight (lbs)',
          data: weightData,
          borderColor: theme.colors.primary,
          backgroundColor: `${theme.colors.primary}20`,
          tension: 0.3,
          yAxisID: 'y',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Calories Burned',
          data: caloriesData,
          borderColor: theme.colors.secondary,
          backgroundColor: `${theme.colors.secondary}20`,
          tension: 0.3,
          yAxisID: 'y1',
          pointRadius: 5,
          pointHoverRadius: 7,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Weight (lbs)',
          color: theme.colors.primary
        },
        grid: {
          color: '#33333310'
        },
        position: 'left',
        border: {
          color: theme.colors.primary
        }
      },
      y1: {
        title: {
          display: true,
          text: 'Calories',
          color: theme.colors.secondary
        },
        grid: {
          display: false
        },
        position: 'right',
        border: {
          color: theme.colors.secondary
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: theme.colors.background,
        titleColor: theme.colors.primary,
        bodyColor: theme.colors.text.primary,
        borderColor: theme.colors.secondary,
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          title: (tooltipItems) => {
            return `Date: ${tooltipItems[0].label}`;
          }
        }
      },
    },
  };

  const chartData = prepareChartData();

  const handleExport = () => {
    // Show loading indicator or disable button while exporting
    // to ensure chart has time to fully render
    setTimeout(async () => {
      try {
        const summary = {
          dateRange: { startDate, endDate },
          entries: filteredEntries,
          averageWeight: calculateAverageWeight(filteredEntries),
          totalCalories: calculateTotalCalories(filteredEntries),
          entryCount: filteredEntries.length,
          chartRef: chartRef
        };
        
        await exportToPdf(summary);
      } catch (error) {
        console.error("Error exporting PDF:", error);
      }
    }, 300); // Longer timeout to ensure chart is fully rendered
  };

  return (
    <ExportPageContainer>
      <PageTitle>Export Your Data</PageTitle>
      
      <ExportSection>
        <SectionTitle>
          <FaCalendarAlt /> Select Date Range
        </SectionTitle>
        
        <DateRangeContainer>
          <DateInputGroup>
            <DateLabel htmlFor="start-date">Start Date</DateLabel>
            <DateInput 
              id="start-date"
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
            />
          </DateInputGroup>
          
          <DateInputGroup>
            <DateLabel htmlFor="end-date">End Date</DateLabel>
            <DateInput 
              id="end-date"
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={new Date().toISOString().split('T')[0]}
            />
          </DateInputGroup>
        </DateRangeContainer>
        
        <DataPreviewContainer>
          <SectionTitle>Data Preview</SectionTitle>
          <DataItem>
            <DataLabel>Date Range:</DataLabel>
            {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
          </DataItem>
          <DataItem>
            <DataLabel>Entries:</DataLabel>
            {filteredEntries.length}
          </DataItem>
          <DataItem>
            <DataLabel>Average Weight:</DataLabel>
            {calculateAverageWeight(filteredEntries)} lbs
          </DataItem>
          <DataItem>
            <DataLabel>Total Calories Burned:</DataLabel>
            {calculateTotalCalories(filteredEntries)} kcal
          </DataItem>
        </DataPreviewContainer>

        <ChartContainer>
          <ChartTitle>
            <FaChartLine /> Progress Chart
          </ChartTitle>
          {chartData ? (
            <Line 
              ref={chartRef}
              data={chartData} 
              options={chartOptions}
              redraw={false}
              id="health-tracker-chart"
            />
          ) : (
            <NoDataMessage>No data available for the selected date range</NoDataMessage>
          )}
        </ChartContainer>
        
        <ExportButton 
          onClick={handleExport} 
          title="Generate a PDF report with your data and chart visualization"
        >
          <FaFileExport /> Export as PDF
        </ExportButton>
      </ExportSection>
    </ExportPageContainer>
  );
};

export default ExportPage;