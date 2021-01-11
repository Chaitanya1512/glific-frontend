import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import { Typography } from '@material-ui/core';

import styles from './Search.module.css';
import { Input } from '../../components/UI/Form/Input/Input';
import { FormLayout } from '../Form/FormLayout';
import { ReactComponent as Searchicon } from '../../assets/images/icons/Search/Selected.svg';
import { ReactComponent as TagIcon } from '../../assets/images/icons/Tags/Selected.svg';
import { GET_SEARCH, SEARCH_LIST_QUERY } from '../../graphql/queries/Search';
import { CREATE_SEARCH, UPDATE_SEARCH, DELETE_SEARCH } from '../../graphql/mutations/Search';
import { FILTER_TAGS_NAME } from '../../graphql/queries/Tag';
import { GET_GROUPS } from '../../graphql/queries/Group';
import { GET_USERS } from '../../graphql/queries/User';
import { AutoComplete } from '../../components/UI/Form/AutoComplete/AutoComplete';
import { Calendar } from '../../components/UI/Form/Calendar/Calendar';
import Loading from '../../components/UI/Layout/Loading/Loading';
import { setVariables } from '../../common/constants';
import { getObject } from '../../common/utils';

export interface SearchProps {
  match?: any;
  type?: string;
  search?: any;
  handleCancel?: any;
  handleSave?: any;
  searchParam?: any;
  setState?: any;
}

const validation = {
  shortcode: Yup.string().required('Title is required.').max(20, 'Title is too long.'),
  label: Yup.string().required('Description is required.'),
};
let FormSchema = Yup.object().shape({});

const dialogMessage = "You won't be able to use this search again.";

const searchIcon = <Searchicon className={styles.Searchicon} />;

const queries = {
  getItemQuery: GET_SEARCH,
  createItemQuery: CREATE_SEARCH,
  updateItemQuery: UPDATE_SEARCH,
  deleteItemQuery: DELETE_SEARCH,
};

export const Search: React.SFC<SearchProps> = ({ match, type, search, ...props }) => {
  const { searchParam } = props;
  const [shortcode, setShortcode] = useState('');
  const [label, setLabel] = useState('');
  const [term, setTerm] = useState('');
  const [includeTags, setIncludeTags] = useState([]);
  const [includeGroups, setIncludeGroups] = useState([]);
  const [includeUsers, setIncludeUsers] = useState([]);
  const [dateFrom, setdateFrom] = useState(null);
  const [dateTo, setdateTo] = useState(null);
  const [formFields, setFormFields] = useState<any>([]);
  const [button, setButton] = useState<string>('Save');

  const states = {
    shortcode,
    label,
    term,
    includeTags,
    includeGroups,
    includeUsers,
    dateFrom,
    dateTo,
  };

  const { data: dataT } = useQuery(FILTER_TAGS_NAME, {
    variables: setVariables(),
  });

  const { data } = useQuery(GET_GROUPS, {
    variables: setVariables(),
  });

  const { data: dataUser } = useQuery(GET_USERS, {
    variables: setVariables(),
  });

  const setArgs = (args: any) => {
    const filters = JSON.parse(args);
    Object.keys(filters.filter).map((key) => {
      switch (key) {
        case 'includeTags':
          if (Object.prototype.hasOwnProperty.call(filters.filter, 'includeTags'))
            setIncludeTags(getObject(dataT.tags, filters.filter.includeTags));
          break;
        case 'includeGroups':
          if (Object.prototype.hasOwnProperty.call(filters.filter, 'includeGroups'))
            setIncludeGroups(getObject(data.groups, filters.filter.includeGroups));
          break;
        case 'includeUsers':
          if (Object.prototype.hasOwnProperty.call(filters.filter, 'includeUsers'))
            setIncludeUsers(getObject(dataUser.users, filters.filter.includeUsers));
          break;
        case 'dateRange':
          if (Object.prototype.hasOwnProperty.call(filters.filter, 'dateRange')) {
            setdateFrom(filters.filter.dateRange.from);
            setdateTo(filters.filter.dateRange.to);
          }
          break;
        case 'term':
          setTerm(filters.filter.term);
          break;
        default:
          break;
      }
      return null;
    });
  };

  const setStates = ({ shortcode: shortcodeValue, label: labelValue, args: argsValue }: any) => {
    setShortcode(shortcodeValue);
    setLabel(labelValue);
    setArgs(argsValue);
  };

  const restoreSearch = () => {
    const args = {
      messageOpts: {
        offset: 0,
        limit: 10,
      },
      filter: {
        term: props.searchParam.term,
        includeTags: props.searchParam.includeTags
          ? props.searchParam.includeTags.map((option: any) => option.id)
          : [],
        includeGroups: props.searchParam.includeGroups
          ? props.searchParam.includeGroups.map((option: any) => option.id)
          : [],
        includeUsers: props.searchParam.includeUsers
          ? props.searchParam.includeUsers.map((option: any) => option.id)
          : [],
      },
      contactOpts: {
        offset: 0,
        limit: 20,
      },
    };

    if (props.searchParam.dateFrom && props.searchParam.dateFrom !== 'Invalid date') {
      const dateRange = {
        dateRange: {
          to: moment(props.searchParam.dateTo).format('yyyy-MM-DD'),
          from: moment(props.searchParam.dateFrom).format('yyyy-MM-DD'),
        },
      };
      args.filter = Object.assign(args.filter, dateRange);
    }
    // For create new search then label & shortcode should be empty
    // For update search match.params.id should not empty
    setStates({
      label: match.params.id ? props.searchParam.label : '',
      shortcode: match.params.id ? props.searchParam.shortcode : '',
      args: JSON.stringify(args),
    });
  };

  useEffect(() => {
    // Chat search:restore search's search
    if (searchParam && Object.keys(searchParam).length !== 0) {
      restoreSearch();
    }
  }, [searchParam]);

  const { data: searchList } = useQuery(SEARCH_LIST_QUERY, {
    variables: setVariables({}, 100, 0, 'ASC'),
  });

  if (!data || !dataT || !dataUser) return <Loading />;

  const validateTitle = (value: any) => {
    let error;
    if (value) {
      let found = [];

      if (searchList) {
        found = searchList.savedSearches.filter(
          (savedSearch: any) => savedSearch.shortcode === value
        );
        if (match.params.id && found.length > 0) {
          found = found.filter((savedSearch: any) => savedSearch.id !== match.params.id);
        }
      }
      if (found.length > 0) {
        error = 'Title already exists.';
      }
    }
    return error;
  };

  const DataFields = [
    {
      component: Input,
      name: 'shortcode',
      type: 'text',
      placeholder: 'Search Title',
      validate: validateTitle,
    },
    {
      component: Input,
      name: 'label',
      type: 'text',
      placeholder: 'Description',
      rows: 3,
      textArea: true,
    },
  ];

  const searchFields = [
    {
      component: Input,
      name: 'term',
      type: 'text',
      placeholder: 'Enter name, tag, keyword',
    },
    {
      component: AutoComplete,
      name: 'includeTags',
      label: 'Includes tags',
      options: dataT.tags,
      optionLabel: 'label',
      textFieldProps: {
        variant: 'outlined',
      },
      icon: <TagIcon className={styles.TagIcon} />,
    },
    {
      component: AutoComplete,
      name: 'includeGroups',
      placeholder: 'Includes groups',
      label: 'Includes groups',
      options: data.groups,
      optionLabel: 'label',
      noOptionsText: 'No groups available',
      textFieldProps: {
        variant: 'outlined',
      },
    },
    {
      component: AutoComplete,
      name: 'includeUsers',
      placeholder: 'Includes staff',
      label: 'Includes staff',
      options: dataUser.users,
      optionLabel: 'name',
      textFieldProps: {
        variant: 'outlined',
      },
    },
    {
      component: Calendar,
      name: 'dateFrom',
      type: 'date',
      placeholder: 'Date from',
      label: 'Date range',
    },
    {
      component: Calendar,
      name: 'dateTo',
      type: 'date',
      placeholder: 'Date to',
    },
  ];

  const setPayload = (payload: any) => {
    if (search) search(payload);

    const args = {
      messageOpts: {
        offset: 0,
        limit: 10,
      },
      filter: {
        term: payload.term,
        includeTags: payload.includeTags ? payload.includeTags.map((option: any) => option.id) : [],
        includeGroups: payload.includeGroups
          ? payload.includeGroups.map((option: any) => option.id)
          : [],
        includeUsers: payload.includeUsers
          ? payload.includeUsers.map((option: any) => option.id)
          : [],
      },
      contactOpts: {
        offset: 0,
        limit: 20,
      },
    };

    if (payload.dateFrom && payload.dateFrom !== 'Invalid date') {
      const dateRange = {
        dateRange: {
          to: moment(payload.dateTo).format('yyyy-MM-DD'),
          from: moment(payload.dateFrom).format('yyyy-MM-DD'),
        },
      };
      args.filter = Object.assign(args.filter, dateRange);
    }

    return {
      label: payload.label,
      shortcode: payload.shortcode,
      args: JSON.stringify(args),
    };
  };

  const addFieldsValidation = (object: any) => {
    FormSchema = Yup.object().shape(object);
  };

  const advanceSearch = (dataType: any) => {
    // close dialogbox
    if (dataType === 'cancel') props.handleCancel();

    let heading;
    if (type === 'search') {
      heading = (
        <>
          <Typography variant="h5" className={styles.Title}>
            Search conversations
          </Typography>
          <Typography variant="subtitle1" className={styles.Subtext}>
            Apply more parameters to search for conversations.
          </Typography>
        </>
      );

      FormSchema = Yup.object().shape({});
    }

    if (type === 'saveSearch') {
      heading = (
        <>
          <Typography variant="h5" className={styles.Title}>
            Save Search
          </Typography>
        </>
      );
      addFieldsValidation(validation);
    }

    if (formFields.length === 0) {
      if (type === 'search') {
        setFormFields([...searchFields]);
        setButton('Search');
      }
      if (type === 'saveSearch') setFormFields(DataFields);
    }
    return {
      heading,
    };
  };

  const getFields = () => {
    addFieldsValidation(validation);
    return [...DataFields, ...searchFields];
  };

  const saveHandler = (saveData: any) => {
    if (props.handleSave && saveData.updateSavedSearch)
      props.handleSave(saveData.updateSavedSearch);
  };

  return (
    <FormLayout
      {...queries}
      match={match}
      states={states}
      setStates={setStates}
      setPayload={setPayload}
      validationSchema={FormSchema}
      listItemName="Search"
      dialogMessage={dialogMessage}
      formFields={formFields.length > 0 ? formFields : getFields()}
      redirectionLink="search"
      cancelLink="search"
      linkParameter="id"
      listItem="savedSearch"
      icon={searchIcon}
      languageSupport={false}
      advanceSearch={advanceSearch}
      button={button}
      type={type}
      afterSave={saveHandler}
    />
  );
};
