import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  @media (max-width: 430px) {
    html {
      font-size: 14px;
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    max-width: 100vw;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.sm};
  }

  h1 {
    font-size: ${theme.typography.h1.fontSize};
    font-weight: ${theme.typography.h1.fontWeight};
  }

  h2 {
    font-size: ${theme.typography.h2.fontSize};
    font-weight: ${theme.typography.h2.fontWeight};
  }

  h3 {
    font-size: ${theme.typography.h3.fontSize};
    font-weight: ${theme.typography.h3.fontWeight};
  }

  p {
    font-size: ${theme.typography.body.fontSize};
    margin-bottom: ${theme.spacing.sm};
  }

  button {
    cursor: pointer;
    font-family: inherit;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  input, button, textarea, select {
    font: inherit;
    max-width: 100%;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.default};
    -webkit-tap-highlight-color: transparent;

    &:hover {
      color: ${theme.colors.secondary};
    }
  }

  img, svg {
    max-width: 100%;
    height: auto;
  }
  
  /* Container for page content with responsive padding */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: ${theme.spacing.md};
  }
  
  @media (max-width: 430px) {
    .container {
      padding: ${theme.spacing.sm};
    }
  }
`;

export default GlobalStyle; 