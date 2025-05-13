import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';
import { FaFileExport } from 'react-icons/fa';

const StyledExportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.compact ? '0.3rem' : theme.spacing.xs};
  padding: ${props => props.compact 
    ? `${theme.spacing.xs} ${theme.spacing.sm}` 
    : `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  font-weight: 600;
  transition: ${theme.transitions.default};
  font-size: ${props => props.compact ? theme.typography.small.fontSize : 'inherit'};
  
  &:hover {
    background-color: ${theme.colors.primary}e0;
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.small};
  }
  
  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${theme.colors.secondary}80;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 430px) {
    width: ${props => props.fullWidthOnMobile ? '100%' : 'auto'};
  }
`;

const ExportButton = ({ 
  onClick, 
  children, 
  compact = false, 
  fullWidthOnMobile = false,
  disabled = false,
  ...rest 
}) => {
  return (
    <StyledExportButton 
      onClick={onClick} 
      compact={compact} 
      fullWidthOnMobile={fullWidthOnMobile}
      disabled={disabled}
      {...rest}
    >
      <FaFileExport />
      {children || 'Export'}
    </StyledExportButton>
  );
};

export default ExportButton;