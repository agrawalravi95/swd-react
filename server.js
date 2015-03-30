module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var _ = _interopRequire(__webpack_require__(26));
  
  var fs = _interopRequire(__webpack_require__(24));
  
  var path = _interopRequire(__webpack_require__(28));
  
  var express = _interopRequire(__webpack_require__(21));
  
  var React = _interopRequire(__webpack_require__(1));
  
  var Dispatcher = _interopRequire(__webpack_require__(3));
  
  var ActionTypes = _interopRequire(__webpack_require__(2));
  
  var AppStore = _interopRequire(__webpack_require__(7));
  
  var DBStore = _interopRequire(__webpack_require__(17));
  
  var server = express();
  
  server.set("port", process.env.PORT || 5000);
  server.use(express["static"](path.join(__dirname)));
  
  //
  // Page API
  // -----------------------------------------------------------------------------
  server.get("/api/page/*", function (req, res) {
    var path = req.path.substr(9);
    var page = AppStore.getPage(path);
    res.send(page);
  });
  
  //
  // DB APIs
  //
  server.get("/api/db/*", function (req, res) {
    DBStore.process(req, res);
  });
  
  //
  // Server-side rendering
  // -----------------------------------------------------------------------------
  
  // The top-level React component + HTML template for it
  var App = React.createFactory(__webpack_require__(12));
  var templateFile = path.join(__dirname, "templates/index.html");
  var template = _.template(fs.readFileSync(templateFile, "utf8"));
  
  server.get("*", function (req, res) {
    var data = { description: "" };
    var app = new App({
      path: req.path,
      onSetTitle: function onSetTitle(title) {
        data.title = title;
      },
      onSetMeta: function onSetMeta(name, content) {
        data[name] = content;
      },
      onPageNotFound: function onPageNotFound() {
        res.status(404);
      }
    });
    data.body = React.renderToString(app);
    var html = template(data);
    res.send(html);
  });
  
  // Load pages from the `/src/content/` folder into the AppStore
  (function () {
    var assign = __webpack_require__(4);
    var fm = __webpack_require__(23);
    var jade = __webpack_require__(25);
    var sourceDir = path.join(__dirname, "./content");
    var getFiles = (function (_getFiles) {
      var _getFilesWrapper = function getFiles(_x) {
        return _getFiles.apply(this, arguments);
      };
  
      _getFilesWrapper.toString = function () {
        return _getFiles.toString();
      };
  
      return _getFilesWrapper;
    })(function (dir) {
      var pages = [];
      fs.readdirSync(dir).forEach(function (file) {
        var stat = fs.statSync(path.join(dir, file));
        if (stat && stat.isDirectory()) {
          pages = pages.concat(getFiles(file));
        } else {
          // Convert the file to a Page object
          var filename = path.join(dir, file);
          var url = filename.substr(sourceDir.length, filename.length - sourceDir.length - 5).replace("\\", "/");
          if (url.indexOf("/index", url.length - 6) !== -1) {
            url = url.substr(0, url.length - (url.length > 6 ? 6 : 5));
          }
          var source = fs.readFileSync(filename, "utf8");
          var content = fm(source);
          var html = jade.render(content.body, null, "  ");
          var page = assign({}, { path: url, body: html }, content.attributes);
          Dispatcher.handleServerAction({
            actionType: ActionTypes.LOAD_PAGE,
            path: url,
            page: page
          });
        }
      });
      return pages;
    });
    return getFiles(sourceDir);
  })();
  
  server.listen(server.get("port"), function () {
    if (process.send) {
      process.send("online");
    } else {
      console.log("The server is running at http://localhost:" + server.get("port"));
    }
  });
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("react");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var keyMirror = _interopRequire(__webpack_require__(10));
  
  var ActionTypes = keyMirror({
  
    LOAD_PAGE: null,
    LOAD_PAGE_SUCCESS: null,
    LOAD_PAGE_ERROR: null,
    CHANGE_LOCATION: null
  
  });
  
  module.exports = ActionTypes;
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var Flux = _interopRequire(__webpack_require__(22));
  
  var PayloadSources = _interopRequire(__webpack_require__(6));
  
  var assign = _interopRequire(__webpack_require__(4));
  
  /**
   * A singleton that operates as the central hub for application updates.
   * For more information visit https://facebook.github.io/flux/
   */
  var Dispatcher = assign(new Flux.Dispatcher(), {
  
    /**
     * @param {object} action The details of the action, including the action's
     * type and additional data coming from the server.
     */
    handleServerAction: function handleServerAction(action) {
      var payload = {
        source: PayloadSources.SERVER_ACTION,
        action: action
      };
      this.dispatch(payload);
    },
  
    /**
     * @param {object} action The details of the action, including the action's
     * type and additional data coming from the view.
     */
    handleViewAction: function handleViewAction(action) {
      var payload = {
        source: PayloadSources.VIEW_ACTION,
        action: action
      };
      this.dispatch(payload);
    }
  
  });
  
  module.exports = Dispatcher;
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2014, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule Object.assign
   */
  
  // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
  
  function assign(target, sources) {
    if (target == null) {
      throw new TypeError('Object.assign target cannot be null or undefined');
    }
  
    var to = Object(target);
    var hasOwnProperty = Object.prototype.hasOwnProperty;
  
    for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
      var nextSource = arguments[nextIndex];
      if (nextSource == null) {
        continue;
      }
  
      var from = Object(nextSource);
  
      // We don't currently support accessors nor proxies. Therefore this
      // copy cannot throw. If we ever supported this then we must handle
      // exceptions and side-effects. We don't support symbols so they won't
      // be transferred.
  
      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }
    }
  
    return to;
  };
  
  module.exports = assign;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var Dispatcher = _interopRequire(__webpack_require__(3));
  
  var ActionTypes = _interopRequire(__webpack_require__(2));
  
  var ExecutionEnvironment = _interopRequire(__webpack_require__(8));
  
  var http = _interopRequire(__webpack_require__(29));
  
  module.exports = {
  
    navigateTo: function navigateTo(path) {
      if (ExecutionEnvironment.canUseDOM) {
        window.history.pushState({}, document.title, path);
      }
  
      Dispatcher.handleViewAction({
        actionType: ActionTypes.CHANGE_LOCATION, path: path
      });
    },
  
    loadPage: function loadPage(path, cb) {
      Dispatcher.handleViewAction({
        actionType: ActionTypes.LOAD_PAGE, path: path
      });
  
      http.get("/api/page" + path).accept("application/json").end(function (err, res) {
        Dispatcher.handleServerAction({
          actionType: ActionTypes.LOAD_PAGE, path: path, err: err, page: res.body
        });
        if (cb) {
          cb();
        }
      });
    }
  
  };
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var keyMirror = _interopRequire(__webpack_require__(10));
  
  var PayloadSources = keyMirror({
  
    VIEW_ACTION: null,
    SERVER_ACTION: null
  
  });
  
  module.exports = PayloadSources;
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var Dispatcher = _interopRequire(__webpack_require__(3));
  
  var ActionTypes = _interopRequire(__webpack_require__(2));
  
  var PayloadSources = _interopRequire(__webpack_require__(6));
  
  var EventEmitter = _interopRequire(__webpack_require__(20));
  
  var assign = _interopRequire(__webpack_require__(4));
  
  var CHANGE_EVENT = "change";
  
  var _pages = {};
  var _loading = false;
  
  if (true) {
    _pages["/"] = { title: "Home Page" };
    _pages["/swd-services"] = { title: "SWD Services" };
    _pages["/csa"] = { title: "CSA" };
    _pages["/activity-center"] = { title: "Activity Center" };
    _pages["/anti-ragging"] = { title: "Anti Ragging" };
    _pages["/migration-form"] = { title: "Migration Form" };
    _pages["/contact"] = { title: "Contact" };
    _pages["/student"] = { title: "Student" };
    _pages["/student-leave"] = { title: "Leave Portal" };
    _pages["/student-dues"] = { title: "Dues Details" };
    _pages["/student-mess"] = { title: "Mess Option" };
    _pages["/student-certificate"] = { title: "Certificates" };
    _pages["/student-product"] = { title: "Products" };
  }
  
  var AppStore = assign({}, EventEmitter.prototype, {
  
    /**
     * Gets page data by the given URL path.
     *
     * @param {String} path URL path.
     * @returns {*} Page data.
     */
    getPage: function getPage(path) {
      if (path === "/student") {}
  
      return path in _pages ? _pages[path] : {
        title: "Page Not Found",
        type: "notfound"
      };
    },
  
    /**
     * Emits change event to all registered event listeners.
     *
     * @returns {Boolean} Indication if we've emitted an event.
     */
    emitChange: function emitChange() {
      return this.emit(CHANGE_EVENT);
    },
  
    /**
     * Register a new change event listener.
     *
     * @param {function} callback Callback function.
     */
    onChange: function onChange(callback) {
      this.on(CHANGE_EVENT, callback);
    },
  
    /**
     * Remove change event listener.
     *
     * @param {function} callback Callback function.
     */
    off: function off(callback) {
      this.off(CHANGE_EVENT, callback);
    }
  
  });
  
  AppStore.dispatcherToken = Dispatcher.register(function (payload) {
    var action = payload.action;
  
    switch (action.actionType) {
  
      case ActionTypes.LOAD_PAGE:
        if (action.source === PayloadSources.VIEW_ACTION) {
          _loading = true;
        } else {
          if (!action.err) {
            _pages[action.path] = action.page;
          }
        }
        AppStore.emitChange();
        break;
  
      default:
      // Do nothing
  
    }
  });
  
  module.exports = AppStore;
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2013-2014, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ExecutionEnvironment
   */
  
  /*jslint evil: true */
  
  "use strict";
  
  var canUseDOM = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
  
  /**
   * Simple, lightweight module assisting with the detection and context of
   * Worker. Helps avoid circular dependencies and allows code to reason about
   * whether or not they are in a Worker, even if they never include the main
   * `ReactWorker` dependency.
   */
  var ExecutionEnvironment = {
  
    canUseDOM: canUseDOM,
  
    canUseWorkers: typeof Worker !== 'undefined',
  
    canUseEventListeners:
      canUseDOM && !!(window.addEventListener || window.attachEvent),
  
    canUseViewport: canUseDOM && !!window.screen,
  
    isInWorker: !canUseDOM // For now, this is true - might change in the future.
  
  };
  
  module.exports = ExecutionEnvironment;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2013-2014, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule invariant
   */
  
  "use strict";
  
  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */
  
  var invariant = function(condition, format, a, b, c, d, e, f) {
    if (true) {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    }
  
    if (!condition) {
      var error;
      if (format === undefined) {
        error = new Error(
          'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.'
        );
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(
          'Invariant Violation: ' +
          format.replace(/%s/g, function() { return args[argIndex++]; })
        );
      }
  
      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  };
  
  module.exports = invariant;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2013-2014, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule keyMirror
   * @typechecks static-only
   */
  
  "use strict";
  
  var invariant = __webpack_require__(9);
  
  /**
   * Constructs an enumeration with keys equal to their value.
   *
   * For example:
   *
   *   var COLORS = keyMirror({blue: null, red: null});
   *   var myColor = COLORS.blue;
   *   var isColorValid = !!COLORS[myColor];
   *
   * The last line could not be performed if the values of the generated enum were
   * not equal to their keys.
   *
   *   Input:  {key1: val1, key2: val2}
   *   Output: {key1: key1, key2: key2}
   *
   * @param {object} obj
   * @return {object}
   */
  var keyMirror = function(obj) {
    var ret = {};
    var key;
    (true ? invariant(
      obj instanceof Object && !Array.isArray(obj),
      'keyMirror(...): Argument must be an object.'
    ) : invariant(obj instanceof Object && !Array.isArray(obj)));
    for (key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      ret[key] = key;
    }
    return ret;
  };
  
  module.exports = keyMirror;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = __webpack_require__.p + "a0151322882569977f15b3ea5f65faae.png"

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  __webpack_require__(19);
  
  var React = _interopRequire(__webpack_require__(1));
  
  var invariant = _interopRequire(__webpack_require__(9));
  
  var AppActions = _interopRequire(__webpack_require__(5));
  
  var NavigationMixin = _interopRequire(__webpack_require__(13));
  
  var AppStore = _interopRequire(__webpack_require__(7));
  
  var Navbar = _interopRequire(__webpack_require__(15));
  
  var ContentPage = _interopRequire(__webpack_require__(14));
  
  var NotFoundPage = _interopRequire(__webpack_require__(16));
  
  var Application = React.createClass({
    displayName: "Application",
  
    mixins: [NavigationMixin],
  
    propTypes: {
      path: React.PropTypes.string.isRequired,
      onSetTitle: React.PropTypes.func.isRequired,
      onSetMeta: React.PropTypes.func.isRequired,
      onPageNotFound: React.PropTypes.func.isRequired
  
    },
  
    componentDidMount: function componentDidMount() {
      (function ($) {
        $(function () {
          $(".modal-trigger").leanModal();
          $("ul.tabs").tabs();
          $("select").material_select();
          $(".datepicker").pickadate({
            selectMonths: true,
            selectYears: 60
          });
          $(".collapsible").collapsible({
            accordion: false
          });
        });
      })(jQuery);
    },
  
    componentDidUpdate: function componentDidUpdate() {
      (function ($) {
        $(function () {
          $(".modal-trigger").leanModal();
          $("ul.tabs").tabs();
          $("select").material_select();
          $(".datepicker").pickadate({
            selectMonths: true,
            selectYears: 60
          });
          $(".collapsible").collapsible({
            accordion: false
          });
        });
      })(jQuery);
    },
  
    render: function render() {
      var page = AppStore.getPage(this.props.path);
      invariant(page !== undefined, "Failed to load page content.");
      this.props.onSetTitle(page.title);
  
      if (page.type === "notfound") {
        this.props.onPageNotFound();
        return React.createElement(NotFoundPage, page);
      }
  
      return (
        /* jshint ignore:start */
        React.createElement(
          "div",
          { className: "App grey lighten-4" },
          React.createElement(Navbar, null),
          this.props.path === "/" ? React.createElement(
            "div",
            { className: "main" },
            React.createElement(
              "div",
              { className: "section  blue-grey darken-2 no-pad-bot", id: "index-banner" },
              React.createElement(
                "div",
                { className: "container" },
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement(
                  "h1",
                  { className: "header center" },
                  "SWD BITS Goa"
                ),
                React.createElement(
                  "div",
                  { className: "row center" },
                  React.createElement(
                    "h5",
                    { className: "header col s12 light" },
                    "Welcome to Student Welfare Division"
                  )
                ),
                React.createElement(
                  "div",
                  { className: "row center" },
                  React.createElement(
                    "a",
                    { className: "waves-effect waves-light orange darken-2 btn modal-trigger ", href: "#login-modal" },
                    "Login"
                  ),
                  React.createElement(
                    "div",
                    { id: "login-modal", className: "modal" },
                    React.createElement(
                      "div",
                      { className: "modal-content" },
                      React.createElement(
                        "h4",
                        null,
                        "Login"
                      ),
                      React.createElement(
                        "form",
                        { className: "col s12" },
                        React.createElement(
                          "div",
                          { className: "row" },
                          React.createElement(
                            "div",
                            { className: "input-field col s12" },
                            React.createElement("input", { id: "username", type: "text", className: "validate" }),
                            React.createElement(
                              "label",
                              { htmlFor: "username" },
                              "Username"
                            )
                          )
                        ),
                        React.createElement(
                          "div",
                          { className: "row" },
                          React.createElement(
                            "div",
                            { className: "input-field col s12" },
                            React.createElement("input", { id: "password", type: "password", className: "validate" }),
                            React.createElement(
                              "label",
                              { htmlFor: "password" },
                              "Password"
                            )
                          )
                        )
                      )
                    ),
                    React.createElement(
                      "div",
                      { className: "modal-footer" },
                      React.createElement(
                        "a",
                        { href: "/student", className: "waves-effect waves-red btn-flat modal-action modal-close" },
                        "Login"
                      ),
                      React.createElement(
                        "a",
                        { href: "/", className: "waves-effect waves-red btn-flat modal-action modal-close" },
                        "Cancel"
                      )
                    )
                  )
                ),
                React.createElement("br", null),
                React.createElement("br", null)
              )
            )
          ) : React.createElement(
            "div",
            { className: "main" },
            React.createElement(
              "div",
              { className: "section  blue-grey darken-2 no-pad-bot", id: "index-banner" },
              React.createElement(
                "div",
                { className: "container" },
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement(
                  "h3",
                  { className: "header center" },
                  page.title
                ),
                React.createElement("br", null),
                React.createElement("br", null)
              )
            )
          ),
          React.createElement(ContentPage, page),
          React.createElement(
            "footer",
            { className: "page-footer  blue-grey darken-2" },
            React.createElement(
              "div",
              { className: "container" },
              React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                  "div",
                  { className: "col l4 s12" },
                  React.createElement(
                    "h5",
                    { className: "white-text" },
                    "Settings"
                  ),
                  React.createElement(
                    "ul",
                    null,
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 1"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 2"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 3"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 4"
                      )
                    )
                  )
                ),
                React.createElement(
                  "div",
                  { className: "col l4 s12" },
                  React.createElement(
                    "h5",
                    { className: "white-text" },
                    "Connect"
                  ),
                  React.createElement(
                    "ul",
                    null,
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 1"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 2"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 3"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 4"
                      )
                    )
                  )
                ),
                React.createElement(
                  "div",
                  { className: "col l4 s12" },
                  React.createElement(
                    "h5",
                    { className: "white-text" },
                    "Connect"
                  ),
                  React.createElement(
                    "ul",
                    null,
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 1"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 2"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 3"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { className: "white-text", href: "#!" },
                        "Link 4"
                      )
                    )
                  )
                )
              )
            ),
            React.createElement(
              "div",
              { className: "footer-copyright" },
              React.createElement(
                "div",
                { className: "container" },
                "Developed By Nihant Subramanya and Ravi Agrawal"
              )
            )
          )
        )
      );
    }
  
  });
  
  module.exports = Application;
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

  /* jshint ignore:end */

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var React = _interopRequire(__webpack_require__(1));
  
  var ExecutionEnvironment = _interopRequire(__webpack_require__(8));
  
  var AppActions = _interopRequire(__webpack_require__(5));
  
  var NavigationMixin = {
  
    componentDidMount: function componentDidMount() {
      if (ExecutionEnvironment.canUseDOM) {
        window.addEventListener("popstate", this.handlePopState);
        window.addEventListener("click", this.handleClick);
      }
    },
  
    componentWillUnmount: function componentWillUnmount() {
      window.removeEventListener("popstate", this.handlePopState);
      window.removeEventListener("click", this.handleClick);
    },
  
    handlePopState: function handlePopState(event) {
      if (event.state) {
        var path = event.state.path;
        // TODO: Replace current location
        // replace(path, event.state);
      } else {
        AppActions.navigateTo(window.location.pathname);
      }
    },
  
    handleClick: function handleClick(event) {
      if (event.button === 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.defaultPrevented) {
        return;
      }
  
      // Ensure link
      var el = event.target;
      while (el && el.nodeName !== "A") {
        el = el.parentNode;
      }
      if (!el || el.nodeName !== "A") {
        return;
      }
  
      // Ignore if tag has
      // 1. "download" attribute
      // 2. rel="external" attribute
      if (el.getAttribute("download") || el.getAttribute("rel") === "external") {
        return;
      }
  
      // Ensure non-hash for the same path
      var link = el.getAttribute("href");
      if (el.pathname === location.pathname && (el.hash || "#" === link)) {
        return;
      }
  
      // Check for mailto: in the href
      if (link && link.indexOf("mailto:") > -1) {
        return;
      }
  
      // Check target
      if (el.target) {
        return;
      }
  
      // X-origin
      var origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
      if (!(el.href && el.href.indexOf(origin) === 0)) {
        return;
      }
  
      // Rebuild path
      var path = el.pathname + el.search + (el.hash || "");
  
      event.preventDefault();
      AppActions.loadPage(path, function () {
        AppActions.navigateTo(path);
      });
    }
  
  };
  
  module.exports = NavigationMixin;
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var React = _interopRequire(__webpack_require__(1));
  
  var ContentPage = React.createClass({
    displayName: "ContentPage",
  
    propTypes: {
      body: React.PropTypes.string.isRequired
    },
  
    render: function render() {
      var _props = this.props;
      var className = _props.className;
      var title = _props.title;
      var body = _props.body;
      var other = _props.other;
  
      /* jshint ignore:start */
      return React.createElement("div", { className: "ContentPage " + className,
        dangerouslySetInnerHTML: { __html: body } });
      /* jshint ignore:end */
    }
  
  });
  
  module.exports = ContentPage;
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  var React = _interopRequire(__webpack_require__(1));
  
  var Navbar = React.createClass({
    displayName: "Navbar",
  
    componentDidMount: function componentDidMount() {
      (function ($) {
        $(function () {
          $(".button-collapse").sideNav();
        });
      })(jQuery);
    },
  
    render: function render() {
      return (
  
        /* jshint ignore:start */
        React.createElement(
          "div",
          { className: "navbar" },
          React.createElement(
            "div",
            { className: "top-nav--home" },
            React.createElement(
              "ul",
              { id: "nav-mobile", className: "fixed side-nav" },
              React.createElement(
                "li",
                { className: "logo" },
                React.createElement(
                  "a",
                  { id: "logo-container", href: "http://www.bits-pilani.ac.in", className: "brand-logo" },
                  React.createElement("img", { src: __webpack_require__(11), width: "125", height: "125", alt: "BITS Pilani Logo" })
                )
              ),
              React.createElement(
                "li",
                { className: "bold active" },
                React.createElement(
                  "a",
                  { href: "/", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-action-home" }),
                  " Home"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/swd-services", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-action-stars" }),
                  " SWD Services"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/csa", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-social-people" }),
                  " CSA"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/activity-center", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-maps-local-attraction" }),
                  " Activity Center"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/anti-ragging", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-action-assignment" }),
                  " Anti Ragging"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/migration-form", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-action-receipt" }),
                  " Migration Form"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/contact", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-action-perm-contact-cal" }),
                  " Contact Us"
                )
              )
            )
          ),
          React.createElement(
            "header",
            null,
            React.createElement(
              "nav",
              { className: "top-nav--home" },
              React.createElement(
                "div",
                { className: "container" },
                React.createElement(
                  "a",
                  { href: "#", "data-activates": "nav-mobile", className: "button-collapse" },
                  React.createElement("i", { className: "mdi-navigation-menu" })
                )
              )
            ),
            React.createElement(
              "ul",
              { id: "nav-mobile", className: "fixed side-nav" },
              React.createElement(
                "li",
                { className: "logo" },
                React.createElement(
                  "a",
                  { id: "logo-container", href: "http://www.bits-pilani.ac.in", className: "brand-logo" },
                  React.createElement("img", { src: __webpack_require__(11), width: "125", height: "125", alt: "BITS Pilani Logo" })
                )
              ),
              React.createElement(
                "li",
                { className: "bold active" },
                React.createElement(
                  "a",
                  { href: "/", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-action-home" }),
                  " Home"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/swd-services", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-action-stars" }),
                  " SWD Services"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/csa", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-social-people" }),
                  " CSA"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/activity-center", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-maps-local-attraction" }),
                  " Activity Center"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/anti-ragging", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-action-assignment" }),
                  " Anti Ragging"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/migration-form", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-action-receipt" }),
                  " Migration Form"
                )
              ),
              React.createElement(
                "li",
                { className: "bold" },
                React.createElement(
                  "a",
                  { href: "/contact", className: "waves-effect waves-orange" },
                  React.createElement("i", { className: "small mdi-action-perm-contact-cal" }),
                  " Contact Us"
                )
              )
            )
          )
        )
      );
    }
  
  });
  
  module.exports = Navbar;
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

  /* jshint ignore:end */

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
  
  //require('./NotFoundPage.less');
  
  var React = _interopRequire(__webpack_require__(1));
  
  var NotFoundPage = React.createClass({
    displayName: "NotFoundPage",
  
    render: function render() {
      return (
        /* jshint ignore:start */
        React.createElement(
          "div",
          null,
          React.createElement(
            "h1",
            null,
            "Page Not Found"
          ),
          React.createElement(
            "p",
            null,
            "Sorry, but the page you were trying to view does not exist."
          )
        )
      );
    }
  
  });
  
  module.exports = NotFoundPage;
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

  /* jshint ignore:end */

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

  "use strict";
  
  var mysql = __webpack_require__(27);
  var conn = mysql.createConnection({
    host: "localhost",
    user: "swd",
    password: "swd",
    database: "students"
  });
  
  var api = {
    // Returns basic student info for login page.
    // PARAMS: id = ldap login id
    studentInfo: function studentInfo(req, res, id) {
      conn.query("SELECT * FROM student_info WHERE loginID=?", req.query.id, function (err, row) {
        res.json([err, row]);
      });
    }
  };
  
  var DBStore = {
    process: function process(req, res) {
      var path = req.path.substr(8);
      if (!api.hasOwnProperty(path)) {
        res.json("Trying something illegal?\n" + path);
        return;
      }
      api[path](req, res);
    }
  };
  
  module.exports = DBStore;
  /*
   * React.js Starter Kit
   * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.txt file in the root directory of this source tree.
   */

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = function() {
  	var list = [];
  	list.toString = function toString() {
  		var result = [];
  		for(var i = 0; i < this.length; i++) {
  			var item = this[i];
  			if(item[2]) {
  				result.push("@media " + item[2] + "{" + item[1] + "}");
  			} else {
  				result.push(item[1]);
  			}
  		}
  		return result.join("");
  	};
  	return list;
  }

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

  exports = module.exports = __webpack_require__(18)();
  exports.push([module.id, "/*\n * React.js Starter Kit\n * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE.txt file in the root directory of this source tree.\n */\n", ""]);

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("eventemitter3");

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("express");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("flux");

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("front-matter");

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("fs");

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("jade");

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("lodash");

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("mysql");

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("path");

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = require("superagent");

/***/ }
/******/ ])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODIyMTJkOTMzOGMwZjZkYmRlODYiLCJ3ZWJwYWNrOi8vL0U6L3JhdmkvV29yay9TV0Qvc3dkLXJlYWN0L3NyYy9zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3RcIiIsIndlYnBhY2s6Ly8vRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvc3JjL2NvbnN0YW50cy9BY3Rpb25UeXBlcy5qcyIsIndlYnBhY2s6Ly8vRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvc3JjL2NvcmUvRGlzcGF0Y2hlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYWN0L2xpYi9PYmplY3QuYXNzaWduLmpzIiwid2VicGFjazovLy9FOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9zcmMvYWN0aW9ucy9BcHBBY3Rpb25zLmpzIiwid2VicGFjazovLy9FOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9zcmMvY29uc3RhbnRzL1BheWxvYWRTb3VyY2VzLmpzIiwid2VicGFjazovLy9FOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9zcmMvc3RvcmVzL0FwcFN0b3JlLmpzIiwid2VicGFjazovLy8uL34vcmVhY3QvbGliL0V4ZWN1dGlvbkVudmlyb25tZW50LmpzIiwid2VicGFjazovLy8uL34vcmVhY3QvbGliL2ludmFyaWFudC5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYWN0L2xpYi9rZXlNaXJyb3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvTmF2YmFyL2xvZ28tc21hbGwucG5nIiwid2VicGFjazovLy9FOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9zcmMvY29tcG9uZW50cy9BcHAvQXBwLmpzIiwid2VicGFjazovLy9FOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9zcmMvY29tcG9uZW50cy9BcHAvTmF2aWdhdGlvbk1peGluLmpzIiwid2VicGFjazovLy9FOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9zcmMvY29tcG9uZW50cy9Db250ZW50UGFnZS9Db250ZW50UGFnZS5qcyIsIndlYnBhY2s6Ly8vRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvc3JjL2NvbXBvbmVudHMvTmF2YmFyL05hdmJhci5qcyIsIndlYnBhY2s6Ly8vRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvc3JjL2NvbXBvbmVudHMvTm90Rm91bmRQYWdlL05vdEZvdW5kUGFnZS5qcyIsIndlYnBhY2s6Ly8vRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvc3JjL3N0b3Jlcy9EQlN0b3JlLmpzIiwid2VicGFjazovLy8uL34vY3NzLWxvYWRlci9jc3NUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9BcHAvQXBwLmxlc3MiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXZlbnRlbWl0dGVyM1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmbHV4XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnJvbnQtbWF0dGVyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJqYWRlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibG9kYXNoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibXlzcWxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3VwZXJhZ2VudFwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx3Qzs7Ozs7Ozs7Ozs7TUM1Qk8sQ0FBQyx1Q0FB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QUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNyQjtHQUNGLENBQUM7O0FBRUYsUUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN2Q3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0EsMENBQXdDLGdCQUFnQjtBQUN4RCxNQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDZkE7QUFDQSxpUjs7Ozs7O0FDREEsNEM7Ozs7OztBQ0FBLHNDOzs7Ozs7QUNBQSxtQzs7Ozs7O0FDQUEsMkM7Ozs7OztBQ0FBLGlDOzs7Ozs7QUNBQSxtQzs7Ozs7O0FDQUEscUM7Ozs7OztBQ0FBLG9DOzs7Ozs7QUNBQSxtQzs7Ozs7O0FDQUEseUMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIuL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDgyMjEyZDkzMzhjMGY2ZGJkZTg2XG4gKiovIiwiLypcclxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcclxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXHJcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgRGlzcGF0Y2hlciBmcm9tICcuL2NvcmUvRGlzcGF0Y2hlcic7XHJcbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICcuL2NvbnN0YW50cy9BY3Rpb25UeXBlcyc7XHJcbmltcG9ydCBBcHBTdG9yZSBmcm9tICcuL3N0b3Jlcy9BcHBTdG9yZSc7XHJcbmltcG9ydCBEQlN0b3JlIGZyb20gJy4vc3RvcmVzL0RCU3RvcmUnO1xyXG5cclxudmFyIHNlcnZlciA9IGV4cHJlc3MoKTtcclxuXHJcbnNlcnZlci5zZXQoJ3BvcnQnLCAocHJvY2Vzcy5lbnYuUE9SVCB8fCA1MDAwKSk7XHJcbnNlcnZlci51c2UoZXhwcmVzcy5zdGF0aWMocGF0aC5qb2luKF9fZGlybmFtZSkpKTtcclxuXHJcbi8vXHJcbi8vIFBhZ2UgQVBJXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbnNlcnZlci5nZXQoJy9hcGkvcGFnZS8qJywgZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICB2YXIgcGF0aCA9IHJlcS5wYXRoLnN1YnN0cig5KTtcclxuICB2YXIgcGFnZSA9IEFwcFN0b3JlLmdldFBhZ2UocGF0aCk7XHJcbiAgcmVzLnNlbmQocGFnZSk7XHJcbn0pO1xyXG5cclxuLy9cclxuLy8gREIgQVBJc1xyXG4vL1xyXG5zZXJ2ZXIuZ2V0KCcvYXBpL2RiLyonLCBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIERCU3RvcmUucHJvY2VzcyhyZXEsIHJlcyk7XHJcbn0pO1xyXG5cclxuLy9cclxuLy8gU2VydmVyLXNpZGUgcmVuZGVyaW5nXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4vLyBUaGUgdG9wLWxldmVsIFJlYWN0IGNvbXBvbmVudCArIEhUTUwgdGVtcGxhdGUgZm9yIGl0XHJcbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHJlcXVpcmUoJy4vY29tcG9uZW50cy9BcHAnKSk7XHJcbnZhciB0ZW1wbGF0ZUZpbGUgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVtcGxhdGVzL2luZGV4Lmh0bWwnKTtcclxudmFyIHRlbXBsYXRlID0gXy50ZW1wbGF0ZShmcy5yZWFkRmlsZVN5bmModGVtcGxhdGVGaWxlLCAndXRmOCcpKTtcclxuXHJcbnNlcnZlci5nZXQoJyonLCBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHZhciBkYXRhID0ge2Rlc2NyaXB0aW9uOiAnJ307XHJcbiAgdmFyIGFwcCA9IG5ldyBBcHAoe1xyXG4gICAgcGF0aDogcmVxLnBhdGgsXHJcbiAgICBvblNldFRpdGxlOiBmdW5jdGlvbih0aXRsZSkgeyBkYXRhLnRpdGxlID0gdGl0bGU7IH0sXHJcbiAgICBvblNldE1ldGE6IGZ1bmN0aW9uKG5hbWUsIGNvbnRlbnQpIHsgZGF0YVtuYW1lXSA9IGNvbnRlbnQ7IH0sXHJcbiAgICBvblBhZ2VOb3RGb3VuZDogZnVuY3Rpb24oKSB7IHJlcy5zdGF0dXMoNDA0KTsgfVxyXG4gIH0pO1xyXG4gIGRhdGEuYm9keSA9IFJlYWN0LnJlbmRlclRvU3RyaW5nKGFwcCk7XHJcbiAgdmFyIGh0bWwgPSB0ZW1wbGF0ZShkYXRhKTtcclxuICByZXMuc2VuZChodG1sKTtcclxufSk7XHJcblxyXG4vLyBMb2FkIHBhZ2VzIGZyb20gdGhlIGAvc3JjL2NvbnRlbnQvYCBmb2xkZXIgaW50byB0aGUgQXBwU3RvcmVcclxuKGZ1bmN0aW9uKCkge1xyXG4gIHZhciBhc3NpZ24gPSByZXF1aXJlKCdyZWFjdC9saWIvT2JqZWN0LmFzc2lnbicpO1xyXG4gIHZhciBmbSA9IHJlcXVpcmUoJ2Zyb250LW1hdHRlcicpO1xyXG4gIHZhciBqYWRlID0gcmVxdWlyZSgnamFkZScpO1xyXG4gIHZhciBzb3VyY2VEaXIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9jb250ZW50Jyk7XHJcbiAgdmFyIGdldEZpbGVzID0gZnVuY3Rpb24oZGlyKSB7XHJcbiAgICB2YXIgcGFnZXMgPSBbXTtcclxuICAgIGZzLnJlYWRkaXJTeW5jKGRpcikuZm9yRWFjaChmdW5jdGlvbihmaWxlKSB7XHJcbiAgICAgIHZhciBzdGF0ID0gZnMuc3RhdFN5bmMocGF0aC5qb2luKGRpciwgZmlsZSkpO1xyXG4gICAgICBpZiAoc3RhdCAmJiBzdGF0LmlzRGlyZWN0b3J5KCkpIHtcclxuICAgICAgICBwYWdlcyA9IHBhZ2VzLmNvbmNhdChnZXRGaWxlcyhmaWxlKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gQ29udmVydCB0aGUgZmlsZSB0byBhIFBhZ2Ugb2JqZWN0XHJcbiAgICAgICAgdmFyIGZpbGVuYW1lID0gcGF0aC5qb2luKGRpciwgZmlsZSk7XHJcbiAgICAgICAgdmFyIHVybCA9IGZpbGVuYW1lLlxyXG4gICAgICAgICAgc3Vic3RyKHNvdXJjZURpci5sZW5ndGgsIGZpbGVuYW1lLmxlbmd0aCAtIHNvdXJjZURpci5sZW5ndGggLSA1KVxyXG4gICAgICAgICAgLnJlcGxhY2UoJ1xcXFwnLCAnLycpO1xyXG4gICAgICAgIGlmICh1cmwuaW5kZXhPZignL2luZGV4JywgdXJsLmxlbmd0aCAtIDYpICE9PSAtMSkge1xyXG4gICAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCB1cmwubGVuZ3RoIC0gKHVybC5sZW5ndGggPiA2ID8gNiA6IDUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZSwgJ3V0ZjgnKTtcclxuICAgICAgICB2YXIgY29udGVudCA9IGZtKHNvdXJjZSk7XHJcbiAgICAgICAgdmFyIGh0bWwgPSBqYWRlLnJlbmRlcihjb250ZW50LmJvZHksIG51bGwsICcgICcpO1xyXG4gICAgICAgIHZhciBwYWdlID0gYXNzaWduKHt9LCB7cGF0aDogdXJsLCBib2R5OiBodG1sfSwgY29udGVudC5hdHRyaWJ1dGVzKTtcclxuICAgICAgICBEaXNwYXRjaGVyLmhhbmRsZVNlcnZlckFjdGlvbih7XHJcbiAgICAgICAgICBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlcy5MT0FEX1BBR0UsXHJcbiAgICAgICAgICBwYXRoOiB1cmwsXHJcbiAgICAgICAgICBwYWdlOiBwYWdlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHBhZ2VzO1xyXG4gIH07XHJcbiAgcmV0dXJuIGdldEZpbGVzKHNvdXJjZURpcik7XHJcbn0pKCk7XHJcblxyXG5zZXJ2ZXIubGlzdGVuKHNlcnZlci5nZXQoJ3BvcnQnKSwgZnVuY3Rpb24oKSB7XHJcbiAgaWYgKHByb2Nlc3Muc2VuZCkge1xyXG4gICAgcHJvY2Vzcy5zZW5kKCdvbmxpbmUnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY29uc29sZS5sb2coJ1RoZSBzZXJ2ZXIgaXMgcnVubmluZyBhdCBodHRwOi8vbG9jYWxob3N0OicgKyBzZXJ2ZXIuZ2V0KCdwb3J0JykpO1xyXG4gIH1cclxufSk7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEU6L3JhdmkvV29yay9TV0Qvc3dkLXJlYWN0L34vanNoaW50LWxvYWRlciFFOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9zcmMvc2VydmVyLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3RcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInJlYWN0XCJcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKlxyXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxyXG4gKlxyXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcclxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ3JlYWN0L2xpYi9rZXlNaXJyb3InO1xyXG5cclxudmFyIEFjdGlvblR5cGVzID0ga2V5TWlycm9yKHtcclxuXHJcbiAgTE9BRF9QQUdFOiBudWxsLFxyXG4gIExPQURfUEFHRV9TVUNDRVNTOiBudWxsLFxyXG4gIExPQURfUEFHRV9FUlJPUjogbnVsbCxcclxuICBDSEFOR0VfTE9DQVRJT046IG51bGxcclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb25UeXBlcztcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvfi9qc2hpbnQtbG9hZGVyIUU6L3JhdmkvV29yay9TV0Qvc3dkLXJlYWN0L3NyYy9jb25zdGFudHMvQWN0aW9uVHlwZXMuanNcbiAqKi8iLCIvKlxyXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxyXG4gKlxyXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcclxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgRmx1eCBmcm9tICdmbHV4JztcclxuaW1wb3J0IFBheWxvYWRTb3VyY2VzIGZyb20gJy4uL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcyc7XHJcbmltcG9ydCBhc3NpZ24gZnJvbSAncmVhY3QvbGliL09iamVjdC5hc3NpZ24nO1xyXG5cclxuLyoqXHJcbiAqIEEgc2luZ2xldG9uIHRoYXQgb3BlcmF0ZXMgYXMgdGhlIGNlbnRyYWwgaHViIGZvciBhcHBsaWNhdGlvbiB1cGRhdGVzLlxyXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiB2aXNpdCBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9mbHV4L1xyXG4gKi9cclxudmFyIERpc3BhdGNoZXIgPSBhc3NpZ24obmV3IEZsdXguRGlzcGF0Y2hlcigpLCB7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBhY3Rpb24gVGhlIGRldGFpbHMgb2YgdGhlIGFjdGlvbiwgaW5jbHVkaW5nIHRoZSBhY3Rpb24nc1xyXG4gICAqIHR5cGUgYW5kIGFkZGl0aW9uYWwgZGF0YSBjb21pbmcgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAqL1xyXG4gIGhhbmRsZVNlcnZlckFjdGlvbihhY3Rpb24pIHtcclxuICAgIHZhciBwYXlsb2FkID0ge1xyXG4gICAgICBzb3VyY2U6IFBheWxvYWRTb3VyY2VzLlNFUlZFUl9BQ1RJT04sXHJcbiAgICAgIGFjdGlvbjogYWN0aW9uXHJcbiAgICB9O1xyXG4gICAgdGhpcy5kaXNwYXRjaChwYXlsb2FkKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge29iamVjdH0gYWN0aW9uIFRoZSBkZXRhaWxzIG9mIHRoZSBhY3Rpb24sIGluY2x1ZGluZyB0aGUgYWN0aW9uJ3NcclxuICAgKiB0eXBlIGFuZCBhZGRpdGlvbmFsIGRhdGEgY29taW5nIGZyb20gdGhlIHZpZXcuXHJcbiAgICovXHJcbiAgaGFuZGxlVmlld0FjdGlvbihhY3Rpb24pIHtcclxuICAgIHZhciBwYXlsb2FkID0ge1xyXG4gICAgICBzb3VyY2U6IFBheWxvYWRTb3VyY2VzLlZJRVdfQUNUSU9OLFxyXG4gICAgICBhY3Rpb246IGFjdGlvblxyXG4gICAgfTtcclxuICAgIHRoaXMuZGlzcGF0Y2gocGF5bG9hZCk7XHJcbiAgfVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BhdGNoZXI7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEU6L3JhdmkvV29yay9TV0Qvc3dkLXJlYWN0L34vanNoaW50LWxvYWRlciFFOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9zcmMvY29yZS9EaXNwYXRjaGVyLmpzXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBPYmplY3QuYXNzaWduXG4gKi9cblxuLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5hc3NpZ25cblxuZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlcykge1xuICBpZiAodGFyZ2V0ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIHRhcmdldCBjYW5ub3QgYmUgbnVsbCBvciB1bmRlZmluZWQnKTtcbiAgfVxuXG4gIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICB2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4gIGZvciAodmFyIG5leHRJbmRleCA9IDE7IG5leHRJbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IG5leHRJbmRleCsrKSB7XG4gICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbbmV4dEluZGV4XTtcbiAgICBpZiAobmV4dFNvdXJjZSA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgZnJvbSA9IE9iamVjdChuZXh0U291cmNlKTtcblxuICAgIC8vIFdlIGRvbid0IGN1cnJlbnRseSBzdXBwb3J0IGFjY2Vzc29ycyBub3IgcHJveGllcy4gVGhlcmVmb3JlIHRoaXNcbiAgICAvLyBjb3B5IGNhbm5vdCB0aHJvdy4gSWYgd2UgZXZlciBzdXBwb3J0ZWQgdGhpcyB0aGVuIHdlIG11c3QgaGFuZGxlXG4gICAgLy8gZXhjZXB0aW9ucyBhbmQgc2lkZS1lZmZlY3RzLiBXZSBkb24ndCBzdXBwb3J0IHN5bWJvbHMgc28gdGhleSB3b24ndFxuICAgIC8vIGJlIHRyYW5zZmVycmVkLlxuXG4gICAgZm9yICh2YXIga2V5IGluIGZyb20pIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcbiAgICAgICAgdG9ba2V5XSA9IGZyb21ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG87XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3JlYWN0L2xpYi9PYmplY3QuYXNzaWduLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLypcclxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcclxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXHJcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IERpc3BhdGNoZXIgZnJvbSAnLi4vY29yZS9EaXNwYXRjaGVyJztcclxuaW1wb3J0IEFjdGlvblR5cGVzIGZyb20gJy4uL2NvbnN0YW50cy9BY3Rpb25UeXBlcyc7XHJcbmltcG9ydCBFeGVjdXRpb25FbnZpcm9ubWVudCBmcm9tICdyZWFjdC9saWIvRXhlY3V0aW9uRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgaHR0cCBmcm9tICdzdXBlcmFnZW50JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICBuYXZpZ2F0ZVRvKHBhdGgpIHtcclxuICAgIGlmIChFeGVjdXRpb25FbnZpcm9ubWVudC5jYW5Vc2VET00pIHtcclxuICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSwgcGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcclxuICAgICAgYWN0aW9uVHlwZTogQWN0aW9uVHlwZXMuQ0hBTkdFX0xPQ0FUSU9OLCBwYXRoOiBwYXRoXHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICBsb2FkUGFnZShwYXRoLCBjYikge1xyXG4gICAgRGlzcGF0Y2hlci5oYW5kbGVWaWV3QWN0aW9uKHtcclxuICAgICAgYWN0aW9uVHlwZTogQWN0aW9uVHlwZXMuTE9BRF9QQUdFLCBwYXRoOiBwYXRoXHJcbiAgICB9KTtcclxuXHJcbiAgICBodHRwLmdldCgnL2FwaS9wYWdlJyArIHBhdGgpXHJcbiAgICAgIC5hY2NlcHQoJ2FwcGxpY2F0aW9uL2pzb24nKVxyXG4gICAgICAuZW5kKChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgIERpc3BhdGNoZXIuaGFuZGxlU2VydmVyQWN0aW9uKHtcclxuICAgICAgICAgIGFjdGlvblR5cGU6IEFjdGlvblR5cGVzLkxPQURfUEFHRSwgcGF0aDogcGF0aCwgZXJyOiBlcnIsIHBhZ2U6IHJlcy5ib2R5XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKGNiKSB7XHJcbiAgICAgICAgICBjYigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxufTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvfi9qc2hpbnQtbG9hZGVyIUU6L3JhdmkvV29yay9TV0Qvc3dkLXJlYWN0L3NyYy9hY3Rpb25zL0FwcEFjdGlvbnMuanNcbiAqKi8iLCIvKlxyXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxyXG4gKlxyXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcclxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ3JlYWN0L2xpYi9rZXlNaXJyb3InO1xyXG5cclxudmFyIFBheWxvYWRTb3VyY2VzID0ga2V5TWlycm9yKHtcclxuXHJcbiAgVklFV19BQ1RJT046IG51bGwsXHJcbiAgU0VSVkVSX0FDVElPTjogbnVsbFxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBheWxvYWRTb3VyY2VzO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBFOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9+L2pzaGludC1sb2FkZXIhRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvc3JjL2NvbnN0YW50cy9QYXlsb2FkU291cmNlcy5qc1xuICoqLyIsIi8qXHJcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XHJcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXHJcbiAqXHJcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBEaXNwYXRjaGVyIGZyb20gJy4uL2NvcmUvRGlzcGF0Y2hlcic7XHJcbmltcG9ydCBBY3Rpb25UeXBlcyBmcm9tICcuLi9jb25zdGFudHMvQWN0aW9uVHlwZXMnO1xyXG5pbXBvcnQgUGF5bG9hZFNvdXJjZXMgZnJvbSAnLi4vY29uc3RhbnRzL1BheWxvYWRTb3VyY2VzJztcclxuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudGVtaXR0ZXIzJztcclxuaW1wb3J0IGFzc2lnbiBmcm9tICdyZWFjdC9saWIvT2JqZWN0LmFzc2lnbic7XHJcblxyXG52YXIgQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XHJcblxyXG52YXIgX3BhZ2VzID0ge307XHJcbnZhciBfbG9hZGluZyA9IGZhbHNlO1xyXG5cclxuaWYgKF9fU0VSVkVSX18pIHtcclxuICBfcGFnZXNbJy8nXSA9IHt0aXRsZTogJ0hvbWUgUGFnZSd9O1xyXG4gIF9wYWdlc1snL3N3ZC1zZXJ2aWNlcyddID0ge3RpdGxlOiAnU1dEIFNlcnZpY2VzJ307XHJcbiAgX3BhZ2VzWycvY3NhJ10gPSB7dGl0bGU6ICdDU0EnfTtcclxuICBfcGFnZXNbJy9hY3Rpdml0eS1jZW50ZXInXSA9IHt0aXRsZTogJ0FjdGl2aXR5IENlbnRlcid9O1xyXG4gIF9wYWdlc1snL2FudGktcmFnZ2luZyddID0ge3RpdGxlOiAnQW50aSBSYWdnaW5nJ307XHJcbiAgX3BhZ2VzWycvbWlncmF0aW9uLWZvcm0nXSA9IHt0aXRsZTogJ01pZ3JhdGlvbiBGb3JtJ307XHJcbiAgX3BhZ2VzWycvY29udGFjdCddID0ge3RpdGxlOiAnQ29udGFjdCd9O1xyXG4gIF9wYWdlc1snL3N0dWRlbnQnXSA9IHt0aXRsZTogJ1N0dWRlbnQnfTtcclxuICBfcGFnZXNbJy9zdHVkZW50LWxlYXZlJ10gPSB7dGl0bGU6ICdMZWF2ZSBQb3J0YWwnfTtcclxuICBfcGFnZXNbJy9zdHVkZW50LWR1ZXMnXSA9IHt0aXRsZTogJ0R1ZXMgRGV0YWlscyd9O1xyXG4gIF9wYWdlc1snL3N0dWRlbnQtbWVzcyddID0ge3RpdGxlOiAnTWVzcyBPcHRpb24nfTtcclxuICBfcGFnZXNbJy9zdHVkZW50LWNlcnRpZmljYXRlJ10gPSB7dGl0bGU6ICdDZXJ0aWZpY2F0ZXMnfTtcclxuICBfcGFnZXNbJy9zdHVkZW50LXByb2R1Y3QnXSA9IHt0aXRsZTogJ1Byb2R1Y3RzJ307XHJcbn1cclxuXHJcbnZhciBBcHBTdG9yZSA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHBhZ2UgZGF0YSBieSB0aGUgZ2l2ZW4gVVJMIHBhdGguXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCBVUkwgcGF0aC5cclxuICAgKiBAcmV0dXJucyB7Kn0gUGFnZSBkYXRhLlxyXG4gICAqL1xyXG4gIGdldFBhZ2UocGF0aCkge1xyXG4gICAgaWYocGF0aCA9PT0gJy9zdHVkZW50Jykge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGF0aCBpbiBfcGFnZXMgPyBfcGFnZXNbcGF0aF0gOiB7XHJcbiAgICAgIHRpdGxlOiAnUGFnZSBOb3QgRm91bmQnLFxyXG4gICAgICB0eXBlOiAnbm90Zm91bmQnXHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXRzIGNoYW5nZSBldmVudCB0byBhbGwgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gSW5kaWNhdGlvbiBpZiB3ZSd2ZSBlbWl0dGVkIGFuIGV2ZW50LlxyXG4gICAqL1xyXG4gIGVtaXRDaGFuZ2UoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5lbWl0KENIQU5HRV9FVkVOVCk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXIgYSBuZXcgY2hhbmdlIGV2ZW50IGxpc3RlbmVyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICovXHJcbiAgb25DaGFuZ2UoY2FsbGJhY2spIHtcclxuICAgIHRoaXMub24oQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGNoYW5nZSBldmVudCBsaXN0ZW5lci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAqL1xyXG4gIG9mZihjYWxsYmFjaykge1xyXG4gICAgdGhpcy5vZmYoQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxufSk7XHJcblxyXG5BcHBTdG9yZS5kaXNwYXRjaGVyVG9rZW4gPSBEaXNwYXRjaGVyLnJlZ2lzdGVyKChwYXlsb2FkKSA9PiB7XHJcbiAgdmFyIGFjdGlvbiA9IHBheWxvYWQuYWN0aW9uO1xyXG5cclxuICBzd2l0Y2ggKGFjdGlvbi5hY3Rpb25UeXBlKSB7XHJcblxyXG4gICAgY2FzZSBBY3Rpb25UeXBlcy5MT0FEX1BBR0U6XHJcbiAgICAgIGlmIChhY3Rpb24uc291cmNlID09PSBQYXlsb2FkU291cmNlcy5WSUVXX0FDVElPTikge1xyXG4gICAgICAgIF9sb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoIWFjdGlvbi5lcnIpIHtcclxuICAgICAgICAgIF9wYWdlc1thY3Rpb24ucGF0aF0gPSBhY3Rpb24ucGFnZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgQXBwU3RvcmUuZW1pdENoYW5nZSgpO1xyXG4gICAgICBicmVhaztcclxuXHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICAvLyBEbyBub3RoaW5nXHJcblxyXG4gIH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBTdG9yZTtcclxuXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEU6L3JhdmkvV29yay9TV0Qvc3dkLXJlYWN0L34vanNoaW50LWxvYWRlciFFOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9zcmMvc3RvcmVzL0FwcFN0b3JlLmpzXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIEV4ZWN1dGlvbkVudmlyb25tZW50XG4gKi9cblxuLypqc2xpbnQgZXZpbDogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGNhblVzZURPTSA9ICEhKFxuICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICB3aW5kb3cuZG9jdW1lbnQgJiZcbiAgd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnRcbik7XG5cbi8qKlxuICogU2ltcGxlLCBsaWdodHdlaWdodCBtb2R1bGUgYXNzaXN0aW5nIHdpdGggdGhlIGRldGVjdGlvbiBhbmQgY29udGV4dCBvZlxuICogV29ya2VyLiBIZWxwcyBhdm9pZCBjaXJjdWxhciBkZXBlbmRlbmNpZXMgYW5kIGFsbG93cyBjb2RlIHRvIHJlYXNvbiBhYm91dFxuICogd2hldGhlciBvciBub3QgdGhleSBhcmUgaW4gYSBXb3JrZXIsIGV2ZW4gaWYgdGhleSBuZXZlciBpbmNsdWRlIHRoZSBtYWluXG4gKiBgUmVhY3RXb3JrZXJgIGRlcGVuZGVuY3kuXG4gKi9cbnZhciBFeGVjdXRpb25FbnZpcm9ubWVudCA9IHtcblxuICBjYW5Vc2VET006IGNhblVzZURPTSxcblxuICBjYW5Vc2VXb3JrZXJzOiB0eXBlb2YgV29ya2VyICE9PSAndW5kZWZpbmVkJyxcblxuICBjYW5Vc2VFdmVudExpc3RlbmVyczpcbiAgICBjYW5Vc2VET00gJiYgISEod2luZG93LmFkZEV2ZW50TGlzdGVuZXIgfHwgd2luZG93LmF0dGFjaEV2ZW50KSxcblxuICBjYW5Vc2VWaWV3cG9ydDogY2FuVXNlRE9NICYmICEhd2luZG93LnNjcmVlbixcblxuICBpc0luV29ya2VyOiAhY2FuVXNlRE9NIC8vIEZvciBub3csIHRoaXMgaXMgdHJ1ZSAtIG1pZ2h0IGNoYW5nZSBpbiB0aGUgZnV0dXJlLlxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV4ZWN1dGlvbkVudmlyb25tZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vcmVhY3QvbGliL0V4ZWN1dGlvbkVudmlyb25tZW50LmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGludmFyaWFudFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKFwicHJvZHVjdGlvblwiICE9PSBwcm9jZXNzLmVudi5OT0RFX0VOVikge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICtcbiAgICAgICAgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdJbnZhcmlhbnQgVmlvbGF0aW9uOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJnc1thcmdJbmRleCsrXTsgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3JlYWN0L2xpYi9pbnZhcmlhbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUga2V5TWlycm9yXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZShcIi4vaW52YXJpYW50XCIpO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIHZhciBrZXk7XG4gIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgb2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaiksXG4gICAgJ2tleU1pcnJvciguLi4pOiBBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdC4nXG4gICkgOiBpbnZhcmlhbnQob2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaikpKTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0ga2V5O1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L3JlYWN0L2xpYi9rZXlNaXJyb3IuanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYTAxNTEzMjI4ODI1Njk5NzdmMTViM2VhNWY2NWZhYWUucG5nXCJcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvTmF2YmFyL2xvZ28tc21hbGwucG5nXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qXHJcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XHJcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXHJcbiAqXHJcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAnLi9BcHAubGVzcyc7XHJcblxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ3JlYWN0L2xpYi9pbnZhcmlhbnQnO1xyXG5pbXBvcnQgQXBwQWN0aW9ucyBmcm9tICcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnO1xyXG5pbXBvcnQgTmF2aWdhdGlvbk1peGluIGZyb20gJy4vTmF2aWdhdGlvbk1peGluJztcclxuaW1wb3J0IEFwcFN0b3JlIGZyb20gJy4uLy4uL3N0b3Jlcy9BcHBTdG9yZSc7XHJcbmltcG9ydCBOYXZiYXIgZnJvbSAnLi4vTmF2YmFyJztcclxuaW1wb3J0IENvbnRlbnRQYWdlIGZyb20gJy4uL0NvbnRlbnRQYWdlJztcclxuaW1wb3J0IE5vdEZvdW5kUGFnZSBmcm9tICcuLi9Ob3RGb3VuZFBhZ2UnO1xyXG5cclxudmFyIEFwcGxpY2F0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuICBtaXhpbnM6IFtOYXZpZ2F0aW9uTWl4aW5dLFxyXG5cclxuICBwcm9wVHlwZXM6IHtcclxuICAgIHBhdGg6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuICAgIG9uU2V0VGl0bGU6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICBvblNldE1ldGE6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXHJcbiAgICBvblBhZ2VOb3RGb3VuZDogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxyXG4gICAgXHJcbiAgfSxcclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgIChmdW5jdGlvbigkKXtcclxuICAgICAgJChmdW5jdGlvbigpe1xyXG4gICAgICAgICQoJy5tb2RhbC10cmlnZ2VyJykubGVhbk1vZGFsKCk7XHJcbiAgICAgICAgJCgndWwudGFicycpLnRhYnMoKTtcclxuICAgICAgICAkKCdzZWxlY3QnKS5tYXRlcmlhbF9zZWxlY3QoKTtcclxuICAgICAgICAkKCcuZGF0ZXBpY2tlcicpLnBpY2thZGF0ZSh7XHJcbiAgICAgICAgICBzZWxlY3RNb250aHM6IHRydWUsIFxyXG4gICAgICAgICAgc2VsZWN0WWVhcnM6IDYwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLmNvbGxhcHNpYmxlJykuY29sbGFwc2libGUoe1xyXG4gICAgICAgICAgYWNjb3JkaW9uIDogZmFsc2UgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pOyBcclxuICAgIH0pKGpRdWVyeSk7XHJcbiAgfSxcclxuXHJcbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAoZnVuY3Rpb24oJCl7XHJcbiAgICAgICQoZnVuY3Rpb24oKXtcclxuICAgICAgICAkKCcubW9kYWwtdHJpZ2dlcicpLmxlYW5Nb2RhbCgpO1xyXG4gICAgICAgICQoJ3VsLnRhYnMnKS50YWJzKCk7XHJcbiAgICAgICAgJCgnc2VsZWN0JykubWF0ZXJpYWxfc2VsZWN0KCk7XHJcbiAgICAgICAgJCgnLmRhdGVwaWNrZXInKS5waWNrYWRhdGUoe1xyXG4gICAgICAgICAgc2VsZWN0TW9udGhzOiB0cnVlLFxyXG4gICAgICAgICAgc2VsZWN0WWVhcnM6IDYwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnLmNvbGxhcHNpYmxlJykuY29sbGFwc2libGUoe1xyXG4gICAgICAgICAgYWNjb3JkaW9uIDogZmFsc2UgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pOyBcclxuICAgIH0pKGpRdWVyeSk7XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdmFyIHBhZ2UgPSBBcHBTdG9yZS5nZXRQYWdlKHRoaXMucHJvcHMucGF0aCk7XHJcbiAgICBpbnZhcmlhbnQocGFnZSAhPT0gdW5kZWZpbmVkLCAnRmFpbGVkIHRvIGxvYWQgcGFnZSBjb250ZW50LicpO1xyXG4gICAgdGhpcy5wcm9wcy5vblNldFRpdGxlKHBhZ2UudGl0bGUpO1xyXG5cclxuICAgIGlmIChwYWdlLnR5cGUgPT09ICdub3Rmb3VuZCcpIHtcclxuICAgICAgdGhpcy5wcm9wcy5vblBhZ2VOb3RGb3VuZCgpO1xyXG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChOb3RGb3VuZFBhZ2UsIHBhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJBcHAgZ3JleSBsaWdodGVuLTRcIj5cclxuICAgICAgICA8TmF2YmFyIC8+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGhpcy5wcm9wcy5wYXRoID09PSAnLycgP1xyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYWluXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbiAgYmx1ZS1ncmV5IGRhcmtlbi0yIG5vLXBhZC1ib3RcIiBpZD1cImluZGV4LWJhbm5lclwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgPGJyLz48YnIvPlxyXG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImhlYWRlciBjZW50ZXJcIj5TV0QgQklUUyBHb2E8L2gxPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJoZWFkZXIgY29sIHMxMiBsaWdodFwiPldlbGNvbWUgdG8gU3R1ZGVudCBXZWxmYXJlIERpdmlzaW9uPC9oNT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBvcmFuZ2UgZGFya2VuLTIgYnRuIG1vZGFsLXRyaWdnZXIgXCIgaHJlZj1cIiNsb2dpbi1tb2RhbFwiPkxvZ2luPC9hPlxyXG5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImxvZ2luLW1vZGFsXCIgY2xhc3NOYW1lPVwibW9kYWxcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxoND5Mb2dpbjwvaDQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJjb2wgczEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJ1c2VybmFtZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInVzZXJuYW1lXCI+VXNlcm5hbWU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cInBhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInBhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIi9zdHVkZW50XCIgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLXJlZCBidG4tZmxhdCBtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2VcIj5Mb2dpbjwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIvXCIgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLXJlZCBidG4tZmxhdCBtb2RhbC1hY3Rpb24gbW9kYWwtY2xvc2VcIj5DYW5jZWw8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PiAgXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxici8+PGJyLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj4gOlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYWluXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbiAgYmx1ZS1ncmV5IGRhcmtlbi0yIG5vLXBhZC1ib3RcIiBpZD1cImluZGV4LWJhbm5lclwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgPGJyLz48YnIvPlxyXG4gICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImhlYWRlciBjZW50ZXJcIj57cGFnZS50aXRsZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgPGJyLz48YnIvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIH1cclxuICAgICAgICA8Q29udGVudFBhZ2Ugey4uLnBhZ2V9IC8+XHJcbiAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJwYWdlLWZvb3RlciAgYmx1ZS1ncmV5IGRhcmtlbi0yXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIGw0IHMxMlwiPlxyXG4gICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cIndoaXRlLXRleHRcIj5TZXR0aW5nczwvaDU+XHJcbiAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgIDxsaT48YSBjbGFzc05hbWU9XCJ3aGl0ZS10ZXh0XCIgaHJlZj1cIiMhXCI+TGluayAxPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDxsaT48YSBjbGFzc05hbWU9XCJ3aGl0ZS10ZXh0XCIgaHJlZj1cIiMhXCI+TGluayAyPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDxsaT48YSBjbGFzc05hbWU9XCJ3aGl0ZS10ZXh0XCIgaHJlZj1cIiMhXCI+TGluayAzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDxsaT48YSBjbGFzc05hbWU9XCJ3aGl0ZS10ZXh0XCIgaHJlZj1cIiMhXCI+TGluayA0PC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIGw0IHMxMlwiPlxyXG4gICAgICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT1cIndoaXRlLXRleHRcIj5Db25uZWN0PC9oNT5cclxuICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgPGxpPjxhIGNsYXNzTmFtZT1cIndoaXRlLXRleHRcIiBocmVmPVwiIyFcIj5MaW5rIDE8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgPGxpPjxhIGNsYXNzTmFtZT1cIndoaXRlLXRleHRcIiBocmVmPVwiIyFcIj5MaW5rIDI8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgPGxpPjxhIGNsYXNzTmFtZT1cIndoaXRlLXRleHRcIiBocmVmPVwiIyFcIj5MaW5rIDM8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgPGxpPjxhIGNsYXNzTmFtZT1cIndoaXRlLXRleHRcIiBocmVmPVwiIyFcIj5MaW5rIDQ8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgbDQgczEyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwid2hpdGUtdGV4dFwiPkNvbm5lY3Q8L2g1PlxyXG4gICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICA8bGk+PGEgY2xhc3NOYW1lPVwid2hpdGUtdGV4dFwiIGhyZWY9XCIjIVwiPkxpbmsgMTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICA8bGk+PGEgY2xhc3NOYW1lPVwid2hpdGUtdGV4dFwiIGhyZWY9XCIjIVwiPkxpbmsgMjwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICA8bGk+PGEgY2xhc3NOYW1lPVwid2hpdGUtdGV4dFwiIGhyZWY9XCIjIVwiPkxpbmsgMzwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICA8bGk+PGEgY2xhc3NOYW1lPVwid2hpdGUtdGV4dFwiIGhyZWY9XCIjIVwiPkxpbmsgNDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9vdGVyLWNvcHlyaWdodFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICBEZXZlbG9wZWQgQnkgTmloYW50IFN1YnJhbWFueWEgYW5kIFJhdmkgQWdyYXdhbFxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZm9vdGVyPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgLyoganNoaW50IGlnbm9yZTplbmQgKi9cclxuICAgICk7XHJcbiAgfVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcGxpY2F0aW9uO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBFOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9+L2pzaGludC1sb2FkZXIhRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvc3JjL2NvbXBvbmVudHMvQXBwL0FwcC5qc1xuICoqLyIsIi8qXHJcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XHJcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXHJcbiAqXHJcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBFeGVjdXRpb25FbnZpcm9ubWVudCBmcm9tICdyZWFjdC9saWIvRXhlY3V0aW9uRW52aXJvbm1lbnQnO1xyXG5pbXBvcnQgQXBwQWN0aW9ucyBmcm9tICcuLi8uLi9hY3Rpb25zL0FwcEFjdGlvbnMnO1xyXG5cclxudmFyIE5hdmlnYXRpb25NaXhpbiA9IHtcclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICBpZiAoRXhlY3V0aW9uRW52aXJvbm1lbnQuY2FuVXNlRE9NKSB7XHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHRoaXMuaGFuZGxlUG9wU3RhdGUpO1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHRoaXMuaGFuZGxlUG9wU3RhdGUpO1xyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljayk7XHJcbiAgfSxcclxuXHJcbiAgaGFuZGxlUG9wU3RhdGUoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC5zdGF0ZSkge1xyXG4gICAgICB2YXIgcGF0aCA9IGV2ZW50LnN0YXRlLnBhdGg7XHJcbiAgICAgIC8vIFRPRE86IFJlcGxhY2UgY3VycmVudCBsb2NhdGlvblxyXG4gICAgICAvLyByZXBsYWNlKHBhdGgsIGV2ZW50LnN0YXRlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIEFwcEFjdGlvbnMubmF2aWdhdGVUbyh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGhhbmRsZUNsaWNrKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuYnV0dG9uID09PSAxIHx8IGV2ZW50Lm1ldGFLZXkgfHwgZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSB8fCBldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFbnN1cmUgbGlua1xyXG4gICAgdmFyIGVsID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgd2hpbGUgKGVsICYmIGVsLm5vZGVOYW1lICE9PSAnQScpIHtcclxuICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xyXG4gICAgfVxyXG4gICAgaWYgKCFlbCB8fCBlbC5ub2RlTmFtZSAhPT0gJ0EnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZ25vcmUgaWYgdGFnIGhhc1xyXG4gICAgLy8gMS4gXCJkb3dubG9hZFwiIGF0dHJpYnV0ZVxyXG4gICAgLy8gMi4gcmVsPVwiZXh0ZXJuYWxcIiBhdHRyaWJ1dGVcclxuICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJykgfHwgZWwuZ2V0QXR0cmlidXRlKCdyZWwnKSA9PT0gJ2V4dGVybmFsJykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRW5zdXJlIG5vbi1oYXNoIGZvciB0aGUgc2FtZSBwYXRoXHJcbiAgICB2YXIgbGluayA9IGVsLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xyXG4gICAgaWYgKGVsLnBhdGhuYW1lID09PSBsb2NhdGlvbi5wYXRobmFtZSAmJiAoZWwuaGFzaCB8fCAnIycgPT09IGxpbmspKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBmb3IgbWFpbHRvOiBpbiB0aGUgaHJlZlxyXG4gICAgaWYgKGxpbmsgJiYgbGluay5pbmRleE9mKCdtYWlsdG86JykgPiAtMSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgdGFyZ2V0XHJcbiAgICBpZiAoZWwudGFyZ2V0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBYLW9yaWdpblxyXG4gICAgdmFyIG9yaWdpbiA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgK1xyXG4gICAgICAod2luZG93LmxvY2F0aW9uLnBvcnQgPyAnOicgKyB3aW5kb3cubG9jYXRpb24ucG9ydCA6ICcnKTtcclxuICAgIGlmICghKGVsLmhyZWYgJiYgZWwuaHJlZi5pbmRleE9mKG9yaWdpbikgPT09IDApKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZWJ1aWxkIHBhdGhcclxuICAgIHZhciBwYXRoID0gZWwucGF0aG5hbWUgKyBlbC5zZWFyY2ggKyAoZWwuaGFzaCB8fCAnJyk7XHJcblxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIEFwcEFjdGlvbnMubG9hZFBhZ2UocGF0aCwgKCkgPT4ge1xyXG4gICAgICBBcHBBY3Rpb25zLm5hdmlnYXRlVG8ocGF0aCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZpZ2F0aW9uTWl4aW47XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEU6L3JhdmkvV29yay9TV0Qvc3dkLXJlYWN0L34vanNoaW50LWxvYWRlciFFOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9zcmMvY29tcG9uZW50cy9BcHAvTmF2aWdhdGlvbk1peGluLmpzXG4gKiovIiwiLypcclxuICogUmVhY3QuanMgU3RhcnRlciBLaXRcclxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtvbnN0YW50aW4gVGFya3VzIChAa29pc3R5YSksIEtyaWFTb2Z0IExMQy5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXHJcbiAqIExJQ0VOU0UudHh0IGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbnZhciBDb250ZW50UGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHJcbiAgcHJvcFR5cGVzOiB7XHJcbiAgICBib2R5OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcclxuICB9LFxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICB2YXIgeyBjbGFzc05hbWUsIHRpdGxlLCBib2R5LCBvdGhlciB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9eydDb250ZW50UGFnZSAnICsgY2xhc3NOYW1lfVxyXG4gICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e19faHRtbDogYm9keX19IC8+O1xyXG4gICAgLyoganNoaW50IGlnbm9yZTplbmQgKi9cclxuICB9XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29udGVudFBhZ2U7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEU6L3JhdmkvV29yay9TV0Qvc3dkLXJlYWN0L34vanNoaW50LWxvYWRlciFFOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9zcmMvY29tcG9uZW50cy9Db250ZW50UGFnZS9Db250ZW50UGFnZS5qc1xuICoqLyIsIi8qXHJcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XHJcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXHJcbiAqXHJcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG52YXIgTmF2YmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgKGZ1bmN0aW9uKCQpe1xyXG4gICAgJChmdW5jdGlvbigpe1xyXG4gICAgICAkKCcuYnV0dG9uLWNvbGxhcHNlJykuc2lkZU5hdigpO1xyXG4gICAgfSk7IFxyXG4gIH0pKGpRdWVyeSk7XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICBcclxuICAgICAgLyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xyXG4gIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9wLW5hdi0taG9tZVwiPlxyXG4gICAgICAgICAgXHJcbiAgICAgIDx1bCBpZD1cIm5hdi1tb2JpbGVcIiBjbGFzc05hbWU9XCJmaXhlZCBzaWRlLW5hdlwiPlxyXG4gICAgICAgIDxsaSBjbGFzc05hbWU9XCJsb2dvXCI+XHJcbiAgICAgICAgICA8YSBpZD1cImxvZ28tY29udGFpbmVyXCIgaHJlZj1cImh0dHA6Ly93d3cuYml0cy1waWxhbmkuYWMuaW5cIiBjbGFzc05hbWU9XCJicmFuZC1sb2dvXCI+XHJcbiAgICAgICAgICAgIDxpbWcgc3JjPXtyZXF1aXJlKCcuL2xvZ28tc21hbGwucG5nJyl9IHdpZHRoPVwiMTI1XCIgaGVpZ2h0PVwiMTI1XCIgYWx0PVwiQklUUyBQaWxhbmkgTG9nb1wiIC8+XHJcbiAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9saT5cclxuICAgICAgICA8bGkgY2xhc3NOYW1lPVwiYm9sZCBhY3RpdmVcIj48YSBocmVmPVwiL1wiIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1vcmFuZ2VcIj48aSBjbGFzc05hbWU9XCJzbWFsbCBtZGktYWN0aW9uLWhvbWVcIj48L2k+IEhvbWU8L2E+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3NOYW1lPVwiYm9sZFwiPjxhIGhyZWY9XCIvc3dkLXNlcnZpY2VzXCIgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLW9yYW5nZVwiPjxpIGNsYXNzTmFtZT1cInNtYWxsIG1kaS1hY3Rpb24tc3RhcnNcIj48L2k+IFNXRCBTZXJ2aWNlczwvYT48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzc05hbWU9XCJib2xkXCI+PGEgaHJlZj1cIi9jc2FcIiBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtb3JhbmdlXCI+PGkgY2xhc3NOYW1lPVwic21hbGwgbWRpLXNvY2lhbC1wZW9wbGVcIj48L2k+IENTQTwvYT48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzc05hbWU9XCJib2xkXCI+PGEgaHJlZj1cIi9hY3Rpdml0eS1jZW50ZXJcIiBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtb3JhbmdlXCI+PGkgY2xhc3NOYW1lPVwic21hbGwgbWRpLW1hcHMtbG9jYWwtYXR0cmFjdGlvblwiPjwvaT4gQWN0aXZpdHkgQ2VudGVyPC9hPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cImJvbGRcIj48YSBocmVmPVwiL2FudGktcmFnZ2luZ1wiIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1vcmFuZ2VcIj48aSBjbGFzc05hbWU9XCJzbWFsbCBtZGktYWN0aW9uLWFzc2lnbm1lbnRcIj48L2k+IEFudGkgUmFnZ2luZzwvYT48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzc05hbWU9XCJib2xkXCI+PGEgaHJlZj1cIi9taWdyYXRpb24tZm9ybVwiIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1vcmFuZ2VcIj48aSBjbGFzc05hbWU9XCJzbWFsbCBtZGktYWN0aW9uLXJlY2VpcHRcIj48L2k+IE1pZ3JhdGlvbiBGb3JtPC9hPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cImJvbGRcIj48YSBocmVmPVwiL2NvbnRhY3RcIiBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtb3JhbmdlXCI+PGkgY2xhc3NOYW1lPVwic21hbGwgbWRpLWFjdGlvbi1wZXJtLWNvbnRhY3QtY2FsXCI+PC9pPiBDb250YWN0IFVzPC9hPjwvbGk+ICAgIFxyXG4gICAgICA8L3VsPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGhlYWRlcj5cclxuICAgICAgPG5hdiBjbGFzc05hbWU9XCJ0b3AtbmF2LS1ob21lXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgIDxhIGhyZWY9XCIjXCIgZGF0YS1hY3RpdmF0ZXM9XCJuYXYtbW9iaWxlXCIgY2xhc3NOYW1lPVwiYnV0dG9uLWNvbGxhcHNlXCI+PGkgY2xhc3NOYW1lPVwibWRpLW5hdmlnYXRpb24tbWVudVwiPjwvaT48L2E+XHJcbiAgICAgICAgPC9kaXY+ICAgIFxyXG4gICAgICA8L25hdj5cclxuICAgICAgPHVsIGlkPVwibmF2LW1vYmlsZVwiIGNsYXNzTmFtZT1cImZpeGVkIHNpZGUtbmF2XCI+XHJcbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cImxvZ29cIj5cclxuICAgICAgICAgIDxhIGlkPVwibG9nby1jb250YWluZXJcIiBocmVmPVwiaHR0cDovL3d3dy5iaXRzLXBpbGFuaS5hYy5pblwiIGNsYXNzTmFtZT1cImJyYW5kLWxvZ29cIj5cclxuICAgICAgICAgICAgPGltZyBzcmM9e3JlcXVpcmUoJy4vbG9nby1zbWFsbC5wbmcnKX0gd2lkdGg9XCIxMjVcIiBoZWlnaHQ9XCIxMjVcIiBhbHQ9XCJCSVRTIFBpbGFuaSBMb2dvXCIgLz5cclxuICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzc05hbWU9XCJib2xkIGFjdGl2ZVwiPjxhIGhyZWY9XCIvXCIgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLW9yYW5nZVwiPjxpIGNsYXNzTmFtZT1cInNtYWxsIG1kaS1hY3Rpb24taG9tZVwiPjwvaT4gSG9tZTwvYT48L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzc05hbWU9XCJib2xkXCI+PGEgaHJlZj1cIi9zd2Qtc2VydmljZXNcIiBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtb3JhbmdlXCI+PGkgY2xhc3NOYW1lPVwic21hbGwgbWRpLWFjdGlvbi1zdGFyc1wiPjwvaT4gU1dEIFNlcnZpY2VzPC9hPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cImJvbGRcIj48YSBocmVmPVwiL2NzYVwiIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1vcmFuZ2VcIj48aSBjbGFzc05hbWU9XCJzbWFsbCBtZGktc29jaWFsLXBlb3BsZVwiPjwvaT4gQ1NBPC9hPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cImJvbGRcIj48YSBocmVmPVwiL2FjdGl2aXR5LWNlbnRlclwiIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1vcmFuZ2VcIj48aSBjbGFzc05hbWU9XCJzbWFsbCBtZGktbWFwcy1sb2NhbC1hdHRyYWN0aW9uXCI+PC9pPiBBY3Rpdml0eSBDZW50ZXI8L2E+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3NOYW1lPVwiYm9sZFwiPjxhIGhyZWY9XCIvYW50aS1yYWdnaW5nXCIgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLW9yYW5nZVwiPjxpIGNsYXNzTmFtZT1cInNtYWxsIG1kaS1hY3Rpb24tYXNzaWdubWVudFwiPjwvaT4gQW50aSBSYWdnaW5nPC9hPjwvbGk+XHJcbiAgICAgICAgPGxpIGNsYXNzTmFtZT1cImJvbGRcIj48YSBocmVmPVwiL21pZ3JhdGlvbi1mb3JtXCIgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLW9yYW5nZVwiPjxpIGNsYXNzTmFtZT1cInNtYWxsIG1kaS1hY3Rpb24tcmVjZWlwdFwiPjwvaT4gTWlncmF0aW9uIEZvcm08L2E+PC9saT5cclxuICAgICAgICA8bGkgY2xhc3NOYW1lPVwiYm9sZFwiPjxhIGhyZWY9XCIvY29udGFjdFwiIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1vcmFuZ2VcIj48aSBjbGFzc05hbWU9XCJzbWFsbCBtZGktYWN0aW9uLXBlcm0tY29udGFjdC1jYWxcIj48L2k+IENvbnRhY3QgVXM8L2E+PC9saT5cclxuICAgICAgPC91bD5cclxuICAgIDwvaGVhZGVyPlxyXG4gIDwvZGl2PlxyXG4gICAgICAvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xyXG4gICAgKTtcclxuICB9XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBFOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9+L2pzaGludC1sb2FkZXIhRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvc3JjL2NvbXBvbmVudHMvTmF2YmFyL05hdmJhci5qc1xuICoqLyIsIi8qXHJcbiAqIFJlYWN0LmpzIFN0YXJ0ZXIgS2l0XHJcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXHJcbiAqXHJcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vcmVxdWlyZSgnLi9Ob3RGb3VuZFBhZ2UubGVzcycpO1xyXG5cclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbnZhciBOb3RGb3VuZFBhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cclxuICAgICAgPGRpdj5cclxuICAgICAgICA8aDE+UGFnZSBOb3QgRm91bmQ8L2gxPlxyXG4gICAgICAgIDxwPlNvcnJ5LCBidXQgdGhlIHBhZ2UgeW91IHdlcmUgdHJ5aW5nIHRvIHZpZXcgZG9lcyBub3QgZXhpc3QuPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgLyoganNoaW50IGlnbm9yZTplbmQgKi9cclxuICAgICk7XHJcbiAgfVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE5vdEZvdW5kUGFnZTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvfi9qc2hpbnQtbG9hZGVyIUU6L3JhdmkvV29yay9TV0Qvc3dkLXJlYWN0L3NyYy9jb21wb25lbnRzL05vdEZvdW5kUGFnZS9Ob3RGb3VuZFBhZ2UuanNcbiAqKi8iLCIvKlxyXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS29uc3RhbnRpbiBUYXJrdXMgKEBrb2lzdHlhKSwgS3JpYVNvZnQgTExDLlxyXG4gKlxyXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcclxuICogTElDRU5TRS50eHQgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcbnZhciBteXNxbCA9IHJlcXVpcmUoJ215c3FsJyk7XHJcbnZhciBjb25uID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih7XHJcbiAgaG9zdDogJ2xvY2FsaG9zdCcsXHJcbiAgdXNlcjogJ3N3ZCcsXHJcbiAgcGFzc3dvcmQ6ICdzd2QnLFxyXG4gIGRhdGFiYXNlOiAnc3R1ZGVudHMnXHJcbn0pO1xyXG5cclxudmFyIGFwaSA9IHtcclxuICAvLyBSZXR1cm5zIGJhc2ljIHN0dWRlbnQgaW5mbyBmb3IgbG9naW4gcGFnZS5cclxuICAvLyBQQVJBTVM6IGlkID0gbGRhcCBsb2dpbiBpZFxyXG4gIHN0dWRlbnRJbmZvOiBmdW5jdGlvbihyZXEsIHJlcywgaWQpIHtcclxuICAgIGNvbm4ucXVlcnkoXCJTRUxFQ1QgKiBGUk9NIHN0dWRlbnRfaW5mbyBXSEVSRSBsb2dpbklEPT9cIixcclxuICAgICAgICAgICAgICAgcmVxLnF1ZXJ5LmlkLCBmdW5jdGlvbihlcnIsIHJvdykge1xyXG4gICAgICByZXMuanNvbihbZXJyLCByb3ddKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxudmFyIERCU3RvcmUgPSB7XHJcbiAgcHJvY2VzczogZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICAgIHZhciBwYXRoID0gcmVxLnBhdGguc3Vic3RyKDgpO1xyXG4gICAgaWYgKCFhcGkuaGFzT3duUHJvcGVydHkocGF0aCkpIHtcclxuICAgICAgcmVzLmpzb24oXCJUcnlpbmcgc29tZXRoaW5nIGlsbGVnYWw/XFxuXCIgKyBwYXRoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYXBpW3BhdGhdKHJlcSwgcmVzKTtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERCU3RvcmU7XHJcblxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBFOi9yYXZpL1dvcmsvU1dEL3N3ZC1yZWFjdC9+L2pzaGludC1sb2FkZXIhRTovcmF2aS9Xb3JrL1NXRC9zd2QtcmVhY3Qvc3JjL3N0b3Jlcy9EQlN0b3JlLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcclxuXHRcdHZhciByZXN1bHQgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpc1tpXTtcclxuXHRcdFx0aWYoaXRlbVsyXSkge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgaXRlbVsxXSArIFwifVwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChpdGVtWzFdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdC5qb2luKFwiXCIpO1xyXG5cdH07XHJcblx0cmV0dXJuIGxpc3Q7XHJcbn1cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyL2Nzc1RvU3RyaW5nLmpzXG4gKiogbW9kdWxlIGlkID0gMThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJFOlxcXFxyYXZpXFxcXFdvcmtcXFxcU1dEXFxcXHN3ZC1yZWFjdFxcXFxub2RlX21vZHVsZXNcXFxcY3NzLWxvYWRlclxcXFxjc3NUb1N0cmluZy5qc1wiKSgpO1xuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLypcXG4gKiBSZWFjdC5qcyBTdGFydGVyIEtpdFxcbiAqIENvcHlyaWdodCAoYykgMjAxNCBLb25zdGFudGluIFRhcmt1cyAoQGtvaXN0eWEpLCBLcmlhU29mdCBMTEMuXFxuICpcXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcXG4gKiBMSUNFTlNFLnR4dCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxcbiAqL1xcblwiLCBcIlwiXSk7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL0FwcC9BcHAubGVzc1xuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJldmVudGVtaXR0ZXIzXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJldmVudGVtaXR0ZXIzXCJcbiAqKiBtb2R1bGUgaWQgPSAyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiZXhwcmVzc1wiXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZsdXhcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImZsdXhcIlxuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmcm9udC1tYXR0ZXJcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImZyb250LW1hdHRlclwiXG4gKiogbW9kdWxlIGlkID0gMjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJmc1wiXG4gKiogbW9kdWxlIGlkID0gMjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImphZGVcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImphZGVcIlxuICoqIG1vZHVsZSBpZCA9IDI1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImxvZGFzaFwiXG4gKiogbW9kdWxlIGlkID0gMjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm15c3FsXCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJteXNxbFwiXG4gKiogbW9kdWxlIGlkID0gMjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcInBhdGhcIlxuICoqIG1vZHVsZSBpZCA9IDI4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdXBlcmFnZW50XCIpO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogZXh0ZXJuYWwgXCJzdXBlcmFnZW50XCJcbiAqKiBtb2R1bGUgaWQgPSAyOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIiLCJmaWxlIjoic2VydmVyLmpzIn0=