_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[5],{"/0+H":function(e,t,n){"use strict";t.__esModule=!0,t.isInAmpMode=i,t.useAmp=function(){return i(a.default.useContext(o.AmpStateContext))};var r,a=(r=n("q1tI"))&&r.__esModule?r:{default:r},o=n("lwAK");function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.ampFirst,n=void 0!==t&&t,r=e.hybrid,a=void 0!==r&&r,o=e.hasQuery,i=void 0!==o&&o;return n||a&&i}},0:function(e,t,n){n("74v/"),e.exports=n("nOHt")},"74v/":function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return n("cha2")}])},"8Kt/":function(e,t,n){"use strict";n("lSNA");t.__esModule=!0,t.defaultHead=l,t.default=void 0;var r,a=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=s();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if(Object.prototype.hasOwnProperty.call(e,a)){var o=r?Object.getOwnPropertyDescriptor(e,a):null;o&&(o.get||o.set)?Object.defineProperty(n,a,o):n[a]=e[a]}n.default=e,t&&t.set(e,n);return n}(n("q1tI")),o=(r=n("Xuae"))&&r.__esModule?r:{default:r},i=n("lwAK"),c=n("FYa8"),u=n("/0+H");function s(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return s=function(){return e},e}function l(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=[a.default.createElement("meta",{charSet:"utf-8"})];return e||t.push(a.default.createElement("meta",{name:"viewport",content:"width=device-width"})),t}function p(e,t){return"string"===typeof t||"number"===typeof t?e:t.type===a.default.Fragment?e.concat(a.default.Children.toArray(t.props.children).reduce((function(e,t){return"string"===typeof t||"number"===typeof t?e:e.concat(t)}),[])):e.concat(t)}var d=["name","httpEquiv","charSet","itemProp"];function f(e,t){return e.reduce((function(e,t){var n=a.default.Children.toArray(t.props.children);return e.concat(n)}),[]).reduce(p,[]).reverse().concat(l(t.inAmpMode)).filter(function(){var e=new Set,t=new Set,n=new Set,r={};return function(a){var o=!0,i=!1;if(a.key&&"number"!==typeof a.key&&a.key.indexOf("$")>0){i=!0;var c=a.key.slice(a.key.indexOf("$")+1);e.has(c)?o=!1:e.add(c)}switch(a.type){case"title":case"base":t.has(a.type)?o=!1:t.add(a.type);break;case"meta":for(var u=0,s=d.length;u<s;u++){var l=d[u];if(a.props.hasOwnProperty(l))if("charSet"===l)n.has(l)?o=!1:n.add(l);else{var p=a.props[l],f=r[l]||new Set;"name"===l&&i||!f.has(p)?(f.add(p),r[l]=f):o=!1}}}return o}}()).reverse().map((function(e,t){var n=e.key||t;return a.default.cloneElement(e,{key:n})}))}function v(e){var t=e.children,n=(0,a.useContext)(i.AmpStateContext),r=(0,a.useContext)(c.HeadManagerContext);return a.default.createElement(o.default,{reduceComponentsToState:f,headManager:r,inAmpMode:(0,u.isInAmpMode)(n)},t)}v.rewind=function(){};var m=v;t.default=m},Bnag:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},EbDI:function(e,t){e.exports=function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},Ijbi:function(e,t,n){var r=n("WkPL");e.exports=function(e){if(Array.isArray(e))return r(e)}},RIqP:function(e,t,n){var r=n("Ijbi"),a=n("EbDI"),o=n("ZhPi"),i=n("Bnag");e.exports=function(e){return r(e)||a(e)||o(e)||i()}},Xuae:function(e,t,n){"use strict";var r=n("RIqP"),a=n("lwsE"),o=n("W8MJ"),i=(n("PJYZ"),n("7W2i")),c=n("a1gu"),u=n("Nsbk");function s(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=u(e);if(t){var a=u(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return c(this,n)}}t.__esModule=!0,t.default=void 0;var l=n("q1tI"),p=function(e){i(n,e);var t=s(n);function n(e){var o;return a(this,n),(o=t.call(this,e))._hasHeadManager=void 0,o.emitChange=function(){o._hasHeadManager&&o.props.headManager.updateHead(o.props.reduceComponentsToState(r(o.props.headManager.mountedInstances),o.props))},o._hasHeadManager=o.props.headManager&&o.props.headManager.mountedInstances,o}return o(n,[{key:"componentDidMount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.add(this),this.emitChange()}},{key:"componentDidUpdate",value:function(){this.emitChange()}},{key:"componentWillUnmount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.delete(this),this.emitChange()}},{key:"render",value:function(){return null}}]),n}(l.Component);t.default=p},cha2:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return M}));var r=n("nKUr"),a=n("rePB"),o=n("q1tI"),i=n.n(o),c=n("g4pe"),u=n.n(c),s=n("wx14"),l=(n("17x9"),n("OKji")),p=n("aXM8"),d=n("hfi/");var f=function(e){var t=e.children,n=e.theme,r=Object(p.a)(),a=i.a.useMemo((function(){var e=null===r?n:function(e,t){return"function"===typeof t?t(e):Object(s.a)({},e,t)}(r,n);return null!=e&&(e[d.a]=null!==r),e}),[n,r]);return i.a.createElement(l.a.Provider,{value:a},t)},v=n("H2TA"),m={WebkitFontSmoothing:"antialiased",MozOsxFontSmoothing:"grayscale",boxSizing:"border-box"},b=function(e){return Object(s.a)({color:e.palette.text.primary},e.typography.body2,{backgroundColor:e.palette.background.default,"@media print":{backgroundColor:e.palette.common.white}})};var h=Object(v.a)((function(e){return{"@global":{html:m,"*, *::before, *::after":{boxSizing:"inherit"},"strong, b":{fontWeight:e.typography.fontWeightBold},body:Object(s.a)({margin:0},b(e),{"&::backdrop":{backgroundColor:e.palette.background.default}})}}}),{name:"MuiCssBaseline"})((function(e){var t=e.children,n=void 0===t?null:t;return e.classes,o.createElement(o.Fragment,null,n)})),y=n("hlie"),j=n("UDOl");function g(){return Object(r.jsxs)("footer",{children:["Copyright \xa9 2013 \u2014 ",(new Date).getFullYear()," ",Object(r.jsx)(y.a,{color:"inherit",href:"https://localhost:3000",children:j.name}),". All Rights Reserved."]})}var O=n("viY9"),w=Object(O.a)({palette:{primary:{main:"#556cd6"},secondary:{main:"#19857b"}}});n("rMck");function x(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function _(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?x(Object(n),!0).forEach((function(t){Object(a.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):x(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function M(e){var t=e.Component,n=e.pageProps;return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsxs)(u.a,{children:[Object(r.jsx)("title",{children:"Anton Batiaev - Fintech Developer, Derivatives Trader, MBA"}),Object(r.jsx)("meta",{name:"viewport",content:"minimum-scale=1, initial-scale=1, width=device-width"}),Object(r.jsx)("meta",{name:"keywords",content:"cv, resume, Anton Batiaev, Batiaev, java developer, fintech, full stack java developer, spring developer, Oracle Certified, Oracle Certified developer, derivatives developer, quantitive developer, derivative trader"}),Object(r.jsx)("meta",{name:"author",content:"Anton Batiaev"}),Object(r.jsx)("meta",{property:"og:title",content:"Anton Batiaev - Certified Java Developer"}),Object(r.jsx)("meta",{property:"og:site_name",content:"Anton Batiaev - Certified Java Developer"}),Object(r.jsx)("meta",{property:"og:type",content:"website"}),Object(r.jsx)("meta",{property:"og:url",content:"https://batiaev.com/"}),Object(r.jsx)("meta",{property:"og:see_also",content:"https://www.linkedin.com/in/batiaev/"}),Object(r.jsx)("meta",{property:"og:image",content:"https://batiaev.com/images/batiaev.webp"}),Object(r.jsx)("meta",{property:"og:description",content:"Anton Batiaev - Full Stack Certified Java Developer, involved in software development since 2010. Key skills: Java 8, Spring, Linux, Hibernate, Rabbit, Docker etc"}),Object(r.jsx)("meta",{name:"twitter:card",content:"Anton Batiaev - Certified Java Developer"}),Object(r.jsx)("meta",{name:"twitter:site",content:"@batiaev_com"}),Object(r.jsx)("meta",{name:"twitter:title",content:"Anton Batiaev - Certified Java Developer"}),Object(r.jsx)("meta",{name:"twitter:description",content:"Anton Batiaev - Full Stack Certified Java Developer, involved in software development since 2010."}),Object(r.jsx)("meta",{name:"twitter:creator",content:"@batiaev_com"}),Object(r.jsx)("meta",{name:"twitter:image",content:"https://batiaev.com/images/batiaev.webp"})]}),Object(r.jsxs)(f,{theme:w,children:[Object(r.jsx)(h,{}),Object(r.jsx)(t,_({},n)),Object(r.jsx)(g,{})]})]})}},g4pe:function(e,t,n){e.exports=n("8Kt/")},lSNA:function(e,t){e.exports=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}},lwAK:function(e,t,n){"use strict";var r;t.__esModule=!0,t.AmpStateContext=void 0;var a=((r=n("q1tI"))&&r.__esModule?r:{default:r}).default.createContext({});t.AmpStateContext=a},rMck:function(e,t,n){}},[[0,0,1,2,3]]]);