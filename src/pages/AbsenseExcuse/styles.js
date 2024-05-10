import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const Page = styled.View`
    flex: 1;
    background: ${({ theme }) => theme.colors.background };
`;

export const Main = styled.View`
    background: #fff;
    border-radius: 32px;
    width: 90%;
    margin-left: 5%;
    margin-top: 140px;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
    padding-bottom: 32px;
    flex-direction: column;
`;

export const Profilepic = styled.View`
    background: #FFF;
    border:1px solid #efefef;
    width: 200px;
    height: 200px;
    margin-top: -120px;
    border-radius: 32px;

`;

export const BtnText = styled.Text`
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 16px;
    font-weight: bold;
`;
