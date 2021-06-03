import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { Organisation } from './Organisation';
import { MockedProvider } from '@apollo/client/testing';
import { LIST_ITEM_MOCKS } from '../SettingList.test.helper';
import { BrowserRouter as Router } from 'react-router-dom';

const mocks = LIST_ITEM_MOCKS;

const wrapper = (
  <MockedProvider mocks={mocks} addTypename={false}>
    <Router>
      <Organisation />
    </Router>
  </MockedProvider>
);

test('renders component properly', async () => {
  const { getByText } = render(wrapper);
  // loading is show initially
  expect(getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => {
    expect(getByText('Back to settings')).toBeInTheDocument();
  });
});

test('SAVE component properly', async () => {
  const { getByText } = render(wrapper);
  // loading is show initially
  expect(getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => {
    const saveButton = screen.getByText('Save');
    UserEvent.click(saveButton);
  });
});

test('Click on Cancel', async () => {
  const { getByText } = render(wrapper);
  // loading is show initially
  expect(getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => {
    const Button = screen.getByText('Cancel');
    expect(Button).toBeInTheDocument();
    // click on Cancel
    UserEvent.click(Button);
  });
});

test('Checked Hours of operations', async () => {
  const { getByText } = render(wrapper);
  // loading is show initially
  expect(getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    const checkbox = screen.getAllByRole('checkbox');
    fireEvent.change(checkbox[0], { target: { value: 'true' } });
    expect(checkbox[0].value).toBe('true');
  });
});

test('Checked phone number', async () => {
  const { getByText, getByTestId } = render(wrapper);
  // loading is show initially
  expect(getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    const phoneNumber = getByTestId('phoneNumber');
    fireEvent.click(phoneNumber);
    expect(phoneNumber).toBeInTheDocument();
  });
});

test('Submit form', async () => {
  const { container, getByText, getByTestId } = render(wrapper);
  // loading is show initially
  expect(getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    const input: any = container.querySelector('input[type="text"]');
    fireEvent.change(input, { target: { value: '' } });
    const submit = getByTestId('submitActionButton');
    fireEvent.click(submit);
  });
});
