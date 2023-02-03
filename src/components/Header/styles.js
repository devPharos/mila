import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const HeaderBg = styled.ImageBackground`
    position: absolute;
    top: 0px;
    left: 0;
    opacity: .5;
    width: 100%;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: row;
    height: ${RFPercentage(100)}px;
`;

export const HeaderContainer = styled.View`
    height: 60px;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
    border: 1px solid #ddd;
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
`;