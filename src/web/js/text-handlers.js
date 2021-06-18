({
  requires: [
  ],
  nativeRequires: [
  ],
  provides: {},
  theModule: function(runtime, _, uri) {

    function autoCorrect(instance, changeObject, cm){
      $('.notificationArea .autoCorrect').remove()
      var originalText = changeObject.text
      var curlyq = change([[/\u201D/g, "\""],
        [/\u201C/g, "\""],
        [/\u2019/g, "\'"],
        [/\u2018/g, "\'"]], changeObject, cm)
      var endash = change([[/\u2013/g, "-"]], changeObject, cm)
      if (curlyq && endash) {
        autoCorrectUndo("Curly Quotes and Invalid Dash (en dash) converted", originalText, changeObject.from, cm)
      }
      else if (curlyq) {
        autoCorrectUndo("Curly Quotes converted", originalText, changeObject.from, cm)
      }
      else if (endash) {
        autoCorrectUndo("Invalid Dash (en dash) converted", originalText, changeObject.from, cm)
      }
    }

    function change(pairs, changeObject, cm){
      changed = false
      if(changeObject.origin == "paste"){
        var newText = jQuery.map(changeObject.text, function(string, index) {
          var newString = string
          for(const pair of pairs) {
            newString = newString.replace(pair[0], pair[1])
          }
          changed = changed || (newString !== string)
          return newString
        })
        if (changed) {
          changeObject.update(undefined, undefined, newText)
        }
      }
      return changed
    }

    function autoCorrectUndo(message, oldText, from, cm){
      var lineN = oldText.length - 1
      var to = {line: from.line + lineN, ch: from.ch + oldText[lineN].length}
      console.log(from, to)
      var container = $('<div>').addClass("autoCorrect")
      var message_ = $("<span>").addClass("autoCorrect-msg").text(message)
      var button = $("<span>").addClass("autoCorrect-button").text("Click to Undo")
      container.append(message_).append(button)
      container.click(function(){
        cm.replaceRange(oldText, from, to)
      })
      $(".notificationArea").prepend(container)
      container.delay(15_000).fadeOut(3000)
    }

    return runtime.makeJSModuleReturn({
      autoCorrect: autoCorrect

    })
  }
})