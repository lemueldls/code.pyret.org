// Defines storageAPI (as a promise) for others to use
var storageAPIDeferred = Q.defer()
var sheetsAPIDeferred = Q.defer()
window.storageAPI = storageAPIDeferred.promise
window.sheetsAPI = sheetsAPIDeferred.promise

window.handleClientLoad = function handleClientLoad(apiKey) {
  gapi.client.setApiKey(apiKey)
  var api = createProgramCollectionAPI("code.pyret.org", true)

  api.then(function(api) {
    storageAPIDeferred.resolve(api)
    var sheetsApi = createSheetsAPI(true)
    sheetsApi.then(function(sheetsAPI) {
      sheetsAPIDeferred.resolve(sheetsAPI)
    })
    sheetsApi.fail(function(error) {
      sheetsAPIDeferred.reject(error)
    })
  })
  api.fail(function(error) {
    storageAPIDeferred.reject(error)
    sheetsAPIDeferred.reject(error)
    console.log("Not logged in; proceeding without login info", error)
  })
}
