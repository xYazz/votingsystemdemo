/*! For license information please see 12.js.LICENSE.txt */
"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[12],{570:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);\n/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ 1);\n/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _mui_styles_makeStyles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @mui/styles/makeStyles */ 999);\n/* harmony import */ var _mui_material_styles_useTheme__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @mui/material/styles/useTheme */ 505);\n/* harmony import */ var _mui_material_Box__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @mui/material/Box */ 356);\n/* harmony import */ var _mui_material_FormLabel__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @mui/material/FormLabel */ 976);\n/* harmony import */ var _mui_material_FormControl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @mui/material/FormControl */ 972);\n/* harmony import */ var _mui_material_FormGroup__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @mui/material/FormGroup */ 1018);\n/* harmony import */ var _mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @mui/material/FormControlLabel */ 1023);\n/* harmony import */ var _mui_material_FormHelperText__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @mui/material/FormHelperText */ 992);\n/* harmony import */ var _mui_material_Checkbox__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @mui/material/Checkbox */ 1025);\n/* harmony import */ var _mui_material_Tooltip__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @mui/material/Tooltip */ 1020);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! react-router-dom */ 99);\n/* harmony import */ var _mui_material_Button__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @mui/material/Button */ 1032);\n/* harmony import */ var _mui_material_Stack__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @mui/material/Stack */ 808);\n/* harmony import */ var _axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../axios */ 11);\n/* harmony import */ var jwt_decode__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jwt-decode */ 55);\n/* harmony import */ var _material_ui_core_Container__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core/Container */ 732);\n/* harmony import */ var _mui_material_Paper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @mui/material/Paper */ 503);\n/* harmony import */ var _LoadingPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./LoadingPage */ 53);\nfunction _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nvar useStyles = (0,_mui_styles_makeStyles__WEBPACK_IMPORTED_MODULE_5__["default"])(function () {\n  return {\n    cardMedia: {\n      paddingTop: \'56.25%\' // 16:9\n\n    },\n    link: {\n      margin: (0,_mui_material_styles_useTheme__WEBPACK_IMPORTED_MODULE_6__["default"])().spacing(1, 1.5)\n    },\n    cardHeader: {\n      backgroundColor: (0,_mui_material_styles_useTheme__WEBPACK_IMPORTED_MODULE_6__["default"])().palette.mode === \'light\' ? (0,_mui_material_styles_useTheme__WEBPACK_IMPORTED_MODULE_6__["default"])().palette.grey[200] : (0,_mui_material_styles_useTheme__WEBPACK_IMPORTED_MODULE_6__["default"])().palette.grey[700]\n    },\n    voteTitle: {\n      fontSize: \'16px\',\n      textAlign: \'left\'\n    },\n    voteText: {\n      display: \'flex\',\n      justifyContent: \'left\',\n      alignItems: \'baseline\',\n      fontSize: \'12px\',\n      textAlign: \'left\',\n      marginBottom: (0,_mui_material_styles_useTheme__WEBPACK_IMPORTED_MODULE_6__["default"])().spacing(2)\n    }\n  };\n});\n\nvar Vote = /*#__PURE__*/function (_Component) {\n  _inherits(Vote, _Component);\n\n  var _super = _createSuper(Vote);\n\n  function Vote(props) {\n    var _this;\n\n    _classCallCheck(this, Vote);\n\n    _this = _super.call(this, props);\n\n    _defineProperty(_assertThisInitialized(_this), "handleChange", function (event) {\n      console.log(event.target.value);\n      _this.state.picked_candidates.filter(function (element) {\n        return element == event.target.value;\n      }).length > 0 ? _this.setState(_objectSpread(_objectSpread({}, _this.state), {}, {\n        picked_votes: _this.state.picked_votes - 1,\n        picked_candidates: _toConsumableArray(_this.state.picked_candidates.filter(function (element) {\n          return element != event.target.value;\n        }))\n      })) : _this.setState(_objectSpread(_objectSpread({}, _this.state), {}, {\n        picked_votes: _this.state.picked_votes + 1,\n        picked_candidates: [].concat(_toConsumableArray(_this.state.picked_candidates), [event.target.value])\n      }));\n    });\n\n    _defineProperty(_assertThisInitialized(_this), "handleVoteButtonPressed", function () {\n      if (_this.state.picked_candidates.length <= _this.state.max_votes && _this.state.picked_candidates.length > 0) {\n        console.log("test");\n\n        _this.state.picked_candidates.map(function (candidate) {\n          _axios__WEBPACK_IMPORTED_MODULE_2__["default"].post("api/submit_vote/", {\n            vote: _this.id,\n            voter: _this.state.user,\n            candidate: candidate\n          }).then(function (response) {\n            _this.props.history.push("/");\n          });\n        });\n      }\n    });\n\n    _this.state = {\n      user: localStorage.getItem(\'access_token\') ? (0,jwt_decode__WEBPACK_IMPORTED_MODULE_3__["default"])(localStorage.getItem(\'access_token\')).user_id : null,\n      type: false,\n      name: false,\n      description: false,\n      start_date: moment__WEBPACK_IMPORTED_MODULE_1___default()().format("DD-MM-YYYY hh:mm:ss"),\n      end_date: moment__WEBPACK_IMPORTED_MODULE_1___default()().format("DD-MM-YYYY hh:mm:ss"),\n      max_votes: _this.defaultMaxVotes,\n      vote_voter: [],\n      candidates: [],\n      picked_votes: 0,\n      picked_candidates: [],\n      able_to_vote: true,\n      loading: true\n    };\n    _this.id = _this.props.location.state.vote_id;\n\n    _this.getVoteDetails();\n\n    _this.getVoteVoterDetails();\n\n    return _this;\n  }\n\n  _createClass(Vote, [{\n    key: "getVoteDetails",\n    value: function getVoteDetails() {\n      var _this2 = this;\n\n      (0,_axios__WEBPACK_IMPORTED_MODULE_2__["default"])(\'/api/get-vote/\' + this.id).then(function (response) {\n        console.log(_this2.id);\n\n        _this2.setState({\n          type: response.data.type,\n          name: response.data.name,\n          description: response.data.description,\n          max_votes: response.data.max_votes,\n          start_date: response.data.start_date,\n          end_date: response.data.end_date,\n          candidates: response.data.candidates,\n          loading: false\n        });\n      });\n    }\n  }, {\n    key: "getVoteVoterDetails",\n    value: function getVoteVoterDetails() {\n      var _this3 = this;\n\n      _axios__WEBPACK_IMPORTED_MODULE_2__["default"].get(\'/api/vote_voter\', {\n        params: {\n          vote: this.id,\n          user: this.state.user\n        }\n      }).then(function (response) {\n        console.log(response.data);\n\n        if (response.data.length > 0) {\n          _this3.setState({\n            able_to_vote: false\n          });\n        }\n      })["catch"](function (error) {\n        console.log(error);\n      });\n    }\n  }, {\n    key: "render",\n    value: function render() {\n      var _this4 = this;\n\n      var error = this.state.picked_votes > this.state.max_votes;\n      var classes = this.props.classes;\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_material_ui_core_Container__WEBPACK_IMPORTED_MODULE_7__["default"], {\n        maxWidth: "md",\n        component: "main",\n        sx: {\n          mb: 4\n        }\n      }, this.state.loading ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_LoadingPage__WEBPACK_IMPORTED_MODULE_4__["default"], null) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_Paper__WEBPACK_IMPORTED_MODULE_8__["default"], {\n        elevation: 16,\n        sx: {\n          my: {\n            xs: 3,\n            md: 6\n          },\n          p: {\n            xs: 2,\n            md: 3\n          }\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", null, this.name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "Rodzaj g\\u0142osowania: ", this.state.type), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "Opis g\\u0142osowania: ", this.state.description), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "Maksymalna ilo\\u015B\\u0107 g\\u0142os\\xF3w oddanych przez wyborc\\u0119: ", this.state.max_votes), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "Data rozpocz\\u0119cia: ", moment__WEBPACK_IMPORTED_MODULE_1___default()(this.state.start_date).format("YYYY-MM-DD " + "HH:mm:ss")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", null, "Data zako\\u0144czenia: ", moment__WEBPACK_IMPORTED_MODULE_1___default()(this.state.end_date).format("YYYY-MM-DD " + "HH:mm:ss")), this.state.candidates.length < 1 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", null, "Brak kandydat\\xF3w. Skontaktuj si\\u0119 z tw\\xF3rc\\u0105 g\\u0142osowania") : this.state.able_to_vote == true ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_Box__WEBPACK_IMPORTED_MODULE_9__["default"], {\n        sx: {\n          display: \'flex\',\n          justifySelf: \'center\'\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_FormControl__WEBPACK_IMPORTED_MODULE_10__["default"], {\n        required: true,\n        error: error,\n        component: "fieldset",\n        sx: {\n          m: 3\n        },\n        variant: "standard"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_FormLabel__WEBPACK_IMPORTED_MODULE_11__["default"], {\n        component: "legend"\n      }, "Wybierz kandydat\\xF3w"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_FormGroup__WEBPACK_IMPORTED_MODULE_12__["default"], {\n        "aria-label": "position",\n        row: true\n      }, this.state.candidates.map(function (candidate) {\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_Tooltip__WEBPACK_IMPORTED_MODULE_13__["default"], {\n          title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", null, candidate.description)\n        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_FormControlLabel__WEBPACK_IMPORTED_MODULE_14__["default"], {\n          control: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_Checkbox__WEBPACK_IMPORTED_MODULE_15__["default"], {\n            color: "primary",\n            value: candidate.id,\n            checked: _this4.state.picked_candidates.filter(function (element) {\n              return element == candidate.id;\n            }).length > 0 ? true : false,\n            onChange: function onChange(e) {\n              return _this4.handleChange(e);\n            },\n            name: candidate.first_name + " " + candidate.last_name\n          }),\n          label: candidate.first_name + " " + candidate.last_name\n        }));\n      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_FormHelperText__WEBPACK_IMPORTED_MODULE_16__["default"], null, "Maksymalnie mo\\u017Cesz wybra\\u0107 ", this.state.max_votes, " ", this.state.max_votes == 1 ? \'kandydata\' : \'kandydatów\'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_Stack__WEBPACK_IMPORTED_MODULE_17__["default"], {\n        spacing: 2,\n        direction: "row",\n        justifyContent: "center",\n        mb: 3,\n        mt: 3\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_Button__WEBPACK_IMPORTED_MODULE_18__["default"], {\n        color: "primary",\n        variant: "contained",\n        onClick: this.handleVoteButtonPressed\n      }, "Oddaj g\\u0142os"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_mui_material_Button__WEBPACK_IMPORTED_MODULE_18__["default"], {\n        margin: "15px",\n        color: "secondary",\n        variant: "contained",\n        to: "/votes",\n        component: react_router_dom__WEBPACK_IMPORTED_MODULE_19__.Link\n      }, "Powr\\xF3t"))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", null, "Nie mo\\u017Cna odda\\u0107 wi\\u0119cej g\\u0142os\\xF3w. Wyniki zostan\\u0105 udost\\u0119pnione po zako\\u0144czeniu g\\u0142osowania."))));\n    }\n  }]);\n\n  return Vote;\n}(react__WEBPACK_IMPORTED_MODULE_0__.Component);\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Vote);\n\n//# sourceURL=webpack://frontend/./src/components/Vote.js?')}}]);