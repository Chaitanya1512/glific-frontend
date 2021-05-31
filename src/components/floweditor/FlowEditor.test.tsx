import React from 'react';
import { FlowEditor } from './FlowEditor';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor, fireEvent } from '@testing-library/react';
import {
  getActiveFlow,
  getInactiveFlow,
  getFlowWithoutKeyword,
  getOrganisationServicesQuery,
  publishFlow,
} from '../../mocks/Flow';
import { conversationQuery } from '../../mocks/Chat';
import {
  simulatorGetQuery,
  simulatorReleaseQuery,
  simulatorReleaseSubscription,
} from '../../mocks/Simulator';

const mocks = [
  conversationQuery,
  simulatorReleaseSubscription,
  simulatorReleaseQuery,
  simulatorGetQuery,
  publishFlow,
  getOrganisationServicesQuery,
];

const activeFlowMocks = [...mocks, getActiveFlow];
const inActiveFlowMocks = [...mocks, getInactiveFlow];
const noKeywordMocks = [...mocks, getFlowWithoutKeyword];

const wrapperFunction = (mocks: any) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <MemoryRouter>
      <FlowEditor match={{ params: { uuid: 'b050c652-65b5-4ccf-b62b-1e8b3f328676' } }} />
    </MemoryRouter>
  </MockedProvider>
);

window.showFlowEditor = (node: any, config: any) => jest.fn();

const defaultWrapper = wrapperFunction(activeFlowMocks);

test('it should display the flowEditor', async () => {
  const { container } = render(defaultWrapper);
  await waitFor(() => {
    expect(container.querySelector('#flow')).toBeInTheDocument();
  });
});

test('it should have a done button that redirects to flow page', async () => {
  const { getByTestId } = render(defaultWrapper);
  await waitFor(() => {
    expect(getByTestId('button')).toBeInTheDocument();
  });
});

test('it should display name of the flow', async () => {
  const { getByTestId } = render(defaultWrapper);
  await waitFor(() => {
    expect(getByTestId('flowName')).toHaveTextContent('help workflow');
  });
});

test('it should have a help button that redirects to help page', async () => {
  const { getByTestId } = render(defaultWrapper);
  await waitFor(() => {
    expect(getByTestId('helpButton')).toBeInTheDocument();
  });
});

test('it should have a preview button', async () => {
  const { getByTestId } = render(defaultWrapper);
  await waitFor(() => {
    expect(getByTestId('previewButton')).toBeInTheDocument();
  });
});

test('it should have save as draft button', async () => {
  const { getByTestId } = render(defaultWrapper);
  await waitFor(() => {
    expect(getByTestId('saveDraftButton')).toBeInTheDocument();
  });
});

test('click on preview button should open simulator', async () => {
  const { getByTestId } = render(defaultWrapper);
  fireEvent.click(getByTestId('previewButton'));
  await waitFor(() => {
    expect(getByTestId('beneficiaryName')).toHaveTextContent('Beneficiary');
  });
});

test('publish flow which has error', async () => {
  const { getByTestId } = render(defaultWrapper);

  await waitFor(() => {
    expect(getByTestId('button')).toBeInTheDocument();
    fireEvent.click(getByTestId('button'));

    expect(getByTestId('ok-button')).toBeInTheDocument();
    fireEvent.click(getByTestId('ok-button'));
  });
});

// Need to add appropriate mocks for these calls

// test('test if XMLHTTPRequest works ', async () => {
//   const { getByTestId } = render(defaultWrapper);
//   fireEvent.click(getByTestId('previewButton'));

//   const newRequest = new XMLHttpRequest();
//   newRequest.open('GET', 'www.glific.org');
//   newRequest.send();
//   await waitFor(() => {
//     expect(newRequest.readyState).toBe(4);
//   });
// });

// test('fetch api calls', async () => {
//   render(defaultWrapper);
//   const tokenExpiryDate = new Date();
//   tokenExpiryDate.setDate(new Date().getDate() + 1);

//   setAuthSession(
//     '{"access_token":"access","renewal_token":"renew", "token_expiry_time":"' +
//       tokenExpiryDate +
//       '"}'
//   );
//   fetch('https://glific.test')
//     .then((response) => response.json())
//     .then((data) => console.log(data));
// });

test('start with a keyword message if the simulator opens in floweditor screen', async () => {
  const { getByTestId, getByText } = render(defaultWrapper);

  await waitFor(() => {
    expect(getByText('help workflow'));
  });
  fireEvent.click(getByTestId('previewButton'));
  await waitFor(() => {
    expect(getByTestId('beneficiaryName'));
  });

  // need some assertion
});

test('if the flow the inactive', async () => {
  const { getByTestId, getByText } = render(wrapperFunction(inActiveFlowMocks));

  await waitFor(() => {
    expect(getByText('help workflow'));
  });
  fireEvent.click(getByTestId('previewButton'));
  await waitFor(() => {
    expect(getByTestId('beneficiaryName'));
  });

  // need some assertion
});

test('flow with no keywords', async () => {
  const { getByTestId, getByText } = render(wrapperFunction(noKeywordMocks));

  await waitFor(() => {
    expect(getByText('help workflow'));
  });
  fireEvent.click(getByTestId('previewButton'));
  await waitFor(() => {
    expect(getByTestId('beneficiaryName'));
  });

  // need some assertion
});
