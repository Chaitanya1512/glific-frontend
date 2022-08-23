import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';

import {
  getUnFitleredNotificationCountQuery,
  getFilteredNotificationsQuery,
  getNotificationsQuery,
  getCountWithFilter,
  getCountWithEmptyFilter,
  markAllNotificationAsRead,
  getInfoNotificationsQuery,
} from 'mocks/Notifications';
import { setUserSession } from 'services/AuthService';
import { NotificationList } from './NotificationList';

setUserSession(JSON.stringify({ roles: ['Admin'] }));

const mocks: any = [
  getUnFitleredNotificationCountQuery,
  getNotificationsQuery,
  getUnFitleredNotificationCountQuery,
  getCountWithFilter,
  getCountWithEmptyFilter,
  markAllNotificationAsRead,
  getFilteredNotificationsQuery,
  getInfoNotificationsQuery,
];

const notifications = (
  <MockedProvider mocks={mocks} addTypename={false}>
    <Router>
      <NotificationList />
    </Router>
  </MockedProvider>
);

test('It should load notifications', async () => {
  const { getByText } = render(notifications);

  expect(getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {});
  await waitFor(() => {});

  await waitFor(() => {
    expect(getByText('Notifications')).toBeInTheDocument();
  });

  const time = await screen.findByText('TIMESTAMP');
  const category = await screen.findByText('CATEGORY');
  const severity = await screen.findByText('SEVERITY');
  const entity = await screen.findByText('ENTITY');
  const message = await screen.findByText('MESSAGE');

  expect(time).toBeInTheDocument();
  expect(category).toBeInTheDocument();
  expect(severity).toBeInTheDocument();
  expect(entity).toBeInTheDocument();
  expect(message).toBeInTheDocument();
});

test('click on forward arrrow', async () => {
  render(notifications);
  await waitFor(() => {
    const arrow = screen.getAllByTestId('tooltip');
    fireEvent.click(arrow[0]);
  });
});

test('it should show copy text and view option on clicking entity ', async () => {
  const { getByTestId, getByText } = render(notifications);
  await waitFor(() => {
    const entityMenu = screen.getByTestId('NotificationRowMenu');
    expect(entityMenu).toBeInTheDocument();

    fireEvent.click(entityMenu);
    const viewButton = screen.getAllByTestId('MenuItem');

    // copy text option
    expect(viewButton[0]).toBeInTheDocument();
    fireEvent.click(viewButton[0]);

    // view option
    expect(viewButton[1]).toBeInTheDocument();
    fireEvent.click(viewButton[1]);
  });

  await waitFor(() => {
    expect(getByTestId('copyToClipboard')).toBeInTheDocument();
    // after clicking on view it should show copy text option
    const copyText = getByTestId('copyToClipboard');
    fireEvent.click(copyText);
    // after view it should show Done button
    const doneButton = getByText('Done');
    fireEvent.click(doneButton);
  });
});

test('it should show filter checkboxes', async () => {
  render(notifications);

  await waitFor(() => {
    const checkboxInput = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxInput[0]);
  });
});

test('it should have Info checkbox', async () => {
  render(notifications);

  await waitFor(() => {
    const infoCheckbox = screen.getByRole('checkbox', { name: 'Info' });
    expect(infoCheckbox).toBeInTheDocument();
  });
});

test('Info checkbox should fetch only notifications with severity Info', async () => {
  render(notifications);

  // await waitFor(() => {
  //   const infoCheckbox: HTMLInputElement = screen.getByRole('checkbox', { name: 'Info' });
  //   const criticalCheckbox: HTMLInputElement = screen.getByRole('checkbox', { name: 'Critical' });
  //   // fireEvent.click(infoCheckbox);
  //   // fireEvent.click(criticalCheckbox);
  //   console.log('🚀 ~ infoCheckbox', infoCheckbox.checked);
  //   console.log('🚀 ~ criticalCheckbox', criticalCheckbox.checked);
  //   const notificationslist = screen.getAllByText('Critical');
  //   console.log('🚀 ~ notificationslist', notificationslist);
  //   expect(infoCheckbox).toBeInTheDocument();
  // });

  const infoCheckbox: HTMLInputElement = await screen.findByRole('checkbox', { name: 'Info' });
  // const infoCheckbox: HTMLInputElement = await screen.findByLabelText('checkbox');
  const criticalCheckbox: HTMLInputElement = await screen.findByRole('checkbox', {
    name: 'Critical',
  });
  console.log('🚀 ~ infoCheckbox', infoCheckbox.checked);
  console.log('🚀 ~ criticalCheckbox', criticalCheckbox.checked);
  fireEvent.click(infoCheckbox);
  await waitFor(() => {
    console.log('🚀 ~ infoCheckbox', infoCheckbox.checked);
    console.log('🚀 ~ criticalCheckbox', criticalCheckbox.checked);
  });
});
