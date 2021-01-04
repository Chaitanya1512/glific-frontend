import { setVariables } from '../common/constants';
import { FILTER_TEMPLATES, GET_TEMPLATES_COUNT } from '../graphql/queries/Template';

export const filterTemplatesQuery = (term: any, data: any) => {
  return {
    request: {
      query: FILTER_TEMPLATES,
      variables: setVariables({ term: term }),
    },
    result: {
      data: {
        sessionTemplates: data,
      },
    },
  };
};

export const TEMPLATE_MOCKS = [
  filterTemplatesQuery('', [
    {
      id: '87',
      label: 'Good message',
      body: 'Hey there',
      shortcode: 'test',
      isReserved: true,
      status: null,
      isHsm: true,
      updatedAt: '2020-12-01T18:00:32Z',
      translations: '{}',
      type: 'TEXT',
      language: {
        id: '1',
        label: 'Hindi',
      },
      MessageMedia: {
        id: 1,
        caption: 'Test',
        sourceUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
      },
    },
    {
      id: '94',
      label: 'Message',
      body: 'some description',
      shortcode: 'test',
      isReserved: true,
      isHsm: false,
      status: null,
      updatedAt: '2020-12-01T18:00:32Z',
      translations: '{}',
      type: 'TEXT',
      language: {
        id: '1',
        label: 'Hindi',
      },
      MessageMedia: {
        id: 1,
        caption: 'Test',
        sourceUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
      },
    },
  ]),
  filterTemplatesQuery('', [
    {
      id: '87',
      label: 'Good message',
      body: 'Hey there',
      shortcode: 'test',
      isReserved: true,
      isHsm: true,
      status: null,
      updatedAt: '2020-12-01T18:00:32Z',
      translations: '{}',
      type: 'TEXT',
      language: {
        id: '1',
        label: 'Hindi',
      },
      MessageMedia: {
        id: 1,
        caption: 'Test',
        sourceUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
      },
    },
    {
      id: '94',
      label: 'Message',
      body: 'some description',
      shortcode: 'test',
      isReserved: true,
      isHsm: false,
      status: null,
      updatedAt: '2020-12-01T18:00:32Z',
      translations: '{}',
      type: 'TEXT',
      language: {
        id: '1',
        label: 'Hindi',
      },
      MessageMedia: {
        id: 1,
        caption: 'Test',
        sourceUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
      },
    },
  ]),

  filterTemplatesQuery('this should not return anything', []),
  filterTemplatesQuery('hi', [
    {
      id: '87',
      label: 'Good message',
      body: 'hi can you help!',
      shortcode: 'test',
      isReserved: true,
      isHsm: true,
      status: null,
      updatedAt: '2020-12-01T18:00:32Z',
      translations: '{}',
      type: 'TEXT',
      language: {
        id: '1',
        label: 'Hindi',
      },
      MessageMedia: {
        id: 1,
        caption: 'Test',
        sourceUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
      },
    },
  ]),
];

export const templateCountQuery = (isHsm: boolean, count: number = 3) => {
  return {
    request: {
      query: GET_TEMPLATES_COUNT,
      variables: {
        filter: {
          label: '',
          isHsm: isHsm,
        },
      },
    },
    result: {
      data: {
        countSessionTemplates: count,
      },
    },
  };
};

export const getHSMTemplateCountQuery = templateCountQuery(true);

export const getTemplateCountQuery = templateCountQuery(false);
