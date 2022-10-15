import styled from 'styled-components';

export type ButtonScheme = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonContainerProps {
  scheme: ButtonScheme;
}

const buttonSchemes = {
  primary: 'purple',
  secondary: 'orange',
  danger: 'red',
  success: 'green'
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;

  ${props => {
    return `background-color: ${buttonSchemes[props.scheme]}`
  }}
`