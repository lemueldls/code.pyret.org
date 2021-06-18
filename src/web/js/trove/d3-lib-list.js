({
  requires: [{ "import-type": "builtin", name: "image-lib" }],
  nativeRequires: ["pyret-base/js/js-numbers", "d3"],
  provides: {},
  theModule: function (RUNTIME, NAMESPACE, uri, IMAGELIB, jsnums, d3) {
    var IMAGE = RUNTIME.getField(IMAGELIB, "internal")

    function assert(value, message) {
      if (!value) {
        throw new Error("Assertion failed: " + (message || ""))
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // libNum
    ////////////////////////////////////////////////////////////////////////////

    function scaler(oldX, oldY, newX, newY, toFixnum) {
      /*
       * Produces a scaler function to convert a value in
       * an interval to another value in a new interval
       *
       * @param {jsnums} oldX
       * @param {jsnums} oldY
       * @param {jsnums} newX
       * @param {jsnums} newY
       * @param {boolean} toFixnum: if true, the result is converted to fixnum
       * @return {jsnums -> jsnums}
       */
      return function (k) {
        var oldDiff = jsnums.subtract(k, oldX, RUNTIME.NumberErrbacks)
        var oldRange = jsnums.subtract(oldY, oldX, RUNTIME.NumberErrbacks)
        var portion = jsnums.divide(oldDiff, oldRange, RUNTIME.NumberErrbacks)
        var newRange = jsnums.subtract(newY, newX, RUNTIME.NumberErrbacks)
        var newPortion = jsnums.multiply(
          portion,
          newRange,
          RUNTIME.NumberErrbacks
        )
        var result = jsnums.add(newPortion, newX, RUNTIME.NumberErrbacks)
        return toFixnum
          ? jsnums.toFixnum(result, RUNTIME.NumberErrbacks)
          : result
      }
    }

    function random(a, b) {
      return Math.floor(Math.random() * (b - a + 1)) + a
    }

    function getPrettyNumberToStringDigits(digits) {
      return function (number) {
        return jsnums
          .toStringDigits(number, digits, RUNTIME.NumberErrbacks)
          .replace(/\.?0*$/, "")
      }
    }

    function between(b, a, c) {
      return (
        (jsnums.lessThanOrEqual(a, b, RUNTIME.NumberErrbacks) &&
          jsnums.lessThanOrEqual(b, c, RUNTIME.NumberErrbacks)) ||
        (jsnums.lessThanOrEqual(c, b, RUNTIME.NumberErrbacks) &&
          jsnums.lessThanOrEqual(b, a, RUNTIME.NumberErrbacks))
      )
    }

    function numberMin(a, b) {
      /* ignore the rest */
      // this ignores other arguments, making reducing on numMin possible
      return RUNTIME.num_min(a, b)
    }

    function numberMax(a, b) {
      /* ignore the rest */
      // this ignores other arguments, making reducing on numMin possible
      return RUNTIME.num_max(a, b)
    }

    var libraryNumber = {
      scaler: scaler,
      between: between,
      getPrettyNumToStringDigits: getPrettyNumberToStringDigits,
      numMin: numberMin,
      numMax: numberMax,
      random: random,
    }

    ////////////////////////////////////////////////////////////////////////////
    // libJS
    ////////////////////////////////////////////////////////////////////////////

    function drawImage(options) {
      /*
       * Writes an image into a canvas taking into
       * account the backing store pixel ratio and
       * the device pixel ratio.
       *
       * http://www.html5rocks.com/en/tutorials/canvas/hidpi/
       *
       * @author Paul Lewis
       * @param {Object} opts The params for drawing an image to the canvas
       */
      if (!options.canvas) {
        throw "A canvas is required"
      }
      if (!options.image) {
        throw "Image is required"
      }

      // get the canvas and context
      var canvas = options.canvas
      var context = canvas.getContext("2d")
      var image = options.image
      // now default all the dimension info
      var srcx = options.srcx || 0
      var srcy = options.srcy || 0
      var srcw = options.srcw || image.naturalWidth
      var srch = options.srch || image.naturalHeight
      var desx = options.desx || srcx
      var desy = options.desy || srcy
      var desw = options.desw || srcw
      var desh = options.desh || srch
      var auto = options.auto
      // finally query the various pixel ratios
      var devicePixelRatio = window.devicePixelRatio || 1
      var backingStoreRatio =
          context.webkitBackingStorePixelRatio ||
          context.mozBackingStorePixelRatio ||
          context.msBackingStorePixelRatio ||
          context.oBackingStorePixelRatio ||
          context.backingStorePixelRatio ||
          1
      var ratio = devicePixelRatio / backingStoreRatio

      // ensure we have a value set for auto.
      // If auto is set to false then we
      // will simply not upscale the canvas
      // and the default behaviour will be maintained
      if (typeof auto === "undefined") {
        auto = true
      }

      // upscale the canvas if the two ratios don't match
      if (auto && devicePixelRatio !== backingStoreRatio) {
        var oldWidth = canvas.width
        var oldHeight = canvas.height

        canvas.width = oldWidth * ratio
        canvas.height = oldHeight * ratio

        canvas.style.width = oldWidth + "px"
        canvas.style.height = oldHeight + "px"

        // now scale the context to counter
        // the fact that we've manually scaled
        // our canvas element
        context.scale(ratio, ratio)
      }

      context.drawImage(image, srcx, srcy, srcw, srch, desx, desy, desw, desh)
      return canvas
    }

    function getBoundingClientRect(element) {
      /*
       * Find the bounding box of elem
       *
       * @param {element} elem
       * @return {object}
       */
      var div = d3.select("body").append("div")
      div.node().append(element.cloneNode(true))
      var bbox = div.node().firstChild.getBoundingClientRect()
      div.remove()
      return bbox
    }

    function getBBox(svg) {
      /*
       * Find the bounding box of svg elem
       *
       * @param {element} svg
       * @return {object}
       */
      var div = d3.select("body").append("div")
      div.node().append(svg.cloneNode(true))
      var bbox = div.node().firstChild.getBBox()
      div.remove()
      return bbox
    }

    function htmlspecialchars(text) {
      var div = document.createElement("div")
      var textNode = document.createTextNode(text)
      div.append(textNode)
      return div.innerHTML
    }

    var libraryJS = {
      getBBox: getBBox,
      getBoundingClientRect: getBoundingClientRect,
      htmlspecialchars: htmlspecialchars,
    }

    ////////////////////////////////////////////////////////////////////////////
    // libData
    ////////////////////////////////////////////////////////////////////////////

    function lastElement(array) {
      /*
       * Produces the last element of arr
       *
       * @param {array} arr
       * @return {Any}
       */
      return array[array.length - 1]
    }

    function flatten(lst) {
      /*
       * Flatten the list
       *
       * @param {array} lst
       * @return {array}
       */
      return lst.flat()
    }

    function fill(n, v) {
      var index
      var returnValue = []
      for (index = 0; index < n; index++) {
        returnValue.push(v)
      }
      return returnValue
    }

    function range(st, ed) {
      var index
      var returnValue = []
      for (index = st; index < ed; index++) {
        returnValue.push(index)
      }
      return returnValue
    }

    function shuffle(o) {
      //+ Jonas Raoni Soares Silva
      //@ http://jsfromhell.com/array/shuffle [v1.0]
      for (
        var index, x, index_ = o.length;
        index_;
        index = Math.floor(Math.random() * index_), x = o[--index_], o[index_] = o[index], o[index] = x
      );
      return o
    }

    var libraryData = {
      lastElement: lastElement,
      flatten: flatten,
      fill: fill,
      range: range,
      shuffle: shuffle,
    }

    ////////////////////////////////////////////////////////////////////////////
    // libColor
    ////////////////////////////////////////////////////////////////////////////

    function getContrast(r, g, b) {
      /*
       * http://24ways.org/2010/calculating-color-contrast/
       */
      return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? "black" : "white"
    }

    function convertColor(v) {
      function p(pred, name) {
        return function (value) {
          RUNTIME.makeCheckType(pred, name)(value)
          return value
        }
      }

      var colorDatabase = IMAGE.colorDb
      var _checkColor = p(IMAGE.isColorOrColorString, "Color")

      function checkColor(value) {
        var aColor = _checkColor(value)
        if (colorDatabase.get(aColor)) {
          aColor = colorDatabase.get(aColor)
        }
        return aColor
      }

      return IMAGE.colorString(checkColor(v))
    }

    function changeColor(r, g, b, d) {
      r += d
      b += d
      g += d

      if (r > 255) r = 255
      else if (r < 0) r = 0

      if (b > 255) b = 255
      else if (b < 0) b = 0

      if (g > 255) g = 255
      else if (g < 0) g = 0

      return "rgba(" + r + "," + g + "," + b + ",255)"
    }

    var libraryColor = {
      getContrast: getContrast,
      convertColor: convertColor,
      changeColor: changeColor,
    }

    ////////////////////////////////////////////////////////////////////////////
    // d3common
    ////////////////////////////////////////////////////////////////////////////

    function getDimension(object, windowOptions) {
      var xscale = RUNTIME.getField(windowOptions, "_extend-x")
      var yscale = RUNTIME.getField(windowOptions, "_extend-y")

      if (!("maxWindowWidth" in object)) {
        object.maxWindowWidth = 1250
      }
      if (!("maxWindowHeight" in object)) {
        object.maxWindowHeight = 620
      }

      if (!("outerMarginLeft" in object)) {
        object.outerMarginLeft = 0
      }
      if (!("outerMarginRight" in object)) {
        object.outerMarginRight = 0
      }
      if (!("outerMarginTop" in object)) {
        object.outerMarginTop = 0
      }
      if (!("outerMarginBottom" in object)) {
        object.outerMarginBottom = 0
      }

      object.windowWidth = scaler(
        0,
        1,
        object.minWindowWidth,
        object.maxWindowWidth,
        true
      )(xscale)
      object.windowHeight = scaler(
        0,
        1,
        object.minWindowHeight,
        object.maxWindowHeight,
        true
      )(yscale)

      object.svgWidth =
        object.windowWidth - object.outerMarginLeft - object.outerMarginRight
      object.svgHeight =
        object.windowHeight - object.outerMarginTop - object.outerMarginBottom - 60 // title bar

      object.width = Math.floor(object.svgWidth - object.marginLeft - object.marginRight)
      object.height = Math.floor(object.svgHeight - object.marginTop - object.marginBottom)
      return object
    }

    function svgTranslate(x, y) {
      if (y === undefined) {
        return "translate(" + x.toString() + ")"
      }
      return "translate(" + x.toString() + "," + y.toString() + ")"
    }

    function createDiv() {
      /*
       * Creates a blank div
       *
       * @return {d3 selection}
       */
      return d3.select(document.createElement("div")).attr("class", "maind3")
    }

    function createCanvas(detached, dimension) {
      /*
       * Creates a canvas
       */
      var divSvg = detached
        .append("div")
        .attr("class", "divsvg")
        .style({
          left: dimension.outerMarginLeft + "px",
          top: dimension.outerMarginTop + "px",
          position: "absolute",
        })
      var canvas = divSvg
        .append("svg")
        .attr("width", dimension.svgWidth)
        .attr("height", dimension.svgHeight)
        .append("g")
        .attr("class", "maing")
        .append("g")

      var transformation = null
      switch (dimension.mode) {
        case "top-left":
          transformation = svgTranslate(
            dimension.marginLeft,
            dimension.marginTop
          )
          break
        case "center":
          transformation = svgTranslate(
            dimension.marginLeft + dimension.width / 2,
            dimension.marginTop + dimension.height / 2
          )
          break
        default:
          throw 'mode "' + dimension.mode + '" not implemented'
      }
      return canvas.attr("transform", transformation)
    }

    /*

    NOTE(joe): The idea comes from https://stackoverflow.com/a/33227005/2718315

    A previous strategy using base64 encoding didn't work with unicode characters

  */
    function getImageAsURL(detached) {
      detached
        .select("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
      var svgString = new XMLSerializer().serializeToString(
        detached.node().firstChild.firstChild
      )
      return "data:image/svg+xml;charset=utf8," + encodeURIComponent(svgString)
    }

    function onSave(detached) {
      var svgData = detached.append("div").style("display", "none")
      var imgsrc = getImageAsURL(detached)
      var svg = detached.select("svg")
      var canvas = detached
        .append("canvas")
        .style("display", "none")
        .attr("width", svg.attr("width"))
        .attr("height", svg.attr("height"))
      svgData.html('<img src="' + imgsrc + '">')

      var image = new Image()
      image.src = imgsrc
      image.addEventListener('load', function () {
        var options = {
          canvas: canvas.node(),
          image: image,
        }
        var a = document.createElement("a")
        a.download = "sample.png"
        a.href = drawImage(options).toDataURL("image/png")
        a.click()

        // somehow the image's size was doubled everytime we click
        // the button, so remove all data to prevent this
        // to happen
        svgData.remove()
        canvas.remove()
      })
    }

    function callBigBang(
      detached,
      restarter,
      resizer,
      windowOptions,
      dimension,
      returnValueValueFunction,
      extra
    ) {
      detached
        .select(".maing")
        .append("text")
        .attr(
          "x",
          (dimension.marginLeft + dimension.width + dimension.marginRight) / 2
        )
        .attr("y", (5 * dimension.marginTop) / 11)
        .html(libraryJS.htmlspecialchars(RUNTIME.getField(windowOptions, "_title")))
        .style({
          position: "absolute",
          "font-size": "10pt",
          "text-anchor": "middle",
          "font-weight": "bold",
        })

      detached.selectAll(".overlay").style({
        fill: "none",
        "pointer-events": "all",
      })

      if (returnValueValueFunction === null) {
        returnValueValueFunction = function (restarter) {
          imageReturn(detached, restarter, function (x) {
            return x
          })
        }
      }

      if (RUNTIME.isPyretFalse(RUNTIME.getField(windowOptions, "_interact"))) {
        return RUNTIME.pauseStack(returnValueValueFunction)
      }

      var xscaler = libraryNumber.scaler(
        dimension.minWindowWidth,
        dimension.maxWindowWidth,
        0,
        1
      )

      var yscaler = libraryNumber.scaler(
        dimension.minWindowHeight,
        dimension.maxWindowHeight,
        0,
        1
      )

      var pauseStack

      pauseStack = RUNTIME.isNothing(restarter) ? RUNTIME.pauseStack : function (callback) {
        callback(restarter)
      }

      return pauseStack(function (restarter) {
        if (extra !== null) {
          extra(restarter)
        }
        // detached.selectAll('.d3btn').style({
        //   'margin-right': '5px'
        // });
        RUNTIME.getParam("d3-port")(
          detached.node(),
          function (baseOption) {
            baseOption.width = dimension.windowWidth
            baseOption.height = dimension.windowHeight
            baseOption.minWidth = dimension.minWindowWidth
            baseOption.maxWidth = dimension.maxWindowWidth
            baseOption.minHeight = dimension.minWindowHeight - 11
            baseOption.maxHeight = dimension.maxWindowHeight - 11
            return baseOption
          },
          function () {
            returnValueValueFunction(restarter)
          },
          [
            {
              click: function () {
                var width = jsnums.fromFixnum(
                  $(".maind3").parent().parent().width()
                )
                var height = jsnums.fromFixnum(
                  $(".maind3").parent().parent().height() + 11
                )
                RUNTIME.getParam("remove-d3-port")()
                resizer(
                  restarter,
                  RUNTIME.extendObj(
                    RUNTIME.makeSrcloc("dummy location"),
                    windowOptions,
                    {
                      "_extend-x": xscaler(width),
                      "_extend-y": yscaler(height),
                    }
                  )
                )
              },
              icon: "ui-icon-arrowthick-2-se-nw",
            },
            {
              click: function () {
                onSave(detached)
              },
              icon: "ui-icon-disk",
            },
          ]
        )
      })
    }

    function stylizeTip(detached) {
      /*
       * Add styles for tooltip
       *
       * @param {d3 selection} detached
       */
      detached.selectAll(".d3-tip").style({
        background: "rgba(0, 0, 0, 0.8)",
        "line-height": "1.5",
        "font-weight": "bold",
        "font-size": "8pt",
        color: "#fff",
        padding: "10px",
        "border-radius": "2px",
      })
    }

    var d3common = {
      getDimension: getDimension,
      svgTranslate: svgTranslate,
      createDiv: createDiv,
      createCanvas: createCanvas,
      callBigBang: callBigBang,
      stylizeTip: stylizeTip,
    }

    function imageReturn(detached, restarter, hook) {
      var url = getImageAsURL(detached)
      var rawImage = new Image()
      rawImage.addEventListener('load', function () {
        restarter.resume(
          hook(
            RUNTIME.makeOpaque(
              IMAGE.makeFileImage(url, rawImage),
              IMAGE.imageEquals
            )
          )
        )
      })
      rawImage.addEventListener('error', function (e) {
        restarter.error(
          RUNTIME.ffi.makeMessageException(
            "unable to load the image: " + e.message
          )
        )
      })
      rawImage.src = url
    }

    return RUNTIME.makeJSModuleReturn({
      libData: libraryData,
      libNum: libraryNumber,
      libJS: libraryJS,
      libColor: libraryColor,
      d3common: d3common,
      assert: assert,
      imageReturn: imageReturn,
    })
  },
})
