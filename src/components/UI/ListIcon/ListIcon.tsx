import React from 'react';
import { useLocation } from 'react-router-dom';

import chatIcon from '../../../assets/images/icons/Chat/Unselected.svg';
import tagIcon from '../../../assets/images/icons/Tags/Unselected.svg';
import broadcastIcon from '../../../assets/images/icons/Broadcast/Unselected.svg';
import flowIcon from '../../../assets/images/icons/Flow/Unselected.svg';
import collectionsIcon from '../../../assets/images/icons/Collections/Unselected.svg';
import goalsIcon from '../../../assets/images/icons/Goals/Unselected.svg';
import analyticsIcon from '../../../assets/images/icons/Analytics/Unselected.svg';
import speedSendIcon from '../../../assets/images/icons/SpeedSend/Unselected.svg';
import templateIcon from '../../../assets/images/icons/Template/Unselected.svg';
import chatSelectedIcon from '../../../assets/images/icons/Chat/Selected.svg';
import tagSelectedIcon from '../../../assets/images/icons/Tags/Selected.svg';
import broadcastSelectedIcon from '../../../assets/images/icons/Broadcast/Selected.svg';
import flowSelectedIcon from '../../../assets/images/icons/Flow/Selected.svg';
import collectionsSelectedIcon from '../../../assets/images/icons/Collections/Selected.svg';
// import goalsSelectedIcon from '../../../assets/images/icons/Goals/Selected.svg';
import analyticsSelectedIcon from '../../../assets/images/icons/Analytics/Selected.svg';
import speedSendSelectedIcon from '../../../assets/images/icons/SpeedSend/Selected.svg';
import templateSelectedIcon from '../../../assets/images/icons/Template/Selected.svg';

export interface ListIconProps {
  icon: string;
}

export const ListIcon: React.SFC<ListIconProps> = (props) => {
  const { icon } = props;

  const location = useLocation();
  const stringsToIcons: { [iconName: string]: string } = {
    chat: chatIcon,
    tag: tagIcon,
    broadcast: broadcastIcon,
    flow: flowIcon,
    collection: collectionsIcon,
    goal: goalsIcon,
    analytics: analyticsIcon,
    'speed-send': speedSendIcon,
    template: templateIcon,
  };

  const stringsToSelectedIcons: { [iconName: string]: string } = {
    chat: chatSelectedIcon,
    tag: tagSelectedIcon,
    broadcast: broadcastSelectedIcon,
    flow: flowSelectedIcon,
    collection: collectionsSelectedIcon,
    // goal: goalsSelectedIcon,
    analytics: analyticsSelectedIcon,
    'speed-send': speedSendSelectedIcon,
    template: templateSelectedIcon,
  };

  return (
    <img
      src={
        location.pathname.startsWith(`/${icon}`)
          ? stringsToSelectedIcons[icon]
          : stringsToIcons[icon]
      }
      alt={'Selected '.concat(icon)}
      data-testid="listIcon"
    />
  );
};

export default ListIcon;
