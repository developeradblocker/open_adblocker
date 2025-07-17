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

export enum Channel {
  internal = 'internal',
  port = 'port'
}

export type ValuesOf<Type> = {
  -readonly [Property in keyof Type]-?: Property
}

/**
 * Type representing the number of blocked ads.
 */
export type BlockedAdsCounter = number

/**
 * Type representing a domain name without the protocol.
 *
 * @example: 'example.com'
 */
export type Domain = string

/**
 * a simple listener without any parameters and does return nothing
 */
export type SimpleListener = () => Promise<void>

export type UserIdentifier = string
