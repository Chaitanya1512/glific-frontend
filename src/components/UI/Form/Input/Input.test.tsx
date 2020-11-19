import React from 'react';
import {render} from "@testing-library/react";
import { OutlinedInput, InputLabel } from '@material-ui/core';
import { Input } from './Input';

describe('<Input />', () => {
  const input = (
    <Input
      form={{ touched: false, errors: {} }}
      field={{ name: 'input', value: 'default' }}
      placeholder="Title"
    />
  );
  it('renders <Input /> component', () => {
    const {getByTestId}=render(input)
    expect(getByTestId('input')).toBeInTheDocument();
  });

  it('should have correct label', () => {
    const {getByTestId}=render(input)
    expect(getByTestId('inputLabel')).toHaveTextContent('Title');
  });

  it('should have an initial value', () => {
    const {getByDisplayValue}=render(input)
    expect(getByDisplayValue('default')).toBeInTheDocument()
  });
});
