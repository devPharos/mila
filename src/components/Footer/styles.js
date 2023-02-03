import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const FooterBg = styled.ImageBackground`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    height: ${RFPercentage(100)}px;
`;