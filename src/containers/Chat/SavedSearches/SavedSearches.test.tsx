import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import SavedSearches from './SavedSearches';
import { MockedProvider } from '@apollo/client/testing';
import { savedSearchQuery, savedSearchQueryError } from '../../../mocks/Chat';
import { setUserSession } from '../../../services/AuthService';

const SavedSearch = (
  <MockedProvider mocks={[savedSearchQuery]}>
    <SavedSearches />
  </MockedProvider>
);

describe('<SavedSearches />', () => {
  test('it should mount', async () => {
    const { getByText, getByTestId } = render(SavedSearch);
    setUserSession(JSON.stringify({ organization: { id: '1' }, roles: ['Admin'] }));

    // loading is show initially
    expect(getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      const savedSearches = getByTestId('SavedSearches');

      expect(savedSearches).toBeInTheDocument();
    });
  });

  test('click on search input', async () => {
    const { getByTestId, getByText } = render(SavedSearch);

    await waitFor(() => {
      const input = getByTestId('AutocompleteInput');
      fireEvent.click(input);
    });

    await waitFor(() => {
      const selectOption = getByText('test');
      fireEvent.click(selectOption);
    });
  });

  test('type on search input', async () => {
    const { container, getByTestId } = render(SavedSearch);

    await waitFor(() => {
      const autocompleteInput = getByTestId('AutocompleteInput');
      fireEvent.click(autocompleteInput);
      const input = container.querySelector('input[type="text"]');
      UserEvent.type(input, null);
    });
  });

  test('check if savedSearch query return error', async () => {
    const SavedSearch = (
      <MockedProvider mocks={[savedSearchQueryError]}>
        <SavedSearches />
      </MockedProvider>
    );
    const { getByText } = render(SavedSearch);

    await waitFor(() => {
      getByText('Error :(');
    });
  });
});
