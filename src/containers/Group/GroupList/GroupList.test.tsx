import React from 'react';
import { render, screen, wait, fireEvent } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { setUserRole } from '../../../context/role';
import { GroupList } from './GroupList';
import { countGroupQuery, filterGroupQuery, getGroupContactsQuery } from '../../../mocks/Group';
import { MemoryRouter } from 'react-router';
import { getContactsQuery } from '../../../mocks/Contact';

const mocks = [
  countGroupQuery,
  filterGroupQuery,
  filterGroupQuery,
  getGroupContactsQuery,
  getContactsQuery,
];

const wrapper = (
  <MemoryRouter>
    <MockedProvider mocks={mocks} addTypename={false}>
      <GroupList />
    </MockedProvider>
  </MemoryRouter>
);

describe('<GroupList />', () => {
  test('should render GroupList', async () => {
    const { getByText } = render(wrapper);

    // loading is show initially
    expect(getByText('Loading...')).toBeInTheDocument();

    await wait();
    expect(getByText('Groups')).toBeInTheDocument();

    // TODO: test automation

    // TODO: test delete
  });

  test('it should have add contact to group dialog box ', async () => {
    setUserRole(['Admin']);
    const { getByText, getAllByTestId } = render(wrapper);

    // loading is show initially
    expect(getByText('Loading...')).toBeInTheDocument();
    await wait();
    await wait();
    expect(getAllByTestId('additionalButton')[0]).toBeInTheDocument();
    fireEvent.click(getAllByTestId('additionalButton')[0]);

    await wait();

    expect(getByText('Add contacts to the group')).toBeInTheDocument();
  });

  test('it should have send message dialog box ', async () => {
    setUserRole(['Admin']);
    const { getByText, getAllByTestId, getByTestId } = render(wrapper);

    // loading is show initially
    expect(getByText('Loading...')).toBeInTheDocument();
    await wait();

    expect(getByText('Send a message')).toBeInTheDocument();
    fireEvent.click(getAllByTestId('MenuItem')[0]);

    expect(getByText('Send message to group')).toBeInTheDocument();
  });
});
