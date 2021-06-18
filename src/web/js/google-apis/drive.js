window.createProgramCollectionAPI = function createProgramCollectionAPI(collectionName, immediate) {
  function DriveError(error) {
    this.err = error
  }
  DriveError.prototype = Error.prototype
  var drive
  var SCOPE = "https://www.googleapis.com/auth/drive.file "
    + "https://spreadsheets.google.com/feeds "
    + "https://www.googleapis.com/auth/drive.install"
  var FOLDER_MIME = "application/vnd.google-apps.folder"
  var BACKREF_KEY = "originalProgram"
  var PUBLIC_LINK = "pubLink"

  function createAPI(baseCollection) {
    function makeSharedFile(googFileObject, fetchFromGoogle) {
      return {
        shared: true,
        getOriginal: function() {
          var request = gapi.client.drive.properties.get({
            'fileId': googFileObject.id,
            'propertyKey': BACKREF_KEY,
            'visibility': 'PRIVATE'
          })
          return request
        },
        getContents: function() {
          if(fetchFromGoogle) {
            // NOTE(joe): See https://developers.google.com/drive/v2/web/manage-downloads
            // The `selfLink` field directly returns the resource URL for the file, and
            // this will work as long as the file is public on the web.
            var requestUrl = googFileObject.selfLink
            return Q($.get(requestUrl, {
              alt: "media",
              key: apiKey
            }))
          }
          else {
            return Q($.ajax("/shared-program-contents?sharedProgramId=" + googFileObject.id, {
              method: "get",
              dataType: "text"
            }))
          }
        },
        getName: function() {
          return googFileObject.title
        },
        getModifiedTime: function() {
          return googFileObject.modifiedDate
        },
        getUniqueId: function() {
          return googFileObject.id
        }
      }
    }

    function makeFile(googFileObject, mimeType, fileExtension) {
      return {
        shared: false,
        getName: function() {
          return googFileObject.title
        },
        getModifiedTime: function() {
          return googFileObject.modifiedDate
        },
        getUniqueId: function() {
          return googFileObject.id
        },
        getExternalURL: function() {
          return googFileObject.alternateLink
        },
        getShares: function() {
          return drive.files.list({
            q: "trashed=false and properties has {key='" + BACKREF_KEY + "' and value='" + googFileObject.id + "' and visibility='PRIVATE'}"
          })
            .then(function(files) {
              return !files.items ? [] : files.items.map(fileBuilder)
            })
        },
        getContents: function() {
          var baseUrl = "https://www.googleapis.com/drive/v3/files/" + googFileObject.id + "?alt=media&source=download"
          return Q($.ajax(baseUrl, {
            method: "get",
            dataType: 'text',
            headers: {'Authorization': 'Bearer ' + gapi.auth.getToken().access_token }
          })).then(function(response) {
            return response
          })
        },
        rename: function(newName) {
          return drive.files.update({
            fileId: googFileObject.id,
            resource: {
              'title': newName
            }
          }).then(fileBuilder)
        },
        makeShareCopy: function() {
          var newFile = shareCollection.then(function(c) {
            return Q($.ajax({
              url: "/create-shared-program",
              method: "post",
              data: {
                fileId: googFileObject.id,
                title: googFileObject.title,
                collectionId: c.id
              }
            }))
          })
          return newFile.then(fileBuilder)
        },
        save: function(contents, newRevision) {
          // NOTE(joe): newRevision: false will cause badRequest errors as of
          // April 30, 2014
          if(newRevision) {
            var parameters = { 'newRevision': true }
          }
          else {
            var parameters = {}
          }
          const boundary = '-------314159265358979323846'
          const delimiter = "\r\n--" + boundary + "\r\n"
          const close_delim = "\r\n--" + boundary + "--"
          var metadata = {
            'mimeType': mimeType,
            'fileExtension': fileExtension
          }
          var multipartRequestBody =
              delimiter +
              'Content-Type: application/json\r\n\r\n' +
              JSON.stringify(metadata) +
              delimiter +
              'Content-Type: text/plain\r\n' +
              '\r\n' +
              contents +
              close_delim

          var request = gwrap.request({
            'path': '/upload/drive/v2/files/' + googFileObject.id,
            'method': 'PUT',
            'params': {'uploadType': 'multipart'},
            'headers': {
              'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody})
          return request.then(fileBuilder)
        },
        _googObj: googFileObject
      }
    }

    // The primary purpose of this is to have some sort of fallback for
    // any situation in which the file object has somehow lost its info
    function fileBuilder(googFileObject) {
      return (googFileObject.mimeType === 'text/plain' && !googFileObject.fileExtension)
          || googFileObject.fileExtension === 'arr' ? makeFile(googFileObject, 'text/plain', 'arr') : makeFile(googFileObject, googFileObject.mimeType, googFileObject.fileExtension)
    }

    var api = {
      getCollectionLink: function() {
        return baseCollection.then(function(bc) {
          return "https://drive.google.com/drive/u/0/folders/" + bc.id
        })
      },
      getCollectionFolderId: function() {
        return baseCollection.then(function(bc) { return bc.id })
      },
      getFileById: function(id) {
        return drive.files.get({fileId: id}).then(fileBuilder)
      },
      getFileByName: function(name) {
        return this.getAllFiles().then(function(files) {
          return files.filter(function(f) { return f.getName() === name })
        })
      },
      getCachedFileByName: function(name) {
        return this.getCachedFiles().then(function(files) {
          return files.filter(function(f) { return f.getName() === name })
        })
      },
      getSharedFileById: function(id) {
        var fromDrive = drive.files.get({fileId: id}, true).then(function(googFileObject) {
          return makeSharedFile(googFileObject, true)
        })
        var fromServer = fromDrive.fail(function() {
          return Q($.get("/shared-file", {
            sharedProgramId: id
          })).then(function(googlishFileObject) {
            return makeSharedFile(googlishFileObject, false)
          })
        })
        var result = Q.any([fromDrive, fromServer])
        result.then(function(r) {
          console.log("Got result for shared file:", r)
        }, function(error) {
          console.log("Got failure:", error)
        })
        return result
      },
      getFiles: function(c) {
        return c.then(function(bc) {
          return drive.files.list({ q: "trashed=false and '" + bc.id + "' in parents" })
            .then(function(filesResult) {
              if(!filesResult.items) { return [] }
              return filesResult.items.map(fileBuilder)
            })
        })
      },
      getCachedFiles: function() {
        return this.getFiles(cacheCollection)
      },
      getAllFiles: function() {
        return this.getFiles(baseCollection)
      },
      createFile: function(name, options) {
        options = options || {}
        var mimeType = options.mimeType || 'text/plain'
        var fileExtension = options.fileExtension || 'arr'
        var collectionToSaveIn = options.saveInCache ? cacheCollection : baseCollection
        return collectionToSaveIn.then(function(bc) {
          var requestOptions = {
            'path': '/drive/v2/files',
            'method': 'POST',
            'params': options.params || {},
            'body': {
              'parents': [{id: bc.id}],
              'mimeType': mimeType,
              'title': name
            }
          }
          // Allow the file extension to be omitted
          // (Google can sometime infer from the mime type)
          if (options.fileExtension !== false) {
            requestOptions.body.fileExtension = fileExtension
          }
          var request = gwrap.request(requestOptions)
          return request.then(fileBuilder)
        })
      },
      checkLogin: function() {
        return collection.then(function() { return true })
      }
    }

    var shareCollection = findOrCreateDirectory(collectionName + ".shared")
    var cacheCollection = findOrCreateCacheDirectory(collectionName + ".compiled")

    return {
      api: api,
      collection: baseCollection,
      cacheCollection: cacheCollection,
      shareCollection: shareCollection,
      reinitialize: function() {
        return Q.fcall(function() { return initialize(drive) })
      }
    }
  }

  function findOrCreateDirectory(name) {
    var q = "('me' in owners) and trashed=false and title='" + name + "' and "+
        "mimeType='" + FOLDER_MIME + "'"
    var filesRequest = drive.files.list({
      q: q
    })
    var collection = filesRequest.then(function(files) {
      if(files.items && files.items.length > 0) {
        return files.items[0]
      }
      else {
        var dir = drive.files.insert({
          resource: {
            mimeType: FOLDER_MIME,
            title: name
          }
        })
        return dir
      }
    })
    return collection
  }

  function findOrCreateCacheDirectory() {
    return findOrCreateDirectory(collectionName + ".compiled")
  }

  function initialize(wrappedDrive) {
    drive = wrappedDrive
    var baseCollection = findOrCreateDirectory(collectionName)
    return createAPI(baseCollection)
  }

  var returnValue = Q.defer()
  gwrap.load({name: 'drive',
    version: 'v2',
    reauth: {
      immediate: immediate
    },
    callback: function(drive) {
      returnValue.resolve(initialize(drive))
    }})
  return returnValue.promise
}
