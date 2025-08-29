import * as React from 'react';
import { Avatar } from 'react-native-paper';

const AvatarComponent = () => (
  <Avatar.Image size={24} source={require('../../assets/avatar.png')} />
);
export default AvatarComponent