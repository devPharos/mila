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
`;

export const Main = styled.View`
    width: 100%;
    align-items: center;
    justify-content: space-around;
    height: ${RFPercentage(88)}px;
`;

export const BtnText = styled.Text`
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 16px;
    font-weight: bold;
`;