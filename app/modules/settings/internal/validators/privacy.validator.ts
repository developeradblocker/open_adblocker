import { OpenADBSettings } from '@/modules/settings/common/settings.types'
import { checkWebRTCPermissions } from '@/modules/features/web-rtc/common/web-rtc.utils'

export const privacyValidator = async (settings: OpenADBSettings): Promise<void> => {
  const { webRTC } = settings?.general ?? {}
  if (typeof webRTC !== 'boolean') {
    throw new Error('Invalid webRTC value')
  }

  if (!webRTC) {
    return
  }

  const permissions = await checkWebRTCPermissions()
  if (!permissions) {
    throw new Error('Permissions for webRTC are not granted')
  }
}
