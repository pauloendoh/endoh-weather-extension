// https://github.com/microsoft/TypeScript/issues/11781#issuecomment-2558465179
/// <reference lib="WebWorker" />

export type {}
declare const self: ServiceWorkerGlobalScope

const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html'
let creating: Promise<any> | null = null // A global promise to avoid concurrency issues

export async function bgHandleGetGeolocation() {
  await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH)

  const geolocation: {
    coords: {
      latitude: number
      longitude: number
    }
    toJSON: () => string
  } = await chrome.runtime.sendMessage({
    type: 'offscreen/get-geolocation',
    target: 'offscreen',
  })

  await closeOffscreenDocument()
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
  if (!(await hasDocument())) {
    // create offscreen document
    if (creating) {
      await creating
    } else {
      creating = chrome.offscreen.createDocument({
        url: path,
        reasons: [
          chrome.offscreen.Reason.GEOLOCATION ||
            chrome.offscreen.Reason.DOM_SCRAPING,
        ],
        justification: 'add justification for geolocation use here',
      })

      await creating
      creating = null
    }
  }
}

async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return
  }
  await chrome.offscreen.closeDocument()
}
