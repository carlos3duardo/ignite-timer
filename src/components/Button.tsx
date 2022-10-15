import { ButtonContainer, ButtonScheme } from './Button.styles'

interface ButtonInterface {
  scheme?: ButtonScheme
}

export function Button({ scheme = 'primary' }: ButtonInterface) {
  return <ButtonContainer scheme={scheme}>Enviar</ButtonContainer>
}
