import { OpenADBSettings, settingsSchema } from '@/modules/settings/common/settings.types'

export const structureValidator = async (settings: OpenADBSettings): Promise<void> => {
  settingsSchema.parse(settings)
}
