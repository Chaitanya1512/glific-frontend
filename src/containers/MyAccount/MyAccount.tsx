import React, { useState } from 'react';
import * as Yup from 'yup';
import { Typography, IconButton } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { useQuery, useMutation } from '@apollo/client';
import { Redirect } from 'react-router';

import styles from './MyAccount.module.css';
import { Input } from '../../components/UI/Form/Input/Input';
import { ReactComponent as UserIcon } from '../../assets/images/icons/Contact/Profile.svg';
import { UPDATE_CURRENT_USER } from '../../graphql/mutations/User';
import { GET_CURRENT_USER } from '../../graphql/queries/User';
import { Button } from '../../components/UI/Form/Button/Button';
import Loading from '../../components/UI/Layout/Loading/Loading';
import { sendOTP } from '../../services/AuthService';
import { ToastMessage } from '../../components/UI/ToastMessage/ToastMessage';

export interface MyAccountProps {}

export const MyAccount: React.SFC<MyAccountProps> = () => {
  // set the validation / errors / success message
  const [toastMessageInfo, setToastMessageInfo] = useState({ message: '', severity: '' });

  // set the trigger to show next step
  const [showOTPButton, setShowOTPButton] = useState(true);

  // set redirection to chat
  const [redirectToChat, setRedirectToChat] = useState(false);

  // handle visibility for the password field
  const [showPassword, setShowPassword] = useState(false);

  // get the information on current user
  const { data: userData, loading: userDataLoading } = useQuery(GET_CURRENT_USER);

  // set the mutation to update the logged in user password
  const [updateCurrentUser] = useMutation(UPDATE_CURRENT_USER, {
    onCompleted: (data) => {
      if (data['updateCurrentUser'].errors) {
        if (data['updateCurrentUser'].errors[0]['message'] === 'incorrect_code') {
          setToastMessageInfo({ severity: 'error', message: 'Please enter a valid OTP' });
        } else {
          setToastMessageInfo({
            severity: 'error',
            message: 'Too many attempts, please retry after sometime.',
          });
        }
      } else {
        setShowOTPButton(true);
        setToastMessageInfo({ severity: 'success', message: 'Password updated successfully!' });
      }
    },
  });

  // return loading till we fetch the data
  if (userDataLoading) return <Loading />;

  // set the phone of logged in user that will be used to send the OTP
  const loggedInUserPhone = userData.currentUser.user.phone;

  // callback function to send otp to the logged user
  const sendOTPHandler = () => {
    sendOTP(loggedInUserPhone)
      .then((response) => {
        setShowOTPButton(false);
      })
      .catch((error) => {
        setToastMessageInfo({
          severity: 'error',
          message: `Enable to send an OTP to ${loggedInUserPhone}.`,
        });
      });
  };

  // cancel handler if cancel is clicked
  const cancelHandler = () => {
    setRedirectToChat(true);
  };

  // save the form if data is valid
  const saveHandler = (item: any) => {
    updateCurrentUser({
      variables: { input: item },
    });
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // callback function when close icon is clicked
  const closeToastMessage = () => {
    // reset toast information
    setToastMessageInfo({ message: '', severity: '' });
  };

  // set up toast message display, we use this for showing backend validation errors like
  // invalid OTP and also display success message on password updat
  let displayToastMessage: any;
  if (toastMessageInfo.message.length > 0) {
    displayToastMessage = (
      <ToastMessage
        message={toastMessageInfo.message}
        severity={toastMessageInfo.severity === 'success' ? 'success' : 'error'}
        handleClose={closeToastMessage}
      />
    );
  }

  // setup form schema base on Yup
  const FormSchema = Yup.object().shape({
    otp: Yup.string().required('Input required'),
    password: Yup.string()
      .min(6, 'Password must be at least 8 characters long.')
      .required('Input required'),
  });

  // for configuration that needs to be rendered
  const formFields = [
    {
      component: Input,
      type: 'otp',
      name: 'otp',
      placeholder: 'OTP',
      helperText: 'Please confirm the OTP received at your whatsapp number.',
      endAdornmentCallback: sendOTPHandler,
    },
    {
      component: Input,
      name: 'password',
      type: 'password',
      placeholder: 'Change Password',
      endAdornmentCallback: handlePasswordVisibility,
      togglePassword: showPassword,
    },
  ];

  // redirect to chat
  if (redirectToChat) {
    return <Redirect to="/chat" />;
  }

  // build form fields
  let formFieldLayout: any;
  if (!showOTPButton) {
    formFieldLayout = formFields.map((field: any, index) => {
      return (
        <React.Fragment key={index}>
          <Field key={index} {...field}></Field>
        </React.Fragment>
      );
    });
  }

  // form component
  let form = (
    <>
      <Formik
        enableReinitialize
        initialValues={{ otp: '', password: '' }}
        validationSchema={FormSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values);
          resetForm();
        }}
      >
        {({ submitForm }) => (
          <Form className={styles.Form}>
            {displayToastMessage}
            {formFieldLayout}
            <div className={styles.Buttons}>
              {showOTPButton ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={sendOTPHandler}
                    className={styles.Button}
                    data-testid="generateOTP"
                  >
                    GENERATE OTP
                  </Button>
                  <div className={styles.HelperText}>To change first please generate OTP</div>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={submitForm}
                    className={styles.Button}
                  >
                    SAVE
                  </Button>
                  <Button variant="contained" color="default" onClick={cancelHandler}>
                    CANCEL
                  </Button>
                </>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );

  return (
    <div className={styles.MyAccount} data-testid="MyAccount">
      <Typography variant="h5" className={styles.Title}>
        <IconButton disabled={true} className={styles.Icon}>
          <UserIcon />
        </IconButton>
        My Account
      </Typography>
      <Typography variant="h6" className={styles.Title}>
        Change Password
      </Typography>
      {form}
    </div>
  );
};
