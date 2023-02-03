import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const Page = styled.View`
    flex: 1;
    background: ${({ theme }) => theme.colors.background };
`;

export const Container = styled.View`
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    width: 100%;
`;

export const Box = styled.View`
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    background-color: #fff;
    width: 90%;
    padding: 32px;
    border-radius: 32px;
`;

export const Main = styled.View`
    width: 100%;
    align-items: center;
    justify-content: space-around;
    height: ${RFPercentage(85)}px;
`;