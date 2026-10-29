import { FunnelPageComponent } from '@/components/funnel-page'
import { generateStaticParams as getParams } from '@/app/funnels/[slug]/page'

export { getParams as generateStaticParams }

export default function Page() {
  return <FunnelPageComponent slug="50k" />
}