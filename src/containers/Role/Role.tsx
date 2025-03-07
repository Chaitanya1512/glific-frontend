import { useState } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import { FormLayout } from 'containers/Form/FormLayout';
import { Input } from 'components/UI/Form/Input/Input';
import { ReactComponent as RoleIcon } from 'assets/images/icons/Role/Role.svg';
import { CREATE_ROLE, DELETE_ROLE, UPDATE_ROLE } from 'graphql/mutations/Roles';
import { GET_ROLE } from 'graphql/queries/Role';
import styles from './Role.module.css';

const roleIcon = <RoleIcon className={styles.Icon} />;

const queries = {
  getItemQuery: GET_ROLE,
  createItemQuery: CREATE_ROLE,
  updateItemQuery: UPDATE_ROLE,
  deleteItemQuery: DELETE_ROLE,
};

export const Role = () => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');

  const { t } = useTranslation();

  const states = { label, description };

  const setStates = ({ label: labelValue, description: descriptionValue }: any) => {
    setLabel(labelValue);
    setDescription(descriptionValue);
  };

  const FormSchema = Yup.object().shape({
    label: Yup.string().required(t('Name is required.')),
    description: Yup.string().required(t('Description is required.')),
  });

  const dialogMessage = t("You won't be able to use this role again.");

  const formFields = [
    {
      component: Input,
      name: 'label',
      type: 'text',
      placeholder: t('Label'),
    },
    {
      component: Input,
      name: 'description',
      type: 'text',
      textArea: true,
      rows: 3,
      placeholder: t('Description'),
    },
  ];

  return (
    <FormLayout
      title="Add a new role"
      {...queries}
      states={states}
      setStates={setStates}
      validationSchema={FormSchema}
      listItemName="accessRole"
      dialogMessage={dialogMessage}
      formFields={formFields}
      redirectionLink="role"
      cancelLink="role"
      listItem="accessRole"
      icon={roleIcon}
      languageSupport={false}
      copyNotification={t('Copy of the role has been created!')}
    />
  );
};

export default Role;
