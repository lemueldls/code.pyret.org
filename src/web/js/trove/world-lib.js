({
  requires: [],
  nativeRequires: [],
  provides: [],
  theModule: function (runtime, namespace, uri) {
    var _worldIndex = 0

    var getNewWorldIndex = function () {
      _worldIndex++
      return _worldIndex
    }

    var rawJsworld = {}

    // Stuff here is copy-and-pasted from Chris King's JSWorld.
    //
    // dyoo: as I remember, most of this code had been revised from
    // Chris's original code by Ethan Cechetti, who rewrote it to
    // continuation passing style during summer 2010.

    /* Type signature notation
     * CPS(a b ... -> c) is used to denote
     *    a b ... (c -> void) -> void
     */

    var Jsworld = rawJsworld

    var currentFocusedNode = false

    var doNothing = function () {}
    // Just in case external users need this and doNothing might change.
    Jsworld.doNothing = doNothing

    // forEachK: CPS( array CPS(array -> void) (error -> void) -> void )
    // Iterates through an array and applies f to each element using CPS
    // If an error is thrown, it catches the error and calls f_error on it
    var forEachK = function (a, f, f_error, k) {
      var forEachHelp = function (index) {
        if (index >= a.length) {
          return k ? k() : undefined
        }
        try {
          return f(a[index], function () {
            return forEachHelp(index + 1)
          })
        } catch (error) {
          return Jsworld.shutdown({ errorShutdown: error })
        }
      }
      return forEachHelp(0)
    }

    //
    // WORLD STUFFS
    //

    function InitialWorld() {}

    var world = new InitialWorld()
    var worldListenersStack = []
    var eventDetachersStack = []
    var worldIndexStack = []
    var runningBigBangs = []

    var worldIndex = null
    var worldListeners = null
    var eventDetachers = null
    var changingWorld = []

    function clear_running_state() {
      worldIndexStack = []
      worldIndex = null
      world = new InitialWorld()
      worldListenersStack = []
      worldListeners = null

      for (const eventDetachers of eventDetachersStack) {
        for (const eventDetacher of eventDetachers) {
          eventDetacher()
        }
      }
      eventDetachersStack = []
      eventDetachers = null
      changingWorld = []
    }

    function resume_running_state() {
      worldIndexStack.pop()
      worldIndex =
        worldIndexStack.length > 0
          ? worldIndexStack[worldIndexStack.length - 1]
          : null
      world =
        runningBigBangs.length > 0
          ? runningBigBangs[runningBigBangs.length - 1].world
          : new InitialWorld()
      worldListenersStack.pop()
      worldListeners =
        worldListenersStack.length > 0
          ? worldListenersStack[worldListenersStack.length - 1]
          : null

      for (const eventDetacher of eventDetachersStack.pop()) {
        eventDetacher()
      }
      eventDetachers =
        eventDetachersStack.length > 0
          ? eventDetachersStack[eventDetachersStack.length - 1]
          : null
      changingWorld.pop()

      if (runningBigBangs.length > 0) {
        runningBigBangs[runningBigBangs.length - 1].restart()
      }
    }

    // Close all world computations.
    Jsworld.shutdown = function (options) {
      while (runningBigBangs.length > 0) {
        var currentRecord = runningBigBangs.pop()
        currentRecord.pause()
        if (options.cleanShutdown) {
          currentRecord.success(world)
        }
        if (options.errorShutdown) {
          currentRecord.fail(options.errorShutdown)
        }
      }
      clear_running_state()
    }

    // Closes the most recent world computation.
    Jsworld.shutdownSingle = function (options) {
      if (runningBigBangs.length > 0) {
        var currentRecord = runningBigBangs.pop()
        currentRecord.pause()
        if (options.cleanShutdown) {
          currentRecord.success(world)
        }
        if (options.errorShutdown) {
          currentRecord.fail(options.errorShutdown)
        }
      }
      resume_running_state()
    }

    function add_world_listener(listener) {
      worldListeners.push(listener)
    }

    function remove_world_listener(listener) {
      var index_
      var index = -1
      for (index_ = 0; index_ < worldListeners.length; index_++) {
        if (worldListeners[index_] === listener) {
          index = index_
          break
        }
      }
      if (index !== -1) {
        worldListeners.splice(index, 1)
      }
    }

    // If we're in the middle of a change_world, delay.
    var DELAY_BEFORE_RETRY = 10

    // change_world: CPS( CPS(world -> world) -> void )
    // Adjust the world, and notify all listeners.
    var change_world = function (updater, k) {
      // Check to see if we're in the middle of changing
      // the world already.  If so, put on the queue
      // and exit quickly.
      if (changingWorld[changingWorld.length - 1]) {
        setTimeout(function () {
          change_world(updater, k)
        }, DELAY_BEFORE_RETRY)
        return
      }

      changingWorld[changingWorld.length - 1] = true
      var originalWorld = world

      var changeWorldHelp
      changeWorldHelp = function () {
        forEachK(
          worldListeners,
          function (listener, k2) {
            listener(world, originalWorld, k2)
          },
          function (e) {
            changingWorld[changingWorld.length - 1] = false
            world = originalWorld
            throw e
          },
          function () {
            changingWorld[changingWorld.length - 1] = false
            k()
          }
        )
      }

      try {
        updater(world, function (newWorld) {
          world = newWorld
          changeWorldHelp()
        })
      } catch (error) {
        changingWorld[changingWorld.length - 1] = false
        world = originalWorld
        return Jsworld.shutdown({ errorShutdown: error })
      }
    }
    Jsworld.change_world = change_world

    var map = function (a1, f) {
      var b = new Array(a1.length)
      var index
      for (index = 0; index < a1.length; index++) {
        b[index] = f(a1[index])
      }
      return b
    }

    var concat_map = function (a, f) {
      var b = []
      var index
      for (index = 0; index < a.length; index++) {
        b = b.concat(f(a[index]))
      }
      return b
    }

    function member(a, x) {
      var index
      for (index = 0; index < a.length; index++) {
        if (a[index] === x) {
          return true
        }
      }
      return false
    }

    //
    // DOM UPDATING STUFFS
    //

    // tree(N): { node: N, children: [tree(N)] }
    // relation(N): { relation: 'parent', parent: N, child: N } | { relation: 'neighbor', left: N, right: N }
    // relations(N): [relation(N)]
    // nodes(N): [N]
    // css(N): [css_node(N)]
    // css_node(N): { node: N, attribs: attribs } | { className: string, attribs: attribs }
    // attrib: { attrib: string, values: [string] }
    // attribs: [attrib]

    // treeable(nodes(N), relations(N)) = bool
    /*function treeable(nodes, relations) {
    // for all neighbor relations between x and y
    for (var i = 0; i < relations.length; i++)
    if (relations[i].relation == 'neighbor') {
    var x = relations[i].left, y = relations[i].right;

    // there does not exist a neighbor relation between x and z!=y or z!=x and y
    for (var j = 0; j < relations.length; j++)
    if (relations[j].relation === 'neighbor')
    if (relations[j].left === x && relations[j].right !== y ||
    relations[j].left !== x && relations[j].right === y)
    return false;
    }

    // for all parent relations between x and y
    for (var i = 0; i < relations.length; i++)
    if (relations[i].relation == 'parent') {
    var x = relations[i].parent, y = relations[i].child;

    // there does not exist a parent relation between z!=x and y
    for (var j = 0; j < relations.length; j++)
    if (relations[j].relation == 'parent')
    if (relations[j].parent !== x && relations[j].child === y)
    return false;
    }

    // for all neighbor relations between x and y
    for (var i = 0; i < relations.length; i++)
    if (relations[i].relation == 'neighbor') {
    var x = relations[i].left, y = relations[i].right;

    // all parent relations between z and x or y share the same z
    for (var j = 0; j < relations.length; j++)
    if (relations[j].relation == 'parent')
    for (var k = 0; k < relations.length; k++)
    if (relations[k].relation == 'parent')
    if (relations[j].child === x && relations[k].child === y &&
    relations[j].parent !== relations[k].parent)
    return false;
    }

    return true;
    }*/

    // node_to_tree: dom -> dom-tree
    // Given a native dom node, produces the appropriate tree.
    function node_to_tree(domNode) {
      var result = [domNode]
      var c = domNode.firstChild
      if (c === undefined) {
        return result
      } else {
        for (c = domNode.firstChild; c !== null; c = c.nextSibling) {
          result.push(node_to_tree(c))
        }
        return result
      }
    }
    Jsworld.node_to_tree = node_to_tree

    // nodes(tree(N)) = nodes(N)
    function nodes(tree) {
      var returnValue
      var index
      if (tree.node.jsworldOpaque === true) {
        return [tree.node]
      }

      returnValue = [tree.node]
      for (index = 0; index < tree.children.length; index++) {
        returnValue = returnValue.concat(nodes(tree.children[index]))
      }
      return returnValue
    }

    // relations(tree(N)) = relations(N)
    function relations(tree) {
      var returnValue = []
      var index
      for (index = 0; index < tree.children.length; index++) {
        returnValue.push({
          relation: "parent",
          parent: tree.node,
          child: tree.children[index].node,
        })
      }

      for (index = 0; index < tree.children.length - 1; index++) {
        returnValue.push({
          relation: "neighbor",
          left: tree.children[index].node,
          right: tree.children[index + 1].node,
        })
      }

      if (!tree.node.jsworldOpaque) {
        for (index = 0; index < tree.children.length; index++) {
          returnValue = returnValue.concat(relations(tree.children[index]))
        }
      }

      return returnValue
    }

    // Preorder traversal.
    var preorder = function (node, f) {
      f(node, function () {
        var child = node.firstChild
        var nextSibling
        while (child) {
          nextSibling = child.nextSibling
          preorder(child, f)
          child = nextSibling
        }
      })
    }

    // nodeEq: node node -> boolean
    // Returns true if the two nodes should be the same.
    var nodeEq = function (node1, node2) {
      return node1 && node2 && node1 === node2
    }

    // isMemq: X (arrayof X) -> boolean
    // Produces true if any of the elements of L are nodeEq to x.
    var isMemq = function (x, L) {
      var index
      for (index = 0; index < L.length; index++) {
        if (nodeEq(x, L[index])) {
          return true
        }
      }
      return false
    }

    // If any node cares about the world, send it in.
    function refresh_node_values(nodes) {
      var index
      for (index = 0; index < nodes.length; index++) {
        if (nodes[index].onWorldChange) {
          nodes[index].onWorldChange(world)
        }
      }
    }

    // update_dom(nodes(Node), relations(Node)) = void
    function update_dom(toplevelNode, nodes, relations) {
      var index
      var parent
      var child
      // TODO: rewrite this to move stuff all in one go... possible? necessary?

      // move all children to their proper parents
      for (index = 0; index < relations.length; index++) {
        if (relations[index].relation === "parent") {
          parent = relations[index].parent
          child = relations[index].child
          if (child.parentNode !== parent) {
            parent.append(child)
          }
        }
      }

      // arrange siblings in proper order
      // truly terrible... BUBBLE SORT
      var unsorted = true
      while (unsorted) {
        unsorted = false
        for (index = 0; index < relations.length; index++) {
          if (relations[index].relation === "neighbor") {
            var left = relations[index].left
            var right = relations[index].right

            if (!nodeEq(left.nextSibling, right)) {
              left.parentNode.insertBefore(left, right)
              unsorted = true
            }
          }
        }
      }

      // Finally, remove nodes that shouldn't be attached anymore.
      var nodesPlus = [...nodes, toplevelNode]
      preorder(toplevelNode, function (aNode, continueTraversalDown) {
        if (aNode.jsworldOpaque) {
          if (!isMemq(aNode, nodesPlus)) {
            aNode.remove()
          }
        } else {
          if (!isMemq(aNode, nodesPlus)) {
            aNode.remove()
          } else {
            continueTraversalDown()
          }
        }
      })

      refresh_node_values(nodes)
    }

    // camelCase: string -> string
    function camelCase(name) {
      return name.replace(/-(.)/g, function (m, l) {
        return l.toUpperCase()
      })
    }

    function set_css_attribs(node, attribs) {
      var index
      for (index = 0; index < attribs.length; index++) {
        node.style[camelCase(attribs[index].attrib)] =
          attribs[index].values.join(" ")
      }
    }

    // isMatchingCssSelector: node css -> boolean
    // Returns true if the CSS selector matches.
    function isMatchingCssSelector(node, css) {
      return /^\./.test(css.id)
        ? node.className && member(node.className.split(/\s+/), css.id.slice(1))
        : node.id && node.id === css.id
    }

    var clearCss = function (node) {
      // FIXME: we should not be clearing the css
      //      if ('style' in node)
      //          node.style.cssText = "";
    }

    function update_css(nodes, css) {
      // clear CSS
      var index
      var index_
      for (index = 0; index < nodes.length; index++) {
        if (!nodes[index].jsworldOpaque) {
          clearCss(nodes[index])
        }
      }

      // set CSS
      for (index = 0; index < css.length; index++) {
        if (css[index].id) {
          for (index_ = 0; index_ < nodes.length; index_++) {
            if (isMatchingCssSelector(nodes[index_], css[index])) {
              set_css_attribs(nodes[index_], css[index].attribs)
            }
          }
        } else {
          set_css_attribs(css[index].node, css[index].attribs)
        }
      }
    }

    var sexp2tree
    var sexp2css
    var maintainingSelection

    function do_redraw(
      world,
      oldWorld,
      toplevelNode,
      redraw_function,
      redraw_css_function,
      k
    ) {
      if (oldWorld instanceof InitialWorld) {
        // Simple path
        redraw_function(world, function (drawn) {
          var t = sexp2tree(drawn)
          var ns = nodes(t)
          // HACK: css before dom, due to excanvas hack.
          redraw_css_function(world, function (css) {
            update_css(ns, sexp2css(css))
            update_dom(toplevelNode, ns, relations(t))
            k()
          })
        })
      } else {
        maintainingSelection(function (k2) {
          redraw_function(world, function (newRedraw) {
            redraw_css_function(world, function (newRedrawCss) {
              var t = sexp2tree(newRedraw)
              var ns = nodes(t)
              // Try to save the current selection and preserve it across
              // dom updates.

              // Kludge: update the CSS styles first.
              // This is a workaround an issue with excanvas: any style change
              // clears the content of the canvas, so we do this first before
              // attaching the dom element.
              update_css(ns, sexp2css(newRedrawCss))
              update_dom(toplevelNode, ns, relations(t))

              k2()
            })
          })
        }, k)
      }
    }

    var FocusedSelection

    function hasCurrentFocusedSelection() {
      return currentFocusedNode !== undefined
    }

    function getCurrentFocusedSelection() {
      return new FocusedSelection()
    }

    // maintainingSelection: (-> void) -> void
    // Calls the thunk f while trying to maintain the current focused selection.
    maintainingSelection = function (f, k) {
      var currentFocusedSelection
      if (hasCurrentFocusedSelection()) {
        currentFocusedSelection = getCurrentFocusedSelection()
        f(function () {
          currentFocusedSelection.restore()
          k()
        })
      } else {
        f(function () {
          k()
        })
      }
    }

    FocusedSelection = function () {
      this.focused = currentFocusedNode
      this.selectionStart = currentFocusedNode.selectionStart
      this.selectionEnd = currentFocusedNode.selectionEnd
    }

    // Try to restore the focus.
    FocusedSelection.prototype.restore = function () {
      // FIXME: if we're scrolling through, what's visible
      // isn't restored yet.
      if (this.focused.parentNode) {
        this.focused.selectionStart = this.selectionStart
        this.focused.selectionEnd = this.selectionEnd
        this.focused.focus()
      } else if (this.focused.id) {
        var matching = document.getElementById(this.focused.id)
        if (matching) {
          matching.selectionStart = this.selectionStart
          matching.selectionEnd = this.selectionEnd
          matching.focus()
        }
      }
    }

    //////////////////////////////////////////////////////////////////////

    var bigBang
    var StopWhenHandler

    function BigBangRecord(
      top,
      world,
      handlerCreators,
      handlers,
      attribs,
      success,
      fail
    ) {
      this.top = top
      this.world = world
      this.handlers = handlers
      this.handlerCreators = handlerCreators
      this.attribs = attribs
      this.success = success
      this.fail = fail
    }

    BigBangRecord.prototype.restart = function () {
      var index
      for (index = 0; index < this.handlers.length; index++) {
        if (!(this.handlers[index] instanceof StopWhenHandler)) {
          this.handlers[index].onRegister(this.top)
        }
      }
    }

    BigBangRecord.prototype.pause = function () {
      var index
      for (index = 0; index < this.handlers.length; index++) {
        if (!(this.handlers[index] instanceof StopWhenHandler)) {
          this.handlers[index].onUnregister(this.top)
        }
      }
    }
    //////////////////////////////////////////////////////////////////////

    var copy_attribs

    // Notes: bigBang maintains a stack of activation records; it should be possible
    // to call bigBang re-entrantly.
    // top: dom
    // init_world: any
    // handlerCreators: (Arrayof (-> handler))
    // k: any -> void
    bigBang = function (
      top,
      init_world,
      handlerCreators,
      attribs,
      succ,
      fail,
      extras
    ) {
      var thisWorldIndex = getNewWorldIndex()
      worldIndexStack.push(thisWorldIndex)
      worldIndex = thisWorldIndex
      var index
      // clear_running_state();

      // Construct a fresh set of the handlers.
      var handlers = map(handlerCreators, function (x) {
        return x(thisWorldIndex)
      })
      if (runningBigBangs.length > 0) {
        runningBigBangs[runningBigBangs.length - 1].pause()
      }
      changingWorld.push(false)
      worldListeners = []
      worldListenersStack.push(worldListeners)
      eventDetachers = []
      eventDetachersStack.push(eventDetachers)

      // Create an activation record for this big-bang.
      var activationRecord = new BigBangRecord(
        top,
        init_world,
        handlerCreators,
        handlers,
        attribs,
        succ,
        fail
      )
      runningBigBangs.push(activationRecord)
      function keepRecordUpToDate(w, oldW, k2) {
        activationRecord.world = w
        k2()
      }
      add_world_listener(keepRecordUpToDate)

      if (typeof extras.tracer === "function") {
        add_world_listener(extras.tracer)
      }

      // Monitor for termination and register the other handlers.
      var stopWhen = new StopWhenHandler(
        function (w, k2) {
          k2(false)
        },
        function (w, k2) {
          k2(w)
        }
      )
      for (index = 0; index < handlers.length; index++) {
        if (handlers[index] instanceof StopWhenHandler) {
          stopWhen = handlers[index]
        }
      }
      activationRecord.restart()
      var watchForTermination = function (w, oldW, k2) {
        if (thisWorldIndex != worldIndex) {
          return
        }
        stopWhen.test(w, function (stop) {
          if (!stop) {
            k2()
          } else {
            if (extras.closeWhenStop) {
              if (extras.closeBigBangWindow) {
                extras.closeBigBangWindow()
              }
              Jsworld.shutdownSingle({ cleanShutdown: true })
            } else {
              activationRecord.pause()
            }
          }
        })
      }
      add_world_listener(watchForTermination)

      // Finally, begin the big-bang.
      copy_attribs(top, attribs)
      change_world(function (w, k2) {
        k2(init_world)
      }, doNothing)
    }
    Jsworld.bigBang = bigBang

    // on_tick: number CPS(world -> world) -> handler
    var on_tick = function (delay, tick) {
      return function (thisWorldIndex) {
        var scheduleTick
        var ticker
        scheduleTick = function (t) {
          ticker.watchId = setTimeout(function () {
            if (thisWorldIndex != worldIndex) {
              return
            }
            ticker.watchId = undefined
            var startTime = Date.now()
            change_world(tick, function () {
              var endTime = Date.now()
              scheduleTick(Math.max(delay - (endTime - startTime), 0))
            })
          }, t)
        }

        ticker = {
          watchId: -1,
          onRegister: function (top) {
            scheduleTick(delay)
          },

          onUnregister: function (top) {
            if (ticker.watchId) {
              clearTimeout(ticker.watchId)
            }
          },
        }
        return ticker
      }
    }
    Jsworld.on_tick = on_tick

    var preventDefault
    var stopPropagation
    var attachEvent
    var detachEvent

    function on_key(press) {
      return function (thisWorldIndex) {
        var wrappedPress = function (e) {
          if (thisWorldIndex != worldIndex) {
            return
          }
          if (e.keyCode === 27) {
            return
          } // Escape events are not for world; the environment handles them
          stopPropagation(e)
          preventDefault(e)
          change_world(function (w, k) {
            press(w, e, k)
          }, doNothing)
        }
        return {
          onRegister: function (top) {
            //http://www.w3.org/TR/html5/editing.html#sequential-focus-navigation-and-the-tabindex-attribue
            jQuery(top).attr("tabindex", 1)
            jQuery(top).focus()
            attachEvent(top, "keydown", wrappedPress)
          },
          onUnregister: function (top) {
            detachEvent(top, "keydown", wrappedPress)
          },
        }
      }
    }
    Jsworld.on_key = on_key

    // http://www.quirksmode.org/js/events_mouse.html
    // http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
    function on_mouse(mouse) {
      return function (thisWorldIndex) {
        var isButtonDown = false
        var makeWrapped = function (type) {
          return function (e) {
            if (thisWorldIndex != worldIndex) {
              return
            }
            preventDefault(e)
            stopPropagation(e)
            var x = e.pageX
            var y = e.pageY
            var currentElement = e.target
            do {
              x -= currentElement.offsetLeft
              y -= currentElement.offsetTop
              currentElement = currentElement.offsetParent
            } while (currentElement)

            if (type === "button-down") {
              isButtonDown = true
            } else if (type === "button-up") {
              isButtonDown = false
            }
            if (type === "move" && isButtonDown) {
              change_world(function (w, k) {
                mouse(w, x, y, "drag", k)
              }, doNothing)
            } else {
              change_world(function (w, k) {
                mouse(w, x, y, type, k)
              }, doNothing)
            }
          }
        }
        var wrappedDown = makeWrapped("button-down")
        var wrappedUp = makeWrapped("button-up")
        // How do we do drag?
        var wrappedMove = makeWrapped("move")
        var wrappedEnter = makeWrapped("enter")
        var wrappedLeave = makeWrapped("leave")
        return {
          onRegister: function (top) {
            attachEvent(top, "mousedown", wrappedDown)
            attachEvent(top, "mouseup", wrappedUp)
            attachEvent(top, "mousemove", wrappedMove)
            attachEvent(top, "mouseenter", wrappedEnter)
            attachEvent(top, "mouseleave", wrappedLeave)
          },
          onUnregister: function (top) {
            detachEvent(top, "mousedown", wrappedDown)
            detachEvent(top, "mouseup", wrappedUp)
            detachEvent(top, "mousemove", wrappedMove)
            detachEvent(top, "mouseenter", wrappedEnter)
            detachEvent(top, "mouseleave", wrappedLeave)
          },
        }
      }
    }
    Jsworld.on_mouse = on_mouse

    var checkDomSexp

    //  on_draw: CPS(world -> (sexpof node)) CPS(world -> (sexpof css-style)) -> handler
    function on_draw(redraw, redraw_css) {
      var wrappedRedraw = function (w, k) {
        redraw(w, function (newDomTree) {
          checkDomSexp(newDomTree, newDomTree)
          k(newDomTree)
        })
      }

      return function (thisWorldIndex) {
        var drawer = {
          _top: null,
          _listener: function (w, oldW, k2) {
            if (thisWorldIndex != worldIndex) {
              return
            }
            do_redraw(w, oldW, drawer._top, wrappedRedraw, redraw_css, k2)
          },
          onRegister: function (top) {
            drawer._top = top
            add_world_listener(drawer._listener)
          },

          onUnregister: function (top) {
            remove_world_listener(drawer._listener)
          },
        }
        return drawer
      }
    }
    Jsworld.on_draw = on_draw

    StopWhenHandler = function (test, receiver) {
      this.test = test
      this.receiver = receiver
    }
    // stop_when: CPS(world -> boolean) CPS(world -> boolean) -> handler
    function stop_when(test, receiver) {
      return function () {
        if (receiver === undefined) {
          receiver = function (w, k) {
            k(w)
          }
        }
        return new StopWhenHandler(test, receiver)
      }
    }
    Jsworld.stop_when = stop_when

    function on_world_change(f) {
      return function (thisWorldIndex) {
        var listener = function (world, oldW, k) {
          if (thisWorldIndex != worldIndex) {
            return
          }
          f(world, k)
        }
        return {
          onRegister: function (top) {
            add_world_listener(listener)
          },
          onUnregister: function (top) {
            remove_world_listener(listener)
          },
        }
      }
    }
    Jsworld.on_world_change = on_world_change

    // Compatibility for attaching events to nodes.
    attachEvent = function (node, eventName, function_) {
      if (node.addEventListener) {
        // Mozilla
        node.addEventListener(eventName, function_, false)
      } else {
        // IE
        node.attachEvent("on" + eventName, function_, false)
      }
    }

    detachEvent = function (node, eventName, function_) {
      if (node.addEventListener) {
        // Mozilla
        node.removeEventListener(eventName, function_, false)
      } else {
        // IE
        node.detachEvent("on" + eventName, function_, false)
      }
    }

    //
    // DOM CREATION STUFFS
    //

    // add_ev: node string CPS(world event -> world) -> void
    // Attaches a world-updating handler when the world is changed.
    function add_event(node, event, f) {
      var eventHandler = function (e) {
        change_world(function (w, k) {
          f(w, e, k)
        }, doNothing)
      }
      attachEvent(node, event, eventHandler)
      eventDetachers.push(function () {
        detachEvent(node, event, eventHandler)
      })
    }

    // add_ev_after: node string CPS(world event -> world) -> void
    // Attaches a world-updating handler when the world is changed, but only
    // after the fired event has finished.
    function add_event_after(node, event, f) {
      var eventHandler = function (e) {
        setTimeout(function () {
          change_world(function (w, k) {
            f(w, e, k)
          }, doNothing)
        }, 0)
      }

      attachEvent(node, event, eventHandler)
      eventDetachers.push(function () {
        detachEvent(node, event, eventHandler)
      })
    }

    function addFocusTracking(node) {
      attachEvent(node, "focus", function (e) {
        currentFocusedNode = node
      })
      attachEvent(node, "blur", function (e) {
        currentFocusedNode = undefined
      })
      return node
    }

    //
    // WORLD STUFFS
    //

    sexp2tree = function (sexp) {
      return sexp.length === undefined
        ? { node: sexp, children: [] }
        : { node: sexp[0], children: map(sexp.slice(1), sexp2tree) }
    }

    function sexp2attrib(sexp) {
      return { attrib: sexp[0], values: sexp.slice(1) }
    }

    function sexp2css_node(sexp) {
      var attribs = map(sexp.slice(1), sexp2attrib)
      if (typeof sexp[0] === "string") {
        return [{ id: sexp[0], attribs: attribs }]
      } else if (sexp[0].length !== undefined) {
        return map(sexp[0], function (id) {
          return { id: id, attribs: attribs }
        })
      } else {
        return [{ node: sexp[0], attribs: attribs }]
      }
    }

    sexp2css = function (sexp) {
      return concat_map(sexp, sexp2css_node)
    }

    function isTextNode(n) {
      return n.nodeType === 3
    }

    function isElementNode(n) {
      return n.nodeType === 1
    }

    var JsworldDomError

    var throwDomError = function (thing, topThing) {
      throw new JsworldDomError(
        "Expected a non-empty array, received " + thing + " within " + topThing,
        thing
      )
    }

    // checkDomSexp: X X -> boolean
    // Checks to see if thing is a DOM-sexp.  If not,
    // throws an object that explains why not.
    checkDomSexp = function (thing, topThing) {
      var index
      if (Array.isArray(!thing)) {
        throwDomError(thing, topThing)
      }
      if (thing.length === 0) {
        throwDomError(thing, topThing)
      }

      // Check that the first element is a Text or an element.
      if (isTextNode(thing[0])) {
        if (thing.length > 1) {
          throw new JsworldDomError(
            "Text node " + thing + " can not have children",
            thing
          )
        }
      } else if (isElementNode(thing[0])) {
        for (index = 1; index < thing.length; index++) {
          checkDomSexp(thing[index], thing)
        }
      } else {
        if (window.console && window.console.log) {
          window.console.log(thing[0])
        }

        throw new JsworldDomError(
          "expected a Text or an Element, received " +
            thing +
            " within " +
            topThing,
          thing[0]
        )
      }
    }

    JsworldDomError = function (message, elt) {
      this.msg = message
      this.elt = elt
    }
    JsworldDomError.prototype.toString = function () {
      return "JsworldDomError: " + this.msg
    }

    //
    // DOM CREATION STUFFS
    //

    copy_attribs = function (node, attribs) {
      var a
      if (attribs) {
        for (a in attribs) {
          if (hasOwnProperty.call(attribs, a)) {
            if (typeof attribs[a] === "function") {
              add_event(node, a, attribs[a])
            } else {
              node[a] = attribs[a]
            }
          }
        }
      }
      return node
    }

    //
    // NODE TYPES
    //

    function p(attribs) {
      return addFocusTracking(
        copy_attribs(document.createElement("p"), attribs)
      )
    }
    Jsworld.p = p

    function div(attribs) {
      return addFocusTracking(
        copy_attribs(document.createElement("div"), attribs)
      )
    }
    Jsworld.div = div

    // Used To Be: (world event -> world) (hashof X Y) -> domElement
    // Now: CPS(world event -> world) (hashof X Y) -> domElement
    function button(f, attribs) {
      var n = document.createElement("button")
      n.addEventListener("click", function (e) {
        return false
      })
      add_event(n, "click", f)
      return addFocusTracking(copy_attribs(n, attribs))
    }
    Jsworld.button = button

    preventDefault = function (event) {
      if (event.preventDefault) {
        event.preventDefault()
      } else {
        event.returnValue = false
      }
    }

    stopPropagation = function (event) {
      if (event.stopPropagation) {
        event.stopPropagation()
      } else {
        event.cancelBubble = true
      }
    }

    var stopClickPropagation = function (node) {
      attachEvent(node, "click", function (e) {
        stopPropagation(e)
      })
      return node
    }

    var text_input
    var checkbox_input

    // input: string CPS(world -> world)
    function input(aType, updateF, attribs) {
      aType = aType.toLowerCase()
      var dispatchTable = {
        text: text_input,
        password: text_input,
        checkbox: checkbox_input,
        //button: button_input,
        //radio: radio_input
      }

      if (dispatchTable[aType]) {
        return dispatchTable[aType](aType, updateF, attribs)
      } else {
        throw new Error("js-input: does not currently support type " + aType)
      }
    }
    Jsworld.input = input

    text_input = function (type, updateF, attribs) {
      var n = document.createElement("input")
      n.type = type

      var lastValue = n.value
      var onEvent = function () {
        if (!n.parentNode) {
          return
        }
        setTimeout(function () {
          if (lastValue !== n.value) {
            lastValue = n.value
            change_world(function (w, k) {
              updateF(w, n.value, k)
            }, doNothing)
          }
        }, 0)
      }

      attachEvent(n, "keydown", onEvent)
      eventDetachers.push(function () {
        detachEvent(n, "keydown", onEvent)
      })

      attachEvent(n, "change", onEvent)
      eventDetachers.push(function () {
        detachEvent(n, "change", onEvent)
      })

      return stopClickPropagation(addFocusTracking(copy_attribs(n, attribs)))
    }

    checkbox_input = function (type, updateF, attribs) {
      var n = document.createElement("input")
      n.type = type
      var onCheck = function (w, e, k) {
        updateF(w, n.checked, k)
      }
      // This established the widget->world direction
      add_event_after(n, "change", onCheck)

      attachEvent(n, "click", function (e) {
        stopPropagation(e)
      })

      return copy_attribs(n, attribs)
    }

    // var button_input = function(type, updateF, attribs) {
    //     var n = document.createElement('button');
    //     add_ev(n, 'click', function(w, e, k) { updateF(w, n.value, k); });
    //     return addFocusTracking(copy_attribs(n, attribs));
    // };

    function text(s, attribs) {
      var result = document.createElement("div")
      result.append(document.createTextNode(String(s)))
      result.jsworldOpaque = true
      return result
    }
    Jsworld.text = text

    var option

    function select(attribs, options, f) {
      var n = document.createElement("select")
      var index
      for (index = 0; index < options.length; index++) {
        n.add(option({ value: options[index] }), null)
      }
      n.jsworldOpaque = true
      add_event(n, "change", f)
      var result = addFocusTracking(copy_attribs(n, attribs))
      return result
    }
    Jsworld.select = select

    option = function (attribs) {
      var node = document.createElement("option")
      node.text = attribs.value
      node.value = attribs.value
      return node
    }

    function textarea(attribs) {
      return addFocusTracking(
        copy_attribs(document.createElement("textarea"), attribs)
      )
    }
    Jsworld.textarea = textarea

    function h1(attribs) {
      return addFocusTracking(
        copy_attribs(document.createElement("h1"), attribs)
      )
    }
    Jsworld.h1 = h1

    function canvas(attribs) {
      return addFocusTracking(
        copy_attribs(document.createElement("canvas"), attribs)
      )
    }
    Jsworld.canvas = canvas

    function img(source, attribs) {
      var n = document.createElement("img")
      n.src = source
      return addFocusTracking(copy_attribs(n, attribs))
    }
    Jsworld.img = img

    function raw_node(node, attribs) {
      return addFocusTracking(copy_attribs(node, attribs))
    }
    Jsworld.raw_node = raw_node

    return runtime.makeJSModuleReturn(Jsworld)
  },
})
