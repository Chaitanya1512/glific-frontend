import React, { useState, useEffect } from 'react';
import { Paper, Toolbar, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import styles from './Chat.module.css';
import { Simulator } from '../../components/simulator/Simulator';
import ChatMessages from './ChatMessages/ChatMessages';
import ChatConversations from './ChatConversations/ChatConversations';
import Loading from '../../components/UI/Layout/Loading/Loading';
import { SEARCH_QUERY } from '../../graphql/queries/Search';
import { setErrorMessage } from '../../common/notification';
import { getUserRole } from '../../context/role';
import { COLLECTION_SEARCH_QUERY_VARIABLES, SEARCH_QUERY_VARIABLES } from '../../common/constants';
import selectedChatIcon from '../../assets/images/icons/Chat/SelectedContact.svg';
import unselectedChatIcon from '../../assets/images/icons/Chat/Unselected.svg';
import collectionIcon from '../../assets/images/icons/Chat/Collection.svg';
import selectedCollectionIcon from '../../assets/images/icons/Chat/SelectedCollection.svg';
import savedSearchIcon from '../../assets/images/icons/Chat/SavedSearch.svg';
import selectedSavedSearchIcon from '../../assets/images/icons/Chat/SelectedSavedSearch.svg';

import CollectionConversations from './CollectionConversations/CollectionConversations';
import SavedSearches from './SavedSearches/SavedSearches';

const noConversations = (
  <Typography variant="h5" className={styles.NoConversations}>
    There are no chat conversations to display.
  </Typography>
);
export interface ChatProps {
  contactId?: number | string | null;
  collectionId?: number | null;
  savedSearches?: boolean;
}

export const Chat: React.SFC<ChatProps> = ({ contactId, collectionId, savedSearches }) => {
  const [simulatorAccess, setSimulatorAccess] = useState(true);
  const [simulatorId, setSimulatorId] = useState(0);

  let selectedContactId = contactId;
  let selectedCollectionId = collectionId;

  // default query variables
  let queryVariables = SEARCH_QUERY_VARIABLES;

  // contact id === collection when the collection id is not passed in the url
  let selectedTab = 'contacts';
  if (selectedCollectionId) {
    queryVariables = COLLECTION_SEARCH_QUERY_VARIABLES;
    selectedTab = 'collections';
  }

  // fetch the conversations from cache
  const { loading, error, data, client } = useQuery<any>(SEARCH_QUERY, {
    variables: queryVariables,
    fetchPolicy: 'cache-only',
  });

  useEffect(() => {
    if (getUserRole().includes('Staff')) {
      setSimulatorAccess(false);
    }
  }, []);

  if (loading) return <Loading />;
  if (error) {
    setErrorMessage(client, error);
    return null;
  }

  // let's handle the case when collection id is -1 then we set the first collection
  // as the selected collection
  if (!selectedContactId && selectedCollectionId === -1 && data && data.search.length !== 0) {
    if (data.search[0].group) {
      selectedCollectionId = data.search[0].group.id;
      selectedContactId = '';
    }
  }

  // let's handle the case when contact id and collection id is not passed in the url then we set the
  // first record as selected contact
  if (!selectedContactId && !selectedCollectionId && data && data.search.length !== 0) {
    if (data.search[0].contact) {
      selectedContactId = data.search[0].contact.id;
    }
  }

  let chatInterface: any;
  let listingContent;
  let highlight: string = '';

  if (data && data.search.length === 0) {
    chatInterface = noConversations;
  } else {
    let contactSelectedClass = '';
    let collectionSelectedClass = '';
    let savedSearchClass = '';

    if (selectedCollectionId || (selectedTab === 'collections' && !savedSearches)) {
      listingContent = <CollectionConversations collectionId={selectedCollectionId} />;
      // set class for collections tab
      collectionSelectedClass = `${styles.SelectedTab}`;
      highlight = 'collections';
    } else if (selectedContactId && !savedSearches) {
      // let's enable simulator only when contact tab is shown

      listingContent = (
        <ChatConversations contactId={simulatorId > 0 ? simulatorId : selectedContactId} />
      );

      // set class for contacts tab
      contactSelectedClass = `${styles.SelectedTab}`;
      highlight = 'contacts';
    } else if (savedSearches) {
      // set class for saved search
      savedSearchClass = `${styles.SelectedTab}`;
      // for saved search
      listingContent = <SavedSearches />;
      highlight = 'saved-searches';
    }

    chatInterface = (
      <>
        <div className={`${styles.ChatMessages} chatMessages`}>
          <ChatMessages
            contactId={simulatorId > 0 ? simulatorId : selectedContactId}
            collectionId={selectedCollectionId}
          />
        </div>

        <div className={`${styles.ChatConversations} ChatConversations`}>
          <Toolbar className={styles.ToolBar}>
            <div className={styles.TabContainer}>
              <div>
                <Link to="/chat">
                  <div className={styles.Title}>
                    <div className={styles.IconBackground}>
                      <img
                        src={contactSelectedClass ? selectedChatIcon : unselectedChatIcon}
                        height="24"
                        className={styles.Icon}
                        alt="Conversation"
                      />
                    </div>
                    <div>
                      <Typography
                        className={`${styles.TitleText} ${contactSelectedClass}`}
                        variant="h6"
                      >
                        Contacts
                      </Typography>
                    </div>
                  </div>
                </Link>
                <div
                  className={`${
                    highlight === 'contacts' ? styles.DarkHighLighter : styles.LightHighLighter
                  }`}
                />
              </div>
              <div>
                <Link to="/chat/collection">
                  <div className={styles.Title}>
                    <div className={styles.IconBackground}>
                      <img
                        src={collectionSelectedClass ? selectedCollectionIcon : collectionIcon}
                        height="24"
                        className={styles.Icon}
                        alt="Conversation"
                      />
                    </div>
                    <div>
                      <Typography
                        className={`${styles.TitleText} ${collectionSelectedClass}`}
                        variant="h6"
                      >
                        Collections
                      </Typography>
                    </div>
                  </div>
                </Link>
                <div
                  className={`${
                    highlight === 'collections' ? styles.DarkHighLighter : styles.LightHighLighter
                  }`}
                />
              </div>
              <div>
                <Link to="/chat/saved-searches">
                  <div className={styles.Title}>
                    <div className={styles.IconBackground}>
                      <img
                        src={savedSearchClass ? selectedSavedSearchIcon : savedSearchIcon}
                        height="24"
                        className={styles.Icon}
                        alt="Conversation"
                      />
                    </div>
                    <div>
                      <Typography
                        className={`${styles.TitleText} ${savedSearchClass}`}
                        variant="h6"
                      >
                        Saved searches
                      </Typography>
                    </div>
                  </div>
                </Link>
                <div
                  className={`${
                    highlight === 'saved-searches'
                      ? styles.DarkHighLighter
                      : styles.LightHighLighter
                  }`}
                />
              </div>
            </div>
          </Toolbar>

          <div>{listingContent}</div>
        </div>
      </>
    );
  }

  return (
    <Paper>
      <div className={styles.Chat} data-testid="chatContainer">
        {chatInterface}
      </div>
      {simulatorAccess && !selectedCollectionId ? (
        <Simulator setSimulatorId={setSimulatorId} showSimulator={simulatorId > 0} />
      ) : null}
    </Paper>
  );
};
