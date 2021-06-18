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
      "FillMode": { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://internal-image-shared" },
        name: "FillMode" },
      "FontFamily": { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://internal-image-shared" },
        name: "FontFamily" },
      "FontStyle": { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://internal-image-shared" },
        name: "FontStyle" },
      "FontWeight": { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://internal-image-shared" },
        name: "FontWeight" },
      "Point": { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://internal-image-shared" },
        name: "Point" },
      "XPlace": { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://internal-image-shared" },
        name: "XPlace" },
      "YPlace": { tag: "name",
        origin: { "import-type": "uri", uri: "builtin://internal-image-shared" },
        name: "YPlace" },
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
      "circle": ["arrow", ["Number", "FillMode", "Color"], "Image"],
      "is-angle": ["arrow", ["tany"], "Boolean"],
      "is-side-count": ["arrow", ["tany"], "Boolean"],
      "is-step-count": ["arrow", ["tany"], "Boolean"],
      "is-image": ["arrow", ["tany"], "Boolean"],
      "image-url": ["arrow", ["String"], "Image"],
      "images-equal": ["arrow", ["Image", "Image"], "Boolean"],
      "images-difference": ["arrow", ["Image", "Image"], ["tyapp", "Either", ["String", "Number"]]],
      "text": ["arrow", ["String", "Number", "Color"], "Image"],
      "text-font": ["arrow",
        ["String", "Number", "Color", "String", "FontFamily", "FontStyle", "FontWeight", "Boolean"],
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
      "empty-color-scene": ["arrow", ["Number", "Number", "Color"], "Image"],
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
      "line": ["arrow", ["Number", "Number", "Color"], "Image"],
      "add-line": ["arrow", ["Image", "Number", "Number", "Number", "Number", "Color"], "Image"],
      "scene-line": ["arrow", ["Image", "Number", "Number", "Number", "Number", "Color"], "Image"],
      "square": ["arrow", ["Number", "FillMode", "Color"], "Image"],
      "rectangle": ["arrow", ["Number", "Number", "FillMode", "Color"], "Image"],
      "regular-polygon": ["arrow", ["Number", "Number", "FillMode", "Color"], "Image"],
      "point-polygon": ["arrow", ["LoP", "FillMode", "Color"], "Image"],
      "ellipse": ["arrow", ["Number", "Number", "FillMode", "Color"], "Image"],
      "wedge": ["arrow", ["Number", "Number", "FillMode", "Color"], "Image"],
      "triangle": ["arrow", ["Number", "FillMode", "Color"], "Image"],
      "triangle-sas": ["arrow", ["Number", "Number", "Number", "FillMode", "Color"], "Image"],
      "triangle-sss": ["arrow", ["Number", "Number", "Number", "FillMode", "Color"], "Image"],
      "triangle-ass": ["arrow", ["Number", "Number", "Number", "FillMode", "Color"], "Image"],
      "triangle-ssa": ["arrow", ["Number", "Number", "Number", "FillMode", "Color"], "Image"],
      "triangle-aas": ["arrow", ["Number", "Number", "Number", "FillMode", "Color"], "Image"],
      "triangle-asa": ["arrow", ["Number", "Number", "Number", "FillMode", "Color"], "Image"],
      "triangle-saa": ["arrow", ["Number", "Number", "Number", "FillMode", "Color"], "Image"],
      "right-triangle": ["arrow", ["Number", "Number", "FillMode", "Color"], "Image"],
      "isosceles-triangle": ["arrow", ["Number", "Number", "FillMode", "Color"], "Image"],
      "star": ["arrow", ["Number", "FillMode", "Color"], "Image"],
      "star-sized": ["arrow", ["Number", "Number", "Number", "FillMode", "Color"], "Image"],
      "radial-star": ["arrow", ["Number", "Number", "Number", "FillMode", "Color"], "Image"],
      "star-polygon": ["arrow", ["Number", "Number", "Number", "FillMode", "Color"], "Image"],
      "rhombus": ["arrow", ["Number", "Number", "FillMode", "Color"], "Image"],
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

    console.log("From typed:", imageLibrary)

    var image = runtime.getField(imageLibrary, "internal")
    var colorDatabase = image.colorDb

    const checkArity = ffi.checkArity
    const c = function(name, ...argumentsAndAnns) {
      runtime.checkArgsInternalInline("image-typed", name, ...argumentsAndAnns)
    }
    const c1 = function(name, argument, ann) {
      runtime.checkArgsInternal1("image-typed", name, argument, ann)
    }
    const c2 = function(name, argument1, ann1, argument2, ann2) {
      runtime.checkArgsInternal2("image-typed", name, argument1, ann1, argument2, ann2)
    }
    const c3 = function(name, argument1, ann1, argument2, ann2, argument3, ann3) {
      runtime.checkArgsInternal3("image-typed", name, argument1, ann1, argument2, ann2, argument3, ann3)
    }

    var ann = function(name, pred) {
      return runtime.makePrimitiveAnn(name, pred)
    }

    var identity = function(x) { return x }
    var pyAlwaysTrue = runtime.makeFunction(function(_) { return true }, "No-op")

    var checkImagePred = function(value) {
      return runtime.isOpaque(value) && image.isImage(value.val)
    }
    var checkScenePred = function(value) {
      return runtime.isOpaque(value) && image.isScene(value.val)
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
    var unwrapListofImage = identity

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
      unwrapColor: identity,
      annColor: image.annColor,
      annPoint: image.annPoint,
      annMode: image.annFillMode,
      unwrapMode: function(m) {
        return runtime.ffi.cases(pyAlwaysTrue, "FillMode", m, {
          "mode-solid":   function(_) { return "solid" },
          "mode-outline": function(_) { return "outline" },
          "mode-fade":    function(v) { return jsnums.toFixnum(v) },
        })
      },
      annFontFamily: image.annFontFamily,
      unwrapFontFamily: function(ff) {
        return runtime.ffi.cases(pyAlwaysTrue, "FontFamily", ff, {
          "ff-default":    function(_) { return "default" },
          "ff-decorative": function(_) { return "decorative" },
          "ff-roman":      function(_) { return "roman" },
          "ff-script":     function(_) { return "script" },
          "ff-swiss":      function(_) { return "swiss" },
          "ff-modern":     function(_) { return "modern" },
          "ff-symbol":     function(_) { return "symbol" },
          "ff-system":     function(_) { return "system" },
        })
      },   
      annFontStyle: image.annFontStyle,
      unwrapFontStyle: function(fs) {
        return runtime.ffi.cases(pyAlwaysTrue, "FontStyle", fs, {
          "fs-normal": function(_) { return "normal" },
          "fs-italic": function(_) { return "italic" },
          "fs-slant":  function(_) { return "slant" },
        })
      },
      annFontWeight: image.annFontWeight,
      unwrapFontWeight: function(fw){
        return runtime.ffi.cases(pyAlwaysTrue, "FontWeight", fw, {
          "fw-normal": function(_) { return "normal" },
          "fw-bold": function(_) { return "bold" },
          "fw-light": function(_) { return "light" },
        })
      },
      annPlaceX: image.annXPlace,
      unwrapPlaceX: function(px) {
        return runtime.ffi.cases(pyAlwaysTrue, "XPlace", px, {
          "x-left": function(_) { return "left" },
          "x-middle": function(_) { return "middle" },
          "x-pinhole": function(_) { return "pinhole" },
          "x-right": function(_) { return "right" }
        })
      },
      annPlaceY: image.annYPlace,
      unwrapPlaceY: function(py) {
        return runtime.ffi.cases(pyAlwaysTrue, "YPlace", py, {
          "y-top": function(_) { return "top" },
          "y-center": function(_) { return "center" },
          "y-pinhole": function(_) { return "pinhole" },
          "y-baseline": function(_) { return "baseline" },
          "y-bottom": function(_) { return "bottom" }
        })
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
      annListColor: ann("List<Color>", function(value) {
        if (!runtime.ffi.isList(value)) return false
        var current = value
        var gf = runtime.getField
        while (runtime.unwrap(ffi.isLink(current))) {
          var f = gf(current, "first")
          if (!image.isColor(f)) return false
          current = gf(current, "rest")
        }
        return true
      }),
      unwrapListofColor: identity,
      annListPoint2D: ann("List<Point>", function(value) {
        if (!runtime.ffi.isList(value)) return false
        var current = value
        var gf = runtime.getField
        var count = 0
        while (runtime.unwrap(ffi.isLink(current))) {
          var f = gf(current, "first")
          if (!image.isPoint(f)) return false
          current = gf(current, "rest")
          count++
        }
        return true
      }),
      annListImage: annListImage,
      unwrapListofImage: unwrapListofImage,
      unwrapListofPoint2D: function(value) {
        return ffi.toArray(value).map(unwrapPoint2D)
      },
      annSideCount: ann("Side Count", image.isSideCount),
      annStepCount: ann("Step Count", image.isStepCount),
      annPointCount: ann("Points Count", image.isPointsCount)
    }


    var values = makeImage.makeImageLib("image-typed", ANNOTS)
    function f(name, fun) {
      values[name] = runtime.makeFunction(fun, name)
    }


    return runtime.makeModuleReturn(values, {
      "Image": image.Image,
      "Scene": runtime.makePrimitiveAnn("Scene", checkScenePred)
    })
  }
})
