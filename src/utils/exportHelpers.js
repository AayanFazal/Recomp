import { jsPDF } from 'jspdf';
import 'chart.js/auto';

/**
 * Captures a chart as an image for PDF export
 * @param {Object} chartRef - Reference to the chart component
 * @returns {Promise<string>} - Promise resolving to base64 image data
 */
const captureChart = (chartRef) => {
  return new Promise((resolve, reject) => {
    try {
      if (!chartRef || !chartRef.current) {
        reject(new Error('Chart reference is not available'));
        return;
      }
      
      // Get the chart canvas and convert to image
      const canvas = chartRef.current.canvas;
      if (!canvas) {
        reject(new Error('Canvas not found in chart reference'));
        return;
      }
      
      // Use high quality image for better PDF rendering
      const imageData = canvas.toDataURL('image/png', 1.0);
      resolve(imageData);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Exports health data as a PDF file with charts
 * @param {Object} summaryData - The data to export
 * @param {Object} summaryData.dateRange - Start and end dates
 * @param {Array} summaryData.entries - Array of health entries
 * @param {String} summaryData.averageWeight - Average weight over the period
 * @param {String} summaryData.totalCalories - Total calories burned over the period
 * @param {Number} summaryData.entryCount - Total number of entries
 * @param {Object} summaryData.chartRef - Reference to the chart component
 * @returns {Boolean} - Success status
 */
export const exportToPdf = async (summaryData) => {
  try {
    const { dateRange, entries, averageWeight, totalCalories, entryCount, chartRef } = summaryData;
    
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    
    // Add title
    pdf.setFontSize(18);
    pdf.setTextColor(36, 72, 85); // Primary color
    pdf.text('Health Tracker Report', pageWidth / 2, 20, { align: 'center' });
    
    // Add date range
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    const dateRangeText = `Date Range: ${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`;
    pdf.text(dateRangeText, pageWidth / 2, 30, { align: 'center' });
    
    // Add summary box
    pdf.setFillColor(251, 233, 208); // Background color
    pdf.setDrawColor(144, 174, 173); // Secondary color
    pdf.roundedRect(margin, 35, pageWidth - (margin * 2), 30, 3, 3, 'FD');
    
    // Add summary details
    pdf.setFontSize(10);
    pdf.setTextColor(36, 72, 85); // Primary color
    
    pdf.text(`Total Entries: ${entryCount}`, margin + 5, 45);
    pdf.text(`Average Weight: ${averageWeight} lbs`, margin + 5, 52);
    pdf.text(`Total Calories Burned: ${totalCalories} kcal`, margin + 5, 59);
    
    // Add chart if available
    try {
      if (chartRef) {
        // Add the chart title
        pdf.setFontSize(14);
        pdf.setTextColor(36, 72, 85);
        pdf.text('Progress Visualization', margin, 70);
        
        // Try to capture the chart
        const chartUrl = await captureChart(chartRef);
        
        // Add the chart image with better sizing and position
        pdf.addImage(chartUrl, 'PNG', margin, 75, pageWidth - (margin * 2), 80);
        
        // Add a border around the chart
        pdf.setDrawColor(144, 174, 173); // Secondary color
        pdf.rect(margin, 75, pageWidth - (margin * 2), 80, 'S');
      } else {
        throw new Error('Chart reference not available');
      }
    } catch (error) {
      console.error('Error adding chart to PDF:', error);
      
      // Add a message if chart rendering fails
      pdf.setFontSize(12);
      pdf.setTextColor(255, 0, 0);
      pdf.text('Chart could not be generated', pageWidth / 2, 115, { align: 'center' });
    }
    
    // Add entries table heading
    pdf.setFontSize(14);
    pdf.setTextColor(36, 72, 85);
    pdf.text('Data Entries', margin, 170);
    
    // Add entries table
    const tableHeaders = ['Date', 'Weight (lbs)', 'Total Calories', 'Cardio Cal', 'Weight Training Cal'];
    const tableData = entries.map(entry => [
      new Date(entry.date).toLocaleDateString(),
      entry.weight || '--',
      entry.totalCalories || '--',
      entry.cardioCalories || '--',
      entry.weightTrainingCalories || '--'
    ]);
    
    // Generate the table
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    
    // Calculate column widths for the table
    const colWidth = (pageWidth - (margin * 2)) / tableHeaders.length;
    
    // Draw table headers
    pdf.setFillColor(144, 174, 173); // Secondary color
    pdf.setTextColor(255, 255, 255);
    
    tableHeaders.forEach((header, i) => {
      pdf.rect(margin + (i * colWidth), 175, colWidth, 8, 'F');
      pdf.text(header, margin + (i * colWidth) + (colWidth / 2), 180, { align: 'center' });
    });
    
    // Draw table rows
    pdf.setTextColor(0, 0, 0);
    
    // Only show the first 20 entries to keep the PDF manageable
    const maxEntries = Math.min(tableData.length, 20);
    
    for (let i = 0; i < maxEntries; i++) {
      const row = tableData[i];
      const yPos = 185 + (i * 7);
      
      // Alternate row background for better readability
      if (i % 2 === 0) {
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, yPos - 3, pageWidth - (margin * 2), 7, 'F');
      }
      
      row.forEach((cell, j) => {
        pdf.text(String(cell), margin + (j * colWidth) + (colWidth / 2), yPos, { align: 'center' });
      });
    }
    
    // Add footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Health Tracker - Generated on ' + new Date().toLocaleString(), pageWidth / 2, 285, { align: 'center' });
    
    // If there are more entries than can be shown, add a note
    if (tableData.length > 20) {
      pdf.text(`Note: Showing 20 of ${tableData.length} entries.`, margin, 275);
    }
    
    // Save the PDF
    const fileName = `health_data_${dateRange.startDate}_to_${dateRange.endDate}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    alert('PDF export failed. Please try again.');
    return false;
  }
};

/**
 * Legacy function - kept for backward compatibility
 */
export const exportWeeklySummary = (summaryData) => {
  return exportToPdf(summaryData);
};