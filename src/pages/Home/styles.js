import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const Page = styled.View`
    flex: 1;
    background: ${({ theme }) => theme.colors.background };
`;

export const Container = styled.View`
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-top: ${RFPercentage(15)}px;
`;

export const Main = styled.View`
    width: 100%;
    align-items: center;
    justify-content: space-around;
`;

export const BtnText = styled.Text`
    color: ${({ theme }) => theme.colors.secondary};
    font-weight: normal;
    font-size: 16px;
`;