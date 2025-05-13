import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  font-size: ${theme.typography.body.fontSize};
  border: 1px solid ${theme.colors.secondary};
  border-radius: ${theme.borderRadius.small};
  background-color: ${theme.colors.white};
  color: ${theme.colors.primary};
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const NumpadOverlay = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${theme.colors.white};
  padding: ${theme.spacing.md};
  border-top-left-radius: ${theme.borderRadius.large};
  border-top-right-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.large};
  z-index: 1000;
  transform: translateY(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
`;

const NumpadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.sm};
  max-width: 300px;
  margin: 0 auto;
`;

const NumpadButton = styled.button`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.secondary}40;
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md};
  font-size: 1.5rem;
  color: ${theme.colors.primary};
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:active {
    background-color: ${theme.colors.secondary}20;
  }
`;

const ActionButton = styled(NumpadButton)`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: 1.2rem;
  
  &:active {
    background-color: ${theme.colors.primary}90;
  }
`;

const NumpadInput = ({ value, onChange, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  const handleNumberClick = (num) => {
    setInputValue(prev => prev + num);
  };

  const handleDelete = () => {
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleDone = () => {
    onChange(inputValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setInputValue(value || '');
    setIsOpen(false);
  };

  return (
    <InputContainer>
      <StyledInput
        value={value || ''}
        placeholder={placeholder}
        readOnly
        onClick={() => setIsOpen(true)}
      />
      <NumpadOverlay isOpen={isOpen}>
        <NumpadGrid>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <NumpadButton key={num} onClick={() => handleNumberClick(num.toString())}>
              {num}
            </NumpadButton>
          ))}
          <NumpadButton onClick={() => handleNumberClick('.')}>.</NumpadButton>
          <NumpadButton onClick={() => handleNumberClick('0')}>0</NumpadButton>
          <NumpadButton onClick={handleDelete}>⌫</NumpadButton>
        </NumpadGrid>
        <NumpadGrid style={{ marginTop: theme.spacing.sm }}>
          <ActionButton onClick={handleCancel}>Cancel</ActionButton>
          <ActionButton onClick={handleDone} style={{ gridColumn: 'span 2' }}>Done</ActionButton>
        </NumpadGrid>
      </NumpadOverlay>
    </InputContainer>
  );
};

export default NumpadInput; 