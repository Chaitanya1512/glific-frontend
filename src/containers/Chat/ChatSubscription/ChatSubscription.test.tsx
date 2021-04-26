import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { ChatSubscription } from './ChatSubscription';
import { setUserSession } from '../../../services/AuthService';
import { CONVERSATION_MOCKS } from '../../../mocks/Chat';
import { InMemoryCache, ApolloClient, ApolloProvider } from '@apollo/client';
import { DEFAULT_CONTACT_LIMIT, DEFAULT_MESSAGE_LIMIT } from '../../../common/constants';
import { SEARCH_QUERY } from '../../../graphql/queries/Search';

const mocks: any = CONVERSATION_MOCKS;

setUserSession(JSON.stringify({ roles: ['Admin'], organization: { id: '1' } }));

describe('<ChatSubscription />', () => {
  afterEach(cleanup);

  test('it should render <ChatSubscription /> component correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatSubscription setDataLoaded={jest.fn()} setLoading={jest.fn()} />
      </MockedProvider>
    );

    // there is nothing to assert here just waiting for all the mock calls working
    await waitFor(() => {});
    await waitFor(() => {});
  });
});

const body = {
  id: '1',
  body: 'Hey there whats up?',
  insertedAt: '2020-06-25T13:36:43Z',
  location: null,
  messageNumber: 48,
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
  errors: '{}',
  contextMessage: {
    body: 'All good',
    contextId: 1,
    messageNumber: 10,
    errors: '{}',
    media: null,
    type: 'TEXT',
    insertedAt: '2021-04-26T06:13:03.832721Z',
    location: null,
    receiver: {
      id: '1',
    },
    sender: {
      id: '2',
      name: 'User',
    },
  },
};

const cache = new InMemoryCache({ addTypename: false });
export const searchQuery = {
  query: SEARCH_QUERY,
  variables: {
    filter: {},
    contactOpts: { limit: DEFAULT_CONTACT_LIMIT },
    messageOpts: { limit: DEFAULT_MESSAGE_LIMIT },
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
          isOrgRead: true,
        },
        messages: [body],
      },
    ],
  },
};

cache.writeQuery(searchQuery);

// add collection to apollo cache
cache.writeQuery({
  query: SEARCH_QUERY,
  variables: {
    filter: { searchGroup: true },
    contactOpts: { limit: DEFAULT_CONTACT_LIMIT },
    messageOpts: { limit: DEFAULT_MESSAGE_LIMIT },
  },
  data: {
    search: [
      {
        group: {
          id: '2',
          label: 'Default Group',
        },
        contact: null,
        messages: [
          {
            id: '1',
            body: 'Hey there whats up?',
            insertedAt: '2020-06-25T13:36:43Z',
            location: null,
            messageNumber: 48,
            receiver: {
              id: '1',
            },
            sender: {
              id: '1',
            },
            tags: null,
            type: 'TEXT',
            media: null,
            errors: '{}',
            contextMessage: {
              body: 'All good',
              contextId: 1,
              messageNumber: 10,
              errors: '{}',
              media: null,
              type: 'TEXT',
              insertedAt: '2021-04-26T06:13:03.832721Z',
              location: null,
              receiver: {
                id: '1',
              },
              sender: {
                id: '2',
                name: 'User',
              },
            },
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

describe('<ChatSubscription />', () => {
  test('it should render <ChatSubscription /> component correctly', async () => {
    render(
      <ApolloProvider client={client}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <ChatSubscription setDataLoaded={jest.fn()} setLoading={jest.fn()} />
        </MockedProvider>
      </ApolloProvider>
    );

    // there is nothing to assert here just waiting for all the mock calls working
    await waitFor(() => {});
    await waitFor(() => {});
  });
});
