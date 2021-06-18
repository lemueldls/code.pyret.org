({
  requires: [
    { "import-type": "builtin", "name": "image-lib" },
    { "import-type": "builtin", "name": "make-image" }
  ],
  nativeRequires: [
    "pyret-base/js/js-numbers",
  ],
  provides: {
    shorthands: {
      "Image": { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://image-lib" },
        name: "Image" },
      "FillMode": "String",
      "FontFamily": "String",
      "FontStyle": "String",
      "FontWeight": "String",
      "XPlace": "String",
      "YPlace": "String",
      "ColorString": "String",
      "Color": { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://color" },
        name: "Color" },
      "OptColor": ["tyapp", { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://option" },
        name: "Option" },
      [{ tag: "name",
        origin: { "import-type": "uri", uri: "builtin://color" },
        name: "Color" }]],
      "Either": { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://either" },
        name: "Either" },
      "LoC": ["tyapp", { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://lists" },
        name: "List" },
      [{ tag: "name",
        origin: { "import-type": "uri", uri: "builtin://color" },
        name: "Color" }]],
      "LoI": ["tyapp", { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://lists" },
        name: "List" },
      [{ tag: "name",
        origin: { "import-type": "uri", uri: "builtin://image-lib" },
        name: "Image" }]],
      "LoP": ["tyapp", { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://lists" },
        name: "List" },
      [{ tag: "name",
        origin: { "import-type": "uri", uri: "builtin://internal-image-shared" },
        name: "Point" }]],
    },
    values: {
      "circle": ["arrow", ["Number", "FillMode", "ColorString"], "Image"],
      "is-image-color": ["arrow", ["tany"], "Boolean"],
      "is-mode": ["arrow", ["tany"], "Boolean"],
      "is-x-place": ["arrow", ["tany"], "Boolean"],
      "is-y-place": ["arrow", ["tany"], "Boolean"],
      "is-angle": ["arrow", ["tany"], "Boolean"],
      "is-side-count": ["arrow", ["tany"], "Boolean"],
      "is-step-count": ["arrow", ["tany"], "Boolean"],
      "is-image": ["arrow", ["tany"], "Boolean"],
      "image-url": ["arrow", ["String"], "Image"],
      "images-equal": ["arrow", ["Image", "Image"], "Boolean"],
      "images-difference": ["arrow", ["Image", "Image"], ["tyapp", "Either", ["String", "Number"]]],
      "text": ["arrow", ["String", "Number", "ColorString"], "Image"],
      "text-font": ["arrow",
        ["String", "Number", "ColorString", "String", "FontFamily", "FontStyle", "FontWeight", "Boolean"],
        "Image"],
      "overlay": ["arrow", ["Image", "Image"], "Image"],
      "overlay-list": ["arrow", ["LoI"], "Image"],
      "overlay-xy": ["arrow", ["Image", "Number", "Number", "Image"], "Image"],
      "overlay-align": ["arrow", ["XPlace", "YPlace", "Image", "Image"], "Image"],
      "overlay-align-list": ["arrow", ["XPlace", "YPlace", "LoI"], "Image"],
      "overlay-onto-offset": ["arrow",
        ["Image", "XPlace", "YPlace", "Number", "Number", "Image", "XPlace", "YPlace"],
        "Image"],
      "underlay": ["arrow", ["Image", "Image"], "Image"],
      "underlay-list": ["arrow", ["LoI"], "Image"],
      "underlay-xy": ["arrow", ["Image", "Number", "Number","Image"], "Image"],
      "underlay-align": ["arrow", ["XPlace", "YPlace", "Image", "Image"], "Image"],
      "underlay-align-list": ["arrow", ["XPlace", "YPlace", "LoI"], "Image"],
      "beside": ["arrow", ["Image", "Image"], "Image"],
      "beside-list": ["arrow", ["LoI"], "Image"],
      "beside-align": ["arrow", ["YPlace", "Image", "Image"], "Image"],
      "beside-align-list": ["arrow", ["YPlace", "LoI"], "Image"],
      "above": ["arrow", ["Image", "Image"], "Image"],
      "above-list": ["arrow", ["LoI"], "Image"],
      "above-align": ["arrow", ["XPlace", "Image", "Image"], "Image"],
      "above-align-list": ["arrow", ["XPlace", "LoI"], "Image"],
      "below": ["arrow", ["Image", "Image"], "Image"],
      "below-list": ["arrow", ["LoI"], "Image"],
      "below-align": ["arrow", ["XPlace", "Image", "Image"], "Image"],
      "below-align-list": ["arrow", ["XPlace", "LoI"], "Image"],
      "empty-scene": ["arrow", ["Number", "Number"], "Image"],
      "empty-color-scene": ["arrow", ["Number", "Number", "ColorString"], "Image"],
      "put-image": ["arrow", ["Image", "Number", "Number", "Image"], "Image"],
      "translate": ["arrow", ["Image", "Number", "Number", "Image"], "Image"],
      "place-image": ["arrow", ["Image", "Number", "Number", "Image"], "Image"],
      "place-image-align": ["arrow", ["Image", "Number", "Number", "XPlace", "YPlace", "Image"], "Image"],
      "move-pinhole": ["arrow", ["Number", "Number", "Image"], "Image"],
      "place-pinhole": ["arrow", ["Number", "Number", "Image"], "Image"],
      "center-pinhole": ["arrow", ["Image"], "Image"],
      "rotate": ["arrow", ["Number", "Image"], "Image"],
      "scale": ["arrow", ["Number", "Image"], "Image"],
      "scale-xy": ["arrow", ["Number", "Number", "Image"], "Image"],
      "flip-horizontal": ["arrow", ["Image"], "Image"],
      "flip-vertical": ["arrow", ["Image"], "Image"],
      "reflect-x": ["arrow", ["Image"], "Image"],
      "reflect-y": ["arrow", ["Image"], "Image"],
      "frame": ["arrow", ["Image"], "Image"],
      "draw-pinhole": ["arrow", ["Image"], "Image"],
      "crop": ["arrow", ["Number", "Number", "Number", "Number", "Image"], "Image"],
      "line": ["arrow", ["Number", "Number", "ColorString"], "Image"],
      "add-line": ["arrow", ["Image", "Number", "Number", "Number", "Number", "ColorString"], "Image"],
      "scene-line": ["arrow", ["Image", "Number", "Number", "Number", "Number", "ColorString"], "Image"],
      "square": ["arrow", ["Number", "FillMode", "ColorString"], "Image"],
      "rectangle": ["arrow", ["Number", "Number", "FillMode", "ColorString"], "Image"],
      "regular-polygon": ["arrow", ["Number", "Number", "FillMode", "ColorString"], "Image"],
      "point-polygon": ["arrow", ["LoP", "FillMode", "ColorString"], "Image"],
      "ellipse": ["arrow", ["Number", "Number", "FillMode", "ColorString"], "Image"],
      "wedge": ["arrow", ["Number", "Number", "FillMode", "ColorString"], "Image"],
      "triangle": ["arrow", ["Number", "FillMode", "ColorString"], "Image"],
      "triangle-sas": ["arrow", ["Number", "Number", "Number", "FillMode", "ColorString"], "Image"],
      "triangle-sss": ["arrow", ["Number", "Number", "Number", "FillMode", "ColorString"], "Image"],
      "triangle-ass": ["arrow", ["Number", "Number", "Number", "FillMode", "ColorString"], "Image"],
      "triangle-ssa": ["arrow", ["Number", "Number", "Number", "FillMode", "ColorString"], "Image"],
      "triangle-aas": ["arrow", ["Number", "Number", "Number", "FillMode", "ColorString"], "Image"],
      "triangle-asa": ["arrow", ["Number", "Number", "Number", "FillMode", "ColorString"], "Image"],
      "triangle-saa": ["arrow", ["Number", "Number", "Number", "FillMode", "ColorString"], "Image"],
      "right-triangle": ["arrow", ["Number", "Number", "FillMode", "ColorString"], "Image"],
      "isosceles-triangle": ["arrow", ["Number", "Number", "FillMode", "ColorString"], "Image"],
      "star": ["arrow", ["Number", "FillMode", "ColorString"], "Image"],
      "star-sized": ["arrow", ["Number", "Number", "Number", "FillMode", "ColorString"], "Image"],
      "radial-star": ["arrow", ["Number", "Number", "Number", "FillMode", "ColorString"], "Image"],
      "star-polygon": ["arrow", ["Number", "Number", "Number", "FillMode", "ColorString"], "Image"],
      "rhombus": ["arrow", ["Number", "Number", "FillMode", "ColorString"], "Image"],
      "image-to-color-list": ["arrow", ["Image"], "LoC"],
      "color-list-to-image": ["arrow", ["LoC", "Number", "Number", "Number", "Number"], "Image"],
      "color-at-position": ["arrow", ["Image", "Number", "Number"], "Color"],
      "color-list-to-bitmap": ["arrow", ["LoC", "Number", "Number"], "Image"],
      "image-width": ["arrow", ["Image"], "Number"],
      "image-height": ["arrow", ["Image"], "Number"],
      "image-baseline": ["arrow", ["Image"], "Number"],
      "image-pinhole-x": ["arrow", ["Image"], "Number"],
      "image-pinhole-y": ["arrow", ["Image"], "Number"],
      "name-to-color": ["arrow", ["String"], "OptColor"],
      "color-named": ["arrow", ["String"], "Color"],
      "empty-image": "Image"
    },
    aliases: {
      "Image": { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://image-lib" },
        name: "Image" }
    }
  },
  theModule: function(runtime, namespace, uri, imageLibrary, makeImage, jsnums) {
    var ffi = runtime.ffi

    var isString = runtime.isString

    console.log("From untyped:", imageLibrary)

    var image = runtime.getField(imageLibrary, "internal")
    var colorDatabase = image.colorDb

    const checkArity = ffi.checkArity
    const c = function(name, ...argumentsAndAnns) {
      runtime.checkArgsInternalInline("image-untyped", name, ...argumentsAndAnns)
    }
    const c1 = function(name, argument, ann) {
      runtime.checkArgsInternal1("image-untyped", name, argument, ann)
    }
    const c2 = function(name, argument1, ann1, argument2, ann2) {
      runtime.checkArgsInternal2("image-untyped", name, argument1, ann1, argument2, ann2)
    }
    const c3 = function(name, argument1, ann1, argument2, ann2, argument3, ann3) {
      runtime.checkArgsInternal3("image-untyped", name, argument1, ann1, argument2, ann2, argument3, ann3)
    }

    var ann = function(name, pred) {
      return runtime.makePrimitiveAnn(name, pred)
    }

    var identity = function(x) { return x }

    var isPlaceX = function(x) {
      return (isString(x) &&
              (x.toString().toLowerCase() == "left"  ||
               x.toString().toLowerCase() == "right" ||
               x.toString().toLowerCase() == "center" ||
               x.toString().toLowerCase() == "pinhole" ||
               x.toString().toLowerCase() == "middle"))
    }
    var isPlaceY = function(x) {
      return (isString(x) &&
              (x.toString().toLowerCase() == "top"	  ||
               x.toString().toLowerCase() == "bottom"   ||
               x.toString().toLowerCase() == "baseline" ||
               x.toString().toLowerCase() == "center"   ||
               x.toString().toLowerCase() == "pinhole"  ||
               x.toString().toLowerCase() == "middle"))
    }

    var checkImagePred = function(value) {
      return runtime.isOpaque(value) && image.isImage(value.val)
    }
    var checkScenePred = function(value) {
      return runtime.isOpaque(value) && image.isScene(value.val)
    }

    var unwrapPoint2D = function(value) {
      var gf = runtime.getField
      var hf = runtime.hasField
      if (hf(value, "r") && hf(value, "theta")) {
        var r = jsnums.toFixnum(gf(value, "r"))
        var theta = jsnums.toFixnum(gf(value, "theta"))
        return { x: r * Math.cos(theta), y: r * Math.sin(theta) }
      }
      return { x: jsnums.toFixnum(gf(value, "x")), y: jsnums.toFixnum(gf(value, "y")) }
    }

    var annListImage = ann("List<Image>", function(value) {
      if (!runtime.ffi.isList(value)) return false
      var current = value
      var gf = runtime.getField
      while (runtime.unwrap(ffi.isLink(current))) {
        var f = gf(current, "first")
        if (!checkImagePred(f)) return false
        current = gf(current, "rest")
      }
      return true
    })

    var unwrapColor = function(value) {
      var aColor = value
      if (colorDatabase.get(aColor)) {
        aColor = colorDatabase.get(aColor)
      }
      return aColor
    }

    const ANNOTS = {
      annString: runtime.String,
      annNumber: runtime.Number,
      annPositive: runtime.NumPositive,
      annNumNonNegative: runtime.NumNonNegative,
      annByte: ann("Number between 0 and 255", function(value) {
        return runtime.isNumber(value)
          && jsnums.greaterThanOrEqual(value, 0, runtime.NumberErrbacks)
          && jsnums.greaterThanOrEqual(255, value, runtime.NumberErrbacks)
      }),
      annReal: ann("Real Number", function(value) {
        return runtime.isNumber(value) && jsnums.isReal(value)
      }),
      annNatural: ann("Natural Number", function(value) {
        return runtime.isNumber(value) && jsnums.isInteger(value)
          && jsnums.greaterThanOrEqual(value, 0, runtime.NumberErrbacks)
      }),
      unwrapColor: unwrapColor,
      annColor: ann("Color", image.isColorOrColorString),
      annPoint2D: image.annPoint,
      annMode: ann("Mode (\"outline\" or \"solid\")", function(x) {
        return (isString(x) &&
                (x.toString().toLowerCase() == "solid" ||
                 x.toString().toLowerCase() == "outline")) ||
          ((jsnums.isReal(x)) &&
           (jsnums.greaterThanOrEqual(x, 0, runtime.NumberErrbacks) &&
            jsnums.lessThanOrEqual(x, 1, runtime.NumberErrbacks)))
      }),
      unwrapMode: function(value) {
        return typeof value === "string" ? value : jsnums.toFixnum(value)
      },
      annFontFamily: ann("Font Family", function(x){
        return (isString(x) &&
                (x.toString().toLowerCase() == "default" ||
                 x.toString().toLowerCase() == "decorative" ||
                 x.toString().toLowerCase() == "roman" ||
                 x.toString().toLowerCase() == "script" ||
                 x.toString().toLowerCase() == "swiss" ||
                 x.toString().toLowerCase() == "modern" ||
                 x.toString().toLowerCase() == "symbol" ||
                 x.toString().toLowerCase() == "system"))
          || (x === false)		// false is also acceptable
      }),
      unwrapFontFamily: identity,
      annFontStyle: ann("Font Style (\"normal\", \"italic\", or \"slant\")", function(x){
        return (isString(x) &&
                (x.toString().toLowerCase() == "normal" ||
                 x.toString().toLowerCase() == "italic" ||
                 x.toString().toLowerCase() == "slant"))
          || (x === false)		// false is also acceptable
      }),
      unwrapFontStyle: identity,
      annFontWeight: ann("Font Weight", function(x){
        return (isString(x) &&
                (x.toString().toLowerCase() == "normal" ||
                 x.toString().toLowerCase() == "bold" ||
                 x.toString().toLowerCase() == "light"))
          || (x === false)		// false is also acceptable
      }),
      unwrapFontWeight: identity,
      annPlaceX: ann("X Place (\"left\", \"middle\", \"center\", \"pinhole\", or \"right\")", isPlaceX),
      unwrapPlaceX: function(value) {
        if (value.toString().toLowerCase() == "center") return "middle"
        return value
      },
      annPlaceY: ann("Y Place (\"top\", \"bottom\", \"center\", \"pinhole\", \"baseline\", or \"middle\")", isPlaceY),
      unwrapPlaceY: function(value) {
        if (value.toString().toLowerCase() == "middle") return "center"
        return value
      },
      annImage: ann("Image", checkImagePred),
      unwrapImage: function(value) {
        return value.val
      },
      annImageOrScene: ann("Image", function(value) {
        return runtime.isOpaque(value) && (image.isImage(value.val) || image.isScene(value.val))
      }),
      unwrapImageOrScene: function(value) {
        return value.val
      },
      annAngle: ann("Angle (a number 'x' where 0 <= x < 360)", image.isAngle),
      annListImage: annListImage,
      unwrapListofImage: identity,
      annListColor: ann("List<Color>", function(value) {
        return runtime.ffi.isList(value)
      }),
      unwrapListofColor: function(value) {
        return ffi.makeList(ffi.toArray(value).map(unwrapColor))
      },
      annListPoint2D: ann("List<Point>", function(value) {
        return runtime.ffi.isList(value)
      }),
      unwrapListofPoint2D: function(value) {
        return ffi.toArray(value).map(unwrapPoint2D)
      },
      annSideCount: ann("Side Count", image.isSideCount),
      annStepCount: ann("Step Count", image.isStepCount),
      annPointCount: ann("Points Count", image.isPointsCount)
    }


    var values = makeImage.makeImageLib("image-untyped", ANNOTS)
    function f(name, fun) {
      values[name] = runtime.makeFunction(fun, name)
    }

    f("is-image-color", function(maybeColor) {
      checkArity(1, arguments, "image", false)
      return runtime.wrap(image.isColorOrColorString(maybeColor))
    })
    f("is-mode", function(maybeMode) {
      checkArity(1, arguments, "is-mode", false)
      return runtime.wrap(isMode(maybeMode))
    })
    f("is-x-place", function(maybeXPlace) {
      checkArity(1, arguments, "is-x-place", false)
      return runtime.wrap(isPlaceX(maybeXPlace))
    })
    f("is-y-place", function(maybeYPlace) {
      checkArity(1, arguments, "is-y-place", false)
      return runtime.wrap(isPlaceY(maybeYPlace))
    })


    
    return runtime.makeModuleReturn(values, {
      "Image": image.Image,
      "Scene": runtime.makePrimitiveAnn("Scene", checkScenePred)
    })
  }
})
