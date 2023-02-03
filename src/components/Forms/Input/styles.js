import styled from 'styled-components/native';
import { TextInput } from 'react-native';


export const Container = styled.View`
    width: 80%;
    padding: 0 24px;
    border-radius: 32px;
    background-color: #FFFFFF;
    font-size: 18px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 8px 0;
    border:1px solid #fff;
    border-color: ${({ error }) => error ? '#F00' : "#FFF"}
`;

export const MyInput = styled(TextInput)`
    flex: 1;
    padding: 16px 16px;
`;