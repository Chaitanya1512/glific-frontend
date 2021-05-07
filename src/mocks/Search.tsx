import { CREATE_SEARCH } from '../graphql/mutations/Search';
import {
  SEARCH_LIST_QUERY,
  SEARCH_QUERY_COUNT,
  GET_SEARCH,
  SEARCH_MULTI_QUERY,
} from '../graphql/queries/Search';
import { COLLECTION_COUNT_SUBSCRIPTION } from '../graphql/subscriptions/PeriodicInfo';
import { MARK_AS_READ } from '../graphql/mutations/Chat';

export const createSearchQuery = {
  request: {
    query: CREATE_SEARCH,
    variables: {
      input: {
        label: 'new search description',
        shortcode: 'new search',
        args:
          '{"messageOpts":{"offset":0,"limit":10},"filter":{"term":"","includeTags":["10"]},"contactOpts":{"offset":0,"limit":20}}',
      },
    },
  },
  result: {
    data: {
      createSavedSearch: {
        errors: null,
        savedSearch: {
          args:
            '{"messageOpts":{"offset":0,"limit":10},"filter":{"term":"","includeTags":["10"]},"contactOpts":{"offset":0,"limit":20}}',
          id: '11',
          label: 'new search description',
          shortcode: 'new search',
        },
      },
    },
  },
};

export const countSearchesQuery = {
  request: {
    query: SEARCH_QUERY_COUNT,
    variables: {
      filter: {},
    },
  },
  result: {
    data: {
      countTags: 1,
    },
  },
};

const searchListQuery = (QUERY: any, filter: any, limit: number, offset: number, order: string) => {
  return {
    query: QUERY,
    variables: {
      filter: filter,
      opts: {
        limit: limit,
        offset: offset,
        order: order,
      },
    },
  };
};

export const getSearchesQuery = [
  {
    request: searchListQuery(SEARCH_LIST_QUERY, {}, 10, 0, 'ASC'),
    result: {
      data: {
        savedSearches: [
          {
            args:
              '{"messageOpts":{"offset":0,"limit":10},"filter":{"term":"","includeTags":["10"]},"contactOpts":{"offset":0,"limit":20}}',
            id: '8',
            label: 'Test search',
            shortcode: 'Save Search',
          },
        ],
      },
    },
  },
  {
    request: searchListQuery(SEARCH_LIST_QUERY, {}, 100, 0, 'ASC'),
    result: {
      data: {
        savedSearches: [
          {
            args:
              '{"messageOpts":{"offset":0,"limit":10},"filter":{"term":"","includeTags":["10"]},"contactOpts":{"offset":0,"limit":20}}',
            id: '8',
            label: 'Test search',
            shortcode: 'Save Search',
          },
        ],
      },
    },
  },
];

export const getSearch = {
  request: {
    query: GET_SEARCH,
    variables: {
      id: 1,
    },
  },
  result: {
    data: {
      savedSearch: {
        savedSearch: {
          args:
            '{"messageOpts":{"offset":0,"limit":10},"filter":{"term":"","includeTags":["10"]},"contactOpts":{"offset":0,"limit":20}}',
          id: '1',
          label: 'Test search',
          shortcode: 'Save Search collection',
        },
      },
    },
  },
};

export const collectionCountSubscription = {
  request: {
    query: COLLECTION_COUNT_SUBSCRIPTION,
    variables: { organizationId: '1' },
  },
  result: {
    data: {
      collectionCount: `{"collection":{"Unread":5}}`,
    },
  },
};

const contactsMock = new Array(25).fill(null).map((val: any, index: number) => ({
  id: `${index}`,
  name: `Test ${index}`,
  phone: '448-917-4013',
  maskedPhone: '448-******13',
  lastMessageAt: '2021-05-03T04:56:50Z',
  status: 'VALID',
  bspStatus: 'SESSION_AND_HSM',
  isOrgRead: false,
  tags: [],
}));

export const searchContactCollection = [
  {
    request: {
      query: SEARCH_MULTI_QUERY,
      variables: {
        contactOpts: { limit: 25, order: 'DESC' },
        searchFilter: { term: 'III' },
        messageOpts: { limit: 20, offset: 0, order: 'ASC' },
      },
    },
    result: {
      data: {
        searchMulti: {
          contacts: [
            {
              id: '216',
              name: 'Jolie Abshire III',
              phone: '448-917-4013',
              maskedPhone: '448-******13',
              lastMessageAt: '2021-05-03T04:56:50Z',
              status: 'VALID',
              bspStatus: 'SESSION_AND_HSM',
              isOrgRead: false,
              tags: [],
            },
            {
              id: '219',
              name: 'Mrs. Sallie Gulgowski III',
              phone: '684/339-2229',
              maskedPhone: '684/******29',
              lastMessageAt: '2021-05-03T04:56:50Z',
              status: 'VALID',
              bspStatus: 'SESSION_AND_HSM',
              isOrgRead: true,
              tags: [],
            },
            {
              id: '163',
              name: 'Mrs. Abner Fay III',
              phone: '438.243.7969',
              maskedPhone: '438.******69',
              lastMessageAt: '2021-05-03T04:56:51Z',
              status: 'VALID',
              bspStatus: 'SESSION_AND_HSM',
              isOrgRead: false,
              tags: [],
            },
            {
              id: '221',
              name: 'Emil Turner III',
              phone: '430/265-5025',
              maskedPhone: '430/******25',
              lastMessageAt: '2021-05-03T04:56:51Z',
              status: 'VALID',
              bspStatus: 'SESSION_AND_HSM',
              isOrgRead: false,
              tags: [],
            },
            {
              id: '168',
              name: 'Miss Roslyn Eichmann III',
              phone: '4687383633',
              maskedPhone: '4687******33',
              lastMessageAt: '2021-05-03T04:56:51Z',
              status: 'VALID',
              bspStatus: 'SESSION_AND_HSM',
              isOrgRead: false,
              tags: [],
            },
            {
              id: '106',
              name: 'Dr. Lisa Rodriguez III',
              phone: '513.724.7478',
              maskedPhone: '513.******78',
              lastMessageAt: '2021-05-03T04:56:50Z',
              status: 'VALID',
              bspStatus: 'SESSION_AND_HSM',
              isOrgRead: true,
              tags: [],
            },
            {
              id: '89',
              name: 'Mrs. Pamela Smitham III',
              phone: '627.646.4660',
              maskedPhone: '627.******60',
              lastMessageAt: '2021-05-03T04:56:50Z',
              status: 'VALID',
              bspStatus: 'SESSION_AND_HSM',
              isOrgRead: false,
              tags: [],
            },
            ...contactsMock,
          ],
          messages: [
            {
              id: '23237',
              body: 'Please check this\n',
              messageNumber: 2,
              insertedAt: '2021-05-05T05:40:02.434957Z',
              contact: {
                id: '1',
                name: 'Test',
                phone: '+919090909090',
                maskedPhone: '9090******90',
                lastMessageAt: '2021-05-03T04:56:38Z',
                status: 'VALID',
                bspStatus: 'NONE',
              },
              receiver: {
                id: '1',
              },
              sender: {
                id: '1',
              },
              tags: [],
              type: 'TEXT',
              media: null,
              contextMessage: null,
            },
          ],
          tags: [
            {
              id: '28',
              body: 'So wise so young, they say, do never live long.',
              messageNumber: 3,
              insertedAt: '2021-04-17T06:20:08.385901Z',
              contact: {
                id: '14',
                name: 'NGO Admin',
                phone: '911234567890',
                maskedPhone: '9112******90',
                lastMessageAt: '2021-05-03T04:56:50Z',
                status: 'VALID',
                bspStatus: 'NONE',
              },
              receiver: {
                id: '1',
              },
              sender: {
                id: '14',
              },
              tags: [
                {
                  id: '19',
                  label: 'This is for testing',
                  colorCode: '#0C976D',
                },
              ],
              type: 'TEXT',
              media: null,
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: MARK_AS_READ,
      variables: { contactId: '216' },
    },
    result: {
      data: {
        markContactMessagesAsRead: '216',
      },
    },
  },
];
