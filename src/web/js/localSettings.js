// A sessionStorage cache of localStorage to avoid hitting disk.
// localStorage is made consistent with sessionStorage on page unload.
window.localSettings = function() {

  var hasLocalStorage = true
  try {
    window.localStorage
  }
  catch{
    hasLocalStorage = false
  }

  window.addEventListener("beforeunload", function (event) {
    for (const key of Object.keys(sessionStorage)) {
      localStorage.setItem(key, sessionStorage.getItem(key))
    }
  })

  var cache = new Map()
  var listeners = new Map()

  function change(key, f) {
    listeners.set(key, f)
    window.addEventListener('storage', function(e) {
      if (e.storageArea !== localStorage) { return }
      cache.set(e.key, e.newValue)
      if(e.key === key) {
        f(e.oldValue, e.newValue)
      }
    })
  }

  function get(key) {
    return hasLocalStorage ? localStorage.getItem(key) : undefined
  }

  function set(key, value) {
    return hasLocalStorage ? localStorage.setItem(key, value) : undefined
  }
  return {
    change: change,
    getItem: function (key) {
      if (!cache.has(key)) {
        var value = get(key)
        if (value) { cache.set(key, value.toString()) }
        return value
      } else {
        return cache.get(key)
      }
    },
    setItem: function (key, value) {
      var oldValue = cache.get(key)
      set(key, value)
      if(listeners.has(key)) {listeners.get(key)(oldValue, value.toString())}
    }
  }
}()
