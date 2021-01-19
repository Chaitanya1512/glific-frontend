import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, waitFor, fireEvent, cleanup } from '@testing-library/react';
import ChatConversations from './ChatConversations';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { SEARCH_QUERY } from '../../../graphql/queries/Search';

const cache = new InMemoryCache({ addTypename: false });
cache.writeQuery({
  query: SEARCH_QUERY,
  variables: {
    filter: {},
    messageOpts: { limit: 50 },
    contactOpts: { limit: 50 },
  },
  data: {
    search: [
      {
        group: null,
        contact: {
          id: '2',
          name: 'Effie Cormier',
          phone: '987654321',
          maskedPhone: '98****321',
          lastMessageAt: '2020-06-29T09:31:47Z',
          status: 'VALID',
          bspStatus: 'SESSION_AND_HSM',
        },
        messages: [
          {
            id: '1',
            body: 'Hey there whats up?',
            insertedAt: '2020-06-25T13:36:43Z',
            location: null,
            receiver: {
              id: '1',
            },
            sender: {
              id: '2',
            },
            tags: [
              {
                id: '1',
                label: 'important',
                colorCode: '#00d084',
              },
            ],
            type: 'TEXT',
            media: null,
          },
        ],
      },
    ],
  },
});

const client = new ApolloClient({
  cache: cache,
  assumeImmutableResults: true,
});


afterEach(cleanup);
const chatConversation = (
  <ApolloProvider client={client}>
    <Router>
      <ChatConversations
        contactId={2}
        simulator={{ simulatorId: '1', setShowSimulator: jest.fn() }}
      />
    </Router>
  </ApolloProvider>
);

test('it should render <ChatConversations /> component correctly', async () => {
  const { container } = render(chatConversation);
  await waitFor(() => {
    expect(container).toBeInTheDocument();
  });
});

test('it should filter contacts based on search', async () => {
  const { getByTestId } = render(chatConversation);
  await waitFor(() => {
    fireEvent.change(getByTestId('searchInput').querySelector('input'), { target: { value: 'a' } });
  });
  fireEvent.submit(getByTestId('searchForm'));
});

// Checking if these tests checks anything

// test('it should reset input on clicking cross icon', async () => {
//   const { getByTestId, getByText } = render(chatConversation);
//   await waitFor(() => {
//     fireEvent.change(getByTestId('searchInput').querySelector('input'), { target: { value: 'a' } });
//   });
//   const resetButton = getByTestId('resetButton');
//   fireEvent.click(resetButton);

//   await waitFor(() => {
//     expect(getByText('Red Sparrow')).toBeInTheDocument();
//   });
// });

// test('it should load all contacts with unread tag', async () => {
//   const { getAllByTestId, getByText } = render(chatConversation);
//   await wait();
//   fireEvent.click(getAllByTestId('savedSearchDiv')[0]);
//   await wait();
//   await wait();
//   expect(getByText('You do not have any conversations.')).toBeInTheDocument();
// });
