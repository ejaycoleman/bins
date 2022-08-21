import { Link } from 'react-router-native'
import styled, { css } from 'styled-components/native'
import { primary, primaryDark, primaryLight } from '../colors'
import { LinkSmallBold } from './Text'
import React from 'react'
import { AnimatedLoadingIndicator } from './LoadingIndicator'
import { Platform } from 'react-native'

const buttonStyles = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  align-items: center;
  padding: 16px 24px;
  flex: 1;

  border-radius: 12px;
  background-color: ${primary};
  color: ${primaryDark};
  min-height: 56px;
  max-width: 336px;
  ${Platform.OS === 'web' && css`
    :hover {
      background-color: ${primaryLight};
    }
  `}
`

const buttonVariantStyles = (variant: ButtonVariant) => {
  if (variant === 'text') {
    return css`
      background-color: transparent;
      color: ${primary};
    `
  }

  return ''
}

const ButtonContainer = styled.TouchableOpacity<{ variant: ButtonVariant }>`
  ${buttonStyles}
  ${({ variant }) => buttonVariantStyles(variant)}
`

export type ButtonVariant = 'primary' | 'text'

const ButtonLink = styled(Link)<{ variant: ButtonVariant }>`
  ${buttonStyles}

  ${({ variant }) => buttonVariantStyles(variant)}
`

export const Button = ({ onClick, to, text, disabled, variant = 'primary', loading }: { onClick?: () => void; to?: string; text: string; disabled?: boolean; variant?: ButtonVariant; loading?: boolean }) => {
  if (to) {
    return (
      <ButtonLink variant={variant} to={!disabled && !loading && to} style={disabled && { opacity: 0.6 }} activeOpacity={1}>
        <>
          <LinkSmallBold style={variant === 'text' && { color: primary }}>{text}</LinkSmallBold>
          <AnimatedLoadingIndicator loading={loading} />
        </>
      </ButtonLink>
    )
  } else {
    return (
      <ButtonContainer variant={variant} disabled={disabled || loading} style={disabled && { opacity: 0.6 }} onPress={onClick}>
        <>
          <LinkSmallBold style={variant === 'text' && { color: primary }}>{text}</LinkSmallBold>
          <AnimatedLoadingIndicator loading={loading} />
        </>
      </ButtonContainer>
    )
  }
}
