import React from 'react';
import { MenuItem as MenuItemElement } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './MenuItem.module.css';

export interface MenuItemProps {
  title: string;
  path: string;
  icon?: any;
  onClickHandler: any;
  className?: string;
}

const MenuItem: React.SFC<MenuItemProps> = (props) => {
  const { className, onClickHandler, path, icon, title } = props;
  const { t } = useTranslation();

  let menuItemClass = '';
  if (className === 'Danger') {
    menuItemClass = styles.Danger;
  }

  return (
    <MenuItemElement onClick={onClickHandler} component={Link} to={path} data-testid="MenuItem">
      {icon}
      <div className={`${menuItemClass} ${icon ? styles.Spacing : ''}`}>{t(title)}</div>
    </MenuItemElement>
  );
};

export default MenuItem;
