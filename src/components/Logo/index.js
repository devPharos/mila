import React from 'react';

import { Container } from './styles';

function Logo( { ...rest }){
  return <Container { ...rest } style={{ width: 137,height: 103 }} source={require('../../global/images/logo.png')} />;
}

export default Logo;