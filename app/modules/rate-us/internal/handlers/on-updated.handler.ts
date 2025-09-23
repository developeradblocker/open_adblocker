import { rateUsService } from '@/modules/rate-us/internal/utils'
import InstalledDetails = chrome.runtime.InstalledDetails;

export const onUpdatedHandler = async (details: InstalledDetails): Promise<void> => {
  if (details.reason === 'update' && details.previousVersion < '1.2.0') {
    await chrome.storage.local.remove('RATE_US_SHOWN')
    await rateUsService().visit()
    await rateUsService().rate()
  }
}
