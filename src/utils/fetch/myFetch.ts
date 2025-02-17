import fetchIntercept from 'fetch-intercept'

const unregister = fetchIntercept.register({
  request: async function (url, config) {
    return [url, config]
  },
})

export const myFetch = fetch
