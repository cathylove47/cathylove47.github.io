var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,a)=>(a=n==null?{}:e(i(n)),c(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var S=Array.isArray;function C(){}var w={H:null,A:null,T:null,S:null},ee=Object.prototype.hasOwnProperty;function T(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function te(e,t){return T(e.type,t,e.props)}function E(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ne(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var re=/\/+/g;function ie(e,t){return typeof e==`object`&&e&&e.key!=null?ne(``+e.key):t.toString(36)}function ae(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(C,C):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function oe(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,oe(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+ie(e,0):a,S(o)?(i=``,c!=null&&(i=c.replace(re,`$&/`)+`/`),oe(o,r,i,``,function(e){return e})):o!=null&&(E(o)&&(o=te(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(re,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(S(e))for(var u=0;u<e.length;u++)a=e[u],s=l+ie(a,u),c+=oe(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+ie(a,u++),c+=oe(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return oe(ae(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function se(e,t,n){if(e==null)return e;var r=[],i=0;return oe(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function ce(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var D=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},le={map:se,forEach:function(e,t,n){se(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return se(e,function(){t++}),t},toArray:function(e){return se(e,function(e){return e})||[]},only:function(e){if(!E(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=le,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=w,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return w.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!ee.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return T(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)ee.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return T(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=E,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:ce}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=w.T,n={};w.T=n;try{var r=e(),i=w.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(C,D)}catch(e){D(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),w.T=t}},e.unstable_useCacheRefresh=function(){return w.H.useCacheRefresh()},e.use=function(e){return w.H.use(e)},e.useActionState=function(e,t,n){return w.H.useActionState(e,t,n)},e.useCallback=function(e,t){return w.H.useCallback(e,t)},e.useContext=function(e){return w.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return w.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return w.H.useEffect(e,t)},e.useEffectEvent=function(e){return w.H.useEffectEvent(e)},e.useId=function(){return w.H.useId()},e.useImperativeHandle=function(e,t,n){return w.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return w.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return w.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return w.H.useMemo(e,t)},e.useOptimistic=function(e,t){return w.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return w.H.useReducer(e,t,n)},e.useRef=function(e){return w.H.useRef(e)},e.useState=function(e){return w.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return w.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return w.H.useTransition()},e.version=`19.2.6`})),d=o(((e,t)=>{t.exports=u()})),f=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m)if(n(c)!==null)m=!0,S||(S=!0,E());else{var t=n(l);t!==null&&ie(x,t.startTime-e)}}var S=!1,C=-1,w=5,ee=-1;function T(){return g?!0:!(e.unstable_now()-ee<w)}function te(){if(g=!1,S){var t=e.unstable_now();ee=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(C),C=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&T());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&ie(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?E():S=!1}}}var E;if(typeof y==`function`)E=function(){y(te)};else if(typeof MessageChannel<`u`){var ne=new MessageChannel,re=ne.port2;ne.port1.onmessage=te,E=function(){re.postMessage(null)}}else E=function(){_(te,0)};function ie(t,n){C=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):w=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(C),C=-1):h=!0,ie(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,S||(S=!0,E()))),r},e.unstable_shouldYield=T,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),p=o(((e,t)=>{t.exports=f()})),m=o((e=>{var t=d();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`);function o(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}var s=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function c(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return o(e,t,null,r)},e.flushSync=function(e){var t=s.T,n=i.p;try{if(s.T=null,i.p=2,e)return e()}finally{s.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`)if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=c(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0})}}else t??i.d.M(e)},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`)if(t){var n=c(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0})}else i.d.m(e)},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return s.H.useFormState(e,t,n)},e.useFormStatus=function(){return s.H.useHostTransitionStatus()},e.version=`19.2.6`})),h=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=m()})),g=o((e=>{var t=p(),n=d(),r=h();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function u(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function f(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=f(e),t!==null)return t;e=e.sibling}return null}var m=Object.assign,g=Symbol.for(`react.element`),_=Symbol.for(`react.transitional.element`),v=Symbol.for(`react.portal`),y=Symbol.for(`react.fragment`),b=Symbol.for(`react.strict_mode`),x=Symbol.for(`react.profiler`),S=Symbol.for(`react.consumer`),C=Symbol.for(`react.context`),w=Symbol.for(`react.forward_ref`),ee=Symbol.for(`react.suspense`),T=Symbol.for(`react.suspense_list`),te=Symbol.for(`react.memo`),E=Symbol.for(`react.lazy`),ne=Symbol.for(`react.activity`),re=Symbol.for(`react.memo_cache_sentinel`),ie=Symbol.iterator;function ae(e){return typeof e!=`object`||!e?null:(e=ie&&e[ie]||e[`@@iterator`],typeof e==`function`?e:null)}var oe=Symbol.for(`react.client.reference`);function se(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===oe?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case y:return`Fragment`;case x:return`Profiler`;case b:return`StrictMode`;case ee:return`Suspense`;case T:return`SuspenseList`;case ne:return`Activity`}if(typeof e==`object`)switch(e.$$typeof){case v:return`Portal`;case C:return e.displayName||`Context`;case S:return(e._context.displayName||`Context`)+`.Consumer`;case w:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case te:return t=e.displayName||null,t===null?se(e.type)||`Memo`:t;case E:t=e._payload,e=e._init;try{return se(e(t))}catch{}}return null}var ce=Array.isArray,D=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,le=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ue={pending:!1,data:null,method:null,action:null},de=[],fe=-1;function pe(e){return{current:e}}function me(e){0>fe||(e.current=de[fe],de[fe]=null,fe--)}function he(e,t){fe++,de[fe]=e.current,e.current=t}var ge=pe(null),_e=pe(null),ve=pe(null),ye=pe(null);function be(e,t){switch(he(ve,t),he(_e,e),he(ge,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Hd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Hd(t),e=Ud(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}me(ge),he(ge,e)}function xe(){me(ge),me(_e),me(ve)}function Se(e){e.memoizedState!==null&&he(ye,e);var t=ge.current,n=Ud(t,e.type);t!==n&&(he(_e,e),he(ge,n))}function Ce(e){_e.current===e&&(me(ge),me(_e)),ye.current===e&&(me(ye),Qf._currentValue=ue)}var we,Te;function O(e){if(we===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);we=t&&t[1]||``,Te=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+we+e+Te}var Ee=!1;function De(e,t){if(!e||Ee)return``;Ee=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,`props`,{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}e.call(n.prototype)}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,`name`,{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Ee=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?O(n):``}function k(e,t){switch(e.tag){case 26:case 27:case 5:return O(e.type);case 16:return O(`Lazy`);case 13:return e.child!==t&&t!==null?O(`Suspense Fallback`):O(`Suspense`);case 19:return O(`SuspenseList`);case 0:case 15:return De(e.type,!1);case 11:return De(e.type.render,!1);case 1:return De(e.type,!0);case 31:return O(`Activity`);default:return``}}function Oe(e){try{var t=``,n=null;do t+=k(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var ke=Object.prototype.hasOwnProperty,Ae=t.unstable_scheduleCallback,je=t.unstable_cancelCallback,Me=t.unstable_shouldYield,Ne=t.unstable_requestPaint,Pe=t.unstable_now,Fe=t.unstable_getCurrentPriorityLevel,Ie=t.unstable_ImmediatePriority,Le=t.unstable_UserBlockingPriority,Re=t.unstable_NormalPriority,ze=t.unstable_LowPriority,Be=t.unstable_IdlePriority,Ve=t.log,He=t.unstable_setDisableYieldValue,Ue=null,We=null;function Ge(e){if(typeof Ve==`function`&&He(e),We&&typeof We.setStrictMode==`function`)try{We.setStrictMode(Ue,e)}catch{}}var Ke=Math.clz32?Math.clz32:Ye,qe=Math.log,Je=Math.LN2;function Ye(e){return e>>>=0,e===0?32:31-(qe(e)/Je|0)|0}var Xe=256,Ze=262144,Qe=4194304;function $e(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function et(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=$e(n))):i=$e(o):i=$e(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=$e(n))):i=$e(o)):i=$e(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function tt(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function nt(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function rt(){var e=Qe;return Qe<<=1,!(Qe&62914560)&&(Qe=4194304),e}function it(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function at(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function ot(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-Ke(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&st(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function st(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-Ke(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function ct(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Ke(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function lt(e,t){var n=t&-t;return n=n&42?1:ut(n),(n&(e.suspendedLanes|t))===0?n:0}function ut(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function dt(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function ft(){var e=le.p;return e===0?(e=window.event,e===void 0?32:mp(e.type)):e}function pt(e,t){var n=le.p;try{return le.p=e,t()}finally{le.p=n}}var mt=Math.random().toString(36).slice(2),ht=`__reactFiber$`+mt,gt=`__reactProps$`+mt,_t=`__reactContainer$`+mt,vt=`__reactEvents$`+mt,yt=`__reactListeners$`+mt,bt=`__reactHandles$`+mt,xt=`__reactResources$`+mt,St=`__reactMarker$`+mt;function Ct(e){delete e[ht],delete e[gt],delete e[vt],delete e[yt],delete e[bt]}function wt(e){var t=e[ht];if(t)return t;for(var n=e.parentNode;n;){if(t=n[_t]||n[ht]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=df(e);e!==null;){if(n=e[ht])return n;e=df(e)}return t}e=n,n=e.parentNode}return null}function Tt(e){if(e=e[ht]||e[_t]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Et(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function Dt(e){var t=e[xt];return t||=e[xt]={hoistableStyles:new Map,hoistableScripts:new Map},t}function Ot(e){e[St]=!0}var kt=new Set,At={};function jt(e,t){Mt(e,t),Mt(e+`Capture`,t)}function Mt(e,t){for(At[e]=t,e=0;e<t.length;e++)kt.add(t[e])}var Nt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Pt={},Ft={};function It(e){return ke.call(Ft,e)?!0:ke.call(Pt,e)?!1:Nt.test(e)?Ft[e]=!0:(Pt[e]=!0,!1)}function Lt(e,t,n){if(It(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,``+n)}}function Rt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,``+n)}}function zt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,``+r)}}function Bt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Vt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Ht(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ut(e){if(!e._valueTracker){var t=Vt(e)?`checked`:`value`;e._valueTracker=Ht(e,t,``+e[t])}}function Wt(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Vt(e)?e.checked?`true`:`false`:e.value),e=r,e===n?!1:(t.setValue(e),!0)}function Gt(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}var Kt=/[\n"\\]/g;function qt(e){return e.replace(Kt,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function Jt(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+Bt(t)):e.value!==``+Bt(t)&&(e.value=``+Bt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):Xt(e,o,Bt(n)):Xt(e,o,Bt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+Bt(s):e.removeAttribute(`name`)}function Yt(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Ut(e);return}n=n==null?``:``+Bt(n),t=t==null?n:``+Bt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Ut(e)}function Xt(e,t,n){t===`number`&&Gt(e.ownerDocument)===e||e.defaultValue===``+n||(e.defaultValue=``+n)}function Zt(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+Bt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Qt(e,t,n){if(t!=null&&(t=``+Bt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+Bt(n)}function $t(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(ce(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=Bt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Ut(e)}function en(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var tn=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function nn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||tn.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function rn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&nn(e,a,r)}else for(var o in t)t.hasOwnProperty(o)&&nn(e,o,t[o])}function an(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var on=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),sn=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function cn(e){return sn.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function ln(){}var un=null;function dn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var fn=null,pn=null;function mn(e){var t=Tt(e);if(t&&(e=t.stateNode)){var n=e[gt]||null;a:switch(e=t.stateNode,t.type){case`input`:if(Jt(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+qt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[gt]||null;if(!a)throw Error(i(90));Jt(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&Wt(r)}break a;case`textarea`:Qt(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&Zt(e,!!n.multiple,t,!1)}}}var A=!1;function hn(e,t,n){if(A)return e(t,n);A=!0;try{return e(t)}finally{if(A=!1,(fn!==null||pn!==null)&&(yu(),fn&&(t=fn,e=pn,pn=fn=null,mn(t),e)))for(t=0;t<e.length;t++)mn(e[t])}}function gn(e,t){var n=e.stateNode;if(n===null)return null;var r=n[gt]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=!(e===`button`||e===`input`||e===`select`||e===`textarea`)),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var _n=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),vn=!1;if(_n)try{var yn={};Object.defineProperty(yn,`passive`,{get:function(){vn=!0}}),window.addEventListener(`test`,yn,yn),window.removeEventListener(`test`,yn,yn)}catch{vn=!1}var bn=null,xn=null,Sn=null;function Cn(){if(Sn)return Sn;var e,t=xn,n=t.length,r,i=`value`in bn?bn.value:bn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return Sn=i.slice(e,1<r?1-r:void 0)}function wn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Tn(){return!0}function En(){return!1}function Dn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?Tn:En,this.isPropagationStopped=En,this}return m(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=Tn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=Tn)},persist:function(){},isPersistent:Tn}),t}var On={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},kn=Dn(On),An=m({},On,{view:0,detail:0}),jn=Dn(An),Mn,Nn,Pn,Fn=m({},An,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Kn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Pn&&(Pn&&e.type===`mousemove`?(Mn=e.screenX-Pn.screenX,Nn=e.screenY-Pn.screenY):Nn=Mn=0,Pn=e),Mn)},movementY:function(e){return`movementY`in e?e.movementY:Nn}}),In=Dn(Fn),Ln=Dn(m({},Fn,{dataTransfer:0})),Rn=Dn(m({},An,{relatedTarget:0})),zn=Dn(m({},On,{animationName:0,elapsedTime:0,pseudoElement:0})),Bn=Dn(m({},On,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Vn=Dn(m({},On,{data:0})),Hn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Un={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Wn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Gn(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Wn[e])?!!t[e]:!1}function Kn(){return Gn}var qn=Dn(m({},An,{key:function(e){if(e.key){var t=Hn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=wn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Un[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Kn,charCode:function(e){return e.type===`keypress`?wn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?wn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),Jn=Dn(m({},Fn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Yn=Dn(m({},An,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Kn})),Xn=Dn(m({},On,{propertyName:0,elapsedTime:0,pseudoElement:0})),Zn=Dn(m({},Fn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),Qn=Dn(m({},On,{newState:0,oldState:0})),$n=[9,13,27,32],er=_n&&`CompositionEvent`in window,tr=null;_n&&`documentMode`in document&&(tr=document.documentMode);var nr=_n&&`TextEvent`in window&&!tr,rr=_n&&(!er||tr&&8<tr&&11>=tr),ir=` `,ar=!1;function or(e,t){switch(e){case`keyup`:return $n.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function sr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var cr=!1;function lr(e,t){switch(e){case`compositionend`:return sr(t);case`keypress`:return t.which===32?(ar=!0,ir):null;case`textInput`:return e=t.data,e===ir&&ar?null:e;default:return null}}function ur(e,t){if(cr)return e===`compositionend`||!er&&or(e,t)?(e=Cn(),Sn=xn=bn=null,cr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return rr&&t.locale!==`ko`?null:t.data;default:return null}}var dr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function fr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!dr[e.type]:t===`textarea`}function pr(e,t,n,r){fn?pn?pn.push(r):pn=[r]:fn=r,t=Ed(t,`onChange`),0<t.length&&(n=new kn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var mr=null,hr=null;function gr(e){vd(e,0)}function _r(e){if(Wt(Et(e)))return e}function vr(e,t){if(e===`change`)return t}var yr=!1;if(_n){var br;if(_n){var xr=`oninput`in document;if(!xr){var Sr=document.createElement(`div`);Sr.setAttribute(`oninput`,`return;`),xr=typeof Sr.oninput==`function`}br=xr}else br=!1;yr=br&&(!document.documentMode||9<document.documentMode)}function Cr(){mr&&(mr.detachEvent(`onpropertychange`,wr),hr=mr=null)}function wr(e){if(e.propertyName===`value`&&_r(hr)){var t=[];pr(t,hr,e,dn(e)),hn(gr,t)}}function Tr(e,t,n){e===`focusin`?(Cr(),mr=t,hr=n,mr.attachEvent(`onpropertychange`,wr)):e===`focusout`&&Cr()}function Er(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return _r(hr)}function Dr(e,t){if(e===`click`)return _r(t)}function Or(e,t){if(e===`input`||e===`change`)return _r(t)}function kr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Ar=typeof Object.is==`function`?Object.is:kr;function jr(e,t){if(Ar(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!ke.call(t,i)||!Ar(e[i],t[i]))return!1}return!0}function Mr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Nr(e,t){var n=Mr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Mr(n)}}function Pr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Pr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Fr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Gt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Gt(e.document)}return t}function Ir(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Lr=_n&&`documentMode`in document&&11>=document.documentMode,Rr=null,zr=null,Br=null,Vr=!1;function Hr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Vr||Rr==null||Rr!==Gt(r)||(r=Rr,`selectionStart`in r&&Ir(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Br&&jr(Br,r)||(Br=r,r=Ed(zr,`onSelect`),0<r.length&&(t=new kn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Rr)))}function Ur(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Wr={animationend:Ur(`Animation`,`AnimationEnd`),animationiteration:Ur(`Animation`,`AnimationIteration`),animationstart:Ur(`Animation`,`AnimationStart`),transitionrun:Ur(`Transition`,`TransitionRun`),transitionstart:Ur(`Transition`,`TransitionStart`),transitioncancel:Ur(`Transition`,`TransitionCancel`),transitionend:Ur(`Transition`,`TransitionEnd`)},Gr={},Kr={};_n&&(Kr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Wr.animationend.animation,delete Wr.animationiteration.animation,delete Wr.animationstart.animation),`TransitionEvent`in window||delete Wr.transitionend.transition);function qr(e){if(Gr[e])return Gr[e];if(!Wr[e])return e;var t=Wr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Kr)return Gr[e]=t[n];return e}var Jr=qr(`animationend`),Yr=qr(`animationiteration`),Xr=qr(`animationstart`),Zr=qr(`transitionrun`),Qr=qr(`transitionstart`),$r=qr(`transitioncancel`),ei=qr(`transitionend`),ti=new Map,ni=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);ni.push(`scrollEnd`);function ri(e,t){ti.set(e,t),jt(t,[e])}var ii=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},ai=[],oi=0,si=0;function ci(){for(var e=oi,t=si=oi=0;t<e;){var n=ai[t];ai[t++]=null;var r=ai[t];ai[t++]=null;var i=ai[t];ai[t++]=null;var a=ai[t];if(ai[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&fi(n,i,a)}}function li(e,t,n,r){ai[oi++]=e,ai[oi++]=t,ai[oi++]=n,ai[oi++]=r,si|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function ui(e,t,n,r){return li(e,t,n,r),pi(e)}function di(e,t){return li(e,null,null,t),pi(e)}function fi(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-Ke(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function pi(e){if(50<du)throw du=0,Z=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var mi={};function hi(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function gi(e,t,n,r){return new hi(e,t,n,r)}function _i(e){return e=e.prototype,!(!e||!e.isReactComponent)}function vi(e,t){var n=e.alternate;return n===null?(n=gi(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function yi(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function bi(e,t,n,r,a,o){var s=0;if(r=e,typeof e==`function`)_i(e)&&(s=1);else if(typeof e==`string`)s=Uf(e,n,ge.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(e){case ne:return e=gi(31,n,t,a),e.elementType=ne,e.lanes=o,e;case y:return xi(n.children,a,o,t);case b:s=8,a|=24;break;case x:return e=gi(12,n,t,a|2),e.elementType=x,e.lanes=o,e;case ee:return e=gi(13,n,t,a),e.elementType=ee,e.lanes=o,e;case T:return e=gi(19,n,t,a),e.elementType=T,e.lanes=o,e;default:if(typeof e==`object`&&e)switch(e.$$typeof){case C:s=10;break a;case S:s=9;break a;case w:s=11;break a;case te:s=14;break a;case E:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=gi(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function xi(e,t,n,r){return e=gi(7,e,r,t),e.lanes=n,e}function Si(e,t,n){return e=gi(6,e,null,t),e.lanes=n,e}function Ci(e){var t=gi(18,null,null,0);return t.stateNode=e,t}function wi(e,t,n){return t=gi(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Ti=new WeakMap;function Ei(e,t){if(typeof e==`object`&&e){var n=Ti.get(e);return n===void 0?(t={value:e,source:t,stack:Oe(t)},Ti.set(e,t),t):n}return{value:e,source:t,stack:Oe(t)}}var Di=[],Oi=0,ki=null,Ai=0,ji=[],Mi=0,Ni=null,Pi=1,Fi=``;function Ii(e,t){Di[Oi++]=Ai,Di[Oi++]=ki,ki=e,Ai=t}function Li(e,t,n){ji[Mi++]=Pi,ji[Mi++]=Fi,ji[Mi++]=Ni,Ni=e;var r=Pi;e=Fi;var i=32-Ke(r)-1;r&=~(1<<i),n+=1;var a=32-Ke(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Pi=1<<32-Ke(t)+i|n<<i|r,Fi=a+e}else Pi=1<<a|n<<i|r,Fi=e}function Ri(e){e.return!==null&&(Ii(e,1),Li(e,1,0))}function zi(e){for(;e===ki;)ki=Di[--Oi],Di[Oi]=null,Ai=Di[--Oi],Di[Oi]=null;for(;e===Ni;)Ni=ji[--Mi],ji[Mi]=null,Fi=ji[--Mi],ji[Mi]=null,Pi=ji[--Mi],ji[Mi]=null}function Bi(e,t){ji[Mi++]=Pi,ji[Mi++]=Fi,ji[Mi++]=Ni,Pi=t.id,Fi=t.overflow,Ni=e}var Vi=null,Hi=null,j=!1,Ui=null,Wi=!1,Gi=Error(i(519));function Ki(e){throw Qi(Ei(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),Gi}function qi(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[ht]=e,t[gt]=r,n){case`dialog`:yd(`cancel`,t),yd(`close`,t);break;case`iframe`:case`object`:case`embed`:yd(`load`,t);break;case`video`:case`audio`:for(n=0;n<gd.length;n++)yd(gd[n],t);break;case`source`:yd(`error`,t);break;case`img`:case`image`:case`link`:yd(`error`,t),yd(`load`,t);break;case`details`:yd(`toggle`,t);break;case`input`:yd(`invalid`,t),Yt(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:yd(`invalid`,t);break;case`textarea`:yd(`invalid`,t),$t(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||Md(t.textContent,n)?(r.popover!=null&&(yd(`beforetoggle`,t),yd(`toggle`,t)),r.onScroll!=null&&yd(`scroll`,t),r.onScrollEnd!=null&&yd(`scrollend`,t),r.onClick!=null&&(t.onclick=ln),t=!0):t=!1,t||Ki(e,!0)}function Ji(e){for(Vi=e.return;Vi;)switch(Vi.tag){case 5:case 31:case 13:Wi=!1;return;case 27:case 3:Wi=!0;return;default:Vi=Vi.return}}function Yi(e){if(e!==Vi)return!1;if(!j)return Ji(e),j=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!==`form`&&n!==`button`)||Wd(e.type,e.memoizedProps)),n=!n),n&&Hi&&Ki(e),Ji(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Hi=uf(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Hi=uf(e)}else t===27?(t=Hi,Zd(e.type)?(e=lf,lf=null,Hi=e):Hi=t):Hi=Vi?cf(e.stateNode.nextSibling):null;return!0}function Xi(){Hi=Vi=null,j=!1}function Zi(){var e=Ui;return e!==null&&(Zl===null?Zl=e:Zl.push.apply(Zl,e),Ui=null),e}function Qi(e){Ui===null?Ui=[e]:Ui.push(e)}var $i=pe(null),ea=null,ta=null;function na(e,t,n){he($i,t._currentValue),t._currentValue=n}function ra(e){e._currentValue=$i.current,me($i)}function ia(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function aa(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),ia(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),ia(s,n,e),s=null}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function oa(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;Ar(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===ye.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[Qf]:e.push(Qf))}a=a.return}e!==null&&aa(t,e,n,r),t.flags|=262144}function sa(e){for(e=e.firstContext;e!==null;){if(!Ar(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ca(e){ea=e,ta=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function la(e){return da(ea,e)}function ua(e,t){return ea===null&&ca(e),da(e,t)}function da(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},ta===null){if(e===null)throw Error(i(308));ta=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else ta=ta.next=t;return n}var fa=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},pa=t.unstable_scheduleCallback,ma=t.unstable_NormalPriority,ha={$$typeof:C,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function ga(){return{controller:new fa,data:new Map,refCount:0}}function _a(e){e.refCount--,e.refCount===0&&pa(ma,function(){e.controller.abort()})}var va=null,ya=0,ba=0,xa=null;function Sa(e,t){if(va===null){var n=va=[];ya=0,ba=ud(),xa={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return ya++,t.then(Ca,Ca),t}function Ca(){if(--ya===0&&va!==null){xa!==null&&(xa.status=`fulfilled`);var e=va;va=null,ba=0,xa=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function wa(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var Ta=D.S;D.S=function(e,t){eu=Pe(),typeof t==`object`&&t&&typeof t.then==`function`&&Sa(e,t),Ta!==null&&Ta(e,t)};var Ea=pe(null);function Da(){var e=Ea.current;return e===null?Ll.pooledCache:e}function Oa(e,t){t===null?he(Ea,Ea.current):he(Ea,t.pool)}function ka(){var e=Da();return e===null?null:{parent:ha._currentValue,pool:e}}var Aa=Error(i(460)),ja=Error(i(474)),Ma=Error(i(542)),Na={then:function(){}};function Pa(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Fa(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(ln,ln),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,za(e),e;default:if(typeof t.status==`string`)t.then(ln,ln);else{if(e=Ll,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,za(e),e}throw La=t,Aa}}function Ia(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(La=e,Aa):e}}var La=null;function Ra(){if(La===null)throw Error(i(459));var e=La;return La=null,e}function za(e){if(e===Aa||e===Ma)throw Error(i(483))}var Ba=null,Va=0;function Ha(e){var t=Va;return Va+=1,Ba===null&&(Ba=[]),Fa(Ba,e,t)}function Ua(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function Wa(e,t){throw t.$$typeof===g?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function Ga(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=vi(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=67108866,n):(r=r.index,r<n?(t.flags|=67108866,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=67108866),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=Si(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===y?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===E&&Ia(i)===t.type)?(t=a(t,n.props),Ua(t,n),t.return=e,t):(t=bi(n.type,n.key,n.props,null,e.mode,r),Ua(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=wi(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=xi(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=Si(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case _:return n=bi(t.type,t.key,t.props,null,e.mode,n),Ua(n,t),n.return=e,n;case v:return t=wi(t,e.mode,n),t.return=e,t;case E:return t=Ia(t),f(e,t,n)}if(ce(t)||ae(t))return t=xi(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,Ha(t),n);if(t.$$typeof===C)return f(e,ua(e,t),n);Wa(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case _:return n.key===i?l(e,t,n,r):null;case v:return n.key===i?u(e,t,n,r):null;case E:return n=Ia(n),p(e,t,n,r)}if(ce(n)||ae(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,Ha(n),r);if(n.$$typeof===C)return p(e,t,ua(e,n),r);Wa(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case _:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case v:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case E:return r=Ia(r),m(e,t,n,r,i)}if(ce(r)||ae(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,Ha(r),i);if(r.$$typeof===C)return m(e,t,n,ua(t,r),i);Wa(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),j&&Ii(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return j&&Ii(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),j&&Ii(i,h),l}function g(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),j&&Ii(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return j&&Ii(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),j&&Ii(a,g),u}function b(e,r,o,c){if(typeof o==`object`&&o&&o.type===y&&o.key===null&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case _:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===y){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===E&&Ia(l)===r.type){n(e,r.sibling),c=a(r,o.props),Ua(c,o),c.return=e,e=c;break a}n(e,r);break}else t(e,r);r=r.sibling}o.type===y?(c=xi(o.props.children,e.mode,c,o.key),c.return=e,e=c):(c=bi(o.type,o.key,o.props,null,e.mode,c),Ua(c,o),c.return=e,e=c)}return s(e);case v:a:{for(l=o.key;r!==null;){if(r.key===l)if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}else{n(e,r);break}else t(e,r);r=r.sibling}c=wi(o,e.mode,c),c.return=e,e=c}return s(e);case E:return o=Ia(o),b(e,r,o,c)}if(ce(o))return h(e,r,o,c);if(ae(o)){if(l=ae(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return b(e,r,Ha(o),c);if(o.$$typeof===C)return b(e,r,ua(e,o),c);Wa(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=Si(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{Va=0;var i=b(e,t,n,r);return Ba=null,i}catch(t){if(t===Aa||t===Ma)throw t;var a=gi(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var Ka=Ga(!0),qa=Ga(!1),Ja=!1;function Ya(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Xa(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Za(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Qa(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,J&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=pi(e),fi(e,null,n),t}return li(e,r,t,n),pi(e)}function $a(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ct(e,n)}}function eo(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var to=!1;function no(){if(to){var e=xa;if(e!==null)throw e}}function ro(e,t,n,r){to=!1;var i=e.updateQueue;Ja=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(Rl&f)===f:(r&f)===f){f!==0&&f===ba&&(to=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var h=e,g=s;f=t;var _=n;switch(g.tag){case 1:if(h=g.payload,typeof h==`function`){d=h.call(_,d,f);break a}d=h;break a;case 3:h.flags=h.flags&-65537|128;case 0:if(h=g.payload,f=typeof h==`function`?h.call(_,d,f):h,f==null)break a;d=m({},d,f);break a;case 2:Ja=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),Kl|=o,e.lanes=o,e.memoizedState=d}}function io(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function ao(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)io(n[e],t)}var oo=pe(null),so=pe(0);function co(e,t){e=Wl,he(so,e),he(oo,t),Wl=e|t.baseLanes}function lo(){he(so,Wl),he(oo,oo.current)}function uo(){Wl=so.current,me(oo),me(so)}var fo=pe(null),po=null;function mo(e){var t=e.alternate;he(yo,yo.current&1),he(fo,e),po===null&&(t===null||oo.current!==null||t.memoizedState!==null)&&(po=e)}function ho(e){he(yo,yo.current),he(fo,e),po===null&&(po=e)}function go(e){e.tag===22?(he(yo,yo.current),he(fo,e),po===null&&(po=e)):_o(e)}function _o(){he(yo,yo.current),he(fo,fo.current)}function vo(e){me(fo),po===e&&(po=null),me(yo)}var yo=pe(0);function bo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||af(n)||of(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder===`forwards`||t.memoizedProps.revealOrder===`backwards`||t.memoizedProps.revealOrder===`unstable_legacy-backwards`||t.memoizedProps.revealOrder===`together`)){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var xo=0,M=null,So=null,Co=null,wo=!1,To=!1,Eo=!1,Do=0,Oo=0,ko=null,Ao=0;function jo(){throw Error(i(321))}function Mo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ar(e[n],t[n]))return!1;return!0}function No(e,t,n,r,i,a){return xo=a,M=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,D.H=e===null||e.memoizedState===null?qs:Js,Eo=!1,a=n(r,i),Eo=!1,To&&(a=Fo(t,n,r,i)),Po(e),a}function Po(e){D.H=Ks;var t=So!==null&&So.next!==null;if(xo=0,Co=So=M=null,wo=!1,Oo=0,ko=null,t)throw Error(i(300));e===null||dc||(e=e.dependencies,e!==null&&sa(e)&&(dc=!0))}function Fo(e,t,n,r){M=e;var a=0;do{if(To&&(ko=null),Oo=0,To=!1,25<=a)throw Error(i(301));if(a+=1,Co=So=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}D.H=Ys,o=t(n,r)}while(To);return o}function Io(){var e=D.H,t=e.useState()[0];return t=typeof t.then==`function`?Uo(t):t,e=e.useState()[0],(So===null?null:So.memoizedState)!==e&&(M.flags|=1024),t}function Lo(){var e=Do!==0;return Do=0,e}function Ro(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function zo(e){if(wo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}wo=!1}xo=0,Co=So=M=null,To=!1,Oo=Do=0,ko=null}function Bo(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Co===null?M.memoizedState=Co=e:Co=Co.next=e,Co}function Vo(){if(So===null){var e=M.alternate;e=e===null?null:e.memoizedState}else e=So.next;var t=Co===null?M.memoizedState:Co.next;if(t!==null)Co=t,So=e;else{if(e===null)throw M.alternate===null?Error(i(467)):Error(i(310));So=e,e={memoizedState:So.memoizedState,baseState:So.baseState,baseQueue:So.baseQueue,queue:So.queue,next:null},Co===null?M.memoizedState=Co=e:Co=Co.next=e}return Co}function Ho(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Uo(e){var t=Oo;return Oo+=1,ko===null&&(ko=[]),e=Fa(ko,e,t),t=M,(Co===null?t.memoizedState:Co.next)===null&&(t=t.alternate,D.H=t===null||t.memoizedState===null?qs:Js),e}function Wo(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return Uo(e);if(e.$$typeof===C)return la(e)}throw Error(i(438,String(e)))}function Go(e){var t=null,n=M.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=M.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=Ho(),M.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=re;return t.index++,n}function Ko(e,t){return typeof t==`function`?t(e):t}function qo(e){return N(Vo(),So,e)}function N(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(xo&f)===f:(Rl&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===ba&&(d=!0);else if((xo&p)===p){u=u.next,p===ba&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,M.lanes|=p,Kl|=p;f=u.action,Eo&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,M.lanes|=f,Kl|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!Ar(o,e.memoizedState)&&(dc=!0,d&&(n=xa,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Jo(e){var t=Vo(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Ar(o,t.memoizedState)||(dc=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function Yo(e,t,n){var r=M,a=Vo(),o=j;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!Ar((So||a).memoizedState,n);if(s&&(a.memoizedState=n,dc=!0),a=a.queue,ys(Qo.bind(null,r,a,e),[e]),a.getSnapshot!==t||s||Co!==null&&Co.memoizedState.tag&1){if(r.flags|=2048,ms(9,{destroy:void 0},Zo.bind(null,r,a,n,t),null),Ll===null)throw Error(i(349));o||xo&127||Xo(r,t,n)}return n}function Xo(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=M.updateQueue,t===null?(t=Ho(),M.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Zo(e,t,n,r){t.value=n,t.getSnapshot=r,$o(t)&&es(e)}function Qo(e,t,n){return n(function(){$o(t)&&es(e)})}function $o(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ar(e,n)}catch{return!0}}function es(e){var t=di(e,2);t!==null&&mu(t,e,2)}function ts(e){var t=Bo();if(typeof e==`function`){var n=e;if(e=n(),Eo){Ge(!0);try{n()}finally{Ge(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ko,lastRenderedState:e},t}function ns(e,t,n,r){return e.baseState=n,N(e,So,typeof r==`function`?r:Ko)}function rs(e,t,n,r,a){if(F(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};D.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,is(t,o)):(o.next=n.next,t.pending=n.next=o)}}function is(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=D.T,o={};D.T=o;try{var s=n(i,r),c=D.S;c!==null&&c(o,s),as(e,t,s)}catch(n){ss(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),D.T=a}}else try{a=n(i,r),as(e,t,a)}catch(n){ss(e,t,n)}}function as(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){os(e,t,n)},function(n){return ss(e,t,n)}):os(e,t,n)}function os(e,t,n){t.status=`fulfilled`,t.value=n,cs(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,is(e,n)))}function ss(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,cs(t),t=t.next;while(t!==r)}e.action=null}function cs(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function ls(e,t){return t}function us(e,t){if(j){var n=Ll.formState;if(n!==null){a:{var r=M;if(j){if(Hi){b:{for(var i=Hi,a=Wi;i.nodeType!==8;){if(!a){i=null;break b}if(i=cf(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){Hi=cf(i.nextSibling),r=i.data===`F!`;break a}}Ki(r)}r=!1}r&&(t=n[0])}}return n=Bo(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ls,lastRenderedState:t},n.queue=r,n=Vs.bind(null,M,r),r.dispatch=n,r=ts(!1),a=Us.bind(null,M,!1,r.queue),r=Bo(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=rs.bind(null,M,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function ds(e){return fs(Vo(),So,e)}function fs(e,t,n){if(t=N(e,t,ls)[0],e=qo(Ko)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=Uo(t)}catch(e){throw e===Aa?Ma:e}else r=t;t=Vo();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(M.flags|=2048,ms(9,{destroy:void 0},ps.bind(null,i,n),null)),[r,a,e]}function ps(e,t){e.action=t}function P(e){var t=Vo(),n=So;if(n!==null)return fs(t,n,e);Vo(),t=t.memoizedState,n=Vo();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function ms(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=M.updateQueue,t===null&&(t=Ho(),M.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function hs(){return Vo().memoizedState}function gs(e,t,n,r){var i=Bo();M.flags|=e,i.memoizedState=ms(1|t,{destroy:void 0},n,r===void 0?null:r)}function _s(e,t,n,r){var i=Vo();r=r===void 0?null:r;var a=i.memoizedState.inst;So!==null&&r!==null&&Mo(r,So.memoizedState.deps)?i.memoizedState=ms(t,a,n,r):(M.flags|=e,i.memoizedState=ms(1|t,a,n,r))}function vs(e,t){gs(8390656,8,e,t)}function ys(e,t){_s(2048,8,e,t)}function bs(e){M.flags|=4;var t=M.updateQueue;if(t===null)t=Ho(),M.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function xs(e){var t=Vo().memoizedState;return bs({ref:t,nextImpl:e}),function(){if(J&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function Ss(e,t){return _s(4,2,e,t)}function Cs(e,t){return _s(4,4,e,t)}function ws(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ts(e,t,n){n=n==null?null:n.concat([e]),_s(4,4,ws.bind(null,t,e),n)}function Es(){}function Ds(e,t){var n=Vo();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Mo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Os(e,t){var n=Vo();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Mo(t,r[1]))return r[0];if(r=e(),Eo){Ge(!0);try{e()}finally{Ge(!1)}}return n.memoizedState=[r,t],r}function ks(e,t,n){return n===void 0||xo&1073741824&&!(Rl&261930)?e.memoizedState=t:(e.memoizedState=n,e=pu(),M.lanes|=e,Kl|=e,n)}function As(e,t,n,r){return Ar(n,t)?n:oo.current===null?!(xo&42)||xo&1073741824&&!(Rl&261930)?(dc=!0,e.memoizedState=n):(e=pu(),M.lanes|=e,Kl|=e,t):(e=ks(e,n,r),Ar(e,t)||(dc=!0),e)}function js(e,t,n,r,i){var a=le.p;le.p=a!==0&&8>a?a:8;var o=D.T,s={};D.T=s,Us(e,!1,t,n);try{var c=i(),l=D.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?Hs(e,t,wa(c,r),fu(e)):Hs(e,t,r,fu(e))}catch(n){Hs(e,t,{then:function(){},status:`rejected`,reason:n},fu())}finally{le.p=a,o!==null&&s.types!==null&&(o.types=s.types),D.T=o}}function Ms(){}function Ns(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=Ps(e).queue;js(e,a,t,ue,n===null?Ms:function(){return Fs(e),n(r)})}function Ps(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:ue,baseState:ue,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ko,lastRenderedState:ue},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ko,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Fs(e){var t=Ps(e);t.next===null&&(t=e.alternate.memoizedState),Hs(e,t.next.queue,{},fu())}function Is(){return la(Qf)}function Ls(){return Vo().memoizedState}function Rs(){return Vo().memoizedState}function zs(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=fu();e=Za(n);var r=Qa(t,e,n);r!==null&&(mu(r,t,n),$a(r,t,n)),t={cache:ga()},e.payload=t;return}t=t.return}}function Bs(e,t,n){var r=fu();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},F(e)?Ws(t,n):(n=ui(e,t,n,r),n!==null&&(mu(n,e,r),Gs(n,t,r)))}function Vs(e,t,n){Hs(e,t,n,fu())}function Hs(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(F(e))Ws(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Ar(s,o))return li(e,t,i,0),Ll===null&&ci(),!1}catch{}if(n=ui(e,t,i,r),n!==null)return mu(n,e,r),Gs(n,t,r),!0}return!1}function Us(e,t,n,r){if(r={lane:2,revertLane:ud(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},F(e)){if(t)throw Error(i(479))}else t=ui(e,n,r,2),t!==null&&mu(t,e,2)}function F(e){var t=e.alternate;return e===M||t!==null&&t===M}function Ws(e,t){To=wo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Gs(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ct(e,n)}}var Ks={readContext:la,use:Wo,useCallback:jo,useContext:jo,useEffect:jo,useImperativeHandle:jo,useLayoutEffect:jo,useInsertionEffect:jo,useMemo:jo,useReducer:jo,useRef:jo,useState:jo,useDebugValue:jo,useDeferredValue:jo,useTransition:jo,useSyncExternalStore:jo,useId:jo,useHostTransitionStatus:jo,useFormState:jo,useActionState:jo,useOptimistic:jo,useMemoCache:jo,useCacheRefresh:jo};Ks.useEffectEvent=jo;var qs={readContext:la,use:Wo,useCallback:function(e,t){return Bo().memoizedState=[e,t===void 0?null:t],e},useContext:la,useEffect:vs,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),gs(4194308,4,ws.bind(null,t,e),n)},useLayoutEffect:function(e,t){return gs(4194308,4,e,t)},useInsertionEffect:function(e,t){gs(4,2,e,t)},useMemo:function(e,t){var n=Bo();t=t===void 0?null:t;var r=e();if(Eo){Ge(!0);try{e()}finally{Ge(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=Bo();if(n!==void 0){var i=n(t);if(Eo){Ge(!0);try{n(t)}finally{Ge(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=Bs.bind(null,M,e),[r.memoizedState,e]},useRef:function(e){var t=Bo();return e={current:e},t.memoizedState=e},useState:function(e){e=ts(e);var t=e.queue,n=Vs.bind(null,M,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Es,useDeferredValue:function(e,t){return ks(Bo(),e,t)},useTransition:function(){var e=ts(!1);return e=js.bind(null,M,e.queue,!0,!1),Bo().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=M,a=Bo();if(j){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),Ll===null)throw Error(i(349));Rl&127||Xo(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,vs(Qo.bind(null,r,o,e),[e]),r.flags|=2048,ms(9,{destroy:void 0},Zo.bind(null,r,o,n,t),null),n},useId:function(){var e=Bo(),t=Ll.identifierPrefix;if(j){var n=Fi,r=Pi;n=(r&~(1<<32-Ke(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=Do++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=Ao++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:Is,useFormState:us,useActionState:us,useOptimistic:function(e){var t=Bo();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Us.bind(null,M,!0,n),n.dispatch=t,[e,t]},useMemoCache:Go,useCacheRefresh:function(){return Bo().memoizedState=zs.bind(null,M)},useEffectEvent:function(e){var t=Bo(),n={impl:e};return t.memoizedState=n,function(){if(J&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},Js={readContext:la,use:Wo,useCallback:Ds,useContext:la,useEffect:ys,useImperativeHandle:Ts,useInsertionEffect:Ss,useLayoutEffect:Cs,useMemo:Os,useReducer:qo,useRef:hs,useState:function(){return qo(Ko)},useDebugValue:Es,useDeferredValue:function(e,t){return As(Vo(),So.memoizedState,e,t)},useTransition:function(){var e=qo(Ko)[0],t=Vo().memoizedState;return[typeof e==`boolean`?e:Uo(e),t]},useSyncExternalStore:Yo,useId:Ls,useHostTransitionStatus:Is,useFormState:ds,useActionState:ds,useOptimistic:function(e,t){return ns(Vo(),So,e,t)},useMemoCache:Go,useCacheRefresh:Rs};Js.useEffectEvent=xs;var Ys={readContext:la,use:Wo,useCallback:Ds,useContext:la,useEffect:ys,useImperativeHandle:Ts,useInsertionEffect:Ss,useLayoutEffect:Cs,useMemo:Os,useReducer:Jo,useRef:hs,useState:function(){return Jo(Ko)},useDebugValue:Es,useDeferredValue:function(e,t){var n=Vo();return So===null?ks(n,e,t):As(n,So.memoizedState,e,t)},useTransition:function(){var e=Jo(Ko)[0],t=Vo().memoizedState;return[typeof e==`boolean`?e:Uo(e),t]},useSyncExternalStore:Yo,useId:Ls,useHostTransitionStatus:Is,useFormState:P,useActionState:P,useOptimistic:function(e,t){var n=Vo();return So===null?(n.baseState=e,[e,n.queue.dispatch]):ns(n,So,e,t)},useMemoCache:Go,useCacheRefresh:Rs};Ys.useEffectEvent=xs;function Xs(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:m({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Zs={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=fu(),i=Za(r);i.payload=t,n!=null&&(i.callback=n),t=Qa(e,i,r),t!==null&&(mu(t,e,r),$a(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=fu(),i=Za(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=Qa(e,i,r),t!==null&&(mu(t,e,r),$a(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=fu(),r=Za(n);r.tag=2,t!=null&&(r.callback=t),t=Qa(e,r,n),t!==null&&(mu(t,e,n),$a(t,e,n))}};function Qs(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!jr(n,r)||!jr(i,a):!0}function $s(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Zs.enqueueReplaceState(t,t.state,null)}function ec(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=m({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function tc(e){ii(e)}function nc(e){console.error(e)}function rc(e){ii(e)}function ic(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function ac(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function oc(e,t,n){return n=Za(n),n.tag=3,n.payload={element:null},n.callback=function(){ic(e,t)},n}function sc(e){return e=Za(e),e.tag=3,e}function cc(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){ac(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){ac(t,n,r),typeof i!=`function`&&(ru===null?ru=new Set([this]):ru.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function lc(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&oa(t,n,a,!0),n=fo.current,n!==null){switch(n.tag){case 31:case 13:return po===null?Eu():n.alternate===null&&Gl===0&&(Gl=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===Na?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),Wu(e,r,a)),!1;case 22:return n.flags|=65536,r===Na?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),Wu(e,r,a)),!1}throw Error(i(435,n.tag))}return Wu(e,r,a),Eu(),!1}if(j)return t=fo.current,t===null?(r!==Gi&&(t=Error(i(423),{cause:r}),Qi(Ei(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=Ei(r,n),a=oc(e.stateNode,r,a),eo(e,a),Gl!==4&&(Gl=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==Gi&&(e=Error(i(422),{cause:r}),Qi(Ei(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=Ei(o,n),Xl===null?Xl=[o]:Xl.push(o),Gl!==4&&(Gl=2),t===null)return!0;r=Ei(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=oc(n.stateNode,r,e),eo(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(ru===null||!ru.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=sc(a),cc(a,e,n,r),eo(n,a),!1}n=n.return}while(n!==null);return!1}var uc=Error(i(461)),dc=!1;function fc(e,t,n,r){t.child=e===null?qa(t,null,n,r):Ka(t,e.child,n,r)}function I(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return ca(t),r=No(e,t,n,o,a,i),s=Lo(),e!==null&&!dc?(Ro(e,t,i),Ic(e,t,i)):(j&&s&&Ri(t),t.flags|=1,fc(e,t,r,i),t.child)}function pc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!_i(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,mc(e,t,a,r,i)):(e=bi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!Lc(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?jr:n,n(o,r)&&e.ref===t.ref)return Ic(e,t,i)}return t.flags|=1,e=vi(a,r),e.ref=t.ref,e.return=t,t.child=e}function mc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(jr(a,r)&&e.ref===t.ref)if(dc=!1,t.pendingProps=r=a,Lc(e,i))e.flags&131072&&(dc=!0);else return t.lanes=e.lanes,Ic(e,t,i)}return Sc(e,t,n,r,i)}function hc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return _c(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Oa(t,a===null?null:a.cachePool),a===null?lo():co(t,a),go(t);else return r=t.lanes=536870912,_c(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&Oa(t,null),lo(),_o(t)):(Oa(t,a.cachePool),co(t,a),_o(t),t.memoizedState=null);return fc(e,t,i,n),t.child}function gc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function _c(e,t,n,r,i){var a=Da();return a=a===null?null:{parent:ha._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Oa(t,null),lo(),go(t),e!==null&&oa(e,t,r,!0),t.childLanes=i,null}function vc(e,t){return t=jc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function yc(e,t,n){return Ka(t,e.child,null,n),e=vc(t,t.pendingProps),e.flags|=2,vo(t),t.memoizedState=null,e}function bc(e,t,n){var r=t.pendingProps,a=(t.flags&128)!=0;if(t.flags&=-129,e===null){if(j){if(r.mode===`hidden`)return e=vc(t,r),t.lanes=536870912,gc(null,e);if(ho(t),(e=Hi)?(e=rf(e,Wi),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ni===null?null:{id:Pi,overflow:Fi},retryLane:536870912,hydrationErrors:null},n=Ci(e),n.return=t,t.child=n,Vi=t,Hi=null)):e=null,e===null)throw Ki(t);return t.lanes=536870912,null}return vc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(ho(t),a)if(t.flags&256)t.flags&=-257,t=yc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558));else if(dc||oa(e,t,n,!1),a=(n&e.childLanes)!==0,dc||a){if(r=Ll,r!==null&&(s=lt(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,di(e,s),mu(r,e,s),uc;Eu(),t=yc(e,t,n)}else e=o.treeContext,Hi=cf(s.nextSibling),Vi=t,j=!0,Ui=null,Wi=!1,e!==null&&Bi(t,e),t=vc(t,r),t.flags|=4096;return t}return e=vi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function xc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Sc(e,t,n,r,i){return ca(t),n=No(e,t,n,r,void 0,i),r=Lo(),e!==null&&!dc?(Ro(e,t,i),Ic(e,t,i)):(j&&r&&Ri(t),t.flags|=1,fc(e,t,n,i),t.child)}function Cc(e,t,n,r,i,a){return ca(t),t.updateQueue=null,n=Fo(t,r,n,i),Po(e),r=Lo(),e!==null&&!dc?(Ro(e,t,a),Ic(e,t,a)):(j&&r&&Ri(t),t.flags|=1,fc(e,t,n,a),t.child)}function wc(e,t,n,r,i){if(ca(t),t.stateNode===null){var a=mi,o=n.contextType;typeof o==`object`&&o&&(a=la(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=Zs,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},Ya(t),o=n.contextType,a.context=typeof o==`object`&&o?la(o):mi,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(Xs(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&Zs.enqueueReplaceState(a,a.state,null),ro(t,r,a,i),no(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=ec(n,s);a.props=c;var l=a.context,u=n.contextType;o=mi,typeof u==`object`&&u&&(o=la(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&$s(t,a,r,o),Ja=!1;var f=t.memoizedState;a.state=f,ro(t,r,a,i),no(),l=t.memoizedState,s||f!==l||Ja?(typeof d==`function`&&(Xs(t,n,d,r),l=t.memoizedState),(c=Ja||Qs(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Xa(e,t),o=t.memoizedProps,u=ec(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=mi,typeof l==`object`&&l&&(c=la(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&$s(t,a,r,c),Ja=!1,f=t.memoizedState,a.state=f,ro(t,r,a,i),no();var p=t.memoizedState;o!==d||f!==p||Ja||e!==null&&e.dependencies!==null&&sa(e.dependencies)?(typeof s==`function`&&(Xs(t,n,s,r),p=t.memoizedState),(u=Ja||Qs(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&sa(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,xc(e,t),r=(t.flags&128)!=0,a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=Ka(t,e.child,null,i),t.child=Ka(t,null,n,i)):fc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=Ic(e,t,i),e}function Tc(e,t,n,r){return Xi(),t.flags|=256,fc(e,t,n,r),t.child}var Ec={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Dc(e){return{baseLanes:e,cachePool:ka()}}function Oc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=X),e}function kc(e,t,n){var r=t.pendingProps,a=!1,o=(t.flags&128)!=0,s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:(yo.current&2)!=0),s&&(a=!0,t.flags&=-129),s=(t.flags&32)!=0,t.flags&=-33,e===null){if(j){if(a?mo(t):_o(t),(e=Hi)?(e=rf(e,Wi),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ni===null?null:{id:Pi,overflow:Fi},retryLane:536870912,hydrationErrors:null},n=Ci(e),n.return=t,t.child=n,Vi=t,Hi=null)):e=null,e===null)throw Ki(t);return of(e)?t.lanes=32:t.lanes=536870912,null}var c=r.children;return r=r.fallback,a?(_o(t),a=t.mode,c=jc({mode:`hidden`,children:c},a),r=xi(r,a,n,null),c.return=t,r.return=t,c.sibling=r,t.child=c,r=t.child,r.memoizedState=Dc(n),r.childLanes=Oc(e,s,n),t.memoizedState=Ec,gc(null,r)):(mo(t),Ac(t,c))}var l=e.memoizedState;if(l!==null&&(c=l.dehydrated,c!==null)){if(o)t.flags&256?(mo(t),t.flags&=-257,t=Mc(e,t,n)):t.memoizedState===null?(_o(t),c=r.fallback,a=t.mode,r=jc({mode:`visible`,children:r.children},a),c=xi(c,a,n,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,Ka(t,e.child,null,n),r=t.child,r.memoizedState=Dc(n),r.childLanes=Oc(e,s,n),t.memoizedState=Ec,t=gc(null,r)):(_o(t),t.child=e.child,t.flags|=128,t=null);else if(mo(t),of(c)){if(s=c.nextSibling&&c.nextSibling.dataset,s)var u=s.dgst;s=u,r=Error(i(419)),r.stack=``,r.digest=s,Qi({value:r,source:null,stack:null}),t=Mc(e,t,n)}else if(dc||oa(e,t,n,!1),s=(n&e.childLanes)!==0,dc||s){if(s=Ll,s!==null&&(r=lt(s,n),r!==0&&r!==l.retryLane))throw l.retryLane=r,di(e,r),mu(s,e,r),uc;af(c)||Eu(),t=Mc(e,t,n)}else af(c)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,Hi=cf(c.nextSibling),Vi=t,j=!0,Ui=null,Wi=!1,e!==null&&Bi(t,e),t=Ac(t,r.children),t.flags|=4096);return t}return a?(_o(t),c=r.fallback,a=t.mode,l=e.child,u=l.sibling,r=vi(l,{mode:`hidden`,children:r.children}),r.subtreeFlags=l.subtreeFlags&65011712,u===null?(c=xi(c,a,n,null),c.flags|=2):c=vi(u,c),c.return=t,r.return=t,r.sibling=c,t.child=r,gc(null,r),r=t.child,c=e.child.memoizedState,c===null?c=Dc(n):(a=c.cachePool,a===null?a=ka():(l=ha._currentValue,a=a.parent===l?a:{parent:l,pool:l}),c={baseLanes:c.baseLanes|n,cachePool:a}),r.memoizedState=c,r.childLanes=Oc(e,s,n),t.memoizedState=Ec,gc(e.child,r)):(mo(t),n=e.child,e=n.sibling,n=vi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(s=t.deletions,s===null?(t.deletions=[e],t.flags|=16):s.push(e)),t.child=n,t.memoizedState=null,n)}function Ac(e,t){return t=jc({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function jc(e,t){return e=gi(22,e,null,t),e.lanes=0,e}function Mc(e,t,n){return Ka(t,e.child,null,n),e=Ac(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Nc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ia(e.return,t,n)}function Pc(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function Fc(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=yo.current,s=(o&2)!=0;if(s?(o=o&1|2,t.flags|=128):o&=1,he(yo,o),fc(e,t,r,n),r=j?Ai:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Nc(e,n,t);else if(e.tag===19)Nc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&bo(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),Pc(t,!1,i,n,a,r);break;case`backwards`:case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&bo(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}Pc(t,!0,n,null,a,r);break;case`together`:Pc(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function Ic(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Kl|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(oa(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=vi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=vi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Lc(e,t){return(e.lanes&t)===0?(e=e.dependencies,!!(e!==null&&sa(e))):!0}function L(e,t,n){switch(t.tag){case 3:be(t,t.stateNode.containerInfo),na(t,ha,e.memoizedState.cache),Xi();break;case 27:case 5:Se(t);break;case 4:be(t,t.stateNode.containerInfo);break;case 10:na(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,ho(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(mo(t),e=Ic(e,t,n),e===null?null:e.sibling):kc(e,t,n):(mo(t),t.flags|=128,null);mo(t);break;case 19:var i=(e.flags&128)!=0;if(r=(n&t.childLanes)!==0,r||=(oa(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return Fc(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),he(yo,yo.current),r)break;return null;case 22:return t.lanes=0,hc(e,t,n,t.pendingProps);case 24:na(t,ha,e.memoizedState.cache)}return Ic(e,t,n)}function R(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)dc=!0;else{if(!Lc(e,n)&&!(t.flags&128))return dc=!1,L(e,t,n);dc=!!(e.flags&131072)}else dc=!1,j&&t.flags&1048576&&Li(t,Ai,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=Ia(t.elementType),t.type=e,typeof e==`function`)_i(e)?(r=ec(e,r),t.tag=1,t=wc(null,t,e,r,n)):(t.tag=0,t=Sc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===w){t.tag=11,t=I(null,t,e,r,n);break a}else if(a===te){t.tag=14,t=pc(null,t,e,r,n);break a}}throw t=se(e)||e,Error(i(306,t,``))}}return t;case 0:return Sc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=ec(r,t.pendingProps),wc(e,t,r,a,n);case 3:a:{if(be(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,Xa(e,t),ro(t,r,null,n);var s=t.memoizedState;if(r=s.cache,na(t,ha,r),r!==o.cache&&aa(t,[ha],n,!0),no(),r=s.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=Tc(e,t,r,n);break a}else if(r!==a){a=Ei(Error(i(424)),t),Qi(a),t=Tc(e,t,r,n);break a}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(Hi=cf(e.firstChild),Vi=t,j=!0,Ui=null,Wi=!0,n=qa(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Xi(),r===a){t=Ic(e,t,n);break a}fc(e,t,r,n)}t=t.child}return t;case 26:return xc(e,t),e===null?(n=kf(t.type,null,t.pendingProps,null))?t.memoizedState=n:j||(n=t.type,e=t.pendingProps,r=Vd(ve.current).createElement(n),r[ht]=t,r[gt]=e,Fd(r,n,e),Ot(r),t.stateNode=r):t.memoizedState=kf(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Se(t),e===null&&j&&(r=t.stateNode=ff(t.type,t.pendingProps,ve.current),Vi=t,Wi=!0,a=Hi,Zd(t.type)?(lf=a,Hi=cf(r.firstChild)):Hi=a),fc(e,t,t.pendingProps.children,n),xc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&j&&((a=r=Hi)&&(r=tf(r,t.type,t.pendingProps,Wi),r===null?a=!1:(t.stateNode=r,Vi=t,Hi=cf(r.firstChild),Wi=!1,a=!0)),a||Ki(t)),Se(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,Wd(a,o)?r=null:s!==null&&Wd(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=No(e,t,Io,null,null,n),Qf._currentValue=a),xc(e,t),fc(e,t,r,n),t.child;case 6:return e===null&&j&&((e=n=Hi)&&(n=nf(n,t.pendingProps,Wi),n===null?e=!1:(t.stateNode=n,Vi=t,Hi=null,e=!0)),e||Ki(t)),null;case 13:return kc(e,t,n);case 4:return be(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Ka(t,null,r,n):fc(e,t,r,n),t.child;case 11:return I(e,t,t.type,t.pendingProps,n);case 7:return fc(e,t,t.pendingProps,n),t.child;case 8:return fc(e,t,t.pendingProps.children,n),t.child;case 12:return fc(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,na(t,t.type,r.value),fc(e,t,r.children,n),t.child;case 9:return a=t.type._context,r=t.pendingProps.children,ca(t),a=la(a),r=r(a),t.flags|=1,fc(e,t,r,n),t.child;case 14:return pc(e,t,t.type,t.pendingProps,n);case 15:return mc(e,t,t.type,t.pendingProps,n);case 19:return Fc(e,t,n);case 31:return bc(e,t,n);case 22:return hc(e,t,n,t.pendingProps);case 24:return ca(t),r=la(ha),e===null?(a=Da(),a===null&&(a=Ll,o=ga(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},Ya(t),na(t,ha,a)):((e.lanes&n)!==0&&(Xa(e,t),ro(t,null,null,n),no()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,na(t,ha,r),r!==a.cache&&aa(t,[ha],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),na(t,ha,r))),fc(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function z(e){e.flags|=4}function B(e,t,n,r,i){if((t=(e.mode&32)!=0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(Cu())e.flags|=8192;else throw La=Na,ja}else e.flags&=-16777217}function V(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Wf(t))if(Cu())e.flags|=8192;else throw La=Na,ja}function Rc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:rt(),e.lanes|=t,Yl|=t)}function H(e,t){if(!j)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function zc(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&65011712,r|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Bc(e,t,n){var r=t.pendingProps;switch(zi(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return zc(t),null;case 1:return zc(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),ra(ha),xe(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Yi(t)?z(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Zi())),zc(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(z(t),o===null?(zc(t),B(t,a,null,r,n)):(zc(t),V(t,o))):o?o===e.memoizedState?(zc(t),t.flags&=-16777217):(z(t),zc(t),V(t,o)):(e=e.memoizedProps,e!==r&&z(t),zc(t),B(t,a,e,r,n)),null;case 27:if(Ce(t),n=ve.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&z(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return zc(t),null}e=ge.current,Yi(t)?qi(t,e):(e=ff(a,r,n),t.stateNode=e,z(t))}return zc(t),null;case 5:if(Ce(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&z(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return zc(t),null}if(o=ge.current,Yi(t))qi(t,o);else{var s=Vd(ve.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[ht]=t,o[gt]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(Fd(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&z(t)}}return zc(t),B(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&z(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=ve.current,Yi(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=Vi,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[ht]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||Md(e.nodeValue,n)),e||Ki(t,!0)}else e=Vd(e).createTextNode(r),e[ht]=t,t.stateNode=e}return zc(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=Yi(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[ht]=t}else Xi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;zc(t),e=!1}else n=Zi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(vo(t),t):(vo(t),null);if(t.flags&128)throw Error(i(558))}return zc(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Yi(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[ht]=t}else Xi(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;zc(t),a=!1}else a=Zi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(vo(t),t):(vo(t),null)}return vo(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Rc(t,t.updateQueue),zc(t),null);case 4:return xe(),e===null&&Sd(t.stateNode.containerInfo),zc(t),null;case 10:return ra(t.type),zc(t),null;case 19:if(me(yo),r=t.memoizedState,r===null)return zc(t),null;if(a=(t.flags&128)!=0,o=r.rendering,o===null)if(a)H(r,!1);else{if(Gl!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=bo(e),o!==null){for(t.flags|=128,H(r,!1),e=o.updateQueue,t.updateQueue=e,Rc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)yi(n,e),n=n.sibling;return he(yo,yo.current&1|2),j&&Ii(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Pe()>tu&&(t.flags|=128,a=!0,H(r,!1),t.lanes=4194304)}else{if(!a)if(e=bo(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,Rc(t,e),H(r,!0),r.tail===null&&r.tailMode===`hidden`&&!o.alternate&&!j)return zc(t),null}else 2*Pe()-r.renderingStartTime>tu&&n!==536870912&&(t.flags|=128,a=!0,H(r,!1),t.lanes=4194304);r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}return r.tail===null?(zc(t),null):(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Pe(),e.sibling=null,n=yo.current,he(yo,a?n&1|2:n&1),j&&Ii(t,r.treeForkCount),e);case 22:case 23:return vo(t),uo(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(zc(t),t.subtreeFlags&6&&(t.flags|=8192)):zc(t),n=t.updateQueue,n!==null&&Rc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&me(Ea),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),ra(ha),zc(t),null;case 25:return null;case 30:return null}throw Error(i(156,t.tag))}function U(e,t){switch(zi(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return ra(ha),xe(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Ce(t),null;case 31:if(t.memoizedState!==null){if(vo(t),t.alternate===null)throw Error(i(340));Xi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(vo(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));Xi()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return me(yo),null;case 4:return xe(),null;case 10:return ra(t.type),null;case 22:case 23:return vo(t),uo(),e!==null&&me(Ea),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return ra(ha),null;case 25:return null;default:return null}}function Vc(e,t){switch(zi(t),t.tag){case 3:ra(ha),xe();break;case 26:case 27:case 5:Ce(t);break;case 4:xe();break;case 31:t.memoizedState!==null&&vo(t);break;case 13:vo(t);break;case 19:me(yo);break;case 10:ra(t.type);break;case 22:case 23:vo(t),uo(),e!==null&&me(Ea);break;case 24:ra(ha)}}function Hc(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Uu(t,t.return,e)}}function Uc(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Uu(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Uu(t,t.return,e)}}function W(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{ao(t,n)}catch(t){Uu(e,e.return,t)}}}function Wc(e,t,n){n.props=ec(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Uu(e,t,n)}}function G(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Uu(e,t,n)}}function Gc(e,t){var n=e.ref,r=e.refCleanup;if(n!==null)if(typeof r==`function`)try{r()}catch(n){Uu(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Uu(e,t,n)}else n.current=null}function Kc(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Uu(e,e.return,t)}}function qc(e,t,n){try{var r=e.stateNode;Id(r,e.type,n,t),r[gt]=t}catch(t){Uu(e,e.return,t)}}function Jc(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Zd(e.type)||e.tag===4}function Yc(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Jc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Zd(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Xc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ln));else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(Xc(e,t,n),e=e.sibling;e!==null;)Xc(e,t,n),e=e.sibling}function Zc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(Zc(e,t,n),e=e.sibling;e!==null;)Zc(e,t,n),e=e.sibling}function Qc(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);Fd(t,r,n),t[ht]=e,t[gt]=n}catch(t){Uu(e,e.return,t)}}var $c=!1,el=!1,K=!1,tl=typeof WeakSet==`function`?WeakSet:Set,nl=null;function rl(e,t){if(e=e.containerInfo,zd=sp,e=Fr(e),Ir(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var a=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||a!==0&&f.nodeType!==3||(c=s+a),f!==o||r!==0&&f.nodeType!==3||(l=s+r),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===a&&(c=s),p===o&&++d===r&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(Bd={focusedElem:e,selectionRange:n},sp=!1,nl=t;nl!==null;)if(t=nl,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,nl=e;else for(;nl!==null;){switch(t=nl,o=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e===null?null:e.events,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&o!==null){e=void 0,n=t,a=o.memoizedProps,o=o.memoizedState,r=n.stateNode;try{var h=ec(n.type,a);e=r.getSnapshotBeforeUpdate(h,o),r.__reactInternalSnapshotBeforeUpdate=e}catch(e){Uu(n,n.return,e)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)ef(e);else if(n===1)switch(e.nodeName){case`HEAD`:case`HTML`:case`BODY`:ef(e);break;default:e.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(i(163))}if(e=t.sibling,e!==null){e.return=t.return,nl=e;break}nl=t.return}}function il(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:yl(e,n),r&4&&Hc(5,n);break;case 1:if(yl(e,n),r&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Uu(n,n.return,e)}else{var i=ec(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Uu(n,n.return,e)}}r&64&&W(n),r&512&&G(n,n.return);break;case 3:if(yl(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{ao(e,t)}catch(e){Uu(n,n.return,e)}}break;case 27:t===null&&r&4&&Qc(n);case 26:case 5:yl(e,n),t===null&&r&4&&Kc(n),r&512&&G(n,n.return);break;case 12:yl(e,n);break;case 31:yl(e,n),r&4&&ul(e,n);break;case 13:yl(e,n),r&4&&dl(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=qu.bind(null,n),sf(e,n))));break;case 22:if(r=n.memoizedState!==null||$c,!r){t=t!==null&&t.memoizedState!==null||el,i=$c;var a=el;$c=r,(el=t)&&!a?xl(e,n,(n.subtreeFlags&8772)!=0):yl(e,n),$c=i,el=a}break;case 30:break;default:yl(e,n)}}function al(e){var t=e.alternate;t!==null&&(e.alternate=null,al(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Ct(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var ol=null,sl=!1;function cl(e,t,n){for(n=n.child;n!==null;)ll(e,t,n),n=n.sibling}function ll(e,t,n){if(We&&typeof We.onCommitFiberUnmount==`function`)try{We.onCommitFiberUnmount(Ue,n)}catch{}switch(n.tag){case 26:el||Gc(n,t),cl(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:el||Gc(n,t);var r=ol,i=sl;Zd(n.type)&&(ol=n.stateNode,sl=!1),cl(e,t,n),pf(n.stateNode),ol=r,sl=i;break;case 5:el||Gc(n,t);case 6:if(r=ol,i=sl,ol=null,cl(e,t,n),ol=r,sl=i,ol!==null)if(sl)try{(ol.nodeType===9?ol.body:ol.nodeName===`HTML`?ol.ownerDocument.body:ol).removeChild(n.stateNode)}catch(e){Uu(n,t,e)}else try{ol.removeChild(n.stateNode)}catch(e){Uu(n,t,e)}break;case 18:ol!==null&&(sl?(e=ol,Qd(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Np(e)):Qd(ol,n.stateNode));break;case 4:r=ol,i=sl,ol=n.stateNode.containerInfo,sl=!0,cl(e,t,n),ol=r,sl=i;break;case 0:case 11:case 14:case 15:Uc(2,n,t),el||Uc(4,n,t),cl(e,t,n);break;case 1:el||(Gc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&Wc(n,t,r)),cl(e,t,n);break;case 21:cl(e,t,n);break;case 22:el=(r=el)||n.memoizedState!==null,cl(e,t,n),el=r;break;default:cl(e,t,n)}}function ul(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Np(e)}catch(e){Uu(t,t.return,e)}}}function dl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Np(e)}catch(e){Uu(t,t.return,e)}}function fl(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new tl),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new tl),t;default:throw Error(i(435,e.tag))}}function pl(e,t){var n=fl(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=Ju.bind(null,e,t);t.then(r,r)}})}function ml(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var a=n[r],o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 27:if(Zd(c.type)){ol=c.stateNode,sl=!1;break a}break;case 5:ol=c.stateNode,sl=!1;break a;case 3:case 4:ol=c.stateNode.containerInfo,sl=!0;break a}c=c.return}if(ol===null)throw Error(i(160));ll(o,s,a),ol=null,sl=!1,o=a.alternate,o!==null&&(o.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)gl(t,e),t=t.sibling}var hl=null;function gl(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:ml(t,e),_l(e),r&4&&(Uc(3,e,e.return),Hc(3,e),Uc(5,e,e.return));break;case 1:ml(t,e),_l(e),r&512&&(el||n===null||Gc(n,n.return)),r&64&&$c&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var a=hl;if(ml(t,e),_l(e),r&512&&(el||n===null||Gc(n,n.return)),r&4){var o=n===null?null:n.memoizedState;if(r=e.memoizedState,n===null)if(r===null)if(e.stateNode===null){a:{r=e.type,n=e.memoizedProps,a=a.ownerDocument||a;b:switch(r){case`title`:o=a.getElementsByTagName(`title`)[0],(!o||o[St]||o[ht]||o.namespaceURI===`http://www.w3.org/2000/svg`||o.hasAttribute(`itemprop`))&&(o=a.createElement(r),a.head.insertBefore(o,a.querySelector(`head > title`))),Fd(o,r,n),o[ht]=e,Ot(o),r=o;break a;case`link`:var s=Vf(`link`,`href`,a).get(r+(n.href||``));if(s){for(var c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&o.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&o.getAttribute(`title`)===(n.title==null?null:n.title)&&o.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){s.splice(c,1);break b}}o=a.createElement(r),Fd(o,r,n),a.head.appendChild(o);break;case`meta`:if(s=Vf(`meta`,`content`,a).get(r+(n.content||``))){for(c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`content`)===(n.content==null?null:``+n.content)&&o.getAttribute(`name`)===(n.name==null?null:n.name)&&o.getAttribute(`property`)===(n.property==null?null:n.property)&&o.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){s.splice(c,1);break b}}o=a.createElement(r),Fd(o,r,n),a.head.appendChild(o);break;default:throw Error(i(468,r))}o[ht]=e,Ot(o),r=o}e.stateNode=r}else Hf(a,e.type,e.stateNode);else e.stateNode=If(a,r,e.memoizedProps);else o===r?r===null&&e.stateNode!==null&&qc(e,e.memoizedProps,n.memoizedProps):(o===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):o.count--,r===null?Hf(a,e.type,e.stateNode):If(a,r,e.memoizedProps))}break;case 27:ml(t,e),_l(e),r&512&&(el||n===null||Gc(n,n.return)),n!==null&&r&4&&qc(e,e.memoizedProps,n.memoizedProps);break;case 5:if(ml(t,e),_l(e),r&512&&(el||n===null||Gc(n,n.return)),e.flags&32){a=e.stateNode;try{en(a,``)}catch(t){Uu(e,e.return,t)}}r&4&&e.stateNode!=null&&(a=e.memoizedProps,qc(e,a,n===null?a:n.memoizedProps)),r&1024&&(K=!0);break;case 6:if(ml(t,e),_l(e),r&4){if(e.stateNode===null)throw Error(i(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(t){Uu(e,e.return,t)}}break;case 3:if(Bf=null,a=hl,hl=gf(t.containerInfo),ml(t,e),hl=a,_l(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Np(t.containerInfo)}catch(t){Uu(e,e.return,t)}K&&(K=!1,vl(e));break;case 4:r=hl,hl=gf(e.stateNode.containerInfo),ml(t,e),_l(e),hl=r;break;case 12:ml(t,e),_l(e);break;case 31:ml(t,e),_l(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,pl(e,r)));break;case 13:ml(t,e),_l(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&($l=Pe()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,pl(e,r)));break;case 22:a=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,u=$c,d=el;if($c=u||a,el=d||l,ml(t,e),el=d,$c=u,_l(e),r&8192)a:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||l||$c||el||bl(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(o=l.stateNode,a)s=o.style,typeof s.setProperty==`function`?s.setProperty(`display`,`none`,`important`):s.display=`none`;else{c=l.stateNode;var f=l.memoizedProps.style,p=f!=null&&f.hasOwnProperty(`display`)?f.display:null;c.style.display=p==null||typeof p==`boolean`?``:(``+p).trim()}}catch(e){Uu(l,l.return,e)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=a?``:l.memoizedProps}catch(e){Uu(l,l.return,e)}}}else if(t.tag===18){if(n===null){l=t;try{var m=l.stateNode;a?$d(m,!0):$d(l.stateNode,!1)}catch(e){Uu(l,l.return,e)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break a;for(;t.sibling===null;){if(t.return===null||t.return===e)break a;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,pl(e,n))));break;case 19:ml(t,e),_l(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,pl(e,r)));break;case 30:break;case 21:break;default:ml(t,e),_l(e)}}function _l(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Jc(r)){n=r;break}r=r.return}if(n==null)throw Error(i(160));switch(n.tag){case 27:var a=n.stateNode;Zc(e,Yc(e),a);break;case 5:var o=n.stateNode;n.flags&32&&(en(o,``),n.flags&=-33),Zc(e,Yc(e),o);break;case 3:case 4:var s=n.stateNode.containerInfo;Xc(e,Yc(e),s);break;default:throw Error(i(161))}}catch(t){Uu(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function vl(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;vl(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function yl(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)il(e,t.alternate,t),t=t.sibling}function bl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Uc(4,t,t.return),bl(t);break;case 1:Gc(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount==`function`&&Wc(t,t.return,n),bl(t);break;case 27:pf(t.stateNode);case 26:case 5:Gc(t,t.return),bl(t);break;case 22:t.memoizedState===null&&bl(t);break;case 30:bl(t);break;default:bl(t)}e=e.sibling}}function xl(e,t,n){for(n&&=(t.subtreeFlags&8772)!=0,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags;switch(a.tag){case 0:case 11:case 15:xl(i,a,n),Hc(4,a);break;case 1:if(xl(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Uu(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var s=r.stateNode;try{var c=i.shared.hiddenCallbacks;if(c!==null)for(i.shared.hiddenCallbacks=null,i=0;i<c.length;i++)io(c[i],s)}catch(e){Uu(r,r.return,e)}}n&&o&64&&W(a),G(a,a.return);break;case 27:Qc(a);case 26:case 5:xl(i,a,n),n&&r===null&&o&4&&Kc(a),G(a,a.return);break;case 12:xl(i,a,n);break;case 31:xl(i,a,n),n&&o&4&&ul(i,a);break;case 13:xl(i,a,n),n&&o&4&&dl(i,a);break;case 22:a.memoizedState===null&&xl(i,a,n),G(a,a.return);break;case 30:break;default:xl(i,a,n)}t=t.sibling}}function Sl(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&_a(n))}function Cl(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&_a(e))}function wl(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Tl(e,t,n,r),t=t.sibling}function Tl(e,t,n,r){var i=t.flags;switch(t.tag){case 0:case 11:case 15:wl(e,t,n,r),i&2048&&Hc(9,t);break;case 1:wl(e,t,n,r);break;case 3:wl(e,t,n,r),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&_a(e)));break;case 12:if(i&2048){wl(e,t,n,r),e=t.stateNode;try{var a=t.memoizedProps,o=a.id,s=a.onPostCommit;typeof s==`function`&&s(o,t.alternate===null?`mount`:`update`,e.passiveEffectDuration,-0)}catch(e){Uu(t,t.return,e)}}else wl(e,t,n,r);break;case 31:wl(e,t,n,r);break;case 13:wl(e,t,n,r);break;case 23:break;case 22:a=t.stateNode,o=t.alternate,t.memoizedState===null?a._visibility&2?wl(e,t,n,r):(a._visibility|=2,El(e,t,n,r,(t.subtreeFlags&10256)!=0||!1)):a._visibility&2?wl(e,t,n,r):Dl(e,t),i&2048&&Sl(o,t);break;case 24:wl(e,t,n,r),i&2048&&Cl(t.alternate,t);break;default:wl(e,t,n,r)}}function El(e,t,n,r,i){for(i&&=(t.subtreeFlags&10256)!=0||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:El(a,o,s,c,i),Hc(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,El(a,o,s,c,i)):u._visibility&2?El(a,o,s,c,i):Dl(a,o),i&&l&2048&&Sl(o.alternate,o);break;case 24:El(a,o,s,c,i),i&&l&2048&&Cl(o.alternate,o);break;default:El(a,o,s,c,i)}t=t.sibling}}function Dl(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Dl(n,r),i&2048&&Sl(r.alternate,r);break;case 24:Dl(n,r),i&2048&&Cl(r.alternate,r);break;default:Dl(n,r)}t=t.sibling}}var Ol=8192;function kl(e,t,n){if(e.subtreeFlags&Ol)for(e=e.child;e!==null;)Al(e,t,n),e=e.sibling}function Al(e,t,n){switch(e.tag){case 26:kl(e,t,n),e.flags&Ol&&e.memoizedState!==null&&Gf(n,hl,e.memoizedState,e.memoizedProps);break;case 5:kl(e,t,n);break;case 3:case 4:var r=hl;hl=gf(e.stateNode.containerInfo),kl(e,t,n),hl=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Ol,Ol=16777216,kl(e,t,n),Ol=r):kl(e,t,n));break;default:kl(e,t,n)}}function q(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function jl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];nl=r,Pl(r,e)}q(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Ml(e),e=e.sibling}function Ml(e){switch(e.tag){case 0:case 11:case 15:jl(e),e.flags&2048&&Uc(9,e,e.return);break;case 3:jl(e);break;case 12:jl(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Nl(e)):jl(e);break;default:jl(e)}}function Nl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];nl=r,Pl(r,e)}q(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Uc(8,t,t.return),Nl(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Nl(t));break;default:Nl(t)}e=e.sibling}}function Pl(e,t){for(;nl!==null;){var n=nl;switch(n.tag){case 0:case 11:case 15:Uc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:_a(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,nl=r;else a:for(n=e;nl!==null;){r=nl;var i=r.sibling,a=r.return;if(al(r),r===n){nl=null;break a}if(i!==null){i.return=a,nl=i;break a}nl=a}}}var Fl={getCacheForType:function(e){var t=la(ha),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return la(ha).controller.signal}},Il=typeof WeakMap==`function`?WeakMap:Map,J=0,Ll=null,Y=null,Rl=0,zl=0,Bl=null,Vl=!1,Hl=!1,Ul=!1,Wl=0,Gl=0,Kl=0,ql=0,Jl=0,X=0,Yl=0,Xl=null,Zl=null,Ql=!1,$l=0,eu=0,tu=1/0,nu=null,ru=null,iu=0,au=null,ou=null,su=0,cu=0,lu=null,uu=null,du=0,Z=null;function fu(){return J&2&&Rl!==0?Rl&-Rl:D.T===null?ft():ud()}function pu(){if(X===0)if(!(Rl&536870912)||j){var e=Ze;Ze<<=1,!(Ze&3932160)&&(Ze=262144),X=e}else X=536870912;return e=fo.current,e!==null&&(e.flags|=32),X}function mu(e,t,n){(e===Ll&&(zl===2||zl===9)||e.cancelPendingCommit!==null)&&(xu(e,0),vu(e,Rl,X,!1)),at(e,n),(!(J&2)||e!==Ll)&&(e===Ll&&(!(J&2)&&(ql|=n),Gl===4&&vu(e,Rl,X,!1)),nd(e))}function hu(e,t,n){if(J&6)throw Error(i(327));var r=!n&&(t&127)==0&&(t&e.expiredLanes)===0||tt(e,t),a=r?ku(e,t):Du(e,t,!0),o=r;do{if(a===0){Hl&&!r&&vu(e,t,0,!1);break}else{if(n=e.current.alternate,o&&!_u(n)){a=Du(e,t,!1),o=!1;continue}if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=Xl;var l=c.current.memoizedState.isDehydrated;if(l&&(xu(c,s).flags|=256),s=Du(c,s,!1),s!==2){if(Ul&&!l){c.errorRecoveryDisabledLanes|=o,ql|=o,a=4;break a}o=Zl,Zl=a,o!==null&&(Zl===null?Zl=o:Zl.push.apply(Zl,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){xu(e,0),vu(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t)break;case 6:vu(r,t,X,!Vl);break a;case 2:Zl=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=$l+300-Pe(),10<a)){if(vu(r,t,X,!Vl),et(r,0,!0)!==0)break a;su=t,r.timeoutHandle=qd(gu.bind(null,r,n,Zl,nu,Ql,t,X,ql,Yl,Vl,o,`Throttled`,-0,0),a);break a}gu(r,n,Zl,nu,Ql,t,X,ql,Yl,Vl,o,null,-0,0)}}break}while(1);nd(e)}function gu(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)==16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ln},Al(t,a,d);var m=(a&62914560)===a?$l-Pe():(a&4194048)===a?eu-Pe():0;if(m=qf(d,m),m!==null){su=a,e.cancelPendingCommit=m(Iu.bind(null,e,t,a,n,r,i,o,s,c,u,d,null,f,p)),vu(e,a,o,!l);return}}Iu(e,t,a,n,r,i,o,s,c)}function _u(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Ar(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function vu(e,t,n,r){t&=~Jl,t&=~ql,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-Ke(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&st(e,n,t)}function yu(){return J&6?!0:(rd(0,!1),!1)}function bu(){if(Y!==null){if(zl===0)var e=Y.return;else e=Y,ta=ea=null,zo(e),Ba=null,Va=0,e=Y;for(;e!==null;)Vc(e.alternate,e),e=e.return;Y=null}}function xu(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,Jd(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),su=0,bu(),Ll=e,Y=n=vi(e.current,null),Rl=t,zl=0,Bl=null,Vl=!1,Hl=tt(e,t),Ul=!1,Yl=X=Jl=ql=Kl=Gl=0,Zl=Xl=null,Ql=!1,t&8&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var i=31-Ke(r),a=1<<i;t|=e[i],r&=~a}return Wl=t,ci(),n}function Su(e,t){M=null,D.H=Ks,t===Aa||t===Ma?(t=Ra(),zl=3):t===ja?(t=Ra(),zl=4):zl=t===uc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,Bl=t,Y===null&&(Gl=1,ic(e,Ei(t,e.current)))}function Cu(){var e=fo.current;return e===null?!0:(Rl&4194048)===Rl?po===null:(Rl&62914560)===Rl||Rl&536870912?e===po:!1}function wu(){var e=D.H;return D.H=Ks,e===null?Ks:e}function Tu(){var e=D.A;return D.A=Fl,e}function Eu(){Gl=4,Vl||(Rl&4194048)!==Rl&&fo.current!==null||(Hl=!0),!(Kl&134217727)&&!(ql&134217727)||Ll===null||vu(Ll,Rl,X,!1)}function Du(e,t,n){var r=J;J|=2;var i=wu(),a=Tu();(Ll!==e||Rl!==t)&&(nu=null,xu(e,t)),t=!1;var o=Gl;a:do try{if(zl!==0&&Y!==null){var s=Y,c=Bl;switch(zl){case 8:bu(),o=6;break a;case 3:case 2:case 9:case 6:fo.current===null&&(t=!0);var l=zl;if(zl=0,Bl=null,Nu(e,s,c,l),n&&Hl){o=0;break a}break;default:l=zl,zl=0,Bl=null,Nu(e,s,c,l)}}Ou(),o=Gl;break}catch(t){Su(e,t)}while(1);return t&&e.shellSuspendCounter++,ta=ea=null,J=r,D.H=i,D.A=a,Y===null&&(Ll=null,Rl=0,ci()),o}function Ou(){for(;Y!==null;)ju(Y)}function ku(e,t){var n=J;J|=2;var r=wu(),a=Tu();Ll!==e||Rl!==t?(nu=null,tu=Pe()+500,xu(e,t)):Hl=tt(e,t);a:do try{if(zl!==0&&Y!==null){t=Y;var o=Bl;b:switch(zl){case 1:zl=0,Bl=null,Nu(e,t,o,1);break;case 2:case 9:if(Pa(o)){zl=0,Bl=null,Mu(t);break}t=function(){zl!==2&&zl!==9||Ll!==e||(zl=7),nd(e)},o.then(t,t);break a;case 3:zl=7;break a;case 4:zl=5;break a;case 7:Pa(o)?(zl=0,Bl=null,Mu(t)):(zl=0,Bl=null,Nu(e,t,o,7));break;case 5:var s=null;switch(Y.tag){case 26:s=Y.memoizedState;case 5:case 27:var c=Y;if(s?Wf(s):c.stateNode.complete){zl=0,Bl=null;var l=c.sibling;if(l!==null)Y=l;else{var u=c.return;u===null?Y=null:(Y=u,Pu(u))}break b}}zl=0,Bl=null,Nu(e,t,o,5);break;case 6:zl=0,Bl=null,Nu(e,t,o,6);break;case 8:bu(),Gl=6;break a;default:throw Error(i(462))}}Au();break}catch(t){Su(e,t)}while(1);return ta=ea=null,D.H=r,D.A=a,J=n,Y===null?(Ll=null,Rl=0,ci(),Gl):0}function Au(){for(;Y!==null&&!Me();)ju(Y)}function ju(e){var t=R(e.alternate,e,Wl);e.memoizedProps=e.pendingProps,t===null?Pu(e):Y=t}function Mu(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Cc(n,t,t.pendingProps,t.type,void 0,Rl);break;case 11:t=Cc(n,t,t.pendingProps,t.type.render,t.ref,Rl);break;case 5:zo(t);default:Vc(n,t),t=Y=yi(t,Wl),t=R(n,t,Wl)}e.memoizedProps=e.pendingProps,t===null?Pu(e):Y=t}function Nu(e,t,n,r){ta=ea=null,zo(t),Ba=null,Va=0;var i=t.return;try{if(lc(e,i,t,n,Rl)){Gl=1,ic(e,Ei(n,e.current)),Y=null;return}}catch(t){if(i!==null)throw Y=i,t;Gl=1,ic(e,Ei(n,e.current)),Y=null;return}t.flags&32768?(j||r===1?e=!0:Hl||Rl&536870912?e=!1:(Vl=e=!0,(r===2||r===9||r===3||r===6)&&(r=fo.current,r!==null&&r.tag===13&&(r.flags|=16384))),Fu(t,e)):Pu(t)}function Pu(e){var t=e;do{if(t.flags&32768){Fu(t,Vl);return}e=t.return;var n=Bc(t.alternate,t,Wl);if(n!==null){Y=n;return}if(t=t.sibling,t!==null){Y=t;return}Y=t=e}while(t!==null);Gl===0&&(Gl=5)}function Fu(e,t){do{var n=U(e.alternate,e);if(n!==null){n.flags&=32767,Y=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){Y=e;return}Y=e=n}while(e!==null);Gl=6,Y=null}function Iu(e,t,n,r,a,o,s,c,l){e.cancelPendingCommit=null;do Vu();while(iu!==0);if(J&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));if(o=t.lanes|t.childLanes,o|=si,ot(e,n,o,s,c,l),e===Ll&&(Y=Ll=null,Rl=0),ou=t,au=e,su=n,cu=o,lu=a,uu=r,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,Yu(Re,function(){return Q(),null})):(e.callbackNode=null,e.callbackPriority=0),r=(t.flags&13878)!=0,t.subtreeFlags&13878||r){r=D.T,D.T=null,a=le.p,le.p=2,s=J,J|=4;try{rl(e,t,n)}finally{J=s,le.p=a,D.T=r}}iu=1,Lu(),Ru(),zu()}}function Lu(){if(iu===1){iu=0;var e=au,t=ou,n=(t.flags&13878)!=0;if(t.subtreeFlags&13878||n){n=D.T,D.T=null;var r=le.p;le.p=2;var i=J;J|=4;try{gl(t,e);var a=Bd,o=Fr(e.containerInfo),s=a.focusedElem,c=a.selectionRange;if(o!==s&&s&&s.ownerDocument&&Pr(s.ownerDocument.documentElement,s)){if(c!==null&&Ir(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Nr(s,h),v=Nr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}sp=!!zd,Bd=zd=null}finally{J=i,le.p=r,D.T=n}}e.current=t,iu=2}}function Ru(){if(iu===2){iu=0;var e=au,t=ou,n=(t.flags&8772)!=0;if(t.subtreeFlags&8772||n){n=D.T,D.T=null;var r=le.p;le.p=2;var i=J;J|=4;try{il(e,t.alternate,t)}finally{J=i,le.p=r,D.T=n}}iu=3}}function zu(){if(iu===4||iu===3){iu=0,Ne();var e=au,t=ou,n=su,r=uu;t.subtreeFlags&10256||t.flags&10256?iu=5:(iu=0,ou=au=null,Bu(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(ru=null),dt(n),t=t.stateNode,We&&typeof We.onCommitFiberRoot==`function`)try{We.onCommitFiberRoot(Ue,t,void 0,(t.current.flags&128)==128)}catch{}if(r!==null){t=D.T,i=le.p,le.p=2,D.T=null;try{for(var a=e.onRecoverableError,o=0;o<r.length;o++){var s=r[o];a(s.value,{componentStack:s.stack})}}finally{D.T=t,le.p=i}}su&3&&Vu(),nd(e),i=e.pendingLanes,n&261930&&i&42?e===Z?du++:(du=0,Z=e):du=0,rd(0,!1)}}function Bu(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,_a(t)))}function Vu(){return Lu(),Ru(),zu(),Q()}function Q(){if(iu!==5)return!1;var e=au,t=cu;cu=0;var n=dt(su),r=D.T,a=le.p;try{le.p=32>n?32:n,D.T=null,n=lu,lu=null;var o=au,s=su;if(iu=0,ou=au=null,su=0,J&6)throw Error(i(331));var c=J;if(J|=4,Ml(o.current),Tl(o,o.current,s,n),J=c,rd(0,!1),We&&typeof We.onPostCommitFiberRoot==`function`)try{We.onPostCommitFiberRoot(Ue,o)}catch{}return!0}finally{le.p=a,D.T=r,Bu(e,t)}}function Hu(e,t,n){t=Ei(n,t),t=oc(e.stateNode,t,2),e=Qa(e,t,2),e!==null&&(at(e,2),nd(e))}function Uu(e,t,n){if(e.tag===3)Hu(e,e,n);else for(;t!==null;){if(t.tag===3){Hu(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(ru===null||!ru.has(r))){e=Ei(n,e),n=sc(2),r=Qa(t,n,2),r!==null&&(cc(n,r,t,e),at(r,2),nd(r));break}}t=t.return}}function Wu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Il;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(Ul=!0,i.add(n),e=Gu.bind(null,e,t,n),t.then(e,e))}function Gu(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,Ll===e&&(Rl&n)===n&&(Gl===4||Gl===3&&(Rl&62914560)===Rl&&300>Pe()-$l?!(J&2)&&xu(e,0):Jl|=n,Yl===Rl&&(Yl=0)),nd(e)}function Ku(e,t){t===0&&(t=rt()),e=di(e,t),e!==null&&(at(e,t),nd(e))}function qu(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Ku(e,n)}function Ju(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),Ku(e,n)}function Yu(e,t){return Ae(e,t)}var Xu=null,Zu=null,Qu=!1,$u=!1,ed=!1,td=0;function nd(e){e!==Zu&&e.next===null&&(Zu===null?Xu=Zu=e:Zu=Zu.next=e),$u=!0,Qu||(Qu=!0,ld())}function rd(e,t){if(!ed&&$u){ed=!0;do for(var n=!1,r=Xu;r!==null;){if(!t)if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-Ke(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,cd(r,a))}else a=Rl,a=et(r,r===Ll?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||tt(r,a)||(n=!0,cd(r,a));r=r.next}while(n);ed=!1}}function id(){ad()}function ad(){$u=Qu=!1;var e=0;td!==0&&Kd()&&(e=td);for(var t=Pe(),n=null,r=Xu;r!==null;){var i=r.next,a=od(r,t);a===0?(r.next=null,n===null?Xu=i:n.next=i,i===null&&(Zu=n)):(n=r,(e!==0||a&3)&&($u=!0)),r=i}iu!==0&&iu!==5||rd(e,!1),td!==0&&(td=0)}function od(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-Ke(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=nt(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=Ll,n=Rl,n=et(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(zl===2||zl===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&je(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||tt(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&je(r),dt(n)){case 2:case 8:n=Le;break;case 32:n=Re;break;case 268435456:n=Be;break;default:n=Re}return r=sd.bind(null,e),n=Ae(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&je(r),e.callbackPriority=2,e.callbackNode=null,2}function sd(e,t){if(iu!==0&&iu!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Vu()&&e.callbackNode!==n)return null;var r=Rl;return r=et(e,e===Ll?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(hu(e,r,t),od(e,Pe()),e.callbackNode!=null&&e.callbackNode===n?sd.bind(null,e):null)}function cd(e,t){if(Vu())return null;hu(e,t,!0)}function ld(){Yd(function(){J&6?Ae(Ie,id):ad()})}function ud(){if(td===0){var e=ba;e===0&&(e=Xe,Xe<<=1,!(Xe&261888)&&(Xe=256)),td=e}return td}function dd(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:cn(``+e)}function fd(e,t){var n=t.ownerDocument.createElement(`input`);return n.name=t.name,n.value=t.value,e.id&&n.setAttribute(`form`,e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function pd(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=dd((i[gt]||null).action),o=r.submitter;o&&(t=(t=o[gt]||null)?dd(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new kn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(td!==0){var e=o?fd(i,o):new FormData(i);Ns(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=o?fd(i,o):new FormData(i),Ns(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var md=0;md<ni.length;md++){var hd=ni[md];ri(hd.toLowerCase(),`on`+(hd[0].toUpperCase()+hd.slice(1)))}ri(Jr,`onAnimationEnd`),ri(Yr,`onAnimationIteration`),ri(Xr,`onAnimationStart`),ri(`dblclick`,`onDoubleClick`),ri(`focusin`,`onFocus`),ri(`focusout`,`onBlur`),ri(Zr,`onTransitionRun`),ri(Qr,`onTransitionStart`),ri($r,`onTransitionCancel`),ri(ei,`onTransitionEnd`),Mt(`onMouseEnter`,[`mouseout`,`mouseover`]),Mt(`onMouseLeave`,[`mouseout`,`mouseover`]),Mt(`onPointerEnter`,[`pointerout`,`pointerover`]),Mt(`onPointerLeave`,[`pointerout`,`pointerover`]),jt(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),jt(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),jt(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),jt(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),jt(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),jt(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var gd=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),_d=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(gd));function vd(e,t){t=(t&4)!=0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ii(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ii(e)}i.currentTarget=null,a=c}}}}function yd(e,t){var n=t[vt];n===void 0&&(n=t[vt]=new Set);var r=e+`__bubble`;n.has(r)||(Cd(t,e,2,!1),n.add(r))}function bd(e,t,n){var r=0;t&&(r|=4),Cd(n,e,r,t)}var xd=`_reactListening`+Math.random().toString(36).slice(2);function Sd(e){if(!e[xd]){e[xd]=!0,kt.forEach(function(t){t!==`selectionchange`&&(_d.has(t)||bd(t,!1,e),bd(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[xd]||(t[xd]=!0,bd(`selectionchange`,!1,t))}}function Cd(e,t,n,r){switch(mp(t)){case 2:var i=cp;break;case 8:i=lp;break;default:i=up}n=i.bind(null,t,n,e),i=void 0,!vn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function wd(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=wt(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}hn(function(){var r=a,i=dn(n),s=[];a:{var c=ti.get(e);if(c!==void 0){var l=kn,u=e;switch(e){case`keypress`:if(wn(n)===0)break a;case`keydown`:case`keyup`:l=qn;break;case`focusin`:u=`focus`,l=Rn;break;case`focusout`:u=`blur`,l=Rn;break;case`beforeblur`:case`afterblur`:l=Rn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=In;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Ln;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=Yn;break;case Jr:case Yr:case Xr:l=zn;break;case ei:l=Xn;break;case`scroll`:case`scrollend`:l=jn;break;case`wheel`:l=Zn;break;case`copy`:case`cut`:case`paste`:l=Bn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=Jn;break;case`toggle`:case`beforetoggle`:l=Qn}var d=(t&4)!=0,f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=gn(m,p),g!=null&&d.push(Td(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(c=e===`mouseover`||e===`pointerover`,l=e===`mouseout`||e===`pointerout`,c&&n!==un&&(u=n.relatedTarget||n.fromElement)&&(wt(u)||u[_t]))break a;if((l||c)&&(c=i.window===i?i:(c=i.ownerDocument)?c.defaultView||c.parentWindow:window,l?(u=n.relatedTarget||n.toElement,l=r,u=u?wt(u):null,u!==null&&(f=o(u),d=u.tag,u!==f||d!==5&&d!==27&&d!==6)&&(u=null)):(l=null,u=r),l!==u)){if(d=In,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=Jn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=l==null?c:Et(l),h=u==null?c:Et(u),c=new d(g,m+`leave`,l,n,i),c.target=f,c.relatedTarget=h,g=null,wt(i)===r&&(d=new d(p,m+`enter`,u,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,l&&u)b:{for(d=Dd,p=l,m=u,h=0,g=p;g;g=d(g))h++;g=0;for(var _=m;_;_=d(_))g++;for(;0<h-g;)p=d(p),h--;for(;0<g-h;)m=d(m),g--;for(;h--;){if(p===m||m!==null&&p===m.alternate){d=p;break b}p=d(p),m=d(m)}d=null}else d=null;l!==null&&Od(s,c,l,d,!1),u!==null&&f!==null&&Od(s,f,u,d,!0)}}a:{if(c=r?Et(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var v=vr;else if(fr(c))if(yr)v=Or;else{v=Er;var y=Tr}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&an(r.elementType)&&(v=vr):v=Dr;if(v&&=v(e,r)){pr(s,v,n,i);break a}y&&y(e,c,r),e===`focusout`&&r&&c.type===`number`&&r.memoizedProps.value!=null&&Xt(c,`number`,c.value)}switch(y=r?Et(r):window,e){case`focusin`:(fr(y)||y.contentEditable===`true`)&&(Rr=y,zr=r,Br=null);break;case`focusout`:Br=zr=Rr=null;break;case`mousedown`:Vr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Vr=!1,Hr(s,n,i);break;case`selectionchange`:if(Lr)break;case`keydown`:case`keyup`:Hr(s,n,i)}var b;if(er)b:{switch(e){case`compositionstart`:var x=`onCompositionStart`;break b;case`compositionend`:x=`onCompositionEnd`;break b;case`compositionupdate`:x=`onCompositionUpdate`;break b}x=void 0}else cr?or(e,n)&&(x=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(x=`onCompositionStart`);x&&(rr&&n.locale!==`ko`&&(cr||x!==`onCompositionStart`?x===`onCompositionEnd`&&cr&&(b=Cn()):(bn=i,xn=`value`in bn?bn.value:bn.textContent,cr=!0)),y=Ed(r,x),0<y.length&&(x=new Vn(x,e,null,n,i),s.push({event:x,listeners:y}),b?x.data=b:(b=sr(n),b!==null&&(x.data=b)))),(b=nr?lr(e,n):ur(e,n))&&(x=Ed(r,`onBeforeInput`),0<x.length&&(y=new Vn(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:y,listeners:x}),y.data=b)),pd(s,e,r,n,i)}vd(s,t)})}function Td(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ed(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=gn(e,n),i!=null&&r.unshift(Td(e,i,a)),i=gn(e,t),i!=null&&r.push(Td(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Dd(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Od(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=gn(n,a),l!=null&&o.unshift(Td(n,l,c))):i||(l=gn(n,a),l!=null&&o.push(Td(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var kd=/\r\n?/g,Ad=/\u0000|\uFFFD/g;function jd(e){return(typeof e==`string`?e:``+e).replace(kd,`
`).replace(Ad,``)}function Md(e,t){return t=jd(t),jd(e)===t}function Nd(e,t,n,r,a,o){switch(n){case`children`:typeof r==`string`?t===`body`||t===`textarea`&&r===``||en(e,r):(typeof r==`number`||typeof r==`bigint`)&&t!==`body`&&en(e,``+r);break;case`className`:Rt(e,`class`,r);break;case`tabIndex`:Rt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:Rt(e,n,r);break;case`style`:rn(e,r,o);break;case`data`:if(t!==`object`){Rt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=cn(``+r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}else typeof o==`function`&&(n===`formAction`?(t!==`input`&&Nd(e,t,`name`,a.name,a,null),Nd(e,t,`formEncType`,a.formEncType,a,null),Nd(e,t,`formMethod`,a.formMethod,a,null),Nd(e,t,`formTarget`,a.formTarget,a,null)):(Nd(e,t,`encType`,a.encType,a,null),Nd(e,t,`method`,a.method,a,null),Nd(e,t,`target`,a.target,a,null)));if(r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=cn(``+r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=ln);break;case`onScroll`:r!=null&&yd(`scroll`,e);break;case`onScrollEnd`:r!=null&&yd(`scrollend`,e);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=cn(``+r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``+r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:yd(`beforetoggle`,e),yd(`toggle`,e),Lt(e,`popover`,r);break;case`xlinkActuate`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:zt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:zt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:zt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:zt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:Lt(e,`is`,r);break;case`innerText`:case`textContent`:break;default:(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)&&(n=on.get(n)||n,Lt(e,n,r))}}function Pd(e,t,n,r,a,o){switch(n){case`style`:rn(e,r,o);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`children`:typeof r==`string`?en(e,r):(typeof r==`number`||typeof r==`bigint`)&&en(e,``+r);break;case`onScroll`:r!=null&&yd(`scroll`,e);break;case`onScrollEnd`:r!=null&&yd(`scrollend`,e);break;case`onClick`:r!=null&&(e.onclick=ln);break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:break;case`innerText`:case`textContent`:break;default:if(!At.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),t=n.slice(2,a?n.length-7:void 0),o=e[gt]||null,o=o==null?null:o[n],typeof o==`function`&&e.removeEventListener(t,o,a),typeof r==`function`)){typeof o!=`function`&&o!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,a);break a}n in e?e[n]=r:!0===r?e.setAttribute(n,``):Lt(e,n,r)}}}function Fd(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:yd(`error`,e),yd(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:Nd(e,t,o,s,n,null)}}a&&Nd(e,t,`srcSet`,n.srcSet,n,null),r&&Nd(e,t,`src`,n.src,n,null);return;case`input`:yd(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:Nd(e,t,r,d,n,null)}}Yt(e,o,c,l,u,s,a,!1);return;case`select`:for(a in yd(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:Nd(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&Zt(e,!!r,n,!0):Zt(e,!!r,t,!1);return;case`textarea`:for(s in yd(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:Nd(e,t,s,c,n,null)}$t(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:Nd(e,t,l,r,n,null)}return;case`dialog`:yd(`beforetoggle`,e),yd(`toggle`,e),yd(`cancel`,e),yd(`close`,e);break;case`iframe`:case`object`:yd(`load`,e);break;case`video`:case`audio`:for(r=0;r<gd.length;r++)yd(gd[r],e);break;case`image`:yd(`error`,e),yd(`load`,e);break;case`details`:yd(`toggle`,e);break;case`embed`:case`source`:case`link`:yd(`error`,e),yd(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:Nd(e,t,u,r,n,null)}return;default:if(an(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&Pd(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&Nd(e,t,c,r,n,null))}function Id(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||Nd(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:o=m;break;case`name`:a=m;break;case`checked`:u=m;break;case`defaultChecked`:d=m;break;case`value`:s=m;break;case`defaultValue`:c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&Nd(e,t,p,m,r,f)}}Jt(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||Nd(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:p=o;break;case`defaultValue`:c=o;break;case`multiple`:s=o;default:o!==l&&Nd(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?Zt(e,!!n,n?[]:``,!1):Zt(e,!!n,t,!0)):Zt(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:Nd(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:p=a;break;case`defaultValue`:m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&Nd(e,t,s,a,r,o)}Qt(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:Nd(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:Nd(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&Nd(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:Nd(e,t,u,p,r,m)}return;default:if(an(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&Pd(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||Pd(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&Nd(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||Nd(e,t,f,p,r,m)}function Ld(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function Rd(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&Ld(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&Ld(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var zd=null,Bd=null;function Vd(e){return e.nodeType===9?e:e.ownerDocument}function Hd(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function Ud(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function Wd(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Gd=null;function Kd(){var e=window.event;return e&&e.type===`popstate`?e===Gd?!1:(Gd=e,!0):(Gd=null,!1)}var qd=typeof setTimeout==`function`?setTimeout:void 0,Jd=typeof clearTimeout==`function`?clearTimeout:void 0,$=typeof Promise==`function`?Promise:void 0,Yd=typeof queueMicrotask==`function`?queueMicrotask:$===void 0?qd:function(e){return $.resolve(null).then(e).catch(Xd)};function Xd(e){setTimeout(function(){throw e})}function Zd(e){return e===`head`}function Qd(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Np(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)pf(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,pf(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[St]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&pf(e.ownerDocument.body);n=i}while(n);Np(t)}function $d(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8)if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++;n=r}while(n)}function ef(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:ef(n),Ct(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function tf(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r)if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e;else if(!e[St])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=cf(e.nextSibling),e===null)break}return null}function nf(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=cf(e.nextSibling),e===null))return null;return e}function rf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=cf(e.nextSibling),e===null))return null;return e}function af(e){return e.data===`$?`||e.data===`$~`}function of(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function sf(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function cf(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var lf=null;function uf(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return cf(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function df(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function ff(e,t,n){switch(t=Vd(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function pf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Ct(e)}var mf=new Map,hf=new Set;function gf(e){return typeof e.getRootNode==`function`?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var _f=le.d;le.d={f:vf,r:yf,D:Sf,C:Cf,L:wf,m:Tf,X:Df,S:Ef,M:Of};function vf(){var e=_f.f(),t=yu();return e||t}function yf(e){var t=Tt(e);t!==null&&t.tag===5&&t.type===`form`?Fs(t):_f.r(e)}var bf=typeof document>`u`?null:document;function xf(e,t,n){var r=bf;if(r&&typeof t==`string`&&t){var i=qt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),hf.has(i)||(hf.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),Fd(t,`link`,e),Ot(t),r.head.appendChild(t)))}}function Sf(e){_f.D(e),xf(`dns-prefetch`,e,null)}function Cf(e,t){_f.C(e,t),xf(`preconnect`,e,t)}function wf(e,t,n){_f.L(e,t,n);var r=bf;if(r&&e&&t){var i=`link[rel="preload"][as="`+qt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+qt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+qt(n.imageSizes)+`"]`)):i+=`[href="`+qt(e)+`"]`;var a=i;switch(t){case`style`:a=Af(e);break;case`script`:a=Pf(e)}mf.has(a)||(e=m({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),mf.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(jf(a))||t===`script`&&r.querySelector(Ff(a))||(t=r.createElement(`link`),Fd(t,`link`,e),Ot(t),r.head.appendChild(t)))}}function Tf(e,t){_f.m(e,t);var n=bf;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+qt(r)+`"][href="`+qt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Pf(e)}if(!mf.has(a)&&(e=m({rel:`modulepreload`,href:e},t),mf.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(Ff(a)))return}r=n.createElement(`link`),Fd(r,`link`,e),Ot(r),n.head.appendChild(r)}}}function Ef(e,t,n){_f.S(e,t,n);var r=bf;if(r&&e){var i=Dt(r).hoistableStyles,a=Af(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(jf(a)))s.loading=5;else{e=m({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=mf.get(a))&&Rf(e,n);var c=o=r.createElement(`link`);Ot(c),Fd(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Lf(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function Df(e,t){_f.X(e,t);var n=bf;if(n&&e){var r=Dt(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),Ot(a),Fd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Of(e,t){_f.M(e,t);var n=bf;if(n&&e){var r=Dt(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0,type:`module`},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),Ot(a),Fd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function kf(e,t,n,r){var a=(a=ve.current)?gf(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(t=Af(n.href),n=Dt(a).hoistableStyles,r=n.get(t),r||(r={type:`style`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Af(n.href);var o=Dt(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(jf(e)))&&!o._p&&(s.instance=o,s.state.loading=5),mf.has(e)||(n={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},mf.set(e,n),o||Nf(a,e,n,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(t=Pf(n),n=Dt(a).hoistableScripts,r=n.get(t),r||(r={type:`script`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Af(e){return`href="`+qt(e)+`"`}function jf(e){return`link[rel="stylesheet"][`+e+`]`}function Mf(e){return m({},e,{"data-precedence":e.precedence,precedence:null})}function Nf(e,t,n,r){e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)?r.loading=1:(t=e.createElement(`link`),r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2}),Fd(t,`link`,n),Ot(t),e.head.appendChild(t))}function Pf(e){return`[src="`+qt(e)+`"]`}function Ff(e){return`script[async]`+e}function If(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+qt(n.href)+`"]`);if(r)return t.instance=r,Ot(r),r;var a=m({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),Ot(r),Fd(r,`style`,a),Lf(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Af(n.href);var o=e.querySelector(jf(a));if(o)return t.state.loading|=4,t.instance=o,Ot(o),o;r=Mf(n),(a=mf.get(a))&&Rf(r,a),o=(e.ownerDocument||e).createElement(`link`),Ot(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),Fd(o,`link`,r),t.state.loading|=4,Lf(o,n.precedence,e),t.instance=o;case`script`:return o=Pf(n.src),(a=e.querySelector(Ff(o)))?(t.instance=a,Ot(a),a):(r=n,(a=mf.get(o))&&(r=m({},n),zf(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),Ot(a),Fd(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Lf(r,n.precedence,e));return t.instance}function Lf(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function zf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Bf=null;function Vf(e,t,n){if(Bf===null){var r=new Map,i=Bf=new Map;i.set(n,r)}else i=Bf,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[St]||a[ht]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Hf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function Uf(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Wf(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Gf(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Af(r.href),a=t.querySelector(jf(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=Jf.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,Ot(a);return}a=t.ownerDocument||t,r=Mf(r),(i=mf.get(i))&&Rf(r,i),a=a.createElement(`link`),Ot(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),Fd(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=Jf.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var Kf=0;function qf(e,t){return e.stylesheets&&e.count===0&&Xf(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&Kf===0&&(Kf=62500*Rd());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>Kf?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function Jf(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xf(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Yf=null;function Xf(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Yf=new Map,t.forEach(Zf,e),Yf=null,Jf.call(e))}function Zf(e,t){if(!(t.state.loading&4)){var n=Yf.get(e);if(n)var r=n.get(null);else{n=new Map,Yf.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=Jf.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Qf={$$typeof:C,Provider:null,Consumer:null,_currentValue:ue,_currentValue2:ue,_threadCount:0};function $f(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=it(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=it(0),this.hiddenUpdates=it(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function ep(e,t,n,r,i,a,o,s,c,l,u,d){return e=new $f(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=gi(3,null,null,t),e.current=a,a.stateNode=e,t=ga(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},Ya(a),e}function tp(e){return e?(e=mi,e):mi}function np(e,t,n,r,i,a){i=tp(i),r.context===null?r.context=i:r.pendingContext=i,r=Za(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=Qa(e,r,t),n!==null&&(mu(n,e,t),$a(n,e,t))}function rp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ip(e,t){rp(e,t),(e=e.alternate)&&rp(e,t)}function ap(e){if(e.tag===13||e.tag===31){var t=di(e,67108864);t!==null&&mu(t,e,67108864),ip(e,67108864)}}function op(e){if(e.tag===13||e.tag===31){var t=fu();t=ut(t);var n=di(e,t);n!==null&&mu(n,e,t),ip(e,t)}}var sp=!0;function cp(e,t,n,r){var i=D.T;D.T=null;var a=le.p;try{le.p=2,up(e,t,n,r)}finally{le.p=a,D.T=i}}function lp(e,t,n,r){var i=D.T;D.T=null;var a=le.p;try{le.p=8,up(e,t,n,r)}finally{le.p=a,D.T=i}}function up(e,t,n,r){if(sp){var i=dp(r);if(i===null)wd(e,t,r,fp,n),Cp(e,r);else if(Tp(i,e,t,n,r))r.stopPropagation();else if(Cp(e,r),t&4&&-1<Sp.indexOf(e)){for(;i!==null;){var a=Tt(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=$e(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-Ke(o);s.entanglements[1]|=c,o&=~c}nd(a),!(J&6)&&(tu=Pe()+500,rd(0,!1))}}break;case 31:case 13:s=di(a,2),s!==null&&mu(s,a,2),yu(),ip(a,2)}if(a=dp(r),a===null&&wd(e,t,r,fp,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else wd(e,t,r,null,n)}}function dp(e){return e=dn(e),pp(e)}var fp=null;function pp(e){if(fp=null,e=wt(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return fp=e,null}function mp(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Fe()){case Ie:return 2;case Le:return 8;case Re:case ze:return 32;case Be:return 268435456;default:return 32}default:return 32}}var hp=!1,gp=null,_p=null,vp=null,yp=new Map,bp=new Map,xp=[],Sp=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Cp(e,t){switch(e){case`focusin`:case`focusout`:gp=null;break;case`dragenter`:case`dragleave`:_p=null;break;case`mouseover`:case`mouseout`:vp=null;break;case`pointerover`:case`pointerout`:yp.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:bp.delete(t.pointerId)}}function wp(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=Tt(t),t!==null&&ap(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Tp(e,t,n,r,i){switch(t){case`focusin`:return gp=wp(gp,e,t,n,r,i),!0;case`dragenter`:return _p=wp(_p,e,t,n,r,i),!0;case`mouseover`:return vp=wp(vp,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return yp.set(a,wp(yp.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,bp.set(a,wp(bp.get(a)||null,e,t,n,r,i)),!0}return!1}function Ep(e){var t=wt(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,pt(e.priority,function(){op(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,pt(e.priority,function(){op(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Dp(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=dp(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);un=r,n.target.dispatchEvent(r),un=null}else return t=Tt(n),t!==null&&ap(t),e.blockedOn=n,!1;t.shift()}return!0}function Op(e,t,n){Dp(e)&&n.delete(t)}function kp(){hp=!1,gp!==null&&Dp(gp)&&(gp=null),_p!==null&&Dp(_p)&&(_p=null),vp!==null&&Dp(vp)&&(vp=null),yp.forEach(Op),bp.forEach(Op)}function Ap(e,n){e.blockedOn===n&&(e.blockedOn=null,hp||(hp=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,kp)))}var jp=null;function Mp(e){jp!==e&&(jp=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){jp===e&&(jp=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(pp(r||n)===null)continue;break}var a=Tt(n);a!==null&&(e.splice(t,3),t-=3,Ns(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Np(e){function t(t){return Ap(t,e)}gp!==null&&Ap(gp,e),_p!==null&&Ap(_p,e),vp!==null&&Ap(vp,e),yp.forEach(t),bp.forEach(t);for(var n=0;n<xp.length;n++){var r=xp[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<xp.length&&(n=xp[0],n.blockedOn===null);)Ep(n),n.blockedOn===null&&xp.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[gt]||null;if(typeof a==`function`)o||Mp(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[gt]||null)s=o.formAction;else if(pp(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Mp(n)}}}function Pp(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Fp(e){this._internalRoot=e}Ip.prototype.render=Fp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;np(n,fu(),e,t,null,null)},Ip.prototype.unmount=Fp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;np(e.current,2,null,e,null,null),yu(),t[_t]=null}};function Ip(e){this._internalRoot=e}Ip.prototype.unstable_scheduleHydration=function(e){if(e){var t=ft();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xp.length&&t!==0&&t<xp[n].priority;n++);xp.splice(n,0,e),n===0&&Ep(e)}};var Lp=n.version;if(Lp!==`19.2.6`)throw Error(i(527,Lp,`19.2.6`));le.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=u(t),e=e===null?null:f(e),e=e===null?null:e.stateNode,e};var Rp={bundleType:0,version:`19.2.6`,rendererPackageName:`react-dom`,currentDispatcherRef:D,reconcilerVersion:`19.2.6`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var zp=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!zp.isDisabled&&zp.supportsFiber)try{Ue=zp.inject(Rp),We=zp}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=tc,s=nc,c=rc;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=ep(e,1,!1,null,null,n,r,null,o,s,c,Pp),e[_t]=t.current,Sd(e),new Fp(t)}})),_=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=g()})),v=(...e)=>e.filter((e,t,n)=>!!e&&e.trim()!==``&&n.indexOf(e)===t).join(` `).trim(),y=e=>e.replace(/([a-z0-9])([A-Z])/g,`$1-$2`).toLowerCase(),b=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,n)=>n?n.toUpperCase():t.toLowerCase()),x=e=>{let t=b(e);return t.charAt(0).toUpperCase()+t.slice(1)},S={xmlns:`http://www.w3.org/2000/svg`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:2,strokeLinecap:`round`,strokeLinejoin:`round`},C=e=>{for(let t in e)if(t.startsWith(`aria-`)||t===`role`||t===`title`)return!0;return!1},w=l(d(),1),ee=(0,w.createContext)({}),T=()=>(0,w.useContext)(ee),te=(0,w.forwardRef)(({color:e,size:t,strokeWidth:n,absoluteStrokeWidth:r,className:i=``,children:a,iconNode:o,...s},c)=>{let{size:l=24,strokeWidth:u=2,absoluteStrokeWidth:d=!1,color:f=`currentColor`,className:p=``}=T()??{},m=r??d?Number(n??u)*24/Number(t??l):n??u;return(0,w.createElement)(`svg`,{ref:c,...S,width:t??l??S.width,height:t??l??S.height,stroke:e??f,strokeWidth:m,className:v(`lucide`,p,i),...!a&&!C(s)&&{"aria-hidden":`true`},...s},[...o.map(([e,t])=>(0,w.createElement)(e,t)),...Array.isArray(a)?a:[a]])}),E=(e,t)=>{let n=(0,w.forwardRef)(({className:n,...r},i)=>(0,w.createElement)(te,{ref:i,iconNode:t,className:v(`lucide-${y(x(e))}`,`lucide-${e}`,n),...r}));return n.displayName=x(e),n},ne=E(`arrow-left`,[[`path`,{d:`m12 19-7-7 7-7`,key:`1l729n`}],[`path`,{d:`M19 12H5`,key:`x3x0zl`}]]),re=E(`arrow-right`,[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`m12 5 7 7-7 7`,key:`xquz4c`}]]),ie=E(`book-open`,[[`path`,{d:`M12 5v16`,key:`1f6ucr`}],[`path`,{d:`M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z`,key:`1fyvmf`}]]),ae=E(`chevron-down`,[[`path`,{d:`m6 9 6 6 6-6`,key:`qrunsl`}]]),oe=E(`file-text`,[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,key:`1oefj6`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`,key:`wfsgrz`}],[`path`,{d:`M10 9H8`,key:`b1mrlr`}],[`path`,{d:`M16 13H8`,key:`t4e002`}],[`path`,{d:`M16 17H8`,key:`z1uh3a`}]]),se=E(`graduation-cap`,[[`path`,{d:`M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z`,key:`j76jl0`}],[`path`,{d:`M22 10v6`,key:`1lu8f3`}],[`path`,{d:`M6 12.5V16a6 3 0 0 0 12 0v-3.5`,key:`1r8lef`}]]),ce=E(`lightbulb`,[[`path`,{d:`M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5`,key:`1gvzjb`}],[`path`,{d:`M9 18h6`,key:`x1upvd`}],[`path`,{d:`M10 22h4`,key:`ceow96`}]]),D=E(`moon`,[[`path`,{d:`M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401`,key:`kfwtm`}]]),le=E(`search`,[[`path`,{d:`m21 21-4.34-4.34`,key:`14j7rj`}],[`circle`,{cx:`11`,cy:`11`,r:`8`,key:`4ej97u`}]]),ue=E(`sun`,[[`circle`,{cx:`12`,cy:`12`,r:`4`,key:`4exip2`}],[`path`,{d:`M12 2v2`,key:`tus03m`}],[`path`,{d:`M12 20v2`,key:`1lh1kg`}],[`path`,{d:`m4.93 4.93 1.41 1.41`,key:`149t6j`}],[`path`,{d:`m17.66 17.66 1.41 1.41`,key:`ptbguv`}],[`path`,{d:`M2 12h2`,key:`1t8f8n`}],[`path`,{d:`M20 12h2`,key:`1q8mjw`}],[`path`,{d:`m6.34 17.66-1.41 1.41`,key:`1m8zz5`}],[`path`,{d:`m19.07 4.93-1.41 1.41`,key:`1shlcs`}]]);function de(e){let t=[],n=String(e||``),r=n.indexOf(`,`),i=0,a=!1;for(;!a;){r===-1&&(r=n.length,a=!0);let e=n.slice(i,r).trim();(e||!a)&&t.push(e),i=r+1,r=n.indexOf(`,`,i)}return t}function fe(e,t){let n=t||{};return(e[e.length-1]===``?[...e,``]:e).join((n.padRight?` `:``)+`,`+(n.padLeft===!1?``:` `)).trim()}var pe=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,me=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,he={};function ge(e,t){return((t||he).jsx?me:pe).test(e)}var _e=/[ \t\n\f\r]/g;function ve(e){return typeof e==`object`?e.type===`text`?ye(e.value):!1:ye(e)}function ye(e){return e.replace(_e,``)===``}var be=class{constructor(e,t,n){this.normal=t,this.property=e,n&&(this.space=n)}};be.prototype.normal={},be.prototype.property={},be.prototype.space=void 0;function xe(e,t){let n={},r={};for(let t of e)Object.assign(n,t.property),Object.assign(r,t.normal);return new be(n,r,t)}function Se(e){return e.toLowerCase()}var Ce=class{constructor(e,t){this.attribute=t,this.property=e}};Ce.prototype.attribute=``,Ce.prototype.booleanish=!1,Ce.prototype.boolean=!1,Ce.prototype.commaOrSpaceSeparated=!1,Ce.prototype.commaSeparated=!1,Ce.prototype.defined=!1,Ce.prototype.mustUseProperty=!1,Ce.prototype.number=!1,Ce.prototype.overloadedBoolean=!1,Ce.prototype.property=``,Ce.prototype.spaceSeparated=!1,Ce.prototype.space=void 0;var we=s({boolean:()=>O,booleanish:()=>Ee,commaOrSpaceSeparated:()=>Ae,commaSeparated:()=>ke,number:()=>k,overloadedBoolean:()=>De,spaceSeparated:()=>Oe}),Te=0,O=je(),Ee=je(),De=je(),k=je(),Oe=je(),ke=je(),Ae=je();function je(){return 2**++Te}var Me=Object.keys(we),Ne=class extends Ce{constructor(e,t,n,r){let i=-1;if(super(e,t),Pe(this,`space`,r),typeof n==`number`)for(;++i<Me.length;){let e=Me[i];Pe(this,Me[i],(n&we[e])===we[e])}}};Ne.prototype.defined=!0;function Pe(e,t,n){n&&(e[t]=n)}function Fe(e){let t={},n={};for(let[r,i]of Object.entries(e.properties)){let a=new Ne(r,e.transform(e.attributes||{},r),i,e.space);e.mustUseProperty&&e.mustUseProperty.includes(r)&&(a.mustUseProperty=!0),t[r]=a,n[Se(r)]=r,n[Se(a.attribute)]=r}return new be(t,n,e.space)}var Ie=Fe({properties:{ariaActiveDescendant:null,ariaAtomic:Ee,ariaAutoComplete:null,ariaBusy:Ee,ariaChecked:Ee,ariaColCount:k,ariaColIndex:k,ariaColSpan:k,ariaControls:Oe,ariaCurrent:null,ariaDescribedBy:Oe,ariaDetails:null,ariaDisabled:Ee,ariaDropEffect:Oe,ariaErrorMessage:null,ariaExpanded:Ee,ariaFlowTo:Oe,ariaGrabbed:Ee,ariaHasPopup:null,ariaHidden:Ee,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:Oe,ariaLevel:k,ariaLive:null,ariaModal:Ee,ariaMultiLine:Ee,ariaMultiSelectable:Ee,ariaOrientation:null,ariaOwns:Oe,ariaPlaceholder:null,ariaPosInSet:k,ariaPressed:Ee,ariaReadOnly:Ee,ariaRelevant:null,ariaRequired:Ee,ariaRoleDescription:Oe,ariaRowCount:k,ariaRowIndex:k,ariaRowSpan:k,ariaSelected:Ee,ariaSetSize:k,ariaSort:null,ariaValueMax:k,ariaValueMin:k,ariaValueNow:k,ariaValueText:null,role:null},transform(e,t){return t===`role`?t:`aria-`+t.slice(4).toLowerCase()}});function Le(e,t){return t in e?e[t]:t}function Re(e,t){return Le(e,t.toLowerCase())}var ze=Fe({attributes:{acceptcharset:`accept-charset`,classname:`class`,htmlfor:`for`,httpequiv:`http-equiv`},mustUseProperty:[`checked`,`multiple`,`muted`,`selected`],properties:{abbr:null,accept:ke,acceptCharset:Oe,accessKey:Oe,action:null,allow:null,allowFullScreen:O,allowPaymentRequest:O,allowUserMedia:O,alpha:O,alt:null,as:null,async:O,autoCapitalize:null,autoComplete:Oe,autoFocus:O,autoPlay:O,blocking:Oe,capture:null,charSet:null,checked:O,cite:null,className:Oe,closedBy:null,colorSpace:null,cols:k,colSpan:k,command:null,commandFor:null,content:null,contentEditable:Ee,controls:O,controlsList:Oe,coords:k|ke,crossOrigin:null,data:null,dateTime:null,decoding:null,default:O,defer:O,dir:null,dirName:null,disabled:O,download:De,draggable:Ee,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:O,formTarget:null,headers:Oe,height:k,hidden:De,high:k,href:null,hrefLang:null,htmlFor:Oe,httpEquiv:Oe,id:null,imageSizes:null,imageSrcSet:null,inert:O,inputMode:null,integrity:null,is:null,isMap:O,itemId:null,itemProp:Oe,itemRef:Oe,itemScope:O,itemType:Oe,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:O,low:k,manifest:null,max:null,maxLength:k,media:null,method:null,min:null,minLength:k,multiple:O,muted:O,name:null,nonce:null,noModule:O,noValidate:O,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:O,optimum:k,pattern:null,ping:Oe,placeholder:null,playsInline:O,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:O,referrerPolicy:null,rel:Oe,required:O,reversed:O,rows:k,rowSpan:k,sandbox:Oe,scope:null,scoped:O,seamless:O,selected:O,shadowRootClonable:O,shadowRootCustomElementRegistry:O,shadowRootDelegatesFocus:O,shadowRootMode:null,shadowRootSerializable:O,shape:null,size:k,sizes:null,slot:null,span:k,spellCheck:Ee,src:null,srcDoc:null,srcLang:null,srcSet:null,start:k,step:null,style:null,tabIndex:k,target:null,title:null,translate:null,type:null,typeMustMatch:O,useMap:null,value:Ee,width:k,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:Oe,axis:null,background:null,bgColor:null,border:k,borderColor:null,bottomMargin:k,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:O,declare:O,event:null,face:null,frame:null,frameBorder:null,hSpace:k,leftMargin:k,link:null,longDesc:null,lowSrc:null,marginHeight:k,marginWidth:k,noResize:O,noHref:O,noShade:O,noWrap:O,object:null,profile:null,prompt:null,rev:null,rightMargin:k,rules:null,scheme:null,scrolling:Ee,standby:null,summary:null,text:null,topMargin:k,valueType:null,version:null,vAlign:null,vLink:null,vSpace:k,allowTransparency:null,autoCorrect:null,autoSave:null,credentialless:O,disablePictureInPicture:O,disableRemotePlayback:O,exportParts:ke,part:Oe,prefix:null,property:null,results:k,security:null,unselectable:null},space:`html`,transform:Re}),Be=Fe({attributes:{accentHeight:`accent-height`,alignmentBaseline:`alignment-baseline`,arabicForm:`arabic-form`,baselineShift:`baseline-shift`,capHeight:`cap-height`,className:`class`,clipPath:`clip-path`,clipRule:`clip-rule`,colorInterpolation:`color-interpolation`,colorInterpolationFilters:`color-interpolation-filters`,colorProfile:`color-profile`,colorRendering:`color-rendering`,crossOrigin:`crossorigin`,dataType:`datatype`,dominantBaseline:`dominant-baseline`,enableBackground:`enable-background`,fillOpacity:`fill-opacity`,fillRule:`fill-rule`,floodColor:`flood-color`,floodOpacity:`flood-opacity`,fontFamily:`font-family`,fontSize:`font-size`,fontSizeAdjust:`font-size-adjust`,fontStretch:`font-stretch`,fontStyle:`font-style`,fontVariant:`font-variant`,fontWeight:`font-weight`,glyphName:`glyph-name`,glyphOrientationHorizontal:`glyph-orientation-horizontal`,glyphOrientationVertical:`glyph-orientation-vertical`,hrefLang:`hreflang`,horizAdvX:`horiz-adv-x`,horizOriginX:`horiz-origin-x`,horizOriginY:`horiz-origin-y`,imageRendering:`image-rendering`,letterSpacing:`letter-spacing`,lightingColor:`lighting-color`,markerEnd:`marker-end`,markerMid:`marker-mid`,markerStart:`marker-start`,maskType:`mask-type`,navDown:`nav-down`,navDownLeft:`nav-down-left`,navDownRight:`nav-down-right`,navLeft:`nav-left`,navNext:`nav-next`,navPrev:`nav-prev`,navRight:`nav-right`,navUp:`nav-up`,navUpLeft:`nav-up-left`,navUpRight:`nav-up-right`,onAbort:`onabort`,onActivate:`onactivate`,onAfterPrint:`onafterprint`,onBeforePrint:`onbeforeprint`,onBegin:`onbegin`,onCancel:`oncancel`,onCanPlay:`oncanplay`,onCanPlayThrough:`oncanplaythrough`,onChange:`onchange`,onClick:`onclick`,onClose:`onclose`,onCopy:`oncopy`,onCueChange:`oncuechange`,onCut:`oncut`,onDblClick:`ondblclick`,onDrag:`ondrag`,onDragEnd:`ondragend`,onDragEnter:`ondragenter`,onDragExit:`ondragexit`,onDragLeave:`ondragleave`,onDragOver:`ondragover`,onDragStart:`ondragstart`,onDrop:`ondrop`,onDurationChange:`ondurationchange`,onEmptied:`onemptied`,onEnd:`onend`,onEnded:`onended`,onError:`onerror`,onFocus:`onfocus`,onFocusIn:`onfocusin`,onFocusOut:`onfocusout`,onHashChange:`onhashchange`,onInput:`oninput`,onInvalid:`oninvalid`,onKeyDown:`onkeydown`,onKeyPress:`onkeypress`,onKeyUp:`onkeyup`,onLoad:`onload`,onLoadedData:`onloadeddata`,onLoadedMetadata:`onloadedmetadata`,onLoadStart:`onloadstart`,onMessage:`onmessage`,onMouseDown:`onmousedown`,onMouseEnter:`onmouseenter`,onMouseLeave:`onmouseleave`,onMouseMove:`onmousemove`,onMouseOut:`onmouseout`,onMouseOver:`onmouseover`,onMouseUp:`onmouseup`,onMouseWheel:`onmousewheel`,onOffline:`onoffline`,onOnline:`ononline`,onPageHide:`onpagehide`,onPageShow:`onpageshow`,onPaste:`onpaste`,onPause:`onpause`,onPlay:`onplay`,onPlaying:`onplaying`,onPopState:`onpopstate`,onProgress:`onprogress`,onRateChange:`onratechange`,onRepeat:`onrepeat`,onReset:`onreset`,onResize:`onresize`,onScroll:`onscroll`,onSeeked:`onseeked`,onSeeking:`onseeking`,onSelect:`onselect`,onShow:`onshow`,onStalled:`onstalled`,onStorage:`onstorage`,onSubmit:`onsubmit`,onSuspend:`onsuspend`,onTimeUpdate:`ontimeupdate`,onToggle:`ontoggle`,onUnload:`onunload`,onVolumeChange:`onvolumechange`,onWaiting:`onwaiting`,onZoom:`onzoom`,overlinePosition:`overline-position`,overlineThickness:`overline-thickness`,paintOrder:`paint-order`,panose1:`panose-1`,pointerEvents:`pointer-events`,referrerPolicy:`referrerpolicy`,renderingIntent:`rendering-intent`,shapeRendering:`shape-rendering`,stopColor:`stop-color`,stopOpacity:`stop-opacity`,strikethroughPosition:`strikethrough-position`,strikethroughThickness:`strikethrough-thickness`,strokeDashArray:`stroke-dasharray`,strokeDashOffset:`stroke-dashoffset`,strokeLineCap:`stroke-linecap`,strokeLineJoin:`stroke-linejoin`,strokeMiterLimit:`stroke-miterlimit`,strokeOpacity:`stroke-opacity`,strokeWidth:`stroke-width`,tabIndex:`tabindex`,textAnchor:`text-anchor`,textDecoration:`text-decoration`,textRendering:`text-rendering`,transformOrigin:`transform-origin`,typeOf:`typeof`,underlinePosition:`underline-position`,underlineThickness:`underline-thickness`,unicodeBidi:`unicode-bidi`,unicodeRange:`unicode-range`,unitsPerEm:`units-per-em`,vAlphabetic:`v-alphabetic`,vHanging:`v-hanging`,vIdeographic:`v-ideographic`,vMathematical:`v-mathematical`,vectorEffect:`vector-effect`,vertAdvY:`vert-adv-y`,vertOriginX:`vert-origin-x`,vertOriginY:`vert-origin-y`,wordSpacing:`word-spacing`,writingMode:`writing-mode`,xHeight:`x-height`,playbackOrder:`playbackorder`,timelineBegin:`timelinebegin`},properties:{about:Ae,accentHeight:k,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:k,amplitude:k,arabicForm:null,ascent:k,attributeName:null,attributeType:null,azimuth:k,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:k,by:null,calcMode:null,capHeight:k,className:Oe,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:k,diffuseConstant:k,direction:null,display:null,dur:null,divisor:k,dominantBaseline:null,download:O,dx:null,dy:null,edgeMode:null,editable:null,elevation:k,enableBackground:null,end:null,event:null,exponent:k,externalResourcesRequired:null,fill:null,fillOpacity:k,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:ke,g2:ke,glyphName:ke,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:k,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:k,horizOriginX:k,horizOriginY:k,id:null,ideographic:k,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:k,k,k1:k,k2:k,k3:k,k4:k,kernelMatrix:Ae,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:k,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskType:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:k,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:k,overlineThickness:k,paintOrder:null,panose1:null,path:null,pathLength:k,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:Oe,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:k,pointsAtY:k,pointsAtZ:k,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:Ae,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:Ae,rev:Ae,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:Ae,requiredFeatures:Ae,requiredFonts:Ae,requiredFormats:Ae,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:k,specularExponent:k,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:k,strikethroughThickness:k,string:null,stroke:null,strokeDashArray:Ae,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:k,strokeOpacity:k,strokeWidth:null,style:null,surfaceScale:k,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:Ae,tabIndex:k,tableValues:null,target:null,targetX:k,targetY:k,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:Ae,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:k,underlineThickness:k,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:k,values:null,vAlphabetic:k,vMathematical:k,vectorEffect:null,vHanging:k,vIdeographic:k,version:null,vertAdvY:k,vertOriginX:k,vertOriginY:k,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:k,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:`svg`,transform:Le}),Ve=Fe({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:`xlink`,transform(e,t){return`xlink:`+t.slice(5).toLowerCase()}}),He=Fe({attributes:{xmlnsxlink:`xmlns:xlink`},properties:{xmlnsXLink:null,xmlns:null},space:`xmlns`,transform:Re}),Ue=Fe({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:`xml`,transform(e,t){return`xml:`+t.slice(3).toLowerCase()}}),We={classId:`classID`,dataType:`datatype`,itemId:`itemID`,strokeDashArray:`strokeDasharray`,strokeDashOffset:`strokeDashoffset`,strokeLineCap:`strokeLinecap`,strokeLineJoin:`strokeLinejoin`,strokeMiterLimit:`strokeMiterlimit`,typeOf:`typeof`,xLinkActuate:`xlinkActuate`,xLinkArcRole:`xlinkArcrole`,xLinkHref:`xlinkHref`,xLinkRole:`xlinkRole`,xLinkShow:`xlinkShow`,xLinkTitle:`xlinkTitle`,xLinkType:`xlinkType`,xmlnsXLink:`xmlnsXlink`},Ge=/[A-Z]/g,Ke=/-[a-z]/g,qe=/^data[-\w.:]+$/i;function Je(e,t){let n=Se(t),r=t,i=Ce;if(n in e.normal)return e.property[e.normal[n]];if(n.length>4&&n.slice(0,4)===`data`&&qe.test(t)){if(t.charAt(4)===`-`){let e=t.slice(5).replace(Ke,Xe);r=`data`+e.charAt(0).toUpperCase()+e.slice(1)}else{let e=t.slice(4);if(!Ke.test(e)){let n=e.replace(Ge,Ye);n.charAt(0)!==`-`&&(n=`-`+n),t=`data`+n}}i=Ne}return new i(r,t)}function Ye(e){return`-`+e.toLowerCase()}function Xe(e){return e.charAt(1).toUpperCase()}var Ze=xe([Ie,ze,Ve,He,Ue],`html`),Qe=xe([Ie,Be,Ve,He,Ue],`svg`);function $e(e){let t=String(e||``).trim();return t?t.split(/[ \t\n\r\f]+/g):[]}function et(e){return e.join(` `).trim()}var tt=o(((e,t)=>{var n=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,r=/\n/g,i=/^\s*/,a=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,o=/^:\s*/,s=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,c=/^[;\s]*/,l=/^\s+|\s+$/g,u=`
`,d=`/`,f=`*`,p=``,m=`comment`,h=`declaration`;function g(e,t){if(typeof e!=`string`)throw TypeError(`First argument must be a string`);if(!e)return[];t||={};var l=1,g=1;function v(e){var t=e.match(r);t&&(l+=t.length);var n=e.lastIndexOf(u);g=~n?e.length-n:g+e.length}function y(){var e={line:l,column:g};return function(t){return t.position=new b(e),C(),t}}function b(e){this.start=e,this.end={line:l,column:g},this.source=t.source}b.prototype.content=e;function x(n){var r=Error(t.source+`:`+l+`:`+g+`: `+n);if(r.reason=n,r.filename=t.source,r.line=l,r.column=g,r.source=e,!t.silent)throw r}function S(t){var n=t.exec(e);if(n){var r=n[0];return v(r),e=e.slice(r.length),n}}function C(){S(i)}function w(e){var t;for(e||=[];t=ee();)t!==!1&&e.push(t);return e}function ee(){var t=y();if(!(d!=e.charAt(0)||f!=e.charAt(1))){for(var n=2;p!=e.charAt(n)&&(f!=e.charAt(n)||d!=e.charAt(n+1));)++n;if(n+=2,p===e.charAt(n-1))return x(`End of comment missing`);var r=e.slice(2,n-2);return g+=2,v(r),e=e.slice(n),g+=2,t({type:m,comment:r})}}function T(){var e=y(),t=S(a);if(t){if(ee(),!S(o))return x(`property missing ':'`);var r=S(s),i=e({type:h,property:_(t[0].replace(n,p)),value:r?_(r[0].replace(n,p)):p});return S(c),i}}function te(){var e=[];w(e);for(var t;t=T();)t!==!1&&(e.push(t),w(e));return e}return C(),te()}function _(e){return e?e.replace(l,p):p}t.exports=g})),nt=o((e=>{var t=e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,`__esModule`,{value:!0}),e.default=r;var n=t(tt());function r(e,t){let r=null;if(!e||typeof e!=`string`)return r;let i=(0,n.default)(e),a=typeof t==`function`;return i.forEach(e=>{if(e.type!==`declaration`)return;let{property:n,value:i}=e;a?t(n,i,e):i&&(r||={},r[n]=i)}),r}})),rt=o((e=>{Object.defineProperty(e,`__esModule`,{value:!0}),e.camelCase=void 0;var t=/^--[a-zA-Z0-9_-]+$/,n=/-([a-z])/g,r=/^[^-]+$/,i=/^-(webkit|moz|ms|o|khtml)-/,a=/^-(ms)-/,o=function(e){return!e||r.test(e)||t.test(e)},s=function(e,t){return t.toUpperCase()},c=function(e,t){return`${t}-`};e.camelCase=function(e,t){return t===void 0&&(t={}),o(e)?e:(e=e.toLowerCase(),e=t.reactCompat?e.replace(a,c):e.replace(i,c),e.replace(n,s))}})),it=o(((e,t)=>{var n=(e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}})(nt()),r=rt();function i(e,t){var i={};return!e||typeof e!=`string`||(0,n.default)(e,function(e,n){e&&n&&(i[(0,r.camelCase)(e,t)]=n)}),i}i.default=i,t.exports=i})),at=st(`end`),ot=st(`start`);function st(e){return t;function t(t){let n=t&&t.position&&t.position[e]||{};if(typeof n.line==`number`&&n.line>0&&typeof n.column==`number`&&n.column>0)return{line:n.line,column:n.column,offset:typeof n.offset==`number`&&n.offset>-1?n.offset:void 0}}}function ct(e){let t=ot(e),n=at(e);if(t&&n)return{start:t,end:n}}function lt(e){return!e||typeof e!=`object`?``:`position`in e||`type`in e?dt(e.position):`start`in e||`end`in e?dt(e):`line`in e||`column`in e?ut(e):``}function ut(e){return ft(e&&e.line)+`:`+ft(e&&e.column)}function dt(e){return ut(e&&e.start)+`-`+ut(e&&e.end)}function ft(e){return e&&typeof e==`number`?e:1}var pt=class extends Error{constructor(e,t,n){super(),typeof t==`string`&&(n=t,t=void 0);let r=``,i={},a=!1;if(t&&(i=`line`in t&&`column`in t||`start`in t&&`end`in t?{place:t}:`type`in t?{ancestors:[t],place:t.position}:{...t}),typeof e==`string`?r=e:!i.cause&&e&&(a=!0,r=e.message,i.cause=e),!i.ruleId&&!i.source&&typeof n==`string`){let e=n.indexOf(`:`);e===-1?i.ruleId=n:(i.source=n.slice(0,e),i.ruleId=n.slice(e+1))}if(!i.place&&i.ancestors&&i.ancestors){let e=i.ancestors[i.ancestors.length-1];e&&(i.place=e.position)}let o=i.place&&`start`in i.place?i.place.start:i.place;this.ancestors=i.ancestors||void 0,this.cause=i.cause||void 0,this.column=o?o.column:void 0,this.fatal=void 0,this.file=``,this.message=r,this.line=o?o.line:void 0,this.name=lt(i.place)||`1:1`,this.place=i.place||void 0,this.reason=this.message,this.ruleId=i.ruleId||void 0,this.source=i.source||void 0,this.stack=a&&i.cause&&typeof i.cause.stack==`string`?i.cause.stack:``,this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}};pt.prototype.file=``,pt.prototype.name=``,pt.prototype.reason=``,pt.prototype.message=``,pt.prototype.stack=``,pt.prototype.column=void 0,pt.prototype.line=void 0,pt.prototype.ancestors=void 0,pt.prototype.cause=void 0,pt.prototype.fatal=void 0,pt.prototype.place=void 0,pt.prototype.ruleId=void 0,pt.prototype.source=void 0;var mt=l(it(),1),ht={}.hasOwnProperty,gt=new Map,_t=/[A-Z]/g,vt=new Set([`table`,`tbody`,`thead`,`tfoot`,`tr`]),yt=new Set([`td`,`th`]),bt=`https://github.com/syntax-tree/hast-util-to-jsx-runtime`;function xt(e,t){if(!t||t.Fragment===void 0)throw TypeError("Expected `Fragment` in options");let n=t.filePath||void 0,r;if(t.development){if(typeof t.jsxDEV!=`function`)throw TypeError("Expected `jsxDEV` in options when `development: true`");r=Mt(n,t.jsxDEV)}else{if(typeof t.jsx!=`function`)throw TypeError("Expected `jsx` in production options");if(typeof t.jsxs!=`function`)throw TypeError("Expected `jsxs` in production options");r=jt(n,t.jsx,t.jsxs)}let i={Fragment:t.Fragment,ancestors:[],components:t.components||{},create:r,elementAttributeNameCase:t.elementAttributeNameCase||`react`,evaluater:t.createEvaluater?t.createEvaluater():void 0,filePath:n,ignoreInvalidStyle:t.ignoreInvalidStyle||!1,passKeys:t.passKeys!==!1,passNode:t.passNode||!1,schema:t.space===`svg`?Qe:Ze,stylePropertyNameCase:t.stylePropertyNameCase||`dom`,tableCellAlignToStyle:t.tableCellAlignToStyle!==!1},a=St(i,e,void 0);return a&&typeof a!=`string`?a:i.create(e,i.Fragment,{children:a||void 0},void 0)}function St(e,t,n){if(t.type===`element`)return Ct(e,t,n);if(t.type===`mdxFlowExpression`||t.type===`mdxTextExpression`)return wt(e,t);if(t.type===`mdxJsxFlowElement`||t.type===`mdxJsxTextElement`)return Et(e,t,n);if(t.type===`mdxjsEsm`)return Tt(e,t);if(t.type===`root`)return Dt(e,t,n);if(t.type===`text`)return Ot(e,t)}function Ct(e,t,n){let r=e.schema,i=r;t.tagName.toLowerCase()===`svg`&&r.space===`html`&&(i=Qe,e.schema=i),e.ancestors.push(t);let a=Rt(e,t.tagName,!1),o=Nt(e,t),s=Ft(e,t);return vt.has(t.tagName)&&(s=s.filter(function(e){return typeof e==`string`?!ve(e):!0})),kt(e,o,a,t),At(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function wt(e,t){if(t.data&&t.data.estree&&e.evaluater){let n=t.data.estree.body[0];return n.type,e.evaluater.evaluateExpression(n.expression)}zt(e,t.position)}function Tt(e,t){if(t.data&&t.data.estree&&e.evaluater)return e.evaluater.evaluateProgram(t.data.estree);zt(e,t.position)}function Et(e,t,n){let r=e.schema,i=r;t.name===`svg`&&r.space===`html`&&(i=Qe,e.schema=i),e.ancestors.push(t);let a=t.name===null?e.Fragment:Rt(e,t.name,!0),o=Pt(e,t),s=Ft(e,t);return kt(e,o,a,t),At(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function Dt(e,t,n){let r={};return At(r,Ft(e,t)),e.create(t,e.Fragment,r,n)}function Ot(e,t){return t.value}function kt(e,t,n,r){typeof n!=`string`&&n!==e.Fragment&&e.passNode&&(t.node=r)}function At(e,t){if(t.length>0){let n=t.length>1?t:t[0];n&&(e.children=n)}}function jt(e,t,n){return r;function r(e,r,i,a){let o=Array.isArray(i.children)?n:t;return a?o(r,i,a):o(r,i)}}function Mt(e,t){return n;function n(n,r,i,a){let o=Array.isArray(i.children),s=ot(n);return t(r,i,a,o,{columnNumber:s?s.column-1:void 0,fileName:e,lineNumber:s?s.line:void 0},void 0)}}function Nt(e,t){let n={},r,i;for(i in t.properties)if(i!==`children`&&ht.call(t.properties,i)){let a=It(e,i,t.properties[i]);if(a){let[i,o]=a;e.tableCellAlignToStyle&&i===`align`&&typeof o==`string`&&yt.has(t.tagName)?r=o:n[i]=o}}if(r){let t=n.style||={};t[e.stylePropertyNameCase===`css`?`text-align`:`textAlign`]=r}return n}function Pt(e,t){let n={};for(let r of t.attributes)if(r.type===`mdxJsxExpressionAttribute`)if(r.data&&r.data.estree&&e.evaluater){let t=r.data.estree.body[0];t.type;let i=t.expression;i.type;let a=i.properties[0];a.type,Object.assign(n,e.evaluater.evaluateExpression(a.argument))}else zt(e,t.position);else{let i=r.name,a;if(r.value&&typeof r.value==`object`)if(r.value.data&&r.value.data.estree&&e.evaluater){let t=r.value.data.estree.body[0];t.type,a=e.evaluater.evaluateExpression(t.expression)}else zt(e,t.position);else a=r.value===null?!0:r.value;n[i]=a}return n}function Ft(e,t){let n=[],r=-1,i=e.passKeys?new Map:gt;for(;++r<t.children.length;){let a=t.children[r],o;if(e.passKeys){let e=a.type===`element`?a.tagName:a.type===`mdxJsxFlowElement`||a.type===`mdxJsxTextElement`?a.name:void 0;if(e){let t=i.get(e)||0;o=e+`-`+t,i.set(e,t+1)}}let s=St(e,a,o);s!==void 0&&n.push(s)}return n}function It(e,t,n){let r=Je(e.schema,t);if(!(n==null||typeof n==`number`&&Number.isNaN(n))){if(Array.isArray(n)&&(n=r.commaSeparated?fe(n):et(n)),r.property===`style`){let t=typeof n==`object`?n:Lt(e,String(n));return e.stylePropertyNameCase===`css`&&(t=Bt(t)),[`style`,t]}return[e.elementAttributeNameCase===`react`&&r.space?We[r.property]||r.property:r.attribute,n]}}function Lt(e,t){try{return(0,mt.default)(t,{reactCompat:!0})}catch(t){if(e.ignoreInvalidStyle)return{};let n=t,r=new pt("Cannot parse `style` attribute",{ancestors:e.ancestors,cause:n,ruleId:`style`,source:`hast-util-to-jsx-runtime`});throw r.file=e.filePath||void 0,r.url=bt+`#cannot-parse-style-attribute`,r}}function Rt(e,t,n){let r;if(!n)r={type:`Literal`,value:t};else if(t.includes(`.`)){let e=t.split(`.`),n=-1,i;for(;++n<e.length;){let t=ge(e[n])?{type:`Identifier`,name:e[n]}:{type:`Literal`,value:e[n]};i=i?{type:`MemberExpression`,object:i,property:t,computed:!!(n&&t.type===`Literal`),optional:!1}:t}r=i}else r=ge(t)&&!/^[a-z]/.test(t)?{type:`Identifier`,name:t}:{type:`Literal`,value:t};if(r.type===`Literal`){let t=r.value;return ht.call(e.components,t)?e.components[t]:t}if(e.evaluater)return e.evaluater.evaluateExpression(r);zt(e)}function zt(e,t){let n=new pt("Cannot handle MDX estrees without `createEvaluater`",{ancestors:e.ancestors,place:t,ruleId:`mdx-estree`,source:`hast-util-to-jsx-runtime`});throw n.file=e.filePath||void 0,n.url=bt+`#cannot-handle-mdx-estrees-without-createevaluater`,n}function Bt(e){let t={},n;for(n in e)ht.call(e,n)&&(t[Vt(n)]=e[n]);return t}function Vt(e){let t=e.replace(_t,Ht);return t.slice(0,3)===`ms-`&&(t=`-`+t),t}function Ht(e){return`-`+e.toLowerCase()}var Ut={action:[`form`],cite:[`blockquote`,`del`,`ins`,`q`],data:[`object`],formAction:[`button`,`input`],href:[`a`,`area`,`base`,`link`],icon:[`menuitem`],itemId:null,manifest:[`html`],ping:[`a`,`area`],poster:[`video`],src:[`audio`,`embed`,`iframe`,`img`,`input`,`script`,`source`,`track`,`video`]},Wt=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),Gt=o(((e,t)=>{t.exports=Wt()})),Kt={};function qt(e,t){let n=t||Kt;return Jt(e,typeof n.includeImageAlt==`boolean`?n.includeImageAlt:!0,typeof n.includeHtml==`boolean`?n.includeHtml:!0)}function Jt(e,t,n){if(Xt(e)){if(`value`in e)return e.type===`html`&&!n?``:e.value;if(t&&`alt`in e&&e.alt)return e.alt;if(`children`in e)return Yt(e.children,t,n)}return Array.isArray(e)?Yt(e,t,n):``}function Yt(e,t,n){let r=[],i=-1;for(;++i<e.length;)r[i]=Jt(e[i],t,n);return r.join(``)}function Xt(e){return!!(e&&typeof e==`object`)}var Zt=document.createElement(`i`);function Qt(e){let t=`&`+e+`;`;Zt.innerHTML=t;let n=Zt.textContent;return n.charCodeAt(n.length-1)===59&&e!==`semi`||n===t?!1:n}function $t(e,t,n,r){let i=e.length,a=0,o;if(t=t<0?-t>i?0:i+t:t>i?i:t,n=n>0?n:0,r.length<1e4)o=Array.from(r),o.unshift(t,n),e.splice(...o);else for(n&&e.splice(t,n);a<r.length;)o=r.slice(a,a+1e4),o.unshift(t,0),e.splice(...o),a+=1e4,t+=1e4}function en(e,t){return e.length>0?($t(e,e.length,0,t),e):t}var tn={}.hasOwnProperty;function nn(e){let t={},n=-1;for(;++n<e.length;)rn(t,e[n]);return t}function rn(e,t){let n;for(n in t){let r=(tn.call(e,n)?e[n]:void 0)||(e[n]={}),i=t[n],a;if(i)for(a in i){tn.call(r,a)||(r[a]=[]);let e=i[a];an(r[a],Array.isArray(e)?e:e?[e]:[])}}}function an(e,t){let n=-1,r=[];for(;++n<t.length;)(t[n].add===`after`?e:r).push(t[n]);$t(e,0,0,r)}function on(e,t){let n=Number.parseInt(e,t);return n<9||n===11||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(n&65535)==65535||(n&65535)==65534||n>1114111?`�`:String.fromCodePoint(n)}function sn(e){return e.replace(/[\t\n\r ]+/g,` `).replace(/^ | $/g,``).toLowerCase().toUpperCase()}var cn=yn(/[A-Za-z]/),ln=yn(/[\dA-Za-z]/),un=yn(/[#-'*+\--9=?A-Z^-~]/);function dn(e){return e!==null&&(e<32||e===127)}var fn=yn(/\d/),pn=yn(/[\dA-Fa-f]/),mn=yn(/[!-/:-@[-`{-~]/);function A(e){return e!==null&&e<-2}function hn(e){return e!==null&&(e<0||e===32)}function gn(e){return e===-2||e===-1||e===32}var _n=yn(/\p{P}|\p{S}/u),vn=yn(/\s/);function yn(e){return t;function t(t){return t!==null&&t>-1&&e.test(String.fromCharCode(t))}}function bn(e){let t=[],n=-1,r=0,i=0;for(;++n<e.length;){let a=e.charCodeAt(n),o=``;if(a===37&&ln(e.charCodeAt(n+1))&&ln(e.charCodeAt(n+2)))i=2;else if(a<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a))||(o=String.fromCharCode(a));else if(a>55295&&a<57344){let t=e.charCodeAt(n+1);a<56320&&t>56319&&t<57344?(o=String.fromCharCode(a,t),i=1):o=`�`}else o=String.fromCharCode(a);o&&=(t.push(e.slice(r,n),encodeURIComponent(o)),r=n+i+1,``),i&&=(n+=i,0)}return t.join(``)+e.slice(r)}function xn(e,t,n,r){let i=r?r-1:1/0,a=0;return o;function o(r){return gn(r)?(e.enter(n),s(r)):t(r)}function s(r){return gn(r)&&a++<i?(e.consume(r),s):(e.exit(n),t(r))}}var Sn={tokenize:Cn};function Cn(e){let t=e.attempt(this.parser.constructs.contentInitial,r,i),n;return t;function r(n){if(n===null){e.consume(n);return}return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),xn(e,t,`linePrefix`)}function i(t){return e.enter(`paragraph`),a(t)}function a(t){let r=e.enter(`chunkText`,{contentType:`text`,previous:n});return n&&(n.next=r),n=r,o(t)}function o(t){if(t===null){e.exit(`chunkText`),e.exit(`paragraph`),e.consume(t);return}return A(t)?(e.consume(t),e.exit(`chunkText`),a):(e.consume(t),o)}}var wn={tokenize:En},Tn={tokenize:Dn};function En(e){let t=this,n=[],r=0,i,a,o;return s;function s(i){if(r<n.length){let a=n[r];return t.containerState=a[1],e.attempt(a[0].continuation,c,l)(i)}return l(i)}function c(e){if(r++,t.containerState._closeFlow){t.containerState._closeFlow=void 0,i&&v();let n=t.events.length,a=n,o;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){o=t.events[a][1].end;break}_(r);let s=n;for(;s<t.events.length;)t.events[s][1].end={...o},s++;return $t(t.events,a+1,0,t.events.slice(n)),t.events.length=s,l(e)}return s(e)}function l(a){if(r===n.length){if(!i)return f(a);if(i.currentConstruct&&i.currentConstruct.concrete)return m(a);t.interrupt=!!(i.currentConstruct&&!i._gfmTableDynamicInterruptHack)}return t.containerState={},e.check(Tn,u,d)(a)}function u(e){return i&&v(),_(r),f(e)}function d(e){return t.parser.lazy[t.now().line]=r!==n.length,o=t.now().offset,m(e)}function f(n){return t.containerState={},e.attempt(Tn,p,m)(n)}function p(e){return r++,n.push([t.currentConstruct,t.containerState]),f(e)}function m(n){if(n===null){i&&v(),_(0),e.consume(n);return}return i||=t.parser.flow(t.now()),e.enter(`chunkFlow`,{_tokenizer:i,contentType:`flow`,previous:a}),h(n)}function h(n){if(n===null){g(e.exit(`chunkFlow`),!0),_(0),e.consume(n);return}return A(n)?(e.consume(n),g(e.exit(`chunkFlow`)),r=0,t.interrupt=void 0,s):(e.consume(n),h)}function g(e,n){let s=t.sliceStream(e);if(n&&s.push(null),e.previous=a,a&&(a.next=e),a=e,i.defineSkip(e.start),i.write(s),t.parser.lazy[e.start.line]){let e=i.events.length;for(;e--;)if(i.events[e][1].start.offset<o&&(!i.events[e][1].end||i.events[e][1].end.offset>o))return;let n=t.events.length,a=n,s,c;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){if(s){c=t.events[a][1].end;break}s=!0}for(_(r),e=n;e<t.events.length;)t.events[e][1].end={...c},e++;$t(t.events,a+1,0,t.events.slice(n)),t.events.length=e}}function _(r){let i=n.length;for(;i-- >r;){let r=n[i];t.containerState=r[1],r[0].exit.call(t,e)}n.length=r}function v(){i.write([null]),a=void 0,i=void 0,t.containerState._closeFlow=void 0}}function Dn(e,t,n){return xn(e,e.attempt(this.parser.constructs.document,t,n),`linePrefix`,this.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)}function On(e){if(e===null||hn(e)||vn(e))return 1;if(_n(e))return 2}function kn(e,t,n){let r=[],i=-1;for(;++i<e.length;){let a=e[i].resolveAll;a&&!r.includes(a)&&(t=a(t,n),r.push(a))}return t}var An={name:`attention`,resolveAll:jn,tokenize:Mn};function jn(e,t){let n=-1,r,i,a,o,s,c,l,u;for(;++n<e.length;)if(e[n][0]===`enter`&&e[n][1].type===`attentionSequence`&&e[n][1]._close){for(r=n;r--;)if(e[r][0]===`exit`&&e[r][1].type===`attentionSequence`&&e[r][1]._open&&t.sliceSerialize(e[r][1]).charCodeAt(0)===t.sliceSerialize(e[n][1]).charCodeAt(0)){if((e[r][1]._close||e[n][1]._open)&&(e[n][1].end.offset-e[n][1].start.offset)%3&&!((e[r][1].end.offset-e[r][1].start.offset+e[n][1].end.offset-e[n][1].start.offset)%3))continue;c=e[r][1].end.offset-e[r][1].start.offset>1&&e[n][1].end.offset-e[n][1].start.offset>1?2:1;let d={...e[r][1].end},f={...e[n][1].start};Nn(d,-c),Nn(f,c),o={type:c>1?`strongSequence`:`emphasisSequence`,start:d,end:{...e[r][1].end}},s={type:c>1?`strongSequence`:`emphasisSequence`,start:{...e[n][1].start},end:f},a={type:c>1?`strongText`:`emphasisText`,start:{...e[r][1].end},end:{...e[n][1].start}},i={type:c>1?`strong`:`emphasis`,start:{...o.start},end:{...s.end}},e[r][1].end={...o.start},e[n][1].start={...s.end},l=[],e[r][1].end.offset-e[r][1].start.offset&&(l=en(l,[[`enter`,e[r][1],t],[`exit`,e[r][1],t]])),l=en(l,[[`enter`,i,t],[`enter`,o,t],[`exit`,o,t],[`enter`,a,t]]),l=en(l,kn(t.parser.constructs.insideSpan.null,e.slice(r+1,n),t)),l=en(l,[[`exit`,a,t],[`enter`,s,t],[`exit`,s,t],[`exit`,i,t]]),e[n][1].end.offset-e[n][1].start.offset?(u=2,l=en(l,[[`enter`,e[n][1],t],[`exit`,e[n][1],t]])):u=0,$t(e,r-1,n-r+3,l),n=r+l.length-u-2;break}}for(n=-1;++n<e.length;)e[n][1].type===`attentionSequence`&&(e[n][1].type=`data`);return e}function Mn(e,t){let n=this.parser.constructs.attentionMarkers.null,r=this.previous,i=On(r),a;return o;function o(t){return a=t,e.enter(`attentionSequence`),s(t)}function s(o){if(o===a)return e.consume(o),s;let c=e.exit(`attentionSequence`),l=On(o),u=!l||l===2&&i||n.includes(o),d=!i||i===2&&l||n.includes(r);return c._open=!!(a===42?u:u&&(i||!d)),c._close=!!(a===42?d:d&&(l||!u)),t(o)}}function Nn(e,t){e.column+=t,e.offset+=t,e._bufferIndex+=t}var Pn={name:`autolink`,tokenize:Fn};function Fn(e,t,n){let r=0;return i;function i(t){return e.enter(`autolink`),e.enter(`autolinkMarker`),e.consume(t),e.exit(`autolinkMarker`),e.enter(`autolinkProtocol`),a}function a(t){return cn(t)?(e.consume(t),o):t===64?n(t):l(t)}function o(e){return e===43||e===45||e===46||ln(e)?(r=1,s(e)):l(e)}function s(t){return t===58?(e.consume(t),r=0,c):(t===43||t===45||t===46||ln(t))&&r++<32?(e.consume(t),s):(r=0,l(t))}function c(r){return r===62?(e.exit(`autolinkProtocol`),e.enter(`autolinkMarker`),e.consume(r),e.exit(`autolinkMarker`),e.exit(`autolink`),t):r===null||r===32||r===60||dn(r)?n(r):(e.consume(r),c)}function l(t){return t===64?(e.consume(t),u):un(t)?(e.consume(t),l):n(t)}function u(e){return ln(e)?d(e):n(e)}function d(n){return n===46?(e.consume(n),r=0,u):n===62?(e.exit(`autolinkProtocol`).type=`autolinkEmail`,e.enter(`autolinkMarker`),e.consume(n),e.exit(`autolinkMarker`),e.exit(`autolink`),t):f(n)}function f(t){if((t===45||ln(t))&&r++<63){let n=t===45?f:d;return e.consume(t),n}return n(t)}}var In={partial:!0,tokenize:Ln};function Ln(e,t,n){return r;function r(t){return gn(t)?xn(e,i,`linePrefix`)(t):i(t)}function i(e){return e===null||A(e)?t(e):n(e)}}var Rn={continuation:{tokenize:Bn},exit:Vn,name:`blockQuote`,tokenize:zn};function zn(e,t,n){let r=this;return i;function i(t){if(t===62){let n=r.containerState;return n.open||=(e.enter(`blockQuote`,{_container:!0}),!0),e.enter(`blockQuotePrefix`),e.enter(`blockQuoteMarker`),e.consume(t),e.exit(`blockQuoteMarker`),a}return n(t)}function a(n){return gn(n)?(e.enter(`blockQuotePrefixWhitespace`),e.consume(n),e.exit(`blockQuotePrefixWhitespace`),e.exit(`blockQuotePrefix`),t):(e.exit(`blockQuotePrefix`),t(n))}}function Bn(e,t,n){let r=this;return i;function i(t){return gn(t)?xn(e,a,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):a(t)}function a(r){return e.attempt(Rn,t,n)(r)}}function Vn(e){e.exit(`blockQuote`)}var Hn={name:`characterEscape`,tokenize:Un};function Un(e,t,n){return r;function r(t){return e.enter(`characterEscape`),e.enter(`escapeMarker`),e.consume(t),e.exit(`escapeMarker`),i}function i(r){return mn(r)?(e.enter(`characterEscapeValue`),e.consume(r),e.exit(`characterEscapeValue`),e.exit(`characterEscape`),t):n(r)}}var Wn={name:`characterReference`,tokenize:Gn};function Gn(e,t,n){let r=this,i=0,a,o;return s;function s(t){return e.enter(`characterReference`),e.enter(`characterReferenceMarker`),e.consume(t),e.exit(`characterReferenceMarker`),c}function c(t){return t===35?(e.enter(`characterReferenceMarkerNumeric`),e.consume(t),e.exit(`characterReferenceMarkerNumeric`),l):(e.enter(`characterReferenceValue`),a=31,o=ln,u(t))}function l(t){return t===88||t===120?(e.enter(`characterReferenceMarkerHexadecimal`),e.consume(t),e.exit(`characterReferenceMarkerHexadecimal`),e.enter(`characterReferenceValue`),a=6,o=pn,u):(e.enter(`characterReferenceValue`),a=7,o=fn,u(t))}function u(s){if(s===59&&i){let i=e.exit(`characterReferenceValue`);return o===ln&&!Qt(r.sliceSerialize(i))?n(s):(e.enter(`characterReferenceMarker`),e.consume(s),e.exit(`characterReferenceMarker`),e.exit(`characterReference`),t)}return o(s)&&i++<a?(e.consume(s),u):n(s)}}var Kn={partial:!0,tokenize:Yn},qn={concrete:!0,name:`codeFenced`,tokenize:Jn};function Jn(e,t,n){let r=this,i={partial:!0,tokenize:x},a=0,o=0,s;return c;function c(e){return l(e)}function l(t){let n=r.events[r.events.length-1];return a=n&&n[1].type===`linePrefix`?n[2].sliceSerialize(n[1],!0).length:0,s=t,e.enter(`codeFenced`),e.enter(`codeFencedFence`),e.enter(`codeFencedFenceSequence`),u(t)}function u(t){return t===s?(o++,e.consume(t),u):o<3?n(t):(e.exit(`codeFencedFenceSequence`),gn(t)?xn(e,d,`whitespace`)(t):d(t))}function d(n){return n===null||A(n)?(e.exit(`codeFencedFence`),r.interrupt?t(n):e.check(Kn,h,b)(n)):(e.enter(`codeFencedFenceInfo`),e.enter(`chunkString`,{contentType:`string`}),f(n))}function f(t){return t===null||A(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),d(t)):gn(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),xn(e,p,`whitespace`)(t)):t===96&&t===s?n(t):(e.consume(t),f)}function p(t){return t===null||A(t)?d(t):(e.enter(`codeFencedFenceMeta`),e.enter(`chunkString`,{contentType:`string`}),m(t))}function m(t){return t===null||A(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceMeta`),d(t)):t===96&&t===s?n(t):(e.consume(t),m)}function h(t){return e.attempt(i,b,g)(t)}function g(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),_}function _(t){return a>0&&gn(t)?xn(e,v,`linePrefix`,a+1)(t):v(t)}function v(t){return t===null||A(t)?e.check(Kn,h,b)(t):(e.enter(`codeFlowValue`),y(t))}function y(t){return t===null||A(t)?(e.exit(`codeFlowValue`),v(t)):(e.consume(t),y)}function b(n){return e.exit(`codeFenced`),t(n)}function x(e,t,n){let i=0;return a;function a(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c}function c(t){return e.enter(`codeFencedFence`),gn(t)?xn(e,l,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):l(t)}function l(t){return t===s?(e.enter(`codeFencedFenceSequence`),u(t)):n(t)}function u(t){return t===s?(i++,e.consume(t),u):i>=o?(e.exit(`codeFencedFenceSequence`),gn(t)?xn(e,d,`whitespace`)(t):d(t)):n(t)}function d(r){return r===null||A(r)?(e.exit(`codeFencedFence`),t(r)):n(r)}}}function Yn(e,t,n){let r=this;return i;function i(t){return t===null?n(t):(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}var Xn={name:`codeIndented`,tokenize:Qn},Zn={partial:!0,tokenize:$n};function Qn(e,t,n){let r=this;return i;function i(t){return e.enter(`codeIndented`),xn(e,a,`linePrefix`,5)(t)}function a(e){let t=r.events[r.events.length-1];return t&&t[1].type===`linePrefix`&&t[2].sliceSerialize(t[1],!0).length>=4?o(e):n(e)}function o(t){return t===null?c(t):A(t)?e.attempt(Zn,o,c)(t):(e.enter(`codeFlowValue`),s(t))}function s(t){return t===null||A(t)?(e.exit(`codeFlowValue`),o(t)):(e.consume(t),s)}function c(n){return e.exit(`codeIndented`),t(n)}}function $n(e,t,n){let r=this;return i;function i(t){return r.parser.lazy[r.now().line]?n(t):A(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),i):xn(e,a,`linePrefix`,5)(t)}function a(e){let a=r.events[r.events.length-1];return a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(e):A(e)?i(e):n(e)}}var er={name:`codeText`,previous:nr,resolve:tr,tokenize:rr};function tr(e){let t=e.length-4,n=3,r,i;if((e[n][1].type===`lineEnding`||e[n][1].type===`space`)&&(e[t][1].type===`lineEnding`||e[t][1].type===`space`)){for(r=n;++r<t;)if(e[r][1].type===`codeTextData`){e[n][1].type=`codeTextPadding`,e[t][1].type=`codeTextPadding`,n+=2,t-=2;break}}for(r=n-1,t++;++r<=t;)i===void 0?r!==t&&e[r][1].type!==`lineEnding`&&(i=r):(r===t||e[r][1].type===`lineEnding`)&&(e[i][1].type=`codeTextData`,r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),t-=r-i-2,r=i+2),i=void 0);return e}function nr(e){return e!==96||this.events[this.events.length-1][1].type===`characterEscape`}function rr(e,t,n){let r=0,i,a;return o;function o(t){return e.enter(`codeText`),e.enter(`codeTextSequence`),s(t)}function s(t){return t===96?(e.consume(t),r++,s):(e.exit(`codeTextSequence`),c(t))}function c(t){return t===null?n(t):t===32?(e.enter(`space`),e.consume(t),e.exit(`space`),c):t===96?(a=e.enter(`codeTextSequence`),i=0,u(t)):A(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c):(e.enter(`codeTextData`),l(t))}function l(t){return t===null||t===32||t===96||A(t)?(e.exit(`codeTextData`),c(t)):(e.consume(t),l)}function u(n){return n===96?(e.consume(n),i++,u):i===r?(e.exit(`codeTextSequence`),e.exit(`codeText`),t(n)):(a.type=`codeTextData`,l(n))}}var ir=class{constructor(e){this.left=e?[...e]:[],this.right=[]}get(e){if(e<0||e>=this.left.length+this.right.length)throw RangeError("Cannot access index `"+e+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return e<this.left.length?this.left[e]:this.right[this.right.length-e+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(e,t){let n=t??1/0;return n<this.left.length?this.left.slice(e,n):e>this.left.length?this.right.slice(this.right.length-n+this.left.length,this.right.length-e+this.left.length).reverse():this.left.slice(e).concat(this.right.slice(this.right.length-n+this.left.length).reverse())}splice(e,t,n){let r=t||0;this.setCursor(Math.trunc(e));let i=this.right.splice(this.right.length-r,1/0);return n&&ar(this.left,n),i.reverse()}pop(){return this.setCursor(1/0),this.left.pop()}push(e){this.setCursor(1/0),this.left.push(e)}pushMany(e){this.setCursor(1/0),ar(this.left,e)}unshift(e){this.setCursor(0),this.right.push(e)}unshiftMany(e){this.setCursor(0),ar(this.right,e.reverse())}setCursor(e){if(!(e===this.left.length||e>this.left.length&&this.right.length===0||e<0&&this.left.length===0))if(e<this.left.length){let t=this.left.splice(e,1/0);ar(this.right,t.reverse())}else{let t=this.right.splice(this.left.length+this.right.length-e,1/0);ar(this.left,t.reverse())}}};function ar(e,t){let n=0;if(t.length<1e4)e.push(...t);else for(;n<t.length;)e.push(...t.slice(n,n+1e4)),n+=1e4}function or(e){let t={},n=-1,r,i,a,o,s,c,l,u=new ir(e);for(;++n<u.length;){for(;n in t;)n=t[n];if(r=u.get(n),n&&r[1].type===`chunkFlow`&&u.get(n-1)[1].type===`listItemPrefix`&&(c=r[1]._tokenizer.events,a=0,a<c.length&&c[a][1].type===`lineEndingBlank`&&(a+=2),a<c.length&&c[a][1].type===`content`))for(;++a<c.length&&c[a][1].type!==`content`;)c[a][1].type===`chunkText`&&(c[a][1]._isInFirstContentOfListItem=!0,a++);if(r[0]===`enter`)r[1].contentType&&(Object.assign(t,sr(u,n)),n=t[n],l=!0);else if(r[1]._container){for(a=n,i=void 0;a--;)if(o=u.get(a),o[1].type===`lineEnding`||o[1].type===`lineEndingBlank`)o[0]===`enter`&&(i&&(u.get(i)[1].type=`lineEndingBlank`),o[1].type=`lineEnding`,i=a);else if(!(o[1].type===`linePrefix`||o[1].type===`listItemIndent`))break;i&&(r[1].end={...u.get(i)[1].start},s=u.slice(i,n),s.unshift(r),u.splice(i,n-i+1,s))}}return $t(e,0,1/0,u.slice(0)),!l}function sr(e,t){let n=e.get(t)[1],r=e.get(t)[2],i=t-1,a=[],o=n._tokenizer;o||(o=r.parser[n.contentType](n.start),n._contentTypeTextTrailing&&(o._contentTypeTextTrailing=!0));let s=o.events,c=[],l={},u,d,f=-1,p=n,m=0,h=0,g=[h];for(;p;){for(;e.get(++i)[1]!==p;);a.push(i),p._tokenizer||(u=r.sliceStream(p),p.next||u.push(null),d&&o.defineSkip(p.start),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=!0),o.write(u),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=void 0)),d=p,p=p.next}for(p=n;++f<s.length;)s[f][0]===`exit`&&s[f-1][0]===`enter`&&s[f][1].type===s[f-1][1].type&&s[f][1].start.line!==s[f][1].end.line&&(h=f+1,g.push(h),p._tokenizer=void 0,p.previous=void 0,p=p.next);for(o.events=[],p?(p._tokenizer=void 0,p.previous=void 0):g.pop(),f=g.length;f--;){let t=s.slice(g[f],g[f+1]),n=a.pop();c.push([n,n+t.length-1]),e.splice(n,2,t)}for(c.reverse(),f=-1;++f<c.length;)l[m+c[f][0]]=m+c[f][1],m+=c[f][1]-c[f][0]-1;return l}var cr={resolve:ur,tokenize:dr},lr={partial:!0,tokenize:fr};function ur(e){return or(e),e}function dr(e,t){let n;return r;function r(t){return e.enter(`content`),n=e.enter(`chunkContent`,{contentType:`content`}),i(t)}function i(t){return t===null?a(t):A(t)?e.check(lr,o,a)(t):(e.consume(t),i)}function a(n){return e.exit(`chunkContent`),e.exit(`content`),t(n)}function o(t){return e.consume(t),e.exit(`chunkContent`),n.next=e.enter(`chunkContent`,{contentType:`content`,previous:n}),n=n.next,i}}function fr(e,t,n){let r=this;return i;function i(t){return e.exit(`chunkContent`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),xn(e,a,`linePrefix`)}function a(i){if(i===null||A(i))return n(i);let a=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes(`codeIndented`)&&a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(i):e.interrupt(r.parser.constructs.flow,n,t)(i)}}function pr(e,t,n,r,i,a,o,s,c){let l=c||1/0,u=0;return d;function d(t){return t===60?(e.enter(r),e.enter(i),e.enter(a),e.consume(t),e.exit(a),f):t===null||t===32||t===41||dn(t)?n(t):(e.enter(r),e.enter(o),e.enter(s),e.enter(`chunkString`,{contentType:`string`}),h(t))}function f(n){return n===62?(e.enter(a),e.consume(n),e.exit(a),e.exit(i),e.exit(r),t):(e.enter(s),e.enter(`chunkString`,{contentType:`string`}),p(n))}function p(t){return t===62?(e.exit(`chunkString`),e.exit(s),f(t)):t===null||t===60||A(t)?n(t):(e.consume(t),t===92?m:p)}function m(t){return t===60||t===62||t===92?(e.consume(t),p):p(t)}function h(i){return!u&&(i===null||i===41||hn(i))?(e.exit(`chunkString`),e.exit(s),e.exit(o),e.exit(r),t(i)):u<l&&i===40?(e.consume(i),u++,h):i===41?(e.consume(i),u--,h):i===null||i===32||i===40||dn(i)?n(i):(e.consume(i),i===92?g:h)}function g(t){return t===40||t===41||t===92?(e.consume(t),h):h(t)}}function mr(e,t,n,r,i,a){let o=this,s=0,c;return l;function l(t){return e.enter(r),e.enter(i),e.consume(t),e.exit(i),e.enter(a),u}function u(l){return s>999||l===null||l===91||l===93&&!c||l===94&&!s&&`_hiddenFootnoteSupport`in o.parser.constructs?n(l):l===93?(e.exit(a),e.enter(i),e.consume(l),e.exit(i),e.exit(r),t):A(l)?(e.enter(`lineEnding`),e.consume(l),e.exit(`lineEnding`),u):(e.enter(`chunkString`,{contentType:`string`}),d(l))}function d(t){return t===null||t===91||t===93||A(t)||s++>999?(e.exit(`chunkString`),u(t)):(e.consume(t),c||=!gn(t),t===92?f:d)}function f(t){return t===91||t===92||t===93?(e.consume(t),s++,d):d(t)}}function hr(e,t,n,r,i,a){let o;return s;function s(t){return t===34||t===39||t===40?(e.enter(r),e.enter(i),e.consume(t),e.exit(i),o=t===40?41:t,c):n(t)}function c(n){return n===o?(e.enter(i),e.consume(n),e.exit(i),e.exit(r),t):(e.enter(a),l(n))}function l(t){return t===o?(e.exit(a),c(o)):t===null?n(t):A(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),xn(e,l,`linePrefix`)):(e.enter(`chunkString`,{contentType:`string`}),u(t))}function u(t){return t===o||t===null||A(t)?(e.exit(`chunkString`),l(t)):(e.consume(t),t===92?d:u)}function d(t){return t===o||t===92?(e.consume(t),u):u(t)}}function gr(e,t){let n;return r;function r(i){return A(i)?(e.enter(`lineEnding`),e.consume(i),e.exit(`lineEnding`),n=!0,r):gn(i)?xn(e,r,n?`linePrefix`:`lineSuffix`)(i):t(i)}}var _r={name:`definition`,tokenize:yr},vr={partial:!0,tokenize:br};function yr(e,t,n){let r=this,i;return a;function a(t){return e.enter(`definition`),o(t)}function o(t){return mr.call(r,e,s,n,`definitionLabel`,`definitionLabelMarker`,`definitionLabelString`)(t)}function s(t){return i=sn(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)),t===58?(e.enter(`definitionMarker`),e.consume(t),e.exit(`definitionMarker`),c):n(t)}function c(t){return hn(t)?gr(e,l)(t):l(t)}function l(t){return pr(e,u,n,`definitionDestination`,`definitionDestinationLiteral`,`definitionDestinationLiteralMarker`,`definitionDestinationRaw`,`definitionDestinationString`)(t)}function u(t){return e.attempt(vr,d,d)(t)}function d(t){return gn(t)?xn(e,f,`whitespace`)(t):f(t)}function f(a){return a===null||A(a)?(e.exit(`definition`),r.parser.defined.push(i),t(a)):n(a)}}function br(e,t,n){return r;function r(t){return hn(t)?gr(e,i)(t):n(t)}function i(t){return hr(e,a,n,`definitionTitle`,`definitionTitleMarker`,`definitionTitleString`)(t)}function a(t){return gn(t)?xn(e,o,`whitespace`)(t):o(t)}function o(e){return e===null||A(e)?t(e):n(e)}}var xr={name:`hardBreakEscape`,tokenize:Sr};function Sr(e,t,n){return r;function r(t){return e.enter(`hardBreakEscape`),e.consume(t),i}function i(r){return A(r)?(e.exit(`hardBreakEscape`),t(r)):n(r)}}var Cr={name:`headingAtx`,resolve:wr,tokenize:Tr};function wr(e,t){let n=e.length-2,r=3,i,a;return e[r][1].type===`whitespace`&&(r+=2),n-2>r&&e[n][1].type===`whitespace`&&(n-=2),e[n][1].type===`atxHeadingSequence`&&(r===n-1||n-4>r&&e[n-2][1].type===`whitespace`)&&(n-=r+1===n?2:4),n>r&&(i={type:`atxHeadingText`,start:e[r][1].start,end:e[n][1].end},a={type:`chunkText`,start:e[r][1].start,end:e[n][1].end,contentType:`text`},$t(e,r,n-r+1,[[`enter`,i,t],[`enter`,a,t],[`exit`,a,t],[`exit`,i,t]])),e}function Tr(e,t,n){let r=0;return i;function i(t){return e.enter(`atxHeading`),a(t)}function a(t){return e.enter(`atxHeadingSequence`),o(t)}function o(t){return t===35&&r++<6?(e.consume(t),o):t===null||hn(t)?(e.exit(`atxHeadingSequence`),s(t)):n(t)}function s(n){return n===35?(e.enter(`atxHeadingSequence`),c(n)):n===null||A(n)?(e.exit(`atxHeading`),t(n)):gn(n)?xn(e,s,`whitespace`)(n):(e.enter(`atxHeadingText`),l(n))}function c(t){return t===35?(e.consume(t),c):(e.exit(`atxHeadingSequence`),s(t))}function l(t){return t===null||t===35||hn(t)?(e.exit(`atxHeadingText`),s(t)):(e.consume(t),l)}}var Er=`address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul`.split(`.`),Dr=[`pre`,`script`,`style`,`textarea`],Or={concrete:!0,name:`htmlFlow`,resolveTo:jr,tokenize:Mr},kr={partial:!0,tokenize:Pr},Ar={partial:!0,tokenize:Nr};function jr(e){let t=e.length;for(;t--&&!(e[t][0]===`enter`&&e[t][1].type===`htmlFlow`););return t>1&&e[t-2][1].type===`linePrefix`&&(e[t][1].start=e[t-2][1].start,e[t+1][1].start=e[t-2][1].start,e.splice(t-2,2)),e}function Mr(e,t,n){let r=this,i,a,o,s,c;return l;function l(e){return u(e)}function u(t){return e.enter(`htmlFlow`),e.enter(`htmlFlowData`),e.consume(t),d}function d(s){return s===33?(e.consume(s),f):s===47?(e.consume(s),a=!0,h):s===63?(e.consume(s),i=3,r.interrupt?t:D):cn(s)?(e.consume(s),o=String.fromCharCode(s),g):n(s)}function f(a){return a===45?(e.consume(a),i=2,p):a===91?(e.consume(a),i=5,s=0,m):cn(a)?(e.consume(a),i=4,r.interrupt?t:D):n(a)}function p(i){return i===45?(e.consume(i),r.interrupt?t:D):n(i)}function m(i){return i===`CDATA[`.charCodeAt(s++)?(e.consume(i),s===6?r.interrupt?t:E:m):n(i)}function h(t){return cn(t)?(e.consume(t),o=String.fromCharCode(t),g):n(t)}function g(s){if(s===null||s===47||s===62||hn(s)){let c=s===47,l=o.toLowerCase();return!c&&!a&&Dr.includes(l)?(i=1,r.interrupt?t(s):E(s)):Er.includes(o.toLowerCase())?(i=6,c?(e.consume(s),_):r.interrupt?t(s):E(s)):(i=7,r.interrupt&&!r.parser.lazy[r.now().line]?n(s):a?v(s):y(s))}return s===45||ln(s)?(e.consume(s),o+=String.fromCharCode(s),g):n(s)}function _(i){return i===62?(e.consume(i),r.interrupt?t:E):n(i)}function v(t){return gn(t)?(e.consume(t),v):T(t)}function y(t){return t===47?(e.consume(t),T):t===58||t===95||cn(t)?(e.consume(t),b):gn(t)?(e.consume(t),y):T(t)}function b(t){return t===45||t===46||t===58||t===95||ln(t)?(e.consume(t),b):x(t)}function x(t){return t===61?(e.consume(t),S):gn(t)?(e.consume(t),x):y(t)}function S(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),c=t,C):gn(t)?(e.consume(t),S):w(t)}function C(t){return t===c?(e.consume(t),c=null,ee):t===null||A(t)?n(t):(e.consume(t),C)}function w(t){return t===null||t===34||t===39||t===47||t===60||t===61||t===62||t===96||hn(t)?x(t):(e.consume(t),w)}function ee(e){return e===47||e===62||gn(e)?y(e):n(e)}function T(t){return t===62?(e.consume(t),te):n(t)}function te(t){return t===null||A(t)?E(t):gn(t)?(e.consume(t),te):n(t)}function E(t){return t===45&&i===2?(e.consume(t),ae):t===60&&i===1?(e.consume(t),oe):t===62&&i===4?(e.consume(t),le):t===63&&i===3?(e.consume(t),D):t===93&&i===5?(e.consume(t),ce):A(t)&&(i===6||i===7)?(e.exit(`htmlFlowData`),e.check(kr,ue,ne)(t)):t===null||A(t)?(e.exit(`htmlFlowData`),ne(t)):(e.consume(t),E)}function ne(t){return e.check(Ar,re,ue)(t)}function re(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),ie}function ie(t){return t===null||A(t)?ne(t):(e.enter(`htmlFlowData`),E(t))}function ae(t){return t===45?(e.consume(t),D):E(t)}function oe(t){return t===47?(e.consume(t),o=``,se):E(t)}function se(t){if(t===62){let n=o.toLowerCase();return Dr.includes(n)?(e.consume(t),le):E(t)}return cn(t)&&o.length<8?(e.consume(t),o+=String.fromCharCode(t),se):E(t)}function ce(t){return t===93?(e.consume(t),D):E(t)}function D(t){return t===62?(e.consume(t),le):t===45&&i===2?(e.consume(t),D):E(t)}function le(t){return t===null||A(t)?(e.exit(`htmlFlowData`),ue(t)):(e.consume(t),le)}function ue(n){return e.exit(`htmlFlow`),t(n)}}function Nr(e,t,n){let r=this;return i;function i(t){return A(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a):n(t)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}function Pr(e,t,n){return r;function r(r){return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),e.attempt(In,t,n)}}var Fr={name:`htmlText`,tokenize:Ir};function Ir(e,t,n){let r=this,i,a,o;return s;function s(t){return e.enter(`htmlText`),e.enter(`htmlTextData`),e.consume(t),c}function c(t){return t===33?(e.consume(t),l):t===47?(e.consume(t),x):t===63?(e.consume(t),y):cn(t)?(e.consume(t),w):n(t)}function l(t){return t===45?(e.consume(t),u):t===91?(e.consume(t),a=0,m):cn(t)?(e.consume(t),v):n(t)}function u(t){return t===45?(e.consume(t),p):n(t)}function d(t){return t===null?n(t):t===45?(e.consume(t),f):A(t)?(o=d,oe(t)):(e.consume(t),d)}function f(t){return t===45?(e.consume(t),p):d(t)}function p(e){return e===62?ae(e):e===45?f(e):d(e)}function m(t){return t===`CDATA[`.charCodeAt(a++)?(e.consume(t),a===6?h:m):n(t)}function h(t){return t===null?n(t):t===93?(e.consume(t),g):A(t)?(o=h,oe(t)):(e.consume(t),h)}function g(t){return t===93?(e.consume(t),_):h(t)}function _(t){return t===62?ae(t):t===93?(e.consume(t),_):h(t)}function v(t){return t===null||t===62?ae(t):A(t)?(o=v,oe(t)):(e.consume(t),v)}function y(t){return t===null?n(t):t===63?(e.consume(t),b):A(t)?(o=y,oe(t)):(e.consume(t),y)}function b(e){return e===62?ae(e):y(e)}function x(t){return cn(t)?(e.consume(t),S):n(t)}function S(t){return t===45||ln(t)?(e.consume(t),S):C(t)}function C(t){return A(t)?(o=C,oe(t)):gn(t)?(e.consume(t),C):ae(t)}function w(t){return t===45||ln(t)?(e.consume(t),w):t===47||t===62||hn(t)?ee(t):n(t)}function ee(t){return t===47?(e.consume(t),ae):t===58||t===95||cn(t)?(e.consume(t),T):A(t)?(o=ee,oe(t)):gn(t)?(e.consume(t),ee):ae(t)}function T(t){return t===45||t===46||t===58||t===95||ln(t)?(e.consume(t),T):te(t)}function te(t){return t===61?(e.consume(t),E):A(t)?(o=te,oe(t)):gn(t)?(e.consume(t),te):ee(t)}function E(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),i=t,ne):A(t)?(o=E,oe(t)):gn(t)?(e.consume(t),E):(e.consume(t),re)}function ne(t){return t===i?(e.consume(t),i=void 0,ie):t===null?n(t):A(t)?(o=ne,oe(t)):(e.consume(t),ne)}function re(t){return t===null||t===34||t===39||t===60||t===61||t===96?n(t):t===47||t===62||hn(t)?ee(t):(e.consume(t),re)}function ie(e){return e===47||e===62||hn(e)?ee(e):n(e)}function ae(r){return r===62?(e.consume(r),e.exit(`htmlTextData`),e.exit(`htmlText`),t):n(r)}function oe(t){return e.exit(`htmlTextData`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),se}function se(t){return gn(t)?xn(e,ce,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):ce(t)}function ce(t){return e.enter(`htmlTextData`),o(t)}}var Lr={name:`labelEnd`,resolveAll:Vr,resolveTo:Hr,tokenize:Ur},Rr={tokenize:Wr},zr={tokenize:Gr},Br={tokenize:Kr};function Vr(e){let t=-1,n=[];for(;++t<e.length;){let r=e[t][1];if(n.push(e[t]),r.type===`labelImage`||r.type===`labelLink`||r.type===`labelEnd`){let e=r.type===`labelImage`?4:2;r.type=`data`,t+=e}}return e.length!==n.length&&$t(e,0,e.length,n),e}function Hr(e,t){let n=e.length,r=0,i,a,o,s;for(;n--;)if(i=e[n][1],a){if(i.type===`link`||i.type===`labelLink`&&i._inactive)break;e[n][0]===`enter`&&i.type===`labelLink`&&(i._inactive=!0)}else if(o){if(e[n][0]===`enter`&&(i.type===`labelImage`||i.type===`labelLink`)&&!i._balanced&&(a=n,i.type!==`labelLink`)){r=2;break}}else i.type===`labelEnd`&&(o=n);let c={type:e[a][1].type===`labelLink`?`link`:`image`,start:{...e[a][1].start},end:{...e[e.length-1][1].end}},l={type:`label`,start:{...e[a][1].start},end:{...e[o][1].end}},u={type:`labelText`,start:{...e[a+r+2][1].end},end:{...e[o-2][1].start}};return s=[[`enter`,c,t],[`enter`,l,t]],s=en(s,e.slice(a+1,a+r+3)),s=en(s,[[`enter`,u,t]]),s=en(s,kn(t.parser.constructs.insideSpan.null,e.slice(a+r+4,o-3),t)),s=en(s,[[`exit`,u,t],e[o-2],e[o-1],[`exit`,l,t]]),s=en(s,e.slice(o+1)),s=en(s,[[`exit`,c,t]]),$t(e,a,e.length,s),e}function Ur(e,t,n){let r=this,i=r.events.length,a,o;for(;i--;)if((r.events[i][1].type===`labelImage`||r.events[i][1].type===`labelLink`)&&!r.events[i][1]._balanced){a=r.events[i][1];break}return s;function s(t){return a?a._inactive?d(t):(o=r.parser.defined.includes(sn(r.sliceSerialize({start:a.end,end:r.now()}))),e.enter(`labelEnd`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelEnd`),c):n(t)}function c(t){return t===40?e.attempt(Rr,u,o?u:d)(t):t===91?e.attempt(zr,u,o?l:d)(t):o?u(t):d(t)}function l(t){return e.attempt(Br,u,d)(t)}function u(e){return t(e)}function d(e){return a._balanced=!0,n(e)}}function Wr(e,t,n){return r;function r(t){return e.enter(`resource`),e.enter(`resourceMarker`),e.consume(t),e.exit(`resourceMarker`),i}function i(t){return hn(t)?gr(e,a)(t):a(t)}function a(t){return t===41?u(t):pr(e,o,s,`resourceDestination`,`resourceDestinationLiteral`,`resourceDestinationLiteralMarker`,`resourceDestinationRaw`,`resourceDestinationString`,32)(t)}function o(t){return hn(t)?gr(e,c)(t):u(t)}function s(e){return n(e)}function c(t){return t===34||t===39||t===40?hr(e,l,n,`resourceTitle`,`resourceTitleMarker`,`resourceTitleString`)(t):u(t)}function l(t){return hn(t)?gr(e,u)(t):u(t)}function u(r){return r===41?(e.enter(`resourceMarker`),e.consume(r),e.exit(`resourceMarker`),e.exit(`resource`),t):n(r)}}function Gr(e,t,n){let r=this;return i;function i(t){return mr.call(r,e,a,o,`reference`,`referenceMarker`,`referenceString`)(t)}function a(e){return r.parser.defined.includes(sn(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?t(e):n(e)}function o(e){return n(e)}}function Kr(e,t,n){return r;function r(t){return e.enter(`reference`),e.enter(`referenceMarker`),e.consume(t),e.exit(`referenceMarker`),i}function i(r){return r===93?(e.enter(`referenceMarker`),e.consume(r),e.exit(`referenceMarker`),e.exit(`reference`),t):n(r)}}var qr={name:`labelStartImage`,resolveAll:Lr.resolveAll,tokenize:Jr};function Jr(e,t,n){let r=this;return i;function i(t){return e.enter(`labelImage`),e.enter(`labelImageMarker`),e.consume(t),e.exit(`labelImageMarker`),a}function a(t){return t===91?(e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelImage`),o):n(t)}function o(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var Yr={name:`labelStartLink`,resolveAll:Lr.resolveAll,tokenize:Xr};function Xr(e,t,n){let r=this;return i;function i(t){return e.enter(`labelLink`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelLink`),a}function a(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var Zr={name:`lineEnding`,tokenize:Qr};function Qr(e,t){return n;function n(n){return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),xn(e,t,`linePrefix`)}}var $r={name:`thematicBreak`,tokenize:ei};function ei(e,t,n){let r=0,i;return a;function a(t){return e.enter(`thematicBreak`),o(t)}function o(e){return i=e,s(e)}function s(a){return a===i?(e.enter(`thematicBreakSequence`),c(a)):r>=3&&(a===null||A(a))?(e.exit(`thematicBreak`),t(a)):n(a)}function c(t){return t===i?(e.consume(t),r++,c):(e.exit(`thematicBreakSequence`),gn(t)?xn(e,s,`whitespace`)(t):s(t))}}var ti={continuation:{tokenize:ai},exit:si,name:`list`,tokenize:ii},ni={partial:!0,tokenize:ci},ri={partial:!0,tokenize:oi};function ii(e,t,n){let r=this,i=r.events[r.events.length-1],a=i&&i[1].type===`linePrefix`?i[2].sliceSerialize(i[1],!0).length:0,o=0;return s;function s(t){let i=r.containerState.type||(t===42||t===43||t===45?`listUnordered`:`listOrdered`);if(i===`listUnordered`?!r.containerState.marker||t===r.containerState.marker:fn(t)){if(r.containerState.type||(r.containerState.type=i,e.enter(i,{_container:!0})),i===`listUnordered`)return e.enter(`listItemPrefix`),t===42||t===45?e.check($r,n,l)(t):l(t);if(!r.interrupt||t===49)return e.enter(`listItemPrefix`),e.enter(`listItemValue`),c(t)}return n(t)}function c(t){return fn(t)&&++o<10?(e.consume(t),c):(!r.interrupt||o<2)&&(r.containerState.marker?t===r.containerState.marker:t===41||t===46)?(e.exit(`listItemValue`),l(t)):n(t)}function l(t){return e.enter(`listItemMarker`),e.consume(t),e.exit(`listItemMarker`),r.containerState.marker=r.containerState.marker||t,e.check(In,r.interrupt?n:u,e.attempt(ni,f,d))}function u(e){return r.containerState.initialBlankLine=!0,a++,f(e)}function d(t){return gn(t)?(e.enter(`listItemPrefixWhitespace`),e.consume(t),e.exit(`listItemPrefixWhitespace`),f):n(t)}function f(n){return r.containerState.size=a+r.sliceSerialize(e.exit(`listItemPrefix`),!0).length,t(n)}}function ai(e,t,n){let r=this;return r.containerState._closeFlow=void 0,e.check(In,i,a);function i(n){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,xn(e,t,`listItemIndent`,r.containerState.size+1)(n)}function a(n){return r.containerState.furtherBlankLines||!gn(n)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,o(n)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,e.attempt(ri,t,o)(n))}function o(i){return r.containerState._closeFlow=!0,r.interrupt=void 0,xn(e,e.attempt(ti,t,n),`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(i)}}function oi(e,t,n){let r=this;return xn(e,i,`listItemIndent`,r.containerState.size+1);function i(e){let i=r.events[r.events.length-1];return i&&i[1].type===`listItemIndent`&&i[2].sliceSerialize(i[1],!0).length===r.containerState.size?t(e):n(e)}}function si(e){e.exit(this.containerState.type)}function ci(e,t,n){let r=this;return xn(e,i,`listItemPrefixWhitespace`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:5);function i(e){let i=r.events[r.events.length-1];return!gn(e)&&i&&i[1].type===`listItemPrefixWhitespace`?t(e):n(e)}}var li={name:`setextUnderline`,resolveTo:ui,tokenize:di};function ui(e,t){let n=e.length,r,i,a;for(;n--;)if(e[n][0]===`enter`){if(e[n][1].type===`content`){r=n;break}e[n][1].type===`paragraph`&&(i=n)}else e[n][1].type===`content`&&e.splice(n,1),!a&&e[n][1].type===`definition`&&(a=n);let o={type:`setextHeading`,start:{...e[r][1].start},end:{...e[e.length-1][1].end}};return e[i][1].type=`setextHeadingText`,a?(e.splice(i,0,[`enter`,o,t]),e.splice(a+1,0,[`exit`,e[r][1],t]),e[r][1].end={...e[a][1].end}):e[r][1]=o,e.push([`exit`,o,t]),e}function di(e,t,n){let r=this,i;return a;function a(t){let a=r.events.length,s;for(;a--;)if(r.events[a][1].type!==`lineEnding`&&r.events[a][1].type!==`linePrefix`&&r.events[a][1].type!==`content`){s=r.events[a][1].type===`paragraph`;break}return!r.parser.lazy[r.now().line]&&(r.interrupt||s)?(e.enter(`setextHeadingLine`),i=t,o(t)):n(t)}function o(t){return e.enter(`setextHeadingLineSequence`),s(t)}function s(t){return t===i?(e.consume(t),s):(e.exit(`setextHeadingLineSequence`),gn(t)?xn(e,c,`lineSuffix`)(t):c(t))}function c(r){return r===null||A(r)?(e.exit(`setextHeadingLine`),t(r)):n(r)}}var fi={tokenize:pi};function pi(e){let t=this,n=e.attempt(In,r,e.attempt(this.parser.constructs.flowInitial,i,xn(e,e.attempt(this.parser.constructs.flow,i,e.attempt(cr,i)),`linePrefix`)));return n;function r(r){if(r===null){e.consume(r);return}return e.enter(`lineEndingBlank`),e.consume(r),e.exit(`lineEndingBlank`),t.currentConstruct=void 0,n}function i(r){if(r===null){e.consume(r);return}return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),t.currentConstruct=void 0,n}}var mi={resolveAll:vi()},hi=_i(`string`),gi=_i(`text`);function _i(e){return{resolveAll:vi(e===`text`?yi:void 0),tokenize:t};function t(t){let n=this,r=this.parser.constructs[e],i=t.attempt(r,a,o);return a;function a(e){return c(e)?i(e):o(e)}function o(e){if(e===null){t.consume(e);return}return t.enter(`data`),t.consume(e),s}function s(e){return c(e)?(t.exit(`data`),i(e)):(t.consume(e),s)}function c(e){if(e===null)return!0;let t=r[e],i=-1;if(t)for(;++i<t.length;){let e=t[i];if(!e.previous||e.previous.call(n,n.previous))return!0}return!1}}}function vi(e){return t;function t(t,n){let r=-1,i;for(;++r<=t.length;)i===void 0?t[r]&&t[r][1].type===`data`&&(i=r,r++):(!t[r]||t[r][1].type!==`data`)&&(r!==i+2&&(t[i][1].end=t[r-1][1].end,t.splice(i+2,r-i-2),r=i+2),i=void 0);return e?e(t,n):t}}function yi(e,t){let n=0;for(;++n<=e.length;)if((n===e.length||e[n][1].type===`lineEnding`)&&e[n-1][1].type===`data`){let r=e[n-1][1],i=t.sliceStream(r),a=i.length,o=-1,s=0,c;for(;a--;){let e=i[a];if(typeof e==`string`){for(o=e.length;e.charCodeAt(o-1)===32;)s++,o--;if(o)break;o=-1}else if(e===-2)c=!0,s++;else if(e!==-1){a++;break}}if(t._contentTypeTextTrailing&&n===e.length&&(s=0),s){let i={type:n===e.length||c||s<2?`lineSuffix`:`hardBreakTrailing`,start:{_bufferIndex:a?o:r.start._bufferIndex+o,_index:r.start._index+a,line:r.end.line,column:r.end.column-s,offset:r.end.offset-s},end:{...r.end}};r.end={...i.start},r.start.offset===r.end.offset?Object.assign(r,i):(e.splice(n,0,[`enter`,i,t],[`exit`,i,t]),n+=2)}n++}return e}var bi=s({attentionMarkers:()=>Oi,contentInitial:()=>Si,disable:()=>ki,document:()=>xi,flow:()=>wi,flowInitial:()=>Ci,insideSpan:()=>Di,string:()=>Ti,text:()=>Ei}),xi={42:ti,43:ti,45:ti,48:ti,49:ti,50:ti,51:ti,52:ti,53:ti,54:ti,55:ti,56:ti,57:ti,62:Rn},Si={91:_r},Ci={[-2]:Xn,[-1]:Xn,32:Xn},wi={35:Cr,42:$r,45:[li,$r],60:Or,61:li,95:$r,96:qn,126:qn},Ti={38:Wn,92:Hn},Ei={[-5]:Zr,[-4]:Zr,[-3]:Zr,33:qr,38:Wn,42:An,60:[Pn,Fr],91:Yr,92:[xr,Hn],93:Lr,95:An,96:er},Di={null:[An,mi]},Oi={null:[42,95]},ki={null:[]};function Ai(e,t,n){let r={_bufferIndex:-1,_index:0,line:n&&n.line||1,column:n&&n.column||1,offset:n&&n.offset||0},i={},a=[],o=[],s=[],c={attempt:C(x),check:C(S),consume:v,enter:y,exit:b,interrupt:C(S,{interrupt:!0})},l={code:null,containerState:{},defineSkip:h,events:[],now:m,parser:e,previous:null,sliceSerialize:f,sliceStream:p,write:d},u=t.tokenize.call(l,c);return t.resolveAll&&a.push(t),l;function d(e){return o=en(o,e),g(),o[o.length-1]===null?(w(t,0),l.events=kn(a,l.events,l),l.events):[]}function f(e,t){return Mi(p(e),t)}function p(e){return ji(o,e)}function m(){let{_bufferIndex:e,_index:t,line:n,column:i,offset:a}=r;return{_bufferIndex:e,_index:t,line:n,column:i,offset:a}}function h(e){i[e.line]=e.column,T()}function g(){let e;for(;r._index<o.length;){let t=o[r._index];if(typeof t==`string`)for(e=r._index,r._bufferIndex<0&&(r._bufferIndex=0);r._index===e&&r._bufferIndex<t.length;)_(t.charCodeAt(r._bufferIndex));else _(t)}}function _(e){u=u(e)}function v(e){A(e)?(r.line++,r.column=1,r.offset+=e===-3?2:1,T()):e!==-1&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===o[r._index].length&&(r._bufferIndex=-1,r._index++)),l.previous=e}function y(e,t){let n=t||{};return n.type=e,n.start=m(),l.events.push([`enter`,n,l]),s.push(n),n}function b(e){let t=s.pop();return t.end=m(),l.events.push([`exit`,t,l]),t}function x(e,t){w(e,t.from)}function S(e,t){t.restore()}function C(e,t){return n;function n(n,r,i){let a,o,s,u;return Array.isArray(n)?f(n):`tokenize`in n?f([n]):d(n);function d(e){return t;function t(t){let n=t!==null&&e[t],r=t!==null&&e.null;return f([...Array.isArray(n)?n:n?[n]:[],...Array.isArray(r)?r:r?[r]:[]])(t)}}function f(e){return a=e,o=0,e.length===0?i:p(e[o])}function p(e){return n;function n(n){return u=ee(),s=e,e.partial||(l.currentConstruct=e),e.name&&l.parser.constructs.disable.null.includes(e.name)?h(n):e.tokenize.call(t?Object.assign(Object.create(l),t):l,c,m,h)(n)}}function m(t){return e(s,u),r}function h(e){return u.restore(),++o<a.length?p(a[o]):i}}}function w(e,t){e.resolveAll&&!a.includes(e)&&a.push(e),e.resolve&&$t(l.events,t,l.events.length-t,e.resolve(l.events.slice(t),l)),e.resolveTo&&(l.events=e.resolveTo(l.events,l))}function ee(){let e=m(),t=l.previous,n=l.currentConstruct,i=l.events.length,a=Array.from(s);return{from:i,restore:o};function o(){r=e,l.previous=t,l.currentConstruct=n,l.events.length=i,s=a,T()}}function T(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}function ji(e,t){let n=t.start._index,r=t.start._bufferIndex,i=t.end._index,a=t.end._bufferIndex,o;if(n===i)o=[e[n].slice(r,a)];else{if(o=e.slice(n,i),r>-1){let e=o[0];typeof e==`string`?o[0]=e.slice(r):o.shift()}a>0&&o.push(e[i].slice(0,a))}return o}function Mi(e,t){let n=-1,r=[],i;for(;++n<e.length;){let a=e[n],o;if(typeof a==`string`)o=a;else switch(a){case-5:o=`\r`;break;case-4:o=`
`;break;case-3:o=`\r
`;break;case-2:o=t?` `:`	`;break;case-1:if(!t&&i)continue;o=` `;break;default:o=String.fromCharCode(a)}i=a===-2,r.push(o)}return r.join(``)}function Ni(e){let t={constructs:nn([bi,...(e||{}).extensions||[]]),content:n(Sn),defined:[],document:n(wn),flow:n(fi),lazy:{},string:n(hi),text:n(gi)};return t;function n(e){return n;function n(n){return Ai(t,e,n)}}}function Pi(e){for(;!or(e););return e}var Fi=/[\0\t\n\r]/g;function Ii(){let e=1,t=``,n=!0,r;return i;function i(i,a,o){let s=[],c,l,u,d,f;for(i=t+(typeof i==`string`?i.toString():new TextDecoder(a||void 0).decode(i)),u=0,t=``,n&&=(i.charCodeAt(0)===65279&&u++,void 0);u<i.length;){if(Fi.lastIndex=u,c=Fi.exec(i),d=c&&c.index!==void 0?c.index:i.length,f=i.charCodeAt(d),!c){t=i.slice(u);break}if(f===10&&u===d&&r)s.push(-3),r=void 0;else switch(r&&=(s.push(-5),void 0),u<d&&(s.push(i.slice(u,d)),e+=d-u),f){case 0:s.push(65533),e++;break;case 9:for(l=Math.ceil(e/4)*4,s.push(-2);e++<l;)s.push(-1);break;case 10:s.push(-4),e=1;break;default:r=!0,e=1}u=d+1}return o&&(r&&s.push(-5),t&&s.push(t),s.push(null)),s}}var Li=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function Ri(e){return e.replace(Li,zi)}function zi(e,t,n){if(t)return t;if(n.charCodeAt(0)===35){let e=n.charCodeAt(1),t=e===120||e===88;return on(n.slice(t?2:1),t?16:10)}return Qt(n)||e}var Bi={}.hasOwnProperty;function Vi(e,t,n){return t&&typeof t==`object`&&(n=t,t=void 0),Hi(n)(Pi(Ni(n).document().write(Ii()(e,t,!0))))}function Hi(e){let t={transforms:[],canContainEols:[`emphasis`,`fragment`,`heading`,`paragraph`,`strong`],enter:{autolink:a(Ee),autolinkProtocol:ee,autolinkEmail:ee,atxHeading:a(Ce),blockQuote:a(ve),characterEscape:ee,characterReference:ee,codeFenced:a(ye),codeFencedFenceInfo:o,codeFencedFenceMeta:o,codeIndented:a(ye,o),codeText:a(be,o),codeTextData:ee,data:ee,codeFlowValue:ee,definition:a(xe),definitionDestinationString:o,definitionLabelString:o,definitionTitleString:o,emphasis:a(Se),hardBreakEscape:a(we),hardBreakTrailing:a(we),htmlFlow:a(Te,o),htmlFlowData:ee,htmlText:a(Te,o),htmlTextData:ee,image:a(O),label:o,link:a(Ee),listItem:a(k),listItemValue:f,listOrdered:a(De,d),listUnordered:a(De),paragraph:a(Oe),reference:de,referenceString:o,resourceDestinationString:o,resourceTitleString:o,setextHeading:a(Ce),strong:a(ke),thematicBreak:a(je)},exit:{atxHeading:c(),atxHeadingSequence:x,autolink:c(),autolinkEmail:_e,autolinkProtocol:ge,blockQuote:c(),characterEscapeValue:T,characterReferenceMarkerHexadecimal:pe,characterReferenceMarkerNumeric:pe,characterReferenceValue:me,characterReference:he,codeFenced:c(g),codeFencedFence:h,codeFencedFenceInfo:p,codeFencedFenceMeta:m,codeFlowValue:T,codeIndented:c(_),codeText:c(ie),codeTextData:T,data:T,definition:c(),definitionDestinationString:b,definitionLabelString:v,definitionTitleString:y,emphasis:c(),hardBreakEscape:c(E),hardBreakTrailing:c(E),htmlFlow:c(ne),htmlFlowData:T,htmlText:c(re),htmlTextData:T,image:c(oe),label:ce,labelText:se,lineEnding:te,link:c(ae),listItem:c(),listOrdered:c(),listUnordered:c(),paragraph:c(),referenceString:fe,resourceDestinationString:D,resourceTitleString:le,resource:ue,setextHeading:c(w),setextHeadingLineSequence:C,setextHeadingText:S,strong:c(),thematicBreak:c()}};Ui(t,(e||{}).mdastExtensions||[]);let n={};return r;function r(e){let r={type:`root`,children:[]},a={stack:[r],tokenStack:[],config:t,enter:s,exit:l,buffer:o,resume:u,data:n},c=[],d=-1;for(;++d<e.length;)(e[d][1].type===`listOrdered`||e[d][1].type===`listUnordered`)&&(e[d][0]===`enter`?c.push(d):d=i(e,c.pop(),d));for(d=-1;++d<e.length;){let n=t[e[d][0]];Bi.call(n,e[d][1].type)&&n[e[d][1].type].call(Object.assign({sliceSerialize:e[d][2].sliceSerialize},a),e[d][1])}if(a.tokenStack.length>0){let e=a.tokenStack[a.tokenStack.length-1];(e[1]||Gi).call(a,void 0,e[0])}for(r.position={start:j(e.length>0?e[0][1].start:{line:1,column:1,offset:0}),end:j(e.length>0?e[e.length-2][1].end:{line:1,column:1,offset:0})},d=-1;++d<t.transforms.length;)r=t.transforms[d](r)||r;return r}function i(e,t,n){let r=t-1,i=-1,a=!1,o,s,c,l;for(;++r<=n;){let t=e[r];switch(t[1].type){case`listUnordered`:case`listOrdered`:case`blockQuote`:t[0]===`enter`?i++:i--,l=void 0;break;case`lineEndingBlank`:t[0]===`enter`&&(o&&!l&&!i&&!c&&(c=r),l=void 0);break;case`linePrefix`:case`listItemValue`:case`listItemMarker`:case`listItemPrefix`:case`listItemPrefixWhitespace`:break;default:l=void 0}if(!i&&t[0]===`enter`&&t[1].type===`listItemPrefix`||i===-1&&t[0]===`exit`&&(t[1].type===`listUnordered`||t[1].type===`listOrdered`)){if(o){let i=r;for(s=void 0;i--;){let t=e[i];if(t[1].type===`lineEnding`||t[1].type===`lineEndingBlank`){if(t[0]===`exit`)continue;s&&(e[s][1].type=`lineEndingBlank`,a=!0),t[1].type=`lineEnding`,s=i}else if(!(t[1].type===`linePrefix`||t[1].type===`blockQuotePrefix`||t[1].type===`blockQuotePrefixWhitespace`||t[1].type===`blockQuoteMarker`||t[1].type===`listItemIndent`))break}c&&(!s||c<s)&&(o._spread=!0),o.end=Object.assign({},s?e[s][1].start:t[1].end),e.splice(s||r,0,[`exit`,o,t[2]]),r++,n++}if(t[1].type===`listItemPrefix`){let i={type:`listItem`,_spread:!1,start:Object.assign({},t[1].start),end:void 0};o=i,e.splice(r,0,[`enter`,i,t[2]]),r++,n++,c=void 0,l=!0}}}return e[t][1]._spread=a,n}function a(e,t){return n;function n(n){s.call(this,e(n),n),t&&t.call(this,n)}}function o(){this.stack.push({type:`fragment`,children:[]})}function s(e,t,n){this.stack[this.stack.length-1].children.push(e),this.stack.push(e),this.tokenStack.push([t,n||void 0]),e.position={start:j(t.start),end:void 0}}function c(e){return t;function t(t){e&&e.call(this,t),l.call(this,t)}}function l(e,t){let n=this.stack.pop(),r=this.tokenStack.pop();if(r)r[0].type!==e.type&&(t?t.call(this,e,r[0]):(r[1]||Gi).call(this,e,r[0]));else throw Error("Cannot close `"+e.type+"` ("+lt({start:e.start,end:e.end})+`): it’s not open`);n.position.end=j(e.end)}function u(){return qt(this.stack.pop())}function d(){this.data.expectingFirstListItemValue=!0}function f(e){if(this.data.expectingFirstListItemValue){let t=this.stack[this.stack.length-2];t.start=Number.parseInt(this.sliceSerialize(e),10),this.data.expectingFirstListItemValue=void 0}}function p(){let e=this.resume(),t=this.stack[this.stack.length-1];t.lang=e}function m(){let e=this.resume(),t=this.stack[this.stack.length-1];t.meta=e}function h(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function g(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,``),this.data.flowCodeInside=void 0}function _(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/(\r?\n|\r)$/g,``)}function v(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=sn(this.sliceSerialize(e)).toLowerCase()}function y(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function b(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function x(e){let t=this.stack[this.stack.length-1];t.depth||=this.sliceSerialize(e).length}function S(){this.data.setextHeadingSlurpLineEnding=!0}function C(e){let t=this.stack[this.stack.length-1];t.depth=this.sliceSerialize(e).codePointAt(0)===61?1:2}function w(){this.data.setextHeadingSlurpLineEnding=void 0}function ee(e){let t=this.stack[this.stack.length-1].children,n=t[t.length-1];(!n||n.type!==`text`)&&(n=Ae(),n.position={start:j(e.start),end:void 0},t.push(n)),this.stack.push(n)}function T(e){let t=this.stack.pop();t.value+=this.sliceSerialize(e),t.position.end=j(e.end)}function te(e){let n=this.stack[this.stack.length-1];if(this.data.atHardBreak){let t=n.children[n.children.length-1];t.position.end=j(e.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&t.canContainEols.includes(n.type)&&(ee.call(this,e),T.call(this,e))}function E(){this.data.atHardBreak=!0}function ne(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function re(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function ie(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function ae(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function oe(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function se(e){let t=this.sliceSerialize(e),n=this.stack[this.stack.length-2];n.label=Ri(t),n.identifier=sn(t).toLowerCase()}function ce(){let e=this.stack[this.stack.length-1],t=this.resume(),n=this.stack[this.stack.length-1];this.data.inReference=!0,n.type===`link`?n.children=e.children:n.alt=t}function D(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function le(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function ue(){this.data.inReference=void 0}function de(){this.data.referenceType=`collapsed`}function fe(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=sn(this.sliceSerialize(e)).toLowerCase(),this.data.referenceType=`full`}function pe(e){this.data.characterReferenceType=e.type}function me(e){let t=this.sliceSerialize(e),n=this.data.characterReferenceType,r;n?(r=on(t,n===`characterReferenceMarkerNumeric`?10:16),this.data.characterReferenceType=void 0):r=Qt(t);let i=this.stack[this.stack.length-1];i.value+=r}function he(e){let t=this.stack.pop();t.position.end=j(e.end)}function ge(e){T.call(this,e);let t=this.stack[this.stack.length-1];t.url=this.sliceSerialize(e)}function _e(e){T.call(this,e);let t=this.stack[this.stack.length-1];t.url=`mailto:`+this.sliceSerialize(e)}function ve(){return{type:`blockquote`,children:[]}}function ye(){return{type:`code`,lang:null,meta:null,value:``}}function be(){return{type:`inlineCode`,value:``}}function xe(){return{type:`definition`,identifier:``,label:null,title:null,url:``}}function Se(){return{type:`emphasis`,children:[]}}function Ce(){return{type:`heading`,depth:0,children:[]}}function we(){return{type:`break`}}function Te(){return{type:`html`,value:``}}function O(){return{type:`image`,title:null,url:``,alt:null}}function Ee(){return{type:`link`,title:null,url:``,children:[]}}function De(e){return{type:`list`,ordered:e.type===`listOrdered`,start:null,spread:e._spread,children:[]}}function k(e){return{type:`listItem`,spread:e._spread,checked:null,children:[]}}function Oe(){return{type:`paragraph`,children:[]}}function ke(){return{type:`strong`,children:[]}}function Ae(){return{type:`text`,value:``}}function je(){return{type:`thematicBreak`}}}function j(e){return{line:e.line,column:e.column,offset:e.offset}}function Ui(e,t){let n=-1;for(;++n<t.length;){let r=t[n];Array.isArray(r)?Ui(e,r):Wi(e,r)}}function Wi(e,t){let n;for(n in t)if(Bi.call(t,n))switch(n){case`canContainEols`:{let r=t[n];r&&e[n].push(...r);break}case`transforms`:{let r=t[n];r&&e[n].push(...r);break}case`enter`:case`exit`:{let r=t[n];r&&Object.assign(e[n],r);break}}}function Gi(e,t){throw Error(e?"Cannot close `"+e.type+"` ("+lt({start:e.start,end:e.end})+"): a different token (`"+t.type+"`, "+lt({start:t.start,end:t.end})+`) is open`:"Cannot close document, a token (`"+t.type+"`, "+lt({start:t.start,end:t.end})+`) is still open`)}function Ki(e){let t=this;t.parser=n;function n(n){return Vi(n,{...t.data(`settings`),...e,extensions:t.data(`micromarkExtensions`)||[],mdastExtensions:t.data(`fromMarkdownExtensions`)||[]})}}function qi(e,t){let n={type:`element`,tagName:`blockquote`,properties:{},children:e.wrap(e.all(t),!0)};return e.patch(t,n),e.applyData(t,n)}function Ji(e,t){let n={type:`element`,tagName:`br`,properties:{},children:[]};return e.patch(t,n),[e.applyData(t,n),{type:`text`,value:`
`}]}function Yi(e,t){let n=t.value?t.value+`
`:``,r={},i=t.lang?t.lang.split(/\s+/):[];i.length>0&&(r.className=[`language-`+i[0]]);let a={type:`element`,tagName:`code`,properties:r,children:[{type:`text`,value:n}]};return t.meta&&(a.data={meta:t.meta}),e.patch(t,a),a=e.applyData(t,a),a={type:`element`,tagName:`pre`,properties:{},children:[a]},e.patch(t,a),a}function Xi(e,t){let n={type:`element`,tagName:`del`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Zi(e,t){let n={type:`element`,tagName:`em`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Qi(e,t){let n=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,r=String(t.identifier).toUpperCase(),i=bn(r.toLowerCase()),a=e.footnoteOrder.indexOf(r),o,s=e.footnoteCounts.get(r);s===void 0?(s=0,e.footnoteOrder.push(r),o=e.footnoteOrder.length):o=a+1,s+=1,e.footnoteCounts.set(r,s);let c={type:`element`,tagName:`a`,properties:{href:`#`+n+`fn-`+i,id:n+`fnref-`+i+(s>1?`-`+s:``),dataFootnoteRef:!0,ariaDescribedBy:[`footnote-label`]},children:[{type:`text`,value:String(o)}]};e.patch(t,c);let l={type:`element`,tagName:`sup`,properties:{},children:[c]};return e.patch(t,l),e.applyData(t,l)}function $i(e,t){let n={type:`element`,tagName:`h`+t.depth,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function ea(e,t){if(e.options.allowDangerousHtml){let n={type:`raw`,value:t.value};return e.patch(t,n),e.applyData(t,n)}}function ta(e,t){let n=t.referenceType,r=`]`;if(n===`collapsed`?r+=`[]`:n===`full`&&(r+=`[`+(t.label||t.identifier)+`]`),t.type===`imageReference`)return[{type:`text`,value:`![`+t.alt+r}];let i=e.all(t),a=i[0];a&&a.type===`text`?a.value=`[`+a.value:i.unshift({type:`text`,value:`[`});let o=i[i.length-1];return o&&o.type===`text`?o.value+=r:i.push({type:`text`,value:r}),i}function na(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return ta(e,t);let i={src:bn(r.url||``),alt:t.alt};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`img`,properties:i,children:[]};return e.patch(t,a),e.applyData(t,a)}function ra(e,t){let n={src:bn(t.url)};t.alt!==null&&t.alt!==void 0&&(n.alt=t.alt),t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`img`,properties:n,children:[]};return e.patch(t,r),e.applyData(t,r)}function ia(e,t){let n={type:`text`,value:t.value.replace(/\r?\n|\r/g,` `)};e.patch(t,n);let r={type:`element`,tagName:`code`,properties:{},children:[n]};return e.patch(t,r),e.applyData(t,r)}function aa(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return ta(e,t);let i={href:bn(r.url||``)};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`a`,properties:i,children:e.all(t)};return e.patch(t,a),e.applyData(t,a)}function oa(e,t){let n={href:bn(t.url)};t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`a`,properties:n,children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function sa(e,t,n){let r=e.all(t),i=n?ca(n):la(t),a={},o=[];if(typeof t.checked==`boolean`){let e=r[0],n;e&&e.type===`element`&&e.tagName===`p`?n=e:(n={type:`element`,tagName:`p`,properties:{},children:[]},r.unshift(n)),n.children.length>0&&n.children.unshift({type:`text`,value:` `}),n.children.unshift({type:`element`,tagName:`input`,properties:{type:`checkbox`,checked:t.checked,disabled:!0},children:[]}),a.className=[`task-list-item`]}let s=-1;for(;++s<r.length;){let e=r[s];(i||s!==0||e.type!==`element`||e.tagName!==`p`)&&o.push({type:`text`,value:`
`}),e.type===`element`&&e.tagName===`p`&&!i?o.push(...e.children):o.push(e)}let c=r[r.length-1];c&&(i||c.type!==`element`||c.tagName!==`p`)&&o.push({type:`text`,value:`
`});let l={type:`element`,tagName:`li`,properties:a,children:o};return e.patch(t,l),e.applyData(t,l)}function ca(e){let t=!1;if(e.type===`list`){t=e.spread||!1;let n=e.children,r=-1;for(;!t&&++r<n.length;)t=la(n[r])}return t}function la(e){return e.spread??e.children.length>1}function ua(e,t){let n={},r=e.all(t),i=-1;for(typeof t.start==`number`&&t.start!==1&&(n.start=t.start);++i<r.length;){let e=r[i];if(e.type===`element`&&e.tagName===`li`&&e.properties&&Array.isArray(e.properties.className)&&e.properties.className.includes(`task-list-item`)){n.className=[`contains-task-list`];break}}let a={type:`element`,tagName:t.ordered?`ol`:`ul`,properties:n,children:e.wrap(r,!0)};return e.patch(t,a),e.applyData(t,a)}function da(e,t){let n={type:`element`,tagName:`p`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function fa(e,t){let n={type:`root`,children:e.wrap(e.all(t))};return e.patch(t,n),e.applyData(t,n)}function pa(e,t){let n={type:`element`,tagName:`strong`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function ma(e,t){let n=e.all(t),r=n.shift(),i=[];if(r){let n={type:`element`,tagName:`thead`,properties:{},children:e.wrap([r],!0)};e.patch(t.children[0],n),i.push(n)}if(n.length>0){let r={type:`element`,tagName:`tbody`,properties:{},children:e.wrap(n,!0)},a=ot(t.children[1]),o=at(t.children[t.children.length-1]);a&&o&&(r.position={start:a,end:o}),i.push(r)}let a={type:`element`,tagName:`table`,properties:{},children:e.wrap(i,!0)};return e.patch(t,a),e.applyData(t,a)}function ha(e,t,n){let r=n?n.children:void 0,i=(r?r.indexOf(t):1)===0?`th`:`td`,a=n&&n.type===`table`?n.align:void 0,o=a?a.length:t.children.length,s=-1,c=[];for(;++s<o;){let n=t.children[s],r={},o=a?a[s]:void 0;o&&(r.align=o);let l={type:`element`,tagName:i,properties:r,children:[]};n&&(l.children=e.all(n),e.patch(n,l),l=e.applyData(n,l)),c.push(l)}let l={type:`element`,tagName:`tr`,properties:{},children:e.wrap(c,!0)};return e.patch(t,l),e.applyData(t,l)}function ga(e,t){let n={type:`element`,tagName:`td`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}var _a=9,va=32;function ya(e){let t=String(e),n=/\r?\n|\r/g,r=n.exec(t),i=0,a=[];for(;r;)a.push(ba(t.slice(i,r.index),i>0,!0),r[0]),i=r.index+r[0].length,r=n.exec(t);return a.push(ba(t.slice(i),i>0,!1)),a.join(``)}function ba(e,t,n){let r=0,i=e.length;if(t){let t=e.codePointAt(r);for(;t===_a||t===va;)r++,t=e.codePointAt(r)}if(n){let t=e.codePointAt(i-1);for(;t===_a||t===va;)i--,t=e.codePointAt(i-1)}return i>r?e.slice(r,i):``}function xa(e,t){let n={type:`text`,value:ya(String(t.value))};return e.patch(t,n),e.applyData(t,n)}function Sa(e,t){let n={type:`element`,tagName:`hr`,properties:{},children:[]};return e.patch(t,n),e.applyData(t,n)}var Ca={blockquote:qi,break:Ji,code:Yi,delete:Xi,emphasis:Zi,footnoteReference:Qi,heading:$i,html:ea,imageReference:na,image:ra,inlineCode:ia,linkReference:aa,link:oa,listItem:sa,list:ua,paragraph:da,root:fa,strong:pa,table:ma,tableCell:ga,tableRow:ha,text:xa,thematicBreak:Sa,toml:wa,yaml:wa,definition:wa,footnoteDefinition:wa};function wa(){}var{defineProperty:Ta}=Object,Ea=typeof self==`object`?self:globalThis,Da=(e,t)=>{switch(e){case`Function`:case`SharedWorker`:case`Worker`:case`eval`:case`setInterval`:case`setTimeout`:throw TypeError(`unable to deserialize `+e)}return new Ea[e](t)},Oa=(e,t)=>{let n=(t,n)=>(e.set(n,t),t),r=i=>{if(e.has(i))return e.get(i);let[a,o]=t[i];switch(a){case 0:case-1:return n(o,i);case 1:{let e=n([],i);for(let t of o)e.push(r(t));return e}case 2:{let e=n({},i);for(let[t,n]of o){let i=r(t),a=r(n);i===`__proto__`?Ta(e,i,{value:a,configurable:!0,enumerable:!0,writable:!0}):e[i]=a}return e}case 3:return n(new Date(o),i);case 4:{let{source:e,flags:t}=o;return n(new RegExp(e,t),i)}case 5:{let e=n(new Map,i);for(let[t,n]of o)e.set(r(t),r(n));return e}case 6:{let e=n(new Set,i);for(let t of o)e.add(r(t));return e}case 7:{let{name:e,message:t}=o;return n(typeof Ea[e]==`function`?Da(e,t):Error(t),i)}case 8:return n(BigInt(o),i);case`BigInt`:return n(Object(BigInt(o)),i);case`ArrayBuffer`:return n(new Uint8Array(o).buffer,o);case`DataView`:{let{buffer:e}=new Uint8Array(o);return n(new DataView(e),o)}case`-0`:return-0}return n(Da(a,o),i)};return r},ka=e=>Oa(new Map,e)(0),Aa=``,{toString:ja}={},{keys:Ma,is:Na}=Object,Pa=e=>{let t=typeof e;if(t!==`object`||!e)return[0,t];let n=ja.call(e).slice(8,-1);switch(n){case`Array`:return[1,Aa];case`Object`:return[2,Aa];case`Date`:return[3,Aa];case`RegExp`:return[4,Aa];case`Map`:return[5,Aa];case`Set`:return[6,Aa];case`DataView`:return[1,n]}return n.includes(`Array`)?[1,n]:e instanceof Error?[7,e.name||`Error`]:[2,n]},Fa=([e,t])=>e===0&&(t===`function`||t===`symbol`),Ia=(e,t,n,r)=>{let i=(e,t)=>{let i=r.push(e)-1;return n.set(t,i),i},a=o=>{if(n.has(o))return n.get(o);let[s,c]=Pa(o);switch(s){case 0:{let t=o;switch(c){case`bigint`:s=8,t=o.toString();break;case`number`:if(!o&&Na(o,-0))return r.push([`-0`])-1;break;case`function`:case`symbol`:if(e)throw TypeError(`unable to serialize `+c);t=null;break;case`undefined`:return i([-1],o)}return i([s,t],o)}case 1:{if(c){let e=o;return c===`DataView`?e=new Uint8Array(o.buffer):c===`ArrayBuffer`&&(e=new Uint8Array(o)),i([c,[...e]],o)}let e=[],t=i([s,e],o);for(let t of o)e.push(a(t));return t}case 2:{if(c)switch(c){case`BigInt`:return i([c,o.toString()],o);case`Boolean`:case`Number`:case`String`:return i([c,o.valueOf()],o)}if(t&&`toJSON`in o)return a(o.toJSON());let n=[],r=i([s,n],o);for(let t of Ma(o))(e||!Fa(Pa(o[t])))&&n.push([a(t),a(o[t])]);return r}case 3:return i([s,isNaN(o.getTime())?Aa:o.toISOString()],o);case 4:{let{source:e,flags:t}=o;return i([s,{source:e,flags:t}],o)}case 5:{let t=[],n=i([s,t],o);for(let[n,r]of o)(e||!(Fa(Pa(n))||Fa(Pa(r))))&&t.push([a(n),a(r)]);return n}case 6:{let t=[],n=i([s,t],o);for(let n of o)(e||!Fa(Pa(n)))&&t.push(a(n));return n}}let{message:l}=o;return i([s,{name:c,message:l}],o)};return a},La=(e,{json:t,lossy:n}={})=>{let r=[];return Ia(!(t||n),!!t,new Map,r)(e),r},Ra=typeof structuredClone==`function`?(e,t)=>t&&(`json`in t||`lossy`in t)?ka(La(e,t)):structuredClone(e):(e,t)=>ka(La(e,t));function za(e,t){let n=[{type:`text`,value:`↩`}];return t>1&&n.push({type:`element`,tagName:`sup`,properties:{},children:[{type:`text`,value:String(t)}]}),n}function Ba(e,t){return`Back to reference `+(e+1)+(t>1?`-`+t:``)}function Va(e){let t=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,n=e.options.footnoteBackContent||za,r=e.options.footnoteBackLabel||Ba,i=e.options.footnoteLabel||`Footnotes`,a=e.options.footnoteLabelTagName||`h2`,o=e.options.footnoteLabelProperties||{className:[`sr-only`]},s=[],c=-1;for(;++c<e.footnoteOrder.length;){let i=e.footnoteById.get(e.footnoteOrder[c]);if(!i)continue;let a=e.all(i),o=String(i.identifier).toUpperCase(),l=bn(o.toLowerCase()),u=0,d=[],f=e.footnoteCounts.get(o);for(;f!==void 0&&++u<=f;){d.length>0&&d.push({type:`text`,value:` `});let e=typeof n==`string`?n:n(c,u);typeof e==`string`&&(e={type:`text`,value:e}),d.push({type:`element`,tagName:`a`,properties:{href:`#`+t+`fnref-`+l+(u>1?`-`+u:``),dataFootnoteBackref:``,ariaLabel:typeof r==`string`?r:r(c,u),className:[`data-footnote-backref`]},children:Array.isArray(e)?e:[e]})}let p=a[a.length-1];if(p&&p.type===`element`&&p.tagName===`p`){let e=p.children[p.children.length-1];e&&e.type===`text`?e.value+=` `:p.children.push({type:`text`,value:` `}),p.children.push(...d)}else a.push(...d);let m={type:`element`,tagName:`li`,properties:{id:t+`fn-`+l},children:e.wrap(a,!0)};e.patch(i,m),s.push(m)}if(s.length!==0)return{type:`element`,tagName:`section`,properties:{dataFootnotes:!0,className:[`footnotes`]},children:[{type:`element`,tagName:a,properties:{...Ra(o),id:`footnote-label`},children:[{type:`text`,value:i}]},{type:`text`,value:`
`},{type:`element`,tagName:`ol`,properties:{},children:e.wrap(s,!0)},{type:`text`,value:`
`}]}}var Ha=(function(e){if(e==null)return qa;if(typeof e==`function`)return Ka(e);if(typeof e==`object`)return Array.isArray(e)?Ua(e):Wa(e);if(typeof e==`string`)return Ga(e);throw Error(`Expected function, string, or object as test`)});function Ua(e){let t=[],n=-1;for(;++n<e.length;)t[n]=Ha(e[n]);return Ka(r);function r(...e){let n=-1;for(;++n<t.length;)if(t[n].apply(this,e))return!0;return!1}}function Wa(e){let t=e;return Ka(n);function n(n){let r=n,i;for(i in e)if(r[i]!==t[i])return!1;return!0}}function Ga(e){return Ka(t);function t(t){return t&&t.type===e}}function Ka(e){return t;function t(t,n,r){return!!(Ja(t)&&e.call(this,t,typeof n==`number`?n:void 0,r||void 0))}}function qa(){return!0}function Ja(e){return typeof e==`object`&&!!e&&`type`in e}function Ya(e){return e}var Xa=[],Za=`skip`;function Qa(e,t,n,r){let i;typeof t==`function`&&typeof n!=`function`?(r=n,n=t):i=t;let a=Ha(i),o=r?-1:1;s(e,void 0,[])();function s(e,i,c){let l=e&&typeof e==`object`?e:{};if(typeof l.type==`string`){let t=typeof l.tagName==`string`?l.tagName:typeof l.name==`string`?l.name:void 0;Object.defineProperty(u,`name`,{value:`node (`+Ya(e.type+(t?`<`+t+`>`:``))+`)`})}return u;function u(){let l=Xa,u,d,f;if((!t||a(e,i,c[c.length-1]||void 0))&&(l=$a(n(e,c)),l[0]===!1))return l;if(`children`in e&&e.children){let t=e;if(t.children&&l[0]!==`skip`)for(d=(r?t.children.length:-1)+o,f=c.concat(t);d>-1&&d<t.children.length;){let e=t.children[d];if(u=s(e,d,f)(),u[0]===!1)return u;d=typeof u[1]==`number`?u[1]:d+o}}return l}}}function $a(e){return Array.isArray(e)?e:typeof e==`number`?[!0,e]:e==null?Xa:[e]}function eo(e,t,n,r){let i,a,o;typeof t==`function`&&typeof n!=`function`?(a=void 0,o=t,i=n):(a=t,o=n,i=r),Qa(e,a,s,i);function s(e,t){let n=t[t.length-1],r=n?n.children.indexOf(e):void 0;return o(e,r,n)}}var to={}.hasOwnProperty,no={};function ro(e,t){let n=t||no,r=new Map,i=new Map,a={all:s,applyData:ao,definitionById:r,footnoteById:i,footnoteCounts:new Map,footnoteOrder:[],handlers:{...Ca,...n.handlers},one:o,options:n,patch:io,wrap:so};return eo(e,function(e){if(e.type===`definition`||e.type===`footnoteDefinition`){let t=e.type===`definition`?r:i,n=String(e.identifier).toUpperCase();t.has(n)||t.set(n,e)}}),a;function o(e,t){let n=e.type,r=a.handlers[n];if(to.call(a.handlers,n)&&r)return r(a,e,t);if(a.options.passThrough&&a.options.passThrough.includes(n)){if(`children`in e){let{children:t,...n}=e,r=Ra(n);return r.children=a.all(e),r}return Ra(e)}return(a.options.unknownHandler||oo)(a,e,t)}function s(e){let t=[];if(`children`in e){let n=e.children,r=-1;for(;++r<n.length;){let i=a.one(n[r],e);if(i){if(r&&n[r-1].type===`break`&&(!Array.isArray(i)&&i.type===`text`&&(i.value=co(i.value)),!Array.isArray(i)&&i.type===`element`)){let e=i.children[0];e&&e.type===`text`&&(e.value=co(e.value))}Array.isArray(i)?t.push(...i):t.push(i)}}}return t}}function io(e,t){e.position&&(t.position=ct(e))}function ao(e,t){let n=t;if(e&&e.data){let t=e.data.hName,r=e.data.hChildren,i=e.data.hProperties;typeof t==`string`&&(n.type===`element`?n.tagName=t:n={type:`element`,tagName:t,properties:{},children:`children`in n?n.children:[n]}),n.type===`element`&&i&&Object.assign(n.properties,Ra(i)),`children`in n&&n.children&&r!=null&&(n.children=r)}return n}function oo(e,t){let n=t.data||{},r=`value`in t&&!(to.call(n,`hProperties`)||to.call(n,`hChildren`))?{type:`text`,value:t.value}:{type:`element`,tagName:`div`,properties:{},children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function so(e,t){let n=[],r=-1;for(t&&n.push({type:`text`,value:`
`});++r<e.length;)r&&n.push({type:`text`,value:`
`}),n.push(e[r]);return t&&e.length>0&&n.push({type:`text`,value:`
`}),n}function co(e){let t=0,n=e.charCodeAt(t);for(;n===9||n===32;)t++,n=e.charCodeAt(t);return e.slice(t)}function lo(e,t){let n=ro(e,t),r=n.one(e,void 0),i=Va(n),a=Array.isArray(r)?{type:`root`,children:r}:r||{type:`root`,children:[]};return i&&(`children`in a,a.children.push({type:`text`,value:`
`},i)),a}function uo(e,t){return e&&`run`in e?async function(n,r){let i=lo(n,{file:r,...t});await e.run(i,r)}:function(n,r){return lo(n,{file:r,...e||t})}}function fo(e){if(e)throw e}var po=o(((e,t)=>{var n=Object.prototype.hasOwnProperty,r=Object.prototype.toString,i=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=function(e){return typeof Array.isArray==`function`?Array.isArray(e):r.call(e)===`[object Array]`},s=function(e){if(!e||r.call(e)!==`[object Object]`)return!1;var t=n.call(e,`constructor`),i=e.constructor&&e.constructor.prototype&&n.call(e.constructor.prototype,`isPrototypeOf`);if(e.constructor&&!t&&!i)return!1;for(var a in e);return a===void 0||n.call(e,a)},c=function(e,t){i&&t.name===`__proto__`?i(e,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):e[t.name]=t.newValue},l=function(e,t){if(t===`__proto__`){if(!n.call(e,t))return;if(a)return a(e,t).value}return e[t]};t.exports=function e(){var t,n,r,i,a,u,d=arguments[0],f=1,p=arguments.length,m=!1;for(typeof d==`boolean`&&(m=d,d=arguments[1]||{},f=2),(d==null||typeof d!=`object`&&typeof d!=`function`)&&(d={});f<p;++f)if(t=arguments[f],t!=null)for(n in t)r=l(d,n),i=l(t,n),d!==i&&(m&&i&&(s(i)||(a=o(i)))?(a?(a=!1,u=r&&o(r)?r:[]):u=r&&s(r)?r:{},c(d,{name:n,newValue:e(m,u,i)})):i!==void 0&&c(d,{name:n,newValue:i}));return d}}));function mo(e){if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)}function ho(){let e=[],t={run:n,use:r};return t;function n(...t){let n=-1,r=t.pop();if(typeof r!=`function`)throw TypeError(`Expected function as last argument, not `+r);i(null,...t);function i(a,...o){let s=e[++n],c=-1;if(a){r(a);return}for(;++c<t.length;)(o[c]===null||o[c]===void 0)&&(o[c]=t[c]);t=o,s?go(s,i)(...o):r(null,...o)}}function r(n){if(typeof n!=`function`)throw TypeError("Expected `middelware` to be a function, not "+n);return e.push(n),t}}function go(e,t){let n;return r;function r(...t){let r=e.length>t.length,o;r&&t.push(i);try{o=e.apply(this,t)}catch(e){let t=e;if(r&&n)throw t;return i(t)}r||(o&&o.then&&typeof o.then==`function`?o.then(a,i):o instanceof Error?i(o):a(o))}function i(e,...r){n||(n=!0,t(e,...r))}function a(e){i(null,e)}}var _o={basename:vo,dirname:yo,extname:bo,join:xo,sep:`/`};function vo(e,t){if(t!==void 0&&typeof t!=`string`)throw TypeError(`"ext" argument must be a string`);Co(e);let n=0,r=-1,i=e.length,a;if(t===void 0||t.length===0||t.length>e.length){for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else r<0&&(a=!0,r=i+1);return r<0?``:e.slice(n,r)}if(t===e)return``;let o=-1,s=t.length-1;for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else o<0&&(a=!0,o=i+1),s>-1&&(e.codePointAt(i)===t.codePointAt(s--)?s<0&&(r=i):(s=-1,r=o));return n===r?r=o:r<0&&(r=e.length),e.slice(n,r)}function yo(e){if(Co(e),e.length===0)return`.`;let t=-1,n=e.length,r;for(;--n;)if(e.codePointAt(n)===47){if(r){t=n;break}}else r||=!0;return t<0?e.codePointAt(0)===47?`/`:`.`:t===1&&e.codePointAt(0)===47?`//`:e.slice(0,t)}function bo(e){Co(e);let t=e.length,n=-1,r=0,i=-1,a=0,o;for(;t--;){let s=e.codePointAt(t);if(s===47){if(o){r=t+1;break}continue}n<0&&(o=!0,n=t+1),s===46?i<0?i=t:a!==1&&(a=1):i>-1&&(a=-1)}return i<0||n<0||a===0||a===1&&i===n-1&&i===r+1?``:e.slice(i,n)}function xo(...e){let t=-1,n;for(;++t<e.length;)Co(e[t]),e[t]&&(n=n===void 0?e[t]:n+`/`+e[t]);return n===void 0?`.`:M(n)}function M(e){Co(e);let t=e.codePointAt(0)===47,n=So(e,!t);return n.length===0&&!t&&(n=`.`),n.length>0&&e.codePointAt(e.length-1)===47&&(n+=`/`),t?`/`+n:n}function So(e,t){let n=``,r=0,i=-1,a=0,o=-1,s,c;for(;++o<=e.length;){if(o<e.length)s=e.codePointAt(o);else if(s===47)break;else s=47;if(s===47){if(!(i===o-1||a===1))if(i!==o-1&&a===2){if(n.length<2||r!==2||n.codePointAt(n.length-1)!==46||n.codePointAt(n.length-2)!==46){if(n.length>2){if(c=n.lastIndexOf(`/`),c!==n.length-1){c<0?(n=``,r=0):(n=n.slice(0,c),r=n.length-1-n.lastIndexOf(`/`)),i=o,a=0;continue}}else if(n.length>0){n=``,r=0,i=o,a=0;continue}}t&&(n=n.length>0?n+`/..`:`..`,r=2)}else n.length>0?n+=`/`+e.slice(i+1,o):n=e.slice(i+1,o),r=o-i-1;i=o,a=0}else s===46&&a>-1?a++:a=-1}return n}function Co(e){if(typeof e!=`string`)throw TypeError(`Path must be a string. Received `+JSON.stringify(e))}var wo={cwd:To};function To(){return`/`}function Eo(e){return!!(typeof e==`object`&&e&&`href`in e&&e.href&&`protocol`in e&&e.protocol&&e.auth===void 0)}function Do(e){if(typeof e==`string`)e=new URL(e);else if(!Eo(e)){let t=TypeError('The "path" argument must be of type string or an instance of URL. Received `'+e+"`");throw t.code=`ERR_INVALID_ARG_TYPE`,t}if(e.protocol!==`file:`){let e=TypeError(`The URL must be of scheme file`);throw e.code=`ERR_INVALID_URL_SCHEME`,e}return Oo(e)}function Oo(e){if(e.hostname!==``){let e=TypeError(`File URL host must be "localhost" or empty on darwin`);throw e.code=`ERR_INVALID_FILE_URL_HOST`,e}let t=e.pathname,n=-1;for(;++n<t.length;)if(t.codePointAt(n)===37&&t.codePointAt(n+1)===50){let e=t.codePointAt(n+2);if(e===70||e===102){let e=TypeError(`File URL path must not include encoded / characters`);throw e.code=`ERR_INVALID_FILE_URL_PATH`,e}}return decodeURIComponent(t)}var ko=[`history`,`path`,`basename`,`stem`,`extname`,`dirname`],Ao=class{constructor(e){let t;t=e?Eo(e)?{path:e}:typeof e==`string`||Po(e)?{value:e}:e:{},this.cwd=`cwd`in t?``:wo.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let n=-1;for(;++n<ko.length;){let e=ko[n];e in t&&t[e]!==void 0&&t[e]!==null&&(this[e]=e===`history`?[...t[e]]:t[e])}let r;for(r in t)ko.includes(r)||(this[r]=t[r])}get basename(){return typeof this.path==`string`?_o.basename(this.path):void 0}set basename(e){Mo(e,`basename`),jo(e,`basename`),this.path=_o.join(this.dirname||``,e)}get dirname(){return typeof this.path==`string`?_o.dirname(this.path):void 0}set dirname(e){No(this.basename,`dirname`),this.path=_o.join(e||``,this.basename)}get extname(){return typeof this.path==`string`?_o.extname(this.path):void 0}set extname(e){if(jo(e,`extname`),No(this.dirname,`extname`),e){if(e.codePointAt(0)!==46)throw Error("`extname` must start with `.`");if(e.includes(`.`,1))throw Error("`extname` cannot contain multiple dots")}this.path=_o.join(this.dirname,this.stem+(e||``))}get path(){return this.history[this.history.length-1]}set path(e){Eo(e)&&(e=Do(e)),Mo(e,`path`),this.path!==e&&this.history.push(e)}get stem(){return typeof this.path==`string`?_o.basename(this.path,this.extname):void 0}set stem(e){Mo(e,`stem`),jo(e,`stem`),this.path=_o.join(this.dirname||``,e+(this.extname||``))}fail(e,t,n){let r=this.message(e,t,n);throw r.fatal=!0,r}info(e,t,n){let r=this.message(e,t,n);return r.fatal=void 0,r}message(e,t,n){let r=new pt(e,t,n);return this.path&&(r.name=this.path+`:`+r.name,r.file=this.path),r.fatal=!1,this.messages.push(r),r}toString(e){return this.value===void 0?``:typeof this.value==`string`?this.value:new TextDecoder(e||void 0).decode(this.value)}};function jo(e,t){if(e&&e.includes(_o.sep))throw Error("`"+t+"` cannot be a path: did not expect `"+_o.sep+"`")}function Mo(e,t){if(!e)throw Error("`"+t+"` cannot be empty")}function No(e,t){if(!e)throw Error("Setting `"+t+"` requires `path` to be set too")}function Po(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var Fo=(function(e){let t=this.constructor.prototype,n=t[e],r=function(){return n.apply(r,arguments)};return Object.setPrototypeOf(r,t),r}),Io=l(po(),1),Lo={}.hasOwnProperty,Ro=new class e extends Fo{constructor(){super(`copy`),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=ho()}copy(){let t=new e,n=-1;for(;++n<this.attachers.length;){let e=this.attachers[n];t.use(...e)}return t.data((0,Io.default)(!0,{},this.namespace)),t}data(e,t){return typeof e==`string`?arguments.length===2?(Vo(`data`,this.frozen),this.namespace[e]=t,this):Lo.call(this.namespace,e)&&this.namespace[e]||void 0:e?(Vo(`data`,this.frozen),this.namespace=e,this):this.namespace}freeze(){if(this.frozen)return this;let e=this;for(;++this.freezeIndex<this.attachers.length;){let[t,...n]=this.attachers[this.freezeIndex];if(n[0]===!1)continue;n[0]===!0&&(n[0]=void 0);let r=t.call(e,...n);typeof r==`function`&&this.transformers.use(r)}return this.frozen=!0,this.freezeIndex=1/0,this}parse(e){this.freeze();let t=Wo(e),n=this.parser||this.Parser;return zo(`parse`,n),n(String(t),t)}process(e,t){let n=this;return this.freeze(),zo(`process`,this.parser||this.Parser),Bo(`process`,this.compiler||this.Compiler),t?r(void 0,t):new Promise(r);function r(r,i){let a=Wo(e),o=n.parse(a);n.run(o,a,function(e,t,r){if(e||!t||!r)return s(e);let i=t,a=n.stringify(i,r);Ko(a)?r.value=a:r.result=a,s(e,r)});function s(e,n){e||!n?i(e):r?r(n):t(void 0,n)}}}processSync(e){let t=!1,n;return this.freeze(),zo(`processSync`,this.parser||this.Parser),Bo(`processSync`,this.compiler||this.Compiler),this.process(e,r),Uo(`processSync`,`process`,t),n;function r(e,r){t=!0,fo(e),n=r}}run(e,t,n){Ho(e),this.freeze();let r=this.transformers;return!n&&typeof t==`function`&&(n=t,t=void 0),n?i(void 0,n):new Promise(i);function i(i,a){let o=Wo(t);r.run(e,o,s);function s(t,r,o){let s=r||e;t?a(t):i?i(s):n(void 0,s,o)}}}runSync(e,t){let n=!1,r;return this.run(e,t,i),Uo(`runSync`,`run`,n),r;function i(e,t){fo(e),r=t,n=!0}}stringify(e,t){this.freeze();let n=Wo(t),r=this.compiler||this.Compiler;return Bo(`stringify`,r),Ho(e),r(e,n)}use(e,...t){let n=this.attachers,r=this.namespace;if(Vo(`use`,this.frozen),e!=null)if(typeof e==`function`)s(e,t);else if(typeof e==`object`)Array.isArray(e)?o(e):a(e);else throw TypeError("Expected usable value, not `"+e+"`");return this;function i(e){if(typeof e==`function`)s(e,[]);else if(typeof e==`object`)if(Array.isArray(e)){let[t,...n]=e;s(t,n)}else a(e);else throw TypeError("Expected usable value, not `"+e+"`")}function a(e){if(!(`plugins`in e)&&!(`settings`in e))throw Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");o(e.plugins),e.settings&&(r.settings=(0,Io.default)(!0,r.settings,e.settings))}function o(e){let t=-1;if(e!=null)if(Array.isArray(e))for(;++t<e.length;){let n=e[t];i(n)}else throw TypeError("Expected a list of plugins, not `"+e+"`")}function s(e,t){let r=-1,i=-1;for(;++r<n.length;)if(n[r][0]===e){i=r;break}if(i===-1)n.push([e,...t]);else if(t.length>0){let[r,...a]=t,o=n[i][1];mo(o)&&mo(r)&&(r=(0,Io.default)(!0,o,r)),n[i]=[e,r,...a]}}}}().freeze();function zo(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `parser`")}function Bo(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `compiler`")}function Vo(e,t){if(t)throw Error("Cannot call `"+e+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function Ho(e){if(!mo(e)||typeof e.type!=`string`)throw TypeError("Expected node, got `"+e+"`")}function Uo(e,t,n){if(!n)throw Error("`"+e+"` finished async. Use `"+t+"` instead")}function Wo(e){return Go(e)?e:new Ao(e)}function Go(e){return!!(e&&typeof e==`object`&&`message`in e&&`messages`in e)}function Ko(e){return typeof e==`string`||qo(e)}function qo(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var N=Gt(),Jo=[],Yo={allowDangerousHtml:!0},Xo=/^(https?|ircs?|mailto|xmpp)$/i,Zo=[{from:`astPlugins`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowDangerousHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowNode`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowElement`},{from:`allowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowedElements`},{from:`className`,id:`remove-classname`},{from:`disallowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`disallowedElements`},{from:`escapeHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`includeElementIndex`,id:`#remove-includeelementindex`},{from:`includeNodeIndex`,id:`change-includenodeindex-to-includeelementindex`},{from:`linkTarget`,id:`remove-linktarget`},{from:`plugins`,id:`change-plugins-to-remarkplugins`,to:`remarkPlugins`},{from:`rawSourcePos`,id:`#remove-rawsourcepos`},{from:`renderers`,id:`change-renderers-to-components`,to:`components`},{from:`source`,id:`change-source-to-children`,to:`children`},{from:`sourcePos`,id:`#remove-sourcepos`},{from:`transformImageUri`,id:`#add-urltransform`,to:`urlTransform`},{from:`transformLinkUri`,id:`#add-urltransform`,to:`urlTransform`}];function Qo(e){let t=$o(e),n=es(e);return ts(t.runSync(t.parse(n),n),e)}function $o(e){let t=e.rehypePlugins||Jo,n=e.remarkPlugins||Jo,r=e.remarkRehypeOptions?{...e.remarkRehypeOptions,...Yo}:Yo;return Ro().use(Ki).use(n).use(uo,r).use(t)}function es(e){let t=e.children||``,n=new Ao;return typeof t==`string`?n.value=t:``+t,n}function ts(e,t){let n=t.allowedElements,r=t.allowElement,i=t.components,a=t.disallowedElements,o=t.skipHtml,s=t.unwrapDisallowed,c=t.urlTransform||ns;for(let e of Zo)Object.hasOwn(t,e.from)&&``+e.from+(e.to?"use `"+e.to+"` instead":`remove it`)+e.id;return eo(e,l),xt(e,{Fragment:N.Fragment,components:i,ignoreInvalidStyle:!0,jsx:N.jsx,jsxs:N.jsxs,passKeys:!0,passNode:!0});function l(e,t,i){if(e.type===`raw`&&i&&typeof t==`number`)return o?i.children.splice(t,1):i.children[t]={type:`text`,value:e.value},t;if(e.type===`element`){let t;for(t in Ut)if(Object.hasOwn(Ut,t)&&Object.hasOwn(e.properties,t)){let n=e.properties[t],r=Ut[t];(r===null||r.includes(e.tagName))&&(e.properties[t]=c(String(n||``),t,e))}}if(e.type===`element`){let o=n?!n.includes(e.tagName):a?a.includes(e.tagName):!1;if(!o&&r&&typeof t==`number`&&(o=!r(e,t,i)),o&&i&&typeof t==`number`)return s&&e.children?i.children.splice(t,1,...e.children):i.children.splice(t,1),t}}}function ns(e){let t=e.indexOf(`:`),n=e.indexOf(`?`),r=e.indexOf(`#`),i=e.indexOf(`/`);return t===-1||i!==-1&&t>i||n!==-1&&t>n||r!==-1&&t>r||Xo.test(e.slice(0,t))?e:``}function rs(e,t){let n=String(e),r=n.indexOf(t),i=r,a=0,o=0;if(typeof t!=`string`)throw TypeError(`Expected substring`);for(;r!==-1;)r===i?++a>o&&(o=a):a=1,i=r+t.length,r=n.indexOf(t,i);return o}function is(){return{enter:{mathFlow:e,mathFlowFenceMeta:t,mathText:a},exit:{mathFlow:i,mathFlowFence:r,mathFlowFenceMeta:n,mathFlowValue:s,mathText:o,mathTextData:s}};function e(e){this.enter({type:`math`,meta:null,value:``,data:{hName:`pre`,hChildren:[{type:`element`,tagName:`code`,properties:{className:[`language-math`,`math-display`]},children:[]}]}},e)}function t(){this.buffer()}function n(){let e=this.resume(),t=this.stack[this.stack.length-1];t.type,t.meta=e}function r(){this.data.mathFlowInside||(this.buffer(),this.data.mathFlowInside=!0)}function i(e){let t=this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,``),n=this.stack[this.stack.length-1];n.type,this.exit(e),n.value=t;let r=n.data.hChildren[0];r.type,r.tagName,r.children.push({type:`text`,value:t}),this.data.mathFlowInside=void 0}function a(e){this.enter({type:`inlineMath`,value:``,data:{hName:`code`,hProperties:{className:[`language-math`,`math-inline`]},hChildren:[]}},e),this.buffer()}function o(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.type,this.exit(e),n.value=t,n.data.hChildren.push({type:`text`,value:t})}function s(e){this.config.enter.data.call(this,e),this.config.exit.data.call(this,e)}}function as(e){let t=(e||{}).singleDollarTextMath;return t??=!0,r.peek=i,{unsafe:[{character:`\r`,inConstruct:`mathFlowMeta`},{character:`
`,inConstruct:`mathFlowMeta`},{character:`$`,after:t?void 0:`\\$`,inConstruct:`phrasing`},{character:`$`,inConstruct:`mathFlowMeta`},{atBreak:!0,character:`$`,after:`\\$`}],handlers:{math:n,inlineMath:r}};function n(e,t,n,r){let i=e.value||``,a=n.createTracker(r),o=`$`.repeat(Math.max(rs(i,`$`)+1,2)),s=n.enter(`mathFlow`),c=a.move(o);if(e.meta){let t=n.enter(`mathFlowMeta`);c+=a.move(n.safe(e.meta,{after:`
`,before:c,encode:[`$`],...a.current()})),t()}return c+=a.move(`
`),i&&(c+=a.move(i+`
`)),c+=a.move(o),s(),c}function r(e,n,r){let i=e.value||``,a=1;for(t||a++;RegExp(`(^|[^$])`+`\\$`.repeat(a)+`([^$]|$)`).test(i);)a++;let o=`$`.repeat(a);/[^ \r\n]/.test(i)&&(/^[ \r\n]/.test(i)&&/[ \r\n]$/.test(i)||/^\$|\$$/.test(i))&&(i=` `+i+` `);let s=-1;for(;++s<r.unsafe.length;){let e=r.unsafe[s];if(!e.atBreak)continue;let t=r.compilePattern(e),n;for(;n=t.exec(i);){let e=n.index;i.codePointAt(e)===10&&i.codePointAt(e-1)===13&&e--,i=i.slice(0,e)+` `+i.slice(n.index+1)}}return o+i+o}function i(){return`$`}}var os={tokenize:cs,concrete:!0,name:`mathFlow`},ss={tokenize:ls,partial:!0};function cs(e,t,n){let r=this,i=r.events[r.events.length-1],a=i&&i[1].type===`linePrefix`?i[2].sliceSerialize(i[1],!0).length:0,o=0;return s;function s(t){return e.enter(`mathFlow`),e.enter(`mathFlowFence`),e.enter(`mathFlowFenceSequence`),c(t)}function c(t){return t===36?(e.consume(t),o++,c):o<2?n(t):(e.exit(`mathFlowFenceSequence`),xn(e,l,`whitespace`)(t))}function l(t){return t===null||A(t)?d(t):(e.enter(`mathFlowFenceMeta`),e.enter(`chunkString`,{contentType:`string`}),u(t))}function u(t){return t===null||A(t)?(e.exit(`chunkString`),e.exit(`mathFlowFenceMeta`),d(t)):t===36?n(t):(e.consume(t),u)}function d(n){return e.exit(`mathFlowFence`),r.interrupt?t(n):e.attempt(ss,f,g)(n)}function f(t){return e.attempt({tokenize:_,partial:!0},g,p)(t)}function p(t){return(a?xn(e,m,`linePrefix`,a+1):m)(t)}function m(t){return t===null?g(t):A(t)?e.attempt(ss,f,g)(t):(e.enter(`mathFlowValue`),h(t))}function h(t){return t===null||A(t)?(e.exit(`mathFlowValue`),m(t)):(e.consume(t),h)}function g(n){return e.exit(`mathFlow`),t(n)}function _(e,t,n){let i=0;return xn(e,a,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4);function a(t){return e.enter(`mathFlowFence`),e.enter(`mathFlowFenceSequence`),s(t)}function s(t){return t===36?(i++,e.consume(t),s):i<o?n(t):(e.exit(`mathFlowFenceSequence`),xn(e,c,`whitespace`)(t))}function c(r){return r===null||A(r)?(e.exit(`mathFlowFence`),t(r)):n(r)}}}function ls(e,t,n){let r=this;return i;function i(n){return n===null?t(n):(e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),a)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}function us(e){let t=(e||{}).singleDollarTextMath;return t??=!0,{tokenize:n,resolve:ds,previous:fs,name:`mathText`};function n(e,n,r){let i=0,a,o;return s;function s(t){return e.enter(`mathText`),e.enter(`mathTextSequence`),c(t)}function c(n){return n===36?(e.consume(n),i++,c):i<2&&!t?r(n):(e.exit(`mathTextSequence`),l(n))}function l(t){return t===null?r(t):t===36?(o=e.enter(`mathTextSequence`),a=0,d(t)):t===32?(e.enter(`space`),e.consume(t),e.exit(`space`),l):A(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),l):(e.enter(`mathTextData`),u(t))}function u(t){return t===null||t===32||t===36||A(t)?(e.exit(`mathTextData`),l(t)):(e.consume(t),u)}function d(t){return t===36?(e.consume(t),a++,d):a===i?(e.exit(`mathTextSequence`),e.exit(`mathText`),n(t)):(o.type=`mathTextData`,u(t))}}}function ds(e){let t=e.length-4,n=3,r,i;if((e[n][1].type===`lineEnding`||e[n][1].type===`space`)&&(e[t][1].type===`lineEnding`||e[t][1].type===`space`)){for(r=n;++r<t;)if(e[r][1].type===`mathTextData`){e[t][1].type=`mathTextPadding`,e[n][1].type=`mathTextPadding`,n+=2,t-=2;break}}for(r=n-1,t++;++r<=t;)i===void 0?r!==t&&e[r][1].type!==`lineEnding`&&(i=r):(r===t||e[r][1].type===`lineEnding`)&&(e[i][1].type=`mathTextData`,r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),t-=r-i-2,r=i+2),i=void 0);return e}function fs(e){return e!==36||this.events[this.events.length-1][1].type===`characterEscape`}function ps(e){return{flow:{36:os},text:{36:us(e)}}}var P=class e extends Error{constructor(t,n){var r=`KaTeX parse error: `+t,i,a,o=n&&n.loc;if(o&&o.start<=o.end){var s=o.lexer.input;i=o.start,a=o.end,i===s.length?r+=` at end of input: `:r+=` at position `+(i+1)+`: `;var c=s.slice(i,a).replace(/[^]/g,`$&̲`),l=i>15?`…`+s.slice(i-15,i):s.slice(0,i),u=a+15<s.length?s.slice(a,a+15)+`…`:s.slice(a);r+=l+c+u}super(r),this.name=`ParseError`,this.position=void 0,this.length=void 0,this.rawMessage=void 0,Object.setPrototypeOf(this,e.prototype),this.position=i,i!=null&&a!=null&&(this.length=a-i),this.rawMessage=t}},ms=/([A-Z])/g,hs=e=>e.replace(ms,`-$1`).toLowerCase(),gs={"&":`&amp;`,">":`&gt;`,"<":`&lt;`,'"':`&quot;`,"'":`&#x27;`},_s=/[&><"']/g,vs=e=>String(e).replace(_s,e=>gs[e]),ys=e=>e.type===`ordgroup`||e.type===`color`?e.body.length===1?ys(e.body[0]):e:e.type===`font`?ys(e.body):e,bs=new Set([`mathord`,`textord`,`atom`]),xs=e=>bs.has(ys(e).type),Ss=e=>{var t=/^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(e);return t?t[2]!==`:`||!/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(t[1])?null:t[1].toLowerCase():`_relative`},Cs={displayMode:{type:`boolean`,description:`Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.`,cli:`-d, --display-mode`},output:{type:{enum:[`htmlAndMathml`,`html`,`mathml`]},description:`Determines the markup language of the output.`,cli:`-F, --format <type>`},leqno:{type:`boolean`,description:`Render display math in leqno style (left-justified tags).`},fleqn:{type:`boolean`,description:`Render display math flush left.`},throwOnError:{type:`boolean`,default:!0,cli:`-t, --no-throw-on-error`,cliDescription:`Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error.`},errorColor:{type:`string`,default:`#cc0000`,cli:`-c, --error-color <color>`,cliDescription:`A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.`,cliProcessor:e=>`#`+e},macros:{type:`object`,cli:`-m, --macro <def>`,cliDescription:`Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).`,cliDefault:[],cliProcessor:(e,t)=>(t.push(e),t)},minRuleThickness:{type:`number`,description:"Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",processor:e=>Math.max(0,e),cli:`--min-rule-thickness <size>`,cliProcessor:parseFloat},colorIsTextColor:{type:`boolean`,description:`Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.`,cli:`-b, --color-is-text-color`},strict:{type:[{enum:[`warn`,`ignore`,`error`]},`boolean`,`function`],description:`Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.`,cli:`-S, --strict`,cliDefault:!1},trust:{type:[`boolean`,`function`],description:`Trust the input, enabling all HTML features such as \\url.`,cli:`-T, --trust`},maxSize:{type:`number`,default:1/0,description:`If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large`,processor:e=>Math.max(0,e),cli:`-s, --max-size <n>`,cliProcessor:parseInt},maxExpand:{type:`number`,default:1e3,description:`Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.`,processor:e=>Math.max(0,e),cli:`-e, --max-expand <n>`,cliProcessor:e=>e===`Infinity`?1/0:parseInt(e)},globalGroup:{type:`boolean`,cli:!1}};function ws(e){if(typeof e!=`string`)return e.enum[0];switch(e){case`boolean`:return!1;case`string`:return``;case`number`:return 0;case`object`:return{};default:throw Error(`Unexpected schema type; settings must declare an explicit default.`)}}function Ts(e){return e.default===void 0?ws(Array.isArray(e.type)?e.type[0]:e.type):e.default}function Es(e,t,n,r){var i=n[t];e[t]=i===void 0?Ts(r):r.processor?r.processor(i):i}var Ds=class{constructor(e){e===void 0&&(e={}),this.displayMode=void 0,this.output=void 0,this.leqno=void 0,this.fleqn=void 0,this.throwOnError=void 0,this.errorColor=void 0,this.macros=void 0,this.minRuleThickness=void 0,this.colorIsTextColor=void 0,this.strict=void 0,this.trust=void 0,this.maxSize=void 0,this.maxExpand=void 0,this.globalGroup=void 0,e||={};for(var t of Object.keys(Cs)){var n=Cs[t];n&&Es(this,t,e,n)}}reportNonstrict(e,t,n){var r=this.strict;if(typeof r==`function`&&(r=r(e,t,n)),!(!r||r===`ignore`)){if(r===!0||r===`error`)throw new P(`LaTeX-incompatible input and strict mode is set to 'error': `+(t+` [`+e+`]`),n);r===`warn`?typeof console<`u`&&console.warn(`LaTeX-incompatible input and strict mode is set to 'warn': `+(t+` [`+e+`]`)):typeof console<`u`&&console.warn(`LaTeX-incompatible input and strict mode is set to `+(`unrecognized '`+r+`': `+t+` [`+e+`]`))}}useStrictBehavior(e,t,n){var r=this.strict;if(typeof r==`function`)try{r=r(e,t,n)}catch{r=`error`}return!r||r===`ignore`?!1:r===!0||r===`error`?!0:r===`warn`?(typeof console<`u`&&console.warn(`LaTeX-incompatible input and strict mode is set to 'warn': `+(t+` [`+e+`]`)),!1):(typeof console<`u`&&console.warn(`LaTeX-incompatible input and strict mode is set to `+(`unrecognized '`+r+`': `+t+` [`+e+`]`)),!1)}isTrusted(e){if(`url`in e&&e.url&&!e.protocol){var t=Ss(e.url);if(t==null)return!1;e.protocol=t}return!!(typeof this.trust==`function`?this.trust(e):this.trust)}},Os=class{constructor(e,t,n){this.id=void 0,this.size=void 0,this.cramped=void 0,this.id=e,this.size=t,this.cramped=n}sup(){return Ls[Rs[this.id]]}sub(){return Ls[zs[this.id]]}fracNum(){return Ls[Bs[this.id]]}fracDen(){return Ls[Vs[this.id]]}cramp(){return Ls[Hs[this.id]]}text(){return Ls[Us[this.id]]}isTight(){return this.size>=2}},ks=0,As=1,js=2,Ms=3,Ns=4,Ps=5,Fs=6,Is=7,Ls=[new Os(ks,0,!1),new Os(As,0,!0),new Os(js,1,!1),new Os(Ms,1,!0),new Os(Ns,2,!1),new Os(Ps,2,!0),new Os(Fs,3,!1),new Os(Is,3,!0)],Rs=[Ns,Ps,Ns,Ps,Fs,Is,Fs,Is],zs=[Ps,Ps,Ps,Ps,Is,Is,Is,Is],Bs=[js,Ms,Ns,Ps,Fs,Is,Fs,Is],Vs=[Ms,Ms,Ps,Ps,Is,Is,Is,Is],Hs=[As,As,Ms,Ms,Ps,Ps,Is,Is],Us=[ks,As,js,Ms,js,Ms,js,Ms],F={DISPLAY:Ls[ks],TEXT:Ls[js],SCRIPT:Ls[Ns],SCRIPTSCRIPT:Ls[Fs]},Ws=[{name:`latin`,blocks:[[256,591],[768,879]]},{name:`cyrillic`,blocks:[[1024,1279]]},{name:`armenian`,blocks:[[1328,1423]]},{name:`brahmic`,blocks:[[2304,4255]]},{name:`georgian`,blocks:[[4256,4351]]},{name:`cjk`,blocks:[[12288,12543],[19968,40879],[65280,65376]]},{name:`hangul`,blocks:[[44032,55215]]}];function Gs(e){for(var t=0;t<Ws.length;t++)for(var n=Ws[t],r=0;r<n.blocks.length;r++){var i=n.blocks[r];if(e>=i[0]&&e<=i[1])return n.name}return null}var Ks=[];Ws.forEach(e=>e.blocks.forEach(e=>Ks.push(...e)));function qs(e){for(var t=0;t<Ks.length;t+=2)if(e>=Ks[t]&&e<=Ks[t+1])return!0;return!1}var Js=e=>e+` `+e,Ys=80,Xs=function(e,t){return`M95,`+(622+e+t)+`
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l`+e/2.075+` -`+e+`
c5.3,-9.3,12,-14,20,-14
H400000v`+(40+e)+`H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M`+(834+e)+` `+t+`h400000v`+(40+e)+`h-400000z`},Zs=function(e,t){return`M263,`+(601+e+t)+`c0.7,0,18,39.7,52,119
c34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120
c340,-704.7,510.7,-1060.3,512,-1067
l`+e/2.084+` -`+e+`
c4.7,-7.3,11,-11,19,-11
H40000v`+(40+e)+`H1012.3
s-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232
c-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1
s-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26
c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z
M`+(1001+e)+` `+t+`h400000v`+(40+e)+`h-400000z`},Qs=function(e,t){return`M983 `+(10+e+t)+`
l`+e/3.13+` -`+e+`
c4,-6.7,10,-10,18,-10 H400000v`+(40+e)+`
H1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7
s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744
c-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30
c26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722
c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5
c53.7,-170.3,84.5,-266.8,92.5,-289.5z
M`+(1001+e)+` `+t+`h400000v`+(40+e)+`h-400000z`},$s=function(e,t){return`M424,`+(2398+e+t)+`
c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514
c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20
s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121
s209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081
l`+e/4.223+` -`+e+`c4,-6.7,10,-10,18,-10 H400000
v`+(40+e)+`H1014.6
s-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185
c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2z M`+(1001+e)+` `+t+`
h400000v`+(40+e)+`h-400000z`},ec=function(e,t){return`M473,`+(2713+e+t)+`
c339.3,-1799.3,509.3,-2700,510,-2702 l`+e/5.298+` -`+e+`
c3.3,-7.3,9.3,-11,18,-11 H400000v`+(40+e)+`H1017.7
s-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200
c0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26
s76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,
606zM`+(1001+e)+` `+t+`h400000v`+(40+e)+`H1017.7z`},tc=function(e){var t=e/2;return`M400000 `+e+` H0 L`+t+` 0 l65 45 L145 `+(e-80)+` H400000z`},nc=function(e,t,n){var r=n-54-t-e;return`M702 `+(e+t)+`H400000`+(40+e)+`
H742v`+r+`l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1
h-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170
c-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667
219 661 l218 661zM702 `+t+`H400000v`+(40+e)+`H742z`},rc=function(e,t,n){t=1e3*t;var r=``;switch(e){case`sqrtMain`:r=Xs(t,Ys);break;case`sqrtSize1`:r=Zs(t,Ys);break;case`sqrtSize2`:r=Qs(t,Ys);break;case`sqrtSize3`:r=$s(t,Ys);break;case`sqrtSize4`:r=ec(t,Ys);break;case`sqrtTall`:r=nc(t,Ys,n)}return r},ic=function(e,t){switch(e){case`⎜`:return Js(`M291 0 H417 V`+t+` H291z`);case`∣`:return Js(`M145 0 H188 V`+t+` H145z`);case`∥`:return Js(`M145 0 H188 V`+t+` H145z`)+Js(`M367 0 H410 V`+t+` H367z`);case`⎟`:return Js(`M457 0 H583 V`+t+` H457z`);case`⎢`:return Js(`M319 0 H403 V`+t+` H319z`);case`⎥`:return Js(`M263 0 H347 V`+t+` H263z`);case`⎪`:return Js(`M384 0 H504 V`+t+` H384z`);case`⏐`:return Js(`M312 0 H355 V`+t+` H312z`);case`‖`:return Js(`M257 0 H300 V`+t+` H257z`)+Js(`M478 0 H521 V`+t+` H478z`);default:return``}},ac={doubleleftarrow:`M262 157
l10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3
 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28
 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5
c2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5
 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87
-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7
-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z
m8 0v40h399730v-40zm0 194v40h399730v-40z`,doublerightarrow:`M399738 392l
-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5
 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88
-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68
-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18
-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782
c-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3
-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z`,leftarrow:`M400000 241H110l3-3c68.7-52.7 113.7-120
 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8
-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247
c-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208
 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3
 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202
 l-3-3h399890zM100 241v40h399900v-40z`,leftbrace:`M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117
-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7
 5-6 9-10 13-.7 1-7.3 1-20 1H6z`,leftbraceunder:`M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13
 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688
 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7
-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z`,leftgroup:`M400000 80
H435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0
 435 0h399565z`,leftgroupunder:`M400000 262
H435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219
 435 219h399565z`,leftharpoon:`M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3
-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5
-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7
-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z`,leftharpoonplus:`M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5
 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3
-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7
-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z
m0 0v40h400000v-40z`,leftharpoondown:`M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333
 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5
 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667
-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z`,leftharpoondownplus:`M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12
 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7
-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0
v40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z`,lefthook:`M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5
-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3
-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21
 71.5 23h399859zM103 281v-40h399897v40z`,leftlinesegment:Js(`M40 281 V428 H0 V94 H40 V241 H400000 v40z`),leftbracketunder:Js(`M0 0 h120 V290 H399995 v120 H0z`),leftbracketover:Js(`M0 440 h120 V150 H399995 v-120 H0z`),leftmapsto:Js(`M40 281 V448H0V74H40V241H400000v40z`),leftToFrom:`M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23
-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8
c28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3
 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z`,longequal:Js(`M0 50 h400000 v40H0z m0 194h40000v40H0z`),midbrace:`M200428 334
c-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14
-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7
 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11
 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z`,midbraceunder:`M199572 214
c100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14
 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3
 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0
-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z`,oiintSize1:`M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6
-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z
m368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8
60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z`,oiintSize2:`M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8
-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z
m502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2
c0 110 84 276 504 276s502.4-166 502.4-276z`,oiiintSize1:`M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6
-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z
m525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0
85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z`,oiiintSize2:`M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8
-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z
m770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1
c0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z`,rightarrow:`M0 241v40h399891c-47.3 35.3-84 78-110 128
-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20
 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7
 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85
-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
 151.7 139 205zm0 0v40h399900v-40z`,rightbrace:`M400000 542l
-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5
s-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1
c124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z`,rightbraceunder:`M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3
 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237
-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z`,rightgroup:`M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0
 3-1 3-3v-38c-76-158-257-219-435-219H0z`,rightgroupunder:`M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18
 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z`,rightharpoon:`M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3
-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2
-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58
 69.2 92 94.5zm0 0v40h399900v-40z`,rightharpoonplus:`M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11
-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7
 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z
m0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z`,rightharpoondown:`M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8
 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5
-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95
-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z`,rightharpoondownplus:`M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8
 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3
 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3
-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z
m0-194v40h400000v-40zm0 0v40h400000v-40z`,righthook:`M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3
 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0
-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21
 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z`,rightlinesegment:Js(`M399960 241 V94 h40 V428 h-40 V281 H0 v-40z`),rightbracketunder:Js(`M399995 0 h-120 V290 H0 v120 H400000z`),rightbracketover:Js(`M399995 440 h-120 V150 H0 v-120 H399995z`),rightToFrom:`M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23
 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32
-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142
-167z M100 147v40h399900v-40zM0 341v40h399900v-40z`,twoheadleftarrow:`M0 167c68 40
 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69
-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3
-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19
-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101
 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z`,twoheadrightarrow:`M400000 167
c-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3
 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42
 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333
-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70
 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z`,tilde1:`M200 55.538c-77 0-168 73.953-177 73.953-3 0-7
-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0
 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0
 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128
-68.267.847-113-73.952-191-73.952z`,tilde2:`M344 55.266c-142 0-300.638 81.316-311.5 86.418
-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9
 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114
c1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751
 181.476 676 181.476c-149 0-189-126.21-332-126.21z`,tilde3:`M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457
-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0
 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697
 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696
 -338 0-409-156.573-744-156.573z`,tilde4:`M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345
-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409
 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9
 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409
 -175.236-744-175.236z`,vec:`M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5
3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11
10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63
-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1
-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59
H213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359
c-16-25.333-24-45-24-59z`,widehat1:`M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22
c-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z`,widehat2:`M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widehat3:`M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widehat4:`M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,widecheck1:`M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,
-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z`,widecheck2:`M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,widecheck3:`M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,widecheck4:`M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,baraboveleftarrow:`M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202
c4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5
c-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130
s-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47
121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6
s2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11
c0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z
M100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z`,rightarrowabovebar:`M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32
-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0
13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39
-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5
-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z`,baraboveshortleftharpoon:`M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17
c2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21
c-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40
c-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z
M0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z`,rightharpoonaboveshortbar:`M0,241 l0,40c399126,0,399993,0,399993,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z`,shortbaraboveleftharpoon:`M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,
1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,
-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z
M93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z`,shortrightharpoonabovebar:`M53,241l0,40c398570,0,399437,0,399437,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z`},oc=function(e,t){switch(e){case`lbrack`:return`M403 1759 V84 H666 V0 H319 V1759 v`+t+` v1759 v84 h347 v-84
H403z M403 1759 V0 H319 V1759 v`+t+` v1759 v84 h84z`;case`rbrack`:return`M347 1759 V0 H0 V84 H263 V1759 v`+t+` v1759 H0 v84 H347z
M347 1759 V0 H263 V1759 v`+t+` v1759 h84z`;case`vert`:return`M145 15 v585 v`+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v`+t+` v585 h43z`;case`doublevert`:return`M145 15 v585 v`+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v`+t+` v585 h43z
M367 15 v585 v`+t+` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v`+-t+` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v`+t+` v585 h43z`;case`lfloor`:return`M319 602 V0 H403 V602 v`+t+` v1715 h263 v84 H319z
MM319 602 V0 H403 V602 v`+t+` v1715 H319z`;case`rfloor`:return`M319 602 V0 H403 V602 v`+t+` v1799 H0 v-84 H319z
MM319 602 V0 H403 V602 v`+t+` v1715 H319z`;case`lceil`:return`M403 1759 V84 H666 V0 H319 V1759 v`+t+` v602 h84z
M403 1759 V0 H319 V1759 v`+t+` v602 h84z`;case`rceil`:return`M347 1759 V0 H0 V84 H263 V1759 v`+t+` v602 h84z
M347 1759 V0 h-84 V1759 v`+t+` v602 h84z`;case`lparen`:return`M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1
c-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,
-36,557 l0,`+(t+84)+`c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,
949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9
c0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,
-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189
l0,-`+(t+92)+`c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,
-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z`;case`rparen`:return`M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,
63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5
c11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0,`+(t+9)+`
c-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664
c-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11
c0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17
c242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558
l0,-`+(t+144)+`c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,
-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z`;default:throw Error(`Unknown stretchy delimiter.`)}};function sc(e){return`toText`in e}var cc=class{constructor(e){this.children=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,this.children=e,this.classes=[],this.height=0,this.depth=0,this.maxFontSize=0,this.style={}}hasClass(e){return this.classes.includes(e)}toNode(){for(var e=document.createDocumentFragment(),t=0;t<this.children.length;t++)e.appendChild(this.children[t].toNode());return e}toMarkup(){for(var e=``,t=0;t<this.children.length;t++)e+=this.children[t].toMarkup();return e}toText(){return this.children.map(e=>{if(sc(e))return e.toText();throw Error(`Expected MathDomNode with toText, got `+e.constructor.name)}).join(``)}},lc={pt:1,mm:7227/2540,cm:7227/254,in:72.27,bp:803/800,pc:12,dd:1238/1157,cc:14856/1157,nd:685/642,nc:1370/107,sp:1/65536,px:803/800},uc={ex:!0,em:!0,mu:!0},dc=function(e){return typeof e!=`string`&&(e=e.unit),e in lc||e in uc||e===`ex`},fc=function(e,t){var n;if(e.unit in lc)n=lc[e.unit]/t.fontMetrics().ptPerEm/t.sizeMultiplier;else if(e.unit===`mu`)n=t.fontMetrics().cssEmPerMu;else{var r=t.style.isTight()?t.havingStyle(t.style.text()):t;if(e.unit===`ex`)n=r.fontMetrics().xHeight;else if(e.unit===`em`)n=r.fontMetrics().quad;else throw new P(`Invalid unit: '`+e.unit+`'`);r!==t&&(n*=r.sizeMultiplier/t.sizeMultiplier)}return Math.min(e.number*n,t.maxSize)},I=function(e){return+e.toFixed(4)+`em`},pc=function(e){return e.filter(e=>e).join(` `)},mc=function(e){var t=``;for(var n of Object.keys(e)){var r=e[n];r!==void 0&&(t+=hs(n)+`:`+r+`;`)}return t},hc=function(e,t,n){if(this.classes=e||[],this.attributes={},this.height=0,this.depth=0,this.maxFontSize=0,this.style=n||{},t){t.style.isTight()&&this.classes.push(`mtight`);var r=t.getColor();r&&(this.style.color=r)}},gc=function(e){var t=document.createElement(e);t.className=pc(this.classes),Object.assign(t.style,this.style);for(var n of Object.keys(this.attributes))t.setAttribute(n,this.attributes[n]);for(var r=0;r<this.children.length;r++)t.appendChild(this.children[r].toNode());return t},_c=/[\s"'>/=\x00-\x1f]/,vc=function(e){var t=`<`+e;this.classes.length&&(t+=` class="`+vs(pc(this.classes))+`"`);var n=mc(this.style);n&&(t+=` style="`+vs(n)+`"`);for(var r of Object.keys(this.attributes)){if(_c.test(r))throw new P(`Invalid attribute name '`+r+`'`);t+=` `+r+`="`+vs(this.attributes[r])+`"`}t+=`>`;for(var i=0;i<this.children.length;i++)t+=this.children[i].toMarkup();return t+=`</`+e+`>`,t},yc=class{constructor(e,t,n,r){this.children=void 0,this.attributes=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.width=void 0,this.maxFontSize=void 0,this.style=void 0,this.italic=void 0,hc.call(this,e,n,r),this.children=t||[]}setAttribute(e,t){this.attributes[e]=t}hasClass(e){return this.classes.includes(e)}toNode(){return gc.call(this,`span`)}toMarkup(){return vc.call(this,`span`)}},bc=class{constructor(e,t,n,r){this.children=void 0,this.attributes=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,hc.call(this,t,r),this.children=n||[],this.setAttribute(`href`,e)}setAttribute(e,t){this.attributes[e]=t}hasClass(e){return this.classes.includes(e)}toNode(){return gc.call(this,`a`)}toMarkup(){return vc.call(this,`a`)}},xc=class{constructor(e,t,n){this.src=void 0,this.alt=void 0,this.classes=void 0,this.height=void 0,this.depth=void 0,this.maxFontSize=void 0,this.style=void 0,this.alt=t,this.src=e,this.classes=[`mord`],this.height=0,this.depth=0,this.maxFontSize=0,this.style=n}hasClass(e){return this.classes.includes(e)}toNode(){var e=document.createElement(`img`);return e.src=this.src,e.alt=this.alt,e.className=`mord`,Object.assign(e.style,this.style),e}toMarkup(){var e=`<img src="`+vs(this.src)+`"`+(` alt="`+vs(this.alt)+`"`),t=mc(this.style);return t&&(e+=` style="`+vs(t)+`"`),e+=`'/>`,e}},Sc={î:`ı̂`,ï:`ı̈`,í:`ı́`,ì:`ı̀`},Cc=class{constructor(e,t,n,r,i,a,o,s){this.text=void 0,this.height=void 0,this.depth=void 0,this.italic=void 0,this.skew=void 0,this.width=void 0,this.maxFontSize=void 0,this.classes=void 0,this.style=void 0,this.text=e,this.height=t||0,this.depth=n||0,this.italic=r||0,this.skew=i||0,this.width=a||0,this.classes=o||[],this.style=s||{},this.maxFontSize=0;var c=Gs(this.text.charCodeAt(0));c&&this.classes.push(c+`_fallback`),/[îïíì]/.test(this.text)&&(this.text=Sc[this.text])}hasClass(e){return this.classes.includes(e)}toNode(){var e=document.createTextNode(this.text),t=null;return this.italic>0&&(t=document.createElement(`span`),t.style.marginRight=I(this.italic)),this.classes.length>0&&(t||=document.createElement(`span`),t.className=pc(this.classes)),Object.keys(this.style).length>0&&(t||=document.createElement(`span`),Object.assign(t.style,this.style)),t?(t.appendChild(e),t):e}toMarkup(){var e=!1,t=`<span`;this.classes.length&&(e=!0,t+=` class="`,t+=vs(pc(this.classes)),t+=`"`);var n=``;this.italic>0&&(n+=`margin-right:`+I(this.italic)+`;`),n+=mc(this.style),n&&(e=!0,t+=` style="`+vs(n)+`"`);var r=vs(this.text);return e?(t+=`>`,t+=r,t+=`</span>`,t):r}},wc=class{constructor(e,t){this.children=void 0,this.attributes=void 0,this.children=e||[],this.attributes=t||{}}toNode(){var e=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);for(var t of Object.keys(this.attributes))e.setAttribute(t,this.attributes[t]);for(var n=0;n<this.children.length;n++)e.appendChild(this.children[n].toNode());return e}toMarkup(){var e=`<svg xmlns="http://www.w3.org/2000/svg"`;for(var t of Object.keys(this.attributes))e+=` `+t+`="`+vs(this.attributes[t])+`"`;e+=`>`;for(var n=0;n<this.children.length;n++)e+=this.children[n].toMarkup();return e+=`</svg>`,e}},Tc=class{constructor(e,t){this.pathName=void 0,this.alternate=void 0,this.pathName=e,this.alternate=t}toNode(){var e=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);return this.alternate?e.setAttribute(`d`,this.alternate):e.setAttribute(`d`,ac[this.pathName]),e}toMarkup(){return this.alternate?`<path d="`+vs(this.alternate)+`"/>`:`<path d="`+vs(ac[this.pathName])+`"/>`}},Ec=class{constructor(e){this.attributes=void 0,this.attributes=e||{}}toNode(){var e=document.createElementNS(`http://www.w3.org/2000/svg`,`line`);for(var t of Object.keys(this.attributes))e.setAttribute(t,this.attributes[t]);return e}toMarkup(){var e=`<line`;for(var t of Object.keys(this.attributes))e+=` `+t+`="`+vs(this.attributes[t])+`"`;return e+=`/>`,e}};function Dc(e){if(e instanceof Cc)return e;throw Error(`Expected symbolNode but got `+String(e)+`.`)}function Oc(e){if(e instanceof yc)return e;throw Error(`Expected span<HtmlDomNode> but got `+String(e)+`.`)}var kc=e=>e instanceof yc||e instanceof bc||e instanceof cc,Ac={"AMS-Regular":{32:[0,0,0,0,.25],65:[0,.68889,0,0,.72222],66:[0,.68889,0,0,.66667],67:[0,.68889,0,0,.72222],68:[0,.68889,0,0,.72222],69:[0,.68889,0,0,.66667],70:[0,.68889,0,0,.61111],71:[0,.68889,0,0,.77778],72:[0,.68889,0,0,.77778],73:[0,.68889,0,0,.38889],74:[.16667,.68889,0,0,.5],75:[0,.68889,0,0,.77778],76:[0,.68889,0,0,.66667],77:[0,.68889,0,0,.94445],78:[0,.68889,0,0,.72222],79:[.16667,.68889,0,0,.77778],80:[0,.68889,0,0,.61111],81:[.16667,.68889,0,0,.77778],82:[0,.68889,0,0,.72222],83:[0,.68889,0,0,.55556],84:[0,.68889,0,0,.66667],85:[0,.68889,0,0,.72222],86:[0,.68889,0,0,.72222],87:[0,.68889,0,0,1],88:[0,.68889,0,0,.72222],89:[0,.68889,0,0,.72222],90:[0,.68889,0,0,.66667],107:[0,.68889,0,0,.55556],160:[0,0,0,0,.25],165:[0,.675,.025,0,.75],174:[.15559,.69224,0,0,.94666],240:[0,.68889,0,0,.55556],295:[0,.68889,0,0,.54028],710:[0,.825,0,0,2.33334],732:[0,.9,0,0,2.33334],770:[0,.825,0,0,2.33334],771:[0,.9,0,0,2.33334],989:[.08167,.58167,0,0,.77778],1008:[0,.43056,.04028,0,.66667],8245:[0,.54986,0,0,.275],8463:[0,.68889,0,0,.54028],8487:[0,.68889,0,0,.72222],8498:[0,.68889,0,0,.55556],8502:[0,.68889,0,0,.66667],8503:[0,.68889,0,0,.44445],8504:[0,.68889,0,0,.66667],8513:[0,.68889,0,0,.63889],8592:[-.03598,.46402,0,0,.5],8594:[-.03598,.46402,0,0,.5],8602:[-.13313,.36687,0,0,1],8603:[-.13313,.36687,0,0,1],8606:[.01354,.52239,0,0,1],8608:[.01354,.52239,0,0,1],8610:[.01354,.52239,0,0,1.11111],8611:[.01354,.52239,0,0,1.11111],8619:[0,.54986,0,0,1],8620:[0,.54986,0,0,1],8621:[-.13313,.37788,0,0,1.38889],8622:[-.13313,.36687,0,0,1],8624:[0,.69224,0,0,.5],8625:[0,.69224,0,0,.5],8630:[0,.43056,0,0,1],8631:[0,.43056,0,0,1],8634:[.08198,.58198,0,0,.77778],8635:[.08198,.58198,0,0,.77778],8638:[.19444,.69224,0,0,.41667],8639:[.19444,.69224,0,0,.41667],8642:[.19444,.69224,0,0,.41667],8643:[.19444,.69224,0,0,.41667],8644:[.1808,.675,0,0,1],8646:[.1808,.675,0,0,1],8647:[.1808,.675,0,0,1],8648:[.19444,.69224,0,0,.83334],8649:[.1808,.675,0,0,1],8650:[.19444,.69224,0,0,.83334],8651:[.01354,.52239,0,0,1],8652:[.01354,.52239,0,0,1],8653:[-.13313,.36687,0,0,1],8654:[-.13313,.36687,0,0,1],8655:[-.13313,.36687,0,0,1],8666:[.13667,.63667,0,0,1],8667:[.13667,.63667,0,0,1],8669:[-.13313,.37788,0,0,1],8672:[-.064,.437,0,0,1.334],8674:[-.064,.437,0,0,1.334],8705:[0,.825,0,0,.5],8708:[0,.68889,0,0,.55556],8709:[.08167,.58167,0,0,.77778],8717:[0,.43056,0,0,.42917],8722:[-.03598,.46402,0,0,.5],8724:[.08198,.69224,0,0,.77778],8726:[.08167,.58167,0,0,.77778],8733:[0,.69224,0,0,.77778],8736:[0,.69224,0,0,.72222],8737:[0,.69224,0,0,.72222],8738:[.03517,.52239,0,0,.72222],8739:[.08167,.58167,0,0,.22222],8740:[.25142,.74111,0,0,.27778],8741:[.08167,.58167,0,0,.38889],8742:[.25142,.74111,0,0,.5],8756:[0,.69224,0,0,.66667],8757:[0,.69224,0,0,.66667],8764:[-.13313,.36687,0,0,.77778],8765:[-.13313,.37788,0,0,.77778],8769:[-.13313,.36687,0,0,.77778],8770:[-.03625,.46375,0,0,.77778],8774:[.30274,.79383,0,0,.77778],8776:[-.01688,.48312,0,0,.77778],8778:[.08167,.58167,0,0,.77778],8782:[.06062,.54986,0,0,.77778],8783:[.06062,.54986,0,0,.77778],8785:[.08198,.58198,0,0,.77778],8786:[.08198,.58198,0,0,.77778],8787:[.08198,.58198,0,0,.77778],8790:[0,.69224,0,0,.77778],8791:[.22958,.72958,0,0,.77778],8796:[.08198,.91667,0,0,.77778],8806:[.25583,.75583,0,0,.77778],8807:[.25583,.75583,0,0,.77778],8808:[.25142,.75726,0,0,.77778],8809:[.25142,.75726,0,0,.77778],8812:[.25583,.75583,0,0,.5],8814:[.20576,.70576,0,0,.77778],8815:[.20576,.70576,0,0,.77778],8816:[.30274,.79383,0,0,.77778],8817:[.30274,.79383,0,0,.77778],8818:[.22958,.72958,0,0,.77778],8819:[.22958,.72958,0,0,.77778],8822:[.1808,.675,0,0,.77778],8823:[.1808,.675,0,0,.77778],8828:[.13667,.63667,0,0,.77778],8829:[.13667,.63667,0,0,.77778],8830:[.22958,.72958,0,0,.77778],8831:[.22958,.72958,0,0,.77778],8832:[.20576,.70576,0,0,.77778],8833:[.20576,.70576,0,0,.77778],8840:[.30274,.79383,0,0,.77778],8841:[.30274,.79383,0,0,.77778],8842:[.13597,.63597,0,0,.77778],8843:[.13597,.63597,0,0,.77778],8847:[.03517,.54986,0,0,.77778],8848:[.03517,.54986,0,0,.77778],8858:[.08198,.58198,0,0,.77778],8859:[.08198,.58198,0,0,.77778],8861:[.08198,.58198,0,0,.77778],8862:[0,.675,0,0,.77778],8863:[0,.675,0,0,.77778],8864:[0,.675,0,0,.77778],8865:[0,.675,0,0,.77778],8872:[0,.69224,0,0,.61111],8873:[0,.69224,0,0,.72222],8874:[0,.69224,0,0,.88889],8876:[0,.68889,0,0,.61111],8877:[0,.68889,0,0,.61111],8878:[0,.68889,0,0,.72222],8879:[0,.68889,0,0,.72222],8882:[.03517,.54986,0,0,.77778],8883:[.03517,.54986,0,0,.77778],8884:[.13667,.63667,0,0,.77778],8885:[.13667,.63667,0,0,.77778],8888:[0,.54986,0,0,1.11111],8890:[.19444,.43056,0,0,.55556],8891:[.19444,.69224,0,0,.61111],8892:[.19444,.69224,0,0,.61111],8901:[0,.54986,0,0,.27778],8903:[.08167,.58167,0,0,.77778],8905:[.08167,.58167,0,0,.77778],8906:[.08167,.58167,0,0,.77778],8907:[0,.69224,0,0,.77778],8908:[0,.69224,0,0,.77778],8909:[-.03598,.46402,0,0,.77778],8910:[0,.54986,0,0,.76042],8911:[0,.54986,0,0,.76042],8912:[.03517,.54986,0,0,.77778],8913:[.03517,.54986,0,0,.77778],8914:[0,.54986,0,0,.66667],8915:[0,.54986,0,0,.66667],8916:[0,.69224,0,0,.66667],8918:[.0391,.5391,0,0,.77778],8919:[.0391,.5391,0,0,.77778],8920:[.03517,.54986,0,0,1.33334],8921:[.03517,.54986,0,0,1.33334],8922:[.38569,.88569,0,0,.77778],8923:[.38569,.88569,0,0,.77778],8926:[.13667,.63667,0,0,.77778],8927:[.13667,.63667,0,0,.77778],8928:[.30274,.79383,0,0,.77778],8929:[.30274,.79383,0,0,.77778],8934:[.23222,.74111,0,0,.77778],8935:[.23222,.74111,0,0,.77778],8936:[.23222,.74111,0,0,.77778],8937:[.23222,.74111,0,0,.77778],8938:[.20576,.70576,0,0,.77778],8939:[.20576,.70576,0,0,.77778],8940:[.30274,.79383,0,0,.77778],8941:[.30274,.79383,0,0,.77778],8994:[.19444,.69224,0,0,.77778],8995:[.19444,.69224,0,0,.77778],9416:[.15559,.69224,0,0,.90222],9484:[0,.69224,0,0,.5],9488:[0,.69224,0,0,.5],9492:[0,.37788,0,0,.5],9496:[0,.37788,0,0,.5],9585:[.19444,.68889,0,0,.88889],9586:[.19444,.74111,0,0,.88889],9632:[0,.675,0,0,.77778],9633:[0,.675,0,0,.77778],9650:[0,.54986,0,0,.72222],9651:[0,.54986,0,0,.72222],9654:[.03517,.54986,0,0,.77778],9660:[0,.54986,0,0,.72222],9661:[0,.54986,0,0,.72222],9664:[.03517,.54986,0,0,.77778],9674:[.11111,.69224,0,0,.66667],9733:[.19444,.69224,0,0,.94445],10003:[0,.69224,0,0,.83334],10016:[0,.69224,0,0,.83334],10731:[.11111,.69224,0,0,.66667],10846:[.19444,.75583,0,0,.61111],10877:[.13667,.63667,0,0,.77778],10878:[.13667,.63667,0,0,.77778],10885:[.25583,.75583,0,0,.77778],10886:[.25583,.75583,0,0,.77778],10887:[.13597,.63597,0,0,.77778],10888:[.13597,.63597,0,0,.77778],10889:[.26167,.75726,0,0,.77778],10890:[.26167,.75726,0,0,.77778],10891:[.48256,.98256,0,0,.77778],10892:[.48256,.98256,0,0,.77778],10901:[.13667,.63667,0,0,.77778],10902:[.13667,.63667,0,0,.77778],10933:[.25142,.75726,0,0,.77778],10934:[.25142,.75726,0,0,.77778],10935:[.26167,.75726,0,0,.77778],10936:[.26167,.75726,0,0,.77778],10937:[.26167,.75726,0,0,.77778],10938:[.26167,.75726,0,0,.77778],10949:[.25583,.75583,0,0,.77778],10950:[.25583,.75583,0,0,.77778],10955:[.28481,.79383,0,0,.77778],10956:[.28481,.79383,0,0,.77778],57350:[.08167,.58167,0,0,.22222],57351:[.08167,.58167,0,0,.38889],57352:[.08167,.58167,0,0,.77778],57353:[0,.43056,.04028,0,.66667],57356:[.25142,.75726,0,0,.77778],57357:[.25142,.75726,0,0,.77778],57358:[.41951,.91951,0,0,.77778],57359:[.30274,.79383,0,0,.77778],57360:[.30274,.79383,0,0,.77778],57361:[.41951,.91951,0,0,.77778],57366:[.25142,.75726,0,0,.77778],57367:[.25142,.75726,0,0,.77778],57368:[.25142,.75726,0,0,.77778],57369:[.25142,.75726,0,0,.77778],57370:[.13597,.63597,0,0,.77778],57371:[.13597,.63597,0,0,.77778]},"Caligraphic-Regular":{32:[0,0,0,0,.25],65:[0,.68333,0,.19445,.79847],66:[0,.68333,.03041,.13889,.65681],67:[0,.68333,.05834,.13889,.52653],68:[0,.68333,.02778,.08334,.77139],69:[0,.68333,.08944,.11111,.52778],70:[0,.68333,.09931,.11111,.71875],71:[.09722,.68333,.0593,.11111,.59487],72:[0,.68333,.00965,.11111,.84452],73:[0,.68333,.07382,0,.54452],74:[.09722,.68333,.18472,.16667,.67778],75:[0,.68333,.01445,.05556,.76195],76:[0,.68333,0,.13889,.68972],77:[0,.68333,0,.13889,1.2009],78:[0,.68333,.14736,.08334,.82049],79:[0,.68333,.02778,.11111,.79611],80:[0,.68333,.08222,.08334,.69556],81:[.09722,.68333,0,.11111,.81667],82:[0,.68333,0,.08334,.8475],83:[0,.68333,.075,.13889,.60556],84:[0,.68333,.25417,0,.54464],85:[0,.68333,.09931,.08334,.62583],86:[0,.68333,.08222,0,.61278],87:[0,.68333,.08222,.08334,.98778],88:[0,.68333,.14643,.13889,.7133],89:[.09722,.68333,.08222,.08334,.66834],90:[0,.68333,.07944,.13889,.72473],160:[0,0,0,0,.25]},"Fraktur-Regular":{32:[0,0,0,0,.25],33:[0,.69141,0,0,.29574],34:[0,.69141,0,0,.21471],38:[0,.69141,0,0,.73786],39:[0,.69141,0,0,.21201],40:[.24982,.74947,0,0,.38865],41:[.24982,.74947,0,0,.38865],42:[0,.62119,0,0,.27764],43:[.08319,.58283,0,0,.75623],44:[0,.10803,0,0,.27764],45:[.08319,.58283,0,0,.75623],46:[0,.10803,0,0,.27764],47:[.24982,.74947,0,0,.50181],48:[0,.47534,0,0,.50181],49:[0,.47534,0,0,.50181],50:[0,.47534,0,0,.50181],51:[.18906,.47534,0,0,.50181],52:[.18906,.47534,0,0,.50181],53:[.18906,.47534,0,0,.50181],54:[0,.69141,0,0,.50181],55:[.18906,.47534,0,0,.50181],56:[0,.69141,0,0,.50181],57:[.18906,.47534,0,0,.50181],58:[0,.47534,0,0,.21606],59:[.12604,.47534,0,0,.21606],61:[-.13099,.36866,0,0,.75623],63:[0,.69141,0,0,.36245],65:[0,.69141,0,0,.7176],66:[0,.69141,0,0,.88397],67:[0,.69141,0,0,.61254],68:[0,.69141,0,0,.83158],69:[0,.69141,0,0,.66278],70:[.12604,.69141,0,0,.61119],71:[0,.69141,0,0,.78539],72:[.06302,.69141,0,0,.7203],73:[0,.69141,0,0,.55448],74:[.12604,.69141,0,0,.55231],75:[0,.69141,0,0,.66845],76:[0,.69141,0,0,.66602],77:[0,.69141,0,0,1.04953],78:[0,.69141,0,0,.83212],79:[0,.69141,0,0,.82699],80:[.18906,.69141,0,0,.82753],81:[.03781,.69141,0,0,.82699],82:[0,.69141,0,0,.82807],83:[0,.69141,0,0,.82861],84:[0,.69141,0,0,.66899],85:[0,.69141,0,0,.64576],86:[0,.69141,0,0,.83131],87:[0,.69141,0,0,1.04602],88:[0,.69141,0,0,.71922],89:[.18906,.69141,0,0,.83293],90:[.12604,.69141,0,0,.60201],91:[.24982,.74947,0,0,.27764],93:[.24982,.74947,0,0,.27764],94:[0,.69141,0,0,.49965],97:[0,.47534,0,0,.50046],98:[0,.69141,0,0,.51315],99:[0,.47534,0,0,.38946],100:[0,.62119,0,0,.49857],101:[0,.47534,0,0,.40053],102:[.18906,.69141,0,0,.32626],103:[.18906,.47534,0,0,.5037],104:[.18906,.69141,0,0,.52126],105:[0,.69141,0,0,.27899],106:[0,.69141,0,0,.28088],107:[0,.69141,0,0,.38946],108:[0,.69141,0,0,.27953],109:[0,.47534,0,0,.76676],110:[0,.47534,0,0,.52666],111:[0,.47534,0,0,.48885],112:[.18906,.52396,0,0,.50046],113:[.18906,.47534,0,0,.48912],114:[0,.47534,0,0,.38919],115:[0,.47534,0,0,.44266],116:[0,.62119,0,0,.33301],117:[0,.47534,0,0,.5172],118:[0,.52396,0,0,.5118],119:[0,.52396,0,0,.77351],120:[.18906,.47534,0,0,.38865],121:[.18906,.47534,0,0,.49884],122:[.18906,.47534,0,0,.39054],160:[0,0,0,0,.25],8216:[0,.69141,0,0,.21471],8217:[0,.69141,0,0,.21471],58112:[0,.62119,0,0,.49749],58113:[0,.62119,0,0,.4983],58114:[.18906,.69141,0,0,.33328],58115:[.18906,.69141,0,0,.32923],58116:[.18906,.47534,0,0,.50343],58117:[0,.69141,0,0,.33301],58118:[0,.62119,0,0,.33409],58119:[0,.47534,0,0,.50073]},"Main-Bold":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.35],34:[0,.69444,0,0,.60278],35:[.19444,.69444,0,0,.95833],36:[.05556,.75,0,0,.575],37:[.05556,.75,0,0,.95833],38:[0,.69444,0,0,.89444],39:[0,.69444,0,0,.31944],40:[.25,.75,0,0,.44722],41:[.25,.75,0,0,.44722],42:[0,.75,0,0,.575],43:[.13333,.63333,0,0,.89444],44:[.19444,.15556,0,0,.31944],45:[0,.44444,0,0,.38333],46:[0,.15556,0,0,.31944],47:[.25,.75,0,0,.575],48:[0,.64444,0,0,.575],49:[0,.64444,0,0,.575],50:[0,.64444,0,0,.575],51:[0,.64444,0,0,.575],52:[0,.64444,0,0,.575],53:[0,.64444,0,0,.575],54:[0,.64444,0,0,.575],55:[0,.64444,0,0,.575],56:[0,.64444,0,0,.575],57:[0,.64444,0,0,.575],58:[0,.44444,0,0,.31944],59:[.19444,.44444,0,0,.31944],60:[.08556,.58556,0,0,.89444],61:[-.10889,.39111,0,0,.89444],62:[.08556,.58556,0,0,.89444],63:[0,.69444,0,0,.54305],64:[0,.69444,0,0,.89444],65:[0,.68611,0,0,.86944],66:[0,.68611,0,0,.81805],67:[0,.68611,0,0,.83055],68:[0,.68611,0,0,.88194],69:[0,.68611,0,0,.75555],70:[0,.68611,0,0,.72361],71:[0,.68611,0,0,.90416],72:[0,.68611,0,0,.9],73:[0,.68611,0,0,.43611],74:[0,.68611,0,0,.59444],75:[0,.68611,0,0,.90138],76:[0,.68611,0,0,.69166],77:[0,.68611,0,0,1.09166],78:[0,.68611,0,0,.9],79:[0,.68611,0,0,.86388],80:[0,.68611,0,0,.78611],81:[.19444,.68611,0,0,.86388],82:[0,.68611,0,0,.8625],83:[0,.68611,0,0,.63889],84:[0,.68611,0,0,.8],85:[0,.68611,0,0,.88472],86:[0,.68611,.01597,0,.86944],87:[0,.68611,.01597,0,1.18888],88:[0,.68611,0,0,.86944],89:[0,.68611,.02875,0,.86944],90:[0,.68611,0,0,.70277],91:[.25,.75,0,0,.31944],92:[.25,.75,0,0,.575],93:[.25,.75,0,0,.31944],94:[0,.69444,0,0,.575],95:[.31,.13444,.03194,0,.575],97:[0,.44444,0,0,.55902],98:[0,.69444,0,0,.63889],99:[0,.44444,0,0,.51111],100:[0,.69444,0,0,.63889],101:[0,.44444,0,0,.52708],102:[0,.69444,.10903,0,.35139],103:[.19444,.44444,.01597,0,.575],104:[0,.69444,0,0,.63889],105:[0,.69444,0,0,.31944],106:[.19444,.69444,0,0,.35139],107:[0,.69444,0,0,.60694],108:[0,.69444,0,0,.31944],109:[0,.44444,0,0,.95833],110:[0,.44444,0,0,.63889],111:[0,.44444,0,0,.575],112:[.19444,.44444,0,0,.63889],113:[.19444,.44444,0,0,.60694],114:[0,.44444,0,0,.47361],115:[0,.44444,0,0,.45361],116:[0,.63492,0,0,.44722],117:[0,.44444,0,0,.63889],118:[0,.44444,.01597,0,.60694],119:[0,.44444,.01597,0,.83055],120:[0,.44444,0,0,.60694],121:[.19444,.44444,.01597,0,.60694],122:[0,.44444,0,0,.51111],123:[.25,.75,0,0,.575],124:[.25,.75,0,0,.31944],125:[.25,.75,0,0,.575],126:[.35,.34444,0,0,.575],160:[0,0,0,0,.25],163:[0,.69444,0,0,.86853],168:[0,.69444,0,0,.575],172:[0,.44444,0,0,.76666],176:[0,.69444,0,0,.86944],177:[.13333,.63333,0,0,.89444],184:[.17014,0,0,0,.51111],198:[0,.68611,0,0,1.04166],215:[.13333,.63333,0,0,.89444],216:[.04861,.73472,0,0,.89444],223:[0,.69444,0,0,.59722],230:[0,.44444,0,0,.83055],247:[.13333,.63333,0,0,.89444],248:[.09722,.54167,0,0,.575],305:[0,.44444,0,0,.31944],338:[0,.68611,0,0,1.16944],339:[0,.44444,0,0,.89444],567:[.19444,.44444,0,0,.35139],710:[0,.69444,0,0,.575],711:[0,.63194,0,0,.575],713:[0,.59611,0,0,.575],714:[0,.69444,0,0,.575],715:[0,.69444,0,0,.575],728:[0,.69444,0,0,.575],729:[0,.69444,0,0,.31944],730:[0,.69444,0,0,.86944],732:[0,.69444,0,0,.575],733:[0,.69444,0,0,.575],915:[0,.68611,0,0,.69166],916:[0,.68611,0,0,.95833],920:[0,.68611,0,0,.89444],923:[0,.68611,0,0,.80555],926:[0,.68611,0,0,.76666],928:[0,.68611,0,0,.9],931:[0,.68611,0,0,.83055],933:[0,.68611,0,0,.89444],934:[0,.68611,0,0,.83055],936:[0,.68611,0,0,.89444],937:[0,.68611,0,0,.83055],8211:[0,.44444,.03194,0,.575],8212:[0,.44444,.03194,0,1.14999],8216:[0,.69444,0,0,.31944],8217:[0,.69444,0,0,.31944],8220:[0,.69444,0,0,.60278],8221:[0,.69444,0,0,.60278],8224:[.19444,.69444,0,0,.51111],8225:[.19444,.69444,0,0,.51111],8242:[0,.55556,0,0,.34444],8407:[0,.72444,.15486,0,.575],8463:[0,.69444,0,0,.66759],8465:[0,.69444,0,0,.83055],8467:[0,.69444,0,0,.47361],8472:[.19444,.44444,0,0,.74027],8476:[0,.69444,0,0,.83055],8501:[0,.69444,0,0,.70277],8592:[-.10889,.39111,0,0,1.14999],8593:[.19444,.69444,0,0,.575],8594:[-.10889,.39111,0,0,1.14999],8595:[.19444,.69444,0,0,.575],8596:[-.10889,.39111,0,0,1.14999],8597:[.25,.75,0,0,.575],8598:[.19444,.69444,0,0,1.14999],8599:[.19444,.69444,0,0,1.14999],8600:[.19444,.69444,0,0,1.14999],8601:[.19444,.69444,0,0,1.14999],8636:[-.10889,.39111,0,0,1.14999],8637:[-.10889,.39111,0,0,1.14999],8640:[-.10889,.39111,0,0,1.14999],8641:[-.10889,.39111,0,0,1.14999],8656:[-.10889,.39111,0,0,1.14999],8657:[.19444,.69444,0,0,.70277],8658:[-.10889,.39111,0,0,1.14999],8659:[.19444,.69444,0,0,.70277],8660:[-.10889,.39111,0,0,1.14999],8661:[.25,.75,0,0,.70277],8704:[0,.69444,0,0,.63889],8706:[0,.69444,.06389,0,.62847],8707:[0,.69444,0,0,.63889],8709:[.05556,.75,0,0,.575],8711:[0,.68611,0,0,.95833],8712:[.08556,.58556,0,0,.76666],8715:[.08556,.58556,0,0,.76666],8722:[.13333,.63333,0,0,.89444],8723:[.13333,.63333,0,0,.89444],8725:[.25,.75,0,0,.575],8726:[.25,.75,0,0,.575],8727:[-.02778,.47222,0,0,.575],8728:[-.02639,.47361,0,0,.575],8729:[-.02639,.47361,0,0,.575],8730:[.18,.82,0,0,.95833],8733:[0,.44444,0,0,.89444],8734:[0,.44444,0,0,1.14999],8736:[0,.69224,0,0,.72222],8739:[.25,.75,0,0,.31944],8741:[.25,.75,0,0,.575],8743:[0,.55556,0,0,.76666],8744:[0,.55556,0,0,.76666],8745:[0,.55556,0,0,.76666],8746:[0,.55556,0,0,.76666],8747:[.19444,.69444,.12778,0,.56875],8764:[-.10889,.39111,0,0,.89444],8768:[.19444,.69444,0,0,.31944],8771:[.00222,.50222,0,0,.89444],8773:[.027,.638,0,0,.894],8776:[.02444,.52444,0,0,.89444],8781:[.00222,.50222,0,0,.89444],8801:[.00222,.50222,0,0,.89444],8804:[.19667,.69667,0,0,.89444],8805:[.19667,.69667,0,0,.89444],8810:[.08556,.58556,0,0,1.14999],8811:[.08556,.58556,0,0,1.14999],8826:[.08556,.58556,0,0,.89444],8827:[.08556,.58556,0,0,.89444],8834:[.08556,.58556,0,0,.89444],8835:[.08556,.58556,0,0,.89444],8838:[.19667,.69667,0,0,.89444],8839:[.19667,.69667,0,0,.89444],8846:[0,.55556,0,0,.76666],8849:[.19667,.69667,0,0,.89444],8850:[.19667,.69667,0,0,.89444],8851:[0,.55556,0,0,.76666],8852:[0,.55556,0,0,.76666],8853:[.13333,.63333,0,0,.89444],8854:[.13333,.63333,0,0,.89444],8855:[.13333,.63333,0,0,.89444],8856:[.13333,.63333,0,0,.89444],8857:[.13333,.63333,0,0,.89444],8866:[0,.69444,0,0,.70277],8867:[0,.69444,0,0,.70277],8868:[0,.69444,0,0,.89444],8869:[0,.69444,0,0,.89444],8900:[-.02639,.47361,0,0,.575],8901:[-.02639,.47361,0,0,.31944],8902:[-.02778,.47222,0,0,.575],8968:[.25,.75,0,0,.51111],8969:[.25,.75,0,0,.51111],8970:[.25,.75,0,0,.51111],8971:[.25,.75,0,0,.51111],8994:[-.13889,.36111,0,0,1.14999],8995:[-.13889,.36111,0,0,1.14999],9651:[.19444,.69444,0,0,1.02222],9657:[-.02778,.47222,0,0,.575],9661:[.19444,.69444,0,0,1.02222],9667:[-.02778,.47222,0,0,.575],9711:[.19444,.69444,0,0,1.14999],9824:[.12963,.69444,0,0,.89444],9825:[.12963,.69444,0,0,.89444],9826:[.12963,.69444,0,0,.89444],9827:[.12963,.69444,0,0,.89444],9837:[0,.75,0,0,.44722],9838:[.19444,.69444,0,0,.44722],9839:[.19444,.69444,0,0,.44722],10216:[.25,.75,0,0,.44722],10217:[.25,.75,0,0,.44722],10815:[0,.68611,0,0,.9],10927:[.19667,.69667,0,0,.89444],10928:[.19667,.69667,0,0,.89444],57376:[.19444,.69444,0,0,0]},"Main-BoldItalic":{32:[0,0,0,0,.25],33:[0,.69444,.11417,0,.38611],34:[0,.69444,.07939,0,.62055],35:[.19444,.69444,.06833,0,.94444],37:[.05556,.75,.12861,0,.94444],38:[0,.69444,.08528,0,.88555],39:[0,.69444,.12945,0,.35555],40:[.25,.75,.15806,0,.47333],41:[.25,.75,.03306,0,.47333],42:[0,.75,.14333,0,.59111],43:[.10333,.60333,.03306,0,.88555],44:[.19444,.14722,0,0,.35555],45:[0,.44444,.02611,0,.41444],46:[0,.14722,0,0,.35555],47:[.25,.75,.15806,0,.59111],48:[0,.64444,.13167,0,.59111],49:[0,.64444,.13167,0,.59111],50:[0,.64444,.13167,0,.59111],51:[0,.64444,.13167,0,.59111],52:[.19444,.64444,.13167,0,.59111],53:[0,.64444,.13167,0,.59111],54:[0,.64444,.13167,0,.59111],55:[.19444,.64444,.13167,0,.59111],56:[0,.64444,.13167,0,.59111],57:[0,.64444,.13167,0,.59111],58:[0,.44444,.06695,0,.35555],59:[.19444,.44444,.06695,0,.35555],61:[-.10889,.39111,.06833,0,.88555],63:[0,.69444,.11472,0,.59111],64:[0,.69444,.09208,0,.88555],65:[0,.68611,0,0,.86555],66:[0,.68611,.0992,0,.81666],67:[0,.68611,.14208,0,.82666],68:[0,.68611,.09062,0,.87555],69:[0,.68611,.11431,0,.75666],70:[0,.68611,.12903,0,.72722],71:[0,.68611,.07347,0,.89527],72:[0,.68611,.17208,0,.8961],73:[0,.68611,.15681,0,.47166],74:[0,.68611,.145,0,.61055],75:[0,.68611,.14208,0,.89499],76:[0,.68611,0,0,.69777],77:[0,.68611,.17208,0,1.07277],78:[0,.68611,.17208,0,.8961],79:[0,.68611,.09062,0,.85499],80:[0,.68611,.0992,0,.78721],81:[.19444,.68611,.09062,0,.85499],82:[0,.68611,.02559,0,.85944],83:[0,.68611,.11264,0,.64999],84:[0,.68611,.12903,0,.7961],85:[0,.68611,.17208,0,.88083],86:[0,.68611,.18625,0,.86555],87:[0,.68611,.18625,0,1.15999],88:[0,.68611,.15681,0,.86555],89:[0,.68611,.19803,0,.86555],90:[0,.68611,.14208,0,.70888],91:[.25,.75,.1875,0,.35611],93:[.25,.75,.09972,0,.35611],94:[0,.69444,.06709,0,.59111],95:[.31,.13444,.09811,0,.59111],97:[0,.44444,.09426,0,.59111],98:[0,.69444,.07861,0,.53222],99:[0,.44444,.05222,0,.53222],100:[0,.69444,.10861,0,.59111],101:[0,.44444,.085,0,.53222],102:[.19444,.69444,.21778,0,.4],103:[.19444,.44444,.105,0,.53222],104:[0,.69444,.09426,0,.59111],105:[0,.69326,.11387,0,.35555],106:[.19444,.69326,.1672,0,.35555],107:[0,.69444,.11111,0,.53222],108:[0,.69444,.10861,0,.29666],109:[0,.44444,.09426,0,.94444],110:[0,.44444,.09426,0,.64999],111:[0,.44444,.07861,0,.59111],112:[.19444,.44444,.07861,0,.59111],113:[.19444,.44444,.105,0,.53222],114:[0,.44444,.11111,0,.50167],115:[0,.44444,.08167,0,.48694],116:[0,.63492,.09639,0,.385],117:[0,.44444,.09426,0,.62055],118:[0,.44444,.11111,0,.53222],119:[0,.44444,.11111,0,.76777],120:[0,.44444,.12583,0,.56055],121:[.19444,.44444,.105,0,.56166],122:[0,.44444,.13889,0,.49055],126:[.35,.34444,.11472,0,.59111],160:[0,0,0,0,.25],168:[0,.69444,.11473,0,.59111],176:[0,.69444,0,0,.94888],184:[.17014,0,0,0,.53222],198:[0,.68611,.11431,0,1.02277],216:[.04861,.73472,.09062,0,.88555],223:[.19444,.69444,.09736,0,.665],230:[0,.44444,.085,0,.82666],248:[.09722,.54167,.09458,0,.59111],305:[0,.44444,.09426,0,.35555],338:[0,.68611,.11431,0,1.14054],339:[0,.44444,.085,0,.82666],567:[.19444,.44444,.04611,0,.385],710:[0,.69444,.06709,0,.59111],711:[0,.63194,.08271,0,.59111],713:[0,.59444,.10444,0,.59111],714:[0,.69444,.08528,0,.59111],715:[0,.69444,0,0,.59111],728:[0,.69444,.10333,0,.59111],729:[0,.69444,.12945,0,.35555],730:[0,.69444,0,0,.94888],732:[0,.69444,.11472,0,.59111],733:[0,.69444,.11472,0,.59111],915:[0,.68611,.12903,0,.69777],916:[0,.68611,0,0,.94444],920:[0,.68611,.09062,0,.88555],923:[0,.68611,0,0,.80666],926:[0,.68611,.15092,0,.76777],928:[0,.68611,.17208,0,.8961],931:[0,.68611,.11431,0,.82666],933:[0,.68611,.10778,0,.88555],934:[0,.68611,.05632,0,.82666],936:[0,.68611,.10778,0,.88555],937:[0,.68611,.0992,0,.82666],8211:[0,.44444,.09811,0,.59111],8212:[0,.44444,.09811,0,1.18221],8216:[0,.69444,.12945,0,.35555],8217:[0,.69444,.12945,0,.35555],8220:[0,.69444,.16772,0,.62055],8221:[0,.69444,.07939,0,.62055]},"Main-Italic":{32:[0,0,0,0,.25],33:[0,.69444,.12417,0,.30667],34:[0,.69444,.06961,0,.51444],35:[.19444,.69444,.06616,0,.81777],37:[.05556,.75,.13639,0,.81777],38:[0,.69444,.09694,0,.76666],39:[0,.69444,.12417,0,.30667],40:[.25,.75,.16194,0,.40889],41:[.25,.75,.03694,0,.40889],42:[0,.75,.14917,0,.51111],43:[.05667,.56167,.03694,0,.76666],44:[.19444,.10556,0,0,.30667],45:[0,.43056,.02826,0,.35778],46:[0,.10556,0,0,.30667],47:[.25,.75,.16194,0,.51111],48:[0,.64444,.13556,0,.51111],49:[0,.64444,.13556,0,.51111],50:[0,.64444,.13556,0,.51111],51:[0,.64444,.13556,0,.51111],52:[.19444,.64444,.13556,0,.51111],53:[0,.64444,.13556,0,.51111],54:[0,.64444,.13556,0,.51111],55:[.19444,.64444,.13556,0,.51111],56:[0,.64444,.13556,0,.51111],57:[0,.64444,.13556,0,.51111],58:[0,.43056,.0582,0,.30667],59:[.19444,.43056,.0582,0,.30667],61:[-.13313,.36687,.06616,0,.76666],63:[0,.69444,.1225,0,.51111],64:[0,.69444,.09597,0,.76666],65:[0,.68333,0,0,.74333],66:[0,.68333,.10257,0,.70389],67:[0,.68333,.14528,0,.71555],68:[0,.68333,.09403,0,.755],69:[0,.68333,.12028,0,.67833],70:[0,.68333,.13305,0,.65277],71:[0,.68333,.08722,0,.77361],72:[0,.68333,.16389,0,.74333],73:[0,.68333,.15806,0,.38555],74:[0,.68333,.14028,0,.525],75:[0,.68333,.14528,0,.76888],76:[0,.68333,0,0,.62722],77:[0,.68333,.16389,0,.89666],78:[0,.68333,.16389,0,.74333],79:[0,.68333,.09403,0,.76666],80:[0,.68333,.10257,0,.67833],81:[.19444,.68333,.09403,0,.76666],82:[0,.68333,.03868,0,.72944],83:[0,.68333,.11972,0,.56222],84:[0,.68333,.13305,0,.71555],85:[0,.68333,.16389,0,.74333],86:[0,.68333,.18361,0,.74333],87:[0,.68333,.18361,0,.99888],88:[0,.68333,.15806,0,.74333],89:[0,.68333,.19383,0,.74333],90:[0,.68333,.14528,0,.61333],91:[.25,.75,.1875,0,.30667],93:[.25,.75,.10528,0,.30667],94:[0,.69444,.06646,0,.51111],95:[.31,.12056,.09208,0,.51111],97:[0,.43056,.07671,0,.51111],98:[0,.69444,.06312,0,.46],99:[0,.43056,.05653,0,.46],100:[0,.69444,.10333,0,.51111],101:[0,.43056,.07514,0,.46],102:[.19444,.69444,.21194,0,.30667],103:[.19444,.43056,.08847,0,.46],104:[0,.69444,.07671,0,.51111],105:[0,.65536,.1019,0,.30667],106:[.19444,.65536,.14467,0,.30667],107:[0,.69444,.10764,0,.46],108:[0,.69444,.10333,0,.25555],109:[0,.43056,.07671,0,.81777],110:[0,.43056,.07671,0,.56222],111:[0,.43056,.06312,0,.51111],112:[.19444,.43056,.06312,0,.51111],113:[.19444,.43056,.08847,0,.46],114:[0,.43056,.10764,0,.42166],115:[0,.43056,.08208,0,.40889],116:[0,.61508,.09486,0,.33222],117:[0,.43056,.07671,0,.53666],118:[0,.43056,.10764,0,.46],119:[0,.43056,.10764,0,.66444],120:[0,.43056,.12042,0,.46389],121:[.19444,.43056,.08847,0,.48555],122:[0,.43056,.12292,0,.40889],126:[.35,.31786,.11585,0,.51111],160:[0,0,0,0,.25],168:[0,.66786,.10474,0,.51111],176:[0,.69444,0,0,.83129],184:[.17014,0,0,0,.46],198:[0,.68333,.12028,0,.88277],216:[.04861,.73194,.09403,0,.76666],223:[.19444,.69444,.10514,0,.53666],230:[0,.43056,.07514,0,.71555],248:[.09722,.52778,.09194,0,.51111],338:[0,.68333,.12028,0,.98499],339:[0,.43056,.07514,0,.71555],710:[0,.69444,.06646,0,.51111],711:[0,.62847,.08295,0,.51111],713:[0,.56167,.10333,0,.51111],714:[0,.69444,.09694,0,.51111],715:[0,.69444,0,0,.51111],728:[0,.69444,.10806,0,.51111],729:[0,.66786,.11752,0,.30667],730:[0,.69444,0,0,.83129],732:[0,.66786,.11585,0,.51111],733:[0,.69444,.1225,0,.51111],915:[0,.68333,.13305,0,.62722],916:[0,.68333,0,0,.81777],920:[0,.68333,.09403,0,.76666],923:[0,.68333,0,0,.69222],926:[0,.68333,.15294,0,.66444],928:[0,.68333,.16389,0,.74333],931:[0,.68333,.12028,0,.71555],933:[0,.68333,.11111,0,.76666],934:[0,.68333,.05986,0,.71555],936:[0,.68333,.11111,0,.76666],937:[0,.68333,.10257,0,.71555],8211:[0,.43056,.09208,0,.51111],8212:[0,.43056,.09208,0,1.02222],8216:[0,.69444,.12417,0,.30667],8217:[0,.69444,.12417,0,.30667],8220:[0,.69444,.1685,0,.51444],8221:[0,.69444,.06961,0,.51444],8463:[0,.68889,0,0,.54028]},"Main-Regular":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.27778],34:[0,.69444,0,0,.5],35:[.19444,.69444,0,0,.83334],36:[.05556,.75,0,0,.5],37:[.05556,.75,0,0,.83334],38:[0,.69444,0,0,.77778],39:[0,.69444,0,0,.27778],40:[.25,.75,0,0,.38889],41:[.25,.75,0,0,.38889],42:[0,.75,0,0,.5],43:[.08333,.58333,0,0,.77778],44:[.19444,.10556,0,0,.27778],45:[0,.43056,0,0,.33333],46:[0,.10556,0,0,.27778],47:[.25,.75,0,0,.5],48:[0,.64444,0,0,.5],49:[0,.64444,0,0,.5],50:[0,.64444,0,0,.5],51:[0,.64444,0,0,.5],52:[0,.64444,0,0,.5],53:[0,.64444,0,0,.5],54:[0,.64444,0,0,.5],55:[0,.64444,0,0,.5],56:[0,.64444,0,0,.5],57:[0,.64444,0,0,.5],58:[0,.43056,0,0,.27778],59:[.19444,.43056,0,0,.27778],60:[.0391,.5391,0,0,.77778],61:[-.13313,.36687,0,0,.77778],62:[.0391,.5391,0,0,.77778],63:[0,.69444,0,0,.47222],64:[0,.69444,0,0,.77778],65:[0,.68333,0,0,.75],66:[0,.68333,0,0,.70834],67:[0,.68333,0,0,.72222],68:[0,.68333,0,0,.76389],69:[0,.68333,0,0,.68056],70:[0,.68333,0,0,.65278],71:[0,.68333,0,0,.78472],72:[0,.68333,0,0,.75],73:[0,.68333,0,0,.36111],74:[0,.68333,0,0,.51389],75:[0,.68333,0,0,.77778],76:[0,.68333,0,0,.625],77:[0,.68333,0,0,.91667],78:[0,.68333,0,0,.75],79:[0,.68333,0,0,.77778],80:[0,.68333,0,0,.68056],81:[.19444,.68333,0,0,.77778],82:[0,.68333,0,0,.73611],83:[0,.68333,0,0,.55556],84:[0,.68333,0,0,.72222],85:[0,.68333,0,0,.75],86:[0,.68333,.01389,0,.75],87:[0,.68333,.01389,0,1.02778],88:[0,.68333,0,0,.75],89:[0,.68333,.025,0,.75],90:[0,.68333,0,0,.61111],91:[.25,.75,0,0,.27778],92:[.25,.75,0,0,.5],93:[.25,.75,0,0,.27778],94:[0,.69444,0,0,.5],95:[.31,.12056,.02778,0,.5],97:[0,.43056,0,0,.5],98:[0,.69444,0,0,.55556],99:[0,.43056,0,0,.44445],100:[0,.69444,0,0,.55556],101:[0,.43056,0,0,.44445],102:[0,.69444,.07778,0,.30556],103:[.19444,.43056,.01389,0,.5],104:[0,.69444,0,0,.55556],105:[0,.66786,0,0,.27778],106:[.19444,.66786,0,0,.30556],107:[0,.69444,0,0,.52778],108:[0,.69444,0,0,.27778],109:[0,.43056,0,0,.83334],110:[0,.43056,0,0,.55556],111:[0,.43056,0,0,.5],112:[.19444,.43056,0,0,.55556],113:[.19444,.43056,0,0,.52778],114:[0,.43056,0,0,.39167],115:[0,.43056,0,0,.39445],116:[0,.61508,0,0,.38889],117:[0,.43056,0,0,.55556],118:[0,.43056,.01389,0,.52778],119:[0,.43056,.01389,0,.72222],120:[0,.43056,0,0,.52778],121:[.19444,.43056,.01389,0,.52778],122:[0,.43056,0,0,.44445],123:[.25,.75,0,0,.5],124:[.25,.75,0,0,.27778],125:[.25,.75,0,0,.5],126:[.35,.31786,0,0,.5],160:[0,0,0,0,.25],163:[0,.69444,0,0,.76909],167:[.19444,.69444,0,0,.44445],168:[0,.66786,0,0,.5],172:[0,.43056,0,0,.66667],176:[0,.69444,0,0,.75],177:[.08333,.58333,0,0,.77778],182:[.19444,.69444,0,0,.61111],184:[.17014,0,0,0,.44445],198:[0,.68333,0,0,.90278],215:[.08333,.58333,0,0,.77778],216:[.04861,.73194,0,0,.77778],223:[0,.69444,0,0,.5],230:[0,.43056,0,0,.72222],247:[.08333,.58333,0,0,.77778],248:[.09722,.52778,0,0,.5],305:[0,.43056,0,0,.27778],338:[0,.68333,0,0,1.01389],339:[0,.43056,0,0,.77778],567:[.19444,.43056,0,0,.30556],710:[0,.69444,0,0,.5],711:[0,.62847,0,0,.5],713:[0,.56778,0,0,.5],714:[0,.69444,0,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,0,0,.5],729:[0,.66786,0,0,.27778],730:[0,.69444,0,0,.75],732:[0,.66786,0,0,.5],733:[0,.69444,0,0,.5],915:[0,.68333,0,0,.625],916:[0,.68333,0,0,.83334],920:[0,.68333,0,0,.77778],923:[0,.68333,0,0,.69445],926:[0,.68333,0,0,.66667],928:[0,.68333,0,0,.75],931:[0,.68333,0,0,.72222],933:[0,.68333,0,0,.77778],934:[0,.68333,0,0,.72222],936:[0,.68333,0,0,.77778],937:[0,.68333,0,0,.72222],8211:[0,.43056,.02778,0,.5],8212:[0,.43056,.02778,0,1],8216:[0,.69444,0,0,.27778],8217:[0,.69444,0,0,.27778],8220:[0,.69444,0,0,.5],8221:[0,.69444,0,0,.5],8224:[.19444,.69444,0,0,.44445],8225:[.19444,.69444,0,0,.44445],8230:[0,.123,0,0,1.172],8242:[0,.55556,0,0,.275],8407:[0,.71444,.15382,0,.5],8463:[0,.68889,0,0,.54028],8465:[0,.69444,0,0,.72222],8467:[0,.69444,0,.11111,.41667],8472:[.19444,.43056,0,.11111,.63646],8476:[0,.69444,0,0,.72222],8501:[0,.69444,0,0,.61111],8592:[-.13313,.36687,0,0,1],8593:[.19444,.69444,0,0,.5],8594:[-.13313,.36687,0,0,1],8595:[.19444,.69444,0,0,.5],8596:[-.13313,.36687,0,0,1],8597:[.25,.75,0,0,.5],8598:[.19444,.69444,0,0,1],8599:[.19444,.69444,0,0,1],8600:[.19444,.69444,0,0,1],8601:[.19444,.69444,0,0,1],8614:[.011,.511,0,0,1],8617:[.011,.511,0,0,1.126],8618:[.011,.511,0,0,1.126],8636:[-.13313,.36687,0,0,1],8637:[-.13313,.36687,0,0,1],8640:[-.13313,.36687,0,0,1],8641:[-.13313,.36687,0,0,1],8652:[.011,.671,0,0,1],8656:[-.13313,.36687,0,0,1],8657:[.19444,.69444,0,0,.61111],8658:[-.13313,.36687,0,0,1],8659:[.19444,.69444,0,0,.61111],8660:[-.13313,.36687,0,0,1],8661:[.25,.75,0,0,.61111],8704:[0,.69444,0,0,.55556],8706:[0,.69444,.05556,.08334,.5309],8707:[0,.69444,0,0,.55556],8709:[.05556,.75,0,0,.5],8711:[0,.68333,0,0,.83334],8712:[.0391,.5391,0,0,.66667],8715:[.0391,.5391,0,0,.66667],8722:[.08333,.58333,0,0,.77778],8723:[.08333,.58333,0,0,.77778],8725:[.25,.75,0,0,.5],8726:[.25,.75,0,0,.5],8727:[-.03472,.46528,0,0,.5],8728:[-.05555,.44445,0,0,.5],8729:[-.05555,.44445,0,0,.5],8730:[.2,.8,0,0,.83334],8733:[0,.43056,0,0,.77778],8734:[0,.43056,0,0,1],8736:[0,.69224,0,0,.72222],8739:[.25,.75,0,0,.27778],8741:[.25,.75,0,0,.5],8743:[0,.55556,0,0,.66667],8744:[0,.55556,0,0,.66667],8745:[0,.55556,0,0,.66667],8746:[0,.55556,0,0,.66667],8747:[.19444,.69444,.11111,0,.41667],8764:[-.13313,.36687,0,0,.77778],8768:[.19444,.69444,0,0,.27778],8771:[-.03625,.46375,0,0,.77778],8773:[-.022,.589,0,0,.778],8776:[-.01688,.48312,0,0,.77778],8781:[-.03625,.46375,0,0,.77778],8784:[-.133,.673,0,0,.778],8801:[-.03625,.46375,0,0,.77778],8804:[.13597,.63597,0,0,.77778],8805:[.13597,.63597,0,0,.77778],8810:[.0391,.5391,0,0,1],8811:[.0391,.5391,0,0,1],8826:[.0391,.5391,0,0,.77778],8827:[.0391,.5391,0,0,.77778],8834:[.0391,.5391,0,0,.77778],8835:[.0391,.5391,0,0,.77778],8838:[.13597,.63597,0,0,.77778],8839:[.13597,.63597,0,0,.77778],8846:[0,.55556,0,0,.66667],8849:[.13597,.63597,0,0,.77778],8850:[.13597,.63597,0,0,.77778],8851:[0,.55556,0,0,.66667],8852:[0,.55556,0,0,.66667],8853:[.08333,.58333,0,0,.77778],8854:[.08333,.58333,0,0,.77778],8855:[.08333,.58333,0,0,.77778],8856:[.08333,.58333,0,0,.77778],8857:[.08333,.58333,0,0,.77778],8866:[0,.69444,0,0,.61111],8867:[0,.69444,0,0,.61111],8868:[0,.69444,0,0,.77778],8869:[0,.69444,0,0,.77778],8872:[.249,.75,0,0,.867],8900:[-.05555,.44445,0,0,.5],8901:[-.05555,.44445,0,0,.27778],8902:[-.03472,.46528,0,0,.5],8904:[.005,.505,0,0,.9],8942:[.03,.903,0,0,.278],8943:[-.19,.313,0,0,1.172],8945:[-.1,.823,0,0,1.282],8968:[.25,.75,0,0,.44445],8969:[.25,.75,0,0,.44445],8970:[.25,.75,0,0,.44445],8971:[.25,.75,0,0,.44445],8994:[-.14236,.35764,0,0,1],8995:[-.14236,.35764,0,0,1],9136:[.244,.744,0,0,.412],9137:[.244,.745,0,0,.412],9651:[.19444,.69444,0,0,.88889],9657:[-.03472,.46528,0,0,.5],9661:[.19444,.69444,0,0,.88889],9667:[-.03472,.46528,0,0,.5],9711:[.19444,.69444,0,0,1],9824:[.12963,.69444,0,0,.77778],9825:[.12963,.69444,0,0,.77778],9826:[.12963,.69444,0,0,.77778],9827:[.12963,.69444,0,0,.77778],9837:[0,.75,0,0,.38889],9838:[.19444,.69444,0,0,.38889],9839:[.19444,.69444,0,0,.38889],10216:[.25,.75,0,0,.38889],10217:[.25,.75,0,0,.38889],10222:[.244,.744,0,0,.412],10223:[.244,.745,0,0,.412],10229:[.011,.511,0,0,1.609],10230:[.011,.511,0,0,1.638],10231:[.011,.511,0,0,1.859],10232:[.024,.525,0,0,1.609],10233:[.024,.525,0,0,1.638],10234:[.024,.525,0,0,1.858],10236:[.011,.511,0,0,1.638],10815:[0,.68333,0,0,.75],10927:[.13597,.63597,0,0,.77778],10928:[.13597,.63597,0,0,.77778],57376:[.19444,.69444,0,0,0]},"Math-BoldItalic":{32:[0,0,0,0,.25],48:[0,.44444,0,0,.575],49:[0,.44444,0,0,.575],50:[0,.44444,0,0,.575],51:[.19444,.44444,0,0,.575],52:[.19444,.44444,0,0,.575],53:[.19444,.44444,0,0,.575],54:[0,.64444,0,0,.575],55:[.19444,.44444,0,0,.575],56:[0,.64444,0,0,.575],57:[.19444,.44444,0,0,.575],65:[0,.68611,0,0,.86944],66:[0,.68611,.04835,0,.8664],67:[0,.68611,.06979,0,.81694],68:[0,.68611,.03194,0,.93812],69:[0,.68611,.05451,0,.81007],70:[0,.68611,.15972,0,.68889],71:[0,.68611,0,0,.88673],72:[0,.68611,.08229,0,.98229],73:[0,.68611,.07778,0,.51111],74:[0,.68611,.10069,0,.63125],75:[0,.68611,.06979,0,.97118],76:[0,.68611,0,0,.75555],77:[0,.68611,.11424,0,1.14201],78:[0,.68611,.11424,0,.95034],79:[0,.68611,.03194,0,.83666],80:[0,.68611,.15972,0,.72309],81:[.19444,.68611,0,0,.86861],82:[0,.68611,.00421,0,.87235],83:[0,.68611,.05382,0,.69271],84:[0,.68611,.15972,0,.63663],85:[0,.68611,.11424,0,.80027],86:[0,.68611,.25555,0,.67778],87:[0,.68611,.15972,0,1.09305],88:[0,.68611,.07778,0,.94722],89:[0,.68611,.25555,0,.67458],90:[0,.68611,.06979,0,.77257],97:[0,.44444,0,0,.63287],98:[0,.69444,0,0,.52083],99:[0,.44444,0,0,.51342],100:[0,.69444,0,0,.60972],101:[0,.44444,0,0,.55361],102:[.19444,.69444,.11042,0,.56806],103:[.19444,.44444,.03704,0,.5449],104:[0,.69444,0,0,.66759],105:[0,.69326,0,0,.4048],106:[.19444,.69326,.0622,0,.47083],107:[0,.69444,.01852,0,.6037],108:[0,.69444,.0088,0,.34815],109:[0,.44444,0,0,1.0324],110:[0,.44444,0,0,.71296],111:[0,.44444,0,0,.58472],112:[.19444,.44444,0,0,.60092],113:[.19444,.44444,.03704,0,.54213],114:[0,.44444,.03194,0,.5287],115:[0,.44444,0,0,.53125],116:[0,.63492,0,0,.41528],117:[0,.44444,0,0,.68102],118:[0,.44444,.03704,0,.56666],119:[0,.44444,.02778,0,.83148],120:[0,.44444,0,0,.65903],121:[.19444,.44444,.03704,0,.59028],122:[0,.44444,.04213,0,.55509],160:[0,0,0,0,.25],915:[0,.68611,.15972,0,.65694],916:[0,.68611,0,0,.95833],920:[0,.68611,.03194,0,.86722],923:[0,.68611,0,0,.80555],926:[0,.68611,.07458,0,.84125],928:[0,.68611,.08229,0,.98229],931:[0,.68611,.05451,0,.88507],933:[0,.68611,.15972,0,.67083],934:[0,.68611,0,0,.76666],936:[0,.68611,.11653,0,.71402],937:[0,.68611,.04835,0,.8789],945:[0,.44444,0,0,.76064],946:[.19444,.69444,.03403,0,.65972],947:[.19444,.44444,.06389,0,.59003],948:[0,.69444,.03819,0,.52222],949:[0,.44444,0,0,.52882],950:[.19444,.69444,.06215,0,.50833],951:[.19444,.44444,.03704,0,.6],952:[0,.69444,.03194,0,.5618],953:[0,.44444,0,0,.41204],954:[0,.44444,0,0,.66759],955:[0,.69444,0,0,.67083],956:[.19444,.44444,0,0,.70787],957:[0,.44444,.06898,0,.57685],958:[.19444,.69444,.03021,0,.50833],959:[0,.44444,0,0,.58472],960:[0,.44444,.03704,0,.68241],961:[.19444,.44444,0,0,.6118],962:[.09722,.44444,.07917,0,.42361],963:[0,.44444,.03704,0,.68588],964:[0,.44444,.13472,0,.52083],965:[0,.44444,.03704,0,.63055],966:[.19444,.44444,0,0,.74722],967:[.19444,.44444,0,0,.71805],968:[.19444,.69444,.03704,0,.75833],969:[0,.44444,.03704,0,.71782],977:[0,.69444,0,0,.69155],981:[.19444,.69444,0,0,.7125],982:[0,.44444,.03194,0,.975],1009:[.19444,.44444,0,0,.6118],1013:[0,.44444,0,0,.48333],57649:[0,.44444,0,0,.39352],57911:[.19444,.44444,0,0,.43889]},"Math-Italic":{32:[0,0,0,0,.25],48:[0,.43056,0,0,.5],49:[0,.43056,0,0,.5],50:[0,.43056,0,0,.5],51:[.19444,.43056,0,0,.5],52:[.19444,.43056,0,0,.5],53:[.19444,.43056,0,0,.5],54:[0,.64444,0,0,.5],55:[.19444,.43056,0,0,.5],56:[0,.64444,0,0,.5],57:[.19444,.43056,0,0,.5],65:[0,.68333,0,.13889,.75],66:[0,.68333,.05017,.08334,.75851],67:[0,.68333,.07153,.08334,.71472],68:[0,.68333,.02778,.05556,.82792],69:[0,.68333,.05764,.08334,.7382],70:[0,.68333,.13889,.08334,.64306],71:[0,.68333,0,.08334,.78625],72:[0,.68333,.08125,.05556,.83125],73:[0,.68333,.07847,.11111,.43958],74:[0,.68333,.09618,.16667,.55451],75:[0,.68333,.07153,.05556,.84931],76:[0,.68333,0,.02778,.68056],77:[0,.68333,.10903,.08334,.97014],78:[0,.68333,.10903,.08334,.80347],79:[0,.68333,.02778,.08334,.76278],80:[0,.68333,.13889,.08334,.64201],81:[.19444,.68333,0,.08334,.79056],82:[0,.68333,.00773,.08334,.75929],83:[0,.68333,.05764,.08334,.6132],84:[0,.68333,.13889,.08334,.58438],85:[0,.68333,.10903,.02778,.68278],86:[0,.68333,.22222,0,.58333],87:[0,.68333,.13889,0,.94445],88:[0,.68333,.07847,.08334,.82847],89:[0,.68333,.22222,0,.58056],90:[0,.68333,.07153,.08334,.68264],97:[0,.43056,0,0,.52859],98:[0,.69444,0,0,.42917],99:[0,.43056,0,.05556,.43276],100:[0,.69444,0,.16667,.52049],101:[0,.43056,0,.05556,.46563],102:[.19444,.69444,.10764,.16667,.48959],103:[.19444,.43056,.03588,.02778,.47697],104:[0,.69444,0,0,.57616],105:[0,.65952,0,0,.34451],106:[.19444,.65952,.05724,0,.41181],107:[0,.69444,.03148,0,.5206],108:[0,.69444,.01968,.08334,.29838],109:[0,.43056,0,0,.87801],110:[0,.43056,0,0,.60023],111:[0,.43056,0,.05556,.48472],112:[.19444,.43056,0,.08334,.50313],113:[.19444,.43056,.03588,.08334,.44641],114:[0,.43056,.02778,.05556,.45116],115:[0,.43056,0,.05556,.46875],116:[0,.61508,0,.08334,.36111],117:[0,.43056,0,.02778,.57246],118:[0,.43056,.03588,.02778,.48472],119:[0,.43056,.02691,.08334,.71592],120:[0,.43056,0,.02778,.57153],121:[.19444,.43056,.03588,.05556,.49028],122:[0,.43056,.04398,.05556,.46505],160:[0,0,0,0,.25],915:[0,.68333,.13889,.08334,.61528],916:[0,.68333,0,.16667,.83334],920:[0,.68333,.02778,.08334,.76278],923:[0,.68333,0,.16667,.69445],926:[0,.68333,.07569,.08334,.74236],928:[0,.68333,.08125,.05556,.83125],931:[0,.68333,.05764,.08334,.77986],933:[0,.68333,.13889,.05556,.58333],934:[0,.68333,0,.08334,.66667],936:[0,.68333,.11,.05556,.61222],937:[0,.68333,.05017,.08334,.7724],945:[0,.43056,.0037,.02778,.6397],946:[.19444,.69444,.05278,.08334,.56563],947:[.19444,.43056,.05556,0,.51773],948:[0,.69444,.03785,.05556,.44444],949:[0,.43056,0,.08334,.46632],950:[.19444,.69444,.07378,.08334,.4375],951:[.19444,.43056,.03588,.05556,.49653],952:[0,.69444,.02778,.08334,.46944],953:[0,.43056,0,.05556,.35394],954:[0,.43056,0,0,.57616],955:[0,.69444,0,0,.58334],956:[.19444,.43056,0,.02778,.60255],957:[0,.43056,.06366,.02778,.49398],958:[.19444,.69444,.04601,.11111,.4375],959:[0,.43056,0,.05556,.48472],960:[0,.43056,.03588,0,.57003],961:[.19444,.43056,0,.08334,.51702],962:[.09722,.43056,.07986,.08334,.36285],963:[0,.43056,.03588,0,.57141],964:[0,.43056,.1132,.02778,.43715],965:[0,.43056,.03588,.02778,.54028],966:[.19444,.43056,0,.08334,.65417],967:[.19444,.43056,0,.05556,.62569],968:[.19444,.69444,.03588,.11111,.65139],969:[0,.43056,.03588,0,.62245],977:[0,.69444,0,.08334,.59144],981:[.19444,.69444,0,.08334,.59583],982:[0,.43056,.02778,0,.82813],1009:[.19444,.43056,0,.08334,.51702],1013:[0,.43056,0,.05556,.4059],57649:[0,.43056,0,.02778,.32246],57911:[.19444,.43056,0,.08334,.38403]},"SansSerif-Bold":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.36667],34:[0,.69444,0,0,.55834],35:[.19444,.69444,0,0,.91667],36:[.05556,.75,0,0,.55],37:[.05556,.75,0,0,1.02912],38:[0,.69444,0,0,.83056],39:[0,.69444,0,0,.30556],40:[.25,.75,0,0,.42778],41:[.25,.75,0,0,.42778],42:[0,.75,0,0,.55],43:[.11667,.61667,0,0,.85556],44:[.10556,.13056,0,0,.30556],45:[0,.45833,0,0,.36667],46:[0,.13056,0,0,.30556],47:[.25,.75,0,0,.55],48:[0,.69444,0,0,.55],49:[0,.69444,0,0,.55],50:[0,.69444,0,0,.55],51:[0,.69444,0,0,.55],52:[0,.69444,0,0,.55],53:[0,.69444,0,0,.55],54:[0,.69444,0,0,.55],55:[0,.69444,0,0,.55],56:[0,.69444,0,0,.55],57:[0,.69444,0,0,.55],58:[0,.45833,0,0,.30556],59:[.10556,.45833,0,0,.30556],61:[-.09375,.40625,0,0,.85556],63:[0,.69444,0,0,.51945],64:[0,.69444,0,0,.73334],65:[0,.69444,0,0,.73334],66:[0,.69444,0,0,.73334],67:[0,.69444,0,0,.70278],68:[0,.69444,0,0,.79445],69:[0,.69444,0,0,.64167],70:[0,.69444,0,0,.61111],71:[0,.69444,0,0,.73334],72:[0,.69444,0,0,.79445],73:[0,.69444,0,0,.33056],74:[0,.69444,0,0,.51945],75:[0,.69444,0,0,.76389],76:[0,.69444,0,0,.58056],77:[0,.69444,0,0,.97778],78:[0,.69444,0,0,.79445],79:[0,.69444,0,0,.79445],80:[0,.69444,0,0,.70278],81:[.10556,.69444,0,0,.79445],82:[0,.69444,0,0,.70278],83:[0,.69444,0,0,.61111],84:[0,.69444,0,0,.73334],85:[0,.69444,0,0,.76389],86:[0,.69444,.01528,0,.73334],87:[0,.69444,.01528,0,1.03889],88:[0,.69444,0,0,.73334],89:[0,.69444,.0275,0,.73334],90:[0,.69444,0,0,.67223],91:[.25,.75,0,0,.34306],93:[.25,.75,0,0,.34306],94:[0,.69444,0,0,.55],95:[.35,.10833,.03056,0,.55],97:[0,.45833,0,0,.525],98:[0,.69444,0,0,.56111],99:[0,.45833,0,0,.48889],100:[0,.69444,0,0,.56111],101:[0,.45833,0,0,.51111],102:[0,.69444,.07639,0,.33611],103:[.19444,.45833,.01528,0,.55],104:[0,.69444,0,0,.56111],105:[0,.69444,0,0,.25556],106:[.19444,.69444,0,0,.28611],107:[0,.69444,0,0,.53056],108:[0,.69444,0,0,.25556],109:[0,.45833,0,0,.86667],110:[0,.45833,0,0,.56111],111:[0,.45833,0,0,.55],112:[.19444,.45833,0,0,.56111],113:[.19444,.45833,0,0,.56111],114:[0,.45833,.01528,0,.37222],115:[0,.45833,0,0,.42167],116:[0,.58929,0,0,.40417],117:[0,.45833,0,0,.56111],118:[0,.45833,.01528,0,.5],119:[0,.45833,.01528,0,.74445],120:[0,.45833,0,0,.5],121:[.19444,.45833,.01528,0,.5],122:[0,.45833,0,0,.47639],126:[.35,.34444,0,0,.55],160:[0,0,0,0,.25],168:[0,.69444,0,0,.55],176:[0,.69444,0,0,.73334],180:[0,.69444,0,0,.55],184:[.17014,0,0,0,.48889],305:[0,.45833,0,0,.25556],567:[.19444,.45833,0,0,.28611],710:[0,.69444,0,0,.55],711:[0,.63542,0,0,.55],713:[0,.63778,0,0,.55],728:[0,.69444,0,0,.55],729:[0,.69444,0,0,.30556],730:[0,.69444,0,0,.73334],732:[0,.69444,0,0,.55],733:[0,.69444,0,0,.55],915:[0,.69444,0,0,.58056],916:[0,.69444,0,0,.91667],920:[0,.69444,0,0,.85556],923:[0,.69444,0,0,.67223],926:[0,.69444,0,0,.73334],928:[0,.69444,0,0,.79445],931:[0,.69444,0,0,.79445],933:[0,.69444,0,0,.85556],934:[0,.69444,0,0,.79445],936:[0,.69444,0,0,.85556],937:[0,.69444,0,0,.79445],8211:[0,.45833,.03056,0,.55],8212:[0,.45833,.03056,0,1.10001],8216:[0,.69444,0,0,.30556],8217:[0,.69444,0,0,.30556],8220:[0,.69444,0,0,.55834],8221:[0,.69444,0,0,.55834]},"SansSerif-Italic":{32:[0,0,0,0,.25],33:[0,.69444,.05733,0,.31945],34:[0,.69444,.00316,0,.5],35:[.19444,.69444,.05087,0,.83334],36:[.05556,.75,.11156,0,.5],37:[.05556,.75,.03126,0,.83334],38:[0,.69444,.03058,0,.75834],39:[0,.69444,.07816,0,.27778],40:[.25,.75,.13164,0,.38889],41:[.25,.75,.02536,0,.38889],42:[0,.75,.11775,0,.5],43:[.08333,.58333,.02536,0,.77778],44:[.125,.08333,0,0,.27778],45:[0,.44444,.01946,0,.33333],46:[0,.08333,0,0,.27778],47:[.25,.75,.13164,0,.5],48:[0,.65556,.11156,0,.5],49:[0,.65556,.11156,0,.5],50:[0,.65556,.11156,0,.5],51:[0,.65556,.11156,0,.5],52:[0,.65556,.11156,0,.5],53:[0,.65556,.11156,0,.5],54:[0,.65556,.11156,0,.5],55:[0,.65556,.11156,0,.5],56:[0,.65556,.11156,0,.5],57:[0,.65556,.11156,0,.5],58:[0,.44444,.02502,0,.27778],59:[.125,.44444,.02502,0,.27778],61:[-.13,.37,.05087,0,.77778],63:[0,.69444,.11809,0,.47222],64:[0,.69444,.07555,0,.66667],65:[0,.69444,0,0,.66667],66:[0,.69444,.08293,0,.66667],67:[0,.69444,.11983,0,.63889],68:[0,.69444,.07555,0,.72223],69:[0,.69444,.11983,0,.59722],70:[0,.69444,.13372,0,.56945],71:[0,.69444,.11983,0,.66667],72:[0,.69444,.08094,0,.70834],73:[0,.69444,.13372,0,.27778],74:[0,.69444,.08094,0,.47222],75:[0,.69444,.11983,0,.69445],76:[0,.69444,0,0,.54167],77:[0,.69444,.08094,0,.875],78:[0,.69444,.08094,0,.70834],79:[0,.69444,.07555,0,.73611],80:[0,.69444,.08293,0,.63889],81:[.125,.69444,.07555,0,.73611],82:[0,.69444,.08293,0,.64584],83:[0,.69444,.09205,0,.55556],84:[0,.69444,.13372,0,.68056],85:[0,.69444,.08094,0,.6875],86:[0,.69444,.1615,0,.66667],87:[0,.69444,.1615,0,.94445],88:[0,.69444,.13372,0,.66667],89:[0,.69444,.17261,0,.66667],90:[0,.69444,.11983,0,.61111],91:[.25,.75,.15942,0,.28889],93:[.25,.75,.08719,0,.28889],94:[0,.69444,.0799,0,.5],95:[.35,.09444,.08616,0,.5],97:[0,.44444,.00981,0,.48056],98:[0,.69444,.03057,0,.51667],99:[0,.44444,.08336,0,.44445],100:[0,.69444,.09483,0,.51667],101:[0,.44444,.06778,0,.44445],102:[0,.69444,.21705,0,.30556],103:[.19444,.44444,.10836,0,.5],104:[0,.69444,.01778,0,.51667],105:[0,.67937,.09718,0,.23889],106:[.19444,.67937,.09162,0,.26667],107:[0,.69444,.08336,0,.48889],108:[0,.69444,.09483,0,.23889],109:[0,.44444,.01778,0,.79445],110:[0,.44444,.01778,0,.51667],111:[0,.44444,.06613,0,.5],112:[.19444,.44444,.0389,0,.51667],113:[.19444,.44444,.04169,0,.51667],114:[0,.44444,.10836,0,.34167],115:[0,.44444,.0778,0,.38333],116:[0,.57143,.07225,0,.36111],117:[0,.44444,.04169,0,.51667],118:[0,.44444,.10836,0,.46111],119:[0,.44444,.10836,0,.68334],120:[0,.44444,.09169,0,.46111],121:[.19444,.44444,.10836,0,.46111],122:[0,.44444,.08752,0,.43472],126:[.35,.32659,.08826,0,.5],160:[0,0,0,0,.25],168:[0,.67937,.06385,0,.5],176:[0,.69444,0,0,.73752],184:[.17014,0,0,0,.44445],305:[0,.44444,.04169,0,.23889],567:[.19444,.44444,.04169,0,.26667],710:[0,.69444,.0799,0,.5],711:[0,.63194,.08432,0,.5],713:[0,.60889,.08776,0,.5],714:[0,.69444,.09205,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,.09483,0,.5],729:[0,.67937,.07774,0,.27778],730:[0,.69444,0,0,.73752],732:[0,.67659,.08826,0,.5],733:[0,.69444,.09205,0,.5],915:[0,.69444,.13372,0,.54167],916:[0,.69444,0,0,.83334],920:[0,.69444,.07555,0,.77778],923:[0,.69444,0,0,.61111],926:[0,.69444,.12816,0,.66667],928:[0,.69444,.08094,0,.70834],931:[0,.69444,.11983,0,.72222],933:[0,.69444,.09031,0,.77778],934:[0,.69444,.04603,0,.72222],936:[0,.69444,.09031,0,.77778],937:[0,.69444,.08293,0,.72222],8211:[0,.44444,.08616,0,.5],8212:[0,.44444,.08616,0,1],8216:[0,.69444,.07816,0,.27778],8217:[0,.69444,.07816,0,.27778],8220:[0,.69444,.14205,0,.5],8221:[0,.69444,.00316,0,.5]},"SansSerif-Regular":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.31945],34:[0,.69444,0,0,.5],35:[.19444,.69444,0,0,.83334],36:[.05556,.75,0,0,.5],37:[.05556,.75,0,0,.83334],38:[0,.69444,0,0,.75834],39:[0,.69444,0,0,.27778],40:[.25,.75,0,0,.38889],41:[.25,.75,0,0,.38889],42:[0,.75,0,0,.5],43:[.08333,.58333,0,0,.77778],44:[.125,.08333,0,0,.27778],45:[0,.44444,0,0,.33333],46:[0,.08333,0,0,.27778],47:[.25,.75,0,0,.5],48:[0,.65556,0,0,.5],49:[0,.65556,0,0,.5],50:[0,.65556,0,0,.5],51:[0,.65556,0,0,.5],52:[0,.65556,0,0,.5],53:[0,.65556,0,0,.5],54:[0,.65556,0,0,.5],55:[0,.65556,0,0,.5],56:[0,.65556,0,0,.5],57:[0,.65556,0,0,.5],58:[0,.44444,0,0,.27778],59:[.125,.44444,0,0,.27778],61:[-.13,.37,0,0,.77778],63:[0,.69444,0,0,.47222],64:[0,.69444,0,0,.66667],65:[0,.69444,0,0,.66667],66:[0,.69444,0,0,.66667],67:[0,.69444,0,0,.63889],68:[0,.69444,0,0,.72223],69:[0,.69444,0,0,.59722],70:[0,.69444,0,0,.56945],71:[0,.69444,0,0,.66667],72:[0,.69444,0,0,.70834],73:[0,.69444,0,0,.27778],74:[0,.69444,0,0,.47222],75:[0,.69444,0,0,.69445],76:[0,.69444,0,0,.54167],77:[0,.69444,0,0,.875],78:[0,.69444,0,0,.70834],79:[0,.69444,0,0,.73611],80:[0,.69444,0,0,.63889],81:[.125,.69444,0,0,.73611],82:[0,.69444,0,0,.64584],83:[0,.69444,0,0,.55556],84:[0,.69444,0,0,.68056],85:[0,.69444,0,0,.6875],86:[0,.69444,.01389,0,.66667],87:[0,.69444,.01389,0,.94445],88:[0,.69444,0,0,.66667],89:[0,.69444,.025,0,.66667],90:[0,.69444,0,0,.61111],91:[.25,.75,0,0,.28889],93:[.25,.75,0,0,.28889],94:[0,.69444,0,0,.5],95:[.35,.09444,.02778,0,.5],97:[0,.44444,0,0,.48056],98:[0,.69444,0,0,.51667],99:[0,.44444,0,0,.44445],100:[0,.69444,0,0,.51667],101:[0,.44444,0,0,.44445],102:[0,.69444,.06944,0,.30556],103:[.19444,.44444,.01389,0,.5],104:[0,.69444,0,0,.51667],105:[0,.67937,0,0,.23889],106:[.19444,.67937,0,0,.26667],107:[0,.69444,0,0,.48889],108:[0,.69444,0,0,.23889],109:[0,.44444,0,0,.79445],110:[0,.44444,0,0,.51667],111:[0,.44444,0,0,.5],112:[.19444,.44444,0,0,.51667],113:[.19444,.44444,0,0,.51667],114:[0,.44444,.01389,0,.34167],115:[0,.44444,0,0,.38333],116:[0,.57143,0,0,.36111],117:[0,.44444,0,0,.51667],118:[0,.44444,.01389,0,.46111],119:[0,.44444,.01389,0,.68334],120:[0,.44444,0,0,.46111],121:[.19444,.44444,.01389,0,.46111],122:[0,.44444,0,0,.43472],126:[.35,.32659,0,0,.5],160:[0,0,0,0,.25],168:[0,.67937,0,0,.5],176:[0,.69444,0,0,.66667],184:[.17014,0,0,0,.44445],305:[0,.44444,0,0,.23889],567:[.19444,.44444,0,0,.26667],710:[0,.69444,0,0,.5],711:[0,.63194,0,0,.5],713:[0,.60889,0,0,.5],714:[0,.69444,0,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,0,0,.5],729:[0,.67937,0,0,.27778],730:[0,.69444,0,0,.66667],732:[0,.67659,0,0,.5],733:[0,.69444,0,0,.5],915:[0,.69444,0,0,.54167],916:[0,.69444,0,0,.83334],920:[0,.69444,0,0,.77778],923:[0,.69444,0,0,.61111],926:[0,.69444,0,0,.66667],928:[0,.69444,0,0,.70834],931:[0,.69444,0,0,.72222],933:[0,.69444,0,0,.77778],934:[0,.69444,0,0,.72222],936:[0,.69444,0,0,.77778],937:[0,.69444,0,0,.72222],8211:[0,.44444,.02778,0,.5],8212:[0,.44444,.02778,0,1],8216:[0,.69444,0,0,.27778],8217:[0,.69444,0,0,.27778],8220:[0,.69444,0,0,.5],8221:[0,.69444,0,0,.5]},"Script-Regular":{32:[0,0,0,0,.25],65:[0,.7,.22925,0,.80253],66:[0,.7,.04087,0,.90757],67:[0,.7,.1689,0,.66619],68:[0,.7,.09371,0,.77443],69:[0,.7,.18583,0,.56162],70:[0,.7,.13634,0,.89544],71:[0,.7,.17322,0,.60961],72:[0,.7,.29694,0,.96919],73:[0,.7,.19189,0,.80907],74:[.27778,.7,.19189,0,1.05159],75:[0,.7,.31259,0,.91364],76:[0,.7,.19189,0,.87373],77:[0,.7,.15981,0,1.08031],78:[0,.7,.3525,0,.9015],79:[0,.7,.08078,0,.73787],80:[0,.7,.08078,0,1.01262],81:[0,.7,.03305,0,.88282],82:[0,.7,.06259,0,.85],83:[0,.7,.19189,0,.86767],84:[0,.7,.29087,0,.74697],85:[0,.7,.25815,0,.79996],86:[0,.7,.27523,0,.62204],87:[0,.7,.27523,0,.80532],88:[0,.7,.26006,0,.94445],89:[0,.7,.2939,0,.70961],90:[0,.7,.24037,0,.8212],160:[0,0,0,0,.25]},"Size1-Regular":{32:[0,0,0,0,.25],40:[.35001,.85,0,0,.45834],41:[.35001,.85,0,0,.45834],47:[.35001,.85,0,0,.57778],91:[.35001,.85,0,0,.41667],92:[.35001,.85,0,0,.57778],93:[.35001,.85,0,0,.41667],123:[.35001,.85,0,0,.58334],125:[.35001,.85,0,0,.58334],160:[0,0,0,0,.25],710:[0,.72222,0,0,.55556],732:[0,.72222,0,0,.55556],770:[0,.72222,0,0,.55556],771:[0,.72222,0,0,.55556],8214:[-99e-5,.601,0,0,.77778],8593:[1e-5,.6,0,0,.66667],8595:[1e-5,.6,0,0,.66667],8657:[1e-5,.6,0,0,.77778],8659:[1e-5,.6,0,0,.77778],8719:[.25001,.75,0,0,.94445],8720:[.25001,.75,0,0,.94445],8721:[.25001,.75,0,0,1.05556],8730:[.35001,.85,0,0,1],8739:[-.00599,.606,0,0,.33333],8741:[-.00599,.606,0,0,.55556],8747:[.30612,.805,.19445,0,.47222],8748:[.306,.805,.19445,0,.47222],8749:[.306,.805,.19445,0,.47222],8750:[.30612,.805,.19445,0,.47222],8896:[.25001,.75,0,0,.83334],8897:[.25001,.75,0,0,.83334],8898:[.25001,.75,0,0,.83334],8899:[.25001,.75,0,0,.83334],8968:[.35001,.85,0,0,.47222],8969:[.35001,.85,0,0,.47222],8970:[.35001,.85,0,0,.47222],8971:[.35001,.85,0,0,.47222],9168:[-99e-5,.601,0,0,.66667],10216:[.35001,.85,0,0,.47222],10217:[.35001,.85,0,0,.47222],10752:[.25001,.75,0,0,1.11111],10753:[.25001,.75,0,0,1.11111],10754:[.25001,.75,0,0,1.11111],10756:[.25001,.75,0,0,.83334],10758:[.25001,.75,0,0,.83334]},"Size2-Regular":{32:[0,0,0,0,.25],40:[.65002,1.15,0,0,.59722],41:[.65002,1.15,0,0,.59722],47:[.65002,1.15,0,0,.81111],91:[.65002,1.15,0,0,.47222],92:[.65002,1.15,0,0,.81111],93:[.65002,1.15,0,0,.47222],123:[.65002,1.15,0,0,.66667],125:[.65002,1.15,0,0,.66667],160:[0,0,0,0,.25],710:[0,.75,0,0,1],732:[0,.75,0,0,1],770:[0,.75,0,0,1],771:[0,.75,0,0,1],8719:[.55001,1.05,0,0,1.27778],8720:[.55001,1.05,0,0,1.27778],8721:[.55001,1.05,0,0,1.44445],8730:[.65002,1.15,0,0,1],8747:[.86225,1.36,.44445,0,.55556],8748:[.862,1.36,.44445,0,.55556],8749:[.862,1.36,.44445,0,.55556],8750:[.86225,1.36,.44445,0,.55556],8896:[.55001,1.05,0,0,1.11111],8897:[.55001,1.05,0,0,1.11111],8898:[.55001,1.05,0,0,1.11111],8899:[.55001,1.05,0,0,1.11111],8968:[.65002,1.15,0,0,.52778],8969:[.65002,1.15,0,0,.52778],8970:[.65002,1.15,0,0,.52778],8971:[.65002,1.15,0,0,.52778],10216:[.65002,1.15,0,0,.61111],10217:[.65002,1.15,0,0,.61111],10752:[.55001,1.05,0,0,1.51112],10753:[.55001,1.05,0,0,1.51112],10754:[.55001,1.05,0,0,1.51112],10756:[.55001,1.05,0,0,1.11111],10758:[.55001,1.05,0,0,1.11111]},"Size3-Regular":{32:[0,0,0,0,.25],40:[.95003,1.45,0,0,.73611],41:[.95003,1.45,0,0,.73611],47:[.95003,1.45,0,0,1.04445],91:[.95003,1.45,0,0,.52778],92:[.95003,1.45,0,0,1.04445],93:[.95003,1.45,0,0,.52778],123:[.95003,1.45,0,0,.75],125:[.95003,1.45,0,0,.75],160:[0,0,0,0,.25],710:[0,.75,0,0,1.44445],732:[0,.75,0,0,1.44445],770:[0,.75,0,0,1.44445],771:[0,.75,0,0,1.44445],8730:[.95003,1.45,0,0,1],8968:[.95003,1.45,0,0,.58334],8969:[.95003,1.45,0,0,.58334],8970:[.95003,1.45,0,0,.58334],8971:[.95003,1.45,0,0,.58334],10216:[.95003,1.45,0,0,.75],10217:[.95003,1.45,0,0,.75]},"Size4-Regular":{32:[0,0,0,0,.25],40:[1.25003,1.75,0,0,.79167],41:[1.25003,1.75,0,0,.79167],47:[1.25003,1.75,0,0,1.27778],91:[1.25003,1.75,0,0,.58334],92:[1.25003,1.75,0,0,1.27778],93:[1.25003,1.75,0,0,.58334],123:[1.25003,1.75,0,0,.80556],125:[1.25003,1.75,0,0,.80556],160:[0,0,0,0,.25],710:[0,.825,0,0,1.8889],732:[0,.825,0,0,1.8889],770:[0,.825,0,0,1.8889],771:[0,.825,0,0,1.8889],8730:[1.25003,1.75,0,0,1],8968:[1.25003,1.75,0,0,.63889],8969:[1.25003,1.75,0,0,.63889],8970:[1.25003,1.75,0,0,.63889],8971:[1.25003,1.75,0,0,.63889],9115:[.64502,1.155,0,0,.875],9116:[1e-5,.6,0,0,.875],9117:[.64502,1.155,0,0,.875],9118:[.64502,1.155,0,0,.875],9119:[1e-5,.6,0,0,.875],9120:[.64502,1.155,0,0,.875],9121:[.64502,1.155,0,0,.66667],9122:[-99e-5,.601,0,0,.66667],9123:[.64502,1.155,0,0,.66667],9124:[.64502,1.155,0,0,.66667],9125:[-99e-5,.601,0,0,.66667],9126:[.64502,1.155,0,0,.66667],9127:[1e-5,.9,0,0,.88889],9128:[.65002,1.15,0,0,.88889],9129:[.90001,0,0,0,.88889],9130:[0,.3,0,0,.88889],9131:[1e-5,.9,0,0,.88889],9132:[.65002,1.15,0,0,.88889],9133:[.90001,0,0,0,.88889],9143:[.88502,.915,0,0,1.05556],10216:[1.25003,1.75,0,0,.80556],10217:[1.25003,1.75,0,0,.80556],57344:[-.00499,.605,0,0,1.05556],57345:[-.00499,.605,0,0,1.05556],57680:[0,.12,0,0,.45],57681:[0,.12,0,0,.45],57682:[0,.12,0,0,.45],57683:[0,.12,0,0,.45]},"Typewriter-Regular":{32:[0,0,0,0,.525],33:[0,.61111,0,0,.525],34:[0,.61111,0,0,.525],35:[0,.61111,0,0,.525],36:[.08333,.69444,0,0,.525],37:[.08333,.69444,0,0,.525],38:[0,.61111,0,0,.525],39:[0,.61111,0,0,.525],40:[.08333,.69444,0,0,.525],41:[.08333,.69444,0,0,.525],42:[0,.52083,0,0,.525],43:[-.08056,.53055,0,0,.525],44:[.13889,.125,0,0,.525],45:[-.08056,.53055,0,0,.525],46:[0,.125,0,0,.525],47:[.08333,.69444,0,0,.525],48:[0,.61111,0,0,.525],49:[0,.61111,0,0,.525],50:[0,.61111,0,0,.525],51:[0,.61111,0,0,.525],52:[0,.61111,0,0,.525],53:[0,.61111,0,0,.525],54:[0,.61111,0,0,.525],55:[0,.61111,0,0,.525],56:[0,.61111,0,0,.525],57:[0,.61111,0,0,.525],58:[0,.43056,0,0,.525],59:[.13889,.43056,0,0,.525],60:[-.05556,.55556,0,0,.525],61:[-.19549,.41562,0,0,.525],62:[-.05556,.55556,0,0,.525],63:[0,.61111,0,0,.525],64:[0,.61111,0,0,.525],65:[0,.61111,0,0,.525],66:[0,.61111,0,0,.525],67:[0,.61111,0,0,.525],68:[0,.61111,0,0,.525],69:[0,.61111,0,0,.525],70:[0,.61111,0,0,.525],71:[0,.61111,0,0,.525],72:[0,.61111,0,0,.525],73:[0,.61111,0,0,.525],74:[0,.61111,0,0,.525],75:[0,.61111,0,0,.525],76:[0,.61111,0,0,.525],77:[0,.61111,0,0,.525],78:[0,.61111,0,0,.525],79:[0,.61111,0,0,.525],80:[0,.61111,0,0,.525],81:[.13889,.61111,0,0,.525],82:[0,.61111,0,0,.525],83:[0,.61111,0,0,.525],84:[0,.61111,0,0,.525],85:[0,.61111,0,0,.525],86:[0,.61111,0,0,.525],87:[0,.61111,0,0,.525],88:[0,.61111,0,0,.525],89:[0,.61111,0,0,.525],90:[0,.61111,0,0,.525],91:[.08333,.69444,0,0,.525],92:[.08333,.69444,0,0,.525],93:[.08333,.69444,0,0,.525],94:[0,.61111,0,0,.525],95:[.09514,0,0,0,.525],96:[0,.61111,0,0,.525],97:[0,.43056,0,0,.525],98:[0,.61111,0,0,.525],99:[0,.43056,0,0,.525],100:[0,.61111,0,0,.525],101:[0,.43056,0,0,.525],102:[0,.61111,0,0,.525],103:[.22222,.43056,0,0,.525],104:[0,.61111,0,0,.525],105:[0,.61111,0,0,.525],106:[.22222,.61111,0,0,.525],107:[0,.61111,0,0,.525],108:[0,.61111,0,0,.525],109:[0,.43056,0,0,.525],110:[0,.43056,0,0,.525],111:[0,.43056,0,0,.525],112:[.22222,.43056,0,0,.525],113:[.22222,.43056,0,0,.525],114:[0,.43056,0,0,.525],115:[0,.43056,0,0,.525],116:[0,.55358,0,0,.525],117:[0,.43056,0,0,.525],118:[0,.43056,0,0,.525],119:[0,.43056,0,0,.525],120:[0,.43056,0,0,.525],121:[.22222,.43056,0,0,.525],122:[0,.43056,0,0,.525],123:[.08333,.69444,0,0,.525],124:[.08333,.69444,0,0,.525],125:[.08333,.69444,0,0,.525],126:[0,.61111,0,0,.525],127:[0,.61111,0,0,.525],160:[0,0,0,0,.525],176:[0,.61111,0,0,.525],184:[.19445,0,0,0,.525],305:[0,.43056,0,0,.525],567:[.22222,.43056,0,0,.525],711:[0,.56597,0,0,.525],713:[0,.56555,0,0,.525],714:[0,.61111,0,0,.525],715:[0,.61111,0,0,.525],728:[0,.61111,0,0,.525],730:[0,.61111,0,0,.525],770:[0,.61111,0,0,.525],771:[0,.61111,0,0,.525],776:[0,.61111,0,0,.525],915:[0,.61111,0,0,.525],916:[0,.61111,0,0,.525],920:[0,.61111,0,0,.525],923:[0,.61111,0,0,.525],926:[0,.61111,0,0,.525],928:[0,.61111,0,0,.525],931:[0,.61111,0,0,.525],933:[0,.61111,0,0,.525],934:[0,.61111,0,0,.525],936:[0,.61111,0,0,.525],937:[0,.61111,0,0,.525],8216:[0,.61111,0,0,.525],8217:[0,.61111,0,0,.525],8242:[0,.61111,0,0,.525],9251:[.11111,.21944,0,0,.525]}},jc={slant:[.25,.25,.25],space:[0,0,0],stretch:[0,0,0],shrink:[0,0,0],xHeight:[.431,.431,.431],quad:[1,1.171,1.472],extraSpace:[0,0,0],num1:[.677,.732,.925],num2:[.394,.384,.387],num3:[.444,.471,.504],denom1:[.686,.752,1.025],denom2:[.345,.344,.532],sup1:[.413,.503,.504],sup2:[.363,.431,.404],sup3:[.289,.286,.294],sub1:[.15,.143,.2],sub2:[.247,.286,.4],supDrop:[.386,.353,.494],subDrop:[.05,.071,.1],delim1:[2.39,1.7,1.98],delim2:[1.01,1.157,1.42],axisHeight:[.25,.25,.25],defaultRuleThickness:[.04,.049,.049],bigOpSpacing1:[.111,.111,.111],bigOpSpacing2:[.166,.166,.166],bigOpSpacing3:[.2,.2,.2],bigOpSpacing4:[.6,.611,.611],bigOpSpacing5:[.1,.143,.143],sqrtRuleThickness:[.04,.04,.04],ptPerEm:[10,10,10],doubleRuleSep:[.2,.2,.2],arrayRuleWidth:[.04,.04,.04],fboxsep:[.3,.3,.3],fboxrule:[.04,.04,.04]},Mc={Å:`A`,Ð:`D`,Þ:`o`,å:`a`,ð:`d`,þ:`o`,А:`A`,Б:`B`,В:`B`,Г:`F`,Д:`A`,Е:`E`,Ж:`K`,З:`3`,И:`N`,Й:`N`,К:`K`,Л:`N`,М:`M`,Н:`H`,О:`O`,П:`N`,Р:`P`,С:`C`,Т:`T`,У:`y`,Ф:`O`,Х:`X`,Ц:`U`,Ч:`h`,Ш:`W`,Щ:`W`,Ъ:`B`,Ы:`X`,Ь:`B`,Э:`3`,Ю:`X`,Я:`R`,а:`a`,б:`b`,в:`a`,г:`r`,д:`y`,е:`e`,ж:`m`,з:`e`,и:`n`,й:`n`,к:`n`,л:`n`,м:`m`,н:`n`,о:`o`,п:`n`,р:`p`,с:`c`,т:`o`,у:`y`,ф:`b`,х:`x`,ц:`n`,ч:`n`,ш:`w`,щ:`w`,ъ:`a`,ы:`m`,ь:`a`,э:`e`,ю:`m`,я:`r`};function Nc(e,t){Ac[e]=t}function Pc(e,t,n){if(!Ac[t])throw Error(`Font metrics not found for font: `+t+`.`);var r=e.charCodeAt(0),i=Ac[t][r];if(!i&&e[0]in Mc&&(r=Mc[e[0]].charCodeAt(0),i=Ac[t][r]),!i&&n===`text`&&qs(r)&&(i=Ac[t][77]),i)return{depth:i[0],height:i[1],italic:i[2],skew:i[3],width:i[4]}}var Fc={};function Ic(e){var t=e>=5?0:e>=3?1:2;if(!Fc[t]){var n=Fc[t]={cssEmPerMu:jc.quad[t]/18};for(var r in jc)jc.hasOwnProperty(r)&&(n[r]=jc[r][t])}return Fc[t]}var Lc={math:{},text:{}};function L(e,t,n,r,i,a){Lc[e][i]={font:t,group:n,replace:r},a&&r&&(Lc[e][r]=Lc[e][i])}var R=`math`,z=`text`,B=`main`,V=`ams`,Rc=`accent-token`,H=`bin`,zc=`close`,Bc=`inner`,U=`mathord`,Vc=`op-token`,Hc=`open`,Uc=`punct`,W=`rel`,Wc=`spacing`,G=`textord`;L(R,B,W,`≡`,`\\equiv`,!0),L(R,B,W,`≺`,`\\prec`,!0),L(R,B,W,`≻`,`\\succ`,!0),L(R,B,W,`∼`,`\\sim`,!0),L(R,B,W,`⊥`,`\\perp`),L(R,B,W,`⪯`,`\\preceq`,!0),L(R,B,W,`⪰`,`\\succeq`,!0),L(R,B,W,`≃`,`\\simeq`,!0),L(R,B,W,`∣`,`\\mid`,!0),L(R,B,W,`≪`,`\\ll`,!0),L(R,B,W,`≫`,`\\gg`,!0),L(R,B,W,`≍`,`\\asymp`,!0),L(R,B,W,`∥`,`\\parallel`),L(R,B,W,`⋈`,`\\bowtie`,!0),L(R,B,W,`⌣`,`\\smile`,!0),L(R,B,W,`⊑`,`\\sqsubseteq`,!0),L(R,B,W,`⊒`,`\\sqsupseteq`,!0),L(R,B,W,`≐`,`\\doteq`,!0),L(R,B,W,`⌢`,`\\frown`,!0),L(R,B,W,`∋`,`\\ni`,!0),L(R,B,W,`∝`,`\\propto`,!0),L(R,B,W,`⊢`,`\\vdash`,!0),L(R,B,W,`⊣`,`\\dashv`,!0),L(R,B,W,`∋`,`\\owns`),L(R,B,Uc,`.`,`\\ldotp`),L(R,B,Uc,`⋅`,`\\cdotp`),L(R,B,Uc,`⋅`,`·`),L(z,B,G,`⋅`,`·`),L(R,B,G,`#`,`\\#`),L(z,B,G,`#`,`\\#`),L(R,B,G,`&`,`\\&`),L(z,B,G,`&`,`\\&`),L(R,B,G,`ℵ`,`\\aleph`,!0),L(R,B,G,`∀`,`\\forall`,!0),L(R,B,G,`ℏ`,`\\hbar`,!0),L(R,B,G,`∃`,`\\exists`,!0),L(R,B,G,`∇`,`\\nabla`,!0),L(R,B,G,`♭`,`\\flat`,!0),L(R,B,G,`ℓ`,`\\ell`,!0),L(R,B,G,`♮`,`\\natural`,!0),L(R,B,G,`♣`,`\\clubsuit`,!0),L(R,B,G,`℘`,`\\wp`,!0),L(R,B,G,`♯`,`\\sharp`,!0),L(R,B,G,`♢`,`\\diamondsuit`,!0),L(R,B,G,`ℜ`,`\\Re`,!0),L(R,B,G,`♡`,`\\heartsuit`,!0),L(R,B,G,`ℑ`,`\\Im`,!0),L(R,B,G,`♠`,`\\spadesuit`,!0),L(R,B,G,`§`,`\\S`,!0),L(z,B,G,`§`,`\\S`),L(R,B,G,`¶`,`\\P`,!0),L(z,B,G,`¶`,`\\P`),L(R,B,G,`†`,`\\dag`),L(z,B,G,`†`,`\\dag`),L(z,B,G,`†`,`\\textdagger`),L(R,B,G,`‡`,`\\ddag`),L(z,B,G,`‡`,`\\ddag`),L(z,B,G,`‡`,`\\textdaggerdbl`),L(R,B,zc,`⎱`,`\\rmoustache`,!0),L(R,B,Hc,`⎰`,`\\lmoustache`,!0),L(R,B,zc,`⟯`,`\\rgroup`,!0),L(R,B,Hc,`⟮`,`\\lgroup`,!0),L(R,B,H,`∓`,`\\mp`,!0),L(R,B,H,`⊖`,`\\ominus`,!0),L(R,B,H,`⊎`,`\\uplus`,!0),L(R,B,H,`⊓`,`\\sqcap`,!0),L(R,B,H,`∗`,`\\ast`),L(R,B,H,`⊔`,`\\sqcup`,!0),L(R,B,H,`◯`,`\\bigcirc`,!0),L(R,B,H,`∙`,`\\bullet`,!0),L(R,B,H,`‡`,`\\ddagger`),L(R,B,H,`≀`,`\\wr`,!0),L(R,B,H,`⨿`,`\\amalg`),L(R,B,H,`&`,`\\And`),L(R,B,W,`⟵`,`\\longleftarrow`,!0),L(R,B,W,`⇐`,`\\Leftarrow`,!0),L(R,B,W,`⟸`,`\\Longleftarrow`,!0),L(R,B,W,`⟶`,`\\longrightarrow`,!0),L(R,B,W,`⇒`,`\\Rightarrow`,!0),L(R,B,W,`⟹`,`\\Longrightarrow`,!0),L(R,B,W,`↔`,`\\leftrightarrow`,!0),L(R,B,W,`⟷`,`\\longleftrightarrow`,!0),L(R,B,W,`⇔`,`\\Leftrightarrow`,!0),L(R,B,W,`⟺`,`\\Longleftrightarrow`,!0),L(R,B,W,`↦`,`\\mapsto`,!0),L(R,B,W,`⟼`,`\\longmapsto`,!0),L(R,B,W,`↗`,`\\nearrow`,!0),L(R,B,W,`↩`,`\\hookleftarrow`,!0),L(R,B,W,`↪`,`\\hookrightarrow`,!0),L(R,B,W,`↘`,`\\searrow`,!0),L(R,B,W,`↼`,`\\leftharpoonup`,!0),L(R,B,W,`⇀`,`\\rightharpoonup`,!0),L(R,B,W,`↙`,`\\swarrow`,!0),L(R,B,W,`↽`,`\\leftharpoondown`,!0),L(R,B,W,`⇁`,`\\rightharpoondown`,!0),L(R,B,W,`↖`,`\\nwarrow`,!0),L(R,B,W,`⇌`,`\\rightleftharpoons`,!0),L(R,V,W,`≮`,`\\nless`,!0),L(R,V,W,``,`\\@nleqslant`),L(R,V,W,``,`\\@nleqq`),L(R,V,W,`⪇`,`\\lneq`,!0),L(R,V,W,`≨`,`\\lneqq`,!0),L(R,V,W,``,`\\@lvertneqq`),L(R,V,W,`⋦`,`\\lnsim`,!0),L(R,V,W,`⪉`,`\\lnapprox`,!0),L(R,V,W,`⊀`,`\\nprec`,!0),L(R,V,W,`⋠`,`\\npreceq`,!0),L(R,V,W,`⋨`,`\\precnsim`,!0),L(R,V,W,`⪹`,`\\precnapprox`,!0),L(R,V,W,`≁`,`\\nsim`,!0),L(R,V,W,``,`\\@nshortmid`),L(R,V,W,`∤`,`\\nmid`,!0),L(R,V,W,`⊬`,`\\nvdash`,!0),L(R,V,W,`⊭`,`\\nvDash`,!0),L(R,V,W,`⋪`,`\\ntriangleleft`),L(R,V,W,`⋬`,`\\ntrianglelefteq`,!0),L(R,V,W,`⊊`,`\\subsetneq`,!0),L(R,V,W,``,`\\@varsubsetneq`),L(R,V,W,`⫋`,`\\subsetneqq`,!0),L(R,V,W,``,`\\@varsubsetneqq`),L(R,V,W,`≯`,`\\ngtr`,!0),L(R,V,W,``,`\\@ngeqslant`),L(R,V,W,``,`\\@ngeqq`),L(R,V,W,`⪈`,`\\gneq`,!0),L(R,V,W,`≩`,`\\gneqq`,!0),L(R,V,W,``,`\\@gvertneqq`),L(R,V,W,`⋧`,`\\gnsim`,!0),L(R,V,W,`⪊`,`\\gnapprox`,!0),L(R,V,W,`⊁`,`\\nsucc`,!0),L(R,V,W,`⋡`,`\\nsucceq`,!0),L(R,V,W,`⋩`,`\\succnsim`,!0),L(R,V,W,`⪺`,`\\succnapprox`,!0),L(R,V,W,`≆`,`\\ncong`,!0),L(R,V,W,``,`\\@nshortparallel`),L(R,V,W,`∦`,`\\nparallel`,!0),L(R,V,W,`⊯`,`\\nVDash`,!0),L(R,V,W,`⋫`,`\\ntriangleright`),L(R,V,W,`⋭`,`\\ntrianglerighteq`,!0),L(R,V,W,``,`\\@nsupseteqq`),L(R,V,W,`⊋`,`\\supsetneq`,!0),L(R,V,W,``,`\\@varsupsetneq`),L(R,V,W,`⫌`,`\\supsetneqq`,!0),L(R,V,W,``,`\\@varsupsetneqq`),L(R,V,W,`⊮`,`\\nVdash`,!0),L(R,V,W,`⪵`,`\\precneqq`,!0),L(R,V,W,`⪶`,`\\succneqq`,!0),L(R,V,W,``,`\\@nsubseteqq`),L(R,V,H,`⊴`,`\\unlhd`),L(R,V,H,`⊵`,`\\unrhd`),L(R,V,W,`↚`,`\\nleftarrow`,!0),L(R,V,W,`↛`,`\\nrightarrow`,!0),L(R,V,W,`⇍`,`\\nLeftarrow`,!0),L(R,V,W,`⇏`,`\\nRightarrow`,!0),L(R,V,W,`↮`,`\\nleftrightarrow`,!0),L(R,V,W,`⇎`,`\\nLeftrightarrow`,!0),L(R,V,W,`△`,`\\vartriangle`),L(R,V,G,`ℏ`,`\\hslash`),L(R,V,G,`▽`,`\\triangledown`),L(R,V,G,`◊`,`\\lozenge`),L(R,V,G,`Ⓢ`,`\\circledS`),L(R,V,G,`®`,`\\circledR`),L(z,V,G,`®`,`\\circledR`),L(R,V,G,`∡`,`\\measuredangle`,!0),L(R,V,G,`∄`,`\\nexists`),L(R,V,G,`℧`,`\\mho`),L(R,V,G,`Ⅎ`,`\\Finv`,!0),L(R,V,G,`⅁`,`\\Game`,!0),L(R,V,G,`‵`,`\\backprime`),L(R,V,G,`▲`,`\\blacktriangle`),L(R,V,G,`▼`,`\\blacktriangledown`),L(R,V,G,`■`,`\\blacksquare`),L(R,V,G,`⧫`,`\\blacklozenge`),L(R,V,G,`★`,`\\bigstar`),L(R,V,G,`∢`,`\\sphericalangle`,!0),L(R,V,G,`∁`,`\\complement`,!0),L(R,V,G,`ð`,`\\eth`,!0),L(z,B,G,`ð`,`ð`),L(R,V,G,`╱`,`\\diagup`),L(R,V,G,`╲`,`\\diagdown`),L(R,V,G,`□`,`\\square`),L(R,V,G,`□`,`\\Box`),L(R,V,G,`◊`,`\\Diamond`),L(R,V,G,`¥`,`\\yen`,!0),L(z,V,G,`¥`,`\\yen`,!0),L(R,V,G,`✓`,`\\checkmark`,!0),L(z,V,G,`✓`,`\\checkmark`),L(R,V,G,`ℶ`,`\\beth`,!0),L(R,V,G,`ℸ`,`\\daleth`,!0),L(R,V,G,`ℷ`,`\\gimel`,!0),L(R,V,G,`ϝ`,`\\digamma`,!0),L(R,V,G,`ϰ`,`\\varkappa`),L(R,V,Hc,`┌`,`\\@ulcorner`,!0),L(R,V,zc,`┐`,`\\@urcorner`,!0),L(R,V,Hc,`└`,`\\@llcorner`,!0),L(R,V,zc,`┘`,`\\@lrcorner`,!0),L(R,V,W,`≦`,`\\leqq`,!0),L(R,V,W,`⩽`,`\\leqslant`,!0),L(R,V,W,`⪕`,`\\eqslantless`,!0),L(R,V,W,`≲`,`\\lesssim`,!0),L(R,V,W,`⪅`,`\\lessapprox`,!0),L(R,V,W,`≊`,`\\approxeq`,!0),L(R,V,H,`⋖`,`\\lessdot`),L(R,V,W,`⋘`,`\\lll`,!0),L(R,V,W,`≶`,`\\lessgtr`,!0),L(R,V,W,`⋚`,`\\lesseqgtr`,!0),L(R,V,W,`⪋`,`\\lesseqqgtr`,!0),L(R,V,W,`≑`,`\\doteqdot`),L(R,V,W,`≓`,`\\risingdotseq`,!0),L(R,V,W,`≒`,`\\fallingdotseq`,!0),L(R,V,W,`∽`,`\\backsim`,!0),L(R,V,W,`⋍`,`\\backsimeq`,!0),L(R,V,W,`⫅`,`\\subseteqq`,!0),L(R,V,W,`⋐`,`\\Subset`,!0),L(R,V,W,`⊏`,`\\sqsubset`,!0),L(R,V,W,`≼`,`\\preccurlyeq`,!0),L(R,V,W,`⋞`,`\\curlyeqprec`,!0),L(R,V,W,`≾`,`\\precsim`,!0),L(R,V,W,`⪷`,`\\precapprox`,!0),L(R,V,W,`⊲`,`\\vartriangleleft`),L(R,V,W,`⊴`,`\\trianglelefteq`),L(R,V,W,`⊨`,`\\vDash`,!0),L(R,V,W,`⊪`,`\\Vvdash`,!0),L(R,V,W,`⌣`,`\\smallsmile`),L(R,V,W,`⌢`,`\\smallfrown`),L(R,V,W,`≏`,`\\bumpeq`,!0),L(R,V,W,`≎`,`\\Bumpeq`,!0),L(R,V,W,`≧`,`\\geqq`,!0),L(R,V,W,`⩾`,`\\geqslant`,!0),L(R,V,W,`⪖`,`\\eqslantgtr`,!0),L(R,V,W,`≳`,`\\gtrsim`,!0),L(R,V,W,`⪆`,`\\gtrapprox`,!0),L(R,V,H,`⋗`,`\\gtrdot`),L(R,V,W,`⋙`,`\\ggg`,!0),L(R,V,W,`≷`,`\\gtrless`,!0),L(R,V,W,`⋛`,`\\gtreqless`,!0),L(R,V,W,`⪌`,`\\gtreqqless`,!0),L(R,V,W,`≖`,`\\eqcirc`,!0),L(R,V,W,`≗`,`\\circeq`,!0),L(R,V,W,`≜`,`\\triangleq`,!0),L(R,V,W,`∼`,`\\thicksim`),L(R,V,W,`≈`,`\\thickapprox`),L(R,V,W,`⫆`,`\\supseteqq`,!0),L(R,V,W,`⋑`,`\\Supset`,!0),L(R,V,W,`⊐`,`\\sqsupset`,!0),L(R,V,W,`≽`,`\\succcurlyeq`,!0),L(R,V,W,`⋟`,`\\curlyeqsucc`,!0),L(R,V,W,`≿`,`\\succsim`,!0),L(R,V,W,`⪸`,`\\succapprox`,!0),L(R,V,W,`⊳`,`\\vartriangleright`),L(R,V,W,`⊵`,`\\trianglerighteq`),L(R,V,W,`⊩`,`\\Vdash`,!0),L(R,V,W,`∣`,`\\shortmid`),L(R,V,W,`∥`,`\\shortparallel`),L(R,V,W,`≬`,`\\between`,!0),L(R,V,W,`⋔`,`\\pitchfork`,!0),L(R,V,W,`∝`,`\\varpropto`),L(R,V,W,`◀`,`\\blacktriangleleft`),L(R,V,W,`∴`,`\\therefore`,!0),L(R,V,W,`∍`,`\\backepsilon`),L(R,V,W,`▶`,`\\blacktriangleright`),L(R,V,W,`∵`,`\\because`,!0),L(R,V,W,`⋘`,`\\llless`),L(R,V,W,`⋙`,`\\gggtr`),L(R,V,H,`⊲`,`\\lhd`),L(R,V,H,`⊳`,`\\rhd`),L(R,V,W,`≂`,`\\eqsim`,!0),L(R,B,W,`⋈`,`\\Join`),L(R,V,W,`≑`,`\\Doteq`,!0),L(R,V,H,`∔`,`\\dotplus`,!0),L(R,V,H,`∖`,`\\smallsetminus`),L(R,V,H,`⋒`,`\\Cap`,!0),L(R,V,H,`⋓`,`\\Cup`,!0),L(R,V,H,`⩞`,`\\doublebarwedge`,!0),L(R,V,H,`⊟`,`\\boxminus`,!0),L(R,V,H,`⊞`,`\\boxplus`,!0),L(R,V,H,`⋇`,`\\divideontimes`,!0),L(R,V,H,`⋉`,`\\ltimes`,!0),L(R,V,H,`⋊`,`\\rtimes`,!0),L(R,V,H,`⋋`,`\\leftthreetimes`,!0),L(R,V,H,`⋌`,`\\rightthreetimes`,!0),L(R,V,H,`⋏`,`\\curlywedge`,!0),L(R,V,H,`⋎`,`\\curlyvee`,!0),L(R,V,H,`⊝`,`\\circleddash`,!0),L(R,V,H,`⊛`,`\\circledast`,!0),L(R,V,H,`⋅`,`\\centerdot`),L(R,V,H,`⊺`,`\\intercal`,!0),L(R,V,H,`⋒`,`\\doublecap`),L(R,V,H,`⋓`,`\\doublecup`),L(R,V,H,`⊠`,`\\boxtimes`,!0),L(R,V,W,`⇢`,`\\dashrightarrow`,!0),L(R,V,W,`⇠`,`\\dashleftarrow`,!0),L(R,V,W,`⇇`,`\\leftleftarrows`,!0),L(R,V,W,`⇆`,`\\leftrightarrows`,!0),L(R,V,W,`⇚`,`\\Lleftarrow`,!0),L(R,V,W,`↞`,`\\twoheadleftarrow`,!0),L(R,V,W,`↢`,`\\leftarrowtail`,!0),L(R,V,W,`↫`,`\\looparrowleft`,!0),L(R,V,W,`⇋`,`\\leftrightharpoons`,!0),L(R,V,W,`↶`,`\\curvearrowleft`,!0),L(R,V,W,`↺`,`\\circlearrowleft`,!0),L(R,V,W,`↰`,`\\Lsh`,!0),L(R,V,W,`⇈`,`\\upuparrows`,!0),L(R,V,W,`↿`,`\\upharpoonleft`,!0),L(R,V,W,`⇃`,`\\downharpoonleft`,!0),L(R,B,W,`⊶`,`\\origof`,!0),L(R,B,W,`⊷`,`\\imageof`,!0),L(R,V,W,`⊸`,`\\multimap`,!0),L(R,V,W,`↭`,`\\leftrightsquigarrow`,!0),L(R,V,W,`⇉`,`\\rightrightarrows`,!0),L(R,V,W,`⇄`,`\\rightleftarrows`,!0),L(R,V,W,`↠`,`\\twoheadrightarrow`,!0),L(R,V,W,`↣`,`\\rightarrowtail`,!0),L(R,V,W,`↬`,`\\looparrowright`,!0),L(R,V,W,`↷`,`\\curvearrowright`,!0),L(R,V,W,`↻`,`\\circlearrowright`,!0),L(R,V,W,`↱`,`\\Rsh`,!0),L(R,V,W,`⇊`,`\\downdownarrows`,!0),L(R,V,W,`↾`,`\\upharpoonright`,!0),L(R,V,W,`⇂`,`\\downharpoonright`,!0),L(R,V,W,`⇝`,`\\rightsquigarrow`,!0),L(R,V,W,`⇝`,`\\leadsto`),L(R,V,W,`⇛`,`\\Rrightarrow`,!0),L(R,V,W,`↾`,`\\restriction`),L(R,B,G,`‘`,"`"),L(R,B,G,`$`,`\\$`),L(z,B,G,`$`,`\\$`),L(z,B,G,`$`,`\\textdollar`),L(R,B,G,`%`,`\\%`),L(z,B,G,`%`,`\\%`),L(R,B,G,`_`,`\\_`),L(z,B,G,`_`,`\\_`),L(z,B,G,`_`,`\\textunderscore`),L(R,B,G,`∠`,`\\angle`,!0),L(R,B,G,`∞`,`\\infty`,!0),L(R,B,G,`′`,`\\prime`),L(R,B,G,`△`,`\\triangle`),L(R,B,G,`Γ`,`\\Gamma`,!0),L(R,B,G,`Δ`,`\\Delta`,!0),L(R,B,G,`Θ`,`\\Theta`,!0),L(R,B,G,`Λ`,`\\Lambda`,!0),L(R,B,G,`Ξ`,`\\Xi`,!0),L(R,B,G,`Π`,`\\Pi`,!0),L(R,B,G,`Σ`,`\\Sigma`,!0),L(R,B,G,`Υ`,`\\Upsilon`,!0),L(R,B,G,`Φ`,`\\Phi`,!0),L(R,B,G,`Ψ`,`\\Psi`,!0),L(R,B,G,`Ω`,`\\Omega`,!0),L(R,B,G,`A`,`Α`),L(R,B,G,`B`,`Β`),L(R,B,G,`E`,`Ε`),L(R,B,G,`Z`,`Ζ`),L(R,B,G,`H`,`Η`),L(R,B,G,`I`,`Ι`),L(R,B,G,`K`,`Κ`),L(R,B,G,`M`,`Μ`),L(R,B,G,`N`,`Ν`),L(R,B,G,`O`,`Ο`),L(R,B,G,`P`,`Ρ`),L(R,B,G,`T`,`Τ`),L(R,B,G,`X`,`Χ`),L(R,B,G,`¬`,`\\neg`,!0),L(R,B,G,`¬`,`\\lnot`),L(R,B,G,`⊤`,`\\top`),L(R,B,G,`⊥`,`\\bot`),L(R,B,G,`∅`,`\\emptyset`),L(R,V,G,`∅`,`\\varnothing`),L(R,B,U,`α`,`\\alpha`,!0),L(R,B,U,`β`,`\\beta`,!0),L(R,B,U,`γ`,`\\gamma`,!0),L(R,B,U,`δ`,`\\delta`,!0),L(R,B,U,`ϵ`,`\\epsilon`,!0),L(R,B,U,`ζ`,`\\zeta`,!0),L(R,B,U,`η`,`\\eta`,!0),L(R,B,U,`θ`,`\\theta`,!0),L(R,B,U,`ι`,`\\iota`,!0),L(R,B,U,`κ`,`\\kappa`,!0),L(R,B,U,`λ`,`\\lambda`,!0),L(R,B,U,`μ`,`\\mu`,!0),L(R,B,U,`ν`,`\\nu`,!0),L(R,B,U,`ξ`,`\\xi`,!0),L(R,B,U,`ο`,`\\omicron`,!0),L(R,B,U,`π`,`\\pi`,!0),L(R,B,U,`ρ`,`\\rho`,!0),L(R,B,U,`σ`,`\\sigma`,!0),L(R,B,U,`τ`,`\\tau`,!0),L(R,B,U,`υ`,`\\upsilon`,!0),L(R,B,U,`ϕ`,`\\phi`,!0),L(R,B,U,`χ`,`\\chi`,!0),L(R,B,U,`ψ`,`\\psi`,!0),L(R,B,U,`ω`,`\\omega`,!0),L(R,B,U,`ε`,`\\varepsilon`,!0),L(R,B,U,`ϑ`,`\\vartheta`,!0),L(R,B,U,`ϖ`,`\\varpi`,!0),L(R,B,U,`ϱ`,`\\varrho`,!0),L(R,B,U,`ς`,`\\varsigma`,!0),L(R,B,U,`φ`,`\\varphi`,!0),L(R,B,H,`∗`,`*`,!0),L(R,B,H,`+`,`+`),L(R,B,H,`−`,`-`,!0),L(R,B,H,`⋅`,`\\cdot`,!0),L(R,B,H,`∘`,`\\circ`,!0),L(R,B,H,`÷`,`\\div`,!0),L(R,B,H,`±`,`\\pm`,!0),L(R,B,H,`×`,`\\times`,!0),L(R,B,H,`∩`,`\\cap`,!0),L(R,B,H,`∪`,`\\cup`,!0),L(R,B,H,`∖`,`\\setminus`,!0),L(R,B,H,`∧`,`\\land`),L(R,B,H,`∨`,`\\lor`),L(R,B,H,`∧`,`\\wedge`,!0),L(R,B,H,`∨`,`\\vee`,!0),L(R,B,G,`√`,`\\surd`),L(R,B,Hc,`⟨`,`\\langle`,!0),L(R,B,Hc,`∣`,`\\lvert`),L(R,B,Hc,`∥`,`\\lVert`),L(R,B,zc,`?`,`?`),L(R,B,zc,`!`,`!`),L(R,B,zc,`⟩`,`\\rangle`,!0),L(R,B,zc,`∣`,`\\rvert`),L(R,B,zc,`∥`,`\\rVert`),L(R,B,W,`=`,`=`),L(R,B,W,`:`,`:`),L(R,B,W,`≈`,`\\approx`,!0),L(R,B,W,`≅`,`\\cong`,!0),L(R,B,W,`≥`,`\\ge`),L(R,B,W,`≥`,`\\geq`,!0),L(R,B,W,`←`,`\\gets`),L(R,B,W,`>`,`\\gt`,!0),L(R,B,W,`∈`,`\\in`,!0),L(R,B,W,``,`\\@not`),L(R,B,W,`⊂`,`\\subset`,!0),L(R,B,W,`⊃`,`\\supset`,!0),L(R,B,W,`⊆`,`\\subseteq`,!0),L(R,B,W,`⊇`,`\\supseteq`,!0),L(R,V,W,`⊈`,`\\nsubseteq`,!0),L(R,V,W,`⊉`,`\\nsupseteq`,!0),L(R,B,W,`⊨`,`\\models`),L(R,B,W,`←`,`\\leftarrow`,!0),L(R,B,W,`≤`,`\\le`),L(R,B,W,`≤`,`\\leq`,!0),L(R,B,W,`<`,`\\lt`,!0),L(R,B,W,`→`,`\\rightarrow`,!0),L(R,B,W,`→`,`\\to`),L(R,V,W,`≱`,`\\ngeq`,!0),L(R,V,W,`≰`,`\\nleq`,!0),L(R,B,Wc,`\xA0`,`\\ `),L(R,B,Wc,`\xA0`,`\\space`),L(R,B,Wc,`\xA0`,`\\nobreakspace`),L(z,B,Wc,`\xA0`,`\\ `),L(z,B,Wc,`\xA0`,` `),L(z,B,Wc,`\xA0`,`\\space`),L(z,B,Wc,`\xA0`,`\\nobreakspace`),L(R,B,Wc,``,`\\nobreak`),L(R,B,Wc,``,`\\allowbreak`),L(R,B,Uc,`,`,`,`),L(R,B,Uc,`;`,`;`),L(R,V,H,`⊼`,`\\barwedge`,!0),L(R,V,H,`⊻`,`\\veebar`,!0),L(R,B,H,`⊙`,`\\odot`,!0),L(R,B,H,`⊕`,`\\oplus`,!0),L(R,B,H,`⊗`,`\\otimes`,!0),L(R,B,G,`∂`,`\\partial`,!0),L(R,B,H,`⊘`,`\\oslash`,!0),L(R,V,H,`⊚`,`\\circledcirc`,!0),L(R,V,H,`⊡`,`\\boxdot`,!0),L(R,B,H,`△`,`\\bigtriangleup`),L(R,B,H,`▽`,`\\bigtriangledown`),L(R,B,H,`†`,`\\dagger`),L(R,B,H,`⋄`,`\\diamond`),L(R,B,H,`⋆`,`\\star`),L(R,B,H,`◃`,`\\triangleleft`),L(R,B,H,`▹`,`\\triangleright`),L(R,B,Hc,`{`,`\\{`),L(z,B,G,`{`,`\\{`),L(z,B,G,`{`,`\\textbraceleft`),L(R,B,zc,`}`,`\\}`),L(z,B,G,`}`,`\\}`),L(z,B,G,`}`,`\\textbraceright`),L(R,B,Hc,`{`,`\\lbrace`),L(R,B,zc,`}`,`\\rbrace`),L(R,B,Hc,`[`,`\\lbrack`,!0),L(z,B,G,`[`,`\\lbrack`,!0),L(R,B,zc,`]`,`\\rbrack`,!0),L(z,B,G,`]`,`\\rbrack`,!0),L(R,B,Hc,`(`,`\\lparen`,!0),L(R,B,zc,`)`,`\\rparen`,!0),L(z,B,G,`<`,`\\textless`,!0),L(z,B,G,`>`,`\\textgreater`,!0),L(R,B,Hc,`⌊`,`\\lfloor`,!0),L(R,B,zc,`⌋`,`\\rfloor`,!0),L(R,B,Hc,`⌈`,`\\lceil`,!0),L(R,B,zc,`⌉`,`\\rceil`,!0),L(R,B,G,`\\`,`\\backslash`),L(R,B,G,`∣`,`|`),L(R,B,G,`∣`,`\\vert`),L(z,B,G,`|`,`\\textbar`,!0),L(R,B,G,`∥`,`\\|`),L(R,B,G,`∥`,`\\Vert`),L(z,B,G,`∥`,`\\textbardbl`),L(z,B,G,`~`,`\\textasciitilde`),L(z,B,G,`\\`,`\\textbackslash`),L(z,B,G,`^`,`\\textasciicircum`),L(R,B,W,`↑`,`\\uparrow`,!0),L(R,B,W,`⇑`,`\\Uparrow`,!0),L(R,B,W,`↓`,`\\downarrow`,!0),L(R,B,W,`⇓`,`\\Downarrow`,!0),L(R,B,W,`↕`,`\\updownarrow`,!0),L(R,B,W,`⇕`,`\\Updownarrow`,!0),L(R,B,Vc,`∐`,`\\coprod`),L(R,B,Vc,`⋁`,`\\bigvee`),L(R,B,Vc,`⋀`,`\\bigwedge`),L(R,B,Vc,`⨄`,`\\biguplus`),L(R,B,Vc,`⋂`,`\\bigcap`),L(R,B,Vc,`⋃`,`\\bigcup`),L(R,B,Vc,`∫`,`\\int`),L(R,B,Vc,`∫`,`\\intop`),L(R,B,Vc,`∬`,`\\iint`),L(R,B,Vc,`∭`,`\\iiint`),L(R,B,Vc,`∏`,`\\prod`),L(R,B,Vc,`∑`,`\\sum`),L(R,B,Vc,`⨂`,`\\bigotimes`),L(R,B,Vc,`⨁`,`\\bigoplus`),L(R,B,Vc,`⨀`,`\\bigodot`),L(R,B,Vc,`∮`,`\\oint`),L(R,B,Vc,`∯`,`\\oiint`),L(R,B,Vc,`∰`,`\\oiiint`),L(R,B,Vc,`⨆`,`\\bigsqcup`),L(R,B,Vc,`∫`,`\\smallint`),L(z,B,Bc,`…`,`\\textellipsis`),L(R,B,Bc,`…`,`\\mathellipsis`),L(z,B,Bc,`…`,`\\ldots`,!0),L(R,B,Bc,`…`,`\\ldots`,!0),L(R,B,Bc,`⋯`,`\\@cdots`,!0),L(R,B,Bc,`⋱`,`\\ddots`,!0),L(R,B,G,`⋮`,`\\varvdots`),L(z,B,G,`⋮`,`\\varvdots`),L(R,B,Rc,`ˊ`,`\\acute`),L(R,B,Rc,`ˋ`,`\\grave`),L(R,B,Rc,`¨`,`\\ddot`),L(R,B,Rc,`~`,`\\tilde`),L(R,B,Rc,`ˉ`,`\\bar`),L(R,B,Rc,`˘`,`\\breve`),L(R,B,Rc,`ˇ`,`\\check`),L(R,B,Rc,`^`,`\\hat`),L(R,B,Rc,`⃗`,`\\vec`),L(R,B,Rc,`˙`,`\\dot`),L(R,B,Rc,`˚`,`\\mathring`),L(R,B,U,``,`\\@imath`),L(R,B,U,``,`\\@jmath`),L(R,B,G,`ı`,`ı`),L(R,B,G,`ȷ`,`ȷ`),L(z,B,G,`ı`,`\\i`,!0),L(z,B,G,`ȷ`,`\\j`,!0),L(z,B,G,`ß`,`\\ss`,!0),L(z,B,G,`æ`,`\\ae`,!0),L(z,B,G,`œ`,`\\oe`,!0),L(z,B,G,`ø`,`\\o`,!0),L(z,B,G,`Æ`,`\\AE`,!0),L(z,B,G,`Œ`,`\\OE`,!0),L(z,B,G,`Ø`,`\\O`,!0),L(z,B,Rc,`ˊ`,`\\'`),L(z,B,Rc,`ˋ`,"\\`"),L(z,B,Rc,`ˆ`,`\\^`),L(z,B,Rc,`˜`,`\\~`),L(z,B,Rc,`ˉ`,`\\=`),L(z,B,Rc,`˘`,`\\u`),L(z,B,Rc,`˙`,`\\.`),L(z,B,Rc,`¸`,`\\c`),L(z,B,Rc,`˚`,`\\r`),L(z,B,Rc,`ˇ`,`\\v`),L(z,B,Rc,`¨`,`\\"`),L(z,B,Rc,`˝`,`\\H`),L(z,B,Rc,`◯`,`\\textcircled`);var Gc={"--":!0,"---":!0,"``":!0,"''":!0};L(z,B,G,`–`,`--`,!0),L(z,B,G,`–`,`\\textendash`),L(z,B,G,`—`,`---`,!0),L(z,B,G,`—`,`\\textemdash`),L(z,B,G,`‘`,"`",!0),L(z,B,G,`‘`,`\\textquoteleft`),L(z,B,G,`’`,`'`,!0),L(z,B,G,`’`,`\\textquoteright`),L(z,B,G,`“`,"``",!0),L(z,B,G,`“`,`\\textquotedblleft`),L(z,B,G,`”`,`''`,!0),L(z,B,G,`”`,`\\textquotedblright`),L(R,B,G,`°`,`\\degree`,!0),L(z,B,G,`°`,`\\degree`),L(z,B,G,`°`,`\\textdegree`,!0),L(R,B,G,`£`,`\\pounds`),L(R,B,G,`£`,`\\mathsterling`,!0),L(z,B,G,`£`,`\\pounds`),L(z,B,G,`£`,`\\textsterling`,!0),L(R,V,G,`✠`,`\\maltese`),L(z,V,G,`✠`,`\\maltese`);for(var Kc=`0123456789/@."`,qc=0;qc<Kc.length;qc++){var Jc=Kc.charAt(qc);L(R,B,G,Jc,Jc)}for(var Yc=`0123456789!@*()-=+";:?/.,`,Xc=0;Xc<Yc.length;Xc++){var Zc=Yc.charAt(Xc);L(z,B,G,Zc,Zc)}for(var Qc=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`,$c=0;$c<Qc.length;$c++){var el=Qc.charAt($c);L(R,B,U,el,el),L(z,B,G,el,el)}L(R,V,G,`C`,`ℂ`),L(z,V,G,`C`,`ℂ`),L(R,V,G,`H`,`ℍ`),L(z,V,G,`H`,`ℍ`),L(R,V,G,`N`,`ℕ`),L(z,V,G,`N`,`ℕ`),L(R,V,G,`P`,`ℙ`),L(z,V,G,`P`,`ℙ`),L(R,V,G,`Q`,`ℚ`),L(z,V,G,`Q`,`ℚ`),L(R,V,G,`R`,`ℝ`),L(z,V,G,`R`,`ℝ`),L(R,V,G,`Z`,`ℤ`),L(z,V,G,`Z`,`ℤ`),L(R,B,U,`h`,`ℎ`),L(z,B,U,`h`,`ℎ`);for(var K,tl=0;tl<Qc.length;tl++){var nl=Qc.charAt(tl);K=String.fromCharCode(55349,56320+tl),L(R,B,U,nl,K),L(z,B,G,nl,K),K=String.fromCharCode(55349,56372+tl),L(R,B,U,nl,K),L(z,B,G,nl,K),K=String.fromCharCode(55349,56424+tl),L(R,B,U,nl,K),L(z,B,G,nl,K),K=String.fromCharCode(55349,56580+tl),L(R,B,U,nl,K),L(z,B,G,nl,K),K=String.fromCharCode(55349,56684+tl),L(R,B,U,nl,K),L(z,B,G,nl,K),K=String.fromCharCode(55349,56736+tl),L(R,B,U,nl,K),L(z,B,G,nl,K),K=String.fromCharCode(55349,56788+tl),L(R,B,U,nl,K),L(z,B,G,nl,K),K=String.fromCharCode(55349,56840+tl),L(R,B,U,nl,K),L(z,B,G,nl,K),K=String.fromCharCode(55349,56944+tl),L(R,B,U,nl,K),L(z,B,G,nl,K),tl<26&&(K=String.fromCharCode(55349,56632+tl),L(R,B,U,nl,K),L(z,B,G,nl,K),K=String.fromCharCode(55349,56476+tl),L(R,B,U,nl,K),L(z,B,G,nl,K))}K=String.fromCharCode(55349,56668),L(R,B,U,`k`,K),L(z,B,G,`k`,K);for(var rl=0;rl<10;rl++){var il=rl.toString();K=String.fromCharCode(55349,57294+rl),L(R,B,U,il,K),L(z,B,G,il,K),K=String.fromCharCode(55349,57314+rl),L(R,B,U,il,K),L(z,B,G,il,K),K=String.fromCharCode(55349,57324+rl),L(R,B,U,il,K),L(z,B,G,il,K),K=String.fromCharCode(55349,57334+rl),L(R,B,U,il,K),L(z,B,G,il,K)}for(var al=`ÐÞþ`,ol=0;ol<al.length;ol++){var sl=al.charAt(ol);L(R,B,U,sl,sl),L(z,B,G,sl,sl)}var cl={mathClass:`mathbf`,textClass:`textbf`,font:`Main-Bold`},ll={mathClass:`mathnormal`,textClass:`textit`,font:`Math-Italic`},ul={mathClass:`boldsymbol`,textClass:`boldsymbol`,font:`Main-BoldItalic`},dl={mathClass:`mathscr`,textClass:`textscr`,font:`Script-Regular`},fl={mathClass:``,textClass:``,font:``},pl={mathClass:`mathfrak`,textClass:`textfrak`,font:`Fraktur-Regular`},ml={mathClass:`mathbb`,textClass:`textbb`,font:`AMS-Regular`},hl={mathClass:`mathboldfrak`,textClass:`textboldfrak`,font:`Fraktur-Regular`},gl={mathClass:`mathsf`,textClass:`textsf`,font:`SansSerif-Regular`},_l={mathClass:`mathboldsf`,textClass:`textboldsf`,font:`SansSerif-Bold`},vl={mathClass:`mathitsf`,textClass:`textitsf`,font:`SansSerif-Italic`},yl={mathClass:`mathtt`,textClass:`texttt`,font:`Typewriter-Regular`},bl=[cl,cl,ll,ll,ul,ul,dl,fl,fl,fl,pl,pl,ml,ml,hl,hl,gl,gl,_l,_l,vl,vl,fl,fl,yl,yl],xl=[cl,fl,gl,_l,yl],Sl=e=>{var t=e.charCodeAt(0),n=e.charCodeAt(1),r=(t-55296)*1024+(n-56320)+65536;if(119808<=r&&r<120484)return bl[Math.floor((r-119808)/26)];if(120782<=r&&r<=120831)return xl[Math.floor((r-120782)/10)];if(r===120485||r===120486)return bl[0];if(120486<r&&r<120782)return fl;throw new P(`Unsupported character: `+e)},Cl=function(e,t,n){if(Lc[n][e]){var r=Lc[n][e].replace;r&&(e=r)}return{value:e,metrics:Pc(e,t,n)}},wl=function(e,t,n,r,i){var a=Cl(e,t,n),o=a.metrics;e=a.value;var s;if(o){var c=o.italic;(n===`text`||r&&r.font===`mathit`)&&(c=0),s=new Cc(e,o.height,o.depth,c,o.skew,o.width,i)}else typeof console<`u`&&console.warn(`No character metrics `+(`for '`+e+`' in style '`+t+`' and mode '`+n+`'`)),s=new Cc(e,0,0,0,0,0,i);if(r){s.maxFontSize=r.sizeMultiplier,r.style.isTight()&&s.classes.push(`mtight`);var l=r.getColor();l&&(s.style.color=l)}return s},Tl=function(e,t,n,r){return r===void 0&&(r=[]),n.font===`boldsymbol`&&Cl(e,`Main-Bold`,t).metrics?wl(e,`Main-Bold`,t,n,r.concat([`mathbf`])):e===`\\`||Lc[t][e].font===`main`?wl(e,`Main-Regular`,t,n,r):wl(e,`AMS-Regular`,t,n,r.concat([`amsrm`]))},El=function(e,t,n){return n!==`textord`&&Cl(e,`Math-BoldItalic`,t).metrics?{fontName:`Math-BoldItalic`,fontClass:`boldsymbol`}:{fontName:`Main-Bold`,fontClass:`mathbf`}},Dl=function(e,t,n){var r=e.mode,i=e.text,a=[`mord`],{font:o,fontFamily:s,fontWeight:c,fontShape:l}=t,u=r===`math`||r===`text`&&!!o,d=u?o:s,f=``,p=``;if(i.charCodeAt(0)===55349){var m=Sl(i);f=m.font,p=m[r+`Class`]}if(f)return wl(i,f,r,t,a.concat(p));if(d){var h,g;if(d===`boldsymbol`){var _=El(i,r,n);h=_.fontName,g=[_.fontClass]}else u?(h=Rl[o].fontName,g=[o]):(h=Y(s,c,l),g=[s,c,l]);if(Cl(i,h,r).metrics)return wl(i,h,r,t,a.concat(g));if(Gc.hasOwnProperty(i)&&h.slice(0,10)===`Typewriter`){for(var v=[],y=0;y<i.length;y++)v.push(wl(i[y],h,r,t,a.concat(g)));return Pl(v)}}if(n===`mathord`)return wl(i,`Math-Italic`,r,t,a.concat([`mathnormal`]));if(n===`textord`){var b=Lc[r][i]&&Lc[r][i].font;if(b===`ams`)return wl(i,Y(`amsrm`,c,l),r,t,a.concat(`amsrm`,c,l));if(b===`main`||!b)return wl(i,Y(`textrm`,c,l),r,t,a.concat(c,l));var x=Y(b,c,l);return wl(i,x,r,t,a.concat(x,c,l))}else throw Error(`unexpected type: `+n+` in makeOrd`)},Ol=(e,t)=>{if(pc(e.classes)!==pc(t.classes)||e.skew!==t.skew||e.maxFontSize!==t.maxFontSize||e.italic!==0&&e.hasClass(`mathnormal`))return!1;if(e.classes.length===1){var n=e.classes[0];if(n===`mbin`||n===`mord`)return!1}for(var r of Object.keys(e.style))if(e.style[r]!==t.style[r])return!1;for(var i of Object.keys(t.style))if(e.style[i]!==t.style[i])return!1;return!0},kl=e=>{for(var t=0;t<e.length-1;t++){var n=e[t],r=e[t+1];n instanceof Cc&&r instanceof Cc&&Ol(n,r)&&(n.text+=r.text,n.height=Math.max(n.height,r.height),n.depth=Math.max(n.depth,r.depth),n.italic=r.italic,e.splice(t+1,1),t--)}return e},Al=function(e){for(var t=0,n=0,r=0,i=0;i<e.children.length;i++){var a=e.children[i];a.height>t&&(t=a.height),a.depth>n&&(n=a.depth),a.maxFontSize>r&&(r=a.maxFontSize)}e.height=t,e.depth=n,e.maxFontSize=r},q=function(e,t,n,r){var i=new yc(e,t,n,r);return Al(i),i},jl=(e,t,n,r)=>new yc(e,t,n,r),Ml=function(e,t,n){var r=q([e],[],t);return r.height=Math.max(n||t.fontMetrics().defaultRuleThickness,t.minRuleThickness),r.style.borderBottomWidth=I(r.height),r.maxFontSize=1,r},Nl=function(e,t,n,r){var i=new bc(e,t,n,r);return Al(i),i},Pl=function(e){var t=new cc(e);return Al(t),t},Fl=function(e,t){return e instanceof cc?q([],[e],t):e},Il=function(e){if(e.positionType===`individualShift`){for(var t=e.children,n=[t[0]],r=-t[0].shift-t[0].elem.depth,i=r,a=1;a<t.length;a++){var o=-t[a].shift-i-t[a].elem.depth,s=o-(t[a-1].elem.height+t[a-1].elem.depth);i+=o,n.push({type:`kern`,size:s}),n.push(t[a])}return{children:n,depth:r}}var c;if(e.positionType===`top`){for(var l=e.positionData,u=0;u<e.children.length;u++){var d=e.children[u];l-=d.type===`kern`?d.size:d.elem.height+d.elem.depth}c=l}else if(e.positionType===`bottom`)c=-e.positionData;else{var f=e.children[0];if(f.type!==`elem`)throw Error(`First child must have type "elem".`);if(e.positionType===`shift`)c=-f.elem.depth-e.positionData;else if(e.positionType===`firstBaseline`)c=-f.elem.depth;else throw Error(`Invalid positionType `+e.positionType+`.`)}return{children:e.children,depth:c}},J=function(e,t){for(var{children:n,depth:r}=Il(e),i=0,a=0;a<n.length;a++){var o=n[a];if(o.type===`elem`){var s=o.elem;i=Math.max(i,s.maxFontSize,s.height)}}i+=2;var c=q([`pstrut`],[]);c.style.height=I(i);for(var l=[],u=r,d=r,f=r,p=0;p<n.length;p++){var m=n[p];if(m.type===`kern`)f+=m.size;else{var h=m.elem,g=m.wrapperClasses||[],_=m.wrapperStyle||{},v=q(g,[c,h],void 0,_);v.style.top=I(-i-f-h.depth),m.marginLeft&&(v.style.marginLeft=m.marginLeft),m.marginRight&&(v.style.marginRight=m.marginRight),l.push(v),f+=h.height+h.depth}u=Math.min(u,f),d=Math.max(d,f)}var y=q([`vlist`],l);y.style.height=I(d);var b;if(u<0){var x=q([`vlist`],[q([],[])]);x.style.height=I(-u),b=[q([`vlist-r`],[y,q([`vlist-s`],[new Cc(`​`)])]),q([`vlist-r`],[x])]}else b=[q([`vlist-r`],[y])];var S=q([`vlist-t`],b);return b.length===2&&S.classes.push(`vlist-t2`),S.height=d,S.depth=-u,S},Ll=(e,t)=>{var n=q([`mspace`],[],t),r=fc(e,t);return n.style.marginRight=I(r),n},Y=(e,t,n)=>{var r,i;switch(e){case`amsrm`:r=`AMS`;break;case`textrm`:r=`Main`;break;case`textsf`:r=`SansSerif`;break;case`texttt`:r=`Typewriter`;break;default:r=e}return i=t===`textbf`&&n===`textit`?`BoldItalic`:t===`textbf`?`Bold`:n===`textit`?`Italic`:`Regular`,r+`-`+i},Rl={mathbf:{variant:`bold`,fontName:`Main-Bold`},mathrm:{variant:`normal`,fontName:`Main-Regular`},textit:{variant:`italic`,fontName:`Main-Italic`},mathit:{variant:`italic`,fontName:`Main-Italic`},mathnormal:{variant:`italic`,fontName:`Math-Italic`},mathsfit:{variant:`sans-serif-italic`,fontName:`SansSerif-Italic`},mathbb:{variant:`double-struck`,fontName:`AMS-Regular`},mathcal:{variant:`script`,fontName:`Caligraphic-Regular`},mathfrak:{variant:`fraktur`,fontName:`Fraktur-Regular`},mathscr:{variant:`script`,fontName:`Script-Regular`},mathsf:{variant:`sans-serif`,fontName:`SansSerif-Regular`},mathtt:{variant:`monospace`,fontName:`Typewriter-Regular`}},zl={vec:[`vec`,.471,.714],oiintSize1:[`oiintSize1`,.957,.499],oiintSize2:[`oiintSize2`,1.472,.659],oiiintSize1:[`oiiintSize1`,1.304,.499],oiiintSize2:[`oiiintSize2`,1.98,.659]},Bl=function(e,t){var[n,r,i]=zl[e],a=jl([`overlay`],[new wc([new Tc(n)],{width:I(r),height:I(i),style:`width:`+I(r),viewBox:`0 0 `+1e3*r+` `+1e3*i,preserveAspectRatio:`xMinYMin`})],t);return a.height=i,a.style.height=I(i),a.style.width=I(r),a},Vl={number:3,unit:`mu`},Hl={number:4,unit:`mu`},Ul={number:5,unit:`mu`},Wl={mord:{mop:Vl,mbin:Hl,mrel:Ul,minner:Vl},mop:{mord:Vl,mop:Vl,mrel:Ul,minner:Vl},mbin:{mord:Hl,mop:Hl,mopen:Hl,minner:Hl},mrel:{mord:Ul,mop:Ul,mopen:Ul,minner:Ul},mopen:{},mclose:{mop:Vl,mbin:Hl,mrel:Ul,minner:Vl},mpunct:{mord:Vl,mop:Vl,mrel:Ul,mopen:Vl,mclose:Vl,mpunct:Vl,minner:Vl},minner:{mord:Vl,mop:Vl,mbin:Hl,mrel:Ul,mopen:Vl,mpunct:Vl,minner:Vl}},Gl={mord:{mop:Vl},mop:{mord:Vl,mop:Vl},mbin:{},mrel:{},mopen:{},mclose:{mop:Vl},mpunct:{},minner:{mop:Vl}},Kl={},ql={},Jl={};function X(e){for(var{type:t,names:n,props:r,handler:i,htmlBuilder:a,mathmlBuilder:o}=e,s={type:t,numArgs:r.numArgs,argTypes:r.argTypes,allowedInArgument:!!r.allowedInArgument,allowedInText:!!r.allowedInText,allowedInMath:r.allowedInMath===void 0?!0:r.allowedInMath,numOptionalArgs:r.numOptionalArgs||0,infix:!!r.infix,primitive:!!r.primitive,handler:i},c=0;c<n.length;++c)Kl[n[c]]=s;t&&(a&&(ql[t]=a),o&&(Jl[t]=o))}function Yl(e){var{type:t,htmlBuilder:n,mathmlBuilder:r}=e;X({type:t,names:[],props:{numArgs:0},handler(){throw Error(`Should never be called.`)},htmlBuilder:n,mathmlBuilder:r})}var Xl=function(e){return e.type===`ordgroup`&&e.body.length===1?e.body[0]:e},Zl=function(e){return e.type===`ordgroup`?e.body:[e]},Ql=new Set([`leftmost`,`mbin`,`mopen`,`mrel`,`mop`,`mpunct`]),$l=new Set([`rightmost`,`mrel`,`mclose`,`mpunct`]),eu={display:F.DISPLAY,text:F.TEXT,script:F.SCRIPT,scriptscript:F.SCRIPTSCRIPT},tu={mord:`mord`,mop:`mop`,mbin:`mbin`,mrel:`mrel`,mopen:`mopen`,mclose:`mclose`,mpunct:`mpunct`,minner:`minner`},nu=function(e,t,n,r){r===void 0&&(r=[null,null]);for(var i=[],a=0;a<e.length;a++){var o=cu(e[a],t);if(o instanceof cc){var s=o.children;i.push(...s)}else i.push(o)}if(kl(i),!n)return i;var c=t;if(e.length===1){var l=e[0];l.type===`sizing`?c=t.havingSize(l.size):l.type===`styling`&&(c=t.havingStyle(eu[l.style]))}var u=q([r[0]||`leftmost`],[],t),d=q([r[1]||`rightmost`],[],t),f=n===`root`;return ru(i,(e,t)=>{var n=t.classes[0],r=e.classes[0];n===`mbin`&&$l.has(r)?t.classes[0]=`mord`:r===`mbin`&&Ql.has(n)&&(e.classes[0]=`mord`)},{node:u},d,f),ru(i,(e,t)=>{var n=ou(t),r=ou(e),i=n&&r?e.hasClass(`mtight`)?Gl[n]?.[r]:Wl[n]?.[r]:null;if(i)return Ll(i,c)},{node:u},d,f),i},ru=function(e,t,n,r,i){r&&e.push(r);for(var a=0;a<e.length;a++){var o=e[a],s=iu(o);if(s){ru(s.children,t,n,null,i);continue}var c=!o.hasClass(`mspace`);if(c){var l=t(o,n.node);l&&(n.insertAfter?n.insertAfter(l):(e.unshift(l),a++))}c?n.node=o:i&&o.hasClass(`newline`)&&(n.node=q([`leftmost`])),n.insertAfter=(t=>n=>{e.splice(t+1,0,n),a++})(a)}r&&e.pop()},iu=function(e){return e instanceof cc||e instanceof bc||e instanceof yc&&e.hasClass(`enclosing`)?e:null},au=function(e,t){var n=iu(e);if(n){var r=n.children;if(r.length){if(t===`right`)return au(r[r.length-1],`right`);if(t===`left`)return au(r[0],`left`)}}return e},ou=function(e,t){return e?(t&&(e=au(e,t)),tu[e.classes[0]]||null):null},su=function(e,t){var n=[`nulldelimiter`].concat(e.baseSizingClasses());return q(t.concat(n))},cu=function(e,t,n){if(!e)return q();if(ql[e.type]){var r=ql[e.type](e,t);if(n&&t.size!==n.size){r=q(t.sizingClasses(n),[r],t);var i=t.sizeMultiplier/n.sizeMultiplier;r.height*=i,r.depth*=i}return r}else throw new P(`Got group of unknown type: '`+e.type+`'`)};function lu(e,t){var n=q([`base`],e,t),r=q([`strut`]);return r.style.height=I(n.height+n.depth),n.depth&&(r.style.verticalAlign=I(-n.depth)),n.children.unshift(r),n}function uu(e,t){var n=null;e.length===1&&e[0].type===`tag`&&(n=e[0].tag,e=e[0].body);var r=nu(e,t,`root`),i;r.length===2&&r[1].hasClass(`tag`)&&(i=r.pop());for(var a=[],o=[],s=0;s<r.length;s++)if(o.push(r[s]),r[s].hasClass(`mbin`)||r[s].hasClass(`mrel`)||r[s].hasClass(`allowbreak`)){for(var c=!1;s<r.length-1&&r[s+1].hasClass(`mspace`)&&!r[s+1].hasClass(`newline`);)s++,o.push(r[s]),r[s].hasClass(`nobreak`)&&(c=!0);c||(a.push(lu(o,t)),o=[])}else r[s].hasClass(`newline`)&&(o.pop(),o.length>0&&(a.push(lu(o,t)),o=[]),a.push(r[s]));o.length>0&&a.push(lu(o,t));var l;n?(l=lu(nu(n,t,!0),t),l.classes=[`tag`],a.push(l)):i&&a.push(i);var u=q([`katex-html`],a);if(u.setAttribute(`aria-hidden`,`true`),l){var d=l.children[0];d.style.height=I(u.height+u.depth),u.depth&&(d.style.verticalAlign=I(-u.depth))}return u}function du(e){return new cc(e)}var Z=class{constructor(e,t,n){this.type=void 0,this.attributes=void 0,this.children=void 0,this.classes=void 0,this.type=e,this.attributes={},this.children=t||[],this.classes=n||[]}setAttribute(e,t){this.attributes[e]=t}getAttribute(e){return this.attributes[e]}toNode(){var e=document.createElementNS(`http://www.w3.org/1998/Math/MathML`,this.type);for(var t in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,t)&&e.setAttribute(t,this.attributes[t]);this.classes.length>0&&(e.className=pc(this.classes));for(var n=0;n<this.children.length;n++)if(this.children[n]instanceof fu&&this.children[n+1]instanceof fu){for(var r=this.children[n].toText()+this.children[++n].toText();this.children[n+1]instanceof fu;)r+=this.children[++n].toText();e.appendChild(new fu(r).toNode())}else e.appendChild(this.children[n].toNode());return e}toMarkup(){var e=`<`+this.type;for(var t in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,t)&&(e+=` `+t+`="`,e+=vs(this.attributes[t]),e+=`"`);this.classes.length>0&&(e+=` class ="`+vs(pc(this.classes))+`"`),e+=`>`;for(var n=0;n<this.children.length;n++)e+=this.children[n].toMarkup();return e+=`</`+this.type+`>`,e}toText(){return this.children.map(e=>e.toText()).join(``)}},fu=class{constructor(e){this.text=void 0,this.text=e}toNode(){return document.createTextNode(this.text)}toMarkup(){return vs(this.toText())}toText(){return this.text}},pu=class{constructor(e){this.width=void 0,this.character=void 0,this.width=e,e>=.05555&&e<=.05556?this.character=` `:e>=.1666&&e<=.1667?this.character=` `:e>=.2222&&e<=.2223?this.character=` `:e>=.2777&&e<=.2778?this.character=`  `:e>=-.05556&&e<=-.05555?this.character=` ⁣`:e>=-.1667&&e<=-.1666?this.character=` ⁣`:e>=-.2223&&e<=-.2222?this.character=` ⁣`:e>=-.2778&&e<=-.2777?this.character=` ⁣`:this.character=null}toNode(){if(this.character)return document.createTextNode(this.character);var e=document.createElementNS(`http://www.w3.org/1998/Math/MathML`,`mspace`);return e.setAttribute(`width`,I(this.width)),e}toMarkup(){return this.character?`<mtext>`+this.character+`</mtext>`:`<mspace width="`+I(this.width)+`"/>`}toText(){return this.character?this.character:` `}},mu=new Set([`\\imath`,`\\jmath`]),hu=new Set([`mrow`,`mtable`]),gu=function(e,t,n){return Lc[t][e]&&Lc[t][e].replace&&e.charCodeAt(0)!==55349&&!(Gc.hasOwnProperty(e)&&n&&(n.fontFamily&&n.fontFamily.slice(4,6)===`tt`||n.font&&n.font.slice(4,6)===`tt`))&&(e=Lc[t][e].replace),new fu(e)},_u=function(e){return e.length===1?e[0]:new Z(`mrow`,e)},vu={mathit:`italic`,boldsymbol:e=>e.type===`textord`?`bold`:`bold-italic`,mathbf:`bold`,mathbb:`double-struck`,mathsfit:`sans-serif-italic`,mathfrak:`fraktur`,mathscr:`script`,mathcal:`script`,mathsf:`sans-serif`,mathtt:`monospace`},yu=(e,t)=>{if(e.mode===`text`){if(t.fontFamily===`texttt`)return`monospace`;if(t.fontFamily===`textsf`)return t.fontShape===`textit`&&t.fontWeight===`textbf`?`sans-serif-bold-italic`:t.fontShape===`textit`?`sans-serif-italic`:t.fontWeight===`textbf`?`bold-sans-serif`:`sans-serif`;if(t.fontShape===`textit`&&t.fontWeight===`textbf`)return`bold-italic`;if(t.fontShape===`textit`)return`italic`;if(t.fontWeight===`textbf`)return`bold`}var n=t.font;if(!n||n===`mathnormal`)return null;var r=e.mode,i=vu[n];if(i)return typeof i==`function`?i(e):i;var a=e.text;if(mu.has(a))return null;if(Lc[r][a]){var o=Lc[r][a].replace;o&&(a=o)}var s=Rl[n].fontName;return Pc(a,s,r)?Rl[n].variant:null};function bu(e){if(!e)return!1;if(e.type===`mi`&&e.children.length===1){var t=e.children[0];return t instanceof fu&&t.text===`.`}else if(e.type===`mo`&&e.children.length===1&&e.getAttribute(`separator`)===`true`&&e.getAttribute(`lspace`)===`0em`&&e.getAttribute(`rspace`)===`0em`){var n=e.children[0];return n instanceof fu&&n.text===`,`}else return!1}var xu=function(e,t,n){if(e.length===1){var r=Cu(e[0],t);return n&&r instanceof Z&&r.type===`mo`&&(r.setAttribute(`lspace`,`0em`),r.setAttribute(`rspace`,`0em`)),[r]}for(var i=[],a,o=0;o<e.length;o++){var s=Cu(e[o],t);if(s instanceof Z&&a instanceof Z){if(s.type===`mtext`&&a.type===`mtext`&&s.getAttribute(`mathvariant`)===a.getAttribute(`mathvariant`)){a.children.push(...s.children);continue}else if(s.type===`mn`&&a.type===`mn`){a.children.push(...s.children);continue}else if(bu(s)&&a.type===`mn`){a.children.push(...s.children);continue}else if(s.type===`mn`&&bu(a))s.children=[...a.children,...s.children],i.pop();else if((s.type===`msup`||s.type===`msub`)&&s.children.length>=1&&(a.type===`mn`||bu(a))){var c=s.children[0];c instanceof Z&&c.type===`mn`&&(c.children=[...a.children,...c.children],i.pop())}else if(a.type===`mi`&&a.children.length===1){var l=a.children[0];if(l instanceof fu&&l.text===`̸`&&(s.type===`mo`||s.type===`mi`||s.type===`mn`)){var u=s.children[0];u instanceof fu&&u.text.length>0&&(u.text=u.text.slice(0,1)+`̸`+u.text.slice(1),i.pop())}}}i.push(s),a=s}return i},Su=function(e,t,n){return _u(xu(e,t,n))},Cu=function(e,t){if(!e)return new Z(`mrow`);if(Jl[e.type])return Jl[e.type](e,t);throw new P(`Got group of unknown type: '`+e.type+`'`)};function wu(e,t,n,r,i){var a=xu(e,n),o=a.length===1&&a[0]instanceof Z&&hu.has(a[0].type)?a[0]:new Z(`mrow`,a),s=new Z(`annotation`,[new fu(t)]);s.setAttribute(`encoding`,`application/x-tex`);var c=new Z(`math`,[new Z(`semantics`,[o,s])]);return c.setAttribute(`xmlns`,`http://www.w3.org/1998/Math/MathML`),r&&c.setAttribute(`display`,`block`),q([i?`katex`:`katex-mathml`],[c])}var Tu=[[1,1,1],[2,1,1],[3,1,1],[4,2,1],[5,2,1],[6,3,1],[7,4,2],[8,6,3],[9,7,6],[10,8,7],[11,10,9]],Eu=[.5,.6,.7,.8,.9,1,1.2,1.44,1.728,2.074,2.488],Du=function(e,t){return t.size<2?e:Tu[e-1][t.size-1]},Ou=class e{constructor(t){this.style=void 0,this.color=void 0,this.size=void 0,this.textSize=void 0,this.phantom=void 0,this.font=void 0,this.fontFamily=void 0,this.fontWeight=void 0,this.fontShape=void 0,this.sizeMultiplier=void 0,this.maxSize=void 0,this.minRuleThickness=void 0,this._fontMetrics=void 0,this.style=t.style,this.color=t.color,this.size=t.size||e.BASESIZE,this.textSize=t.textSize||this.size,this.phantom=!!t.phantom,this.font=t.font||``,this.fontFamily=t.fontFamily||``,this.fontWeight=t.fontWeight||``,this.fontShape=t.fontShape||``,this.sizeMultiplier=Eu[this.size-1],this.maxSize=t.maxSize,this.minRuleThickness=t.minRuleThickness,this._fontMetrics=void 0}extend(t){var n={style:this.style,size:this.size,textSize:this.textSize,color:this.color,phantom:this.phantom,font:this.font,fontFamily:this.fontFamily,fontWeight:this.fontWeight,fontShape:this.fontShape,maxSize:this.maxSize,minRuleThickness:this.minRuleThickness};return Object.assign(n,t),new e(n)}havingStyle(e){return this.style===e?this:this.extend({style:e,size:Du(this.textSize,e)})}havingCrampedStyle(){return this.havingStyle(this.style.cramp())}havingSize(e){return this.size===e&&this.textSize===e?this:this.extend({style:this.style.text(),size:e,textSize:e,sizeMultiplier:Eu[e-1]})}havingBaseStyle(t){t||=this.style.text();var n=Du(e.BASESIZE,t);return this.size===n&&this.textSize===e.BASESIZE&&this.style===t?this:this.extend({style:t,size:n})}havingBaseSizing(){var e;switch(this.style.id){case 4:case 5:e=3;break;case 6:case 7:e=1;break;default:e=6}return this.extend({style:this.style.text(),size:e})}withColor(e){return this.extend({color:e})}withPhantom(){return this.extend({phantom:!0})}withFont(e){return this.extend({font:e})}withTextFontFamily(e){return this.extend({fontFamily:e,font:``})}withTextFontWeight(e){return this.extend({fontWeight:e,font:``})}withTextFontShape(e){return this.extend({fontShape:e,font:``})}sizingClasses(e){return e.size===this.size?[]:[`sizing`,`reset-size`+e.size,`size`+this.size]}baseSizingClasses(){return this.size===e.BASESIZE?[]:[`sizing`,`reset-size`+this.size,`size`+e.BASESIZE]}fontMetrics(){return this._fontMetrics||=Ic(this.size),this._fontMetrics}getColor(){return this.phantom?`transparent`:this.color}};Ou.BASESIZE=6;var ku=function(e){return new Ou({style:e.displayMode?F.DISPLAY:F.TEXT,maxSize:e.maxSize,minRuleThickness:e.minRuleThickness})},Au=function(e,t){if(t.displayMode){var n=[`katex-display`];t.leqno&&n.push(`leqno`),t.fleqn&&n.push(`fleqn`),e=q(n,[e])}return e},ju=function(e,t,n){var r=ku(n),i;return n.output===`mathml`?wu(e,t,r,n.displayMode,!0):(i=n.output===`html`?q([`katex`],[uu(e,r)]):q([`katex`],[wu(e,t,r,n.displayMode,!1),uu(e,r)]),Au(i,n))},Mu=function(e,t,n){return Au(q([`katex`],[uu(e,ku(n))]),n)},Nu={widehat:`^`,widecheck:`ˇ`,widetilde:`~`,utilde:`~`,overleftarrow:`←`,underleftarrow:`←`,xleftarrow:`←`,overrightarrow:`→`,underrightarrow:`→`,xrightarrow:`→`,underbrace:`⏟`,overbrace:`⏞`,underbracket:`⎵`,overbracket:`⎴`,overgroup:`⏠`,undergroup:`⏡`,overleftrightarrow:`↔`,underleftrightarrow:`↔`,xleftrightarrow:`↔`,Overrightarrow:`⇒`,xRightarrow:`⇒`,overleftharpoon:`↼`,xleftharpoonup:`↼`,overrightharpoon:`⇀`,xrightharpoonup:`⇀`,xLeftarrow:`⇐`,xLeftrightarrow:`⇔`,xhookleftarrow:`↩`,xhookrightarrow:`↪`,xmapsto:`↦`,xrightharpoondown:`⇁`,xleftharpoondown:`↽`,xrightleftharpoons:`⇌`,xleftrightharpoons:`⇋`,xtwoheadleftarrow:`↞`,xtwoheadrightarrow:`↠`,xlongequal:`=`,xtofrom:`⇄`,xrightleftarrows:`⇄`,xrightequilibrium:`⇌`,xleftequilibrium:`⇋`,"\\cdrightarrow":`→`,"\\cdleftarrow":`←`,"\\cdlongequal":`=`},Pu=function(e){var t=new Z(`mo`,[new fu(Nu[e.replace(/^\\/,``)])]);return t.setAttribute(`stretchy`,`true`),t},Fu={overrightarrow:[[`rightarrow`],.888,522,`xMaxYMin`],overleftarrow:[[`leftarrow`],.888,522,`xMinYMin`],underrightarrow:[[`rightarrow`],.888,522,`xMaxYMin`],underleftarrow:[[`leftarrow`],.888,522,`xMinYMin`],xrightarrow:[[`rightarrow`],1.469,522,`xMaxYMin`],"\\cdrightarrow":[[`rightarrow`],3,522,`xMaxYMin`],xleftarrow:[[`leftarrow`],1.469,522,`xMinYMin`],"\\cdleftarrow":[[`leftarrow`],3,522,`xMinYMin`],Overrightarrow:[[`doublerightarrow`],.888,560,`xMaxYMin`],xRightarrow:[[`doublerightarrow`],1.526,560,`xMaxYMin`],xLeftarrow:[[`doubleleftarrow`],1.526,560,`xMinYMin`],overleftharpoon:[[`leftharpoon`],.888,522,`xMinYMin`],xleftharpoonup:[[`leftharpoon`],.888,522,`xMinYMin`],xleftharpoondown:[[`leftharpoondown`],.888,522,`xMinYMin`],overrightharpoon:[[`rightharpoon`],.888,522,`xMaxYMin`],xrightharpoonup:[[`rightharpoon`],.888,522,`xMaxYMin`],xrightharpoondown:[[`rightharpoondown`],.888,522,`xMaxYMin`],xlongequal:[[`longequal`],.888,334,`xMinYMin`],"\\cdlongequal":[[`longequal`],3,334,`xMinYMin`],xtwoheadleftarrow:[[`twoheadleftarrow`],.888,334,`xMinYMin`],xtwoheadrightarrow:[[`twoheadrightarrow`],.888,334,`xMaxYMin`],overleftrightarrow:[[`leftarrow`,`rightarrow`],.888,522],overbrace:[[`leftbrace`,`midbrace`,`rightbrace`],1.6,548],underbrace:[[`leftbraceunder`,`midbraceunder`,`rightbraceunder`],1.6,548],underleftrightarrow:[[`leftarrow`,`rightarrow`],.888,522],xleftrightarrow:[[`leftarrow`,`rightarrow`],1.75,522],xLeftrightarrow:[[`doubleleftarrow`,`doublerightarrow`],1.75,560],xrightleftharpoons:[[`leftharpoondownplus`,`rightharpoonplus`],1.75,716],xleftrightharpoons:[[`leftharpoonplus`,`rightharpoondownplus`],1.75,716],xhookleftarrow:[[`leftarrow`,`righthook`],1.08,522],xhookrightarrow:[[`lefthook`,`rightarrow`],1.08,522],overlinesegment:[[`leftlinesegment`,`rightlinesegment`],.888,522],underlinesegment:[[`leftlinesegment`,`rightlinesegment`],.888,522],overbracket:[[`leftbracketover`,`rightbracketover`],1.6,440],underbracket:[[`leftbracketunder`,`rightbracketunder`],1.6,410],overgroup:[[`leftgroup`,`rightgroup`],.888,342],undergroup:[[`leftgroupunder`,`rightgroupunder`],.888,342],xmapsto:[[`leftmapsto`,`rightarrow`],1.5,522],xtofrom:[[`leftToFrom`,`rightToFrom`],1.75,528],xrightleftarrows:[[`baraboveleftarrow`,`rightarrowabovebar`],1.75,901],xrightequilibrium:[[`baraboveshortleftharpoon`,`rightharpoonaboveshortbar`],1.75,716],xleftequilibrium:[[`shortbaraboveleftharpoon`,`shortrightharpoonabovebar`],1.75,716]},Iu=new Set([`widehat`,`widecheck`,`widetilde`,`utilde`]),Lu=function(e,t){function n(){var n=4e5,r=e.label.slice(1);if(Iu.has(r)&&`base`in e){var i=e.base.type===`ordgroup`?e.base.body.length:1,a,o,s;if(i>5)r===`widehat`||r===`widecheck`?(a=420,n=2364,s=.42,o=r+`4`):(a=312,n=2340,s=.34,o=`tilde4`);else{var c=[1,1,2,2,3,3][i];r===`widehat`||r===`widecheck`?(n=[0,1062,2364,2364,2364][c],a=[0,239,300,360,420][c],s=[0,.24,.3,.3,.36,.42][c],o=r+c):(n=[0,600,1033,2339,2340][c],a=[0,260,286,306,312][c],s=[0,.26,.286,.3,.306,.34][c],o=`tilde`+c)}return{span:jl([],[new wc([new Tc(o)],{width:`100%`,height:I(s),viewBox:`0 0 `+n+` `+a,preserveAspectRatio:`none`})],t),minWidth:0,height:s}}else{var l=[],u=Fu[r];if(!u)throw Error(`No SVG data for "`+r+`".`);var[d,f,p]=u,m=p/1e3,h=d.length,g,_;if(h===1){if(u.length!==4)throw Error(`Expected 4-tuple for single-path SVG data "`+r+`".`);g=[`hide-tail`],_=[u[3]]}else if(h===2)g=[`halfarrow-left`,`halfarrow-right`],_=[`xMinYMin`,`xMaxYMin`];else if(h===3)g=[`brace-left`,`brace-center`,`brace-right`],_=[`xMinYMin`,`xMidYMin`,`xMaxYMin`];else throw Error(`Correct katexImagesData or update code here to support
                    `+h+` children.`);for(var v=0;v<h;v++){var y=new wc([new Tc(d[v])],{width:`400em`,height:I(m),viewBox:`0 0 `+n+` `+p,preserveAspectRatio:_[v]+` slice`}),b=jl([g[v]],[y],t);if(h===1)return{span:b,minWidth:f,height:m};b.style.height=I(m),l.push(b)}return{span:q([`stretchy`],l,t),minWidth:f,height:m}}}var{span:r,minWidth:i,height:a}=n();return r.height=a,r.style.height=I(a),i>0&&(r.style.minWidth=I(i)),r},Ru=function(e,t,n,r,i){var a,o=e.height+e.depth+n+r;if(/fbox|color|angl/.test(t)){if(a=q([`stretchy`,t],[],i),t===`fbox`){var s=i.color&&i.getColor();s&&(a.style.borderColor=s)}}else{var c=[];/^[bx]cancel$/.test(t)&&c.push(new Ec({x1:`0`,y1:`0`,x2:`100%`,y2:`100%`,"stroke-width":`0.046em`})),/^x?cancel$/.test(t)&&c.push(new Ec({x1:`0`,y1:`100%`,x2:`100%`,y2:`0`,"stroke-width":`0.046em`})),a=jl([],[new wc(c,{width:`100%`,height:I(o)})],i)}return a.height=o,a.style.height=I(o),a},zu={bin:1,close:1,inner:1,open:1,punct:1,rel:1},Bu={"accent-token":1,mathord:1,"op-token":1,spacing:1,textord:1};function Vu(e){return e in zu}function Q(e,t){if(!e||e.type!==t)throw Error(`Expected node of type `+t+`, but got `+(e?`node of type `+e.type:String(e)));return e}function Hu(e){var t=Uu(e);if(!t)throw Error(`Expected node of symbol group type, but got `+(e?`node of type `+e.type:String(e)));return t}function Uu(e){return e&&(e.type===`atom`||Bu.hasOwnProperty(e.type))?e:null}var Wu=e=>{if(e instanceof Cc)return e;if(kc(e)&&e.children.length===1)return Wu(e.children[0])},Gu=(e,t)=>{var n,r,i;e&&e.type===`supsub`?(r=Q(e.base,`accent`),n=r.base,e.base=n,i=Oc(cu(e,t)),e.base=r):(r=Q(e,`accent`),n=r.base);var a=cu(n,t.havingCrampedStyle()),o=r.isShifty&&xs(n),s=0;o&&(s=Wu(a)?.skew??0);var c=r.label===`\\c`,l=c?a.height+a.depth:Math.min(a.height,t.fontMetrics().xHeight),u;if(r.isStretchy)u=Lu(r,t),u=J({positionType:`firstBaseline`,children:[{type:`elem`,elem:a},{type:`elem`,elem:u,wrapperClasses:[`svg-align`],wrapperStyle:s>0?{width:`calc(100% - `+I(2*s)+`)`,marginLeft:I(2*s)}:void 0}]});else{var d,f;r.label===`\\vec`?(d=Bl(`vec`,t),f=zl.vec[1]):(d=Dl({type:`textord`,mode:r.mode,text:r.label},t,`textord`),d=Dc(d),d.italic=0,f=d.width,c&&(l+=d.depth)),u=q([`accent-body`],[d]);var p=r.label===`\\textcircled`;p&&(u.classes.push(`accent-full`),l=a.height);var m=s;p||(m-=f/2),u.style.left=I(m),r.label===`\\textcircled`&&(u.style.top=`.2em`),u=J({positionType:`firstBaseline`,children:[{type:`elem`,elem:a},{type:`kern`,size:-l},{type:`elem`,elem:u}]})}var h=q([`mord`,`accent`],[u],t);return i?(i.children[0]=h,i.height=Math.max(h.height,i.height),i.classes[0]=`mord`,i):h},Ku=(e,t)=>{var n=e.isStretchy?Pu(e.label):new Z(`mo`,[gu(e.label,e.mode)]),r=new Z(`mover`,[Cu(e.base,t),n]);return r.setAttribute(`accent`,`true`),r},qu=new RegExp([`\\acute`,`\\grave`,`\\ddot`,`\\tilde`,`\\bar`,`\\breve`,`\\check`,`\\hat`,`\\vec`,`\\dot`,`\\mathring`].map(e=>`\\`+e).join(`|`));X({type:`accent`,names:[`\\acute`,`\\grave`,`\\ddot`,`\\tilde`,`\\bar`,`\\breve`,`\\check`,`\\hat`,`\\vec`,`\\dot`,`\\mathring`,`\\widecheck`,`\\widehat`,`\\widetilde`,`\\overrightarrow`,`\\overleftarrow`,`\\Overrightarrow`,`\\overleftrightarrow`,`\\overgroup`,`\\overlinesegment`,`\\overleftharpoon`,`\\overrightharpoon`],props:{numArgs:1},handler:(e,t)=>{var n=Xl(t[0]),r=!qu.test(e.funcName),i=!r||e.funcName===`\\widehat`||e.funcName===`\\widetilde`||e.funcName===`\\widecheck`;return{type:`accent`,mode:e.parser.mode,label:e.funcName,isStretchy:r,isShifty:i,base:n}},htmlBuilder:Gu,mathmlBuilder:Ku}),X({type:`accent`,names:[`\\'`,"\\`",`\\^`,`\\~`,`\\=`,`\\u`,`\\.`,`\\"`,`\\c`,`\\r`,`\\H`,`\\v`,`\\textcircled`],props:{numArgs:1,allowedInText:!0,allowedInMath:!0,argTypes:[`primitive`]},handler:(e,t)=>{var n=t[0],r=e.parser.mode;return r===`math`&&(e.parser.settings.reportNonstrict(`mathVsTextAccents`,`LaTeX's accent `+e.funcName+` works only in text mode`),r=`text`),{type:`accent`,mode:r,label:e.funcName,isStretchy:!1,isShifty:!0,base:n}},htmlBuilder:Gu,mathmlBuilder:Ku}),X({type:`accentUnder`,names:[`\\underleftarrow`,`\\underrightarrow`,`\\underleftrightarrow`,`\\undergroup`,`\\underlinesegment`,`\\utilde`],props:{numArgs:1},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=t[0];return{type:`accentUnder`,mode:n.mode,label:r,base:i}},htmlBuilder:(e,t)=>{var n=cu(e.base,t),r=Lu(e,t),i=e.label===`\\utilde`?.12:0;return q([`mord`,`accentunder`],[J({positionType:`top`,positionData:n.height,children:[{type:`elem`,elem:r,wrapperClasses:[`svg-align`]},{type:`kern`,size:i},{type:`elem`,elem:n}]})],t)},mathmlBuilder:(e,t)=>{var n=Pu(e.label),r=new Z(`munder`,[Cu(e.base,t),n]);return r.setAttribute(`accentunder`,`true`),r}});var Ju=e=>{var t=new Z(`mpadded`,e?[e]:[]);return t.setAttribute(`width`,`+0.6em`),t.setAttribute(`lspace`,`0.3em`),t};X({type:`xArrow`,names:[`\\xleftarrow`,`\\xrightarrow`,`\\xLeftarrow`,`\\xRightarrow`,`\\xleftrightarrow`,`\\xLeftrightarrow`,`\\xhookleftarrow`,`\\xhookrightarrow`,`\\xmapsto`,`\\xrightharpoondown`,`\\xrightharpoonup`,`\\xleftharpoondown`,`\\xleftharpoonup`,`\\xrightleftharpoons`,`\\xleftrightharpoons`,`\\xlongequal`,`\\xtwoheadrightarrow`,`\\xtwoheadleftarrow`,`\\xtofrom`,`\\xrightleftarrows`,`\\xrightequilibrium`,`\\xleftequilibrium`,`\\\\cdrightarrow`,`\\\\cdleftarrow`,`\\\\cdlongequal`],props:{numArgs:1,numOptionalArgs:1},handler(e,t,n){var{parser:r,funcName:i}=e;return{type:`xArrow`,mode:r.mode,label:i,body:t[0],below:n[0]}},htmlBuilder(e,t){var n=t.style,r=t.havingStyle(n.sup()),i=Fl(cu(e.body,r,t),t),a=e.label.slice(0,2)===`\\x`?`x`:`cd`;i.classes.push(a+`-arrow-pad`);var o;e.below&&(r=t.havingStyle(n.sub()),o=Fl(cu(e.below,r,t),t),o.classes.push(a+`-arrow-pad`));var s=Lu(e,t),c=-t.fontMetrics().axisHeight+.5*s.height,l=-t.fontMetrics().axisHeight-.5*s.height-.111;(i.depth>.25||e.label===`\\xleftequilibrium`)&&(l-=i.depth);var u;if(o){var d=-t.fontMetrics().axisHeight+o.height+.5*s.height+.111;u=J({positionType:`individualShift`,children:[{type:`elem`,elem:i,shift:l},{type:`elem`,elem:s,shift:c,wrapperClasses:[`svg-align`]},{type:`elem`,elem:o,shift:d}]})}else u=J({positionType:`individualShift`,children:[{type:`elem`,elem:i,shift:l},{type:`elem`,elem:s,shift:c,wrapperClasses:[`svg-align`]}]});return q([`mrel`,`x-arrow`],[u],t)},mathmlBuilder(e,t){var n=Pu(e.label);n.setAttribute(`minsize`,e.label.charAt(0)===`x`?`1.75em`:`3.0em`);var r;if(e.body){var i=Ju(Cu(e.body,t));r=e.below?new Z(`munderover`,[n,Ju(Cu(e.below,t)),i]):new Z(`mover`,[n,i])}else e.below?r=new Z(`munder`,[n,Ju(Cu(e.below,t))]):(r=Ju(),r=new Z(`mover`,[n,r]));return r}});function Yu(e,t){var n=nu(e.body,t,!0);return q([e.mclass],n,t)}function Xu(e,t){var n,r=xu(e.body,t);return e.mclass===`minner`?n=new Z(`mpadded`,r):e.mclass===`mord`?e.isCharacterBox?(n=r[0],n.type=`mi`):n=new Z(`mi`,r):(e.isCharacterBox?(n=r[0],n.type=`mo`):n=new Z(`mo`,r),e.mclass===`mbin`?(n.attributes.lspace=`0.22em`,n.attributes.rspace=`0.22em`):e.mclass===`mpunct`?(n.attributes.lspace=`0em`,n.attributes.rspace=`0.17em`):e.mclass===`mopen`||e.mclass===`mclose`?(n.attributes.lspace=`0em`,n.attributes.rspace=`0em`):e.mclass===`minner`&&(n.attributes.lspace=`0.0556em`,n.attributes.width=`+0.1111em`)),n}X({type:`mclass`,names:[`\\mathord`,`\\mathbin`,`\\mathrel`,`\\mathopen`,`\\mathclose`,`\\mathpunct`,`\\mathinner`],props:{numArgs:1,primitive:!0},handler(e,t){var{parser:n,funcName:r}=e,i=t[0];return{type:`mclass`,mode:n.mode,mclass:`m`+r.slice(5),body:Zl(i),isCharacterBox:xs(i)}},htmlBuilder:Yu,mathmlBuilder:Xu});var Zu=e=>{var t=e.type===`ordgroup`&&e.body.length?e.body[0]:e;return t.type===`atom`&&(t.family===`bin`||t.family===`rel`)?`m`+t.family:`mord`};X({type:`mclass`,names:[`\\@binrel`],props:{numArgs:2},handler(e,t){var{parser:n}=e;return{type:`mclass`,mode:n.mode,mclass:Zu(t[0]),body:Zl(t[1]),isCharacterBox:xs(t[1])}}}),X({type:`mclass`,names:[`\\stackrel`,`\\overset`,`\\underset`],props:{numArgs:2},handler(e,t){var{parser:n,funcName:r}=e,i=t[1],a=t[0],o=r===`\\stackrel`?`mrel`:Zu(i),s={type:`op`,mode:i.mode,limits:!0,alwaysHandleSupSub:!0,parentIsSupSub:!1,symbol:!1,suppressBaseShift:r!==`\\stackrel`,body:Zl(i)},c={type:`supsub`,mode:a.mode,base:s,sup:r===`\\underset`?null:a,sub:r===`\\underset`?a:null};return{type:`mclass`,mode:n.mode,mclass:o,body:[c],isCharacterBox:xs(c)}},htmlBuilder:Yu,mathmlBuilder:Xu}),X({type:`pmb`,names:[`\\pmb`],props:{numArgs:1,allowedInText:!0},handler(e,t){var{parser:n}=e;return{type:`pmb`,mode:n.mode,mclass:Zu(t[0]),body:Zl(t[0])}},htmlBuilder(e,t){var n=nu(e.body,t,!0),r=q([e.mclass],n,t);return r.style.textShadow=`0.02em 0.01em 0.04px`,r},mathmlBuilder(e,t){var n=new Z(`mstyle`,xu(e.body,t));return n.setAttribute(`style`,`text-shadow: 0.02em 0.01em 0.04px`),n}});var Qu={">":`\\\\cdrightarrow`,"<":`\\\\cdleftarrow`,"=":`\\\\cdlongequal`,A:`\\uparrow`,V:`\\downarrow`,"|":`\\Vert`,".":`no arrow`},$u=()=>({type:`styling`,body:[],mode:`math`,style:`display`,resetFont:!0}),ed=e=>e.type===`textord`&&e.text===`@`,td=(e,t)=>(e.type===`mathord`||e.type===`atom`)&&e.text===t;function nd(e,t,n){var r=Qu[e];switch(r){case`\\\\cdrightarrow`:case`\\\\cdleftarrow`:return n.callFunction(r,[t[0]],[t[1]]);case`\\uparrow`:case`\\downarrow`:var i=n.callFunction(`\\\\cdleft`,[t[0]],[]),a={type:`atom`,text:r,mode:`math`,family:`rel`},o={type:`ordgroup`,mode:`math`,body:[i,n.callFunction(`\\Big`,[a],[]),n.callFunction(`\\\\cdright`,[t[1]],[])]};return n.callFunction(`\\\\cdparent`,[o],[]);case`\\\\cdlongequal`:return n.callFunction(`\\\\cdlongequal`,[],[]);case`\\Vert`:return n.callFunction(`\\Big`,[{type:`textord`,text:`\\Vert`,mode:`math`}],[]);default:return{type:`textord`,text:` `,mode:`math`}}}function rd(e){var t=[];for(e.gullet.beginGroup(),e.gullet.macros.set(`\\cr`,`\\\\\\relax`),e.gullet.beginGroup();;){t.push(e.parseExpression(!1,`\\\\`)),e.gullet.endGroup(),e.gullet.beginGroup();var n=e.fetch().text;if(n===`&`||n===`\\\\`)e.consume();else if(n===`\\end`){t[t.length-1].length===0&&t.pop();break}else throw new P(`Expected \\\\ or \\cr or \\end`,e.nextToken)}for(var r=[],i=[r],a=0;a<t.length;a++){for(var o=t[a],s=$u(),c=0;c<o.length;c++)if(!ed(o[c]))s.body.push(o[c]);else{r.push(s),c+=1;var l=Hu(o[c]).text,u=[,,];if(u[0]={type:`ordgroup`,mode:`math`,body:[]},u[1]={type:`ordgroup`,mode:`math`,body:[]},!`=|.`.includes(l))if(`<>AV`.includes(l))for(var d=0;d<2;d++){for(var f=!0,p=c+1;p<o.length;p++){if(td(o[p],l)){f=!1,c=p;break}if(ed(o[p]))throw new P(`Missing a `+l+` character to complete a CD arrow.`,o[p]);u[d].body.push(o[p])}if(f)throw new P(`Missing a `+l+` character to complete a CD arrow.`,o[c])}else throw new P(`Expected one of "<>AV=|." after @`,o[c]);var m={type:`styling`,body:[nd(l,u,e)],mode:`math`,style:`display`,resetFont:!0};r.push(m),s=$u()}a%2==0?r.push(s):r.shift(),r=[],i.push(r)}return e.gullet.endGroup(),e.gullet.endGroup(),{type:`array`,mode:`math`,body:i,arraystretch:1,addJot:!0,rowGaps:[null],cols:Array(i[0].length).fill({type:`align`,align:`c`,pregap:.25,postgap:.25}),colSeparationType:`CD`,hLinesBeforeRow:Array(i.length+1).fill([])}}X({type:`cdlabel`,names:[`\\\\cdleft`,`\\\\cdright`],props:{numArgs:1},handler(e,t){var{parser:n,funcName:r}=e;return{type:`cdlabel`,mode:n.mode,side:r.slice(4),label:t[0]}},htmlBuilder(e,t){var n=t.havingStyle(t.style.sup()),r=Fl(cu(e.label,n,t),t);return r.classes.push(`cd-label-`+e.side),r.style.bottom=I(.8-r.depth),r.height=0,r.depth=0,r},mathmlBuilder(e,t){var n=new Z(`mrow`,[Cu(e.label,t)]);return n=new Z(`mpadded`,[n]),n.setAttribute(`width`,`0`),e.side===`left`&&n.setAttribute(`lspace`,`-1width`),n.setAttribute(`voffset`,`0.7em`),n=new Z(`mstyle`,[n]),n.setAttribute(`displaystyle`,`false`),n.setAttribute(`scriptlevel`,`1`),n}}),X({type:`cdlabelparent`,names:[`\\\\cdparent`],props:{numArgs:1},handler(e,t){var{parser:n}=e;return{type:`cdlabelparent`,mode:n.mode,fragment:t[0]}},htmlBuilder(e,t){var n=Fl(cu(e.fragment,t),t);return n.classes.push(`cd-vert-arrow`),n},mathmlBuilder(e,t){return new Z(`mrow`,[Cu(e.fragment,t)])}}),X({type:`textord`,names:[`\\@char`],props:{numArgs:1,allowedInText:!0},handler(e,t){for(var{parser:n}=e,r=Q(t[0],`ordgroup`).body,i=``,a=0;a<r.length;a++){var o=Q(r[a],`textord`);i+=o.text}var s=parseInt(i),c;if(isNaN(s))throw new P(`\\@char has non-numeric argument `+i);if(s<0||s>=1114111)throw new P(`\\@char with invalid code point `+i);return s<=65535?c=String.fromCharCode(s):(s-=65536,c=String.fromCharCode((s>>10)+55296,(s&1023)+56320)),{type:`textord`,mode:n.mode,text:c}}});var id=(e,t)=>Pl(nu(e.body,t.withColor(e.color),!1)),ad=(e,t)=>{var n=new Z(`mstyle`,xu(e.body,t.withColor(e.color)));return n.setAttribute(`mathcolor`,e.color),n};X({type:`color`,names:[`\\textcolor`],props:{numArgs:2,allowedInText:!0,argTypes:[`color`,`original`]},handler(e,t){var{parser:n}=e,r=Q(t[0],`color-token`).color,i=t[1];return{type:`color`,mode:n.mode,color:r,body:Zl(i)}},htmlBuilder:id,mathmlBuilder:ad}),X({type:`color`,names:[`\\color`],props:{numArgs:1,allowedInText:!0,argTypes:[`color`]},handler(e,t){var{parser:n,breakOnTokenText:r}=e,i=Q(t[0],`color-token`).color;n.gullet.macros.set(`\\current@color`,i);var a=n.parseExpression(!0,r);return{type:`color`,mode:n.mode,color:i,body:a}},htmlBuilder:id,mathmlBuilder:ad}),X({type:`cr`,names:[`\\\\`],props:{numArgs:0,numOptionalArgs:0,allowedInText:!0},handler(e,t,n){var{parser:r}=e,i=r.gullet.future().text===`[`?r.parseSizeGroup(!0):null,a=!r.settings.displayMode||!r.settings.useStrictBehavior(`newLineInDisplayMode`,`In LaTeX, \\\\ or \\newline does nothing in display mode`);return{type:`cr`,mode:r.mode,newLine:a,size:i&&Q(i,`size`).value}},htmlBuilder(e,t){var n=q([`mspace`],[],t);return e.newLine&&(n.classes.push(`newline`),e.size&&(n.style.marginTop=I(fc(e.size,t)))),n},mathmlBuilder(e,t){var n=new Z(`mspace`);return e.newLine&&(n.setAttribute(`linebreak`,`newline`),e.size&&n.setAttribute(`height`,I(fc(e.size,t)))),n}});var od={"\\global":`\\global`,"\\long":`\\\\globallong`,"\\\\globallong":`\\\\globallong`,"\\def":`\\gdef`,"\\gdef":`\\gdef`,"\\edef":`\\xdef`,"\\xdef":`\\xdef`,"\\let":`\\\\globallet`,"\\futurelet":`\\\\globalfuture`},sd=e=>{var t=e.text;if(/^(?:[\\{}$&#^_]|EOF)$/.test(t))throw new P(`Expected a control sequence`,e);return t},cd=e=>{var t=e.gullet.popToken();return t.text===`=`&&(t=e.gullet.popToken(),t.text===` `&&(t=e.gullet.popToken())),t},ld=(e,t,n,r)=>{var i=e.gullet.macros.get(n.text);i??=(n.noexpand=!0,{tokens:[n],numArgs:0,unexpandable:!e.gullet.isExpandable(n.text)}),e.gullet.macros.set(t,i,r)};X({type:`internal`,names:[`\\global`,`\\long`,`\\\\globallong`],props:{numArgs:0,allowedInText:!0},handler(e){var{parser:t,funcName:n}=e;t.consumeSpaces();var r=t.fetch();if(od[r.text])return(n===`\\global`||n===`\\\\globallong`)&&(r.text=od[r.text]),Q(t.parseFunction(),`internal`);throw new P(`Invalid token after macro prefix`,r)}}),X({type:`internal`,names:[`\\def`,`\\gdef`,`\\edef`,`\\xdef`],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(e){var{parser:t,funcName:n}=e,r=t.gullet.popToken(),i=r.text;if(/^(?:[\\{}$&#^_]|EOF)$/.test(i))throw new P(`Expected a control sequence`,r);for(var a=0,o,s=[[]];t.gullet.future().text!==`{`;)if(r=t.gullet.popToken(),r.text===`#`){if(t.gullet.future().text===`{`){o=t.gullet.future(),s[a].push(`{`);break}if(r=t.gullet.popToken(),!/^[1-9]$/.test(r.text))throw new P(`Invalid argument number "`+r.text+`"`);if(parseInt(r.text)!==a+1)throw new P(`Argument number "`+r.text+`" out of order`);a++,s.push([])}else if(r.text===`EOF`)throw new P(`Expected a macro definition`);else s[a].push(r.text);var{tokens:c}=t.gullet.consumeArg();return o&&c.unshift(o),(n===`\\edef`||n===`\\xdef`)&&(c=t.gullet.expandTokens(c),c.reverse()),t.gullet.macros.set(i,{tokens:c,numArgs:a,delimiters:s},n===od[n]),{type:`internal`,mode:t.mode}}}),X({type:`internal`,names:[`\\let`,`\\\\globallet`],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(e){var{parser:t,funcName:n}=e,r=sd(t.gullet.popToken());return t.gullet.consumeSpaces(),ld(t,r,cd(t),n===`\\\\globallet`),{type:`internal`,mode:t.mode}}}),X({type:`internal`,names:[`\\futurelet`,`\\\\globalfuture`],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(e){var{parser:t,funcName:n}=e,r=sd(t.gullet.popToken()),i=t.gullet.popToken(),a=t.gullet.popToken();return ld(t,r,a,n===`\\\\globalfuture`),t.gullet.pushToken(a),t.gullet.pushToken(i),{type:`internal`,mode:t.mode}}});var ud=function(e,t,n){var r=Pc(Lc.math[e]&&Lc.math[e].replace||e,t,n);if(!r)throw Error(`Unsupported symbol `+e+` and font size `+t+`.`);return r},dd=function(e,t,n,r){var i=n.havingBaseStyle(t),a=q(r.concat(i.sizingClasses(n)),[e],n),o=i.sizeMultiplier/n.sizeMultiplier;return a.height*=o,a.depth*=o,a.maxFontSize=i.sizeMultiplier,a},fd=function(e,t,n){var r=t.havingBaseStyle(n),i=(1-t.sizeMultiplier/r.sizeMultiplier)*t.fontMetrics().axisHeight;e.classes.push(`delimcenter`),e.style.top=I(i),e.height-=i,e.depth+=i},pd=function(e,t,n,r,i,a){var o=dd(wl(e,`Main-Regular`,i,r),t,r,a);return n&&fd(o,r,t),o},md=function(e,t,n,r){return wl(e,`Size`+t+`-Regular`,n,r)},hd=function(e,t,n,r,i,a){var o=md(e,t,i,r),s=dd(q([`delimsizing`,`size`+t],[o],r),F.TEXT,r,a);return n&&fd(s,r,F.TEXT),s},gd=function(e,t,n){return{type:`elem`,elem:q([`delimsizinginner`,t===`Size1-Regular`?`delim-size1`:`delim-size4`],[q([],[wl(e,t,n)])])}},_d=function(e,t,n){var r=Ac[`Size4-Regular`][e.charCodeAt(0)]?Ac[`Size4-Regular`][e.charCodeAt(0)][4]:Ac[`Size1-Regular`][e.charCodeAt(0)][4],i=jl([],[new wc([new Tc(`inner`,ic(e,Math.round(1e3*t)))],{width:I(r),height:I(t),style:`width:`+I(r),viewBox:`0 0 `+1e3*r+` `+Math.round(1e3*t),preserveAspectRatio:`xMinYMin`})],n);return i.height=t,i.style.height=I(t),i.style.width=I(r),{type:`elem`,elem:i}},vd=.008,yd={type:`kern`,size:-1*vd},bd=new Set([`|`,`\\lvert`,`\\rvert`,`\\vert`]),xd=new Set([`\\|`,`\\lVert`,`\\rVert`,`\\Vert`]),Sd=function(e,t,n,r,i,a){var o,s,c,l,u=``,d=0;o=c=l=e,s=null;var f=`Size1-Regular`;e===`\\uparrow`?c=l=`⏐`:e===`\\Uparrow`?c=l=`‖`:e===`\\downarrow`?o=c=`⏐`:e===`\\Downarrow`?o=c=`‖`:e===`\\updownarrow`?(o=`\\uparrow`,c=`⏐`,l=`\\downarrow`):e===`\\Updownarrow`?(o=`\\Uparrow`,c=`‖`,l=`\\Downarrow`):bd.has(e)?(c=`∣`,u=`vert`,d=333):xd.has(e)?(c=`∥`,u=`doublevert`,d=556):e===`[`||e===`\\lbrack`?(o=`⎡`,c=`⎢`,l=`⎣`,f=`Size4-Regular`,u=`lbrack`,d=667):e===`]`||e===`\\rbrack`?(o=`⎤`,c=`⎥`,l=`⎦`,f=`Size4-Regular`,u=`rbrack`,d=667):e===`\\lfloor`||e===`⌊`?(c=o=`⎢`,l=`⎣`,f=`Size4-Regular`,u=`lfloor`,d=667):e===`\\lceil`||e===`⌈`?(o=`⎡`,c=l=`⎢`,f=`Size4-Regular`,u=`lceil`,d=667):e===`\\rfloor`||e===`⌋`?(c=o=`⎥`,l=`⎦`,f=`Size4-Regular`,u=`rfloor`,d=667):e===`\\rceil`||e===`⌉`?(o=`⎤`,c=l=`⎥`,f=`Size4-Regular`,u=`rceil`,d=667):e===`(`||e===`\\lparen`?(o=`⎛`,c=`⎜`,l=`⎝`,f=`Size4-Regular`,u=`lparen`,d=875):e===`)`||e===`\\rparen`?(o=`⎞`,c=`⎟`,l=`⎠`,f=`Size4-Regular`,u=`rparen`,d=875):e===`\\{`||e===`\\lbrace`?(o=`⎧`,s=`⎨`,l=`⎩`,c=`⎪`,f=`Size4-Regular`):e===`\\}`||e===`\\rbrace`?(o=`⎫`,s=`⎬`,l=`⎭`,c=`⎪`,f=`Size4-Regular`):e===`\\lgroup`||e===`⟮`?(o=`⎧`,l=`⎩`,c=`⎪`,f=`Size4-Regular`):e===`\\rgroup`||e===`⟯`?(o=`⎫`,l=`⎭`,c=`⎪`,f=`Size4-Regular`):e===`\\lmoustache`||e===`⎰`?(o=`⎧`,l=`⎭`,c=`⎪`,f=`Size4-Regular`):(e===`\\rmoustache`||e===`⎱`)&&(o=`⎫`,l=`⎩`,c=`⎪`,f=`Size4-Regular`);var p=ud(o,f,i),m=p.height+p.depth,h=ud(c,f,i),g=h.height+h.depth,_=ud(l,f,i),v=_.height+_.depth,y=0,b=1;if(s!==null){var x=ud(s,f,i);y=x.height+x.depth,b=2}var S=m+v+y,C=S+Math.max(0,Math.ceil((t-S)/(b*g)))*b*g,w=r.fontMetrics().axisHeight;n&&(w*=r.sizeMultiplier);var ee=C/2-w,T=[];if(u.length>0){var te=C-m-v,E=Math.round(C*1e3),ne=oc(u,Math.round(te*1e3)),re=new Tc(u,ne),ie=I(d/1e3),ae=I(E/1e3),oe=jl([],[new wc([re],{width:ie,height:ae,viewBox:`0 0 `+d+` `+E})],r);oe.height=E/1e3,oe.style.width=ie,oe.style.height=ae,T.push({type:`elem`,elem:oe})}else{if(T.push(gd(l,f,i)),T.push(yd),s===null){var se=C-m-v+2*vd;T.push(_d(c,se,r))}else{var ce=(C-m-v-y)/2+2*vd;T.push(_d(c,ce,r)),T.push(yd),T.push(gd(s,f,i)),T.push(yd),T.push(_d(c,ce,r))}T.push(yd),T.push(gd(o,f,i))}var D=r.havingBaseStyle(F.TEXT);return dd(q([`delimsizing`,`mult`],[J({positionType:`bottom`,positionData:ee,children:T})],D),F.TEXT,r,a)},Cd=80,wd=.08,Td=function(e,t,n,r,i){return jl([`hide-tail`],[new wc([new Tc(e,rc(e,r,n))],{width:`400em`,height:I(t),viewBox:`0 0 400000 `+n,preserveAspectRatio:`xMinYMin slice`})],i)},Ed=function(e,t){var n=t.havingBaseSizing(),r=Id(`\\surd`,e*n.sizeMultiplier,Pd,n),i=n.sizeMultiplier,a=Math.max(0,t.minRuleThickness-t.fontMetrics().sqrtRuleThickness),o,s,c,l,u;return r.type===`small`?(l=1e3+1e3*a+Cd,e<1?i=1:e<1.4&&(i=.7),s=(1+a+wd)/i,c=(1+a)/i,o=Td(`sqrtMain`,s,l,a,t),o.style.minWidth=`0.853em`,u=.833/i):r.type===`large`?(l=(1e3+Cd)*Ad[r.size],c=(Ad[r.size]+a)/i,s=(Ad[r.size]+a+wd)/i,o=Td(`sqrtSize`+r.size,s,l,a,t),o.style.minWidth=`1.02em`,u=1/i):(s=e+a+wd,c=e+a,l=Math.floor(1e3*e+a)+Cd,o=Td(`sqrtTall`,s,l,a,t),o.style.minWidth=`0.742em`,u=1.056),o.height=c,o.style.height=I(s),{span:o,advanceWidth:u,ruleWidth:(t.fontMetrics().sqrtRuleThickness+a)*i}},Dd=new Set([`(`,`\\lparen`,`)`,`\\rparen`,`[`,`\\lbrack`,`]`,`\\rbrack`,`\\{`,`\\lbrace`,`\\}`,`\\rbrace`,`\\lfloor`,`\\rfloor`,`⌊`,`⌋`,`\\lceil`,`\\rceil`,`⌈`,`⌉`,`\\surd`]),Od=new Set([`\\uparrow`,`\\downarrow`,`\\updownarrow`,`\\Uparrow`,`\\Downarrow`,`\\Updownarrow`,`|`,`\\|`,`\\vert`,`\\Vert`,`\\lvert`,`\\rvert`,`\\lVert`,`\\rVert`,`\\lgroup`,`\\rgroup`,`⟮`,`⟯`,`\\lmoustache`,`\\rmoustache`,`⎰`,`⎱`]),kd=new Set([`<`,`>`,`\\langle`,`\\rangle`,`/`,`\\backslash`,`\\lt`,`\\gt`]),Ad=[0,1.2,1.8,2.4,3],jd=function(e,t,n,r,i){if(e===`<`||e===`\\lt`||e===`⟨`?e=`\\langle`:(e===`>`||e===`\\gt`||e===`⟩`)&&(e=`\\rangle`),Dd.has(e)||kd.has(e))return hd(e,t,!1,n,r,i);if(Od.has(e))return Sd(e,Ad[t],!1,n,r,i);throw new P(`Illegal delimiter: '`+e+`'`)},Md=[{type:`small`,style:F.SCRIPTSCRIPT},{type:`small`,style:F.SCRIPT},{type:`small`,style:F.TEXT},{type:`large`,size:1},{type:`large`,size:2},{type:`large`,size:3},{type:`large`,size:4}],Nd=[{type:`small`,style:F.SCRIPTSCRIPT},{type:`small`,style:F.SCRIPT},{type:`small`,style:F.TEXT},{type:`stack`}],Pd=[{type:`small`,style:F.SCRIPTSCRIPT},{type:`small`,style:F.SCRIPT},{type:`small`,style:F.TEXT},{type:`large`,size:1},{type:`large`,size:2},{type:`large`,size:3},{type:`large`,size:4},{type:`stack`}],Fd=function(e){if(e.type===`small`)return`Main-Regular`;if(e.type===`large`)return`Size`+e.size+`-Regular`;if(e.type===`stack`)return`Size4-Regular`;var t=e.type;throw Error(`Add support for delim type '`+t+`' here.`)},Id=function(e,t,n,r){for(var i=Math.min(2,3-r.style.size);i<n.length;i++){var a=n[i];if(a.type===`stack`)break;var o=ud(e,Fd(a),`math`),s=o.height+o.depth;if(a.type===`small`){var c=r.havingBaseStyle(a.style);s*=c.sizeMultiplier}if(s>t)return a}return n[n.length-1]},Ld=function(e,t,n,r,i,a){e===`<`||e===`\\lt`||e===`⟨`?e=`\\langle`:(e===`>`||e===`\\gt`||e===`⟩`)&&(e=`\\rangle`);var o=kd.has(e)?Md:Dd.has(e)?Pd:Nd,s=Id(e,t,o,r);return s.type===`small`?pd(e,s.style,n,r,i,a):s.type===`large`?hd(e,s.size,n,r,i,a):Sd(e,t,n,r,i,a)},Rd=function(e,t,n,r,i,a){var o=r.fontMetrics().axisHeight*r.sizeMultiplier,s=901,c=5/r.fontMetrics().ptPerEm,l=Math.max(t-o,n+o);return Ld(e,Math.max(l/500*s,2*l-c),!0,r,i,a)},zd={"\\bigl":{mclass:`mopen`,size:1},"\\Bigl":{mclass:`mopen`,size:2},"\\biggl":{mclass:`mopen`,size:3},"\\Biggl":{mclass:`mopen`,size:4},"\\bigr":{mclass:`mclose`,size:1},"\\Bigr":{mclass:`mclose`,size:2},"\\biggr":{mclass:`mclose`,size:3},"\\Biggr":{mclass:`mclose`,size:4},"\\bigm":{mclass:`mrel`,size:1},"\\Bigm":{mclass:`mrel`,size:2},"\\biggm":{mclass:`mrel`,size:3},"\\Biggm":{mclass:`mrel`,size:4},"\\big":{mclass:`mord`,size:1},"\\Big":{mclass:`mord`,size:2},"\\bigg":{mclass:`mord`,size:3},"\\Bigg":{mclass:`mord`,size:4}},Bd=new Set(`(,\\lparen,),\\rparen,[,\\lbrack,],\\rbrack,\\{,\\lbrace,\\},\\rbrace,\\lfloor,\\rfloor,⌊,⌋,\\lceil,\\rceil,⌈,⌉,<,>,\\langle,⟨,\\rangle,⟩,\\lt,\\gt,\\lvert,\\rvert,\\lVert,\\rVert,\\lgroup,\\rgroup,⟮,⟯,\\lmoustache,\\rmoustache,⎰,⎱,/,\\backslash,|,\\vert,\\|,\\Vert,\\uparrow,\\Uparrow,\\downarrow,\\Downarrow,\\updownarrow,\\Updownarrow,.`.split(`,`));function Vd(e){return`isMiddle`in e}function Hd(e,t){var n=Uu(e);if(n&&Bd.has(n.text))return n;throw n?new P(`Invalid delimiter '`+n.text+`' after '`+t.funcName+`'`,e):new P(`Invalid delimiter type '`+e.type+`'`,e)}X({type:`delimsizing`,names:[`\\bigl`,`\\Bigl`,`\\biggl`,`\\Biggl`,`\\bigr`,`\\Bigr`,`\\biggr`,`\\Biggr`,`\\bigm`,`\\Bigm`,`\\biggm`,`\\Biggm`,`\\big`,`\\Big`,`\\bigg`,`\\Bigg`],props:{numArgs:1,argTypes:[`primitive`]},handler:(e,t)=>{var n=Hd(t[0],e);return{type:`delimsizing`,mode:e.parser.mode,size:zd[e.funcName].size,mclass:zd[e.funcName].mclass,delim:n.text}},htmlBuilder:(e,t)=>e.delim===`.`?q([e.mclass]):jd(e.delim,e.size,t,e.mode,[e.mclass]),mathmlBuilder:e=>{var t=[];e.delim!==`.`&&t.push(gu(e.delim,e.mode));var n=new Z(`mo`,t);e.mclass===`mopen`||e.mclass===`mclose`?n.setAttribute(`fence`,`true`):n.setAttribute(`fence`,`false`),n.setAttribute(`stretchy`,`true`);var r=I(Ad[e.size]);return n.setAttribute(`minsize`,r),n.setAttribute(`maxsize`,r),n}});function Ud(e){if(!e.body)throw Error(`Bug: The leftright ParseNode wasn't fully parsed.`)}X({type:`leftright-right`,names:[`\\right`],props:{numArgs:1,primitive:!0},handler:(e,t)=>{var n=e.parser.gullet.macros.get(`\\current@color`);if(n&&typeof n!=`string`)throw new P(`\\current@color set to non-string in \\right`);return{type:`leftright-right`,mode:e.parser.mode,delim:Hd(t[0],e).text,color:n}}}),X({type:`leftright`,names:[`\\left`],props:{numArgs:1,primitive:!0},handler:(e,t)=>{var n=Hd(t[0],e),r=e.parser;++r.leftrightDepth;var i=r.parseExpression(!1);--r.leftrightDepth,r.expect(`\\right`,!1);var a=Q(r.parseFunction(),`leftright-right`);return{type:`leftright`,mode:r.mode,body:i,left:n.text,right:a.delim,rightColor:a.color}},htmlBuilder:(e,t)=>{Ud(e);for(var n=nu(e.body,t,!0,[`mopen`,`mclose`]),r=0,i=0,a=!1,o=0;o<n.length;o++){var s=n[o];Vd(s)?a=!0:(r=Math.max(n[o].height,r),i=Math.max(n[o].depth,i))}r*=t.sizeMultiplier,i*=t.sizeMultiplier;var c=e.left===`.`?su(t,[`mopen`]):Rd(e.left,r,i,t,e.mode,[`mopen`]);if(n.unshift(c),a)for(var l=1;l<n.length;l++){var u=n[l];if(Vd(u)){var d=u.isMiddle;n[l]=Rd(d.delim,r,i,d.options,e.mode,[])}}var f;if(e.right===`.`)f=su(t,[`mclose`]);else{var p=e.rightColor?t.withColor(e.rightColor):t;f=Rd(e.right,r,i,p,e.mode,[`mclose`])}return n.push(f),q([`minner`],n,t)},mathmlBuilder:(e,t)=>{Ud(e);var n=xu(e.body,t);if(e.left!==`.`){var r=new Z(`mo`,[gu(e.left,e.mode)]);r.setAttribute(`fence`,`true`),n.unshift(r)}if(e.right!==`.`){var i=new Z(`mo`,[gu(e.right,e.mode)]);i.setAttribute(`fence`,`true`),e.rightColor&&i.setAttribute(`mathcolor`,e.rightColor),n.push(i)}return _u(n)}}),X({type:`middle`,names:[`\\middle`],props:{numArgs:1,primitive:!0},handler:(e,t)=>{var n=Hd(t[0],e);if(!e.parser.leftrightDepth)throw new P(`\\middle without preceding \\left`,n);return{type:`middle`,mode:e.parser.mode,delim:n.text}},htmlBuilder:(e,t)=>{var n;return e.delim===`.`?n=su(t,[]):(n=jd(e.delim,1,t,e.mode,[]),n.isMiddle={delim:e.delim,options:t}),n},mathmlBuilder:(e,t)=>{var n=new Z(`mo`,[e.delim===`\\vert`||e.delim===`|`?gu(`|`,`text`):gu(e.delim,e.mode)]);return n.setAttribute(`fence`,`true`),n.setAttribute(`lspace`,`0.05em`),n.setAttribute(`rspace`,`0.05em`),n}});var Wd=(e,t)=>{var n=Fl(cu(e.body,t),t),r=e.label.slice(1),i=t.sizeMultiplier,a,o,s=xs(e.body);if(r===`sout`)a=q([`stretchy`,`sout`]),a.height=t.fontMetrics().defaultRuleThickness/i,o=-.5*t.fontMetrics().xHeight;else if(r===`phase`){var c=fc({number:.6,unit:`pt`},t),l=fc({number:.35,unit:`ex`},t),u=t.havingBaseSizing();i/=u.sizeMultiplier;var d=n.height+n.depth+c+l;n.style.paddingLeft=I(d/2+c);var f=Math.floor(1e3*d*i);a=jl([`hide-tail`],[new wc([new Tc(`phase`,tc(f))],{width:`400em`,height:I(f/1e3),viewBox:`0 0 400000 `+f,preserveAspectRatio:`xMinYMin slice`})],t),a.style.height=I(d),o=n.depth+c+l}else{/cancel/.test(r)?s||n.classes.push(`cancel-pad`):r===`angl`?n.classes.push(`anglpad`):n.classes.push(`boxpad`);var p,m,h=0;/box/.test(r)?(h=Math.max(t.fontMetrics().fboxrule,t.minRuleThickness),p=t.fontMetrics().fboxsep+(r===`colorbox`?0:h),m=p):r===`angl`?(h=Math.max(t.fontMetrics().defaultRuleThickness,t.minRuleThickness),p=4*h,m=Math.max(0,.25-n.depth)):(p=s?.2:0,m=p),a=Ru(n,r,p,m,t),/fbox|boxed|fcolorbox/.test(r)?(a.style.borderStyle=`solid`,a.style.borderWidth=I(h)):r===`angl`&&h!==.049&&(a.style.borderTopWidth=I(h),a.style.borderRightWidth=I(h)),o=n.depth+m,e.backgroundColor&&(a.style.backgroundColor=e.backgroundColor,e.borderColor&&(a.style.borderColor=e.borderColor))}var g;if(e.backgroundColor)g=J({positionType:`individualShift`,children:[{type:`elem`,elem:a,shift:o},{type:`elem`,elem:n,shift:0}]});else{var _=/cancel|phase/.test(r)?[`svg-align`]:[];g=J({positionType:`individualShift`,children:[{type:`elem`,elem:n,shift:0},{type:`elem`,elem:a,shift:o,wrapperClasses:_}]})}return/cancel/.test(r)&&(g.height=n.height,g.depth=n.depth),/cancel/.test(r)&&!s?q([`mord`,`cancel-lap`],[g],t):q([`mord`],[g],t)},Gd=(e,t)=>{var n,r=new Z(e.label.includes(`colorbox`)?`mpadded`:`menclose`,[Cu(e.body,t)]);switch(e.label){case`\\cancel`:r.setAttribute(`notation`,`updiagonalstrike`);break;case`\\bcancel`:r.setAttribute(`notation`,`downdiagonalstrike`);break;case`\\phase`:r.setAttribute(`notation`,`phasorangle`);break;case`\\sout`:r.setAttribute(`notation`,`horizontalstrike`);break;case`\\fbox`:r.setAttribute(`notation`,`box`);break;case`\\angl`:r.setAttribute(`notation`,`actuarial`);break;case`\\fcolorbox`:case`\\colorbox`:if(n=t.fontMetrics().fboxsep*t.fontMetrics().ptPerEm,r.setAttribute(`width`,`+`+2*n+`pt`),r.setAttribute(`height`,`+`+2*n+`pt`),r.setAttribute(`lspace`,n+`pt`),r.setAttribute(`voffset`,n+`pt`),e.label===`\\fcolorbox`){var i=Math.max(t.fontMetrics().fboxrule,t.minRuleThickness);r.setAttribute(`style`,`border: `+I(i)+` solid `+e.borderColor)}break;case`\\xcancel`:r.setAttribute(`notation`,`updiagonalstrike downdiagonalstrike`);break}return e.backgroundColor&&r.setAttribute(`mathbackground`,e.backgroundColor),r};X({type:`enclose`,names:[`\\colorbox`],props:{numArgs:2,allowedInText:!0,argTypes:[`color`,`hbox`]},handler(e,t,n){var{parser:r,funcName:i}=e,a=Q(t[0],`color-token`).color,o=t[1];return{type:`enclose`,mode:r.mode,label:i,backgroundColor:a,body:o}},htmlBuilder:Wd,mathmlBuilder:Gd}),X({type:`enclose`,names:[`\\fcolorbox`],props:{numArgs:3,allowedInText:!0,argTypes:[`color`,`color`,`hbox`]},handler(e,t,n){var{parser:r,funcName:i}=e,a=Q(t[0],`color-token`).color,o=Q(t[1],`color-token`).color,s=t[2];return{type:`enclose`,mode:r.mode,label:i,backgroundColor:o,borderColor:a,body:s}},htmlBuilder:Wd,mathmlBuilder:Gd}),X({type:`enclose`,names:[`\\fbox`],props:{numArgs:1,argTypes:[`hbox`],allowedInText:!0},handler(e,t){var{parser:n}=e;return{type:`enclose`,mode:n.mode,label:`\\fbox`,body:t[0]}}}),X({type:`enclose`,names:[`\\cancel`,`\\bcancel`,`\\xcancel`,`\\phase`],props:{numArgs:1},handler(e,t){var{parser:n,funcName:r}=e,i=t[0];return{type:`enclose`,mode:n.mode,label:r,body:i}},htmlBuilder:Wd,mathmlBuilder:Gd}),X({type:`enclose`,names:[`\\sout`],props:{numArgs:1,allowedInText:!0},handler(e,t){var{parser:n,funcName:r}=e;n.mode===`math`&&n.settings.reportNonstrict(`mathVsSout`,`LaTeX's \\sout works only in text mode`);var i=t[0];return{type:`enclose`,mode:n.mode,label:r,body:i}},htmlBuilder:Wd,mathmlBuilder:Gd}),X({type:`enclose`,names:[`\\angl`],props:{numArgs:1,argTypes:[`hbox`],allowedInText:!1},handler(e,t){var{parser:n}=e;return{type:`enclose`,mode:n.mode,label:`\\angl`,body:t[0]}}});var Kd={};function qd(e){for(var{type:t,names:n,props:r,handler:i,htmlBuilder:a,mathmlBuilder:o}=e,s={type:t,numArgs:r.numArgs||0,allowedInText:!1,numOptionalArgs:0,handler:i},c=0;c<n.length;++c)Kd[n[c]]=s;a&&(ql[t]=a),o&&(Jl[t]=o)}var Jd={};function $(e,t){Jd[e]=t}var Yd=class e{constructor(e,t,n){this.lexer=void 0,this.start=void 0,this.end=void 0,this.lexer=e,this.start=t,this.end=n}static range(t,n){return n?!t||!t.loc||!n.loc||t.loc.lexer!==n.loc.lexer?null:new e(t.loc.lexer,t.loc.start,n.loc.end):t&&t.loc}},Xd=class e{constructor(e,t){this.text=void 0,this.loc=void 0,this.noexpand=void 0,this.treatAsRelax=void 0,this.text=e,this.loc=t}range(t,n){return new e(n,Yd.range(this,t))}};function Zd(e){var t=[];e.consumeSpaces();var n=e.fetch().text;for(n===`\\relax`&&(e.consume(),e.consumeSpaces(),n=e.fetch().text);n===`\\hline`||n===`\\hdashline`;)e.consume(),t.push(n===`\\hdashline`),e.consumeSpaces(),n=e.fetch().text;return t}var Qd=e=>{if(!e.parser.settings.displayMode)throw new P(`{`+e.envName+`} can be used only in display mode.`)},$d=new Set([`gather`,`gather*`]);function ef(e){if(!e.includes(`ed`))return!e.includes(`*`)}function tf(e,t,n){var{hskipBeforeAndAfter:r,addJot:i,cols:a,arraystretch:o,colSeparationType:s,autoTag:c,singleRow:l,emptySingleRow:u,maxNumCols:d,leqno:f}=t;if(e.gullet.beginGroup(),l||e.gullet.macros.set(`\\cr`,`\\\\\\relax`),!o){var p=e.gullet.expandMacroAsText(`\\arraystretch`);if(p==null)o=1;else if(o=parseFloat(p),!o||o<0)throw new P(`Invalid \\arraystretch: `+p)}e.gullet.beginGroup();var m=[],h=[m],g=[],_=[],v=c==null?void 0:[];function y(){c&&e.gullet.macros.set(`\\@eqnsw`,`1`,!0)}function b(){v&&(e.gullet.macros.get(`\\df@tag`)?(v.push(e.subparse([new Xd(`\\df@tag`)])),e.gullet.macros.set(`\\df@tag`,void 0,!0)):v.push(!!c&&e.gullet.macros.get(`\\@eqnsw`)===`1`))}for(y(),_.push(Zd(e));;){var x=e.parseExpression(!1,l?`\\end`:`\\\\`);e.gullet.endGroup(),e.gullet.beginGroup();var S={type:`ordgroup`,mode:e.mode,body:x};n&&(S={type:`styling`,mode:e.mode,style:n,resetFont:!0,body:[S]}),m.push(S);var C=e.fetch().text;if(C===`&`){if(d&&m.length===d){if(l||s)throw new P(`Too many tab characters: &`,e.nextToken);e.settings.reportNonstrict(`textEnv`,`Too few columns specified in the {array} column argument.`)}e.consume()}else if(C===`\\end`){b(),m.length===1&&S.type===`styling`&&S.body.length===1&&S.body[0].type===`ordgroup`&&S.body[0].body.length===0&&(h.length>1||!u)&&h.pop(),_.length<h.length+1&&_.push([]);break}else if(C===`\\\\`){e.consume();var w=void 0;e.gullet.future().text!==` `&&(w=e.parseSizeGroup(!0)),g.push(w?w.value:null),b(),_.push(Zd(e)),m=[],h.push(m),y()}else throw new P(`Expected & or \\\\ or \\cr or \\end`,e.nextToken)}return e.gullet.endGroup(),e.gullet.endGroup(),{type:`array`,mode:e.mode,addJot:i,arraystretch:o,body:h,cols:a,rowGaps:g,hskipBeforeAndAfter:r,hLinesBeforeRow:_,colSeparationType:s,tags:v,leqno:f}}function nf(e){return e.slice(0,1)===`d`?`display`:`text`}var rf=function(e,t){var n,r,i=e.body.length,a=e.hLinesBeforeRow,o=0,s=Array(i),c=[],l=Math.max(t.fontMetrics().arrayRuleWidth,t.minRuleThickness),u=1/t.fontMetrics().ptPerEm,d=5*u;e.colSeparationType&&e.colSeparationType===`small`&&(d=.2778*(t.havingStyle(F.SCRIPT).sizeMultiplier/t.sizeMultiplier));var f=e.colSeparationType===`CD`?fc({number:3,unit:`ex`},t):12*u,p=3*u,m=e.arraystretch*f,h=.7*m,g=.3*m,_=0;function v(e){for(var t=0;t<e.length;++t)t>0&&(_+=.25),c.push({pos:_,isDashed:e[t]})}for(v(a[0]),n=0;n<e.body.length;++n){var y=e.body[n],b=h,x=g;o<y.length&&(o=y.length);var S={cells:Array(y.length),height:0,depth:0,pos:0};for(r=0;r<y.length;++r){var C=cu(y[r],t);x<C.depth&&(x=C.depth),b<C.height&&(b=C.height),S.cells[r]=C}var w=e.rowGaps[n],ee=0;w&&(ee=fc(w,t),ee>0&&(ee+=g,x<ee&&(x=ee),ee=0)),e.addJot&&n<e.body.length-1&&(x+=p),S.height=b,S.depth=x,_+=b,S.pos=_,_+=x+ee,s[n]=S,v(a[n+1])}var T=_/2+t.fontMetrics().axisHeight,te=e.cols||[],E=[],ne,re,ie=[];if(e.tags&&e.tags.some(e=>e))for(n=0;n<i;++n){var ae=s[n],oe=ae.pos-T,se=e.tags[n],ce=void 0;ce=se===!0?q([`eqn-num`],[],t):se===!1?q([],[],t):q([],nu(se,t,!0),t),ce.depth=ae.depth,ce.height=ae.height,ie.push({type:`elem`,elem:ce,shift:oe})}for(r=0,re=0;r<o||re<te.length;++r,++re){for(var D=te[re],le=!0;(ue=D)?.type===`separator`;){var ue;if(le||(ne=q([`arraycolsep`],[]),ne.style.width=I(t.fontMetrics().doubleRuleSep),E.push(ne)),D.separator===`|`||D.separator===`:`){var de=D.separator===`|`?`solid`:`dashed`,fe=q([`vertical-separator`],[],t);fe.style.height=I(_),fe.style.borderRightWidth=I(l),fe.style.borderRightStyle=de,fe.style.margin=`0 `+I(-l/2);var pe=_-T;pe&&(fe.style.verticalAlign=I(-pe)),E.push(fe)}else throw new P(`Invalid separator type: `+D.separator);re++,D=te[re],le=!1}if(!(r>=o)){var me=void 0;(r>0||e.hskipBeforeAndAfter)&&(me=D?.pregap??d,me!==0&&(ne=q([`arraycolsep`],[]),ne.style.width=I(me),E.push(ne)));var he=[];for(n=0;n<i;++n){var ge=s[n],_e=ge.cells[r];if(_e){var ve=ge.pos-T;_e.depth=ge.depth,_e.height=ge.height,he.push({type:`elem`,elem:_e,shift:ve})}}var ye=J({positionType:`individualShift`,children:he}),be=q([`col-align-`+(D?.align||`c`)],[ye]);E.push(be),(r<o-1||e.hskipBeforeAndAfter)&&(me=D?.postgap??d,me!==0&&(ne=q([`arraycolsep`],[]),ne.style.width=I(me),E.push(ne)))}}var xe=q([`mtable`],E);if(c.length>0){for(var Se=Ml(`hline`,t,l),Ce=Ml(`hdashline`,t,l),we=[{type:`elem`,elem:xe,shift:0}];c.length>0;){var Te=c.pop(),O=Te.pos-T;Te.isDashed?we.push({type:`elem`,elem:Ce,shift:O}):we.push({type:`elem`,elem:Se,shift:O})}xe=J({positionType:`individualShift`,children:we})}if(ie.length===0)return q([`mord`],[xe],t);var Ee=q([`tag`],[J({positionType:`individualShift`,children:ie})],t);return Pl([xe,Ee])},af={c:`center `,l:`left `,r:`right `},of=function(e,t){for(var n=[],r=new Z(`mtd`,[],[`mtr-glue`]),i=new Z(`mtd`,[],[`mml-eqn-num`]),a=0;a<e.body.length;a++){for(var o=e.body[a],s=[],c=0;c<o.length;c++)s.push(new Z(`mtd`,[Cu(o[c],t)]));e.tags&&e.tags[a]&&(s.unshift(r),s.push(r),e.leqno?s.unshift(i):s.push(i)),n.push(new Z(`mtr`,s))}var l=new Z(`mtable`,n),u=e.arraystretch===.5?.1:.16+e.arraystretch-1+(e.addJot?.09:0);l.setAttribute(`rowspacing`,I(u));var d=``,f=``;if(e.cols&&e.cols.length>0){var p=e.cols,m=``,h=!1,g=0,_=p.length;p[0].type===`separator`&&(d+=`top `,g=1),p[p.length-1].type===`separator`&&(d+=`bottom `,--_);for(var v=g;v<_;v++){var y=p[v];y.type===`align`?(f+=af[y.align],h&&(m+=`none `),h=!0):y.type===`separator`&&(h&&=(m+=y.separator===`|`?`solid `:`dashed `,!1))}l.setAttribute(`columnalign`,f.trim()),/[sd]/.test(m)&&l.setAttribute(`columnlines`,m.trim())}if(e.colSeparationType===`align`){for(var b=e.cols||[],x=``,S=1;S<b.length;S++)x+=S%2?`0em `:`1em `;l.setAttribute(`columnspacing`,x.trim())}else e.colSeparationType===`alignat`||e.colSeparationType===`gather`?l.setAttribute(`columnspacing`,`0em`):e.colSeparationType===`small`?l.setAttribute(`columnspacing`,`0.2778em`):e.colSeparationType===`CD`?l.setAttribute(`columnspacing`,`0.5em`):l.setAttribute(`columnspacing`,`1em`);var C=``,w=e.hLinesBeforeRow;d+=w[0].length>0?`left `:``,d+=w[w.length-1].length>0?`right `:``;for(var ee=1;ee<w.length-1;ee++)C+=w[ee].length===0?`none `:w[ee][0]?`dashed `:`solid `;return/[sd]/.test(C)&&l.setAttribute(`rowlines`,C.trim()),d!==``&&(l=new Z(`menclose`,[l]),l.setAttribute(`notation`,d.trim())),e.arraystretch&&e.arraystretch<1&&(l=new Z(`mstyle`,[l]),l.setAttribute(`scriptlevel`,`1`)),l},sf=function(e,t){e.envName.includes(`ed`)||Qd(e);var n=[],r=e.envName.includes(`at`)?`alignat`:`align`,i=e.envName===`split`,a=tf(e.parser,{cols:n,addJot:!0,autoTag:i?void 0:ef(e.envName),emptySingleRow:!0,colSeparationType:r,maxNumCols:i?2:void 0,leqno:e.parser.settings.leqno},`display`),o=0,s=0,c={type:`ordgroup`,mode:e.mode,body:[]};if(t[0]&&t[0].type===`ordgroup`){for(var l=``,u=0;u<t[0].body.length;u++){var d=Q(t[0].body[u],`textord`);l+=d.text}o=Number(l),s=o*2}var f=!s;a.body.forEach(function(e){for(var t=1;t<e.length;t+=2)Q(Q(e[t],`styling`).body[0],`ordgroup`).body.unshift(c);if(f)s<e.length&&(s=e.length);else{var n=e.length/2;if(o<n)throw new P(`Too many math in a row: `+(`expected `+o+`, but got `+n),e[0])}});for(var p=0;p<s;++p){var m=`r`,h=0;p%2==1?m=`l`:p>0&&f&&(h=1),n[p]={type:`align`,align:m,pregap:h,postgap:0}}return a.colSeparationType=f?`align`:`alignat`,a};qd({type:`array`,names:[`array`,`darray`],props:{numArgs:1},handler(e,t){var n=(Uu(t[0])?[t[0]]:Q(t[0],`ordgroup`).body).map(function(e){var t=Hu(e).text;if(`lcr`.includes(t))return{type:`align`,align:t};if(t===`|`)return{type:`separator`,separator:`|`};if(t===`:`)return{type:`separator`,separator:`:`};throw new P(`Unknown column alignment: `+t,e)}),r={cols:n,hskipBeforeAndAfter:!0,maxNumCols:n.length};return tf(e.parser,r,nf(e.envName))},htmlBuilder:rf,mathmlBuilder:of}),qd({type:`array`,names:[`matrix`,`pmatrix`,`bmatrix`,`Bmatrix`,`vmatrix`,`Vmatrix`,`matrix*`,`pmatrix*`,`bmatrix*`,`Bmatrix*`,`vmatrix*`,`Vmatrix*`],props:{numArgs:0},handler(e){var t={matrix:null,pmatrix:[`(`,`)`],bmatrix:[`[`,`]`],Bmatrix:[`\\{`,`\\}`],vmatrix:[`|`,`|`],Vmatrix:[`\\Vert`,`\\Vert`]}[e.envName.replace(`*`,``)],n=`c`,r={hskipBeforeAndAfter:!1,cols:[{type:`align`,align:n}]};if(e.envName.charAt(e.envName.length-1)===`*`){var i=e.parser;if(i.consumeSpaces(),i.fetch().text===`[`){if(i.consume(),i.consumeSpaces(),n=i.fetch().text,!`lcr`.includes(n))throw new P(`Expected l or c or r`,i.nextToken);i.consume(),i.consumeSpaces(),i.expect(`]`),i.consume(),r.cols=[{type:`align`,align:n}]}}var a=tf(e.parser,r,nf(e.envName)),o=Math.max(0,...a.body.map(e=>e.length));return a.cols=Array(o).fill({type:`align`,align:n}),t?{type:`leftright`,mode:e.mode,body:[a],left:t[0],right:t[1],rightColor:void 0}:a},htmlBuilder:rf,mathmlBuilder:of}),qd({type:`array`,names:[`smallmatrix`],props:{numArgs:0},handler(e){var t=tf(e.parser,{arraystretch:.5},`script`);return t.colSeparationType=`small`,t},htmlBuilder:rf,mathmlBuilder:of}),qd({type:`array`,names:[`subarray`],props:{numArgs:1},handler(e,t){var n=(Uu(t[0])?[t[0]]:Q(t[0],`ordgroup`).body).map(function(e){var t=Hu(e).text;if(`lc`.includes(t))return{type:`align`,align:t};throw new P(`Unknown column alignment: `+t,e)});if(n.length>1)throw new P(`{subarray} can contain only one column`);var r={cols:n,hskipBeforeAndAfter:!1,arraystretch:.5},i=tf(e.parser,r,`script`);if(i.body.length>0&&i.body[0].length>1)throw new P(`{subarray} can contain only one column`);return i},htmlBuilder:rf,mathmlBuilder:of}),qd({type:`array`,names:[`cases`,`dcases`,`rcases`,`drcases`],props:{numArgs:0},handler(e){var t=tf(e.parser,{arraystretch:1.2,cols:[{type:`align`,align:`l`,pregap:0,postgap:1},{type:`align`,align:`l`,pregap:0,postgap:0}]},nf(e.envName));return{type:`leftright`,mode:e.mode,body:[t],left:e.envName.includes(`r`)?`.`:`\\{`,right:e.envName.includes(`r`)?`\\}`:`.`,rightColor:void 0}},htmlBuilder:rf,mathmlBuilder:of}),qd({type:`array`,names:[`align`,`align*`,`aligned`,`split`],props:{numArgs:0},handler:sf,htmlBuilder:rf,mathmlBuilder:of}),qd({type:`array`,names:[`gathered`,`gather`,`gather*`],props:{numArgs:0},handler(e){$d.has(e.envName)&&Qd(e);var t={cols:[{type:`align`,align:`c`}],addJot:!0,colSeparationType:`gather`,autoTag:ef(e.envName),emptySingleRow:!0,leqno:e.parser.settings.leqno};return tf(e.parser,t,`display`)},htmlBuilder:rf,mathmlBuilder:of}),qd({type:`array`,names:[`alignat`,`alignat*`,`alignedat`],props:{numArgs:1},handler:sf,htmlBuilder:rf,mathmlBuilder:of}),qd({type:`array`,names:[`equation`,`equation*`],props:{numArgs:0},handler(e){Qd(e);var t={autoTag:ef(e.envName),emptySingleRow:!0,singleRow:!0,maxNumCols:1,leqno:e.parser.settings.leqno};return tf(e.parser,t,`display`)},htmlBuilder:rf,mathmlBuilder:of}),qd({type:`array`,names:[`CD`],props:{numArgs:0},handler(e){return Qd(e),rd(e.parser)},htmlBuilder:rf,mathmlBuilder:of}),$(`\\nonumber`,`\\gdef\\@eqnsw{0}`),$(`\\notag`,`\\nonumber`),X({type:`text`,names:[`\\hline`,`\\hdashline`],props:{numArgs:0,allowedInText:!0,allowedInMath:!0},handler(e,t){throw new P(e.funcName+` valid only within array environment`)}});var cf=Kd;X({type:`environment`,names:[`\\begin`,`\\end`],props:{numArgs:1,argTypes:[`text`]},handler(e,t){var{parser:n,funcName:r}=e,i=t[0];if(i.type!==`ordgroup`)throw new P(`Invalid environment name`,i);for(var a=``,o=0;o<i.body.length;++o)a+=Q(i.body[o],`textord`).text;if(r===`\\begin`){if(!cf.hasOwnProperty(a))throw new P(`No such environment: `+a,i);var s=cf[a],{args:c,optArgs:l}=n.parseArguments(`\\begin{`+a+`}`,s),u={mode:n.mode,envName:a,parser:n},d=s.handler(u,c,l);n.expect(`\\end`,!1);var f=n.nextToken,p=Q(n.parseFunction(),`environment`);if(p.name!==a)throw new P(`Mismatch: \\begin{`+a+`} matched by \\end{`+p.name+`}`,f);return d}return{type:`environment`,mode:n.mode,name:a,nameGroup:i}}});var lf=(e,t)=>{var n=e.font,r=t.withFont(n);return cu(e.body,r)},uf=(e,t)=>{var n=e.font,r=t.withFont(n);return Cu(e.body,r)},df={"\\Bbb":`\\mathbb`,"\\bold":`\\mathbf`,"\\frak":`\\mathfrak`};X({type:`font`,names:[`\\mathrm`,`\\mathit`,`\\mathbf`,`\\mathnormal`,`\\mathsfit`,`\\mathbb`,`\\mathcal`,`\\mathfrak`,`\\mathscr`,`\\mathsf`,`\\mathtt`,`\\Bbb`,`\\bold`,`\\frak`],props:{numArgs:1,allowedInArgument:!0},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=Xl(t[0]),a=r;return a in df&&(a=df[a]),{type:`font`,mode:n.mode,font:a.slice(1),body:i}},htmlBuilder:lf,mathmlBuilder:uf}),X({type:`mclass`,names:[`\\boldsymbol`,`\\bm`],props:{numArgs:1},handler:(e,t)=>{var{parser:n}=e,r=t[0];return{type:`mclass`,mode:n.mode,mclass:Zu(r),body:[{type:`font`,mode:n.mode,font:`boldsymbol`,body:r}],isCharacterBox:xs(r)}}}),X({type:`font`,names:[`\\rm`,`\\sf`,`\\tt`,`\\bf`,`\\it`,`\\cal`],props:{numArgs:0,allowedInText:!0},handler:(e,t)=>{var{parser:n,funcName:r,breakOnTokenText:i}=e,{mode:a}=n,o=n.parseExpression(!0,i);return{type:`font`,mode:a,font:`math`+r.slice(1),body:{type:`ordgroup`,mode:n.mode,body:o}}},htmlBuilder:lf,mathmlBuilder:uf});var ff=(e,t)=>{var n=t.style,r=n.fracNum(),i=n.fracDen(),a=t.havingStyle(r),o=cu(e.numer,a,t);if(e.continued){var s=8.5/t.fontMetrics().ptPerEm,c=3.5/t.fontMetrics().ptPerEm;o.height=o.height<s?s:o.height,o.depth=o.depth<c?c:o.depth}a=t.havingStyle(i);var l=cu(e.denom,a,t),u,d,f;e.hasBarLine?(e.barSize?(d=fc(e.barSize,t),u=Ml(`frac-line`,t,d)):u=Ml(`frac-line`,t),d=u.height,f=u.height):(u=null,d=0,f=t.fontMetrics().defaultRuleThickness);var p,m,h;n.size===F.DISPLAY.size?(p=t.fontMetrics().num1,m=d>0?3*f:7*f,h=t.fontMetrics().denom1):(d>0?(p=t.fontMetrics().num2,m=f):(p=t.fontMetrics().num3,m=3*f),h=t.fontMetrics().denom2);var g;if(u){var _=t.fontMetrics().axisHeight;p-o.depth-(_+.5*d)<m&&(p+=m-(p-o.depth-(_+.5*d))),_-.5*d-(l.height-h)<m&&(h+=m-(_-.5*d-(l.height-h)));var v=-(_-.5*d);g=J({positionType:`individualShift`,children:[{type:`elem`,elem:l,shift:h},{type:`elem`,elem:u,shift:v},{type:`elem`,elem:o,shift:-p}]})}else{var y=p-o.depth-(l.height-h);y<m&&(p+=.5*(m-y),h+=.5*(m-y)),g=J({positionType:`individualShift`,children:[{type:`elem`,elem:l,shift:h},{type:`elem`,elem:o,shift:-p}]})}a=t.havingStyle(n),g.height*=a.sizeMultiplier/t.sizeMultiplier,g.depth*=a.sizeMultiplier/t.sizeMultiplier;var b=n.size===F.DISPLAY.size?t.fontMetrics().delim1:n.size===F.SCRIPTSCRIPT.size?t.havingStyle(F.SCRIPT).fontMetrics().delim2:t.fontMetrics().delim2,x=e.leftDelim==null?su(t,[`mopen`]):Ld(e.leftDelim,b,!0,t.havingStyle(n),e.mode,[`mopen`]),S=e.continued?q([]):e.rightDelim==null?su(t,[`mclose`]):Ld(e.rightDelim,b,!0,t.havingStyle(n),e.mode,[`mclose`]);return q([`mord`].concat(a.sizingClasses(t)),[x,q([`mfrac`],[g]),S],t)},pf=(e,t)=>{var n=new Z(`mfrac`,[Cu(e.numer,t),Cu(e.denom,t)]);if(!e.hasBarLine)n.setAttribute(`linethickness`,`0px`);else if(e.barSize){var r=fc(e.barSize,t);n.setAttribute(`linethickness`,I(r))}if(e.leftDelim!=null||e.rightDelim!=null){var i=[];if(e.leftDelim!=null){var a=new Z(`mo`,[new fu(e.leftDelim.replace(`\\`,``))]);a.setAttribute(`fence`,`true`),i.push(a)}if(i.push(n),e.rightDelim!=null){var o=new Z(`mo`,[new fu(e.rightDelim.replace(`\\`,``))]);o.setAttribute(`fence`,`true`),i.push(o)}return _u(i)}return n},mf=(e,t)=>t?{type:`styling`,mode:e.mode,style:t,body:[e]}:e;X({type:`genfrac`,names:[`\\cfrac`,`\\dfrac`,`\\frac`,`\\tfrac`,`\\dbinom`,`\\binom`,`\\tbinom`,`\\\\atopfrac`,`\\\\bracefrac`,`\\\\brackfrac`],props:{numArgs:2,allowedInArgument:!0},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=t[0],a=t[1],o,s=null,c=null;switch(r){case`\\cfrac`:case`\\dfrac`:case`\\frac`:case`\\tfrac`:o=!0;break;case`\\\\atopfrac`:o=!1;break;case`\\dbinom`:case`\\binom`:case`\\tbinom`:o=!1,s=`(`,c=`)`;break;case`\\\\bracefrac`:o=!1,s=`\\{`,c=`\\}`;break;case`\\\\brackfrac`:o=!1,s=`[`,c=`]`;break;default:throw Error(`Unrecognized genfrac command`)}var l=r===`\\cfrac`,u=null;return l||r.startsWith(`\\d`)?u=`display`:r.startsWith(`\\t`)&&(u=`text`),mf({type:`genfrac`,mode:n.mode,numer:i,denom:a,continued:l,hasBarLine:o,leftDelim:s,rightDelim:c,barSize:null},u)},htmlBuilder:ff,mathmlBuilder:pf}),X({type:`infix`,names:[`\\over`,`\\choose`,`\\atop`,`\\brace`,`\\brack`],props:{numArgs:0,infix:!0},handler(e){var{parser:t,funcName:n,token:r}=e,i;switch(n){case`\\over`:i=`\\frac`;break;case`\\choose`:i=`\\binom`;break;case`\\atop`:i=`\\\\atopfrac`;break;case`\\brace`:i=`\\\\bracefrac`;break;case`\\brack`:i=`\\\\brackfrac`;break;default:throw Error(`Unrecognized infix genfrac command`)}return{type:`infix`,mode:t.mode,replaceWith:i,token:r}}});var hf=[`display`,`text`,`script`,`scriptscript`],gf=function(e){var t=null;return e.length>0&&(t=e,t=t===`.`?null:t),t};X({type:`genfrac`,names:[`\\genfrac`],props:{numArgs:6,allowedInArgument:!0,argTypes:[`math`,`math`,`size`,`text`,`math`,`math`]},handler(e,t){var{parser:n}=e,r=t[4],i=t[5],a=Xl(t[0]),o=a.type===`atom`&&a.family===`open`?gf(a.text):null,s=Xl(t[1]),c=s.type===`atom`&&s.family===`close`?gf(s.text):null,l=Q(t[2],`size`),u,d=null;l.isBlank?u=!0:(d=l.value,u=d.number>0);var f=null,p=t[3];if(p.type===`ordgroup`){if(p.body.length>0){var m=Q(p.body[0],`textord`);f=hf[Number(m.text)]}}else p=Q(p,`textord`),f=hf[Number(p.text)];return mf({type:`genfrac`,mode:n.mode,numer:r,denom:i,continued:!1,hasBarLine:u,barSize:d,leftDelim:o,rightDelim:c},f)}}),X({type:`infix`,names:[`\\above`],props:{numArgs:1,argTypes:[`size`],infix:!0},handler(e,t){var{parser:n,funcName:r,token:i}=e;return{type:`infix`,mode:n.mode,replaceWith:`\\\\abovefrac`,size:Q(t[0],`size`).value,token:i}}}),X({type:`genfrac`,names:[`\\\\abovefrac`],props:{numArgs:3,argTypes:[`math`,`size`,`math`]},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=t[0],a=Q(t[1],`infix`).size;if(!a)throw Error(`\\\\abovefrac expected size, but got `+String(a));var o=t[2],s=a.number>0;return{type:`genfrac`,mode:n.mode,numer:i,denom:o,continued:!1,hasBarLine:s,barSize:a,leftDelim:null,rightDelim:null}}});var _f=(e,t)=>{var n=t.style,r,i;e.type===`supsub`?(r=e.sup?cu(e.sup,t.havingStyle(n.sup()),t):cu(e.sub,t.havingStyle(n.sub()),t),i=Q(e.base,`horizBrace`)):i=Q(e,`horizBrace`);var a=cu(i.base,t.havingBaseStyle(F.DISPLAY)),o=Lu(i,t),s=i.isOver?J({positionType:`firstBaseline`,children:[{type:`elem`,elem:a},{type:`kern`,size:.1},{type:`elem`,elem:o,wrapperClasses:[`svg-align`]}]}):J({positionType:`bottom`,positionData:a.depth+.1+o.height,children:[{type:`elem`,elem:o,wrapperClasses:[`svg-align`]},{type:`kern`,size:.1},{type:`elem`,elem:a}]});if(r){var c=q([`minner`,i.isOver?`mover`:`munder`],[s],t);s=i.isOver?J({positionType:`firstBaseline`,children:[{type:`elem`,elem:c},{type:`kern`,size:.2},{type:`elem`,elem:r}]}):J({positionType:`bottom`,positionData:c.depth+.2+r.height+r.depth,children:[{type:`elem`,elem:r},{type:`kern`,size:.2},{type:`elem`,elem:c}]})}return q([`minner`,i.isOver?`mover`:`munder`],[s],t)};X({type:`horizBrace`,names:[`\\overbrace`,`\\underbrace`,`\\overbracket`,`\\underbracket`],props:{numArgs:1},handler(e,t){var{parser:n,funcName:r}=e;return{type:`horizBrace`,mode:n.mode,label:r,isOver:r.includes(`\\over`),base:t[0]}},htmlBuilder:_f,mathmlBuilder:(e,t)=>{var n=Pu(e.label);return new Z(e.isOver?`mover`:`munder`,[Cu(e.base,t),n])}}),X({type:`href`,names:[`\\href`],props:{numArgs:2,argTypes:[`url`,`original`],allowedInText:!0},handler:(e,t)=>{var{parser:n}=e,r=t[1],i=Q(t[0],`url`).url;return n.settings.isTrusted({command:`\\href`,url:i})?{type:`href`,mode:n.mode,href:i,body:Zl(r)}:n.formatUnsupportedCmd(`\\href`)},htmlBuilder:(e,t)=>{var n=nu(e.body,t,!1);return Nl(e.href,[],n,t)},mathmlBuilder:(e,t)=>{var n=Su(e.body,t);return n instanceof Z||(n=new Z(`mrow`,[n])),n.setAttribute(`href`,e.href),n}}),X({type:`href`,names:[`\\url`],props:{numArgs:1,argTypes:[`url`],allowedInText:!0},handler:(e,t)=>{var{parser:n}=e,r=Q(t[0],`url`).url;if(!n.settings.isTrusted({command:`\\url`,url:r}))return n.formatUnsupportedCmd(`\\url`);for(var i=[],a=0;a<r.length;a++){var o=r[a];o===`~`&&(o=`\\textasciitilde`),i.push({type:`textord`,mode:`text`,text:o})}var s={type:`text`,mode:n.mode,font:`\\texttt`,body:i};return{type:`href`,mode:n.mode,href:r,body:Zl(s)}}}),X({type:`hbox`,names:[`\\hbox`],props:{numArgs:1,argTypes:[`text`],allowedInText:!0,primitive:!0},handler(e,t){var{parser:n}=e;return{type:`hbox`,mode:n.mode,body:Zl(t[0])}},htmlBuilder(e,t){return Pl(nu(e.body,t.withFont(``),!1))},mathmlBuilder(e,t){return new Z(`mrow`,xu(e.body,t.withFont(``)))}}),X({type:`html`,names:[`\\htmlClass`,`\\htmlId`,`\\htmlStyle`,`\\htmlData`],props:{numArgs:2,argTypes:[`raw`,`original`],allowedInText:!0},handler:(e,t)=>{var{parser:n,funcName:r,token:i}=e,a=Q(t[0],`raw`).string,o=t[1];n.settings.strict&&n.settings.reportNonstrict(`htmlExtension`,`HTML extension is disabled on strict mode`);var s,c={};switch(r){case`\\htmlClass`:c.class=a,s={command:`\\htmlClass`,class:a};break;case`\\htmlId`:c.id=a,s={command:`\\htmlId`,id:a};break;case`\\htmlStyle`:c.style=a,s={command:`\\htmlStyle`,style:a};break;case`\\htmlData`:for(var l=a.split(`,`),u=0;u<l.length;u++){var d=l[u],f=d.indexOf(`=`);if(f<0)throw new P(`\\htmlData key/value '`+d+`' missing equals sign`);var p=d.slice(0,f),m=d.slice(f+1);c[`data-`+p.trim()]=m}s={command:`\\htmlData`,attributes:c};break;default:throw Error(`Unrecognized html command`)}return n.settings.isTrusted(s)?{type:`html`,mode:n.mode,attributes:c,body:Zl(o)}:n.formatUnsupportedCmd(r)},htmlBuilder:(e,t)=>{var n=nu(e.body,t,!1),r=[`enclosing`];e.attributes.class&&r.push(...e.attributes.class.trim().split(/\s+/));var i=q(r,n,t);for(var a in e.attributes)a!==`class`&&e.attributes.hasOwnProperty(a)&&i.setAttribute(a,e.attributes[a]);return i},mathmlBuilder:(e,t)=>Su(e.body,t)}),X({type:`htmlmathml`,names:[`\\html@mathml`],props:{numArgs:2,allowedInArgument:!0,allowedInText:!0},handler:(e,t)=>{var{parser:n}=e;return{type:`htmlmathml`,mode:n.mode,html:Zl(t[0]),mathml:Zl(t[1])}},htmlBuilder:(e,t)=>Pl(nu(e.html,t,!1)),mathmlBuilder:(e,t)=>Su(e.mathml,t)});var vf=function(e){if(/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(e))return{number:+e,unit:`bp`};var t=/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e);if(!t)throw new P(`Invalid size: '`+e+`' in \\includegraphics`);var n={number:+(t[1]+t[2]),unit:t[3]};if(!dc(n))throw new P(`Invalid unit: '`+n.unit+`' in \\includegraphics.`);return n};X({type:`includegraphics`,names:[`\\includegraphics`],props:{numArgs:1,numOptionalArgs:1,argTypes:[`raw`,`url`],allowedInText:!1},handler:(e,t,n)=>{var{parser:r}=e,i={number:0,unit:`em`},a={number:.9,unit:`em`},o={number:0,unit:`em`},s=``;if(n[0])for(var c=Q(n[0],`raw`).string.split(`,`),l=0;l<c.length;l++){var u=c[l].split(`=`);if(u.length===2){var d=u[1].trim();switch(u[0].trim()){case`alt`:s=d;break;case`width`:i=vf(d);break;case`height`:a=vf(d);break;case`totalheight`:o=vf(d);break;default:throw new P(`Invalid key: '`+u[0]+`' in \\includegraphics.`)}}}var f=Q(t[0],`url`).url;return s===``&&(s=f,s=s.replace(/^.*[\\/]/,``),s=s.substring(0,s.lastIndexOf(`.`))),r.settings.isTrusted({command:`\\includegraphics`,url:f})?{type:`includegraphics`,mode:r.mode,alt:s,width:i,height:a,totalheight:o,src:f}:r.formatUnsupportedCmd(`\\includegraphics`)},htmlBuilder:(e,t)=>{var n=fc(e.height,t),r=0;e.totalheight.number>0&&(r=fc(e.totalheight,t)-n);var i=0;e.width.number>0&&(i=fc(e.width,t));var a={height:I(n+r)};i>0&&(a.width=I(i)),r>0&&(a.verticalAlign=I(-r));var o=new xc(e.src,e.alt,a);return o.height=n,o.depth=r,o},mathmlBuilder:(e,t)=>{var n=new Z(`mglyph`,[]);n.setAttribute(`alt`,e.alt);var r=fc(e.height,t),i=0;if(e.totalheight.number>0&&(i=fc(e.totalheight,t)-r,n.setAttribute(`valign`,I(-i))),n.setAttribute(`height`,I(r+i)),e.width.number>0){var a=fc(e.width,t);n.setAttribute(`width`,I(a))}return n.setAttribute(`src`,e.src),n}}),X({type:`kern`,names:[`\\kern`,`\\mkern`,`\\hskip`,`\\mskip`],props:{numArgs:1,argTypes:[`size`],primitive:!0,allowedInText:!0},handler(e,t){var{parser:n,funcName:r}=e,i=Q(t[0],`size`);if(n.settings.strict){var a=r[1]===`m`,o=i.value.unit===`mu`;a?(o||n.settings.reportNonstrict(`mathVsTextUnits`,`LaTeX's `+r+` supports only mu units, `+(`not `+i.value.unit+` units`)),n.mode!==`math`&&n.settings.reportNonstrict(`mathVsTextUnits`,`LaTeX's `+r+` works only in math mode`)):o&&n.settings.reportNonstrict(`mathVsTextUnits`,`LaTeX's `+r+` doesn't support mu units`)}return{type:`kern`,mode:n.mode,dimension:i.value}},htmlBuilder(e,t){return Ll(e.dimension,t)},mathmlBuilder(e,t){return new pu(fc(e.dimension,t))}}),X({type:`lap`,names:[`\\mathllap`,`\\mathrlap`,`\\mathclap`],props:{numArgs:1,allowedInText:!0},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=t[0];return{type:`lap`,mode:n.mode,alignment:r.slice(5),body:i}},htmlBuilder:(e,t)=>{var n;e.alignment===`clap`?(n=q([],[cu(e.body,t)]),n=q([`inner`],[n],t)):n=q([`inner`],[cu(e.body,t)]);var r=q([`fix`],[]),i=q([e.alignment],[n,r],t),a=q([`strut`]);return a.style.height=I(i.height+i.depth),i.depth&&(a.style.verticalAlign=I(-i.depth)),i.children.unshift(a),i=q([`thinbox`],[i],t),q([`mord`,`vbox`],[i],t)},mathmlBuilder:(e,t)=>{var n=new Z(`mpadded`,[Cu(e.body,t)]);if(e.alignment!==`rlap`){var r=e.alignment===`llap`?`-1`:`-0.5`;n.setAttribute(`lspace`,r+`width`)}return n.setAttribute(`width`,`0px`),n}}),X({type:`styling`,names:[`\\(`,`$`],props:{numArgs:0,allowedInText:!0,allowedInMath:!1},handler(e,t){var{funcName:n,parser:r}=e,i=r.mode;r.switchMode(`math`);var a=n===`\\(`?`\\)`:`$`,o=r.parseExpression(!1,a);return r.expect(a),r.switchMode(i),{type:`styling`,mode:r.mode,style:`text`,resetFont:!0,body:o}}}),X({type:`text`,names:[`\\)`,`\\]`],props:{numArgs:0,allowedInText:!0,allowedInMath:!1},handler(e,t){throw new P(`Mismatched `+e.funcName)}});var yf=(e,t)=>{switch(t.style.size){case F.DISPLAY.size:return e.display;case F.TEXT.size:return e.text;case F.SCRIPT.size:return e.script;case F.SCRIPTSCRIPT.size:return e.scriptscript;default:return e.text}};X({type:`mathchoice`,names:[`\\mathchoice`],props:{numArgs:4,primitive:!0},handler:(e,t)=>{var{parser:n}=e;return{type:`mathchoice`,mode:n.mode,display:Zl(t[0]),text:Zl(t[1]),script:Zl(t[2]),scriptscript:Zl(t[3])}},htmlBuilder:(e,t)=>Pl(nu(yf(e,t),t,!1)),mathmlBuilder:(e,t)=>Su(yf(e,t),t)});var bf=(e,t,n,r,i,a,o)=>{e=q([],[e]);var s=n&&xs(n),c,l;if(t){var u=cu(t,r.havingStyle(i.sup()),r);l={elem:u,kern:Math.max(r.fontMetrics().bigOpSpacing1,r.fontMetrics().bigOpSpacing3-u.depth)}}if(n){var d=cu(n,r.havingStyle(i.sub()),r);c={elem:d,kern:Math.max(r.fontMetrics().bigOpSpacing2,r.fontMetrics().bigOpSpacing4-d.height)}}var f;if(l&&c)f=J({positionType:`bottom`,positionData:r.fontMetrics().bigOpSpacing5+c.elem.height+c.elem.depth+c.kern+e.depth+o,children:[{type:`kern`,size:r.fontMetrics().bigOpSpacing5},{type:`elem`,elem:c.elem,marginLeft:I(-a)},{type:`kern`,size:c.kern},{type:`elem`,elem:e},{type:`kern`,size:l.kern},{type:`elem`,elem:l.elem,marginLeft:I(a)},{type:`kern`,size:r.fontMetrics().bigOpSpacing5}]});else if(c)f=J({positionType:`top`,positionData:e.height-o,children:[{type:`kern`,size:r.fontMetrics().bigOpSpacing5},{type:`elem`,elem:c.elem,marginLeft:I(-a)},{type:`kern`,size:c.kern},{type:`elem`,elem:e}]});else if(l)f=J({positionType:`bottom`,positionData:e.depth+o,children:[{type:`elem`,elem:e},{type:`kern`,size:l.kern},{type:`elem`,elem:l.elem,marginLeft:I(a)},{type:`kern`,size:r.fontMetrics().bigOpSpacing5}]});else return e;var p=[f];if(c&&a!==0&&!s){var m=q([`mspace`],[],r);m.style.marginRight=I(a),p.unshift(m)}return q([`mop`,`op-limits`],p,r)},xf=new Set([`\\smallint`]),Sf=(e,t)=>{var n,r,i=!1,a;e.type===`supsub`?(n=e.sup,r=e.sub,a=Q(e.base,`op`),i=!0):a=Q(e,`op`);var o=t.style,s=!1;o.size===F.DISPLAY.size&&a.symbol&&!xf.has(a.name)&&(s=!0);var c,l;if(a.symbol){var u=s?`Size2-Regular`:`Size1-Regular`,d=``;if((a.name===`\\oiint`||a.name===`\\oiiint`)&&(d=a.name.slice(1),a.name=d===`oiint`?`\\iint`:`\\iiint`),c=wl(a.name,u,`math`,t,[`mop`,`op-symbol`,s?`large-op`:`small-op`]),l=c.italic,d.length>0){var f=Bl(d+`Size`+(s?`2`:`1`),t);c=J({positionType:`individualShift`,children:[{type:`elem`,elem:c,shift:0},{type:`elem`,elem:f,shift:s?.08:0}]}),a.name=`\\`+d,c.classes.unshift(`mop`),c.italic=l}}else if(a.body){var p=nu(a.body,t,!0);p.length===1&&p[0]instanceof Cc?(c=p[0],c.classes[0]=`mop`):c=q([`mop`],p,t)}else{for(var m=[],h=1;h<a.name.length;h++)m.push(Tl(a.name[h],a.mode,t));c=q([`mop`],m,t)}var g=0,_=0;return(c instanceof Cc||a.name===`\\oiint`||a.name===`\\oiiint`)&&!a.suppressBaseShift&&(g=(c.height-c.depth)/2-t.fontMetrics().axisHeight,_=c.italic??0),i?bf(c,n,r,t,o,_,g):(g&&(c.style.position=`relative`,c.style.top=I(g)),c)},Cf=(e,t)=>{var n;if(e.symbol)n=new Z(`mo`,[gu(e.name,e.mode)]),xf.has(e.name)&&n.setAttribute(`largeop`,`false`);else if(e.body)n=new Z(`mo`,xu(e.body,t));else{n=new Z(`mi`,[new fu(e.name.slice(1))]);var r=new Z(`mo`,[gu(`⁡`,`text`)]);n=e.parentIsSupSub?new Z(`mrow`,[n,r]):du([n,r])}return n},wf={"∏":`\\prod`,"∐":`\\coprod`,"∑":`\\sum`,"⋀":`\\bigwedge`,"⋁":`\\bigvee`,"⋂":`\\bigcap`,"⋃":`\\bigcup`,"⨀":`\\bigodot`,"⨁":`\\bigoplus`,"⨂":`\\bigotimes`,"⨄":`\\biguplus`,"⨆":`\\bigsqcup`};X({type:`op`,names:`\\coprod.\\bigvee.\\bigwedge.\\biguplus.\\bigcap.\\bigcup.\\intop.\\prod.\\sum.\\bigotimes.\\bigoplus.\\bigodot.\\bigsqcup.\\smallint.∏.∐.∑.⋀.⋁.⋂.⋃.⨀.⨁.⨂.⨄.⨆`.split(`.`),props:{numArgs:0},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=r;return i.length===1&&(i=wf[i]),{type:`op`,mode:n.mode,limits:!0,parentIsSupSub:!1,symbol:!0,name:i}},htmlBuilder:Sf,mathmlBuilder:Cf}),X({type:`op`,names:[`\\mathop`],props:{numArgs:1,primitive:!0},handler:(e,t)=>{var{parser:n}=e,r=t[0];return{type:`op`,mode:n.mode,limits:!1,parentIsSupSub:!1,symbol:!1,body:Zl(r)}},htmlBuilder:Sf,mathmlBuilder:Cf});var Tf={"∫":`\\int`,"∬":`\\iint`,"∭":`\\iiint`,"∮":`\\oint`,"∯":`\\oiint`,"∰":`\\oiiint`};X({type:`op`,names:`\\arcsin.\\arccos.\\arctan.\\arctg.\\arcctg.\\arg.\\ch.\\cos.\\cosec.\\cosh.\\cot.\\cotg.\\coth.\\csc.\\ctg.\\cth.\\deg.\\dim.\\exp.\\hom.\\ker.\\lg.\\ln.\\log.\\sec.\\sin.\\sinh.\\sh.\\tan.\\tanh.\\tg.\\th`.split(`.`),props:{numArgs:0},handler(e){var{parser:t,funcName:n}=e;return{type:`op`,mode:t.mode,limits:!1,parentIsSupSub:!1,symbol:!1,name:n}},htmlBuilder:Sf,mathmlBuilder:Cf}),X({type:`op`,names:[`\\det`,`\\gcd`,`\\inf`,`\\lim`,`\\max`,`\\min`,`\\Pr`,`\\sup`],props:{numArgs:0},handler(e){var{parser:t,funcName:n}=e;return{type:`op`,mode:t.mode,limits:!0,parentIsSupSub:!1,symbol:!1,name:n}},htmlBuilder:Sf,mathmlBuilder:Cf}),X({type:`op`,names:[`\\int`,`\\iint`,`\\iiint`,`\\oint`,`\\oiint`,`\\oiiint`,`∫`,`∬`,`∭`,`∮`,`∯`,`∰`],props:{numArgs:0,allowedInArgument:!0},handler(e){var{parser:t,funcName:n}=e,r=n;return r.length===1&&(r=Tf[r]),{type:`op`,mode:t.mode,limits:!1,parentIsSupSub:!1,symbol:!0,name:r}},htmlBuilder:Sf,mathmlBuilder:Cf});var Ef=(e,t)=>{var n,r,i=!1,a;e.type===`supsub`?(n=e.sup,r=e.sub,a=Q(e.base,`operatorname`),i=!0):a=Q(e,`operatorname`);var o;if(a.body.length>0){for(var s=nu(a.body.map(e=>{var t=`text`in e?e.text:void 0;return typeof t==`string`?{type:`textord`,mode:e.mode,text:t}:e}),t.withFont(`mathrm`),!0),c=0;c<s.length;c++){var l=s[c];l instanceof Cc&&(l.text=l.text.replace(/\u2212/,`-`).replace(/\u2217/,`*`))}o=q([`mop`],s,t)}else o=q([`mop`],[],t);return i?bf(o,n,r,t,t.style,0,0):o};X({type:`operatorname`,names:[`\\operatorname@`,`\\operatornamewithlimits`],props:{numArgs:1},handler:(e,t)=>{var{parser:n,funcName:r}=e,i=t[0];return{type:`operatorname`,mode:n.mode,body:Zl(i),alwaysHandleSupSub:r===`\\operatornamewithlimits`,limits:!1,parentIsSupSub:!1}},htmlBuilder:Ef,mathmlBuilder:(e,t)=>{for(var n=xu(e.body,t.withFont(`mathrm`)),r=!0,i=0;i<n.length;i++){var a=n[i];if(!(a instanceof pu))if(a instanceof Z)switch(a.type){case`mi`:case`mn`:case`mspace`:case`mtext`:break;case`mo`:var o=a.children[0];a.children.length===1&&o instanceof fu?o.text=o.text.replace(/\u2212/,`-`).replace(/\u2217/,`*`):r=!1;break;default:r=!1}else r=!1}r&&(n=[new fu(n.map(e=>e.toText()).join(``))]);var s=new Z(`mi`,n);s.setAttribute(`mathvariant`,`normal`);var c=new Z(`mo`,[gu(`⁡`,`text`)]);return e.parentIsSupSub?new Z(`mrow`,[s,c]):du([s,c])}}),$(`\\operatorname`,`\\@ifstar\\operatornamewithlimits\\operatorname@`),Yl({type:`ordgroup`,htmlBuilder(e,t){return e.semisimple?Pl(nu(e.body,t,!1)):q([`mord`],nu(e.body,t,!0),t)},mathmlBuilder(e,t){return Su(e.body,t,!0)}}),X({type:`overline`,names:[`\\overline`],props:{numArgs:1},handler(e,t){var{parser:n}=e,r=t[0];return{type:`overline`,mode:n.mode,body:r}},htmlBuilder(e,t){var n=cu(e.body,t.havingCrampedStyle()),r=Ml(`overline-line`,t),i=t.fontMetrics().defaultRuleThickness;return q([`mord`,`overline`],[J({positionType:`firstBaseline`,children:[{type:`elem`,elem:n},{type:`kern`,size:3*i},{type:`elem`,elem:r},{type:`kern`,size:i}]})],t)},mathmlBuilder(e,t){var n=new Z(`mo`,[new fu(`‾`)]);n.setAttribute(`stretchy`,`true`);var r=new Z(`mover`,[Cu(e.body,t),n]);return r.setAttribute(`accent`,`true`),r}}),X({type:`phantom`,names:[`\\phantom`],props:{numArgs:1,allowedInText:!0},handler:(e,t)=>{var{parser:n}=e,r=t[0];return{type:`phantom`,mode:n.mode,body:Zl(r)}},htmlBuilder:(e,t)=>Pl(nu(e.body,t.withPhantom(),!1)),mathmlBuilder:(e,t)=>new Z(`mphantom`,xu(e.body,t))}),$(`\\hphantom`,`\\smash{\\phantom{#1}}`),X({type:`vphantom`,names:[`\\vphantom`],props:{numArgs:1,allowedInText:!0},handler:(e,t)=>{var{parser:n}=e,r=t[0];return{type:`vphantom`,mode:n.mode,body:r}},htmlBuilder:(e,t)=>q([`mord`,`rlap`],[q([`inner`],[cu(e.body,t.withPhantom())]),q([`fix`],[])],t),mathmlBuilder:(e,t)=>{var n=new Z(`mpadded`,[new Z(`mphantom`,xu(Zl(e.body),t))]);return n.setAttribute(`width`,`0px`),n}}),X({type:`raisebox`,names:[`\\raisebox`],props:{numArgs:2,argTypes:[`size`,`hbox`],allowedInText:!0},handler(e,t){var{parser:n}=e,r=Q(t[0],`size`).value,i=t[1];return{type:`raisebox`,mode:n.mode,dy:r,body:i}},htmlBuilder(e,t){var n=cu(e.body,t);return J({positionType:`shift`,positionData:-fc(e.dy,t),children:[{type:`elem`,elem:n}]})},mathmlBuilder(e,t){var n=new Z(`mpadded`,[Cu(e.body,t)]),r=e.dy.number+e.dy.unit;return n.setAttribute(`voffset`,r),n}}),X({type:`internal`,names:[`\\relax`],props:{numArgs:0,allowedInText:!0,allowedInArgument:!0},handler(e){var{parser:t}=e;return{type:`internal`,mode:t.mode}}}),X({type:`rule`,names:[`\\rule`],props:{numArgs:2,numOptionalArgs:1,allowedInText:!0,allowedInMath:!0,argTypes:[`size`,`size`,`size`]},handler(e,t,n){var{parser:r}=e,i=n[0],a=Q(t[0],`size`),o=Q(t[1],`size`);return{type:`rule`,mode:r.mode,shift:i&&Q(i,`size`).value,width:a.value,height:o.value}},htmlBuilder(e,t){var n=q([`mord`,`rule`],[],t),r=fc(e.width,t),i=fc(e.height,t),a=e.shift?fc(e.shift,t):0;return n.style.borderRightWidth=I(r),n.style.borderTopWidth=I(i),n.style.bottom=I(a),n.width=r,n.height=i+a,n.depth=-a,n.maxFontSize=i*1.125*t.sizeMultiplier,n},mathmlBuilder(e,t){var n=fc(e.width,t),r=fc(e.height,t),i=e.shift?fc(e.shift,t):0,a=t.color&&t.getColor()||`black`,o=new Z(`mspace`);o.setAttribute(`mathbackground`,a),o.setAttribute(`width`,I(n)),o.setAttribute(`height`,I(r));var s=new Z(`mpadded`,[o]);return i>=0?s.setAttribute(`height`,I(i)):(s.setAttribute(`height`,I(i)),s.setAttribute(`depth`,I(-i))),s.setAttribute(`voffset`,I(i)),s}});function Df(e,t,n){for(var r=nu(e,t,!1),i=t.sizeMultiplier/n.sizeMultiplier,a=0;a<r.length;a++){var o=r[a].classes.indexOf(`sizing`);o<0?Array.prototype.push.apply(r[a].classes,t.sizingClasses(n)):r[a].classes[o+1]===`reset-size`+t.size&&(r[a].classes[o+1]=`reset-size`+n.size),r[a].height*=i,r[a].depth*=i}return Pl(r)}var Of=[`\\tiny`,`\\sixptsize`,`\\scriptsize`,`\\footnotesize`,`\\small`,`\\normalsize`,`\\large`,`\\Large`,`\\LARGE`,`\\huge`,`\\Huge`];X({type:`sizing`,names:Of,props:{numArgs:0,allowedInText:!0},handler:(e,t)=>{var{breakOnTokenText:n,funcName:r,parser:i}=e,a=i.parseExpression(!1,n);return{type:`sizing`,mode:i.mode,size:Of.indexOf(r)+1,body:a}},htmlBuilder:(e,t)=>{var n=t.havingSize(e.size);return Df(e.body,n,t)},mathmlBuilder:(e,t)=>{var n=t.havingSize(e.size),r=new Z(`mstyle`,xu(e.body,n));return r.setAttribute(`mathsize`,I(n.sizeMultiplier)),r}}),X({type:`smash`,names:[`\\smash`],props:{numArgs:1,numOptionalArgs:1,allowedInText:!0},handler:(e,t,n)=>{var{parser:r}=e,i=!1,a=!1,o=n[0]&&Q(n[0],`ordgroup`);if(o)for(var s,c=0;c<o.body.length;++c){var l=o.body[c];if(s=Hu(l).text,s===`t`)i=!0;else if(s===`b`)a=!0;else{i=!1,a=!1;break}}else i=!0,a=!0;var u=t[0];return{type:`smash`,mode:r.mode,body:u,smashHeight:i,smashDepth:a}},htmlBuilder:(e,t)=>{var n=q([],[cu(e.body,t)]);if(!e.smashHeight&&!e.smashDepth)return n;if(e.smashHeight&&(n.height=0),e.smashDepth&&(n.depth=0),e.smashHeight&&e.smashDepth)return q([`mord`,`smash`],[n],t);if(n.children)for(var r=0;r<n.children.length;r++)e.smashHeight&&(n.children[r].height=0),e.smashDepth&&(n.children[r].depth=0);return q([`mord`],[J({positionType:`firstBaseline`,children:[{type:`elem`,elem:n}]})],t)},mathmlBuilder:(e,t)=>{var n=new Z(`mpadded`,[Cu(e.body,t)]);return e.smashHeight&&n.setAttribute(`height`,`0px`),e.smashDepth&&n.setAttribute(`depth`,`0px`),n}}),X({type:`sqrt`,names:[`\\sqrt`],props:{numArgs:1,numOptionalArgs:1},handler(e,t,n){var{parser:r}=e,i=n[0],a=t[0];return{type:`sqrt`,mode:r.mode,body:a,index:i}},htmlBuilder(e,t){var n=cu(e.body,t.havingCrampedStyle());n.height===0&&(n.height=t.fontMetrics().xHeight),n=Fl(n,t);var r=t.fontMetrics().defaultRuleThickness,i=r;t.style.id<F.TEXT.id&&(i=t.fontMetrics().xHeight);var a=r+i/4,{span:o,ruleWidth:s,advanceWidth:c}=Ed(n.height+n.depth+a+r,t),l=o.height-s;l>n.height+n.depth+a&&(a=(a+l-n.height-n.depth)/2);var u=o.height-n.height-a-s;n.style.paddingLeft=I(c);var d=J({positionType:`firstBaseline`,children:[{type:`elem`,elem:n,wrapperClasses:[`svg-align`]},{type:`kern`,size:-(n.height+u)},{type:`elem`,elem:o},{type:`kern`,size:s}]});if(e.index){var f=t.havingStyle(F.SCRIPTSCRIPT),p=cu(e.index,f,t);return q([`mord`,`sqrt`],[q([`root`],[J({positionType:`shift`,positionData:-(.6*(d.height-d.depth)),children:[{type:`elem`,elem:p}]})]),d],t)}else return q([`mord`,`sqrt`],[d],t)},mathmlBuilder(e,t){var{body:n,index:r}=e;return r?new Z(`mroot`,[Cu(n,t),Cu(r,t)]):new Z(`msqrt`,[Cu(n,t)])}});var kf={display:F.DISPLAY,text:F.TEXT,script:F.SCRIPT,scriptscript:F.SCRIPTSCRIPT};function Af(e){return e in kf}X({type:`styling`,names:[`\\displaystyle`,`\\textstyle`,`\\scriptstyle`,`\\scriptscriptstyle`],props:{numArgs:0,allowedInText:!0,primitive:!0},handler(e,t){var{breakOnTokenText:n,funcName:r,parser:i}=e,a=i.parseExpression(!0,n),o=r.slice(1,r.length-5);if(!Af(o))throw Error(`Unknown style: `+o);return{type:`styling`,mode:i.mode,style:o,body:a}},htmlBuilder(e,t){var n=kf[e.style],r=t.havingStyle(n);return e.resetFont&&(r=r.withFont(``)),Df(e.body,r,t)},mathmlBuilder(e,t){var n=kf[e.style],r=t.havingStyle(n);e.resetFont&&(r=r.withFont(``));var i=new Z(`mstyle`,xu(e.body,r)),a={display:[`0`,`true`],text:[`0`,`false`],script:[`1`,`false`],scriptscript:[`2`,`false`]}[e.style];return i.setAttribute(`scriptlevel`,a[0]),i.setAttribute(`displaystyle`,a[1]),i}});var jf=function(e,t){var n=e.base;return n?n.type===`op`?n.limits&&(t.style.size===F.DISPLAY.size||n.alwaysHandleSupSub)?Sf:null:n.type===`operatorname`?n.alwaysHandleSupSub&&(t.style.size===F.DISPLAY.size||n.limits)?Ef:null:n.type===`accent`?xs(n.base)?Gu:null:n.type===`horizBrace`&&!e.sub===n.isOver?_f:null:null};Yl({type:`supsub`,htmlBuilder(e,t){var n=jf(e,t);if(n)return n(e,t);var{base:r,sup:i,sub:a}=e,o=cu(r,t),s,c,l=t.fontMetrics(),u=0,d=0,f=r&&xs(r);if(i){var p=t.havingStyle(t.style.sup());s=cu(i,p,t),f||(u=o.height-p.fontMetrics().supDrop*p.sizeMultiplier/t.sizeMultiplier)}if(a){var m=t.havingStyle(t.style.sub());c=cu(a,m,t),f||(d=o.depth+m.fontMetrics().subDrop*m.sizeMultiplier/t.sizeMultiplier)}var h=t.style===F.DISPLAY?l.sup1:t.style.cramped?l.sup3:l.sup2,g=t.sizeMultiplier,_=I(.5/l.ptPerEm/g),v=null;if(c){var y=e.base&&e.base.type===`op`&&e.base.name&&(e.base.name===`\\oiint`||e.base.name===`\\oiiint`);(o instanceof Cc||y)&&(v=I(-(o.italic??0)))}var b;if(s&&c){u=Math.max(u,h,s.depth+.25*l.xHeight),d=Math.max(d,l.sub2);var x=4*l.defaultRuleThickness;if(u-s.depth-(c.height-d)<x){d=x-(u-s.depth)+c.height;var S=.8*l.xHeight-(u-s.depth);S>0&&(u+=S,d-=S)}b=J({positionType:`individualShift`,children:[{type:`elem`,elem:c,shift:d,marginRight:_,marginLeft:v},{type:`elem`,elem:s,shift:-u,marginRight:_}]})}else if(c)d=Math.max(d,l.sub1,c.height-.8*l.xHeight),b=J({positionType:`shift`,positionData:d,children:[{type:`elem`,elem:c,marginLeft:v,marginRight:_}]});else if(s)u=Math.max(u,h,s.depth+.25*l.xHeight),b=J({positionType:`shift`,positionData:-u,children:[{type:`elem`,elem:s,marginRight:_}]});else throw Error(`supsub must have either sup or sub.`);return q([ou(o,`right`)||`mord`],[o,q([`msupsub`],[b])],t)},mathmlBuilder(e,t){var n=!1,r,i;e.base&&e.base.type===`horizBrace`&&(i=!!e.sup,i===e.base.isOver&&(n=!0,r=e.base.isOver)),e.base&&(e.base.type===`op`||e.base.type===`operatorname`)&&(e.base.parentIsSupSub=!0);var a=[Cu(e.base,t)];e.sub&&a.push(Cu(e.sub,t)),e.sup&&a.push(Cu(e.sup,t));var o;if(n)o=r?`mover`:`munder`;else if(!e.sub){var s=e.base;o=s&&s.type===`op`&&s.limits&&(t.style===F.DISPLAY||s.alwaysHandleSupSub)||s&&s.type===`operatorname`&&s.alwaysHandleSupSub&&(s.limits||t.style===F.DISPLAY)?`mover`:`msup`}else if(e.sup){var c=e.base;o=c&&c.type===`op`&&c.limits&&t.style===F.DISPLAY||c&&c.type===`operatorname`&&c.alwaysHandleSupSub&&(t.style===F.DISPLAY||c.limits)?`munderover`:`msubsup`}else{var l=e.base;o=l&&l.type===`op`&&l.limits&&(t.style===F.DISPLAY||l.alwaysHandleSupSub)||l&&l.type===`operatorname`&&l.alwaysHandleSupSub&&(l.limits||t.style===F.DISPLAY)?`munder`:`msub`}return new Z(o,a)}}),Yl({type:`atom`,htmlBuilder(e,t){return Tl(e.text,e.mode,t,[`m`+e.family])},mathmlBuilder(e,t){var n=new Z(`mo`,[gu(e.text,e.mode)]);if(e.family===`bin`){var r=yu(e,t);r===`bold-italic`&&n.setAttribute(`mathvariant`,r)}else e.family===`punct`?n.setAttribute(`separator`,`true`):(e.family===`open`||e.family===`close`)&&n.setAttribute(`stretchy`,`false`);return n}});var Mf={mi:`italic`,mn:`normal`,mtext:`normal`};Yl({type:`mathord`,htmlBuilder(e,t){return Dl(e,t,`mathord`)},mathmlBuilder(e,t){var n=new Z(`mi`,[gu(e.text,e.mode,t)]),r=yu(e,t)||`italic`;return r!==Mf[n.type]&&n.setAttribute(`mathvariant`,r),n}}),Yl({type:`textord`,htmlBuilder(e,t){return Dl(e,t,`textord`)},mathmlBuilder(e,t){var n=gu(e.text,e.mode,t),r=yu(e,t)||`normal`,i=e.mode===`text`?new Z(`mtext`,[n]):/[0-9]/.test(e.text)?new Z(`mn`,[n]):e.text===`\\prime`?new Z(`mo`,[n]):new Z(`mi`,[n]);return r!==Mf[i.type]&&i.setAttribute(`mathvariant`,r),i}});var Nf={"\\nobreak":`nobreak`,"\\allowbreak":`allowbreak`},Pf={" ":{},"\\ ":{},"~":{className:`nobreak`},"\\space":{},"\\nobreakspace":{className:`nobreak`}};Yl({type:`spacing`,htmlBuilder(e,t){if(Pf.hasOwnProperty(e.text)){var n=Pf[e.text].className||``;if(e.mode===`text`){var r=Dl(e,t,`textord`);return r.classes.push(n),r}else return q([`mspace`,n],[Tl(e.text,e.mode,t)],t)}else if(Nf.hasOwnProperty(e.text))return q([`mspace`,Nf[e.text]],[],t);else throw new P(`Unknown type of space "`+e.text+`"`)},mathmlBuilder(e,t){var n;if(Pf.hasOwnProperty(e.text))n=new Z(`mtext`,[new fu(`\xA0`)]);else if(Nf.hasOwnProperty(e.text))return new Z(`mspace`);else throw new P(`Unknown type of space "`+e.text+`"`);return n}});var Ff=()=>{var e=new Z(`mtd`,[]);return e.setAttribute(`width`,`50%`),e};Yl({type:`tag`,mathmlBuilder(e,t){var n=new Z(`mtable`,[new Z(`mtr`,[Ff(),new Z(`mtd`,[Su(e.body,t)]),Ff(),new Z(`mtd`,[Su(e.tag,t)])])]);return n.setAttribute(`width`,`100%`),n}});var If={"\\text":void 0,"\\textrm":`textrm`,"\\textsf":`textsf`,"\\texttt":`texttt`,"\\textnormal":`textrm`},Lf={"\\textbf":`textbf`,"\\textmd":`textmd`},Rf={"\\textit":`textit`,"\\textup":`textup`},zf=(e,t)=>{var n=e.font;return n?If[n]?t.withTextFontFamily(If[n]):Lf[n]?t.withTextFontWeight(Lf[n]):n===`\\emph`?t.fontShape===`textit`?t.withTextFontShape(`textup`):t.withTextFontShape(`textit`):t.withTextFontShape(Rf[n]):t};X({type:`text`,names:[`\\text`,`\\textrm`,`\\textsf`,`\\texttt`,`\\textnormal`,`\\textbf`,`\\textmd`,`\\textit`,`\\textup`,`\\emph`],props:{numArgs:1,argTypes:[`text`],allowedInArgument:!0,allowedInText:!0},handler(e,t){var{parser:n,funcName:r}=e,i=t[0];return{type:`text`,mode:n.mode,body:Zl(i),font:r}},htmlBuilder(e,t){var n=zf(e,t);return q([`mord`,`text`],nu(e.body,n,!0),n)},mathmlBuilder(e,t){var n=zf(e,t);return Su(e.body,n)}}),X({type:`underline`,names:[`\\underline`],props:{numArgs:1,allowedInText:!0},handler(e,t){var{parser:n}=e;return{type:`underline`,mode:n.mode,body:t[0]}},htmlBuilder(e,t){var n=cu(e.body,t),r=Ml(`underline-line`,t),i=t.fontMetrics().defaultRuleThickness;return q([`mord`,`underline`],[J({positionType:`top`,positionData:n.height,children:[{type:`kern`,size:i},{type:`elem`,elem:r},{type:`kern`,size:3*i},{type:`elem`,elem:n}]})],t)},mathmlBuilder(e,t){var n=new Z(`mo`,[new fu(`‾`)]);n.setAttribute(`stretchy`,`true`);var r=new Z(`munder`,[Cu(e.body,t),n]);return r.setAttribute(`accentunder`,`true`),r}}),X({type:`vcenter`,names:[`\\vcenter`],props:{numArgs:1,argTypes:[`original`],allowedInText:!1},handler(e,t){var{parser:n}=e;return{type:`vcenter`,mode:n.mode,body:t[0]}},htmlBuilder(e,t){var n=cu(e.body,t),r=t.fontMetrics().axisHeight;return J({positionType:`shift`,positionData:.5*(n.height-r-(n.depth+r)),children:[{type:`elem`,elem:n}]})},mathmlBuilder(e,t){return new Z(`mrow`,[new Z(`mpadded`,[Cu(e.body,t)],[`vcenter`])])}}),X({type:`verb`,names:[`\\verb`],props:{numArgs:0,allowedInText:!0},handler(e,t,n){throw new P(`\\verb ended by end of line instead of matching delimiter`)},htmlBuilder(e,t){for(var n=Bf(e),r=[],i=t.havingStyle(t.style.text()),a=0;a<n.length;a++){var o=n[a];o===`~`&&(o=`\\textasciitilde`),r.push(wl(o,`Typewriter-Regular`,e.mode,i,[`mord`,`texttt`]))}return q([`mord`,`text`].concat(i.sizingClasses(t)),kl(r),i)},mathmlBuilder(e,t){var n=new Z(`mtext`,[new fu(Bf(e))]);return n.setAttribute(`mathvariant`,`monospace`),n}});var Bf=e=>e.body.replace(/ /g,e.star?`␣`:`\xA0`),Vf=Kl,Hf=`[ \r
	]`,Uf=`\\\\[a-zA-Z@]+`,Wf=`\\\\[^\ud800-\udfff]`,Gf=`(`+Uf+`)`+Hf+`*`,Kf=`\\\\(
|[ \r	]+
?)[ \r	]*`,qf=`[̀-ͯ]`,Jf=RegExp(qf+`+$`),Yf=`(`+Hf+`+)|`+(Kf+`|`)+`([!-\\[\\]-‧‪-퟿豈-￿]`+(qf+`*`)+`|[\ud800-\udbff][\udc00-\udfff]`+(qf+`*`)+`|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5`+(`|`+Gf)+(`|`+Wf+`)`),Xf=class{constructor(e,t){this.input=void 0,this.settings=void 0,this.tokenRegex=void 0,this.catcodes=void 0,this.input=e,this.settings=t,this.tokenRegex=new RegExp(Yf,`g`),this.catcodes={"%":14,"~":13}}setCatcode(e,t){this.catcodes[e]=t}lex(){var e=this.input,t=this.tokenRegex.lastIndex;if(t===e.length)return new Xd(`EOF`,new Yd(this,t,t));var n=this.tokenRegex.exec(e);if(n===null||n.index!==t)throw new P(`Unexpected character: '`+e[t]+`'`,new Xd(e[t],new Yd(this,t,t+1)));var r=n[6]||n[3]||(n[2]?`\\ `:` `);if(this.catcodes[r]===14){var i=e.indexOf(`
`,this.tokenRegex.lastIndex);return i===-1?(this.tokenRegex.lastIndex=e.length,this.settings.reportNonstrict(`commentAtEnd`,`% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)`)):this.tokenRegex.lastIndex=i+1,this.lex()}return new Xd(r,new Yd(this,t,this.tokenRegex.lastIndex))}},Zf=class{constructor(e,t){e===void 0&&(e={}),t===void 0&&(t={}),this.current=void 0,this.builtins=void 0,this.undefStack=void 0,this.current=t,this.builtins=e,this.undefStack=[]}beginGroup(){this.undefStack.push({})}endGroup(){if(this.undefStack.length===0)throw new P(`Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug`);var e=this.undefStack.pop();for(var t in e)e.hasOwnProperty(t)&&(e[t]==null?delete this.current[t]:this.current[t]=e[t])}endGroups(){for(;this.undefStack.length>0;)this.endGroup()}has(e){return this.current.hasOwnProperty(e)||this.builtins.hasOwnProperty(e)}get(e){return this.current.hasOwnProperty(e)?this.current[e]:this.builtins[e]}set(e,t,n){if(n===void 0&&(n=!1),n){for(var r=0;r<this.undefStack.length;r++)delete this.undefStack[r][e];this.undefStack.length>0&&(this.undefStack[this.undefStack.length-1][e]=t)}else{var i=this.undefStack[this.undefStack.length-1];i&&!i.hasOwnProperty(e)&&(i[e]=this.current[e])}t==null?delete this.current[e]:this.current[e]=t}},Qf=Jd;$(`\\noexpand`,function(e){var t=e.popToken();return e.isExpandable(t.text)&&(t.noexpand=!0,t.treatAsRelax=!0),{tokens:[t],numArgs:0}}),$(`\\expandafter`,function(e){var t=e.popToken();return e.expandOnce(!0),{tokens:[t],numArgs:0}}),$(`\\@firstoftwo`,function(e){return{tokens:e.consumeArgs(2)[0],numArgs:0}}),$(`\\@secondoftwo`,function(e){return{tokens:e.consumeArgs(2)[1],numArgs:0}}),$(`\\@ifnextchar`,function(e){var t=e.consumeArgs(3);e.consumeSpaces();var n=e.future();return t[0].length===1&&t[0][0].text===n.text?{tokens:t[1],numArgs:0}:{tokens:t[2],numArgs:0}}),$(`\\@ifstar`,`\\@ifnextchar *{\\@firstoftwo{#1}}`),$(`\\TextOrMath`,function(e){var t=e.consumeArgs(2);return e.mode===`text`?{tokens:t[0],numArgs:0}:{tokens:t[1],numArgs:0}});var $f={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,a:10,A:10,b:11,B:11,c:12,C:12,d:13,D:13,e:14,E:14,f:15,F:15};$(`\\char`,function(e){var t=e.popToken(),n,r=0;if(t.text===`'`)n=8,t=e.popToken();else if(t.text===`"`)n=16,t=e.popToken();else if(t.text==="`")if(t=e.popToken(),t.text[0]===`\\`)r=t.text.charCodeAt(1);else if(t.text===`EOF`)throw new P("\\char` missing argument");else r=t.text.charCodeAt(0);else n=10;if(n){if(r=$f[t.text],r==null||r>=n)throw new P(`Invalid base-`+n+` digit `+t.text);for(var i;(i=$f[e.future().text])!=null&&i<n;)r*=n,r+=i,e.popToken()}return`\\@char{`+r+`}`});var ep=(e,t,n,r)=>{var i=e.consumeArg().tokens;if(i.length!==1)throw new P(`\\newcommand's first argument must be a macro name`);var a=i[0].text,o=e.isDefined(a);if(o&&!t)throw new P(`\\newcommand{`+a+`} attempting to redefine `+(a+`; use \\renewcommand`));if(!o&&!n)throw new P(`\\renewcommand{`+a+`} when command `+a+` does not yet exist; use \\newcommand`);var s=0;if(i=e.consumeArg().tokens,i.length===1&&i[0].text===`[`){for(var c=``,l=e.expandNextToken();l.text!==`]`&&l.text!==`EOF`;)c+=l.text,l=e.expandNextToken();if(!c.match(/^\s*[0-9]+\s*$/))throw new P(`Invalid number of arguments: `+c);s=parseInt(c),i=e.consumeArg().tokens}return o&&r||e.macros.set(a,{tokens:i,numArgs:s}),``};$(`\\newcommand`,e=>ep(e,!1,!0,!1)),$(`\\renewcommand`,e=>ep(e,!0,!1,!1)),$(`\\providecommand`,e=>ep(e,!0,!0,!0)),$(`\\message`,e=>{var t=e.consumeArgs(1)[0];return console.log(t.reverse().map(e=>e.text).join(``)),``}),$(`\\errmessage`,e=>{var t=e.consumeArgs(1)[0];return console.error(t.reverse().map(e=>e.text).join(``)),``}),$(`\\show`,e=>{var t=e.popToken(),n=t.text;return console.log(t,e.macros.get(n),Vf[n],Lc.math[n],Lc.text[n]),``}),$(`\\bgroup`,`{`),$(`\\egroup`,`}`),$(`~`,`\\nobreakspace`),$(`\\lq`,"`"),$(`\\rq`,`'`),$(`\\aa`,`\\r a`),$(`\\AA`,`\\r A`),$(`\\textcopyright`,"\\html@mathml{\\textcircled{c}}{\\char`©}"),$(`\\copyright`,`\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}`),$(`\\textregistered`,"\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`®}"),$(`ℬ`,`\\mathscr{B}`),$(`ℰ`,`\\mathscr{E}`),$(`ℱ`,`\\mathscr{F}`),$(`ℋ`,`\\mathscr{H}`),$(`ℐ`,`\\mathscr{I}`),$(`ℒ`,`\\mathscr{L}`),$(`ℳ`,`\\mathscr{M}`),$(`ℛ`,`\\mathscr{R}`),$(`ℭ`,`\\mathfrak{C}`),$(`ℌ`,`\\mathfrak{H}`),$(`ℨ`,`\\mathfrak{Z}`),$(`\\Bbbk`,`\\Bbb{k}`),$(`\\llap`,`\\mathllap{\\textrm{#1}}`),$(`\\rlap`,`\\mathrlap{\\textrm{#1}}`),$(`\\clap`,`\\mathclap{\\textrm{#1}}`),$(`\\mathstrut`,`\\vphantom{(}`),$(`\\underbar`,`\\underline{\\text{#1}}`),$(`\\not`,`\\html@mathml{\\mathrel{\\mathrlap\\@not}\\nobreak}{\\char"338}`),$(`\\neq`,"\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`≠}}"),$(`\\ne`,`\\neq`),$(`≠`,`\\neq`),$(`\\notin`,"\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`∉}}"),$(`∉`,`\\notin`),$(`≘`,"\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`≘}}"),$(`≙`,"\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`≘}}"),$(`≚`,"\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`≚}}"),$(`≛`,"\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`≛}}"),$(`≝`,"\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`≝}}"),$(`≞`,"\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`≞}}"),$(`≟`,"\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`≟}}"),$(`⟂`,`\\perp`),$(`‼`,`\\mathclose{!\\mkern-0.8mu!}`),$(`∌`,`\\notni`),$(`⌜`,`\\ulcorner`),$(`⌝`,`\\urcorner`),$(`⌞`,`\\llcorner`),$(`⌟`,`\\lrcorner`),$(`©`,`\\copyright`),$(`®`,`\\textregistered`),$(`\\ulcorner`,`\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}`),$(`\\urcorner`,`\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}`),$(`\\llcorner`,`\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}`),$(`\\lrcorner`,`\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}`),$(`\\vdots`,`{\\varvdots\\rule{0pt}{15pt}}`),$(`⋮`,`\\vdots`),$(`\\varGamma`,`\\mathit{\\Gamma}`),$(`\\varDelta`,`\\mathit{\\Delta}`),$(`\\varTheta`,`\\mathit{\\Theta}`),$(`\\varLambda`,`\\mathit{\\Lambda}`),$(`\\varXi`,`\\mathit{\\Xi}`),$(`\\varPi`,`\\mathit{\\Pi}`),$(`\\varSigma`,`\\mathit{\\Sigma}`),$(`\\varUpsilon`,`\\mathit{\\Upsilon}`),$(`\\varPhi`,`\\mathit{\\Phi}`),$(`\\varPsi`,`\\mathit{\\Psi}`),$(`\\varOmega`,`\\mathit{\\Omega}`),$(`\\substack`,`\\begin{subarray}{c}#1\\end{subarray}`),$(`\\colon`,`\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax`),$(`\\boxed`,`\\fbox{$\\displaystyle{#1}$}`),$(`\\iff`,`\\DOTSB\\;\\Longleftrightarrow\\;`),$(`\\implies`,`\\DOTSB\\;\\Longrightarrow\\;`),$(`\\impliedby`,`\\DOTSB\\;\\Longleftarrow\\;`),$(`\\dddot`,`{\\overset{\\raisebox{-0.1ex}{\\normalsize ...}}{#1}}`),$(`\\ddddot`,`{\\overset{\\raisebox{-0.1ex}{\\normalsize ....}}{#1}}`);var tp={",":`\\dotsc`,"\\not":`\\dotsb`,"+":`\\dotsb`,"=":`\\dotsb`,"<":`\\dotsb`,">":`\\dotsb`,"-":`\\dotsb`,"*":`\\dotsb`,":":`\\dotsb`,"\\DOTSB":`\\dotsb`,"\\coprod":`\\dotsb`,"\\bigvee":`\\dotsb`,"\\bigwedge":`\\dotsb`,"\\biguplus":`\\dotsb`,"\\bigcap":`\\dotsb`,"\\bigcup":`\\dotsb`,"\\prod":`\\dotsb`,"\\sum":`\\dotsb`,"\\bigotimes":`\\dotsb`,"\\bigoplus":`\\dotsb`,"\\bigodot":`\\dotsb`,"\\bigsqcup":`\\dotsb`,"\\And":`\\dotsb`,"\\longrightarrow":`\\dotsb`,"\\Longrightarrow":`\\dotsb`,"\\longleftarrow":`\\dotsb`,"\\Longleftarrow":`\\dotsb`,"\\longleftrightarrow":`\\dotsb`,"\\Longleftrightarrow":`\\dotsb`,"\\mapsto":`\\dotsb`,"\\longmapsto":`\\dotsb`,"\\hookrightarrow":`\\dotsb`,"\\doteq":`\\dotsb`,"\\mathbin":`\\dotsb`,"\\mathrel":`\\dotsb`,"\\relbar":`\\dotsb`,"\\Relbar":`\\dotsb`,"\\xrightarrow":`\\dotsb`,"\\xleftarrow":`\\dotsb`,"\\DOTSI":`\\dotsi`,"\\int":`\\dotsi`,"\\oint":`\\dotsi`,"\\iint":`\\dotsi`,"\\iiint":`\\dotsi`,"\\iiiint":`\\dotsi`,"\\idotsint":`\\dotsi`,"\\DOTSX":`\\dotsx`},np=new Set([`bin`,`rel`]);$(`\\dots`,function(e){var t=`\\dotso`,n=e.expandAfterFuture().text;return n in tp?t=tp[n]:(n.slice(0,4)===`\\not`||n in Lc.math&&np.has(Lc.math[n].group))&&(t=`\\dotsb`),t});var rp={")":!0,"]":!0,"\\rbrack":!0,"\\}":!0,"\\rbrace":!0,"\\rangle":!0,"\\rceil":!0,"\\rfloor":!0,"\\rgroup":!0,"\\rmoustache":!0,"\\right":!0,"\\bigr":!0,"\\biggr":!0,"\\Bigr":!0,"\\Biggr":!0,$:!0,";":!0,".":!0,",":!0};$(`\\dotso`,function(e){return e.future().text in rp?`\\ldots\\,`:`\\ldots`}),$(`\\dotsc`,function(e){var t=e.future().text;return t in rp&&t!==`,`?`\\ldots\\,`:`\\ldots`}),$(`\\cdots`,function(e){return e.future().text in rp?`\\@cdots\\,`:`\\@cdots`}),$(`\\dotsb`,`\\cdots`),$(`\\dotsm`,`\\cdots`),$(`\\dotsi`,`\\!\\cdots`),$(`\\dotsx`,`\\ldots\\,`),$(`\\DOTSI`,`\\relax`),$(`\\DOTSB`,`\\relax`),$(`\\DOTSX`,`\\relax`),$(`\\tmspace`,`\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax`),$(`\\,`,`\\tmspace+{3mu}{.1667em}`),$(`\\thinspace`,`\\,`),$(`\\>`,`\\mskip{4mu}`),$(`\\:`,`\\tmspace+{4mu}{.2222em}`),$(`\\medspace`,`\\:`),$(`\\;`,`\\tmspace+{5mu}{.2777em}`),$(`\\thickspace`,`\\;`),$(`\\!`,`\\tmspace-{3mu}{.1667em}`),$(`\\negthinspace`,`\\!`),$(`\\negmedspace`,`\\tmspace-{4mu}{.2222em}`),$(`\\negthickspace`,`\\tmspace-{5mu}{.277em}`),$(`\\enspace`,`\\kern.5em `),$(`\\enskip`,`\\hskip.5em\\relax`),$(`\\quad`,`\\hskip1em\\relax`),$(`\\qquad`,`\\hskip2em\\relax`),$(`\\tag`,`\\@ifstar\\tag@literal\\tag@paren`),$(`\\tag@paren`,`\\tag@literal{({#1})}`),$(`\\tag@literal`,e=>{if(e.macros.get(`\\df@tag`))throw new P(`Multiple \\tag`);return`\\gdef\\df@tag{\\text{#1}}`}),$(`\\bmod`,`\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}`),$(`\\pod`,`\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)`),$(`\\pmod`,`\\pod{{\\rm mod}\\mkern6mu#1}`),$(`\\mod`,`\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1`),$(`\\newline`,`\\\\\\relax`),$(`\\TeX`,`\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}`);var ip=I(Ac[`Main-Regular`][84][1]-.7*Ac[`Main-Regular`][65][1]);$(`\\LaTeX`,`\\textrm{\\html@mathml{`+(`L\\kern-.36em\\raisebox{`+ip+`}{\\scriptstyle A}`)+`\\kern-.15em\\TeX}{LaTeX}}`),$(`\\KaTeX`,`\\textrm{\\html@mathml{`+(`K\\kern-.17em\\raisebox{`+ip+`}{\\scriptstyle A}`)+`\\kern-.15em\\TeX}{KaTeX}}`),$(`\\hspace`,`\\@ifstar\\@hspacer\\@hspace`),$(`\\@hspace`,`\\hskip #1\\relax`),$(`\\@hspacer`,`\\rule{0pt}{0pt}\\hskip #1\\relax`),$(`\\ordinarycolon`,`:`),$(`\\vcentcolon`,`\\mathrel{\\mathop\\ordinarycolon}`),$(`\\dblcolon`,`\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}`),$(`\\coloneqq`,`\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}`),$(`\\Coloneqq`,`\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}`),$(`\\coloneq`,`\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}`),$(`\\Coloneq`,`\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}`),$(`\\eqqcolon`,`\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}`),$(`\\Eqqcolon`,`\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}`),$(`\\eqcolon`,`\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}`),$(`\\Eqcolon`,`\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}`),$(`\\colonapprox`,`\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}`),$(`\\Colonapprox`,`\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}`),$(`\\colonsim`,`\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}`),$(`\\Colonsim`,`\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}`),$(`∷`,`\\dblcolon`),$(`∹`,`\\eqcolon`),$(`≔`,`\\coloneqq`),$(`≕`,`\\eqqcolon`),$(`⩴`,`\\Coloneqq`),$(`\\ratio`,`\\vcentcolon`),$(`\\coloncolon`,`\\dblcolon`),$(`\\colonequals`,`\\coloneqq`),$(`\\coloncolonequals`,`\\Coloneqq`),$(`\\equalscolon`,`\\eqqcolon`),$(`\\equalscoloncolon`,`\\Eqqcolon`),$(`\\colonminus`,`\\coloneq`),$(`\\coloncolonminus`,`\\Coloneq`),$(`\\minuscolon`,`\\eqcolon`),$(`\\minuscoloncolon`,`\\Eqcolon`),$(`\\coloncolonapprox`,`\\Colonapprox`),$(`\\coloncolonsim`,`\\Colonsim`),$(`\\simcolon`,`\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}`),$(`\\simcoloncolon`,`\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}`),$(`\\approxcolon`,`\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}`),$(`\\approxcoloncolon`,`\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}`),$(`\\notni`,"\\html@mathml{\\not\\ni}{\\mathrel{\\char`∌}}"),$(`\\limsup`,`\\DOTSB\\operatorname*{lim\\,sup}`),$(`\\liminf`,`\\DOTSB\\operatorname*{lim\\,inf}`),$(`\\injlim`,`\\DOTSB\\operatorname*{inj\\,lim}`),$(`\\projlim`,`\\DOTSB\\operatorname*{proj\\,lim}`),$(`\\varlimsup`,`\\DOTSB\\operatorname*{\\overline{lim}}`),$(`\\varliminf`,`\\DOTSB\\operatorname*{\\underline{lim}}`),$(`\\varinjlim`,`\\DOTSB\\operatorname*{\\underrightarrow{lim}}`),$(`\\varprojlim`,`\\DOTSB\\operatorname*{\\underleftarrow{lim}}`),$(`\\gvertneqq`,`\\html@mathml{\\@gvertneqq}{≩}`),$(`\\lvertneqq`,`\\html@mathml{\\@lvertneqq}{≨}`),$(`\\ngeqq`,`\\html@mathml{\\@ngeqq}{≱}`),$(`\\ngeqslant`,`\\html@mathml{\\@ngeqslant}{≱}`),$(`\\nleqq`,`\\html@mathml{\\@nleqq}{≰}`),$(`\\nleqslant`,`\\html@mathml{\\@nleqslant}{≰}`),$(`\\nshortmid`,`\\html@mathml{\\@nshortmid}{∤}`),$(`\\nshortparallel`,`\\html@mathml{\\@nshortparallel}{∦}`),$(`\\nsubseteqq`,`\\html@mathml{\\@nsubseteqq}{⊈}`),$(`\\nsupseteqq`,`\\html@mathml{\\@nsupseteqq}{⊉}`),$(`\\varsubsetneq`,`\\html@mathml{\\@varsubsetneq}{⊊}`),$(`\\varsubsetneqq`,`\\html@mathml{\\@varsubsetneqq}{⫋}`),$(`\\varsupsetneq`,`\\html@mathml{\\@varsupsetneq}{⊋}`),$(`\\varsupsetneqq`,`\\html@mathml{\\@varsupsetneqq}{⫌}`),$(`\\imath`,`\\html@mathml{\\@imath}{ı}`),$(`\\jmath`,`\\html@mathml{\\@jmath}{ȷ}`),$(`\\llbracket`,"\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`⟦}}"),$(`\\rrbracket`,"\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`⟧}}"),$(`⟦`,`\\llbracket`),$(`⟧`,`\\rrbracket`),$(`\\lBrace`,"\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`⦃}}"),$(`\\rBrace`,"\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`⦄}}"),$(`⦃`,`\\lBrace`),$(`⦄`,`\\rBrace`),$(`\\minuso`,"\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`⦵}}"),$(`⦵`,`\\minuso`),$(`\\darr`,`\\downarrow`),$(`\\dArr`,`\\Downarrow`),$(`\\Darr`,`\\Downarrow`),$(`\\lang`,`\\langle`),$(`\\rang`,`\\rangle`),$(`\\uarr`,`\\uparrow`),$(`\\uArr`,`\\Uparrow`),$(`\\Uarr`,`\\Uparrow`),$(`\\N`,`\\mathbb{N}`),$(`\\R`,`\\mathbb{R}`),$(`\\Z`,`\\mathbb{Z}`),$(`\\alef`,`\\aleph`),$(`\\alefsym`,`\\aleph`),$(`\\Alpha`,`\\mathrm{A}`),$(`\\Beta`,`\\mathrm{B}`),$(`\\bull`,`\\bullet`),$(`\\Chi`,`\\mathrm{X}`),$(`\\clubs`,`\\clubsuit`),$(`\\cnums`,`\\mathbb{C}`),$(`\\Complex`,`\\mathbb{C}`),$(`\\Dagger`,`\\ddagger`),$(`\\diamonds`,`\\diamondsuit`),$(`\\empty`,`\\emptyset`),$(`\\Epsilon`,`\\mathrm{E}`),$(`\\Eta`,`\\mathrm{H}`),$(`\\exist`,`\\exists`),$(`\\harr`,`\\leftrightarrow`),$(`\\hArr`,`\\Leftrightarrow`),$(`\\Harr`,`\\Leftrightarrow`),$(`\\hearts`,`\\heartsuit`),$(`\\image`,`\\Im`),$(`\\infin`,`\\infty`),$(`\\Iota`,`\\mathrm{I}`),$(`\\isin`,`\\in`),$(`\\Kappa`,`\\mathrm{K}`),$(`\\larr`,`\\leftarrow`),$(`\\lArr`,`\\Leftarrow`),$(`\\Larr`,`\\Leftarrow`),$(`\\lrarr`,`\\leftrightarrow`),$(`\\lrArr`,`\\Leftrightarrow`),$(`\\Lrarr`,`\\Leftrightarrow`),$(`\\Mu`,`\\mathrm{M}`),$(`\\natnums`,`\\mathbb{N}`),$(`\\Nu`,`\\mathrm{N}`),$(`\\Omicron`,`\\mathrm{O}`),$(`\\plusmn`,`\\pm`),$(`\\rarr`,`\\rightarrow`),$(`\\rArr`,`\\Rightarrow`),$(`\\Rarr`,`\\Rightarrow`),$(`\\real`,`\\Re`),$(`\\reals`,`\\mathbb{R}`),$(`\\Reals`,`\\mathbb{R}`),$(`\\Rho`,`\\mathrm{P}`),$(`\\sdot`,`\\cdot`),$(`\\sect`,`\\S`),$(`\\spades`,`\\spadesuit`),$(`\\sub`,`\\subset`),$(`\\sube`,`\\subseteq`),$(`\\supe`,`\\supseteq`),$(`\\Tau`,`\\mathrm{T}`),$(`\\thetasym`,`\\vartheta`),$(`\\weierp`,`\\wp`),$(`\\Zeta`,`\\mathrm{Z}`),$(`\\argmin`,`\\DOTSB\\operatorname*{arg\\,min}`),$(`\\argmax`,`\\DOTSB\\operatorname*{arg\\,max}`),$(`\\plim`,`\\DOTSB\\mathop{\\operatorname{plim}}\\limits`),$(`\\bra`,`\\mathinner{\\langle{#1}|}`),$(`\\ket`,`\\mathinner{|{#1}\\rangle}`),$(`\\braket`,`\\mathinner{\\langle{#1}\\rangle}`),$(`\\Bra`,`\\left\\langle#1\\right|`),$(`\\Ket`,`\\left|#1\\right\\rangle`);var ap=e=>t=>{var n=t.consumeArg().tokens,r=t.consumeArg().tokens,i=t.consumeArg().tokens,a=t.consumeArg().tokens,o=t.macros.get(`|`),s=t.macros.get(`\\|`);t.macros.beginGroup();var c=t=>n=>{e&&(n.macros.set(`|`,o),i.length&&n.macros.set(`\\|`,s));var a=t;return!t&&i.length&&n.future().text===`|`&&(n.popToken(),a=!0),{tokens:a?i:r,numArgs:0}};t.macros.set(`|`,c(!1)),i.length&&t.macros.set(`\\|`,c(!0));var l=t.consumeArg().tokens,u=t.expandTokens([...a,...l,...n]);return t.macros.endGroup(),{tokens:u.reverse(),numArgs:0}};$(`\\bra@ket`,ap(!1)),$(`\\bra@set`,ap(!0)),$(`\\Braket`,`\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}`),$(`\\Set`,`\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}`),$(`\\set`,`\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}`),$(`\\angln`,`{\\angl n}`),$(`\\blue`,`\\textcolor{##6495ed}{#1}`),$(`\\orange`,`\\textcolor{##ffa500}{#1}`),$(`\\pink`,`\\textcolor{##ff00af}{#1}`),$(`\\red`,`\\textcolor{##df0030}{#1}`),$(`\\green`,`\\textcolor{##28ae7b}{#1}`),$(`\\gray`,`\\textcolor{gray}{#1}`),$(`\\purple`,`\\textcolor{##9d38bd}{#1}`),$(`\\blueA`,`\\textcolor{##ccfaff}{#1}`),$(`\\blueB`,`\\textcolor{##80f6ff}{#1}`),$(`\\blueC`,`\\textcolor{##63d9ea}{#1}`),$(`\\blueD`,`\\textcolor{##11accd}{#1}`),$(`\\blueE`,`\\textcolor{##0c7f99}{#1}`),$(`\\tealA`,`\\textcolor{##94fff5}{#1}`),$(`\\tealB`,`\\textcolor{##26edd5}{#1}`),$(`\\tealC`,`\\textcolor{##01d1c1}{#1}`),$(`\\tealD`,`\\textcolor{##01a995}{#1}`),$(`\\tealE`,`\\textcolor{##208170}{#1}`),$(`\\greenA`,`\\textcolor{##b6ffb0}{#1}`),$(`\\greenB`,`\\textcolor{##8af281}{#1}`),$(`\\greenC`,`\\textcolor{##74cf70}{#1}`),$(`\\greenD`,`\\textcolor{##1fab54}{#1}`),$(`\\greenE`,`\\textcolor{##0d923f}{#1}`),$(`\\goldA`,`\\textcolor{##ffd0a9}{#1}`),$(`\\goldB`,`\\textcolor{##ffbb71}{#1}`),$(`\\goldC`,`\\textcolor{##ff9c39}{#1}`),$(`\\goldD`,`\\textcolor{##e07d10}{#1}`),$(`\\goldE`,`\\textcolor{##a75a05}{#1}`),$(`\\redA`,`\\textcolor{##fca9a9}{#1}`),$(`\\redB`,`\\textcolor{##ff8482}{#1}`),$(`\\redC`,`\\textcolor{##f9685d}{#1}`),$(`\\redD`,`\\textcolor{##e84d39}{#1}`),$(`\\redE`,`\\textcolor{##bc2612}{#1}`),$(`\\maroonA`,`\\textcolor{##ffbde0}{#1}`),$(`\\maroonB`,`\\textcolor{##ff92c6}{#1}`),$(`\\maroonC`,`\\textcolor{##ed5fa6}{#1}`),$(`\\maroonD`,`\\textcolor{##ca337c}{#1}`),$(`\\maroonE`,`\\textcolor{##9e034e}{#1}`),$(`\\purpleA`,`\\textcolor{##ddd7ff}{#1}`),$(`\\purpleB`,`\\textcolor{##c6b9fc}{#1}`),$(`\\purpleC`,`\\textcolor{##aa87ff}{#1}`),$(`\\purpleD`,`\\textcolor{##7854ab}{#1}`),$(`\\purpleE`,`\\textcolor{##543b78}{#1}`),$(`\\mintA`,`\\textcolor{##f5f9e8}{#1}`),$(`\\mintB`,`\\textcolor{##edf2df}{#1}`),$(`\\mintC`,`\\textcolor{##e0e5cc}{#1}`),$(`\\grayA`,`\\textcolor{##f6f7f7}{#1}`),$(`\\grayB`,`\\textcolor{##f0f1f2}{#1}`),$(`\\grayC`,`\\textcolor{##e3e5e6}{#1}`),$(`\\grayD`,`\\textcolor{##d6d8da}{#1}`),$(`\\grayE`,`\\textcolor{##babec2}{#1}`),$(`\\grayF`,`\\textcolor{##888d93}{#1}`),$(`\\grayG`,`\\textcolor{##626569}{#1}`),$(`\\grayH`,`\\textcolor{##3b3e40}{#1}`),$(`\\grayI`,`\\textcolor{##21242c}{#1}`),$(`\\kaBlue`,`\\textcolor{##314453}{#1}`),$(`\\kaGreen`,`\\textcolor{##71B307}{#1}`);var op={"^":!0,_:!0,"\\limits":!0,"\\nolimits":!0},sp=class{constructor(e,t,n){this.settings=void 0,this.expansionCount=void 0,this.lexer=void 0,this.macros=void 0,this.stack=void 0,this.mode=void 0,this.settings=t,this.expansionCount=0,this.feed(e),this.macros=new Zf(Qf,t.macros),this.mode=n,this.stack=[]}feed(e){this.lexer=new Xf(e,this.settings)}switchMode(e){this.mode=e}beginGroup(){this.macros.beginGroup()}endGroup(){this.macros.endGroup()}endGroups(){this.macros.endGroups()}future(){return this.stack.length===0&&this.pushToken(this.lexer.lex()),this.stack[this.stack.length-1]}popToken(){return this.future(),this.stack.pop()}pushToken(e){this.stack.push(e)}pushTokens(e){this.stack.push(...e)}scanArgument(e){var t,n,r;if(e){if(this.consumeSpaces(),this.future().text!==`[`)return null;t=this.popToken(),{tokens:r,end:n}=this.consumeArg([`]`])}else ({tokens:r,start:t,end:n}=this.consumeArg());return this.pushToken(new Xd(`EOF`,n.loc)),this.pushTokens(r),new Xd(``,Yd.range(t,n))}consumeSpaces(){for(;this.future().text===` `;)this.stack.pop()}consumeArg(e){var t=[],n=e&&e.length>0;n||this.consumeSpaces();var r=this.future(),i,a=0,o=0;do{if(i=this.popToken(),t.push(i),i.text===`{`)++a;else if(i.text===`}`){if(--a,a===-1)throw new P(`Extra }`,i)}else if(i.text===`EOF`)throw new P(`Unexpected end of input in a macro argument, expected '`+(e&&n?e[o]:`}`)+`'`,i);if(e&&n)if((a===0||a===1&&e[o]===`{`)&&i.text===e[o]){if(++o,o===e.length){t.splice(-o,o);break}}else o=0}while(a!==0||n);return r.text===`{`&&t[t.length-1].text===`}`&&(t.pop(),t.shift()),t.reverse(),{tokens:t,start:r,end:i}}consumeArgs(e,t){if(t){if(t.length!==e+1)throw new P(`The length of delimiters doesn't match the number of args!`);for(var n=t[0],r=0;r<n.length;r++){var i=this.popToken();if(n[r]!==i.text)throw new P(`Use of the macro doesn't match its definition`,i)}}for(var a=[],o=0;o<e;o++)a.push(this.consumeArg(t&&t[o+1]).tokens);return a}countExpansion(e){if(this.expansionCount+=e,this.expansionCount>this.settings.maxExpand)throw new P(`Too many expansions: infinite loop or need to increase maxExpand setting`)}expandOnce(e){var t=this.popToken(),n=t.text,r=t.noexpand?null:this._getExpansion(n);if(r==null||e&&r.unexpandable){if(e&&r==null&&n[0]===`\\`&&!this.isDefined(n))throw new P(`Undefined control sequence: `+n);return this.pushToken(t),!1}this.countExpansion(1);var i=r.tokens,a=this.consumeArgs(r.numArgs,r.delimiters);if(r.numArgs){i=i.slice();for(var o=i.length-1;o>=0;--o){var s=i[o];if(s.text===`#`){if(o===0)throw new P(`Incomplete placeholder at end of macro body`,s);if(s=i[--o],s.text===`#`)i.splice(o+1,1);else if(/^[1-9]$/.test(s.text))i.splice(o,2,...a[s.text-1]);else throw new P(`Not a valid argument number`,s)}}}return this.pushTokens(i),i.length}expandAfterFuture(){return this.expandOnce(),this.future()}expandNextToken(){for(;;)if(this.expandOnce()===!1){var e=this.stack.pop();return e.treatAsRelax&&(e.text=`\\relax`),e}}expandMacro(e){return this.macros.has(e)?this.expandTokens([new Xd(e)]):void 0}expandTokens(e){var t=[],n=this.stack.length;for(this.pushTokens(e);this.stack.length>n;)if(this.expandOnce(!0)===!1){var r=this.stack.pop();r.treatAsRelax&&=(r.noexpand=!1,!1),t.push(r)}return this.countExpansion(t.length),t}expandMacroAsText(e){var t=this.expandMacro(e);return t&&t.map(e=>e.text).join(``)}_getExpansion(e){var t=this.macros.get(e);if(t==null)return t;if(e.length===1){var n=this.lexer.catcodes[e];if(n!=null&&n!==13)return}var r=typeof t==`function`?t(this):t;if(typeof r==`string`){var i=0;if(r.includes(`#`))for(var a=r.replace(/##/g,``);a.includes(`#`+(i+1));)++i;for(var o=new Xf(r,this.settings),s=[],c=o.lex();c.text!==`EOF`;)s.push(c),c=o.lex();return s.reverse(),{tokens:s,numArgs:i}}return r}isDefined(e){return this.macros.has(e)||Vf.hasOwnProperty(e)||Lc.math.hasOwnProperty(e)||Lc.text.hasOwnProperty(e)||op.hasOwnProperty(e)}isExpandable(e){var t=this.macros.get(e);return t==null?Vf.hasOwnProperty(e)&&!Vf[e].primitive:typeof t==`string`||typeof t==`function`||!t.unexpandable}},cp=/^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/,lp=Object.freeze({"₊":`+`,"₋":`-`,"₌":`=`,"₍":`(`,"₎":`)`,"₀":`0`,"₁":`1`,"₂":`2`,"₃":`3`,"₄":`4`,"₅":`5`,"₆":`6`,"₇":`7`,"₈":`8`,"₉":`9`,ₐ:`a`,ₑ:`e`,ₕ:`h`,ᵢ:`i`,ⱼ:`j`,ₖ:`k`,ₗ:`l`,ₘ:`m`,ₙ:`n`,ₒ:`o`,ₚ:`p`,ᵣ:`r`,ₛ:`s`,ₜ:`t`,ᵤ:`u`,ᵥ:`v`,ₓ:`x`,ᵦ:`β`,ᵧ:`γ`,ᵨ:`ρ`,ᵩ:`ϕ`,ᵪ:`χ`,"⁺":`+`,"⁻":`-`,"⁼":`=`,"⁽":`(`,"⁾":`)`,"⁰":`0`,"¹":`1`,"²":`2`,"³":`3`,"⁴":`4`,"⁵":`5`,"⁶":`6`,"⁷":`7`,"⁸":`8`,"⁹":`9`,ᴬ:`A`,ᴮ:`B`,ᴰ:`D`,ᴱ:`E`,ᴳ:`G`,ᴴ:`H`,ᴵ:`I`,ᴶ:`J`,ᴷ:`K`,ᴸ:`L`,ᴹ:`M`,ᴺ:`N`,ᴼ:`O`,ᴾ:`P`,ᴿ:`R`,ᵀ:`T`,ᵁ:`U`,ⱽ:`V`,ᵂ:`W`,ᵃ:`a`,ᵇ:`b`,ᶜ:`c`,ᵈ:`d`,ᵉ:`e`,ᶠ:`f`,ᵍ:`g`,ʰ:`h`,ⁱ:`i`,ʲ:`j`,ᵏ:`k`,ˡ:`l`,ᵐ:`m`,ⁿ:`n`,ᵒ:`o`,ᵖ:`p`,ʳ:`r`,ˢ:`s`,ᵗ:`t`,ᵘ:`u`,ᵛ:`v`,ʷ:`w`,ˣ:`x`,ʸ:`y`,ᶻ:`z`,ᵝ:`β`,ᵞ:`γ`,ᵟ:`δ`,ᵠ:`ϕ`,ᵡ:`χ`,ᶿ:`θ`}),up={"́":{text:`\\'`,math:`\\acute`},"̀":{text:"\\`",math:`\\grave`},"̈":{text:`\\"`,math:`\\ddot`},"̃":{text:`\\~`,math:`\\tilde`},"̄":{text:`\\=`,math:`\\bar`},"̆":{text:`\\u`,math:`\\breve`},"̌":{text:`\\v`,math:`\\check`},"̂":{text:`\\^`,math:`\\hat`},"̇":{text:`\\.`,math:`\\dot`},"̊":{text:`\\r`,math:`\\mathring`},"̋":{text:`\\H`},"̧":{text:`\\c`}},dp={á:`á`,à:`à`,ä:`ä`,ǟ:`ǟ`,ã:`ã`,ā:`ā`,ă:`ă`,ắ:`ắ`,ằ:`ằ`,ẵ:`ẵ`,ǎ:`ǎ`,â:`â`,ấ:`ấ`,ầ:`ầ`,ẫ:`ẫ`,ȧ:`ȧ`,ǡ:`ǡ`,å:`å`,ǻ:`ǻ`,ḃ:`ḃ`,ć:`ć`,ḉ:`ḉ`,č:`č`,ĉ:`ĉ`,ċ:`ċ`,ç:`ç`,ď:`ď`,ḋ:`ḋ`,ḑ:`ḑ`,é:`é`,è:`è`,ë:`ë`,ẽ:`ẽ`,ē:`ē`,ḗ:`ḗ`,ḕ:`ḕ`,ĕ:`ĕ`,ḝ:`ḝ`,ě:`ě`,ê:`ê`,ế:`ế`,ề:`ề`,ễ:`ễ`,ė:`ė`,ȩ:`ȩ`,ḟ:`ḟ`,ǵ:`ǵ`,ḡ:`ḡ`,ğ:`ğ`,ǧ:`ǧ`,ĝ:`ĝ`,ġ:`ġ`,ģ:`ģ`,ḧ:`ḧ`,ȟ:`ȟ`,ĥ:`ĥ`,ḣ:`ḣ`,ḩ:`ḩ`,í:`í`,ì:`ì`,ï:`ï`,ḯ:`ḯ`,ĩ:`ĩ`,ī:`ī`,ĭ:`ĭ`,ǐ:`ǐ`,î:`î`,ǰ:`ǰ`,ĵ:`ĵ`,ḱ:`ḱ`,ǩ:`ǩ`,ķ:`ķ`,ĺ:`ĺ`,ľ:`ľ`,ļ:`ļ`,ḿ:`ḿ`,ṁ:`ṁ`,ń:`ń`,ǹ:`ǹ`,ñ:`ñ`,ň:`ň`,ṅ:`ṅ`,ņ:`ņ`,ó:`ó`,ò:`ò`,ö:`ö`,ȫ:`ȫ`,õ:`õ`,ṍ:`ṍ`,ṏ:`ṏ`,ȭ:`ȭ`,ō:`ō`,ṓ:`ṓ`,ṑ:`ṑ`,ŏ:`ŏ`,ǒ:`ǒ`,ô:`ô`,ố:`ố`,ồ:`ồ`,ỗ:`ỗ`,ȯ:`ȯ`,ȱ:`ȱ`,ő:`ő`,ṕ:`ṕ`,ṗ:`ṗ`,ŕ:`ŕ`,ř:`ř`,ṙ:`ṙ`,ŗ:`ŗ`,ś:`ś`,ṥ:`ṥ`,š:`š`,ṧ:`ṧ`,ŝ:`ŝ`,ṡ:`ṡ`,ş:`ş`,ẗ:`ẗ`,ť:`ť`,ṫ:`ṫ`,ţ:`ţ`,ú:`ú`,ù:`ù`,ü:`ü`,ǘ:`ǘ`,ǜ:`ǜ`,ǖ:`ǖ`,ǚ:`ǚ`,ũ:`ũ`,ṹ:`ṹ`,ū:`ū`,ṻ:`ṻ`,ŭ:`ŭ`,ǔ:`ǔ`,û:`û`,ů:`ů`,ű:`ű`,ṽ:`ṽ`,ẃ:`ẃ`,ẁ:`ẁ`,ẅ:`ẅ`,ŵ:`ŵ`,ẇ:`ẇ`,ẘ:`ẘ`,ẍ:`ẍ`,ẋ:`ẋ`,ý:`ý`,ỳ:`ỳ`,ÿ:`ÿ`,ỹ:`ỹ`,ȳ:`ȳ`,ŷ:`ŷ`,ẏ:`ẏ`,ẙ:`ẙ`,ź:`ź`,ž:`ž`,ẑ:`ẑ`,ż:`ż`,Á:`Á`,À:`À`,Ä:`Ä`,Ǟ:`Ǟ`,Ã:`Ã`,Ā:`Ā`,Ă:`Ă`,Ắ:`Ắ`,Ằ:`Ằ`,Ẵ:`Ẵ`,Ǎ:`Ǎ`,Â:`Â`,Ấ:`Ấ`,Ầ:`Ầ`,Ẫ:`Ẫ`,Ȧ:`Ȧ`,Ǡ:`Ǡ`,Å:`Å`,Ǻ:`Ǻ`,Ḃ:`Ḃ`,Ć:`Ć`,Ḉ:`Ḉ`,Č:`Č`,Ĉ:`Ĉ`,Ċ:`Ċ`,Ç:`Ç`,Ď:`Ď`,Ḋ:`Ḋ`,Ḑ:`Ḑ`,É:`É`,È:`È`,Ë:`Ë`,Ẽ:`Ẽ`,Ē:`Ē`,Ḗ:`Ḗ`,Ḕ:`Ḕ`,Ĕ:`Ĕ`,Ḝ:`Ḝ`,Ě:`Ě`,Ê:`Ê`,Ế:`Ế`,Ề:`Ề`,Ễ:`Ễ`,Ė:`Ė`,Ȩ:`Ȩ`,Ḟ:`Ḟ`,Ǵ:`Ǵ`,Ḡ:`Ḡ`,Ğ:`Ğ`,Ǧ:`Ǧ`,Ĝ:`Ĝ`,Ġ:`Ġ`,Ģ:`Ģ`,Ḧ:`Ḧ`,Ȟ:`Ȟ`,Ĥ:`Ĥ`,Ḣ:`Ḣ`,Ḩ:`Ḩ`,Í:`Í`,Ì:`Ì`,Ï:`Ï`,Ḯ:`Ḯ`,Ĩ:`Ĩ`,Ī:`Ī`,Ĭ:`Ĭ`,Ǐ:`Ǐ`,Î:`Î`,İ:`İ`,Ĵ:`Ĵ`,Ḱ:`Ḱ`,Ǩ:`Ǩ`,Ķ:`Ķ`,Ĺ:`Ĺ`,Ľ:`Ľ`,Ļ:`Ļ`,Ḿ:`Ḿ`,Ṁ:`Ṁ`,Ń:`Ń`,Ǹ:`Ǹ`,Ñ:`Ñ`,Ň:`Ň`,Ṅ:`Ṅ`,Ņ:`Ņ`,Ó:`Ó`,Ò:`Ò`,Ö:`Ö`,Ȫ:`Ȫ`,Õ:`Õ`,Ṍ:`Ṍ`,Ṏ:`Ṏ`,Ȭ:`Ȭ`,Ō:`Ō`,Ṓ:`Ṓ`,Ṑ:`Ṑ`,Ŏ:`Ŏ`,Ǒ:`Ǒ`,Ô:`Ô`,Ố:`Ố`,Ồ:`Ồ`,Ỗ:`Ỗ`,Ȯ:`Ȯ`,Ȱ:`Ȱ`,Ő:`Ő`,Ṕ:`Ṕ`,Ṗ:`Ṗ`,Ŕ:`Ŕ`,Ř:`Ř`,Ṙ:`Ṙ`,Ŗ:`Ŗ`,Ś:`Ś`,Ṥ:`Ṥ`,Š:`Š`,Ṧ:`Ṧ`,Ŝ:`Ŝ`,Ṡ:`Ṡ`,Ş:`Ş`,Ť:`Ť`,Ṫ:`Ṫ`,Ţ:`Ţ`,Ú:`Ú`,Ù:`Ù`,Ü:`Ü`,Ǘ:`Ǘ`,Ǜ:`Ǜ`,Ǖ:`Ǖ`,Ǚ:`Ǚ`,Ũ:`Ũ`,Ṹ:`Ṹ`,Ū:`Ū`,Ṻ:`Ṻ`,Ŭ:`Ŭ`,Ǔ:`Ǔ`,Û:`Û`,Ů:`Ů`,Ű:`Ű`,Ṽ:`Ṽ`,Ẃ:`Ẃ`,Ẁ:`Ẁ`,Ẅ:`Ẅ`,Ŵ:`Ŵ`,Ẇ:`Ẇ`,Ẍ:`Ẍ`,Ẋ:`Ẋ`,Ý:`Ý`,Ỳ:`Ỳ`,Ÿ:`Ÿ`,Ỹ:`Ỹ`,Ȳ:`Ȳ`,Ŷ:`Ŷ`,Ẏ:`Ẏ`,Ź:`Ź`,Ž:`Ž`,Ẑ:`Ẑ`,Ż:`Ż`,ά:`ά`,ὰ:`ὰ`,ᾱ:`ᾱ`,ᾰ:`ᾰ`,έ:`έ`,ὲ:`ὲ`,ή:`ή`,ὴ:`ὴ`,ί:`ί`,ὶ:`ὶ`,ϊ:`ϊ`,ΐ:`ΐ`,ῒ:`ῒ`,ῑ:`ῑ`,ῐ:`ῐ`,ό:`ό`,ὸ:`ὸ`,ύ:`ύ`,ὺ:`ὺ`,ϋ:`ϋ`,ΰ:`ΰ`,ῢ:`ῢ`,ῡ:`ῡ`,ῠ:`ῠ`,ώ:`ώ`,ὼ:`ὼ`,Ύ:`Ύ`,Ὺ:`Ὺ`,Ϋ:`Ϋ`,Ῡ:`Ῡ`,Ῠ:`Ῠ`,Ώ:`Ώ`,Ὼ:`Ὼ`},fp=class e{constructor(e,t){this.mode=void 0,this.gullet=void 0,this.settings=void 0,this.leftrightDepth=void 0,this.nextToken=void 0,this.mode=`math`,this.gullet=new sp(e,t,this.mode),this.settings=t,this.leftrightDepth=0,this.nextToken=null}expect(e,t){if(t===void 0&&(t=!0),this.fetch().text!==e)throw new P(`Expected '`+e+`', got '`+this.fetch().text+`'`,this.fetch());t&&this.consume()}consume(){this.nextToken=null}fetch(){return this.nextToken??=this.gullet.expandNextToken(),this.nextToken}switchMode(e){this.mode=e,this.gullet.switchMode(e)}parse(){this.settings.globalGroup||this.gullet.beginGroup(),this.settings.colorIsTextColor&&this.gullet.macros.set(`\\color`,`\\textcolor`);try{var e=this.parseExpression(!1);return this.expect(`EOF`),this.settings.globalGroup||this.gullet.endGroup(),e}finally{this.gullet.endGroups()}}subparse(e){var t=this.nextToken;this.consume(),this.gullet.pushToken(new Xd(`}`)),this.gullet.pushTokens(e);var n=this.parseExpression(!1);return this.expect(`}`),this.nextToken=t,n}parseExpression(t,n){for(var r=[];;){this.mode===`math`&&this.consumeSpaces();var i=this.fetch();if(e.endOfExpression.has(i.text)||n&&i.text===n||t&&Vf[i.text]&&Vf[i.text].infix)break;var a=this.parseAtom(n);if(!a)break;a.type!==`internal`&&r.push(a)}return this.mode===`text`&&this.formLigatures(r),this.handleInfixNodes(r)}handleInfixNodes(e){for(var t=-1,n,r=0;r<e.length;r++){var i=e[r];if(i.type===`infix`){if(t!==-1)throw new P(`only one infix operator per group`,i.token);t=r,n=i.replaceWith}}if(t!==-1&&n){var a,o,s=e.slice(0,t),c=e.slice(t+1);return a=s.length===1&&s[0].type===`ordgroup`?s[0]:{type:`ordgroup`,mode:this.mode,body:s},o=c.length===1&&c[0].type===`ordgroup`?c[0]:{type:`ordgroup`,mode:this.mode,body:c},[n===`\\\\abovefrac`?this.callFunction(n,[a,e[t],o],[]):this.callFunction(n,[a,o],[])]}else return e}handleSupSubscript(e){var t=this.fetch(),n=t.text;this.consume(),this.consumeSpaces();var r;do r=this.parseGroup(e);while(r?.type===`internal`);if(!r)throw new P(`Expected group after '`+n+`'`,t);return r}formatUnsupportedCmd(e){for(var t=[],n=0;n<e.length;n++)t.push({type:`textord`,mode:`text`,text:e[n]});var r={type:`text`,mode:this.mode,body:t};return{type:`color`,mode:this.mode,color:this.settings.errorColor,body:[r]}}parseAtom(e){var t=this.parseGroup(`atom`,e);if(t?.type===`internal`||this.mode===`text`)return t;for(var n,r;;){this.consumeSpaces();var i=this.fetch();if(i.text===`\\limits`||i.text===`\\nolimits`){if(t&&t.type===`op`)t.limits=i.text===`\\limits`,t.alwaysHandleSupSub=!0;else if(t&&t.type===`operatorname`)t.alwaysHandleSupSub&&(t.limits=i.text===`\\limits`);else throw new P(`Limit controls must follow a math operator`,i);this.consume()}else if(i.text===`^`){if(n)throw new P(`Double superscript`,i);n=this.handleSupSubscript(`superscript`)}else if(i.text===`_`){if(r)throw new P(`Double subscript`,i);r=this.handleSupSubscript(`subscript`)}else if(i.text===`'`){if(n)throw new P(`Double superscript`,i);var a={type:`textord`,mode:this.mode,text:`\\prime`},o=[a];for(this.consume();this.fetch().text===`'`;)o.push(a),this.consume();this.fetch().text===`^`&&o.push(this.handleSupSubscript(`superscript`)),n={type:`ordgroup`,mode:this.mode,body:o}}else if(lp[i.text]){var s=cp.test(i.text),c=[];for(c.push(new Xd(lp[i.text])),this.consume();;){var l=this.fetch().text;if(!lp[l]||cp.test(l)!==s)break;c.unshift(new Xd(lp[l])),this.consume()}var u=this.subparse(c);s?r={type:`ordgroup`,mode:`math`,body:u}:n={type:`ordgroup`,mode:`math`,body:u}}else break}return n||r?{type:`supsub`,mode:this.mode,base:t,sup:n,sub:r}:t}parseFunction(e,t){var n=this.fetch(),r=n.text,i=Vf[r];if(!i)return null;if(this.consume(),t&&t!==`atom`&&!i.allowedInArgument)throw new P(`Got function '`+r+`' with no arguments`+(t?` as `+t:``),n);if(this.mode===`text`&&!i.allowedInText)throw new P(`Can't use function '`+r+`' in text mode`,n);if(this.mode===`math`&&i.allowedInMath===!1)throw new P(`Can't use function '`+r+`' in math mode`,n);var{args:a,optArgs:o}=this.parseArguments(r,i);return this.callFunction(r,a,o,n,e)}callFunction(e,t,n,r,i){var a={funcName:e,parser:this,token:r,breakOnTokenText:i},o=Vf[e];if(o&&o.handler)return o.handler(a,t,n);throw new P(`No function handler for `+e)}parseArguments(e,t){var n=t.numArgs+t.numOptionalArgs;if(n===0)return{args:[],optArgs:[]};for(var r=[],i=[],a=0;a<n;a++){var o=t.argTypes&&t.argTypes[a],s=a<t.numOptionalArgs;(`primitive`in t&&t.primitive&&o==null||t.type===`sqrt`&&a===1&&i[0]==null)&&(o=`primitive`);var c=this.parseGroupOfType(`argument to '`+e+`'`,o,s);if(s)i.push(c);else if(c!=null)r.push(c);else throw new P(`Null argument, please report this as a bug`)}return{args:r,optArgs:i}}parseGroupOfType(e,t,n){switch(t){case`color`:return this.parseColorGroup(n);case`size`:return this.parseSizeGroup(n);case`url`:return this.parseUrlGroup(n);case`math`:case`text`:return this.parseArgumentGroup(n,t);case`hbox`:var r=this.parseArgumentGroup(n,`text`);return r==null?null:{type:`styling`,mode:r.mode,body:[r],style:`text`,resetFont:!0};case`raw`:var i=this.parseStringGroup(`raw`,n);return i==null?null:{type:`raw`,mode:`text`,string:i.text};case`primitive`:if(n)throw new P(`A primitive argument cannot be optional`);var a=this.parseGroup(e);if(a==null)throw new P(`Expected group as `+e,this.fetch());return a;case`original`:case null:case void 0:return this.parseArgumentGroup(n);default:throw new P(`Unknown group type as `+e,this.fetch())}}consumeSpaces(){for(;this.fetch().text===` `;)this.consume()}parseStringGroup(e,t){var n=this.gullet.scanArgument(t);if(n==null)return null;for(var r=``,i;(i=this.fetch()).text!==`EOF`;)r+=i.text,this.consume();return this.consume(),n.text=r,n}parseRegexGroup(e,t){for(var n=this.fetch(),r=n,i=``,a;(a=this.fetch()).text!==`EOF`&&e.test(i+a.text);)r=a,i+=r.text,this.consume();if(i===``)throw new P(`Invalid `+t+`: '`+n.text+`'`,n);return n.range(r,i)}parseColorGroup(e){var t=this.parseStringGroup(`color`,e);if(t==null)return null;var n=/^(#[a-f0-9]{3,4}|#[a-f0-9]{6}|#[a-f0-9]{8}|[a-f0-9]{6}|[a-z]+)$/i.exec(t.text);if(!n)throw new P(`Invalid color: '`+t.text+`'`,t);var r=n[0];return/^[0-9a-f]{6}$/i.test(r)&&(r=`#`+r),{type:`color-token`,mode:this.mode,color:r}}parseSizeGroup(e){var t,n=!1;if(this.gullet.consumeSpaces(),t=!e&&this.gullet.future().text!==`{`?this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/,`size`):this.parseStringGroup(`size`,e),!t)return null;!e&&t.text.length===0&&(t.text=`0pt`,n=!0);var r=/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(t.text);if(!r)throw new P(`Invalid size: '`+t.text+`'`,t);var i={number:+(r[1]+r[2]),unit:r[3]};if(!dc(i))throw new P(`Invalid unit: '`+i.unit+`'`,t);return{type:`size`,mode:this.mode,value:i,isBlank:n}}parseUrlGroup(e){this.gullet.lexer.setCatcode(`%`,13),this.gullet.lexer.setCatcode(`~`,12);var t=this.parseStringGroup(`url`,e);if(this.gullet.lexer.setCatcode(`%`,14),this.gullet.lexer.setCatcode(`~`,13),t==null)return null;var n=t.text.replace(/\\([#$%&~_^{}])/g,`$1`);return{type:`url`,mode:this.mode,url:n}}parseArgumentGroup(e,t){var n=this.gullet.scanArgument(e);if(n==null)return null;var r=this.mode;t&&this.switchMode(t),this.gullet.beginGroup();var i=this.parseExpression(!1,`EOF`);this.expect(`EOF`),this.gullet.endGroup();var a={type:`ordgroup`,mode:this.mode,loc:n.loc,body:i};return t&&this.switchMode(r),a}parseGroup(e,t){var n=this.fetch(),r=n.text,i;if(r===`{`||r===`\\begingroup`){this.consume();var a=r===`{`?`}`:`\\endgroup`;this.gullet.beginGroup();var o=this.parseExpression(!1,a),s=this.fetch();this.expect(a),this.gullet.endGroup(),i={type:`ordgroup`,mode:this.mode,loc:Yd.range(n,s),body:o,semisimple:r===`\\begingroup`||void 0}}else if(i=this.parseFunction(t,e)||this.parseSymbol(),i==null&&r[0]===`\\`&&!op.hasOwnProperty(r)){if(this.settings.throwOnError)throw new P(`Undefined control sequence: `+r,n);i=this.formatUnsupportedCmd(r),this.consume()}return i}formLigatures(e){for(var t=e.length-1,n=0;n<t;++n){var r=e[n];if(r.type===`textord`){var i=r.text,a=e[n+1];if(!(!a||a.type!==`textord`)){if(i===`-`&&a.text===`-`){var o=e[n+2];n+1<t&&o&&o.type===`textord`&&o.text===`-`?(e.splice(n,3,{type:`textord`,mode:`text`,loc:Yd.range(r,o),text:`---`}),t-=2):(e.splice(n,2,{type:`textord`,mode:`text`,loc:Yd.range(r,a),text:`--`}),--t)}(i===`'`||i==="`")&&a.text===i&&(e.splice(n,2,{type:`textord`,mode:`text`,loc:Yd.range(r,a),text:i+i}),--t)}}}}parseSymbol(){var e=this.fetch(),t=e.text;if(/^\\verb[^a-zA-Z]/.test(t)){this.consume();var n=t.slice(5),r=n.charAt(0)===`*`;if(r&&(n=n.slice(1)),n.length<2||n.charAt(0)!==n.slice(-1))throw new P(`\\verb assertion failed --
                    please report what input caused this bug`);return n=n.slice(1,-1),{type:`verb`,mode:`text`,body:n,star:r}}dp.hasOwnProperty(t[0])&&!Lc[this.mode][t[0]]&&(this.settings.strict&&this.mode===`math`&&this.settings.reportNonstrict(`unicodeTextInMathMode`,`Accented Unicode text character "`+t[0]+`" used in math mode`,e),t=dp[t[0]]+t.slice(1));var i=Jf.exec(t);i&&(t=t.substring(0,i.index),t===`i`?t=`ı`:t===`j`&&(t=`ȷ`));var a;if(Lc[this.mode][t]){this.settings.strict&&this.mode===`math`&&al.includes(t)&&this.settings.reportNonstrict(`unicodeTextInMathMode`,`Latin-1/Unicode text character "`+t[0]+`" used in math mode`,e);var o=Lc[this.mode][t].group,s=Yd.range(e);a=Vu(o)?{type:`atom`,mode:this.mode,family:o,loc:s,text:t}:{type:o,mode:this.mode,loc:s,text:t}}else if(t.charCodeAt(0)>=128)this.settings.strict&&(qs(t.charCodeAt(0))?this.mode===`math`&&this.settings.reportNonstrict(`unicodeTextInMathMode`,`Unicode text character "`+t[0]+`" used in math mode`,e):this.settings.reportNonstrict(`unknownSymbol`,`Unrecognized Unicode character "`+t[0]+`"`+(` (`+t.charCodeAt(0)+`)`),e)),a={type:`textord`,mode:`text`,loc:Yd.range(e),text:t};else return null;if(this.consume(),i)for(var c=0;c<i[0].length;c++){var l=i[0][c];if(!up[l])throw new P(`Unknown accent ' `+l+`'`,e);var u=up[l][this.mode]||up[l].text;if(!u)throw new P(`Accent `+l+` unsupported in `+this.mode+` mode`,e);a={type:`accent`,mode:this.mode,loc:Yd.range(e),label:u,isStretchy:!1,isShifty:!0,base:a}}return a}};fp.endOfExpression=new Set([`}`,`\\endgroup`,`\\end`,`\\right`,`&`]);var pp=function(e,t){if(!(typeof e==`string`||e instanceof String))throw TypeError(`KaTeX can only parse string typed expression`);var n=new fp(e,t);delete n.gullet.macros.current[`\\df@tag`];var r=n.parse();if(delete n.gullet.macros.current[`\\current@color`],delete n.gullet.macros.current[`\\color`],n.gullet.macros.get(`\\df@tag`)){if(!t.displayMode)throw new P(`\\tag works only in display equations`);r=[{type:`tag`,mode:`text`,body:r,tag:n.subparse([new Xd(`\\df@tag`)])}]}return r},mp=function(e,t,n){t.textContent=``;var r=vp(e,n).toNode();t.appendChild(r)};typeof document<`u`&&document.compatMode!==`CSS1Compat`&&(typeof console<`u`&&console.warn(`Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype.`),mp=function(){throw new P(`KaTeX doesn't work in quirks mode.`)});var hp=function(e,t){return vp(e,t).toMarkup()},gp=function(e,t){return pp(e,new Ds(t))},_p=function(e,t,n){if(n.throwOnError||!(e instanceof P))throw e;var r=q([`katex-error`],[new Cc(t)]);return r.setAttribute(`title`,e.toString()),r.setAttribute(`style`,`color:`+n.errorColor),r},vp=function(e,t){var n=new Ds(t);try{return ju(pp(e,n),e,n)}catch(t){return _p(t,e,n)}},yp={version:`0.16.47`,render:mp,renderToString:hp,ParseError:P,SETTINGS_SCHEMA:Cs,__parse:gp,__renderToDomTree:vp,__renderToHTMLTree:function(e,t){var n=new Ds(t);try{return Mu(pp(e,n),e,n)}catch(t){return _p(t,e,n)}},__setFontMetrics:Nc,__defineSymbol:L,__defineFunction:X,__defineMacro:$,__domTree:{Span:yc,Anchor:bc,SymbolNode:Cc,SvgNode:wc,PathNode:Tc,LineNode:Ec}},bp={};function xp(e){let t=this,n=e||bp,r=t.data(),i=r.micromarkExtensions||=[],a=r.fromMarkdownExtensions||=[],o=r.toMarkdownExtensions||=[];i.push(ps(n)),a.push(is()),o.push(as(n))}var Sp=/[#.]/g;function Cp(e,t){let n=e||``,r={},i=0,a,o;for(;i<n.length;){Sp.lastIndex=i;let e=Sp.exec(n),t=n.slice(i,e?e.index:n.length);t&&(a?a===`#`?r.id=t:Array.isArray(r.className)?r.className.push(t):r.className=[t]:o=t,i+=t.length),e&&(a=e[0],i++)}return{type:`element`,tagName:o||t||`div`,properties:r,children:[]}}function wp(e,t,n){let r=n?Ap(n):void 0;function i(n,i,...a){let o;if(n==null){o={type:`root`,children:[]};let e=i;a.unshift(e)}else{o=Cp(n,t);let s=o.tagName.toLowerCase(),c=r?r.get(s):void 0;if(o.tagName=c||s,Tp(i))a.unshift(i);else for(let[t,n]of Object.entries(i))Ep(e,o.properties,t,n)}for(let e of a)Dp(o.children,e);return o.type===`element`&&o.tagName===`template`&&(o.content={type:`root`,children:o.children},o.children=[]),o}return i}function Tp(e){if(typeof e!=`object`||!e||Array.isArray(e))return!0;if(typeof e.type!=`string`)return!1;let t=e,n=Object.keys(e);for(let e of n){let n=t[e];if(n&&typeof n==`object`){if(!Array.isArray(n))return!0;let e=n;for(let t of e)if(typeof t!=`number`&&typeof t!=`string`)return!0}}return!!(`children`in e&&Array.isArray(e.children))}function Ep(e,t,n,r){let i=Je(e,n),a;if(r!=null){if(typeof r==`number`){if(Number.isNaN(r))return;a=r}else a=typeof r==`boolean`?r:typeof r==`string`?i.spaceSeparated?$e(r):i.commaSeparated?de(r):i.commaOrSpaceSeparated?$e(de(r).join(` `)):Op(i,i.property,r):Array.isArray(r)?[...r]:i.property===`style`?kp(r):String(r);if(Array.isArray(a)){let e=[];for(let t of a)e.push(Op(i,i.property,t));a=e}i.property===`className`&&Array.isArray(t.className)&&(a=t.className.concat(a)),t[i.property]=a}}function Dp(e,t){if(t!=null)if(typeof t==`number`||typeof t==`string`)e.push({type:`text`,value:String(t)});else if(Array.isArray(t))for(let n of t)Dp(e,n);else if(typeof t==`object`&&`type`in t)t.type===`root`?Dp(e,t.children):e.push(t);else throw Error("Expected node, nodes, or string, got `"+t+"`")}function Op(e,t,n){if(typeof n==`string`){if(e.number&&n&&!Number.isNaN(Number(n)))return Number(n);if((e.boolean||e.overloadedBoolean)&&(n===``||Se(n)===Se(t)))return!0}return n}function kp(e){let t=[];for(let[n,r]of Object.entries(e))t.push([n,r].join(`: `));return t.join(`; `)}function Ap(e){let t=new Map;for(let n of e)t.set(n.toLowerCase(),n);return t}var jp=`altGlyph.altGlyphDef.altGlyphItem.animateColor.animateMotion.animateTransform.clipPath.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feDistantLight.feDropShadow.feFlood.feFuncA.feFuncB.feFuncG.feFuncR.feGaussianBlur.feImage.feMerge.feMergeNode.feMorphology.feOffset.fePointLight.feSpecularLighting.feSpotLight.feTile.feTurbulence.foreignObject.glyphRef.linearGradient.radialGradient.solidColor.textArea.textPath`.split(`.`),Mp=wp(Ze,`div`),Np=wp(Qe,`g`,jp),Pp={html:`http://www.w3.org/1999/xhtml`,mathml:`http://www.w3.org/1998/Math/MathML`,svg:`http://www.w3.org/2000/svg`,xlink:`http://www.w3.org/1999/xlink`,xml:`http://www.w3.org/XML/1998/namespace`,xmlns:`http://www.w3.org/2000/xmlns/`};function Fp(e,t){return Ip(e,t||{})||{type:`root`,children:[]}}function Ip(e,t){let n=Lp(e,t);return n&&t.afterTransform&&t.afterTransform(e,n),n}function Lp(e,t){switch(e.nodeType){case 1:return Hp(e,t);case 3:return Bp(e);case 8:return Vp(e);case 9:return Rp(e,t);case 10:return zp();case 11:return Rp(e,t);default:return}}function Rp(e,t){return{type:`root`,children:Up(e,t)}}function zp(){return{type:`doctype`}}function Bp(e){return{type:`text`,value:e.nodeValue||``}}function Vp(e){return{type:`comment`,value:e.nodeValue||``}}function Hp(e,t){let n=e.namespaceURI,r=n===Pp.svg?Np:Mp,i=n===Pp.html?e.tagName.toLowerCase():e.tagName,a=n===Pp.html&&i===`template`?e.content:e,o=e.getAttributeNames(),s={},c=-1;for(;++c<o.length;)s[o[c]]=e.getAttribute(o[c])||``;return r(i,s,Up(a,t))}function Up(e,t){let n=e.childNodes,r=[],i=-1;for(;++i<n.length;){let e=Ip(n[i],t);e!==void 0&&r.push(e)}return r}var Wp=new DOMParser;function Gp(e,t){return Fp(t?.fragment?Kp(e):Wp.parseFromString(e,`text/html`))}function Kp(e){let t=document.createElement(`template`);return t.innerHTML=e,t.content}var qp=(function(e,t,n){let r=Ha(n);if(!e||!e.type||!e.children)throw Error(`Expected parent node`);if(typeof t==`number`){if(t<0||t===1/0)throw Error(`Expected positive finite number as index`)}else if(t=e.children.indexOf(t),t<0)throw Error(`Expected child node or index`);for(;++t<e.children.length;)if(r(e.children[t],t,e))return e.children[t]}),Jp=(function(e){if(e==null)return Qp;if(typeof e==`string`)return Xp(e);if(typeof e==`object`)return Yp(e);if(typeof e==`function`)return Zp(e);throw Error("Expected function, string, or array as `test`")});function Yp(e){let t=[],n=-1;for(;++n<e.length;)t[n]=Jp(e[n]);return Zp(r);function r(...e){let n=-1;for(;++n<t.length;)if(t[n].apply(this,e))return!0;return!1}}function Xp(e){return Zp(t);function t(t){return t.tagName===e}}function Zp(e){return t;function t(t,n,r){return!!($p(t)&&e.call(this,t,typeof n==`number`?n:void 0,r||void 0))}}function Qp(e){return!!(e&&typeof e==`object`&&`type`in e&&e.type===`element`&&`tagName`in e&&typeof e.tagName==`string`)}function $p(e){return typeof e==`object`&&!!e&&`type`in e&&`tagName`in e}var em=/\n/g,tm=/[\t ]+/g,nm=Jp(`br`),rm=Jp(gm),im=Jp(`p`),am=Jp(`tr`),om=Jp([`datalist`,`head`,`noembed`,`noframes`,`noscript`,`rp`,`script`,`style`,`template`,`title`,hm,_m]),sm=Jp(`address.article.aside.blockquote.body.caption.center.dd.dialog.dir.dl.dt.div.figure.figcaption.footer.form,.h1.h2.h3.h4.h5.h6.header.hgroup.hr.html.legend.li.listing.main.menu.nav.ol.p.plaintext.pre.section.ul.xmp`.split(`.`));function cm(e,t){let n=t||{},r=`children`in e?e.children:[],i=sm(e),a=mm(e,{whitespace:n.whitespace||`normal`,breakBefore:!1,breakAfter:!1}),o=[];(e.type===`text`||e.type===`comment`)&&o.push(...dm(e,{whitespace:a,breakBefore:!0,breakAfter:!0}));let s=-1;for(;++s<r.length;)o.push(...lm(r[s],e,{whitespace:a,breakBefore:s?void 0:i,breakAfter:s<r.length-1?nm(r[s+1]):i}));let c=[],l;for(s=-1;++s<o.length;){let e=o[s];typeof e==`number`?l!==void 0&&e>l&&(l=e):e&&(l!==void 0&&l>-1&&c.push(`
`.repeat(l)||` `),l=-1,c.push(e))}return c.join(``)}function lm(e,t,n){return e.type===`element`?um(e,t,n):e.type===`text`?n.whitespace===`normal`?dm(e,n):fm(e):[]}function um(e,t,n){let r=mm(e,n),i=e.children||[],a=-1,o=[];if(om(e))return o;let s,c;for(nm(e)||am(e)&&qp(t,e,am)?c=`
`:im(e)?(s=2,c=2):sm(e)&&(s=1,c=1);++a<i.length;)o=o.concat(lm(i[a],e,{whitespace:r,breakBefore:a?void 0:s,breakAfter:a<i.length-1?nm(i[a+1]):c}));return rm(e)&&qp(t,e,rm)&&o.push(`	`),s&&o.unshift(s),c&&o.push(c),o}function dm(e,t){let n=String(e.value),r=[],i=[],a=0;for(;a<=n.length;){em.lastIndex=a;let e=em.exec(n),i=e&&`index`in e?e.index:n.length;r.push(pm(n.slice(a,i).replace(/[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g,``),a===0?t.breakBefore:!0,i===n.length?t.breakAfter:!0)),a=i+1}let o=-1,s;for(;++o<r.length;)r[o].charCodeAt(r[o].length-1)===8203||o<r.length-1&&r[o+1].charCodeAt(0)===8203?(i.push(r[o]),s=void 0):r[o]?(typeof s==`number`&&i.push(s),i.push(r[o]),s=0):(o===0||o===r.length-1)&&i.push(0);return i}function fm(e){return[String(e.value)]}function pm(e,t,n){let r=[],i=0,a;for(;i<e.length;){tm.lastIndex=i;let n=tm.exec(e);a=n?n.index:e.length,!i&&!a&&n&&!t&&r.push(``),i!==a&&r.push(e.slice(i,a)),i=n?a+n[0].length:a}return i!==a&&!n&&r.push(``),r.join(` `)}function mm(e,t){if(e.type===`element`){let n=e.properties||{};switch(e.tagName){case`listing`:case`plaintext`:case`xmp`:return`pre`;case`nobr`:return`nowrap`;case`pre`:return n.wrap?`pre-wrap`:`pre`;case`td`:case`th`:return n.noWrap?`nowrap`:t.whitespace;case`textarea`:return`pre-wrap`;default:}}return t.whitespace}function hm(e){return!!(e.properties||{}).hidden}function gm(e){return e.tagName===`td`||e.tagName===`th`}function _m(e){return e.tagName===`dialog`&&!(e.properties||{}).open}var vm={},ym=[];function bm(e){let t=e||vm;return function(e,n){Qa(e,`element`,function(e,r){let i=Array.isArray(e.properties.className)?e.properties.className:ym,a=i.includes(`language-math`),o=i.includes(`math-display`),s=i.includes(`math-inline`),c=o;if(!a&&!o&&!s)return;let l=r[r.length-1],u=e;if(e.tagName===`code`&&a&&l&&l.type===`element`&&l.tagName===`pre`&&(u=l,l=r[r.length-2],c=!0),!l)return;let d=cm(u,{whitespace:`pre`}),f;try{f=yp.renderToString(d,{...t,displayMode:c,throwOnError:!0})}catch(i){let a=i,o=a.name.toLowerCase();n.message(`Could not render math with KaTeX`,{ancestors:[...r,e],cause:a,place:e.position,ruleId:o,source:`rehype-katex`});try{f=yp.renderToString(d,{...t,displayMode:c,strict:`ignore`,throwOnError:!1})}catch{f=[{type:`element`,tagName:`span`,properties:{className:[`katex-error`],style:`color:`+(t.errorColor||`#cc0000`),title:String(i)},children:[{type:`text`,value:d}]}]}}typeof f==`string`&&(f=Gp(f,{fragment:!0}).children);let p=l.children.indexOf(u);return l.children.splice(p,1,...f),Za})}}var xm=_(),Sm=[`题目`,`知识点`],Cm=[{id:`forest-to-binary-min-height`,questionNumber:4,title:`森林转换为二叉树：最小高度如何判断？`,type:`题目`,date:`2026-09-29`,chapter:`树与二叉树 · 森林转换`,tags:[`森林与二叉树转换`,`左孩子右兄弟`,`树的高度`],summary:`5 棵树分别有 2、3、4、5、7 个结点。树的次序可任意安排，如何判断转换后二叉树的最小高度？`,source:`用户提供的题目截图，标注为“2026 · 第4题 · 2分”；未独立核验原始试卷出处。解析为本站推导，并非引用官方答案。`,content:String.raw`森林 $F$ 中有 5 棵树，其结点个数分别为 2、3、4、5、7，森林中树的次序可以任意，问 $F$ 对应的二叉树最小高度为多少？

- **A．** 5
- **B．** 6
- **C．** 8
- **D．** 10

按 408 常用约定，根结点算第 1 层，高度按层数计算。`,attachments:[{name:`查看原题截图`,path:`forest-to-binary-min-height/question.png`}],solution:{answer:String.raw`**选 B：6。**

5 棵树的根会形成一条右链，最后一个根位于第 5 层；每棵树至少有 2 个结点，因此最后一个根下面还必须有孩子，至少需要第 6 层。再构造一个 6 层即可容纳的安排，才能确认这个下界就是最小值。`,explanation:String.raw`## 1. 先问学生：5 棵树的根，转换后排在哪里？

森林转换成二叉树，使用“左孩子、右兄弟”规则：

- 原结点的第一个孩子，变成它的左孩子。
- 原结点的下一个兄弟，变成它的右孩子。
- 森林中各棵树的根，也按兄弟关系连接。

于是，5 棵树的根必然形成一条右链：

~~~binary
根1
  R: 根2
    R: 根3
      R: 根4
        R: 根5
~~~

**右孩子同样会增加一层。** 这些根在原森林中虽然都属于各自树的第一层，转换后却不在同一层。

## 2. 为什么不可能只有 5 层？

不管怎样调整顺序，最后一棵树的根都位于二叉树的第 5 层。

题中最小的树也有 2 个结点，所以最后一棵树的根一定有孩子。它的第一个孩子变成二叉树中的左孩子，位于第 6 层。

~~~binary
根5
  L: 第一个孩子
~~~

所以：

$$
H \ge 6.
$$

这里的关键不是“总共有多少个结点”，而是：**5 个根已经排到第 5 层，最后一个根还不能是叶子。**

## 3. 至少 6 层，是否就能直接断定答案是 6？

还不能。必须证明 6 层确实可以实现。

可以把树按结点数排列为：

$$
7,\ 5,\ 4,\ 3,\ 2.
$$

一棵有 $n$ 个结点的树，单独转换为二叉树时，根没有右兄弟，因此根的右子树为空；其余 $n-1$ 个结点都在根的左子树里。

把这部分尽量平衡，可以达到的最小高度为：

$$
b(n)=1+\lceil \log_2 n \rceil.
$$

为什么是这个式子？高度为 $b$ 时，根下面的左子树最多有 $b-1$ 层，最多容纳 $2^{b-1}-1$ 个结点；加上根，一共最多容纳 $2^{b-1}$ 个结点。因而需要 $n\le 2^{b-1}$，取最小整数 $b$ 即得上式。

将一棵单独高度为 $b$ 的树放在第 $i$ 个位置，它的根处于第 $i$ 层，所以这棵树自身的结点最深到：

$$
i+b-1.
$$

逐棵检查：

- **7 个结点**：根在第 1 层，单独最小高度为 4，最深到 $1+4-1=4$ 层。
- **5 个结点**：根在第 2 层，单独最小高度为 4，最深到 $2+4-1=5$ 层。
- **4 个结点**：根在第 3 层，单独最小高度为 3，最深到 $3+3-1=5$ 层。
- **3 个结点**：根在第 4 层，单独最小高度为 3，最深到 $4+3-1=6$ 层。
- **2 个结点**：根在第 5 层，单独最小高度为 2，最深到 $5+2-1=6$ 层。

这些单棵树的最小高度均可通过安排其左子树形状达到；根之间再用右指针连接，不改变各自左子树的形状。整个二叉树的高度就是这些最深层数中的最大值：

$$
H=\max(4,5,5,6,6)=6.
$$

既证明了“不可能低于 6”，又构造出“恰好 6”的情况，因此：

$$
\boxed{H_{\min}=6}.
$$`,pitfalls:String.raw`## 误区一：只用 21 个结点估算普通二叉树的高度

一种错误做法是：$2+3+4+5+7=21$，而 5 层的普通二叉树最多有 $2^5-1=31$ 个结点，所以选 A。

问题在于：本题不是可以任意排列的普通二叉树。它必须符合森林转换规则，尤其是 **5 个根形成的右链，以及最后一个根还必须有孩子**。结点总数给出的普通二叉树下界，不能保证满足这种结构约束。

## 误区二：右兄弟连线不增加高度

“兄弟”说的是原森林中的关系。转换后二叉树中的右指针是一条真实的父子边，走一次就增加一层。

## 误区三：证明至少 6，就等于证明最小是 6

下界证明还不够，需要有能达到这个高度的安排。本题按 $7,5,4,3,2$ 排列，并选择合适的树形，完成了可达性证明。

## 误区四：只按结点数，就能判断任意已知树形的转换高度

题目只给结点数，没有给定具体树形，这里求的是满足这些条件时可以达到的最小高度。

若 5 棵树的形状已经固定，仅凭结点数不能保证调整顺序后一定达到 6。例如，7 个结点构成的单链，转换后仍然是一条 7 层的链；即使放在最前面，也至少需要 7 层。

不要把“较大的树放前面”直接当成适用于所有固定树形的结论；对固定树形，更应关注各棵树单独转换后的实际高度。

本题高度按层数算，根为第 1 层；若改按边数定义高度，同一结构的数值会少 1。`,extension:String.raw`## 课堂上的简短讲法

> 5 棵树的根转换后排成右链，占到第 5 层；每棵树至少有 2 个结点，所以最后一个根下面还得有孩子，至少到第 6 层。再按 7、5、4、3、2 排列，并安排合适的树形，可以构造出恰好 6 层的结果，因此选 B。

## 追问：有 $m$ 棵树，每棵至少 2 个结点，高度是否一定是 $m+1$？

**不一定，只能直接推出至少是 $m+1$。**

因为最后一个根在第 $m$ 层，它的第一个孩子在第 $m+1$ 层。至于能否恰好达到这个高度，还要检查其余结点能否放下，以及树形是否已经固定。

这道题适合训练的解题方法是：**先找结构下界，再证明这个下界可以达到。**`}},{id:`tree-forest-binary-conversion`,title:`树、森林与二叉树的转换：一个例子走完三个方向`,type:`知识点`,date:`2026-09-30`,chapter:`树与二叉树 · 结构转换`,tags:[`左孩子右兄弟`,`森林与二叉树转换`,`树与二叉树转换`],summary:`用同一个森林 F={T1,T2} 走完「森林→二叉树」「二叉树→森林」「二叉树→树」三个方向，看清左指针与右指针各自代表什么。`,content:String.raw`## 一条规则

**左指针 = 第一个孩子；右指针 = 下一个兄弟。**（森林里，下一棵树的根也算「下一个兄弟」。）

全卡片只用这一个例子，森林 $F=\{T_1,T_2\}$：$T_1$ 的根是 $A$，$T_2$ 的根是 $G$。

~~~tree
A
  B
    D
    E
  C
    F
G
  H
~~~

## 一、森林 → 二叉树：加线、删线、旋转

1. **加线**：同一层的兄弟之间连线。本例连出 $B-C$、$D-E$。
2. **删线**：每个结点只保留到第一个孩子的线。本例删掉 $A-C$、$B-E$。
3. **旋转**：兄弟连线变成右指针，第一个孩子变成左指针；$T_2$ 的根 $G$ 也作为兄弟接到 $A$ 的右边。

结果唯一确定（左下是左孩子，右下是右孩子）：

~~~binary
A
  L: B
    L: D
      R: E
    R: C
      L: F
  R: G
    L: H
~~~

逐条对照（左指针 / 右指针）：

- $A$：左 $B$，右 $G$（下一棵树的根）
- $B$：左 $D$，右 $C$
- $C$：左 $F$，右空
- $D$：左空，右 $E$
- $E$：左空，右空
- $F$：左空，右空
- $G$：左 $H$，右空
- $H$：左空，右空

## 二、二叉树 → 森林：断右链

反过来只看根的右指针。本例从 $A$ 沿右指针能走到 $G$，于是在 $A$ 与 $G$ 之间断开，得到两段：$A$ 段（含 $A,B,C,D,E,F$）和 $G$ 段（含 $G,H$）。

每一段按「左孩子还原为第一个孩子，右链依次还原为兄弟」展开，就得到原来的两棵树。

**判据：根有右孩子 ⇒ 来自森林（至少两棵树）；跟在根右链上的结点，就是各棵树的根。**

## 三、二叉树 → 树：根没有右孩子

森林里只有一棵树时，转换结果根的右子树必为空。把 $T_2$ 去掉，只留 $T_1$：

~~~binary
A
  L: B
    L: D
      R: E
    R: C
      L: F
~~~

此时 $A$ 没有右孩子，按同样的左孩子/右兄弟读回去，得到的正是一棵树。

## 三个方向一眼对照

- **树 → 二叉树**：看根有没有右子树 → 没有，右指针空。
- **森林 → 二叉树**：看根的右链 → 链上有几个结点，就有几棵树。
- **二叉树 → 树 / 森林**：看根有没有右子树 → 没有则还原成一棵树，有则沿右链断开还原成森林。

**数层数时的注意点：**右指针是一条真实的父子边，走一次就多一层；同一结点的右链每多一个兄弟（或一棵树的根），高度就加一层。`},{id:`directed-graph-path-strings`,questionNumber:7,title:`有向图路径拼成的字符串集：哪个说法错误？`,type:`题目`,date:`2026-09-30`,chapter:`图 · 路径与环`,tags:[`有向图`,`路径与回路`,`有限与无限`,`反例构造`],summary:`把一个有向图的路径全部按边标记拼成字符串，得到一个字符串集合 S。判断「无环」「有环」两种情况下 S 的性质，并找出错误的那个说法。`,source:`用户提供的题目截图，标注为“2026 · 第7题 · 2分”；未独立核验原始试卷出处。解析为本站推导。`,content:String.raw`设有向图 $G=(V,E)$，其中顶点集 $V$ 的大小为 $n=|V|$，每条边 $e\in E$ 都标记有一个唯一的字符（不同边可标记相同字符）。定义字符串集 $S$ 为：所有由 $G$ 中任意一条路径（路径可包含单个顶点，对应空字符串）上的边标记按顺序拼接而成的字符串的集合。以下说法**错误**的是（ ）。

- **A．** 若 $G$ 无环，则 $S$ 是有限集
- **B．** 若 $G$ 无环，则 $S$ 中存在长度为 $n$ 的字符串
- **C．** 若 $G$ 有环，则 $S$ 中存在长度大于 $n$ 的字符串
- **D．** 若 $G$ 有环，则 $S$ 中存在长度小于 $2n$ 的字符串`,attachments:[{name:`查看原题截图`,path:`directed-graph-path-strings/question.png`}],solution:{answer:String.raw`**选 B。**

$G$ 无环时，任意一条路径都不会重复经过顶点，最多走 $n-1$ 条边，因此**根本不可能**出现长度为 $n$ 的字符串。而 A、C、D 都成立。`,explanation:String.raw`## 先把「路径」和「长度」定死

- **路径**：这里是可以重复经过顶点的通路（走法）。若理解成「顶点不重复的简单路径」，含环时 C 也不成立，题目就没有唯一答案了。
- **字符串长度**：走过的**边数**。单顶点路径对应空串 $\varepsilon$，长度为 0。

## A 为什么对

$G$ 无环时，任何一条路径都不会重复顶点，因此长度至多 $n-1$；一条路径由顶点序列唯一确定，而顶点序列只有有限多种，所以 $S$ 是有限集。

注意：边标记允许重复，这只是让不同路径可能拼出同一个字符串，不影响「$S$ 有限」这个结论。

## B 为什么错

**长度为 $n$ 的字符串需要走 $n$ 条边，也就是 $n+1$ 个顶点——超过 $V$ 的大小，必然重复顶点，于是必然含环。**所以无环时永远拼不出长度为 $n$ 的字符串。

举个最小反例，$n=2$：只有一条边 $v_1\to v_2$（下图由 $v_1$ 指向 $v_2$），标号为 $a$。

~~~tree
v1
  v2
~~~

$G$ 无环，而

$$
S=\{\varepsilon,\ a\},
$$

最长长度是 $1<2=n$，不存在长度为 $n$ 的字符串。极端一点，取 $E=\varnothing$ 时 $S=\{\varepsilon\}$，同样没有。

## C 为什么对

设环上有 $k$ 条边，则 $1\le k\le n$。沿这个环连续走 $r$ 圈，就得到长度为 $rk$ 的字符串。取

$$
r=\left\lceil \frac{n+1}{k}\right\rceil ,
$$

则 $rk\ge n+1>n$。所以有环时 $S$ 中存在长度大于 $n$ 的字符串。

## D 为什么对

同一个环，$k\le n$ 直接给出 $k<2n$：环本身拼出的字符串长度就是 $k$，它已经小于 $2n$。

更省事的看法：空串 $\varepsilon$ 的长度是 $0<2n$，所以 D 中「存在长度小于 $2n$ 的字符串」在**有环无环时都成立**，只是一个很弱的正确说法。

## 四个选项一句话总结

- **A** 无环 ⇒ 路径长度有上界 $n-1$ ⇒ $S$ 有限。**对**
- **B** 无环 ⇒ 长度上界 $n-1$ ⇒ 长度 $n$ 存在不了。**错**
- **C** 环长 $k\le n$，多绕几圈即可超过 $n$。**对**
- **D** 环长 $k\le n<2n$（或直接看空串）。**对**`,pitfalls:String.raw`## 误区一：把「长度 $n$」当成「$n$ 个顶点」

字符串长度 $=$ 边数。长度 $n$ 需要 $n$ 条边、$n+1$ 个顶点。无环图最多 $n-1$ 条边，所以 B 是必然错的，不需要找特例也能判断。

## 误区二：以为「唯一字符」表示边标记互不相同

题干括号已经写明：**不同边可以标记相同字符**。这只影响「不同路径是否拼出不同字符串」，不影响长度的上下界。

## 误区三：把路径读成简单路径

若路径不允许重复顶点，则含环时长度同样不超过 $n-1$，C 也就错了，B、C 同时为假、题目无解。判卷时的读法是：**能沿环继续走**。

## 误区四：觉得 A 需要数一数 $S$ 的大小

A 只问「有限还是无限」，不需要给出个数。有限个顶点序列 ⇒ 至多有限条路径 ⇒ $S$ 有限。`,extension:String.raw`## 追问一：$S$ 无限是否等价于 $G$ 有环？

**等价。** 无环 ⇒ 有限（A）；有环 ⇒ 长度无上界 ⇒ $S$ 无限（把 C 的论证反复用即可）。所以「$G$ 有环」与「$S$ 是无限集」互为充要条件。

## 追问二：把 B 改成「存在长度为 $n-1$ 的字符串」还对吗？

**不对。** B 的错误不是「数值差 1」，而是它把一个与图结构无关的量当成了必然结论。

- $n=2$、无边：最长长度 $0$；
- $n=3$、$v_1\to v_2\to v_3$：最长长度 $2=n-1$，这时才恰好存在；
- $n=4$、只有 $v_1\to v_2$：最长长度 $1$。

存在多长的字符串，取决于图的**最长路径**，与 $n$ 没有必然关系。

## 追问三：有环时 $S$ 一定包含任意长的字符串吗？

**是，每个长度都取得到。** 走法允许重复顶点和边，只要图中有环，从环上某个顶点出发沿环连续走 $L$ 步，就得到长度 $L$ 的字符串，因此有环时 $S$ 包含**所有**长度 $L\ge 0$ 的字符串，而不只是「无上界」。环长 $k$ 决定的只是「恰好走回起点」的那些长度是 $k$ 的倍数；$k=2$、$n=5$ 时长度 $5$ 也存在（如 $v_1\to v_2\to v_1\to v_2\to v_1\to v_2$，走 5 条边）。`}},{id:`insertion-sort-comparison-counts`,questionNumber:9,title:`直接插入排序的比较次数`,type:`题目`,date:`2026-09-30`,chapter:`排序 · 直接插入排序`,tags:[`直接插入排序`,`比较次数`,`复杂度分析`,`有序程度`],summary:`按直接插入排序的元素比较次数，比较四个序列的升序排序过程。`,source:`用户提供的截图标注为“2026 · 第9题 · 2分”；原始试卷出处未独立核验，解析为本站推导。`,content:String.raw`使用直接插入排序对序列进行升序排序，以下比较次数最少的是（ ）

- **A．** 30,27,56,41,80,95,69
- **B．** 31,43,26,55,63,99,77
- **C．** 61,84,51,23,34,91,40
- **D．** 93,32,48,81,50,21,72`,attachments:[{name:`查看原题截图`,path:`insertion-sort-comparison-counts/question.png`}],solution:{answer:String.raw`**选 B。** B 共比较 8 次；A 为 9 次，C、D 各为 16 次。`,explanation:String.raw`## 计数规则

从第 2 个元素开始，将当前元素依次与前面已排序部分的元素从右向左比较。每比较一个实际数组元素计 1 次；遇到小于或等于当前元素的元素就停止，若已到数组最前面也停止，抵达数组前端不另计一次。只计元素比较，不计第一个元素、移动或赋值。

以下各串依次表示插入第 2 至第 7 个元素时的比较次数：

- **A**：$1+1+2+1+1+3=9$ 次。
- **B**：$1+2+1+1+1+2=8$ 次。
- **C**：$1+2+3+4+1+5=16$ 次。
- **D**：$1+2+2+3+5+3=16$ 次。

B 的比较总数最少，为 8 次。`,pitfalls:String.raw`- 把第一个元素也算作一次比较；它只是初始的已排序部分，不发生比较。
- 把元素右移、赋值或交换的次数算进比较次数。
- 插入位置到达数组前端时，不再额外计一次“越界比较”。
- 把比较次数等同于逆序对数或交换次数；它们不是这里的计数对象。
- 凭序列看起来是否短、是否“更有序”直接选；应按每次插入的实际比较逐项计数。`,extension:String.raw`- **最好情况**：序列已升序，每次插入只与紧邻前驱比较一次，共 $n-1$ 次。
- **最坏情况**：序列严格降序，第 $i$ 个元素需与此前 $i-1$ 个元素比较，总计 $1+2+\cdots+(n-1)=\frac{n(n-1)}{2}$ 次。
- 每次插入中，元素每向左越过一个位置，就与该位置的元素比较一次；若没有到达最前端，还会与最终停在其前面的元素比较一次。因此比较次数等于越过的位置数，再加上可能存在的一次终止比较。

比较次数较少通常说明已排序前缀更有序。`}},{id:`system-hierarchy-levels`,questionNumber:12,title:`计算机系统层次：组成与实现的区分`,type:`题目`,date:`2026-09-30`,chapter:`计算机系统概述 · 系统层次结构`,tags:[`系统层次结构`,`指令集体系结构`,`计算机组成`,`计算机实现`],summary:`辨析 ISA、计算机组成（微架构）与计算机实现的层次关系。`,source:`用户提供的题目截图标注为“2026 · 第12题 · 2分”；截图未显示原始答案。解析按标准 408 教材模型推导，未核验官方答案。`,content:String.raw`下列有关计算机的系统层次的叙述，错误的是（ ）

- **A．** 最上层是应用软件层
- **B．** 指令集体系结构是软件和硬件的接口
- **C．** 计算机组成（即微架构）属于指令集体系结构的物理实现层
- **D．** 操作系统可通过 ISA 进行抽象，向上层软件提供服务`,attachments:[{name:`查看原题截图`,path:`system-hierarchy-levels/question.png`}],solution:{answer:String.raw`**选 C。** 计算机组成（微架构）是 ISA 的逻辑实现，物理实现属于计算机实现；原始答案未在截图中显示，本结论由标准 408 教材模型推导。`,explanation:String.raw`A．在题目采用的分层视图中，应用软件位于最上层；其下是操作系统等系统软件，因此该项成立。

B．ISA 规定程序员可见的指令、寄存器等属性，是软件与硬件的分界面，因此该项成立。

C．该项把“逻辑实现”和“物理实现”混为一谈。计算机组成（微架构）是 ISA 的逻辑实现；计算机实现才是微架构的物理实现，因此该项错误。

D．操作系统依赖 ISA 所定义的机器接口来管理硬件，并向上层软件提供抽象与服务，因此该项成立。这里说操作系统利用 ISA 接口，不是说 ISA 属于软件。

~~~tree
应用软件
  系统软件（操作系统）
    ISA（指令集体系结构）
      微架构（计算机组成，逻辑实现）
        数字逻辑 / 器件
~~~`,pitfalls:String.raw`- 把“计算机组成”当成物理实现：组成（微架构）是逻辑实现；物理实现是计算机实现。
- 把 ISA 当成硬件或软件：ISA 是程序员可见的接口，位于软硬件分界面。
- 把“操作系统是硬件之上的第一层抽象”误解为 OS 取代或定义 ISA，或把 ISA 当作 OS 的软件组成：OS 位于 ISA 之上，但依赖 ISA 管理硬件并向上提供服务。
- 混淆“最上层”与高级语言层：本题给定的层次视图以应用软件为最上层；高级语言不是题干这组层次中的一层。
- 混用 ISA、微架构与实现：分别对应程序员可见的规范、逻辑组织和物理落地。`,extension:String.raw`- 追问：两个处理器采用相同 ISA、不同微架构，可能兼容运行同一程序但性能不同。这说明 ISA 规定软件可见行为，不唯一规定内部组织。
- 追问：操作系统为什么既依赖 ISA，又能向应用屏蔽硬件细节？OS 按 ISA 规定的接口执行特权操作、管理资源，再把硬件差异封装成进程、文件等上层抽象。`}},{id:`float32-rounding`,title:`单精度浮点数的舍入策略`,type:`知识点`,date:`2026-09-30`,chapter:`数据的表示 · 浮点数舍入`,tags:[`IEEE 754 单精度`,`舍入策略`,`就近取偶`,`保护位/舍入位/粘着位`],summary:`用 G/R/S 位判断单精度舍入，并看中点、负数方向与阶码进位。`,content:String.raw`## 格式先摆清楚

单精度 binary32 由符号位 1 位、阶码 8 位、尾数字段 23 位组成；正规数的阶码偏移量是 127，尾数前有隐藏的最高位 1。因此有效位数是 24 位：隐藏的 1 加上存储的 23 位。阶码为 $E$ 的正规数区间内，相邻数间距是 $2^{E-23}$；本节围绕 $[1,2)$，间距为 $2^{-23}$。

把保留的 24 位有效数后面三类信息记作 G、R、S：G 是紧接保留位的保护位，R 是再下一位舍入位，S 是其余位的逻辑或（有任意一个 1 就记 1）。

## 例 1 — 一个必须舍入的数

取

$$
x=1+2^{-23}+2^{-24}+2^{-26}=\frac{67108877}{67108864}=1.0000001937150955\ldots
$$

保留 24 位得到 $1+2^{-23}$；后续位为 G/R/S = 101：$2^{-24}$ 是 G，$2^{-25}$ 是 0，$2^{-26}$ 使 S 为 1。它严格大于半个间距，按默认的就近取偶进到上方候选。

- 下方候选：$1+2^{-23}=\frac{8388609}{8388608}=1.0000001192092896$。
- 上方候选：$1+2^{-22}=\frac{4194305}{4194304}=1.000000238418579$。
- 舍入结果：上方候选，binary32 位模式 00111111100000000000000000000010。

## 例 2 — 恰好一半（tie）

取正数 $x=1+3\cdot2^{-24}=\frac{16777219}{16777216}=1.0000001788139343\ldots$。它正好在下方候选 $1+2^{-23}$ 与上方候选 $1+2^{-22}$ 的中点，G/R/S = 100。下方候选的有效整数是 $2^{23}+1$（奇数），上方是 $2^{23}+2$（偶数），所以就近取偶选上方。

对同一个正数，四种方向结果如下：

- 就近取偶（默认）：$1+2^{-22}=\frac{4194305}{4194304}$，位模式 00111111100000000000000000000010。
- 朝零：$1+2^{-23}=\frac{8388609}{8388608}$，位模式 00111111100000000000000000000001。
- 朝 $+\infty$：$1+2^{-22}=\frac{4194305}{4194304}$，位模式 00111111100000000000000000000010。
- 朝 $-\infty$：$1+2^{-23}=\frac{8388609}{8388608}$，位模式 00111111100000000000000000000001。

负数例子用 $-x$，它是相同绝对值的中点：

- 就近取偶：$-\frac{4194305}{4194304}$，位模式 10111111100000000000000000000010。
- 朝零：$-\frac{8388609}{8388608}$，位模式 10111111100000000000000000000001。
- 朝 $+\infty$：$-\frac{8388609}{8388608}$，位模式 10111111100000000000000000000001。
- 朝 $-\infty$：$-\frac{4194305}{4194304}$，位模式 10111111100000000000000000000010。

## 例 3 — 舍入引起阶码进位

取 $x=2-2^{-24}=\frac{33554431}{16777216}=1.9999999403953552$。保留部分是 $1.11111111111111111111111_2$（23 个尾数位全为 1），后续 G/R/S = 100，正好在该数与 2 之间的中点。保留尾数全 1，按就近取偶进位后变为全 0，阶码加 1，结果为 2。

- 舍入前的下方数：$2-2^{-23}=\frac{16777215}{8388608}$，位模式 00111111111111111111111111111111。
- 上方候选及舍入结果：$2$，位模式 01000000000000000000000000000000（符号 0，阶码 10000000，尾数全 0）。
- 结果的阶码远未达到全 1；不会溢出为无穷大。

## 为什么只存 G/R/S 三位就够

G=0 时舍弃部分小于半个 ULP；G=1 且 R 或 S 为 1 时，舍弃部分严格大于一半。只有 G/R/S=100 是恰好一半的 tie，配合保留部分最低位即可执行就近取偶。

## 易错点

- tie 不是总向上入；就近取偶看保留结果的最低位，选偶数有效整数。
- 隐藏位也计入有效位数：24 位有效数不等于 24 位尾数字段。
- 十进制 $0.1$ 不能用有限二进制小数精确表示，存入 binary32 时需要舍入。
- 尾数舍入进位后要重新规格化，并检查阶码是否溢出；本例进到 2，但没有溢出。
- 朝零不是对负数向下取整；朝零向数轴上的 0 靠近，截断负数的小数部分也不是朝 $-\infty$。
- 单精度是 24 位有效精度，其中只有 23 位显式存储在尾数字段。`},{id:`float32-12-1-rounding`,questionNumber:14,title:`单精度下 12.1 的机器数与舍入`,type:`题目`,date:`2026-09-30`,chapter:`数据的表示 · 浮点数表示与舍入`,tags:[`IEEE 754 单精度`,`就近取偶`,`十进制转二进制`,`机器数`,`舍入`],summary:`把十进制 12.1 转成单精度机器数：拆规格化形式、判 GRS、再拼十六进制，并分辨截断选项与阶码写错的选项。`,source:`用户提供的截图标注为“2026 · 第14题 · 2分”；截图显示正确答案为 B，截图原解析（1.5125 × 2^3 的十进制拆法）与本页推导结论一致。`,content:String.raw`已知用 IEEE 754 单精度浮点数表示浮点型变量，采用就近舍入（中间值取偶数）。若浮点型变量 $x$ 为 $12.1$，则 $x$ 的机器数是（ ）

- **A．** 4141 9999H
- **B．** 4141 999AH
- **C．** 41B0 CCCCH
- **D．** 41B0 CCCDH`,attachments:[{name:`查看原题截图`,path:`float32-12-1-rounding/question.png`}],solution:{answer:String.raw`**选 B。** 机器数为 4141 999AH，它对应的值是 $12.100000381469727$，与 $12.1$ 的偏差只有 $3.8\times10^{-7}$。

A 是把多余位直接截断的结果，C、D 的阶码多 1，数值约 22.1，量级就错了。`,explanation:String.raw`## 1. 先写规格化形式，定阶码

$$
12.1 = 1100.0001100110011001100110011\ldots_2 = 1.1000001100110011001100110011\ldots_2\times 2^{3}
$$

阶码真值是 3，加上偏移量 127：

$$
E = 3+127 = 130 = 10000010_2,\qquad \text{符号位} = 0.
$$

## 2. 取 23 位有效数，看后面的 GRS

保留位（隐含的最高位 1 之外的 23 位）是：

$$
1\,0000011001100110011001
$$

再往后的三位决定怎么舍：第 24 位是保护位 G，第 25 位是舍入位 R，更低位做逻辑或得粘着位 S。这里 $0.1$ 的二进制是 $0.0001100110011\ldots$，循环节是 0011，所以

$$
G=1,\quad R=0,\quad S=1\quad\Longrightarrow\quad \text{GRS}=101.
$$

**GRS = 101 表示被丢弃的部分严格大于半个 ULP**，所以按就近舍入要进位，保留部分加 1：

$$
10000011001100110011001 \;\to\; 10000011001100110011010
$$

注意：这不是「中间值」（tie）的情况，所以「取偶数」这条规则**根本没被用上**——它只在 GRS = 100、丢弃部分恰好等于半个 ULP 时才起作用。

## 3. 拼成机器数

$$
\underbrace{0}_{\text{符号}}\;\underbrace{10000010}_{\text{阶码 130}}\;\underbrace{10000011001100110011010}_{\text{尾数 23 位}}
$$

按 4 位一组写成十六进制：

$$
0100\,0001\,0100\,0001\,1001\,1001\,1001\,1010 = \text{4141 999AH}.
$$

## 4. 三个错项错在哪

- **A．4141 9999H**：尾数是 $10000011001100110011001$，等于把多余位直接截断（朝零舍入），对应值 $12.099999427795410$，不是就近舍入的结果。
- **C．41B0 CCCCH**：阶码字段是 $10000011_2=131$，等于按 $2^4$ 归一，数值约 $22.1$，量级不对。
- **D．41B0 CCCDH**：同样是阶码多 1，只是尾数最低位又加 1。

**判据**：先看阶码（$41\mathbf{41}$ 与 $41\mathbf{B0}$ 就是 $2^3$ 与 $2^4$ 的区别），再用 GRS 决定尾数末位。`,pitfalls:String.raw`- 以为 $12.1$ 能精确表示：$0.1$ 的二进制是无限循环小数，单精度下必然要舍入。
- 只截不断：直接砍掉第 24 位及以后就得到 A，正是「朝零舍入」的答案。
- 把 GRS = 101 当成中间值去取偶：中间值是 100；101 严格大于半个 ULP，一律进位。
- 阶码偏移量写成 128 或忘记加 127：本例 3 必须加 127 得 130 = 10000010。
- 十六进制拆分错位：$41B0$ 与 $4141$ 只差一位阶码，却是差一倍的量级，必须按 1+8+23 的字段边界分组。
- 把 $12.1$ 的循环节当成 0011 整体循环：规格化后小数点后是 $1000001100110011\ldots$，前 6 位是 $100000$，循环从第 7 位才开始。`,extension:String.raw`**问：如果 $x$ 恰好落在两个相邻单精度数的正中间，「取偶数」会怎么选？**

**答：** 取偶数指的是让舍入结果的**尾数最低位为 0**。以 $12.1$ 附近为例，相邻两个单精度数是 $12.099999427795410$（尾数末尾 …1001，奇数）和 $12.100000381469727$（尾数末尾 …1010，偶数），它们的中点恰好是 $12.099999904632568$。这个中点用 GRS 表示为 $100$（丢弃部分恰好是半个 ULP）：按就近取偶选尾数为偶的那个，也就是本题答案 4141 999AH；「逢半必入」在这个中点上给出同一个位模式，两种规则只在「取偶数方向」与「一律向上取」冲突的场合才会分开。

**问：单精度存 $12.1$ 的相对误差有多大？**

**答：** 存下来的值是 $12.100000381469727$，绝对误差约 $3.81\times10^{-7}$，相对误差约 $3.15\times10^{-8}$，量级是 $2^{-25}$。这与 24 位有效精度相符：$12.1$ 在 $[8,16)$ 区间，ULP $=2^{3-23}=2^{-20}\approx9.5\times10^{-7}$，而本次舍入只用到半个 ULP 附近的分辨力。`}},{id:`isa-specified-things`,questionNumber:16,title:`指令集体系结构与微架构的区分`,type:`题目`,date:`2026-09-30`,chapter:`计算机系统概述 · 指令集体系结构`,tags:[`指令集体系结构`,`微架构`,`中断机制`,`虚拟存储`,`超级流水线`],summary:`辨析指令集体系结构规定的程序员可见接口与微架构实现选择。`,source:`用户提供的截图标注为“2026 · 第16题 · 2分”；截图显示正确答案为 D。`,content:String.raw`下列不是由指令集体系结构规定的是（ ）

- **A．** 输入输出指令
- **B．** 采用向量中断
- **C．** 虚拟存储管理方式
- **D．** 指令流水线是否使用超级流水线技术`,attachments:[{name:`查看原题截图`,path:`isa-specified-things/question.png`}],solution:{answer:String.raw`**选 D。** 用户提供的截图显示正确答案为 D；按标准分类，超级流水线是微架构（计算机组成）的实现选择，不由 ISA 规定。`,explanation:String.raw`## ISA 规定了什么

判断标准：ISA 规定“做什么”，微架构决定“怎么做”。ISA 是软件与处理器之间的程序员可见约定。

- **指令集与指令格式：** 定义操作及编码字段；例如 RISC-V 的 add 指令格式。
- **数据类型与数据表示：** 规定整数等类型及字节序、对齐约定；例如 x86-64 采用小端字节序。
- **程序员可见的寄存器组织：** 规定寄存器名称、数量、宽度与语义；例如 RISC-V 的 x0 恒为零。
- **寻址方式：** 规定指令如何形成操作数地址；例如基址寄存器加偏移量寻址。
- **I/O 指令与 I/O 编址方式：** 规定访问设备的程序员可见方法；例如 x86 的 IN/OUT 端口 I/O，或内存映射 I/O。
- **中断与异常的机器级机制：** 规定中断类型、向量/向量表约定及中断返回机制；例如 x86 的 IDT 与 IRET。中断控制器电路和优先级仲裁逻辑属于实现。
- **存储模型与地址转换约定：** 规定虚拟地址宽度、分页支持、页大小选项及相关系统寄存器；例如 x86 的 CR3、RISC-V 的 satp 是体系结构可见的页表基址/地址转换控制寄存器。
- **特权级与系统指令：** 规定特权状态及切换接口；例如管态/目态切换所用的系统调用与返回机制。

## 选项判断

- **A．输入输出指令：** 属于机器指令的一类，构成指令集，是 ISA 规定的程序员可见接口。
- **B．采用向量中断：** 中断机制属于机器级机制；中断类型、向量/向量表约定及中断返回机制可由 ISA 规定，控制器电路和优先级仲裁是实现细节。
- **C．虚拟存储管理方式：** 地址转换机制及相关程序员可见约定属于体系结构；操作系统负责具体管理策略，因此不能据此判为 ISA 无关。
- **D．超级流水线技术：** 属于流水线组织与处理器实现优化，是微架构选择，不是 ISA 规定的功能或接口。`,pitfalls:String.raw`- 把虚拟存储视为纯操作系统事务；地址转换的体系结构约定仍由 ISA/体系结构定义。
- 把页表级数当成 ISA 完全不管的东西；实际上页表格式、级数与翻译模式常由 ISA 规定或限定（如 x86-64 的 4 级/5 级分页、RISC-V 的 Sv39/Sv48），操作系统在架构允许的模式中选择、配置并维护页表。
- 把中断控制器如何接线或优先级仲裁逻辑当成 ISA 规定；ISA 规定的是机器级中断接口与可见机制。
- 把流水线等实现技术误当成体系结构规定；超级流水线属于微架构。
- 混淆“指令集体系结构”与“计算机组成”：前者定义接口，后者实现接口；不是凡涉及硬件就一定属于 ISA。`,extension:String.raw`- 追问：同一 ISA 的处理器采用不同流水线深度、超级流水线、Cache 层次/容量、乱序执行和分支预测，会怎样影响同一程序的性能而不破坏兼容性？
  - **答：** 流水线加深或采用超级流水线可提高时钟频率，但会增加流水线开销及分支误预测代价；更大的/多级 Cache 可减少平均访存等待；乱序执行可隐藏独立指令的等待，分支预测可减少控制冒险停顿。这些选择改变运行时间、吞吐量与功耗。同一份符合该 ISA 的二进制仍能运行，是因为处理器保留相同的指令语义、寄存器语义、异常/中断等程序员可见行为；微架构优化不能改变这些可见行为。性能可以不同，程序所依赖的 ISA 结果与接口不能因此改变。
- 追问：虚拟存储中，哪些属于 ISA/体系结构约定，哪些由操作系统决定？
  - **答：** 虚拟地址宽度、是否支持分页、页大小选项、页表格式/级数（翻译模式）以及页表基址寄存器与地址转换机制属于体系结构约定或架构限定；例如 x86 的 CR3、RISC-V 的 satp 是体系结构可见的系统寄存器，x86-64 的 4 级/5 级分页与 RISC-V 的 Sv39/Sv48 都是架构给出的翻译模式。操作系统在架构允许的模式中选择并配置所用模式、建立与维护页表，并决定页面分配、置换算法与缺页处理流程。`}},{id:`kernel-mode-operations`,questionNumber:23,title:`内核模式执行的操作`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · 运行机制`,tags:[`内核模式`,`用户模式`,`系统调用`,`特权指令`,`运行机制`],summary:`辨析内核模式与用户模式下的操作，并梳理常见内核工作。`,source:`用户提供的截图标注为“2026 · 第23题 · 2分”，截图显示正确答案为 C。`,content:String.raw`下列操作中，在内核模式执行的是（ ）

- **A．** 编译程序
- **B．** 链接程序
- **C．** 装入程序
- **D．** 命令解释程序`,attachments:[{name:`查看原题截图`,path:`kernel-mode-operations/question.png`}],solution:{answer:String.raw`**选 C。** 答案依据是用户提供的截图，截图显示正确答案为 C。装入（把可执行文件装入内存并启动进程）所需的特权工作——分配内存、建立页表与地址映射、创建进程、设置入口——由内核在内核模式完成。`,explanation:String.raw`## 判据

内核模式（管态）能执行特权指令、访问核心资源；用户模式（目态）只能执行非特权指令，需要核心资源时通过系统调用陷入内核。

## 逐项判断

- **A．编译程序**：编译程序是用户空间的应用，在用户态执行；它读取源文件、生成目标文件，不因编译本身而拥有内核权限。
- **B．链接程序**：链接程序也是用户空间的应用，在用户态执行；它组合目标文件并解析符号，不是内核特权操作。
- **C．装入程序**：把可执行文件装入内存并启动进程这项工作，需要分配内存、建立页表和地址映射、创建进程并设置入口，这些特权工作由内核在内核模式完成；现代系统中属于 execve 等系统调用在内核中的工作。注意区分：用户态的启动器/动态链接器（如 ld.so）本身运行在用户态，它只是请求内核完成映射与装载，本题问的是装入职能，不是某个名叫 loader 的用户程序。
- **D．命令解释程序**：命令解释程序（shell）本身也是用户态程序。它解析命令并为用户发起 fork、exec 等系统调用，真正创建进程、装入程序和切换执行的是内核。不能因为 shell 能启动程序，就把 shell 本身误判为内核程序。

## 常见的内核模式操作

- **系统调用的内核处理**：处理文件读写（read、write）、进程创建与终止（fork、execve、exit）、内核内存管理（物理页分配、地址空间与映射调整），以及进程间通信的内核部分；例如 read 进入内核后由内核检查文件描述符、访问文件系统并复制数据。
- **中断与异常处理**：响应时钟中断、缺页异常和陷阱；例如进程访问尚未映射的页面时触发缺页异常，内核分配或调入页面并更新映射。
- **进程与线程管理**：执行调度和上下文切换；例如时钟中断后内核判断当前进程时间片耗尽，保存其状态并切换到另一进程。
- **设备驱动与 I/O**：启动 DMA、读写设备寄存器，并执行 in、out 等特权 I/O 指令；例如磁盘驱动配置设备寄存器并启动 DMA 传输。
- **特权指令与体系结构控制**：修改控制寄存器和页表基址，切换地址空间并维护 TLB；例如上下文切换时切换 CR3（x86）或 satp（RISC-V），必要时刷新相关 TLB 项。hlt、cli 等特权指令也只能由内核按体系结构规则执行。
- **时间管理**：维护系统时钟、单调时钟和定时器；例如内核处理时钟中断并更新系统计时，为定时等待和调度提供依据。
- **文件系统元数据操作**：维护目录项、inode、权限和分配信息；例如创建文件时由内核文件系统更新目录和 inode 元数据。
- **模块与驱动加载**：将内核模块或设备驱动装入内核并完成注册；例如内核验证并加载模块，使其驱动程序可接管设备。

## 看起来像内核、其实在用户态

- 编译器和链接器通常是用户空间程序，执行时处于用户态。
- shell（命令解释程序）负责解析命令、组织参数并发起系统调用，本身处于用户态。
- 编辑器与一般用户程序也运行在用户态；需要文件或设备服务时通过操作系统接口请求内核。
- 库函数不等同于系统调用。格式化、字符串处理等普通库代码通常在用户态执行；只有内部需要操作系统服务并触发系统调用时，才从用户态陷入内核。
- 动态链接器负责装载和解析共享库，通常是用户空间程序；它可能请求内核映射文件或内存，但自身不因此变成内核代码。
- printf 的格式化部分通常在用户态完成；真正向文件或设备写出数据时，才通过 write 等系统调用进入内核。`,pitfalls:String.raw`- 把 shell 或命令解释程序误认为内核：shell 是用户态程序，发起系统调用不等于它本身在内核态执行。
- 把编译或链接误认为特权操作：它们通常是用户空间程序的工作。
- 把库函数与系统调用混为一谈：库函数可只在用户态运行，也可在需要内核服务时调用系统调用。
- 混淆内核模式与内核线程：内核模式是 CPU 的执行特权级；内核线程是由内核管理的执行实体，概念不同。
- 以为只有系统调用才会进入内核模式：中断和异常也会使处理器转入内核的处理入口。
- 以为用户态程序一定不能碰 I/O：用户程序不能直接执行受限的特权 I/O 操作，但可通过驱动和系统调用间接完成 I/O。`,extension:String.raw`**问：用户程序直接执行 in、out 这类特权指令会发生什么？**

**答：** 处理器会检测到当前特权级不足，触发保护异常（常见为一般保护异常或特权指令异常，具体名称由体系结构决定），转入内核异常处理流程。内核通常报告非法操作并终止该进程；用户程序应通过系统调用或操作系统提供的设备接口请求 I/O。

**问：从用户态进入内核态的典型入口有哪些，分别由谁触发？**

**答：** 典型入口有三类：系统调用由正在运行的用户程序主动执行系统调用指令或调用相应接口触发；外部中断由设备或时钟等硬件事件触发；异常/陷阱由当前指令执行引发，例如缺页异常由非法或尚未映射的访问触发，断点陷阱由调试指令触发。处理器按体系结构切换到内核入口，由内核处理后再决定返回或调度其他执行流。`}},{id:`process-image`,title:`进程映像：进程在内存里由什么组成`,type:`知识点`,date:`2026-09-30`,chapter:`操作系统 · 进程与线程`,tags:[`进程映像`,`进程实体`,`PCB`,`进程上下文`,`地址空间布局`,`线程共享`],summary:`按 408 教材口径拆开进程映像（PCB + 程序段 + 数据段），补上系统实现里的堆、用户栈、内核栈，并区分映像、上下文与线程共享的部分。`,source:`组成部分依据 Silberschatz《操作系统概念》第 3 章（经 UIC 课程笔记核对：正文/数据/堆/栈 + PCB 内容）与 TLDP《Processes and Process Context》中 process image 的四要素（代码/数据/栈（含用户栈与内核栈）/PCB）；「进程映像 = PCB + 程序段 + 数据段」的教材口径转引自公开课程笔记（汤小丹《计算机操作系统》第二章），未直接核对纸质教材原文；地址空间布局依据 Linux 内核文档（x86_64 内存布局、进程地址空间章节）。`,content:String.raw`## 一句话

**进程映像（进程实体）= 一个进程在内存里的全部静态内容**：PCB + 程序段 + 数据段，再加上运行时要用的堆和栈。

它说的是「内存里存了哪些东西」，不是「此刻运行到哪里」。后者叫**进程上下文**，见下面第 4 节。

## 1. 组成部分

按 408 教材口径是三件套，系统实现上还要再加两块：

- **PCB（进程控制块，在内核空间）**：进程存在的唯一标志。含标识信息（PID、父进程 PID、用户）、处理器状态保存区（通用寄存器、PC、程序状态字、栈指针）、调度信息（状态、优先级、队列指针）、存储管理信息（页表/段表指针）、资源与 I/O 信息（打开文件表、已分配设备）、记账信息。
- **程序段（代码段、正文段）**：要执行的指令。只读、可被多个进程共享，因此代码必须是可重入的（运行中不修改自身）。
- **数据段**：已初始化的全局变量与静态变量（data）＋未初始化变量（bss）。默认各进程私有，不共享。
- **堆**：malloc/new 动态申请的内存，向高地址方向增长，由运行时库与内核共同管理。
- **栈（用户栈）**：函数参数、返回地址、局部变量，向低地址方向增长。堆和栈从两端相向生长，相遇时要么栈溢出，要么申请失败。

教材常把堆、栈并进「数据段」或单独提一句；**内核栈**和寄存器现场属于系统级上下文（内核空间），不算用户地址空间里的映像。

## 2. 拿一段程序对号入座

~~~c
int g = 1;                 /* 数据段：已初始化的全局变量 */
int h;                     /* 数据段：bss，未初始化 */
int main(void) {
    int a = 2;             /* 栈：局部变量 */
    char *p = malloc(16);  /* 堆：这次 malloc 拿到的 16 字节 */
    return a;
}
~~~

一句话记：**全局/静态 → 数据段，局部 → 栈，动态申请 → 堆，指令 → 代码段，管理信息 → PCB。**

## 3. 地址空间大致长什么样（典型 Linux）

从高地址到低地址（典型 Linux x86_64）：

- 高地址端：内核空间（内核栈、PCB）
- 命令行参数 / 环境变量
- 用户栈（向下增长）
- 空闲区
- 堆（向上增长）
- bss / data
- 程序段（text）
- 低地址端

方向感很重要：**代码段在最底、栈从最顶往下长，中间是堆往上长**。内核空间不在用户地址空间里，进程不能直接访问。

## 4. 映像、上下文、程序，三者别混

- **程序**：磁盘上的可执行文件，静态的指令序列。
- **进程映像（进程实体）**：装入内存后的静态内容——PCB + 程序段 + 数据段 + 堆 + 栈。
- **进程上下文**：运行现场。通常分成三层：
  - **用户级上下文**：用户地址空间（映像里属于用户态的部分）、用户栈与用户态寄存器内容；
  - **系统级上下文**：PCB、内核栈、页表等内核数据结构；
  - **寄存器上下文**：PC、程序状态字、通用寄存器、栈指针。

关系一句话：**映像是"摆在内存里的东西"，上下文是"运行时现场"，进程切换保存和恢复的是上下文（寄存器 + PCB），映像本身不搬动。**

## 5. 线程拿走了映像的哪些部分

- **线程共享**：代码段、数据段、堆、以及进程打开的文件等资源。
- **线程独有**：自己的栈、自己的寄存器（PC、栈指针、通用寄存器）、线程 ID。
- 所以：**进程是资源分配单位（映像是容器），线程是 CPU 调度单位**；同一进程内线程切换不需要切换地址空间。

## 6. 易错点

- 把 PCB 画进用户地址空间：PCB 在内核空间，用户程序看不到也改不了。
- 把「映像」当成「上下文」：映像里没有 CPU 寄存器的当前值，寄存器现场保存在内核栈/PCB 中。
- 忘记进程至少有两个栈：**用户栈 + 内核栈**；内核栈属于系统级上下文，不在用户地址空间。
- 以为代码段一定是私有的：只读可共享，fork 后父子通常共享代码段，写时复制主要作用在数据页上。
- 以为「数据段装的是所有变量」：局部变量在栈，动态分配在堆。
- 以为页表在进程的地址空间里：每个进程一套页表，但页表本身放在内核中，由 PCB 的存储管理信息指向。
- 把「进程切换」与「线程切换」等同：前者要换页表/地址空间，后者不换。`}],wm=[{id:`wangdao-mock1-major-41`,questionNumber:41,title:`邻接矩阵的强连通分量、顶点度数与最小生成树`,type:`题目`,date:`2026-09-30`,chapter:`图 · 邻接矩阵 / 连通性 / 最小生成树`,tags:[`邻接矩阵`,`强连通分量`,`出度与入度`,`最小生成树`,`Prim`,`Kruskal`],summary:`给一个 5 阶邻接矩阵，三问：强连通分量个数、读一段 C 函数的功能并求返回值、无向图最小生成树的算法选择与权值。`,source:`用户提供的截图，页脚为「408 模拟 · 26 王道 8 套卷」（含公众号水印）；截图未附官方答案，本页结论均由本站独立复算：强连通分量用可达矩阵、函数返回值按 C 代码逐项模拟、最小生成树用 Prüfer 序列穷举 125 棵生成树验证。`,content:String.raw`## 二、综合应用题

(41)（10 分）某有向图 $G$ 的邻接矩阵如下所示，顶点从 0 开始编号，回答下列问题。

$$
\begin{bmatrix}
0 & 3 & 1 & 3 & 5 \\
3 & 0 & 1 & 2 & 4 \\
1 & 1 & 0 & 1 & 1 \\
3 & 2 & 1 & 0 & 1 \\
5 & 4 & 1 & 1 & 0
\end{bmatrix}
$$

**1）** 图 $G$ 共有多少个强连通分量？

**2）** 对于下列函数 $f\{\}$，说明其功能，并写出函数调用 $f(\&G,3)$ 的返回值。

~~~c
int f(MGraph *G, int i){
    int d = 0, j;
    for(j = 0; j < G->n; j++){
        if(G->edges[i][j]) d++;
        if(G->edges[j][i]) d++;
    }
    return d;
}
~~~

**3）** 假设图 $G$ 是无向图，若要求该图的最小生成树，从节省时间开销的角度考虑，应采用哪种算法？计算该图的最小生成树的权值（树中所有边的权值之和）。`,attachments:[{name:`查看原题截图`,path:`wangdao-mock1-major-41/question.png`}],solution:{answer:String.raw`**1）1 个。** 邻接矩阵对称，每条边的两个方向都存在，5 个顶点两两互相可达，整个图就是一个强连通分量。

**2）功能：** 统计顶点 $i$ 的出度与入度之和，也就是有向图中顶点 $i$ 的度；**$f(\&G,3)$ 的返回值为 8**（出度 4 + 入度 4）。

**3）应采用 Prim（普里姆）算法**：该图 $n=5$、$E=10=C(5,2)$，是完全图 $K_5$，属稠密图，邻接矩阵实现的 Prim 是 $O(n^2)$，优于 Kruskal 的 $O(E\log E)$。**最小生成树权值 = 4**（四条权值全为 1 的边，如 $2-0,\ 2-1,\ 2-3,\ 2-4$ 构成的星形树）。`,explanation:String.raw`## 1）强连通分量个数

邻接矩阵是对称的：$a_{ij}\neq 0$ 处必有 $a_{ji}\neq 0$。作为有向图看，每条边都成了一对方向相反、权值相同的弧。

于是从任一顶点出发都能走到其余任何顶点（本例是完全图，任意两点直接相连），5 个顶点属于同一个强连通分量：

$$
\text{强连通分量个数}=1,\qquad \text{该分量}=\{0,1,2,3,4\}.
$$

## 2）函数功能与返回值

循环 $j$ 从 $0$ 到 $n-1$，每轮做两次计数：

- **G->edges[i][j]** 非零时计数：数的是**第 $i$ 行的非零元素个数**，即从 $i$ 发出的边数——**出度**；
- **G->edges[j][i]** 非零时计数：数的是**第 $i$ 列的非零元素个数**，即进入 $i$ 的边数——**入度**。

所以函数功能是：**返回顶点 $i$ 的出度与入度之和**，也就是有向图中顶点 $i$ 的度。

本题第 3 行是 $[3,2,1,0,1]$，非零 4 个；第 3 列是 $[3,2,1,0,1]^T$，非零 4 个。因此

$$
d = 4+4 = 8,\qquad f(\&G,3)=8.
$$

顺带一提：本题矩阵对称，每个顶点的出度、入度都是 4，所以 $f$ 对 0～4 每个顶点都返回 8。若对角线有非零元（自环），该元素会在两次判断中各计一次。

## 3）算法选择与最小生成树权值

**先看图的稠密程度。** $n=5$，$E=10=n(n-1)/2$，是完全图，属稠密图：

- **Prim（邻接矩阵实现）**：$O(n^2)$，与边数无关，适合稠密图，且邻接矩阵直接可用；
- **Kruskal**：要先按权值排序，$O(E\log E)$。本例 $E\log_2 E = 10\times3.32\approx33$，大于 $n^2=25$。

所以从节省时间开销考虑选 **Prim**。

**再算权值。** 各边权值按大小排：$1,1,1,1,1$（边 $0-2,\ 1-2,\ 2-3,\ 2-4,\ 3-4$），然后是 $2$（$1-3$）、$3$（$0-1$、$0-3$）、$4$（$1-4$）、$5$（$0-4$）。

Prim 从顶点 2 出发，每次挑连接已选集合与未选集合的最小边：

~~~tree
2
  0（权 1）
  1（权 1）
  3（权 1）
  4（权 1）
~~~

四条边权值都是 1，用满 $n-1=4$ 条边即连通全部顶点：

$$
W = 1+1+1+1 = 4.
$$

**下界检查：** 生成树必须恰好有 $n-1=4$ 条边，而每条边的权都是不小于 1 的正整数，故任何生成树的权值 $\ge 4$；上面已构造出权值 4 的生成树，所以最小值就是 4。

**权值为 4 的最小生成树一共 3 棵**（用 Prüfer 序列穷举 125 棵生成树验证）：

- $0-2,\ 1-2,\ 2-3,\ 2-4$（以 2 为中心的星形树）
- $0-2,\ 1-2,\ 2-3,\ 3-4$
- $0-2,\ 1-2,\ 2-4,\ 3-4$`,pitfalls:String.raw`- **看到「有向图」就以为强连通分量不止一个。** 关键看矩阵是否对称：对称意味着每条边双向，本题整体强连通，答案是 1，不是 5。
- **函数功能只答「求度数」。** 要写清「第 $i$ 行数出度、第 $i$ 列数入度」，并给出「出度 + 入度」这个有向图中度的定义。
- **忘记对角线。** 本题 $a_{ii}=0$ 不用处理；若对角线非零，自环会在两次判断中各加一次，需要额外说明。
- **算法选择只写「Prim」不给理由。** 判分点在稠密/稀疏与复杂度的比较：稠密图选 Prim $O(n^2)$，稀疏图选 Kruskal $O(E\log E)$。
- **算权值时误选大边。** $0-4$ 权 5、$1-4$ 权 4、$0-1$ 与 $0-3$ 权 3 都不进最小生成树；最小树只用权值 1 的边。
- **把「最小生成树唯一」当成前提。** 本题就有 3 棵权值同为 4 的最小生成树，答出任一棵即可，但要知道不唯一。`,extension:String.raw`**问：如果邻接矩阵不对称（真正的有向图），强连通分量怎么求？**

**答：** 逐个顶点求可达集合，或者求传递闭包：顶点 $i,j$ 互相可达当且仅当可达矩阵中 $R_{ij}=R_{ji}=1$。互相可达关系是等价关系，等价类的个数就是强连通分量数。规模大时用 Tarjan 或 Kosaraju 算法，一次 DFS 顺序即可 $O(n+E)$ 求完。

**问：为什么本题最小生成树的权值不可能是 3？**

**答：** 生成树必须连通全部 $n=5$ 个顶点，恰好含 $n-1=4$ 条边；每条边的权都是正整数且最小为 1，所以权值下界是 $4\times1=4$。下界同时可达（四条权 1 的边已构成生成树），故最小值为 4。

**问：若把题目换成稀疏图（例如 $n=10^4$、$E=2n$），该选哪个算法？**

**答：** 选 Kruskal。它的开销主要是按边排序 $O(E\log E)$，只与边数有关；而邻接矩阵实现的 Prim 是 $O(n^2)$，在 $n$ 很大而边很少时会远慢于 Kruskal。稀疏图常用邻接表 + 堆优化的 Prim（$O(E\log n)$），但按 408 默认口径答 Kruskal 即可。`}},{id:`wangdao-mock1-major-42`,questionNumber:42,title:`二叉树高度与平衡判断`,type:`题目`,date:`2026-09-30`,chapter:`树与二叉树 · 高度与平衡`,tags:[`二叉树`,`后序遍历`,`树高`,`平衡判断`,`递归`],summary:`设计一次后序遍历，同时求二叉树高度并判断每个结点是否平衡；比较重复求高的做法并分析复杂度。`,source:`用户提供的原题截图；以下算法、例树结论及复杂度均由本站独立推导和脚本复核。`,content:String.raw`## 二、综合应用题

(42)（13 分）假设二叉树采用二叉链表存储，试设计算法求该二叉树的高度，并判断该二叉树是否平衡。本题中的「平衡」是指二叉树中任意一个结点的左、右子树的高度差的绝对值不超过 1。二叉树的结点的定义如下：

~~~c
typedef struct BiTNode{
    int data;                      //数据域
    struct BiTNode *lchild, *rchild; //左、右孩子指针
}BiTNode, *BiTree;
~~~

回答下列问题：
1）给出算法的基本设计思想。
2）根据设计思想，采用 C 或 C++ 语言描述算法，关键之处给出注释。`,attachments:[{name:`查看原题截图`,path:`wangdao-mock1-major-42/question.png`}],solution:{answer:String.raw`**设计思想：** 后序遍历，自底向上一次遍历同时求每棵子树的高度与平衡标志。空树高度为 0，视为平衡；非空结点的高度为 $\max(左高,右高)+1$，该结点平衡当且仅当左右子树均平衡且 $|左高-右高|\le 1$。

时间复杂度为 $O(n)$，每个结点只处理一次；递归栈空间为 $O(h)$，其中 $h$ 为树高。

~~~c
typedef struct {
    int height;
    int balanced;
} Result;

Result heightAndBalance(BiTree T) {
    Result r = {0, 1};
    if (T == NULL) return r;  /* 空树：高度 0，视为平衡 */

    Result left = heightAndBalance(T->lchild);
    Result right = heightAndBalance(T->rchild);

    r.height = (left.height > right.height
                ? left.height : right.height) + 1;
    int diff = left.height - right.height;
    r.balanced = left.balanced && right.balanced
                 && diff <= 1 && diff >= -1;
    return r;
}
~~~

调用函数并将结果保存在变量 r 中后，r.height 是树高，r.balanced 非 0 表示平衡。`,explanation:String.raw`## 一、为什么用后序遍历

结点的高度依赖左右子树的高度，所以先递归处理左右孩子，再处理当前结点，即后序遍历。递归函数为每棵子树返回一对结果：$(高度, 是否平衡)$。左右结果已经算出后，当前结点用常数次比较即可同时确定高度和平衡标志。

- 空树返回 $(0,真)$。
- 非空结点高度为 $\max(h_L,h_R)+1$。
- 当前结点平衡当且仅当 $B_L\land B_R\land |h_L-h_R|\le 1$。
- 各结点只访问一次，故时间 $O(n)$；递归栈最多 $h$ 层，空间 $O(h)$。

若先写一个求高度的递归函数，再对每个结点分别调用它检查左右子树，最坏会重复遍历同一批后代。例如高度为 $n$ 的单链，每个结点都触发子树高度计算，工作量为 $n+(n-1)+\cdots+1=\Theta(n^2)$。这比一次后序遍历的 $O(n)$ 更差。

## 二、平衡例：A(B(D,E),C)

~~~binary
A
  L: B
    L: D
    R: E
  R: C
~~~

叶结点 $D,E,C$ 的高度均为 1，左右子树高度差均为 0。

- $B$：左右高为 $(1,1)$，高度 $2$，差 $|1-1|=0$，平衡。
- $A$：左右高为 $(2,1)$，高度 $3$，差 $|2-1|=1$，平衡。

所以树高为 3，整棵树平衡。

## 三、不平衡例：A(B(D,E(F)),C)

~~~binary
A
  L: B
    L: D
    R: E
      R: F
  R: C
~~~

叶结点 $D,F,C$ 的高度均为 1，左右子树高度差均为 0。

- $E$：左右高为 $(0,1)$，高度 $2$，差 $|0-1|=1$，平衡。
- $B$：左右高为 $(1,2)$，高度 $3$，差 $|1-2|=1$，平衡。
- $A$：左右高为 $(3,1)$，高度 $4$，差 $|3-1|=2$，不平衡。

所以树高为 4，但整棵树不平衡。这里每个结点都必须检查；仅比较根结点或者只比较整棵树的某种总体高度都不能替代逐结点的平衡条件。

## 四、哨兵值变体

也可让递归函数返回高度：空树返回 0；子树不平衡时返回 $-1$；父结点发现任一子树返回 $-1$ 或左右高度差超过 1，就返回 $-1$，否则返回当前高度。

~~~c
int heightOrUnbalanced(BiTree T) {
    if (T == NULL) return 0;

    int left = heightOrUnbalanced(T->lchild);
    if (left == -1) return -1;
    int right = heightOrUnbalanced(T->rchild);
    if (right == -1) return -1;

    int diff = left - right;
    if (diff > 1 || diff < -1) return -1;
    return (left > right ? left : right) + 1;
}
~~~

该写法能用 $-1$ 表示「不平衡」，并在发现不平衡后短路停止额外递归；但树不平衡时返回值只有 $-1$，拿不到实际高度。题目若同时要求高度与平衡状态，应采用结构体返回两个结果，或另用输出参数/全局标志保存高度与状态。`,pitfalls:String.raw`- **把「平衡」误作整棵树的总体高度差。** 定义要求每个结点的左右子树高度差都不超过 1；例树中只有根 A 的差为 2，就足以判定不平衡。
- **漏掉空树边界。** 空树高度为 0，且视为平衡；这也使叶结点的递归计算自然得到高度 1。
- **只检查根结点。** 左右子树自身也可能已经不平衡，必须把子树的平衡标志合并到父结点。
- **对子树重复求高度。** 对每个结点再遍历后代求高，退化树最坏达到 $O(n^2)$；后序遍历返回高度可避免重复工作。
- **忽略已不平衡的子树。** 合并时必须要求左右子树都平衡；哨兵写法发现子树返回 $-1$ 后应立即向上传播。`,extension:String.raw`**问：为什么后序遍历能在 $O(n)$ 内同时得到高度和平衡状态？**

**答：** 每个结点仅访问一次；左右孩子返回各自的高度和平衡标志后，当前结点用常数时间求出本结点的两个结果，所以总工作量与结点数成正比。

**问：若要求返回树高且树不平衡怎么办？**

**答：** 返回包含 height 和 balanced 字段的结构体，或通过输出参数/全局标志分别保存高度与是否平衡。若只返回高度或用 $-1$ 哨兵标记不平衡，出现不平衡时就不能同时获得真实高度。

**问：换成带平衡因子的 AVL 思路有什么不同？**

**答：** 可将平衡因子定义为 $BF=h_L-h_R$，每个结点检查 $|BF|\le 1$；判定树是否平衡仍不需要修改树。AVL 插入或删除后可能通过旋转恢复平衡，旋转是维护操作，不是本题只判定时要做的事。`}},{id:`wangdao-mock1-major-43`,questionNumber:43,title:`Cache 命中率分析`,type:`题目`,date:`2026-09-30`,chapter:`计算机组成原理 · Cache 映射与命中率`,tags:[`Cache`,`时间局部性`,`空间局部性`,`直接映射`,`组相联`,`LRU`,`命中率`],summary:`分析向量点积的时间、空间局部性，并按直接映射与 2 路组相联 Cache 逐次模拟访问命中情况。`,source:`用户提供的题目截图，页脚为「408 模拟 · 26 王道 8 套卷」；答案由逐次 Cache 模拟独立复算。`,content:String.raw`**43）（11 分）Cache 命中率分析**

以下是计算两个向量点积的程序段：

~~~c
float dotproduct(float x[8], float y[8]){
    float sum = 0.0;
    int i;
    for(i = 0; i < 8; i++)
        sum += x[i] * y[i];
    return sum;
}
~~~

回答下列问题：

1）分析访问数组 $x$ 和 $y$ 时的时间局部性和空间局部性。

2）假定数据 Cache 采用**直接映射**方式，Cache 容量为 32B，每个主存块的大小为 16B；编译器将变量 sum 和 i 分配在寄存器中，内存按字节编址，数组 $x$ 存放在以 0000 0040H 开始的 32B 的连续存储区中，数组 $y$ 则紧跟在 $x$ 后进行存放。该程序数据访问的命中率是多少？要求说明每次访问时 Cache 的命中情况。

3）将 2）中的数据 Cache 改用 **2 路组相联映射方式，并采用 LRU 替换算法，块的大小改为 8B**，其他条件不变，则该程序数据访问的命中率是多少？

4）在 2）中条件不变的情况下，将数组 $x$ 定义为 float x[12]，则数据访问的命中率是多少？`,attachments:[{name:`查看原题截图`,path:`wangdao-mock1-major-43/question.png`}],solution:{answer:String.raw`**1）时间局部性差，空间局部性好。** 在本次顺序遍历中，每个 $x[i]$、$y[i]$ 各访问一次，不会再次访问同一元素；相邻元素地址连续、步长为 4B。

**2）命中率为 0%。** 16 次访问全部缺失。

**3）命中率为 50%。** 16 次访问中 8 次缺失、8 次命中。

**4）命中率为 75%。** 16 次访问中 4 次缺失、12 次命中。`,explanation:String.raw`## 1）局部性

循环按 $i=0,1,\ldots,7$ 顺序读取两个连续数组。一个元素在该程序段中只读取一次，故**时间局部性差**；元素地址步长为 4B，Cache 装入一个块时也会带入相邻元素，故**空间局部性好**。

## 2）直接映射，块 16B

$x$ 起址为 $0x40$，$y$ 起址为 $0x60$。元素地址分别为 $0x40+4i$、$0x60+4i$。Cache 有 $32/16=2$ 行；主存块号为 $\lfloor 地址/16\rfloor$，行号为块号模 2。

- $x_0$–$x_3$ 位于块 4、行 0；$x_4$–$x_7$ 位于块 5、行 1。
- $y_0$–$y_3$ 位于块 6、行 0；$y_4$–$y_7$ 位于块 7、行 1。
- 每对交替访问的 $x_i,y_i$ 映射到同一行，后访问者立即替换前者。序列：$x_0$ M，$y_0$ M，$x_1$ M，$y_1$ M，$x_2$ M，$y_2$ M，$x_3$ M，$y_3$ M，$x_4$ M，$y_4$ M，$x_5$ M，$y_5$ M，$x_6$ M，$y_6$ M，$x_7$ M，$y_7$ M。

因此缺失 16 次、命中 0 次，命中率 $0/16=0\%$。

## 3）2 路组相联，块 8B，LRU

Cache 共 $32/8=4$ 行，即 2 组、每组 2 路。组号为 $\lfloor 地址/8\rfloor\bmod2$。$x$ 从块 8 开始，$y$ 从块 12 开始；二者对应块在各自被用到的区间内同组，但不同块可同时放入该组的两路。每块含两个 float，因此每个块的第二个元素命中；换到新块时发生缺失。

访问序列：$x_0$ M，$y_0$ M，$x_1$ H，$y_1$ H，$x_2$ M，$y_2$ M，$x_3$ H，$y_3$ H，$x_4$ M，$y_4$ M，$x_5$ H，$y_5$ H，$x_6$ M，$y_6$ M，$x_7$ H，$y_7$ H。

共缺失 8 次、命中 8 次，命中率 $8/16=50\%$。

## 4）将 x 改为 float x[12]

$x$ 占 $12\times4=48$B，故 $y$ 起址为 $0x40+48=0x70$。仍按直接映射、32B 容量、16B 块计算：$x$ 的八个被访问元素仍位于块 4、5（行 0、1）；$y$ 的八个元素位于块 7、8（行 1、0）。前四轮两数组落在不同 Cache 行，块内后续访问命中；$i=4$ 时双方换入新块，随后块内访问命中。

访问序列：$x_0$ M，$y_0$ M，$x_1$ H，$y_1$ H，$x_2$ H，$y_2$ H，$x_3$ H，$y_3$ H，$x_4$ M，$y_4$ M，$x_5$ H，$y_5$ H，$x_6$ H，$y_6$ H，$x_7$ H，$y_7$ H。

共缺失 4 次、命中 12 次，命中率 $12/16=75\%$。

## 逐次模拟脚本输出

用 Python 编写访存级模拟器：按地址除以块大小求块号，再按 Cache 组数求组号；命中时更新 LRU 顺序，缺失时按路数替换。脚本原样输出如下：

~~~text
2
x0M y0M x1M y1M x2M y2M x3M y3M x4M y4M x5M y5M x6M y6M x7M y7M
hits=0 misses=16 rate=0%
3
x0M y0M x1H y1H x2M y2M x3H y3H x4M y4M x5H y5H x6M y6M x7H y7H
hits=8 misses=8 rate=50%
4
x0M y0M x1H y1H x2H y2H x3H y3H x4M y4M x5H y5H x6H y6H x7H y7H
hits=12 misses=4 rate=75%
~~~`,pitfalls:String.raw`- 把字节地址直接比较，不先换算主存块号、行号或组号。应使用块号 $\lfloor 地址/块大小\rfloor$，再计算映射位置。
- 把 32B 容量误当成 32 行。行数是容量除以块大小；2 路时组数还要再除以 2。
- 忽略访问顺序造成的直接映射冲突：第 2 问中 $x_i$ 与 $y_i$ 交替访问并映射到同一行，故不是只计算冷缺失。
- 忘记 $x[12]$ 占 48B，$y$ 起址应由 $0x60$ 移至 $0x70$；命中率是命中次数除以总访问次数，不是缺失率。`,extension:String.raw`**问：为什么第 3 问块更小、相联度更高，命中率却低于第 2 问？**

**答：** 块从 16B 减为 8B 后，每块只含两个 float，顺序扫描八个元素需要访问四个块；第 3 问因此有 8 次冷缺失。两路能让同组的 $x$、$y$ 块共存，避免交替冲突，但抵消不了块变小带来的额外缺失。第 2 问虽有冲突抖动，$x$ 的前四项与 $y$ 的前四项分别仍在首块，具体命中率按逐次访问结果为 0%。

**问：若第 2 问改为先遍历 x 再遍历 y（各自仍访问 8 个元素），命中率是多少？**

**答：** 仍为 75%。$x$ 的 8 个 float 占 2 块，先读 $x$ 发生 2 次缺失、6 次命中；随后读 $y$ 的 2 块再发生 2 次缺失、6 次命中。总计 4 次缺失、12 次命中，共 16 次访问。这里每个块的 4 个 float 全被使用；若只访问块中部分元素，未使用部分带来的空间局部性收益会下降。

**问：块大小增大与相联度增大，对时间、空间局部性的作用有何不同？**

**答：** 增大块大小主要利用空间局部性：一次缺失带入更多相邻字节，对顺序访问有利，但可能带来无用数据、污染 Cache，并减少可容纳块数。增大相联度不增加一次带入的相邻数据，主要减少不同主存块映射到同一位置时的冲突缺失；它对空间局部性的直接利用不变，对反复访问的时间局部性则可通过减少冲突驱逐来提供帮助。`}},{id:`wangdao-mock1-major-44`,questionNumber:44,title:`单周期取指部件的数据通路`,type:`题目`,date:`2026-09-30`,chapter:`计算机组成原理 · 单周期 CPU · 取指数据通路`,tags:[`单周期 CPU`,`取指部件`,`PC`,`分支跳转`,`SignExt`,`数据通路`],summary:`分析单周期 CPU 取指部件的输入信号、顺序/分支/跳转下地址选择、PC 写使能、Jump 地址范围及符号扩展。`,source:`用户提供的题目截图（第44题，12分）；截图未附官方答案，本页结论由本站按题面与数据通路独立推导。`,content:String.raw`（44）（12 分）下图是一个单周期 CPU 取指部件的数据通路，取指操作是每条指令的公共操作，其功能是取指令并计算下一条指令的地址。若是顺序执行，则下一条指令的地址为 $PC+4$；若是跳转执行，则要根据当前指令是分支（Branch）指令还是跳转（Jump）指令，按不同的方式计算目标地址。因为指令长度为 32 位，按边界对齐存放，所以指令地址总是 4 的倍数，即最后两位总是“00”，因此 $PC$ 中只需存放前 30 位地址 $PC\langle31:2\rangle$，取指令时，指令地址 $=PC\langle31:2\rangle\mathbin{\|}\text{“00”}$（在 PC 的 30 位后拼接两位“00”）。已知 $imm16$ 为 16 位立即数，Adder 为加法器，MUX 为多路选择器，回答下列问题。

1）以上取指部件的输入信号有哪几个？各有什么作用？（不考虑时钟信号）

2）已知下一条指令地址的计算方法如下：

- 顺序执行时：$PC\langle31:2\rangle\leftarrow PC\langle31:2\rangle+1$。
- Branch 指令跳转条件满足时：$PC\langle31:2\rangle\leftarrow PC\langle31:2\rangle+1+SignExt[imm16]$。
- Jump 指令跳转执行时：$PC\langle31:2\rangle\leftarrow PC\langle31:28\rangle\mathbin{\|}Target\langle25:0\rangle$。

请给出以上三种情况下的输入信号，信号有效为 1、无效为 0，其中分支指令要考虑跳转条件不满足和满足两种情况。

3）为什么在该数据通路中 $PC$ 不需要写“使能”控制信号？

4）对于无条件跳转指令，当前可跳转的最大和最小地址之间共包含多少条指令？

5）图中的 SignExt 部件起什么作用？`,attachments:[{name:`查看原题截图`,path:`wangdao-mock1-major-44/question.png`}],solution:{answer:String.raw`**1）输入信号：** 题目要求不考虑时钟信号，因此只数控制与数据输入：$Branch$、$Jump$（两个 MUX 的选择信号）、$Zero$（与 $Branch$ 相与后决定分支是否成立）、$imm16$（参与分支目标地址计算）。此外，$PC\langle31:28\rangle\parallel Target\langle25:0\rangle$ 中的 $Target\langle25:0\rangle$ 是当前所取指令的字段，图中没有画出它从指令存储器引回的连线；若按“部件外接信号”来数，它也应算作一个输入。$PC$ 是部件内部状态寄存器，不是外部输入；时钟 $Clk$ 按题意不计。

- $Branch$：表示当前指令是否为分支指令；与 $Zero$ 共同控制分支是否成立。
- $Jump$：表示当前指令是否为无条件跳转指令；有效时选择 Jump 目标地址。
- $Zero$：来自比较/减法结果的零标志；本数据通路中 $Zero=1$ 表示分支条件满足，$Zero=0$ 表示不满足。
- $imm16$：16 位分支偏移量，经符号扩展后与 $PC+1$ 相加。
- $Clk$：时钟输入，在有效时钟沿更新 $PC$；第1问按题意不计入输入数。

**2）信号取值：**

- **顺序执行：** $Branch=0$，$Jump=0$，$Zero=\times$，$imm16=\times$；下地址取 $PC\langle31:2\rangle+1$。
- **Branch 条件满足：** $Branch=1$，$Jump=0$，$Zero=1$，$imm16$ 为有效偏移；下地址取 $PC\langle31:2\rangle+1+SignExt[imm16]$。
- **Branch 条件不满足：** $Branch=1$，$Jump=0$，$Zero=0$，$imm16=\times$；分支选择条件 $Branch\land Zero=0$，下地址退回顺序通路 $PC\langle31:2\rangle+1$。
- **Jump：** $Branch=\times$，$Jump=1$，$Zero=\times$，$imm16=\times$；下地址取 $PC\langle31:28\rangle\mathbin{\|}Target\langle25:0\rangle$。$Jump$ 优先选择跳转目标，Branch 不影响结果。

其中 $\times$ 表示任意值或无关项。

**3）** 取指是每条指令都要执行的公共操作。每个时钟周期都必须把选出的下一条地址写入 $PC$，没有需要让 $PC$ 保持不变的周期，因此不需要单独设置写使能信号。

**4）$2^{26}=67{,}108{,}864$ 条。** Jump 地址高 4 位固定，低 28 位可变，目标区域大小为 $2^{28}$ 字节；每条指令占 4 字节，所以指令数为 $2^{28}/4=2^{26}=67{,}108{,}864$。

**5）** $SignExt$ 将 16 位立即数符号扩展为 30 位，与 $PC\langle31:2\rangle$ 的位宽一致。它保留立即数的正负号，使分支偏移既可向前也可向后。`,explanation:String.raw`## 1）沿信号路径理解输入

$PC$ 保存当前指令地址的高 30 位；顺序地址通过加 1 得到（因为低两位恒为 $00$，字节地址上的 $+4$ 等价于 30 位字地址上的 $+1$）。分支通路把符号扩展后的立即数加到顺序地址上；分支选择由 $Branch\land Zero$ 决定。Jump 控制最上层 MUX 选择拼接得到的跳转目标。

题目第1问明确排除时钟，所以输入信号答案是 $Branch$、$Jump$、$Zero$、$imm16$ 共 4 个；若按物理接口把时钟计入，则共 5 个。$PC$ 是寄存器内部状态，不列为输入。

## 2）信号组合与下地址

分支成立的选择条件不是单独的 $Branch$，而是 $Branch\land Zero$：只有当前指令是分支且零标志为 1，才选择偏移地址。条件不成立时使用顺序地址。Jump 由独立控制信号选择拼接目标；其选择优先于分支通路，因此表中 $Branch$、$Zero$、$imm16$ 可视为无关项。

## 3）地址表示与范围

指令地址低两位恒为 $00$，所以 $PC\langle31:2\rangle$ 每次顺序加 1 就对应字节地址加 4。Jump 目标的高 4 位沿用当前 $PC\langle31:28\rangle$，低 28 位由 $Target\langle25:0\rangle$ 加末尾两位 $00$ 构成；因此目标落在高 4 位固定的 $2^{28}$ 字节区域内。

## 4）SignExt

$SignExt$ 将 16 位二进制补码立即数符号扩展为 30 位，与 $PC\langle31:2\rangle$ 的宽度匹配。扩展保留符号位，使偏移可以为正也可以为负，分支目标因而既能在当前顺序地址之后，也能在之前。`,pitfalls:String.raw`- **把 $PC$ 当作外部输入。** 它是取指部件内部保存当前地址的状态寄存器；第1问不计时钟时，列 $Branch$、$Jump$、$Zero$、$imm16$ 四个输入。
- **只看 $Branch$，忽略 $Zero$。** 条件不满足时 $Branch\land Zero=0$，仍走顺序地址通路。
- **把 Jump 地址空间算成整个 32 位空间。** 高 4 位固定，当前可跳区域只有 $2^{28}$ 字节。
- **把字节数误当指令条数。** 指令每条占 4 字节，须用 $2^{28}/4$。
- **把 SignExt 说成零扩展。** 符号扩展保留负偏移的含义，分支可以向后跳。`,extension:String.raw`**问：为什么 $PC$ 只存高 30 位，取指时再拼接“00”？**

**答：** 指令按 4 字节边界对齐，地址最低两位恒为 $00$，这两位不必存入寄存器。$PC$ 存 $PC\langle31:2\rangle$ 可少存两位；送入指令存储器时拼回“00”即可还原字节地址。顺序执行时字节地址加 4，等价于寄存器中的 30 位值加 1。

**问：如果把 Branch 与 Jump 合并成一个控制信号，会丢失什么信息？**

**答：** 会丢失当前应选择哪一种目标地址的区别。Branch 需要先检查 $Zero$，成立时用 $PC+1+SignExt[imm16]$，不成立时用顺序地址；Jump 不检查 $Zero$，直接使用拼接的目标地址。一个控制位无法单独表达这两种选择规则。

**问：无条件跳转与条件跳转在信号上的本质差异是什么？**

**答：** 条件跳转必须由 $Branch$ 和条件结果 $Zero$ 共同决定是否采用偏移目标，只有 $Branch\land Zero=1$ 才跳；无条件跳转由 $Jump=1$ 直接选择 Jump 目标，不受 $Zero$ 影响。`}},{id:`wangdao-mock1-major-45`,questionNumber:45,title:`生产者/销售者同步：限制两类产品的累计产量差`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · 信号量与进程同步`,tags:[`信号量`,`生产者-消费者`,`互斥与同步`,`进程同步`],summary:`两个生产者共用无限仓库，销售者取货；用四个信号量保证入库/出库互斥、仓库非空，并限制 A、B 的累计产量差。`,source:`用户提供的原题截图，题号（45），标注为“408 模拟·26 王道 8 套卷”；未独立核验原始试卷出处。解析为本站按题意推导。`,content:String.raw`（45）（8 分）假设有两个生产者进程 A、B 和一个销售者进程 C，它们共享一个无限大的仓库，生产者每次循环生产一件产品，然后入库供销售者销售；销售者每次循环从仓库取出一件产品进行销售。如果不允许同时入库，也不允许边入库边出库，而且要求生产产品 A 和 B 的件数关系满足：$-n \le A 的件数 - B 的件数 \le m$，其中 $n$、$m$ 是正整数，但对仓库中产品 A 和产品 B 的件数无上述要求。用信号量机制写出 A、B、C 三个进程的工作流程。`,attachments:[{name:`查看原题截图`,path:`wangdao-mock1-major-45/question.png`}],solution:{answer:String.raw`设 $a$、$b$ 分别为 A、B 的累计产量。需要四个信号量：

~~~c
semaphore mutex = 1;   /* 入库、出库操作互斥 */
semaphore full  = 0;   /* 仓库中现有产品总数 */
semaphore sa    = m;   /* A 可继续生产的额度 */
semaphore sb    = n;   /* B 可继续生产的额度 */

A:  while (1) {
        P(sa);
        生产一件 A;
        P(mutex);
        入库 A;
        V(mutex);
        V(sb);
        V(full);
    }

B:  while (1) {
        P(sb);
        生产一件 B;
        P(mutex);
        入库 B;
        V(mutex);
        V(sa);
        V(full);
    }

C:  while (1) {
        P(full);
        P(mutex);
        从仓库取一件产品（A 或 B 均可）;
        V(mutex);
        销售该产品;
    }
~~~

信号量初值依次为：$mutex=1$、$full=0$、$sa=m$、$sb=n$。其中 $sa$、$sb$ 表示生产额度，不是仓库库存。`,explanation:String.raw`## 先分清两类约束

题目约束的是**累计产量之差**：$-n\le a-b\le m$；它不约束仓库里 A、B 各自的存量。销售者可以取任意一种产品，所以取货只需知道仓库中是否有产品，不需知道是哪一种。

## 四个信号量各管一件事

- **mutex = 1：** 保护仓库的入库、出库操作。任何时刻只允许一个进程操作仓库。
- **full = 0：** 计数仓库中现有产品总数。C 先执行 $P(full)$，确保有产品可取。
- **sa = m：** 表示 A 尚可使用的生产额度。
- **sb = n：** 表示 B 尚可使用的生产额度。

仓库无限大，不存在容量限制，因此**不设 empty（空位数）信号量**。$full$ 只需一个，因为 C 不区分产品种类。

## 额度为什么这样设置

在 A、B 的一轮生产及其额度交接完成后，保持不变式：

$$
sa=m-(a-b),\qquad sb=n+(a-b).
$$

初始时 $a=b=0$，所以 $sa=m$、$sb=n$。A 每生产一件，$a-b$ 增加 1：A 先消耗一个 $sa$ 额度，随后执行 $V(sb)$，给 B 增加一个额度。于是 $sa$ 减 1、$sb$ 加 1，正好对应不变式的变化。B 每生产一件则相反：先消耗一个 $sb$，再执行 $V(sa)$，使 $a-b$ 减 1。

两种额度都不能为负，因此：

$$
sa\ge0\Rightarrow a-b\le m,\qquad sb\ge0\Rightarrow a-b\ge -n.
$$

故累计产量差始终在题目要求的范围内。额度在每次入库完成后交接；生产者各自至多有一个生产循环在执行。

## 为什么生产不放进临界区

题目只要求**入库不能并发，也不能与出库并发**，不要求 A、B 的生产互斥。生产动作放在 $P(mutex)$ 之前，避免无谓地占住仓库互斥锁；临界区只包含实际入库或出库。C 的销售也在释放 $mutex$ 后进行。

## 同步次序

A 入库后依次执行 $V(mutex)$、$V(sb)$、$V(full)$；B 入库后依次执行 $V(mutex)$、$V(sa)$、$V(full)$。释放先后可调整，但三次 signal 都不能漏：释放仓库锁、交接另一生产者的额度、通知销售者有新产品。`,pitfalls:String.raw`- **多设 capacity 信号量：** 仓库无限大，不需要空位计数。
- **把生产也放进临界区：** 题目只要求入库/出库互斥，生产应在仓库锁外完成。
- **只用 mutex 和 full：** 会漏掉限制累计产量差的关键采分点；还需 $sa$、$sb$ 两个额度信号量。
- **额度方向写反或不解释初值：** $sa=m$、$sb=n$；A 生产后执行 $V(sb)$，B 生产后执行 $V(sa)$。
- **一个信号量兼做互斥与同步：** $mutex$ 保护临界区，$full$ 表示有货，职责不同。
- **把约束误用到库存：** 不等式约束累计生产件数差，不是仓库内两类产品的存量差。`,extension:String.raw`**追问 1：如果仓库容量改为 $k$，需要增加什么信号量？**

**答：** 增加 $empty=k$，表示空位数。生产者入库前执行 $P(empty)$，销售者出库后执行 $V(empty)$；原有 $full$ 仍表示现有产品总数。

**追问 2：如果销售者必须区分产品种类并按指定策略销售（例如轮流销售 A、B），怎么改？**

**答：** 把 $full$ 拆为 $fullA$、$fullB$ 两个计数信号量，分别记录仓库中的 A、B 产品数；生产者入库后 signal 对应的计数，C 按销售策略对所需种类执行对应的 $P(fullA)$ 或 $P(fullB)$。若严格轮流，还需另行同步轮次。

**追问 3：当 $m=n=1$ 时，两个生产者如何交替？**

**答：** $a-b$ 只能在 $-1,0,1$ 之间变化：A 最多领先 1 件，B 也最多领先 1 件。到达 $1$ 时 A 的额度用尽，必须等 B 生产；到达 $-1$ 时 B 的额度用尽，必须等 A 生产。它们不一定严格按每一件轮流，连续领先者会在差值边界等待。`}},{id:`wangdao-mock1-major-46`,questionNumber:46,title:`请求分页、二级页表与混合页大小`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · 虚拟内存 / 请求分页 / 多级页表`,tags:[`请求分页`,`二级页表`,`大页`,`FIFO`,`地址转换`,`缺页异常`],summary:`混合使用 4KB 与 4MB 页面，根据页目录项的有效位和 Page_Size 标志分析访存次数、物理地址、FIFO 置换及页目录项地址。`,source:`用户提供的原题截图；题目标注为“46）（7 分）”。未独立核验原始试卷出处；解析由本站按题设逐步复算。`,content:String.raw`（46）（7 分）请求分页、二级页表与混合页大小

某 32 位系统采用请求分页内存管理方式，页面大小可设为 4KB 或 4MB，按字节编址，页表所在的页框大小均为 4KB，页表项大小为 4 字节。对于 4KB 的页，采用二级分页方式，其中 32 位逻辑地址的划分如下：

$$
\underbrace{P_1}_{10\text{ 位页目录号}}\;\underbrace{P_2}_{10\text{ 位页号}}\;\underbrace{d}_{12\text{ 位页内偏移量}}
$$

高 10 位为页目录号，中间 10 位为页号，低 12 位为页内偏移。页表项的条目有一个标志位 Page_Size，当 Page_Size 置为 1 时，表示页面大小为 4MB，而不是标准的 4KB，页目录的条目会绕过内层页表而直接指向 4MB 的页框，且地址的低 22 位指向 4MB 页内偏移量。该系统的逻辑地址和物理地址均为 32 位。执行某进程时，页基址寄存器的值为 7F65 4000H，假设该进程的页目录表内容如下所示：

- 目录号 0H：页框号 FF101H，有效位 1，装入时刻 120，Page_Size 0
- 目录号 1H：页框号 B1A60H，有效位 0，装入时刻 40，Page_Size 0
- 目录号 2H：页框号 254H，有效位 1，装入时刻 180，Page_Size 1
- 目录号 3H：页框号 202H，有效位 0，装入时刻 20，Page_Size 1
- 目录号 4H：页框号 CD404H，有效位 1，装入时刻 220，Page_Size 0
- 目录号 5H：页框号 163H，有效位 1，装入时刻 300，Page_Size 1
- ……
- 目录号 BAH：页框号 EF807H，有效位 0，装入时刻 60，Page_Size 0

回答下列问题：

1）某指令周期内访问的虚拟地址分别是 013FF35AH 和 015F123DH，则获得这两个地址所对应的数据分别需要至少进行多少次访存？

2）虚拟地址 015F123DH 转换后得到的物理地址是什么？这个数据所在的页框大小是多少？

3）假设系统采用固定分配局部置换策略为该进程分配两个 4KB 的页框和两个 4MB 的页框，对这组不同大小的页均采用 FIFO 置换算法，当该进程执行到 404 时刻时，要访问虚拟地址 00D40866H 的数据，则地址转换后得到的物理地址是什么？

4）在进程执行过程中，若访问虚拟地址 2EBCA234H 时发生缺页，在缺页异常处理过程中，要为所缺页分配页框并更新相应的页目录表项，则本次更新的页目录表项的物理地址是什么？`,attachments:[{name:`查看原题截图`,path:`wangdao-mock1-major-46/question.png`}],solution:{answer:String.raw`1）013FF35AH：至少 **3 次访存**；015F123DH：至少 **2 次访存**。

2）物理地址为 **58DF123DH**，所在页框大小为 **4MB**。

3）物理地址为 **95140866H**。

4）要更新的页目录项物理地址为 **7F6542E8H**。`,explanation:String.raw`## 先拆地址：页目录号是高 10 位

4KB 页地址拆成 $P_1/P_2/d$，位宽依次为 10、10、12；4MB 页直接按 $P_1$/低 22 位偏移拆分。等价计算为：$P_1=A\gg22$，$P_2=(A\gg12)\mathbin{\&}3FF_H$，$d=A\mathbin{\&}FFF_H$，4MB 偏移为 $A\mathbin{\&}3FFFFF_H$。

- $013FF35A_H$：$P_1=004_H$，$P_2=3FF_H$，$d=35A_H$；低 22 位为 $3FF35A_H$。
- $015F123D_H$：$P_1=005_H$，$P_2=1F1_H$，$d=23D_H$；低 22 位为 $1F123D_H$。
- $00D40866_H$：$P_1=003_H$，$P_2=140_H$，$d=866_H$；低 22 位为 $140866_H$。
- $2EBCA234_H$：$P_1=0BA_H$，$P_2=3CA_H$，$d=234_H$；低 22 位为 $3CA234_H$。

## 1）至少访存次数

$013FF35A_H$ 的目录号是 4H，目录项有效且 Page_Size=0，使用 4KB 页。无 TLB 时，先访页目录，再访二级页表，最后访数据，共 **3 次**。

$015F123D_H$ 的目录号是 5H，目录项有效且 Page_Size=1，使用 4MB 页。目录项直接给出页框，不访问二级页表；访目录和访数据，共 **2 次**。

## 2）4MB 页的物理地址

5H 目录项给出页框号 $163_H$。4MB 页框大小为 $2^{22}=400000_H$ 字节，因此物理地址为页框基址加低 22 位偏移：

$$
163_H\times400000_H+1F123D_H=58C00000_H+1F123D_H=58DF123D_H.
$$

数据所在页框大小为 **4MB**。

## 3）按 4MB 页框池独立执行 FIFO

$00D40866_H$ 的 $P_1=003_H$，对应目录项有效位为 0，发生缺页；该项 Page_Size=1，所以缺失的是 4MB 页。题设为该进程分别分配 4KB 与 4MB 页框池，置换按页面大小分别进行，不能跨池回收。

当前有效的 4MB 页是：目录 2H 占页框 254H，装入时刻 180；目录 5H 占页框 163H，装入时刻 300。FIFO 比较装入时刻，最早的是目录 2H，因此新页复用页框 254H。该地址低 22 位偏移为 $140866_H$：

$$
254_H\times400000_H+140866_H=95000000_H+140866_H=95140866_H.
$$

## 4）页目录项的物理地址

$2EBCA234_H$ 的高 10 位目录号为 $BA_H$，该项有效位为 0，发生缺页。缺页处理要更新的是页目录表中第 $BA_H$ 项。页目录基址为 $7F654000_H$，每个目录项 4 字节：

$$
7F654000_H+BA_H\times4=7F654000_H+2E8_H=7F6542E8_H.
$$

这是页目录项本身的物理地址，不是二级页表项地址，也不是缺页数据的物理地址。`,pitfalls:String.raw`- 把 $015F123D_H$ 当二级页表处理：Page_Size=1 时绕过内层页表，只需 2 次访存。
- 把 4MB 页框号按 4KB 单位理解：页框号要乘 $4MB$，不能乘 $4KB$。
- 取低 22 位偏移时算错边界：4MB 偏移取低 22 位，不是低 20 位或低 24 位。
- FIFO 比较的是装入时刻，不是页框号大小；4KB、4MB 两个页框池分别置换，不能混在一起比较。
- 第 4 问求的是页目录项地址：页目录表基址加目录号乘 4，不是内层页表项地址或数据物理地址。
- 有效位为 0 表示不在内存，不能当成命中；第 3、4 问都要先判缺页。
- 页框大小依据 Page_Size 判定，不能只看页框号或题目中默认的 4KB 页面。`,extension:String.raw`**问：若系统有 TLB 命中，第 1 问的访存次数如何变化？**

**答：** TLB 命中时无需访页目录或页表，4KB 页只需 1 次访存取数据；4MB 页同样只需 1 次。

**问：为什么 4MB 页能省去一级页表访存？**

**答：** 页目录项直接给出 4MB 页框基址，虚拟地址低 22 位就是页内偏移，因此不用再查二级页表。代价是大页可能带来较多页内碎片；页表项数量虽减少，内部碎片可能增多。

**问：两个页框池分开做 FIFO 会带来什么影响？**

**答：** 4KB 与 4MB 页面互不干扰，回收页框只在对应尺寸的池内进行；若将两种尺寸合并计数，会错误地让一种尺寸的页淘汰另一种尺寸的页。`}}],Tm=[{id:`wangdao-mock2-major-01`,questionNumber:1,title:`二叉树递归求高度的时间复杂度`,type:`题目`,date:`2026-09-30`,chapter:`树 · 二叉树遍历与复杂度`,tags:[`二叉树`,`递归`,`时间复杂度`,`树高`],summary:`分析递归计算二叉树高度的 maxFunc：判断每个结点的访问次数，并区分时间复杂度与递归栈空间复杂度。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图未显示答案，故本题答案为本站推导。`,content:String.raw`## 一、单项选择题

(01) 设二叉树共有 $n$ 个结点，则下列程序段的时间复杂度是（ ）。

~~~c
int maxFunc(TreeNode* root){
    if (root == NULL) return 0;
    return max(maxFunc(root->left), maxFunc(root->right))+1;
}
~~~

- A．$O(\log_2 n)$
- B．$O(n)$
- C．$O(n\log_2 n)$
- D．$O(2^n)$`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-01/question.png`}],solution:{answer:String.raw`**选 B，$O(n)$。** 函数计算的是二叉树的高度；计算过程中每个非空结点只访问一次。`,explanation:String.raw`## 递归工作量

对每个非空结点，函数递归处理左、右子树各一次，再用常数时间完成比较和加一。因此，若左右子树分别有 $l$、$r$ 个结点，则

$$
T(n)=T(l)+T(r)+O(1),\qquad l+r=n-1.
$$

每个结点只进入函数一次，空指针调用也至多对应每个结点的两个孩子，合计仍为 $O(n)$，所以时间复杂度为 $\Theta(n)$。

复杂度与树的形状无关：树退化成链时仍逐个访问全部结点；完全二叉树也仍逐个访问全部结点。**max** 只比较两个结果，耗时为 $O(1)$。

函数返回的是树高，不是结点总数；返回值表示什么，不决定程序检查多少结点。递归调用栈空间为 $O(h)$，其中 $h$ 是树高，最坏情况下退化成链，空间为 $O(n)$。`,pitfalls:String.raw`- 把“求高度”误认为时间复杂度是 $O(\log n)$：高度可能很小，但函数仍需访问所有结点。
- 把 **max** 当成 $O(n)$ 操作；这里它只比较两个数，是 $O(1)$。
- 混淆时间和空间：时间是 $O(n)$；递归栈是 $O(h)$，最坏为 $O(n)$。
- 误以为链式退化会改变遍历工作量；链与完全二叉树都访问每个结点一次。`,extension:String.raw`1. **若每次递归都继续遍历整棵规模为 $n-1$ 的子树，使递推式变为 $T(n)=2T(n-1)+O(1)$，时间复杂度是什么？**

   **答：** 展开递推可得 $T(n)=\Theta(2^n)$，故为 $O(2^n)$。

2. **若改为一般树，每个结点遍历自己的孩子链表，以求所有孩子递归结果的最大值，时间复杂度如何？**

   **答：** 仍为 $O(n)$。每个结点递归访问一次，所有结点的孩子链表总共扫描 $n-1$ 条父子边；把各结点的扫描量加起来是线性的。`}},{id:`wangdao-mock2-major-02`,questionNumber:2,title:`先序与中序序列相同的二叉树形状数`,type:`题目`,date:`2026-09-30`,chapter:`树 · 二叉树遍历`,tags:[`先序遍历`,`中序遍历`,`二叉树形状`,`重复结点值`],summary:`由相同的先序与中序序列判断二叉树形状数，关键是正确处理重复结点值。`,source:`本题来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图中未显示答案，因此以下答案为本站推导。`,content:String.raw`（02）

已知某二叉树共有 5 个结点，其先序遍历和中序遍历的序列都是 “ooops”，则这样的二叉树共有（ ）种不同的形状。

- A．1
- B．3
- C．5
- D．6`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-02/question.png`}],solution:{answer:`C．5 种。`,explanation:String.raw`## 计数方法

先序序列的第一个字符是根。根在中序序列中的位置决定左右子树的结点数；由于结点值有重复，必须逐个考虑与根同值的中序位置。

记 $f(s)$ 为先序和中序序列都等于字符串 $s$ 时可得到的二叉树形状数。若根在中序位置 $k$（从 0 开始），左子树的先序序列为 $s[1..k]$，中序序列为 $s[0..k-1]$，所以两者必须相同；右子树也相应满足相同的前序、中序序列。于是

$$
f(s)=\sum_k f(s[0..k-1])f(s[k+1..])
$$

其中 $k$ 只取满足 $s[k]=s[0]$ 且 $s[1..k]=s[0..k-1]$ 的位置，空串计数为 1。

对于 “ooops”，根只能放在中序序列中连续的三个 $o$ 之一，对应 $k=0,1,2$：

- $k=0$：左子树为空，右子树序列为 “oops”，贡献 $f(\text{oops})=2$。
- $k=1$：左右子树序列分别为 “o” 和 “ops”，贡献 $f(\text{o})f(\text{ops})=1$。
- $k=2$：左右子树序列分别为 “oo” 和 “ps”，贡献 $f(\text{oo})f(\text{ps})=2$。

因此 $f(\text{ooops})=2+1+2=5$。其中 $f(\text{oo})=2$，因为两个相同值结点既可由一个作另一个的左孩子，也可作右孩子；$f(\text{ps})=f(\text{o})=f(\text{ops})=1$。

重复字符是关键：根的相同值可以对应中序序列里的多个位置。若五个字符互不相同，先序与中序首字符相同意味着根就是中序序列首字符，左子树为空；递归应用同一结论，树只能是一条右斜链，只有 1 种形状。`,pitfalls:String.raw`- 忽略重复字符，套用“先序和中序唯一确定二叉树”的结论而答 1。
- 把“形状”与结点标号方式混为一谈；本题按形状计数，每个形状只计一次。
- 只枚举树形而不检查是否存在使两种遍历都为 “ooops” 的标号，或只枚举标号而重复计算同一形状。`,extension:String.raw`- 若先序和中序序列都是 “abcde”，答案是多少？

**答：**1 种。字符互不相同，递归可知每个根都必须是当前中序序列的首字符，因此树是唯一的右斜链。

- 若先序和中序序列都是 “aaaaa”，答案是多少？

**答：**42 种。每个二叉树形状都能使先序、中序序列同为 “aaaaa”，所以形状数为第 5 个 Catalan 数：$C_5=\frac{1}{6}\binom{10}{5}=42$。`}},{id:`wangdao-mock2-major-03`,questionNumber:3,title:`二叉树第 7 层结点数的最大值`,type:`题目`,date:`2026-09-30`,chapter:`树与二叉树 · 二叉树性质`,tags:[`二叉树`,`结点数`,`层数`,`最值`,`反向约束`],summary:`一棵有 100 个结点的二叉树，第 7 层最多有多少个结点？关键是最大化目标层，同时满足相邻层结点数约束。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图中未显示答案或答案解析，以下答案为本站推导。`,content:String.raw`若一棵二叉树有 100 个结点，根结点为第 1 层，则第 7 层最多有（ ）个结点。

- **A．** 37
- **B．** 48
- **C．** 49
- **D．** 64`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-03/question.png`}],solution:{answer:String.raw`**选 B：48。**

取各层结点数为 $1,2,3,6,12,24,48$，前 7 层共 $96$ 个结点，且每层都不超过上一层的 2 倍，因此第 7 层有 48 个结点可实现。剩余 4 个结点可以放在第 8 层。

若第 7 层有 49 个结点，逐层向上取满足二叉树约束的最少结点数，得到 $1,2,4,7,13,25,49$，合计 $101$ 个，超过总数 100。因此 49 不可达，48 为最大值。`,explanation:String.raw`## 关键约束：后一层不能超过前一层的两倍

设第 $i$ 层的结点数为 $L_i$。二叉树中每个结点至多有两个孩子，因此：

$$
L_1=1,\qquad L_{i+1}\le 2L_i.
$$

要让第 7 层尽可能多，不能先假定前六层都满；应从目标层往上反推：给定 $L_7=x$，每一层至少要有 $\lceil L_{i+1}/2\rceil$ 个结点。

## 48 可以达到

令各层结点数为：

$$
1,\ 2,\ 3,\ 6,\ 12,\ 24,\ 48.
$$

逐层检查，每一层都不超过上一层的两倍；前七层合计：

$$
1+2+3+6+12+24+48=96\le 100.
$$

这是可实现的层数序列。若题目要求整棵树恰有 100 个结点，再在第 8 层放入 4 个结点即可；第 7 层的 48 个结点足以提供这些孩子位置。

## 49 不可能

若 $L_7=49$，从第 7 层逐层向上反推最少结点数：

- $L_6\ge\lceil49/2\rceil=25$
- $L_5\ge\lceil25/2\rceil=13$
- $L_4\ge\lceil13/2\rceil=7$
- $L_3\ge\lceil7/2\rceil=4$
- $L_2\ge\lceil4/2\rceil=2$
- $L_1=1$

所以前七层至少有 $1+2+4+7+13+25+49=101$ 个结点，已经超过 100。更大的 $L_7$ 需要的前层结点只会更多，因此最大值就是 48。

## 穷举复核

动态穷举所有满足 $L_1=1$、$1\le L_{i+1}\le2L_i$ 且前七层合计不超过 100 的层数序列，共得到 25,217 个有效序列；其中 $L_7=48$ 的序列有 8 个，$L_7=49$ 的序列有 0 个，最大 $L_7$ 为 48。`,pitfalls:String.raw`- **误选 37：** 先把前六层都取满，得到 $1+2+4+8+16+32=63$，剩下 $100-63=37$。这只是在“前六层全满”额外条件下的结果，不是本题最大值。
- **忽略层间约束：** $1,2,4,8,16,21,48$ 虽然总数恰为 100，但第 7 层的 48 大于第 6 层的 $2\times21=42$，不是合法二叉树层数序列。
- **只检查结点总数：** 总数不超过 100 还不够；必须同时保证每层都能由上一层的结点提供孩子。`,extension:String.raw`## 追问一：若要求前 6 层全满，第 7 层最多多少个结点？

**答：37 个。**前六层有 $1+2+4+8+16+32=63$ 个结点，100 个结点还剩 37 个；第 6 层有 32 个结点，最多可提供 64 个孩子位置，所以这 37 个结点可以放在第 7 层。

## 追问二：若整棵树有 127 个结点，第 7 层最多多少个结点？

**答：64 个。**第 7 层最多为 $2^6=64$ 个；完全二叉树前七层恰有 $1+2+4+8+16+32+64=127$ 个结点，达到上界。`}},{id:`wangdao-mock2-major-04`,questionNumber:4,title:`完全二叉树的叶结点数与最大深度`,type:`题目`,date:`2026-09-30`,chapter:`树 · 完全二叉树`,tags:[`完全二叉树`,`叶结点`,`树的深度`],summary:`已知完全二叉树有 64 个叶结点，判断可能达到的最大深度；关键是统计最后两层的叶结点。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图未显示答案，本页结论为本站推导。`,content:String.raw`**（04）** 已知一棵完全二叉树有 64 个叶结点，根结点的深度为 1，则该树可能达到的最大深度为（ ）。

- A．7
- B．8
- C．9
- D．10`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-04/question.png`}],solution:{answer:String.raw`**选 B（8）。** 深度 8、最后一层只有 1 个结点时，整棵完全二叉树恰有 64 个叶结点；枚举可知深度 9 及以上均不可能。`,explanation:String.raw`设树深度为 $h$，最后一层有 $k$ 个结点，$1\le k\le 2^{h-1}$。当 $h\ge2$ 时，第 $h-1$ 层共有 $2^{h-2}$ 个结点，其中有 $\lceil k/2\rceil$ 个结点在最后一层有孩子。其余第 $h-1$ 层结点也是叶结点，因此叶结点总数为

$$
 k+2^{h-2}-\lceil k/2\rceil=2^{h-2}+\lfloor k/2\rfloor.
$$

注意这里是 $\lfloor k/2\rfloor$，不是 $\lceil k/2\rceil$。

枚举 $h=1..10$ 及每个 $h$ 的 $k=1..2^{h-1}$，叶结点数等于 64 的情况只有：

- $h=7$：$k=64$，结点总数 $2^6-1+64=127$。
- $h=8$：$k=1$，结点总数 $2^7-1+1=128$。

所以最大深度为 8，选 B。直接运行的枚举脚本输出：

~~~c
h=7: k=64; nodeCounts=127
h=8: k=1; nodeCounts=128
~~~`,pitfalls:String.raw`- 把叶结点数直接当成最后一层结点数，会漏掉倒数第二层上没有孩子的结点。
- 把完全二叉树当成满二叉树；最后一层允许不满，但结点必须从左向右连续排列。
- 误用 $2^h$ 估算结点或叶结点数；根深度为 1 时，深度 $h$ 的满二叉树共有 $2^h-1$ 个结点。
- 把深度当成根到叶的边数；本题根结点深度为 1，深度就是层数。
- 将叶结点公式中的 $\lfloor k/2\rfloor$ 写成 $\lceil k/2\rceil$，会漏掉 $h=8,k=1$ 这个关键解。`,extension:String.raw`**追问 1：** 叶结点数为 64 的完全二叉树最少有多少个结点？

**答：** 127 个。枚举所得的最浅解为 $h=7,k=64$，总结点数为 $2^6-1+64=127$；$h=8,k=1$ 时有 128 个结点。

**追问 2：** 若题目改问可能达到的最小深度，答案是多少？

**答：** 7。枚举中最小的可行深度是 7，且 $h=7,k=64$ 时确有 64 个叶结点；深度不超过 6 的完全二叉树最多只有 $2^5=32$ 个叶结点。`}},{id:`wangdao-mock2-major-05`,questionNumber:5,title:`二叉排序树与中序线索树：判断错误说法`,type:`题目`,date:`2026-09-30`,chapter:`树与二叉树 · 二叉排序树 / 中序线索树`,tags:[`二叉排序树`,`中序遍历`,`中序后继`,`中序线索树`,`选择题`],summary:`判断关于二叉排序树结点的中序前驱与后继、中序线索树遍历，以及叶结点父结点关键字位置的说法中哪项错误。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；照片中未显示答案，以下答案与解析为本站推导。`,content:String.raw`（05）下列关于二叉树的说法中，错误的是（ ）。

- **A．** 若二叉排序树的一个结点有两个孩子，则它的中序后继结点没有左孩子，它的中序前驱结点没有右孩子
- **B．** 若二叉排序树的一个结点 $x$ 的右子树为空，且 $x$ 有一个中序后继 $y$，则 $y$ 一定是 $x$ 的祖先，且其左孩子也是 $x$ 的祖先（$x$ 可视为自身的祖先）
- **C．** 在中序线索树中，从最左边的结点开始不断地查找后继结点，不一定能遍历完树中的所有结点
- **D．** 若 $x$ 是二叉排序树的叶结点，$y$ 是其父结点，则 $y$ 的值要么是树中大于 $x$ 的值的最小关键字，要么是树中小于 $x$ 的最大关键字`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-05/question.png`}],solution:{answer:String.raw`**选 C。** 中序线索树从最左结点出发，反复查找中序后继，会按中序次序访问全树每个结点；因此 C 所说的「不一定能遍历完」错误。`,explanation:String.raw`## 逐项判断

**A 对。** 设结点 $z$ 有左右孩子。它的中序后继是右子树中最靠左的结点，按定义没有左孩子；它的中序前驱是左子树中最靠右的结点，按定义没有右孩子。

**B 对。** $x$ 没有右子树时，若它存在中序后继 $y$，就沿祖先链向上找：第一个满足「当前结点位于其左子树中」的祖先就是 $y$。因此 $y$ 是 $x$ 的祖先，而 $y$ 的左孩子也位于通向 $x$ 的祖先链上（$x$ 可视为自身祖先）。

**C 错。** 中序线索把原本为空的左、右孩子指针改作前驱、后继线索。查找后继时，若右指针是线索就直接沿线索；若右指针指向右孩子，就从右孩子出发一路向左到最左结点。每一步得到的都是中序序列中的下一个结点，从最左结点开始便会依次遍历完整个中序序列。

**D 对。** $x$ 是叶结点且 $y$ 是其父结点。若 $x$ 是 $y$ 的左孩子，$y$ 就是 $x$ 的直接中序后继，也就是严格大于 $x$ 的最小关键字；若 $x$ 是 $y$ 的右孩子，$y$ 就是 $x$ 的直接中序前驱，也就是严格小于 $x$ 的最大关键字。`,pitfalls:String.raw`- 把 C 的真假记反：中序后继链恰好串起完整的中序序列。
- 把线索当成普通孩子指针。要先区分该指针是线索还是孩子指针，再决定直接跟随还是进入子树找最左结点。
- 把 D 中左右孩子与前驱、后继对应关系弄反：左孩子对应父结点为后继，右孩子对应父结点为前驱。`,extension:String.raw`**追问一：中序线索化后，按后继遍历还需要栈吗？**

**答：** 不需要。线索保存了原本空指针位置的中序前驱或后继信息；从最左结点反复找后继即可遍历，额外辅助空间为 $O(1)$。

**追问二：如果只做了前序线索，能否仅凭这些线索、不借助其他结构完成中序遍历？**

**答：** 不能保证。前序线索记录的是前序前驱与后继，并未提供中序后继关系；中序遍历仍需利用孩子结构并借助栈、递归或额外的中序线索等手段。`}},{id:`wangdao-mock2-major-06`,questionNumber:6,title:`有向图邻接矩阵：环、强连通分量与拓扑序列`,type:`题目`,date:`2026-09-30`,chapter:`图 · 有向图 / 强连通分量 / 拓扑排序`,tags:[`有向图`,`邻接矩阵`,`有向环`,`强连通分量`,`拓扑排序`],summary:`读 5 个顶点的邻接矩阵，判断无环、强连通分量数量与拓扑序列是否存在。`,source:`用户提供的照片，题目来自「408 模拟 · 26 王道 8 套卷」；截图中未显示答案，本题结论为本站推导。`,content:String.raw`有向图的邻接矩阵 $A$ 如下所示，在下列说法中，错误的是（ ）。

~~~text
     0 1 2 3 4
 0 [ 0 1 0 0 0 ]
 1 [ 0 0 0 1 0 ]
 2 [ 0 0 0 0 1 ]
 3 [ 1 0 0 0 0 ]
 4 [ 0 0 0 1 0 ]
~~~

- Ⅰ．图中没有环
- Ⅱ．该图的强连通分量的数量为 2
- Ⅲ．拓扑序列存在

- **A．** Ⅰ
- **B．** Ⅰ、Ⅲ
- **C．** Ⅱ、Ⅲ
- **D．** Ⅰ、Ⅱ、Ⅲ`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-06/question.png`}],solution:{answer:String.raw`**选 D：Ⅰ、Ⅱ、Ⅲ 都错误。**

存在有向环 $0\to1\to3\to0$，所以Ⅰ错，图没有拓扑序列，Ⅲ错。强连通分量共有 3 个：$\{0,1,3\}$、$\{2\}$、$\{4\}$，所以Ⅱ也错。`,explanation:String.raw`## 逐条判断

### Ⅰ．图中没有环——错误

从矩阵逐行读出弧：$0\to1$、$1\to3$、$2\to4$、$3\to0$、$4\to3$。其中

$$
0\to1\to3\to0
$$

首尾回到顶点 0，构成有向环。因此图并非无环图。

### Ⅱ．强连通分量数量为 2——错误

顶点 $0,1,3$ 两两可达：它们在环上，构成一个强连通分量 $\{0,1,3\}$。

顶点 2 和 4 各自形成单元素强连通分量：$2\to4$，而 $4\to3$；从 2 或 4 可以到达环，但环上没有路径返回 2 或 4。因此它们都不能并入 $\{0,1,3\}$，彼此也不强连通。

所以三个分量是 $\{2\}$、$\{4\}$、$\{0,1,3\}$，数量为 3。

### Ⅲ．拓扑序列存在——错误

有向图存在拓扑序列，当且仅当它是有向无环图。图中已有环 $0\to1\to3\to0$，故拓扑序列不存在。

三条说法都错误，选 D。`,pitfalls:String.raw`- 只数邻接矩阵中的非零元素，不能判断有无环；要顺着弧检查是否能回到已访问顶点。
- 数强连通分量时别漏掉单元素分量：2 和 4 分别是一个分量。
- Ⅱ中的“2”是声称的分量数量，不是环的数量；本图只有一个所列出的环，而强连通分量有 3 个。
- 有向图含环时不存在拓扑序列，不能把“有环”与“仍可拓扑排序”混为一谈。`,extension:String.raw`**追问一：若要让该图有拓扑序列，最少删哪条弧？**

**答：** 删去 $3\to0$、$0\to1$、$1\to3$ 中任意一条即可。原图唯一的有向环由这三条弧组成；删去其中任意一条会打破环，其余弧不能再形成环，因此所得图是有向无环图。

**追问二：将强连通分量缩点后，图是什么结构？**

**答：** 是链 $\{2\}\to\{4\}\to\{0,1,3\}$。前两条弧分别来自 $2\to4$ 和 $4\to3$；其中 $4\to3$ 指向分量 $\{0,1,3\}$。`}},{id:`wangdao-mock2-major-07`,questionNumber:7,title:`AOE 网中时间余量最大的活动`,type:`题目`,date:`2026-09-30`,chapter:`图 · AOE 网与关键路径`,tags:[`AOE 网`,`关键路径`,`活动时间余量`,`事件最早发生时间`,`事件最迟发生时间`],summary:`给出含 6 个事件、8 个活动的 AOE 网，求时间余量最大的活动的余量。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图中的答案未显示，故本题答案与解析为本站推导。`,content:String.raw`（07）在下面的 AOE 网中，时间余量最大的活动的时间余量是（ ）。

图中事件 A 是源点，F 是汇点；活动与持续时间如下：

- $a$：A→B，持续时间 5
- $b$：A→C，持续时间 5
- $c$：A→D，持续时间 7
- $d$：B→D，持续时间 1
- $g$：B→F，持续时间 2
- $e$：C→E，持续时间 5
- $f$：E→F，持续时间 3
- $h$：D→F，持续时间 4

- **A．** 5
- **B．** 6
- **C．** 3
- **D．** 4`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-07/question.png`}],solution:{answer:String.raw`**选 B：6。** 时间余量最大的活动是 $g$（B→F），时间余量为 6。`,explanation:String.raw`## 1. 先算事件最早发生时间 $ve$

源点 $A$ 的最早发生时间为 0。其余事件取所有进入活动所能到达时间的最大值：

- $ve(A)=0$
- $ve(B)=ve(A)+5=5$
- $ve(C)=ve(A)+5=5$
- $ve(D)=\max(ve(A)+7,\ ve(B)+1)=\max(7,6)=7$
- $ve(E)=ve(C)+5=10$
- $ve(F)=\max(ve(B)+2,\ ve(D)+4,\ ve(E)+3)=\max(7,11,13)=13$

所以工程工期是 13。

## 2. 反向算事件最迟发生时间 $vl$

汇点取 $vl(F)=ve(F)=13$；其余事件取所有后续活动允许时间的最小值：

- $vl(F)=13$
- $vl(E)=vl(F)-3=10$
- $vl(D)=vl(F)-4=9$
- $vl(C)=vl(E)-5=5$
- $vl(B)=\min(vl(D)-1,\ vl(F)-2)=\min(8,11)=8$
- $vl(A)=\min(vl(B)-5,\ vl(C)-5,\ vl(D)-7)=\min(3,0,2)=0$

## 3. 逐项算活动时间余量

活动 $(i,j)$ 的时间余量为 $vl(j)-ve(i)-活动持续时间$：

- $a$（A→B）：$vl(B)-ve(A)-5=8-0-5=3$
- $b$（A→C）：$vl(C)-ve(A)-5=5-0-5=0$
- $c$（A→D）：$vl(D)-ve(A)-7=9-0-7=2$
- $d$（B→D）：$vl(D)-ve(B)-1=9-5-1=3$
- $g$（B→F）：$vl(F)-ve(B)-2=13-5-2=6$
- $e$（C→E）：$vl(E)-ve(C)-5=10-5-5=0$
- $f$（E→F）：$vl(F)-ve(E)-3=13-10-3=0$
- $h$（D→F）：$vl(F)-ve(D)-4=13-7-4=2$

最大值为 $6$，对应活动 $g$，因此选 B。余量为 0 的关键活动构成关键路径 A→C→E→F，路径长度 $5+5+3=13$。`,pitfalls:String.raw`- **只算 $vl(j)-ve(i)$，忘了减活动持续时间。** 活动余量必须是 $vl(j)-ve(i)-活动持续时间$。
- **把活动余量和事件余量混淆。** 事件余量是 $vl(i)-ve(i)$；活动余量还要结合活动起点、终点和持续时间。
- **把 $g$ 的最早开工余量当成公式。** $ve(F)-ve(B)-2=13-5-2=6$ 在本题恰好也得到 6，但一般的活动总余量按 $vl(F)-ve(B)-2$ 计算；两者相等是因为汇点 $F$ 的最早与最迟时间都为 13。
- **找错关键路径。** 本题持续时间最长的路径是 A→C→E→F，长度 13；$g$ 的活动余量为 6，并不在关键路径上。`,extension:String.raw`**追问一：本题的关键路径是哪条？**

**答：** A→C→E→F，路径长度为 $5+5+3=13$，与工程工期相同。

**追问二：如果把活动 $g$ 的持续时间从 2 改为 9，关键路径会不会变？**

**答：** 会。此时 A→B→F 的长度为 $5+9=14$，比原来的 A→C→E→F（13）长，工期变为 14；A→B→F 成为新的关键路径。此时 $g$ 的总时间余量为 0，关键路径不是多条。`}},{id:`wangdao-mock2-major-08`,questionNumber:8,title:`红黑树性质判断`,type:`题目`,date:`2026-09-30`,chapter:`树与二叉树 · 平衡二叉树与红黑树`,tags:[`红黑树`,`黑高`,`AVL树`,`平衡二叉树`,`反例构造`],summary:`判断红黑树的黑高、查找效率与平衡性质；用最小反例区分红黑树和 AVL 树。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图中未显示答案，以下答案为本站推导。`,content:String.raw`下列关于红黑树的说法中，正确的是（ ）。

- **A．** 任意一棵红黑树中红结点的数量和黑结点的数量一定相等
- **B．** 红黑树的黑高可能正好是整棵红黑树高度的一半
- **C．** 红黑树的查找效率要优于平衡二叉树
- **D．** 一棵合法的红黑树应该也是一棵平衡二叉树`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-08/question.png`}],solution:{answer:String.raw`**选 B。** 红黑树的黑高可能正好是整棵树高度的一半。`,explanation:String.raw`## 先看红黑树的三条约束

- 根结点是黑色。
- 红结点的孩子必须是黑色，即不能有相邻的红结点。
- 从任一结点到其后代 NIL 叶子的每条路径，黑结点数相同。

黑高 $bh$ 不是整棵树里黑结点的总数，而是从指定结点出发（**不含该结点本身**）到空叶 NIL 的路径上的黑结点数（NIL 计为黑），王道教材采用这一口径。按根到叶的结点层数计高度，红黑树有 $h\le 2bh$；颜色可以沿最长路径黑、红交替，因此等号可以取到。最简单的例子是黑根加两个红孩子：高度为 2，黑高为 1。

## A 错：黑结点总数不必等于红结点总数

黑根加两个红孩子就是反例：共有 1 个黑结点、2 个红结点。路径黑高相同约束的是每条路径上的黑结点数，不是整棵树中红、黑结点的总数。

## C 错：红黑树不保证比 AVL 树查找更快

两者查找的最坏时间复杂度都是 $O(\log n)$。AVL 树要求每个结点左右子树高度差不超过 1，整体高度约束更严格；红黑树只保证高度不超过约 $2\log_2(n+1)$。因此不能说红黑树查找效率必然优于 AVL 树。红黑树常见优势是插入、删除时旋转次数较少。

## D 错：合法红黑树不一定是 AVL 树

在 408 的语境中，「平衡二叉树」按 AVL 树理解：每个结点左右子树高度差的绝对值不超过 1。下面用 B、R 分别表示黑、红；空孩子均为 NIL 黑叶子。

~~~binary
10B
  L: 5B
  R: 15R
    L: 12B
    R: 20B
      R: 25R
~~~

这是 6 个实际结点的合法红黑树，但不是 AVL 树：以根 10 为例，左子树高为 1，右子树高为 3，按边数计的根平衡因子 $BF=1-3=-2$。

检查红黑性质：根 10 是黑色；红结点 15、25 没有红孩子；所有根到 NIL 的路径上黑结点数相同——按上面的口径（不含根 10 本身、含末尾 NIL），根 10 的黑高为 2。路径长度可以不同，但每条路径的黑结点数一致。

**为什么不用题目要求的 5 个结点？** 对所有有序二叉树形状和红黑着色作穷举检查，5 个实际结点时合法但非 AVL 的红黑树数量为 0；首次出现于 6 个结点，数量为 8。因此 5 个结点的反例不存在，上图是最小规模反例。`,pitfalls:String.raw`- **把黑高当成全树黑结点总数：** 黑高比较的是路径上的黑结点数，不能据此推出红黑结点总数相等。
- **把高度上界当成查找必然更快：** 红黑树和 AVL 树查找最坏情况都是 $O(\log n)$；AVL 的高度约束更紧，不能反向断言红黑树更快。
- **把「平衡二叉树」按日常说法理解：** 408 中此处指 AVL 树，不是泛指「看起来较平衡」的树。
- **硬凑 5 个结点的反例：** 合法红黑树的红黑约束会排除所有五结点非 AVL 形状；最小反例需要 6 个结点。`,extension:String.raw`## 追问一：红黑树插入时为什么最多旋转两次？

**答：** 新插入结点先着红色。若父结点是黑色，不需修复；若父结点和叔父结点都是红色，通过变色把问题向上移，不旋转。若叔父是黑色，则先把「折线」调整为「直线」（一次旋转），再旋转祖父并变色，至多再一次。因此插入修复最多两次旋转。

## 追问二：红黑树和 AVL 树如何取舍？

**答：** 查找占主导、希望树高更紧时，AVL 通常更合适；插入和删除较频繁、希望减少旋转和维护开销时，常选红黑树。两者的查找最坏时间复杂度均为 $O(\log n)$。

## 追问三：这道题中如何最快否定 D？

**答：** 不必证明每棵红黑树都不平衡，只需给出一棵合法红黑树在某结点的左右子树高度差为 2。上面的 6 结点树在根处 $BF=-2$，所以它不是 AVL 树。`}},{id:`wangdao-mock2-major-09`,questionNumber:9,title:`3 阶 B 树删除关键字后的合并与调整`,type:`题目`,date:`2026-09-30`,chapter:`查找 · B 树的删除`,tags:[`B 树`,`关键字删除`,`结点下溢`,`合并`,`树高调整`],summary:`在 3 阶 B 树中删除叶子关键字 71，依次处理叶结点与父结点下溢，判断调整后的树形。`,source:`本题来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图中未显示答案，以下答案为本站推导。`,content:String.raw`对于如下这棵 3 阶 B 树，完成“删除 71”操作后应该是（ ）。

原树：根结点为 $47$；第二层结点为 $20$、$60$；叶子层中，$20$ 下挂 $18$、$23$ 两个叶结点，$60$ 下挂 $55$、$71$ 两个叶结点。

- **A．** 根为 $20$，左孩子为 $18\ 23$，右孩子为 $47$（$47$ 的孩子是 $55$、$60$）
- **B．** 根为 $47$，左孩子为 $20$（$20$ 的孩子是 $18$、$23$），右孩子为结点 $55\ 60$
- **C．** 根为 $20\ 47$，三个孩子分别是 $18$、$23$、$55\ 60$
- **D．** 根为 $23\ 55$，孩子是 $18\ 20$、$47$、$60$

以上选项的树形以原题截图为准；正文用文字描述。`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-09/question.png`}],solution:{answer:String.raw`**选 C。** 删除并完成两次合并后，根结点关键字为 $20\ 47$，三个孩子依次为 $18$、$23$、$55\ 60$。`,explanation:String.raw`## 先明确 3 阶的结点下限

3 阶 B 树每个结点最多有 3 个孩子。非根结点至少有 $\lceil 3/2\rceil=2$ 个孩子，因此至少有 $2-1=1$ 个关键字。阶数是孩子数上限，不是关键字数上限。

## 第一次下溢：删除 71

$71$ 所在叶结点删除后变为空，关键字数为 0，低于最少的 1 个。它的兄弟叶结点 $55$ 也只有 1 个关键字，已经达到下限，不能借。

于是合并这两个叶结点，并把父结点分隔关键字 $60$ 下移，得到叶结点 $55\ 60$。父结点原本只有关键字 $60$，下移后变空，发生下溢。

## 第二次下溢：向上合并

空结点的兄弟结点 $20$ 也只有 1 个关键字，不能借。将它与根中的分隔关键字 $47$ 合并，得到新的根结点 $20\ 47$。原来属于 $20$ 的叶子结点 $18$、$23$，以及合并得到的叶结点 $55\ 60$，成为新根的三个孩子。

最终根为 $20\ 47$，三个孩子依次为 $18$、$23$、$55\ 60$，对应选项 C。`,pitfalls:String.raw`## 易错点

- 只删去 $71$，却把空叶结点保留下来；空结点低于 3 阶 B 树非根结点的关键字下限。
- 误以为可以向 $55$ 借；它只有 1 个关键字，已达到最小值。
- 第一次合并后忘记检查父结点下溢，或忘记空根会让树高降低 1。
- 把“3 阶”误解为每个结点最多有 3 个关键字；实际最多有 3 个孩子、2 个关键字。`,extension:String.raw`## 追问一：如果删除 55 呢？

**答：** 与删除 $71$ 对称。空叶结点与兄弟 $71$ 及父关键字 $60$ 合并成 $60\ 71$，随后父结点下溢，再与根中的 $47$ 和兄弟结点 $20$ 合并；最终根同样为 $20\ 47$，三个孩子为 $18$、$23$、$60\ 71$。

## 追问二：为什么 3 阶 B 树的非根结点最少有 1 个关键字？

**答：** 非根结点至少有 $\lceil m/2\rceil$ 个孩子，关键字数比孩子数少 1，所以最少关键字数是 $\lceil m/2\rceil-1$。当 $m=3$ 时为 $\lceil 3/2\rceil-1=1$。`}},{id:`wangdao-mock2-major-10`,questionNumber:10,title:`快速排序最坏情况与基准选择`,type:`题目`,date:`2026-09-30`,chapter:`排序 · 快速排序`,tags:[`快速排序`,`划分`,`最坏时间复杂度`,`基准选择`],summary:`每轮选待排序子序列的末元素为基准，判断哪种初始排列会使快速排序达到最坏情况。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；照片中未显示答案，本题答案与解析为本站推导。`,content:String.raw`假设在快速排序算法中总是选择待排序子序列中的最后一个元素作为基准，则这个算法的最坏情况出现在（ ）。

- A．待排序序列初始有序时
- B．待排序序列呈现中间小并逐次向两边增大的情况
- C．待排序序列呈现中间大并逐次向两边减小的情况
- D．以上选项都不是`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-10/question.png`}],solution:{answer:String.raw`**选 A。** 每轮选择当前子序列的最后一个元素为基准。对于初始有序序列，基准始终是当前子序列的最大值，划分为 $(n-1,0)$，因此达到最坏时间复杂度 $O(n^2)$。`,explanation:String.raw`## 为什么初始有序会退化

以升序序列为例，每一轮都取末元素作为基准，它就是当前子序列的最大值。划分后左侧有 $n-1$ 个元素，右侧为空；下一轮又只处理大小为 $n-1$ 的子序列。

比较次数满足：

$$
T(n)=T(n-1)+(n-1)=\frac{n(n-1)}{2}=O(n^2).
$$

划分越来越不平衡，递归链上有 $n$ 个非空子序列层级（含最后的单元素子序列），递归深度为 $n$。逆序序列也会产生同样的退化：末元素每次都是当前子序列的最小值，划分为 $(0,n-1)$。但选项中只有初始有序，因此选 A。

**区分「必然」与「可能」：** 只要某轮的基准恰好是当前子序列的最值，该轮划分就退化成 $(n-1,0)$ 或 $(0,n-1)$。除有序、逆序外，某些 V 形或 Λ 形排列也能达到上界 $n(n-1)/2$——例如 $4,3,2,1,5,6,7,8$ 的末元素 $8$ 每轮都是当前子序列的最大值，比较次数同样为 $28$。选项里只有「初始有序」会**必然**退化，B、C 描述的形态只是**可能**退化。

对照来看，划分接近均衡时递归深度约为 $\log_2 n$，总比较次数为 $O(n\log n)$。快速排序的最好、最坏表现取决于每轮划分形状，而不是只由序列规模决定。`,pitfalls:String.raw`- **把末元素基准与首元素基准混谈。** 两者都可能在有序或逆序输入上退化，但要从题目指定的基准位置逐轮判断。
- **误把“中间小”或“中间大”当成本题的答案。** 这类形态一般较均衡，但只要每轮末元素恰好是当前子序列的最值，V 形、Λ 形也能达到 $n(n-1)/2$；本题只有“初始有序”是**必然**最坏。
- **认为只有有序才会最坏。** 逆序对末元素基准也会每轮分出一个空侧；只是本题选项中没有逆序。
- **把最坏情况归因于规模。** $n$ 决定输入长度，排列和基准选择共同决定划分形状。`,extension:String.raw`**问：怎样降低快速排序遇到最坏情况的风险？**

**答：** 可以随机选择基准，或使用三数取中（从首、尾、中间位置的元素中选中间值）来降低持续极端划分的概率。它们降低风险，但并不保证所有输入都能避免最坏情况。

**问：若每轮改取当前子序列的第一个元素为基准，最坏情况还是有序序列吗？**

**答：** 是。升序时首元素为最小值，逆序时首元素为最大值；两种情况下都反复产生 $(0,n-1)$ 或 $(n-1,0)$ 划分，时间复杂度均为 $O(n^2)$。

**问：末元素基准在本题的升序输入上，$n=8$ 时有多少次关键字比较？**

**答：** $7+6+5+4+3+2+1=28$ 次；递归深度按非空子序列层级计为 8。`}},{id:`wangdao-mock2-major-11`,questionNumber:11,title:`堆排序建大根堆的交换次数`,type:`题目`,date:`2026-09-30`,chapter:`排序 · 堆排序`,tags:[`堆排序`,`大根堆`,`建堆`,`交换次数`],summary:`对给定序列自底向上建大根堆，逐轮模拟向下筛选，区分交换次数与比较次数。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图中未显示答案，以下答案为本站推导。`,content:String.raw`堆排序分为两个阶段，其中第一个阶段将给定的序列建成一个堆，第二个阶段逐次输出堆顶元素。设给定序列为 $\{48,62,35,77,55,14,35,98\}$，若在堆排序的第一个阶段将该序列建成一个堆（大根堆），则交换元素的次数为（ ）。

- **A．** 5
- **B．** 6
- **C．** 7
- **D．** 8`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-11/question.png`}],solution:{answer:String.raw`**选 B：6 次。** 按从最后一个非叶结点开始、遇到相等不交换的标准向下筛选规则，依次处理 $i=4,3,2,1$，交换次数为 $1+0+2+3=6$。`,explanation:String.raw`## 建堆规则

把序列按完全二叉树的层序放入数组，下标从 1 开始。最后一个非叶结点是 $\lfloor 8/2\rfloor=4$，因此从 $i=4$ 到 $i=1$，每次选择较大的孩子；只有孩子严格大于当前结点时才交换，并继续向下筛选。

下面每行数组均为该轮筛选结束后的状态。逐步模拟结果：

- **$i=4$：** 77 与唯一的孩子 98 交换，1 次。数组：$[48,62,35,98,55,14,35,77]$。
- **$i=3$：** 两个孩子为 14、35，较大者 35 与当前值相等，不交换，0 次。数组：$[48,62,35,98,55,14,35,77]$。
- **$i=2$：** 62 先与较大的孩子 98 交换，再与孩子 77 交换，2 次。数组：$[48,98,35,77,55,14,35,62]$。
- **$i=1$：** 48 依次与 98、77、62 交换，3 次。数组：$[98,77,35,62,55,14,35,48]$。

逐轮交换数为 $1,0,2,3$，所以建堆总交换数为 $6$。最终数组满足每个父结点都不小于其孩子，是一个大根堆。

用脚本按上述规则逐轮模拟，输出如下：

~~~text
[(4, [48, 62, 35, 98, 55, 14, 35, 77], 1, 1), (3, [48, 62, 35, 98, 55, 14, 35, 77], 0, 2), (2, [48, 98, 35, 77, 55, 14, 35, 62], 2, 3), (1, [98, 77, 35, 62, 55, 14, 35, 48], 3, 5)]
total swaps 6 total key comparisons 11
~~~

每个记录依次为「起始结点下标、该轮结束数组、交换次数、关键字比较次数」。可见比较次数为 11，不能把它当成交换次数。`,pitfalls:String.raw`- **从叶子开始建堆：** 叶子本身已经是堆，应从最后一个非叶结点 $\lfloor n/2\rfloor$ 开始，向前处理到根。
- **相等也交换：** 本题 $i=3$ 的结点和较大孩子都为 35；标准筛选在孩子不严格大于当前值时停止，不做无意义交换。若人为规定相等也交换，这一轮会多计 1 次，得到 7 次；它不是本题采用的标准交换口径。
- **把比较次数当成交换次数：** 本次模拟共比较关键字 11 次，但真正交换只有 6 次。
- **把第二阶段的交换也算入：** 题目只问第一阶段建堆，不计反复交换堆顶与末尾元素的排序过程。`,extension:String.raw`**问：为什么自底向上建堆的时间复杂度是 $O(n)$，而不是 $O(n\log n)$？**

**答：** 高度为 $h$ 的结点数至多为 $\lceil n/2^{h+1}\rceil$，每个结点至多向下移动 $h$ 层。总工作量被 $\sum_{h\ge0} h\lceil n/2^{h+1}\rceil$ 控制；加权几何级数 $\sum h/2^{h+1}$ 收敛，因此总工作量为 $O(n)$。

**问：本题第二阶段第一次输出堆顶元素后，数组是什么？**

**答：** 先将根 98 与末尾 48 交换，再对前 7 个元素向下筛选：$[48,77,35,62,55,14,35,98]$ 中，48 先与 77 交换，再与 62 交换。数组为 $[77,62,35,48,55,14,35,98]$；末尾 98 是刚输出的最大元素。脚本输出：

~~~text
after_first_output= [77, 62, 35, 48, 55, 14, 35, 98]
~~~`}},{id:`wangdao-mock2-major-12`,questionNumber:12,title:`改善计算机性能的措施与 CPU 执行时间`,type:`题目`,date:`2026-09-30`,chapter:`计算机性能指标 · CPU 执行时间`,tags:[`CPU 执行时间`,`指令数`,`CPI`,`时钟周期`,`吞吐率`],summary:`依据 CPU 执行时间公式，区分缩短单个程序执行时间的措施与提高处理器吞吐率的措施。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；照片中无答案可见，故本题答案为本站推导。`,content:String.raw`下面给出了改善计算机性能的四种可能措施：

- Ⅰ．用更快的处理器替换原来的慢处理器
- Ⅱ．增加同类处理器的个数，使不同的处理器能同时执行程序
- Ⅲ．优化编译生成的代码，减少程序执行的总时钟周期数
- Ⅳ．缩短指令执行过程中访问内存的时间

其中能够缩短 CPU 执行时间的措施是（ ）。

- A．Ⅰ、Ⅱ、Ⅲ
- B．Ⅰ、Ⅱ、Ⅳ
- C．Ⅰ、Ⅲ、Ⅳ
- D．Ⅰ、Ⅱ、Ⅲ、Ⅳ`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-12/question.png`}],solution:{answer:String.raw`**选 C，Ⅰ、Ⅲ、Ⅳ。**`,explanation:String.raw`CPU 执行时间可写为

$$
CPU\text{时间}=\text{指令数}\times CPI\times\text{时钟周期}。
$$

逐项判断：

- Ⅰ．换用更快的处理器，可缩短时钟周期，因此能缩短 CPU 执行时间。
- Ⅱ．增加处理器个数通常提高系统吞吐率或并行任务处理能力，但对未并行化的单个程序，不会因此自动缩短它的 CPU 执行时间。
- Ⅲ．优化编译生成的代码、减少程序执行的总时钟周期数，可缩短 CPU 执行时间。
- Ⅳ．缩短指令执行过程中的访存时间，可减少相关等待并降低平均 CPI，因而能缩短 CPU 执行时间。

故选Ⅰ、Ⅲ、Ⅳ，即 C。`,pitfalls:String.raw`- 把“提高吞吐率”误当成“缩短单个程序的执行时间”。
- 混淆指令数、CPI 与时钟周期的关系；CPU 执行时间是三者相乘。
- 认为增加处理器个数必然加速单个程序；只有程序能够并行利用多个处理器时，才可能缩短其执行时间。`,extension:String.raw`1. **提高主频一定会缩短程序的 CPU 执行时间吗？**

   **答：**不一定。主频提高意味着时钟周期缩短，但更深的流水线可能使 CPI 上升；最终执行时间取决于指令数、CPI 与时钟周期的乘积。

2. **增加处理器个数主要有利于改善什么指标？**

   **答：**主要有利于提高系统吞吐率和并行任务的处理能力；若单个程序经过并行化，也可能缩短该程序的执行时间。`}},{id:`wangdao-mock2-major-13`,questionNumber:13,title:`补码运算与溢出标志`,type:`题目`,date:`2026-09-30`,chapter:`数据的表示与运算 · 补码运算与溢出`,tags:[`补码`,`算术右移`,`溢出标志 OF`,`定点数运算`],summary:`根据 8 位补码求 x/2+2y 的机器数，并依据同号相加是否变号判断溢出。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；照片未显示答案，故本题答案为本站推导。`,content:String.raw`（13）

在某 8 位计算机中，假定 $x$ 和 $y$ 是两个带符号整数变量，用补码表示有 $[x]_{\text{补}}=\text{44H}$，$[y]_{\text{补}}=\text{DCH}$，则 $x/2+2y$ 的机器数以及相应的溢出标志 $OF$ 分别是（ ）。

- A．CAH、0
- B．CAH、1
- C．DAH、0
- D．DAH、1`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-13/question.png`}],solution:{answer:String.raw`**选 C，DAH、0。**`,explanation:String.raw`## 逐步计算

8 位补码的最高位是符号位。$\text{44H}=0100\,0100_2$，最高位为 0，因此 $x=+68$；$\text{DCH}=1101\,1100_2$，按补码解释为 $220-256=-36$，因此 $y=-36$。

$x/2=+34$，机器运算可将正数 $\text{44H}$ 算术右移一位得到 $\text{22H}$。$2y=-72$，对应 8 位补码为 $256-72=184=\text{B8H}$。相加得到 $34+(-72)=-38$，其 8 位补码为 $256-38=218=\text{DAH}$。

**$OF$ 由同号相加结果变号产生。** 即两个操作数同号而结果符号与它们不同，才发生有符号溢出。本题相加的操作数 $+34$ 与 $-72$ 异号，异号相加天然不溢出，因此 $OF=0$。结果为 $\text{DAH}$，选 C。`,pitfalls:String.raw`- 把 $\text{DCH}$ 当成无符号数 $220$；它作为 8 位补码表示 $-36$。
- 混用算术右移与逻辑右移；负数算术右移要保留符号位，逻辑右移则在高位补 0。
- 把 $2y$ 直接看作左移一位而不检查运算范围；应检查有符号数值是否可表示。
- 把有符号溢出标志 $OF$ 与无符号进位标志 $CF$ 混用；两者判据不同。`,extension:String.raw`1. **若 $x/2$ 改用逻辑右移，结果会是什么？用负数说明算术右移与逻辑右移的区别。**

   **答：** 本题 $x=+68$，其最高位为 0，所以逻辑右移一位仍为 $\text{22H}$，与算术右移结果相同。负数时则不同：以 8 位补码 $-3=\text{FDH}=1111\,1101_2$ 为例，算术右移一位并保留符号位得到 $1111\,1110_2=\text{FEH}$（$-2$）；逻辑右移在高位补 0，得到 $0111\,1110_2=\text{7EH}$（按无符号解释为 $126$）。

2. **若某次 8 位有符号加法的精确和为 $+100$，$OF$ 是多少？若精确和为 $+130$ 呢？**

   **答：** $+100$ 在 $[-128,127]$ 范围内，故 $OF=0$；$+130$ 超出范围，故 $OF=1$。注意 $+100$ 本身并未超出 8 位有符号数范围。`}},{id:`wangdao-mock2-major-14`,questionNumber:14,title:`单精度浮点数对阶与舍入阈值`,type:`题目`,date:`2026-09-30`,chapter:`计算机组成原理 · 浮点数运算`,tags:[`IEEE 754`,`单精度浮点数`,`对阶`,`舍入`],summary:`判断单精度浮点数加减中，保留两位附加位并采用就近舍入时，阶差达到多少即可直接取阶大的数。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图中未显示答案，故本题答案为本站推导。`,content:String.raw`（14）

在 IEEE754 单精度浮点数的加减运算中，当对阶操作得到的两个阶码之差的绝对值 $|\Delta E|$ 大于或等于（ ）时，就无须继续进行后续操作，此时运算结果直接取阶大的那个数。已知在对阶移位时保留两位附加位，在根据附加位进行舍入时采用就近舍入的方式。

- A．24
- B．25
- C．126
- D．128`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-14/question.png`}],solution:{answer:String.raw`**选 B．25。**`,explanation:String.raw`单精度浮点数的有效数包含隐藏位，共 24 位。对阶时，小阶数的有效数右移；保留两位附加位，可分别看作保护位 $G$ 和舍入位 $R$，其后的所有位可由粘着位概括。

以大阶数的 ULP（相邻可表示数的间距）为单位，设小阶有效数的第 $i$ 位右移后落在位置 $i+|\Delta E|$，其中 $i\in[0,23]$，有效数位置编号为 0 至 23，附加位从位置 24 起。

- 当 $|\Delta E|=24$ 时，最高有效位可能落入位置 24，也就是 $G$ 位。若 $G=1$，小数部分至少达到半个 ULP；就近舍入可能改变大阶数，不能直接结束。
- 当 $|\Delta E|\ge25$ 时，小阶有效数所有位都移到 $G$ 位之后，$G=0$。余数严格小于半个 ULP；后续粘着位无论是什么，都不会触发进位，舍入结果仍为大阶数。

因此最小阈值为 25。阶码范围中的 126、128 与本题的对阶舍入阈值无关。`,pitfalls:String.raw`- 把“两位附加位”误当成只保留一位；阈值边界需要考察 $G$ 位。
- 把 126 或 128 当作答案；它们与阶码范围有关，不是对阶后是否影响舍入的界限。
- 把阈值算成 24；阶差为 24 时，最高有效位仍可能落入 $G$ 位，产生舍入进位。
- 误以为 $G=0$ 时，后续粘着位仍能令余数达到半个 ULP；它们只能表示小于半 ULP 的尾部。`,extension:String.raw`1. **若对阶时不保留附加位，按移出有效数的位不再参与舍入处理，阈值是多少？**

   **答：** 阈值为 24。有效数的位置为 0 至 23；当 $|\Delta E|\ge24$ 时，所有有效数位都移出保留的有效数位置，不会改变结果。若保留 $G$ 位并按其进行就近舍入，则阶差 24 时仍可能舍入进位。

2. **为什么粘着位不参与是否达到半个 ULP 的判断？**

   **答：** 保留两位附加位时，$G$ 位就是最高的舍入判断位。$G=0$ 表示余数严格小于半个 ULP，后续粘着位再多也不能使其达到半个 ULP；$G=1$ 则已达到或超过半个 ULP，是否进位再结合舍入位及 tie-to-even 规则判断。`}},{id:`wangdao-mock2-major-15`,questionNumber:15,title:`DRAM 位扩展、行缓冲与地址引脚`,type:`题目`,date:`2026-09-30`,chapter:`存储器 · DRAM 与内存条组织`,tags:[`DRAM`,`位扩展`,`行缓冲`,`多模块交叉编址`,`MDR`],summary:`判断由 8 片 DRAM 位扩展构成的内存条，其行缓冲总量、编址方式、地址引脚扩容关系及 MDR 宽度。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图未显示答案，故本题答案为本站推导。`,content:String.raw`## 一、单项选择题

(15) 某计算机的字长为 64 位，采用 64 位定长指令字，存储器总线的宽度为 64 位，若用 8 个 $64M\times 8$ 位的 DRAM 芯片扩展构成一个 $64M\times 64$ 位的内存条，支持突发传输方式，则下列说法中正确的是（ ）。

- Ⅰ．在该内存条中，所有芯片行缓冲的总大小为 64KB
- Ⅱ．采用多模块交叉编址方式
- Ⅲ．每代 DRAM 芯片如果地址引脚数增加 1 个，那么容量至少增加 4 倍
- Ⅳ．该计算机的主存数据寄存器（MDR）的宽度为 8 位

- A．Ⅰ、Ⅲ
- B．Ⅰ、Ⅱ、Ⅲ
- C．Ⅱ、Ⅲ
- D．Ⅰ、Ⅱ、Ⅲ、Ⅳ`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-15/question.png`}],solution:{answer:String.raw`**选 A，Ⅰ、Ⅲ。**`,explanation:String.raw`## 逐项判断

**Ⅰ正确。** $64M=2^{26}$ 个地址。按经典的方阵组织，每片可分为 $8192$ 行、每行 $8192$ 个 $8$ 位单元；一片的行缓冲大小为 $8192\times 8=65536$ bit，即 $8$ KiB。8 片进行位扩展并同时选中，行缓冲合计为 $8\times8=64$ KiB。

**Ⅱ错误。** 8 片共同提供同一地址处的 64 位数据，属于位扩展。多模块交叉编址是多个独立存储模块交错存放地址并可轮流或并行响应，不是将芯片并接以增加字宽。支持突发传输也不改变这里的扩展方式。

**Ⅲ正确。** DRAM 的行、列地址复用同一组地址引脚。按上述方阵组织，地址引脚增加 1 根时，行地址位数和列地址位数各增加 1 位，行数与列数分别翻倍，容量至少增至原来的 $2\times2=4$ 倍。

**Ⅳ错误。** 主存数据寄存器宽度与存储器数据总线宽度相匹配。本题总线宽度为 64 位，因此 MDR 宽度为 64 位，而非单片芯片的 8 位。`,pitfalls:String.raw`- 把位扩展与字扩展或多模块交叉编址混为一谈；位扩展增加每个地址的数据位数。
- 把 MDR 宽度误认为单个 DRAM 芯片的位宽；应看主存数据通路宽度。
- 把“地址引脚数增加”只理解为行地址位数增加；行、列地址复用同一组引脚。
- 用芯片总容量代替行缓冲大小；行缓冲只对应一行的数据。
- 将支持突发传输直接等同于多模块交叉编址；两者描述的不是同一层次的组织方式。`,extension:String.raw`1. **若要构成 $256M\times64$ 位的内存条，使用 $64M\times8$ 位芯片，需要多少片？如何扩展？**

   **答：** 需要 $32$ 片。每个深度组用 $8$ 片位扩展成 $64M\times64$ 位，再用 $4$ 组字扩展到 $256M\times64$ 位。

2. **提高存储带宽为什么常用多模块交叉编址？**

   **答：** 多个模块可交错存放连续地址，并让访存请求在模块间轮流或并行处理，提高并行度与带宽，并降低平均访存等待时间。`}},{id:`wangdao-mock2-major-16`,questionNumber:16,title:`按字节编址的 RAM 芯片数量计算`,type:`题目`,date:`2026-09-30`,chapter:`存储器 · 主存容量与芯片组织`,tags:[`按字节编址`,`MAR`,`存储器容量`,`芯片数量`,`位扩展`],summary:`根据 MAR 位数、已占用 ROM 地址范围和 RAM 芯片容量，计算所需芯片数。`,source:`本题来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图中未显示答案，因此以下答案为本站推导。`,content:String.raw`某按字节编址的计算机已配有 $00000\text{H}\sim07FFFH$ 的 ROM 区，MAR 为 20 位，现用 $16K\times 8$ 位的 RAM 芯片构成剩下的 RAM 区 $08000\text{H}\sim\text{FFFFFH}$，则需要这样的 RAM 芯片（ ）片。

- A．61
- B．62
- C．63
- D．64`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-16/question.png`}],solution:{answer:String.raw`**选 B，62 片。**`,explanation:String.raw`## 先算 RAM 区的字节数

MAR 为 20 位，且按字节编址，因此可寻址 $2^{20}=1,048,576$ 个字节，即 $1\text{MB}=1024\text{KB}$。

ROM 地址范围两端都包含在内，大小为

$$
07FFFH-00000H+1=08000H=32,768\text{B}=32\text{KB}.
$$

RAM 区字节数为

$$
FFFFFH-08000H+1=F8000H=1,015,808\text{B}=992\text{KB}.
$$

一片 $16K\times8$ 位芯片可存 $16K$ 个字节，即 $16\text{KB}$。所需芯片数为

$$
\frac{992\text{KB}}{16\text{KB/片}}=62\text{片}.
$$

芯片数据宽度为 8 位，正好对应按字节编址的 8 位数据，因此不需要位扩展。`,pitfalls:String.raw`- ROM 范围是闭区间：$00000H\sim07FFFH$ 共 $08000H=32\text{KB}$，不是 $31\text{KB}$ 或 $32\text{KB}-1$。
- MAR 为 20 位时，按字节编址的地址空间是 $2^{20}$ 字节，即 $1\text{MB}$；不能把它误当成 $1\text{M}$ 个 16 位字。
- RAM 容量应为 $1024\text{KB}-32\text{KB}=992\text{KB}$，不是 $1008\text{KB}$。
- $16K\times8$ 位芯片宽度是 8 位，与字节宽度相符；不要额外计算位扩展。`,extension:String.raw`1. **若 MAR 改为 24 位，ROM 区仍为 $00000H\sim07FFFH$，其余地址仍全部作为 RAM，使用 $16K\times8$ 位芯片，需要多少片？**

   **答：** 24 位 MAR 可寻址 $2^{24}=16\text{MB}=16384\text{KB}$。RAM 容量为 $16384-32=16352\text{KB}$，故需要 $16352/16=1022$ 片。

2. **若仍按原题地址范围，但 RAM 芯片改为 $8K\times4$ 位，需要多少片？**

   **答：** 每片容量为 $8K\times4\text{bit}=4\text{KB}$。每组用两片并联组成 8 位数据宽度，每组容量为 $8\text{KB}$；$992\text{KB}/8\text{KB}=124$ 组，因此共需 $124\times2=248$ 片。`}},{id:`wangdao-mock2-major-17`,questionNumber:17,title:`Cache 缺失率与缺失开销`,type:`题目`,date:`2026-09-30`,chapter:`存储器 · Cache 缺失与性能`,tags:[`Cache`,`缺失率`,`缺失损失`,`关联度`,`AMAT`],summary:`区分 Cache 缺失率、缺失损失与总缺失开销，并用冲突访问序列说明缺失率可以达到 100%。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；照片中没有答案标注，因此答案为本站推导。`,content:String.raw`（17）

Cache 缺失会导致系统需要额外的时间开销去获取数据，通常以时钟周期为单位来衡量 Cache 缺失的开销，下列关于 Cache 缺失引起的开销的说法中，正确的是（ ）。

- A．若 Cache1 比 Cache2 的缺失率高，则 Cache1 的总缺失开销一定比 Cache2 的大
- B．提高 Cache 的关联度一定能降低 Cache 的缺失率
- C．无论是直接映射还是组相联映射，都可能发生刚被替换出的数据又被访问的情况，导致缺失率为 100%
- D．Cache 缺失所引起的时间开销只和 Cache 本身的结构有关`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-17/question.png`}],solution:{answer:`C．`,explanation:String.raw`## 逐项判断

- A 错。总缺失开销还取决于访问次数和每次缺失的代价。可近似写成

$$
\text{总缺失开销}=\text{访存次数}\times\text{缺失率}\times\text{平均缺失损失}。
$$

缺失率较高，不代表访存次数和平均缺失损失也较大，因此不能推出总缺失开销一定较大。
- B 错。提高关联度主要有助于减少冲突缺失；访问序列若没有冲突，缺失率可以不变，强制缺失和容量缺失也不会因此必然消失。「一定降低」过于绝对。
- C 对。直接映射中，两个主存块若映射到同一行，交替访问时每次都替换前一个块；组相联中，若冲突块数超过每组路数并按冲突方式交替访问，也可令每次访问都缺失。冷启动访问也会产生强制缺失。
- D 错。缺失损失还受下一级存储器的延迟、总线带宽等因素影响，不只由 Cache 结构决定。

### 直接映射冲突示例

设 A、B 是两个不同的主存块，但映射到直接映射 Cache 的同一行。Cache 初始为空，重复访问 A、B；每次装入其中一个块，都会替换另一个。模拟序列为 A、B、A、B、A、B、A、B、A、B，共 10 次访问，结果全部缺失，缺失率为 100%。`,pitfalls:String.raw`- 混淆缺失率、单次缺失损失与总缺失开销；总开销还要考虑访存次数。
- 把「关联度越高越好」当成必然；它不能消除所有类型的缺失，也可能增加命中时间和硬件复杂度。
- 把缺失开销说成只由 Cache 结构决定，忽略下一级存储器和总线等因素。
- 忘记空 Cache 的首次访问会发生强制缺失；提高关联度不能消除它。`,extension:String.raw`1. **降低 Cache 缺失开销的常见方法有哪些？**

   **答：** 可采用多级 Cache、预取、提高下一级存储器或总线带宽等方法；增大块大小可利用空间局部性，但也要注意无用数据带来的带宽消耗和 Cache 污染。

2. **平均访存时间 AMAT 的公式是什么？它与本题的缺失开销有何关系？**

   **答：** 单级 Cache 的常见公式为

$$
AMAT=\text{命中时间}+\text{缺失率}\times\text{缺失损失}。
$$

   缺失率与缺失损失共同决定缺失对平均访存时间的贡献；仅比较缺失率，不能判断总缺失开销或 AMAT 一定更大。`}},{id:`wangdao-mock2-major-18`,questionNumber:18,title:`改变程序执行顺序的指令类型`,type:`题目`,date:`2026-09-30`,chapter:`指令系统 · 程序执行顺序`,tags:[`指令系统`,`程序执行顺序`,`跳转指令`,`过程调用`,`中断`],summary:`判断六类控制类指令执行后是否一定改变程序执行顺序，区分条件跳转与无条件控制转移。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图未显示答案，故本题答案为本站推导。`,content:String.raw`## 一、单项选择题

(18) 下列各种类型的指令中，（ ）执行后一定会改变程序的执行顺序。

- ①条件跳转指令
- ②无条件跳转指令
- ③过程调用指令
- ④过程返回指令
- ⑤自陷指令
- ⑥中断返回指令

- A．②③④⑤⑥
- B．②③⑤⑥
- C．①②③④⑤
- D．③④⑤⑥`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-18/question.png`}],solution:{answer:String.raw`**选 A（②③④⑤⑥）。** 除条件跳转外，其余五类指令执行后都会转移到非顺序执行位置。`,explanation:String.raw`## 逐项判断

- ① 条件跳转指令：条件不成立时继续执行下一条指令，因此不一定改变执行顺序。
- ② 无条件跳转指令：直接把程序转移到目标位置，一定改变执行顺序。
- ③ 过程调用指令：保存返回地址并转入被调用过程，一定改变执行顺序。
- ④ 过程返回指令：取出返回地址并转回调用者，一定改变执行顺序。
- ⑤ 自陷指令：转入操作系统的自陷处理程序，一定改变控制流。
- ⑥ 中断返回指令：恢复中断现场并返回被中断程序的位置，一定改变控制流。

因此，只有 ① 不满足“一定改变”，答案为 A。这里判断的是控制流是否转移；自陷伴随的特权级变化不是本题判定依据。`,pitfalls:String.raw`- 把条件跳转误认为必然跳转；条件不成立时按顺序执行下一条。
- 把“改变执行顺序”与“改变特权级”混为一谈；自陷进入内核态的附带效果不是此题的采分点，关键是控制流转移。
- 漏掉过程返回指令；它会按返回地址回到调用者。
- 把中断返回当成普通返回；它恢复中断现场并返回被中断程序。`,extension:String.raw`1. **条件跳转在什么情况下不改变程序执行顺序？**

   **答：** 条件不成立时，按顺序取下一条指令。

2. **哪些指令执行时可能改变特权级？**

   **答：** 自陷、中断及中断返回等会涉及特权级切换；是否改变特权级与是否改变执行顺序是不同的判断维度。`}},{id:`wangdao-mock2-major-19`,questionNumber:19,title:`五段式流水线中的分支控制冒险`,type:`题目`,date:`2026-09-30`,chapter:`处理器 · 流水线冒险`,tags:[`五段式流水线`,`控制冒险`,`数据冒险`,`分支与跳转`],summary:`在给定的五段式流水线指令序列中，区分会引起控制冒险的分支、跳转指令与产生 RAW 依赖的数据冒险指令。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；照片未显示答案，故本题答案为本站推导。`,content:String.raw`在采用“取指、译码/取数、执行、访存、写回”五段式流水线的处理器中，执行如下指令序列（第一列为指令序号），其中 $t0$、$t1$、$s3$、$s4$、$s5$ 表示寄存器编号。

~~~text
1  loop: add  t1, s3, s3      //R[t1] ← R[s3] + R[s3]
2        add  t1, t1, t1      //R[t1] ← R[t1] + R[t1]
3        lw   t0, 0(t1)       //R[t0] ← M[R[t1] + 0]
4        bne  t0, s5, exit    //if (R[t0] ≠ R[s5]) then goto exit
5        add  s3, s3, s4      //R[s3] = R[s3] + R[s4]
6        j    loop           //goto loop
7  exit:
~~~

在上述指令序列中，共有（ ）条指令会产生分支控制冒险。

- A．1
- B．2
- C．3
- D．4`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-19/question.png`}],solution:{answer:String.raw`**选 B：2 条。** 第 4 条条件分支指令 **bne** 和第 6 条无条件跳转指令 **j** 都会改变 PC，因而可能产生控制冒险。`,explanation:String.raw`## 先按指令类型分类

会改变程序控制流的指令是第 4 条 **bne** 和第 6 条 **j**：

- **bne**：条件成立时转移到目标标签；条件不成立时继续顺序执行。
- **j**：无条件转移到循环开始位置。

五段式流水线在取指时需要确定下一条指令地址。分支结果或跳转目标尚未确定时，处理器可能继续取入顺序路径上的指令；若之后确认应转移，已取入的错误路径指令就需要冲洗。因此，这两条转移类指令各算一条可能引起控制冒险的指令，共 2 条。

$$
1\ (bne)+1\ (j)=2.
$$

第 1、2、5 条是 **add**，第 3 条是 **lw**；它们本身不会改变 PC，不产生控制冒险。不过，指令间存在数据依赖：例如第 2 条使用第 1 条写入的 $t1$，第 3 条又使用第 2 条写入的 $t1$。这类 RAW 依赖属于数据冒险，不应计入本题所问的控制冒险。`,pitfalls:String.raw`- 把 RAW 数据冒险误数成控制冒险；例如前两条 **add** 之间有 $t1$ 依赖，但它们不改变 PC。
- 只数条件分支 **bne**，漏掉无条件跳转 **j**。
- 把 6 条实际指令都算进去；只有转移类指令引起控制冒险。
- 把第 7 行的标签当作一条指令；它只是目标标记，不执行。`,extension:String.raw`1. **这段序列中的 RAW 数据冒险出现在哪几对指令之间？**

   **答：** 第 $1\to2$ 条（$t1$）、第 $2\to3$ 条（$t1$）、第 $3\to4$ 条（$t0$）。

2. **常见的控制冒险处理办法有哪些？**

   **答：** 使用延迟槽；采用分支预测，并在预测错误时冲洗错误路径指令；或提前在译码段比较、尽早确定分支方向。`}},{id:`wangdao-mock2-major-20`,questionNumber:20,title:`多处理器系统：共享存储不等于一致访问时间`,type:`题目`,date:`2026-09-30`,chapter:`计算机系统结构 · 多处理器系统`,tags:[`多处理器系统`,`共享存储`,`SMP`,`UMA与NUMA`,`同步控制`],summary:`区分共享存储多处理器的共同地址空间与 UMA 的一致访问时间假设，判断多处理器系统描述中的错误项。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；照片未显示答案键，因此答案为本站推导。`,content:String.raw`下列关于多处理器系统的描述中，错误的是（ ）。

- A．多处理器系统是共享存储多处理器系统的简称
- B．多处理器系统中所有主存储器都属于单一地址空间
- C．多处理器系统必须解决共享存储器的同步控制问题
- D．多处理器系统中各处理器对所有存储单元的访问时间是一致的`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-20/question.png`}],solution:{answer:String.raw`**选 D。**共享存储多处理器共享单一地址空间，但共享地址空间并不保证访问时间一致。`,explanation:String.raw`## 先分清两个概念

**共享存储**说的是处理器可以访问共同的主存地址空间；**访问时间一致**说的是访问不同存储位置时延是否相同。这是两件事，不能由前者直接推出后者。

- **A 正确：**本题所说的多处理器系统是共享存储多处理器系统（SMP）的简称。
- **B 正确：**共享存储多处理器中的主存属于处理器共同可见的单一地址空间。
- **C 正确：**多个处理器可能同时访问、修改共享数据，系统必须提供同步与互斥机制；原子操作等硬件支持和操作系统、程序中的同步协议共同发挥作用。
- **D 错误：**一致的访问时间是 UMA（均匀存储器访问）的特征，不是共享存储多处理器的必然条件。NUMA 也共享地址空间，但处理器访问本地内存通常比访问远程内存快，因此访问时间不一致。

所以，**共享地址空间不等于 UMA**，错误项为 D。`,pitfalls:String.raw`- 把 UMA 的「访问时间一致」当成所有多处理器系统的定义；这是额外的体系结构特征。
- 反过来以为多处理器系统必须是 NUMA；共享存储多处理器也可以采用 UMA。
- 把同步控制看成纯软件问题；软件需安排同步，但要依靠硬件提供的原子操作等机制，系统才能正确协调并发访问。
- 看到「共享」就推断「所有处理器访问任何存储位置等时延」；共享描述可见性与地址空间，不描述时延。`,extension:String.raw`## 追问一：UMA 与 NUMA 的区别是什么？

**答：**看不同处理器访问不同主存位置的时间是否一致。UMA 中访问时间一致；NUMA 中访问时间随内存位置而异，通常本地访问更快、远程访问更慢。二者都可以共享地址空间。

## 追问二：采用私有 Cache 时，为什么需要 Cache 一致性协议？

**答：**同一内存位置可能同时在多个处理器的 Cache 中有副本；一个处理器写入后，其他副本若仍保留旧值就会读到过期数据。Cache 一致性协议通过更新或失效等机制协调这些副本，使处理器观察到符合一致性规则的值。`}},{id:`wangdao-mock2-major-21`,questionNumber:21,title:`异步传输最适用的场景`,type:`题目`,date:`2026-09-30`,chapter:`计算机组成原理 · 总线与 I/O 传输`,tags:[`同步传输`,`异步传输`,`握手方式`,`I/O 接口`],summary:`比较 CPU、主存、PCI 总线和打印机的速度协调方式，判断异步传输最适用的场景。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图未显示答案，故本题答案为本站推导。`,content:String.raw`在下列各种情况中，最应采用异步传输方式的是（ ）。

- **A．** I/O 接口与打印机交换信息
- **B．** CPU 与主存交换信息
- **C．** CPU 和 PCI 总线交换信息
- **D．** 由统一时序信号控制方式下的设备`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-21/question.png`}],solution:{answer:String.raw`**选 A。** 打印机等 I/O 设备与 CPU 或总线的速度差异较大，适合用应答（握手）协调传输。`,explanation:String.raw`## 判据：看双方如何协调时序

- **同步传输**：发送方和接收方依据统一时钟或时序节拍，在约定时刻交换信息。双方时序协调，适合速度相近、连续传输量较大的场景。
- **异步传输**：不要求双方共用统一时钟节拍；发送方发出请求后，由接收方用应答信号表示已准备好，双方通过握手协调。它适合速度差异较大的设备，但握手会带来额外开销。

## 逐项判断

- **A．I/O 接口与打印机：**打印机工作速度远低于 CPU 和总线。用请求/应答握手，接口可按打印机实际准备情况传送，因此最适合异步方式。
- **B．CPU 与主存：**在本题所述的常见主存访问语境中，按统一时序协调，属于同步传输。
- **C．CPU 和 PCI 总线：**传统 PCI 总线以时钟节拍协调传输，属于同步总线传输。
- **D．统一时序信号控制：**题干已明确给出统一时序信号，正是同步方式的特征。

因此，最应采用异步传输的是 **A**。`,pitfalls:String.raw`- 把“统一时序”误判为异步；统一时钟/时序节拍是同步传输的判据。
- 看到总线就一概判断为同步；应按具体总线协议判断。本题的 PCI 是同步总线。
- 把打印机速度与总线速度混为一谈；打印机是慢速外设，接口需要缓冲并按设备就绪情况握手。`,extension:String.raw`1. **为什么异步传输的效率通常低于同步传输？**

   **答：**每次传输需要请求、应答等握手过程，控制信号和等待时间带来额外开销；同步方式按时钟节拍连续传送时，这类逐次握手开销较少。

2. **半同步方式有什么特点？**

   **答：**它保留统一时钟节拍，同时用应答或 WAIT 信号适配较慢设备；慢设备未准备好时可插入等待周期，准备好后再继续传输。`}},{id:`wangdao-mock2-major-22`,questionNumber:22,title:`开中断和关中断设置什么？`,type:`题目`,date:`2026-09-30`,chapter:`计算机组成原理 · 中断系统`,tags:[`中断系统`,`中断允许触发器`,`中断屏蔽`,`中断请求`],summary:`区分开/关中断控制 CPU 响应的允许状态，与屏蔽寄存器、请求寄存器和中断向量的作用。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；照片中未见答案键，因此答案为本站推导。`,content:String.raw`开中断和关中断两种操作都用于对（ ）进行设置。

- A．中断允许触发器
- B．中断屏蔽寄存器
- C．中断请求寄存器
- D．中断向量寄存器`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-22/question.png`}],solution:{answer:String.raw`**选 A：中断允许触发器。**`,explanation:String.raw`开中断与关中断改变的是 CPU 的中断允许状态：开中断使中断允许触发器置位，关中断使其清零。以 x86 为例，**STI** 设置标志寄存器中的 IF 位，**CLI** 清除 IF 位；IF 决定 CPU 是否响应可屏蔽的外部中断。

其余选项的作用不同：

- **中断屏蔽寄存器**：按中断源控制哪些请求被屏蔽，例如 8259 的 IMR。
- **中断请求寄存器**：记录中断控制器当前待处理的中断请求，不是开/关中断的总允许位。
- **中断向量寄存器**：保存或指示中断向量；向量表据此找到相应的服务程序入口，不负责开关中断。

因此，题干所说开中断和关中断设置的是中断允许触发器。`,pitfalls:String.raw`- 把「是否允许 CPU 响应可屏蔽中断」和「是否屏蔽某个中断源」混为一谈：前者对应中断允许触发器，后者对应中断屏蔽寄存器。
- 把中断请求寄存器中的请求状态误当成开关控制位。
- 把中断向量或向量表误当成中断允许状态；它们用于定位中断服务程序。`,extension:String.raw`1. **关中断后，哪些事件仍可能打断 CPU？**

   **答：** 不可屏蔽中断（NMI）以及内部异常、陷阱仍可被处理。关中断通常只禁止可屏蔽外部中断，并不屏蔽 NMI 或 CPU 内部异常事件。

2. **为什么中断服务程序入口处通常先关中断？**

   **答：** 为避免在现场保护等关键步骤尚未完成时被可屏蔽中断再次打断，造成嵌套或重入干扰。具体是否及何时重新开中断，由处理器机制和服务程序设计决定。`}},{id:`wangdao-mock2-major-23`,questionNumber:23,title:`不同操作系统与硬件平台的系统调用指令`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · 系统调用`,tags:[`系统调用`,`陷入指令`,`指令集体系结构`,`系统调用接口`],summary:`区分同一台计算机上不同操作系统使用的系统调用指令，以及同一 Linux 在不同硬件平台上的系统调用指令。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图未显示答案，故本题答案为本站推导。`,content:String.raw`(23) 在同一台计算机上，运行 Windows、Linux、UNIX 等不同的操作系统，它们的系统调用一般是通过执行（ ）的系统调用指令来实现的；运行在不同硬件平台上的相同 Linux 操作系统，它们执行的系统调用指令一般是（ ）的。

- A．相同，相同
- B．相同，不同
- C．不同，不同
- D．不同，相同`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-23/question.png`}],solution:{answer:String.raw`**选 B：相同，不同。** 同一台计算机的指令集相同，不同操作系统一般使用该平台提供的系统调用陷入指令；换到不同硬件平台，指令集不同，系统调用指令一般也不同。`,explanation:String.raw`## 分两问判断

### 同一台计算机，换操作系统

Windows、Linux、UNIX 运行在同一台计算机上时，面对的是同一套处理器指令集。执行系统调用时，用户态程序需要通过硬件支持的陷入机制进入内核，因此系统调用指令一般相同。

### 同一操作系统，换硬件平台

Linux 可运行在不同指令集的平台上。系统调用进入内核所用的指令由硬件指令集决定，例如 x86-64 使用 **syscall**，AArch64 使用 **svc**，RISC-V 使用 **ecall**。因此，不同硬件平台上的系统调用指令一般不同。

## 分清三个层次

- **陷入指令（硬件层）**：触发从用户态进入内核态的处理，由处理器指令集提供。
- **系统调用号与参数传递约定（操作系统 ABI 层）**：规定请求哪个内核服务，以及参数、返回值如何传递；即使指令相同，不同操作系统的约定也未必相同。
- **库函数接口（编译器／操作系统环境层）**：程序常调用 **read**、**write** 等库函数；库函数再按目标系统的 ABI 发起系统调用。相似的函数接口不代表底层陷入指令相同。`,pitfalls:String.raw`- 把「系统调用指令」和「系统调用号／系统调用接口」混为一谈。题目问的是用于陷入内核的指令，不是调用编号或库函数名称。
- 以为移植 Linux 后，系统调用接口和底层调用方式都完全相同。**read**、**write** 等接口可以相近，但陷入指令及参数传递寄存器由 ISA 和 ABI 决定。
- 忽略题目的比较条件：第一问固定硬件平台、改变操作系统；第二问固定 Linux、改变硬件平台。`,extension:String.raw`1. **同一台机器上运行同一 Linux 的不同发行版，陷入指令一般相同吗？**

   **答：** 相同。发行版通常共享该硬件平台的指令集以及 Linux 系统调用 ABI；发行版差异不会改变处理器提供的陷入指令。

2. **为什么不同操作系统的系统调用号可能不同？**

   **答：** 系统调用号由操作系统内核定义和编号，用来选择具体服务；它属于操作系统的 ABI 约定，不是硬件指令集规定的编号，因此不同操作系统可以采用不同的系统调用号。

3. **同一 Linux 的 read 接口在 x86-64 与 RISC-V 上，是否意味着执行同一条陷入指令？**

   **答：** 不意味着。库函数接口可以相近，但 x86-64 与 RISC-V 的陷入指令不同，分别使用 **syscall** 与 **ecall**。`}},{id:`wangdao-mock2-major-24`,questionNumber:24,title:`哪些操作通常不需要切换到内核态？`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · 处理器状态与特权指令`,tags:[`用户态与内核态`,`特权指令`,`系统调用`,`页表`],summary:`比较 I/O 指令、系统调用、通用寄存器清零和修改页表，判断哪项通常无需切换到内核态执行。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图未显示答案，因此以下答案为本站推导。`,content:String.raw`（24）在操作系统中，以下过程通常不需要切换到内核态执行的是（ ）。

- A．执行 I/O 指令
- B．系统调用
- C．通用寄存器清零
- D．修改页表`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-24/question.png`}],solution:{answer:String.raw`**选 C。** 通用寄存器清零是非特权操作，用户态程序可以直接执行。`,explanation:String.raw`判断关键是操作是否属于特权操作，或是否会通过受控入口请求操作系统服务。

- **A．执行 I/O 指令**：I/O 指令通常是特权指令，用户态直接执行会触发保护异常。
- **B．系统调用**：由用户态发起，但要通过系统调用入口陷入内核态，由内核完成请求。
- **C．通用寄存器清零**：普通寄存器可由当前程序直接写入，不要求进入内核态。例如在 x86 上，用户态代码可用 **xor eax, eax** 将 EAX 清零。
- **D．修改页表**：页表管理涉及操作系统维护的地址空间映射，并可能需要执行特权操作，因此由内核负责。`,pitfalls:String.raw`- 把「系统调用」当成全程在用户态执行：用户态只是发起请求，服务由内核态代码执行。
- 把修改页表当成普通内存写：页表由操作系统管理，修改映射需要内核控制。
- 以为所有涉及硬件的动作都要进入内核：用户态仍可执行普通指令、访问获准的内存并操作自己的通用寄存器。`,extension:String.raw`1. **用户程序想直接执行「in」或「out」指令，会发生什么？**

   **答：** 这类 I/O 指令通常是特权指令；在用户态执行会触发保护异常，随后由内核处理。

2. **哪些事件会使处理器从用户态进入内核态？**

   **答：** 系统调用、外部中断和异常都可以使处理器转入内核态，由相应内核处理程序接管。`}},{id:`wangdao-mock2-major-25`,questionNumber:25,title:`进程状态转换：判断状态变化的原因`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · 进程管理`,tags:[`进程状态`,`状态转换`,`处理机调度`,`I/O`],summary:`判断进程主动让出 CPU、事件完成、时间片用完等情形对应的状态转换，辨析就绪态与阻塞态。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；照片未显示答案，故答案为本站推导。`,content:String.raw`## 一、单项选择题

(25) 下列关于进程状态的说法中，正确的是（ ）。

- Ⅰ．进程主动让出 CPU、可能会导致该进程由执行态变为就绪态
- Ⅱ．从阻塞态到就绪态的转换是由协作进程决定的
- Ⅲ．一次 I/O 操作的结束，将会导致一个进程由就绪态变为运行态
- Ⅳ．一个运行的进程用完了分配给它的时间片后，其状态变为阻塞态
- Ⅴ．在进程状态转换中，“就绪 → 阻塞”是不可能发生的

- A．Ⅰ、Ⅱ 和 Ⅲ
- B．Ⅰ、Ⅱ 和 Ⅴ
- C．Ⅰ、Ⅱ 和 Ⅳ
- D．Ⅰ、Ⅱ、Ⅲ 和 Ⅴ`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-25/question.png`}],solution:{answer:String.raw`**选 B：Ⅰ、Ⅱ、Ⅴ。**`,explanation:String.raw`## 逐项判断

- **Ⅰ 对。** 运行态进程主动让出 CPU（例如执行 yield）后仍然具备运行条件，只是暂时不占用 CPU，因此可由运行态转为就绪态。
- **Ⅱ 对。** 阻塞进程等待的事件完成后，可能由协作进程或设备等引发唤醒；进程转为就绪态，等待调度。事件完成使其脱离阻塞，并不等于它立即获得 CPU。
- **Ⅲ 错。** I/O 完成对应等待 I/O 的阻塞态进程转为就绪态；就绪态转为运行态要由处理机调度程序选中。
- **Ⅳ 错。** 时间片用完时，进程仍可继续执行，只是本轮 CPU 使用机会结束，通常由运行态转为就绪态；阻塞是进程等待某个事件或资源时发生的转换。
- **Ⅴ 对。** 就绪态进程没有正在 CPU 上运行，不能在该状态下发出等待事件或资源的请求，因此不会直接由就绪态转为阻塞态。

所以正确的是 Ⅰ、Ⅱ、Ⅴ，选 B。`,pitfalls:String.raw`- 把“运行 → 就绪”和“运行 → 阻塞”混淆：时间片用完或主动让出 CPU，可回到就绪态；等待事件或资源才进入阻塞态。
- 误以为 I/O 完成会直接让进程上 CPU：I/O 完成只是使等待者就绪，之后还要等待调度。
- 把“由协作进程决定”误解成“由调度程序决定”：协作进程或事件完成可以使阻塞进程具备运行条件；调度程序决定的是哪个就绪进程获得 CPU。`,extension:String.raw`## 追问一：画出三态转换图，并说明每条箭头的原因。

**答：**

- 就绪 → 运行：调度选中
- 运行 → 就绪：时间片到或主动让出 CPU
- 运行 → 阻塞：等待事件或资源
- 阻塞 → 就绪：等待的事件完成

调度选中决定就绪 → 运行；时间片用完或主动让出 CPU 对应运行 → 就绪；等待事件或资源对应运行 → 阻塞；事件完成对应阻塞 → 就绪。

## 追问二：新建态与终止态各与哪些状态相连？

**答：** 新建态进程被接纳后进入就绪态；运行中的进程完成或被撤销后进入终止态。依具体系统模型，新建态也可能先进入挂起就绪态，终止态之后由系统回收资源；这些扩展状态不改变本题的三态判断。`}},{id:`wangdao-mock2-major-26`,questionNumber:26,title:`多线程系统的特长：哪项描述不恰当？`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · 线程`,tags:[`多线程`,`线程并发`,`线程适用场景`,`键盘输入`],summary:`区分多线程适合并行计算、并发服务和交互任务的场景，与把单一输入事件流不必要地按应用拆成线程。`,source:`题目来自用户提供的「408 模拟 · 26 王道 8 套卷」照片；截图中未显示答案，以下答案为本站推导。`,content:String.raw`在下列描述中，哪个不是多线程系统的特长？（ ）

- **A．** 利用线程并行地执行矩阵乘法运算
- **B．** Web 服务器利用线程请求 HTTP 服务
- **C．** 键盘驱动程序为每个正在运行的应用配备一个线程，用来响应相应的键盘输入
- **D．** 基于 GUI 的调试程序用不同线程处理用户的输入、计算、跟踪等操作`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-26/question.png`}],solution:{answer:String.raw`**选 C。** 矩阵乘法可拆分为并行任务；Web 服务器可用多个线程并发处理请求；GUI 调试程序把输入、计算和跟踪分开处理，也能改善交互响应。键盘输入来自一个设备，是单一事件流；为每个正在运行的应用都配置一个驱动线程，并不是多线程的特长，通常既无必要，也不能让键盘事件本身并行产生。`,explanation:String.raw`## 判断标准：线程有没有带来并行或并发收益

多线程的价值不在于线程数量多，而在于能否把可并行的工作分开执行，或让多个任务在等待与处理期间交错推进。

- **A 成立：** 矩阵乘法可拆成多个相互独立的行、块或元素计算，多个线程可并行完成这些工作。
- **B 成立：** Web 服务器会面对多个请求。线程可分别处理不同请求，一个请求等待 I/O 时，其他请求仍可推进。
- **D 成立：** 输入响应、计算、跟踪等工作可以分开调度；计算或跟踪进行时，界面线程仍能响应用户操作。
- **C 不恰当：** 键盘是一个输入设备，产生的是单一事件流。让驱动程序为每个正在运行的应用分别配置线程，不是处理这条事件流所必需的并行化；更合理的是由驱动处理输入，再按目标分发事件。大量应用各有一个专用键盘线程还会带来调度与管理开销。

因此，题目问「不是多线程系统的特长」，答案是 C。`,pitfalls:String.raw`- **以为线程越多越好：** 线程有调度、切换和管理成本；只有任务能并行或并发推进时，线程化才可能带来收益。
- **把「每个设备一个线程」当成通用规则：** 驱动可由线程服务设备，但事件通常由驱动读取并分发给应用，不需要为每个应用都配置键盘驱动线程。
- **只凭「有线程」判断属于特长：** 要检查线程是否解决了并行计算、请求并发或交互响应问题；无收益的线程化不是特长。
- **把键盘事件说成绝对不能并发处理：** 事件到达是单一输入流，但后续应用工作可以并发；本题不恰当的是给每个应用配一个键盘响应线程这一设计。`,extension:String.raw`## 追问一：在这些场景里，多线程相比多进程有什么优势？

**答：** 同一进程内的线程共享地址空间，线程间共享数据和通信通常更方便，创建与切换开销通常也小于进程。代价是共享数据需要同步，出错时也可能相互影响。

## 追问二：什么情况下多线程反而有害？

**答：** 任务本来只需串行处理时，增加线程会带来不必要的调度和管理开销；计算密集任务若共享数据很多，也可能因锁竞争和同步开销抵消并行收益。

## 追问三：键盘只有一个事件流，能否把事件处理并行化？

**答：** 可以并行处理彼此独立的后续工作，但输入事件的到达顺序仍需保留；是否拆成线程取决于工作量与同步成本，而不是给每个应用固定分配一个驱动线程。`}},{id:`wangdao-mock2-major-27`,questionNumber:27,title:`时间片轮转调度：哪些因素影响时间片大小？`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · 处理机调度`,tags:[`时间片轮转调度`,`时间片`,`响应时间`,`上下文切换`],summary:`判断时间片大小应考虑哪些因素，区分响应时间、就绪队列规模、处理能力与进程运行时间。`,source:`题目来自用户照片「408 模拟 · 26 王道 8 套卷」，照片中无可见答案键；答案为本站推导。`,content:String.raw`在时间片轮转调度算法中确定合理的时间片大小很重要，下列哪些因素应当被考虑在内？（ ）

- Ⅰ．系统对响应时间的要求
- Ⅱ．就绪队列中进程的数量
- Ⅲ．系统的处理能力
- Ⅳ．各个进程所需的运行时间

- **A．** Ⅰ、Ⅱ、Ⅲ
- **B．** Ⅱ、Ⅲ、Ⅳ
- **C．** Ⅰ、Ⅲ、Ⅳ
- **D．** Ⅰ、Ⅱ、Ⅲ、Ⅳ`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-27/question.png`}],solution:{answer:String.raw`**选 A：Ⅰ、Ⅱ、Ⅲ。**

时间片 $q$ 需要兼顾响应时间、就绪队列规模和处理机开销。各进程所需运行时间不是确定时间片大小的依据。`,explanation:String.raw`## 逐项判断

- **Ⅰ．系统对响应时间的要求：考虑。** 若有 $n$ 个进程，等候一轮的时间量级约为 $nq$；响应要求越严格，时间片应相应调整。
- **Ⅱ．就绪队列中进程的数量：考虑。** 进程越多，同一进程等待轮转的时间越长。队列较长时通常需要较小的时间片，才能满足响应要求。
- **Ⅲ．系统的处理能力：考虑。** 时间片过小会增加时钟中断和上下文切换频率，处理机花在调度开销上的比例上升；应结合系统处理能力选择合适粒度。
- **Ⅳ．各个进程所需的运行时间：不考虑。** 调度时通常并不知道每个进程还需要运行多久；轮转调度用固定时间片公平地分配处理机，不依赖预知各进程运行时间。

因此应考虑Ⅰ、Ⅱ、Ⅲ，选 A。`,pitfalls:String.raw`- 把「进程运行时间未知」误读成「它也是应考虑的因素」；时间片不依据逐个进程的实际运行需求来定。
- 误以为时间片越小越好。过小会使切换更频繁，调度开销增大。
- 把响应时间与周转时间混为一谈。响应时间关注进程获得响应前的等待；周转时间是从提交到完成的总时间。`,extension:String.raw`## 追问一：就绪队列中的进程数变多，为什么通常要缩短时间片？

**答：** 一轮轮转中，进程需等待其他进程各运行一个时间片；若有 $n$ 个进程，等待一轮的量级约为 $nq$。在响应要求不变时，$n$ 增大就需要适当减小 $q$。

## 追问二：时间片大到进程通常一次用完，会退化成什么调度？

**答：** 退化为先来先服务（FCFS）调度。进程长时间占用处理机后才轮到下一个进程，交互响应性会变差。`}},{id:`wangdao-mock2-major-28`,questionNumber:28,title:`语句间的数据依赖与前驱图`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · 进程同步与程序执行`,tags:[`数据依赖`,`前驱图`,`读写集合`,`拓扑排序`],summary:`根据四条语句的读写关系确定必须满足的执行先后约束。`,source:`题目来自用户提供的「408 模拟 · 王道模拟题第二套」截图上半部分；截图中无可见答案键，答案由本站根据读写集合独立推导并枚举验证。`,content:String.raw`（28）对于下面的四条语句，（ ）是对应的前驱图。

- S1：a=x+y；
- S2：b=z+1；
- S3：c=a-b；
- S4：w=c+1；

- **A．** S1→S3，S2→S3，S3→S4
- **B．** S1→S4，S2→S4，S4→S3
- **C．** S1→S2→S3→S4
- **D．** S1→S2→S4→S3`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-28/question.png`}],solution:{answer:String.raw`**选 A。** 必须满足的依赖边为 S1→S3、S2→S3、S3→S4。`,explanation:String.raw`## 从读写集合推导依赖

- S1 读 $x,y$，写 $a$。
- S2 读 $z$，写 $b$。
- S3 读 $a,b$，写 $c$。
- S4 读 $c$，写 $w$。

若一条语句写出的变量被另一条语句读取，写者必须先于读者。因此 $a$ 产生 S1→S3，$b$ 产生 S2→S3，$c$ 产生 S3→S4。其余写入都没有被其他语句读取，不产生额外的先后边。

已独立运行脚本：对上述读集合、写集合逐对检查「前者写集合与后者读集合有交集」，得到边集 [('S1','S3'), ('S2','S3'), ('S3','S4')]。再枚举四条语句的全部排列并过滤违反边约束者，合法拓扑序列恰有 2 个：S1→S2→S3→S4，以及 S2→S1→S3→S4。

S1 与 S2 读写的变量互不相交，彼此独立，可以交换执行顺序；两者都必须先于读取 $a,b$ 的 S3，S3 又必须先于读取 $c$ 的 S4。故精确的最小前驱图是 A。C 虽然也是一个合法执行顺序，但它额外规定 S1 必须先于 S2，加入了并不存在的数据依赖，不能作为对应的精确前驱图。B、D 则把依赖次序颠倒或漏掉必要边。`,pitfalls:String.raw`- 把「一条合法执行序列」误当成「精确的前驱图」；前驱图只连必须的先后约束，不应给独立语句添加虚假边。
- 只看语句书写顺序而漏掉数据来源；应逐个变量检查写者与读者。
- 忽略 S1 和 S2 的执行顺序可以互换；二者的读写集合不冲突。`,extension:String.raw`**问：** S1 和 S2 能否并行执行？为什么？

**答：** 可以。S1 读取 $x,y$ 并写 $a$，S2 读取 $z$ 并写 $b$；两者读写集合没有交集，互不依赖。枚举结果也给出两种合法顺序：S1 在 S2 前，或 S2 在 S1 前。

**问：** 如果在 S3 之前执行 S4，哪里会出错？

**答：** S4 要读取 $c$，而 $c$ 由 S3 写入；若 S4 先执行，它会读到尚未由本组语句计算出的值，因此必须有 S3→S4。

**问：** 为什么选项 C 不是对应的精确前驱图？

**答：** C 额外加入 S1→S2，强行规定两个独立语句的顺序。前驱图应只表达真实的必要依赖；这个额外约束不改变某一种执行顺序的合法性，却错误地排除了 S2 先于 S1 的合法调度。`}},{id:`wangdao-mock2-major-29`,questionNumber:29,title:`行优先二维数组：两种循环次序的缺页比较`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · 虚拟内存与页面置换`,tags:[`虚拟内存`,`页面置换`,`LRU`,`局部性`],summary:`比较两段循环按不同次序访问行优先存放的二维数组时，LRU 下的数据缺页次数。`,source:`用户提供的模拟题截图第29题；截图未显示答案，答案由本站按题设条件独立模拟推导。`,content:String.raw`如下程序在页式虚存系统中执行，程序代码位于虚空间 0 页中，$A$ 为 $128\times128$ 的数组，在虚空间以行为主序存放，每页存放 128 个数组元素。工作集大小为 2 个页框（开始时程序代码已在内存中，占 1 个页框），用 LRU 算法，下面两个对 $A$ 初始化的程序引起的页故障数约为（ ）。

程序1：

~~~c
for (j = 1; j <= 128; j++)
    for (i = 1; i <= 128; i++)
        A[i][j] = 0;
~~~

程序2：

~~~c
for (i = 1; i <= 128; i++)
    for (j = 1; j <= 128; j++)
        A[i][j] = 0;
~~~

- **A．** 程序1：$128\times128$ 次，程序2：$128$ 次
- **B．** 程序1：$128$ 次，程序2：$128\times128$ 次
- **C．** 程序1：$64$ 次，程序2：$64\times64$ 次
- **D．** 程序1：$64\times64$ 次，程序2：$64$ 次`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-29/question.png`}],solution:{answer:String.raw`**选 A：程序1发生 $128\times128=16384$ 次数据缺页，程序2发生 $128$ 次数据缺页。**`,explanation:String.raw`## 先确定页框里能放什么

总共只有 2 个页框，其中 1 个已被代码页占用，所以只剩 **1 个数据页框**。每次数据访问前都引用代码页 0。按题设，代码页最初就在内存；代码访问后，它成为最近使用页，随后数据访问至多置换数据页，因此代码页一直驻留。下面每次数据访问前的代码页引用都是命中，数据页框只能保留最近访问的那一行。

这里按题目的常规页对齐假设：每行 128 个元素，恰好占 1 页，$A[i][j]$ 落在第 $i$ 行对应的数据页。代码页不算数组数据页；不能把“2 个页框”误读成“2 个数据页框”。

## 用 2×2 小例子看 LRU

把数组缩成 2×2、每页容纳一行，仍保留“代码页 + 1 个数据页框”。初始只有代码页 C 在内存。记 F 为数据缺页，H 为数据命中；每次列出的数据访问之前，都先访问代码页 C：

- 列优先：$(1,1):F$，页框为 C、1；$(2,1):F$，页框为 C、2；$(1,2):F$，页框为 C、1；$(2,2):F$，页框为 C、2。共 4 次缺页。
- 行优先：$(1,1):F$，页框为 C、1；$(1,2):H$，页框为 C、1；$(2,1):F$，页框为 C、2；$(2,2):H$，页框为 C、2。共 2 次缺页。

模拟器逐次执行“代码页引用 → 数据页引用”，完整小例子输出为：

~~~text
toy column: [(1, 1, 1, 'F', ('C', 1)), (2, 1, 2, 'F', ('C', 2)), (1, 2, 1, 'F', ('C', 1)), (2, 2, 2, 'F', ('C', 2))]
toy row: [(1, 1, 1, 'F', ('C', 1)), (1, 2, 1, 'H', ('C', 1)), (2, 1, 2, 'F', ('C', 2)), (2, 2, 2, 'H', ('C', 2))]
~~~

每个元组依次为 $(i,j,数据页,命中状态,访问后的 LRU 页框顺序)$。这也直接展示：在两次数据访问之间访问代码页，并不会腾出第二个数据页框。

## 代回 128×128 数组计数

- **程序1是列优先访问。** 固定 $j$ 后，$i$ 从 1 到 128，依次访问第 1 至第 128 行的 128 个不同数据页。只有 1 个数据页框，每次都缺页；下一列又从第 1 行开始，上一列末尾留下的是第 128 行，仍无法命中。因此每列 128 次缺页，共 $128\times128=16384$ 次。
- **程序2是行优先访问。** 固定 $i$ 后，内层 $j$ 的 128 次访问都落在同一行页。该行第一次访问缺页，之后 127 次命中；转到下一行时发生下一次缺页。因此共有 128 行、128 次缺页。

独立逐次模拟的输出如下；其中 frames 包含代码页，code_faults 统计每次数据访问之前对代码页的引用是否缺页：

~~~text
frames=2 column: data_faults, code_faults, code_resident, final_frames = (16384, 0, True, 2)
frames=2 row: data_faults, code_faults, code_resident, final_frames = (128, 0, True, 2)
~~~

所以对应 A。`,pitfalls:String.raw`## 常见误区

- **把总页框数当成数据页框数。** 2 个总页框里有 1 个固定驻留的代码页，只剩 1 个容纳数据。
- **只看数组总大小或页数。** 128 页都要访问，不等于只缺页 128 次；列优先在只有 1 个数据页框时，每一列都会把 128 页完整扫一遍。
- **忽略行优先布局。** $A[i][j]$ 中内层下标连续变化时，程序2连续访问同一行页；程序1则在各行页之间来回切换。
- **漏掉代码访问但把它算作数据缺页。** 每次数据访问前代码页 0 都命中，且代码页占用的页框已计入总数；答案统计的是数组数据页缺页。`,extension:String.raw`**问：** 如果把两段程序的循环次序互换，数据缺页次数各是多少？

**答：** 原程序1改成行优先后为 $128$ 次；原程序2改成列优先后为 $128\times128=16384$ 次。原因是内层循环沿行访问时，同一行的 128 个元素共用一个数据页；沿列访问时则在 128 个行页间轮换，而只有一个数据页框。

**问：** 若总页框数至少为 129（包括代码页），且数据页初始为空，两种访问次序各缺页多少次？

**答：** 两种次序都是 $128$ 次。扣除驻留代码页后，至少有 128 个数据页框，能同时容纳数组的 128 个行页；每个数据页首次访问时缺页一次，此后命中。模拟 129 个总页框得到：

~~~text
frames=129 column: data_faults, code_faults, code_resident, final_frames = (128, 0, True, 129)
frames=129 row: data_faults, code_faults, code_resident, final_frames = (128, 0, True, 129)
~~~`}},{id:`wangdao-mock2-major-30`,questionNumber:30,title:`索引结点共享与符号链共享的四条判断`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · 文件系统与文件共享`,tags:[`文件共享`,`索引结点`,`硬链接`,`符号链接`,`链接计数`],summary:`比较基于索引结点与基于符号链两种文件共享方式，判断四条陈述中哪一条成立。`,source:`用户提供的王道模拟题第二套（页眉标注「408模拟·26王道8套卷」，页脚「第 20 页」）第 30 题截图；该题跨页，截图已去掉上一页页脚与下一页页眉后拼接，页边界由逐行像素检查确定（保留 y 0–92 与 y 288–402 两段，只切除纯空白与页眉页脚，题面文字一行未删）；截图未显示答案键，答案由本站独立推导，并以 POSIX.1-2024 与 Linux man-pages 核对。`,content:String.raw`（30）文件共享可以基于索引节点，也可以基于符号链。在下列关于这两种文件共享方式的说法中，正确的是（ ）。

- **A．** 采用索引节点的文件共享方式，文件增加的部分不能被共享
- **B．** 在索引节点中设置有链接计数值 $count$，表示本索引节点被打开的次数
- **C．** 符号链接能够用于链接世界上任何地方的计算机中的文件，只需提供该文件所在机器的网络地址以及该机器中的文件路径即可
- **D．** 采用符号链接时，所有共享该文件的用户都拥有指向其索引节点的指针`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-30/question.png`}],solution:{answer:String.raw`**选 C。** A、B、D 都把索引结点共享与符号链共享的性质对调或混用了：只有 C 与教材对符号链共享的描述一致。`,explanation:String.raw`## 逐项判断

- **A 错。** 基于索引结点的共享（硬链接）让多个目录项指向**同一个索引结点**，磁盘上只有一份文件实体。索引结点里存的是文件大小与数据块指针，属主之后追加的内容写在同一索引结点之下，所有链接都经由这一个索引结点读取，所以**新增部分同样是共享的**。Linux man-pages 的 symlink(7) 说得更直白：每一个硬链接都是对**同一个索引结点号**的引用，"对文件的修改与使用哪个名字引用它无关"。
- **B 错。** 索引结点中的 $count$ 是**链接计数**（引用计数），表示有多少个目录项（即多少个名字）链接到本索引结点，并不是"本索引结点被打开的次数"。POSIX 与 Linux 都把这一项定义为链接数：man-pages 的 inode(7) 对 stat.st_nlink 的说明就是 "This field contains the number of hard links to the file"。打开次数属于另一层结构：每次 open 都在内存的打开文件表里建立一份打开文件描述，由内存中的引用计数管理，与磁盘索引结点上的链接计数互不影响。408 真题中"建立符号链接不影响引用计数值、建立硬链接使引用计数值加一、删除原文件后计数减一"的经典结论，也正是把 $count$ 当作链接计数在用。
- **C 对。** 符号链（符号链接、软链接）保存的是**目标文件的路径名**，而不是指向目标索引结点的指针。正因为里面放的是一串路径名，它原则上可以指向任何能用路径名表示的对象，包括别的机器上的文件——教材正是把它概括为"提供该文件所在机器的网络地址以及该机器中的文件路径即可"。
- **D 错。** 这句话描述的是**索引结点共享**（硬链接）的性质，而不是符号链接的性质。符号链接本身是一个独立文件，有自己的索引结点，内容是目标路径名；持有符号链接的用户要访问目标，必须先做路径名解析，解析成功后才间接到达目标的索引结点。要做到"所有共享者都拥有指向该索引结点的指针"，只能用硬链接方式（且只能在同一文件系统内）。

## C 的边界：教材口径与真实 POSIX 符号链接的区别

C 是本题的正确答案，但它是教材层面的**概念性描述**；把它等同于"内核会自动去别的机器上取文件"就错了，两者必须分开说：

- **教材口径（本题的判分依据）。** 符号链共享的本质是"以路径名做间接引用"：链接里保存的只是一个名字（机器的网络地址 + 该机器上的文件路径），访问时按这个名字去找目标。因此它天然不受"必须指向本机同一文件系统内的索引结点"的限制，可以跨文件系统，也可以跨机器。
- **真实 POSIX 符号链接。** POSIX.1-2024 的 symlink() 规范规定，链接内容是"只被当作字符串处理、不作为路径名做校验"（"shall be treated only as a string and shall not be validated as a pathname"）；Linux man-pages 的 symlink(7) 也说明符号链接"指向另一个名字，而不是指向底层的对象"，它的解析方式是**路径名展开**。也就是说，**纯粹的 POSIX 符号链接本身不会自动联网**：内核只在本地（包含已挂载内容）的命名空间里解析这个字符串；链接里即便写着看似远程地址的内容，若没有任何解析者认领，它只是一个悬空链接。
- **真实系统的跨机路径从哪来。** 要让"另一台机器上的文件"真的变成可解析的路径名，需要有网络文件服务或协议解析器参与：把远端目录挂载到本地某个挂载点（NFS、SMB/CIFS 等），或由应用层接管这种命名方式（例如把 URL 交给客户端解析）。挂载之后，符号链接里写的路径名就能落到远端文件上——教材的说法在**这个意义上**成立：链接存的是名字，而这个名字属于哪台机器的命名空间，由系统提供的文件服务决定。
- **落到本题。** 在 A、B、D 都明确违背硬链接/符号链接基本性质的前提下，C 是唯一成立的选项；同时应当知道，"网络地址 + 文件路径"是教材的表述，真实系统还需要网络文件服务来解析这个名字，符号链接不会因为写了远程地址就自动跨机器取值。

## 证据说明

截图未显示官方答案。本题按教材的文件共享模型推导；实现层面的核对参考 [Linux symlink(7)](https://man7.org/linux/man-pages/man7/symlink.7.html)、[inode(7)](https://man7.org/linux/man-pages/man7/inode.7.html) 与 [POSIX symlink()](https://pubs.opengroup.org/onlinepubs/9799919799/functions/symlink.html)。这些规范支持 A、B、D 的判断以及「符号链接保存路径名」的事实，但并不保证 C 所说的任意远程访问；C 必须按本题教材口径理解，并以可用的远程文件服务为前提。`,pitfalls:String.raw`## 常见误区

- **把 $count$ 当作"被打开的次数"。** 索引结点里的 $count$ 是链接到本索引结点的目录项数目；打开次数记录在内存的打开文件表（打开文件描述及其引用计数）中，多次打开互不影响索引结点上的 $count$。
- **把两种共享方式的性质对调。** "所有共享者都拥有指向索引结点的指针"是硬链接（索引结点共享）的特征；符号链接用户拿到的只是一个内容为路径名的独立文件，需要解析才能到达目标。
- **以为共享只在建立链接的那一刻成立。** 索引结点共享是同一个索引结点被多个目录项引用，文件之后增长的部分仍然在这一个索引结点里，共享者都能看到。
- **把 C 的教材说法读成"符号链接会自动联网取远程文件"。** POSIX 符号链接的内容只是字符串，内核在本地命名空间做路径名解析；跨机器需要 NFS/SMB 之类的网络文件服务或应用层解析器，否则链接悬空。
- **以为符号链接更省空间。** 符号链接要额外占用一个索引结点和存放路径名的空间，访问时还要多做一次路径名解析，开销高于硬链接。`,extension:String.raw`**问：** 索引结点里的链接计数 $count$ 与打开文件表里的引用计数分别统计什么？两者可以互相替代吗？

**答：** 索引结点里的 $count$ 统计指向该文件的硬链接数，建立硬链接加一，删除目录项减一；打开文件描述及其引用是另一套内存管理结构，不能拿链接数当打开次数。只有链接数为零且不再有打开引用等保留条件时，才能回收文件实体。因此删除最后一个名字后，已打开的文件描述符仍可继续访问，直到相关打开引用释放。

**问：** 为什么符号链接能跨文件系统、跨机器，而硬链接不行？

**答：** 硬链接是目录项直接指向目标索引结点，而索引结点号只在**同一个文件系统内**唯一，所以硬链接不能跨文件系统（多数系统也不允许对目录做硬链接，以免形成环）。符号链接保存的是路径名，路径名由命名空间解析，而命名空间可以把别的文件系统甚至别的机器上的目录挂载进来，所以它能跨文件系统；跨机器则必须依靠网络文件服务把远端目录挂进本地命名空间，正如上文所说。

**问：** 删除原文件后，两种共享方式下共享者的链接分别会怎样？

**答：** 索引结点共享（硬链接）不受影响：只要还有别的目录项链接着该索引结点，$count$ 就不为 0，文件实体不回收，其他名字照常访问。符号链接会失效：它只保存路径名，原文件（或原名字）删除后路径名解析不到目标，链接变成悬空链接（dangling link），访问时报文件不存在。`}},{id:`wangdao-mock2-major-31`,questionNumber:31,title:`三种 I/O 控制方式与用户进程阻塞态的对应`,type:`题目`,date:`2026-09-30`,chapter:`操作系统 · I/O 管理`,tags:[`I/O控制方式`,`程序直接控制`,`中断控制方式`,`DMA控制方式`,`进程阻塞态`],summary:`判断程序直接控制、中断控制、DMA 三种 I/O 控制方式中，哪些会使发起 I/O 请求的用户进程进入阻塞态。`,source:`用户提供的王道模拟题第二套（页眉标注「408模拟·26王道8套卷」，页脚「第 20 页」）第 31 题截图；截图未显示官方答案，结论由本站按教材同步 I/O 语义独立推导。`,content:String.raw`在下列 I/O 方式中，会导致用户进程进入阻塞态的是（ ）。

Ⅰ. 程序直接控制方式　Ⅱ. 中断控制方式　Ⅲ. DMA 控制方式

- **A．** Ⅰ、Ⅱ
- **B．** Ⅰ、Ⅲ
- **C．** Ⅱ、Ⅲ
- **D．** Ⅰ、Ⅱ、Ⅲ`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-31/question.png`}],solution:{answer:String.raw`**选 C：Ⅱ、Ⅲ。** 在教材默认的同步（阻塞式）I/O 接口语义下，中断控制方式和 DMA 控制方式都会使发起 I/O 的用户进程进入阻塞态，程序直接控制方式不会。`,explanation:String.raw`## 判断口径

题目问的是：一个用户进程**发起一次 I/O 请求之后、数据传送完成之前**处于什么状态。按 408 教材默认的**同步（阻塞式）I/O 接口**语义，进程调用 I/O 要一直等到数据到手才能继续执行。

## 三种方式逐一分析

- **Ⅰ 程序直接控制方式（程序查询方式）：不因等待设备而阻塞。** CPU 反复读取设备状态寄存器，直到设备就绪，再执行数据传送。查询期间进程处于运行态（忙等待），不会因设备尚未就绪而挂起；若被时钟抢占，可以转入就绪态，这仍不等于阻塞态。
- **Ⅱ 中断控制方式：阻塞。** 在本题默认的阻塞式 I/O 模型中，调用者发起请求后挂起等待，CPU 可以执行其他进程。设备通过中断通知 CPU；内核确认该请求完成后，将等待它的进程唤醒到就绪态。不是每次中断都代表整个用户请求已经完成。
- **Ⅲ DMA 控制方式：阻塞。** 数据传送由 DMA 控制器在设备与内存之间完成，CPU 只在传送开始前做预处理（送出内存地址、传送长度、传送方向）和结束后做后处理。但发起这次 I/O 的**用户进程**仍要等整块数据传送完毕才能继续（在等待队列上挂起），因此也处于阻塞态。

Ⅰ 不阻塞，Ⅱ、Ⅲ 阻塞，对应 **C**。

## 证据与口径

本题是概念判断题，不涉及数值模拟。以上按 408 常见的阻塞式 I/O 模型推导，并未引用截图中的官方答案。区分关键是「调用者是否挂起」与「CPU 能否执行其他进程」：轮询消耗调用者的执行时间；中断和 DMA 让 CPU 不必忙等，但阻塞式请求的调用者仍需等待完成。实际操作系统也支持异步接口，不能只看硬件控制方式就断言调用者一定阻塞。`,pitfalls:String.raw`## 常见误区

- **把「CPU 在忙」当成「进程被阻塞」。** 程序直接控制方式下 CPU 确实很忙，但忙的正是发起 I/O 的那个进程自身，它处于运行态；阻塞的含义是进程被挂起、CPU 交给别人运行。
- **把「CPU 能执行其他进程」当成「进程不阻塞」。** 中断方式和 DMA 方式下 CPU 可以调度别的进程，只说明本次 I/O 没有占住 CPU；发起 I/O 的进程仍在等结果，恰恰处于阻塞态。
- **忽略教材用的是同步 I/O 语义。** 本题结论的适用范围是 408 教材默认的阻塞式 I/O 接口。若换成异步 I/O 接口（发起后立即返回，完成时通过回调或事件通知），一次请求未必使调用者阻塞——这已超出本题口径，不应据此改选答案。
- **以为 DMA 完全不需要 CPU。** DMA 传送期间 CPU 不介入数据搬运，但传送的启动与结束处理仍需要 CPU，进程也要等传送真正结束。`,extension:String.raw`**问：** 上述三种方式中，哪几种在数据传送过程中 CPU 可以去执行其他进程？

**答：** 中断控制方式和 DMA 控制方式能够让 CPU 不必持续轮询设备，因而在等待设备或 DMA 传送期间执行其他进程。程序直接控制方式消耗 CPU 时间轮询，不能因等待设备而主动释放 CPU；但支持抢占的系统仍可以通过时钟中断调度别的进程。本题按常见阻塞式接口讨论调用者状态，不把硬件控制方式与异步 API 混为一谈。

**问：** 如果题目改成「由 CPU 主动、反复读取设备状态寄存器来判断设备是否就绪」，这是哪种方式？它会让进程进入阻塞态吗？

**答：** 这是程序直接控制方式（也称程序查询方式）。等待设备期间执行轮询，属于忙等待，不因设备未就绪而进入阻塞态；若被抢占则转入就绪态。代价是反复查询消耗 CPU 执行时间。`}},{id:`wangdao-mock2-major-32`,questionNumber:32,title:`磁盘高速缓存：四个说法里哪一句错了？`,type:`题目`,date:`2026-09-30`,chapter:`文件管理 · 提高磁盘 I/O 速度的途径`,tags:[`磁盘高速缓存`,`Disk Cache`,`缓冲区`,`虚拟盘`,`置换策略`,`写回磁盘`],summary:`关于磁盘高速缓存的四个说法，只有一个是错的；顺带分清它与缓冲区、硬盘自带缓存、虚拟盘的差别。`,source:`用户提供的「408 模拟 · 26 王道 8 套卷」第 32 题截图；截图没有答案标注。本题为本站推导，已用公开课程笔记核对磁盘高速缓存的定义与三个设计问题，未直接核验教材原书。`,content:String.raw`关于磁盘高速缓存（Disk Cache），下列说法中错误的是（ ）

- **A．** 磁盘高速缓存是指在磁盘中设置的一个缓冲区，用于保存某些内存块的副本
- **B．** 当出现访问磁盘的请求时，先查看磁盘高速缓存，如果盘块内容已在磁盘高速缓存中，就省去了启动磁盘的操作
- **C．** 设计磁盘高速缓存时，需考虑如何将磁盘高速缓存中的数据传输给请求进程
- **D．** 设计磁盘高速缓存时，需考虑采用什么样的置换策略以及已修改的盘块数据何时写回磁盘`,attachments:[{name:`查看原题截图`,path:`wangdao-mock2-major-32/question.png`}],solution:{answer:String.raw`**选 A。**

教材的定义是「在**内存**中为磁盘盘块设置的一个缓冲区，在缓冲区中保存了某些盘块的副本」。A 把这块缓冲区挪到了「**磁盘**中」，还把保存对象写成「内存块的副本」，位置和作用都反了，所以它是错误说法。B 对应「命中即免去启动磁盘」，C 对应教材列出的第一个设计问题（数据交付），D 对应另外两个设计问题（置换策略、已修改盘块的写回时机），B、C、D 都是正确说法。`,explanation:String.raw`## 判据：先记住教材的这句话

按本题教材模型，磁盘高速缓存（Disk Cache）是指在**内存**中为**磁盘盘块**设置的缓冲区，保存某些**盘块的副本**。已与 [公开课程笔记「磁盘 I/O 速度」](https://blog.csdn.net/swadian2008/article/details/131595846) 中的定义及三个设计问题核对；该笔记是二手资料，不是官方答案。

三个关键字：**内存**、**盘块副本**、**磁盘的**。题目问「错误的」，就拿这三条去筛每个选项。教材紧接着列出设计磁盘高速缓存时需要考虑的三个问题：

- 如何将磁盘高速缓存中的数据传送给请求进程（数据交付）；
- 采用什么样的置换策略；
- 已修改的盘块数据何时被写回磁盘。

## 逐项判断

- **A．** 「在磁盘中设置的一个缓冲区，用于保存某些内存块的副本」——位置错了：缓冲区开在**内存**里；副本也反了：缓存里存的是**磁盘盘块**的副本，不是内存块的副本。**这是错误说法。**
- **B．** 「出现访问磁盘的请求时先查看磁盘高速缓存，命中就省去了启动磁盘的操作」——正确。磁盘高速缓存的用处就是在内存里留一份盘块副本，读请求先在缓存里找，命中就不必启动磁盘，从而省掉寻道、旋转等待和盘片传输。
- **C．** 「需考虑如何将磁盘高速缓存中的数据传输给请求进程」——正确。这正是教材的第一个设计问题，也就是数据交付方式：一种是把缓存里的数据直接复制到请求进程的内存工作区（数据交付），另一种是只把指向缓存区域的指针交给请求进程（指针交付），后者传送的数据量小，省去一次复制。
- **D．** 「需考虑采用什么样的置换策略以及已修改的盘块数据何时写回磁盘」——正确。缓存空间有限，满了要淘汰，所以要用 LRU、NRU、LFU 之类的置换算法；缓存中被写过的盘块是脏数据，什么时候写回磁盘直接决定故障时数据一致性的损失窗口，这也是教材列出的第三个设计问题。

## 四样容易混的东西

- **磁盘高速缓存**：在**内存**里，由**操作系统**管理，保存磁盘盘块及尚待写回的修改，目标是减少磁盘 I/O；脏块可能暂时比磁盘上的版本更新。
- **缓冲区（buffer）**：也在内存，但它是**某一次 I/O 的数据中转站**，用于缓冲设备与 CPU/内存之间的速度差异和通信；数据被取走后空间即可复用，不要求长期保留副本。
- **磁盘（驱动器）自带缓存**：由设备固件管理，是设备内部的硬件缓存，与本题操作系统在主存里设置的磁盘高速缓存不是一回事。
- **虚拟盘 / RAM 盘**：用内存仿真磁盘，用户在其中创建和管理文件；磁盘高速缓存则由操作系统管理已有磁盘块的缓存及待写回修改。

## A 的错法很典型

A 把缓存的位置和副本对象都颠倒了：本题模型中是「内存里保存磁盘块」，不是「磁盘里保存内存块」。B、C、D 分别对应读命中、数据交付、置换与写回，所以选 A。`,pitfalls:String.raw`- 按字面把「磁盘高速缓存」理解成「磁盘里面的缓存」，于是认为 A 是对的。定义里「磁盘」修饰的是被缓存的对象（磁盘盘块），不是缓存所在的位置（内存）。
- 把磁盘高速缓存与缓冲区混为一谈：两者都在内存，但缓冲区是一次 I/O 的中转站，高速缓存保留的是可供重复命中的副本。
- 把虚拟盘（RAM 盘）当成磁盘高速缓存：虚拟盘内容由用户控制、初始为空；高速缓存内容由 OS 控制，缓存的是磁盘上已有的盘块。
- 认为 C 是可有可无的干扰项而排除它：数据交付（直接交付还是指针交付）正是教材列出的第一个设计问题。
- 只看到 D 的前半句「置换策略」而忽略后半句「已修改盘块何时写回磁盘」；写回时机是教材列出的第三个设计问题，也决定了故障后数据不一致的损失窗口。另外，命中只省掉读磁盘，写操作该落盘时仍要落盘。`,extension:String.raw`**问：** 磁盘高速缓存和磁盘（驱动器）自带的缓存有什么区别？

**答：** 位置和管理者不同。本题的磁盘高速缓存是主存中的软件级缓存，由操作系统管理；驱动器自带缓存属于设备内部，由固件管理。不要把它们当作同一级结构；是否具备掉电保护也取决于具体设备。

**问：** 磁盘高速缓存和缓冲区都在内存里，区别在哪？

**答：** 目标不同。磁盘高速缓存保存的是磁盘盘块的副本，命中时不必启动磁盘，所以要在内存里长期驻留、按置换策略淘汰；缓冲区是某次 I/O 的数据中转站，用于解决设备与 CPU/内存之间的速度不匹配，数据取走后这块空间即可复用。可以把缓冲区理解为「必经之路」，把高速缓存理解为「可能还要再用的副本」。

**问：** 命中磁盘高速缓存，省掉的是哪部分时间？

**答：** 对本题讨论的读请求，命中可省去磁盘读 I/O，因而避免机械磁盘的寻道、旋转等待和盘片数据传输；但仍需要内存访问和数据交付，不能说耗时为零。

**问：** 为什么缓存中已修改的盘块不能无限期留在内存里？

**答：** 脏块是尚未持久化的修改，断电或故障可能使其丢失。系统需要周期性写回、淘汰时写回，以及按应用持久化要求同步等机制；不能只等 LRU 淘汰，因为频繁访问的脏块可能长时间不被淘汰。具体周期与可靠性保证依系统而定。

**问：** 把置换策略从 LRU 换成 FIFO，会影响正确性吗？

**答：** 在两种策略都正确处理脏块写回、访问一致性和必要同步的前提下，改换淘汰策略主要改变命中率及写回时机，不应改变正常运行时读取到的逻辑内容。淘汰脏块前必须保留或写回其修改；不能用「最终会写回」替代这一要求。`}}],Em=[{id:`io-interrupt-dma-bus-clock`,questionNumber:44,title:`中断与 DMA 的请求次数和 I/O 总线时钟`,type:`题目`,date:`2026-10-01`,chapter:`输入/输出系统 · 中断与 DMA`,tags:[`中断方式`,`DMA`,`周期窃取`,`I/O 总线`,`访存次数`],summary:`由主频、CPI 与 Cache 命中率求每秒访主存次数，再由字符设备中断与块设备 DMA 的传输率求每秒请求次数和 I/O 总线时钟下限。`,source:`学生提供的试卷照片（第 6 页，第 44 题），图上未显示答案；解析为本站推导。K/M 按十进制（1KB=1000B、1MB=10^6 B）取值，与 2009 年 408 真题官方解法同一口径；1024 进制下的结果见解析与追问。`,content:String.raw`（44）某计算机主频为 200MHz，CPI 为 5，存储器总线宽度为 32 位。准备连接一个数据传输率为 20KB/s 的字符设备，及 1 个数据传输率为 1MB/s 的块设备；字符设备采用中断方式 I/O，块设备采用 DMA 方式 I/O，DMA 传送方式为周期窃取方式，每次 DMA 传送数据块大小为 4000B。请回答：

1）若 CPU 平均每条指令访存 1.2 次，Cache 命中率为 0.98，则 CPU 平均每秒访问主存次数是多少？

2）当两个设备均以最大能力工作时，每秒将有多少次 DMA 请求及中断请求？

3）若采用 I/O 总线连接上述设备，且每个总线周期需要 4 个总线时钟周期，则 I/O 总线的总线时钟频率最少是多少？`,attachments:[{name:`查看原题截图`,path:`io-interrupt-dma-bus-clock/question.png`}],solution:{answer:String.raw`**1）$9.6\times10^5$ 次/s（960000 次/s）。**

$$200\text{MHz}\div5\times1.2\times(1-0.98)=9.6\times10^5\ \text{次/s}$$

**2）DMA 请求 250 次/s；中断请求 20000 次/s**（若把「每块 DMA 传完再中断一次」也计入，中断请求为 20250 次/s）。

$$1\text{MB/s}\div4000\text{B}=250\ \text{次/s},\qquad 20\text{KB/s}\div1\text{B}=20000\ \text{次/s}$$

**3）I/O 总线时钟频率最少 $1.02\times10^6\text{Hz}$，即 1.02MHz。**

$$(10^6+20000)\div4=2.55\times10^5\ \text{次总线传送/s}\quad\Longrightarrow\quad2.55\times10^5\times4=1.02\times10^6\ \text{Hz}$$`,explanation:String.raw`## 1）CPU 平均每秒访问主存多少次

- 每秒执行的指令数由主频与 CPI 决定：$200\text{MHz}\div5=4\times10^7$ 条/s。
- CPU 发出的访存次数：$4\times10^7\times1.2=4.8\times10^7$ 次/s。
- 其中只有 Cache 未命中的部分才落到主存：$4.8\times10^7\times(1-0.98)=9.6\times10^5$ 次/s。

## 2）每秒的 DMA 请求与中断请求

- **DMA 请求（块设备）**：一次请求搬运一个数据块 4000B，所以 $1\text{MB/s}\div4000\text{B}=250$ 次/s。
- **中断请求（字符设备）**：字符设备一次中断搬运一个字符（1B），所以 $20\text{KB/s}\div1\text{B}=20000$ 次/s。
- 若再把「一块 DMA 传完、DMA 控制器向 CPU 发一次中断」算进去，中断请求合计 $20000+250=20250$ 次/s。题目只问「DMA 请求及中断请求」，答题时把口径写明即可。

## 3）I/O 总线时钟频率下限

两设备每秒需要经总线搬运的数据量：

$$20\text{KB}+1\text{MB}=1.02\times10^6\ \text{B}$$

32 位总线一个总线周期搬运 4B，因此每秒需要的总线周期数：

$$1.02\times10^6\div4=2.55\times10^5\ \text{次/s}$$

每个总线周期占 4 个总线时钟周期，所以总线时钟频率至少为：

$$f\ge2.55\times10^5\times4=1.02\times10^6\ \text{Hz}=1.02\text{MHz}$$

这里「每秒搬运的字节数」与所需时钟频率数值相同，是因为每次搬 4B、每 4 个时钟一个总线周期，$\div4\times4$ 相互抵消。

## 单位口径（先声明再计算）

- 本节按 $1\text{KB}=1000\text{B}$、$1\text{MB}=10^6\text{B}$。依据是只有这样才能得到整数 250 次/s；2009 年 408 真题的同类大题官方解法同样是十进制（$0.5\text{MB/s}\div4\text{B}=125000$ 次/s）。
- 若按 $1\text{KB}=1024\text{B}$、$1\text{MB}=2^{20}\text{B}$：DMA 请求 $1048576\div4000=262.144$ 次/s（搬完 1MB 至少要 263 次请求），中断请求 20480 次/s（含 DMA 完成中断为 20742.144 次/s），总线时钟约 $1.07\text{MHz}$。
- 若把「一次总线传送」理解成设备与主存之间的完整数据交换（读写各占一个总线周期），第 3 问要翻倍到约 2.04MHz；题面只给出「存储器总线宽度 32 位」，按一次搬 4B 是最常见的读法。`,pitfalls:String.raw`- **漏除 CPI：** 直接用主频乘访存次数与未命中率，会把 $9.6\times10^5$ 算成 $4.8\times10^6$。
- **把 1.2 次访存全算成访问主存：** 还要乘 Cache 未命中率 0.02。
- **把 DMA 请求数与中断请求数混在一起：** 250 次/s 是块设备的 DMA 请求，20000 次/s 才是字符设备的中断请求。
- **以为中断方式不占总线：** 字符设备的字节同样要经 I/O 总线搬进主存，第 3 问必须把两路流量相加。
- **混淆「总线周期」与「总线时钟周期」：** 一个总线周期 = 4 个总线时钟周期，二者相差 4 倍。
- **K/M 口径混用：** 十进制与 1024 进制会给出不同的第 2、3 问数值（250/20000 对 262.144/20480），答题前先声明口径。
- **把 1MB/s 当成一次请求搬运的量：** 一次 DMA 请求只搬题面给出的 4000B。`,extension:String.raw`**问：若字符设备每次中断搬运 4B，中断请求数与第 3 问的结果怎么变？**

**答：** 中断请求数变为 $20000\div4=5000$ 次/s；总线上要搬运的数据量不变（字符设备仍是 20KB/s），所以 I/O 总线时钟频率仍是 1.02MHz。中断次数只影响 CPU 的开销，不改变总线流量。

**问：若按 1KB=1024B、1MB=$2^{20}$B 重算第 2、3 问？**

**答：** DMA 请求 $1048576\div4000=262.144$ 次/s（实际需 263 次请求才能搬完 1MB）；中断请求 20480 次/s（含 DMA 完成中断为 20742.144 次/s）；总线时钟 $(1048576+20480)\div4\times4=1069056\ \text{Hz}\approx1.07\text{MHz}$。

**问：把每次 DMA 传送的数据块从 4000B 改成 8000B，什么变了、什么没变？**

**答：** 每秒的 DMA 请求数减半（125 次/s）；每秒在总线上搬运的字节数不变，因此对总线带宽（时钟频率）的要求不变；只有「DMA 完成中断」的次数随之减半。`}},{id:`vm-lru-array-page-faults`,questionNumber:45,title:`请求分页的时间账：512 页框下的 LRU 与随机置换`,type:`题目`,date:`2026-10-01`,chapter:`虚拟存储器 · 请求分页与页面置换`,tags:[`请求分页`,`LRU`,`缺页处理时间`,`随机置换`,`概率`],summary:`2MB 物理内存、4KB 页、1048 页数组的 5 条语句：算缺页次数与耗时，并求随机置换下语句 4 超过 1ms 的概率。`,source:`学生提供的试卷照片（第 6 页，第 45 题），图上未显示答案；三小问与「26 王道八套卷·卷二」第 46 题逐字相同（该卷题干另给了数组首地址 C8000000H）。解析由本站按题设独立模拟（LRU 逐页模拟 + 随机置换蒙特卡洛）推导。`,content:String.raw`（45）某计算机系统采用请求分页虚拟存储系统，页面大小为 4KB，进程数据可用的物理内存为 2MB（内核和进程的代码、栈不参与换页），页面替换采用 LRU 算法。已知每次访存需要 100ns，每次进行一个页面磁盘交换需要 10ms。如下所示程序，回答以下问题：

~~~c
#define PAGE_SIZE 4096
#define PAGE_NUM 1048
char data[PAGE_SIZE*PAGE_NUM];

1  for(i = 0; i < PAGE_NUM; i++) data[i * PAGE_SIZE] = 1;
2  data[1024] = 2;
3  data[512 * PAGE_SIZE + 2048] = 3;
4  data[3072] = 4;
5  data[768 * PAGE_SIZE] = 5;
~~~

1）假设语句 1 执行前，data 数组都不在 cache 和内存中，那么语句 1 执行完大约需要多少时间？

2）假设条件同 1），语句 1 执行后，语句 2、3、4、5 执行时间分别是多少？

3）假设系统采用的是随机页面替换策略，且执行语句 3 时发生了换页，那么语句 4 执行时间大于 1ms 的概率是多少？`,attachments:[{name:`查看原题截图`,path:`vm-lru-array-page-faults/question.png`}],solution:{answer:String.raw`**1）约 10.48s。**

$$1048\times10\text{ms}+1048\times100\text{ns}=10.48\text{s}+0.1048\text{ms}\approx10.48\ \text{s}$$

**2）语句2 ≈ 10ms；语句3 ≈ 10ms；语句4 = 100ns；语句5 = 100ns。**

**3）**

$$P=\frac{1}{512}\approx0.195\%$$`,explanation:String.raw`## 先把页框数与各语句的页号算清楚

- 页框数：$2\text{MB}\div4\text{KB}=512$。
- 数组大小：$4096\text{B}\times1048=4\text{MB}$，共 1048 页（页 0 到页 1047）。
- 语句2 的地址 1024 落在**页 0**；语句3 的地址 $512\times4096+2048=2099200$ 落在**页 512**；语句4 的地址 3072 又落在**页 0**；语句5 的地址 $768\times4096$ 落在**页 768**。

## 1）语句1 的执行时间

i 从 0 到 1047，第 i 次访问第 i 页的第 0 个字节，每页都只被访问一次，因此 1048 次访问全部缺页：前 512 次把页框填满（强制缺页），之后 536 次每次淘汰一个 LRU 页。

$$1048\times(10\text{ms}+100\text{ns})\approx10.48\ \text{s}$$

## 2）语句2~5 的执行时间（LRU）

语句1 结束时，驻留的正是最后访问的 512 页：页 536~1047，其中 LRU 端是页 536。

- **语句2** 访问页 0：已不在内存，缺页，淘汰页 536、装入页 0 → 约 10ms。
- **语句3** 访问页 512：仍不在内存，缺页，淘汰页 537、装入页 512 → 约 10ms。
- **语句4** 访问页 0：页 0 是语句2 刚装入的，命中 → 100ns。
- **语句5** 访问页 768：$768$ 在 $[538,1047]$ 内，命中 → 100ns。

## 3）随机置换下语句4 超过 1ms 的概率

- 语句2 的执行结果一定是页 0 在内存中（原本在就命中，不在就装入）。
- 语句3 发生了换页（题设），此时要在 512 个驻留页框中等概率随机选一个淘汰。
- 语句4 访问页 0：页 0 被淘汰则语句4 缺页 $10\text{ms}>1\text{ms}$；页 0 还在则命中 $100\text{ns}<1\text{ms}$。

因此

$$P=\frac{1}{512}\approx0.195\%$$`,pitfalls:String.raw`- **把 PAGE_NUM 当成数组的字节数：** 1048 是页数，数组大小是 $4096\times1048=4\text{MB}$。
- **漏看语句4 与语句2 访问同一页：** 3072 与 1024 都在页 0，所以语句4 命中。
- **语句3 的页号算错：** $512\times4096+2048$ 仍在页 512，页内偏移 2048 小于 4096。
- **LRU 淘汰顺序记错：** 语句1 结束后最久未用的是页 536（不是页 0 或页 512）：语句2 淘汰 536，语句3 淘汰 537。
- **第 3 问写成 $1/1048$：** 候选是 512 个**驻留页框**，不是全部 1048 页；也别丢「页 0 一定在内存」这个前提。
- **缺页代价里加不加那 100ns：** 与 10ms 相差 5 个数量级，两种算法结果都写成约 10.48s，但答题时要说明口径。
- **忽略「内核和进程的代码、栈不参与换页」：** 可用页框就是 $2\text{MB}\div4\text{KB}=512$。`,extension:String.raw`**问：若物理内存只有 1MB（256 个页框），语句2~5 的执行时间怎么变？**

**答：** 语句1 结束后驻留最后 256 页（792~1047）。语句2 缺页（淘汰 792）约 10ms；语句3 缺页（淘汰 793）约 10ms；语句4 命中 = 100ns；**语句5 缺页**（页 768 已被挤出，淘汰 794）约 10ms。第 3 问的概率变为 $1/256\approx0.39\%$。

**问：把语句4 改成 data[536 * PAGE_SIZE] = 4;，结果如何？**

**答：** 页 536 在语句2 就被淘汰（语句3 又淘汰了页 537），所以语句4 变成缺页，约 10ms。

**问：为什么语句2、3 都缺页，语句4 却命中？**

**答：** 顺序扫描 1048 页只留下最后 512 页（536~1047），页 0 与页 512 都被挤出；语句2 重新装入页 0，语句3 只淘汰了页 537，所以语句4 再访问页 0 时仍在内存中。`}}],Dm=[{id:`mock-exam-1-ds-q01`,questionNumber:1,title:`循环队列 tag 判空与判满`,type:`题目`,date:`2026-10-02`,chapter:`栈、队列和数组 · 循环队列`,tags:[`循环队列`,`队空队满判定`,`tag 标记法`],summary:`循环队列用 tag 区分队空与队满，给 MAXSIZE、front、rear、tag 求元素个数。`,source:`用户提供的扫描件 docs/book/一.pdf（模拟试题一）第 1 页；卷面未印参考答案，解析为本站独立推导并由脚本枚举复核，并非官方答案。`,content:String.raw`设循环队列的存储结构如下，其中 $front$ 指向队头元素，$rear$ 指向下一个可插入位置；$tag=0$ 表示最近一次对队列的操作是删除，$tag=1$ 表示最近一次操作是插入。当 $front=rear$ 时，由 $tag$ 区分队空与队满。若 $MAXSIZE=24$，$front=7$，$rear=19$，$tag=1$，则队列中的元素个数为（　）。

- A．11
- B．12
- C．13
- D．24`,attachments:[{name:`查看原卷试题页（第 1 页）`,path:`mock-exam-1/page-1.png`}],solution:{answer:String.raw`**选 B：12。**`,explanation:String.raw`## 1. 关键判断：先看 $front$ 与 $rear$ 是否相等

题设的 $tag$ 只用来消除 **$front=rear$** 时的歧义：此时队空与队满在指针上无法区分，才需要 $tag$ 判断。本题 $front=7\ne rear=19$，指针本身就区分了队空与队满，**$tag$ 不参与计数**。

## 2. 循环队列元素个数公式（注意边界）

计算元素个数必须分情况，不能不分场合地套同一个取模式：

~~~text
front != rear :  n = (rear - front + MAXSIZE) mod MAXSIZE
front == rear :  tag = 0 -> n = 0        （队空）
                 tag = 1 -> n = MAXSIZE  （队满）
~~~

也就是说：取模公式只适用于 $front\ne rear$。在 $front=rear$ 且 $tag=1$ 的队满情形，元素个数是 $MAXSIZE$，而 $(rear-front+MAXSIZE)\bmod MAXSIZE$ 会算出 $0$，此时公式失效，必须用 $tag$ 判满。

## 3. 代入本题（$front\ne rear$）

$$
n=(19-7+24)\bmod 24=36\bmod 24=12.
$$

位置校验：$front=7$ 表示队头在 7 号，$rear=19$ 表示 19 号可插入，被占用位置为 $7,8,\dots,18$，共 12 个，与公式一致。

## 4. 脚本独立复核（.cache/crosscheck/verify_juan1.py 实际输出）

~~~text
Q1 循环队列 MAXSIZE=24 front=7 rear=19 tag=1
   front!=rear -> n=(rear-front+MAXSIZE)%MAXSIZE = 12
   独立枚举校验: front=7 起连续占用 12 个位置 = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
   若误读 tag=1 为队满则得 24（选项D 24）
   -> 12  => B
~~~`,pitfalls:String.raw`- 见到 $tag=1$ 就判队满选 D（24）：$tag=1$ 只有在 $front=rear$ 时才表示队满。
- 把取模公式当万能公式：$front=rear$ 且 $tag=1$ 时元素个数是 $MAXSIZE$，不是 $(rear-front+MAXSIZE)\bmod MAXSIZE=0$。
- 误以为 $rear$ 指向队尾元素而多算一个（得 13，选 C）。本题 $rear$ 指向下一个可插入位置。`}},{id:`mock-exam-1-ds-q02`,questionNumber:2,title:`栈的合法出栈序列`,type:`题目`,date:`2026-10-02`,chapter:`栈、队列和数组 · 栈`,tags:[`栈`,`合法出栈序列`,`卡特兰数`],summary:`元素 1、2、3、4 依次入栈、可交替出栈，判断哪个出栈序列不可能。`,source:`用户提供的扫描件 docs/book/一.pdf（模拟试题一）第 1 页；卷面未印参考答案，解析为本站枚举推导，并非官方答案。`,content:String.raw`元素 1、2、3、4 按此顺序依次入栈，入栈与出栈操作可以交替进行。下列序列中，不可能成为出栈序列的是（　）。

- A．3、2、1、4
- B．2、1、4、3
- C．3、1、4、2
- D．4、3、2、1`,attachments:[{name:`查看原卷试题页（第 1 页）`,path:`mock-exam-1/page-1.png`}],solution:{answer:String.raw`**选 C：3、1、4、2。**`,explanation:String.raw`## 1. 计数：合法序列有多少个

入栈顺序固定为 $1,2,3,4$，出入栈可任意交替。$n$ 个元素依次入栈的全部合法出栈序列数等于卡特兰数

$$
C_n=\frac{1}{n+1}\binom{2n}{n},\qquad C_4=\frac{1}{5}\binom{8}{4}=14.
$$

## 2. 枚举全部 14 个合法序列

~~~text
1234  1243  1324  1342  1432  2134  2143  2314
2341  2431  3214  3241  3421  4321
~~~

逐个对照选项：

- A 3、2、1、4 = 3214，在表中，合法；
- B 2、1、4、3 = 2143，在表中，合法；
- C 3、1、4、2 = 3142，**不在表中**，不可能；
- D 4、3、2、1 = 4321，在表中，合法。

## 3. 反证 C 为什么不可能

要让 3 最先出栈，必须先把 1、2、3 依次压栈，此时栈内自底向上为 $1,2$（栈顶为 2）。弹出 3 后，栈顶是 2，紧接着能弹出的只能是 2，或者先把 4 压栈再弹 4——**不可能越过 2 直接弹出 1**。所以 3142 非法。

## 4. 脚本独立枚举（.cache/crosscheck/verify_juan1.py 实际输出）

脚本对 4! 种排列做栈模拟，筛出全部合法出栈序列：

~~~text
Q2 1,2,3,4 依次入栈：合法出栈序列共 14 个（卡特兰数 C4=14）
   全部: 4321, 3421, 3241, 3214, 2431, 2341, 2314, 2143, 2134, 1432, 1342, 1324, 1243, 1234
   选项 3214: 合法
   选项 2143: 合法
   选项 3142: 不可能 <== 答案
   选项 4321: 合法
~~~`,pitfalls:String.raw`- 漏掉「4 可以先入栈、后出栈」这一步，误判 B 或 D 不可能。
- 认为逆序 4321 一定非法（其实任意逆序始终合法）。
- 把「入栈顺序 1,2,3,4」与「元素值大小」绑定，忘记 4 可以在 3 出栈之后才入栈。`}},{id:`mock-exam-1-ds-q03`,questionNumber:3,title:`由前序与后序判断可能的中序`,type:`题目`,date:`2026-10-02`,chapter:`树与二叉树 · 遍历与重建`,tags:[`二叉树遍历`,`前序与后序`,`中序序列不唯一`],summary:`已知前序 ABDCE、后序 DBECA，问哪个序列可能是该二叉树的中序序列。`,source:`用户提供的扫描件 docs/book/一.pdf（模拟试题一）第 1 页；卷面未印参考答案，解析为本站枚举推导，并非官方答案。`,content:String.raw`已知一棵二叉树的前序遍历序列为 ABDCE，后序遍历序列为 DBECA。根据这些信息，以下（　）序列可能是该二叉树的中序遍历序列。

- A．DBEAC
- B．DBAEC
- C．DBECA
- D．DBCEA`,attachments:[{name:`查看原卷试题页（第 1 页）`,path:`mock-exam-1/page-1.png`}],solution:{answer:String.raw`**选 B：DBAEC。**`,explanation:String.raw`## 1. 先明确一个前提：只给前序 + 后序，一般不能保证唯一

只给前序和后序，**一般不能保证唯一确定**一棵二叉树：当某个结点只有一个孩子时，这个孩子挂左还是挂右，前序、后序读出来完全一样。本题满足条件的二叉树共有 **4 棵**，它们的中序序列分别为

$$
BDACE,\quad BDAEC,\quad DBACE,\quad DBAEC.
$$

题干问的是「可能是」，只要选项落在这一集合里即可，因此答案是唯一的 B。这不是题目出错：正因为结构不唯一，才用「可能」提问。

## 2. 手工构造并验证 B

取二叉树：A 的左孩子是 B、右孩子是 C；B 的左孩子是 D；C 的左孩子是 E。

~~~binary
A
  L: B
    L: D
  R: C
    L: E
~~~

- 前序（根-左-右）：A → B → D → C → E = ABDCE ✓
- 后序（左-右-根）：D → B → E → C → A = DBECA ✓
- 中序（左-根-右）：D → B → A → E → C = DBAEC ✓

## 3. 为什么恰好 4 棵

由前序知根为 A；后序最后一位也是 A，二者相容。前序在 A 之后的左子树根是 B、右子树根是 C；后序对应的左子树段为 DB、右子树段为 EC。每个「根 + 一个孩子」的小结构，孩子既可挂左也可挂右，左右子树各有 2 种，共 $2\times2=4$ 棵。

## 4. 选项排除

- A DBEAC：它要求 A 的左子树中序为 DBE（B 为根，D 左、E 右），该左子树后序应为 DEB，全树后序变成 DEBCA，与题给 DBECA 不符 ✗
- C、D 均不属于上述 4 个中序序列 ✗

## 5. 脚本独立复核（.cache/crosscheck/verify_juan1.py 实际输出）

脚本先枚举 5 个结点的全部二叉树形态（$C_5=42$），按前序贴标号 A,B,D,C,E，再读后序筛出 DBECA：

~~~text
Q3 前序=ABDCE 后序=DBECA
   5 结点二叉树形态数 (C5) = 42
   满足 前序=ABDCE 且 后序=DBECA 的树数量 = 4
   中序集合 = ['BDACE', 'BDAEC', 'DBACE', 'DBAEC']
   选项 DBEAC: 不可能
   选项 DBAEC: 可能
   选项 DBECA: 不可能
   选项 DBCEA: 不可能
~~~`,pitfalls:String.raw`- 默认「前序 + 后序能唯一确定二叉树」，忽视单孩子结点的左右歧义。
- 直接把 DBEAC（A）当答案：它对应的树后序为 DEBCA，与题给不符。
- 把后序末位不是根来理解（后序末位就是整棵树的根 = A）。`}},{id:`mock-exam-1-ds-q04`,questionNumber:4,title:`哈夫曼树 WPL 计算`,type:`题目`,date:`2026-10-02`,chapter:`树与二叉树 · 哈夫曼树`,tags:[`哈夫曼树`,`带权路径长度 WPL`,`贪心合并`],summary:`字符集 {a,b,c,d,e} 频率为 {5,9,12,13,16}，求哈夫曼树的 WPL。`,source:`用户提供的扫描件 docs/book/一.pdf（模拟试题一）第 1 页；卷面未印参考答案，解析为本站用小顶堆模拟推导，并非官方答案。`,content:String.raw`若字符集为 $\{a，b，c，d，e\}$，对应的频率为 $\{5，9，12，13，16\}$，则构造的哈夫曼树的带权路径长度（WPL）为（　）。

- A．120
- B．124
- C．130
- D．135`,attachments:[{name:`查看原卷试题页（第 1 页）`,path:`mock-exam-1/page-1.png`}],solution:{answer:String.raw`**选 B：124。**`,explanation:String.raw`## 1. 哈夫曼树的构造（每次取最小的两棵合并）

按权值从小到大反复取两个最小的树合并，新结点权值 = 两子树权值之和：

~~~text
5  + 9  = 14   -> 候选 {12, 13, 14, 16}
12 + 13 = 25   -> 候选 {14, 16, 25}
14 + 16 = 30   -> 候选 {25, 30}
25 + 30 = 55   -> 根
~~~

树形为 $55\big(25(12,13),\ 30(14(5,9),\,16)\big)$。

## 2. 两种算法互相印证

**算法一（WPL = 所有内部结点权值之和）：**

$$
14+25+30+55=124.
$$

**算法二（WPL = 各叶频 × 叶深度）：** 深度为标准约定（根深度 0）：12、13、16 深度为 2；5、9 深度为 3。

$$
5\times3+9\times3+12\times2+13\times2+16\times2=15+27+24+26+32=124.
$$

两法一致，选 B。

## 3. 脚本独立复核（.cache/crosscheck/verify_juan1.py 实际输出）

脚本用小顶堆模拟合并过程：

~~~text
Q4 哈夫曼 频率=[5, 9, 12, 13, 16]
   合并: [(5, 9, 14), (12, 13, 25), (14, 16, 30), (25, 30, 55)]
   WPL(=内部结点权和) = 124
   另证: 朴素自底向上构造的最优性由 Huffman 保证，且叶深验证 5*3+9*3+12*2+13*2+16*2 = 124
   -> 124 => B
~~~`,pitfalls:String.raw`- 只用前几步较小者累加而漏掉最后一步（得 14+25+30 = 69，或忘记加根）。
- 把 WPL 算成所有叶权之和（$5+9+12+13+16=55$，恰好等于根权值，无此选项）。
- 合并时没取最小的两棵（贪心取错）会得到偏大的 WPL。`}},{id:`mock-exam-1-ds-q05`,questionNumber:5,title:`KMP 的 next 数组`,type:`题目`,date:`2026-10-02`,chapter:`串 · 模式匹配`,tags:[`KMP`,`next 数组`,`最长相等前后缀`],summary:`按题给定义求模式串 T="abcac" 的 next 数组。`,source:`用户提供的扫描件 docs/book/一.pdf（模拟试题一）第 1 页；卷面未印参考答案，解析为本站暴力求最长相等真前后缀推导，并非官方答案。`,content:String.raw`设模式串 $T$ 的下标从 1 开始，并采用如下定义：$next[1]=0$；当 $j>1$ 时，$next[j]=k$ 表示 $T[1\ldots k-1]$ 是 $T[1\ldots j-1]$ 的最长相等真前缀与真后缀，若不存在非空的相等前后缀，则 $k=1$。模式串 $T="abcac"$ 的 next 数组为（　）。

- A．01122
- B．01212
- C．01112
- D．01221`,attachments:[{name:`查看原卷试题页（第 1 页）`,path:`mock-exam-1/page-1.png`}],solution:{answer:String.raw`**选 C：01112。**`,explanation:String.raw`## 1. 先读懂定义

$next[j]=k$ 中的 $k$，含义是「$T[1\ldots j-1]$ 的最长相等真前缀与真后缀长度再加 1」。所以 $k-1$ 才是那个最长相等前后缀的长度。

## 2. 逐位求（$T="abcac"$）

- $j=1$：定义直接规定 $next[1]=0$。
- $j=2$：$T[1\ldots1]="a"$ 无真前后缀，长度 0 ⇒ $next[2]=0+1=1$。
- $j=3$：$T[1\ldots2]="ab"$，前缀 a 与后缀 b 不等 ⇒ 长度 0 ⇒ $next[3]=1$。
- $j=4$：$T[1\ldots3]="abc"$，无相等前后缀 ⇒ 长度 0 ⇒ $next[4]=1$。
- $j=5$：$T[1\ldots4]="abca"$，最长相等的真前缀=真后缀为 a（长度 1）⇒ $next[5]=1+1=2$。

于是

$$
next[1\ldots5]=[0,1,1,1,2]\ \Rightarrow\ 01112.
$$

## 3. 脚本独立复核（.cache/crosscheck/verify_juan1.py 实际输出）

脚本对每个 $j$ 暴力枚举最长相等真前后缀：

~~~text
Q5 T='abcac'  题给定义 next[1]=0, next[j]=k 即 T[1..k-1] 为最长相等真前后缀
   j=1: T[1..0]='' -> next[1]=0
   j=2: T[1..1]='a' -> next[2]=1
   j=3: T[1..2]='ab' -> next[3]=1
   j=4: T[1..3]='abc' -> next[4]=1
   j=5: T[1..4]='abca' -> next[5]=2
   next = [0, 1, 1, 1, 2]  -> 01112
   -> 01112 => C
~~~`,pitfalls:String.raw`- 把 $next$ 与 $nextval$（优化后的 next）混淆，或把 $next[j]$ 直接当成最长相等前后缀长度（会差 1）。
- 求 $j=5$ 时把 $"abca"$ 的前后缀误写成 ab（abca 的前缀 ab 与后缀 ca 不等），误得 3。
- 忘记 $T="abcac"$ 第 5 位是 c。`}},{id:`mock-exam-1-ds-q06`,questionNumber:6,title:`图的存储结构辨析`,type:`题目`,date:`2026-10-02`,chapter:`图 · 图的存储结构`,tags:[`十字链表`,`邻接多重表`,`邻接表`,`逆邻接表`],summary:`四个关于图的存储结构的叙述，选出错误的一项。`,source:`用户提供的扫描件 docs/book/一.pdf（模拟试题一）第 1 页；卷面未印参考答案，解析依据数据结构教材通行结论，并非官方答案（概念题不做脚本验证）。`,content:String.raw`下列关于图的存储结构的叙述中，错误的是（　）。

- A．十字链表为每条有向边设置一个边结点，并将同一顶点的出边和入边分别链接
- B．对于稀疏图，邻接表的空间复杂度为 $O(|V|+|E|)$，通常比邻接矩阵更节省空间
- C．邻接多重表适合存储有向图，十字链表适合存储无向图
- D．在有向图的逆邻接表中，顶点 $v$ 对应链表中的边结点数等于 $v$ 的入度`,attachments:[{name:`查看原卷试题页（第 1 页）`,path:`mock-exam-1/page-1.png`}],solution:{answer:String.raw`**选 C。**`,explanation:String.raw`## 逐项判断

**A 正确。** 十字链表是**有向图**的链式存储结构，每条弧设一个弧结点，含尾顶点、头顶点、同尾弧链、同头弧链，既能方便地找某顶点的出边，也能方便地找入边。

**B 正确。** 邻接表的存储量：有向图每条弧占 1 个邻接点，无向图每条边占 2 个邻接点，两者都与 $O(|V|+|E|)$ 同阶。稀疏图 $|E|\ll|V|^2$ 时，远比邻接矩阵的 $O(|V|^2)$ 省空间。

**C 错误（正是题目所问）。** 二者被对调了：**邻接多重表是为无向图设计的**（每条边一个边结点，同时链出共享该边的两个顶点），**十字链表是为有向图设计的**。

**D 正确。** 逆邻接表按**入边**建链，顶点 $v$ 的链表中边结点个数 = $v$ 的入度（正邻接表中则是出度）。

因此错误的是 C。

## 概念题依据

本题无数值可枚举，未做脚本验证，依据为数据结构教材通行结论：十字链表 ↔ 有向图；邻接多重表 ↔ 无向图；邻接表空间 $O(|V|+|E|)$；逆邻接表边结点数 = 入度。`,pitfalls:String.raw`- 记混「十字链表 ↔ 有向图」「邻接多重表 ↔ 无向图」这一组配对。
- 把邻接表空间复杂度误记为 $O(|V|^2)$（那是邻接矩阵）。
- 把逆邻接表当成邻接表，从而判成「等于出度」而认为 D 错误。`}},{id:`mock-exam-1-ds-q07`,questionNumber:7,title:`AOE 网关键路径判定`,type:`题目`,date:`2026-10-02`,chapter:`图 · 关键路径`,tags:[`AOE 网`,`关键路径`,`关键活动`,`最早/最迟开始时间`],summary:`7 事件、9 活动的 AOE 网，判断关于关键路径与活动时间的说法哪条错误。`,source:`用户提供的扫描件 docs/book/一.pdf（模拟试题一）第 1 页；卷面未印参考答案，解析为本站按拓扑序正推/逆推推导，并非官方答案。`,content:String.raw`下图是一个有 7 个事件、9 个活动的 AOE 网，以下说法错误的是（　）。

![AOE 网原图](/courses/mock-exam-1/q07-aoe.png)

- A．关键路径长度为 16
- B．活动 $f$ 的最早开始时间为 8
- C．活动 $g$ 的最迟开始时间为 7
- D．缩短活动 $d$ 就可以缩短整个工程的工期`,attachments:[{name:`查看 AOE 网原图`,path:`mock-exam-1/q07-aoe.png`},{name:`查看原卷试题页（第 1 页）`,path:`mock-exam-1/page-1.png`}],solution:{answer:String.raw`**选 D。**`,explanation:String.raw`## 1. 正推各事件最早发生时间 $ve$

$$
ve[V_1]=0,\quad ve[V_2]=3,\quad ve[V_3]=2,
$$
$$
ve[V_4]=\max(3+5,\ 2+6)=8,
$$
$$
ve[V_5]=2+4=6,\quad ve[V_6]=\max(8+2,\ 6+3)=10,
$$
$$
ve[V_7]=\max(6+5,\ 10+6)=16.
$$

## 2. 逆推各事件最迟发生时间 $vl$（终点 $vl[V_7]=ve[V_7]=16$）

$$
vl[V_7]=16,\quad vl[V_6]=16-6=10,\quad vl[V_5]=\min(10-3,\ 16-5)=7,
$$
$$
vl[V_4]=10-2=8,\quad vl[V_3]=\min(8-6,\ 7-4)=2,\quad vl[V_2]=8-5=3,
$$
$$
vl[V_1]=\min(3-3,\ 2-2)=0.
$$

## 3. 逐项判定

- **A 正确**：工期 = $ve[V_7]=16$。
- **B 正确**：$f$ 的最早开始时间 = $ve[V_4]=8$。
- **C 正确**：$g$ 的最迟开始时间 = $vl[V_6]-3=10-3=7$。
- **D 错误**：$d$ 的松弛时间 $=vl[V_4]-ve[V_3]-6=8-2-6=0$，确实是关键活动。但关键路径有**两条**：
$$
V_1\xrightarrow{a}V_2\xrightarrow{c}V_4\xrightarrow{f}V_6\xrightarrow{i}V_7=3+5+2+6=16,
$$
$$
V_1\xrightarrow{b}V_3\xrightarrow{d}V_4\xrightarrow{f}V_6\xrightarrow{i}V_7=2+6+2+6=16.
$$
  $d$ 只出现在其中一条上。单独压缩 $d$，$V_4$ 仍由另一条路径（经 $c$ 的 $3+5=8$）决定为 8，工期仍为 16。**只有当活动位于所有关键路径上时，压缩它才能缩短工期**，故 D 错。

## 4. 脚本独立复核（.cache/crosscheck/verify_juan1.py 实际输出）

~~~text
Q7 AOE ve = {'V1': 0, 'V2': 3, 'V3': 2, 'V4': 8, 'V5': 6, 'V6': 10, 'V7': 16}
   vl = {'V1': 0, 'V2': 3, 'V3': 2, 'V4': 8, 'V5': 7, 'V6': 10, 'V7': 16}
   a: V1->V2 w=3 最早开始=0 最迟开始=0 关键
   b: V1->V3 w=2 最早开始=0 最迟开始=0 关键
   c: V2->V4 w=5 最早开始=3 最迟开始=3 关键
   d: V3->V4 w=6 最早开始=2 最迟开始=2 关键
   e: V3->V5 w=4 最早开始=2 最迟开始=3 
   f: V4->V6 w=2 最早开始=8 最迟开始=8 关键
   g: V5->V6 w=3 最早开始=6 最迟开始=7 
   h: V5->V7 w=5 最早开始=6 最迟开始=11 
   i: V6->V7 w=6 最早开始=10 最迟开始=10 关键
   工期 = ve[V7] = 16  关键活动 = ['a', 'b', 'c', 'd', 'f', 'i']
   A. 关键路径长度16 ? True
   B. f 最早开始时间 = 8 ? ==8
   C. g 最迟开始时间 = 7 ? ==7
       缩短 d: w(d)=0 -> ve[V4]=8 工期=16
       缩短 d: w(d)=1 -> ve[V4]=8 工期=16
       缩短 d: w(d)=2 -> ve[V4]=8 工期=16
       缩短 d: w(d)=3 -> ve[V4]=8 工期=16
       缩短 d: w(d)=4 -> ve[V4]=8 工期=16
       缩短 d: w(d)=5 -> ve[V4]=8 工期=16
   -> A/B/C 对, D 错 => D
~~~`,pitfalls:String.raw`- 看到 $d$ 是关键活动（松弛为 0）就认为「缩短它一定能缩短工期」，忽略「必须位于所有关键路径上」。
- 没发现 $ve[V_4]=8$ 是两条路径**同时取到**（$3+5=8$ 与 $2+6=8$），从而看不到 D 的错误。
- 混淆活动的最迟开始时间 $l=vl[\text{终点}]-w$ 与 $e$。`}},{id:`mock-exam-1-ds-q08`,questionNumber:8,title:`BST、AVL 与红黑树性质辨析`,type:`题目`,date:`2026-10-02`,chapter:`查找 · 树型查找`,tags:[`二叉搜索树`,`AVL 树`,`红黑树`,`平衡条件`],summary:`四条关于 BST、AVL、红黑树的叙述，选出正确的组合。`,source:`用户提供的扫描件 docs/book/一.pdf（模拟试题一）第 1 页；卷面未印参考答案，解析依据数据结构教材通行结论，并非官方答案（概念题不做脚本验证）。`,content:String.raw`下列关于二叉搜索树（BST）、平衡二叉树（AVL 树）和红黑树的描述中，正确的是（　）。

Ⅰ．三者均为有序树，且查找时间复杂度均为 $O(\log n)$

Ⅱ．AVL 树和红黑树的平衡条件相同，均通过旋转维持平衡

Ⅲ．红黑树的每个节点包含颜色属性，AVL 树的每个节点包含平衡因子

Ⅳ．红黑树和 AVL 树在最坏情况下的查找时间复杂度不同

- A．仅Ⅰ、Ⅱ正确
- B．仅Ⅱ、Ⅲ正确
- C．仅Ⅲ正确
- D．仅Ⅳ正确`,attachments:[{name:`查看原卷试题页（第 1 页）`,path:`mock-exam-1/page-1.png`}],solution:{answer:String.raw`**选 C：仅Ⅲ正确。**`,explanation:String.raw`## 逐条判断

**Ⅰ 错。** 三者的结点确有左右次序（可视为有序树），但**普通 BST 不保证平衡**：插入有序序列会退化为单支树，查找最坏为 $O(n)$，不是 $O(\log n)$。

**Ⅱ 错。** 平衡条件**不同**：

- AVL 树要求任意结点左右子树**高度差不超过 1**（严格高度平衡）；
- 红黑树只要求「结点非红即黑、根与叶为黑、红结点的孩子必为黑、任一结点到叶的黑结点数相同」，其最长路径不超过最短路径的 2 倍（近似平衡）。

二者都会用旋转调整，但条件不同，「平衡条件相同」错误。

**Ⅲ 对。** 红黑树的结点带颜色域；AVL 树的结点带平衡因子（BF）域。

**Ⅳ 错。** 红黑树最坏查找 $O(\log n)$，AVL 树最坏查找也是 $O(\log n)$，**渐近最坏情况相同**（只是常数因子不同）。注意这与 Ⅱ 不矛盾：平衡条件不同，但都能把高度控制在 $O(\log n)$。

只有 Ⅲ 正确，选 C。

## 概念题依据

本题无数值可枚举，未做脚本验证，依据为教材通行结论：AVL 高度差 ≤1；红黑树五条性质；两者查找最坏均 $O(\log n)$；BST 最坏 $O(n)$。`,pitfalls:String.raw`- 把「AVL 比红黑树更平衡、查找更快（常数更小）」误当成「最坏时间复杂度不同」。
- 只记住「红黑树也是平衡树」就认为它与 AVL 的平衡条件一致。
- 以为只有红黑树带附加信息，忘记 AVL 结点也要存平衡因子。`}},{id:`mock-exam-1-ds-q09`,questionNumber:9,title:`散列表二次探测再散列`,type:`题目`,date:`2026-10-02`,chapter:`查找 · 散列表`,tags:[`散列表`,`二次探测`,`冲突处理`],summary:`表长 11、H(key)=key mod 11、二次探测处理冲突，求插入 52 时的表地址。`,source:`用户提供的扫描件 docs/book/一.pdf（模拟试题一）第 2 页；卷面未印参考答案，解析为本站模拟完整插入过程推导，并非官方答案。`,content:String.raw`哈希表长度为 11，哈希函数 $H(key)=key \bmod 11$。依次插入关键字 19、30、41、52，采用二次探测再散列处理冲突，探测增量依次为 $1^2$、$-1^2$、$2^2$、$-2^2$、$\ldots$。插入 52 时所在的表地址为（　）。

- A．8
- B．1
- C．9
- D．7`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-1/page-2.png`}],solution:{answer:String.raw`**选 B：1。**`,explanation:String.raw`## 1. 探测约定

先取 $H_0=H(key)$ 本身，再依次加 $+1^2,\,-1^2,\,+2^2,\,-2^2,\ldots$，每次对 11 取模。注意 $-1^2$ 应理解为增量 $-1$（向左探 1 格），不是「负数平方得 +1」。

## 2. 逐个插入

- **19**：$H=19\bmod 11=8$，地址 8 空 ⇒ 存 **8**。
- **30**：$H=8$ 被占；$8+1=9$ 空 ⇒ 存 **9**。
- **41**：$H=8$ 占，$8+1=9$ 占，$8-1=7$ 空 ⇒ 存 **7**。
- **52**：$H=8$ 占，$8+1=9$ 占，$8-1=7$ 占，$8+4=12\bmod 11=1$ 空 ⇒ 存 **1**。

插入 52 落在地址 **1**，选 B。

最终散列表（下标 $0\ldots10$）：

$$
[\ -,52,-,-,-,-,-,41,19,30,-]
$$

## 3. 脚本独立复核（.cache/crosscheck/verify_juan1.py 实际输出）

~~~text
Q9 表长11, H(key)=key mod 11, 二次探测 1^2,-1^2,2^2,...  依次插入 19,30,41,52
   插入 19: H=8 探测 [8] -> 存入地址 8
   插入 30: H=8 探测 [8, 9] -> 存入地址 9
   插入 41: H=8 探测 [8, 9, 7] -> 存入地址 7
   插入 52: H=8 探测 [8, 9, 7, 1] -> 存入地址 1
   最终表: [None, 52, None, None, None, None, None, 41, 19, 30, None]
   52 所在地址 = 1
   -> 1 => B
~~~`,pitfalls:String.raw`- 漏掉「先用 $H(key)$ 本身试一次」，直接从 $+1^2$ 开始。
- 把 $-1^2$ 当成 $+1$：若如此，41 会落到地址 1，52 的结果也随之错误。
- 探测增量不取模（得 $8+4=12$ 越界）。`}},{id:`mock-exam-1-ds-q10`,questionNumber:10,title:`不稳定且平均 O(n log n) 的排序`,type:`题目`,date:`2026-10-02`,chapter:`排序 · 排序算法的性质`,tags:[`排序稳定性`,`时间复杂度`,`快速排序`],summary:`四个排序算法中，选出不稳定且平均时间复杂度为 O(n log n) 的一个。`,source:`用户提供的扫描件 docs/book/一.pdf（模拟试题一）第 2 页；卷面未印参考答案，解析依据排序算法性质表，并非官方答案（概念题不做脚本验证）。`,content:String.raw`下列排序算法中，不稳定且平均时间复杂度为 $O(n\log n)$ 的是（　）。

- A．直接插入排序
- B．快速排序
- C．归并排序
- D．希尔排序`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-1/page-2.png`}],solution:{answer:String.raw`**选 B：快速排序。**`,explanation:String.raw`## 逐项核对「稳定性 + 平均复杂度」

- **A 直接插入排序**：稳定；平均 $O(n^2)$ —— 两条都不满足。
- **B 快速排序**：**不稳定**（划分时相等元素可能被交换跨越）；平均 $O(n\log n)$（最坏 $O(n^2)$）—— **两条都满足** ✓
- **C 归并排序**：稳定；平均 $O(n\log n)$ —— 稳定性不满足。
- **D 希尔排序**：不稳定（增量分组跨越式移动）；其平均复杂度取决于所取增量序列，没有单一通用值，408 范围内也不把它归入平均 $O(n\log n)$ —— 复杂度不满足。

只有快速排序同时满足，选 B。

## 概念题依据

本题不适合脚本枚举，未做脚本验证，依据排序算法稳定性/复杂度通行结论：插入、归并稳定；快排、希尔、堆排、选择不稳定；快排、堆排、归并平均 $O(n\log n)$；希尔排序的平均复杂度与增量序列有关，无单一通用值，不按 $O(n\log n)$ 处理。`,pitfalls:String.raw`- 看到「不稳定且复杂度不像 $n^2$」就选希尔排序：希尔不稳定，但平均复杂度不是 $O(n\log n)$。
- 把归并排序当成不稳定。
- 因为快排最坏是 $O(n^2)$ 就排除它，忽略题干问的是**平均**。`}},{id:`mock-exam-1-ds-q11`,questionNumber:11,title:`堆排序首轮调整`,type:`题目`,date:`2026-10-02`,chapter:`排序 · 堆排序`,tags:[`堆排序`,`大根堆`,`筛选调整`],summary:`大根堆 [10,9,8,7,6,5,4] 首次交换堆顶与末尾后，求调整后的堆序列。`,source:`用户提供的扫描件 docs/book/一.pdf（模拟试题一）第 2 页；卷面未印参考答案，解析为本站逐步模拟筛选推导，并非官方答案。`,content:String.raw`对给定的大根堆 $[10,9,8,7,6,5,4]$ 进行堆排序，第一次交换堆顶与末尾元素后，调整后的堆序列是（　）。

- A．$[9,8,7,6,5,4]$
- B．$[9,7,8,4,6,5]$
- C．$[9,7,8,6,5,4]$
- D．$[8,9,7,4,6,5]$`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-1/page-2.png`}],solution:{answer:String.raw`**选 B：$[9,7,8,4,6,5]$。**`,explanation:String.raw`## 1. 交换堆顶与末尾

初始大根堆 $[10,9,8,7,6,5,4]$（下标从 0 起），交换堆顶 10 与末尾 4：

$$
[4,9,8,7,6,5,10].
$$

末尾 10 已归位，**不再参与后续调整**，待调整的堆是前 6 个元素 $[4,9,8,7,6,5]$。

## 2. 自顶向下筛选（每次与较大的孩子交换）

- 下标 0（值 4）：孩子下标 1（9）、2（8），较大者 9，$4<9$ ⇒ 交换 → $[9,4,8,7,6,5]$。
- 下标 1（值 4）：孩子下标 3（7）、4（6），较大者 7，$4<7$ ⇒ 交换 → $[9,7,8,4,6,5]$。
- 下标 3（值 4）：孩子下标 7、8 均 ≥6（越界），无孩子，结束。

调整后的堆为 $[9,7,8,4,6,5]$（完整数组 $[9,7,8,4,6,5,10]$），选 B。

## 3. 脚本独立复核（.cache/crosscheck/verify_juan1.py 实际输出）

~~~text
Q11 初始大根堆 [10, 9, 8, 7, 6, 5, 4]
   交换堆顶/末尾后完整数组 = [4, 9, 8, 7, 6, 5, 10]（末尾 10 已归位）
   对前 6 个元素筛选后堆 = [9, 7, 8, 4, 6, 5]
   完整数组 = [9, 7, 8, 4, 6, 5, 10]
   选项 B = [9,7,8,4,6,5] -> True
~~~`,pitfalls:String.raw`- 交换后仍把 10 留在堆里一起调整（正确做法是把末尾元素排除在堆外）。
- 调整时与**较小**的孩子交换（必须与较大的孩子交换）。
- 只做一轮交换就停：下标 1 与 3 的那次交换容易漏掉（得到 $[9,4,8,7,6,5]$）。`}},{id:`mock-exam-1-co-q12`,questionNumber:12,title:`机器语言、汇编语言与高级语言和机器结构的关系`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 计算机系统概述 · 语言与机器结构`,tags:[`机器语言`,`汇编语言`,`高级语言`,`语言与机器结构`],summary:`判断关于机器语言、汇编语言、高级语言及其与具体机器结构关系的四条叙述中错误的一项。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 2 页（扫描件 PDF 第 3 页）；原卷封面与试题册第 1～8 页均未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于编程语言与机器结构关系的叙述中，错误的是（　）。

- A．机器语言程序由机器指令序列构成
- B．汇编语言通常与具体机器结构无关
- C．高级语言源程序和汇编语言源程序均不能由 CPU 直接执行
- D．除宏指令、伪指令等外，汇编程序中的一条机器指令语句通常对应一条机器指令`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-1/co-os-page-3.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 1. 三者的定位

- **机器语言**：由二进制机器指令构成，是 CPU 唯一能直接识别和执行的语言，与具体机器的指令系统绑定。
- **汇编语言**：用助记符（如 add、lw）和符号地址书写，**与具体机器结构密切相关**——同一助记符在不同指令系统中的含义、可用寄存器、寻址方式都不同，必须经汇编程序翻译成机器码。
- **高级语言**：面向问题描述，与具体机器结构（基本）无关，必须经编译或解释才能执行。

## 2. 逐项判断

- **A 正确**：机器语言程序本身就是机器指令的序列，指令由操作码和操作数（地址码）字段组成。
- **B 错误**：汇编语言恰恰依赖具体机器结构；与机器结构无关的是**高级语言**。这是本题的采分点。
- **C 正确**：CPU 只能直接执行机器语言程序。高级语言源程序要编译成目标机器码，汇编语言源程序要汇编成机器码，二者都不能被 CPU 直接执行。
- **D 正确**：注意"除宏指令、伪指令等外"这一限定。普通汇编语句一般一条对应一条机器指令；宏指令汇编时展开为若干条机器指令，伪指令只用于指示汇编程序（如定义数据、设定段），不产生机器指令。

## 3. 概念对照

~~~text
机器语言  : 二进制指令序列  | CPU 可直接执行 | 与机器强相关
汇编语言  : 助记符形式的机器指令 | 需汇编 | 与机器强相关
高级语言  : 面向问题的描述      | 需编译/解释 | 与机器基本无关
~~~`,pitfalls:String.raw`- **把汇编语言当作与机器无关**：汇编语言与机器结构密切相关，只有高级语言才（基本）与机器结构无关。
- **误认为汇编源程序可由 CPU 直接执行**：必须先经汇编程序翻译。
- **忽略 D 的限定条件**：把"一条汇编语句对应一条机器指令"绝对化，从而误判 D 错。宏指令会展开成多条机器指令，伪指令不产生机器指令，但都属于限定之外的例外。`}},{id:`mock-exam-1-co-q13`,questionNumber:13,title:`小端方式下指令机器码字节序列与溢出标志`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 指令系统 · 指令格式与小端存放`,tags:[`小端方式`,`指令编码`,`补码`,`溢出标志 OF`],summary:`给出 16 位小端机上 sub ax, imm16 的操作码、立即数与 ax 取值，求机器码字节序列和 OF。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 2 页（扫描件 PDF 第 3 页）；原卷未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`某 16 位小端处理器的指令"sub ax, imm16"的功能为 $(ax)-imm16 \rightarrow ax$，其操作码字节为 $2DH$。若 $imm16=-3$，$(ax)=7$，并按内存地址由低到高写出该指令的 3 个机器代码字节，则机器代码字节序列和执行后的 $OF$ 分别为（　）。

- A．$2D\ FF\ FD$、$0$
- B．$2D\ FF\ FD$、$1$
- C．$2D\ FD\ FF$、$0$
- D．$2D\ FD\ FF$、$1$`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-1/co-os-page-3.png`}],solution:{answer:String.raw`**选 C：字节序列 $2D\ FD\ FF$，$OF=0$。**`,explanation:String.raw`## 1. 小端方式决定立即数的字节顺序

指令格式为 1 字节操作码 + 16 位立即数，共 3 字节。小端方式下，多字节数据的**低字节存放在低地址**。

$imm16=-3$ 的 16 位补码：

$$
-3 = 10000_H - 0003_H = FFF\!D_H
$$

低字节为 $FD$、高字节为 $FF$。按内存地址由低到高写出，得到 $2D$（操作码）、$FD$（立即数低字节）、$FF$（立即数高字节），即 $2D\ FD\ FF$。若写成 $2D\ FF\ FD$ 就是把小端当成了大端。

## 2. 溢出标志：减法须检查结果是否越界

指令功能是 $(ax)-imm16$，代入得

$$
7-(-3)=10
$$

两种等价判断：

- **数值范围法**：16 位补码可表示 $[-32768,\ 32767]$，结果 $10$ 在范围内，不溢出，$OF=0$。
- **符号法**：减法 $a-b$ 只有在 $a$、$b$ **异号**时才可能溢出；若结果符号与 $a$ 相反，则发生溢出。本题 $7-(-3)=10$，结果与被减数同为正数，故没有溢出。不能仅凭“异号”就断言一定溢出或一定不溢出。

## 3. 脚本独立复核（.cache/lion-1/verify_co_os.py 实际输出）

~~~text
imm16 = -3 -> 小端字节(低->高) = [253, 255] = FD FF
指令机器码(按地址由低到高) = 2D FD FF
(ax)-imm16 = 7-(-3) = 10 -> 0x000A, 16位补码范围[-32768,32767]内 => OF=0
=> 字节序列 2D FD FF 且 OF=0  => C
~~~`,pitfalls:String.raw`- **大小端写反**：小端是低字节存低地址，$2D\ FF\ FD$ 对应大端存放习惯（选项 A、B 即此陷阱）。
- **把 $7-(-3)$ 算错**：算成 $4$ 或忽略负号。
- **用无符号数判断 OF**：$OF$ 是**有符号**溢出标志；无符号溢出应看进位/借位标志 $CF$。
- **看到操作码 $2DH$ 就联想 OF 的取值**：操作码字节与标志位无关。`}},{id:`mock-exam-1-co-q14`,questionNumber:14,title:`IEEE 754 单精度下产生 qNaN 的运算`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 数据的表示和运算 · IEEE 754 浮点数`,tags:[`IEEE 754`,`NaN`,`无穷大`,`无效运算`],summary:`在默认异常处理（不触发陷阱）前提下，判断四组十六进制位模式运算中结果为 qNaN 的一项。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 2 页（扫描件 PDF 第 3 页）；原卷未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`IEEE 754 中的 NaN 表示"非数"，其中 qNaN 为 quiet NaN。某系统采用 IEEE 754 单精度浮点数，浮点异常采用默认处理且不触发陷阱。下列运算的结果为 qNaN 的是（　）。

- A．$00000005H + 7F800000H$（$+\infty$）
- B．$7F800000H$（$+\infty$）$+\ FF800000H$（$-\infty$）
- C．$7F800000H$（$+\infty$）$+\ 7F800000H$（$+\infty$）
- D．$FF800000H$（$-\infty$）$-\ 7F800000H$（$+\infty$）`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-1/co-os-page-3.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 1. 先翻译位模式

单精度格式为 1 位符号 + 8 位阶码 + 23 位尾数：

- $7F800000H$：$0\,11111111\,000\cdots0$，阶码全 1、尾数全 0 → $+\infty$
- $FF800000H$：$1\,11111111\,000\cdots0$，阶码全 1、尾数全 0 → $-\infty$
- $00000005H$：阶码全 0、尾数非 0 → 非规格化小数（约 $5\times10^{-45}$，与无穷比可以忽略）

## 2. 哪些运算产生 NaN

IEEE 754 规定下列为**无效运算**，在"默认处理、不触发陷阱"时结果取 **qNaN**：

- $+\infty + (-\infty)$、$+\infty-(+\infty)$、$(-\infty)-(+\infty)$ 这类**无穷相减**情形
- $0\times\infty$、$0/0$、$\infty/\infty$
- 任何含 NaN 的运算（结果仍为 qNaN）

而 $+\infty+(+\infty)=+\infty$、$(+\infty)-(-\infty)=+\infty$ 等同号情形仍然得到无穷，不是无效运算。

## 3. 逐项判断

- **A**：小数 $+\ (+\infty)=+\infty$，不是 NaN。
- **B**：$(+\infty)+(-\infty)$，正负无穷相加属无效运算 → 默认结果为 qNaN，**正确**。
- **C**：$(+\infty)+(+\infty)=+\infty$，不是 NaN。
- **D**：$(-\infty)-(+\infty)=(-\infty)+(-\infty)=-\infty$，不是 NaN。

## 4. 脚本独立复核（实际输出）

~~~text
A: 00000005 + 7F800000 -> inf  isNaN=False
B: 7F800000 + FF800000 -> nan  isNaN=True
C: 7F800000 + 7F800000 -> inf  isNaN=False
D: FF800000 - 7F800000 -> -inf  isNaN=False
~~~`,pitfalls:String.raw`- **把 D 看成"无穷减无穷"**：$(-\infty)-(+\infty)=-\infty+(-\infty)=-\infty$；只有**同号**无穷相减（如 $+\infty-(+\infty)$）才是无效运算。
- **忽略"默认处理且不触发陷阱"**：若启用陷阱，无效运算进入异常处理程序，而不是直接返回 qNaN。
- **混淆 qNaN 与 sNaN**：sNaN 参与运算会再次触发无效运算异常；题目问的是默认产生的 qNaN。
- **误以为 $0/0$、$\infty/\infty$ 也能直接由位模式算出有限值**：它们同样是无效运算，结果为 qNaN。`}},{id:`mock-exam-1-co-q15`,questionNumber:15,title:`SSD 动态磨损均衡与静态磨损均衡`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 存储系统 · 固态硬盘（SSD）`,tags:[`SSD`,`闪存`,`磨损均衡`,`擦除次数`],summary:`判断关于 SSD 动态磨损均衡与静态磨损均衡机制及其目的的四条叙述中的正确项。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 2 页（扫描件 PDF 第 3 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于 SSD 磨损均衡的叙述中，正确的是（　）。

- A．动态磨损均衡在写入时优先选择擦除次数较少的空闲块；静态磨损均衡还会迁移长期不变的冷数据，使各块擦除次数更均衡
- B．动态磨损均衡只调整读操作，静态磨损均衡只调整写操作
- C．两种磨损均衡都不会移动已有数据
- D．静态磨损均衡的主要目的是提高顺序读取带宽，与闪存寿命无关`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-1/co-os-page-3.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`## 1. 闪存为什么需要磨损均衡

NAND 闪存的每个块可擦除次数有限（通常在 $10^3\sim10^5$ 量级），且**以块为单位擦除、以页为单位读写**。若某些块被反复擦写而另一些块长期空闲，少数块会先达到擦除上限、整块失效，SSD 的可用容量和寿命随之下降。磨损均衡（wear leveling）就是让擦除次数在全部块之间尽量平均。

## 2. 两种策略的区别

- **动态磨损均衡**：写入时在**空闲块**中选择擦除次数较少（更"年轻"）的块。它只作用在发生写入的位置，不搬运长期不变的数据。
- **静态磨损均衡**：除了上述做法，还会**主动迁移长期不变的冷数据**——把占据着低擦除次数块的冷数据搬到擦除次数较多的块，把"年轻"块释放出来承担后续写入。这样即使某段数据从不改写，也不会把某几个块"保护"成永不磨损的块。

~~~text
动态磨损均衡: 只在写时挑空闲块,  不搬冷数据
静态磨损均衡: 写时挑空闲块 + 主动迁移冷数据 => 全盘擦除次数更均衡
~~~

## 3. 逐项判断

- **A 正确**：前半句是动态磨损均衡的做法，后半句是静态磨损均衡的补充动作，目的都是让各块擦除次数更均衡。
- **B 错误**：两者针对的都是**写/擦除**（擦除次数才是寿命限制），与"读"无关；动态与静态的差别在于是否搬运冷数据，而不是读/写分工。
- **C 错误**：静态磨损均衡恰恰要**移动已有数据**（迁移冷数据）。
- **D 错误**：磨损均衡的直接目的是均衡擦除次数、**延长闪存寿命**，不是提高顺序读带宽。`,pitfalls:String.raw`- **把动态/静态理解成读/写分工**：闪存的寿命限制来自擦除次数，两种策略都是围绕写与迁移。
- **认为静态磨损均衡不搬数据**：静态之所以"静"，是指它连不再被修改的冷数据也会搬走，而不是"不动数据"。
- **把等价目的换成性能目的**：磨损均衡的出发点是寿命与可靠性，带宽是另一回事。`}},{id:`mock-exam-1-co-q16`,questionNumber:16,title:`四路组相联 Cache 的行位数`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 存储系统 · Cache 映射方式与行结构`,tags:[`Cache`,`四路组相联`,`标记位`,`替换算法`,`写回法`],summary:`按主存地址位数、数据区容量、块大小与路数，计算回写+LRU 时每行至少需要多少位。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 2 页（扫描件 PDF 第 3 页）；原卷未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`若计算机主存地址为 32 位，按字节编址，Cache 数据区大小为 32KB，主存块大小为 32B，主存和 Cache 之间采用四路组相联映射方式，采用回写策略和 LRU 替换算法，则在设计该 Cache 时，每个 Cache 行至少需要设置（　）位（包括数据位与必要的控制位）。

- A．277
- B．278
- C．279
- D．281`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-1/co-os-page-3.png`}],solution:{answer:String.raw`**选 C：279 位。**`,explanation:String.raw`## 1. 地址划分

- 块内地址（块偏移）：$32B=2^5B$ → $5$ 位
- 总行数：$32KB \div 32B = 1024$ 行
- 组数：$1024 \div 4 = 256$ 组 → 组号 $=\log_2 256=8$ 位
- 标记：$32-8-5=19$ 位

## 2. 一行的组成

$$
19(\text{标记})+1(\text{有效位})+1(\text{脏位/修改位})+2(\text{LRU 位})+32\times8(\text{数据})=279
$$

逐项说明：

- **有效位 1 位**：标识该行是否装有有效数据。
- **脏位 1 位**：回写策略必须记录该行是否被改写过，该行被替换（换出）时据此决定是否需要写回主存。
- **LRU 替换位 2 位**：一组 4 行，需记录 4 行的最近使用次序；4 行的 LRU 可用 $\lceil\log_2 4\rceil=2$ 位/行编码（也可整组用 3 位计数，但按"每行 2 位"的常规计法得 2 位）。
- **数据位 256 位**：$32B\times8$。

## 3. 脚本复核（实际输出）

~~~text
块内地址 = log2(32) = 5 位
总行数 = 32KB/32B = 1024, 组数 = 1024/4 = 256, 组号 = log2(256) = 8 位
标记 = 32 - 8 - 5 = 19 位
LRU 替换位 = log2(4) = 2 位, 另需有效位1 + 脏位1(回写)
行长 = 19(tag) + 1(有效) + 1(脏) + 2(LRU) + 256(数据32B) = 279 位
=> C 279
~~~`,pitfalls:String.raw`- **漏掉脏位**：写回法必须有一位标记"该行与主存不一致"，写直达法才不需要。
- **漏掉替换位**：LRU 不是"免费"的，需要额外状态位（4 路按行计 2 位）。
- **组号算错**：组数 = 行数 ÷ 路数 = 1024 ÷ 4 = 256，组号 8 位；若误用"行号"当索引会得 10 位、标记 17 位（对应 277 位）。
- **漏掉有效位**：没有有效位就无法区分"冷启动的空行"与"恰好命中"的数据。`}},{id:`mock-exam-1-co-q17`,questionNumber:17,title:`Cache 与主存同时访问时的平均访问时间`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 存储系统 · Cache 性能分析`,tags:[`Cache命中率`,`平均访问时间`,`并行访问`,`主存访问时间`],summary:`命中率与 Cache、主存访问时间已知，且 Cache 与主存同时访问时，求平均访问时间。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 2 页（扫描件 PDF 第 3 页）；原卷未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`若 CPU 访问 Cache 的命中率为 90%，Cache 的访问时间为 1ns，主存的访问时间为 100ns。若 Cache 与主存同时访问，Cache 命中后停止访问主存，则 CPU 的平均访问时间约为（　）。

- A．10.9ns
- B．11ns
- C．100.9ns
- D．101ns`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-1/co-os-page-3.png`}],solution:{answer:String.raw`**选 A：约 10.9ns。**`,explanation:String.raw`## 1. "同时访问"意味着两条通路并行

题中"Cache 与主存同时访问，Cache 命中后停止访问主存"描述的正是**并行（同时）访问**：CPU 把地址同时送给 Cache 和主存，Cache 命中就中止主存访问。因此时间模型是：

- 命中（概率 $h=0.9$）：只需 Cache 的 $t_c=1$ns；
- 未命中（概率 $1-h=0.1$）：主存访问从 $t=0$ 就开始，与 Cache 查找重叠，耗时 $t_m=100$ns。

$$
t_{avg}=h\,t_c+(1-h)\,t_m=0.9\times1+0.1\times100=10.9\text{ns}
$$

## 2. 若题目改成"顺序访问"才对上 B

若先查 Cache，未命中再访问主存（串行/顺序访问），则未命中时间为 $t_c+t_m=101$ns：

$$
t_{avg}=0.9\times1+0.1\times101=11\text{ns}
$$

即选项 B 是"顺序访问"的结果。本题明确写了"同时访问"，故取 10.9ns。

## 3. 脚本复核（实际输出）

~~~text
同时(并行)访问: 命中1ns; 未命中时主存访问与Cache查找重叠 -> 100ns
平均 = 0.9*1 + 0.1*100 = 109/10 ns
若按串行: 平均 = 1 + 0.1*100 = 11 ns (对应选项B, 但题述为同时访问)
~~~`,pitfalls:String.raw`- **把"同时访问"当"顺序访问"**：间或漏读后半句，直接按 $t_c+(1-h)t_m$ 算得 11ns（选项 B）。
- **未命中时间写成 $1+100$**：并行访问时主存从第 0 个周期就启动，与 Cache 查找重叠，不再累加 1ns。
- **误把 100.9ns 或 101ns 当答案**：这两个选项是把主存访问时间当成 1000ns 的同类错算，同样是干扰项。`}},{id:`mock-exam-1-co-q18`,questionNumber:18,title:`指令字长、定长指令字与扩展操作码`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 指令系统 · 指令格式与扩展操作码`,tags:[`指令字长`,`定长指令字`,`扩展操作码`,`机器字长`],summary:`判断关于指令字长、定长指令字结构与扩展操作码的四条叙述中错误的一项。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 2～3 页（扫描件 PDF 第 3～4 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于指令字长的叙述中，错误的是（　）。

- A．指令系统可以采用定长指令字，也可以采用变长指令字
- B．指令字长不一定等于机器字长
- C．定长指令字结构中，各条指令的长度相同
- D．采用扩展操作码技术时，地址数越多，可用于表示操作码的位数通常越多`,attachments:[{name:`查看原卷试题页（第 2～3 页）`,path:`mock-exam-1/co-os-page-3.png`},{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-1/co-os-page-4.png`}],solution:{answer:String.raw`**选 D。**`,explanation:String.raw`## 1. 概念

- **指令字长**：一条指令所含的二进制位数。
- **机器字长**：CPU 一次能处理的二进制位数（通常等于通用寄存器宽度、ALU 宽度），和指令字长没有必然相等关系，也不要求是整数倍关系。
- **定长指令字结构**：所有指令长度相同，取指与译码简单、便于流水；变长指令字结构则相反，代码密度高但译码复杂。

## 2. 逐项判断

- **A 正确**：两种结构都是常见设计（RISC 多用定长，CISC 多用变长）。
- **B 正确**：例如 32 位机器也常常见到 16 位或 48 位指令字长。
- **C 正确**：这正是"定长指令字结构"的定义。
- **D 错误**：一条指令的总位数固定时，**地址字段越多，占用的位数越多，留给操作码的位数就越少**（这正是扩展操作码/可变操作码的思路：无地址的指令可拿到全字长的操作码，地址多的指令只有很短的短操作码）。D 把方向说反了。

## 3. 扩展操作码的方向（对照）

$$
\text{操作码位数} = \text{指令字长} - \text{地址字段数}\times\text{每个地址位数}
$$

所以地址数越多 ⇒ 操作码位数越少。扩展操作码技术正是靠"短操作码留给多地址指令、长操作码留给少地址指令"来扩大整个指令系统的操作码空间。`,pitfalls:String.raw`- **把 D 的方向想反**：地址字段与操作码字段争的是同一条指令里的位数。
- **把"指令字长"="机器字长"**：两者可以不等，也不必是整数倍关系。
- **以为扩展操作码能同时让所有指令都拿到长操作码**：总位数固定，二者此消彼长。`}},{id:`mock-exam-1-co-q19`,questionNumber:19,title:`BNE 相对寻址的转移目标与 PC 值`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 指令系统 · 寻址方式（PC 相对寻址）`,tags:[`PC相对寻址`,`补码位移`,`条件转移`,`PC更新`],summary:`32 位定长指令、位移以指令字为单位、基准为下一条指令地址，求 BNE 执行后的 PC。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 3 页（扫描件 PDF 第 4 页）；原卷未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`某计算机按字节编址，采用 32 位定长指令。该机的条件转移指令 BNE 采用 PC 相对寻址，其机器码中的 16 位位移字段采用补码表示，并以指令字为单位（1 个指令字为 4 字节），寻址基准为 BNE 的下一条指令地址。执行下列程序片段前，$(R1)=5$，$(R2)=8$。

~~~text
2000H   BNE R1, R2, FFFCH    ; R1≠R2 时转移
2004H   ADD R3, R4, R5
~~~

执行 BNE 指令后，PC 的内容为（　）。

- A．1FF0H
- B．1FF4H
- C．2000H
- D．2004H`,attachments:[{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-1/co-os-page-4.png`}],solution:{answer:String.raw`**选 B：1FF4H。**`,explanation:String.raw`## 1. 先判条件是否成立

$(R1)=5$，$(R2)=8$，$5\ne8$，BNE 的"不相等则转移"成立，所以 PC 取转移目标地址，而不是顺序执行到 2004H。

## 2. 位移字段按补码解释并乘以指令字长

位移字段 $FFFC_H$ 的最高位为 1，是负数，按 16 位补码还原：

$$
FFFC_H - 10000_H = -4
$$

题目说明位移**以指令字为单位**，1 个指令字 = 4 字节，故字节位移为

$$
-4\times4=-16=-10_H
$$

## 3. 基准是"下一条指令地址"

BNE 位于 2000H、长 4 字节，下一条指令（ADD）位于 2004H。转移目标为

$$
2004_H+(-10_H)=1FF4_H
$$

所以执行 BNE 后 $PC=1FF4_H$。

## 4. 脚本复核（实际输出）

~~~text
位移字段 FFFCH 视为16位补码 = -4, 以指令字(4B)为单位 -> 字节位移 = -16
(R1)=5 != (R2)=8 -> BNE 转移成立
目标 = 下一条地址 0x2004 + (-16) = 0x1FF4
=> B 1FF4H
~~~`,pitfalls:String.raw`- **忘记乘 4**：位移以"指令字"为单位，直接 $2004_H-4=2000_H$ 会误选 C。
- **用本条指令地址当基准**：$(2000_H-10_H)=1FF0_H$，误选 A。
- **条件判反**：$R1\ne R2$ 时应转移；若误判为不转移会选 D（顺序执行）。
- **忘记 PC 已自增**：PC 相对寻址的基准是"取指后已自增的 PC"，即下一条指令地址。`}},{id:`mock-exam-1-co-q20`,questionNumber:20,title:`微指令长度：字段直接编码与断定法后继地址`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 控制器 · 微程序与微指令编码`,tags:[`微程序控制器`,`水平型微指令`,`字段直接编码`,`后继地址`],summary:`按四个互斥微命令类的大小与微指令条数，计算微指令长度至少需要多少位。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 3 页（扫描件 PDF 第 4 页）；原卷未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`某计算机采用微程序控制器，控制器使用水平型微指令。微指令的操作控制字段采用字段直接编码法。已知共有 30 个微命令，构成 4 个互斥类，各类包含的微命令数分别为 8、3、10 和 9。若该计算机的所有微程序总共由 127 条微指令构成，采用断定法（后继地址字段法）确定下一条微指令地址，在不考虑任何判断测试位的情况下，该微指令的长度至少为（　）。

- A．20 位
- B．21 位
- C．22 位
- D．23 位`,attachments:[{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-1/co-os-page-4.png`}],solution:{answer:String.raw`**选 B：21 位。**`,explanation:String.raw`## 1. 字段直接编码：每类要留一个"不发命令"的编码

把互斥的微命令分到若干字段，同类字段里同一时刻只能有一个微命令有效。同一个字段在同一时刻**还可能一个微命令都不发出**（例如只做数据通路传递、不发出某个控制信号），因此每类若含 $n$ 个微命令，需要能表示 $n+1$ 种状态：

$$
\text{字段位数}=\lceil\log_2(n+1)\rceil
$$

四类分别为：

$$
\lceil\log_2 9\rceil=4,\quad \lceil\log_2 4\rceil=2,\quad \lceil\log_2 11\rceil=4,\quad \lceil\log_2 10\rceil=4
$$

操作控制字段合计 $4+2+4+4=14$ 位。

## 2. 后继地址字段

采用断定法（下址字段）时，需要能直接指出 $2^7=128>127$ 个位置中的一个，故

$$
\lceil\log_2 127\rceil=7\ \text{位}
$$

## 3. 微指令长度

$$
14+7=21\ \text{位}
$$

## 4. 脚本复核（实际输出）

~~~text
类大小  8 -> ceil(log2( 9)) = 4 位
类大小  3 -> ceil(log2( 4)) = 2 位
类大小 10 -> ceil(log2(11)) = 4 位
类大小  9 -> ceil(log2(10)) = 4 位
操作控制字段合计 = 14 位
后继地址 = ceil(log2(127)) = 7 位 (127条微指令)
微指令长度 = 14 + 7 = 21 位 => B 21位
~~~`,pitfalls:String.raw`- **忘记留"不发命令"编码**：直接算 $\lceil\log_2 n\rceil$ 会得 $3+2+4+4=13$、总计 20 位，误选 A。
- **后继地址算成 $\lceil\log_2 128\rceil$**：127 条微指令只需 7 位，$2^7=128\ge127$ 已够。
- **把 30 个微命令整体编码**：水平型微指令的操作控制字段按互斥类分字段编码，不是整体求 $\lceil\log_2 30\rceil$。
- **漏掉判断测试位**：题目明确"不考虑任何判断测试位"，不要自行加位。`}},{id:`mock-exam-1-co-q21`,questionNumber:21,title:`并行性技术：流水线与超标量`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 指令流水线 · 并行性技术`,tags:[`时间并行`,`空间并行`,`流水线`,`超标量`],summary:`判断关于流水线、空间并行与超标量的四条描述中错误的一项。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 3 页（扫描件 PDF 第 4 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于计算机并行性技术的描述，错误的是（　）。

- A．流水线处理技术将一个任务划分为若干子过程，这些子过程在时间上有序重叠，体现了时间上的并行性
- B．空间上的并行性处理技术是在处理机内设置多个执行相同功能的独立操作部件，让它们并行工作
- C．超标量处理机主要利用时间上的并行性来提升性能
- D．流水线处理技术中，各子过程在不同的功能部件上进行，提高了系统的执行效率`,attachments:[{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-1/co-os-page-4.png`}],solution:{answer:String.raw`**选 C。**`,explanation:String.raw`## 1. 两类并行

- **时间并行**：同一套硬件在时间上重叠使用，典型代表是**流水线**（把任务切成若干子过程，不同子过程在不同时刻占用不同部件）。
- **空间并行**：重复设置资源，让多个部件**同时**工作，典型代表是**超标量**（一个周期内发射多条指令，配备多个功能部件、多端口寄存器堆）。

## 2. 逐项判断

- **A 正确**：这正是时间并行的定义。
- **B 正确**：空间并行靠"重复设置"硬件（多个相同功能的独立部件）实现同时工作。
- **C 错误**：超标量的核心是**空间并行**——在同一时刻并行执行多条指令，靠多套功能部件支撑；而利用时间并行的典型是流水线（以及超流水线）。C 把两者的归属颠倒了。
- **D 正确**：流水线中各子过程由不同功能部件承担，部件并行工作、吞吐率提高，这是流水线能提升性能的原因。

## 3. 对照记忆

~~~text
流水线   -> 时间上的并行  (同一套部件在时间上重叠)
超标量   -> 空间上的并行  (重复设置多个功能部件, 同时执行多条指令)
超流水线 -> 时间并行 + 更细的流水段划分
~~~`,pitfalls:String.raw`- **把超标量归为时间并行**：超标量是空间并行；与之易混的是"超流水线"（时间并行，进一步细分流水段）。
- **把"空间并行"理解为"并行存储"**：空间并行指重复设置功能部件，不限于存储器。
- **认为流水线的性能来自时钟频率**：流水线提高的是吞吐率，单条指令的执行时间基本不变。`}},{id:`mock-exam-1-co-q22`,questionNumber:22,title:`统一编址与独立编址的 I/O 方式`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 输入/输出系统 · I/O 编址方式`,tags:[`统一编址`,`独立编址`,`I/O指令`,`地址译码`],summary:`判断关于统一编址与独立编址两类 I/O 编址方式的四条描述中正确的一项。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 3 页（扫描件 PDF 第 4 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`以下关于 I/O 编址方式的描述，正确的是（　）。

- A．统一编址方式下，I/O 设备和内存共用同一地址空间，访问 I/O 需要专用 I/O 指令
- B．独立编址方式下，I/O 地址空间与内存地址空间独立，访问 I/O 用访存指令
- C．统一编址会减少主存地址空间，I/O 接口译码逻辑相对复杂
- D．独立编址方式下，I/O 操作的执行速度总是比统一编址方式快`,attachments:[{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-1/co-os-page-4.png`}],solution:{answer:String.raw`**选 C。**`,explanation:String.raw`## 1. 两种编址方式的要点

- **统一编址（存储器映射 I/O）**：I/O 端口与主存单元合用一个地址空间，用**普通的访存指令**（load/store）访问 I/O，不需要专门的 I/O 指令。代价是 **I/O 端口占用了内存地址空间**，使可用主存容量减少；同时接口要识别完整的地址（须与主存空间区分开），**地址译码逻辑相对复杂**。
- **独立编址（I/O 映射）**：I/O 与主存各有独立地址空间，需要**专门的 I/O 指令**（如 x86 的 in/out），接口只需译码端口地址并结合 I/O 读写控制信号，译码较简单，也不占用主存地址空间。

## 2. 逐项判断

- **A 错误**：统一编址恰恰**不需要**专用 I/O 指令，用访存指令即可。
- **B 错误**：独立编址恰恰**不能用**访存指令访问 I/O，必须用专用 I/O 指令。
- **C 正确**：统一编址会占用（减少）主存地址空间，且接口需与内存统一译码、区分地址范围，译码逻辑相对复杂。
- **D 错误**："总是更快"过于绝对。访问速度快慢取决于接口电路、总线时序与实现技术，独立编址因有专门控制信号在某些实现中译码简单，但性能并非与编址方式一一对应，谈不上"总是"更快。

## 3. 对照表（用列表代替表格渲染）

- 统一编址：指令 —— 访存指令；地址空间 —— 与主存共用；主存容量 —— 被占用一部分；译码 —— 相对复杂。
- 独立编址：指令 —— 专用 I/O 指令；地址空间 —— 独立；主存容量 —— 不受影响；译码 —— 相对简单。`,pitfalls:String.raw`- **A、B 互换指令类型**：统一编址用访存指令、独立编址用专用 I/O 指令，这是最常考的互换陷阱。
- **忽略 D 中的"总是"**：绝对化表述通常是错的。
- **把"译码简单"记反**：独立编址的接口只译码端口地址，配合读写控制信号，一般比统一编址简单。`}},{id:`mock-exam-1-os-q23`,questionNumber:23,title:`操作系统发展阶段的特征`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 操作系统概述 · 操作系统的发展历程`,tags:[`单道批处理`,`多道批处理`,`分时系统`,`实时系统`],summary:`判断关于单道批处理、多道批处理、分时系统与硬实时系统特征的四条叙述中错误的一项。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 3 页（扫描件 PDF 第 4 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于操作系统发展阶段的叙述中，错误的是（　）。

- A．单道批处理系统可通过脱机 I/O 减少 CPU 等待慢速设备的时间
- B．多道批处理系统允许多个作业在内存中并发执行
- C．分时系统通常采用时间片机制增强交互性
- D．硬实时系统允许关键任务偶尔超过截止时间而不影响系统正确性`,attachments:[{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-1/co-os-page-4.png`}],solution:{answer:String.raw`**选 D。**`,explanation:String.raw`## 1. 四个阶段的特征

- **单道批处理**：内存中只驻留一道作业，作业间自动过渡；为缓解"CPU 等慢速 I/O"的矛盾，采用**脱机 I/O**（用卫星机与外设交互，主机与磁带交互），减少 CPU 等待。
- **多道批处理**：内存中同时驻留多道作业，CPU 与 I/O、作业与作业之间并发执行，是操作系统的真正形成阶段。
- **分时系统**：把 CPU 时间切成**时间片**轮流分给各用户终端，用户可及时交互，追求响应时间与公平。
- **实时系统**：分为硬实时与软实时；**硬实时**要求所有关键任务都必须在**截止时间前**完成，一旦超时即视为系统失败。

## 2. 逐项判断

- **A 正确**：脱机 I/O 正是为减少主机等待慢速外设而设计的。
- **B 正确**：多道批处理的核心特征就是多道作业并发。
- **C 正确**：时间片轮流是分时系统实现交互性的基本手段。
- **D 错误**：硬实时系统**不允许**关键任务超时；允许偶尔超时而不影响正确性的，是**软实时**系统。

## 3. 硬实时与软实时的区别

~~~text
硬实时: 必须满足截止时间, 超时 = 系统失败 (如飞控、刹车控制)
软实时: 允许偶尔超时, 只是服务质量下降 (如视频播放、桌面交互)
~~~`,pitfalls:String.raw`- **把硬实时的"硬"字忘掉**：题目说的是"硬实时"，D 描述的是软实时的性质。
- **把分时的目标与实时的目标混同**：分时追求响应与公平，实时追求确定性与截止时间。
- **认为单道批处理没有并发也谈不上效率优化**：脱机 I/O、作业自动过渡都是它为缓解串行等待所做的优化。`}},{id:`mock-exam-1-os-q24`,questionNumber:24,title:`有界缓冲区信号量的 P 操作顺序`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 进程与线程 · 信号量与同步互斥`,tags:[`信号量`,`P操作`,`生产者-消费者`,`死锁`],summary:`有界缓冲区生产者-消费者中，判断关于 P(mutex)、P(empty)、P(full) 执行顺序的正确描述。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 3～4 页（扫描件 PDF 第 4～5 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`某有界缓冲区可存放 $n$ 件产品，信号量 $mutex$ 用于实现对缓冲区的互斥访问，$empty$ 和 $full$ 分别表示缓冲区中的空闲位置数和产品数。下列关于 P 操作执行顺序的叙述中，正确的是（　）。

- A．生产者应先执行 $P(mutex)$，再执行 $P(empty)$
- B．消费者应先执行 $P(mutex)$，再执行 $P(full)$
- C．生产者应先执行 $P(empty)$，再执行 $P(mutex)$；消费者应先执行 $P(full)$，再执行 $P(mutex)$
- D．由于 P 操作具有原子性，两个 P 操作的执行顺序可以任意交换`,attachments:[{name:`查看原卷试题页（第 3～4 页）`,path:`mock-exam-1/co-os-page-4.png`},{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-1/co-os-page-5.png`}],solution:{answer:String.raw`**选 C。**`,explanation:String.raw`## 1. 资源信号量必须放在互斥信号量之前

生产者：先 $P(empty)$（申请一个空位）、再 $P(mutex)$（进入临界区）；把产品放入缓冲区后 $V(mutex)$、$V(full)$。
消费者：先 $P(full)$（申请一件产品）、再 $P(mutex)$；从缓冲区取走产品后 $V(mutex)$、$V(empty)$。

~~~c
semaphore mutex = 1;   /* 缓冲区互斥 */
semaphore empty = n;   /* 空闲位置数 */
semaphore full  = 0;   /* 产品数   */

producer() {
    P(empty);          /* 先看有没有空位  */
    P(mutex);          /* 再进临界区      */
    put();
    V(mutex);
    V(full);           /* 产品数 +1       */
}

consumer() {
    P(full);           /* 先看有没有产品  */
    P(mutex);
    get();
    V(mutex);
    V(empty);          /* 空位数 +1       */
}
~~~

## 2. 逐项判断

- **A 错误**：先 $P(mutex)$ 再 $P(empty)$。若缓冲区已满：生产者先拿到锁再阻塞在 $P(empty)$ 上，**持锁睡眠**；此时消费者即使有产品也因拿不到 $mutex$ 而无法消费，无法执行 $V(empty)$，双方永久等待——**死锁**。
- **B 错误**：同理，若缓冲区为空，消费者先拿到 $mutex$ 再阻塞在 $P(full)$ 上，生产者拿不到锁、无法放入产品执行 $V(full)$，同样死锁。
- **C 正确**：先申请"与自身职责相关的资源"（空位/产品），拿到了再进临界区，保证在临界区内不会因为等资源而持锁睡眠。
- **D 错误**：P 操作**各自**是原子的，但两个 P 操作的**先后顺序**并不等价。如上分析，资源信号量与互斥信号量交换顺序会产生死锁，不能任意交换。

## 3. 一句话判据

$$
\text{资源信号量 }P \rightarrow \text{互斥信号量 }P \rightarrow \text{临界区} \rightarrow V(互斥) \rightarrow V(\text{对方的资源信号量})
$$`,pitfalls:String.raw`- **把互斥量放在资源量前面**：这是最经典的死锁考点（选项 A、B 即此陷阱）。
- **误认为"P 操作原子"⇒"顺序可换"**：原子性说的是单个 P 不可被打断，与两者的先后次序无关。
- **两处 P 的次序对生产者/消费者不对称**：生产者先 $P(empty)$，消费者先 $P(full)$，不要都写成同一个信号量。
- **V 操作次序也写反**：V 的顺序不引起死锁，但应保持"先还互斥、再增加对方可消费/可生产的资源"的惯用写法。`}},{id:`mock-exam-1-os-q25`,questionNumber:25,title:`共享内存通信的特点`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 进程与线程 · 进程通信`,tags:[`共享内存`,`进程通信`,`地址空间`,`同步`],summary:`判断关于共享内存通信机制四条叙述中的正确项。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 4 页（扫描件 PDF 第 5 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于共享内存通信的叙述中，正确的是（　）。

- A．每次通信都必须在内核缓冲区和用户缓冲区之间复制大量数据
- B．多个进程可将同一段物理内存映射到各自的虚拟地址空间，并通过该区域交换数据
- C．共享内存区域在任何时刻只能由一个进程读或写
- D．共享内存只能传递固定格式的消息，不能共享数据结构`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-1/co-os-page-5.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 1. 共享内存的工作方式

共享内存由系统调用创建一块物理内存（或共用同一文件映射），再把这段物理内存**映射进多个进程各自的虚拟地址空间**，这些虚拟页指向同一批物理页框。于是任一进程对该区域的写，其他进程立即可见——这是**速度最快**的进程通信方式，因为数据不需要在内核与用户之间来回复制。

## 2. 逐项判断

- **A 错误**：需要在内核缓冲区与用户缓冲区之间反复复制数据的是**消息传递**（管道、消息队列）一类的机制；共享内存正因为避免了这种复制才最快。
- **B 正确**：一句话概括了共享内存的本质——同一段物理内存映射到各进程自己的虚拟地址空间，通过该区域交换数据。
- **C 错误**：共享内存本身只提供"共同可见的存储"，并不限制并发；它**不提供互斥**，多进程可同时读写，正因如此必须由程序员另行用信号量等机制作同步。
- **D 错误**：共享内存传递的是**任意数据结构**（数组、链表、结构体），不限于固定格式的消息。

## 3. 与其他通信方式的对照

~~~text
共享内存: 映射同一物理内存 -> 最快, 但需自己加同步
消息传递: 内核缓冲区中转   -> 有复制开销, 但无需显式同步
管道    : 半双工字节流     -> 有复制, 限于亲缘/文件描述符
~~~`,pitfalls:String.raw`- **把共享内存与消息传递的复制代价搞混**：共享内存省掉了内核/用户之间的复制。
- **以为共享内存自带互斥**：不。它只解决"看到同一份数据"，不解决"并发访问的次序"，必须配信号量/互斥量。
- **认为共享内存只能传固定消息**：恰恰相反，它能直接共享任意数据结构，这也是它高效的原因之一。`}},{id:`mock-exam-1-os-q26`,questionNumber:26,title:`非抢占式 SJF 的平均带权周转时间`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 处理机调度 · 调度算法与性能指标`,tags:[`短作业优先`,`非抢占式`,`带权周转时间`,`调度顺序`],summary:`四个进程的到达时间与运行时间已知，求非抢占式 SJF 的平均带权周转时间。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 4 页（扫描件 PDF 第 5 页）；原卷未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`假设在一个非抢占式短作业优先（SJF）调度系统中，有 4 个进程 P1、P2、P3、P4，它们的到达时间和运行时间如下表所示，这些进程的平均带权周转时间为（　）。

- P1：到达时间 0，运行时间 8
- P2：到达时间 1，运行时间 4
- P3：到达时间 2，运行时间 9
- P4：到达时间 3，运行时间 5

- A．2.304
- B．2.5
- C．2.75
- D．2.9`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-1/co-os-page-5.png`}],solution:{answer:String.raw`**选 A：2.304。**`,explanation:String.raw`## 1. 非抢占式 SJF 的调度过程

"非抢占"意味着一旦某进程开始运行，就运行到结束（或阻塞），中途来了更短的作业也不打断它。

- $t=0$：只有 P1 到达，P1 开始运行，$0\sim8$。
- $t=8$：P1 结束。此时 P2（$1$，$4$）、P3（$2$，$9$）、P4（$3$，$5$）都已到达，选运行时间最短的 P2，$8\sim12$。
- $t=12$：P2 结束。剩余 P3（$9$）、P4（$5$），选 P4，$12\sim17$。
- $t=17$：P4 结束。最后运行 P3，$17\sim26$。

## 2. 周转时间与带权周转时间

$$
\text{周转时间}=\text{完成时间}-\text{到达时间},\qquad
\text{带权周转时间}=\frac{\text{周转时间}}{\text{运行时间}}
$$

- P1：周转 $8-0=8$，带权 $8/8=1$
- P2：周转 $12-1=11$，带权 $11/4=2.75$
- P4：周转 $17-3=14$，带权 $14/5=2.8$
- P3：周转 $26-2=24$，带权 $24/9\approx2.667$

$$
\text{平均带权周转时间}=\frac{1+2.75+2.8+2.667}{4}\approx2.304
$$

## 3. 脚本复核（实际输出）

~~~text
P1 到达 0 运行 8 开始 0 完成 8 周转 8 带权 1
P2 到达 1 运行 4 开始 8 完成12 周转11 带权 11/4
P4 到达 3 运行 5 开始12 完成17 周转14 带权 14/5
P3 到达 2 运行 9 开始17 完成26 周转24 带权 8/3
平均带权周转时间 = 553/240 = 2.304167
=> A 2.304
~~~`,pitfalls:String.raw`- **按到达顺序或抢占式 SJF 排**：抢占式 SJF（SRTF）下 P2 会在 $t=1$ 抢占 P1，结果约为 1.798，四个选项都不匹配——说明必须按"非抢占"理解。
- **把 P3、P4 的次序排反**：$t=12$ 时剩余 P3（$9$）与 P4（$5$），必须先 P4 后 P3。
- **周转时间减错基准**：应减各自的到达时间，而不是统一减 0。
- **带权周转时间忘了除以运行时间**：直接平均周转时间会得到 $(8+11+14+24)/4=14.25$，不在选项中。`}},{id:`mock-exam-1-os-q27`,questionNumber:27,title:`多级页表的性质判断`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 内存管理 · 多级页表`,tags:[`多级页表`,`TLB`,`页表连续内存`,`地址转换`],summary:`判断多级页表在访存次数、TLB 容量、连续性要求与置换频率四方面的四条陈述中正确的组合。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 4 页（扫描件 PDF 第 5 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于多级页表的叙述中，正确的是（　）。

- Ⅰ．在 TLB 未命中且各级页表项均需从主存读取时，多级页表会增加地址转换所需的访存次数
- Ⅱ．采用多级页表必然减小 TLB 所需容量
- Ⅲ．多级页表可避免要求整个页表占用一大片连续的物理内存
- Ⅳ．采用多级页表会降低页面置换频率

- A．仅Ⅲ
- B．Ⅰ、Ⅲ
- C．Ⅰ、Ⅱ、Ⅲ
- D．Ⅰ、Ⅱ、Ⅲ、Ⅳ`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-1/co-os-page-5.png`}],solution:{answer:String.raw`**选 B：Ⅰ、Ⅲ。**`,explanation:String.raw`## 1. 逐条判断

**Ⅰ 正确。** TLB 命中时地址转换不需访存；TLB 未命中就要去主存查页表。单级页表查一次即可，$k$ 级页表在最坏情况下要依次访问 $k$ 个页表项（各级页表本身也可能缺页），**地址转换的访存次数增加**——这正是多级页表要用 TLB 兜住的原因。

**Ⅱ 错误。** 多级页表改变的是页表的组织方式（分层、按需分配），与 TLB 的容量没有必然的因果关系；TLB 容量由典型工作集与硬件成本决定。说"必然减小"是毫无根据的强结论。

**Ⅲ 正确。** 多级页表把页表本身也分页存放，各级页表的页面可以离散地分布在物理内存中，**不需要一整片连续物理内存**来存放整个页表，这正是引入多级页表的重要动机（单级页表要求连续、巨大的页表区）。

**Ⅳ 错误。** 页面置换（缺页）频率由程序局部性、页框数量、置换算法等决定，多级页表并不改变缺页行为，谈不上"降低置换频率"。

## 2. 结论

$$
\text{正确项}=\{\text{Ⅰ},\ \text{Ⅲ}\}\Rightarrow \text{B}
$$

## 3. 多级页表的代价与收益对照

- 收益：页表可以离散存放、按需分配，避免连续大数组；未使用的页表项对应的页表页不必分配。
- 代价：TLB 未命中时转换访存次数变多（Ⅰ），因此必须靠 TLB 命中率来摊薄；同时页表项数与级数带来额外访存与实现复杂度。`,pitfalls:String.raw`- **把"Ⅱ 必然减小 TLB 容量"当成对的**：多级页表与 TLB 容量无关。
- **认为多级页表顺带降低缺页率**：缺页由局部性与页框数决定，与页表分级无关。
- **忘记多级页表在 TLB 未命中时的代价**：正好相反，它的代价就是转换访存次数增加。`}},{id:`mock-exam-1-os-q28`,questionNumber:28,title:`由物理地址反推虚拟地址`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 内存管理 · 地址变换过程`,tags:[`页表`,`物理地址`,`虚页号`,`页内偏移`],summary:`按页大小与部分页表（块号、有效位）由给定物理地址求对应的虚拟地址。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 4 页（扫描件 PDF 第 5 页）；原卷未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`某进程部分页表如下所示，存储系统按字节编址，页大小为 1024B，该进程物理地址 7218 对应的虚拟地址为（　）。

- 虚页号 0：块号 4，有效位 1
- 虚页号 1：块号 7，有效位 1
- 虚页号 2：块号 —，有效位 0
- 虚页号 3：块号 2，有效位 1
- 虚页号 4：块号 —，有效位 0
- 虚页号 5：块号 0，有效位 1
- （原表末行的"⋮"表示后续表项省略）

- A．1074
- B．2048
- C．512
- D．1536`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-1/co-os-page-5.png`}],solution:{answer:String.raw`**选 A：1074。**`,explanation:String.raw`## 1. 拆开物理地址

页大小为 $1024B=2^{10}B$，故页内偏移占 10 位：

$$
\text{块号}=7218\div1024=7,\qquad \text{页内偏移}=7218-7\times1024=7218-7168=50
$$

## 2. 用块号反查虚页号

在页表中找"块号 = 7 且有效位为 1"的表项：虚页号 1 的块号正是 7（有效位 1）。页内偏移在地址变换前后**不变**，故

$$
\text{虚拟地址}=\text{虚页号}\times\text{页大小}+\text{页内偏移}=1\times1024+50=1074
$$

## 3. 脚本复核（实际输出）

~~~text
物理地址7218: 块号 = 7218//1024 = 7, 页内偏移 = 7218%1024 = 50
页表中块号7 对应虚页号 = [1] (有效位1)
虚拟地址 = 1*1024 + 50 = 1074 => A 1074
~~~`,pitfalls:String.raw`- **忘记检查有效位**：无效表项的"块号"是无效的（2、4 号虚页有效位 0），不能采信。
- **把 7218 当成"块号 + 偏移"直接读**：必须先用页大小做整除和取余。
- **页内偏移发生变化**：地址变换只改变页号部分，页内偏移原样保留。
- **取错了页大小**：题给 1024B，若误用 4096B 会算出别的组合（例如 1074 不在其中）。`}},{id:`mock-exam-1-os-q29`,questionNumber:29,title:`符号链接与硬链接的链接计数`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 文件管理 · 文件的共享与链接`,tags:[`硬链接`,`符号链接`,`链接计数`,`inode`],summary:`文件 F 链接计数为 2 时先建符号链接再建硬链接，求三者各自的链接计数值。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 4 页（扫描件 PDF 第 5 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`在 Linux 系统中，设文件 F 的当前链接计数为 2。先建立 F 的符号链接文件 F1，再建立 F 的硬链接文件 F2，此时文件 F、F1、F2 的链接计数值分别是（　）。

- A．2、1、3
- B．3、1、3
- C．3、2、3
- D．2、2、3`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-1/co-os-page-5.png`}],solution:{answer:String.raw`**选 B：3、1、3。**`,explanation:String.raw`## 1. 两种链接的本质区别

- **硬链接**：多个目录项指向**同一个 inode**。建立硬链接只会让该 inode 的链接计数**加 1**，不产生新文件、不新增 inode，各链接地位平等。
- **符号链接（软链接）**：是一个**独立的新文件**，有自己的 inode 和数据块，内容只是一个指向目标路径的字符串。它自身的链接计数从 1 开始，与被链接文件的计数无关。

## 2. 三个计数值

- 建 F1（符号链接）：F 的计数**不变**，仍为 2；F1 是新 inode，计数为 1。
- 建 F2（硬链接）：F 的计数 $2+1=3$；F2 与 F 共用同一 inode，**读到的链接计数也是 3**。

所以 F、F1、F2 分别为 $3、1、3$。

## 3. 脚本核算（实际输出）

~~~text
符号链接 F1: 新建独立 inode, 自身链接计数 = 1
硬链接 F2: 目录项指向 F 的 inode, 计数 2 + 1 = 3
F 与 F2 共用同一 inode, 计数同为 3
=> B 3、1、3
~~~`,pitfalls:String.raw`- **以为符号链接也会增加目标文件的计数**：符号链接有自己的 inode，F 的计数不受影响（选项 A、D 即此错）。
- **以为 F2 的计数是 1**：硬链接与源文件共用一个 inode，链接计数读出来一样。
- **忘记 F 原本已有 2 个链接**：硬链接是在原计数基础上加 1。`}},{id:`mock-exam-1-os-q30`,questionNumber:30,title:`文件动态增长时不需要移动已有数据块的结构`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 文件管理 · 文件的物理结构`,tags:[`连续分配`,`链接分配`,`索引分配`,`文件增长`],summary:`判断四种文件物理结构中，文件动态增长时一定不需要调整已有数据块位置的有哪些。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 4 页（扫描件 PDF 第 5 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`在下列文件物理结构中，当文件动态增长时，一定不需要调整已有数据块物理位置的有（　）。

- Ⅰ．连续分配
- Ⅱ．隐式链接分配
- Ⅲ．显式链接分配
- Ⅳ．索引分配

- A．Ⅰ、Ⅱ
- B．Ⅱ、Ⅲ
- C．Ⅱ、Ⅳ
- D．Ⅱ、Ⅲ、Ⅳ`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-1/co-os-page-5.png`}],solution:{answer:String.raw`**选 D：Ⅱ、Ⅲ、Ⅳ。**`,explanation:String.raw`## 1. 四种结构的增长行为

- **Ⅰ 连续分配**：文件占用**一段连续**的磁盘块。若紧邻的后续块已被别人占用，文件要增长就**必须移动**整个文件（或至少搬迁已有块），这是它最致命的缺点，也是它需要"事先知道文件大小"的原因。
- **Ⅱ 隐式链接分配**：每个数据块末尾保存下一块的指针，块可以散布在磁盘任意位置。增长时只需再申请一个新块并接到链尾，**无需移动已有块**。
- **Ⅲ 显式链接分配**：把链接指针集中存放在**文件分配表（FAT）** 中，数据块本身仍然离散存放；增长只是更新 FAT 并分配新块，**不移动已有块**。
- **Ⅳ 索引分配**：为文件建立索引块，登记各数据块的块号；数据块离散存放，增长时分配新块并在索引块中登记（或扩展索引块），**不移动已有数据块**。

## 2. 结论

$$
\text{不需要移动}=\{\text{Ⅱ},\ \text{Ⅲ},\ \text{Ⅳ}\}\Rightarrow \text{D}
$$

## 3. 对照

~~~text
连续分配  : 一块连续区域 -> 增长需移动已有数据 (需要预先定长)
隐式链接  : 链指针在块内 -> 增长只接新块
显式链接  : 指针集中在 FAT -> 增长只改表 + 接新块
索引分配  : 索引块登记块号 -> 增长只登记新块号
~~~`,pitfalls:String.raw`- **把 Ⅰ 也算进去**：连续分配恰恰是最怕增长的方案。
- **担心链接分配"指针占空间会影响增长"**：指针开销影响的是可用容量与随机访问速度，不改变"增长不必移动已有块"这一结论。
- **认为索引分配需要移动索引块**：索引块可以重新分配/扩展，已有**数据块**无需移动。`}},{id:`mock-exam-1-os-q31`,questionNumber:31,title:`磁盘调度算法特性的描述`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 输入/输出管理 · 磁盘调度算法`,tags:[`FCFS`,`SSTF`,`SCAN`,`C-SCAN`,`饥饿`],summary:`判断关于 FCFS、SSTF、SCAN、C-SCAN 四种磁盘调度算法描述中的正确项。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 4～5 页（扫描件 PDF 第 5～6 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于磁盘调度算法的描述，正确的是（　）。

- A．FCFS 算法公平简单，但平均寻道距离较大
- B．SSTF 通常可以保证平均寻道时间最短
- C．SCAN 算法寻道性能较好，但可能导致"饥饿"现象
- D．C-SCAN 算法仅对中间磁道有利而不利于远离磁头一端的访问请求`,attachments:[{name:`查看原卷试题页（第 4～5 页）`,path:`mock-exam-1/co-os-page-5.png`},{name:`查看原卷试题页（第 5 页）`,path:`mock-exam-1/co-os-page-6.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`## 1. 四种算法的特性

- **FCFS（先来先服务）**：严格按请求到达顺序服务，不区分磁道远近，**公平、实现简单**；但因不考虑当前磁头位置，磁头可能来回长距离移动，**平均寻道距离（时间）大**。
- **SSTF（最短寻道时间优先）**：每次挑离磁头最近的请求，**贪心**地缩短单次寻道距离，平均寻道性能通常优于 FCFS；但当新请求不断出现在磁头附近时，远处的请求可能**长期得不到服务（饥饿）**。
- **SCAN（电梯算法）**：磁头沿一个方向移动并服务沿途请求，到最外（内）磁道后折返。它**不会饥饿**，但对**刚被扫描过的磁道**（等待折返的一端）不利。
- **C-SCAN（循环扫描）**：只沿一个方向服务，到端点后**直接快速返回起点**、返回途中不服务，再重新同向扫描。这一改动消除了 SCAN 对两端磁道的不公平，使各磁道的等待时间更均匀（界限为一次完整扫描）。

## 2. 逐项判断

- **A 正确**：FCFS 的公平、简单与寻道距离大有目共睹。
- **B 错误**："保证最短"过于绝对。SSTF 是**局部贪心**，对给定的请求序列并不保证获得全局最短的平均寻道时间，而且还会造成饥饿。
- **C 错误**：SCAN 恰恰**不会**导致饥饿（这正是相对 SSTF 的改进）；"饥饿"是 SSTF 的缺陷。
- **D 错误**：C-SCAN 的价值就在于消除了 SCAN 对某端磁道的不公平，使**各磁道**的响应更均衡；"只对中间磁道有利"并非 C-SCAN 的性质。

## 3. 一句话对比

~~~text
FCFS  : 公平简单, 寻道距离大
SSTF  : 单次寻道短, 会饥饿, 不保证全局最优
SCAN  : 无饥饿, 对刚扫描过的一端不利
C-SCAN: 无饥饿, 各磁道等待更均匀 (返回途中不服务)
~~~`,pitfalls:String.raw`- **把"饥饿"记到 SCAN 头上**：SCAN/C-SCAN 不会饥饿，会饥饿的是 SSTF。
- **相信"SSTF 保证平均寻道时间最短"**：它是贪心算法，"最短"只是通常效果，不是保证。
- **把 SCAN 的缺点安给 C-SCAN**：C-SCAN 正是为修正 SCAN 的两端不公平而设计。`}},{id:`mock-exam-1-os-q32`,questionNumber:32,title:`I/O 控制方式中 CPU 的参与程度`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 输入/输出管理 · I/O 控制方式`,tags:[`程序查询`,`中断方式`,`DMA`,`CPU参与度`],summary:`判断程序查询、中断、DMA 三种 I/O 控制方式的四条陈述中正确的组合。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 5 页（扫描件 PDF 第 6 页）；原卷未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`某进程请求将外部设备中的一块数据传送到主存。下列关于 I/O 控制方式的叙述中，正确的是（　）。

- Ⅰ．采用程序查询方式时，CPU 需要反复查询设备状态，并参与数据在设备控制器与主存之间的传送
- Ⅱ．采用中断方式时，CPU 可以执行其他进程，因此发出 I/O 请求的进程必然不会被阻塞
- Ⅲ．采用 DMA 方式时，CPU 完成必要的初始化后，可由 DMA 控制器控制设备与主存之间的数据传送
- Ⅳ．采用 DMA 方式传送数据时不需要使用系统总线，因此不会影响 CPU 访问主存

- A．Ⅰ、Ⅱ
- B．Ⅰ、Ⅲ
- C．Ⅱ、Ⅳ
- D．Ⅲ、Ⅳ`,attachments:[{name:`查看原卷试题页（第 5 页）`,path:`mock-exam-1/co-os-page-6.png`}],solution:{answer:String.raw`**选 B：Ⅰ、Ⅲ。**`,explanation:String.raw`## 1. 三种控制方式的本质差别

- **程序查询（轮询）**：CPU 反复读设备状态寄存器，直到设备"就绪"才**由 CPU 亲自把数据在设备控制器与主存之间搬运**。CPU 全程被占用，效率最低。
- **中断方式**：CPU 发出 I/O 请求后可以去做别的事，设备完成时**用中断通知** CPU，再由 CPU（通常通过中断服务程序）搬运数据。省掉了等待，但**数据的搬运仍由 CPU 参与**，每个字/字节都要一次中断。
- **DMA 方式**：CPU 只做**初始化**（给出主存起始地址、传送字数、方向，并启动 DMA 控制器），之后**由 DMA 控制器接管设备与主存之间的数据传送**，传送完成后通过中断告知 CPU。

## 2. 逐项判断

- **Ⅰ 正确**：轮询既占 CPU 查询状态，也由 CPU 参与传送。
- **Ⅱ 错误**：中断方式只让 CPU 不必"空等"，发出 I/O 请求的进程在数据到达前仍然**会被阻塞**（等待 I/O 完成），"必然不会被阻塞"是错的。
- **Ⅲ 正确**：这正是 DMA 的工作方式——初始化后 DMA 控制器控制设备与主存之间的数据传送，无需 CPU 逐字介入。
- **Ⅳ 错误**：DMA 传送同样要**占用系统总线**（DMA 控制器成为总线主设备，通过总线访问主存），还会与 CPU 争用总线、出现周期挪用，从而**影响 CPU 访存**。说"不需要使用系统总线"是错的。

## 3. CPU 参与度对比

~~~text
程序查询: CPU 反复查询 + CPU 搬数据       -> 占用最多
中断方式: CPU 不必等待, 但 CPU 仍搬数据   -> 中等
DMA     : CPU 只初始化 + 结束后处理中断   -> 占用最少, 但占总线
~~~`,pitfalls:String.raw`- **把"CPU 不必等待"当成"进程不会阻塞"**：中断方式下请求 I/O 的进程依然要等数据到达（选项 Ⅱ 的陷阱）。
- **以为 DMA 不使用总线**：DMA 数据通路与 CPU 同用系统总线，存在总线争用（周期挪用/停止 CPU/交替访存）。
- **忽略中断方式仍要 CPU 搬运数据**：它与 DMA 的关键区别正在于"谁搬数据"。`}},{id:`mock-exam-1-co-q43`,questionNumber:43,title:`数组复制的 Data Cache 缺失率（直接映射与 2 路组相联）`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 存储系统 · Cache 映射方式与缺失率（综合应用题）`,tags:[`直接映射`,`2路组相联`,`LRU`,`缺失率`,`虚拟地址`,`页式存储`],summary:`按给定 Cache 参数与数组地址，求地址字段划分、两个元素的块号以及两种映射方式下的数组访问缺失率。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 7 页（扫描件 PDF 第 8 页）；原卷未印参考答案，解析为本站独立推导并由脚本模拟复核，并非官方答案。`,content:String.raw`（43）（14 分）假定计算机 M 字长 32 位，主存按字节编址。Data Cache 数据区容量为 2KB，块大小为 32B，采用物理地址访问，初始采用直接映射；写策略为写回、写分配。页面大小为 4KB，虚拟地址和物理地址均为 32 位。以下为数组复制程序代码段 A：

~~~c
int a[128][4];
int b[128][4];
...
int i,j;
for(i=0;i<128;i++){
    for(j=0;j<4;j++){
        b[i][j]=a[i][j];
    }
}
...
~~~

假定 sizeof(int)=4，数组按行优先存放。数组 a 的虚拟首地址为 $0x80490000$，数组 b 紧接在数组 a 之后。已知虚拟地址 $0x80490000$ 对应的物理地址为 $0x000fa000$。循环开始时 Data Cache 为空，只统计数组元素的读写访问，不统计取指访问。请回答下列问题并给出计算过程。

(1) 数组 a 和数组 b 是否在同一个页面中？（2 分）

(2) 使用物理地址访问直接映射 Data Cache 时，物理地址应划分为哪些字段？各字段多少位？（2 分）

(3) 数组元素 $a[0][0]$ 和 $a[2][0]$ 所在主存块号各是多少？（4 分）

(4) 执行代码段 A 时，直接映射 Data Cache 的数组访问缺失率是多少？若改为容量和块大小不变的 2 路组相联 Cache，并采用 LRU 替换，则缺失率是多少？（6 分）`,attachments:[{name:`查看原卷试题页（第 7 页）`,path:`mock-exam-1/co-os-page-8.png`}],solution:{answer:String.raw`(1) **是**，a 与 b 落在同一个 4KB 页内。
(2) 物理地址划分为**标记 21 位、行号（索引）6 位、块内偏移 5 位**。
(3) $a[0][0]$ 为**第 32000 块**，$a[2][0]$ 为**第 32001 块**。
(4) 直接映射缺失率 **100%**；2 路组相联 LRU 缺失率 **12.5%**。`,explanation:String.raw`## (1) a、b 是否同页（2 分）

每个数组大小 = $128\times4\times4B=2048B=2KB$。

- a 的虚拟地址范围：$0x80490000 \sim 0x804907FF$
- b 紧随其后：$0x80490800 \sim 0x80490FFF$

页大小为 $4KB=0x1000$，页基址按 $0x1000$ 对齐，故两数组都落在页 $0x80490000\sim0x80490FFF$ 内，**在同一页**。

（顺带可确认物理地址的页内偏移不变：a 的物理起始地址 $0x000fa000$ 也正好是 4KB 对齐，页内偏移都是 0。）

## (2) 直接映射的地址字段（2 分）

- 块大小 32B → 块内偏移 $=\log_2 32=5$ 位
- 行数 = 数据区大小 ÷ 块大小 $=2KB\div32B=64$ 行 → 行号 $=\log_2 64=6$ 位
- 标记 $=32-6-5=21$ 位

$$
\underbrace{21}_{\text{标记}}\ \underbrace{6}_{\text{行号}}\ \underbrace{5}_{\text{块内偏移}}
$$

（本题直接在物理地址上划分，因为 Cache 用物理地址访问。）

## (3) 两个元素的块号（4 分）

a 的物理首地址 = $0x000fa000$（由题给虚拟地址 $0x80490000$ 映射而来，页内偏移相同）。

- $a[0][0]$ 的物理地址 = $0x000fa000$，块号 $=0x000fa000\div32=1024000\div32=32000$
- $a[2][0]$ 的地址 = 首地址 $+2\times4\times4B=+32B$，即 $0x000fa020$，块号 $=32000+1=32001$

$$
a[0][0]:\ \text{第 }32000\text{ 块};\qquad a[2][0]:\ \text{第 }32001\text{ 块}
$$

注意一行（$4$ 个 $int=16B$）只占半个块，因此 $a[0][\cdot]$ 与 $a[1][\cdot]$ 共用第 32000 块，$a[2][\cdot]$ 进入第 32001 块。

## (4) 两种映射下的缺失率（6 分）

总访问次数 = $128\times4$ 个元素 × 2（读 a、写 b）$=1024$ 次（含取指不计）。

**关键冲突：** b 的物理首地址比 a 大 $2KB$，而 Cache 数据区正好是 $2KB$、共 64 行，故同一行号的 a 块与 b 块相差 $2048B\div32B=64$ 个块号，**必然映射到同一条 Cache 行**（行号相同、标记不同）。

**直接映射**：程序按 $j$ 递增交替访问 $a[i][j]$ 与 $b[i][j]$。每次访问 a 会把 b 的行换出，访问 b 又把 a 的行换回——两者反复互相驱逐。因此**每一次访问都缺失**：

$$
\text{缺失率}=\frac{1024}{1024}=100\%
$$

（若按"先读 a 一整行再写 b 一整行"去算会误得 25%；但 C 语句是 $b[i][j]=a[i][j]$，读 a、写 b 是**交替**发生的。）

**2 路组相联（LRU）**：64 行 2 路 → 32 组，组号 5 位；互为冲突的两个块（同一组、不同标记）可以**同时驻留在两条路中**。除每个新块首次进入时缺失外，后续访问都命中：

- $i=0$：$a$ 的块 32000 与 $b$ 的块 32064 首次装入 → 2 次缺失；
- $i=1$：两个块都还在 → 全命中（0 次缺失）；
- $i=2$：进入下一对块 → 2 次缺失；……

即只有 $i$ 为偶数的 64 轮各缺 2 次：

$$
\text{缺失率}=\frac{64\times2}{1024}=\frac{128}{1024}=12.5\%
$$

## 脚本独立复核（.cache/lion-1/verify_co_os.py 实际输出）

~~~text
a 虚址 [0x80490000, 0x804907ff]; b 虚址 [0x80490800, 0x80490fff]
4KB 页: a、b 都落在页 0x80490000 ~ 0x80490fff => 同一页
a[0][0] 物理块号 = 0xfa000/32 = 32000
a[2][0] 物理地址 = 0xfa000 + 2*16 = 0xfa020 -> 块号 32001
直接映射: 缺失 1024 / 访问 1024 = 1 = 100.000000%
2路组相联LRU: 缺失 128 / 访问 1024 = 1/8 = 12.500000%
~~~`,pitfalls:String.raw`- **忘记 a、b 交替访问**：读 a、写 b 在同一轮 $j$ 中交替发生，直接映射才会 100% 缺失；若先读完整的 a 行再写完整的 b 行，会误得 25%。
- **忘记乘以 2**：访问次数是"读 a + 写 b"共 1024 次，不是 512 次；缺失率是比值，忘记乘 2 只要分子分母一致其实不影响比值，但计算过程要写清。
- **写访问不算缺失**：题设写分配（write allocate），写不命中同样要调入块，必须计入缺失。
- **2 路组相联的组号算错**：64 行 2 路是 32 组、组号 5 位，而不是 6 位；若按 64 组算会误判冲突关系。
- **遗漏脏位/有效位等行结构**：第 (2) 问只要求划分物理地址字段，不要混入行内的控制位。`}},{id:`mock-exam-1-co-q44`,questionNumber:44,title:`五级流水线的 RAW 相关与最少 nop 插入`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 指令流水线 · 数据相关与流水线停顿`,tags:[`流水线`,`RAW相关`,`nop`,`无转发`,`寄存器读写冲突`],summary:`按五级流水线与"ID 读、WB 写且同周期不能读写同一寄存器"的约定，指出 RAW 相关并求最少 nop 数。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 7 页（扫描件 PDF 第 8 页）；原卷未印参考答案，解析为本站独立推导并由脚本穷举复核，并非官方答案。`,content:String.raw`（44）（9 分）题干同第 43 题。循环体语句 $b[i][j]=a[i][j]$ 对应下列 5 条指令。处理器采用 IF、ID、EX、MEM、WB 五级流水线，不采用数据转发，也不进行动态阻塞；寄存器在 ID 阶段读取、在 WB 阶段写入，同一寄存器的读和写不能在同一时钟周期内进行。只考虑所列 5 条指令在本次迭代内的 RAW 相关。

~~~text
loop: add  $t4, $t1, $t0   # $t4=address of a[i][j]
      lw   $t5, 0($t4)     # $t5=a[i][j]
      add  $t7, $t2, $t0   # $t7=address of b[i][j]
      sw   $t5, 0($t7)     # b[i][j]=a[i][j]
      addi $t0, $t0, 4     # 数组元素的字节偏移量增加 4
~~~

(1) 请问 \$t0、\$t1 和 \$t2 各自存放的是什么信息？（3 分）

(2) 指出这 5 条指令之间的所有 RAW 数据相关。（3 分）

(3) 若只能插入 nop 消除上述 RAW 相关，应在何处插入最少数量的 nop？写出调整后的指令序列。（3 分）`,attachments:[{name:`查看原卷试题页（第 7 页）`,path:`mock-exam-1/co-os-page-8.png`}],solution:{answer:String.raw`(1) \$t1 存放数组 **a 的首地址**，\$t2 存放数组 **b 的首地址**，\$t0 存放**当前数组元素的字节偏移量**（每轮加 4）。
(2) 三条 RAW：1→2（\$t4）、2→4（\$t5）、3→4（\$t7）。
(3) 最少 **6 个 nop**：第 1 条后插 3 个、第 2 条后插 0 个、第 3 条后插 3 个、第 4 条后插 0 个。`,explanation:String.raw`## (1) 三个寄存器的作用（3 分）

循环体中 $a[i][j]$ 的地址 = a 的首地址 + 元素字节偏移，$b[i][j]$ 同理。对照注释（寄存器按原文写作 \$t0、\$t1、\$t2，此处不再套数学定界符）：

- \$t1：数组 **a 的首地址**（基址寄存器）
- \$t2：数组 **b 的首地址**
- \$t0：当前元素的**字节偏移量**（$i$、$j$ 折算成 $4\times(4i+j)$ 字节），指令 addi \$t0,\$t0,4 使下一轮指向下一个元素

（行优先存放，一个 int 占 4 字节，故每轮偏移加 4。）

## (2) 本次迭代内的 RAW（3 分）

"写后读"（RAW）指后面的指令要读前面指令尚未写回的结果：

- **指令 1 → 指令 2**：add 写 \$t4，lw 把 \$t4 当作访存地址去读存储器（\$t4）
- **指令 2 → 指令 4**：lw 写 \$t5，sw 把 \$t5 作为待存储的数据（\$t5）
- **指令 3 → 指令 4**：add 写 \$t7，sw 把 \$t7 作为存储地址（\$t7）

**指令 5 与指令 1、3 之间不是迭代内 RAW**：指令 5 写 \$t0，而指令 1、3 对 \$t0 的读都发生在它**之前**，这属于同一迭代内的 **WAR（先读后写，反相关）**，不构成 RAW，也不是本例 nop 停顿的来源；真正涉及 \$t0 的 RAW 是**跨迭代**的（本轮指令 5 写 \$t0 → 下一轮指令 1、3 读 \$t0），按题目"只考虑本次迭代内"的要求不列入。

注意区分**地址**与**数据**：lw \$t5,0(\$t4) 中 \$t4 的值是**有效地址 EA**，真正读入 \$t5 的是**主存单元 M[EA]**；sw \$t5,0(\$t7) 则是把 \$t5 的值写入单元 M[EA]，其 EA 由 \$t7 给出。因此 \$t4、\$t7 被写坏与 \$t5 被写坏都会破坏这条语句的功能。

## (3) 最少 nop（3 分）

约束模型：指令在 IF 取指、ID 读寄存器、WB 写寄存器；**同一寄存器的读写不能在同一周期**，因此消费者读到新值必须满足

$$
\text{消费者 ID 周期} > \text{生产者 WB 周期}
$$

生产者若在第 $c$ 周期取指，则 WB 在第 $c+4$ 周期；消费者若在第 $c'$ 周期取指，则 ID 在第 $c'+1$ 周期，故需 $c'+1>c+4$，即 $c'\ge c+4$：**消费者至少要晚 4 个周期取指**。两条相邻指令天然只差 1 个周期，因此一对直接相邻的 RAW 之间**至少需要插入 3 个 nop**（插更多当然也正确，只是不再是"最少"）。

- 指令 1（add，写 \$t4）在周期 5 写回 ⇒ 指令 2（lw，读 \$t4）最早第 5 周期取指：**指令 1 后插 3 个 nop**。
- 指令 3（add，写 \$t7）在第 6 周期取指、第 10 周期写回 ⇒ 指令 4（sw，读 \$t7）最早第 10 周期取指：**指令 3 后插 3 个 nop**。
- 指令 2（lw，写 \$t5）第 5 周期取指、第 9 周期写回 ⇒ 要求 sw 在第 8 周期之后取指；上面已把 sw 排到第 10 周期，**更严的约束来自 \$t7**，故指令 2 与 3 之间、指令 4 与 5 之间无需插入 nop。

调整后的序列：

~~~text
loop: add  $t4, $t1, $t0
      nop
      nop
      nop
      lw   $t5, 0($t4)
      add  $t7, $t2, $t0
      nop
      nop
      nop
      sw   $t5, 0($t7)
      addi $t0, $t0, 4
~~~

## 脚本独立复核（穷举间隔 0～6，实际输出）

~~~text
RAW 相关(本次迭代内): 指令1 -> 指令2 ($t4),  指令2 -> 指令4 ($t5),  指令3 -> 指令4 ($t7)
最少 nop 总数 = 6
  间隔分配 [3, 0, 3, 0] -> IF [0, 4, 5, 9, 10], ID [1, 5, 6, 10, 11], WB [4, 8, 9, 13, 14]
校验 [3,0,3,0]: 合法=True, IF=[0, 4, 5, 9, 10], ID=[1, 5, 6, 10, 11], WB=[4, 8, 9, 13, 14]
add@1: ID2 EX3 MEM4 WB5; lw@5: ID6 EX7 MEM8 WB9; add@6: ID7 EX8 MEM9 WB10;
sw@10: ID11 EX12 MEM13 WB14; addi@11: ID12 EX13 MEM14 WB15
~~~`,pitfalls:String.raw`- **只盯着 \$t5 而漏掉 \$t7**：\$t7 的生产者（指令 3）比 \$t5 的生产者（指令 2）更靠后、写回更晚，sw 的取指时刻由它决定，因此指令 3 之后也必须插 3 个 nop。
- **按"1 个 nop 就够"的直觉**：本题明确"不采用数据转发"，必须等生产者写回 WB，一对直接相邻的 RAW 之间至少要 3 个 nop（不是 1 个）。
- **把跨迭代相关算进来**：\$t0 的相关（本轮指令 5 → 下一轮指令 1、3）不算本次迭代；指令 5 与指令 1、3 在同一迭代内只是 WAR，不要当成 RAW。
- **插入位置写错**：必须在**第 1 条之后**和**第 3 条之后**各插 3 个 nop。若把 6 个 nop 全堆在第一条指令之前，指令 1～5 之间仍然两两相邻，\$t4、\$t5、\$t7 三处相关一处也没解除；只在其中一处插 nop 同样会留下一处未解决的相关，流水线仍会因冒险而停顿或取到错值。
- **把"至少 3 个 nop"说成"最多 3 个 nop"**：3 个是**下限**（满足"读周期严格晚于写周期"的最小间隔），多插不违反正确性，只是不再是最少方案。`}},{id:`mock-exam-1-os-q45`,questionNumber:45,title:`请求分页的页号序列、LRU 置换与平均访问时间`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 内存管理 · 请求分页与页面置换（综合应用题）`,tags:[`请求分页`,`局部LRU`,`缺页`,`TLB`,`平均访问时间`],summary:`按 10 个逻辑地址求页号序列、3 个页框下的 LRU 置换过程与缺页次数，并估算平均访问时间。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 8 页（扫描件 PDF 第 9 页）；原卷未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`（45）（8 分）某请求分页系统按字节编址，页面大小为 4KB，给进程 P 分配 3 个初始为空的页框，采用局部 LRU 页面置换算法。P 依次访问下列十个十进制逻辑地址：30001、4086、4100、8200、3012、12600、2023、17000、8201、12601。TLB 查找时间为 20ns，主存访问时间为 100ns，TLB 与页表顺序访问，不考虑 Cache。若某次访问发生缺页，则此次 TLB 必不命中；从在页表中发现缺页开始，缺页处理时间为 25ms，该时间包含页面调入以及 TLB 和页表的更新，但不包含重新执行该访存指令的时间。访存指令重新执行时 TLB 命中。在不发生缺页的访问中，TLB 命中率按 20% 估算。

(1) 写出上述逻辑地址对应的页号访问序列。（2 分）

(2) 给出每次访问后 3 个页框中的页号，并计算缺页次数。（3 分）

(3) 估算上述地址序列的平均访问时间。（3 分）`,attachments:[{name:`查看原卷试题页（第 8 页）`,path:`mock-exam-1/co-os-page-9.png`}],solution:{answer:String.raw`(1) 页号序列：**7、0、1、2、0、3、0、4、2、3**。
(2) 缺页 **8 次**（缺页率 80%），逐次页框见解析。
(3) 平均访问时间约 **20.00ms**（精确值 20.000232ms）。`,explanation:String.raw`## (1) 页号序列（2 分）

页大小 $4KB=4096B$，页号 $=\lfloor\text{逻辑地址}/4096\rfloor$：

- 30001 → 7
- 4086 → 0
- 4100 → 1
- 8200 → 2
- 3012 → 0
- 12600 → 3
- 2023 → 0
- 17000 → 4
- 8201 → 2
- 12601 → 3

$$
\text{页号序列}=7,\ 0,\ 1,\ 2,\ 0,\ 3,\ 0,\ 4,\ 2,\ 3
$$

## (2) 局部 LRU 的页框变化与缺页次数（3 分）

局部分配 3 个页框、初始为空，LRU 淘汰最久未使用的页：

- 第 1 次 页号 7：缺页 → 页框 {7}
- 第 2 次 页号 0：缺页 → 页框 {7, 0}
- 第 3 次 页号 1：缺页 → 页框 {7, 0, 1}
- 第 4 次 页号 2：缺页，淘汰 7 → 页框 {0, 1, 2}
- 第 5 次 页号 0：**命中** → 页框 {1, 2, 0}
- 第 6 次 页号 3：缺页，淘汰 1 → 页框 {2, 0, 3}
- 第 7 次 页号 0：**命中** → 页框 {2, 3, 0}
- 第 8 次 页号 4：缺页，淘汰 2 → 页框 {3, 0, 4}
- 第 9 次 页号 2：缺页，淘汰 3 → 页框 {0, 4, 2}
- 第 10 次 页号 3：缺页，淘汰 0 → 页框 {4, 2, 3}

$$
\text{缺页次数}=8\quad(\text{命中 }2\text{ 次},\ \text{缺页率}=\frac{8}{10}=80\%)
$$

## (3) 平均访问时间估算（3 分）

先算**不发生缺页**的访存的平均时间。TLB 与页表**顺序访问**：命中时"TLB 查找 20ns + 访存 100ns"；未命中时"TLB 查找 20ns + 查页表 100ns + 访存 100ns"。

$$
t_{\text{不缺页}}=0.2\times(20+100)+0.8\times(20+100+100)=0.2\times120+0.8\times220=200\text{ns}
$$

再看**发生缺页**的访存：TLB 未命中（20ns）→ 查页表发现缺页（100ns）→ 缺页处理 25ms（含调入页面与更新 TLB、页表）→ 重新执行该访存指令且此时 TLB 命中（20+100ns）：

$$
t_{\text{缺页}}=(20+100)+25\,000\,000+(20+100)=25\,000\,240\text{ns}
$$

10 次访问中 8 次缺页、2 次不缺页，故

$$
t_{\text{avg}}=0.8\times25\,000\,240+0.2\times200=20\,000\,192+40=20\,000\,232\text{ns}\approx20.00\text{ms}
$$

平均访问时间几乎完全由缺页处理时间主导，约为 **20ms**。

## 脚本独立复核（实际输出）

~~~text
逻辑地址 -> 页号: 30001->7, 4086->0, 4100->1, 8200->2, 3012->0, 12600->3, 2023->0, 17000->4, 8201->2, 12601->3
    第 1次 页号 7 缺页             页框(LRU->MRU) = [7]
    第 2次 页号 0 缺页             页框(LRU->MRU) = [7, 0]
    第 3次 页号 1 缺页             页框(LRU->MRU) = [7, 0, 1]
    第 4次 页号 2 缺页(淘汰 7)       页框(LRU->MRU) = [0, 1, 2]
    第 5次 页号 0 命中             页框(LRU->MRU) = [1, 2, 0]
    第 6次 页号 3 缺页(淘汰 1)       页框(LRU->MRU) = [2, 0, 3]
    第 7次 页号 0 命中             页框(LRU->MRU) = [2, 3, 0]
    第 8次 页号 4 缺页(淘汰 2)       页框(LRU->MRU) = [3, 0, 4]
    第 9次 页号 2 缺页(淘汰 3)       页框(LRU->MRU) = [0, 4, 2]
    第10次 页号 3 缺页(淘汰 0)       页框(LRU->MRU) = [4, 2, 3]
缺页次数 = 8 / 10, 缺页率 = 4/5
不缺失访问: TLB命中 20%: 20+100=120ns; 未命中: 20+100+100=220ns; 平均 200 ns
缺失访问: 20+100+25ms(含页表/TLB更新)+重新执行(TLB命中)20+100 = 25000240 ns
总平均 = 0.8*25000240 + 0.2*200 = 20000232 ns = 2500029/125000 ms
= 20.000232 ms ≈ 20.00 ms
~~~`,pitfalls:String.raw`- **页号算错**：忘记页面大小是 4KB = 4096B，用 1024 或 1000 去整除。
- **把局部 LRU 做成全局置换**：本题固定分配 3 个页框、只在页框内置换，不因访问新页而全局调整。
- **缺页访问只算 25ms**：还要加上发现缺页前的"TLB 查找 + 查页表"以及缺页处理完之后的**重新执行**时间（此时 TLB 命中，20+100ns）。
- **平均时间忘记加权**：应先区分"缺页/不缺页"两类，再在**不缺页**内部按 20% TLB 命中率细分，不能把 20% 直接套到全部 10 次访问上。
- **单位混淆**：25ms = 25 000 000ns，最终结果约 20ms，不要写成 20ns 或 20s。`}},{id:`mock-exam-1-os-q46`,questionNumber:46,title:`单缓冲区向三个消费者发消息的信号量设计`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 进程与线程 · 信号量与进程同步（综合应用题）`,tags:[`信号量`,`生产者-消费者`,`单缓冲区`,`多消费者`,`互斥与同步`],summary:`单缓冲区、三个消费者各读一次才能覆盖写入，要求设置信号量并给出四个进程的伪代码。`,source:`用户提供的扫描件 docs/book/一.pdf（lion模拟卷1）第 8 页（扫描件 PDF 第 9 页）；原卷未印参考答案，解析为本站独立推导并由脚本模拟复核，并非官方答案。`,content:String.raw`（46）（7 分）进程 A 通过一个单缓冲区不断向进程 B、C、D 发送消息。每条消息必须分别被 B、C、D 各读取一次后，A 才能覆盖缓冲区并写入下一条消息；任何进程访问缓冲区时均须互斥。请设置信号量并给出 A、B、C、D 的伪代码。要求说明各信号量的含义和初值，并保证任一消费者对同一条消息恰好读取一次。`,attachments:[{name:`查看原卷试题页（第 8 页）`,path:`mock-exam-1/co-os-page-9.png`}],solution:{answer:String.raw`信号量：$mutex=1$（缓冲区互斥）、$empty=1$（缓冲区可写，初值 1 表示首条消息可直接写）、\$fullB=fullC=fullD=0（分别通知 B、C、D 有新消息）；共享变量 \$count 初值 0，由生产者每写入一条消息时置为 3（当前消息尚未读取的消费者数），受 $mutex$ 保护。消费者各读一次后把 \$count 减 1，减到 0 的那名消费者执行 $V(empty)$，A 才能覆盖缓冲区写第二条消息。`,explanation:String.raw`## 1. 需求拆解

- **缓冲区互斥**：任何进程访问缓冲区都要互斥 ⇒ 需要 $mutex$。
- **A 不能提前覆盖**：必须等 B、C、D 都读完 ⇒ 需要"读取完成"的同步信号（$empty$），由"最后一名消费者"释放。
- **每个消费者都要被通知**：若只用一个共享的计数信号量 $full=3$，任一消费者都可能连续三次 $P(full)$ 成功、把同一条消息读三遍，而另外两个消费者一次也读不到。因此**本解法为每个消费者分别设置私有信号量** \$fullB、\$fullC、\$fullD（其他广播机制原则上也可以，但无论用哪种机制，都必须保证"每个消费者对每条消息只被唤醒一次"以及"三人读完前 A 不能覆盖"）。
- **保证"恰好一次"**：A 每写一条消息，对每个消费者的私有信号量各 $V$ 一次；消费者每轮只 $P$ 自己的信号量一次，因此每条消息对每个消费者恰好可见一次。

## 2. 信号量定义与初值

~~~c
semaphore mutex = 1;    /* 缓冲区互斥 */
semaphore empty = 1;    /* 缓冲区可写入; 初值 1 = 首条消息可直接写 */
semaphore fullB = 0;    /* B 有可读消息 */
semaphore fullC = 0;    /* C 有可读消息 */
semaphore fullD = 0;    /* D 有可读消息 */
int count = 0;          /* 尚未读取当前消息的消费者数; 初值 0, 由 A 每写一条消息置 3 (受 mutex 保护) */
~~~

## 3. 伪代码

~~~c
A() {
    while (1) {
        产生一条消息 message;              /* 生产在临界区外 */
        P(empty);                         /* 等三名消费者都读完上一条 */
        P(mutex);
        把 message 写入缓冲区;
        count = 3;                        /* 本条消息待读人数 */
        V(mutex);
        V(fullB); V(fullC); V(fullD);      /* 分别通知 B、C、D */
    }
}

/* B、C、D 的公共结构: ready 是各自的私有信号量 */
consumer(semaphore ready) {
    while (1) {
        message m;
        P(ready);                         /* 等属于自己的一次通知 */
        P(mutex);
        m = 从缓冲区读取该消息;             /* 临界区内只做读取 */
        count--;
        int last = (count == 0);
        V(mutex);
        if (last) V(empty);                /* 最后一个读者才允许 A 覆盖 */
        处理消息 m;                        /* 处理在临界区外 */
    }
}

B() { consumer(fullB); }
C() { consumer(fullC); }
D() { consumer(fullD); }
~~~

## 4. 正确性说明

- **互斥**：所有对缓冲区和 $count$ 的读/写都在 $P(mutex)\cdots V(mutex)$ 之间。
- **不提前覆盖**：$empty$ 只在 $count$ 由 1 减到 0（即三人全部读完）时被 $V$，A 的 $P(empty)$ 才能通过。
- **恰好一次**：每个消费者只有在其私有信号量被 $V$ 后才能 $P$ 成功一次，故每条消息对每人恰好一次。

## 5. 脚本模拟复核

以下为脚本实际输出。其中"每条消息被读取的消费者"一行过长，这里整行省略（该行逐条结果均为 ['B', 'C', 'D']，与紧随其后的断言行一致）：

~~~text
生产者写入 12 条消息, 消费者读取 36 次 (期望 36 = 3*12)
每条消息恰好被B、C、D各读一次: True
A 覆盖缓冲区次数 = 3*12 / 3 = 12 (无提前覆盖, 每轮 unread 归零才释放 empty)
反例(单个 full=3): B 抢占 3 次, 读到 ['m0', 'm0', 'm0']; C/D 读到 [[], []]
=> 同一条消息被 B 读了 3 次, C、D 一次也没读 => 计数器信号量无法保证“每个消费者恰读一次”
~~~`,pitfalls:String.raw`- **只用一个计数信号量 $full=3$**：同一进程可能连续三次 $P(full)$ 成功，把同一条消息读三遍，另外两个消费者永远读不到（脚本已给出反例）。
- **把 $empty$ 交给 A 自己 $V$**：$empty$ 必须由"最后一名消费者"释放，表示三人已读完；否则 A 可能在还有人没读时就覆盖缓冲区。
- **漏掉 $mutex$**：题目明确"任何进程访问缓冲区时均须互斥"，写入、读取、$count$ 的修改都要保护。
- **$count$ 不加保护**：多个消费者并发修改 $count$ 会出现丢失更新，从而误判"是否最后一名读者"。
- **$empty$ 初值写成 0**：首条消息就永远写不进去，A 一开始就阻塞（正确初值为 1）。`}}],Om=[{id:`mock-exam-2-ds-q01`,questionNumber:1,title:`循环累加平方和的时间复杂度`,type:`题目`,date:`2026-10-02`,chapter:`绪论 · 算法的时间复杂度分析`,tags:[`时间复杂度`,`循环次数估计`,`平方和求和`],summary:`给定一个累加平方和、返回首个使累加和超过 n 的 i 的函数，判断其时间复杂度量级。`,source:`2027 年 408 模拟试题（二）第 1 题，扫描版试卷（无文字层）。原卷未印参考答案，本页答案由本地独立推导并用脚本实跑验证，非引用官方答案。`,content:String.raw`设 $n$ 为正整数，且不考虑整数溢出，函数 findMinI 的时间复杂度为（　）。

~~~c
int findMinI(int n) {
    int sum = 0, i = 0;
    while (sum <= n) {
        i++;
        sum += i * i;
    }
    return i;
}
~~~

- **A．** $O(\log n)$
- **B．** $O(n)$
- **C．** $O(\sqrt{n})$
- **D．** $O(\sqrt[3]{n})$`,attachments:[{name:`查看原题截图`,path:`mock-exam-2/q-p02.png`}],solution:{answer:String.raw`**D**（$O(\sqrt[3]{n})$）`,explanation:String.raw`循环每执行一次，$i$ 加 1，$sum$ 累加 $i^2$。设循环共执行 $k$ 次后退出，则

$$
\mathrm{sum}=\sum_{i=1}^{k} i^2=\dfrac{k(k+1)(2k+1)}{6}\approx\dfrac{k^3}{3}.
$$

退出条件是 $\mathrm{sum}>n$，即 $\dfrac{k^3}{3}>n$，故 $k\approx\sqrt[3]{3n}=\Theta(\sqrt[3]{n})$。注意 $i$ 每轮只加 1 这一点不改变结论：循环次数就是 $i$ 的终值，而与 $n$ 成三次方根关系。

脚本验证结果（整理）：

- $n=10^6$：循环 144 次，$i^3=2985984\approx3n$
- $n=10^9$：循环 1442 次，$i^3=2998442888\approx3n$
- $n=10^{12}$：循环 14422 次，$i^3=2999690679448\approx3n$

三组数据都满足 $i^3\approx3n$，故量级为 $\Theta(\sqrt[3]{n})$，选 D。`,pitfalls:String.raw`1. 看到 $while(sum \le n)$ 就判 $O(n)$——漏看 $sum$ 是平方累加，实际只需约 $\sqrt[3]{3n}$ 轮。
2. 把循环变量 $i$ 的增长当成"每轮加到 $n$"，误判为 $O(n)$。
3. 忽略系数 3，误选其他量级：$n=10^6$ 时 $\sqrt{n}=1000$，而实测只需 144 轮，明显不符。`}},{id:`mock-exam-2-ds-q02`,questionNumber:2,title:`中缀表达式转后缀表达式`,type:`题目`,date:`2026-10-02`,chapter:`栈与队列 · 中缀表达式转后缀`,tags:[`中缀转后缀`,`表达式求值`,`运算符优先级`],summary:`给出含加减乘与括号的中缀表达式，在四个候选中选出正确的后缀表达式。`,source:`2027 年 408 模拟试题（二）第 2 题，扫描版试卷（无文字层）。原卷未印参考答案，答案由本地独立转换并代值求值验证，非引用官方答案。`,content:String.raw`中缀表达式 $a+b*c-(d+e)*f$ 的后缀表达式是（　）。

- **A．** abc\*+de+f\*−
- **B．** abc\*de+f\*+−
- **C．** ab+c\*def\*+−
- **D．** abc\*+def\*+−`,attachments:[{name:`查看原题截图`,path:`mock-exam-2/q-p02.png`}],solution:{answer:String.raw`**A**（abc\*+de+f\*−）`,explanation:String.raw`按"先乘后加减、括号优先"逐步转换：

- $b*c\Rightarrow$ bc\*
- $a$ 与 bc\* 相加 $\Rightarrow$ abc\*+
- $d+e\Rightarrow$ de+
- 再与 $f$ 相乘 $\Rightarrow$ de+f\*
- 最后两部分相减 $\Rightarrow$ abc\*+de+f\*−

代值验证（取 $a=2,\ b=3,\ c=5,\ d=7,\ e=11,\ f=13$，中缀真值 $=2+15-18\times13=-217$）：

- A 得 $-217$，与真值一致
- B 得 $-247$，实际算的是 $a-(bc+(d+e)f)$
- C 得 $-125$，实际算的是 $(a+b)c-(d+ef)$
- D 得 $-133$，实际算的是 $a+bc-(d+ef)$

只有 A 求值等于中缀真值。`,pitfalls:String.raw`1. 把 $-(d+e)*f$ 读成 $-(d+e*f)$，得到 D 一类结果。
2. 后缀里 \* 与 − 的先后颠倒：de+f\* 必须在 − 之前完成。
3. 只凭"看起来像"选 B/D，不代值验算。`}},{id:`mock-exam-2-ds-q03`,questionNumber:3,title:`m叉树与度为m的树的概念辨析`,type:`题目`,date:`2026-10-02`,chapter:`树与二叉树 · m叉树与度为m的树`,tags:[`m叉树`,`度为m的树`,`结点度数`],summary:`辨析 m 叉树与度为 m 的树两个定义，从四条叙述中选出正确的一项。`,source:`2027 年 408 模拟试题（二）第 3 题，扫描版试卷（无文字层）。原卷未印参考答案，答案由定义与反例逐项排除得到，非引用官方答案。`,content:String.raw`下列关于 m 叉树与度为 m 的树的叙述中，正确的是（　）。

- **A．** m 叉树中的每个非叶结点都必须恰有 m 个孩子
- **B．** m 叉树中每个结点的孩子数不超过 m
- **C．** 度为 m 的树可以是空树
- **D．** 度为 m 的树中可以存在度大于 m 的结点`,attachments:[{name:`查看原题截图`,path:`mock-exam-2/q-p02.png`}],solution:{answer:String.raw`**B**`,explanation:String.raw`先分清两个定义：

- **m 叉树**：每个结点的度至多为 $m$，即孩子数不超过 $m$。它允许某个非叶结点只有 1 个或 2 个孩子——例如只有根、根有 2 个孩子的 3 叉树仍是合法的 3 叉树。据此 B 正确、A 错误。
- **度为 m 的树**：树中至少有一个结点的度为 $m$，且所有结点的度都不超过 $m$（"树的度"就是树中结点的最大度数）。据此它必须非空，C 错误；也不可能有度大于 $m$ 的结点，D 错误。

逐项反例排除：

- 排除 A：3 叉树中根只有 2 个孩子、孩子都是叶，没有"恰有 $m$ 个孩子的非叶结点"这一约束，A 不成立。
- 排除 C：度为 $m$ 的树要求至少有一个结点的度达到 $m$，这本身就需要树中存在结点，故它必须非空。
- 排除 D：若存在度 $>m$ 的结点，则树的最大度 $>m$，与"度为 $m$"矛盾。
- B 逐字对应 m 叉树定义"每个结点的度不大于 $m$"。`,pitfalls:String.raw`1. 把"m 叉树"当成"每个非叶结点都有 m 个孩子"的满 m 叉树——混淆"至多 m 个"与"恰好 m 个"。
2. 把"度为 m 的树"理解成"度为 m 的结点组成的树"，从而以为可以是空树（C 错）。
3. 忽略"树的度 = 最大结点度"这一定义，误以为度为 m 的树里还能有更大的结点度（D 错）。`}},{id:`mock-exam-2-ds-q04`,questionNumber:4,title:`AVL树插入后的最先失衡结点与旋转类型`,type:`题目`,date:`2026-10-02`,chapter:`查找 · 平衡二叉树 AVL 的插入与旋转`,tags:[`AVL树`,`平衡因子`,`LR旋转`,`失衡检测`],summary:`向空 AVL 树依次插入六个关键字，问插入最后一个后最先失衡的结点及其调整类型。`,source:`2027 年 408 模拟试题（二）第 4 题，扫描版试卷（无文字层）。原卷未印参考答案，答案由从空树逐次插入的脚本模拟得到，非引用官方答案。`,content:String.raw`向一棵空 AVL 树依次插入关键字 30、20、40、10、25、22。插入 22 后，最先失衡的结点及其对应的调整类型分别是（　）。

- **A．** 结点 20，RR 型
- **B．** 结点 20，RL 型
- **C．** 结点 30，LR 型
- **D．** 结点 30，LL 型`,attachments:[{name:`查看原题截图`,path:`mock-exam-2/q-p02.png`}],solution:{answer:String.raw`**C**（结点 30，LR 型）`,explanation:String.raw`插入过程（用 root(左,右) 记法表示树形）：

1. 插 30 → 根 30。
2. 插 20 → 30(20, —)。
3. 插 40 → 30(20, 40)，平衡因子 $0$，平衡。
4. 插 10 → 10 成为 20 的左孩子，20 的 BF $=1$，30 的 BF $=1$，仍平衡。
5. 插 25 → 25 成为 20 的右孩子，20 的 BF $=0$，30 的 BF $=1$，仍平衡。
6. 插 22 → 22 走到 25 的左孩子（30→20→25→22）。自下往上第一个失衡的是 **结点 30**（左子树高 3、右子树高 1，BF $=+2$）。插入位置在 30 的**左孩子 20 的右子树**中，即"先左后右"，故为 **LR 型**，需先对 20 左旋、再对 30 右旋。

脚本从空树逐次插入并逐次打印，插入 22 前后的脚本验证结果（整理）：

~~~
插入 25: root=30 inorder=[10,20,25,30,40]
插入 22: root=25 inorder=[10,20,22,25,30,40]
唯一失衡事件: (插入22, 结点30, left heavy, LR)
~~~

调整后树形为 25(20(10,22), 30(—,40))，恢复平衡且满足中序 10,20,22,25,30,40。`,pitfalls:String.raw`1. 只检查插入点附近的 20、25，忘记继续向上回推检查 30（失衡点可以离插入点很远）。
2. 把类型判反：失衡点是 30，但插入落在其左子树的右子树上，是 LR 而不是 LL。
3. 用插入路径的第一步（30→20 向左）就直接判 LL，忽略后面还会向右拐。`}},{id:`mock-exam-2-ds-q05`,questionNumber:5,title:`稀疏有向图的存储结构选择`,type:`题目`,date:`2026-10-02`,chapter:`图 · 图的存储结构`,tags:[`邻接表`,`邻接矩阵`,`邻接多重表`,`稀疏图`],summary:`对有 n 个顶点、m 条边且稀疏的有向图，按"遍历某顶点所有出边并省空间"的要求选择存储结构。`,source:`2027 年 408 模拟试题（二）第 5 题，扫描版试卷（无文字层）。原卷未印参考答案，答案由定义与空间/时间分析判定，非引用官方答案。`,content:String.raw`对于含 $n$ 个顶点、$m$ 条边且 $m$ 远小于 $n^2$ 的有向图，若主要操作是遍历某顶点的所有出边，并希望节省存储空间，则最适合的存储结构是（　）。

- **A．** 邻接矩阵
- **B．** 邻接表
- **C．** 邻接多重表
- **D．** 顺序表`,attachments:[{name:`查看原题截图`,path:`mock-exam-2/q-p02.png`}],solution:{answer:String.raw`**B**（邻接表）`,explanation:String.raw`需同时满足"省空间"和"遍历某顶点所有出边"两个要求：

- **省空间**：$m\ll n^2$ 时，邻接矩阵固定占 $O(n^2)$，浪费极大；邻接表只存 $n$ 个顶点表结点 + $m$ 条弧结点，占 $O(n+m)$。
- **遍历出边**：邻接表中顶点 $v$ 的出边表恰好就是 $v$ 的全部出边，顺链扫描一次即 $O(\mathrm{outdeg}(v))$；邻接矩阵要遍历一整行，为 $O(n)$。
- **邻接多重表**是为无向图设计的（同一条边只存一个结点、用两对指针挂到两个顶点上），本题是有向图，用它反而要额外区分方向。
- **顺序表**根本没有"出边"的语义。

两个指标上邻接表都最优，故选 B。`,pitfalls:String.raw`1. 见"遍历出边方便"就选邻接矩阵（出边在矩阵中是一行，看似直观，但代价是 $O(n)$ 且不省空间）。
2. 误选邻接多重表：它是无向图的存储结构，对"有向图的出边"并不合适。
3. 忽略题设的 $m\ll n^2$ 条件，认为邻接表只有在稀疏时才有优势——本题正是稀疏图。`}},{id:`mock-exam-2-ds-q06`,questionNumber:6,title:`由邻接矩阵的平方反推图并判定命题`,type:`题目`,date:`2026-10-02`,chapter:`图 · 邻接矩阵与路径计数`,tags:[`邻接矩阵`,`矩阵平方`,`路径计数`,`入度`],summary:`已知简单有向图邻接矩阵 A 的平方 B，从四条命题中选出一定正确的组合。`,source:`2027 年 408 模拟试题（二）第 6 题，扫描版试卷（无文字层）。原卷未印参考答案，答案由穷举全部 2^9 个 0/1 矩阵求解 A 得到，非引用官方答案。`,content:String.raw`设简单有向图 $G$ 的邻接矩阵为 $A[3][3]$，$A[i][j]=0/1$ 表示图中不含有/含有从 $i$ 到 $j$ 的弧边（$i$ 与 $j$ 均从 1 开始编号）。令矩阵 $B=A^2$，即 $B=A*A$。$B$ 如下所示。以下说法一定正确的是（　）。

$$
B = \begin{bmatrix}
1 & 1 & 1 \\
1 & 1 & 0 \\
0 & 1 & 2
\end{bmatrix}
$$

- **Ⅰ．** 图 G 中存在从顶点 1 到顶点 3 的边
- **Ⅱ．** 图 G 中不存在顶点 2 到顶点 3 的边
- **Ⅲ．** 图 G 中从顶点 3 到顶点 2，途经两条边的路径有 1 条
- **Ⅳ．** 图 G 中顶点 3 的入度为 2

- **A．** Ⅰ
- **B．** Ⅰ、Ⅱ
- **C．** Ⅲ
- **D．** Ⅰ、Ⅲ、Ⅳ`,attachments:[{name:`查看原题截图`,path:`mock-exam-2/q-p02.png`}],solution:{answer:String.raw`**D**（Ⅰ、Ⅲ、Ⅳ）`,explanation:String.raw`关键性质：$B=A^2$ 中 $B[i][j]$ 恰是 $i\to j$ 的**长度为 2 的路径条数**。$B[3][2]=1$ 直接证实了 Ⅲ。要定出 A，可枚举全部 $2^9=512$ 个 0/1 矩阵，看哪些满足 $A^2=B$。

脚本验证结果（整理）：

~~~
枚举 512 个 0/1 矩阵：A^2=B 的解个数 = 1（限制无自环的解个数 = 1）
唯一解 A = [[0,1,1],[0,0,1],[1,1,0]]
I : a13=1 -> True
II: a23=1，'不存在' -> False
III: B[3][2]=1 直证
IV: 顶点3入度=列3和=2 -> True
~~~

即边集 $\{1\to2,\ 1\to3,\ 2\to3,\ 3\to1,\ 3\to2\}$。逐条判定：

- Ⅰ：$a_{13}=1$ → 存在边 $1\to3$，真。
- Ⅱ：$a_{23}=1$ → 顶点 2 到 3 有边，"不存在"为假。
- Ⅲ：$B[3][2]=1$，且 A 中 $3\to2$ 的 2 步路径确为 $3\to1\to2$ 一条，真。
- Ⅳ：顶点 3 的入度 = 第 3 列之和 $=a_{13}+a_{23}+a_{33}=1+1+0=2$，真。

三条为真 → D。题目问"一定正确"，应选恰好列出全部真命题的那一项（C 只列了 Ⅲ，不完整）。`,pitfalls:String.raw`1. 把 $A^2$ 当成"A 自己与自己按位乘"，忽略它是矩阵乘法（含"路径计数"语义）。
2. 由 $B[3][3]=2$ 直接推断"顶点 3 的出度为 2 或入度为 2"——$B[3][3]$ 是长度 2 的回路条数，不是度数。
3. 把 Ⅱ 读反：$a_{23}=1$ 是"有边 $2\to3$"，而非"没有边"。
4. 看到 C（Ⅲ）也是真命题就选 C：应按"选出全部真命题"的组合来选。`}},{id:`mock-exam-2-ds-q07`,questionNumber:7,title:`线性探测哈希表查找失败的平均查找长度`,type:`题目`,date:`2026-10-02`,chapter:`查找 · 开放定址法与查找失败的 ASL`,tags:[`哈希表`,`线性探测`,`DELETED`,`查找失败ASL`],summary:`向长度 11 的哈希表依次插入四个关键字并逻辑删除其一，求查找失败的平均查找长度。`,source:`2027 年 408 模拟试题（二）第 7 题，扫描版试卷（无文字层）。原卷未印参考答案，答案由按题述规则模拟脚本得到，非引用官方答案。`,content:String.raw`一个初始为空、长度为 11 的哈希表地址为 0～10，哈希函数为 $H(key)=key \bmod 11$，采用线性探测法处理冲突。依次插入关键字 12、23、34、45 后，逻辑删除关键字 23，即将其所在位置标记为 DELETED。查找过程中遇到 DELETED 时继续向后探测，遇到从未使用过的空位置时停止。若查找失败的关键字，其初始哈希地址在 0～10 上等概率分布，则查找失败的平均查找长度为（　）。

- **A．** 15/11
- **B．** 18/11
- **C．** 21/11
- **D．** 25/11`,attachments:[{name:`查看原题截图`,path:`mock-exam-2/q-p02.png`}],solution:{answer:String.raw`**C**（21/11）`,explanation:String.raw`四个关键字的 $H$ 值都是 $1$（$12,23,34,45 \bmod 11 = 1$），线性探测一路右移，插入后的表为：

- 地址 0：空
- 地址 1：12
- 地址 2：DELETED（原 23）
- 地址 3：34
- 地址 4：45
- 地址 5～10：空

**删除 23 只是打标记（DELETED），探测链不能断**，所以从地址 1 出发的失败查找仍要穿过地址 2 的 DELETED 槽继续向右。按题述口径，每个被探查的槽都算一次比较（DELETED 槽也计一次），比较次数 = 走到第一个真正的空位为止经过的槽数：

- 初始地址 0：地址 0 即空 → 1 次
- 初始地址 1：1(12) → 2(DEL) → 3(34) → 4(45) → 5 空 → 5 次
- 初始地址 2：2(DEL) → 3(34) → 4(45) → 5 空 → 4 次
- 初始地址 3：3(34) → 4(45) → 5 空 → 3 次
- 初始地址 4：4(45) → 5 空 → 2 次
- 初始地址 5～10：本身即空 → 各 1 次，共 6 次

$$
\mathrm{ASL}_{fail}=\dfrac{1+5+4+3+2+1\times6}{11}=\dfrac{21}{11}.
$$

脚本验证结果（整理）：表 [空,12,DEL,34,45,空,空,空,空,空,空]；各起始地址比较次数 [1,5,4,3,2,1,1,1,1,1,1]；和 21。`,pitfalls:String.raw`1. 把 DELETED 当成空位（遇 DELETED 即停止）：从地址 1 出发只需 2 次比较，总和变成 $1+2+1+3+2+6=15$，得 15/11，会错选 A。
2. 用"分母为关键字个数 4"——查找失败的初始地址在 0～10 上等概率，分母是 11。
3. 漏掉"起始地址本身为空时也要算 1 次比较"，导致地址 0、5～10 计成 0 次。`}},{id:`mock-exam-2-ds-q08`,questionNumber:8,title:`哈夫曼树的WPL与指定叶子编码`,type:`题目`,date:`2026-10-02`,chapter:`树与二叉树 · 哈夫曼树与编码`,tags:[`哈夫曼树`,`WPL`,`前缀编码`],summary:`由七个权值构造哈夫曼树，求带权路径长度 WPL 与权值 9 的叶结点编码。`,source:`2027 年 408 模拟试题（二）第 8 题，扫描版试卷（无文字层）。原卷未印参考答案，答案由最小堆模拟合并构造哈夫曼树得到，非引用官方答案。`,content:String.raw`以权值 2、3、7、9、18、25、32 构造哈夫曼树。每次选择权值最小的两棵树合并，并规定权值较小的结点作为左孩子，左分支编码为 0，右分支编码为 1。该哈夫曼树的带权路径长度 WPL 以及权值为 9 的叶结点对应的编码分别为（　）。

- **A．** 221，010
- **B．** 230，010
- **C．** 230，011
- **D．** 239，010`,attachments:[{name:`查看原题截图`,path:`mock-exam-2/q-p03.png`}],solution:{answer:String.raw`**B**（230，010）`,explanation:String.raw`排序后权值为 $2,3,7,9,18,25,32$，每次取最小的两棵树合并（小者为左孩子）：

1. $2+3=5$（左 2、右 3）
2. $5+7=12$（左 5、右 7）
3. $9+12=21$（左 9、右 12）
4. $18+21=39$（左 18、右 21）
5. $25+32=57$（左 25、右 32）
6. $39+57=96$（左 39、右 57）

**WPL = 所有非叶结点权值之和** $=5+12+21+39+57+96=230$。

**权值 9 的编码**：从根 96 出发，$96\to39$ 走左（0），$39\to21$ 走右（1），$21\to9$ 走左（0）→ **010**。

脚本验证结果（整理）：合并序列 [(2,3,5),(5,7,12),(9,12,21),(18,21,39),(25,32,57),(39,57,96)]；WPL = 230；编码 {2:01100, 3:01101, 7:0111, 9:010, 18:00, 25:10, 32:11}。另按叶子权值 × 编码长度校验：$2\cdot5+3\cdot5+7\cdot4+9\cdot3+18\cdot2+25\cdot2+32\cdot2=230$，两法一致。`,pitfalls:String.raw`1. WPL 误按"叶子权值 × 深度"逐项手数时数错深度，导致 221/239 之类。
2. 编码方向搞反（忽略"权值较小的结点作为左孩子"，把 9 的父结点 21 当成右孩子一环，得 011）。
3. 合并顺序选错（例如先把 7 与 9 合并），树形与 WPL 都会变——本题无相等权值，最小两棵是唯一的。`}},{id:`mock-exam-2-ds-q09`,questionNumber:9,title:`双向交替扫描快排的不稳定性判定`,type:`题目`,date:`2026-10-02`,chapter:`排序 · 快速排序的稳定性`,tags:[`快速排序`,`稳定性`,`划分算法`],summary:`按给定的枢轴与双向交替扫描划分规则，找出能说明该快排不稳定的输入序列。`,source:`2027 年 408 模拟试题（二）第 9 题，扫描版试卷（无文字层）。原卷未印参考答案，答案由严格按题干实现的模拟脚本得到，非引用官方答案。`,content:String.raw`对记录序列按关键字递增进行快速排序。每趟划分以当前子表的第一个记录为枢轴，并采用双向交替扫描法：右指针先向左寻找第一个关键字小于枢轴的记录，将其移至左端空位；左指针再向右寻找第一个关键字大于枢轴的记录，将其移至右端空位；重复上述过程，直至两个指针相遇，最后将枢轴放入相遇位置。下标 a、b 仅用于区分关键字相等的不同记录，不参与关键字比较。下列哪组输入能够说明上述快速排序是不稳定的（　）。

- **A．** (1,2,3,4,5)
- **B．** (1a,1b,3,2,4)
- **C．** (2a,2b,3,1,4)
- **D．** (2,4,3a,3b,1)`,attachments:[{name:`查看原题截图`,path:`mock-exam-2/q-p03.png`}],solution:{answer:String.raw`**C**`,explanation:String.raw`按题述算法逐组模拟（枢轴取子表首元素；右指针找 $<$ 枢轴的元素填左空位，左指针找 $>$ 枢轴的元素填右空位，**相等不移动**；指针相遇后放枢轴）：

- **A** (1,2,3,4,5)：全不相同，无所谓稳定性。
- **B** (1a,1b,3,2,4)：枢轴 1a，右指针找不到小于 1a 的元素，直接走到左端与 low 相遇，枢轴原位；1b 与枢轴相等被跳过。输出 (1a,1b,2,3,4)，1a 仍在 1b 前，稳定。
- **C** (2a,2b,3,1,4)：枢轴 2a。右指针从右向左找到 1（$<2a$），移到下标 0；左指针从下标 1 向右，2b 与 2a 相等被跳过，遇到 3（$>2a$）移到下标 3；两指针相遇，放入枢轴 2a。输出 **(1,2b,2a,3,4)**——2b 跑到 2a 前面，相等记录相对次序被颠倒，**不稳定**。
- **D** (2,4,3a,3b,1)：枢轴 2。右指针找到 1 移到左端，左指针找到 4 移到右端，相遇后放枢轴，输出 (1,2,3a,3b,4)，3a 仍在 3b 前，稳定。

脚本验证结果（整理，按题干实现划分并做稳定性检查）：

~~~
A -> [1,2,3,4,5]  stable=True
B -> [1a,1b,2,3,4]  stable=True
C -> [1,2b,2a,3,4]  stable=False
D -> [1,2,3a,3b,4]  stable=True
不稳定选项 = ['C']
~~~

只有 C 破坏了相等记录的相对次序。`,pitfalls:String.raw`1. 误以为"枢轴是一对相等元素中的一个"就必然不稳定——B 里 1a 作枢轴却仍稳定，要看相等元素是否被跨过。
2. 忘记"相等元素不移动"（比较条件带 $>$ / $<$），把 2b 也算一次搬移。
3. 把 D 中 3a、3b 当成会被移动的元素——它们位于枢轴右侧且都大于枢轴，第一趟不会被搬动。`}},{id:`mock-exam-2-ds-q10`,questionNumber:10,title:`折半查找比较次数的最大与最小值`,type:`题目`,date:`2026-10-02`,chapter:`查找 · 折半查找的比较次数`,tags:[`折半查找`,`判定树`,`比较次数`],summary:`长度为 1 000 000 的升序表用下取整 mid 折半查找，求成功查找比较次数的最大值与最小值。`,source:`2027 年 408 模拟试题（二）第 10 题，扫描版试卷（无文字层）。原卷未印参考答案，答案由对全部 10^6 个下标逐个折半查找统计得到，非引用官方答案。`,content:String.raw`一个长度为 1 000 000 的升序顺序表采用折半查找，表中各关键字互不相同，下标从 0 开始，并取 $mid=\lfloor(low+high)/2\rfloor$。假定待查关键字一定存在于表中，且每访问一个表中元素并将其与待查关键字比较时，计为一次关键字比较。成功查找一个关键字所需比较次数的最大值和最小值分别为（　）。

- **A．** 19，1
- **B．** 20，1
- **C．** 20，2
- **D．** 21，1`,attachments:[{name:`查看原题截图`,path:`mock-exam-2/q-p03.png`}],solution:{answer:String.raw`**B**（20，1）`,explanation:String.raw`折半查找的比较次数就是该记录在**判定树**中的层数（根为第 1 层）。

- **最小值**：待查关键字正好落在第一次访问的 $mid=\lfloor(0+999999)/2\rfloor=499999$ 处，只需 1 次比较 → 1。
- **最大值**：判定树前 19 层最多容纳 $2^{19}-1=524287$ 个记录，装不下 $10^6$；前 20 层可容 $2^{20}-1=1048575\ge10^6$。故最大层数为 $\lceil\log_2(10^6+1)\rceil=20$ → 20。

脚本对全部 $10^6$ 个下标逐一执行折半查找并统计，脚本验证结果（整理）：

~~~
最少比较次数 = 1   最多比较次数 = 20
深度分布: (1,1),(2,2),(3,4) ... (19,262144),(20,475713)
ceil(log2(1000001)) = 20
第20层结点数 = 475713 = n - (2^19-1)
~~~

深度 $<20$ 的结点共 $2^{19}-1=524287$ 个，落在第 20 层的恰有 $1000000-524287=475713$ 个，与分布吻合。`,pitfalls:String.raw`1. 把最大值算成 $\lfloor\log_2 n\rfloor=19$：$2^{19}=524288<10^6$，19 层装不下，必须是 20。
2. 认为最小值是 0 或 2：第一次访问就是一次比较；$mid$ 恰好命中时答案为 1 次。
3. 用 1 开始的下标或 $mid=\lceil(low+high)/2\rceil$ 去算——本题明确下取整、下标从 0 开始，虽不改变本例最大/最小值，但会影响具体关键字的比较次数。`}},{id:`mock-exam-2-ds-q11`,questionNumber:11,title:`k路平衡归并的趟数与缓冲区数量`,type:`题目`,date:`2026-10-02`,chapter:`排序 · 外部排序的 k 路平衡归并`,tags:[`外部排序`,`k路平衡归并`,`归并趟数`,`缓冲区`],summary:`对 100 个初始归并段做 k 路平衡归并要求趟数不超过 3，求所需最少缓冲区总数。`,source:`2027 年 408 模拟试题（二）第 11 题，扫描版试卷（无文字层）。原卷未印参考答案，答案由按 k 逐值模拟归并趟数得到，非引用官方答案。`,content:String.raw`外部排序有 100 个初始归并段，采用 $k$ 路平衡归并，要求归并趟数不超过 3。每一路需要 1 个输入缓冲区，另需 1 个输出缓冲区，则至少需要（　）个缓冲区。

- **A．** 4
- **B．** 5
- **C．** 6
- **D．** 7`,attachments:[{name:`查看原题截图`,path:`mock-exam-2/q-p03.png`}],solution:{answer:String.raw`**C**（6）`,explanation:String.raw`两步：

1. **定 k**：$k$ 路平衡归并的趟数 $S=\lceil\log_k 100\rceil\le3$。
   - $k=4$：$\log_4 100\approx3.32\Rightarrow S=4>3$，不行；
   - $k=5$：$\log_5 100\approx2.86\Rightarrow S=3\le3$，可行。
   最小的 $k$ 为 5。
2. **算缓冲区**：每一路各需 1 个输入缓冲区（共 $k=5$ 个），另加 1 个输出缓冲区 → $5+1=6$。

脚本对 $k=2\ldots8$ 逐个模拟"把当前归并段数除以 $k$ 向上取整"直到只剩 1 段，脚本验证结果（整理）：

~~~
k=2: 趟数=7  缓冲区=3  too many passes
k=3: 趟数=5  缓冲区=4  too many passes
k=4: 趟数=4  缓冲区=5  too many passes
k=5: 趟数=3  缓冲区=6  OK
k=6: 趟数=3  缓冲区=7  OK
最小 k=5，缓冲区 6 => C
~~~

$k=4$ 需 4 趟（超限），$k=5$ 恰为 3 趟，取最小 $k=5$，缓冲区 $=k+1=6$。`,pitfalls:String.raw`1. 只算 $k$ 个输入缓冲区（5 个）而漏掉输出缓冲区，错选 B。
2. 把 $k$ 判成 4（4 路归并 100 段需 $\lceil\log_4 100\rceil=4$ 趟，已超 3 趟）。
3. 缓冲区总数误按记忆公式（如 $2k$ 或 $2k+1$）计算。`}},{id:`mock-exam-2-co-q12`,questionNumber:12,title:`机器字长的概念辨析`,type:`题目`,date:`2026-10-02`,chapter:`计算机系统概述 · 机器字长与存储字长`,tags:[`机器字长`,`存储字长`,`存储单元`,`数据总线宽度`],summary:`判断关于机器字长的四条叙述中哪一条错误，涉及通用寄存器、数据总线、主存单元与 ALU 的位数。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 3 页（卷面第 2 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`下列关于机器字长的叙述中，错误的是（　）。

- A．通用寄存器的位数通常等于机器字长
- B．CPU 外部数据总线的宽度可能小于机器字长
- C．主存单元长度通常等于机器字长
- D．ALU 的位数通常等于机器字长`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-2/co-os-page-2.png`}],solution:{answer:String.raw`**选 C（按“主存单元”指可编址单元的口径）。**`,explanation:String.raw`机器字长指 CPU 一次能直接处理的二进制位数，通常由通用寄存器位数和 ALU 位数决定；它描述的是"运算部件一次处理多少位"，不是"主存一个单元有多大"。

- **A 正确**：通用寄存器存放的是 CPU 一次处理的机器字，其位数通常就等于机器字长（如 8086 的 AX/BX 等均为 16 位，机器字长也是 16 位）。
- **B 正确**：CPU 外部数据总线宽度与机器字长可以不同。典型例子是 8088：内部一次处理 16 位（机器字长 16 位，故称"准 16 位机"），而外部数据总线只有 8 位。"可能小于"这一说法成立。
- **C 是本题的错项（按可编址单元理解）**：编址单元的宽度由存储器编址方式决定，并不由 CPU 的机器字长决定。例如按字节编址的 32 位、64 位机器，一个可编址单元为 8 位，不能把两者视为“通常相等”。但**可编址单元宽度不等于一次读写的存储字长**；不能进一步断言所有按字节编址机器的存储字长都只能为 8 位。
- **D 正确**：ALU 是执行运算的部件，其位数必须与一次处理的位数一致，故通常等于机器字长。

机器字长、指令字长、存储字长与编址单位必须区分：机器字长描述整数运算数据通路的宽度；指令字长描述一条指令的编码长度；存储字长描述一次存取的存储字宽度；编址单位决定一个地址对应几位。它们不必相等，指令字长也不必是机器字长的整数倍。

**题面口径提示：** 原题未定义“主存单元”，若它指一次读写的存储字，而不是可编址单元，仅凭“通常”等措辞不足以严格判错。本解析明确采用可编址单元口径选 C，不将术语歧义隐藏为官方结论。B 的“可能小于”有明确的硬件实例：Intel 原始 [8088 数据手册，第 1 页](https://www.ceibo.com/eng/datasheets/Intel-8088-Data-Sheet.pdf) 同时写明“8-Bit Data Bus Interface”“16-Bit Internal Architecture”，并列出 16 位寄存器组，因此不能把 B 判为错误。`,pitfalls:String.raw`1. 把编址单位、存储字长与机器字长混为一谈。按字节编址仅说明一个地址对应 8 位，不说明存储器一次只能传送 8 位。
2. 误认为数据总线宽度必须等于机器字长，从而错选 B。8088 是机器字长 16 位、外部数据总线 8 位的标准反例。
3. 混淆"CPU 内部数据总线"与"CPU 外部数据总线"：前者通常等于机器字长，后者可以更窄（分时传送）。`}},{id:`mock-exam-2-co-q13`,questionNumber:13,title:`16 位补码减法结果的字节存放`,type:`题目`,date:`2026-10-02`,chapter:`数据的表示和运算 · 补码运算与数据在存储器中的存放`,tags:[`补码`,`小端方式`,`字节编址`,`带符号整数减法`],summary:`按字节编址的 16 位机、小端存放，求 X−Y 的 16 位补码在低地址单元 A 中存放的字节内容。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 3 页（卷面第 2 页）；原卷未印参考答案，答案由本站独立推导并用脚本复算，非引用官方答案。`,content:String.raw`某 16 位计算机中，存储器按字节编址，整数用补码表示，数据采用小端存储方式存放。若 $X=-49$，$Y=67$，$Z=X-Y$，$Z$ 存放在地址 $A$ 和 $A+1$ 的存储单元中，则存储单元 $A$ 的内容是（　）。

- A．00H
- B．74H
- C．8CH
- D．FFH`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-2/co-os-page-2.png`}],solution:{answer:String.raw`**选 C（8CH）。**`,explanation:String.raw`## 1. 先算真值

$$
Z=X-Y=-49-67=-116.
$$

## 2. 求 16 位补码

负数补码 = 模 $2^{16}=65536$ 下的无符号值：

$$
[-116]_{\text{补}}=65536-116=65420=\text{FF8CH}.
$$

写成二进制为 $1111\ 1111\ 1000\ 1100$：高字节 FFH，低字节 8CH。

## 3. 按小端方式存放

小端方式把**低字节放在低地址**：

- 地址 $A$ ← 低字节 **8CH**
- 地址 $A+1$ ← 高字节 **FFH**

所以存储单元 $A$ 的内容是 8CH，选 C。

## 4. 脚本独立复核（.cache/lion-2/verify_juan2.py 实际输出）

~~~
X=-49 Y=67 Z=X-Y=-116
Z 的16位补码: 0xFF8C (十进制无符号 65420)
小端存放: [A]=0x8C  [A+1]=0xFF
=> 存储单元A的内容 = 8CH => C
~~~

## 5. 干扰项来源

- A（00H）：把结果当作无溢出/未借位的高字节。
- B（74H）：74H 是 116 的无符号值，漏掉了"负数取补"这一步。
- D（FFH）：只算对了高字节，把高位字节当成 $A$ 的内容（若按大端存放，$A$ 才等于 FFH）。`,pitfalls:String.raw`1. 忘了先把负数转成补码就直接取 $-116$ 的低字节，错选 B（74H = 116）。
2. 把小端写成"高字节在低地址"（大端），错选 D。
3. 只做 8 位运算：$X$、$Y$ 是 16 位带符号整数，答案必须以 16 位补码为中间结果，再按字节拆分。`}},{id:`mock-exam-2-co-q14`,questionNumber:14,title:`无符号数大小比较的进位/零标志条件`,type:`题目`,date:`2026-10-02`,chapter:`数据的表示和运算 · 无符号数减法与标志位`,tags:[`无符号数`,`CF`,`ZF`,`借位`,`大小比较`],summary:`无符号减法 uA−uB 后，用 CF 与 ZF 的逻辑或表达式表示判定 uA>uB 的条件。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 3 页（卷面第 2 页）；原卷未印参考答案，答案由本站独立推导并穷举复核，非引用官方答案。`,content:String.raw`某 CPU 执行无符号整数减法 uA-uB，并约定发生借位时 $CF=1$，结果为 0 时 $ZF=1$。符号"$\vee$"表示逻辑或，判定 $\text{uA}>\text{uB}$ 的条件为（　）。

- A．$OF\vee ZF=0$
- B．$CF\vee ZF=0$
- C．$OF\vee ZF=1$
- D．$CF\vee ZF=1$`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-2/co-os-page-2.png`}],solution:{answer:String.raw`**选 B（$CF\vee ZF=0$）。**`,explanation:String.raw`## 1. 无符号数比较只看 CF 与 ZF

无符号减法 uA-uB 的判定规则是：

~~~text
uA > uB  <=>  没有借位(CF=0)  且  结果不为 0(ZF=0)
~~~

- 若 uA < uB，必产生借位，$CF=1$；
- 若 uA = uB，差为 0，$ZF=1$；
- 只有 uA > uB 时，差既非 0 也不借位，$CF=ZF=0$。

因此条件是 $CF=0$ 且 $ZF=0$，即 $CF\vee ZF=0$。

## 2. 为什么与 OF 无关

$OF$ 反映的是**带符号**运算是否溢出，它是带符号数比较（配合 SF）的依据。无符号数比大小时不涉及符号位含义，故 A、C 用 $OF$ 的表达一律排除。

## 3. 脚本穷举复核（.cache/lion-2/verify_juan2.py 实际输出，节选）

~~~
uA=  5 uB=  3 -> 差=  2 CF=0 ZF=0  CF|ZF=0  判定:uA>uB  实际:uA>uB
uA=  3 uB=  5 -> 差=254 CF=1 ZF=0  CF|ZF=1  判定:not(uA>uB)  实际:not(uA>uB)
uA=  7 uB=  7 -> 差=  0 CF=0 ZF=1  CF|ZF=1  判定:not(uA>uB)  实际:not(uA>uB)
uA=200 uB=100 -> 差=100 CF=0 ZF=0  CF|ZF=0  判定:uA>uB  实际:uA>uB
uA=  0 uB=  1 -> 差=255 CF=1 ZF=0  CF|ZF=1  判定:not(uA>uB)  实际:not(uA>uB)
穷举 256x256 组: 不满足 (CF|ZF==0) <=> uA>uB 的组数 = 0
=> 判定 uA>uB 的条件是 CF=0 且 ZF=0, 即 CF|ZF=0 => B
~~`,pitfalls:String.raw`1. 把无符号比较与带符号比较混用，用 $OF$ 或 $SF$ 去判定，错选 A、C。
2. 只写"$CF=0$"而漏掉 $ZF=0$，把 uA=uB 也判成 uA>uB。
3. 记反借位的含义：减法产生借位时 $CF=1$（加法进位时 $CF=1$），无符号小减大必有借位。`}},{id:`mock-exam-2-co-q15`,questionNumber:15,title:`DRAM 三种刷新方式的辨析`,type:`题目`,date:`2026-10-02`,chapter:`存储系统 · DRAM 的刷新`,tags:[`DRAM刷新`,`集中刷新`,`分散刷新`,`异步刷新`,`死区`],summary:`判断关于 DRAM 集中刷新、分散刷新、异步刷新的叙述中哪一条正确。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 3 页（卷面第 2 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`下列有关 DRAM 刷新方式的叙述，正确的是（　）。

- A．集中刷新将各行的刷新操作集中在一段时间内连续完成，在此期间不能进行正常的读写操作
- B．分散刷新在每个存取周期中安排刷新操作，因此不会延长存取周期
- C．异步刷新要求每完成一次正常的读写操作，就立即刷新一行
- D．DRAM 只需刷新近期被访问过的行，无须刷新其余各行`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-2/co-os-page-2.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`## 1. 三种刷新方式对照

- **集中刷新**：在一个刷新周期（常见 2ms）内划出一段固定时间，把全部行一次刷完。这段时间 CPU 不能访存，称为**死区（死时间）**。→ A 正确。
- **分散刷新**：把每次刷新分散到每个存取周期中，每个（读/写）存取周期后面紧跟一个刷新周期，即存取周期被延长为原来的约 2 倍（如 0.5$\mu$s 变 1$\mu$s）。→ B 错误：它**恰恰延长了存取周期**，只是没有集中的死区。
- **异步刷新**：把 2ms 平均分给各行（如 128 行则每约 15.6$\mu$s 刷新一行），在那一行的刷新时刻才占用一个存取周期。它有死区，只是每次很短、被分散开。→ C 错误："每完成一次正常的读写操作就立即刷新一行"是把刷新与每次读写绑定，那是**分散刷新**的过度描述，异步刷新按时间间隔定时刷新某一行。
- **DRAM 必须周期性刷新**（典型 2ms 把全部行刷一遍，靠电容保持信息），与"是否断电"、与"该行最近是否被访问过"都无关：每一个存储单元的电容器都会漏电，**所有行都必须刷新**。→ D 错误。

## 2. 结论

A 是唯一正确叙述：集中刷新期间出现一段无法访存的"死区"。

## 3. 三条对比口径（板书用）

~~~text
集中刷新: 有死区, 存取周期不变, 刷新时间集中
分散刷新: 无死区, 存取周期加倍, 刷新过度(每行刷新次数远超需要)
异步刷新: 死区被拆小并分散, 存取周期基本不变, 按 2ms/行数 定时刷一行
~~~`,pitfalls:String.raw`1. 认为分散刷新"没有代价"，漏掉"存取周期被延长"这一关键代价，错选 B。
2. 把"异步刷新"理解成"每次读写后都刷新那一行"。异步刷新是按**时间间隔均匀分配**（2ms 除以行数），只有当定时到达时才插一个刷新周期。
3. 把 DRAM 刷新与"掉电保存"混为一谈（DRAM 是易失存储器，掉电数据丢失，刷新解决的是电容漏电问题）。`}},{id:`mock-exam-2-co-q16`,questionNumber:16,title:`4 路组相联 Cache 的组号计算`,type:`题目`,date:`2026-10-02`,chapter:`存储系统 · Cache 的组相联映射`,tags:[`Cache`,`组相联映射`,`组号`,`块号`],summary:`32 块 4 路组相联、块大小 64B 的 Cache，求主存 520 号单元所在主存块应装入的组号。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 3 页（卷面第 2 页，本题题干在第 2 页末、选项在第 3 页首）；原卷未印参考答案，答案由本站独立推导并用脚本复算，非引用官方答案。`,content:String.raw`某计算机的 Cache 共有 32 块，采用 4 路组相联映射。每个主存块大小为 64 字节，按字节编址。主存 520 号单元所在主存块应装入的 Cache 组号是（　）。

- A．0
- B．2
- C．4
- D．6`,attachments:[{name:`查看原卷试题页（第 2 页）`,path:`mock-exam-2/co-os-page-2.png`},{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-2/co-os-page-3.png`}],solution:{answer:String.raw`**选 A（组号 0）。**`,explanation:String.raw`## 1. 先求组数

$$
\text{组数}=\frac{\text{Cache 总块数}}{\text{路数}}=\frac{32}{4}=8 \text{ 组}.
$$

8 组恰好用 3 位表示组号。

## 2. 主存地址划分

主存块大小 64B，故块内地址 6 位；地址低位与"块内偏移"无关的只有块号。

$$
520 = 8\times 64+8 \Rightarrow \text{主存块号}=8,\ \text{块内偏移}=8.
$$

## 3. 组相联映射的落组规则

组相联映射把主存按**组**分区，块号对组数取模：

$$
\text{组号}=\text{主存块号}\bmod \text{组数}=8\bmod 8=0.
$$

所以该主存块应装入 **0 组**，选 A。

## 4. 脚本独立复核（.cache/lion-2/verify_juan2.py 实际输出）

~~~
组数 = 32/4 = 8 ；块内偏移位数 = log2(64) = 6
520 = 8*64 + 8 -> 主存块号 = 8, 块内偏移 = 8
组号 = 8 mod 8 = 0
=> A.0
~~~

## 5. 干扰项来源

- B（2）、C（4）、D（6）：把组数误当成 32 或 16（即忘了除以路数），或把 520 直接对组数取模（$520\bmod 8=0$ 恰好相同，但对组数取 32 会得到 $520\bmod 32=8$、取 16 得 $520\bmod 16=8$）。无论按块号还是按地址取模，本题的正确答案都是 0；关键是**组数 = 总块数 / 路数 = 8**。`,pitfalls:String.raw`1. 用"总块数 32"当组数去做取模，或干脆用"路数 4"当组数。
2. 把块内偏移也算进"块号"，直接用 520 除以 4 或 8。
3. 记反公式：组相联的组号 = **块号 mod 组数**，不是"地址 mod Cache 容量"。`}},{id:`mock-exam-2-co-q17`,questionNumber:17,title:`TLB 与慢表（页表）的行为辨析`,type:`题目`,date:`2026-10-02`,chapter:`存储系统 · 虚拟存储器与 TLB`,tags:[`TLB`,`快表`,`页表`,`缺页`,`地址转换`],summary:`判断关于 TLB 容量、位置、命中后的查表流程以及 TLB 未命中含义的四条描述中哪两条错误。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 4 页（卷面第 3 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`以下关于虚拟存储器相关部件的描述，错误的是（　）。

Ⅰ．TLB 是一个容量较大的 Cache

Ⅱ．TLB 通常离 CPU 更近，访问速度比主存中的页表快

Ⅲ．在包含快表和慢表的页式虚拟存储系统中，若快表命中，则从快表中获得虚拟页号对应的物理页号 PPN，同时继续查慢表

Ⅳ．TLB 未命中并不意味着发生缺页

- A．Ⅰ、Ⅲ
- B．Ⅰ、Ⅳ
- C．Ⅱ、Ⅲ
- D．Ⅱ、Ⅳ`,attachments:[{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-2/co-os-page-3.png`}],solution:{answer:String.raw`**选 A（Ⅰ、Ⅲ 错误）。**`,explanation:String.raw`逐条判断：

- **Ⅰ 错误**：TLB（快表）是页表项的 Cache，通常只有**几十项**，容量很小；"容量较大的 Cache"说的是数据/指令 Cache。TLB 之所以快，是因为小、用相联比较实现，而不是因为大。
- **Ⅱ 正确**：TLB 集成在 CPU 内部（MMU 中），页表存放在主存里，所以 TLB 访问速度远高于查内存页表。
- **Ⅲ 错误**：快表命中时已经拿到了物理页号 PPN，**不再查慢表**。必须先查快表、快表未命中才查主存中的页表（慢表），命中后把页表项回填快表。
- **Ⅳ 正确**：TLB 未命中只说明该页表项不在快表中，可能在慢表里，也可能**不在内存（缺页）**；两种情形要通过查慢表的页表项有效位才能区分。

因此错误的是 Ⅰ、Ⅲ，选 A。

## 对照记忆（一次访存的分支）

~~~text
TLB 命中        -> 直接得到 PPN, 再访问 Cache/主存
TLB 未命中      -> 查内存页表(慢表)
   页表项有效   -> 页在内存, 取 PPN 并回填 TLB   (不算缺页)
   页表项无效   -> 缺页, 触发缺页异常调页
~~~

关键区分：**TLB 未命中 ≠ 缺页**；**页表项有效位为 0 才是缺页**。`,pitfalls:String.raw`1. 把 TLB 当"大容量 Cache"（Ⅰ 判成正确）。TLB 是"小容量、全相联/组相联、按内容查找"的页表项缓存。
2. 认为"快表命中后还要查慢表核对"（Ⅲ 判成正确）。命中即结束查表，回填发生在**未命中且慢表命中**时。
3. 把"TLB 未命中"与"缺页"划等号（Ⅳ 判成错误）。`}},{id:`mock-exam-2-co-q18`,questionNumber:18,title:`先变址后间接与先间接后变址的取数结果`,type:`题目`,date:`2026-10-02`,chapter:`指令系统 · 寻址方式（变址与间接的组合）`,tags:[`寻址方式`,`变址寻址`,`间接寻址`,`有效地址`],summary:`给定主存单元内容表与变址寄存器值，分别求先变址后间接、先间接后变址两条指令取出的操作数。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 4 页（卷面第 3 页）；原卷未印参考答案，答案由本站按地址链逐级推导并用脚本复算，非引用官方答案。`,content:String.raw`某计算机按字节编址，地址和数据字长均为 16 位，每个数据字占 2B。用 $M[x]$ 表示从地址 $x$ 开始存放的一个 16 位字。设变址寄存器 IX 的内容为 0004H，两条指令的形式地址 $A$ 均为 1000H。相关存储单元的内容如下：

- $M[1000\text{H}]=2000\text{H}$
- $M[1004\text{H}]=3000\text{H}$
- $M[2004\text{H}]=0040\text{H}$
- $M[3000\text{H}]=0080\text{H}$

指令Ⅰ采用"先变址、后间接"寻址：先将形式地址 $A$ 与 IX 的内容相加，再读取该地址处存放的字作为操作数的有效地址。两条指令的操作数均为存储器中的一个 16 位字，地址加法均以字节为单位，且执行指令Ⅰ不改变 IX 和主存内容。指令Ⅱ采用"先间接、后变址"寻址：先读取形式地址 $A$ 处存放的字，再将该字与 IX 的内容相加，得到操作数的有效地址。指令Ⅰ、Ⅱ取得的操作数分别是（　）。

- A．3000H，2004H
- B．0080H，0040H
- C．0040H，0080H
- D．3000H，0040H`,attachments:[{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-2/co-os-page-3.png`}],solution:{answer:String.raw`**选 B（0080H，0040H）。**`,explanation:String.raw`## 1. 先立规矩：两种组合的顺序

- **先变址、后间接**：先把形式地址与变址寄存器相加，得到有效地址 EA；再把 EA 单元的内容**当作地址**去访问，取出操作数。
- **先间接、后变址**：先把形式地址单元的内容**当作地址**读出，再与变址寄存器相加得到 EA，最后按 EA 取操作数。

## 2. 指令Ⅰ（先变址、后间接）

$$
EA=(A)+IX=1000\text{H}+0004\text{H}=1004\text{H},
$$

$$
M[1004\text{H}]=3000\text{H}\ \text{（这是间接地址）},
$$

$$
\text{操作数}=M[3000\text{H}]=0080\text{H}.
$$

## 3. 指令Ⅱ（先间接、后变址）

$$
M[A]=M[1000\text{H}]=2000\text{H},
$$
$$
EA=M[A]+IX=2000\text{H}+0004\text{H}=2004\text{H},
$$
$$
\text{操作数}=M[2004\text{H}]=0040\text{H}.
$$

所以依次为 0080H、0040H，选 B。

## 4. 脚本独立复核（.cache/lion-2/verify_juan2.py 实际输出）

~~~
指令Ⅰ 先变址后间接: EA=(A)+IX=1004H -> M[1004H]=3000H (间接地址) -> 操作数=M[3000H]=0080H
指令Ⅱ 先间接后变址: M[A]=M[1000H]=2000H -> EA=M[A]+IX=2004H -> 操作数=M[2004H]=0040H
=> 操作数依次为 0080H, 0040H => B
~~~

## 5. 干扰项来源

- A（3000H，2004H）：把"间接地址"和"有效地址"当成了操作数本身——这是最常见的错法，务必区分 **EA**、**M[EA]** 与"间接地址单元内容"。
- C（0040H，0080H）：把两条指令的先后顺序记反了。
- D（3000H，0040H）：第一条只算到"间接地址"为止。`,pitfalls:String.raw`1. 混淆"有效地址 EA"与"操作数 M[EA]"：先变址后间接时，$M[(A)+IX]$ 是**间接地址**，还要再访存一次才拿到操作数。
2. 把两种组合的顺序记反（"先 A 后 B"就是先执行 A 这一步）。
3. 把变址寄存器值加到"间接得到的地址"上时顺序错位（Ⅱ 中必须是先取 $M[A]$ 再加 $IX$，而不是先加 $IX$ 再取 $M[A+IX]$）。`}},{id:`mock-exam-2-co-q19`,questionNumber:19,title:`带分支预测失败的流水线吞吐率`,type:`题目`,date:`2026-10-02`,chapter:`中央处理器 · 流水线的性能指标`,tags:[`流水线`,`吞吐率`,`时钟周期`,`分支预测失败`],summary:`5 级流水线各段时间不同，执行 1000 条指令、20% 分支且预测准确率 80%，按期望错误次数求平均吞吐率。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 4 页（卷面第 3 页）；原卷未印参考答案，答案由本站独立推导并用脚本复算，非引用官方答案。`,content:String.raw`某 5 级流水线各段时间分别为 20ns、25ns、30ns、20ns 和 15ns。连续执行 1000 条指令，分支指令比例为 20%，预测准确率为 80%；每次预测错误额外损失 4 个时钟周期。忽略其他冒险，并按期望的预测错误次数计算，则该流水线的平均吞吐率约为（　）。

- A．$2.5\times10^{7}$ 条/秒
- B．$2.86\times10^{7}$ 条/秒
- C．$3.0\times10^{7}$ 条/秒
- D．$3.2\times10^{7}$ 条/秒`,attachments:[{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-2/co-os-page-3.png`}],solution:{answer:String.raw`**选 B（$2.86\times10^{7}$ 条/秒）。**`,explanation:String.raw`## 1. 时钟周期由最慢段决定

流水线的时钟周期必须容纳最慢的一段，否则流水线无法同步：

$$
T_{\text{clk}}=\max\{20,25,30,20,15\}=30\text{ns}.
$$

## 2. 统计分支预测失败的条数

$$
\text{转移指令}=1000\times20\%=200 \text{ 条},
$$
$$
\text{预测错误}=200\times(1-80\%)=40 \text{ 条}.
$$

每条预测错误额外损失 4 个时钟周期，共损失

$$
40\times4=160 \text{ 个时钟周期}.
$$

## 3. 总周期数

第一条指令用 5 个周期填满流水线，此后每条指令理想情况 1 个周期：

$$
\text{总周期}=1000+(5-1)+160=1164.
$$

## 4. 吞吐率

$$
T=1164\times30\text{ns}=34920\text{ns}=34.92\,\mu\text{s},
$$
$$
TP=\frac{1000}{34.92\,\mu\text{s}}\approx2.86\times10^{7}\ \text{条/秒}.
$$

选 B。

## 5. 脚本独立复核（.cache/lion-2/verify_juan2.py 实际输出）

~~~
时钟周期 = max(段长) = 30 ns
分支指令 = 200, 预测错误 = 40 条, 每条多损失 4 周期
总周期 = 1000 + 4(装满) + 40*4 = 1164
总时间 = 1164 * 30ns = 34920 ns = 34.92 us
吞吐率 = 1000 / 34.92us = 2.8637e+07 条/秒
=> B. 2.86x10^7
~~~

## 6. 干扰项来源

- A（$2.5\times10^7$）：直接按 $1/40\text{ns}$ 或漏掉填满与损失周期估算。
- C（$3.0\times10^7$）：把 1000 条当成 1000 个周期后直接取 $1/30\text{ns}$，忽略填满和预测失败的开销。
- D（$3.2\times10^7$）：把时钟周期取成 25ns（或把 5 段取平均）后的结果。`,pitfalls:String.raw`1. 用"各段平均时间"当周期。流水线时钟周期一律取**最慢段**。
2. 漏掉流水线"装入（填满）"的 $k-1=4$ 个周期。
3. 只算分支指令的条数（200）就乘 4，忘记还要乘预测错误率（20%），把损失算成 800 个周期。
4. 把"预测准确率 80%"理解成"预测错误率 80%"。`}},{id:`mock-exam-2-co-q20`,questionNumber:20,title:`计算机总线结构的正确叙述`,type:`题目`,date:`2026-10-02`,chapter:`总线 · 总线结构与分类`,tags:[`总线结构`,`单总线结构`,`系统总线`,`专用总线`],summary:`判断关于主存与 I/O 设备连接方式、单总线结构与专用总线的四条叙述中哪一条正确。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 4 页（卷面第 3 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`下面关于计算机总线结构的说法中，正确的是（　）。

- A．主存作为核心部件，必须通过专用高速总线访问以确保性能
- B．在单总线结构中，主存可与外设共享同一条总线被访问
- C．在单总线结构中，CPU 与主存、CPU 与 I/O 接口可以同时通过同一条总线进行两组独立的数据传送
- D．主存作为主机的核心部件，通常通过内总线访问`,attachments:[{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-2/co-os-page-3.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 1. 单总线结构的特点

单总线结构用**一条系统总线**连接 CPU、主存和所有 I/O 设备：同一时刻总线上只能有一对设备传送数据，谁使用总线由总线控制器（或 CPU）仲裁。主存与外设**共享**这条总线，这正是它的优点（结构简单、便于扩展）与缺点（带宽成为瓶颈）。→ B 正确。

## 2. 其余选项为什么错

- **A 错误**：单总线结构下主存恰恰是和 I/O 设备共用同一条总线；"专用高速总线"是**多总线（双总线/三总线）结构**中才出现的做法。
- **C 错误**：一条总线同一时刻只能传送一组信息，两组传送不可能"同时"进行，必须分时复用。
- **D 错误**：主存既可以通过系统总线挂在单总线上，也可以在多总线结构中通过存储总线（高速总线）与 CPU 连接，"任何总线结构下都完全独立"不成立。

## 3. 结构对比（板书用）

~~~text
单总线:   CPU—主存—I/O 共用一条系统总线, 同一时刻仅一对部件通信
双总线:   主存总线(CPU<->主存) + I/O 总线(CPU<->I/O 接口), 各自独立
三总线:   主存总线 + I/O 总线 + DMA 总线, 支持主存与高速外设直接传送
~~~`,pitfalls:String.raw`1. 把单总线理解成"多组数据可以同时传送"（C），忽略了总线的分时特性。
2. 误认为单总线结构中主存必须是专用高速总线（A），那是多总线结构的特征。
3. 把"内总线（片内总线/局部总线）"与"系统总线"混为一谈（D）。`}},{id:`mock-exam-2-co-q21`,questionNumber:21,title:`DMA 传送长度计数器与最大传送量`,type:`题目`,date:`2026-10-02`,chapter:`输入/输出系统 · DMA 方式`,tags:[`DMA`,`传送长度计数器`,`主存地址寄存器`,`地址回绕`],summary:`给定 DMA 各寄存器位数、起始地址与地址不许回绕的约束，求本次最多传送的数据量和计数器初值。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 4 页末至第 5 页首（卷面第 3、4 页）；原卷未印参考答案，答案由本站按边界条件推导并用脚本复算，非引用官方答案。`,content:String.raw`某 DMA 控制器的主存地址寄存器、传送长度计数器和数据缓冲寄存器分别为 24 位、16 位和 32 位。主存按字节编址，每传送一个 32 位字，传送长度计数器置为 $N-1$（其中 $N$ 为本次传送的字数），即初值 0000H 表示传送 1 个字，FFFFH 表示传送 $2^{16}$ 个字。某次 DMA 操作的主存起始地址为 FE0004H，每传送一个字，主存地址增加 4。要求本次操作访问的所有字节地址均在 000000H~FFFFFFH 内，且地址不能回绕。该次 DMA 操作最多传送的数据量及传送长度计数器的初值分别为（　）。

- A．$2^{20}-32$ bit，7FFEH
- B．$2^{20}$ bit，7FFFH
- C．$2^{21}-32$ bit，FFFEH
- D．$2^{21}$ bit，FFFFH`,attachments:[{name:`查看原卷试题页（第 3 页）`,path:`mock-exam-2/co-os-page-3.png`},{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-2/co-os-page-4.png`}],solution:{answer:String.raw`**选 A（$2^{20}-32$ bit，计数器初值 7FFEH）。**`,explanation:String.raw`## 1. 地址不越界的约束

起始地址 FE0004H，最高可用的字节地址是 FFFFFFH，故可用字节数为

$$
\text{FFFFFFH}-\text{FE0004H}+1=\text{1FFFBH}+1=131068\ \text{字节}.
$$

每个 32 位字占 4 字节，可容纳的字数

$$
N=\left\lfloor\frac{131068}{4}\right\rfloor=32767.
$$

校验最后一个字的边界：起始地址 $+4\times(32767-1)=\text{FE0004H}+\text{1FFF8H}=\text{FFFFFCH}$，占 4 字节后正好到 FFFFFFH，未越界。再多传 1 个字（$N=32768$）将写到 1000000H 以外（地址回绕），不允许。

## 2. 数据量

$$
32767\times32\ \text{bit}=1048544\ \text{bit}=2^{20}-32\ \text{bit}.
$$

## 3. 计数器初值

初值 $=N-1=32766=\text{7FFEH}$。

## 4. 脚本独立复核（.cache/lion-2/verify_juan2.py 实际输出）

~~~
起始地址 = FE0004H, 地址上界 = FFFFFFH, 每字 4 字节
可容纳字节数 = FFFFFFH - FE0004H + 1 = 131068 字节
字数 N = 32767 ; 最后一个字的起始地址 = FFFFFCH (结束 FFFFFFH)
数据量 = 32767 字 * 32 位 = 1048544 位 = 2^20 - 32 位
计数器初值 = N - 1 = 32766 = 7FFEH
=> A. 2^20-32bit, 7FFEH
~~~

## 5. 干扰项来源

- B（$2^{20}$ bit，7FFFH）：把"计数器初值 = 字数"记错，用 $N=32768$ 且数据量取整成 $2^{20}$，忽略了起始地址 FE0004H 已占用前 4 字节的事实。
- C、D（$2^{21}$ 系列）：把数据缓冲寄存器的 32 位误当成"每次传 8 字节"或把"传送 $2^{17}$ 个字"当成容量上界，导致数据量被放大一倍。`,pitfalls:String.raw`1. 忘记"初值 $=N-1$"：0000H 表示 1 个字，所以 $N$ 个字的初值是 $N-1$。
2. 用 24 位地址寄存器能表示的最大值判断，而不从**给定起始地址**出发算剩余空间（本题瓶颈是"到 FFFFFFH 只剩 131068 字节"）。
3. 把"每传送一个字节地址加 1"当成本题规则（题中明确每字加 4）。
4. 把数据量写成分数/小数或忘记乘 32：$32767\ \text{字}\times4\ \text{B}=131068\ \text{B}=1048544\ \text{bit}$。`}},{id:`mock-exam-2-co-q22`,questionNumber:22,title:`外部可屏蔽中断处理过程的辨析`,type:`题目`,date:`2026-10-02`,chapter:`输入/输出系统 · 中断处理`,tags:[`中断`,`可屏蔽中断`,`中断响应`,`中断屏蔽字`],summary:`判断关于中断请求、中断响应时机、开中断与中断屏蔽字作用的四条叙述中哪一条不正确。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 5 页（卷面第 4 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`下列关于外部可屏蔽中断处理过程的叙述，不正确的是（　）。

- A．外部设备可通过中断请求信号，向 CPU 提出中断处理请求
- B．CPU 在每个机器周期结束后都必须响应尚未处理的中断请求
- C．在多重中断处理中，开中断是为了允许 CPU 响应未被屏蔽且满足响应条件的其他中断请求
- D．在采用中断屏蔽字实现多重中断的系统中，应先保护必要的现场并设置中断屏蔽字，再开中断以允许中断嵌套`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-2/co-os-page-4.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 1. 中断响应的时机

CPU 对**外部可屏蔽中断**的响应发生在**一条指令执行结束之后**（此时才检查中断请求，并满足"有请求、允许中断（IF=1）、当前指令结束、无更紧急的异常"等条件）。它不可能在每个机器周期结束后都响应——流水线中的指令需要保持连续执行，且中断响应要保存断点、关中断、进入中断服务程序。→ B 错误（本题答案）。

## 2. 其余选项为什么对

- **A 正确**：外部设备通过中断请求信号（如 INTR）向 CPU 提出中断处理请求，这正是中断过程的第 1 步。
- **C 正确**：中断服务程序中的"开中断"指令把 IF 置 1，使得在执行完当前这条指令后，CPU 可以响应该服务程序未屏蔽的其他中断请求（这是实现多重中断/中断嵌套的必要条件）。
- **D 正确**：多重中断中标准的顺序是"关中断 → 保存断点与现场 → 设置新屏蔽字 → 开中断 → 处理 → 恢复现场 → 开中断 → 返回"，即先保护现场、设置屏蔽字，再开中断允许嵌套。

## 3. 一句话结论

"每个机器周期结束后都响应中断"违背了中断响应的基本前提（**指令执行结束**才检查外中断），因此 B 是错误叙述。`,pitfalls:String.raw`1. 把"每个机器周期的访存结束"当成检查中断的时点。外中断在**指令执行结束后**查询并响应；内部异常（如缺页、除 0）则可能在指令执行过程中被检测。
2. 认为"开中断"会破坏现场保护（其实关中断/开中断都是中断服务程序的规范步骤，开中断发生在保护现场、置屏蔽字之后）。
3. 把中断屏蔽字只理解成"封锁低优先级中断"，漏掉它也能"开放低优先级中断打断当前服务程序"的作用。`}},{id:`mock-exam-2-os-q23`,questionNumber:23,title:`虚拟处理器与虚拟内存的复用方式`,type:`题目`,date:`2026-10-02`,chapter:`操作系统概述 · 虚拟处理器与虚拟存储器`,tags:[`虚拟处理器`,`虚拟内存`,`时分复用`,`空分复用`],summary:`判断"多个进程分时轮流使用 CPU、各自感觉独占处理器"这一现象对应的复用方式。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 5 页（卷面第 4 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`操作系统按时间片轮流让多个进程使用 CPU，使每个进程感觉自己拥有一台处理器。这主要体现了（　）。

- A．时间复用形成虚拟处理器
- B．空间复用形成虚拟内存
- C．时间复用形成虚拟磁盘
- D．空间复用形成虚拟处理器`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-2/co-os-page-4.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`两种复用的定义决定了答案：

- **时间复用（时分复用）**：让多个用户/进程轮流使用同一个物理资源，"各占一小段时间"，宏观上看起来每个人都独占该资源。处理器就是通过时间片轮转被多个进程分时使用，于是"一台 CPU 变成了多台虚拟处理器"。→ 虚拟处理器来自时间复用。
- **空间复用（空分复用）**：把一个物理空间划分成多个部分，让多个程序同时驻留其中。内存通过分区、分页/分段把物理内存切块，每个进程只看到属于自己的那部分地址空间，于是"一份内存变成了多份虚拟内存"。→ 虚拟内存来自空间复用。

所以 A 正确。

## 对照表（口决：CPU 抢时间，内存分空间）

~~~text
虚拟处理器 <- 时间复用（CPU 分时轮转）
虚拟内存   <- 空间复用（内存分页/分区共享物理空间）
虚拟设备   <- 时间复用 + 空间复用（如 SPOOLing 把独占设备改造成共享设备）
~~~`,pitfalls:String.raw`1. 把"时间片轮转"对应的复用方式记反，错选 B：空间复用形成的是虚拟内存，与"轮流使用 CPU"无关。
2. 错选 D："空间复用形成虚拟处理器"在概念上就不成立——处理器是被时间上分给多个进程的。
3. 把虚拟磁盘（用内存模拟磁盘，属于空间复用）与虚拟处理器混淆，错选 C。
4. 记不住就抓一句话：**虚拟处理器是"轮着用"，虚拟内存是"分着用"**。`}},{id:`mock-exam-2-os-q24`,questionNumber:24,title:`用户级线程与内核级线程的切换代价`,type:`题目`,date:`2026-10-02`,chapter:`进程与线程 · 用户级线程与内核级线程`,tags:[`用户级线程`,`内核级线程`,`线程切换`,`核心态`],summary:`判断关于内核级线程与用户级线程切换开销的四条叙述中哪一条正确。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 5 页（卷面第 4 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`关于内核级线程与用户级线程的切换开销，正确的是（　）。

- A．内核级线程切换需模式切换，用户级线程无需模式切换
- B．用户级线程切换需更新页表，内核级线程无需更新页表
- C．两者切换开销相同
- D．内核级线程切换由用户代码控制，开销更小`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-2/co-os-page-4.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`- **A 正确**：用户级线程由用户空间的线程库管理，切换只涉及用户栈、寄存器等用户可见上下文，**全程在用户态完成**（不需要陷入内核）；内核级线程由内核创建与管理，切换必须由内核完成，需要从用户态陷入核心态，即**模式切换**，代价明显更大。
- **B 错误**：同一进程内的所有线程**共享页表**，线程切换并不修改页表；修改页表是**进程切换**才做的事，与线程级别无关。
- **C 错误**：两者开销不同，内核级线程切换要经历用户态→核心态→用户态的模式切换，开销明显大于用户级线程切换。
- **D 错误**：内核级线程的切换由**内核**控制（用户代码无法直接控制），而且开销更大而不是更小。

小结：**用户级线程 = 切换快、内核不可见、一个线程阻塞会导致整个进程阻塞；内核级线程 = 切换需陷入内核（模式切换）、可并行、内核可单独调度。**`,pitfalls:String.raw`1. 把"线程切换"与"进程切换"混同，以为线程切换要换页表（B）。线程共享同一地址空间，页表不变。
2. 认为内核级线程切换更"轻"（C、D）。内核级线程切换必须进内核，开销更大。
3. 把用户级线程的调度主体记成内核（D）。用户级线程由线程库调度，内核只把整个进程当一个可调度实体。`}},{id:`mock-exam-2-os-q25`,questionNumber:25,title:`进程状态转换中与内存-辅存交换相关的转换`,type:`题目`,date:`2026-10-02`,chapter:`进程与线程 · 进程状态的转换（挂起）`,tags:[`进程状态`,`就绪挂起`,`进程挂起`,`对换`],summary:`判断四种进程状态转换中哪一种会引起内存与辅存之间的数据交换。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 5 页（卷面第 4 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`在进程状态切换时，会引起内存与辅存之间交换数据的是（　）。

- A．运行到就绪
- B．运行到阻塞
- C．就绪到挂起
- D．就绪到运行`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-2/co-os-page-4.png`}],solution:{answer:String.raw`**选 C。**`,explanation:String.raw`逐项分析"这次转换是否要把进程的正文/数据在内存与辅存之间搬动"：

- **A 运行到就绪**：时间片用完，进程从 CPU 上下来进入就绪队列，本身仍在内存中，不涉及内外存交换。
- **B 运行到阻塞**：进程等待某事件（I/O 完成等），仍在内存中，只是从 CPU 上下来，不涉及内外存交换。
- **C 就绪到挂起**：进程原本在内存中就绪，由于内存紧张被**对换（换出）到辅存**，需要内外存交换数据。→ 正确。
- **D 就绪到运行**：被调度程序选中，进程仍在内存中，只改变状态。

## 关键区分

~~~text
五种基本状态: 创建、就绪、运行、阻塞、终止
两个挂起状态: 就绪挂起、阻塞挂起  <- 都表示进程被换出到辅存
"挂起"动作本身 = 内存 -> 辅存 (换出); "激活" = 辅存 -> 内存 (换入)
~~~`,pitfalls:String.raw`1. 认为"运行到阻塞"要换出数据（进程一直在内存，只是等待的事件未到）。
2. 分不清"挂起"与"阻塞"：阻塞是等事件（进程仍在内存），挂起是被换出（进程不在内存）。
3. 漏选 C 而错选 D：被调度程序选中（就绪→运行）只是 CPU 归属改变，与辅存无关。`}},{id:`mock-exam-2-os-q26`,questionNumber:26,title:`由空闲块分配结果反推动态分区算法`,type:`题目`,date:`2026-10-02`,chapter:`内存管理 · 动态分区分配算法`,tags:[`动态分区分配`,`首次适应`,`最佳适应`,`最坏适应`,`循环首次适应`],summary:`给定三个空闲块的大小与基址、请求大小与查找起点，由最终分配到 3 号块反推最可能的分配算法。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 5 页（卷面第 4 页）；原卷未印参考答案，答案由本站独立推导并用脚本逐一模拟四种算法，非引用官方答案。`,content:String.raw`某动态分区系统的空闲分区链的排列如下。

![空闲分区表原图](/courses/mock-exam-2/co-os-q26-table.png)

表中数据（单位：KB）：1 号空闭块 块大小 80、块的基址 60；2 号空闭块 块大小 30、块的基址 160；3 号空闭块 块大小 90、块的基址 350。

此时，进程 P 请求 50KB 内存，系统从空闭块 2 号开始查找，最后把 3 号空闭块分配给了进程 P。出现这种情况，系统最有可能采用（　）分区分配算法。

- A．首次适应
- B．最佳适应
- C．最坏适应
- D．循环首次适应`,attachments:[{name:`查看空闲分区表原图`,path:`mock-exam-2/co-os-q26-table.png`},{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-2/co-os-page-4.png`}],solution:{answer:String.raw`**选 D（循环首次适应）。**`,explanation:String.raw`## 1. 题目给的两个条件

1. 查找**从 2 号空闲块（30KB）开始**；
2. 最后把 3 号（90KB）分给了 P。

请求 50KB，故 2 号（30KB）放不下，必须跳到 3 号（90KB）才成功。

## 2. 四种算法逐一模拟（脚本实跑）

~~~
首次适应                   -> 分配到 1 号块 (大小 80K, 基址 60K)
最佳适应                   -> 分配到 1 号块 (大小 80K, 基址 60K)
最坏适应                   -> 分配到 3 号块 (大小 90K, 基址 350K)
循环首次适应(从2号开始)          -> 分配到 3 号块 (大小 90K, 基址 350K)
~~~

- **首次适应**：从空闲链链首（地址最小的 1 号，80KB）开始，80 ≥ 50，立即分配到 1 号 → 与题意不符。
- **最佳适应**：空闲链按容量递增排列为 30(2 号)、80(1 号)、90(3 号)，从最小的 2 号开始，30 不够，下一个是 1 号（80 ≥ 50）→ 分配到 1 号 → 与题意不符。
- **最坏适应**：空闲链按容量递减排列为 90(3 号)、80(1 号)、30(2 号)，每次从**最大块**开始找，3 号（90KB）直接满足 → 结果也是 3 号，但它的查找起点是"最大的块"，无法解释题目"从 2 号块开始查找"这一条件。
- **循环首次适应**：从上次分配位置的下一个空闲块（本题即 2 号）开始循环查找，30 不够 → 3 号（90 ≥ 50）成功 → 既满足"从 2 号开始查找"，又得到"分到 3 号"，与题意完全吻合。

## 3. 为什么"最可能"是 D 而不是 C

仅看"结果分到 3 号"，C（最坏适应）与 D 都能得到同一结果；但题目额外给出了**查找起点 2 号**这一线索：最坏适应总是从最大空闲块开始，不会从最小块的 2 号起查找。因此能同时解释两个条件的是 D，答案为 D（最坏适应只是结果巧合相同）。

## 4. 四种算法特征对照

~~~text
首次适应:     链按地址递增, 每次从链首找; 低地址区易被用光, 大块难存活
循环首次适应: 链按地址递增, 从上次分配位置之后开始找; 空闲块分布均匀
最佳适应:     链按容量递增, 优先用最小的够用块; 产生最多外部碎片
最坏适应:     链按容量递减, 优先用最大块; 大块很快被切碎
~~~`,pitfalls:String.raw`1. 只看"分到 3 号块"就选 C（最坏适应），忽略"从 2 号空闲块开始查找"这一条件；最坏适应的查找起点是最大块而不是 2 号。
2. 把最佳适应理解成"从地址最小开始"（正确理解：从**容量最小**的够用块开始）。
3. 认为"循环首次适应"是"每次从头开始"，其实它是从上次分配位置的下一个块开始（本题正是从 2 号开始）。`}},{id:`mock-exam-2-os-q27`,questionNumber:27,title:`抖动（Thrashing）的判定`,type:`题目`,date:`2026-10-02`,chapter:`内存管理 · 页面置换与工作集`,tags:[`抖动`,`Thrashing`,`页面置换`,`缺页率`],summary:`判断关于抖动（Thrashing）现象成因与表现的四条描述中哪一条正确。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 5 页（卷面第 4 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`下列关于"抖动"的描述，正确的是（　）。

- A．抖动会使频繁的页面置换导致 CPU 利用率显著下降
- B．抖动会使缺页率突然升高但系统仍能高效运行
- C．抖动是内存中页面数不足引发的正常现象
- D．抖动仅发生在 FIFO 页面置换算法中`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-2/co-os-page-4.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`抖动的标准定义：**进程分配的物理块数不足以容纳其当前频繁访问的页面集合（工作集）时，刚被换出的页很快又被访问而需重新调入**，缺页率急剧升高，页面频繁在内存与外存之间换入换出，系统把绝大部分时间花在换页（I/O）上，CPU 利用率显著下降。

- **A 正确**：正是"频繁的页面置换导致 CPU 利用率显著下降"的描述。
- **B 错误**：抖动时缺页率确实突然升高，但系统**无法**高效运行（CPU 利用率很低、磁盘极忙），后半句错。
- **C 错误**：抖动是**病态**现象而不是"正常现象"，它源于分配给进程的物理块数少于工作集大小，是需要避免/消除的异常。
- **D 错误**：抖动与具体页面置换算法无关，FIFO、LRU 等在使用不当（分配块数不足）时都可能引起抖动。

## 抖动链条（板书）

~~~text
进程分到的物理块数 < 工作集大小
   -> 频繁缺页 -> 频繁换入换出 -> 磁盘 I/O 排队
   -> CPU 利用率下降 -> 操作系统误判"并发度不够" -> 引入更多进程
   -> 每进程分到的块更少 -> 恶性循环(抖动)
~~~`,pitfalls:String.raw`1. 认为抖动时"系统仍能高效运行"（B）：抖动恰恰是 CPU 利用率大幅下降。
2. 把抖动当成"内存不足的正常现象"（C）：内存不足是诱因，抖动是病态循环，需要减少并发度或增加分配块数来消除。
3. 把抖动与某种页面置换算法绑定（D）：抖动的根因是**分配给进程的物理块不足**，与算法种类无关。`}},{id:`mock-exam-2-os-q28`,questionNumber:28,title:`请求分页页表项中各字段的作用`,type:`题目`,date:`2026-10-02`,chapter:`内存管理 · 请求分页管理的页表项`,tags:[`请求分页`,`页表项`,`状态位`,`访问字段`,`修改位`,`外存地址`],summary:`判断关于请求分页页表项中状态位、访问字段、修改位与外存地址四个字段作用的四条叙述是否都正确。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 5 页末至第 6 页首（卷面第 4、5 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`在请求分页存储管理系统中，下列关于页表项相关字段作用的叙述，正确的是（　）。

Ⅰ．状态位用于指示页面是否已调入内存

Ⅱ．访问字段用于记录页面的访问情况，供页面置换算法参考

Ⅲ．修改位用于指示页面调入内存后是否被修改

Ⅳ．外存地址字段用于记录页面在外存中的存放位置，供调入页面时使用

- A．Ⅰ、Ⅱ、Ⅲ
- B．Ⅰ、Ⅱ、Ⅳ
- C．Ⅰ、Ⅲ、Ⅳ
- D．Ⅰ、Ⅱ、Ⅲ、Ⅳ`,attachments:[{name:`查看原卷试题页（第 4 页）`,path:`mock-exam-2/co-os-page-4.png`},{name:`查看原卷试题页（第 5 页）`,path:`mock-exam-2/co-os-page-5.png`}],solution:{answer:String.raw`**选 D（Ⅰ、Ⅱ、Ⅲ、Ⅳ 四条均正确）。**`,explanation:String.raw`逐条对照请求分页页表项的字段职责：

- **Ⅰ 正确**：状态位（有效位/存在位）指示该页**是否已调入内存**；为 0 表示不在内存，访问它就会产生缺页。
- **Ⅱ 正确**：访问字段（访问位/访问计数）记录该页的**访问情况**，正是 LRU、Clock 等页面置换算法选择淘汰页的依据。
- **Ⅲ 正确**：修改位（脏位）指示该页**调入内存后是否被修改**；为 1 的脏页在换出时必须写回外存，否则可以直接覆盖。
- **Ⅳ 正确**：外存地址字段记录该页**在外存（对盘/交换区）中的位置**，缺页时按它把页调入内存。

四条描述都成立，故答案为 D。

## 页表项字段速记（请求分页）

~~~text
页号 | 物理块号 | 状态位(在不在内存) | 访问位(供置换算法用)
     | 修改位(脏位, 决定换出是否写回) | 外存地址(缺页时去哪调页)
~~~`,pitfalls:String.raw`1. 认为"访问字段"只记录"是否被访问过"而不供置换算法使用（漏选 Ⅱ）。访问位/访问计数正是 LRU、Clock 算法的输入。
2. 认为"修改位"决定"是否需要调入"：修改位决定**换出时是否写回外存**（脏页才写回）。
3. 把"外存地址"理解成"页框号"（页框号是内存块号，外存地址是磁盘上的位置）。
4. 总觉得题里一定有错项：本题四项均为教材标准表述，答案就是"全选"D。`}},{id:`mock-exam-2-os-q29`,questionNumber:29,title:`磁盘 I/O 性能的优化手段判定`,type:`题目`,date:`2026-10-02`,chapter:`文件管理 · 磁盘管理（磁盘性能）`,tags:[`磁盘I/O`,`预读`,`延迟写`,`虚拟盘`,`逻辑分区`],summary:`判断哪一项措施不能提高磁盘 I/O 性能。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 6 页（卷面第 5 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`下列选项中，不能提高磁盘 I/O 性能的是（　）。

- A．预先读和延迟写
- B．虚拟盘
- C．优化文件物理块的分布
- D．对硬盘进行逻辑分区`,attachments:[{name:`查看原卷试题页（第 5 页）`,path:`mock-exam-2/co-os-page-5.png`}],solution:{answer:String.raw`**选 D。**`,explanation:String.raw`逐项看它对"磁盘 I/O 速度"的贡献：

- **A 预读和延迟写**：预读把按顺序将要访问的块提前读入内存缓冲区，延迟写把多次写合并后再写盘，都能显著减少实际的磁盘访问次数。→ 提高性能。
- **B 虚拟盘（RAM disk）**：用内存模拟磁盘，访问不走机械寻道/旋转，速度接近内存。→ 提高性能。
- **C 优化文件物理块分布**：把同一文件的块集中存放（减少寻道），或按柱面/簇安排（减少旋转延迟与磁头移动）。→ 提高性能。
- **D 逻辑分区**：把一块物理盘划分成多个逻辑分区，只是**改变管理粒度**（便于分区管理、隔离文件系统），并不能减少寻道时间、旋转延迟或提高数据传输率。→ 不能提高 I/O 性能。

## 提高磁盘 I/O 速度的常见手段

~~~text
硬件/布局: 磁盘高速缓存(缓冲池), 虚拟盘, 优化物理块分布, 提高磁盘转速/提高传输率
软件策略: 预读(顺序读), 延迟写(合并写), 按柱面-磁道-扇区顺序安排, 减少寻道
~~~`,pitfalls:String.raw`1. 把"逻辑分区"当成"优化文件在盘上的分布"（D 与 C 的区别）：分区只划分管理范围，不改变同一文件的物理块分布。
2. 认为"虚拟盘"与"磁盘高速缓存"是同一件事：虚拟盘是**用内存模拟整个盘**（需要自己管理），磁盘高速缓存是**缓存磁盘块**（由系统管理）。
3. 忽略"延迟写"的作用，只把预读当成优化手段。`}},{id:`mock-exam-2-os-q30`,questionNumber:30,title:`文件逻辑结构的描述辨析`,type:`题目`,date:`2026-10-02`,chapter:`文件管理 · 文件的逻辑结构`,tags:[`文件的逻辑结构`,`流式文件`,`记录式文件`,`索引顺序文件`,`顺序文件`],summary:`判断关于顺序文件、流式文件与索引顺序文件的四条描述中哪一条正确。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 6 页（卷面第 5 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`在文件系统中，文件的逻辑结构决定了用户对文件的访问方式。下列关于文件逻辑结构的描述中，正确的是（　）。

- A．记录式文件由固定长度的记录组成，支持直接访问任意记录
- B．流式文件以字节序列存储，无法支持随机访问
- C．索引顺序文件结合了顺序和索引结构，但需额外存储索引表
- D．顺序文件必须连续存储，否则无法顺序访问`,attachments:[{name:`查看原卷试题页（第 5 页）`,path:`mock-exam-2/co-os-page-5.png`}],solution:{answer:String.raw`**选 C。**`,explanation:String.raw`- **A 错误**：记录式文件按记录组织，记录可以是**定长也可以是变长**。只有定长记录才能由"第 i 条记录地址 = 起始地址 + i × 记录长度"直接算出；变长记录需要顺序查找。
- **B 错误**：流式文件（无结构文件）以字节流存储，正因为"无结构"反而可以**按字节偏移直接随机访问**（提供文件指针 seek 即可）。"无法随机访问"不成立。
- **C 正确**：索引顺序文件（如 IBM 的 ISAM）把文件按记录键排序（顺序文件的优点：顺序查找快），并为文件建立索引表记录各组首地址（索引文件的优点：可快速定位），代价是要额外存储索引表（还要考虑索引表溢出）。
- **D 错误**：顺序文件指**逻辑记录按某种顺序排列**，物理上既可用连续分配，也可用链接分配、索引分配实现；"物理必须连续"是把顺序文件与连续分配文件混淆了。

## 逻辑结构 vs 物理结构（易混）

~~~text
逻辑结构(用户视角): 流式(无结构) / 顺序文件 / 索引文件 / 索引顺序文件 / 直接文件(散列)
物理结构(存储视角): 连续分配 / 链接分配 / 索引分配
"顺序文件"是逻辑结构, 物理上可以用任一分配方式实现
~~~`,pitfalls:String.raw`1. 把"顺序文件"当成"连续分配文件"（D）。前者是逻辑结构，后者是物理结构。
2. 认为流式文件不能随机访问（B）。用字节偏移定位正是流式文件随机访问的方式。
3. 认为记录式文件一定是定长记录（A）。变长记录只能用顺序方式查找，且无法直接用公式定位。`}},{id:`mock-exam-2-os-q31`,questionNumber:31,title:`不产生磁盘 I/O 的文件插入操作`,type:`题目`,date:`2026-10-02`,chapter:`文件管理 · 文件的物理结构`,tags:[`文件物理结构`,`连续分配`,`链接分配`,`索引分配`,`磁盘I/O`],summary:`在文件控制块与索引块均驻留内存的前提下，判断四种"把某块搬到文件头部"的操作哪一种不需要任何磁盘 I/O。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 6 页（卷面第 5 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`考虑一个文件存放在 100 个数据块中，假如文件控制块、索引块或索引信息都已驻留内存。那么如果（　），则不需要做任何磁盘 I/O 操作。

- A．采用连续文件物理结构，将最后一个数据块搬到文件头部
- B．采用单级索引文件物理结构，将最后一个数据块插入文件头部
- C．采用链接文件物理结构，将最后一个数据块插入文件头部
- D．采用链接文件物理结构，将第一个数据块插入文件尾部`,attachments:[{name:`查看原卷试题页（第 5 页）`,path:`mock-exam-2/co-os-page-5.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`关键在于判断"操作本身改动了什么、被改动的信息在哪里"。

- **A 连续结构**：文件的块在磁盘上**连续存放**，把最后一块搬到头部意味着其余 99 块都要整体后移一位，必须大量读写磁盘。→ 需要磁盘 I/O。
- **B 单级索引结构**：文件的物理块地址全部记录在**索引块**中，题目已说明索引块驻留内存。改变逻辑次序（把最后一块记为第 1 块、原第 1 块记为第 2 块……）只是**调整内存中索引表的表项顺序**，数据块本身在磁盘上的位置不动。→ 不需要磁盘 I/O（正确）。
- **C、D 链接结构**：链指针存放在**每个数据块的块内**，要在头部插入最后一块（或把第一块移到尾部），必须修改有关数据块里的指针字段，而这些数据块在磁盘上，必须读-改-写。→ 需要磁盘 I/O。

## 对照

~~~text
连续分配: 块位置由"起始块号+偏移"决定, 插入/删除要搬运大量数据
链接分配: 指针存在数据块内, 改链必须写盘
索引分配: 指针集中在索引块; 索引块在内存时, 仅调整内存表项 -> 0 次磁盘 I/O
~~~`,pitfalls:String.raw`1. 忽略"索引块驻留内存"这一前提，认为改索引也要写盘。
2. 把"改变逻辑次序"当成"移动数据块"，误以为索引结构也要搬数据（B 只改内存索引表顺序，数据不动）。
3. 链接结构下改链指针时忘记指针字段存在磁盘上的数据块里（C、D 必做磁盘 I/O）。`}},{id:`mock-exam-2-os-q32`,questionNumber:32,title:`设备驱动程序功能的边界`,type:`题目`,date:`2026-10-02`,chapter:`输入/输出管理 · I/O 软件的层次结构`,tags:[`设备驱动程序`,`缓冲区管理`,`I/O软件层次`,`设备独立性`],summary:`判断哪一项通常不属于设备驱动程序的功能。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 6 页（卷面第 5 页）；原卷未印参考答案，答案由本站独立推导，非引用官方答案。`,content:String.raw`设备驱动程序的主要功能中通常不包括（　）。

- A．出错处理
- B．缓冲区管理
- C．启动设备工作
- D．命令转换`,attachments:[{name:`查看原卷试题页（第 5 页）`,path:`mock-exam-2/co-os-page-5.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`I/O 软件自下而上分为：**中断处理程序 → 设备驱动程序 → 设备独立性软件 → 用户层软件**。

- **A 出错处理 属于**：驱动程序要检查设备状态、发现并处理与设备相关的差错（重传、复位等），是把设备"管起来"的必要环节。
- **B 缓冲区管理 不属于（本题答案）**：系统**缓冲区（缓冲池）的组织与使用**由**设备独立性软件/系统缓冲机制**统一负责，设备驱动程序只使用上层传下来的缓冲区地址，不负责"组织并使用系统缓冲区"。
- **C 启动设备工作 属于**：驱动程序负责向设备寄存器写入命令、控制设备启动 I/O 并把 I/O 参数翻译成设备能识别的形式。
- **D 命令转换 属于**：把"读第 n 块"这类抽象要求转换为对控制器/设备寄存器的具体命令，这是设备驱动程序最核心的功能。

## I/O 层次速记

~~~text
用户层 I/O 软件: 提供系统调用接口 (read/write)
设备独立性软件: 设备命名/保护, 缓冲管理, 设备分配, 差错处理(与设备无关部分)
设备驱动程序: 抽象请求 -> 具体命令, 启动设备, 中断前的准备
中断处理程序: 响应中断, 唤醒等待进程
~~~`,pitfalls:String.raw`1. 把"缓冲区管理"划给设备驱动程序（B）。缓冲管理属于设备独立性软件，教材层次划分中它与驱动程序是两个层次。
2. 认为"差错处理"全是设备独立性软件的事：与设备无关的差错处理在上层，设备相关的差错（重传、复位）在驱动程序/中断处理程序中。
3. 把"设备分配"与"驱动程序"混同：分配由设备独立性软件完成，驱动程序只负责操作设备。`}},{id:`mock-exam-2-co-q43`,questionNumber:43,title:`程序查询方式的 CPU 开销与 I/O 方式选择`,type:`题目`,date:`2026-10-02`,chapter:`输入/输出系统 · 程序查询方式与 I/O 控制方式的选择`,tags:[`程序查询方式`,`中断方式`,`DMA方式`,`CPU开销`,`轮询`],summary:`主频 500MHz、每次查询 400 周期，分别求轮询鼠标、软盘、硬盘的 CPU 时间开销，并为三种设备选择更合适的 I/O 控制方式。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 8 页（卷面第 7 页）；原卷未印参考答案，各百分比由本站独立推导并用脚本实跑复核，非引用官方答案。`,content:String.raw`（9 分）某 CPU 主频为 500MHz。采用程序查询方式轮询鼠标、软盘和硬盘，一次查询（含进入查询程序、访问接口和返回）耗时 400 个时钟周期。设备持续有数据可传，CPU 按保证不丢数据的最低必要频率轮询；1MB 按 $10^{6}$B 计算。

（1）鼠标每秒至少查询 50 次，查询鼠标的 CPU 时间开销百分比是多少？（2 分）

（2）软盘速率为 0.1MB/s，每次查询可传 2B，查询软盘的 CPU 开销百分比是多少？（2 分）

（3）硬盘速率为 8MB/s，每次查询可传 16B，查询硬盘的 CPU 开销百分比是多少？（2 分）

（4）分别为鼠标、软盘和硬盘选择更合适的 I/O 控制方式，并说明理由。（3 分）`,attachments:[{name:`查看原卷试题页（第 7 页）`,path:`mock-exam-2/co-os-page-7.png`}],solution:{answer:String.raw`**（1）0.004%　（2）4%　（3）40%**

**（4）典型选择：鼠标——程序查询（轮询）方式（也可选中断方式）；软盘——中断方式；硬盘——DMA 方式。**`,explanation:String.raw`## 0. 基本量

主频 500MHz，故

$$
1\ \text{时钟周期}=\frac{1}{500\times10^{6}}\text{s}=2\text{ns},\qquad
\text{一次查询}=400\ \text{个周期}=800\ \text{ns}.
$$

"保证不丢数据的最低必要频率"就是**恰好跟上设备数据率**的查询频率：

$$
\text{查询频率}=\frac{\text{设备数据率}}{\text{每次查询可传字节数}}.
$$

## 1. 第（1）问：鼠标

题意直接给出每秒至少查询 50 次：

$$
\text{CPU 开销}=\frac{50\times400}{500\times10^{6}}=\frac{20000}{5\times10^{8}}=4\times10^{-5}=0.004\%.
$$

## 2. 第（2）问：软盘

$$
\text{查询频率}=\frac{0.1\times10^{6}\text{B/s}}{2\text{B}}=5\times10^{4}\ \text{次/s},
$$
$$
\text{CPU 开销}=\frac{5\times10^{4}\times400}{5\times10^{8}}=\frac{2\times10^{7}}{5\times10^{8}}=4\%.
$$

## 3. 第（3）问：硬盘

$$
\text{查询频率}=\frac{8\times10^{6}\text{B/s}}{16\text{B}}=5\times10^{5}\ \text{次/s},
$$
$$
\text{CPU 开销}=\frac{5\times10^{5}\times400}{5\times10^{8}}=\frac{2\times10^{8}}{5\times10^{8}}=40\%.
$$

## 4. 第（4）问：方式选择与理由（开放性作答，给出典型选择即可）

这一问没有唯一标准答案，关键是"用数据说话的判断逻辑"：

- **鼠标**：数据率极低（每秒几十次），轮询的 CPU 开销仅 0.004%，采用**程序查询方式**最经济（若希望进一步降低 CPU 参与，也可选择**中断方式**，两种回答都能成立）。
- **软盘**：数据率中等，4% 的轮询开销已不可忽略，典型选择是**中断方式**——CPU 不必忙等，软盘准备好数据时请求中断，CPU 响应后再成批处理。
- **硬盘**：数据率高到使轮询开销达 40%，CPU 近一半时间耗在查询上，典型选择是 **DMA 方式**——由 DMA 控制器直接在硬盘与主存之间传送整块数据，每传完一块才中断 CPU 一次，CPU 开销降到极低。

**判断依据（讲题时按这条逻辑走）**：

- 轮询开销很低（如 0.004%）→ 程序查询足够（或中断也可以）；
- 轮询开销中等（如 4%）→ 中断方式，减少忙等；
- 轮询开销很高（如 40%）→ DMA 方式，成块传送。

## 5. 脚本独立复核（.cache/lion-2/verify_juan2.py 实际输出）

~~~
时钟周期 = 1/500MHz = 2.0 ns; 一次查询耗时 = 400 周期 = 800 ns
(1) 鼠标: 50 次/s * 400 周期 = 20000 周期/s -> 占 CPU 0.0040%
(2) 软盘: 0.1MB/s / 2B = 50000 次/s * 400 = 2e+07 周期/s -> 4.0%
(3) 硬盘: 8MB/s / 16B = 500000 次/s * 400 = 2e+08 周期/s -> 40.0%
=> (1) 0.004%, (2) 4%, (3) 40%
~~`,pitfalls:String.raw`1. 把"每次查询 400 个时钟周期"当 400ns（主频 500MHz 时 1 周期 = 2ns，400 周期 = 800ns）。
2. 查询频率算成"数据率 × 每次字节数"（应除以每次字节数），或忘记 1MB = $10^{6}$B。
3. 百分比算成"周期数 ÷ 400"之类的比例，忘记统一到"每秒钟"（用同一秒内 CPU 总周期作分母）。
4. 第（4）问只写方式不给理由，或三种设备都硬套 DMA（鼠标、软盘用 DMA 属于过度设计）。
5. 把第（4）问当成有唯一答案的死记题：只要"方式与数据率/开销匹配、理由自洽"即可，例如鼠标写中断方式同样成立。`}},{id:`mock-exam-2-co-q44`,questionNumber:44,title:`单总线数据通路下的指令译码与执行周期`,type:`题目`,date:`2026-10-02`,chapter:`中央处理器 · 指令格式、数据通路与指令执行过程`,tags:[`指令格式`,`单总线数据通路`,`寻址方式`,`微操作`,`时钟周期`],summary:`8 位机单总线数据通路，读图分析 Y/Z 暂存器作用，译码 A8H 23H，编写 y=y*8 的指令序列并求一条求值语句的最少时钟周期。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 9 页（卷面第 8 页）；原卷未印参考答案，译码与周期数由本站独立推导并用脚本复核，非引用官方答案。`,content:String.raw`（14 分）某 8 位计算机按字节编址，地址空间为 256B。图示为该机指令格式和单总线数据通路。格式 1 为单字节指令：OP1=000、001、010 的助记符分别为 ADD、SAL、SAR；Ms=0 时源操作数为 (Rs)，Ms=1 时源操作数为存储单元 [(Rs)]，指令功能为 Rd←(Rd)OP1 源操作数。对于 SAL 和 SAR，移位位数由源操作数的值指定。格式 2 为双字节指令：OP2=1000、1001、1010 分别表示 MOV Rd,#Imm、LOAD Rd,[Address] 和 STORE Rs,[Address]，第二字节给出 8 位立即数或绝对地址。R0~R3 的编号为 0~3。

数据通路为单总线结构。一次寄存器到总线并锁存到目标寄存器的传送需 1 个时钟周期；访存读需 2 个周期并将结果送 MDR；ALU 以 Y 和总线为输入，运算结果在同一周期锁存到 Z；Z 送目的寄存器另需 1 个周期。上述微操作按顺序串行执行，不与访存过程重叠。请回答下列问题。

![指令格式与数据通路原图](/courses/mock-exam-2/co-os-q44-figure.png)

（1）说明 Y 和 Z 分别是什么部件，并说明单总线数据通路中设置这两个部件的作用。（2 分）

（2）若一条格式 2 指令的两个字节依次为 A8H、23H，写出该指令的汇编形式和功能，并分别指出寄存器操作数与存储器操作数的寻址方式。（3 分）

（3）用题干给出的指令助记符编写指令序列，实现 C 语句 y=y*8;。变量 y 位于 23H，不考虑运算溢出，可任意使用通用寄存器。（4 分）

（4）取指和译码已经完成。执行 R3←(R3)+[(R2)] 至少需要几个时钟周期？按顺序写出主要的微操作并说明周期数。（5 分）`,attachments:[{name:`查看指令格式与数据通路原图`,path:`mock-exam-2/co-os-q44-figure.png`},{name:`查看原卷试题页（第 8 页）`,path:`mock-exam-2/co-os-page-8.png`}],solution:{answer:String.raw`**（1）Y 是 ALU 的输入端暂存器，Z 是 ALU 的输出（结果）暂存器。**

**（2）汇编形式 STORE R2,[23H]；功能：存储单元 [23H] ← (R2)；寄存器操作数 (R2) 为寄存器直接寻址，存储器操作数 23H 为直接寻址。**

**（3）LOAD R0,[23H] → MOV R1,#3 → SAL R0,R1 → STORE R0,[23H]。**

**（4）至少 6 个时钟周期。**`,explanation:String.raw`## （1）Y 与 Z 的作用

- **Y**：ALU 的一个**操作数暂存器**。单总线结构下，总线同一时刻只能传送一个数据，而 ALU 需要两个操作数（一个来自总线、一个来自 Y），所以必须先把一个操作数送到 Y 暂存起来。
- **Z**：ALU 运算结果的**输出暂存器**。ALU 算完后结果不能立刻再占用总线（否则与本周期总线上正在传送的操作数冲突），先锁存到 Z，下一个周期再经总线送往目的寄存器。

设置 Y、Z 的实质是把"取操作数—运算—写结果"在时间上错开，**避免单总线上的数据冲突**，这是单总线数据通路的必要代价。

## （2）A8H、23H 的译码

第一个字节 A8H 的二进制为 1010 1000。格式 2 的第一个字节划分是：高 4 位为操作码 OP2，接着 2 位为 Rd/Rs，最后 2 位恒为 0：

$$
\text{A8H}=\underbrace{1010}_{OP2}\ \underbrace{10}_{R_s/R_d}\ \underbrace{00}_{未用}
$$

- OP2 = 1010 → **STORE Rs,[Address]**；
- Rd/Rs = 10 → **R2**；
- 第二字节 23H → 绝对地址 23H。

因此该指令为 **STORE R2,[23H]**，执行功能是

$$
M[23H]\leftarrow (R2),
$$

即把 R2 的内容写入 23H 号存储单元。

寻址方式：**寄存器操作数 (R2)** 采用**寄存器直接寻址（寄存器寻址）**；**存储器操作数 23H** 是形式地址即有效地址，采用**直接寻址**。

## （3）实现 $y=y*8$

$y$ 存放在 23H 中，先取到寄存器，再乘 8（即左移 3 位，移位位数由源操作数的值指定），最后写回：

~~~text
1) LOAD  R0,[23H]   ; R0 <- M[23H] = y           机器码 90H 23H
2) MOV   R1,#3      ; R1 <- 3, 作为移位位数       机器码 84H 03H
3) SAL   R0,R1      ; R0 <- (R0) 算术左移 (R1) 位 = y*8   机器码 21H
4) STORE R0,[23H]   ; M[23H] <- R0, 即 y <- y*8   机器码 A0H 23H
~~~

说明：

- 第 2 步必须先给移位位数准备一个寄存器，因为 SAL 的移位位数由源操作数的**值**给出（而不是直接写在指令里）；
- 第 3 步的 SAL 为格式 1 指令：OP1=001、Ms=0、Rd=00(R0)、Rs=01(R1)，故机器码为 0010 0001B = 21H；
- 共 4 条指令、7 字节（2+2+1+2）。也可用 3 条 ADD R0,R0（每次翻倍）替代，但指令条数更少的是上面这种写法。

## （4）$R3\leftarrow(R3)+[(R2)]$ 的微操作与周期

数据通路的关键约束：**寄存器送总线并锁存到目标部件需 1 周期；主存读需 2 周期并把结果送 MDR；ALU 以 Y 和总线为输入，同周期把结果锁存到 Z；Z 送目的寄存器再需 1 周期；微操作串行、不与访存重叠。**

~~~text
① (R2) -> MAR                      1 周期
② 读主存: M -> MDR                 2 周期
③ (MDR) -> Y                       1 周期
④ (R3) 经总线送 ALU 一端, 与 Y 求和, 结果锁存到 Z   1 周期
⑤ Z -> R3                          1 周期
                                  ---------
                                  合计 6 周期
~~~

为什么不能更少：读主存固定 2 个周期且不可与访存重叠；操作数 (R2) 必须先送 MAR（1 周期）才能发起读；读出的数据要先经 MDR 转到 Y（1 周期）才能参与 ALU 运算；ALU 结果必须先落入 Z（1 周期）再经总线写回 R3（1 周期）。因此最少 **6 个时钟周期**。

## 脚本独立复核（.cache/lion-2/verify_juan2.py 实际输出）

~~~
A8H = 10101000 ; OP2=1010 -> STORE Rs,[Address] ; Rs/Rd=10=R2 ; 末2位=00
第二字节 23H -> 绝对地址 23H
=> STORE R2,[23H] : 存储单元[23H] <- (R2)
   寄存器操作数 (R2) 为寄存器直接寻址(寄存器寻址); 存储器操作数 23H 为直接寻址
指令序列(4条):
   LOAD R0,[23H]    机器码 90H 23H     # R0 <- M[23H] = y
   MOV R1,#3        机器码 84H 03H     # R1 <- 3 (移位位数)
   SAL R0,R1        机器码 21H          # R0 <- (R0) 左移 (R1)=3 位 = y*8
   STORE R0,[23H]   机器码 A0H 23H     # M[23H] <- R0
   共 7 字节
   (R2)->MAR（寄存器经总线送MAR）              1 周期
   读主存: M->MDR                        2 周期
   (MDR)->Y                           1 周期
   (R3)经总线与Y进行加法, 结果锁存到Z              1 周期
   Z->R3                              1 周期
   合计 = 6 个时钟周期
==> (4) 至少 6 个时钟周期
~~`,pitfalls:String.raw`1. （1）把 Y、Z 说成"通用寄存器"或"Cache"。它们不是通用寄存器，而是 ALU 两端的**时序暂存器**，作用是让单总线上的一次传送不产生冲突。
2. （2）把 A8H 的高 4 位 1010 读成 LOAD（1001）。1000=MOV、1001=LOAD、1010=STORE，务必按图逐位对照；同时别把功能写成"把 M[23H] 读到 R2"（那是 1001）。
3. （3）直接用一条指令写"$R0 \leftarrow (R0)*8$"——格式 1 只有 ADD/SAL/SAR，而且 SAL 的移位位数要靠源操作数的**值**给出，所以必须先用 MOV 把 3 放进一个寄存器。
4. （4）漏掉 (R2)→MAR 的那 1 个周期，或忘记 MDR→Y 的 1 个周期，答成 4 或 5 个周期；也常见把 Z→R3 与加法算在同一周期（题设明确"结果先锁存到 Z，Z 送目的寄存器另需 1 周期"）。
5. 混淆"有效地址"与"操作数"：本题中 $(R2)$ 是**寄存器间接寻址**，$[(R2)]$ 才是操作数 $M[M[R2]]$。`}},{id:`mock-exam-2-os-q45`,questionNumber:45,title:`门诊挂号与就诊的信号量实现`,type:`题目`,date:`2026-10-02`,chapter:`同步与互斥 · 信号量机制的应用（PV 操作）`,tags:[`信号量`,`PV操作`,`互斥`,`同步`,`FIFO等待队列`],summary:`用信号量实现"1 台挂号机 + n 名医生"的门诊流程：病人互斥挂号后等待空闲医生，医生诊疗结束才接诊下一位，等待最久的病人优先。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 9 页（卷面第 8 页）；原卷未印参考答案，信号量与伪代码由本站独立设计，并用 FIFO 信号量模拟脚本验证顺序，非引用官方答案。`,content:String.raw`（7 分）某门诊有一台挂号机和 $n$ 名医生，多个病人可以并发到达。挂号机一次只允许一名病人使用，每位病人必须先互斥使用挂号机完成挂号，然后等待空闲医生；若所有医生均忙，则病人在信号量的等待队列中排队，等待时间最长的病人优先接受诊疗。病人调用 ReceiveTreatment() 表示接受诊疗，医生调用 ProvideTreatment() 表示为病人诊疗。系统会将医生与其接诊的病人配对，保证双方完成同一次诊疗，这部分不需要考生实现。两个函数都在诊疗结束后返回，医生才能接诊下一名病人，病人才能离开。约定信号量按先进先出（FIFO）的顺序唤醒等待进程。试用 P、V 操作实现上述过程，要求定义所需信号量及初值，并分别写出病人进程和医生进程的伪代码。`,attachments:[{name:`查看原卷试题页（第 8 页）`,path:`mock-exam-2/co-os-page-8.png`}],solution:{answer:String.raw`**定义三个信号量：$mutex=1$（挂号机互斥）、$idle=n$（空闲医生数）、$patient=0$（已挂号待诊疗的病人数）。**

**病人进程**
~~~text
Patient() {
  P(mutex);                  // 互斥使用挂号机
  使用挂号机完成挂号;
  V(mutex);                  // 挂号完成, 释放挂号机
  P(idle);                   // 等待空闲医生; 医生全忙时进入 idle 的等待队列
  V(patient);                // 通知医生: 本病人已就绪, 可与之配对
  ReceiveTreatment();        // 接受诊疗(与医生配对完成同一次诊疗)
  // 函数返回后病人离开
}
~~~

**医生进程**
~~~text
Doctor() {
  while (true) {
  P(patient);                // 等待一名已挂号的病人
  ProvideTreatment();        // 为该病人诊疗, 函数返回即本次诊疗结束
  V(idle);                   // 诊疗结束后医生才空闲, 唤醒等待最久的病人
  }
}
~~~`,explanation:String.raw`## 1. 信号量设计

- **$mutex=1$**：挂号机只有 1 台，属于临界资源，用互斥信号量保证"一次只允许一名病人使用挂号机"。
- **$idle=n$**：空闲医生的数量。初值必须是 $n$，表示门诊一开始有 $n$ 名医生可接诊。病人对它执行 $P$ 操作，等价于"申请一名空闲医生"；医生诊疗结束后对它执行 $V$，等价于"释放自己"。**FIFO 唤醒**正是作用在这个信号量的等待队列上，因此"等待时间最长的病人优先被唤醒"，满足题目要求。
- **$patient=0$**：已挂号、正在等待诊疗的病人数。初值为 0，表示还没有病人可接诊。病人 $V$ 它、医生 $P$ 它，构成"病人到来—医生接诊"的同步。

## 2. 为什么各项顺序不能调换

- 病人必须**先 $V(mutex)$ 再 $P(idle)$**：如果病人还占着挂号机就去等医生，其他病人的挂号会被长时间阻塞。
- 医生必须在 **ProvideTreatment() 返回之后才 $V(idle)$**：题目要求"医生才能接诊下一名病人"，提前 $V$ 会把同一个医生重复计入空闲医生，出现两个病人被同一名医生"接诊"的错误。
- 病人 **$V(patient)$ 必须在 $P(idle)$ 成功之后**：先拿到空闲医生资格再去唤醒医生，可保证"每唤醒一次医生就恰好有一名病人与之配对"，不会出现医生空跑（ProvideTreatment 找不到配对病人）。

## 3. 模拟验证（.cache/lion-2/verify_juan2.py 实际输出，节选）

脚本用 $n=3$ 名医生、病人每 3 个时间单位到一位、一次诊疗 10 个时间单位模拟该算法（保证出现排队）：

~~~
t= 6 病人2 独占挂号机完成挂号
t= 6 病人2 直接等到空闲医生(医生数 0)
t= 9 病人3 独占挂号机完成挂号
t= 9 医生全忙, 病人3 进入 FIFO 等待队列 [3]
t=10 医生完成对病人0 的诊疗, ProvideTreatment() 返回后医生才 V(空闲医生)
t=10 医生被唤醒服务等待最久的病人3
t=12 病人4 独占挂号机完成挂号
t=12 医生全忙, 病人4 进入 FIFO 等待队列 [4]
t=13 医生完成对病人1 的诊疗, ProvideTreatment() 返回后医生才 V(空闲医生)
t=13 医生被唤醒服务等待最久的病人4
t=20 医生完成对病人3 的诊疗, ProvideTreatment() 返回后医生才 V(空闲医生)
t=20 无病人等待, 空闲医生数 = 1
实际接诊顺序 = [0, 1, 2, 3, 4, 5]  (到达顺序 0..5, 完全一致 => 等待最久者优先)
=> 挂号机用互斥信号量 mutex; 病人 P(空闲医生) 在 FIFO 队列排队; 医生 V(空闲医生) 必须在 ProvideTreatment() 返回之后
~~~

输出显示：任一时刻只有一名病人在挂号（互斥成立）；医生全忙时病人按到达顺序进入队列，医生一空闲就唤醒队列中**最早到达**的病人，接诊顺序与到达顺序完全一致（FIFO 成立）。`,pitfalls:String.raw`1. 把 $idle$ 的初值写成 1：那样同一时刻只有一名医生能工作，退化成单医生门诊。
2. 医生在 ProvideTreatment() **之前**就 $V(idle)$，导致空闲医生数被重复累加，可能出现"两名病人同时被同一医生接诊"。
3. 病人先 $P(idle)$ 后没有 $V(patient)$，医生永远在 $P(patient)$ 上等待（或反过来医生先 $V$ 病人后 $P$，造成顺序颠倒）。
4. 让病人在持有 $mutex$ 时等待医生：挂号机被长期占用，其他病人无法挂号（违反"一次只允许一名病人使用"之外还可能引发连锁阻塞）。
5. 用普通整型变量代替信号量来"排队"：题目明确要求信号量按照 FIFO 顺序唤醒，整型计数器无法提供等待队列语义。`}},{id:`mock-exam-2-os-q46`,questionNumber:46,title:`伙伴算法的分配、回收与内部碎片`,type:`题目`,date:`2026-10-02`,chapter:`内存管理 · 伙伴算法（Buddy System）`,tags:[`伙伴算法`,`内存分配`,`伙伴合并`,`内部碎片`],summary:`512KB 内存用伙伴算法依次分配 A/B/C/D、释放 B 和 A、申请 E 失败、释放 D 后合并再申请 E，求各次块大小、地址、合并过程与内部碎片。`,source:`lion模拟卷2，扫描件 docs/book/二.pdf 第 9 页末至第 10 页首（卷面第 8、9 页）；原卷未印参考答案，全部分配/合并过程由本站按规则独立模拟并用脚本实跑复核，非引用官方答案。`,content:String.raw`某操作系统采用伙伴算法管理一块大小为 512KB 的连续内存，初始时整块内存均为空闲，起始地址为 0。为便于书写，块的起始地址和大小均以 KB 为单位。分配时，将请求大小向上取整为不小于该请求的最小 2 的幂；若存在多个同样大小的空闲块，则优先选择起始地址最小的块；分裂较大空闲块时，继续在低地址半块中进行分裂。回收时，若其伙伴块空闲，则立即合并，并继续向上检查。系统依次执行下列操作：

- ① 为进程 A 申请 70KB；
- ② 为进程 B 申请 20KB；
- ③ 为进程 C 申请 100KB；
- ④ 为进程 D 申请 60KB；
- ⑤ 依次释放进程 B 和进程 A 占用的内存；
- ⑥ 为进程 E 申请 200KB；若第⑥步申请失败，则释放进程 D 占用的内存，并再次为进程 E 申请 200KB。

（1）写出 A、B、C、D 实际获得的块大小和起始地址。（3 分）

（2）释放 B 和 A 后，列出全部空闲块。此时第一次为 E 申请 200KB 能否成功？说明原因。（2 分）

（3）释放 D 时发生了哪些合并？再次为 E 申请 200KB 时，E 获得的块大小和起始地址分别是多少？分配后还剩哪些空闲块？（2 分）

（4）分别计算 A、B、C、D 均已分配时，以及 E 第二次申请成功后，系统当前已分配块的内部碎片总量。（1 分）`,attachments:[{name:`查看原卷试题页（第 8 页）`,path:`mock-exam-2/co-os-page-8.png`},{name:`查看原卷试题页（第 9 页）`,path:`mock-exam-2/co-os-page-9.png`}],solution:{answer:String.raw`**（1）A：128KB，起始地址 0；B：32KB，起始地址 128KB；C：128KB，起始地址 256KB；D：64KB，起始地址 192KB。**

**（2）空闲块为 (起始 0KB, 128KB)、(起始 128KB, 64KB)、(起始 384KB, 128KB)。第一次为 E 申请 200KB **不能**分配成功：虽然空闲总量 320KB 足够，但没有 256KB 的连续空闲块。**

**（3）释放 D 时发生两次合并：64KB@192 与其伙伴 64KB@128 合并成 128KB@128，再与伙伴 128KB@0 合并成 256KB@0。再次申请 200KB，E 获得 256KB、起始地址 0。分配后还剩 1 个空闲块：128KB@384。**

**（4）A、B、C、D 均已分配时内部碎片共 102KB；E 第二次申请成功后内部碎片共 84KB。**`,explanation:String.raw`## 0. 规则回顾

伙伴算法只按 2 的幂分块；申请大小向上取整到 2 的幂后，若没有恰好大小的块就**反复二分**（分配块取自低地址半块）；回收时只要**伙伴块**空闲就立即合并，并继续向上合并。

## 1. 第（1）问：四次分配

初始空闲块：256KB@0 分裂到 128KB@0、128KB@128，再按规则先分低地址：

$$
512\text{KB}@0 \rightarrow (256@0,\ 256@256),\quad 256@0 \rightarrow (128@0,\ 128@128).
$$

- **A 申请 70KB**：向上取整 128KB → 取 **128KB@0**。剩余空闲：128KB@128、256KB@256。
- **B 申请 20KB**：向上取整 32KB → 把 128KB@128 分裂为 64KB@128、64KB@192，再把 64KB@128 分裂为 32KB@128、32KB@160，取 **32KB@128**。剩余空闲：32KB@160、64KB@192、256KB@256。
- **C 申请 100KB**：向上取整 128KB → 把 256KB@256 分裂为 128KB@256、128KB@384，取 **128KB@256**。剩余空闲：32KB@160、64KB@192、128KB@384。
- **D 申请 60KB**：向上取整 64KB → 取 **64KB@192**。剩余空闲：32KB@160、128KB@384。

## 2. 第（2）问：释放 B、A 与第一次申请 E

- **释放 B（32KB@128）**：其伙伴 32KB@160 空闲 → 合并为 64KB@128；64KB@128 的伙伴 64KB@192 正被 D 占用 → 停止。空闲块：64KB@128、128KB@384。
- **释放 A（128KB@0）**：其伙伴 128KB@256 正被 C 占用 → 不能合并。空闲块：

$$
(0,\ 128),\quad (128,\ 64),\quad (384,\ 128).
$$

- **第一次申请 E(200KB)**：向上取整需要 **256KB** 的块。当前最大空闲块只有 128KB，申请**失败**。原因不是总量不足（$128+64+128=320\ge256$），而是**没有 256KB 的连续空闲块**，且 128KB@0 与 128KB@384 不是伙伴、地址也不连续，伙伴算法不允许把它们拼起来。

## 3. 第（3）问：释放 D 与第二次申请 E

释放 D 之前已分配块只有 C(128KB@256) 和 D(64KB@192)。

- 释放 D（64KB@192）：伙伴 64KB@128 空闲 → 合并为 **128KB@128**；
- 继续向上检查：128KB@128 的伙伴 128KB@0 空闲 → 合并为 **256KB@0**；
- 256KB@0 的伙伴 256KB@256 被 C 占用 → 停止。

空闲块变为 (0, 256) 与 (384, 128)。再次申请 E(200KB)：取 256KB@0 → **E 获得 256KB，起始地址 0**；分配后只剩 **128KB@384** 一个空闲块。

## 4. 第（4）问：内部碎片

内部碎片 = 实际分配块大小 − 请求大小。

A、B、C、D 均已分配时：

$$
(128-70)+(32-20)+(128-100)+(64-60)=58+12+28+4=102\text{KB}.
$$

第二次为 E 申请成功后，内存中只有 E(256KB) 与 C(128KB) 两个已分配块：

$$
(256-200)+(128-100)=56+28=84\text{KB}.
$$

## 5. 脚本独立复核（.cache/lion-2/verify_juan2.py 实际输出，节选）

~~~
   分配 A: 请求 70K -> 取 128KB 块 @ 0KB
   分配 B: 请求 20K -> 取 32KB 块 @ 128KB
   分配 C: 请求 100K -> 取 128KB 块 @ 256KB
   分配 D: 请求 60K -> 取 64KB 块 @ 192KB
   ①~④ 内部碎片 = 128-70 + 32-20 + 128-100 + 64-60 = 102 KB
   释放 B(32KB @ 128KB)
      合并 32KB@128 + 伙伴 32KB@160 -> 64KB@128
   释放 A(128KB @ 0KB)
   释放A后 空闲块(起始K,大小K): [(0, 128), (128, 64), (384, 128)]
   分配 E(200K 需 256K): 失败, 无足够大的空闲块
   释放 D(64KB @ 192KB)
      合并 64KB@192 + 伙伴 64KB@128 -> 128KB@128
      合并 128KB@0 + 伙伴 128KB@128 -> 256KB@0
   分配 E: 请求 200K -> 取 256KB 块 @ 0KB
   ⑧后 空闲块(起始K,大小K): [(384, 128)] ; 已分配: {'C': (256, 128), 'E': (0, 256)}
   此时已分配块内部碎片 = 128-100 + 256-200 = 84 KB
~~~

## 6. 内存布局一览（示意图）

~~~text
分配 A,B,C,D 后:  | A 128@0 | B 32@128 | 空32@160 | D 64@192 | C 128@256 | 空128@384 |
释放 B、A 后:     | 空128@0 | 空64@128 |          | D 64@192 | C 128@256 | 空128@384 |
释放 D 后:        |        空 256@0         |            C 128@256 | 空128@384 |
E 分配成功后:     |            E 256@0        |            C 128@256 | 空128@384 |
~~~`,pitfalls:String.raw`1. 忘记向上取整到 2 的幂：把 A 分配成 70KB、B 分配成 20KB，后面所有地址全部算错。
2. 分裂时从高地址半块开始占用（题设明确"继续在低地址半块中分裂"）。
3. 释放 B 时忘记先与伙伴 32KB@160 合并（B 释放后是 64KB@128，而不是两个 32KB 块）。
4. 第一次申请 E 时说"空闲总量 320KB > 200KB，分配成功"——伙伴算法要求**单个连续块 ≥ 256KB**，总量够不等于能分配。
5. 释放 D 时只做一次合并（只合并到 128KB@128），漏掉继续向上与 128KB@0 合并成 256KB@0，导致第二次申请 E 又失败。
6. 内部碎片只算 E 那一块（56KB）或把空闲块也算进碎片；内部碎片只统计**已分配块**"块大小 − 请求大小"的差额。`}}],km=[{id:`mock-exam-3-ds-q01`,questionNumber:1,title:`线性结构的存储方式`,type:`题目`,date:`2026-10-02`,chapter:`栈和队列 · 存储结构`,tags:[`循环队列`,`共享栈`,`静态链表`,`十字链表`],summary:`循环队列、共享栈、静态链表、稀疏矩阵十字链表四种存储方式的叙述，找出错误的一项。`,source:`原卷《计算机学科专业基础模拟试题（三）》扫描件第 1 页（第 1 页共 11 页）；卷内未印参考答案，本题答案由本站独立推导并以脚本模拟复核，非官方答案。`,content:String.raw`下列关于线性结构存储方式的叙述中，错误的是（　）。

- **A．** 循环队列采用“牺牲一个存储单元”法时，front=rear 表示队满
- **B．** 共享栈的两个栈顶指针分别为 top1 和 top2，且分别从数组两端向中间增长时，top1+1=top2 表示栈满
- **C．** 静态链表使用数组下标（游标）表示结点之间的链接关系
- **D．** 稀疏矩阵的十字链表结点可同时链接同一行和同一列中的非零元素`,attachments:[{name:`查看原卷截图（第 1 页）`,path:`mock-exam-3/page1.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`## 逐项判定

- **A 错。** “牺牲一个存储单元”法下，数组长度记为 $M$，判空条件是 $front==rear$，判满条件是 $(rear+1)\bmod M==front$。A 却说 $front=rear$ 表示**队满**，把判空条件说成了判满条件，正好说反。
- **B 对。** 共享栈的两个栈顶从数组两端向中间增长：初始化 $top1=-1$（左栈空）、$top2=M$（右栈空）。当两栈顶相邻、中间再无空位时栈满，即 $top1+1==top2$。
- **C 对。** 静态链表把结点顺序存放在一维数组里，每个结点的 $next$ 域保存的是**后继结点的数组下标**（游标），而不是真实地址。
- **D 对。** 十字链表的每个非零元素结点带两个指针域，同时挂在**行链表**和**列链表**上，这正是它能按行、按列高效遍历的原因。

## 关于“front==rear”

$front==rear$ 到底表示空还是满，取决于循环队列的**实现方案**：

- **牺牲一个存储单元**：$front==rear$ 恒表示**队空**，队满用 $(rear+1)\bmod M==front$ 判定。
- **另设 size 计数或 tag 标志**：才可能用 $front==rear$ 配合同一个标志位表示队满。

题目已限定“牺牲一个存储单元”法，所以 A 必然错。记住：只有“另设标志/计数”时，$front==rear$ 才需要再分情况讨论。

## 脚本实证

.cache/crosscheck/verify_juan3.py 按“牺牲一个单元”的循环队列（$M=5$）实跑，连续入队到满，原样输出：

~~~text
Q1 牺牲一个单元法 M=5: 入队到满后 front=0 rear=4
   front==rear ? False   isEmpty=False  isFull=True
   队满判据 (rear+1)%M==front : True
   -> front=rear 表示【队空】而非队满 => 选项 A 是错的（题干问错误项）=> A
~~~

入满时 $front=0,\ rear=4$，此时 $front==rear$ 为 **False**、$isFull()$ 为 True，而 $(rear+1)\bmod 5==0==front$ 判满成立——直接证明 $front==rear$ 是判空而非判满。`,pitfalls:String.raw`1. 只背“front==rear 是空还是满”，不区分“牺牲单元”与“另设 size/flag”两种实现——只有牺牲单元法才用 $(rear+1)\bmod M==front$ 判满。
2. 把共享栈的 $top1+1==top2$ 记成 $top1==top2$：前者表示两栈顶相邻（满），后者表示两栈顶指向同一格。
3. 以为静态链表存的是结点地址——数组里只存下标。
4. 只记十字链表“能省空间”，忘了它的两个指针域分别对应同行、同列，才能同时按行列链接。`}},{id:`mock-exam-3-ds-q02`,questionNumber:2,title:`栈与队列的性质判定`,type:`题目`,date:`2026-10-02`,chapter:`栈和队列 · 栈与队列性质`,tags:[`共享栈`,`BFS遍历`,`链队列`,`卡特兰数`],summary:`判断共享栈栈满条件、无向图不设访问标记的 BFS、带头结点链队列入队、合法出栈序列数四条叙述哪些正确。`,source:`原卷《计算机学科专业基础模拟试题（三）》扫描件第 1 页（第 1 页共 11 页）；卷内未印参考答案，本题答案由本站独立推导并以脚本模拟复核，非官方答案。`,content:String.raw`下列关于栈与队列的叙述中，正确的是（　）。

- **Ⅰ．** 共享栈初始时 top1=-1、top2=MaxSize，其栈满条件为 top1=top2
- **Ⅱ．** 在无向迷宫图上进行 BFS 时不设置访问标记只会增加重复访问，不可能造成无限循环
- **Ⅲ．** 带头结点的链队列中，front 指向头结点、rear 指向队尾结点，将结点 x 入队可执行 rear->next=x; x->next=NULL; rear=x
- **Ⅳ．** n 个不同元素按固定次序入栈时，合法出栈序列数为 C(2n,n)/(n+1)

- **A．** 仅Ⅰ、Ⅱ、Ⅲ
- **B．** 仅Ⅰ、Ⅲ、Ⅳ
- **C．** 仅Ⅲ、Ⅳ
- **D．** Ⅰ、Ⅱ、Ⅲ、Ⅳ`,attachments:[{name:`查看原卷截图（第 1 页）`,path:`mock-exam-3/page1.png`}],solution:{answer:String.raw`**选 C。**`,explanation:String.raw`## 逐条判定

- **Ⅰ 错。** 题设初始化下 $top1=-1$、$top2=MaxSize$，两栈顶相邻即满，栈满条件是 $top1+1==top2$。$top1==top2$ 表示两个栈顶指向同一格，在本初始化下不可能出现，也不是判满条件。
- **Ⅱ 错。** 无向图中只要有一条边 $u\!-\!v$，就存在来回走的 2 步环 $u\to v\to u$。BFS 不设访问标记时，一个顶点出队后又把它已访问过的邻居重新入队：以最简单的两点一边为例，队首 $u$ 出队时把 $v$ 入队，$v$ 出队时又把 $u$ 入队，队列长度始终为 1、却永远不会变空，算法无法终止。所以“不可能造成无限循环”断言为假（“会增加重复访问”那半句虽对，但整句已被“不可能无限循环”否定）。
- **Ⅲ 对。** 带头结点的链队列中 $front$ 恒指向头结点，空队时 $rear==front$。入队就是让队尾的 $next$ 指向 $x$、把 $x$ 的 $next$ 置空、再让 $rear$ 指向 $x$，与题述三行代码一致。
- **Ⅳ 对。** $n$ 个元素按固定次序入栈，合法出栈序列数是第 $n$ 个卡特兰数

$$
C_n=\dfrac{1}{n+1}\dbinom{2n}{n},
$$

与题给表达式完全相同。

仅 Ⅲ、Ⅳ 成立 → **C**。

## 脚本实证

.cache/crosscheck/verify_juan3.py 实跑输出（Ⅱ 用三角形无向图 1-2、2-3、3-1，不设 visit；Ⅲ 按题述代码入队；Ⅳ 枚举全部入/出栈序列）：

~~~text
Q2-II 三角形无向图 BFS 不设 visit：200 步后队列长度 = 201（仍非空）
   队列随步数线性增长 => 永不终止 => Ⅱ 的'不可能造成无限循环'为假
Q2-III 带头结点链队依次入队 a,b,c -> 出队次序 ['a', 'b', 'c'] => Ⅲ 对
Q2-IV 合法出栈序列数 vs Catalan C(2n,n)/(n+1):
   n=1: 枚举=1  Catalan=1  相等=True
   n=2: 枚举=2  Catalan=2  相等=True
   n=3: 枚举=5  Catalan=5  相等=True
   n=4: 枚举=14  Catalan=14  相等=True
   n=5: 枚举=42  Catalan=42  相等=True
   n=6: 枚举=132  Catalan=132  相等=True
   n=7: 枚举=429  Catalan=429  相等=True
   -> 仅 Ⅲ、Ⅳ 对 => C
~~~

Ⅱ 里三角形图每步恰好出队 1 个、入队 2 个（两个邻居都被重新入队），队列长度每步 $+1$；跑 200 步后仍有 201 个待处理顶点，队列非空即无法终止——200 步本身只是演示，真正的理由是“出队 1、入队 2”这一结构使队列恒不减少（两点一边时则是长度恒为 1、同样不为空）。Ⅳ 的枚举值 $1,2,5,14,42,132,429$ 全部等于对应卡特兰数。`,pitfalls:String.raw`1. 把 Ⅱ 当成“只是多访问几次”而判对——无向图不设访问标记是无终止循环，不是性能问题。
2. 把 Ⅰ 的 $top1=top2$ 与“两栈顶相邻即满”混为一谈（相邻是 $top1+1=top2$）。
3. 认为 Ⅲ 里的 $x\to next=NULL$ 多余——不置空，下次入队会把旧链带进来。
4. 记不住卡特兰数而漏判 Ⅳ。`}},{id:`mock-exam-3-ds-q03`,questionNumber:3,title:`二叉树的空指针域与线索`,type:`题目`,date:`2026-10-02`,chapter:`树与二叉树 · 线索二叉树`,tags:[`二叉树`,`空指针域`,`线索化`],summary:`含 n 个结点的二叉树共有 2n 个孩子指针域，其中可作为前驱/后继线索的空指针域有多少个。`,source:`原卷《计算机学科专业基础模拟试题（三）》扫描件第 1 页（第 1 页共 11 页）；卷内未印参考答案，本题答案由本站独立推导并以脚本枚举复核，非官方答案。`,content:String.raw`一棵含n个结点的二叉树共有2n个孩子指针域，其中可用于建立前驱或后继线索的空指针域个数为（　）。

- **A．** n+1
- **B．** 3n-1
- **C．** n-1
- **D．** 与树的形态有关`,attachments:[{name:`查看原卷截图（第 1 页）`,path:`mock-exam-3/page1.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`## 计数

含 $n$ 个结点的二叉树一共给出 $2n$ 个孩子指针域（每个结点两个）。

- 其中真正指向孩子的非空指针，恰好对应树中的边。一棵 $n$ 个结点的二叉树有 $n-1$ 条边，所以非空孩子指针共 $n-1$ 个。
- 其余全部为空：

$$
2n-(n-1)=n+1.
$$

**空指针域个数恒为 $n+1$，与树的形态无关**。这 $n+1$ 个空域都是**可用于线索化**的域：建立前驱或后继线索时，正是这 $n+1$ 个空域提供落点。但要区分“可用空域数”与“实际非空线索数”：$n$ 个结点的二叉链表里，真正指向结点的非空线索只有 $n-1$ 条（每条树边对应一条线索）；不带头结点做中序遍历时，序列**首结点的左空域**与**末结点的右空域**没有前驱/后继可指，仍然保持为 NULL。

## 另一种看法

也可以用“边数恒为 $n-1$”直接推：结点总数 $n$，孩子指针非空数 = 边数 = $n-1$，故空指针数 $=2n-(n-1)=n+1$。所以 D“与形态有关”被直接否定。

## 脚本实证

.cache/crosscheck/verify_juan3.py 枚举 $n=1\dots7$ 的全部二叉树形态，逐棵统计空孩子指针域个数，原样输出：

~~~text
Q3 n 结点二叉树空孩子指针域个数（枚举全部形态）
   n=1: 形态数=1 空域取值集合={2}  n+1=2
   n=2: 形态数=2 空域取值集合={3}  n+1=3
   n=3: 形态数=5 空域取值集合={4}  n+1=4
   n=4: 形态数=14 空域取值集合={5}  n+1=5
   n=5: 形态数=42 空域取值集合={6}  n+1=6
   n=6: 形态数=132 空域取值集合={7}  n+1=7
   n=7: 形态数=429 空域取值集合={8}  n+1=8
   -> 恒为 n+1 => A
~~~

每个 $n$ 下“空域取值集合”都是单元素集合，且恰好等于 $n+1$，直接否证选项 D。`,pitfalls:String.raw`1. 选 D：以为“树越高空指针越多”——空指针数 $n+1$ 与形态无关（由边数恒为 $n-1$ 即可看出）。
2. 把 $2n$ 里的非空数记成 $n$（把每条边的两端各算一次），得 $2n-n=n$。
3. 混淆“可用于线索化的空域数（$n+1$）”与“实际指向结点的非空线索数（$n-1$）”：$n+1$ 是空域总数，而中序序列首结点的左域、末结点的右域等无法指向结点的域仍留空，真正挂上线索的只有 $n-1$ 条。`}},{id:`mock-exam-3-ds-q04`,questionNumber:4,title:`由中序与后序重建二叉树`,type:`题目`,date:`2026-10-02`,chapter:`树与二叉树 · 遍历与重建`,tags:[`中序遍历`,`后序遍历`,`二叉树重建`],summary:`已知中序 DBEAFC、后序 DEBFCA，判断关于该二叉树的四种说法哪一项正确。`,source:`原卷《计算机学科专业基础模拟试题（三）》扫描件第 1 页（第 1 页共 11 页）；卷内未印参考答案，本题答案由本站独立推导并以脚本重建复核，非官方答案。`,content:String.raw`已知一棵二叉树的中序遍历为DBEAFC，后序遍历为DEBFCA，下列说法中正确的是（　）。

- **A．** 根节点的左子树高度为 4
- **B．** 根节点的右子树的根为 F
- **C．** 无法唯一确定前序遍历
- **D．** 该二叉树中，F是C的左孩子且C无右子树`,attachments:[{name:`查看原卷截图（第 1 页）`,path:`mock-exam-3/page1.png`}],solution:{answer:String.raw`**选 D。**`,explanation:String.raw`## 1. 先定根

后序遍历的**最后一个结点是整棵树的根**：后序 DEBFCA 的末位为 $A$，故根是 $A$。

在中序 DBEAFC 中找到 $A$，它把中序切成两段：

- 左子树中序 = DBE
- 右子树中序 = FC

后序相应切分：后序去掉末位 $A$ 得 DEBFC，

- 左子树后序 = DEB（对应左子树 $3$ 个结点）
- 右子树后序 = FC（对应右子树 $2$ 个结点）

## 2. 递归重建

- **左子树**：后序 DEB 末位 $B$ 是根；中序 DBE 中 $B$ 左边是 D、右边是 E，故左子树为 $B(D,E)$。
- **右子树**：后序 FC 末位 $C$ 是根；中序 FC 中 $C$ 左边是 F、右边为空，故右子树为 $C(F,\varnothing)$。

整棵树：

~~~binary
A
  L: B
    L: D
    R: E
  R: C
    L: F
~~~

前序遍历为 $ABDECF$。

## 3. 逐项判定

- **A 错。** 根左子树 $B(D,E)$ 只有两层：按层数高度为 2、按边数为 1，无论如何都不是 4。
- **B 错。** 根的右子树的根是 $C$，$F$ 只是 $C$ 的左孩子。
- **C 错。** 中序 + 后序可**唯一**确定二叉树，前序唯一为 $ABDECF$。
- **D 对。** $C$ 的左孩子是 $F$，$C$ 无右子树。

## 脚本实证

.cache/crosscheck/verify_juan3.py 由中序/后序递归重建并回代验证，原样输出：

~~~text
Q4 重建树 = ('A', ('B', ('D', None, None), ('E', None, None)), ('C', ('F', None, None), None))
   前序=ABDECF 中序=DBEAFC 后序=DEBFCA
   A 根左子树高度(按层)=2 / (按边)=1 -> '4' 假
   B 根右子树的根 = C -> 'F' 假
   C 前序唯一确定 = ABDECF -> '无法唯一确定' 假
   D 根右孩子=C 其左=F 其右=None -> D 真
   -> D
~~~

重建出的树回代得到的中序 DBEAFC、后序 DEBFCA 与原题完全一致，自洽性检查通过。`,pitfalls:String.raw`1. 选项 A 的“高度”定义：按结点层数是 2、按边数是 1，两种定义都不是 4。
2. 把“右子树的根”与“右孩子的孩子”混淆——$C$ 是根，$F$ 是 $C$ 的左孩子。
3. 误以为“中序 + 后序不能唯一确定二叉树”（不能唯一确定的是**前序 + 后序**）。
4. 重建时把后序左子树的切片写错（左子树应取后序前 $k$ 个，右子树取中间到倒数第二，末位单独作根）。`}},{id:`mock-exam-3-ds-q05`,questionNumber:5,title:`生成森林的边数`,type:`题目`,date:`2026-10-02`,chapter:`图 · 生成树与生成森林`,tags:[`生成森林`,`连通分量`,`无向图`],summary:`无向图有 8 个顶点、3 个连通分量，其任意一棵生成森林含多少条边。`,source:`原卷《计算机学科专业基础模拟试题（三）》扫描件第 1 页（第 1 页共 11 页）；卷内未印参考答案，本题答案由本站独立推导并以脚本枚举复核，非官方答案。`,content:String.raw`某无向图共有8个顶点和3个连通分量，则该图的任意一棵生成森林所含边数为（　）。

- **A．** 4
- **B．** 5
- **C．** 6
- **D．** 7`,attachments:[{name:`查看原卷截图（第 1 页）`,path:`mock-exam-3/page1.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 公式推导

生成森林的做法是：对每个连通分量各取一棵生成树，合起来即为生成森林。

设图有 $k$ 个连通分量，第 $i$ 个分量有 $n_i$ 个顶点，则它的生成树有 $n_i-1$ 条边。全部相加：

$$
\sum_{i=1}^{k}(n_i-1)=\Big(\sum_{i=1}^{k}n_i\Big)-k=n-k .
$$

代入 $n=8$、$k=3$：

$$
8-3=5 \text{ 条边}.
$$

**结论只与 $n$、$k$ 有关，与各分量的顶点数如何分配无关。**

## 脚本实证

.cache/crosscheck/verify_juan3.py 按公式计算，并在 $8=4+2+2$ 的划分下逐分量枚举生成树，原样输出：

~~~text
Q5 n=8 k=3 -> 边数 = n-k = 5 => B
   分量 [0, 1, 2, 3]: 生成树 16 棵，每棵边数 3
   分量 [4, 5]: 生成树 1 棵，每棵边数 1
   分量 [6, 7]: 生成树 1 棵，每棵边数 1
   生成森林总数 = 16，每棵边数 = 5
~~~

三个分量的生成树边数分别为 $3,1,1$，合计恒为 $5$，与 $n-k=5$ 一致。`,pitfalls:String.raw`1. 用“连通图生成树 $n-1$ 条边”直接答 7（忽略 3 个分量各少一条边）。
2. 把边数记成 $n+k=11$ 或 $n-2k$ 等。
3. 以为答案取决于各分量的顶点数分配——实际只与 $n$、$k$ 有关。`}},{id:`mock-exam-3-ds-q06`,questionNumber:6,title:`Dijkstra 单步更新`,type:`题目`,date:`2026-10-02`,chapter:`图 · 最短路径`,tags:[`Dijkstra`,`最短路径`,`带权有向图`],summary:`6 个顶点的带权有向图，以顶点 1 为源点执行 Dijkstra，选中顶点 5 并更新相邻顶点后，顶点 6 的 dist 值。`,source:`原卷《计算机学科专业基础模拟试题（三）》扫描件第 1 页（第 1 页共 11 页）；卷内未印参考答案，本题答案由本站独立推导并以脚本模拟复核，非官方答案。图中边权经像素级复核确认。`,content:String.raw`6. 6.给定带权有向图如下。以顶点1为源点执行Dijkstra算法；每次从尚未确定的顶点中选择dist最小者，若有多个则选择编号最小者。选中顶点5后，考察从顶点5出发的所有边，并据此更新其相邻顶点的dist值。完成上述更新后，顶点6的dist值为（　）。

（原卷此处题号“6.”重复印刷一次，照录。）

![第6题带权有向图](mock-exam-3/q6.png)

边权：1→2 为 2，1→4 为 1，1→3 为 3；3→5 为 2，4→5 为 5，2→5 为 4；3→6 为 4，4→6 为 6，5→6 为 1。

- **A．** 5
- **B．** 6
- **C．** 7
- **D．** 9`,attachments:[{name:`查看原卷截图（第 1 页）`,path:`mock-exam-3/page1.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 图上九条有向边

按图读出的边与权值（像素级复核确认）：

- $1\to2$ 权 2，$1\to4$ 权 1，$1\to3$ 权 3
- $3\to5$ 权 2，$4\to5$ 权 5，$2\to5$ 权 4
- $3\to6$ 权 4，$4\to6$ 权 6，$5\to6$ 权 1

## 逐步执行

初始化 $dist[1]=0$，其余 $dist[\cdot]=\infty$。每次在未确定顶点中取 $dist$ 最小者，并列时取编号小者。

- **第 1 步 选 $1(0)$**：松弛 $1\to2=2$、$1\to3=3$、$1\to4=1$ → $dist[2]=2,\ dist[3]=3,\ dist[4]=1$。
- **第 2 步 选 $4(1)$**（当前最小）：松弛 $4\to5=1+5=6$、$4\to6=1+6=7$ → $dist[5]=6,\ dist[6]=7$。
- **第 3 步 选 $2(2)$**：松弛 $2\to5=2+4=6$，不小于当前 $dist[5]=6$，不改。
- **第 4 步 选 $3(3)$**：松弛 $3\to5=3+2=5<6$ → $dist[5]=5$；$3\to6=3+4=7$ 不小于 7，不改。
- **第 5 步 选 $5(5)$**：松弛 $5\to6=5+1=6<7$ → **$dist[6]=6$**。
- **第 6 步 选 $6(6)$**。

关键在于第 4 步：此时剩余顶点中 $dist[3]=3$ 最小（$5$ 还是 6、$6$ 还是 7），所以先选 3，由 $3\to5$ 把 $dist[5]$ 改小为 5；第 5 步才轮到 5，用 $5\to6$ 把 $dist[6]$ 从 7 改小为 6。

最终 $dist=\{0,2,3,1,5,6\}$，$dist[6]=6$ → **B**。

## 脚本实证

.cache/crosscheck/verify_juan3.py 严格实现 Dijkstra（含“编号最小”打破并列），脚本输出节选整理（仅保留本题判定相关的行，松弛行按原值列出）：

~~~text
Q6 Dijkstra 源点 1（边表：1→2:2, 1→4:1, 1→3:3, 3→5:2, 4→5:5, 3→6:4, 4→6:6, 2→5:4, 5→6:1）
     relax 4->6 w=6 -> dist[6]=7
     relax 5->6 w=1 -> dist[6]=6
   选中顺序 [(1, 0), (4, 1), (2, 2), (3, 3), (5, 5), (6, 6)]
   最终 dist = [0, 2, 3, 1, 5, 6]
   dist[6] = 6 => B
~~~`,pitfalls:String.raw`1. 只看 $1\to4\to6$（$1+6=7$）或 $1\to3\to6$（$3+4=7$），漏掉 $1\to3\to5\to6=3+2+1=6$。
2. 第 4 步误选顶点 5（此时 $dist[5]=6>dist[3]=3$，不满足“选 dist 最小者”），于是漏掉 $3\to5$ 的改小，最终得 7。
3. 忘记松弛只在更小时生效：$2\to5$（$2+4=6$）与 $4\to5$（$1+5=6$）都无法把 $dist[5]$ 降到 5 以下。
4. 完全忘记“并列取编号最小者”的规则。本题各次被选顶点的 $dist$ 都是唯一的（如第 2 步 $dist[4]=1$、第 4 步 $dist[3]=3$），该规则并未被触发；但它仍是算法的一部分，遇到并列时必须按编号取小。`}},{id:`mock-exam-3-ds-q07`,questionNumber:7,title:`Kruskal 与 Prim 的区别`,type:`题目`,date:`2026-10-02`,chapter:`图 · 最小生成树`,tags:[`Kruskal`,`Prim`,`最小生成树`],summary:`判断关于 Kruskal 与 Prim 两种最小生成树算法主要区别的四种说法哪一项正确。`,source:`原卷《计算机学科专业基础模拟试题（三）》扫描件第 1～2 页（第 1 页共 11 页、第 2 页共 11 页）；卷内未印参考答案，本题答案由本站独立推导，非官方答案。`,content:String.raw`在Kruskal算法与Prim算法中，二者的主要区别是（　）。

- **A．** Kruskal 基于顶点扩展，Prim 基于边扩展
- **B．** Kruskal 每次选取当前权值最小的边，无须判断加入该边是否形成回路
- **C．** Kruskal 适合稠密图，Prim 适合稀疏图
- **D．** Kruskal 按权值从小到大考察边并避免成环，Prim 每次选取连接当前生成树与树外顶点的最小权值边`,attachments:[{name:`查看原卷截图（第 1 页）`,path:`mock-exam-3/page1.png`},{name:`查看原卷截图（第 2 页，含 B～D 选项）`,path:`mock-exam-3/page2.png`}],solution:{answer:String.raw`**选 D。**`,explanation:String.raw`## 两种算法的机制

- **Kruskal（按边扩展，又称“加边法”）**：把所有边按权值**从小到大**排序，依次考察；若当前边两端点不属于同一连通分量（加入后**不成环**）就选入，否则丢弃。用并查集判环，适合**稀疏图**，复杂度 $O(e\log e)$。
- **Prim（按顶点扩展，又称“加点法”）**：从任一顶点出发，每次从“一端在生成树内、另一端在树外”的割边中选权值最小者，把对应树外顶点并入。适合**稠密图**，邻接矩阵实现复杂度 $O(n^2)$，与边数无关。

## 逐项判定

- **A 错。** 说反了：Kruskal 按边、Prim 按顶点扩展。
- **B 错。** Kruskal **必须**判断是否成环（否则会选出回路），这是它的关键步骤。
- **C 错。** 说反了：Kruskal 适合稀疏图，Prim 适合稠密图。
- **D 对。** 两句话分别准确描述了 Kruskal 与 Prim 的取舍方式（Kruskal 排序后考察边并避免成环；Prim 取跨越当前割的最小边）。

概念题，由定义与教材复杂度结论直接判定。`,pitfalls:String.raw`1. 把“适合稠密/稀疏”记反：Prim 在稠密图上 $O(n^2)$ 优于 Kruskal 的 $O(e\log e)$，故 **Prim 稠密、Kruskal 稀疏**。
2. 认为 Kruskal 不需要判环——它靠并查集判环。
3. 把“每次取最小边”当成 Prim——Prim 取的是**跨越当前割**的最小边，不是全图最小边。`}},{id:`mock-exam-3-ds-q08`,questionNumber:8,title:`AVL 插入与平衡因子`,type:`题目`,date:`2026-10-02`,chapter:`查找 · 平衡二叉树`,tags:[`AVL树`,`平衡因子`,`旋转`],summary:`向空平衡二叉树依次插入 2,3,4,7,5,8，求形成树中平衡因子为 0 的非叶结点个数。`,source:`原卷《计算机学科专业基础模拟试题（三）》扫描件第 2 页（第 2 页共 11 页）；卷内未印参考答案，本题答案由本站独立推导并以脚本模拟复核，非官方答案。`,content:String.raw`向一棵空的平衡二叉树中依次插入2, 3, 4, 7, 5, 8，形成的二叉树中平衡因子为0的非叶节点个数为（　）。

- **A．** 0
- **B．** 1
- **C．** 2
- **D．** 3`,attachments:[{name:`查看原卷截图（第 2 页）`,path:`mock-exam-3/page2.png`}],solution:{answer:String.raw`**选 C。**`,explanation:String.raw`## 逐次插入

平衡因子 $BF=$ 左子树高 $-$ 右子树高（按边数计，叶结点 $BF=0$）。

- 插 2：2。
- 插 3：2(–,3)。
- 插 4：结点 2 失衡（$BF=-2$，RR 型）→ 对 2 左旋 → 3(2,4)。
- 插 7：3(2,4(–,7))，未失衡。
- 插 5：结点 4 失衡（$BF=-2$，RL 型）→ 先对 7 右旋、再对 4 左旋 → 3(2,5(4,7))。
- 插 8：结点 3 失衡（$BF=-2$，RR 型）→ 对 3 左旋 → 5(3(2,4),7(–,8))。

最终树：

~~~binary
5
  L: 3
    L: 2
    R: 4
  R: 7
    R: 8
~~~

## 统计非叶结点

非叶结点为 $5,3,7$：

- 结点 $3$：左子树 $\{2\}$ 高 1（层）/0（边），右子树 $\{4\}$ 高 1/0 → 平衡 → $BF=0$ ✔
- 结点 $7$：左子树空、右子树 $\{8\}$ → $BF=-1$ ✘
- 结点 $5$：左子树 $3(2,4)$ 与右子树 $7(\varnothing,8)$ 等高 → $BF=0$ ✔

平衡因子为 0 的非叶结点是 **3 和 5，共 2 个** → **C**。

（三个叶结点 $2,4,8$ 的 $BF$ 也都是 0，但题目限定“**非叶**节点”，不计入。）

## 脚本实证

.cache/crosscheck/verify_juan3.py 从空树依次插入并记录旋转事件、统计非叶结点 $BF$，原样输出：

~~~text
Q8 AVL 依次插入 2,3,4,7,5,8
   插 2: 2(.,.)  events=None
   插 3: 2(.,3(.,.))  events=None
   插 4: 3(2(.,.),4(.,.))  events=('RR', 2)
   插 7: 3(2(.,.),4(.,7(.,.)))  events=('RR', 2)
   插 5: 3(2(.,.),5(4(.,.),7(.,.)))  events=('RL', 4)
   插 8: 5(3(2(.,.),4(.,.)),7(.,8(.,.)))  events=('RR', 3)
   旋转事件=[('RR', 2), ('RL', 4), ('RR', 3)]
   非叶结点(BF)=[(5, 0), (3, 0), (7, -1)]  BF==0 的个数=2
   -> C
~~~

三次旋转依次为“对 2 的 RR”“对 4 的 RL”“对 3 的 RR”，非叶结点 $BF$ 列表为 $(5,0),(3,0),(7,-1)$。`,pitfalls:String.raw`1. 把三个叶子（$2,4,8$，$BF$ 均为 0）也数进去，误得 5 或选 D。
2. 插入 5 时只做单旋：结点 4 的失衡属 RL 型（在右孩子的左子树插入），必须**先右旋 7、再左旋 4** 两步。
3. 插入 8 后用“结点 4 或 7 失衡”来判断——真正的最高失衡点是 3，旋转后根变为 5。
4. 平衡因子按“结点数”而非“子树高度差”计算。`}},{id:`mock-exam-3-ds-q09`,questionNumber:9,title:`败者树的作用`,type:`题目`,date:`2026-10-02`,chapter:`外部排序 · 败者树`,tags:[`败者树`,`k路归并`,`外部排序`],summary:`判断关于 k 路归并中败者树主要作用及相关性质的说法哪一项正确。`,source:`原卷《计算机学科专业基础模拟试题（三）》扫描件第 2 页（第 2 页共 11 页）；卷内未印参考答案，本题答案由本站独立推导，非官方答案。`,content:String.raw`在k路归并中使用败者树的主要作用是（　）。

- **A．** 内部结点记录比较中的败者，更新一个归并段的当前元素后可在 O(log k)时间内选出新的最小元素
- **B．** 每输出一个元素都重新对 k 个归并段进行完整排序
- **C．** 把选择最小元素所需的辅助空间降为 O(1)
- **D．** 仅适用于二路归并，不适用于多路归并`,attachments:[{name:`查看原卷截图（第 2 页）`,path:`mock-exam-3/page2.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`## 败者树的结构与价值

败者树是一棵**完全二叉树**：$k$ 个归并段的当前元素放在 $k$ 个**叶结点**上，内部结点保存**比较中的败者**（胜者继续向上比较），树根之上另设一个结点保存最终**胜者**（全局最小元素）。

其价值在于**增量更新**：每当某个归并段的最小元素被输出、该段换上下一个元素时，只需从这个叶结点出发沿路径向上重赛，比较次数至多为树高 $\lceil\log_2 k\rceil$（$k$ 非 2 的幂时个别叶结点路径略短），即 $O(\log k)$，就能得到新的全局最小；而朴素做法每输出一个元素都要在 $k$ 个元素间比 $k-1$ 次。

## 逐项判定

- **A 对。** 准确描述了“内部结点存败者 + 单元素更新后 $O(\log k)$ 选出新最小”两点。
- **B 错。** 败者树的作用恰恰是**避免**每次输出都重新比较/排序。
- **C 错。** 败者树需要 $O(k)$ 个内部结点（辅助空间 $O(k)$），并非 $O(1)$；它省的是**时间**不是空间。
- **D 错。** 败者树正是为**多路归并**（$k\ge2$，含 $k>2$）设计的，$k$ 路皆可用。

概念题，由败者树的定义与代价分析直接判定：叶结点为 $k$ 个当前元素，内部结点存败者，更新一段后沿一条根路径重赛即可得新最小值，单次代价 $O(\log k)$，辅助空间 $O(k)$。`,pitfalls:String.raw`1. 把败者树与“堆”混为一谈，以为它省的是空间（C）。
2. 记成“内部结点记录胜者”——内部结点记的是**败者**，只有根上方的输出结点记胜者。
3. 误以为只适用二路归并（D）——败者树的意义就在于 $k$ 较大时把“每次选最小”从 $O(k)$ 降到 $O(\log k)$。`}},{id:`mock-exam-3-ds-q10`,questionNumber:10,title:`多关键字稳定排序次序`,type:`题目`,date:`2026-10-02`,chapter:`排序 · 多关键字排序`,tags:[`多关键字排序`,`低位优先`,`稳定排序`],summary:`按“总分、数学、语文、英语”优先级降序排序，每趟都用稳定排序，应如何安排关键字次序。`,source:`原卷《计算机学科专业基础模拟试题（三）》扫描件第 2 页（第 2 页共 11 页）；卷内未印参考答案，本题答案由本站独立推导并以脚本模拟复核，非官方答案。`,content:String.raw`现按“总分、数学、语文、英语”的优先级对学生成绩降序排序，即高优先级关键字相同时才比较下一关键字。若每一趟都采用稳定排序，则应按怎样的关键字次序依次排序（　）。

- **A．** 总分→数学→语文→英语
- **B．** 英语→语文→数学→总分
- **C．** 数学→语文→英语→总分
- **D．** 英语→总分→语文→数学`,attachments:[{name:`查看原卷截图（第 2 页）`,path:`mock-exam-3/page2.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 低位优先（LSD）原则

要让“高优先级关键字相同时才比较下一关键字”成立，必须**从优先级最低的关键字排到最高**，且每一趟都必须是**稳定**排序。

理由是：稳定排序保证“已按低优先级关键字排好的相对次序”不会被其后按更高优先级关键字排序时打乱——即高优先级相等的记录，其内部次序正是上一趟（更低优先级）排出来的结果。从最低位依次排到最高位后，整体结果等价于一次多关键字比较。

本题优先级从高到低为 总分 > 数学 > 语文 > 英语，故排序次序应为：

$$
\text{英语}\to\text{语文}\to\text{数学}\to\text{总分}.
$$

→ **B**。

## 脚本实证

.cache/crosscheck/verify_juan3.py 用 4 条示例记录，依次按“英语→语文→数学→总分”做**稳定**排序，并与一次性四级降序比较，原样输出：

~~~text
Q10 按 英语 稳定降序: ['s2', 's3', 's1', 's4']
Q10 按 语文 稳定降序: ['s2', 's3', 's1', 's4']
Q10 按 数学 稳定降序: ['s4', 's3', 's2', 's1']
Q10 按 总分 稳定降序: ['s3', 's2', 's1', 's4']
   一次多关键字排序 = ['s3', 's2', 's1', 's4']  相同=True
   -> 英语→语文→数学→总分 => B
~~~

四趟稳定排序的最终次序 s3,s2,s1,s4 与“直接按 (总分,数学,语文,英语) 四级降序”一次比较完全一致（脚本报告 相同=True）。`,pitfalls:String.raw`1. 按优先级从高到低对全体记录逐趟排序（A）——在一趟排完整个序列、且每趟稳定排序的设定下，后面更低位关键字的排序会打乱前面高优先级的次序，因而错。（真正的 MSD 高位优先基数排序是对子序列递归分组排序，并不把全体记录按高位到低位逐趟重排，那是另一种合法算法，不能一概判错。）
2. 选“逆序但总分位置错”的 D（英语→总分→语文→数学）：总分是**最高**优先级，必须**最后**排。
3. 忽略“每趟必须稳定”这一前提：中间若用了不稳定排序，即便次序正确也可能出错。
4. 误以为“降序”要把排序次序也倒过来——降序只影响每趟内部的比较方向（从大到小），不影响“低优先级先排”的顺序。`}},{id:`mock-exam-3-ds-q11`,questionNumber:11,title:`Top-n 小根堆的时间复杂度`,type:`题目`,date:`2026-10-02`,chapter:`排序 · 堆与 Top-n`,tags:[`堆`,`Top-n`,`时间复杂度`],summary:`从 m 个商品中选出相关度最高的 n 个（n 远小于 m），扫描全部商品并维护大小为 n 的小根堆，求时间复杂度。`,source:`原卷《计算机学科专业基础模拟试题（三）》扫描件第 2 页（第 2 页共 11 页）；卷内未印参考答案，本题答案由本站独立推导并以脚本模拟复核，非官方答案。`,content:String.raw`有m个商品，需要选出相关度最高的n个商品（n远小于m）。若扫描全部商品并维护一个大小为n的小根堆，则时间复杂度为（　）。

- **A．** O(m log n)
- **B．** O(n log m)
- **C．** O(m log m)
- **D．** O(m+n)`,attachments:[{name:`查看原卷截图（第 2 页）`,path:`mock-exam-3/page2.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`## Top-n 做法

维护一个大小为 $n$ 的**小根堆**，堆顶是当前已选出的 $n$ 个商品里相关度**最低**的那个。

- 顺序扫描 $m$ 个商品，每个商品做一次判断；若它比堆顶更相关，就用堆替换（弹堆顶 + 插入自身），一次堆操作 $O(\log n)$；否则直接丢弃（$O(1)$）。
- 总代价 = $m$ 次“读 + 判断”（$O(m)$）+ 至多 $m$ 次堆操作（每次 $O(\log n)$）= $O(m\log n)$。
- 之所以用小根堆而非大根堆：堆顶放“最差的那个”，新元素一来就能 $O(1)$ 与它比较并决定是否替换，从而只扫一遍。

本题只需在扫描时维护大小为 $n$ 的小根堆（$O(m\log n)$），不必对全部 $m$ 个商品做 $O(m\log m)$ 的比较排序；这正是 Top-n 用堆的价值。

## 逐项排除

- **A 对。** $m$ 次扫描循环，每次至多一次 $O(\log n)$ 的堆调整。
- **B 错。** 把 $m$ 和 $n$ 的角色对调了。
- **C 错。** $O(m\log m)$ 是把全部 $m$ 个元素做堆排序/比较排序的代价，题设已限定堆大小为 $n$。
- **D 错。** 漏掉每次堆替换的对数代价。

## 脚本实证

本次独立模拟核验（独立重写的 Top-n 程序，非旧 verify_juan3 脚本）：用一个 9 元素受控输入核对正确性，再跑三组大规模数据统计替换次数。替换条件是“新元素大于堆顶（小根堆的最小者）”时替换。

~~~text
input=[4,9,1,7,3,8,2,6,5], n=3
扫描 9 项：前 3 项入堆，其余大于堆顶才替换，替换 2 次
入选 = [7, 8, 9]  == sorted(input)[-3:]  （断言通过）
~~~

~~~text
m=10000    n=10:  扫描 10000，入堆 10，   替换 72，  总更新 82
m=100000   n=100: 扫描 100000，入堆 100， 替换 649， 总更新 749
m=1000000  n=1000:扫描 1000000，入堆 1000，替换 6937，总更新 7937
~~~

替换次数取决于数据分布，但**上界是每个元素至多一次**；每次替换（弹堆顶 + 压入）代价 $O(\log n)$，加上 $m$ 次 $O(1)$ 的扫描判断，总量级 $O(m\log n)$，与 A 一致。

**说明：** 旧 verify_juan3.py 的 Q11 段替换方向写反（按 $x<heap[0]$ 替换，且把“读 + 比较”也计入“堆操作”），该输出已弃用；脚本其后已改为 $x>heap[0]$ 并分别统计入堆/替换，修正后输出与上表一致。上表为独立重写的模拟结果，两项互相印证。`,pitfalls:String.raw`1. 选 C（$O(m\log m)$）：那是把全部 $m$ 个元素做堆排序/比较排序的代价。
2. 选 B（$O(n\log m)$）：把 $m$ 和 $n$ 的角色对调。
3. 选 D（$O(m+n)$）：漏掉每次堆替换的 $O(\log n)$。
4. 误用**大**根堆：大根堆堆顶最大，无法 $O(1)$ 判断“新元素是否该挤进前 $n$”。`}},{id:`mock-exam-3-co-q12`,questionNumber:12,title:`IEEE 754 非规格化数与规格化操作`,type:`题目`,date:`2026-10-02`,chapter:`数据的表示和运算 · 浮点数的表示`,tags:[`IEEE754`,`非规格化数`,`阶码偏移`,`规格化`],summary:`判断 IEEE 754 浮点数中非规格化数隐含位、阶码偏移值及规格化左移对阶码的影响。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 3 页（卷面第 2 页）第 12 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于 IEEE 754 浮点数规格化操作的描述，错误的是（　）。

- A．非规格化数的阶码全为 0
- B．非规格化数的尾数最高位隐含为 1
- C．单精度浮点数阶码偏移值为 127
- D．规格化时尾数左移导致阶码减少`,attachments:[{name:`查看原卷试题页（第 3 页，含第 12～15 题）`,path:`mock-exam-3/co-os-page-03.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 1. 逐个判断

- **A 正确。** IEEE 754 用“阶码全 0”这一编码段专门表示非规格化数（subnormal），此时真实阶码记为 $1-\text{bias}$，但编码字段确实全为 0。
- **B 错误。** 规格化数（阶码非全 0）的尾数最高位是**隐含的 1**；非规格化数的隐含位是 **0**，这样尾数才能表示比最小规格化数更接近 0 的值。所以“非规格化数尾数最高位隐含为 1”说反了。
- **C 正确。** 单精度阶码 8 位，偏移值 $2^{8-1}-1=127$；双精度阶码 11 位，偏移值 1023。
- **D 正确。** 规格化时若尾数以左移方式消去前导 0，相当于小数点右移，必须同步减小阶码以保持数值不变。

## 2. 规格化数与非规格化数的隐含位对比

$$
\text{规格化数：尾数}=1.f\quad(\text{隐含位 }1),\qquad
\text{非规格化数：尾数}=0.f\quad(\text{隐含位 }0).
$$

这里的“隐含位”是省略不存的那一位，不是实际存储的尾数位；$f$ 才是被存储的尾数字段。`,pitfalls:String.raw`- 把规格化数的隐含位 1 套到非规格化数上（本题选项 B 的陷阱）。
- 混淆“阶码字段全 0”与“数值为 0”：阶码全 0 且尾数全 0 才表示 $\pm0$；阶码全 0 而尾数非 0 表示非规格化数。
- 记错偏移值：单精度 127、双精度 1023，不要与阶码位数（8、11）混淆。`}},{id:`mock-exam-3-co-q13`,questionNumber:13,title:`存储器与寻址方式的正误判断`,type:`题目`,date:`2026-10-02`,chapter:`存储系统 · 高速缓冲存储器与虚拟存储器`,tags:[`组相联映射`,`多级页表`,`TLB`,`结构体对齐`],summary:`判断组相联映射、多级页表、TLB 与结构体对齐四条叙述的正确性。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 3 页（卷面第 2 页）第 13 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于计算机存储器与寻址方式的描述中，正确的是（　）。

I．二路组相联 Cache 中，主存块可映射到 Cache 的任意一组的任意块中

II．多级页表通过分层映射减少内存中的页表项数量，从而节省内存空间

III．TLB 用于缓存页表项，其命中率与虚拟地址的局部性密切相关

IV．结构体对齐会导致内存空间浪费，但能提高 CPU 访问速度

- A．仅 I、II 正确
- B．仅 I、III 正确
- C．仅 I、III、IV 正确
- D．仅 II、III、IV 正确`,attachments:[{name:`查看原卷试题页（第 3 页，含第 12～15 题）`,path:`mock-exam-3/co-os-page-03.png`}],solution:{answer:String.raw`**选 D（仅 II、III、IV 正确）。**`,explanation:String.raw`## 1. 逐条分析

- **I 错误。** 二路组相联的映射规则是：主存块号对组数取模，先定**某一组**，再在该组内的 2 个块（2 路）中任选其一。因此它只能进入“对应那一组”，不能进入任意一组的任意块——那是全相联（主存块可放入任意块）。I 把二路组相联过度放宽成了全相联。
- **II 正确。** 多级页表把大页表分层，未使用的虚拟地址区间无需建立下级页表，因而减少了实际驻留内存的页表项，节省存储空间。
- **III 正确。** TLB 是页表的快速缓存，其命中依赖对同一页的反复/邻近访问，正是虚拟地址局部性的体现。
- **IV 正确。** 结构体对齐会让编译器插入填充字节造成空间浪费，但使成员按边界对齐，便于一次总线访问取出、提升 CPU 访问速度。

## 2. 判定要点

- “任意一组”= 全相联；“某一组的任意块”= 组相联。
- 多级页表省的是“不必常驻内存的那些页表”，不是省“每个页的页表项”。

因此正确项为 II、III、IV。`,pitfalls:String.raw`- 把二路组相联误当成全相联（选项 A、B、C 都含 I，属典型错选）。
- 误以为多级页表会增加页表项总数所以 II 错：题目强调“内存中的页表项数量”与“节省空间”，多级页表确实能让未用区间不占内存。
- 方向记反：结构体对齐是以空间换速度，所以“浪费空间但提速”成立。`}},{id:`mock-exam-3-co-q14`,questionNumber:14,title:`虚拟存储器中页大小变化的影响`,type:`题目`,date:`2026-10-02`,chapter:`存储系统 · 虚拟存储器`,tags:[`页大小`,`页表`,`内部碎片`,`虚拟存储器`],summary:`分析增大页大小对页表项数量、内外碎片及页表占用内存的影响。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 3 页（卷面第 2 页）第 14 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`在虚拟存储器管理系统中，增大页大小会导致（　）。

- A．页表项数量增加
- B．内部碎片减少
- C．外部碎片增加
- D．页表占用内存减少`,attachments:[{name:`查看原卷试题页（第 3 页，含第 12～15 题）`,path:`mock-exam-3/co-os-page-03.png`}],solution:{answer:String.raw`**选 D。**`,explanation:String.raw`## 1. 逐项分析

设虚拟地址空间大小为 $V$，页大小为 $P$，则页数（即页表项数）为 $n=V/P$。

- **A 错。** $P$ 增大，$n=V/P$ 减小，页表项数量不是增加而是减少。
- **B 错。** 页是分配单位，页越大，一个进程最后一页平均浪费的空间越大，**内部碎片增大**，不是减少。
- **C 错。** 分页系统中内存按页划分，页内浪费属于内部碎片，不产生外部碎片；页大小变化与外部碎片无关。
- **D 对。** 页数减少，页表项随之减少，页表本身占用的内存下降。

## 2. 一句话规律

$$
n=\frac{V}{P}\ \downarrow,\qquad \text{内部碎片}\ \uparrow .
$$

页越大 → 页表越小、缺页率可能下降，但页内碎片越大、I/O 换页代价越高。`,pitfalls:String.raw`- 把“页大”与“页表大”混为一谈（选 A）。
- 误认为页内浪费是外部碎片（分页无外部碎片，选 C）。
- 漏掉页表项数 $=V/P$ 这一反比关系。`}},{id:`mock-exam-3-co-q15`,questionNumber:15,title:`按行访问二维数组的局部性分析`,type:`题目`,date:`2026-10-02`,chapter:`存储系统 · 程序的局部性`,tags:[`空间局部性`,`时间局部性`,`数组按行存放`,`Cache`],summary:`给出按行优先访问、且按行存放的二维数组求平均值的程序，判断数组与循环变量的局部性。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 3～4 页（卷面第 2～3 页）第 15 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`函数 matrix_avg 按行优先顺序访问按行存放的二维数组 M，每个数组元素只访问一次；变量 i、j 和 sum 保存在寄存器中。关于该程序局部性的叙述，正确的是（　）。

~~~text
float matrix_avg() {
    int i, j;
    float sum = 0.0, avg;
    for (i = 0; i < 200; i++)
        for (j = 0; j < 200; j++)
            sum += M[i][j];
    avg = sum / (200 * 200);
    return avg;
}
~~~

- A．数组 M 具有较好的空间局部性但时间局部性较差，变量 i、j 和 sum 具有较好的时间局部性
- B．数组 M 空间局部性差、时间局部性好，变量时间局部性差
- C．数组 M 的空间局部性和时间局部性都好，变量时间局部性差
- D．数组 M 的空间局部性和时间局部性都差，变量时间局部性好`,attachments:[{name:`查看原卷试题页（第 4 页，含第 15～21 题）`,path:`mock-exam-3/co-os-page-04.png`}],solution:{answer:String.raw`**选 A（数组 M 空间局部性好、时间局部性差；变量 i、j、sum 时间局部性好）。**`,explanation:String.raw`## 1. 数组 M 的局部性

- **空间局部性（好）：** 数组按行存放，程序又按行优先（$j$ 内层、连续递增）访问 $M[i][j]$。相邻两次访问落在相邻（或同一 Cache 块内）的地址上，故空间局部性好。
- **时间局部性（差）：** 题设明确“每个数组元素只访问一次”，元素用过即不再用，因此对 M 而言时间局部性差。

## 2. 变量 i、j、sum 的局部性

- 它们位于寄存器中，被同一循环反复读写：$i$ 每轮外层、$j$ 每轮内层、sum 每次累加都访问一次，短时间内高频重复使用，**时间局部性好**。
- 它们是标量，不涉及“空间上成片访问”，但本题只问时间局部性，答案为“较好”。

## 3. 结论

$$
\text{M：空间局部性好、时间局部性差};\qquad
\text{i、j、sum：时间局部性好}.
$$

恰好对应 A。`,pitfalls:String.raw`- 见到“数组连续访问”就下结论“空间、时间局部性都好”（误选 B/C）：元素只访问一次，时间局部性并不好。
- 忽略“变量保存在寄存器中”这一提示：寄存器复用本身就是极强的时间局部性。
- 注意三个选项 A、B、C 关于 M 的描述不同，务必逐项对照题干“只访问一次”。`}},{id:`mock-exam-3-co-q16`,questionNumber:16,title:`指令级并行技术辨析`,type:`题目`,date:`2026-10-02`,chapter:`指令流水线 · 指令级并行`,tags:[`超标量`,`多发射`,`超流水线`,`静态调度`,`动态调度`],summary:`判断超流水线、多发射、静态多发射与超标量技术的叙述中哪一项错误。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 4 页（卷面第 3 页）第 16 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于指令级并行技术的描述，错误的是（　）。

- A．超流水线技术通过增加流水线功能段数目来提高主频，从而提升性能
- B．多发射技术通过复制内部功能部件，使流水线每个时钟周期能处理多条指令
- C．静态多发射技术中，硬件动态处理流水线运行中的冲突
- D．超标量技术属于动态多发射，由硬件处理冲突，对编译器要求较低`,attachments:[{name:`查看原卷试题页（第 4 页，含第 15～21 题）`,path:`mock-exam-3/co-os-page-04.png`}],solution:{answer:String.raw`**选 C。**`,explanation:String.raw`## 1. 概念对照

- **超流水线（A 正确）：** 把每个功能段再细分，段数增多、时钟周期变短，主频提高，从而提升吞吐率。
- **多发射（B 正确）：** 复制取指、译码、执行等功能部件，使一个时钟周期内可发射并处理多条指令。
- **静态多发射（C 错误）：** “静态”指发射决策由**编译器**在编译期确定，冲突（数据相关、结构相关）由编译器通过指令调度/插入空操作等静态方式消除或规避，**不是硬件动态处理**。硬件动态处理冲突属于动态多发射。
- **超标量（D 正确）：** 超标量是“每个周期发射多条指令、由硬件动态调度与解决冲突”，属动态多发射，把复杂度放到硬件，因此对编译器要求相对较低。

## 2. 一个对照表（要点）

- 静态多发射：编译器调度 → 对编译器要求高，硬件简单。
- 动态多发射（超标量/超长指令字以外的硬件调度）：硬件调度 → 对编译器要求低，硬件复杂。

C 把“静态”与“硬件动态处理”拼在一起，自相矛盾。`,pitfalls:String.raw`- 混淆“静态多发射”与“动态多发射”的决策主体：静态=编译器，动态=硬件。
- 误以为超流水线靠“复制部件”（那是多发射），超流水线靠的是“细分功能段、提高主频”。
- 记反超标量对编译器的要求：动态调度下编译器负担轻。`}},{id:`mock-exam-3-co-q17`,questionNumber:17,title:`按字节编址下数组下标的推算`,type:`题目`,date:`2026-10-02`,chapter:`指令系统 · 寻址方式与数据通路`,tags:[`按字节编址`,`数组地址`,`int 占 4B`,`地址计算`],summary:`已知数组首地址与本次访问地址，按 int 占 4B 推算当前循环的数组下标。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 4 页（卷面第 3 页）第 17 题；卷面未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`在 32 位按字节编址的计算机中，某 int 型数组 F 的首地址存放在寄存器 R0 中，其值为 8000H。寄存器 R1 用于保存当前访问元素的数组下标，初值为 0。程序每次循环按下标递增的顺序访问一个数组元素，访问完成后 R1 的内容加 1。每个 int 型数据占 4B。若某次循环所访问元素的地址为 8060H，则进入该次循环时寄存器 R1 的内容是（　）。

- A．10
- B．15
- C．24
- D．30`,attachments:[{name:`查看原卷试题页（第 4 页，含第 15～21 题）`,path:`mock-exam-3/co-os-page-04.png`}],solution:{answer:String.raw`**选 C（24）。**`,explanation:String.raw`## 1. 关键：按下标递增访问，地址差正比于下标

数组元素地址 $=$ 首地址 $+$ 下标 $\times$ 每元素字节数。

$$
\text{下标}=\frac{\text{本次地址}-\text{首地址}}{\text{每元素字节数}}
=\frac{8060\mathrm{H}-8000\mathrm{H}}{4}.
$$

## 2. 代入

$$
8060\mathrm{H}-8000\mathrm{H}=60\mathrm{H}=6\times16=96\ (\text{十进制}),
\qquad \frac{96}{4}=24.
$$

所以进入该次循环时 R1 $=24$。

## 3. 脚本复核（.cache/lion-3/verify.py 实际输出）

~~~text
=== Q17 地址 8060H -> R1 ===
(0x8060-0x8000)=96=96  每个int 4B -> R1=24  => C
~~~`,pitfalls:String.raw`- 忘记 int 占 4B，直接用 $60\mathrm{H}=96$ 当答案（96 不在选项中，属干扰）。
- 把 $60\mathrm{H}$ 按十进制读成 60，再除以 4 得 15（错选 B）。
- 忽略“按字节编址”而按字编址算，导致重复整除。`}},{id:`mock-exam-3-co-q18`,questionNumber:18,title:`CPU 控制器的组成部件`,type:`题目`,date:`2026-10-02`,chapter:`中央处理器 · 控制器的组成`,tags:[`控制器`,`运算器`,`IR`,`PC`,`ALU`,`ID`],summary:`分辨指令寄存器、程序计数器、算术逻辑单元、指令译码器中哪个不属于控制器。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 4 页（卷面第 3 页）第 18 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列部件中，不属于 CPU 控制器的是（　）。

- A．指令寄存器 IR
- B．程序计数器 PC
- C．算术逻辑单元 ALU
- D．指令译码器 ID`,attachments:[{name:`查看原卷试题页（第 4 页，含第 15～21 题）`,path:`mock-exam-3/co-os-page-04.png`}],solution:{answer:String.raw`**选 C。**`,explanation:String.raw`## 1. CPU 的两大部件

CPU 由**运算器**与**控制器**组成：

- 运算器：算术逻辑单元 ALU、累加器、通用寄存器、程序状态字（PSW）等，负责数据加工。
- 控制器：程序计数器 PC、指令寄存器 IR、指令译码器 ID、微操作信号发生器、时序系统等，负责取指、译码、发控制命令。

## 2. 逐项判断

- A 指令寄存器 IR：控制器部件（暂存当前指令）。
- B 程序计数器 PC：控制器部件（存放下一条指令地址）。
- C 算术逻辑单元 ALU：**运算器**核心部件，不属于控制器。✔
- D 指令译码器 ID：控制器部件（分析操作码）。

因此选 C。`,pitfalls:String.raw`- 把 IR、PC、ID 误当运算器零件；其实它们都是控制器的典型成员。
- 把 ALU 划进控制器：ALU 完成加减移位等运算，属运算器。`}},{id:`mock-exam-3-co-q19`,questionNumber:19,title:`指令序列中的 RAW 冒险判断`,type:`题目`,date:`2026-10-02`,chapter:`指令流水线 · 数据冒险`,tags:[`RAW 冒险`,`数据相关`,`流水线`,`寄存器读写`],summary:`给定 STORE、LOAD、ADD 三条指令，判断哪两条之间存在 RAW 数据冒险。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 4 页（卷面第 3 页）第 19 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`流水线执行以下指令序列时，会发生 RAW 冒险的是（　）。

~~~text
I1: STORE R1, [R2]   # MEM(R2) = R1
I2: LOAD  R3, [R4]   # R3 = MEM(R4)
I3: ADD   R5, R1, R3 # R5 = (R1) + (R3)
~~~

- A．I1 与 I2 之间
- B．I2 与 I3 之间
- C．I1 与 I3 之间
- D．无 RAW 冒险`,attachments:[{name:`查看原卷试题页（第 4 页，含第 15～21 题）`,path:`mock-exam-3/co-os-page-04.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 1. RAW 的定义

RAW（Read After Write，写后读）指**先写、后读**同一寄存器：前一条指令写入某寄存器，后一条指令要读它。顺序必须是“写在前、读在后”，后读拿到的应是前写的新值。

## 2. 逐对检查

- **I1 与 I2：** I1 读 R1、R2，写内存；I2 读 R4，写 R3。寄存器之间无“写后读”关系，无 RAW。
- **I1 与 I3：** I1 读 R1（不写 R1），I3 读 R1、R3。没有“先写后读”，无 RAW（注意 I1 操作的是内存，不是 R1 的写入）。
- **I2 与 I3：** I2 写 **R3**，I3 要读 **R3** —— 这正是写后读，存在 RAW 冒险。

## 3. 要点

RAW 只看“**写寄存器** → 后一条**读同一寄存器**”。I1 是 STORE，写的是存储器而非 R1，别误把它当写 R1。`,pitfalls:String.raw`- 把 I1 的 STORE 误认为“写 R1”，从而错选 C。STORE 的第 1 个操作数是**读出**源寄存器 R1。
- 只盯 I1、I2、I3 的寄存器号表面重合，忽略读写方向。
- 数据冒险除 RAW 外还有 WAR、WAW，但按序流水线中主要考 RAW，本题只问 RAW。`}},{id:`mock-exam-3-co-q20`,questionNumber:20,title:`CPU 响应中断请求的必要条件`,type:`题目`,date:`2026-10-02`,chapter:`输入/输出系统 · 中断`,tags:[`中断请求`,`中断允许`,`指令周期`,`中断优先级`],summary:`列出设备请求、中断允许标志、当前指令结束、无更高优先请求四项，判断响应中断的必要条件。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 4 页（卷面第 3 页）第 20 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`CPU 响应某个 I/O 设备提出的中断请求的必要条件有（　）。

I．该设备提出中断请求

II．CPU 的中断允许标志为 1

III．当前指令执行结束

IV．没有优先级更高且允许响应的中断请求同时等待处理

- A．I、II
- B．I、II、III
- C．I、II、IV
- D．I、II、III、IV`,attachments:[{name:`查看原卷试题页（第 4 页，含第 15～21 题）`,path:`mock-exam-3/co-os-page-04.png`}],solution:{answer:String.raw`**选 D（I、II、III、IV）。**`,explanation:String.raw`## 1. 逐条判断

- **I 必要：** 设备没有提出中断请求，CPU 自然无从响应。
- **II 必要：** 中断允许标志（IF）为 1（开中断）才允许响应可屏蔽中断；关中断期间请求被屏蔽。
- **III 必要：** CPU 通常在**当前指令执行结束后**才检测并响应中断，以保证指令的完整性。
- **IV 必要：** 当有多个中断同时等待时，只能先响应其中优先级最高且满足条件的那个；存在更高优先级请求时，本次不响应。

## 2. 小结

响应某设备的中断请求 = “有请求 + 允许 + 指令边界 + 在竞争中最优先”，四项缺一不可。

$$
\text{响应}=
\text{请求}\wedge\text{IF=1}\wedge\text{指令结束}\wedge\text{优先}.
$$`,pitfalls:String.raw`- 认为“有请求 + 开中断”就够了，漏掉指令执行结束（选 A）。
- 忽略优先级竞争，据前三条就选 B。
- 把“非屏蔽中断”与本题的“可屏蔽中断”混谈：本题含“中断允许标志”一项，指可屏蔽中断。`}},{id:`mock-exam-3-co-q21`,questionNumber:21,title:`DMA 传送方式的正确叙述`,type:`题目`,date:`2026-10-02`,chapter:`输入/输出系统 · DMA`,tags:[`DMA`,`总线周期窃取`,`中断通知`,`开中断`],summary:`判断 DMA 初始化、请求响应、总线周期窃取与结束中断通知四条叙述的正误。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 4～5 页（卷面第 3～4 页）第 21 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`某计算机采用 DMA 方式将磁盘中的一块数据读入主存，传送结束后通过中断通知 CPU。下列叙述中，正确的是（　）。

I．启动传送前，CPU 需向 DMA 控制器设置主存起始地址、传送字数及传送方向等信息

II．DMA 控制器提出的数据传送请求，只有在 CPU 处于开中断状态时才能得到响应

III．每传送一个数据，DMA 控制器会挪用（窃取）一个总线周期

IV．传送结束后，DMA 控制器通过中断方式通知 CPU

- A．仅 I、III、IV
- B．仅 I、II、III
- C．仅 II、IV
- D．I、II、III、IV`,attachments:[{name:`查看原卷试题页（第 5 页，含第 21～26 题）`,path:`mock-exam-3/co-os-page-05.png`}],solution:{answer:String.raw`**选 A（仅 I、III、IV）。**`,explanation:String.raw`## 1. 逐条判断

- **I 正确。** DMA 传送前须由 CPU 做**初始化**：向 DMA 控制器写入主存起始地址、传送字数（计数器初值）、传送方向（读/写）以及设备地址等。
- **II 错误。** DMA 请求占用的是**总线**，与 CPU 是否开中断无关。DMA 控制器在需要传送时直接向总线仲裁器提出总线请求（HLDA/BR 等），CPU 在**当前总线周期结束后**让出总线即可，无需开中断。开中断只影响可屏蔽中断，不影响 DMA 总线请求。
- **III 正确。** 在周期窃取（cycle stealing）方式下，DMA 每传一个数据就占用（窃取）一个总线周期，CPU 暂时挂起。
- **IV 正确。** 整块数据传送完毕，DMA 控制器以**中断**方式通知 CPU 做善后处理。

## 2. 关键区分

$$
\text{DMA 请求}\ \perp\ \text{中断允许标志}.
$$

DMA 走总线请求/总线响应握手，不走中断允许流程；这正是 II 的陷阱。`,pitfalls:String.raw`- 把 DMA 请求当成中断请求，误以为要看开中断（错选含 II 的 B、C、D）。
- 忽略初始化步骤 I，以为 DMA 能自行知道地址与长度。
- 混淆“周期窃取”与“成组传送”两种 DMA 方式，但本题 III 只问是否挪用总线周期，仍正确。`}},{id:`mock-exam-3-co-q22`,questionNumber:22,title:`总线定时与事务方式辨析`,type:`题目`,date:`2026-10-02`,chapter:`总线 · 总线定时与事务`,tags:[`同步定时`,`异步全互锁`,`半同步定时`,`分离事务总线`],summary:`判断同步、异步全互锁、半同步与分离事务四种总线方式的叙述中哪项错误。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 5 页（卷面第 4 页）第 22 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于总线定时与事务方式的叙述中，错误的是（　）。

- A．同步定时使用统一时钟，适合速度相近的部件
- B．异步全互锁方式中，请求信号与回答信号的撤销相互制约，可靠性较高
- C．半同步定时保留统一时钟，并可借助 WAIT 等信号适应较慢设备
- D．分离事务总线中，主设备发出请求后必须一直占有总线，直到从设备准备好数据`,attachments:[{name:`查看原卷试题页（第 5 页，含第 21～26 题）`,path:`mock-exam-3/co-os-page-05.png`}],solution:{answer:String.raw`**选 D。**`,explanation:String.raw`## 1. 逐项分析

- **A 正确。** 同步定时由统一时钟节拍控制，各部件动作与时钟对齐，实现简单，但要求各部件速度相近，否则慢部件拖长时钟或来不及响应。
- **B 正确。** 异步全互锁（全互锁握手）中，请求与回答信号的**置位与撤销都相互制约**：只有收到对方回答后才撤销请求，可靠性高，代价是握手环节多、速度较慢。
- **C 正确。** 半同步定时在同步基础上引入 WAIT（或类似）信号：快设备按统一时钟完成；慢设备通过 WAIT 让主设备延长等待，兼顾效率与适应性。
- **D 错误。** 分离事务（split transaction）总线的核心恰恰是**把一次事务拆成“请求”和“回答”两段，中间释放总线**，让其他主设备在从设备准备数据期间使用总线，从而提高总线利用率。所以“必须一直占有总线直到从设备准备好数据”与分离事务的定义相反（那是非分离事务的常规做法）。

## 2. 要点

分离事务 = 请求/回答解耦 + 中间释放总线 + 需标识发起者。D 把“释放”写成了“一直占有”，故为错误项。`,pitfalls:String.raw`- 把分离事务与非分离（普通）事务混淆，误认为主设备全程占线。
- 误判 B：异步全互锁确实靠双方信号相互制约，撤销也不自由，可靠性高但慢。
- 把半同步里的 WAIT 当成错误描述（它正是半同步的关键机制）。`}},{id:`mock-exam-3-os-q23`,questionNumber:23,title:`系统调用的基本概念`,type:`题目`,date:`2026-10-02`,chapter:`操作系统接口 · 系统调用`,tags:[`系统调用`,`核心态`,`用户态`,`库函数`,`PSW`],summary:`判断系统调用过程中 CPU 状态、现场保存、服务作用与库函数关系的正误。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 5 页（卷面第 4 页）第 23 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`以下关于系统调用的描述，正确的是（　）。

- A．系统调用时，CPU 状态始终处于核心态
- B．系统调用只需保存程序计数器（PC），一般函数调用需保存 PC 和程序状态字（PSW）
- C．系统调用是用户程序获取操作系统服务的主要方式
- D．所有库函数都封装了系统调用`,attachments:[{name:`查看原卷试题页（第 5 页，含第 21～26 题）`,path:`mock-exam-3/co-os-page-05.png`}],solution:{answer:String.raw`**选 C。**`,explanation:String.raw`## 1. 逐项分析

- **A 错误。** 用户程序在**用户态**执行一条访管/陷阱指令（如 trap、syscall）发起系统调用，CPU 才切换到核心态执行内核服务例程，返回时再回到用户态。发起前后都是用户态，不能称“始终处于核心态”。
- **B 错误。** 系统调用发生在用户态与核心态**切换**过程中，需要保存的不只是 PC，还包括 PSW（程序状态字/标志寄存器）及通用寄存器等现场；而且系统调用会切换堆栈。它对外表现为“比函数调用保存更多上下文”，B 说反了。
- **C 正确。** 系统调用是用户程序请求操作系统服务的**主要（标准）方式**，如文件 I/O、进程创建、存储分配等。
- **D 错误。** 并非所有库函数都封装系统调用：很多库函数（如纯计算类、字符串处理类）完全在用户态完成，不陷入内核。

## 2. 要点

$$
\text{系统调用}=\text{用户态发起}\to\text{核心态服务}+ \text{现场/堆栈切换}.
$$

库函数与系统调用是两套概念，只有一部分库函数内部使用了系统调用。`,pitfalls:String.raw`- 抓住“系统调用运行在核心态”就选 A，忽略“发起时刻在用户态”，被“始终”二字排除。
- 误认为系统调用比普通函数调用保存得更少（B 说反）。
- 以偏概全：把“部分库函数调用系统调用”推广为“所有”（D）。`}},{id:`mock-exam-3-os-q24`,questionNumber:24,title:`破坏“请求并保持”条件的措施`,type:`题目`,date:`2026-10-02`,chapter:`死锁 · 死锁预防`,tags:[`死锁预防`,`请求并保持`,`循环等待`,`不可剥夺`,`资源分配`],summary:`在四条破坏死锁条件的措施中，挑出真正破坏“请求并保持”条件的那些。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 5 页（卷面第 4 页）第 24 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列措施中，可以破坏死锁“请求并保持”条件的有（　）。

I．进程运行前一次性申请其所需的全部资源

II．进程申请新资源前先释放当前已占有的资源，随后重新申请

III．要求进程按资源编号递增顺序申请资源

IV．允许系统强制剥夺进程已占有的资源

- A．仅 I
- B．仅 II
- C．I、II
- D．I、II、III、IV`,attachments:[{name:`查看原卷试题页（第 5 页，含第 21～26 题）`,path:`mock-exam-3/co-os-page-05.png`}],solution:{answer:String.raw`**选 C（I、II）。**`,explanation:String.raw`## 1. 死锁的四个必要条件与对应破坏手段

- 互斥：一般难破坏。
- **请求并保持**：进程已持有资源又请求新资源而被阻塞。
- 不可剥夺：资源不能被强行夺走。
- 循环等待：存在资源等待环。

## 2. 逐条归类

- **I 破坏“请求并保持”：** 运行前一次性申请全部资源，进程不可能“一边持有、一边请求”，去掉了“保持”的同时请求。
- **II 破坏“请求并保持”：** 申请新资源前先释放已占有的资源，之后不再“持有并等待”，也去掉了该条件。
- **III 破坏“循环等待”：** 按编号递增申请，保证资源等待不成环，属破坏循环等待，不是破坏请求并保持。
- **IV 破坏“不可剥夺”：** 允许强制剥夺已占资源，针对的是不可剥夺条件。

## 3. 结论

针对“请求并保持”的只有 I、II，故选 C。`,pitfalls:String.raw`- 把 III（资源有序分配，破坏循环等待）和 IV（剥夺，破坏不可剥夺）也算进“请求并保持”（错选 D）。
- 认为 I 属于“破坏互斥”，其实它是消除“持有同时请求”。
- 记混四种破坏手段与四个条件的对应关系。`}},{id:`mock-exam-3-os-q25`,questionNumber:25,title:`银行家算法中请求的可分配性判断`,type:`题目`,date:`2026-10-02`,chapter:`死锁 · 银行家算法`,tags:[`银行家算法`,`安全序列`,`资源请求`,`避免死锁`],summary:`给出可用资源向量与各进程分配/最大需求表，判断 P2 的请求能否分配及安全性检查结论。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 5 页（卷面第 4 页）第 25 题；卷面未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`某系统采用银行家算法避免死锁，系统中有 A、B、C 三类资源。当前可利用资源向量为 Available = (2, 1, 1)，各进程的资源分配情况和最大需求如下表所示。

- P0：Allocation = (1, 1, 0)，Max = (4, 2, 1)
- P1：Allocation = (2, 0, 0)，Max = (6, 3, 3)
- P2：Allocation = (1, 0, 0)，Max = (2, 1, 1)
- P3：Allocation = (0, 1, 2)，Max = (4, 3, 3)

此时 P2 提出资源请求 Request2 = (1, 0, 1)。下列说法中，正确的是（　）。

- A．请求量超过当前可利用资源，不能分配
- B．试分配后系统仍处于安全状态，一个安全序列为 P2、P0、P3、P1
- C．请求量未超过当前可利用资源，因此无须进行安全性检查即可分配
- D．试分配后 P0 无法立即完成，因而系统处于不安全状态

![第 25 题资源分配表](mock-exam-3/co-q25-table.png)`,attachments:[{name:`查看原卷试题页（第 5 页，含第 21～26 题）`,path:`mock-exam-3/co-os-page-05.png`},{name:`查看第 25 题资源分配表`,path:`mock-exam-3/co-q25-table.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 1. 先求各进程还需资源 Need = Max − Allocation

$$
\begin{aligned}
\text{Need}(P0)&=(4,2,1)-(1,1,0)=(3,1,1),\\
\text{Need}(P1)&=(6,3,3)-(2,0,0)=(4,3,3),\\
\text{Need}(P2)&=(2,1,1)-(1,0,0)=(1,1,1),\\
\text{Need}(P3)&=(4,3,3)-(0,1,2)=(4,2,1).
\end{aligned}
$$

## 2. 检查请求是否合法

Request2 $=(1,0,1)$：

- 与 Need(P2) 比较：$(1,0,1)\le(1,1,1)$，合法；
- 与 Available 比较：$(1,0,1)\le(2,1,1)$，合法。

故 A“超过可利用资源”错误；C“无须安全性检查”也错误——即便资源足够，也必须试分配后做安全性检查。

## 3. 试分配

给 P2 后：

$$
\text{Available}'=(2,1,1)-(1,0,1)=(1,1,0),\quad
\text{Allocation}'(P2)=(2,0,1),\quad
\text{Need}'(P2)=(0,1,0).
$$

## 4. 安全性检查（Work 初值 = Available' = (1,1,0)）

- **P2**：Need $(0,1,0)\le(1,1,0)$ → 可完成，Work $=(1,1,0)+(2,0,1)=(3,1,1)$。
- **P0**：Need $(3,1,1)\le(3,1,1)$ → 可完成，Work $=(3,1,1)+(1,1,0)=(4,2,1)$。
- **P3**：Need $(4,2,1)\le(4,2,1)$ → 可完成，Work $=(4,2,1)+(0,1,2)=(4,3,3)$。
- **P1**：Need $(4,3,3)\le(4,3,3)$ → 可完成。

存在安全序列 **P2、P0、P3、P1**，系统安全，B 正确。D 的“P0 无法立即完成”本身不影响安全性（P0 可在 P2 释放后再完成）。

## 5. 脚本复核（.cache/lion-3/verify.py 实际输出）

~~~text
=== Q25 银行家算法 Request2=(1,0,1) ===
Need: {'P0': (3,1,1), 'P1': (4,3,3), 'P2': (1,1,1), 'P3': (4,2,1)} Available: (2,1,1)
Request2= (1,0,1)  <= Need2 (1,1,1) ? True  <= Available? True
试分配后: (2,0,1) (0,1,0) Avail: (1,1,0)
安全序列: ['P2', 'P0', 'P3', 'P1'] work= (6,3,3) => 安全，B 正确
~~~`,pitfalls:String.raw`- 只做“请求 ≤ Available”的粗检就下结论（选 C），漏掉安全性检查。
- 误以为“某个进程当前不能立即完成”就不安全（选 D）；安全性看的是**存在**一条安全序列，而非所有进程当前都能完成。
- 忘记先算 Need，直接用 Max 与 Available 比较，导致判断错乱。`}},{id:`mock-exam-3-os-q26`,questionNumber:26,title:`UNIX 父子进程的共享资源`,type:`题目`,date:`2026-10-02`,chapter:`进程管理 · 进程的创建与共享`,tags:[`fork`,`父子进程`,`文件表项`,`代码段`,`写时复制`],summary:`判断 fork 后父子进程通常共享打开文件表项、执行上下文、只读代码段与栈空间中的哪些。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 5 页（卷面第 4 页）第 26 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`在 UNIX 系统中，父子进程通常共享的是（　）。

I．打开的文件表项

II．进程的执行上下文

III．内存中的代码段（只读）

IV．栈空间

- A．I、II
- B．I、III
- C．II、IV
- D．III、IV`,attachments:[{name:`查看原卷试题页（第 5 页，含第 21～26 题）`,path:`mock-exam-3/co-os-page-05.png`}],solution:{answer:String.raw`**选 B（I、III）。**`,explanation:String.raw`## 1. fork 之后发生了什么

- 子进程获得父进程地址空间的一份**副本**（现代 UNIX 用写时复制 COW 实现，逻辑上各自独立）。
- 子进程**复制**父进程的打开文件描述符表，指向**同一**系统打开文件表项（file table entry），因此父子进程共享文件偏移量等状态。
- 只读的**代码段**（正文段）通常被父子进程共享，只读不写，安全且省内存。
- 每个进程有**独立的**执行上下文（寄存器、PSW、栈、内核栈等）——否则无法各自独立调度运行。

## 2. 逐条判断

- **I 正确：** 打开的文件表项（打开文件表中有共享的读写指针）为父子共享。
- **II 错误：** 执行上下文（进程控制块中的处理器现场）各自独立。
- **III 正确：** 只读代码段为共享。
- **IV 错误：** 栈空间各自独立（各自有自己的用户栈）。

故 I、III 共享，选 B。`,pitfalls:String.raw`- 把“子进程复制地址空间”理解成“栈也共享”（选 D）。
- 误认为执行上下文可以共享（选 A、C）。
- 忽略“只读代码段”这一常见共享项。`}},{id:`mock-exam-3-os-q27`,questionNumber:27,title:`Belady 异常的适用条件`,type:`题目`,date:`2026-10-02`,chapter:`虚拟内存 · 页面置换算法`,tags:[`Belady 异常`,`FIFO`,`LRU`,`OPT`,`页面置换`],summary:`判断在何种页面置换算法与物理块数变化组合下可能出现 Belady 异常。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 6 页（卷面第 5 页）第 27 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列情况中，可能出现 Belady 异常的是（　）。

- A．采用 FIFO 页面置换算法时增加物理页框数
- B．采用 LRU 算法时减少物理页框数
- C．采用 OPT 算法时增加物理页框数
- D．采用 LRU 算法时增加物理页框数`,attachments:[{name:`查看原卷试题页（第 6 页，含第 27～32 题）`,path:`mock-exam-3/co-os-page-06.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`## 1. Belady 异常的定义

Belady 异常指：分配的物理页框数**增多**，缺页次数反而**增加**的反常现象。

## 2. 哪些算法会出现

- **FIFO 会出现** Belady 异常（经典反例是访问串 $1,2,3,4,1,2,5,1,2,3,4,5$，3 个页框比 4 个页框缺页更少）。
- **LRU、OPT 不会出现**：它们属于“栈式算法”（stack algorithm），页框数增加时任一时刻驻留页集合是增大前的超集，缺页次数单调不增。

## 3. 逐项判断

- A：FIFO + 增加页框 → 可能出现 Belady 异常。✔
- B：LRU + 减少页框 → 减少页框本就可能缺页增多，且 LRU 无 Belady 异常，不符合“框多反而缺页多”的定义。
- C：OPT + 增加页框 → OPT 是栈式最优算法，不会出现。
- D：LRU + 增加页框 → 不会出现。

因此只有 A。`,pitfalls:String.raw`- 把“减少页框导致缺页增多”当成 Belady 异常（选 B）：Belady 异常特指“页框**增多**缺页反增”。
- 误以为 OPT 也会出现（选 C）：OPT 是理论最优、栈式，绝不出现。
- 记错 LRU 的性质：LRU 属于栈式算法，不会出现 Belady 异常。`}},{id:`mock-exam-3-os-q28`,questionNumber:28,title:`可变分配全局置换的缺页处理`,type:`题目`,date:`2026-10-02`,chapter:`虚拟内存 · 物理块分配与置换策略`,tags:[`可变分配`,`全局置换`,`缺页`,`物理块分配`],summary:`判断可变分配全局置换策略下，某进程缺页时系统从何处取页框、是否改变其物理块数。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 6 页（卷面第 5 页）第 28 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`在一个请求分页系统中，有三个进程 P1、P2、P3。系统采用可变分配全局置换策略。初始时，P1 分配到 3 个物理块，P2 分配到 4 个物理块，P3 分配到 3 个物理块。当 P1 发生缺页中断时，系统的处理方式是（　）。

- A．只从 P1 已有的 3 个物理块中置换一页，不增加其物理块数
- B．从系统空闲物理块中分配给 P1，或从 P1、P2、P3 的所有页面中选择置换，可能增加 P1 的物理块数
- C．从 P1 已有的页面中置换，同时根据 P1 的缺页率调整其物理块数，但不涉及 P2、P3 的页面
- D．直接终止 P1 的运行`,attachments:[{name:`查看原卷试题页（第 6 页，含第 27～32 题）`,path:`mock-exam-3/co-os-page-06.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 1. 三种分配策略对照

- **固定分配局部置换：** 进程的物理块数固定，缺页时只在本进程页中置换。
- **可变分配全局置换：** 进程物理块数可变；缺页时先看有无**空闲物理块**，有就直接分配给它（进程块数增加）；若无空闲块，则从**整个系统（所有进程）**的页面中按算法选一页换出，可能选到别的进程的页，被换出页的进程块数减少、P1 的块数不变或增加。
- **可变分配局部置换：** 块数可变但只在本进程内置换，按缺页率调整。

## 2. 逐项判断

- A：只在本进程置换、块数不变 → 是固定分配局部置换，不符。
- **B：先取空闲块，否则从所有进程页面中选页置换，可能增加 P1 的块数 → 正是可变分配全局置换。✔**
- C：在本进程内置换并按缺页率调整、不涉及其他进程 → 是可变分配局部置换。
- D：无此策略。

## 3. 关键词

“**全局**”= 置换范围是所有进程的页面；“**可变**”= 进程物理块数可增减。二者合起来即 B。`,pitfalls:String.raw`- 混淆“全局置换”与“局部置换”：全局置换的候选页来自整个系统，可能换出其他进程的页。
- 把“可变分配局部置换”（选项 C）误当全局置换。
- 忽略“有空闲块时直接分配”这一路径（B 的前半句）。`}},{id:`mock-exam-3-os-q29`,questionNumber:29,title:`双缓冲方式下处理数据块的总时间`,type:`题目`,date:`2026-10-02`,chapter:`输入/输出管理 · 缓冲技术`,tags:[`双缓冲`,`设备输入`,`传送`,`CPU 处理`,`流水线时间`],summary:`给定输入、传送、处理单块耗时，计算双缓冲下处理 20 个数据块的总时间。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 6 页（卷面第 5 页）第 29 题；卷面未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`某进程采用双缓冲方式连续读取并处理 20 个数据块。输入设备将一个数据块送入系统缓冲区需要 8ms，将一个数据块从系统缓冲区传送到用户工作区需要 2ms，CPU 处理用户工作区中的一个数据块需要 5ms。对同一个数据块，传送到用户工作区和 CPU 处理必须依次进行；输入设备可以同时向另一个系统缓冲区输入下一数据块。初始时两个缓冲区均为空，忽略缓冲区切换及其他开销。从输入设备开始传送第 1 个数据块，到 CPU 处理完第 20 个数据块，共需要（　）。

- A．160ms
- B．167ms
- C．260ms
- D．300ms`,attachments:[{name:`查看原卷试题页（第 6 页，含第 27～32 题）`,path:`mock-exam-3/co-os-page-06.png`}],solution:{answer:String.raw`**选 B（167ms）。**`,explanation:String.raw`## 1. 判断瓶颈

- 输入设备每块耗时 $8$ ms；
- 从系统缓冲区到用户工作区传送并处理每块耗时 $2+5=7$ ms。

因为 $8>7$，**输入设备是瓶颈**：CPU 侧总能赶在下一块输入完成前处理完。

## 2. 时间线

- 第 1 块：设备从 $0$ 开始输入，$8$ ms 时送入缓冲区 → 传送 $2$ ms（$8\!\sim\!10$）→ 处理 $5$ ms（$10\!\sim\!15$），第 1 块处理完于 $15$ ms。
- 第 2 块设备在 $16$ ms 就绪；此时用户工作区已空，$16\!\sim\!18$ 传送、$18\!\sim\!23$ 处理，处理完于 $23$ ms。
- 一般地，第 $k$ 块在 $8k$ ms 就绪，处理完毕于 $8k+7$ ms，且 $8(k-1)+7=8k-1<8k$，无等待。

## 3. 公式

$$
T=8\times20+2+5=160+7=167\ \text{ms}.
$$

即：全部输入时间 $160$ ms，再加上**最后一块**的传送与处理 $7$ ms（前 19 块的传送与处理都与后续输入重叠）。

## 4. 脚本复核（.cache/lion-3/verify.py 实际输出）

~~~text
=== Q29 双缓冲 20 块 8/2/5 ms ===
device finish times 1..3: [8, 16, 24] last: 160
total = 167 ms  (公式 8 + 19*8 + 2 + 5 = 167)  => B
~~~`,pitfalls:String.raw`- 把传送与处理当成与输入完全串行，算成 $20\times(8+2+5)=300$ ms（选项 D）。
- 忽略“最后一块”仍需传送+处理，直接答 $160$ ms（选项 A）。
- 误按 CPU 为瓶颈叠加，得 $260$ ms（选项 C）：因为 $8>7$，瓶颈是设备而非 CPU。`}},{id:`mock-exam-3-os-q30`,questionNumber:30,title:`设备驱动程序的职责范围`,type:`题目`,date:`2026-10-02`,chapter:`输入/输出管理 · 设备驱动程序`,tags:[`设备驱动程序`,`中断处理`,`I/O 软件层次`,`抽象命令`],summary:`判断设备驱动程序四项职责中哪些正确，特别是中断现场保护与优先级判定是否属其职责。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 6 页（卷面第 5 页）第 30 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`下列关于设备驱动程序功能的叙述中，正确的是（　）。

I．接收设备无关软件传来的命令和参数

II．把抽象 I/O 命令转换为设备相关的操作序列

III．根据设备状态启动设备或阻塞请求进程

IV．独立完成所有中断的现场保护、优先级判定和中断返回

- A．I、II、III
- B．I、II、IV
- C．II、III、IV
- D．I、II、III、IV`,attachments:[{name:`查看原卷试题页（第 6 页，含第 27～32 题）`,path:`mock-exam-3/co-os-page-06.png`}],solution:{answer:String.raw`**选 A（I、II、III）。**`,explanation:String.raw`## 1. I/O 软件的层次

通常自下而上为：硬件 → **中断处理程序** → **设备驱动程序** → 设备无关软件 → 用户层 I/O 软件。

- 设备驱动程序的职责：把上层（设备无关软件）给出的**抽象命令**翻译成对设备寄存器/控制器的**具体操作**，检查设备状态并启动设备，必要时阻塞请求进程等待 I/O 完成。
- **中断处理**（保护现场、判定优先级、执行中断服务例程、中断返回）由操作系统的**中断处理程序**完成，不属于设备驱动程序独立承担的职责。

## 2. 逐条判断

- I 正确：接收设备无关软件传来的命令与参数。
- II 正确：把抽象 I/O 命令转换为设备相关操作序列。
- III 正确：读写设备状态寄存器、按状态启动设备或阻塞进程。
- IV 错误：中断的现场保护、优先级判定与中断返回由中断处理程序/内核完成，说设备驱动程序“独立完成所有中断处理”夸大了其职责。

故 I、II、III 正确，选 A。`,pitfalls:String.raw`- 把中断处理程序的功能算进设备驱动程序（错选含 IV 的 B、C、D）。
- 忽略设备驱动程序也要“接收参数并检查设备状态”。
- 混淆“设备无关软件”与“设备驱动程序”的职责边界。`}},{id:`mock-exam-3-os-q31`,questionNumber:31,title:`利用局部性原理的机制辨别`,type:`题目`,date:`2026-10-02`,chapter:`内存管理 · 局部性原理与虚拟存储`,tags:[`局部性原理`,`虚拟存储`,`页面置换`,`惰性加载`],summary:`在程序部分装入、轮转调度、FIFO 置换、延迟删除四个现象中，找出利用局部性原理的那个。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 6 页（卷面第 5 页）第 31 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`以下利用到局部性原理的是（　）。

- A．程序加载时并不一次性将所有程序调入内存，而仅将程序的一部分装入内存
- B．在进程调度中采用轮转时间片算法
- C．采用 FIFO 策略的虚拟内存页面置换算法
- D．文件系统中删除一个文件，通常仅在元信息记录中做一个标记，并不真正抹去文件数据`,attachments:[{name:`查看原卷试题页（第 6 页，含第 27～32 题）`,path:`mock-exam-3/co-os-page-06.png`}],solution:{answer:String.raw`**选 A。**`,explanation:String.raw`## 1. 局部性原理回顾

程序在一段时间内往往只访问其地址空间的一部分（时间局部性 + 空间局部性）。正因为如此，才敢只装入一部分程序，其余部分按需调入。

## 2. 逐项判断

- **A 正确：** 这是**请求调页/虚拟存储**的“惰性装入”思想，其可行性完全建立在“程序执行具有局部性”之上——不用的部分不必常驻内存。
- B 错误：轮转时间片是**进程调度**策略，为公平与响应时间服务，与局部性无关。
- C 错误：FIFO 只是一种页面置换规则，它本身并不“利用”局部性（甚至还可能因不识别局部性而出现 Belady 异常）；LRU 才更依赖局部性。
- D 错误：删除文件只做标记（惰性/延迟删除），是文件系统的元数据管理与性能优化，并非利用程序局部性。

故 A。`,pitfalls:String.raw`- 看到“虚拟内存页面置换”就选 C：题目问的是“利用局部性”，FIFO 恰恰是**不**考虑局部性的算法。
- 把“延迟删除/惰性删除”误当局部性（选 D）。
- 把进程调度的轮转算法与局部性混为一谈（选 B）。`}},{id:`mock-exam-3-os-q32`,questionNumber:32,title:`索引结点支持的最大文件长度`,type:`题目`,date:`2026-10-02`,chapter:`文件管理 · 文件的物理结构`,tags:[`索引结点`,`直接地址`,`一级间接`,`最大文件长度`],summary:`已知块大小与地址长度、直接与一级间接地址项数目，计算索引结构支持的最大文件长度。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 6 页（卷面第 5 页）第 32 题；卷面未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`某文件系统的物理块大小为 1KB，每个磁盘地址占 4B。文件索引结点含 10 个直接地址项和 1 个一级间接地址项，不考虑索引结点本身占用的空间，则该结构支持的最大文件长度为（　）。

- A．256KB
- B．266KB
- C．1MB
- D．1.01MB`,attachments:[{name:`查看原卷试题页（第 6 页，含第 27～32 题）`,path:`mock-exam-3/co-os-page-06.png`}],solution:{answer:String.raw`**选 B（266KB）。**`,explanation:String.raw`## 1. 一个索引块能放多少地址

每个地址 4B，索引块 1KB：

$$
\text{一个索引块可放地址数}=\frac{1024\mathrm{B}}{4\mathrm{B}}=256.
$$

## 2. 各部分能寻址的数据量

- 10 个直接地址项：$10\times1\text{KB}=10$ KB。
- 1 个一级间接地址项：它指向一个索引块，该块含 256 个地址，各指向一个数据块，故可寻址 $256\times1\text{KB}=256$ KB。

## 3. 合计

$$
10\text{KB}+256\text{KB}=266\text{KB}.
$$

## 4. 脚本复核（.cache/lion-3/verify.py 实际输出）

~~~text
=== Q32 i-node 10 direct + 1 single indirect, block 1KB, addr 4B ===
10*1KB=10KB + 256*1KB=256KB = 272384B = 266KB  => B
~~~`,pitfalls:String.raw`- 直接用 $256$ KB 当答案，忘加 10 个直接地址项（想选接近的 A，但 A 只有 256KB）。
- 把“一级间接”当成“多级间接”反复乘，得 $256\times256$ KB（远超选项）。
- 忽略地址占 4B、索引块能放 $1024/4=256$ 个地址这一关键换算（误选 C、D）。`}},{id:`mock-exam-3-co-q43`,questionNumber:43,title:`双字节指令的偏移量、寻址方式与数据 Cache 分析`,type:`题目`,date:`2026-10-02`,chapter:`指令系统 / 存储系统 · 指令格式与数据 Cache`,tags:[`相对寻址`,`补码偏移`,`变址寻址`,`组相联 Cache`,`命中率`],summary:`根据双字节指令格式与一段循环程序，求相对转移偏移量、源操作数寻址方式，统计数据访问的命中情况并计算总访存时间。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 8～9 页（卷面第 7～8 页）第 43 题；卷面未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`（15 分）设下列程序中的指令均为双字节指令，格式如下。

- 第 1 字节：指令操作码（4bit）｜源操作数寻址方式（2bit）｜目的寄存器地址（2bit）
- 第 2 字节：Imm/Addr/Disp（8bit）

指令第二字节可表示 8 位立即数、绝对地址或相对位移。未带 H 后缀的立即数按十进制解释。相对转移位移采用 8 位补码、以字节为单位，并相对于该转移指令取指结束后的 PC 计算。程序从 00H 开始装入，R0～R3 为 4 个 8 位寄存器，R2 可作变址寄存器。第（3）、（4）问只统计循环中 10 次 ADD R0,[R2+2] 产生的数据读访问，指令由独立的指令 Cache 提供。

~~~text
start: MOV R0, #40H    ; 数据 40H→R0
       MOV R1, #10     ; 数据 10→R1
       MOV R2, #0      ; 清 0 R2
LOOP:  ADD R0, [R2+2]  ; (R0)+[(R2)+2]→R0
       ADD R2, #1      ; (R2)+1→R2
       SUB R1, #1      ; (R1)-1→R1
       JNZ LOOP        ; 结果非 0 转 LOOP 处执行，相对寻址
       HALT            ; 停机
~~~

（1）相对转移指令 JNZ LOOP 的 8 位二进制偏移量等于多少？（2 分）

（2）指令 ADD R0,[R2+2] 的源操作数采用的是何种寻址方式？（2 分）

（3）数据 Cache 容量为 8B、块大小为 2B，采用 2 路组相联映射和 LRU 替换，初始为空。列出 10 次数据访问的地址及命中/缺失情况，并计算命中率。（6 分）

（4）Cache 命中访问时间为 10ns；缺失时先进行 10ns 的 Cache 查询，再额外用 100ns 从主存调入块。只计算上述 10 次数据访问的总访存时间。（5 分）

![第 43 题指令格式与程序](mock-exam-3/co-q43-table.png)`,attachments:[{name:`查看原卷试题页（第 9 页，含第 43～44 题）`,path:`mock-exam-3/co-os-page-09.png`},{name:`查看第 43 题指令格式与程序`,path:`mock-exam-3/co-q43-table.png`}],solution:{answer:String.raw`（1）偏移量 = **11111000B（F8H，即 −8）**。

（2）源操作数采用**变址寻址**：8 位位移量为 2，有效地址 $\mathrm{EA}=(\mathrm{R2})+2$，被访问的源操作数是主存单元 $\mathrm{M}[\mathrm{EA}]$（R2 为变址寄存器）。

（3）10 次访问地址为 02H、03H、04H、05H、06H、07H、08H、09H、0AH、0BH；命中/缺失依次为 M、H、M、H、M、H、M、H、M、H，**缺失 5 次、命中 5 次，命中率 = 5/10 = 50%**。

（4）总访存时间 = **600ns**。`,explanation:String.raw`## （1）相对转移偏移量

每条指令占 2B，程序从 00H 开始，故各指令地址：

- start: MOV R0,#40H → 00H；MOV R1,#10 → 02H；MOV R2,#0 → 04H；
- LOOP: ADD R0,[R2+2] → **06H**；ADD R2,#1 → 08H；SUB R1,#1 → 0AH；
- JNZ LOOP → **0CH**；HALT → 0EH。

相对寻址以“**转移指令取指结束后的 PC**”为基准，即 $0\mathrm{C}\mathrm{H}+2=0\mathrm{E}\mathrm{H}$。

$$
\text{偏移}=\text{目标}-\text{nextPC}=06\mathrm{H}-0\mathrm{E}\mathrm{H}=-8,
$$

-8 的 8 位补码为 $11111000\mathrm{B}=\mathrm{F8H}$。

## （2）寻址方式

指令中给出 $[\mathrm{R2}+2]$：以变址寄存器 R2 的内容为基准加位移量 2 形成**有效地址** $\mathrm{EA}=(\mathrm{R2})+2$，真正被访问的是主存操作数 $\mathrm{M}[\mathrm{EA}]$（不要把写法 $[\mathrm{R2}+2]$ 与有效地址 $\mathrm{EA}$ 混为一谈），属**变址寻址**（题设已声明 R2 可作变址寄存器；位移量由第二字节给出）。

## （3）数据 Cache 命中情况

数据访问地址：循环执行 10 次，R2 $=0,1,\dots,9$，有效地址 $=(\mathrm{R2})+2=02\mathrm{H}\sim0\mathrm{B}\mathrm{H}$。

Cache 8B、块 2B → 共 4 块；2 路组相联 → 2 组，每组 2 块。块号 $=$ 地址$/2$，组号 $=$ 块号 $\bmod 2$。

~~~text
 步 地址  块  组  结果
  1  02H  块1  组1  miss
  2  03H  块1  组1  hit
  3  04H  块2  组0  miss
  4  05H  块2  组0  hit
  5  06H  块3  组1  miss
  6  07H  块3  组1  hit
  7  08H  块4  组0  miss
  8  09H  块4  组0  hit
  9  0AH  块5  组1  miss
 10  0BH  块5  组1  hit
~~~

解释：块 1、3、5 都映射到组 1（块号奇），组 1 只有 2 路，故访问块 5 时需按 LRU 淘汰组 1 中最早使用的块 1。每块被连续访问 2 次（同块第二字节命中），故共 5 次缺失、5 次命中，命中率 $5/10=50\%$。

## （4）总访存时间

$$
T=\underbrace{5}_{\text{缺失}}\times(10+100)+\underbrace{5}_{\text{命中}}\times10
=550+50=600\ \text{ns}.
$$

缺失时先查 Cache 10ns 再调块 100ns，故每次缺失总代价 110ns。

## 脚本复核（.cache/lion-3/verify.py 实际输出，节选）

~~~text
=== Q43(1) JNZ 机器码与偏移 ===
LOOP=06H  JNZ=0CH  nextPC=0EH  offset=-8  -> 8位补码=F8H = 11111000
=== Q43(3)(4) 数据Cache 8B/块2B/2路组相联/LRU ===
访问地址: ['02H', '03H', '04H', '05H', '06H', '07H', '08H', '09H', '0AH', '0BH']
 步 地址  块  组  结果
（节选：省略第 1～9 步的逐行时间线）
 10  0BH  块5  组1  hit
misses=5 hits=5 命中率=5/10=50%
总访存时间 = 5*(10+100) + 5*10 = 600 ns
~~~`,pitfalls:String.raw`- 偏移量基准搞错：用 JNZ 的**取指前** PC（0CH）而不是取指后 PC（0EH），会得到 −6。
- 忘记双字节：把每条指令按 1B 计算地址，LOOP、JNZ 位置全错。
- （3）只统计“块”的首字节访问，漏掉同块第二字节的命中（会得出 10 次全缺）。
- （4）把缺失代价按 100ns 而非 110ns 计算，或漏算命中 10ns。`}},{id:`mock-exam-3-co-q44`,questionNumber:44,title:`二模块低位交叉存储器的芯片数与总时间`,type:`题目`,date:`2026-10-02`,chapter:`存储系统 · 多模块交叉存储器`,tags:[`低位交叉`,`位扩展`,`数据总线`,`访问周期`,`流水启动`],summary:`由模块容量与芯片规格求每模块芯片数、扩展方式、数据总线宽度，并计算连续读取 128 个字的总时间。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 9～10 页（卷面第 8～9 页）第 44 题；卷面未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`（8 分）某计算机采用二模块低位交叉存储器，每个模块容量为 256K×32 位，由 256K×4 位 DRAM 芯片构成。两个模块共用一条 32 位数据总线，连续字按模块号 0、1 交替存放。结合图回答下列问题。

（1）每个模块需要多少片 256K×4 位 DRAM 芯片？两个模块共需多少片？就单个模块内部而言，芯片采用哪种扩展方式？（3 分）

（2）数据总线宽度是多少？每次存储器访问能够传输多少位数据？（2 分）

（3）每个模块的访问周期为 80ns，访问延迟为 50ns。控制器可以每隔 40ns 交替启动一次模块访问，忽略地址发送时间和数据总线传输时间。连续读取 128 个 32 位字，从启动第 1 次访问到第 128 个字就绪，共需多少时间？（3 分）

![第 44 题二模块低位交叉存储器图](mock-exam-3/co-q44-fig.png)`,attachments:[{name:`查看原卷试题页（第 9 页，含第 43～44 题）`,path:`mock-exam-3/co-os-page-09.png`},{name:`查看第 44 题二模块低位交叉存储器图`,path:`mock-exam-3/co-q44-fig.png`}],solution:{answer:String.raw`（1）每模块需 **8 片** 256K×4 位芯片，两个模块共 **16 片**；单个模块内部采用**位扩展**（芯片字数 256K 已与模块相符，无需字扩展）。

（2）数据总线宽度为 **32 位**；每次存储器访问传输 **32 位**数据。

（3）共需 **5130ns**。`,explanation:String.raw`## （1）芯片数量与扩展方式

- 每个模块容量 256K×32 位，单片容量 256K×4 位。字数相同（均 256K），位数需从 4 位凑到 32 位：

$$
\frac{32}{4}=8\ \text{片/模块}.
$$

- 两个模块共 $8\times2=16$ 片。
- 因为单片字数已等于模块字数（256K），只靠**位扩展**（并联芯片以增加数据位宽）即可，不需要字扩展。

## （2）数据总线与单次传输位数

题设“两个模块共用一条 **32 位**数据总线”。每次访问选中一个模块的 32 位字，因此每次存储器访问传输 **32 位**（一个字）。

## （3）连续读取 128 个 32 位字的总时间

低位交叉下按模块 0、1 交替流水启动，控制器每 40ns 启动一次：

- 第 $k$ 次访问（从 0 计）在 $40k$ ns 时刻启动；
- 每次访问延迟 50ns，数据于“启动时刻 $+50$ ns”就绪；
- 第 128 个字对应 $k=127$。

$$
T=40\times(128-1)+50=40\times127+50=5080+50=5130\ \text{ns}.
$$

即：只需等**最后一次启动**再加一次访问延迟，前面 127 次启动与延迟都已重叠。

## 脚本复核（.cache/lion-3/verify.py 实际输出）

~~~text
=== Q44 二模块低位交叉 256Kx32 / 256Kx4 ===
每模块片数 = 32/4 = 8  两模块共 16  片内为位扩展
数据总线 32 位；每次访问传输 32 位
第128字就绪 = (128-1)*40 + 50 = 5130 ns
~~~`,pitfalls:String.raw`- 用 $128\times40+50=5170$ 或 $128\times50$ 等错误叠加，忘记流水重叠。
- 把数据总线宽度误判为 64 位（两个模块各 32 位并行）：本题两模块**共用**一条 32 位总线，故仍为 32 位。
- 芯片数算成 4 片（用 $256K\times32 \div (256K\times4)$ 时误取 1 位/片）或误按字扩展。`}},{id:`mock-exam-3-os-q45`,questionNumber:45,title:`管程与 AND 信号量实现生产者—消费者`,type:`题目`,date:`2026-10-02`,chapter:`进程同步 · 管程与 AND 信号量`,tags:[`管程`,`Hoare 语义`,`条件变量`,`AND 信号量`,`生产者消费者`],summary:`补全 Hoare 管程实现生产者—消费者的四处空缺，并用 AND 信号量改写同步代码并说明 Swait 的语义。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 10～11 页（卷面第 9～10 页）第 45 题；卷面未印参考答案，解析为本站独立推导，并非官方答案。`,content:String.raw`（8 分）某系统设置一个含 N 个缓冲区的循环缓冲池，有多个生产者进程和多个消费者进程。初始时 in = out = count = 0。每个产品只由一个消费者取走。

（1）系统采用管程实现生产者—消费者问题。cwait(c) 使调用进程释放管程并进入条件变量 c 的等待队列；采用 Hoare 管程语义，csignal(c) 唤醒等待进程后，由被唤醒进程立即获得管程。若条件队列为空，则 csignal 不起作用。补全下列代码。（4 分）

~~~text
monitor ProducerConsumer {
    item buffer[N];
    int in = 0, out = 0, count = 0;
    condition notFull, notEmpty;
public:
    void put(item x) {
        if (count == N)
            ______①;
        buffer[in] = x;
        in = (in + 1) % N;
        count++;
        ______②;
    }
    void get(item &x) {
        if (count == 0)
            ______③;
        x = buffer[out];
        out = (out + 1) % N;
        count--;
        ______④;
    }
};
~~~

（2）现改用 AND 信号量实现。Swait(a,b) 是一个原子操作：仅当 a 和 b 均大于 0 时，才同时将二者减 1 并继续执行；否则进程阻塞，且不改变任何信号量。Ssignal(a,b) 原子地将 a 和 b 分别加 1。设：

~~~text
semaphore empty = N;   // 空缓冲区数量
semaphore full  = 0;   // 已占用缓冲区数量
semaphore mutex = 1;   // 缓冲池互斥信号量
~~~

~~~text
void producer() {
    while (true) {
        item x = produce();

        Swait(______, ______);

        buffer[in] = x;
        in = (in + 1) % N;

        Ssignal(______, ______);
    }
}

void consumer() {
    while (true) {
        Swait(______, ______);

        item x = buffer[out];
        out = (out + 1) % N;

        Ssignal(______, ______);

        consume(x);
    }
}
~~~

补全生产者和消费者代码，并说明为什么 Swait(a,b) 不能简单理解为两个相互独立的普通 wait 操作依次执行。（4 分）

![第 45 题管程代码](mock-exam-3/co-q45-code.png)`,attachments:[{name:`查看原卷试题页（第 10 页，含第 45 题）`,path:`mock-exam-3/co-os-page-10.png`},{name:`查看第 45 题管程代码`,path:`mock-exam-3/co-q45-code.png`},{name:`查看原卷试题页（第 11 页，含第 45(2)、46 题）`,path:`mock-exam-3/co-os-page-11.png`}],solution:{answer:String.raw`（1）① **cwait(notFull)**　② **csignal(notEmpty)**　③ **cwait(notEmpty)**　④ **csignal(notFull)**。

（2）生产者：

~~~text
void producer() {
    while (true) {
        item x = produce();
        Swait(empty, mutex);    // 原子地同时申请“空缓冲区”与“缓冲池互斥”
        buffer[in] = x;
        in = (in + 1) % N;
        Ssignal(mutex, full);   // 原子地释放互斥并增加 full
    }
}
~~~

消费者：

~~~text
void consumer() {
    while (true) {
        Swait(full, mutex);     // 原子地同时申请“产品”与“缓冲池互斥”
        item x = buffer[out];
        out = (out + 1) % N;
        Ssignal(mutex, empty);  // 原子地释放互斥并增加 empty
        consume(x);
    }
}
~~~

说明：缓冲池“已满/已空”完全由 empty、full 两个信号量表达，本题 AND 版本不再使用 count 变量，故上述代码（与原卷骨架一致）不出现 count 的加减；produce() 在临界区之外执行，consume(x) 也在退出临界区之后执行。

Swait 不能理解为两次独立 wait：独立的 wait 不是原子地“要么全得、要么全不得”，可能在只获得其中一个信号量后就被阻塞，从而“部分占用资源”；而 AND 信号量要求两个资源同时可用才一次占用、否则不改变任何信号量（不持有任何资源地等待）。`,explanation:String.raw`## （1）Hoare 管程四处的填法

管程保证互斥，故管程内不需再显式设 mutex。管程内的同步靠**条件变量** cwait / csignal。

- put 中，若缓冲池已满（count == N）就不能写：
  - ① **cwait(notFull)**：等待“不满”条件，释放管程并排队。
  - 写完置 count++ 后，说明有产品可取了：
  - ② **csignal(notEmpty)**：唤醒等待“不空”的消费者。
- get 中，若缓冲池为空（count == 0）就不能取：
  - ③ **cwait(notEmpty)**：等待“不空”条件。
  - 取完置 count-- 后，说明有空位可写：
  - ④ **csignal(notFull)**：唤醒等待“不满”的生产者。

用 if 判断即可：Hoare 语义下 csignal 会把管程**立即交给**被唤醒者，被唤醒者醒来时条件必然成立，无需 while 重检。

## （2）AND 信号量版本与语义说明

AND 信号量把“同时申请多个资源”做成一个原子操作：

$$
\text{Swait}(a,b):\ \text{若 }a>0\wedge b>0\ \Rightarrow a\mathrel{-}=1,\ b\mathrel{-}=1;\ \text{否则阻塞且不改变 }a,b.
$$

- 生产者先申请 **empty**（空位）与 **mutex**（互斥），二者同时可用才进入临界区；写完后 Ssignal(mutex, full)。
- 消费者先申请 **full**（产品）与 **mutex**；取完后 Ssignal(mutex, empty)。

**为什么不能当成两次普通 wait：** 两次独立 wait 之间不是原子的，可能在“第一次已成功、第二次阻塞”的瞬间出现**部分占用**。可举例说明：若刻意采用错误的申请顺序（先 wait(mutex) 再 wait(empty/full)），生产者可能已持有 mutex 又等待 empty，消费者可能已持有 empty 又等待 mutex，双方相互等待而无法推进。AND 信号量的语义是“全得或全不得”：两资源同时可用才一次占用，否则阻塞且**不改变任何信号量**。就本题而言，正因为这一步是原子的，生产者/消费者不会在申请 empty/full 与 mutex 这一环节出现部分占用而相互等待（这里只针对“申请 empty/full 与 mutex”，若调用者此前已持有其它资源，AND 操作本身并不保证消除由此产生的死锁）。

需要说明：**若把两次普通 wait 的申请顺序严格统一**（例如所有进程都先申请 empty/full、后申请 mutex），普通的 P 操作协议同样能正确解决生产者—消费者问题，并不会死锁；上面那个危险序列来自刻意写错的申请顺序。因此正确说法是：普通 wait 非原子、可能出现部分占用，与 AND“原子地同时获取”的语义不等价，而**不是**“任何普通 wait 顺序都会死锁”。

## 要点小结

- 管程（Hoare）：cwait 释放管程排队，csignal 立即移交管程。
- AND 信号量：一次申请/释放一组信号量，原子、无部分占用。`,pitfalls:String.raw`- ①②③④ 写反（把 put 里 signal 成 notFull）：put 完成后应唤醒“消费者”即 notEmpty。
- 条件变量判断用 if 还是 while：本题为 Hoare 语义，csignal 后立即移交管程、被唤醒者醒来时条件必成立，用 if 即可；Mesa 语义（signal 后不立即移交）才需要用 while 重检条件。二者对号入座，不要混用。
- 用 AND 信号量时把 mutex 拆出来单独 P：应交由 Swait/Ssignal 与 empty/full 一起原子操作。
- 断言“任何普通 wait 顺序都会死锁”：过强且错误——统一顺序的普通 P 协议也能正确同步；正确说法是普通 wait 非原子、可能出现部分占用，与 AND 语义不等价。`}},{id:`mock-exam-3-os-q46`,questionNumber:46,title:`行/列扫描下的请求分页缺页次数`,type:`题目`,date:`2026-10-02`,chapter:`虚拟内存 · 请求分页与缺页分析`,tags:[`请求分页`,`FIFO`,`缺页次数`,`局部性`,`按行优先存放`],summary:`两个程序分别按行、按列扫描 100×100 矩阵，求不同页大小与页框数下的缺页次数，并分析局部性与存储方式的影响。`,source:`用户提供的扫描件 docs/book/三.pdf（lion模拟卷3）第 11 页（卷面第 10 页）第 46 题；卷面未印参考答案，解析为本站独立推导并由脚本复核，并非官方答案。`,content:String.raw`（7 分）某请求分页系统给进程分配 2 个初始为空的数据页框，采用 FIFO 置换算法。100×100 整型矩阵 A 从页边界开始存放且按行优先排列，除 A 外不访问其他数据。程序 1 按行扫描，程序 2 按列扫描，代码如下。

~~~text
// 程序1                    // 程序2
for (i = 0; i < 100; i++)   for (j = 0; j < 100; j++)
    for (j = 0; j < 100; j++)   for (i = 0; i < 100; i++)
        A[i][j] = 0;                A[i][j] = 0;
~~~

请回答以下问题，均只统计对矩阵 A 的访问引起的缺页：

（1）每页可存 200 个整数时，程序 1 和程序 2 分别发生多少次缺页？（2 分）

（2）每页可存 100 个整数时，程序 1 和程序 2 分别发生多少次缺页？（2 分）

（3）上述结果体现了程序访问的哪种局部性？（1 分）

（4）若数据页框增加到 4 个、每页存 200 个整数，程序 2 的缺页次数是否改变？说明理由。

（5）若将矩阵 A 改为按列优先存放，程序 1（按行扫描）的缺页次数是多少？`,attachments:[{name:`查看原卷试题页（第 11 页，含第 45(2)、46 题）`,path:`mock-exam-3/co-os-page-11.png`}],solution:{answer:String.raw`（1）每页 200 个整数：程序 1 缺页 **50** 次，程序 2 缺页 **5000** 次。

（2）每页 100 个整数：程序 1 缺页 **100** 次，程序 2 缺页 **10000** 次。

（3）体现了**空间局部性**。

（4）**不变，仍为 5000 次。**

（5）程序 1 缺页 **5000** 次。`,explanation:String.raw`## 记号

矩阵 A 共 $100\times100=10000$ 个整数。页边界对齐、按行优先存放，故地址 $\text{addr}(i,j)=100i+j$，页号 $=\lfloor \text{addr}/P\rfloor$（$P$ 为每页整数数）。页框 2 个，FIFO。

## （1）每页 200 个整数（共 50 页）

- **程序 1（按行）：** 访问顺序为行 $0$ 的 100 个元素、行 $1$ 的 100 个元素……每 2 行占 1 页，且顺序推进。2 个页框足够覆盖“当前页 + 下一页”的顺序访问，每页只缺页一次。

$$
\text{缺页}=100\ \text{行}\div2\ \text{行/页}=50.
$$

- **程序 2（按列）：** 固定列 $j$，$i=0..99$ 逐行访问：地址 $100i+j$。每访问 2 个 $i$（即 $i$ 与 $i+1$）才跨一页：页序为 $0,0,1,1,2,2,\dots,49,49$。2 个页框下，每次进入新页都缺页，每页的第二次访问命中。

$$
\text{每列缺页}=50,\qquad \text{总缺页}=100\times50=5000.
$$

## （2）每页 100 个整数（共 100 页）

- **程序 1：** 1 行 = 1 页，顺序扫描 100 页，每页缺页一次。

$$
\text{缺页}=100.
$$

- **程序 2：** 固定列 $j$，$i=0..99$ 各落在不同的页 $i$，页序为 $0,1,2,\dots,99$，每次都是新页。

$$
\text{每列缺页}=100,\qquad \text{总缺页}=100\times100=10000.
$$

## （3）局部性

程序 1 按行访问与行优先存放方向一致，相邻访问落在相邻地址 → 良好的**空间局部性**；程序 2 按列访问、地址跳跃大，空间局部性差。故结果体现**空间局部性**。

## （4）页框增到 4、每页 200 个整数

程序 2 按列访问时，每一列的页序仍是 $0,0,1,1,\dots,49,49$，**任意时刻活跃的只有相邻 2 页**，而且每页在本列中不会再次使用。页框从 2 增到 4 并不能缓存“后续才用到的页”，故每列仍缺页 50 次：

$$
100\times50=5000\ \text{次，不变}.
$$

## （5）改为按列优先存放，程序 1（按行扫描）

列优先存放时地址 $\text{addr}(i,j)=100j+i$。程序 1 固定行 $i$、$j=0..99$：地址 $100j+i$，页号 $=\lfloor(100j+i)/200\rfloor$。$j$ 每增 2 页号才进 1，故页序又是 $0,0,1,1,\dots,49,49$，与（1）中程序 2 的情形相同：

$$
\text{每行缺页}=50,\qquad \text{总缺页}=100\times50=5000.
$$

## 脚本复核（.cache/lion-3/verify.py 实际输出）

~~~text
=== Q46 缺页模拟 FIFO ===
(1) 每页200整数(50页): 程序1(行) faults=50 ; 程序2(列) faults=5000
(2) 每页100整数(100页): 程序1(行) faults=100 ; 程序2(列) faults=10000
(4) 每页200整数, 4页框: 程序2(列) faults=5000
(5) 列优先存放, 每页200整数, 2页框: 程序1(行扫描) faults=5000
~~~`,pitfalls:String.raw`- （1）把程序 2 每列缺页当成 50 页只缺一次（得 50）：每列进入新页都缺页，且列间不保留，故 5000。
- （4）误以为“页框多就一定少缺页”：这里工作集在任一时刻只有 2 页且不重用，多给页框无用。
- （5）忽略改变存放方式等价于交换了“行/列扫描”与“存储方向”的关系，直接把答案抄成（1）的 50。
- 遗忘“从页边界开始存放”这一条件：它保证页号严格由 $P$ 整除位置决定，使上述整除分析成立。`}}],Am=[{id:`mock-exam-4-ds-q01`,questionNumber:1,title:`数据结构应用特性判断`,type:`题目`,date:`2026-10-02`,chapter:`绪论 · 数据结构与算法的应用`,tags:[`栈与函数调用`,`BFS队列`,`哈希表装填因子`,`线索二叉树`],summary:`判断关于栈、BFS 队列、哈希表装填因子与线索二叉树的四条应用特性陈述中，哪些正确。`,source:`题目来自用户提供的「模拟试题（四）」扫描件（数据结构第 1～11 题）；原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`以下关于数据结构应用特性的描述中，正确的是（　）。

- Ⅰ．在操作系统函数调用机制中，栈用于实现函数递归调用时局部变量、返回地址等信息的顺序存取与管理，遵循后进先出原则
- Ⅱ．BFS执行过程中，队列用于保存已经被发现、但其邻接点尚未全部检查的顶点，使顶点按发现的先后次序接受扩展，从而实现逐层遍历
- Ⅲ．哈希表的装填因子越大，哈希表空间利用率越高，但空闲位置越少，元素映射到相同哈希地址引发冲突的概率也越高
- Ⅳ．线索二叉树通过线索指针直接指向前驱或后继节点，遍历过程中无需额外的访问标记数组来记录节点是否已访问，可直接利用线索实现高效遍历

- A．Ⅰ、Ⅱ、Ⅲ
- B．Ⅰ、Ⅲ、Ⅳ
- C．Ⅱ、Ⅲ、Ⅳ
- D．Ⅰ、Ⅱ、Ⅲ、Ⅳ`,attachments:[{name:`查看原题截图（第 1 页）`,path:`mock-exam-4/page1.png`}],solution:{answer:String.raw`**选 D：Ⅰ、Ⅱ、Ⅲ、Ⅳ 全部正确。** 四项陈述逐条对照教材结论皆为真，没有可判错的定义性错误。`,explanation:String.raw`## 逐条判定

- **Ⅰ 正确。** 函数（含递归）调用时，系统用**栈**保存调用返回地址、参数与局部变量；栈是后进先出（LIFO）结构，递归返回次序与调用次序相反，正由 LIFO 保证。

- **Ⅱ 正确。** BFS 中队列存放“已发现但其邻接点尚未全部检查（尚未扩展）”的顶点；入队按发现次序、出队即扩展，从而保证先发现的顶点先扩展，实现逐层遍历。这正是 BFS 队列的标准语义。

- **Ⅲ 正确。** 装填因子 $\alpha=\dfrac{n}{m}$（$n$ 为已存元素数、$m$ 为表长）。$\alpha$ 越大，表内空闲位置越少、空间利用率越高。在表长与哈希方法固定的前提下，已存元素越多、被占用的位置越多，新元素按同一哈希方法落到已占位置上的机会就越大，冲突可能性与查找时的探查链长度都随之上升。

- **Ⅳ 正确。** 中序线索化后，原本为空的左、右指针域被改写为指向前驱、后继的线索；遍历时顺线索即可找到后继，既不需要递归栈，也不需要“是否已访问”的标记数组。线索本身携带了前驱、后继信息，等价于把访问顺序固化在指针里。

四项均为正确表述，故选 **D**。

## 复核说明

本题为概念判断题，独立复核脚本 .cache/crosscheck/verify_juan4.py 只覆盖第 3、8、9、10、11 题，未对本题题面逐项枚举。此处按各数据结构的定义逐条核对，结论与四项教材原文命题一致。`,pitfalls:String.raw`- 把 Ⅲ 判错：误以为“冲突概率只取决于哈希函数”而与装填因子无关；实际上装填因子越大冲突越多。
- 把 Ⅳ 判错：误以为“线索化省掉的是递归栈而不是标记数组”。两者都省了，陈述并未出错。
- 见到“全选”就不敢选：应逐项独立判断，本题四项在定义层面都成立。
- 只挑出一两条明显正确的（如 Ⅰ、Ⅱ）就选部分组合项，漏检 Ⅲ、Ⅳ。`}},{id:`mock-exam-4-ds-q02`,questionNumber:2,title:`稀疏矩阵的存储结构`,type:`题目`,date:`2026-10-02`,chapter:`数组与矩阵 · 稀疏矩阵存储`,tags:[`三元组表`,`十字链表`,`稀疏矩阵`,`行优先存储`],summary:`辨析三元组表与十字链表两种稀疏矩阵存储结构的结点内容与适用性说法。`,source:`题目来自用户提供的「模拟试题（四）」扫描件；原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`下列关于稀疏矩阵存储的说法，正确的是（　）。

- A．三元组表仅存储矩阵中的行列下标
- B．十字链表的每个非零元素结点通常包含行号、列号、元素值，以及分别链接同行和同列下一非零元素的指针
- C．三元组表按列优先顺序存储非零元素
- D．十字链表仅适用于对称稀疏矩阵的存储`,attachments:[{name:`查看原题截图（第 1 页）`,path:`mock-exam-4/page1.png`}],solution:{answer:String.raw`**选 B。** 十字链表结点含行、列、值及同列、同行两个指针，正是其标准结构。`,explanation:String.raw`## 逐条判定

- **A 错。** 三元组表每个结点存 (行下标, 列下标, 元素值) 三项；只有行列下标而无值就无法还原矩阵。

- **B 对。** 十字链表每个非零元结点含 (行, 列, 值, right, down)，其中 $right$ 指向同行下一非零元、$down$ 指向同列下一非零元；此外还有行头指针数组与列头指针数组。这正是稀疏矩阵十字链表的标准结点结构。

- **C 错。** 三元组顺序表以**行序为主序**（按行优先）有序存放非零元，不是列优先。

- **D 错。** 十字链表对**任意**稀疏矩阵都适用，包括非对称矩阵，甚至不必是方阵；并非只用于对称矩阵。

故选 **B**。

## 复核说明

概念题，独立复核脚本 .cache/crosscheck/verify_juan4.py 未覆盖本题；结论按教材对三元组表与十字链表的定义逐项排除。`,pitfalls:String.raw`- 认为三元组表只存下标而漏掉元素值。
- 记混三元组表的存储次序（行优先 vs 列优先）。
- 把“对称矩阵的压缩存储（上/下三角）”与“十字链表”混为一谈。
- 误以为十字链表只能存对称矩阵。`}},{id:`mock-exam-4-ds-q03`,questionNumber:3,title:`中序线索化后剩余空指针域`,type:`题目`,date:`2026-10-02`,chapter:`树与二叉树 · 线索二叉树`,tags:[`线索二叉树`,`中序线索化`,`空指针域`],summary:`一棵不带头结点的非空二叉树做中序线索化后，仍为空的指针域有多少个？`,source:`题目来自用户提供的「模拟试题（四）」扫描件；原卷未印参考答案，以下答案由脚本枚举全部树形验证得出，并非引用官方答案。`,content:String.raw`对一棵不带头结点的非空二叉树进行中序线索化后，仍保持为空的孩子指针域数量为（　）。

- A．0
- B．1
- C．2
- D．无法确定`,attachments:[{name:`查看原题截图（第 1 页）`,path:`mock-exam-4/page1.png`}],solution:{answer:String.raw`**选 C：2。** 不带头结点的非空二叉树中序线索化后，只有中序首结点的左域与中序末结点的右域仍为空，恒为 2 个。`,explanation:String.raw`## 计数推导

$n$ 个结点的二叉树共有 $2n$ 个指针域，其中非空的是 $n-1$ 条父子边，故原有 $n+1$ 个空指针域。中序线索化把这 $n+1$ 个空域改写为线索：

- 中序序列的**第一个结点**没有前驱，其左指针域线索化后仍为 NULL；
- 中序序列的**最后一个结点**没有后继，其右指针域线索化后仍为 NULL；
- 其余 $(n+1)-2=n-1$ 个空域分别指向真实存在的前驱或后继。

因为本题明确“**不带头结点**”且树“**非空**”，首结点左域与末结点右域无对象可指，只能保持空。所以剩余空域恒为 **2**。

- 若 $n=1$，该结点既是首又是末，左右两域皆空，仍为 2；
- 与树形无关，恒为 2。

## 脚本原样输出（.cache/crosscheck/verify_juan4.py，全部树形枚举）

~~~
Q3 非空二叉树(不带头结点)中序线索化后，仍为空的指针域数量
   n=1: 全部形态下剩余空指针域数量集合 = {2}  (原空域数 n+1 = 2)
   n=2: 全部形态下剩余空指针域数量集合 = {2}  (原空域数 n+1 = 3)
   n=3: 全部形态下剩余空指针域数量集合 = {2}  (原空域数 n+1 = 4)
   n=4: 全部形态下剩余空指针域数量集合 = {2}  (原空域数 n+1 = 5)
   n=5: 全部形态下剩余空指针域数量集合 = {2}  (原空域数 n+1 = 6)
   n=6: 全部形态下剩余空指针域数量集合 = {2}  (原空域数 n+1 = 7)
   -> 恒为 [2] => C
~~~

脚本对 $n=1\ldots6$ 的每一棵二叉树都实际做中序线索化，并统计“标记为线索且指向 NULL”的指针域，结果一律为 2，与推导一致。`,pitfalls:String.raw`- 误答 0：把“带头结点”的结论（首、末结点指针回指头结点）套到本题。
- 误答 1：只记住“首结点左域为空”而漏掉末结点右域也为空。
- 误答“无法确定”：以为空域数随树形变化，实际恒为 2。`}},{id:`mock-exam-4-ds-q04`,questionNumber:4,title:`森林转二叉树后根的右孩子`,type:`题目`,date:`2026-10-02`,chapter:`树与二叉树 · 森林与二叉树转换`,tags:[`森林转二叉树`,`孩子兄弟表示法`,`右孩子链`],summary:`非空森林按孩子—兄弟表示法转成二叉树后，若根结点没有右孩子，可推出什么结论？`,source:`题目来自用户提供的「模拟试题（四）」扫描件；原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`将一个非空森林按孩子—兄弟表示法转换为二叉树，并以森林中第一棵树的根作为所得二叉树的根。若该二叉树的根结点没有右孩子，则下列说法正确的是（　）。

- A．森林中只有一棵树
- B．森林中所有树的根节点只有一个孩子
- C．森林中至少有两棵树
- D．无法确定森林中树的数量`,attachments:[{name:`查看原题截图（第 1 页）`,path:`mock-exam-4/page1.png`}],solution:{answer:String.raw`**选 A：森林中只有一棵树。** 所得二叉树根的右孩子链长度等于森林中树的数量减一，根无右孩子即树的数量为 1。`,explanation:String.raw`## 映射规则

森林 → 二叉树（孩子—兄弟表示法）的规则：

- 每棵树内部：**左孩子 = 第一个孩子，右孩子 = 下一个兄弟**；
- 第 $k$ 棵树的根成为第 $k-1$ 棵树根的**右孩子**。

于是所得二叉树的根 = 第一棵树的根，从根出发沿右孩子链可以依次取得第 2、3、…、$k$ 棵树的根。因此：

$$
\text{根的右孩子链长度} = \text{森林中树的数量} - 1 .
$$

## 结论

根结点没有右孩子 $\iff$ 右孩子链长度为 0 $\iff$ 森林中树的数量 $-1=0$ $\iff$ **森林只有一棵树**。

需要注意的是，“根无右孩子”**唯一确定**森林只有一棵树，但反过来只能确定“森林有 $k\ge 2$ 棵树时根必有右孩子”，仅凭“根有右孩子”一般无法反推出 $k$ 的**具体数值**（除非给出整条右孩子链的长度）。本题问的是“根无右孩子”这一情形，故可确定森林只有一棵树。

对照选项：A 正确；C 与结论相反；B 讨论的是“根的孩子数”，与根有无右孩子不是同一件事（那对应根的左孩子是否为空）；D 错误，因为此情形下树的数量可唯一确定为 1，并非“无法确定”。故选 **A**。

## 复核说明

概念题，独立复核脚本 .cache/crosscheck/verify_juan4.py 未覆盖本题；结论由“根的右孩子链长度 = 森林中树的数量 − 1”这一映射关系直接推出。`,pitfalls:String.raw`- 把“根没有右孩子”理解成“第一棵树的根没有孩子”；后者对应根的左孩子为空，是另一回事。
- 选 D：误以为根有无右孩子与树的数量无关；实际上“根无右孩子”当且仅当森林只有一棵树。
- 选 C：把关系记反（右孩子链存在 ⇔ 森林中树的数量 ≥ 2）。`}},{id:`mock-exam-4-ds-q05`,questionNumber:5,title:`并查集的实现与操作`,type:`题目`,date:`2026-10-02`,chapter:`图 · 并查集`,tags:[`并查集`,`双亲表示法`,`Find`,`Union`],summary:`关于并查集的存储结构与 Find、删除等操作能力，判断哪一条说法正确。`,source:`题目来自用户提供的「模拟试题（四）」扫描件；原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`下列关于并查集的说法正确的是（　）。

- A．并查集可以用树的双亲表示法作为存储结构来实现
- B．Find操作返回集合元素个数的相反数
- C．并查集可以很高效地进行删除操作
- D．并查集可以用来计算两个结点间的路径长度`,attachments:[{name:`查看原题截图（第 1 页）`,path:`mock-exam-4/page1.png`}],solution:{answer:String.raw`**选 A。** 并查集用双亲表示法的森林（数组 $parent[i]$）实现，Find 上溯到根、Union 合并两棵树。`,explanation:String.raw`## 逐条判定

- **A 对。** 并查集（不相交集合）的经典实现是**双亲表示法**的树/森林：数组 $parent[i]$ 指向父结点，根指向自身（也可把根的双亲域存为负数以记录集合大小）。Find 沿 $parent$ 上溯到根，Union 把一棵树的根挂到另一棵树的根下。

- **B 错。** Find 返回的是该元素所在集合的**代表元（根）**，不是元素个数。把根的双亲域存为 $-size$ 只是“按大小合并”的存储技巧，Find 的返回值仍是根。

- **C 错。** 并查集只支持高效的“合并”，**不支持高效删除/分裂**。删除一个元素会破坏树的父子关系，通常需要重建，代价高。

- **D 错。** 并查集只回答“两个元素是否属于同一集合”，不保存路径长度信息，无法求两个结点间的路径长度。

故选 **A**。

## 复核说明

概念题，独立复核脚本 .cache/crosscheck/verify_juan4.py 未覆盖本题；结论按并查集的定义与实现逐项排除。`,pitfalls:String.raw`- 见“根的双亲域存负数”就选 B，把存储技巧当成 Find 的语义。
- 把并查集与“支持删除的集合/可持久化并查集”混淆。
- 把“求连通性”误当成“求最短路径/路径长度”。`}},{id:`mock-exam-4-ds-q06`,questionNumber:6,title:`Floyd与Dijkstra算法辨析`,type:`题目`,date:`2026-10-02`,chapter:`图 · 最短路径`,tags:[`Floyd算法`,`Dijkstra算法`,`最短路径`,`时间复杂度`,`负权边`],summary:`判断关于 Floyd 与 Dijkstra 两算法中路径矩阵含义、负权边适用性与时空复杂度的四条陈述。`,source:`题目来自用户提供的「模拟试题（四）」扫描件；原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`以下关于Floyd算法和Dijkstra算法的描述中，正确的是（　）。

- Ⅰ．Floyd 算法中，路径矩阵 P[i][j]表示顶点 i 到 j 的最短路径长度
- Ⅱ．Dijkstra 算法适用于求解单源最短路径问题，且图中不能包含负权边
- Ⅲ．Floyd 算法的时间复杂度为 O(n³)，其空间复杂度可优化为 O(n²)
- Ⅳ．Dijkstra 算法能够正确求解包含负权边的图的单源最短路径

- A．仅Ⅰ、Ⅱ正确
- B．仅Ⅱ、Ⅲ正确
- C．仅Ⅲ、Ⅳ正确
- D．Ⅰ、Ⅲ、Ⅳ均正确`,attachments:[{name:`查看原题截图（第 1 页）`,path:`mock-exam-4/page1.png`},{name:`查看原题截图（第 2 页）`,path:`mock-exam-4/page2.png`}],solution:{answer:String.raw`**选 B：仅 Ⅱ、Ⅲ 正确。** Ⅰ 把路径矩阵与距离矩阵混淆，Ⅳ 高估了 Dijkstra 对负权边的能力。`,explanation:String.raw`## 逐条判定

- **Ⅰ 错。** Floyd 算法中记录**最短路径长度**的是**距离矩阵** $D[i][j]$；而**路径矩阵** $P[i][j]$ 记录的是最短路径上的**中转点/前驱**（用于回溯具体路径），并不是长度。

- **Ⅱ 对。** Dijkstra 是单源最短路径算法，基于“已确定最短路的顶点集”贪心扩展，要求**所有边权非负**。有负权边时，某顶点在被“确定”之后仍可能被更短的绕行路径更新，算法会出错。

- **Ⅲ 对。** Floyd 三层循环的时间复杂度为 $\Theta(n^3)$；实现上只需一个距离矩阵（可原地迭代），外加一个路径矩阵，空间为 $\Theta(n^2)$，无需三维的 $A^{(k)}$ 数组。

- **Ⅳ 错。** 含负权边时 Dijkstra **不能保证正确**（个别含负权的实例可能碰巧得出正确结果，但算法本身不再可靠）。求含负权边的单源最短路应使用 Bellman-Ford（或 SPFA），在无负环时也可用 Floyd；不能直接用 Dijkstra。

仅 Ⅱ、Ⅲ 正确，故选 **B**。

## 复核说明

概念题，独立复核脚本 .cache/crosscheck/verify_juan4.py 未覆盖本题；结论按两个算法的定义与教材标准实现逐项排除。`,pitfalls:String.raw`- 把 $P[i][j]$（路径/中转点矩阵）与 $D[i][j]$（距离矩阵）搞混，误判 Ⅰ 为真。
- 误以为 Dijkstra 能处理负权边（选 C 或 D）。
- 误以为 Floyd“必须开三维数组”，因而否定 Ⅲ 的 $O(n^2)$ 空间。`}},{id:`mock-exam-4-ds-q07`,questionNumber:7,title:`m阶B树的定义`,type:`题目`,date:`2026-10-02`,chapter:`查找 · B树`,tags:[`B树`,`m阶B树`,`关键字数下限`,`平衡`],summary:`设 m≥3，判断哪条叙述符合 m 阶 B 树的定义（关键字下限、叶结点层次、分裂与树高、借位次序）。`,source:`题目来自用户提供的「模拟试题（四）」扫描件；原卷未印参考答案。卷面 B 项括号经放大复核为上取整符号，以下答案与解析为本站独立推导。`,content:String.raw`设m≥3。下列叙述符合m阶B树定义的是（　）。

- A．删除关键字时，若左、右兄弟均可借，定义强制要求优先向左兄弟借关键字
- B．除根结点外，每个非叶结点至少含有 $\lceil m/2\rceil-1$ 个关键字
- C．同一棵B树的叶结点可以出现在不同层
- D．插入关键字时，只要有任一结点发生分裂，整棵树的高度就一定增加1`,attachments:[{name:`查看原题截图（第 2 页）`,path:`mock-exam-4/page2.png`}],solution:{answer:String.raw`**选 B。** $m$ 阶 B 树中除根外的非叶结点至少有 $\lceil m/2\rceil$ 个孩子，即至少 $\lceil m/2\rceil-1$ 个关键字。`,explanation:String.raw`## 逐条判定

- **A 错。** B 树的插入、删除定义只规定结点的关键字数须落在 $[\lceil m/2\rceil-1,\ m-1]$（根可少于下限），并**没有**规定“左右兄弟均可借时优先向左借”这类强制次序。向左或向右借都是合法实现，属实现细节而非定义。

- **B 对。** $m$ 阶 B 树中，除根外的所有非叶（非终端）结点至少有 $\lceil m/2\rceil$ 个孩子，即至少 $\lceil m/2\rceil-1$ 个关键字。这正是 $m$ 阶 B 树的定义条款。

- **C 错。** B 树是**绝对平衡**的多路查找树，所有叶结点（失败结点所在层）都在**同一层**，这是定义要求；否则各条查找路径长度不一致。

- **D 错。** 结点分裂只是把中间关键字上移到父结点。只有**根结点**分裂时树高才 $+1$，非根结点分裂不影响树高。

故选 **B**。

## 复核说明

概念题，独立复核脚本 .cache/crosscheck/verify_juan4.py 未覆盖本题；结论对照 $m$ 阶 B 树定义逐项排除。`,pitfalls:String.raw`- 把“关键字数下限”与“孩子数下限”记反：孩子数下限是 $\lceil m/2\rceil$，关键字数下限是 $\lceil m/2\rceil-1$。
- 混淆 B 树与 B+ 树，或把“树高增长条件”错当成“任意分裂都长高”。
- 把某些教材删除、借位的实现约定当成“定义强制”。`}},{id:`mock-exam-4-ds-q08`,questionNumber:8,title:`AVL树的最大高度`,type:`题目`,date:`2026-10-02`,chapter:`查找 · 平衡二叉树`,tags:[`AVL树`,`平衡二叉树`,`最少结点数`,`树高`],summary:`一棵含 20 个结点的 AVL 树（根在第 1 层）最大可能高度是多少？`,source:`题目来自用户提供的「模拟试题（四）」扫描件；原卷未印参考答案，以下答案由脚本递推验证得出，并非引用官方答案。`,content:String.raw`一棵AVL树共有20个结点，规定根结点位于第1层、树高等于最大层数，则该树的最大高度为（　）。

- A．4
- B．5
- C．6
- D．7`,attachments:[{name:`查看原题截图（第 2 页）`,path:`mock-exam-4/page2.png`}],solution:{answer:String.raw`**选 C：6。** 高度 6 的 AVL 树最少需 20 个结点，恰可用 20 个结点搭出；高度 7 至少需 33 个结点，故 20 个结点最大高度为 6。`,explanation:String.raw`## 递推

设 $N(h)$ 为高度为 $h$ 的 AVL 树所需的**最少结点数**。要使结点少而高度大，高度 $h\ge 2$ 的最少结点 AVL 树，其两棵子树应分别取高度 $h-1$ 与 $h-2$ 的**最少结点 AVL 树**（内部各结点同样满足平衡条件，并非要求叶子也带两棵子树），于是

$$
N(0)=0,\quad N(1)=1,\quad N(h)=N(h-1)+N(h-2)+1\ (h\ge 2).
$$

- $h=6$ 时 $N(6)=20$，恰好可用 20 个结点搭出高度 6 的 AVL 树；
- $h=7$ 时 $N(7)=33>20$，搭不出来。

故 20 个结点的 AVL 树最大高度为 6，选 **C**。

## 脚本原样输出（.cache/crosscheck/verify_juan4.py）

~~~
Q8 AVL 高度 h 最少结点数 N(h)=N(h-1)+N(h-2)+1
   h=1: N=1
   h=2: N=2
   h=3: N=4
   h=4: N=7
   h=5: N=12
   h=6: N=20
   h=7: N=33
   h=8: N=54
   20 个结点的最大高度 = 6  (N(6)=20<=20 < N(7)=33)
   -> 6 => C
~~~`,pitfalls:String.raw`- 用完全平衡树 $\lfloor\log_2 20\rfloor+1=5$ 去估高度，忽略了 AVL 允许左右子树高度差 1，故能更高。
- 记错递推式（漏掉 $+1$ 或写成 $N(h)=N(h-1)+N(h-2)$）。
- 把高度定义与层数错位；本题明确规定根在第 1 层、树高 = 最大层数。`}},{id:`mock-exam-4-ds-q09`,questionNumber:9,title:`双散列的平均查找长度`,type:`题目`,date:`2026-10-02`,chapter:`查找 · 散列表`,tags:[`双散列`,`开放定址`,`平均查找长度`,`ASL`],summary:`地址 0～12 的双散列表依次插入 9 个关键字，等概率下查找成功的平均查找长度是多少？`,source:`题目来自用户提供的「模拟试题（四）」扫描件；原卷未印参考答案，以下答案由脚本逐次模拟插入验证得出，并非引用官方答案。`,content:String.raw`某散列表地址为0~12，初始为空，采用开放定址的双散列法处理冲突。设 $H_1(key)=key\bmod 13$，$H_2(key)=1+(key\bmod 11)$，第 $i+1$ 次探查的地址为 $[H_1(key)+i\times H_2(key)]\bmod 13$（$i=0,1,\dots,12$），依次插入关键字（26,110,35,91,108,32,82,58,62）。若查找成功时各关键字被查找的概率相同，则该散列表查找成功的平均查找长度为（　）。

- A．$16/9$
- B．$18/9$
- C．$20/9$
- D．$22/9$`,attachments:[{name:`查看原题截图（第 2 页）`,path:`mock-exam-4/page2.png`}],solution:{answer:String.raw`**选 C：$20/9$。** 各关键字探查次数之和为 20，等概率查找 9 个关键字，$ASL_{succ}=20/9$。`,explanation:String.raw`## 逐步插入

按题述探查公式 $\text{addr}=[H_1+i\times H_2]\bmod 13$ 依次插入，记录每个关键字所需的探查（比较）次数：

- 26：$H_1=0,\ H_2=5$，探查 0，落位 0，次数 1
- 110：$H_1=6,\ H_2=1$，探查 6，落位 6，次数 1
- 35：$H_1=9,\ H_2=3$，探查 9，落位 9，次数 1
- 91：$H_1=0,\ H_2=4$，探查 0 → 4，落位 4，次数 2
- 108：$H_1=4,\ H_2=10$，探查 4 → 1，落位 1，次数 2
- 32：$H_1=6,\ H_2=11$，探查 6 → 4 → 2，落位 2，次数 3
- 82：$H_1=4,\ H_2=6$，探查 4 → 10，落位 10，次数 2
- 58：$H_1=6,\ H_2=4$，探查 6 → 10 → 1 → 5，落位 5，次数 4
- 62：$H_1=10,\ H_2=8$，探查 10 → 5 → 0 → 8，落位 8，次数 4

最终散列表（地址 0～12）为：

$$
[26,\ 108,\ 32,\ \text{空},\ 91,\ 58,\ 110,\ \text{空},\ 62,\ 35,\ 82,\ \text{空},\ \text{空}]
$$

探查次数之和为 $1+1+1+2+2+3+2+4+4=20$；查找成功时对 9 个关键字等概率，故

$$
ASL_{succ}=\frac{1}{9}\sum_{k}\text{probes}(k)=\frac{20}{9}.
$$

## 脚本原样输出（.cache/crosscheck/verify_juan4.py）

~~~
Q9 双散列 addr=[H1+i*H2]%13, H1=key%13, H2=1+key%11
   key=  26 H1= 0 H2= 5 探查=[0] 落位=0 次数=1
   key= 110 H1= 6 H2= 1 探查=[6] 落位=6 次数=1
   key=  35 H1= 9 H2= 3 探查=[9] 落位=9 次数=1
   key=  91 H1= 0 H2= 4 探查=[0, 4] 落位=4 次数=2
   key= 108 H1= 4 H2=10 探查=[4, 1] 落位=1 次数=2
   key=  32 H1= 6 H2=11 探查=[6, 4, 2] 落位=2 次数=3
   key=  82 H1= 4 H2= 6 探查=[4, 10] 落位=10 次数=2
   key=  58 H1= 6 H2= 4 探查=[6, 10, 1, 5] 落位=5 次数=4
   key=  62 H1=10 H2= 8 探查=[10, 5, 0, 8] 落位=8 次数=4
   表 = [26, 108, 32, None, 91, 58, 110, None, 62, 35, 82, None, None]
   次数 = [1, 1, 1, 2, 2, 3, 2, 4, 4]  sum=20
   ASL_succ = 20/9 = 2.2222 -> 选项 C(20/9)
~~~`,pitfalls:String.raw`- 108 的探查序列误算为“直接落 4”：地址 4 已被 91 占用，必须再探查到 1，少算一次 → 会错选 A/B。
- 只按 $H_1$ 做线性探测（忽略 $H_2$ 的步长），得到完全不同的分布。
- 分母取错：查找成功时等概率对象是 **9 个关键字**，分母取 9（不是表长 13，也不是 20）。`}},{id:`mock-exam-4-ds-q10`,questionNumber:10,title:`快速排序的最坏情形`,type:`题目`,date:`2026-10-02`,chapter:`排序 · 快速排序`,tags:[`快速排序`,`枢轴`,`时间复杂度`,`最坏情形`],summary:`枢轴固定取子表首元素时，四种初始序列特征中哪一种一定使快速排序退化到 O(n²)？`,source:`题目来自用户提供的「模拟试题（四）」扫描件；原卷未印参考答案，以下答案由脚本统计比较次数验证得出，并非引用官方答案。`,content:String.raw`快速排序的每趟划分均选择当前子表的第一个元素作为枢轴，不采用随机化、三数取中或针对重复关键字的三路划分。下列初始序列特征中，一定会使其时间复杂度达到O(n²)的是（　）。

- A．所有关键字互异，且已经按升序排列
- B．所有关键字互异，且随机排列
- C．每趟所选枢轴均为当前子表的中位数
- D．每趟划分所得两个子表的规模之差至多为1`,attachments:[{name:`查看原题截图（第 2 页）`,path:`mock-exam-4/page2.png`}],solution:{answer:String.raw`**选 A。** 升序序列下枢轴恒为当前子表最小值，划分退化为“空 + n−1”，递归深度 n，比较次数达 $n(n-1)/2$，一定是 $O(n^2)$。`,explanation:String.raw`## 逐条判定

枢轴固定取子表首元素时，划分是否退化只取决于“首元素在子表中的名次”。

- **A 对。** 序列已升序，则每趟首元素都是当前子表的**最小值**，划分结果为“左子表空 + 右子表 $n-1$ 个元素”，递归深度 $n$，总比较次数

$$
\sum_{i=1}^{n}(i-1)=\frac{n(n-1)}{2}=\Theta(n^2).
$$

  **一定**退化。

- **B 错。** 随机排列的平均复杂度是 $\Theta(n\log n)$，只是“平均意义上好”，并不能保证达到 $O(n^2)$。

- **C 错。** 枢轴恒为中位数 → 每趟把表均分，递归深度 $\Theta(\log n)$，总时间 $\Theta(n\log n)$。

- **D 错。** 两子表规模差 ≤ 1 即“近似均分”，递推式 $T(n)=2T(n/2)+\Theta(n)=\Theta(n\log n)$。

只有 A 是“一定”退化到 $O(n^2)$，故选 **A**。

## 脚本原样输出（.cache/crosscheck/verify_juan4.py，20 个元素、枢轴取首元素）

~~~
Q10 快排（枢轴=首元素）比较次数
   A 升序 1..20: 比较次数 = 190  n(n-1)/2 = 190
   B 随机排列: 多次比较次数 = [60, 78, 65, 67, 63] (平均 66.6)
   -> A 一定退化 O(n^2) => A
~~~

A 的比较次数恰为 $20\times19/2=190$，与退化理论值完全吻合；B 随机序列仅约 67 次，远未退化。`,pitfalls:String.raw`- 误以为“升序输入对快排最优/平均”——恰恰是最坏情形（枢轴永远最小）。
- 把“平均 $O(n\log n)$”当成“不会退化”，忽略 B 只是平均好、不保证退化。
- 忘记题设“枢轴固定取首元素”，套用随机化快排的结论。`}},{id:`mock-exam-4-ds-q11`,questionNumber:11,title:`二路归并排序第二趟结果`,type:`题目`,date:`2026-10-02`,chapter:`排序 · 归并排序`,tags:[`二路归并`,`自底向上`,`第二趟`],summary:`对给定 8 元素序列做二路归并排序，第二趟归并后的序列状态是哪一个选项？`,source:`题目来自用户提供的「模拟试题（四）」扫描件；原卷未印参考答案，以下答案由脚本逐趟归并验证得出，并非引用官方答案。`,content:String.raw`已知一个序列(23, 12, 35, 47, 18, 39, 51, 26)，采用二路归并排序算法进行排序。在第二趟归并后，序列的状态是（　）。

- A．(12, 23, 18, 35, 47, 26, 39, 51)
- B．(12, 18, 23, 26, 35, 39, 47, 51)
- C．(12, 23, 35, 47, 18, 26, 39, 51)
- D．(12, 23, 18, 35, 26, 47, 39, 51)`,attachments:[{name:`查看原题截图（第 2 页）`,path:`mock-exam-4/page2.png`}],solution:{answer:String.raw`**选 C：(12, 23, 35, 47, 18, 26, 39, 51)。** 第二趟把相邻的长度 2 的有序段两两归并成长度 4 的有序段。`,explanation:String.raw`## 逐趟归并

二路归并排序自底向上，每趟把相邻两个长度为 $L$ 的有序段两两归并成长度 $2L$ 的有序段。

- **初始：** 23, 12, 35, 47, 18, 39, 51, 26
- **第 1 趟：** 长度 1 的段两两归并 → (12,23)　(35,47)　(18,39)　(26,51)，全序列 12, 23, 35, 47, 18, 39, 26, 51
- **第 2 趟：** 长度 2 的段两两归并 → (12,23,35,47)　(18,26,39,51)，全序列 12, 23, 35, 47, 18, 26, 39, 51
- **第 3 趟：** 归并这两段即得全局有序 12, 18, 23, 26, 35, 39, 47, 51

第二趟结果与选项 C 逐字相同，故选 **C**。

## 脚本原样输出（.cache/crosscheck/verify_juan4.py）

~~~
Q11 二路归并 [23, 12, 35, 47, 18, 39, 51, 26]
   pass 1: [[12, 23], [35, 47], [18, 39], [26, 51]]  展平 = [12, 23, 35, 47, 18, 39, 26, 51]
   pass 2: [[12, 23, 35, 47], [18, 26, 39, 51]]  展平 = [12, 23, 35, 47, 18, 26, 39, 51]
   pass 3: [[12, 18, 23, 26, 35, 39, 47, 51]]  展平 = [12, 18, 23, 26, 35, 39, 47, 51]
   -> 第二趟 = [12, 23, 35, 47, 18, 26, 39, 51] => C
~~~`,pitfalls:String.raw`- 把“第 2 趟”当成递归式归并排序拆分树中深度为 2 的层，从而数错趟数。
- 选项 A、D 是“部分相邻段交错归并”的中间态，混淆了两两归并的边界对齐方式。
- 选项 B 是全部排好（第 3 趟之后）的最终结果，提前选了它。`}},{id:`mock-exam-4-co-q12`,questionNumber:12,title:`并行部分比例与加速比的线程数下限`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 计算机系统概述（性能指标与加速比）`,tags:[`加速比`,`Amdahl 定律`,`并行处理`,`性能指标`],summary:`给定可并行部分比例，要求理论加速比达到某值，求并行线程数的最小值。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 3 页（卷面第 2 页）第 12 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`某程序完全顺序执行时，$80\%$ 的执行时间所对应的任务可以并行执行。忽略并行化开销，若希望程序的理论加速比达到 $4$，则并行执行的线程数最少应为（　）个。

- A．4
- B．8
- C．16
- D．32`,attachments:[{name:`查看原卷试题页（第 3 页，含题 12~14）`,path:`mock-exam-4/co-os-page-3.png`}],solution:{answer:String.raw`**选 C：16。**`,explanation:String.raw`## 1. 建模（Amdahl 定律）

设可并行部分比例为 $p=0.8$，串行部分比例为 $1-p=0.2$，处理器（线程）数为 $n$。理想情况下并行部分被 $n$ 个处理器均分，加速比为

$$
S(n)=\frac{1}{(1-p)+\dfrac{p}{n}}=\frac{1}{0.2+\dfrac{0.8}{n}}.
$$

## 2. 解不等式

要求 $S(n)\ge 4$：

$$
\frac{1}{0.2+\dfrac{0.8}{n}}\ge 4
\;\Longrightarrow\;
0.2+\frac{0.8}{n}\le 0.25
\;\Longrightarrow\;
\frac{0.8}{n}\le 0.05
\;\Longrightarrow\;
n\ge 16.
$$

$n$ 取整数，故最小值 $n=16$。

## 3. 验证两端

- $n=16$：$S=\dfrac{1}{0.2+0.8/16}=\dfrac{1}{0.25}=4$，恰好达到 $4$。
- $n=15$：$S=\dfrac{1}{0.2+0.8/15}\approx 3.947<4$，达不到要求。

## 4. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q12 Amdahl: p=0.8, need speedup>=4 -> n >= ? ===
  min n = 16  speedup = 4.0
  check n=16: 4.0  n=15: 3.9473684210526314
~~~`,pitfalls:String.raw`- 把 $n$ 当连续量而不取整：算出 $n\ge 16$ 直接选 16 是对的，但若算出 15.x 必须上取整。
- 误用“并行部分越大加速比越高”而无视串行部分：串行比例 $0.2$ 决定了加速比上限 $1/0.2=5$，本题 $4$ 未触及上限。
- 漏看“忽略并行化开销”：若有开销需另算，本题不扣。`}},{id:`mock-exam-4-co-q13`,questionNumber:13,title:`IEEE 754 单精度编码中最大真值的判断`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 数据的表示和运算（IEEE 754 单精度浮点数）`,tags:[`IEEE 754`,`单精度浮点数`,`阶码`,`尾数`],summary:`给出四个 32 位串，判断按 IEEE 754 单精度解释后哪个值最大。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 3 页（卷面第 2 页）第 13 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`下列 IEEE 754 单精度浮点数中，值最大的是（　）。

- A．$0100\ 0001\ 0101\ 0000\ 0000\ 0000\ 0000\ 0000$
- B．$0100\ 0000\ 1010\ 1000\ 0000\ 0000\ 0000\ 0000$
- C．$1011\ 1111\ 1000\ 0000\ 0000\ 0000\ 0000\ 0000$
- D．$0100\ 0000\ 0000\ 0000\ 0000\ 0000\ 0000\ 0000$`,attachments:[{name:`查看原卷试题页（第 3 页，含题 12~14）`,path:`mock-exam-4/co-os-page-3.png`}],solution:{answer:String.raw`**选 A。** 四个编码的真值分别为 $13.0$、$5.25$、$-1.0$、$2.0$，最大者是 A。`,explanation:String.raw`## 1. 格式回顾

IEEE 754 单精度共 32 位：最高 1 位符号 $S$，接着 8 位阶码 $E$，最后 23 位尾数 $M$。规格化数真值为

$$
V=(-1)^{S}\times 1.M\times 2^{\,E-127}.
$$

## 2. 逐个解码

- **A**：$S=0$，$E=(1000\,0010)_2=130$，$1.M=(1.101)_2=1.625$，故 $V=1.625\times 2^{3}=13.0$。
- **B**：$S=0$，$E=(1000\,0001)_2=129$，$1.M=(1.0101)_2=1.3125$，故 $V=1.3125\times 2^{2}=5.25$。
- **C**：$S=1$，$E=(0111\,1111)_2=127$，$1.M=1.0$，故 $V=-1.0$。
- **D**：$S=0$，$E=(1000\,0000)_2=128$，$1.M=1.0$，故 $V=1.0\times 2^{1}=2.0$。

## 3. 排序

$$
13.0>5.25>2.0>-1.0.
$$

故最大值为 A。

## 4. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q13 IEEE754 single, max of A/B/C/D ===
  A: 01000001010100000000000000000000  exp=3  value=13.0
  B: 01000000101010000000000000000000  exp=2  value=5.25
  C: 10111111100000000000000000000000  exp=0  value=-1.0
  D: 01000000000000000000000000000000  exp=1  value=2.0
  -> max = A
~~~`,pitfalls:String.raw`- 只比阶码不看尾数：A 的阶码（$130$）比 B（$129$）大 $1$，再叠上尾数 $1.101>1.0101$，A 更大。
- 看到最高位是 $1$ 就以为最大：最高位是符号位，C 为负数，值最小。
- 把 D 误判为 $+0$：D 的阶码是 $1000\,0000$（等于 $128$），不是全 $0$，真值是 $2.0$ 而非 $0$。`}},{id:`mock-exam-4-co-q14`,questionNumber:14,title:`结构体边界对齐与小端存储下的字节地址`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 数据的表示和运算（边界对齐、大端/小端存储）`,tags:[`结构体对齐`,`小端方式`,`字节编址`,`数据存储与排列`],summary:`给结构体首地址与某成员的机器数，求其中某一字节所在存储单元的地址。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 3 页（卷面第 2 页）第 14 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`在按字节编址、采用小端方式的 32 位计算机中，按边界对齐方式为以下 C 语言结构体变量分配存储空间。若结构体变量 s 的首地址为 3000H，其成员变量 num 的机器数为 9ABCDEF0H，则其中 BCH 所在的存储单元的地址是（　）。

~~~text
struct Data {
    char  ch;
    int   num;
    short s;
} s;
~~~

- A．3003H
- B．3004H
- C．3005H
- D．3006H`,attachments:[{name:`查看原卷试题页（第 3 页，含题 12~14）`,path:`mock-exam-4/co-os-page-3.png`}],solution:{answer:String.raw`**选 D：3006H。**`,explanation:String.raw`## 1. 先定各成员的偏移（按边界对齐）

各类型长度与对齐要求：char 占 $1$B、对齐 $1$；int 占 $4$B、对齐 $4$；short 占 $2$B、对齐 $2$。

- ch 放在偏移 $0$，占 $[3000\text{H},3000\text{H}]$。
- num 是 int，起始偏移必须是 $4$ 的倍数，紧接的合法偏移是 $4$，故 num 占 $[3004\text{H},3007\text{H}]$。
- s 是 short，起始偏移必须是 $2$ 的倍数，紧接 $8$ 合法，占 $[3008\text{H},3009\text{H}]$。

结构体总大小需为最大对齐（$4$）的倍数，故整体占 $12$B，但本题只需 num 的位置。

## 2. 小端方式下的字节分布

小端方式：低位字节存放在低地址。机器数 num $=9\text{ABCDEF}0\text{H}$，从低字节到高字节依次为 F0、DE、BC、9A，对应

- 3004H：F0
- 3005H：DE
- 3006H：BC
- 3007H：9A

字节 BCH 位于 **3006H**。

## 3. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q14 struct little-endian, num=9ABCDEF0H, s base=3000H ===
  ch@3000, int num@3004 (align4). bytes LE: ['F0', 'DE', 'BC', '9A']
  3004:F0 3005:DE 3006:BC 3007:9A -> BC @ 3006H
~~~`,pitfalls:String.raw`- 忽略边界对齐：若从 ch 后紧挨着放 num（偏移 $1$），会得出 3005H，错。
- 把小端当大端：大端下字节顺序相反，BCH 会落到 3005H，错。
- 从 BCH 在 9ABCDEF0H 中的位置判断字节序号：BCH 是第 3 个（从低位起）字节，$4+2=6$，即 3006H。`}},{id:`mock-exam-4-co-q15`,questionNumber:15,title:`存储器与半导体存储器的性质辨析`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 存储系统（主存与半导体存储器）`,tags:[`DRAM 刷新`,`FLASH`,`ROM`,`随机存取`],summary:`判断关于动态存储器刷新、FLASH 可改写性与 DRAM 存取方式的叙述中哪些正确。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 4 页（卷面第 3 页）第 15 题。原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`下列关于存储器的叙述中正确的是（　）。

- Ⅰ．动态存储器是利用电容电荷来存储信息的，需要周期性逐个刷新每一个存储单元
- Ⅱ．FLASH 具有不易失特性，所以它是 ROM 且无法更新存储单元
- Ⅲ．DRAM 是动态存储器，采用随机存取方式，存取地址需分两次送入

- A．Ⅰ
- B．Ⅰ 和 Ⅱ
- C．Ⅱ 和 Ⅲ
- D．Ⅲ`,attachments:[{name:`查看原卷试题页（第 4 页，含题 15~23 号题干）`,path:`mock-exam-4/co-os-page-4.png`}],solution:{answer:String.raw`**选 D：只有 Ⅲ 正确。**`,explanation:String.raw`## 逐条判定

- **Ⅰ 错误。** DRAM 确实用电容电荷存储信息、需要周期性刷新，但刷新是**以行为单位**进行的（一次刷新一整行），不是“逐个刷新每一个存储单元”。关键词“逐个”使该叙述错误。

- **Ⅱ 错误。** FLASH 属于 EEPROM 一类，具有非易失（不易失）特性，但它是**电可擦写、可重写**的，可以更新存储单元，并非“无法更新”。

- **Ⅲ 正确。** DRAM 是动态随机存取存储器，采用随机存取方式；其地址通常分为行地址和列地址，分两次（RAS、CAS）送入芯片，这正是 DRAM 的典型寻址方式。

三项中只有 Ⅲ 正确，故选 **D**。`,pitfalls:String.raw`- 把 Ⅰ 判对：DRAM 刷新按行进行，“逐个刷新每一个单元”的表述错误，须扣字眼。
- 把 Ⅱ 判对：把 FLASH 等同于只能读的掩膜 ROM；FLASH 可电擦写。
- 误认为 DRAM 是顺序存取：DRAM 是随机存取（地址可任意访问），只是行/列地址分两次送入。`}},{id:`mock-exam-4-co-q16`,questionNumber:16,title:`多级页表的级数下限`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 存储系统（虚拟存储器与多级页表）`,tags:[`多级页表`,`页表项`,`页大小`,`虚拟地址`],summary:`给虚拟地址位数、页大小与页表项大小，求满足“每级页表不超过一页”的最少页表级数。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 4 页（卷面第 3 页）第 16 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`某计算机虚拟地址 48 位，页大小 16KB，页表项大小 8B，若采用多级页表结构，且每级页表大小不超过一页（16KB），则至少需要（　）级页表。

- A．2
- B．3
- C．4
- D．5`,attachments:[{name:`查看原卷试题页（第 4 页，含题 15~23 号题干）`,path:`mock-exam-4/co-os-page-4.png`}],solution:{answer:String.raw`**选 C：4 级。**`,explanation:String.raw`## 1. 页内偏移位数

页大小 $16\text{KB}=2^{14}\text{B}$，故页内偏移占 $14$ 位。

## 2. 虚拟页号位数

$$
\text{VPN}=48-14=34\ \text{位}.
$$

## 3. 每级页表能覆盖的 VPN 位数

一页可存放的页表项数 $=\dfrac{16\text{KB}}{8\text{B}}=2048=2^{11}$，即每级页表用 $11$ 位 VPN 作索引。

## 4. 求级数

$$
\left\lceil \frac{34}{11}\right\rceil=\lceil 3.09\rceil=4.
$$

故至少需要 **4 级**页表。

## 5. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q16 multi-level page table: VA=48, page=16KB, PTE=8B ===
  offset=14 bits, VPN=34 bits, entries/page=2^11
  levels needed = 4  (ceil(34/11))
~~~`,pitfalls:String.raw`- 用 $34/11\approx 3.09$ 后向下取整取 3：3 级只能覆盖 $33$ 位，差 1 位，必须上取整到 4。
- 忘记减页内偏移：直接用 $48/11\approx 4.36$ 会误判级数（本例巧合接近，但方法错）。
- 把页表项大小当页大小：把 $8\text{B}$ 误作页大小会得到完全不同的结果。`}},{id:`mock-exam-4-co-q17`,questionNumber:17,title:`DRAM 异步刷新的刷新间隔与开销`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 存储系统（DRAM 刷新）`,tags:[`DRAM 刷新`,`异步刷新`,`刷新开销`,`存储周期`],summary:`由芯片矩阵行数与刷新周期上限，计算异步刷新的刷新信号间隔与刷新开销。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 4 页（卷面第 3 页）第 17 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`用 $64\text{K}\times 1$ 位的 DRAM 芯片构成 $1\text{M}\times 8$ 位的存储器，芯片内部存储单元排列为 $256\times 256$ 矩阵。若采用异步刷新，每行刷新间隔不超过 2ms，读写周期为 $0.5\ \mu\text{s}$，通常刷新开销小于 $10\%$ 时，认为对 CPU 访问影响较小，则下列说法正确的是（　）。

- A．刷新信号间隔为 $8\ \mu\text{s}$，刷新一行用 $0.5\ \mu\text{s}$，对 CPU 访问影响大
- B．刷新信号间隔约为 $7.8\ \mu\text{s}$，刷新一行用 $0.5\ \mu\text{s}$，基本不影响 CPU 访问
- C．刷新信号间隔为 $16\ \mu\text{s}$，刷新一行用 $1\ \mu\text{s}$，对 CPU 访问影响小
- D．刷新信号间隔约为 $15.6\ \mu\text{s}$，刷新一行用 $1\ \mu\text{s}$，基本不影响 CPU 访问`,attachments:[{name:`查看原卷试题页（第 4 页，含题 15~23 号题干）`,path:`mock-exam-4/co-os-page-4.png`}],solution:{answer:String.raw`**选 B。**`,explanation:String.raw`## 1. 异步刷新的刷新间隔

芯片内部为 $256\times 256$ 矩阵，即共 $256$ 行。异步刷新要求整块存储体在 $2\ \text{ms}$ 内把所有行刷新一遍，故相邻两次“刷新一行”的时间间隔为

$$
\Delta t=\frac{2\ \text{ms}}{256}=\frac{2000\ \mu\text{s}}{256}=7.8125\ \mu\text{s}\approx 7.8\ \mu\text{s}.
$$

## 2. 每次刷新的耗时

刷新一行等价于对该行做一次读出（再写回），占用一个读写周期，即 $0.5\ \mu\text{s}$。

## 3. 刷新开销

$$
\text{开销}=\frac{0.5}{7.8125}\times 100\%=6.4\%<10\%.
$$

故“基本不影响 CPU 访问”。对照选项，只有 B 同时满足“间隔约 $7.8\ \mu\text{s}$、刷新一行 $0.5\ \mu\text{s}$、开销小于 $10\%$”。

## 4. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q17 DRAM refresh ===
  interval per row = 2ms/256 = 7.8125 us = 7.812 us
  refresh cycle 0.5us -> overhead = 6.4 %
  refresh cycle 1us   -> overhead = 12.8 %
~~~`,pitfalls:String.raw`- 把 $2\text{ms}$ 当成“每行”的刷新间隔上限的分母搞反：应除以行数 $256$，得 $7.8\ \mu\text{s}$。
- 取刷新周期 $1\ \mu\text{s}$：读写周期是 $0.5\ \mu\text{s}$，此时开销 $12.8\%>10\%$，不满足“影响小”，故 C、D 错。
- 把矩阵总数 $256\times256$ 当行数：行数是 $256$，不是 $65536$。`}},{id:`mock-exam-4-co-q18`,questionNumber:18,title:`微指令下址字段的位数`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 中央处理器（微程序控制与微指令编码）`,tags:[`微指令`,`下址字段`,`控制字段`,`判别测试字段`],summary:`由微指令条数与微指令字长，推算微指令下址字段至少需要的位数。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 4 页（卷面第 3 页）第 18 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`某 CPU 采用水平型微指令，共有 16384 条微指令，控制字段需支持 128 种微操作，判别测试字段需支持 8 种条件转移。若微指令字长为 48 位，下址字段用于微指令寻址，则下址字段至少需要（　）位。

- A．12
- B．14
- C．16
- D．18`,attachments:[{name:`查看原卷试题页（第 4 页，含题 15~23 号题干）`,path:`mock-exam-4/co-os-page-4.png`}],solution:{answer:String.raw`**选 B：14 位。**`,explanation:String.raw`## 1. 下址字段的作用与下界

下址字段用于给出“下一条微指令”在控制存储器中的地址。控制存储器中共有 16384 条微指令，其地址范围是 $0\sim 16383$，需

$$
\left\lceil \log_2 16384\right\rceil=\left\lceil \log_2 2^{14}\right\rceil=14\ \text{位}.
$$

## 2. 与整字长是否相容

微指令字长 $48$ 位，减去下址字段 $14$ 位、判别测试字段（需 $8$ 种条件转移，$\lceil\log_2 8\rceil=3$ 位）后，仍余

$$
48-14-3=31\ \text{位},
$$

足以容纳控制字段（最多 $128$ 种微操作，编码只需 $\lceil\log_2 128\rceil=7$ 位），故 $14$ 位是可行且最小的下址字段宽度。

## 3. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q18 microinstruction control: 16384 uins, 48-bit ===
  addr bits = 14   (2^14=16384)
~~~`,pitfalls:String.raw`- 用整字长 $48$ 作为下址位数：错，下址只与微指令条数 $16384$ 有关。
- 把 $128$ 种微操作误算成控制字段位数再相加后比 $48$：控制字段即使按不编码也要 $128$ 位，$48$ 位装不下，说明本题“水平型”表述下控制字段应按编码理解，重点仍是下址 $14$ 位。
- 漏掉“至少”：$2^{13}=8192<16384$，$13$ 位不够。`}},{id:`mock-exam-4-co-q19`,questionNumber:19,title:`相对寻址形式地址字段的计算`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 指令系统（寻址方式与相对寻址）`,tags:[`相对寻址`,`形式地址`,`补码`,`PC 值`],summary:`给两条相对寻址指令的首地址与操作数有效地址，反求各自 8 位补码形式地址字段。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 4 页（卷面第 3 页）第 19 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`某计算机按字节编址，采用定长 16 位指令。相对寻址指令的形式地址字段为 8 位补码，取指令结束后 PC 已指向下一条指令。若第一条指令的首地址为 1005H、操作数有效地址为 100EH，则其形式地址字段为（　）；若第二条指令的首地址为 1008H、操作数有效地址为 1001H，则其形式地址字段为（　）。

- A．07H；F7H
- B．05H；F5H
- C．09H；F9H
- D．0BH；FBH`,attachments:[{name:`查看原卷试题页（第 4 页，含题 15~23 号题干）`,path:`mock-exam-4/co-os-page-4.png`}],solution:{answer:String.raw`**选 A：$07\text{H}$；$F7\text{H}$。**`,explanation:String.raw`## 1. 相对寻址的关键：基准是被取指令后的 PC

定长 16 位指令占 $2$ 字节，取指结束后 PC 已指向下一条指令，故

$$
(\text{PC})=\text{指令首地址}+2.
$$

有效地址 $\text{EA}=(\text{PC})+\text{disp}$，其中 disp 为 8 位补码形式地址。

## 2. 第一条

$$
(\text{PC})=1005\text{H}+2=1007\text{H},\qquad
\text{disp}=\text{EA}-(\text{PC})=100\text{E}\text{H}-1007\text{H}=7=07\text{H}.
$$

## 3. 第二条

$$
(\text{PC})=1008\text{H}+2=100\text{A}\text{H},\qquad
\text{disp}=1001\text{H}-100\text{A}\text{H}=-9.
$$

$-9$ 的 8 位补码：$256-9=247=\text{F}7\text{H}$。

## 4. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q19 PC-relative, 16-bit fixed, form=8-bit two's complement ===
  instr1: first=1005H EA=100EH -> (7, '07H')
  instr2: first=1008H EA=1001H -> (-9, 'F7H')
~~~`,pitfalls:String.raw`- 用指令首地址而非“下一条指令地址”作基准：第一条会算成 $09\text{H}$（选 C），第二条算成 $-7$（$F9\text{H}$）。
- 忘记指令长 2 字节：定长 16 位指令按字节编址恰占 $2$ 字节，PC 加 $2$ 而非加 $1$。
- 负数位移忘记转补码：$-9$ 应写 $F7\text{H}$，不要写成 $-9$ 或 $09\text{H}$。`}},{id:`mock-exam-4-co-q20`,questionNumber:20,title:`分支预测错误气泡对 CPI 的影响`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 中央处理器（流水线与 CPI）`,tags:[`CPI`,`流水线`,`分支预测`,`气泡`],summary:`由分支指令比例与预测错误率，计算插入气泡后的实际 CPI。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 4 页（卷面第 3 页）第 20 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`某流水线 CPI 为 1，分支指令占 $20\%$，分支预测错误率为 $10\%$，预测错误时需额外插入 3 个气泡/时钟周期。则实际 CPI 为（　）。

- A．1.06
- B．1.2
- C．1.02
- D．1.6`,attachments:[{name:`查看原卷试题页（第 4 页，含题 15~23 号题干）`,path:`mock-exam-4/co-os-page-4.png`}],solution:{answer:String.raw`**选 A：1.06。**`,explanation:String.raw`## 1. 思路

理想 CPI 为 $1$。每条指令平均多出的时钟周期来自“分支预测错误”插入的气泡：

$$
\text{额外周期}=\text{分支比例}\times\text{预测错误率}\times\text{每次错误气泡数}.
$$

## 2. 代入

$$
\text{额外周期}=0.20\times 0.10\times 3=0.06.
$$

故实际 CPI

$$
\text{CPI}=1+0.06=1.06.
$$

## 3. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q20 CPI = 1 + 0.20*0.10*3 ===
  CPI = 1.06
~~~`,pitfalls:String.raw`- 把 $20\%$ 与 $10\%$ 相乘后再乘 $3$ 时漏掉某一项（如只算 $0.1\times3=0.3$）：实际是 $0.2\times0.1\times3=0.06$。
- 把预测错误率当成“分支占全部指令的比例”叠加：应相乘成“每指令平均错误分支数”。
- 误选 1.2：那是把 $20\%\times3$ 当结果，漏乘错误率 $10\%$。`}},{id:`mock-exam-4-co-q21`,questionNumber:21,title:`DMA 周期窃取方式下总线控制权的归还时机`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 输入/输出系统（DMA 方式）`,tags:[`DMA`,`周期窃取`,`总线控制权`,`数据通路`],summary:`判断 DMA 采用周期窃取方式时，CPU 在何时恢复总线控制权。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 4 页（卷面第 3 页）第 21 题。原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`若 DMA 采用周期窃取的方式进行数据传输，CPU 会在（　）恢复总线控制权。

- A．每个数据传输后
- B．数据块传输完成后
- C．总线仲裁结束后
- D．CPU 主动收回时`,attachments:[{name:`查看原卷试题页（第 4 页，含题 15~23 号题干）`,path:`mock-exam-4/co-os-page-4.png`}],solution:{answer:String.raw`**选 A：每个数据传输后。**`,explanation:String.raw`## 1. 周期窃取（周期挪用）的含义

周期窃取指 DMA 控制器每传送一个数据，就挪用（窃取）一个或几个存储周期，占用一次总线；传送完成后**立即把总线还给 CPU**，下一次再传时再申请。因此 CPU 在“每个数据传输后”就能恢复对总线的控制权。

## 2. 与其他方式对比

- **停止 CPU 访存（成组传送）**：DMA 传完整个数据块才归还总线，CPU 要等“数据块传输完成后”才恢复控制权，对应 B。
- **周期窃取**：按数据（字）为单位穿插，CPU 在每个数据传输后即恢复控制权，故选 A。
- **交替访问**：按时间片轮流，不由 DMA 主动归还确定。

## 3. 说明

选项 C“总线仲裁结束后”、D“CPU 主动收回时”都不是周期窃取的归还时机；交替访问或 CPU 优先级策略下才可能出现。`,pitfalls:String.raw`- 把周期窃取与“停止 CPU 访存”混淆，误选 B。
- 误以为 DMA 一旦得到总线就直到块结束才释放：那是成组（停止 CPU 访存）方式。
- 把“总线仲裁”当成归还时机：仲裁发生在申请阶段，与归还无关。`}},{id:`mock-exam-4-co-q22`,questionNumber:22,title:`中断向量表的作用`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 输入/输出系统（中断）`,tags:[`中断向量表`,`中断服务程序`,`中断屏蔽`,`中断优先级`],summary:`判断中断向量表在中断处理中的具体作用。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 4 页（卷面第 3 页）第 22 题。原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`中断向量表的作用是（　）。

- A．存储中断服务程序入口地址
- B．存储中断屏蔽字
- C．存储外设状态
- D．存储中断优先级`,attachments:[{name:`查看原卷试题页（第 4 页，含题 15~23 号题干）`,path:`mock-exam-4/co-os-page-4.png`}],solution:{answer:String.raw`**选 A：存储中断服务程序入口地址。**`,explanation:String.raw`## 1. 中断向量与中断向量表

“中断向量”就是中断服务程序的入口地址。中断向量表把各个中断类型号对应的**中断服务程序入口地址**集中存放：CPU 响应中断后，用中断类型号作索引从表中取出入口地址，转去执行相应的中断服务程序。

## 2. 逐项排除

- **B 错**：中断屏蔽字一般放在中断屏蔽寄存器或程序状态字中，用于控制哪些中断可被响应，不在中断向量表里。
- **C 错**：外设状态通常记录在外设接口的状态寄存器中。
- **D 错**：中断优先级由中断优先级排队电路或优先级寄存器决定，不是中断向量表的内容。

因此选 **A**。`,pitfalls:String.raw`- 把中断向量表与中断屏蔽字、优先级混为一谈。
- 误以为中断向量表存的是“中断类型号”：类型号是索引，表项内容才是入口地址。
- 忽略“最多可定义多少种中断”与表项数的关系：表长由中断类型号位数决定。`}},{id:`mock-exam-4-os-q23`,questionNumber:23,title:`操作系统基本概念与特征的辨析`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 操作系统概述（基本特征与功能）`,tags:[`脱机 I/O`,`并行与并发`,`实时系统`,`分时系统`,`资源抽象`],summary:`在六条关于操作系统特征与功能的叙述中，选出全部正确的组合。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 4 页（卷面第 3 页）题干、第 5 页（卷面第 4 页）逐条叙述与选项。原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`以下关于操作系统的描述中，正确的是（　）。

- Ⅰ．脱机 I/O 可使主机的计算与外围机的输入输出并行进行，从而减少 CPU 等待慢速 I/O 设备的时间并提高系统吞吐量
- Ⅱ．在单处理器多道批处理系统中，内存中的若干道程序可以在同一时刻真正并行执行
- Ⅲ．实时系统中的硬实时任务必须在截止时间前完成，否则会出现难以预测的后果
- Ⅳ．分时系统的独立性是指每个用户在各自的终端上操作，彼此之间互不干扰，就像独占主机一样
- Ⅴ．单道批处理系统必须采用联机 I/O，不能采用脱机 I/O
- Ⅵ．操作系统对资源的抽象是指隐藏硬件操作细节、向上提供抽象的模型，比如 I/O 软件将 I/O 设备抽象为一组数据结构和操作命令

- A．Ⅰ、Ⅲ、Ⅴ
- B．Ⅱ、Ⅳ、Ⅵ
- C．Ⅰ、Ⅲ、Ⅳ、Ⅵ
- D．Ⅱ、Ⅴ`,attachments:[{name:`查看原卷试题页（第 4 页，含题 23 题干起始）`,path:`mock-exam-4/co-os-page-4.png`},{name:`查看原卷试题页（第 5 页，含题 23 逐条叙述与选项）`,path:`mock-exam-4/co-os-page-5.png`}],solution:{answer:String.raw`**选 C：Ⅰ、Ⅲ、Ⅳ、Ⅵ 正确。**`,explanation:String.raw`## 逐条判定

- **Ⅰ 正确。** 脱机 I/O 借助外围机（卫星机）把输入数据先由外围机输入到磁带/磁盘，主机再从该设备读入；主机计算与外围机 I/O 可并行，减少 CPU 等慢速设备的时间，提高吞吐量。

- **Ⅱ 错误。** 单处理器在任一时刻只能执行一道程序。多道批处理实现的是**并发**（宏观上多道程序同时处于运行态附近、交替推进），不是同一时刻的**真正并行**。真正并行需要多处理器/多核。

- **Ⅲ 正确。** 硬实时任务的完成时间有硬性截止，超时会造成严重后果且不可预测，必须在截止时间前完成。

- **Ⅳ 正确。** 分时系统的“独立性/独占性”是指各用户通过各自终端使用系统、互不干扰，每个用户感觉独占主机。

- **Ⅴ 错误。** 单道批处理系统同样可以采用脱机 I/O（由外围机预先完成数据的输入输出），并非“必须联机、不能脱机”。

- **Ⅵ 正确。** 操作系统通过抽象隐藏硬件细节，向上提供统一模型；例如 I/O 软件把设备抽象为一组数据结构和操作（如读写、打开/关闭），这是资源抽象的直接体现。

正确项为 Ⅰ、Ⅲ、Ⅳ、Ⅵ，故选 **C**。`,pitfalls:String.raw`- 把“并发”当成“并行”：单处理器同一时刻只能跑一道程序，Ⅱ 错。
- 认为单道批处理只能用联机 I/O：脱机 I/O 是早期批处理的常用手段，Ⅴ 错。
- 见到“全选”就选：本题并非全对，Ⅱ、Ⅴ 明确错误。
- 把“资源抽象”理解成硬件层面：抽象是操作系统向上层提供模型，Ⅵ 的表述正确。`}},{id:`mock-exam-4-os-q24`,questionNumber:24,title:`共享内存通信中的进程同步`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 进程与线程（进程同步与共享内存通信）`,tags:[`共享内存`,`进程同步`,`信号量`,`互斥`],summary:`判断进程间采用共享内存通信时，读写同步问题应如何解决。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 5 页（卷面第 4 页）第 24 题。原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`进程间采用共享内存通信时，同步问题应（　）解决。

- A．使用消息队列
- B．依赖内核自动同步
- C．需额外信号量或锁机制
- D．无需同步，因为共享内存为直接访问`,attachments:[{name:`查看原卷试题页（第 5 页，含题 23~28）`,path:`mock-exam-4/co-os-page-5.png`}],solution:{answer:String.raw`**选 C：需额外信号量或锁机制。**`,explanation:String.raw`## 1. 共享内存的特点

共享内存把同一块物理内存映射到多个进程的地址空间，进程可直接读写，速率高，是**最快**的进程间通信方式。但操作系统只负责建立映射，**不负责对共享区读写的互斥与同步**。

## 2. 为什么必须自己加同步机制

多个进程并发读写同一共享区时，会出现竞态条件（如两个进程同时对一个计数器做“读—改—写”）。因此必须由进程**额外使用信号量、互斥锁等同步机制**来保证互斥，并配合条件同步（如生产者-消费者）。故 C 正确。

## 3. 逐项排除

- **A 错**：消息队列本身是一种通信方式，用它来“解决共享内存的同步”是答非所问。
- **B 错**：内核不自动为共享内存读写做同步。
- **D 错**：“直接访问”恰恰是必须同步的原因。`,pitfalls:String.raw`- 误以为共享内存由内核保证互斥：内核只提供共享映射，不提供互斥。
- 把“通信方式”与“同步机制”混淆：共享内存/管道/消息队列是通信方式，信号量/锁是同步手段。
- 认为读操作天然安全：读写交错同样会产生数据不一致。`}},{id:`mock-exam-4-os-q25`,questionNumber:25,title:`短作业优先调度的主要优点`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 处理机调度（调度算法）`,tags:[`短作业优先`,`平均周转时间`,`平均等待时间`,`非抢占式调度`],summary:`判断在一批作业同时到达时，短作业优先调度相较其他算法的主要优点。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 5 页（卷面第 4 页）第 25 题。原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`在单处理器系统中，若一批作业同时到达、各作业的服务时间已知，采用非抢占式调度且忽略调度开销，则与先来先服务和高响应比优先调度相比，短作业优先调度的主要优点是（　）。

- A．使每个作业的等待时间相同
- B．使该批作业的平均等待时间和平均周转时间最小
- C．保证长作业不会发生饥饿
- D．不需要预先知道作业的服务时间`,attachments:[{name:`查看原卷试题页（第 5 页，含题 23~28）`,path:`mock-exam-4/co-os-page-5.png`}],solution:{answer:String.raw`**选 B：使该批作业的平均等待时间和平均周转时间最小。**`,explanation:String.raw`## 1. 短作业优先（SJF）的性质

在一批作业同时到达、服务时间已知、非抢占且无调度开销的前提下，短作业优先可使该批作业的**平均等待时间和平均周转时间最小**（这是 SJF 相对 FCFS、HRRN 的核心结论）。

## 2. 逐项排除

- **A 错**：SJF 使各作业等待时间有长有短（短作业先被服务，长作业等待久），不是“每个作业等待时间相同”。
- **C 错**：正是 SJF 容易使长作业长期得不到服务（饥饿）；HRRN 才能兼顾长短作业、避免饥饿。
- **D 错**：SJF 恰恰要求**预先知道**每个作业的服务时间，这是它的前提而非优点。

## 3. 小结

SJF 用“服务时间短者优先”换取平均指标最优，代价是需要预知服务时间、长作业可能饥饿。`,pitfalls:String.raw`- 把 SJF 与 HRRN 搞混：避免饥饿、兼顾长短的是 HRRN。
- 认为“平均等待时间相同”：SJF 只保证平均最优，不保证每个作业等待时间相等。
- 忽略前提“服务时间已知”：这是 SJF 的适用条件，也是它的局限。`}},{id:`mock-exam-4-os-q26`,questionNumber:26,title:`循环首次适应算法的剩余空闲分区`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 内存管理（动态分区分配 · 循环首次适应）`,tags:[`动态分区分配`,`循环首次适应`,`空闲分区`,`分配指针`],summary:`由初始空闲分区表与分配指针，依次分配三个作业后求剩余空闲分区。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 5 页（卷面第 4 页）第 26 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`某操作系统按字节编址，采用循环首次适应算法管理内存。内存初始空闲分区情况如下（按地址递增排列）。

- 分区起始地址 100 KB，分区大小 50 KB
- 分区起始地址 200 KB，分区大小 80 KB
- 分区起始地址 300 KB，分区大小 120 KB
- 分区起始地址 480 KB，分区大小 70 KB

当前分配指针指向起始地址为 200KB 的空闲分区。分配时从当前指针所指位置开始循环查找，并从满足要求的空闲分区**低地址端**划出空间；若该分区仍有剩余空间，则下一次查找从这一剩余部分开始。三个作业依次申请 60KB、70KB 和 30KB。处理完后，剩余空闲分区为（　）。

- A．100KB/50KB，260KB/20KB，370KB/50KB，510KB/40KB
- B．100KB/50KB，260KB/20KB，400KB/20KB，480KB/70KB
- C．130KB/20KB，260KB/20KB，370KB/50KB，510KB/40KB
- D．100KB/50KB，200KB/20KB，400KB/20KB，480KB/70KB`,attachments:[{name:`查看原卷试题页（第 5 页，含题 23~28）`,path:`mock-exam-4/co-os-page-5.png`}],solution:{answer:String.raw`**选 B：100KB/50KB、260KB/20KB、400KB/20KB、480KB/70KB。**`,explanation:String.raw`## 1. 初始空闲分区与指针

空闲分区（起始/大小）：$[100,50]$、$[200,80]$、$[300,120]$、$[480,70]$；分配指针指向 $200$KB。

## 2. 依次分配（从指针处向后循环查找，切低地址端）

- **作业 1 申请 60KB**：从指针 $200$ 起，$[200,80]$ 满足。切低地址端 $60$KB，得 $[200,260)$ 被占用，剩余空闲 $[260,20]$。指针移到 $260$。
- **作业 2 申请 70KB**：从 $260$ 起，$[260,20]$ 不够；下一个 $[300,120]$ 满足。切低地址端 $70$KB，得 $[300,370)$ 被占用，剩余空闲 $[370,50]$。指针移到 $370$。
- **作业 3 申请 30KB**：从 $370$ 起，$[370,50]$ 满足。切低地址端 $30$KB，得 $[370,400)$ 被占用，剩余空闲 $[400,20]$。指针移到 $400$。

## 3. 剩余空闲分区

未被触动的 $[100,50]$、$[480,70]$，加上新产生的 $[260,20]$、$[400,20]$，即

- 100KB/50KB
- 260KB/20KB
- 400KB/20KB
- 480KB/70KB

与选项 B 一致。

## 4. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q26 next-fit ===
  alloc 60 from [200,280) -> rem [260,280) size 20
  alloc 70 from [300,420) -> rem [370,420) size 50
  alloc 30 from [370,420) -> rem [400,420) size 20
   free: [(100, 50), (260, 20), (400, 20), (480, 70)]
~~~`,pitfalls:String.raw`- 把它当成首次适应：首次适应每次从地址最低处查找，结果会不同（这正是选项 A/C 的误导）。
- 分配后忘记移动指针：循环首次适应的指针要指向“剩余部分”或“分配位置之后”。
- 把 $[370,50]$ 当作仍空闲：它已被 30KB 占用，只剩 $[400,20]$，故选项里出现 370KB/50KB 的（A、C）均错。`}},{id:`mock-exam-4-os-q27`,questionNumber:27,title:`同类资源总数与死锁的判定`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 死锁（资源分配与死锁判定）`,tags:[`死锁`,`同类资源`,`资源总数`,`必要条件`],summary:`给进程数与每进程最大资源需求，判断在给定资源总数下是否可能发生死锁。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 5 页（卷面第 4 页）第 27 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`若系统中有 4 个进程，每个进程需要 3 个同类资源，系统资源总数为 9，则（　）。

- A．可能发生死锁
- B．必然发生死锁
- C．不会发生死锁
- D．无法确定`,attachments:[{name:`查看原卷试题页（第 5 页，含题 23~28）`,path:`mock-exam-4/co-os-page-5.png`}],solution:{answer:String.raw`**选 C：不会发生死锁。**`,explanation:String.raw`## 1. 不发生死锁的资源数下界

设进程数为 $n$、每进程最大需求为 $m$、同类资源总数为 $R$。最坏情况下每个进程都已持有 $m-1$ 个资源、都在等待最后一个资源，此时若**再多一个**资源，就必有一个进程能获得全部所需资源并运行完成、释放资源，从而打破僵局。故当

$$
R\ge n\times(m-1)+1
$$

时一定不会发生死锁。

## 2. 代入本题

$$
R\ge 4\times(3-1)+1=4\times 2+1=9.
$$

系统资源总数恰为 $9$，达到该下界，故**不会发生死锁**。

## 3. 说明

若总数为 $8$，则可能每个进程各持 $2$ 个资源、都等第 $3$ 个而互相等待，形成死锁；本题为 $9$，已越过该临界点。

## 4. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q27 deadlock: 4 proc, each max 3 of 9 ===
  needed to guarantee: (3-1)*4+1 = 9  -> 9 total => no deadlock possible
~~~`,pitfalls:String.raw`- 只凭“资源数小于进程数×每进程需求（$4\times3=12$）”就判定必然死锁：要看的是临界值 $n(m-1)+1$。
- 把临界公式写成 $n\times m$：$4\times3=12$ 不是临界点，正确下界是 $9$。
- 误选“可能发生死锁”：总数恰好等于安全下界，任何分配方式都不会死锁。`}},{id:`mock-exam-4-os-q28`,questionNumber:28,title:`段页式存储的段表项与页表项地址`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 内存管理（基本段页式地址变换）`,tags:[`段页式`,`段表项`,`页表项`,`逻辑地址划分`],summary:`由 32 位逻辑地址格式与段表基址，计算该地址对应段表项、页表项的物理地址。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 5 页（卷面第 4 页）题干与第 6 页（卷面第 5 页）第 28 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`某计算机按字节编址，采用基本段页式存储管理。32 位逻辑地址从高位到低位依次由 8 位段号、12 位页号和 12 位页内偏移量组成。段表基址寄存器的内容为 00102F00H，每个段表项占 8B。逻辑地址 2D3A5B7CH 所属段的段表项中记录的页表始址为 00304000H，每个页表项占 4B。上述地址均为物理地址。该逻辑地址对应的段表项地址和页表项地址分别为（　）。

- A．00103068H，00304E94H
- B．00102F2DH，00304E94H
- C．00103068H，003043A5H
- D．00102F2DH，003043A5H`,attachments:[{name:`查看原卷试题页（第 5 页，含题 28 题干起始）`,path:`mock-exam-4/co-os-page-5.png`},{name:`查看原卷试题页（第 6 页，含题 28 剩余题干与选项）`,path:`mock-exam-4/co-os-page-6.png`}],solution:{answer:String.raw`**选 A：00103068H，00304E94H。**`,explanation:String.raw`## 1. 拆分逻辑地址

逻辑地址 $2\text{D3A5B7C}\text{H}$ 按 8 位段号、12 位页号、12 位偏移拆分：

- 段号 $=2\text{D}\text{H}=45$
- 页号 $=3\text{A5}\text{H}=933$
- 页内偏移 $=\text{B7C}\text{H}$

（拆分依据：$2\text{D}3\text{A}5\text{B}7\text{C}$ 取高 8 位为段号 $2\text{D}$，接着 12 位为页号 $3\text{A5}$，低 12 位为偏移 $\text{B7C}$。）

## 2. 段表项地址

段表项地址 $=\text{段表基址}+\text{段号}\times\text{段表项大小}$：

$$
00102\text{F00}\text{H}+45\times 8=00102\text{F00}\text{H}+360=00102\text{F00}\text{H}+168\text{H}=00103068\text{H}.
$$

## 3. 页表项地址

从该段表项中读出页表始址 $00304000\text{H}$。页表项地址 $=\text{页表始址}+\text{页号}\times\text{页表项大小}$：

$$
00304000\text{H}+933\times 4=00304000\text{H}+3732=00304000\text{H}+\text{E94}\text{H}=00304\text{E94}\text{H}.
$$

## 4. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q28 segment+page address translation ===
  segno=2DH=45  pageno=3A5H=933  off=B7CH
  seg entry addr = 00102F00H + 45*8 = 00103068H
  page entry addr = 00304000H + 933*4 = 00304E94H
~~~`,pitfalls:String.raw`- 段表项大小用错：本题段表项 $8$B（页表项才 $4$B），混用会得到 $00102\text{F2D}\text{H}$（选项 B/D 的误导项）。
- 忘记加段表基址或页表始址，直接用段号/页号乘大小。
- 逻辑地址拆分错误：注意是 8 位段号 + 12 位页号 + 12 位偏移，$2\text{D}$ 为段号而非页号。`}},{id:`mock-exam-4-os-q29`,questionNumber:29,title:`硬链接与符号链接的性质辨析`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 文件管理（文件共享：硬链接与软链接）`,tags:[`硬链接`,`符号链接`,`inode`,`文件共享`],summary:`判断关于硬链接与符号链接（软链接）的正确描述。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 6 页（卷面第 5 页）第 29 题。原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`下列关于符号链接（软链接）与硬链接的描述，正确的是（　）。

- A．硬链接创建时复制原文件内容
- B．符号链接与原文件共享同一个 inode
- C．硬链接不能跨文件系统创建
- D．符号链接删除后原文件无法访问`,attachments:[{name:`查看原卷试题页（第 6 页，含题 28~32 及 CN 34）`,path:`mock-exam-4/co-os-page-6.png`}],solution:{answer:String.raw`**选 C：硬链接不能跨文件系统创建。**`,explanation:String.raw`## 1. 硬链接与符号链接的本质

- **硬链接**：为同一 inode 增加一个目录项，多个目录项指向**同一个 inode**，并不复制文件内容。删除一个硬链接只是把链接计数减一；因 inode 号只在同一文件系统内唯一，硬链接**不能跨文件系统**。
- **符号链接**：是一个独立的文件（有自己的 inode），内容只是一条路径名，指向原文件。

## 2. 逐项排除

- **A 错**：硬链接不复制内容，只是增加指向同一 inode 的目录项。
- **B 错**：符号链接有自己的 inode，不与原文件共享 inode（共享 inode 的是硬链接）。
- **C 对**：inode 号在单个文件系统内唯一，跨文件系统无法用同一 inode 表示，故硬链接不能跨文件系统。
- **D 错**：删除符号链接只删掉那个“快捷方式”，原文件本体仍在，可正常访问。

## 3. 小结

硬链接共享 inode、不跨文件系统；符号链接独立 inode、可跨文件系统，但原文件删除后会变成悬空链接。`,pitfalls:String.raw`- 把“硬链接”与“复制文件”混淆：硬链接不占新数据空间。
- 认为符号链接共享 inode：共享 inode 的是硬链接。
- 认为硬链接能跨文件系统：inode 号不唯一，不能跨。
- 认为删软链接会导致原文件不可访问：原文件仍在。`}},{id:`mock-exam-4-os-q30`,questionNumber:30,title:`文件系统的概念辨析`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 文件管理（文件系统的构成与目录结构）`,tags:[`文件逻辑结构`,`文件控制块`,`多级目录`,`打开文件`],summary:`判断关于文件逻辑结构、FCB、目录结构与打开操作的正确描述。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 6 页（卷面第 5 页）第 30 题。原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`以下关于文件系统的描述，正确的是（　）。

- A．文件的逻辑结构是指文件在硬盘空间的存储模式
- B．文件控制块 FCB 包含了文件的说明信息与文件内容
- C．多级目录结构能有效解决文件命名冲突的问题
- D．修改某个文件内容时，无需执行打开文件的操作`,attachments:[{name:`查看原卷试题页（第 6 页，含题 28~32 及 CN 34）`,path:`mock-exam-4/co-os-page-6.png`}],solution:{answer:String.raw`**选 C：多级目录结构能有效解决文件命名冲突的问题。**`,explanation:String.raw`## 逐项判定

- **A 错。** 文件的逻辑结构指文件在**用户面前**的组织形式（如顺序文件、索引文件、索引顺序文件等）；“在硬盘空间的存储模式”是文件的**物理结构（物理组织）**，两者不能混淆。

- **B 错。** FCB 记录文件的说明信息（文件名、物理位置、大小、存取权限、时间等），**不含文件内容**本身；内容存放在数据块中。

- **C 对。** 多级目录（树形目录）中，不同目录下可存在同名文件，通过“路径名”唯一标识，从而解决重名冲突。

- **D 错。** 修改文件内容前必须先**打开文件**：打开操作把 FCB 读入内存（建立打开文件表），后续读写都基于内存中的 FCB 进行，不能跳过。

## 小结

故选 **C**。`,pitfalls:String.raw`- 把“逻辑结构”与“物理结构”颠倒：逻辑结构面向用户，物理结构面向存储。
- 误以为 FCB 含文件内容：FCB 只含说明与控制信息。
- 认为修改文件不必打开：所有读写都需先打开取得 FCB。`}},{id:`mock-exam-4-os-q31`,questionNumber:31,title:`链接分配下修改一条记录的磁盘启动次数`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 文件管理（链接分配与记录成组）`,tags:[`链接分配`,`记录成组`,`磁盘启动次数`,`逻辑记录`],summary:`在链式分配且指针另行预留空间的条件下，计算修改指定逻辑记录需启动磁盘的次数。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 6 页（卷面第 5 页）第 31 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`某文件采用链接分配和记录成组存储，逻辑记录从 0 开始编号。题设已为链接指针另行预留空间，每个 512B 数据块可存 4 个 128B 逻辑记录。目录项已在内存且仅给出首块号；开始修改前，该文件的数据块均不在内存。修改目标记录时，需要依次读取链接路径上的块，并在修改后把目标块写回磁盘。每读或写一个块均计作启动磁盘 1 次。修改 8 号逻辑记录共启动磁盘（　）次。

- A．2
- B．3
- C．4
- D．5`,attachments:[{name:`查看原卷试题页（第 6 页，含题 28~32 及 CN 34）`,path:`mock-exam-4/co-os-page-6.png`}],solution:{answer:String.raw`**选 C：4 次。**`,explanation:String.raw`## 1. 定位 8 号记录所在的逻辑块

每个数据块存 4 条逻辑记录，且记录从 0 开始编号：

$$
\text{逻辑块号}=\left\lfloor \frac{8}{4}\right\rfloor=2.
$$

即 8 号记录位于该文件的**第 2 个逻辑块**（块 0 存记录 0~3，块 1 存记录 4~7，块 2 存记录 8~11）。

## 2. 链式分配必须顺序访问

链式分配只用链接指针串起各块，**不支持随机访问**。要到达第 2 块，必须沿链读：

- 读块 0（取其中指针，指向块 1）—— 第 1 次启动磁盘
- 读块 1（取指针，指向块 2）—— 第 2 次启动磁盘
- 读块 2（即目标块，取出记录并修改）—— 第 3 次启动磁盘

## 3. 写回目标块

修改完成后把目标块写回磁盘 —— 第 4 次启动磁盘。

## 4. 合计

$$
3\ \text{（读）}+1\ \text{（写）}=4\ \text{次}.
$$

目录项已在内存且仅含首块号，不额外产生磁盘访问；链接指针已单独预留空间，也不占用数据块。故共 **4 次**，选 C。

## 5. 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q31 chain allocation, record 8, 4 rec/block ===
  record 8 -> logical block 2 (0-indexed) => read blocks 0..2 = 3 reads + 1 write = 4
~~~`,pitfalls:String.raw`- 只算读写目标块本身（$1$ 读 $+1$ 写 $=2$ 次，选 A）：忽略了链式分配必须先读前面的块找到指针。
- 多算目录访问：目录项已在内存且给出首块号，不再额外启动磁盘。
- 把 8 号记录所在的块算成第 3 块（用 $8/4=2$ 后加 1）：块号从 0 计，8 号记录在块 2。`}},{id:`mock-exam-4-os-q32`,questionNumber:32,title:`磁盘数据位置描述中的抽象`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 输入/输出管理（设备抽象）`,tags:[`设备抽象`,`磁盘`,`物理地址`,`文件路径名`],summary:`判断操作系统在描述磁盘数据位置时，对哪些物理细节做了抽象以隐藏硬件实现。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 6 页（卷面第 5 页）第 32 题。原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`为了方便用户使用 I/O 设备（如磁盘），操作系统对磁盘操作中的数据位置进行描述时，对（　）进行了适当的抽象以隐藏物理设备的实现细节。

- Ⅰ．盘面号
- Ⅱ．磁道号
- Ⅲ．文件路径名
- Ⅳ．扇区号

- A．Ⅰ、Ⅲ
- B．Ⅲ、Ⅳ
- C．Ⅰ、Ⅱ、Ⅳ
- D．Ⅰ、Ⅱ、Ⅲ、Ⅳ`,attachments:[{name:`查看原卷试题页（第 6 页，含题 28~32 及 CN 34）`,path:`mock-exam-4/co-os-page-6.png`}],solution:{answer:String.raw`**选 C：Ⅰ、Ⅱ、Ⅳ。**`,explanation:String.raw`## 1. 磁盘数据的物理位置

磁盘上一个数据块的物理位置由**柱面号（磁道号）、盘面号（磁头号）、扇区号**共同确定，这是硬件层面的三维物理地址。普通用户若直接面对这些细节，编程和使用都极不方便。

## 2. 操作系统所做的抽象

操作系统通过文件系统把磁盘数据组织成“文件”，用户用**文件路径名**来定位数据；磁盘的**盘面号、磁道号、扇区号**等物理细节被**抽象/隐藏**。文件系统将文件偏移映射到逻辑块号，再由底层驱动与磁盘控制器完成数据定位。

因此，被抽象（隐藏）的正是物理的 Ⅰ、Ⅱ、Ⅳ，而提供抽象结果的是 Ⅲ（文件路径名）。题目问“对（　）进行了抽象以隐藏物理实现细节”，选 **C：Ⅰ、Ⅱ、Ⅳ**。

## 3. 逐项对照

- Ⅰ 盘面号、Ⅱ 磁道号、Ⅳ 扇区号：磁盘的物理寻址参数，被操作系统抽象隐藏。
- Ⅲ 文件路径名：这是抽象后**提供给用户**的逻辑描述方式，不是被抽象掉的对象，故不选含 Ⅲ 的组合（A、B、D 错）。`,pitfalls:String.raw`- 误选含 Ⅲ 的选项：文件路径名是抽象的结果，不是被抽象的对象。
- 把“物理地址”与“逻辑位置”混为一谈：抽象的方向是“物理细节 → 逻辑描述”。
- 只挑一个物理参数：三者（盘面号、磁道号、扇区号）都是被隐藏的物理细节。`}},{id:`mock-exam-4-co-q43`,questionNumber:43,title:`指令编码、寻址方式与算术右移`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 指令系统（指令格式与编码、算术移位）`,tags:[`指令格式`,`寻址方式`,`机器字编码`,`算术右移`],summary:`按给定的双字长指令格式写出两条指令的机器字，并计算补码算术右移后的结果。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 9 页（卷面第 8 页）第 43 题。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/verify_lion4.py 复算，并非引用官方答案。`,content:String.raw`43．（8 分）某计算机字长 16 位，主存地址空间为 64KB，按字节编址，各操作数均为 16 位。所有指令均采用双字长格式，即第一字和第二字各 16 位。第一字各字段如题 43 图，第二字为 A 字段。Rs 和 Rd 可取 R0~R7，Ms 和 Md 的含义见表。A 可表示立即数或位移量，立即数采用 16 位补码。

![题 43 指令格式](/courses/mock-exam-4/q43-instruction-format.png)

第一字字段划分（自高位到低位）：OP 占 4 位，Md 占 3 位，Rd 占 3 位，Ms 占 3 位，Rs 占 3 位；第二字为 A 字段。

Ms / Md 的含义（题 43 表）：

- 000　立即寻址，操作数 = A
- 001　寄存器寻址，操作数 = (Rn)
- 010　寄存器间接寻址，操作数 = M[(Rn)]
- 011　自增型寄存器间接寻址，操作数 = M[(Rn)]，随后 (Rn) ← (Rn) + 2
- 100　寄存器相对寻址，操作数 = M[(Rn) + A]

其中 (Rn) 表示寄存器 Rn 的内容，M[X] 表示主存地址 X 中的 16 位操作数。

（1）该计算机的指令系统最多可定义多少条指令？（1 分）

（2）已知 ADD、AND 的操作码分别为 0001、0010。按高位在左，分别写出下列指令的两个 16 位机器字；若指令未使用 A 字段，则第二字统一填写 0000H。（4 分）

- ① ADD [R3], R2　　（功能为 M[(R3)] ← M[(R3)] + (R2)）
- ② AND R5, [R6+1024]　　（功能为 R5 ← (R5) ∧ M[(R6)+1024]）

（3）寄存器 R7 的内容为 8004H。SAR 表示对 16 位补码进行算术右移，空出的高位补符号位。执行 SAR R7, 2 后，R7 的十六进制内容和对应的十进制有符号整数分别是多少？（3 分）`,attachments:[{name:`查看原卷试题页（第 9 页，含题 43 完整题干）`,path:`mock-exam-4/co-os-page-9.png`},{name:`查看题 43 指令格式图`,path:`mock-exam-4/q43-instruction-format.png`},{name:`查看题 43 寻址方式表`,path:`mock-exam-4/q43-addressing-table.png`}],solution:{answer:String.raw`**（1）16 条。** **（2）① $14\text{C}\text{A}\text{H}$、$0000\text{H}$；② $2366\text{H}$、$0400\text{H}$。** **（3）$E001\text{H}$，十进制有符号数为 $-8191$。**`,explanation:String.raw`## （1）最多可定义的指令数

操作码 OP 占 $4$ 位，可表示 $2^{4}=16$ 种不同的操作码，故最多可定义 **16 条**指令。

## （2）两条指令的机器字

指令格式（第一字，自高位到低位）：OP(4)｜Md(3)｜Rd(3)｜Ms(3)｜Rs(3)，其中 Md/Rd 为目的操作数的寻址方式与寄存器号，Ms/Rs 为源操作数的寻址方式与寄存器号。

### ① ADD [R3], R2

- OP = ADD = $0001$。
- 目的操作数 M[(R3)]：寄存器间接寻址，Md = $010$，Rd = R3 = $011$。
- 源操作数 R2：寄存器寻址，Ms = $001$，Rs = R2 = $010$。

第一字（16 位）：

$$
0001\ 010\ 011\ 001\ 010
=0001\,0100\,1100\,1010_2=14\text{C}\text{A}\text{H}.
$$

未使用 A 字段，第二字 $=0000\text{H}$。

### ② AND R5, [R6+1024]

- OP = AND = $0010$。
- 目的操作数 R5：寄存器寻址，Md = $001$，Rd = R5 = $101$。
- 源操作数 M[(R6)+1024]：寄存器相对寻址，Ms = $100$，Rs = R6 = $110$。

第一字：

$$
0010\ 001\ 101\ 100\ 110
=0010\,0011\,0110\,0110_2=2366\text{H}.
$$

第二字为位移量 $A=1024$：

$$
1024=0000\,0100\,0000\,0000_2=0400\text{H}.
$$

## （3）算术右移

$R7=8004\text{H}=1000\,0000\,0000\,0100_2$，最高位为 $1$，是负数。算术右移 2 位时高位补符号位 $1$，低位依次移出：

$$
1000\,0000\,0000\,0100 \xrightarrow{\text{算术右移 1 位}} 1100\,0000\,0000\,0010
\xrightarrow{\text{算术右移 1 位}} 1110\,0000\,0000\,0001.
$$

结果为 $R7=E001\text{H}$。

其十进制有符号数：$E001\text{H}$ 按 16 位补码求值，取反加一得 $0001\,1111\,1111\,1111_2=1\text{FFF}\text{H}=8191$，故真值为 $-8191$。

（验证：原值 $8004\text{H}=-32764$，算术右移 2 位相当于 $\lfloor -32764/4\rfloor=-8191$，一致。）

## 脚本独立复核（.cache/lion-4/verify_lion4.py 实际输出）

~~~text
=== Q43 instruction encoding ===
  ADD [R3],R2: OP=0001 Md=010 Rd=011 Ms=001 Rs=010 -> 14CAH + 0000H
  AND R5,[R6+1024]: OP=0010 Md=001 Rd=101 Ms=100 Rs=110 -> 2366H + 0400H
  SAR 8004H, 2 -> E001H ; signed = -8191  ; orig signed = -32764
~~~`,pitfalls:String.raw`- 第一字字段错位：MD/RD 与 MS/RS 的顺序、或把 OP 放错位置，都会得到别的十六进制值。
- ADD [R3], R2 的目的操作数寻址方式写成寄存器寻址（应为寄存器间接 $010$）。
- 忘记 $\text{SAR}$ 补符号位而按逻辑右移：$8004\text{H}$ 逻辑右移 2 位得 $2001\text{H}$，错误。
- 十进制有符号数只算无符号值：$E001\text{H}$ 无符号为 $57345$，作为 16 位补码应为 $-8191$。`}},{id:`mock-exam-4-co-q44`,questionNumber:44,title:`数据通路部件识别与 SUB 指令执行周期`,type:`题目`,date:`2026-10-02`,chapter:`计算机组成原理 · 中央处理器（数据通路与操作控制器）`,tags:[`数据通路`,`暂存器`,`ALU`,`指令执行周期`,`操作控制器`],summary:`识别数据通路中的部件，并按给定取指表写出 SUB 指令执行周期的节拍、功能与控制信号。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 9 页（卷面第 8 页）题图、第 10 页（卷面第 9 页）小题。原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`44．（15 分）某模型机的数据通路如题 44 图。R1、R2 为通用寄存器，MDR、MAR、PC、IR 和 M 的含义同常规定义，所有带箭头标记均为控制信号。注意：题图方框中的 T1、T2 是两个待识别的数据通路部件，而下表中的 T1~T4 表示时序节拍，两者不是同一概念。

![题 44 数据通路图](/courses/mock-exam-4/q44-datapath.png)

取指周期的节拍、功能和控制信号如下表（题 44 表）：

- T1：功能 PC → MAR；控制信号 PC-IB、IB-MAR
- T2：功能 M → IR；控制信号 RD、(DB-MDR, MDR-I)、MDR-IB、IB-IR
- T3：功能 PC + 1；控制信号 PC+1
- T4：功能 指令译码；控制信号 无

（1）图中的 T1 和 T2 是什么部件，有何作用？（4 分）

（2）图中的部件 X 的名称是什么，有何作用？（2 分）

（3）若二地址 RS 型指令采用如下格式：操作码｜寄存器号｜地址。“SUB R1, (R2)”执行 $R1\leftarrow R1-M[(R2)]$，其中 (R2) 为寄存器 R2 的内容，M[(R2)] 为该地址中的主存操作数。假定一次主存读可在题图取指周期所示的一个节拍内完成，部件 X 支持减法且减法控制信号记为 SUB；同一节拍可并行发出互不冲突的控制信号。参照题 44 表，列出 SUB 指令执行周期的全部节拍、功能和控制信号，不限定为 4 拍。（5 分）

（4）如果设计该模型机的操作控制器，常用的设计方法有几种？请对比各种设计方法的优缺点。（4 分）`,attachments:[{name:`查看原卷试题页（第 9 页，含题 44 数据通路图）`,path:`mock-exam-4/co-os-page-9.png`},{name:`查看原卷试题页（第 10 页，含题 44 小题与取指表）`,path:`mock-exam-4/co-os-page-10.png`},{name:`查看题 44 数据通路图（放大）`,path:`mock-exam-4/q44-datapath.png`}],solution:{answer:String.raw`**（1）** T1、T2 是**暂存器（锁存器）**，用于锁存参与运算的操作数。 **（2）** X 是**算术逻辑单元（ALU）**，完成算术/逻辑运算。 **（3）** 执行周期共 4 拍，控制信号见下表。 **（4）** 常用**组合逻辑（硬布线）**与**微程序**两种设计方法，优缺点见解析。`,explanation:String.raw`## （1）T1、T2 是什么部件，有何作用

T1、T2 是数据通路中的**暂存器（锁存器）**。它们位于 X 的两个输入端，用于**暂存从总线（或从寄存器/存储器）送来的操作数**，使运算的两个操作数在同一时刻稳定地送到运算部件，避免总线冲突，并配合多节拍数据通路完成运算。

## （2）X 的名称与作用

X 是**算术逻辑单元（ALU）**。作用是对 T1、T2 送来的两个操作数进行**算术运算（加、减等）或逻辑运算**，本题支持减法（控制信号 SUB）与加法，运算结果再送回总线/寄存器。

## （3）SUB R1, (R2) 的执行周期

取指阶段见题 44 表（T1~T4，共 4 拍）。下面给出**执行周期**的节拍、功能和控制信号：

- 执行第 1 拍：$(R2)\to MAR$；控制信号 **R2-IB、IB-MAR**。
- 执行第 2 拍：$M[(R2)]\to MDR$，同时 $(R1)\to$ 暂存器 T1；控制信号 **RD、DB-MDR、MDR-I、R1-IB、IB-T1**。
- 执行第 3 拍：$(MDR)\to$ 暂存器 T2；控制信号 **MDR-IB、IB-T2**。
- 执行第 4 拍：X 计算“暂存器 T1 − 暂存器 T2”，结果写回 R1；控制信号 **SUB、A-IB、IB-R1**。

这样暂存器 T1 保存**被减数 $(R1)$**，暂存器 T2 保存**减数 $M[(R2)]$**，结果才是题目要求的 $(R1)-M[(R2)]$，不是相反数。SUB 选择减法，**A-IB** 将 X 的结果送上内部总线，IB-R1 再写回目标寄存器。

第 2 拍可以合并，是因为主存读取使用**外部数据总线 DB → MDR**，R1 到暂存器 T1 使用**内部总线 IB**，两者互不冲突。**不能**把 MDR → T1 与 R1 → T2 合并：两次传送都要驱动同一条内部总线 IB，会发生总线冲突。若不合并主存读取与 R1 暂存，可拆成 5 拍，仍须保持 T1 为被减数、T2 为减数，并写全结果送总线的 A-IB 信号。

## （4）操作控制器的设计方法及优缺点

常用**两种**设计方法：

- **组合逻辑（硬布线）控制器**：用门电路与组合逻辑直接产生各控制信号。
  - 优点：控制信号由硬件直接产生，**速度快**。
  - 缺点：设计不规整、修改和扩充困难，**灵活性差**。
- **微程序控制器**：把控制信号编码成微指令存放在控制存储器中，按微程序逐条取出执行。
  - 优点：设计规整、便于修改与扩充，**灵活性好**。
  - 缺点：需要访问控制存储器，**速度较慢**。

（此外还有 PLA/门阵列等实现形式，但教材通常以硬布线与微程序两类作对比。）`,pitfalls:String.raw`- 把暂存器 T1、T2 当成可由指令直接寻址的通用寄存器，或与时序节拍 T1、T2 混淆：题图中的两者是 ALU 输入暂存器。
- 忘记 SUB 的目的 R1 既作被减数又要写回，导致 T1/T2 装载顺序错误、结果自减。
- 控制信号与题 44 表命名不一致（如漏写 IB-MAR、DB-MDR 等），导致与题图信号对不上。
- （4）只答一种设计方法或只讲优点，未做对比。`}},{id:`mock-exam-4-os-q45`,questionNumber:45,title:`双缓冲区的信号量设计、合并缓冲区与优先唤醒`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 进程同步（信号量与生产者-消费者）`,tags:[`信号量`,`生产者-消费者`,`循环缓冲区`,`优先唤醒`,`互斥`],summary:`为两个生产者-消费者缓冲区设置信号量，讨论合并为一个缓冲区后的重设，并分析仅靠信号量能否保证优先唤醒。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 10 页（卷面第 9 页）第 45 题。原卷未印参考答案，以下答案与解析为本站独立推导，并非引用官方答案。`,content:String.raw`45．（7 分）生产者 P1 只向容量为 2 的循环缓冲区 A 存放产品，生产者 P2 只向容量为 2 的循环缓冲区 B 存放产品；消费者 C1 只从 A 取产品，消费者 C2 只从 B 取产品。初始时两个缓冲区均为空，访问同一缓冲区的取、放操作必须互斥。

（1）设置信号量，说明含义和初值，并写出 P1、P2、C1、C2 中 P、V 操作的位置。（3 分）

（2）若 A、B 合并为一个容量为 4 的循环缓冲区，P1、P2 均可存入，C1、C2 均可取出，应如何重新设置信号量？说明原两套信号量为什么不能直接沿用。（2 分）

（3）在第（2）问中，普通信号量 full 的阻塞队列按 FIFO 顺序排队，V(full) 仅唤醒队首进程；系统采用抢占式优先级调度，且 C1 的优先级高于 C2。若 C1、C2 均因无产品而等待，要求新产品到达后必须优先由 C1 取走，仅使用第（2）问的 mutex、empty 和 full 能否保证？若不能，说明需增加的信号量或共享状态，并给出实现优先唤醒的基本思路。（2 分）`,attachments:[{name:`查看原卷试题页（第 10 页，含题 44 小题与题 45）`,path:`mock-exam-4/co-os-page-10.png`}],solution:{answer:String.raw`**（1）** 每套缓冲区各配 mutex、empty、full 三个信号量，初值分别为 $1$、$2$、$0$，P/V 位置见解析。 **（2）** 合并后只需 mutex、empty、full（初值 $1$、$4$、$0$）；原两套信号量不能沿用，见解析。 **（3）** 仅靠 mutex、empty、full **不能**保证优先由 C1 取走，需增加私有信号量与等待计数等共享状态，见解析。`,explanation:String.raw`## （1）信号量设置与 P、V 位置

为 A、B 两套缓冲区各设一组信号量：

- mutex_A = 1：互斥访问缓冲区 A。
- empty_A = 2：A 中空闲槽位数（初值为容量 2）。
- full_A = 0：A 中已存产品数。
- mutex_B = 1：互斥访问缓冲区 B。
- empty_B = 2：B 中空闲槽位数。
- full_B = 0：B 中已存产品数。

P、V 位置：

- P1：P(empty_A) → P(mutex_A) → 把产品放入 A → V(mutex_A) → V(full_A)
- P2：P(empty_B) → P(mutex_B) → 把产品放入 B → V(mutex_B) → V(full_B)
- C1：P(full_A) → P(mutex_A) → 从 A 取出产品 → V(mutex_A) → V(empty_A)
- C2：P(full_B) → P(mutex_B) → 从 B 取出产品 → V(mutex_B) → V(empty_B)

即生产者先判空闲（P(empty)）再取互斥锁，放完产品后释放互斥并通知有产品（V(full)）；消费者先判有产品（P(full)）再取互斥锁，取完后释放互斥并通知有空位（V(empty)）。

## （2）合并为一个容量 4 的循环缓冲区

只需一组信号量：

- mutex = 1：互斥访问这个合并缓冲区。
- empty = 4：空闲槽位数（初值容量 4）。
- full = 0：已存产品数。

位置：

- P1、P2：P(empty) → P(mutex) → 存入 → V(mutex) → V(full)
- C1、C2：P(full) → P(mutex) → 取出 → V(mutex) → V(empty)

原两套信号量不能直接沿用的原因：

- 原 empty_A、empty_B 分别只记录 A、B 各自的容量，二者之和虽为 4，但**语义是对应各自缓冲区**，合并后容量统一为 4、产品也不再区分来自 A 还是 B，用两套计数无法判断“整个缓冲区是否已满/是否为空”。
- 原 mutex_A、mutex_B 分别只保护各自的区域，**没有一把锁保护合并后的整个缓冲区**，多个进程并发存取会失去互斥。
- 原 full_A、full_B 记录“A、B 各自的产品数”，合并后产品混在一起，无法用“A 满/B 空”判断让谁取、取哪个，也保证不了取出的产品与计数一致。

因此必须改用单一 mutex、empty、full。

## （3）仅用 mutex、empty、full 能否保证优先由 C1 取走

**不能。** 原因：full 的阻塞队列按 FIFO 排队，V(full) 只唤醒**队首**进程。若 C2 先于 C1 进入 full 等待队列，那么即使 C1 的优先级更高、系统采用抢占式优先级调度，新产品到达时 V(full) 唤醒的仍是队首的 C2；抢占式调度只决定“就绪进程谁先占用 CPU”，而**哪个进程被唤醒、从而取走这个产品**，由信号量的唤醒顺序（FIFO）决定，与优先级无关。因此仅靠 mutex、empty、full 无法保证新产品优先由 C1 取走。

需增加的信号量或共享状态与实现思路：

- 增加两个**私有信号量** privateC1、privateC2，初值均为 0；消费者在自己的信号量上等待，不再直接加入 FIFO 的 full 等待队列。
- 增加受 mutex 保护的**等待计数** numC1、numC2（初值 0），以及已存产品数和分别授予 C1、C2 的**预留名额**，区分“有产品”与“产品已分配给某个等待者”。
- 消费者先在锁内登记等待；生产者放入产品后，在同一把锁保护下进行分配：存在未预留产品时，**先选 numC1 > 0 的 C1**，否则选 C2。选中者的等待计数减 1，为其预留一个产品名额，再 V 对应的 privateCi。
- 被唤醒者凭私有通知取得自己已获授的产品名额，随后在 mutex 保护下取产品、清除预留状态，最后 V(empty)。**其他消费者不能通过直接 P(full) 抢走已预留的名额**；full 与预留状态共同维护产品计数，取完时不重复减少等待计数。
- 新消费者登记时也检查是否已有未预留产品，避免只在生产者到达时分配而丢失唤醒。所有等待登记、名额分配和计数更新均受同一把锁保护。

当 C1、C2 都因无产品等待时，第一个新产品的名额只授予 C1，只唤醒 C1；这才满足题目要求。仅“提高 CPU 调度优先级”或“检查 numC1 后仍 V(full)”不能改变 full 原有的 FIFO 唤醒对象。`,pitfalls:String.raw`- （1）把 P(empty) 与 P(mutex) 顺序写反：应先判资源（empty）再取互斥锁，否则会死锁。
- （2）认为“把两套 empty 相加、两套 full 相加即可”：计数语义与互斥范围都被破坏，不能这么合并。
- （3）误以为“抢占式优先级调度”能保证高优先级消费者先取到产品：抢占只影响 CPU 运行权，被唤醒的进程由信号量 FIFO 决定。
- 忘记用锁保护 numC1/numC2 等共享计数：计数本身也会产生竞态。`}},{id:`mock-exam-4-os-q46`,questionNumber:46,title:`多级反馈队列调度的时序与周转时间`,type:`题目`,date:`2026-10-02`,chapter:`操作系统 · 处理机调度（多级反馈队列调度）`,tags:[`多级反馈队列`,`轮转调度`,`周转时间`,`带权周转时间`,`抢占`],summary:`按三级多级反馈队列规则模拟 CPU 调度，求各进程周转时间与两种平均值，并分析新增紧急进程后的变化。`,source:`用户提供的「lion模拟卷4」（四.pdf 扫描件）第 10 页（卷面第 9 页）题干与第 11 页（卷面第 10 页）第（2）问。原卷未印参考答案，以下答案与解析为本站独立推导，并由脚本 .cache/lion-4/sim_mlfq.py 逐拍模拟复算，并非引用官方答案。`,content:String.raw`46．（8 分）某单处理器系统采用三级多级反馈队列调度。Q1、Q2、Q3 的时间片分别为 2、4、8 个时间单位；新进程进入 Q1。Q1、Q2 均按队首次序选择进程，进程用完整本级时间片仍未完成时降入下一队列尾部；Q3 采用时间片轮转。高优先级队列出现就绪进程时立即抢占低优先级队列中的运行进程，被抢占进程回到原队列队首并保留本轮剩余时间片；同一队列中新进程到达时不抢占。上下文切换开销为 0。同一时刻若同时发生完成或时间片用尽与新进程到达，先处理前者，再接纳新到达进程。现有 P1~P5 如下。

- P1：到达时间 0，所需执行时间 10
- P2：到达时间 1，所需执行时间 5
- P3：到达时间 2，所需执行时间 8
- P4：到达时间 3，所需执行时间 3
- P5：到达时间 4，所需执行时间 6

![题 46 进程表](/courses/mock-exam-4/q46-process-table.png)

（1）画出 CPU 调度时序，计算 P1~P5 的周转时间、带权周转时间及两项平均值。（4 分）

（2）在相同规则下，增加紧急进程 P6：到达时间为 10，服务时间为 2，优先级高于 Q1 且到达后立即抢占；P6 运行至完成，被抢占进程仍按上述规则保留剩余时间片。重新画出时序，并计算 P1~P6 的周转时间、带权周转时间及两项平均值。（4 分）`,attachments:[{name:`查看原卷试题页（第 10 页，含题 46 题干与进程表）`,path:`mock-exam-4/co-os-page-10.png`},{name:`查看原卷试题页（第 11 页，含题 46 第（2）问）`,path:`mock-exam-4/co-os-page-11.png`},{name:`查看题 46 进程表（放大）`,path:`mock-exam-4/q46-process-table.png`}],solution:{answer:String.raw`**（1）** 完成时刻 P1=30、P2=17、P3=32、P4=22、P5=26；周转时间依次为 30、16、30、19、22（平均 23.4）；带权周转时间依次为 3、3.2、3.75、6.333、3.667（平均 3.99）。 **（2）** 增加 P6（到达 10、服务 2）后：完成时刻 P1=32、P2=19、P3=34、P4=24、P5=28、P6=12；周转时间依次为 32、18、32、21、24、2（平均 21.5）；带权周转时间依次为 3.2、3.6、4、7、4、1（平均 3.8）。`,explanation:String.raw`## 一、调度规则回顾

三级队列 Q1、Q2、Q3 的时间片为 2、4、8；新进程入 Q1；进程用完本级时间片未完成则降入下一队列尾部；Q3 用时间片轮转；高优先级队列出现就绪进程立即抢占，被抢占者回到原队列**队首**并保留剩余时间片；同队列新到达不抢占；同时发生“完成/时间片用尽”与“新到达”时先处理前者。

## 二、第（1）问：P1~P5 的调度

逐段推进（每段为某进程连续占用 CPU 的区间）：

- P1 在 Q1 运行 [0, 2]，时间片用尽，降入 Q2 尾部。
- P2 在 Q1 运行 [2, 4]，时间片用尽，降入 Q2 尾部。
- P3 在 Q1 运行 [4, 6]，降入 Q2 尾部。
- P4 在 Q1 运行 [6, 8]，降入 Q2 尾部。
- P5 在 Q1 运行 [8, 10]，降入 Q2 尾部。
- Q1 空，转 Q2：P1 运行 [10, 14]，时间片（4）用尽，降入 Q3 尾部。
- P2 在 Q2 运行 [14, 17]，剩余 3 ≤ 4，运行完毕，17 完成。
- P3 在 Q2 运行 [17, 21]，用满 4，降入 Q3 尾部。
- P4 在 Q2 运行 [21, 22]，剩余 1 ≤ 4，22 完成。
- P5 在 Q2 运行 [22, 26]，剩余 4 = 4，正好用完并完成（26 完成）。
- Q2 空，转 Q3（时间片 8）：P1 运行 [26, 30] 完成；P3 运行 [30, 32] 完成。

时序图（时间轴）：

$$
[0,2]P_1,\ [2,4]P_2,\ [4,6]P_3,\ [6,8]P_4,\ [8,10]P_5,\ [10,14]P_1,\ [14,17]P_2,\ [17,21]P_3,\ [21,22]P_4,\ [22,26]P_5,\ [26,30]P_1,\ [30,32]P_3.
$$

完成时刻：P1=30，P2=17，P3=32，P4=22，P5=26。

周转时间（完成 − 到达）：

- P1：30 − 0 = 30
- P2：17 − 1 = 16
- P3：32 − 2 = 30
- P4：22 − 3 = 19
- P5：26 − 4 = 22

平均周转时间：

$$
\frac{30+16+30+19+22}{5}=\frac{117}{5}=23.4.
$$

带权周转时间（周转时间 / 服务时间）：

- P1：30 / 10 = 3
- P2：16 / 5 = 3.2
- P3：30 / 8 = 3.75
- P4：19 / 3 = 6.333
- P5：22 / 6 = 3.667

平均带权周转时间：

$$
\frac{3+3.2+3.75+19/3+11/3}{5}=\frac{19.95}{5}=3.99.
$$

## 三、第（2）问：增加紧急进程 P6

P6 在 t = 10 到达，服务 2，优先级高于 Q1、到达即抢占、运行至完成。t = 10 时 P5 的时间片恰好用尽（先把 P5 降入 Q2 尾部），随后 P6 到达并立即运行 [10, 12]。此后按原规则继续，整体相对第（1）问后移 2 个时间单位：

- Q2 中 P1 运行 [12, 16]，用满 4，降入 Q3；P2 运行 [16, 19] 完成；
- P3 运行 [19, 23]，降入 Q3；P4 运行 [23, 24] 完成；P5 运行 [24, 28] 完成；
- Q3：P1 运行 [28, 32] 完成；P3 运行 [32, 34] 完成。

时序图：

$$
[0,2]P_1,\ [2,4]P_2,\ [4,6]P_3,\ [6,8]P_4,\ [8,10]P_5,\ [10,12]P_6,\ [12,16]P_1,\ [16,19]P_2,\ [19,23]P_3,\ [23,24]P_4,\ [24,28]P_5,\ [28,32]P_1,\ [32,34]P_3.
$$

完成时刻在线：P6=12，P2=19，P4=24，P5=28，P1=32，P3=34。

周转时间：

- P1：32 − 0 = 32
- P2：19 − 1 = 18
- P3：34 − 2 = 32
- P4：24 − 3 = 21
- P5：28 − 4 = 24
- P6：12 − 10 = 2

平均周转时间：

$$
\frac{32+18+32+21+24+2}{6}=\frac{129}{6}=21.5.
$$

带权周转时间：

- P1：32 / 10 = 3.2
- P2：18 / 5 = 3.6
- P3：32 / 8 = 4
- P4：21 / 3 = 7
- P5：24 / 6 = 4
- P6：2 / 2 = 1

平均带权周转时间：

$$
\frac{3.2+3.6+4+7+4+1}{6}=\frac{22.8}{6}=3.8.
$$

可见紧急进程 P6 插队使 P1~P5 的完成时刻整体后移，但 P6 自身周转时间极短，两项平均值反而下降。

## 四、脚本独立复核（.cache/lion-4/sim_mlfq.py 逐拍模拟）

第（1）问实际输出（节选）：

~~~text
timeline: [(0, 2, 1), (2, 4, 2), (4, 6, 3), (6, 8, 4), (8, 10, 5), (10, 14, 1), (14, 17, 2), (17, 21, 3), (21, 22, 4), (22, 26, 5), (26, 30, 1), (30, 32, 3)]
finish: {'P1': 30, 'P2': 17, 'P3': 32, 'P4': 22, 'P5': 26}
turnaround: {2: 16, 4: 19, 5: 22, 1: 30, 3: 30} avg 23.4
weighted: {2: 3.2, 4: 6.3333, 5: 3.6667, 1: 3.0, 3: 3.75} avg 3.99
~~~

第（2）问实际输出（节选）：

~~~text
finish: {'P1': 32, 'P2': 19, 'P3': 34, 'P4': 24, 'P5': 28, 'P6': 12}
turnaround: {'P1': 32, 'P2': 18, 'P3': 32, 'P4': 21, 'P5': 24, 'P6': 2} avg 21.5
weighted: {'P1': 3.2, 'P2': 3.6, 'P3': 4.0, 'P4': 7.0, 'P5': 4.0, 'P6': 1.0} avg 3.8
~~~`,pitfalls:String.raw`- 把 Q3 当成 FCFS 或让 Q3 进程无限运行：本题 Q3 也按时间片 8 轮转，剩余不足 8 才在本次运行中完成。
- 忘记“时间片用尽先处理、再接纳新到达”：t = 10 处若先让 P6 抢占会影响 P5 的降级时机。
- 把“被抢占回到队首并保留剩余时间片”忽略：本题实际未出现高优先级抢占 Q2/Q3 的情形，但规则须遵守。
- 带权周转时间用错分母：分母是该进程的服务时间（P4 为 3，故 P4 带权为 19/3 ≈ 6.33，是最大项）。`}}],jm=[{id:`mock-exam-1`,title:`lion模拟卷1`,date:`2026-10-02`,summary:`数据结构单项选择题第 1～11 题；计算机组成原理第 12～22、43～44 题；操作系统第 23～32、45～46 题。共 36 题，原卷未印参考答案，已独立推导与复核。`,materials:Dm},{id:`mock-exam-2`,title:`lion模拟卷2`,date:`2026-10-02`,summary:`数据结构单项选择题第 1～11 题；计算机组成原理第 12～22、43～44 题；操作系统第 23～32、45～46 题。共 36 题，原卷未印参考答案，已独立推导与复核。`,materials:Om},{id:`mock-exam-3`,title:`lion模拟卷3`,date:`2026-10-02`,summary:`数据结构单项选择题第 1～11 题；计算机组成原理第 12～22、43～44 题；操作系统第 23～32、45～46 题。共 36 题，原卷未印参考答案，已独立推导与复核。`,materials:km},{id:`mock-exam-4`,title:`lion模拟卷4`,date:`2026-10-02`,summary:`数据结构单项选择题第 1～11 题；计算机组成原理第 12～22、43～44 题；操作系统第 23～32、45～46 题。共 36 题，原卷未印参考答案，已独立推导与复核。`,materials:Am},{id:`virtual-memory-10-2`,title:`10.2 虚拟存储和IO`,date:`2026-10-01`,materials:Em},{id:`wangdao-mock-set-2-major`,title:`王道模拟题第二套大题`,date:`2026-09-30`,materials:Tm},{id:`wangdao-mock-set-1-major`,title:`王道模拟题第一套大题`,date:`2026-09-30`,materials:wm},{id:`real-exam-2026-analysis`,title:`26真题分析`,date:`2026-09-30`,materials:Cm}],Mm=`/courses/`,Nm={题目:ie,知识点:ce},Pm=jm.flatMap(e=>e.materials.map(t=>({material:t,lesson:e}))),Fm=Pm.filter(({material:e})=>e.type===`题目`).length,Im=28,Lm=64,Rm=26,zm=16,Bm=/[\u2E80-\u9FFF\uFF00-\uFFEF]/g;function Vm(e){let t=(e.match(Bm)??[]).length;return(e.length-t)*7.4+t*13+18}function Hm(e,t){let n=[],r=[];for(let i of e.replace(/\t/g,`  `).split(`
`)){let e=i.trim();if(!e)continue;let a=i.length-i.trimStart().length,o=/^(L|R)\s*[:：]\s*(.*)$/.exec(e);if(t===`binary`&&!o&&r.length)continue;let s={label:(t===`binary`?o?.[2]??e:e).trim(),children:[],column:0,depth:0};for(;r.length&&r[r.length-1].indent>=a;)r.pop();let c=r[r.length-1];c?t===`binary`?o?.[1].toUpperCase()===`R`?c.node.right=s:c.node.left=s:c.node.children.push(s):n.push(s),r.push({indent:a,node:s})}let i=e=>t===`binary`?[e.left,e.right].filter(e=>!!e):e.children,a=0,o=0;function s(e,n){e.depth=n,o=Math.max(o,n);let r=i(e);if(t===`binary`){e.left&&s(e.left,n+1),e.column=a++,e.right&&s(e.right,n+1);return}if(r.length===0)e.column=a++;else{for(let e of r)s(e,n+1);e.column=(r[0].column+r[r.length-1].column)/2}}for(let e of n)s(e,0);let c=[];return(function e(t){for(let n of t)c.push(n),e(i(n))})(n),{nodes:c,childrenOf:i,columns:Math.max(a,1),maxDepth:o}}function Um({source:e,kind:t}){let{nodes:n,childrenOf:r,columns:i,maxDepth:a}=Hm(e,t);if(n.length===0)return null;let o=Math.max(...n.map(e=>Vm(e.label))),s=o+Rm,c=i*s-Rm+zm*2,l=(a+1)*Lm+zm*2-(Lm-Im),u=e=>({x:zm+o/2+e.column*s,y:zm+e.depth*Lm+Im/2}),d=n.flatMap(e=>r(e).map(t=>({from:u(e),to:u(t)})));return(0,N.jsxs)(`figure`,{className:`my-4`,children:[(0,N.jsxs)(`svg`,{viewBox:`0 0 ${c} ${l}`,"aria-label":`树形图：${e.trim().split(`
`).map(e=>e.trim()).join(`，`)}`,style:{width:`100%`,height:`auto`,maxWidth:c},className:`mx-auto block`,children:[(0,N.jsx)(`g`,{style:{stroke:`var(--muted-foreground)`,strokeWidth:1.4,fill:`none`,opacity:.8},children:d.map(({from:e,to:t},n)=>(0,N.jsx)(`path`,{d:`M ${e.x} ${e.y+Im/2} C ${e.x} ${e.y+Im/2+18}, ${t.x} ${t.y-Im/2-18}, ${t.x} ${t.y-Im/2}`},n))}),n.map((e,t)=>{let{x:n,y:r}=u(e);return(0,N.jsxs)(`g`,{children:[(0,N.jsx)(`rect`,{x:n-o/2,y:r-Im/2,width:o,height:Im,rx:7,style:{fill:`var(--accent)`,stroke:`var(--primary)`,strokeWidth:1}}),(0,N.jsx)(`text`,{x:n,y:r,textAnchor:`middle`,dominantBaseline:`central`,fontSize:13,style:{fill:`var(--foreground)`},children:e.label})]},t)})]}),t===`binary`&&(0,N.jsx)(`figcaption`,{className:`mt-2 text-center text-xs text-muted-foreground`,children:`左下为左孩子，右下为右孩子`})]})}function Wm({children:e}){return(0,N.jsx)(`div`,{className:`reading-prose [overflow-wrap:anywhere]`,children:(0,N.jsx)(Qo,{remarkPlugins:[xp],rehypePlugins:[bm],urlTransform:e=>{let t=ns(e);return t&&!/^(?:[a-z]+:|\/|#)/i.test(t)?`${Mm}${t}`:t},components:{pre:({children:e})=>{let t=Array.isArray(e)?e[0]:e;if((0,w.isValidElement)(t)){let{className:e,children:n}=t.props,r=e?.includes(`language-binary`)?`binary`:e?.includes(`language-tree`)?`tree`:null;if(r&&typeof n==`string`)return(0,N.jsx)(Um,{source:n,kind:r})}return(0,N.jsx)(`pre`,{children:e})}},children:e})})}function Gm(){let[e,t]=(0,w.useState)(`all`),[n,r]=(0,w.useState)(`全部`),[i,a]=(0,w.useState)(``),[o,s]=(0,w.useState)(``),[c,l]=(0,w.useState)(null),[u,d]=(0,w.useState)(()=>typeof window<`u`&&localStorage.getItem(`course-notebook-dark`)===`true`),f=(0,w.useRef)(null);(0,w.useEffect)(()=>{let e=document.title;return document.title=`408 备课讲义 · 凯鑫的个人博客`,()=>{document.title=e}},[]),(0,w.useEffect)(()=>{document.documentElement.classList.toggle(`dark`,u)},[u]),(0,w.useEffect)(()=>{c&&(f.current?.focus({preventScroll:!0}),f.current?.scrollIntoView({block:`start`}))},[c]);let p=jm.filter(t=>e===`all`||t.id===e).map(e=>({lesson:e,items:e.materials.filter(e=>n===`全部`||e.type===n)})),m=p.map(({lesson:e,items:t})=>({lesson:e,tags:[...new Set(t.flatMap(e=>e.tags))].sort((e,t)=>e.localeCompare(t,`zh-CN`))})).filter(e=>e.tags.length>0),h=e!==`all`,g=o.trim().toLocaleLowerCase(),_=p.map(({lesson:e,items:t})=>({lesson:e,items:t.filter(t=>(!i||t.tags.includes(i))&&(!g||[t.title,t.chapter,t.summary,t.content,e.title,...t.tags].join(` `).toLocaleLowerCase().includes(g)))})).filter(({items:e})=>e.length>0),v=_.reduce((e,t)=>e+t.items.length,0),y=c?Pm.find(({material:e})=>e.id===c)??null:null,b=y?y.lesson.materials.findIndex(e=>e.id===y.material.id):-1,x=y?y.lesson.materials[b+1]:void 0;function S(){t(`all`),r(`全部`),a(``),s(``)}function C(e){let t=Nm[e.type];return(0,N.jsxs)(`button`,{className:`group rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-primary`,onClick:()=>l(e.id),children:[(0,N.jsxs)(`span`,{className:`flex flex-wrap items-center gap-2 text-xs text-muted-foreground`,children:[(0,N.jsx)(t,{size:15}),(0,N.jsx)(`span`,{className:`text-primary`,children:e.type}),(0,N.jsxs)(`span`,{children:[`· `,e.chapter]})]}),e.type===`题目`&&e.questionNumber!==void 0&&(0,N.jsxs)(`span`,{className:`mt-3 inline-block rounded-md bg-accent px-2 py-1 text-sm font-semibold text-primary`,children:[`第 `,e.questionNumber,` 题`]}),(0,N.jsx)(`h3`,{className:`mt-3 break-words text-lg font-semibold group-hover:text-primary`,children:e.title}),(0,N.jsx)(`p`,{className:`mt-2 text-sm leading-6 text-muted-foreground`,children:e.summary}),e.tags.length>0&&(0,N.jsxs)(`span`,{className:`mt-3 flex flex-wrap gap-2`,children:[e.tags.slice(0,2).map(e=>(0,N.jsx)(`span`,{className:`rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground`,children:e},e)),e.tags.length>2&&(0,N.jsxs)(`span`,{className:`py-1 text-xs text-muted-foreground`,children:[`+`,e.tags.length-2]})]})]},e.id)}return(0,N.jsxs)(`div`,{className:`min-h-screen bg-background text-foreground`,children:[(0,N.jsx)(`header`,{className:`sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur-xl`,children:(0,N.jsxs)(`div`,{className:`mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8`,children:[(0,N.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,N.jsxs)(`a`,{href:`https://www.cathy47.online/`,className:`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary`,children:[(0,N.jsx)(ne,{size:16}),`返回博客`]}),y&&(0,N.jsxs)(`button`,{className:`action-button`,onClick:()=>l(null),children:[(0,N.jsx)(ne,{}),`返回讲义列表`]}),y&&(0,N.jsxs)(`button`,{className:`action-button disabled:cursor-not-allowed disabled:opacity-50`,disabled:!x,title:x?`下一张：${x.title}`:`已是本课最后一张`,onClick:()=>{x&&l(x.id)},children:[(0,N.jsx)(re,{}),`下一张`]})]}),(0,N.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,N.jsxs)(`span`,{className:`flex items-center gap-2 text-sm font-semibold text-primary`,children:[(0,N.jsx)(se,{size:19}),`408 备课讲义`]}),(0,N.jsx)(`button`,{className:`icon-button`,"aria-label":u?`切换浅色主题`:`切换深色主题`,onClick:()=>{let e=!u;d(e),localStorage.setItem(`course-notebook-dark`,String(e))},children:u?(0,N.jsx)(ue,{}):(0,N.jsx)(D,{})})]})]})}),(0,N.jsxs)(`main`,{className:`mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10`,children:[!y&&(0,N.jsxs)(`section`,{className:`mb-8 flex flex-wrap items-end justify-between gap-5`,"aria-labelledby":`lesson-heading`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`p`,{className:`mb-3 text-xs font-semibold tracking-[.15em] text-primary`,children:`408 LESSON NOTES · 按课次备课`}),(0,N.jsx)(`h1`,{id:`lesson-heading`,className:`font-display text-3xl font-semibold tracking-tight sm:text-4xl`,children:`一次课，一组题。`}),(0,N.jsx)(`p`,{className:`mt-3 max-w-xl text-sm leading-7 text-muted-foreground`,children:`每次备课单独归一组：今天准备讲什么，就把它整理成一课。下次复用、备课、加题，都从这一课开始。`})]}),(0,N.jsxs)(`div`,{className:`flex gap-6 text-sm text-muted-foreground`,"aria-label":`讲义统计`,children:[(0,N.jsxs)(`p`,{children:[(0,N.jsx)(`strong`,{className:`mr-2 text-2xl font-semibold text-foreground`,children:jm.length}),`次课`]}),(0,N.jsxs)(`p`,{children:[(0,N.jsx)(`strong`,{className:`mr-2 text-2xl font-semibold text-foreground`,children:Fm}),`道题目`]})]})]}),(0,N.jsxs)(`div`,{className:`grid items-start gap-6 lg:grid-cols-[230px_minmax(0,1fr)]`,children:[(0,N.jsxs)(`aside`,{className:`rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-24 ${y?`hidden lg:block`:``}`,"aria-label":`课次导航`,children:[(0,N.jsx)(`h2`,{className:`mb-3 px-2 text-xs font-semibold tracking-wide text-muted-foreground`,children:`按课次查找`}),(0,N.jsxs)(`button`,{className:`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm ${e===`all`?`bg-accent font-semibold text-primary`:`hover:bg-secondary`}`,"aria-pressed":e===`all`,onClick:()=>{t(`all`),a(``),l(null)},children:[`全部课次`,(0,N.jsx)(`span`,{className:`text-xs`,children:Pm.length})]}),jm.map(n=>(0,N.jsxs)(`button`,{"aria-pressed":e===n.id,onClick:()=>{t(n.id),a(``),l(null)},className:`mt-2 block w-full rounded-xl px-3 py-3 text-left ${e===n.id?`bg-accent text-primary`:`hover:bg-secondary`}`,children:[(0,N.jsxs)(`span`,{className:`flex items-center justify-between gap-2 text-sm font-semibold`,children:[n.title,(0,N.jsx)(`span`,{className:`text-xs font-normal`,children:n.materials.length})]}),(0,N.jsx)(`span`,{className:`mt-1 block text-xs text-muted-foreground`,children:n.date})]},n.id)),(0,N.jsxs)(`details`,{className:`mt-4 border-t border-border px-2 pt-4 text-xs leading-6 text-muted-foreground`,children:[(0,N.jsx)(`summary`,{className:`cursor-pointer font-semibold text-foreground`,children:`讲义怎么收录`}),(0,N.jsx)(`p`,{className:`mt-2`,children:`把这次课要讲的题目、截图或知识点发来即可，不必先整理。收到后归入对应课次，并附上答案与解析。`}),(0,N.jsx)(`p`,{className:`mt-2`,children:`答案与解析默认折叠，课堂上先出题、再展开。页面不直接上传文件，仅收录可公开分享的内容。`})]})]}),(0,N.jsx)(`section`,{className:`min-w-0`,"aria-label":`讲义内容`,children:y?(0,N.jsxs)(`article`,{ref:f,tabIndex:-1,className:`scroll-mt-32 rounded-2xl border border-border bg-card p-5 outline-none sm:scroll-mt-24 sm:p-8`,children:[(0,N.jsxs)(`div`,{className:`mb-6 flex flex-wrap items-center justify-between gap-3`,children:[(0,N.jsxs)(`span`,{className:`text-xs text-muted-foreground`,children:[`本课第 `,b+1,` / `,y.lesson.materials.length,` 张`]}),(0,N.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:y.material.type===`题目`?`课堂讲题 · 先看题，再展开解析`:`知识点讲解`})]}),(0,N.jsxs)(`p`,{className:`text-xs text-primary`,children:[y.lesson.title,` · `,y.material.chapter,` · `,y.material.type]}),(0,N.jsxs)(`h1`,{className:`font-display mt-3 break-words text-2xl font-semibold sm:text-3xl`,children:[y.material.type===`题目`&&y.material.questionNumber!==void 0&&(0,N.jsxs)(`span`,{className:`mr-2 text-primary`,children:[`第 `,y.material.questionNumber,` 题 ·`]}),y.material.title]}),(0,N.jsx)(`div`,{className:`mt-3 flex flex-wrap gap-2`,children:y.material.tags.map(e=>(0,N.jsx)(`span`,{className:`rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground`,children:e},e))}),y.material.source&&(0,N.jsxs)(`p`,{className:`mt-3 text-xs leading-6 text-muted-foreground`,children:[`来源：`,y.material.source]}),(0,N.jsxs)(`section`,{className:`mt-6 border-t border-border pt-6`,"aria-label":y.material.type===`题目`?`题目内容`:`知识点内容`,children:[(0,N.jsx)(`h2`,{className:`mb-4 text-sm font-semibold text-primary`,children:y.material.type===`题目`?`题目`:`知识点讲解`}),(0,N.jsx)(Wm,{children:y.material.content})]}),y.material.attachments&&y.material.attachments.length>0&&(0,N.jsx)(`nav`,{className:`my-5 flex flex-wrap gap-2`,"aria-label":`原始资料`,children:y.material.attachments.map(e=>(0,N.jsxs)(`a`,{className:`action-button max-w-full`,href:`${Mm}${e.path}`,target:`_blank`,rel:`noreferrer`,children:[(0,N.jsx)(oe,{}),(0,N.jsx)(`span`,{className:`truncate`,children:e.name})]},e.path))}),y.material.type===`题目`&&(y.material.solution?(0,N.jsxs)(`details`,{className:`group mt-8 rounded-xl border border-border`,"aria-label":`答案与解析`,children:[(0,N.jsxs)(`summary`,{className:`flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl bg-accent/50 px-5 py-4 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden`,children:[(0,N.jsxs)(`span`,{children:[`答案与解析`,(0,N.jsx)(`span`,{className:`ml-2 text-xs font-normal text-muted-foreground`,children:`点击展开 / 收起`})]}),(0,N.jsx)(ae,{size:18,className:`shrink-0 transition-transform group-open:rotate-180`})]}),(0,N.jsxs)(`div`,{className:`space-y-6 p-5 sm:p-6`,children:[(0,N.jsxs)(`section`,{children:[(0,N.jsx)(`h2`,{className:`mb-3 text-sm font-semibold text-primary`,children:`参考答案`}),(0,N.jsx)(Wm,{children:y.material.solution.answer})]}),(0,N.jsxs)(`section`,{children:[(0,N.jsx)(`h2`,{className:`mb-3 text-sm font-semibold text-primary`,children:`解题思路`}),(0,N.jsx)(Wm,{children:y.material.solution.explanation})]}),y.material.solution.pitfalls&&(0,N.jsxs)(`section`,{className:`rounded-xl bg-secondary/60 p-4`,children:[(0,N.jsx)(`h2`,{className:`mb-3 text-sm font-semibold`,children:`易错点与辨析`}),(0,N.jsx)(Wm,{children:y.material.solution.pitfalls})]}),y.material.solution.extension&&(0,N.jsxs)(`section`,{children:[(0,N.jsx)(`h2`,{className:`mb-3 text-sm font-semibold text-primary`,children:`追问与变式`}),(0,N.jsx)(Wm,{children:y.material.solution.extension})]})]})]}):(0,N.jsx)(`p`,{className:`mt-8 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground`,children:`这道题的答案尚未整理，核对后补充解析。`}))]},y.material.id):(0,N.jsxs)(N.Fragment,{children:[(0,N.jsxs)(`div`,{className:`mb-5 rounded-2xl border border-border bg-card p-4`,children:[(0,N.jsxs)(`div`,{className:`relative`,children:[(0,N.jsx)(le,{className:`absolute left-3 top-3 text-muted-foreground`,size:16}),(0,N.jsx)(`input`,{className:`search-input`,"aria-label":`搜索讲义`,placeholder:`搜索题目、知识点或标签…`,value:o,onChange:e=>s(e.target.value)})]}),(0,N.jsx)(`div`,{className:`mt-4 flex flex-wrap gap-2`,"aria-label":`内容类型`,children:[`全部`,...Sm].map(e=>(0,N.jsx)(`button`,{className:`filter-chip ${n===e?`active`:``}`,"aria-pressed":n===e,onClick:()=>{r(e),a(``)},children:e},e))}),m.length>0&&(0,N.jsxs)(`details`,{className:`mt-4 border-t border-border pt-4`,"aria-label":`知识点标签`,children:[(0,N.jsxs)(`summary`,{className:`cursor-pointer text-sm font-semibold text-muted-foreground`,children:[`按知识点筛选`,i?` · 当前：${i}`:` · 展开标签`]}),i&&(0,N.jsxs)(`button`,{className:`filter-chip mt-3`,onClick:()=>a(``),children:[`清除标签：`,i]}),(0,N.jsxs)(`div`,{className:`mt-3 space-y-3`,children:[(0,N.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,N.jsx)(`span`,{className:`mr-1 text-xs text-muted-foreground`,children:`标签`}),(0,N.jsx)(`button`,{className:`filter-chip ${i?``:`active`}`,"aria-pressed":!i,onClick:()=>a(``),children:`不限`}),h&&m.flatMap(e=>e.tags).map(e=>(0,N.jsx)(`button`,{className:`filter-chip ${i===e?`active`:``}`,"aria-pressed":i===e,onClick:()=>a(e),children:e},e))]}),!h&&m.map(e=>(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`p`,{className:`mb-1.5 text-[11px] text-muted-foreground`,children:e.lesson.title}),(0,N.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:e.tags.map(n=>(0,N.jsx)(`button`,{className:`filter-chip ${i===n?`active`:``}`,"aria-pressed":i===n,onClick:()=>{t(e.lesson.id),a(n)},children:n},n))})]},e.lesson.id))]})]})]}),(0,N.jsxs)(`div`,{className:`mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground`,children:[(0,N.jsxs)(`output`,{children:[e===`all`?`全部课次`:jm.find(t=>t.id===e)?.title,` · `,v,` 条内容`]}),(0,N.jsx)(`span`,{children:e===`all`?`按课次浏览 · 最新课次在前`:`按备课顺序排列`})]}),Pm.length===0?(0,N.jsxs)(`div`,{className:`rounded-2xl border border-dashed border-border bg-card px-6 py-10 sm:px-8`,children:[(0,N.jsx)(`div`,{className:`mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary`,children:(0,N.jsx)(ce,{size:24})}),(0,N.jsx)(`h2`,{className:`font-display text-2xl font-semibold`,children:`从这一次课开始`}),(0,N.jsx)(`p`,{className:`mt-3 max-w-lg text-sm leading-7 text-muted-foreground`,children:`还没有讲义。把今天要讲的题目发来，就生成一课，之后备同样的课、加新的题，都在这课里继续。`}),(0,N.jsxs)(`div`,{className:`mt-7 grid gap-4 sm:grid-cols-2`,children:[(0,N.jsxs)(`div`,{className:`rounded-xl bg-secondary/60 p-5`,children:[(0,N.jsx)(ie,{className:`mb-3 text-primary`,size:19}),(0,N.jsx)(`h3`,{className:`text-sm font-semibold`,children:`一次课 · 一个分组`}),(0,N.jsx)(`p`,{className:`mt-2 text-xs leading-6 text-muted-foreground`,children:`按课次归档，讲过的内容不会散落在不同科目里，复用同一套课直接打开。`})]}),(0,N.jsxs)(`div`,{className:`rounded-xl bg-secondary/60 p-5`,children:[(0,N.jsx)(ce,{className:`mb-3 text-primary`,size:19}),(0,N.jsx)(`h3`,{className:`text-sm font-semibold`,children:`题目 · 先思考，后讲解`}),(0,N.jsx)(`p`,{className:`mt-2 text-xs leading-6 text-muted-foreground`,children:`题面独立展示；答案、解题思路、易错点折叠收纳，讲到哪里展开到哪里。`})]})]})]}):_.length===0?(0,N.jsxs)(`div`,{className:`rounded-2xl border border-border bg-card p-10 text-center`,children:[(0,N.jsx)(`h2`,{className:`text-lg font-semibold`,children:e===`all`?`没有找到匹配的内容`:`${jm.find(t=>t.id===e)?.title} 还没有内容`}),(0,N.jsx)(`p`,{className:`my-3 text-sm text-muted-foreground`,children:e===`all`?`换个关键词，或清除课次、类型与标签筛选。`:`把这一课要讲的题目发来，就会被收录到这里。`}),e===`all`?(0,N.jsx)(`button`,{className:`action-button`,onClick:S,children:`清除筛选`}):(0,N.jsx)(`button`,{className:`action-button`,onClick:()=>{t(`all`),l(null)},children:`看全部课次`})]}):(0,N.jsx)(`div`,{className:`grid gap-6`,children:_.map(({lesson:e,items:t})=>(0,N.jsxs)(`section`,{"aria-label":e.title,children:[(0,N.jsxs)(`div`,{className:`mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2`,children:[(0,N.jsx)(`h2`,{className:`font-display text-lg font-semibold`,children:e.title}),(0,N.jsxs)(`span`,{className:`text-xs text-muted-foreground`,children:[e.date,` · `,t.length,` 条`]})]}),e.summary&&(0,N.jsx)(`p`,{className:`mb-3 text-xs leading-6 text-muted-foreground`,children:e.summary}),(0,N.jsx)(`div`,{className:`grid gap-3`,children:t.map(e=>C(e))})]},e.id))})]})})]})]})]})}(0,xm.createRoot)(document.getElementById(`root`)).render((0,N.jsx)(w.StrictMode,{children:(0,N.jsx)(Gm,{})}));