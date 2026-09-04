import { TAQTONA_VIDEO } from '../data/work'
import { SoftwareDetailPage } from './ConektAdsPage'

export default function TaqtonaPage(props) {
  return (
    <SoftwareDetailPage
      {...props}
      copyPrefix="Taqtona"
      imageSrc="/assets/Project/taqtona.webp"
      videoSrc={TAQTONA_VIDEO}
    />
  )
}
