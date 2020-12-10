import React from 'react';
import { Checkbox as CheckboxElement, FormControlLabel } from '@material-ui/core';
import { ReactComponent as InfoIcon } from '../../../../assets/images/icons/Info.svg';

import styles from './Checkbox.module.css';
import Tooltip from '../../Tooltip/Tooltip';

export interface CheckboxProps {
  field: any;
  title: string;
  form: any;
  handleChange?: Function;
  info?: { title: string };
}

export const Checkbox: React.SFC<CheckboxProps> = (props) => {
  const { field, title, info = false } = props;
  const handleChange = () => {
    props.form.setFieldValue(props.field.name, !props.field.value);
    if (props.handleChange) props.handleChange(!props.field.value);
  };

  return (
    <div className={styles.Checkbox}>
      <FormControlLabel
        control={
          <CheckboxElement
            data-testid="checkboxLabel"
            classes={{ colorPrimary: styles.CheckboxColor }}
            {...field}
            color="primary"
            checked={field.value ? field.value : false}
            onChange={handleChange}
          />
        }
        labelPlacement="end"
        label={title}
        classes={{
          label: styles.Label,
          root: styles.Root,
        }}
      />
      {info ? (
        <Tooltip tooltipClass={styles.Tooltip} title={info.title} placement="right">
          <InfoIcon />
        </Tooltip>
      ) : null}
    </div>
  );
};
