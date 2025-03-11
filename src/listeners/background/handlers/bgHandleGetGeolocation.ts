// https://github.com/microsoft/TypeScript/issues/11781#issuecomment-2558465179
/// <reference lib="WebWorker" />

import { messageTypes } from '../../../utils/messageTypes'
import { syncKeys } from '../../../utils/syncKeys'
import { getSync, setSync } from '../../../utils/syncStorageUtils'

export type {}
declare const self: ServiceWorkerGlobalScope

const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html'

export async function bgHandleGetGeolocation() {
  await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH)

  const geolocation: GeolocationPosition = await chrome.runtime.sendMessage({
    type: 'offscreen/get-geolocation',
    target: 'offscreen',
  })

  await closeOffscreenDocument()

  await setSync(syncKeys.geolocation, geolocation)
  return geolocation
}

async function hasDocument() {
  // Check all windows controlled by the service worker to see if one
  // of them is the offscreen document with the given path
  const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)
  const matchedClients = await self.clients.matchAll()

  return matchedClients.some((c) => c.url === offscreenUrl)
}

async function setupOffscreenDocument(path: string) {
  //if we do not have a document, we are already setup and can skip
  const creatingOffScreenDocumentPromise = await getSync<Promise<any> | null>(
    messageTypes.creatingOffScreenDocumentPromise
  )
  console.log(
    'creatingOffScreenDocumentPromise',
    creatingOffScreenDocumentPromise
  )
  if (!(await hasDocument())) {
    // create offscreen document
    if (creatingOffScreenDocumentPromise) {
      await creatingOffScreenDocumentPromise
    } else {
      await setSync(
        messageTypes.creatingOffScreenDocumentPromise,
        chrome.offscreen.createDocument({
          url: path,
          reasons: [
            chrome.offscreen.Reason.GEOLOCATION ||
              chrome.offscreen.Reason.DOM_SCRAPING,
          ],
          justification: 'add justification for geolocation use here',
        })
      )

      await creatingOffScreenDocumentPromise
      await setSync(messageTypes.creatingOffScreenDocumentPromise, null)
    }
  }
}

async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return
  }
  await chrome.offscreen.closeDocument()
}
