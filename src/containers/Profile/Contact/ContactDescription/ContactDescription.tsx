import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import styles from './ContactDescription.module.css';
import { Timer } from '../../../../components/UI/Timer/Timer';
import { Tooltip } from '../../../../components/UI/Tooltip/Tooltip';

export interface ContactDescriptionProps {
  fields: any;
  settings: any;
  phone: string;
  maskedPhone: string;
  collections: any;
  lastMessage: string;
}

export const ContactDescription: React.FC<ContactDescriptionProps> = (props) => {
  const { phone, maskedPhone, collections, lastMessage } = props;
  let { fields, settings } = props;

  const [showPlainPhone, setShowPlainPhone] = useState(false);

  // list of collections that the contact is assigned
  let assignedToCollection: any = Array.from(
    new Set(
      [].concat(
        ...collections.map((collection: any) => collection.users.map((user: any) => user.name))
      )
    )
  );

  if (assignedToCollection.length > 2) {
    assignedToCollection = `${assignedToCollection.slice(0, 2).join(', ')} +${(
      assignedToCollection.length - 2
    ).toString()}`;
  } else {
    assignedToCollection = assignedToCollection.join(', ');
  }

  // list of collections that the contact belongs
  const collectionList = collections.map((collection: any) => collection.label).join(', ');

  const collectionDetails = [
    { label: 'Collections', value: collectionList || 'None' },
    {
      label: 'Assigned to',
      value: assignedToCollection || 'None',
    },
  ];

  if (typeof settings === 'string') {
    settings = JSON.parse(settings);
  }

  if (typeof fields === 'string') {
    fields = JSON.parse(fields);
  }

  const handlePhoneDisplay = () => {
    setShowPlainPhone(!showPlainPhone);
  };

  let phoneDisplay = (
    <div data-testid="phone" className={styles.PhoneField}>
      +{maskedPhone}
    </div>
  );

  if (phone) {
    let phoneDisplayValue = maskedPhone;
    let visibilityElement = (
      <Tooltip title="Hide number" placement="right">
        <Visibility classes={{ root: styles.Visibility }} />
      </Tooltip>
    );
    if (showPlainPhone) {
      phoneDisplayValue = phone;
      visibilityElement = (
        <Tooltip title="Show number" placement="right">
          <VisibilityOff classes={{ root: styles.Visibility }} />
        </Tooltip>
      );
    }

    phoneDisplay = (
      <div className={styles.PhoneSection}>
        <div data-testid="phone" className={styles.PhoneField}>
          +{phoneDisplayValue}
        </div>
        <IconButton
          aria-label="toggle phone visibility"
          data-testid="phoneToggle"
          onClick={handlePhoneDisplay}
          edge="end"
        >
          {visibilityElement}
        </IconButton>
      </div>
    );
  }

  return (
    <div className={styles.DescriptionContainer} data-testid="contactDescription">
      <h2 className={styles.Title}>Details</h2>
      <div className={styles.Description}>
        {phoneDisplay}
        <div className={styles.SessionTimer}>
          <span>Session Timer</span>
          <Timer time={lastMessage} />
        </div>
      </div>

      <div className={styles.DetailBlock}>
        {collectionDetails.map((collectionItem: any) => (
          <div key={collectionItem.label}>
            <div className={styles.DescriptionItem}>{collectionItem.label}</div>
            <div className={styles.DescriptionItemValue} data-testid="collections">
              {collectionItem.value}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.DetailBlock}>
        {settings &&
          typeof settings === 'object' &&
          Object.keys(settings).map((key) => (
            <div key={key}>
              <div className={styles.DescriptionItem}>{key}</div>
              <div className={styles.DescriptionItemValue}>
                {Object.keys(settings[key])
                  .filter((settingKey) => settings[key][settingKey] === true)
                  .join(', ')}
              </div>
            </div>
          ))}
        {fields &&
          typeof fields === 'object' &&
          Object.keys(fields).map((key) => (
            <div key={key}>
              <div className={styles.DescriptionItem}>
                {fields[key].label ? fields[key].label : key.replace('_', ' ')}
              </div>
              <div className={styles.DescriptionItemValue}>{fields[key].value}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
