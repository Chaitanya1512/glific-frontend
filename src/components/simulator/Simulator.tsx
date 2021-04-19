import React, { useState, useEffect, useCallback } from 'react';
import { useApolloClient, useLazyQuery, useQuery, useSubscription } from '@apollo/client';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Draggable from 'react-draggable';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import CallIcon from '@material-ui/icons/Call';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VideocamIcon from '@material-ui/icons/Videocam';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

import styles from './Simulator.module.css';
import { Button as FormButton } from '../UI/Form/Button/Button';
import DefaultWhatsappImage from '../../assets/images/whatsappDefault.jpg';
import { ReactComponent as SimulatorIcon } from '../../assets/images/icons/Simulator.svg';
import { SEARCH_QUERY } from '../../graphql/queries/Search';
import { SEARCH_QUERY_VARIABLES, TIME_FORMAT } from '../../common/constants';
import { GUPSHUP_CALLBACK_URL } from '../../config';
import { ChatMessageType } from '../../containers/Chat/ChatMessages/ChatMessage/ChatMessageType/ChatMessageType';
import { GET_SIMULATOR, RELEASE_SIMULATOR } from '../../graphql/queries/Simulator';
import { SIMULATOR_RELEASE_SUBSCRIPTION } from '../../graphql/subscriptions/PeriodicInfo';
import { getUserSession } from '../../services/AuthService';
import { setNotification } from '../../common/notification';
import setLogs from '../../config/logs';

export interface SimulatorProps {
  showSimulator: boolean;
  setSimulatorId: any;
  simulatorIcon?: boolean;
  message?: any;
  flowSimulator?: any;
  isPreviewMessage?: boolean;
  resetMessage?: any;
  getFlowKeyword?: any;
}

export const Simulator: React.FC<SimulatorProps> = ({
  showSimulator,
  setSimulatorId,
  simulatorIcon = true,
  message,
  flowSimulator,
  isPreviewMessage,
  resetMessage,
  getFlowKeyword,
}: SimulatorProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [simulatedMessages, setSimulatedMessage] = useState<any>();

  const variables = { organizationId: getUserSession('organizationId') };
  const client = useApolloClient();
  let messages: any[] = [];
  let simulatorId = '';
  const { data: allConversations }: any = useQuery(SEARCH_QUERY, {
    variables: SEARCH_QUERY_VARIABLES,
    fetchPolicy: 'cache-only',
  });

  const { data: simulatorSubscribe }: any = useSubscription(SIMULATOR_RELEASE_SUBSCRIPTION, {
    variables,
  });

  useEffect(() => {
    if (simulatorSubscribe) {
      const userId = JSON.parse(simulatorSubscribe.simulatorRelease).simulator_release.user_id;
      if (userId.toString() === getUserSession('id')) {
        setSimulatorId(0);
      }
    }
  }, [simulatorSubscribe]);

  const [getSimulator, { data }]: any = useLazyQuery(GET_SIMULATOR, {
    fetchPolicy: 'network-only',
    onCompleted: (simulatorData) => {
      if (simulatorData.simulatorGet) {
        setSimulatorId(simulatorData.simulatorGet.id);
      } else {
        setNotification(
          client,
          'Sorry! Simulators are in use by other staff members right now. Please wait for it to be idle',
          'warning'
        );
      }
    },
  });

  const [releaseSimulator]: any = useLazyQuery(RELEASE_SIMULATOR, {
    fetchPolicy: 'network-only',
  });

  if (allConversations && data && data.simulatorGet) {
    // currently setting the simulated contact as the default receiver
    const simulatedContact = allConversations.search.filter(
      (item: any) => item.contact.id === data.simulatorGet.id
    );
    if (simulatedContact.length > 0) {
      messages = simulatedContact[0].messages;
      simulatorId = simulatedContact[0].contact.id;
    }
  }

  const getStyleForDirection = (direction: string): string =>
    direction === 'send' ? styles.SendMessage : styles.ReceivedMessage;

  const releaseUserSimulator = () => {
    releaseSimulator();
    setSimulatorId(0);
  };

  const renderMessage = (
    text: string,
    direction: string,
    index: number,
    insertedAt: string,
    type: string,
    media: any,
    location: any
  ) => (
    <div className={getStyleForDirection(direction)} key={index}>
      <ChatMessageType type={type} media={media} body={text} location={location} />
      <span className={direction === 'received' ? styles.TimeSent : styles.TimeReceived}>
        {moment(insertedAt).format(TIME_FORMAT)}
      </span>
      {direction === 'send' ? <DoneAllIcon /> : null}
    </div>
  );

  const getChatMessage = () => {
    const chatMessage = messages
      .map((simulatorMessage: any, index: number) => {
        const { body, insertedAt, type, media, location } = simulatorMessage;
        if (simulatorMessage.receiver.id === simulatorId) {
          return renderMessage(body, 'received', index, insertedAt, type, media, location);
        }
        return renderMessage(body, 'send', index, insertedAt, type, media, location);
      })
      .reverse();
    setSimulatedMessage(chatMessage);
  };

  const sendMessage = () => {
    const sendMessageText = inputMessage === '' && message ? message : inputMessage;
    // check if send message text is not empty
    if (sendMessageText) {
      axios({
        method: 'POST',
        url: GUPSHUP_CALLBACK_URL,
        data: {
          type: 'message',
          payload: {
            id: uuidv4(),
            type: 'text',
            payload: {
              text: sendMessageText,
            },
            sender: {
              // this number will be the simulated contact number
              phone: data ? data.simulatorGet.phone : '',
              name: data ? data.simulatorGet.name : '',
            },
          },
        },
      }).catch((error) => {
        // add log's
        setLogs(
          `sendMessageText:${sendMessageText} GUPSHUP_CALLBACK_URL:${GUPSHUP_CALLBACK_URL}`,
          'info'
        );
        setLogs(error, 'error');
      });
      setInputMessage('');
      // reset the message from floweditor for the next time
      if (resetMessage) {
        resetMessage();
      }
      // after post update render messages
      getChatMessage();
    }
  };

  const getPreviewMessage = () => {
    if (message && message.type) {
      const { body, insertedAt, type, media, location } = message;
      const previewMessage = renderMessage(body, 'received', 0, insertedAt, type, media, location);
      if (['STICKER', 'AUDIO'].includes(message.type)) {
        setSimulatedMessage(previewMessage);
      } else if (message.body || message.media?.caption) {
        setSimulatedMessage(previewMessage);
      } else {
        // To get rid of empty body and media caption for preview HSM
        setSimulatedMessage('');
      }
    }
  };

  // to display only preview for template
  useEffect(() => {
    if (isPreviewMessage) {
      getPreviewMessage();
    }
  }, [message]);

  // for loading conversation
  useEffect(() => {
    if (allConversations && data) {
      getChatMessage();
    }
  }, [data, allConversations]);

  // for sending message to Gupshup
  useEffect(() => {
    if (!isPreviewMessage && message && data) {
      sendMessage();
    }
  }, [message, data]);

  const messageRef = useCallback(
    (node: any) => {
      if (node) {
        const nodeCopy = node;
        nodeCopy.scrollTop = node.scrollHeight;
      }
    },
    [messages]
  );

  const simulator = (
    <Draggable>
      <div className={styles.SimContainer}>
        <div>
          <div id="simulator" className={styles.Simulator}>
            {!isPreviewMessage ? (
              <ClearIcon
                className={styles.ClearIcon}
                onClick={() => {
                  releaseUserSimulator();
                }}
                data-testid="clearIcon"
              />
            ) : null}
            <div className={styles.Screen}>
              <div className={styles.Header}>
                <ArrowBackIcon />
                <img src={DefaultWhatsappImage} alt="default" />
                <span data-testid="beneficiaryName">Beneficiary</span>
                <div>
                  <VideocamIcon />
                  <CallIcon />
                  <MoreVertIcon />
                </div>
              </div>
              <div className={styles.Messages} ref={messageRef} data-testid="simulatedMessages">
                {simulatedMessages}
              </div>
              <div className={styles.Controls}>
                <div>
                  <InsertEmoticonIcon className={styles.Icon} />
                  <input
                    type="text"
                    data-testid="simulatorInput"
                    onKeyPress={(event: any) => {
                      if (event.key === 'Enter') {
                        sendMessage();
                      }
                    }}
                    value={inputMessage}
                    placeholder="Type a message"
                    disabled={isPreviewMessage}
                    onChange={(event) => setInputMessage(event.target.value)}
                  />
                  <AttachFileIcon className={styles.AttachFileIcon} />
                  <CameraAltIcon className={styles.Icon} />
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  className={styles.SendButton}
                  disabled={isPreviewMessage}
                  onClick={() => sendMessage()}
                >
                  <MicIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );

  const handleSimulator = () => {
    // check for the flowkeyword from floweditor
    if (getFlowKeyword) {
      getFlowKeyword();
    }
    getSimulator();
  };

  return (
    <>
      {showSimulator ? simulator : null}
      {simulatorIcon ? (
        <SimulatorIcon
          data-testid="simulatorIcon"
          className={showSimulator ? styles.SimulatorIconClicked : styles.SimulatorIconNormal}
          onClick={() => {
            if (showSimulator) {
              releaseUserSimulator();
            } else {
              handleSimulator();
            }
          }}
        />
      ) : null}

      {flowSimulator ? (
        <div className={styles.PreviewButton}>
          <FormButton
            variant="outlined"
            color="primary"
            data-testid="previewButton"
            className={styles.Button}
            onClick={() => {
              if (showSimulator) {
                releaseUserSimulator();
              } else {
                handleSimulator();
              }
            }}
          >
            Preview
            {showSimulator ? <CancelOutlinedIcon className={styles.CrossIcon} /> : null}
          </FormButton>
        </div>
      ) : null}
    </>
  );
};
