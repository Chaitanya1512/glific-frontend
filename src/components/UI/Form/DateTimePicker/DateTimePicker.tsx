import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import 'date-fns';
import { getIn } from 'formik';
import styles from './DateTimePicker.module.css';

export interface DateTimePickerProps {
  variant?: any;
  inputVariant?: any;
  format?: string;
  field: any;
  form: { dirty: any; touched: any; errors: any; setFieldValue: any };
  placeholder: string;
  minDate?: any;
  onChange?: any;
}

export const DateTimePicker: React.SFC<DateTimePickerProps> = ({
  variant = 'inline',
  inputVariant = 'outlined',
  format = 'dd/MM/yyyy hh:mm a',
  field,
  form: { touched, errors, setFieldValue },
  placeholder,
  minDate,
  onChange,
}) => {
  const errorText = getIn(errors, field.name);
  const touchedVal = getIn(touched, field.name);
  const hasError = touchedVal && errorText !== undefined;
  const dateValue = field.value ? field.value : null;

  const handleDateChange = (date: Date | null | string) => {
    if (date) {
      if (date !== 'Invalid Date') setFieldValue(field.name, date);
      if (onChange) onChange(date);
    } else {
      setFieldValue(field.name, null);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid className={styles.DateTimePicker}>
        <KeyboardDateTimePicker
          error={hasError ? errorText : ''}
          autoOk
          variant={variant}
          inputVariant={inputVariant}
          format={format}
          data-testid="date-picker-inline"
          label={placeholder}
          value={dateValue}
          onChange={handleDateChange}
          helperText={hasError ? errorText : ''}
          minDate={minDate}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
};
