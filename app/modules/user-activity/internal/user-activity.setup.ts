/**
 * @file
 * This file is part of Open Ad Blocker Browser Extension (https://github.com/developeradblocker/open_adblocker).
 *
 * Open Ad Blocker Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Open Ad Blocker Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Open Ad Blocker Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */
import { dispatcher } from '@/utils/setup-worker'
import { UserActivityMessage, UserActivityMessages } from '@/modules/user-activity/common/user-activity.messages'
import {
  BaseUserClickPayload,
  UserActivityType,
  UserClickActivity,
  UserPageVisited
} from '@/modules/user-activity/common/user-activity.types'
import { logger } from '@/utils/logger/logger'
import { Box } from '@/utils/dispatcher/dispatcher.types'

export const setupUserActivity = (): void => {
  dispatcher().on<UserActivityMessage>(
    UserActivityMessages.activity,
    handleUserActivity,
    false
  )
}

export const handleOnClick = (activity: UserClickActivity<BaseUserClickPayload>): void => {
  const message = `user clicks on "${activity.element}"`
  const hasParams = activity.payload !== undefined

  if (hasParams) {
    logger.info(`${message} with params`, activity.payload)
    return
  }

  logger.info(message)
}

export const handleOnVisitPage = (activity: UserPageVisited): void => {
  logger.info(`user visits a page "${activity.page}"`)
}

type UserActivityHandlers = Record<UserActivityType, () => Promise<void>>

export const handleUserActivity = async (
  { message }: Box<UserActivityMessage>
): Promise<undefined> => {
  const onClick = async (): Promise<void> => {
    handleOnClick(message.payload as UserClickActivity<any>)
  }
  const onPageVisit = async (): Promise<void> => {
    handleOnVisitPage(message.payload as UserPageVisited)
  }
  const handlers: UserActivityHandlers = {
    [UserActivityType.click]: onClick,
    [UserActivityType.visitPage]: onPageVisit
  }

  const { type } = message.payload

  if (!handlers[type]) {
    return
  }

  await handlers[type]()
}
