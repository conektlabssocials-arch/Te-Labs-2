import { GLOBAL_SCHOLARSHIP_VIDEO } from '../data/work'
import { SoftwareDetailPage } from './ConektAdsPage'

export default function GlobalScholarshipPage(props) {
  return (
    <SoftwareDetailPage
      {...props}
      copyPrefix="GlobalScholarship"
      imageSrc="/assets/Project/global-scholarship.webp"
      videoSrc={GLOBAL_SCHOLARSHIP_VIDEO}
      externalUrl="https://www.theglobalscholarship.org/"
    />
  )
}
