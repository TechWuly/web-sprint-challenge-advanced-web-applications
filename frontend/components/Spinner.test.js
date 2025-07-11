// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
// Import the Spinner component and testing utilities
import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './spinner'; 

describe('Spinner Component', () => {
  test('does not render when "on" is false', () => {
    const { container } = render(<Spinner on={false} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders spinner when "on" is true', () => {
    render(<Spinner on={true} />);
    
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    
    const rotatingDot = screen.getByText('.');
    expect(rotatingDot).toBeInTheDocument();
    
    const waitText = screen.getByText(/please wait/i);
    expect(waitText).toBeInTheDocument();
  });
});
