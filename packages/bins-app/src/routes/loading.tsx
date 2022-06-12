import { AnimatedLoadingIndicator } from '../components/LoadingIndicator'

export const Loading = ({ style }: { style?: any }) => (
  <AnimatedLoadingIndicator fill="white" loading style={style} />
)