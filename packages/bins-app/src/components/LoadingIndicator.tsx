import { css } from 'styled-components/native'
import Svg, { Path } from 'react-native-svg'
import { Animated, Platform } from 'react-native'
import { useEffect } from 'react'

const LoadingIndicatorSvg = ({ style, fill = "#14142B", thickness = Platform.OS === 'web' ? '2' : '4' }) => (
  <Svg viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51808 6.3459 2.7612 8.17317C2.00433 10.0004 1.80629 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92893 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12" stroke={fill} strokeWidth={thickness} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
)

if (Platform.OS === 'web') {
  const ele = document.createElement('style')
  ele.innerHTML = css`
    @keyframes rotating {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .rotate {
      animation: rotating 1s linear infinite;
    }
  `
  document.head.appendChild(ele)
}

const LoadingIndicator = ({ style, size, fill }) => {
  const children = <LoadingIndicatorSvg fill={fill} style={{
    width: size,
    height: size,
  }} />
  const finalStyle = {
    position: 'absolute',
    right: 18,
    top: 18,
    width: size,
    height: size,
    ...style,
  }
  return Platform.OS === 'web' ? <div style={finalStyle} className="rotate">{children}</div> : (
    <Animated.View style={finalStyle}>
      {children}
    </Animated.View>
  )
}

export const AnimatedLoadingIndicator = ({ loading, size = 24, style, fill = "#14142B" } : { loading?: boolean; size?: number; style?: any; fill?: string }) => {
  const rotateAnimation = new Animated.Value(0)
  let animation

  useEffect(() => {
    if (!animation) {
      if (loading) {
        animation = Animated.loop(
          Animated.timing(rotateAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        )
        animation.start()
      }
    }
    if (!loading && animation) {
      animation.stop()
    }
  }, [loading])

  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const animatedStyle = {
    ...(style || {}),
    opacity: loading ? 1 : 0,
    transform: [{ rotate: interpolateRotating }],
  }

  return <LoadingIndicator fill={fill} style={animatedStyle} size={size} />
}