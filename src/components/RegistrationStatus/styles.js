import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';


export const Container = styled.View`
    width: 260px;
    height: ${RFPercentage(15)}px;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    z-index: 2;
`;
export const CircleActive = styled.View`
    width: 28px;
    height: 28px;
    border-radius: 28px;
    padding: 16px;
    border:2px solid ${({ theme }) => theme.colors.secondaryOpacity };
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;
export const Circle = styled.View`
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.secondaryOpacity };
`;
export const Slash = styled.View`
    width: 60px;
    height: 4px;
    background-color: #fff;
`;
export const SlashActive = styled.View`
    width: 60px;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.secondaryOpacity };
`;