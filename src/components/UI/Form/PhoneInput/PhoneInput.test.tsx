import React from 'react';
import { render } from '@testing-library/react';
import { PhoneInput } from './PhoneInput';

describe('<PhoneInput />', () => {
  const props = {
    helperText: 'Your helper text',
    field: { name: 'example', value: '' },
    placeholder: 'Your phone number',
    form: { errors: false, setFieldValue: null },
  };
  const phoneInput = () => <PhoneInput {...props} />;

  test('It should render', () => {
    const { getByTestId } = render(phoneInput());
    expect(getByTestId('phoneInput')).toBeInTheDocument();
  });
});
