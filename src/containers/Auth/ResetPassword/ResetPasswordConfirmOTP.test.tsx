import { render, screen, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import axios from 'axios';

import { ResetPasswordConfirmOTP } from './ResetPasswordConfirmOTP';

const defaultProps = { location: { state: { phoneNumber: '918787654567' } } };

jest.mock('axios');
const wrapper = (
  <MemoryRouter>
    <ResetPasswordConfirmOTP {...defaultProps} />
  </MemoryRouter>
);

describe('<ResetPasswordConfirmOTP />', () => {
  test('it should render', async () => {
    const { findByTestId } = render(wrapper);

    const resetPassword = await findByTestId('AuthContainer');
    expect(resetPassword).toHaveTextContent('Reset your password');
    expect(resetPassword).toHaveTextContent('New Password');
  });

  test('it should submit the form correctly', async () => {
    const { container } = render(wrapper);
    const inputElements = screen.getAllByRole('textbox');
    UserEvent.type(inputElements[1], '76554');

    const password = container.querySelector('input[type="password"]');
    UserEvent.type(password, 'pass123456');

    // click on save button
    const saveButton = screen.getByText('Save');
    UserEvent.click(saveButton);

    // let's mock successful reset password
    const responseData = { data: { data: { data: {} } } };
    axios.post.mockImplementationOnce(() => Promise.resolve(responseData));

    //need to have an assertion here
    await waitFor(() => {});
  });

  it('test successful resend functionality', async () => {
    render(wrapper);

    // set the mock
    const responseData = {
      data: { message: 'OTP sent successfully to 919967665667', phone: '919967665667' },
    };
    axios.post.mockImplementationOnce(() => Promise.resolve(responseData));

    // click on resend button
    await waitFor(() => {
      const resendButton = screen.getByTestId('resendOtp');
      UserEvent.click(resendButton);
    });
  });
});
