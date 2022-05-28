import { Link } from 'react-router-native'
import styled, { css } from 'styled-components/native'
import { primary, primaryDark, primaryLight } from '../colors'
import { LinkSmall } from './Text'

const buttonStyles = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;

  border-radius: 12px;
  background-color: ${primary};
  color: ${primaryDark};

  cursor: pointer;

  :hover {
    background-color: ${primaryLight};
  }
`

const ButtonContainer = styled.TouchableOpacity`
  ${buttonStyles}
`

const ButtonLink = styled(Link)`
  ${buttonStyles}
`

export const Button = ({ onClick, to, text, disabled }: { onClick?: () => void; to?: string; text: string; disabled?: boolean }) => {
  if (to) {
    return <ButtonLink to={!disabled && to} style={disabled && { opacity: 0.6 }}><LinkSmall>{text}</LinkSmall></ButtonLink>
  } else {
    return <ButtonContainer disabled={disabled} style={disabled && { opacity: 0.6 }} onPress={onClick}><LinkSmall>{text}</LinkSmall></ButtonContainer>
  }
}
