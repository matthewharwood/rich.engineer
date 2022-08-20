/**
 * @license
 * @builder.io/qwik 0.0.100
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
const qTest = !!globalThis.describe;
const EMPTY_ARRAY = [];
const EMPTY_OBJ = {};
{
  Object.freeze(EMPTY_ARRAY);
  Object.freeze(EMPTY_OBJ);
  Error.stackTraceLimit = 9999;
}
function assertDefined(value, text, ...parts) {
  {
    if (value != null)
      return;
    throw logErrorAndStop(text, ...parts);
  }
}
function assertEqual(value1, value2, text, ...parts) {
  {
    if (value1 === value2)
      return;
    throw logErrorAndStop(text, ...parts);
  }
}
function assertTrue(value1, text, ...parts) {
  {
    if (value1 === true)
      return;
    throw logErrorAndStop(text, ...parts);
  }
}
const isSerializableObject = (v) => {
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};
const isObject = (v) => {
  return v && typeof v === "object";
};
const isArray = (v) => {
  return Array.isArray(v);
};
const isString = (v) => {
  return typeof v === "string";
};
const isFunction = (v) => {
  return typeof v === "function";
};
const OnRenderProp = "q:renderFn";
const ComponentStylesPrefixContent = "\u2B50\uFE0F";
const QSlot = "q:slot";
const QSlotRef = "q:sref";
const QSlotName = "q:sname";
const QStyle = "q:style";
const QScopedStyle = "q:sstyle";
const QContainerAttr = "q:container";
const QContainerSelector = "[q\\:container]";
const RenderEvent = "qRender";
const ELEMENT_ID = "q:id";
const ELEMENT_ID_PREFIX = "#";
const getDocument = (node) => {
  if (typeof document !== "undefined") {
    return document;
  }
  if (node.nodeType === 9) {
    return node;
  }
  const doc = node.ownerDocument;
  assertDefined(doc, "doc must be defined");
  return doc;
};
let _context;
const CONTAINER = Symbol("container");
const tryGetInvokeContext = () => {
  if (!_context) {
    const context = typeof document !== "undefined" && document && document.__q_context__;
    if (!context) {
      return void 0;
    }
    if (isArray(context)) {
      const element = context[0];
      return document.__q_context__ = newInvokeContext(getDocument(element), void 0, element, context[1], context[2]);
    }
    return context;
  }
  return _context;
};
const getInvokeContext = () => {
  const ctx = tryGetInvokeContext();
  if (!ctx) {
    throw qError(QError_useMethodOutsideContext);
  }
  return ctx;
};
const useInvokeContext = () => {
  const ctx = getInvokeContext();
  if (ctx.$event$ !== RenderEvent) {
    throw qError(QError_useInvokeContext);
  }
  assertDefined(ctx.$hostElement$, `invoke: $hostElement$ must be defined`, ctx);
  assertDefined(ctx.$waitOn$, `invoke: $waitOn$ must be defined`, ctx);
  assertDefined(ctx.$renderCtx$, `invoke: $renderCtx$ must be defined`, ctx);
  assertDefined(ctx.$doc$, `invoke: $doc$ must be defined`, ctx);
  assertDefined(ctx.$subscriber$, `invoke: $subscriber$ must be defined`, ctx);
  return ctx;
};
const useInvoke = (context, fn, ...args) => {
  const previousContext = _context;
  let returnValue;
  try {
    _context = context;
    returnValue = fn.apply(null, args);
  } finally {
    _context = previousContext;
  }
  return returnValue;
};
const newInvokeContext = (doc, hostElement, element, event, url) => {
  return {
    $seq$: 0,
    $doc$: doc,
    $hostElement$: hostElement,
    $element$: element,
    $event$: event,
    $url$: url || null,
    $qrl$: void 0
  };
};
const getContainer = (el) => {
  let container = el[CONTAINER];
  if (!container) {
    container = el.closest(QContainerSelector);
    el[CONTAINER] = container;
  }
  return container;
};
const isNode = (value) => {
  return value && typeof value.nodeType == "number";
};
const isDocument = (value) => {
  return value && value.nodeType === 9;
};
const isElement = (value) => {
  return isNode(value) && value.nodeType === 1;
};
const isQwikElement = (value) => {
  return isNode(value) && (value.nodeType === 1 || value.nodeType === 111);
};
const isVirtualElement = (value) => {
  return isObject(value) && value.nodeType === 111;
};
const isPromise = (value) => {
  return value instanceof Promise;
};
const safeCall = (call, thenFn, rejectFn) => {
  try {
    const promise = call();
    if (isPromise(promise)) {
      return promise.then(thenFn, rejectFn);
    } else {
      return thenFn(promise);
    }
  } catch (e) {
    return rejectFn(e);
  }
};
const then = (promise, thenFn) => {
  return isPromise(promise) ? promise.then(thenFn) : thenFn(promise);
};
const promiseAll = (promises) => {
  const hasPromise = promises.some(isPromise);
  if (hasPromise) {
    return Promise.all(promises);
  }
  return promises;
};
const isNotNullable = (v) => {
  return v != null;
};
const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
const createPlatform$1 = (doc) => {
  const moduleCache = /* @__PURE__ */ new Map();
  return {
    isServer: false,
    importSymbol(element, url, symbolName) {
      const urlDoc = toUrl(doc, element, url).toString();
      const urlCopy = new URL(urlDoc);
      urlCopy.hash = "";
      urlCopy.search = "";
      const importURL = urlCopy.href;
      const mod = moduleCache.get(importURL);
      if (mod) {
        return mod[symbolName];
      }
      return import(
        /* @vite-ignore */
        importURL
        ).then((mod2) => {
        mod2 = findModule(mod2);
        moduleCache.set(importURL, mod2);
        return mod2[symbolName];
      });
    },
    raf: (fn) => {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          resolve(fn());
        });
      });
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol() {
      return void 0;
    }
  };
};
const findModule = (module) => {
  return Object.values(module).find(isModule) || module;
};
const isModule = (module) => {
  return isObject(module) && module[Symbol.toStringTag] === "Module";
};
const toUrl = (doc, element, url) => {
  var _a2;
  const containerEl = getContainer(element);
  const base = new URL((_a2 = containerEl == null ? void 0 : containerEl.getAttribute("q:base")) != null ? _a2 : doc.baseURI, doc.baseURI);
  return new URL(url, base);
};
const setPlatform = (doc, plt) => doc[DocumentPlatform] = plt;
const getPlatform = (docOrNode) => {
  const doc = getDocument(docOrNode);
  return doc[DocumentPlatform] || (doc[DocumentPlatform] = createPlatform$1(doc));
};
const isServer = (doc) => {
  return getPlatform(doc).isServer;
};
const DocumentPlatform = ":platform:";
const ON_PROP_REGEX = /^(window:|document:|)on([A-Z]|-.).*\$$/;
const isOnProp = (prop) => {
  return ON_PROP_REGEX.test(prop);
};
const addQRLListener = (ctx, prop, input) => {
  if (!input) {
    return void 0;
  }
  const value = isArray(input) ? input.map(ensureQrl) : ensureQrl(input);
  if (!ctx.$listeners$) {
    ctx.$listeners$ = /* @__PURE__ */ new Map();
  }
  let existingListeners = ctx.$listeners$.get(prop);
  if (!existingListeners) {
    ctx.$listeners$.set(prop, existingListeners = []);
  }
  const newQRLs = isArray(value) ? value : [value];
  for (const value2 of newQRLs) {
    const cp = value2.$copy$();
    cp.$setContainer$(ctx.$element$);
    for (let i = 0; i < existingListeners.length; i++) {
      const qrl = existingListeners[i];
      if (isSameQRL(qrl, cp)) {
        existingListeners.splice(i, 1);
        i--;
      }
    }
    existingListeners.push(cp);
  }
  return existingListeners;
};
const ensureQrl = (value) => {
  return isQrl$1(value) ? value : $$1(value);
};
const useSequentialScope = () => {
  const ctx = useInvokeContext();
  const i = ctx.$seq$;
  const hostElement = ctx.$hostElement$;
  const elementCtx = getContext(hostElement);
  ctx.$seq$++;
  const set = (value) => {
    {
      verifySerializable(value);
    }
    return elementCtx.$seq$[i] = value;
  };
  return {
    get: elementCtx.$seq$[i],
    set,
    i,
    ctx
  };
};
const useOn = (event, eventQrl) => _useOn(`on:${event}`, eventQrl);
const _useOn = (eventName, eventQrl) => {
  const invokeCtx = useInvokeContext();
  const ctx = getContext(invokeCtx.$hostElement$);
  assertQrl(eventQrl);
  addQRLListener(ctx, eventName, eventQrl);
};
const emitEvent = (el, eventName, detail, bubbles) => {
  if (el && typeof CustomEvent === "function") {
    el.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles,
      composed: bubbles
    }));
  }
};
const directSetAttribute = (el, prop, value) => {
  return el.setAttribute(prop, value);
};
const directGetAttribute = (el, prop) => {
  return el.getAttribute(prop);
};
const fromCamelToKebabCase = (text) => {
  return text.replace(/([A-Z])/g, "-$1").toLowerCase();
};
const jsx = (type, props, key) => {
  {
    if (!isString(type) && !isFunction(type)) {
      throw qError(QError_invalidJsxNodeType, type);
    }
  }
  return new JSXNodeImpl(type, props, key);
};
const HOST_TYPE = ":host";
const SKIP_RENDER_TYPE = ":skipRender";
const VIRTUAL_TYPE = ":virtual";
class JSXNodeImpl {
  constructor(type, props, key = null) {
    this.type = type;
    this.props = props;
    this.key = key;
  }
}
const isJSXNode = (n) => {
  {
    if (n instanceof JSXNodeImpl) {
      return true;
    }
    if (isObject(n) && "key" in n && "props" in n && "type" in n) {
      logWarn(`Duplicate implementations of "JSXNode" found`);
      return true;
    }
    return false;
  }
};
const Fragment = (props) => props.children;
const SkipRerender = (props) => props.children;
const SSRComment = () => null;
const Virtual = (props) => props.children;
const executeComponent = (rctx, ctx) => {
  ctx.$dirty$ = false;
  ctx.$mounted$ = true;
  const hostElement = ctx.$element$;
  const onRenderQRL = ctx.$renderQrl$;
  assertDefined(onRenderQRL, `render: host element to render must has a $renderQrl$:`, ctx);
  const props = ctx.$props$;
  assertDefined(props, `render: host element to render must has defined props`, ctx);
  rctx.$containerState$.$hostsStaging$.delete(hostElement);
  const newCtx = copyRenderContext(rctx);
  const invocatinContext = newInvokeContext(rctx.$doc$, hostElement, void 0, RenderEvent);
  invocatinContext.$subscriber$ = hostElement;
  invocatinContext.$renderCtx$ = newCtx;
  const waitOn = invocatinContext.$waitOn$ = [];
  rctx.$containerState$.$subsManager$.$clearSub$(hostElement);
  const onRenderFn = onRenderQRL.$invokeFn$(rctx.$containerEl$, invocatinContext);
  return safeCall(() => onRenderFn(props), (jsxNode) => {
    rctx.$hostElements$.add(hostElement);
    const waitOnPromise = promiseAll(waitOn);
    return then(waitOnPromise, () => {
      if (isFunction(jsxNode)) {
        ctx.$dirty$ = false;
        jsxNode = jsxNode();
      } else if (ctx.$dirty$) {
        return executeComponent(rctx, ctx);
      }
      let componentCtx = ctx.$component$;
      if (!componentCtx) {
        componentCtx = ctx.$component$ = {
          $ctx$: ctx,
          $slots$: [],
          $attachedListeners$: false
        };
      }
      componentCtx.$attachedListeners$ = false;
      componentCtx.$slots$ = [];
      newCtx.$localStack$.push(ctx);
      newCtx.$currentComponent$ = componentCtx;
      return {
        node: jsxNode,
        rctx: newCtx
      };
    });
  }, (err) => {
    logError(err);
  });
};
const createRenderContext = (doc, containerState) => {
  const ctx = {
    $doc$: doc,
    $containerState$: containerState,
    $containerEl$: containerState.$containerEl$,
    $hostElements$: /* @__PURE__ */ new Set(),
    $operations$: [],
    $roots$: [],
    $localStack$: [],
    $currentComponent$: void 0,
    $perf$: {
      $visited$: 0
    }
  };
  return ctx;
};
const copyRenderContext = (ctx) => {
  const newCtx = {
    ...ctx,
    $localStack$: [...ctx.$localStack$]
  };
  return newCtx;
};
const stringifyClass = (obj, oldValue) => {
  const oldParsed = parseClassAny(oldValue);
  const newParsed = parseClassAny(obj);
  return [...oldParsed.filter((s) => s.includes(ComponentStylesPrefixContent)), ...newParsed].join(" ");
};
const joinClasses = (...input) => {
  const set = /* @__PURE__ */ new Set();
  input.forEach((value) => {
    parseClassAny(value).forEach((v) => set.add(v));
  });
  return Array.from(set).join(" ");
};
const parseClassAny = (obj) => {
  if (isString(obj)) {
    return parseClassList(obj);
  } else if (isObject(obj)) {
    if (isArray(obj)) {
      return obj;
    } else {
      const output = [];
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (value) {
            output.push(key);
          }
        }
      }
      return output;
    }
  }
  return [];
};
const parseClassListRegex = /\s/;
const parseClassList = (value) => !value ? [] : value.split(parseClassListRegex);
const stringifyStyle = (obj) => {
  if (obj == null)
    return "";
  if (typeof obj == "object") {
    if (isArray(obj)) {
      throw qError(QError_stringifyClassOrStyle, obj, "style");
    } else {
      const chunks = [];
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (value) {
            chunks.push(fromCamelToKebabCase(key) + ":" + value);
          }
        }
      }
      return chunks.join(";");
    }
  }
  return String(obj);
};
const getNextIndex = (ctx) => {
  return intToStr(ctx.$containerState$.$elementIndex$++);
};
const getQId = (el) => {
  const ctx = tryGetContext(el);
  if (ctx) {
    return ctx.$id$;
  }
  return null;
};
const setQId = (rctx, ctx) => {
  const id = getNextIndex(rctx);
  ctx.$id$ = id;
  directSetAttribute(ctx.$element$, ELEMENT_ID, id);
};
const hasStyle = (containerState, styleId) => {
  return containerState.$styleIds$.has(styleId);
};
const ALLOWS_PROPS = [QSlot];
const SKIPS_PROPS = [QSlot, OnRenderProp, "children"];
const hashCode = (text, hash = 0) => {
  if (text.length === 0)
    return hash;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Number(Math.abs(hash)).toString(36);
};
const styleKey = (qStyles, index2) => {
  return `${hashCode(qStyles.getHash())}-${index2}`;
};
const styleContent = (styleId) => {
  return ComponentStylesPrefixContent + styleId;
};
const serializeSStyle = (scopeIds) => {
  const value = scopeIds.join(" ");
  if (value.length > 0) {
    return value;
  }
  return void 0;
};
const renderComponent = (rctx, ctx, flags) => {
  const justMounted = !ctx.$mounted$;
  return then(executeComponent(rctx, ctx), (res) => {
    if (res) {
      const hostElement = ctx.$element$;
      const newCtx = res.rctx;
      const invocatinContext = newInvokeContext(rctx.$doc$, hostElement);
      invocatinContext.$subscriber$ = hostElement;
      invocatinContext.$renderCtx$ = newCtx;
      if (justMounted) {
        if (ctx.$appendStyles$) {
          for (const style of ctx.$appendStyles$) {
            appendHeadStyle(rctx, hostElement, style);
          }
        }
        if (ctx.$scopeIds$) {
          const value = serializeSStyle(ctx.$scopeIds$);
          if (value) {
            directSetAttribute(hostElement, QScopedStyle, value);
          }
        }
      }
      const processedJSXNode = processData$1(res.node, invocatinContext);
      return then(processedJSXNode, (processedJSXNode2) => {
        return visitJsxNode(newCtx, hostElement, processedJSXNode2, flags);
      });
    }
  });
};
class ProcessedJSXNodeImpl {
  constructor($type$, $props$, $children$, $key$) {
    this.$type$ = $type$;
    this.$props$ = $props$;
    this.$children$ = $children$;
    this.$key$ = $key$;
    this.$elm$ = null;
    this.$text$ = "";
  }
}
const processNode = (node, invocationContext) => {
  const key = node.key != null ? String(node.key) : null;
  let textType = "";
  if (node.type === SkipRerender) {
    textType = SKIP_RENDER_TYPE;
  } else if (node.type === Virtual) {
    textType = VIRTUAL_TYPE;
  } else if (isFunction(node.type)) {
    const res = invocationContext ? useInvoke(invocationContext, () => node.type(node.props, node.key)) : node.type(node.props, node.key);
    return processData$1(res, invocationContext);
  } else if (isString(node.type)) {
    textType = node.type;
  } else {
    throw qError(QError_invalidJsxNodeType, node.type);
  }
  let children = EMPTY_ARRAY;
  if (node.props) {
    const mightPromise = processData$1(node.props.children, invocationContext);
    return then(mightPromise, (result) => {
      if (result !== void 0) {
        if (isArray(result)) {
          children = result;
        } else {
          children = [result];
        }
      }
      return new ProcessedJSXNodeImpl(textType, node.props, children, key);
    });
  }
  return new ProcessedJSXNodeImpl(textType, node.props, children, key);
};
const processData$1 = (node, invocationContext) => {
  if (node == null || typeof node === "boolean") {
    return void 0;
  }
  if (isJSXNode(node)) {
    return processNode(node, invocationContext);
  } else if (isPromise(node)) {
    return node.then((node2) => processData$1(node2, invocationContext));
  } else if (isArray(node)) {
    const output = promiseAll(node.flatMap((n) => processData$1(n, invocationContext)));
    return then(output, (array) => array.flat(100).filter(isNotNullable));
  } else if (isString(node) || typeof node === "number") {
    const newNode = new ProcessedJSXNodeImpl("#text", EMPTY_OBJ, EMPTY_ARRAY, null);
    newNode.$text$ = String(node);
    return newNode;
  } else {
    logWarn("A unsupported value was passed to the JSX, skipping render. Value:", node);
    return void 0;
  }
};
const VIRTUAL_SYMBOL = "__virtual";
const newVirtualElement = (doc) => {
  const open = doc.createComment("qv ");
  const close = doc.createComment("/qv");
  return createVirtualElement(open, close);
};
const parseVirtualAttributes = (str) => {
  if (!str) {
    return /* @__PURE__ */ new Map();
  }
  const attributes = str.split(" ");
  return new Map(attributes.map((attr) => {
    const index2 = attr.indexOf("=");
    if (index2 >= 0) {
      return [attr.slice(0, index2), unescape(attr.slice(index2 + 1))];
    } else {
      return [attr, ""];
    }
  }));
};
const serializeVirtualAttributes = (map) => {
  const attributes = [];
  map.forEach((value, key) => {
    if (!value) {
      attributes.push(`${key}`);
    } else {
      attributes.push(`${key}=${escape$1(value)}`);
    }
  });
  return attributes.join(" ");
};
const SHOW_COMMENT$1 = 128;
const FILTER_ACCEPT$1 = 1;
const FILTER_REJECT$1 = 2;
const walkerVirtualByAttribute = (el, prop, value) => {
  return el.ownerDocument.createTreeWalker(el, SHOW_COMMENT$1, {
    acceptNode(c) {
      const virtual = getVirtualElement(c);
      if (virtual) {
        return virtual.getAttribute(prop) === value ? FILTER_ACCEPT$1 : FILTER_REJECT$1;
      }
      return FILTER_REJECT$1;
    }
  });
};
const queryAllVirtualByAttribute = (el, prop, value) => {
  const walker = walkerVirtualByAttribute(el, prop, value);
  const pars = [];
  let currentNode = null;
  while (currentNode = walker.nextNode()) {
    pars.push(getVirtualElement(currentNode));
  }
  return pars;
};
const escape$1 = (s) => {
  return s.replace(/ /g, "+");
};
const unescape = (s) => {
  return s.replace(/\+/g, " ");
};
const createVirtualElement = (open, close) => {
  const doc = open.ownerDocument;
  const template = doc.createElement("template");
  assertTrue(open.data.startsWith("qv "), "comment is not a qv");
  const attributes = parseVirtualAttributes(open.data.slice(3));
  const insertBefore2 = (node, ref) => {
    const parent = virtual.parentElement;
    if (parent) {
      const ref2 = ref ? ref : close;
      parent.insertBefore(node, ref2);
    } else {
      template.insertBefore(node, ref);
    }
    return node;
  };
  const remove = () => {
    const parent = virtual.parentElement;
    if (parent) {
      const ch = Array.from(virtual.childNodes);
      assertEqual(template.childElementCount, 0, "children should be empty");
      parent.removeChild(open);
      template.append(...ch);
      parent.removeChild(close);
    }
  };
  const appendChild = (node) => {
    return insertBefore2(node, null);
  };
  const insertBeforeTo = (newParent, child) => {
    const ch = Array.from(virtual.childNodes);
    if (virtual.parentElement) {
      console.warn("already attached");
    }
    newParent.insertBefore(open, child);
    for (const c of ch) {
      newParent.insertBefore(c, child);
    }
    newParent.insertBefore(close, child);
    assertEqual(template.childElementCount, 0, "children should be empty");
  };
  const appendTo = (newParent) => {
    insertBeforeTo(newParent, null);
  };
  const updateComment = () => {
    open.data = `qv ${serializeVirtualAttributes(attributes)}`;
  };
  const removeChild = (child) => {
    if (virtual.parentElement) {
      virtual.parentElement.removeChild(child);
    } else {
      template.removeChild(child);
    }
  };
  const getAttribute = (prop) => {
    var _a2;
    return (_a2 = attributes.get(prop)) != null ? _a2 : null;
  };
  const hasAttribute = (prop) => {
    return attributes.has(prop);
  };
  const setAttribute2 = (prop, value) => {
    attributes.set(prop, value);
    updateComment();
  };
  const removeAttribute = (prop) => {
    attributes.delete(prop);
    updateComment();
  };
  const matches = (_2) => {
    return false;
  };
  const compareDocumentPosition = (other) => {
    return open.compareDocumentPosition(other);
  };
  const closest = (query) => {
    const parent = virtual.parentElement;
    if (parent) {
      return parent.closest(query);
    }
    return null;
  };
  const querySelectorAll = (query) => {
    const result = [];
    const ch = getChildren(virtual, "elements");
    ch.forEach((el) => {
      if (isQwikElement(el)) {
        if (el.matches(query)) {
          result.push(el);
        }
        result.concat(Array.from(el.querySelectorAll(query)));
      }
    });
    return result;
  };
  const querySelector = (query) => {
    for (const el of virtual.childNodes) {
      if (isElement(el)) {
        if (el.matches(query)) {
          return el;
        }
        const v = el.querySelector(query);
        if (v !== null) {
          return v;
        }
      }
    }
    return null;
  };
  const virtual = {
    open,
    close,
    appendChild,
    insertBefore: insertBefore2,
    appendTo,
    insertBeforeTo,
    closest,
    remove,
    ownerDocument: open.ownerDocument,
    nodeType: 111,
    compareDocumentPosition,
    querySelectorAll,
    querySelector,
    matches,
    setAttribute: setAttribute2,
    getAttribute,
    hasAttribute,
    removeChild,
    localName: ":virtual",
    nodeName: ":virtual",
    removeAttribute,
    get firstChild() {
      if (virtual.parentElement) {
        const first = open.nextSibling;
        if (first === close) {
          return null;
        }
        return first;
      } else {
        return template.firstChild;
      }
    },
    get nextSibling() {
      return close.nextSibling;
    },
    get previousSibling() {
      return open.previousSibling;
    },
    get childNodes() {
      if (!virtual.parentElement) {
        return template.childNodes;
      }
      const nodes = [];
      let node = open;
      while (node = node.nextSibling) {
        if (node !== close) {
          nodes.push(node);
        } else {
          break;
        }
      }
      return nodes;
    },
    get isConnected() {
      return open.isConnected;
    },
    get parentElement() {
      return open.parentElement;
    }
  };
  open[VIRTUAL_SYMBOL] = virtual;
  return virtual;
};
const processVirtualNodes = (node) => {
  if (node == null) {
    return null;
  }
  if (isComment(node)) {
    const virtual = getVirtualElement(node);
    if (virtual) {
      return virtual;
    }
  }
  return node;
};
const getVirtualElement = (open) => {
  const virtual = open[VIRTUAL_SYMBOL];
  if (virtual) {
    return virtual;
  }
  if (open.data.startsWith("qv ")) {
    const close = findClose(open);
    return createVirtualElement(open, close);
  }
  return null;
};
const findClose = (open) => {
  let node = open.nextSibling;
  let stack = 1;
  while (node) {
    if (isComment(node)) {
      if (node.data.startsWith("qv ")) {
        stack++;
      } else if (node.data === "/qv") {
        stack--;
        if (stack === 0) {
          return node;
        }
      }
    }
    node = node.nextSibling;
  }
  throw new Error("close not found");
};
const isComment = (node) => {
  return node.nodeType === 8;
};
const getRootNode = (node) => {
  if (node == null) {
    return null;
  }
  if (isVirtualElement(node)) {
    return node.open;
  } else {
    return node;
  }
};
const SVG_NS = "http://www.w3.org/2000/svg";
const IS_SVG = 1 << 0;
const IS_HEAD$1 = 1 << 1;
const visitJsxNode = (ctx, elm, jsxNode, flags) => {
  if (jsxNode === void 0) {
    return smartUpdateChildren(ctx, elm, [], "root", flags);
  }
  if (isArray(jsxNode)) {
    return smartUpdateChildren(ctx, elm, jsxNode.flat(), "root", flags);
  } else {
    return smartUpdateChildren(ctx, elm, [jsxNode], "root", flags);
  }
};
const smartUpdateChildren = (ctx, elm, ch, mode, flags) => {
  if (ch.length === 1 && ch[0].$type$ === SKIP_RENDER_TYPE) {
    if (elm.firstChild !== null) {
      return;
    }
    ch = ch[0].$children$;
  }
  const isHead = elm.nodeName === "HEAD";
  if (isHead) {
    mode = "head";
    flags |= IS_HEAD$1;
  }
  const oldCh = getChildren(elm, mode);
  if (oldCh.length > 0 && ch.length > 0) {
    return updateChildren(ctx, elm, oldCh, ch, flags);
  } else if (ch.length > 0) {
    return addVnodes(ctx, elm, null, ch, 0, ch.length - 1, flags);
  } else if (oldCh.length > 0) {
    return removeVnodes(ctx, oldCh, 0, oldCh.length - 1);
  }
};
const updateChildren = (ctx, parentElm, oldCh, newCh, flags) => {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx;
  let idxInOld;
  let elmToMove;
  const results = [];
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      results.push(patchVnode(ctx, oldStartVnode, newStartVnode, flags));
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      results.push(patchVnode(ctx, oldEndVnode, newEndVnode, flags));
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      results.push(patchVnode(ctx, oldStartVnode, newEndVnode, flags));
      insertBefore(ctx, parentElm, oldStartVnode, oldEndVnode.nextSibling);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      results.push(patchVnode(ctx, oldEndVnode, newStartVnode, flags));
      insertBefore(ctx, parentElm, oldEndVnode, oldStartVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      if (oldKeyToIdx === void 0) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      idxInOld = oldKeyToIdx[newStartVnode.$key$];
      if (idxInOld === void 0) {
        const newElm = createElm(ctx, newStartVnode, flags);
        results.push(then(newElm, (newElm2) => {
          insertBefore(ctx, parentElm, newElm2, oldStartVnode);
        }));
      } else {
        elmToMove = oldCh[idxInOld];
        if (!isTagName(elmToMove, newStartVnode.$type$)) {
          const newElm = createElm(ctx, newStartVnode, flags);
          results.push(then(newElm, (newElm2) => {
            insertBefore(ctx, parentElm, newElm2, oldStartVnode);
          }));
        } else {
          results.push(patchVnode(ctx, elmToMove, newStartVnode, flags));
          oldCh[idxInOld] = void 0;
          insertBefore(ctx, parentElm, elmToMove, oldStartVnode);
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  if (newStartIdx <= newEndIdx) {
    const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$;
    results.push(addVnodes(ctx, parentElm, before, newCh, newStartIdx, newEndIdx, flags));
  }
  let wait = promiseAll(results);
  if (oldStartIdx <= oldEndIdx) {
    wait = then(wait, () => {
      removeVnodes(ctx, oldCh, oldStartIdx, oldEndIdx);
    });
  }
  return wait;
};
const isComponentNode = (node) => {
  return node.$props$ && OnRenderProp in node.$props$;
};
const getCh = (elm, filter) => {
  const end = isVirtualElement(elm) ? elm.close : null;
  const nodes = [];
  let node = elm.firstChild;
  while (node = processVirtualNodes(node)) {
    if (filter(node)) {
      nodes.push(node);
    }
    node = node.nextSibling;
    if (node === end) {
      break;
    }
  }
  return nodes;
};
const getChildren = (elm, mode) => {
  switch (mode) {
    case "root":
      return getCh(elm, isChildComponent);
    case "head":
      return getCh(elm, isHeadChildren);
    case "elements":
      return getCh(elm, isQwikElement);
  }
};
const isHeadChildren = (node) => {
  const type = node.nodeType;
  if (type === 1) {
    return node.hasAttribute("q:head");
  }
  return type === 111;
};
const isSlotTemplate = (node) => {
  return node.nodeName === "Q:TEMPLATE";
};
const isChildComponent = (node) => {
  const type = node.nodeType;
  if (type === 3 || type === 111) {
    return true;
  }
  if (type !== 1) {
    return false;
  }
  const nodeName = node.nodeName;
  if (nodeName === "Q:TEMPLATE") {
    return false;
  }
  if (nodeName === "HEAD") {
    return node.hasAttribute("q:head");
  }
  return true;
};
const splitBy = (input, condition) => {
  var _a2;
  const output = {};
  for (const item of input) {
    const key = condition(item);
    const array = (_a2 = output[key]) != null ? _a2 : output[key] = [];
    array.push(item);
  }
  return output;
};
const patchVnode = (rctx, elm, vnode, flags) => {
  vnode.$elm$ = elm;
  const tag = vnode.$type$;
  if (tag === "#text") {
    if (elm.data !== vnode.$text$) {
      setProperty$1(rctx, elm, "data", vnode.$text$);
    }
    return;
  }
  if (tag === HOST_TYPE) {
    throw qError(QError_hostCanOnlyBeAtRoot);
  }
  if (tag === SKIP_RENDER_TYPE) {
    return;
  }
  let isSvg = !!(flags & IS_SVG);
  if (!isSvg && tag === "svg") {
    flags |= IS_SVG;
    isSvg = true;
  }
  const props = vnode.$props$;
  const ctx = getContext(elm);
  const isComponent = isComponentNode(vnode);
  const isSlot = !isComponent && QSlotName in props;
  let dirty = isComponent ? updateComponentProperties$1(ctx, rctx, props) : updateProperties$1(ctx, rctx, props, isSvg);
  if (isSvg && vnode.$type$ === "foreignObject") {
    flags &= ~IS_SVG;
    isSvg = false;
  }
  if (isSlot) {
    const currentComponent = rctx.$currentComponent$;
    if (currentComponent) {
      currentComponent.$slots$.push(vnode);
    }
  }
  const ch = vnode.$children$;
  if (isComponent) {
    if (!dirty && !ctx.$renderQrl$ && !ctx.$element$.hasAttribute(ELEMENT_ID)) {
      setQId(rctx, ctx);
      ctx.$renderQrl$ = props[OnRenderProp];
      assertQrl(ctx.$renderQrl$);
      dirty = true;
    }
    const promise = dirty ? renderComponent(rctx, ctx, flags) : void 0;
    return then(promise, () => {
      const currentComponent = ctx.$component$;
      const slotMaps = getSlots(currentComponent, elm);
      const splittedChidren = splitBy(ch, getSlotName);
      const promises = [];
      const slotRctx = copyRenderContext(rctx);
      slotRctx.$localStack$.push(ctx);
      Object.entries(slotMaps.slots).forEach(([key, slotEl]) => {
        if (slotEl && !splittedChidren[key]) {
          const oldCh = getChildren(slotEl, "root");
          if (oldCh.length > 0) {
            removeVnodes(slotRctx, oldCh, 0, oldCh.length - 1);
          }
        }
      });
      Object.entries(slotMaps.templates).forEach(([key, templateEl]) => {
        if (templateEl && !splittedChidren[key]) {
          removeNode(slotRctx, templateEl);
          slotMaps.templates[key] = void 0;
        }
      });
      Object.entries(splittedChidren).forEach(([key, ch2]) => {
        const slotElm = getSlotElement(slotRctx, slotMaps, elm, key);
        promises.push(smartUpdateChildren(slotRctx, slotElm, ch2, "root", flags));
      });
      return then(promiseAll(promises), () => {
        removeTemplates(slotRctx, slotMaps);
      });
    });
  }
  const setsInnerHTML = checkInnerHTML(props);
  if (setsInnerHTML) {
    if (ch.length > 0) {
      logWarn("Node can not have children when innerHTML is set");
    }
    return;
  }
  if (!isSlot) {
    return smartUpdateChildren(rctx, elm, ch, "root", flags);
  }
};
const addVnodes = (ctx, parentElm, before, vnodes, startIdx, endIdx, flags) => {
  const promises = [];
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    assertDefined(ch, "render: node must be defined at index", startIdx, vnodes);
    promises.push(createElm(ctx, ch, flags));
  }
  return then(promiseAll(promises), (children) => {
    for (const child of children) {
      insertBefore(ctx, parentElm, child, before);
    }
  });
};
const removeVnodes = (ctx, nodes, startIdx, endIdx) => {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = nodes[startIdx];
    if (ch) {
      removeNode(ctx, ch);
    }
  }
};
const getSlotElement = (ctx, slotMaps, parentEl, slotName) => {
  const slotEl = slotMaps.slots[slotName];
  if (slotEl) {
    return slotEl;
  }
  const templateEl = slotMaps.templates[slotName];
  if (templateEl) {
    return templateEl;
  }
  const template = createTemplate(ctx, slotName);
  prepend(ctx, parentEl, template);
  slotMaps.templates[slotName] = template;
  return template;
};
const createTemplate = (ctx, slotName) => {
  const template = createElement(ctx, "q:template", false);
  directSetAttribute(template, QSlot, slotName);
  directSetAttribute(template, "hidden", "");
  directSetAttribute(template, "aria-hidden", "true");
  return template;
};
const removeTemplates = (ctx, slotMaps) => {
  Object.keys(slotMaps.templates).forEach((key) => {
    const template = slotMaps.templates[key];
    if (template && slotMaps.slots[key] !== void 0) {
      removeNode(ctx, template);
      slotMaps.templates[key] = void 0;
    }
  });
};
const resolveSlotProjection = (ctx, hostElm, before, after) => {
  Object.entries(before.slots).forEach(([key, slotEl]) => {
    if (slotEl && !after.slots[key]) {
      const template = createTemplate(ctx, key);
      const slotChildren = getChildren(slotEl, "root");
      for (const child of slotChildren) {
        directAppendChild(template, child);
      }
      directInsertBefore(hostElm, template, hostElm.firstChild);
      ctx.$operations$.push({
        $el$: template,
        $operation$: "slot-to-template",
        $args$: slotChildren,
        $fn$: () => {
        }
      });
    }
  });
  Object.entries(after.slots).forEach(([key, slotEl]) => {
    if (slotEl && !before.slots[key]) {
      const template = before.templates[key];
      if (template) {
        const children = getChildren(template, "root");
        children.forEach((child) => {
          directAppendChild(slotEl, child);
        });
        template.remove();
        ctx.$operations$.push({
          $el$: slotEl,
          $operation$: "template-to-slot",
          $args$: [template],
          $fn$: () => {
          }
        });
      }
    }
  });
};
const getSlotName = (node) => {
  var _a2, _b;
  return (_b = (_a2 = node.$props$) == null ? void 0 : _a2[QSlot]) != null ? _b : "";
};
const createElm = (rctx, vnode, flags) => {
  var _a2;
  rctx.$perf$.$visited$++;
  const tag = vnode.$type$;
  if (tag === "#text") {
    return vnode.$elm$ = createTextNode(rctx, vnode.$text$);
  }
  if (tag === HOST_TYPE) {
    throw qError(QError_hostCanOnlyBeAtRoot);
  }
  let isSvg = !!(flags & IS_SVG);
  if (!isSvg && tag === "svg") {
    flags |= IS_SVG;
    isSvg = true;
  }
  const isVirtual = tag === VIRTUAL_TYPE;
  let elm;
  let isHead = !!(flags & IS_HEAD$1);
  if (isVirtual) {
    elm = newVirtualElement(rctx.$doc$);
  } else if (tag === "head") {
    elm = rctx.$doc$.head;
    flags |= IS_HEAD$1;
    isHead = true;
  } else if (tag === "title") {
    elm = (_a2 = rctx.$doc$.querySelector("title")) != null ? _a2 : createElement(rctx, tag, isSvg);
  } else {
    elm = createElement(rctx, tag, isSvg);
    flags &= ~IS_HEAD$1;
  }
  vnode.$elm$ = elm;
  const props = vnode.$props$;
  const isComponent = isComponentNode(vnode);
  const isSlot = isVirtual && QSlotName in props;
  const hasRef = !isVirtual && "ref" in props;
  const ctx = getContext(elm);
  setKey(elm, vnode.$key$);
  if (isHead && !isVirtual) {
    directSetAttribute(elm, "q:head", "");
  }
  if (isSvg && tag === "foreignObject") {
    isSvg = false;
    flags &= ~IS_SVG;
  }
  const currentComponent = rctx.$currentComponent$;
  if (currentComponent) {
    if (!isVirtual) {
      const scopedIds = currentComponent.$ctx$.$scopeIds$;
      if (scopedIds) {
        scopedIds.forEach((styleId) => {
          elm.classList.add(styleId);
        });
      }
    }
    if (isSlot) {
      directSetAttribute(elm, QSlotRef, currentComponent.$ctx$.$id$);
      currentComponent.$slots$.push(vnode);
    }
  }
  if (isComponent) {
    updateComponentProperties$1(ctx, rctx, props);
  } else {
    updateProperties$1(ctx, rctx, props, isSvg);
  }
  if (isComponent || ctx.$listeners$ || hasRef) {
    setQId(rctx, ctx);
  }
  let wait;
  if (isComponent) {
    const renderQRL = props[OnRenderProp];
    assertQrl(renderQRL);
    ctx.$renderQrl$ = renderQRL;
    wait = renderComponent(rctx, ctx, flags);
  } else {
    const setsInnerHTML = checkInnerHTML(props);
    if (setsInnerHTML) {
      if (vnode.$children$.length > 0) {
        logWarn("Node can not have children when innerHTML is set");
      }
      return elm;
    }
  }
  return then(wait, () => {
    const currentComponent2 = ctx.$component$;
    let children = vnode.$children$;
    if (children.length > 0) {
      if (children.length === 1 && children[0].$type$ === SKIP_RENDER_TYPE) {
        children = children[0].$children$;
      }
      const slotRctx = copyRenderContext(rctx);
      slotRctx.$localStack$.push(ctx);
      const slotMap = isComponent ? getSlots(currentComponent2, elm) : void 0;
      const promises = children.map((ch) => createElm(slotRctx, ch, flags));
      return then(promiseAll(promises), () => {
        let parent = elm;
        for (const node of children) {
          if (slotMap) {
            parent = getSlotElement(slotRctx, slotMap, elm, getSlotName(node));
          }
          directAppendChild(parent, node.$elm$);
        }
        return elm;
      });
    }
    return elm;
  });
};
const getSlots = (componentCtx, hostElm) => {
  var _a2, _b, _c, _d;
  const slots = {};
  const templates = {};
  const parent = hostElm.parentElement;
  if (parent) {
    const slotRef = directGetAttribute(hostElm, "q:id");
    const existingSlots = queryAllVirtualByAttribute(parent, "q:sref", slotRef);
    for (const elm of existingSlots) {
      slots[(_a2 = directGetAttribute(elm, QSlotName)) != null ? _a2 : ""] = elm;
    }
  }
  const newSlots = (_b = componentCtx == null ? void 0 : componentCtx.$slots$) != null ? _b : EMPTY_ARRAY;
  const t = Array.from(hostElm.childNodes).filter(isSlotTemplate);
  for (const vnode of newSlots) {
    slots[(_c = vnode.$props$[QSlotName]) != null ? _c : ""] = vnode.$elm$;
  }
  for (const elm of t) {
    templates[(_d = directGetAttribute(elm, QSlot)) != null ? _d : ""] = elm;
  }
  return { slots, templates };
};
const handleStyle = (ctx, elm, _2, newValue) => {
  setAttribute(ctx, elm, "style", stringifyStyle(newValue));
  return true;
};
const handleClass = (ctx, elm, _2, newValue, oldValue) => {
  if (!oldValue) {
    oldValue = elm.className;
  }
  setAttribute(ctx, elm, "class", stringifyClass(newValue, oldValue));
  return true;
};
const checkBeforeAssign = (ctx, elm, prop, newValue) => {
  if (prop in elm) {
    if (elm[prop] !== newValue) {
      setProperty$1(ctx, elm, prop, newValue);
    }
  }
  return true;
};
const dangerouslySetInnerHTML = "dangerouslySetInnerHTML";
const setInnerHTML = (ctx, elm, _2, newValue) => {
  if (dangerouslySetInnerHTML in elm) {
    setProperty$1(ctx, elm, dangerouslySetInnerHTML, newValue);
  } else if ("innerHTML" in elm) {
    setProperty$1(ctx, elm, "innerHTML", newValue);
  }
  return true;
};
const noop = () => {
  return true;
};
const PROP_HANDLER_MAP = {
  style: handleStyle,
  class: handleClass,
  className: handleClass,
  value: checkBeforeAssign,
  checked: checkBeforeAssign,
  [dangerouslySetInnerHTML]: setInnerHTML,
  innerHTML: noop
};
const updateProperties$1 = (ctx, rctx, expectProps, isSvg) => {
  const keys = Object.keys(expectProps);
  if (keys.length === 0) {
    return false;
  }
  let cache = ctx.$cache$;
  const elm = ctx.$element$;
  for (const key of keys) {
    if (key === "children") {
      continue;
    }
    const newValue = expectProps[key];
    if (key === "ref") {
      newValue.current = elm;
      continue;
    }
    const cacheKey = key;
    if (!cache) {
      cache = ctx.$cache$ = /* @__PURE__ */ new Map();
    }
    const oldValue = cache.get(cacheKey);
    if (newValue === oldValue) {
      continue;
    }
    cache.set(cacheKey, newValue);
    if (key.startsWith("data-") || key.startsWith("aria-")) {
      setAttribute(rctx, elm, key, newValue);
      continue;
    }
    if (isOnProp(key)) {
      setEvent(ctx, key, newValue);
      continue;
    }
    const exception = PROP_HANDLER_MAP[key];
    if (exception) {
      if (exception(rctx, elm, key, newValue, oldValue)) {
        continue;
      }
    }
    if (!isSvg && key in elm) {
      setProperty$1(rctx, elm, key, newValue);
      continue;
    }
    setAttribute(rctx, elm, key, newValue);
  }
  if (ctx.$listeners$) {
    ctx.$listeners$.forEach((value, key) => {
      setAttribute(rctx, elm, fromCamelToKebabCase(key), serializeQRLs(value, ctx));
    });
  }
  return false;
};
const updateComponentProperties$1 = (ctx, rctx, expectProps) => {
  const keys = Object.keys(expectProps);
  if (keys.length === 0) {
    return false;
  }
  const qwikProps = getPropsMutator(ctx, rctx.$containerState$);
  for (const key of keys) {
    if (SKIPS_PROPS.includes(key)) {
      continue;
    }
    qwikProps.set(key, expectProps[key]);
  }
  return ctx.$dirty$;
};
const setEvent = (ctx, prop, value) => {
  assertTrue(prop.endsWith("$"), "render: event property does not end with $", prop);
  addQRLListener(ctx, normalizeOnProp(prop.slice(0, -1)), value);
};
const setAttribute = (ctx, el, prop, value) => {
  const fn = () => {
    if (value == null || value === false) {
      el.removeAttribute(prop);
    } else {
      const str = value === true ? "" : String(value);
      directSetAttribute(el, prop, str);
    }
  };
  ctx.$operations$.push({
    $el$: el,
    $operation$: "set-attribute",
    $args$: [prop, value],
    $fn$: fn
  });
};
const setProperty$1 = (ctx, node, key, value) => {
  const fn = () => {
    try {
      node[key] = value;
    } catch (err) {
      logError(codeToText(QError_setProperty), { node, key, value }, err);
    }
  };
  ctx.$operations$.push({
    $el$: node,
    $operation$: "set-property",
    $args$: [key, value],
    $fn$: fn
  });
};
const createElement = (ctx, expectTag, isSvg) => {
  const el = isSvg ? ctx.$doc$.createElementNS(SVG_NS, expectTag) : ctx.$doc$.createElement(expectTag);
  el[CONTAINER] = ctx.$containerEl$;
  ctx.$operations$.push({
    $el$: el,
    $operation$: "create-element",
    $args$: [expectTag],
    $fn$: () => {
    }
  });
  return el;
};
const insertBefore = (ctx, parent, newChild, refChild) => {
  const fn = () => {
    directInsertBefore(parent, newChild, refChild ? refChild : null);
  };
  ctx.$operations$.push({
    $el$: parent,
    $operation$: "insert-before",
    $args$: [newChild, refChild],
    $fn$: fn
  });
  return newChild;
};
const appendHeadStyle = (ctx, hostElement, styleTask) => {
  const fn = () => {
    const containerEl = ctx.$containerEl$;
    const isDoc = ctx.$doc$.documentElement === containerEl && !!ctx.$doc$.head;
    const style = ctx.$doc$.createElement("style");
    directSetAttribute(style, QStyle, styleTask.styleId);
    style.textContent = styleTask.content;
    if (isDoc) {
      directAppendChild(ctx.$doc$.head, style);
    } else {
      directInsertBefore(containerEl, style, containerEl.firstChild);
    }
  };
  ctx.$containerState$.$styleIds$.add(styleTask.styleId);
  ctx.$operations$.push({
    $el$: hostElement,
    $operation$: "append-style",
    $args$: [styleTask],
    $fn$: fn
  });
};
const prepend = (ctx, parent, newChild) => {
  const fn = () => {
    directInsertBefore(parent, newChild, parent.firstChild);
  };
  ctx.$operations$.push({
    $el$: parent,
    $operation$: "prepend",
    $args$: [newChild],
    $fn$: fn
  });
};
const removeNode = (ctx, el) => {
  const fn = () => {
    const parent = el.parentElement;
    if (parent) {
      if (el.nodeType === 1 || el.nodeType === 111) {
        cleanupTree(el, ctx.$containerState$.$subsManager$);
      }
      directRemoveChild(parent, el);
    } else {
      logWarn("Trying to remove component already removed", el);
    }
  };
  ctx.$operations$.push({
    $el$: el,
    $operation$: "remove",
    $args$: [],
    $fn$: fn
  });
};
const cleanupTree = (parent, subsManager) => {
  if (parent.hasAttribute(QSlotName)) {
    return;
  }
  cleanupElement(parent, subsManager);
  const ch = getChildren(parent, "elements");
  for (const child of ch) {
    cleanupTree(child, subsManager);
  }
};
const cleanupElement = (el, subsManager) => {
  const ctx = tryGetContext(el);
  if (ctx) {
    cleanupContext(ctx, subsManager);
  }
};
const createTextNode = (ctx, text) => {
  return ctx.$doc$.createTextNode(text);
};
const executeContextWithSlots = (ctx) => {
  const before = ctx.$roots$.map((elm) => getSlots(null, elm));
  executeContext(ctx);
  const after = ctx.$roots$.map((elm) => getSlots(null, elm));
  assertEqual(before.length, after.length, "render: number of q:slots changed during render context execution", before, after);
  for (let i = 0; i < before.length; i++) {
    resolveSlotProjection(ctx, ctx.$roots$[i], before[i], after[i]);
  }
};
const executeContext = (ctx) => {
  for (const op of ctx.$operations$) {
    op.$fn$();
  }
};
const directAppendChild = (parent, child) => {
  if (isVirtualElement(child)) {
    child.appendTo(parent);
  } else {
    parent.appendChild(child);
  }
};
const directRemoveChild = (parent, child) => {
  if (isVirtualElement(child)) {
    child.remove();
  } else {
    parent.removeChild(child);
  }
};
const directInsertBefore = (parent, child, ref) => {
  if (isVirtualElement(child)) {
    child.insertBeforeTo(parent, getRootNode(ref));
  } else {
    parent.insertBefore(child, getRootNode(ref));
  }
};
const printRenderStats = (ctx) => {
  var _a2;
  {
    if (typeof window !== "undefined" && window.document != null) {
      const byOp = {};
      for (const op of ctx.$operations$) {
        byOp[op.$operation$] = ((_a2 = byOp[op.$operation$]) != null ? _a2 : 0) + 1;
      }
      const affectedElements = Array.from(new Set(ctx.$operations$.map((a) => a.$el$)));
      const stats = {
        byOp,
        roots: ctx.$roots$,
        hostElements: Array.from(ctx.$hostElements$),
        affectedElements,
        visitedNodes: ctx.$perf$.$visited$,
        operations: ctx.$operations$.map((v) => [v.$operation$, v.$el$, ...v.$args$])
      };
      const noOps = ctx.$operations$.length === 0;
      logDebug("Render stats.", noOps ? "No operations" : "", stats);
    }
  }
};
const createKeyToOldIdx = (children, beginIdx, endIdx) => {
  const map = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const child = children[i];
    if (child.nodeType === 1) {
      const key = getKey(child);
      if (key != null) {
        map[key] = i;
      }
    }
  }
  return map;
};
const KEY_SYMBOL = Symbol("vnode key");
const getKey = (el) => {
  let key = el[KEY_SYMBOL];
  if (key === void 0) {
    key = el[KEY_SYMBOL] = directGetAttribute(el, "q:key");
  }
  return key;
};
const setKey = (el, key) => {
  if (isString(key)) {
    directSetAttribute(el, "q:key", key);
  }
  el[KEY_SYMBOL] = key;
};
const sameVnode = (elm, vnode2) => {
  const isElement2 = elm.nodeType === 1 || elm.nodeType === 111;
  const type = vnode2.$type$;
  if (isElement2) {
    const isSameSel = elm.localName === type;
    if (!isSameSel) {
      return false;
    }
    return getKey(elm) === vnode2.$key$;
  }
  return elm.nodeName === type;
};
const isTagName = (elm, tagName) => {
  if (elm.nodeType === 1) {
    return elm.localName === tagName;
  }
  return elm.nodeName === tagName;
};
const checkInnerHTML = (props) => {
  return dangerouslySetInnerHTML in props;
};
const useLexicalScope = () => {
  var _a2;
  const context = getInvokeContext();
  const hostElement = context.$hostElement$;
  const qrl = (_a2 = context.$qrl$) != null ? _a2 : parseQRL(decodeURIComponent(String(context.$url$)), hostElement);
  assertQrl(qrl);
  if (qrl.$captureRef$ == null) {
    const el = context.$element$;
    assertDefined(el, "invoke: element must be defined inside useLexicalScope()", context);
    assertDefined(qrl.$capture$, "invoke: qrl capture must be defined inside useLexicalScope()", qrl);
    const container = getContainer(el);
    assertDefined(container, `invoke: cant find parent q:container of`, el);
    resumeIfNeeded(container);
    const ctx = getContext(el);
    qrl.$captureRef$ = qrl.$capture$.map((idx) => qInflate(idx, ctx));
  }
  const subscriber = context.$subscriber$;
  if (subscriber) {
    return qrl.$captureRef$;
  }
  return qrl.$captureRef$;
};
const qInflate = (ref, hostCtx) => {
  const int = parseInt(ref, 10);
  const obj = hostCtx.$refMap$[int];
  assertTrue(hostCtx.$refMap$.length > int, "out of bounds inflate access", ref);
  return obj;
};
const notifyChange = (subscriber, containerState) => {
  if (isQwikElement(subscriber)) {
    notifyRender(subscriber, containerState);
  } else {
    notifyWatch(subscriber, containerState);
  }
};
const notifyRender = (hostElement, containerState) => {
  if (!qTest && containerState.$platform$.isServer) {
    logWarn("Can not rerender in server platform");
    return void 0;
  }
  resumeIfNeeded(containerState.$containerEl$);
  const ctx = getContext(hostElement);
  assertDefined(ctx.$renderQrl$, `render: notified host element must have a defined $renderQrl$`, ctx);
  if (ctx.$dirty$) {
    return;
  }
  ctx.$dirty$ = true;
  const activeRendering = containerState.$hostsRendering$ !== void 0;
  if (activeRendering) {
    assertDefined(containerState.$renderPromise$, "render: while rendering, $renderPromise$ must be defined", containerState);
    containerState.$hostsStaging$.add(hostElement);
  } else {
    containerState.$hostsNext$.add(hostElement);
    scheduleFrame(containerState);
  }
};
const notifyWatch = (watch, containerState) => {
  if (watch.$flags$ & WatchFlagsIsDirty) {
    return;
  }
  watch.$flags$ |= WatchFlagsIsDirty;
  const activeRendering = containerState.$hostsRendering$ !== void 0;
  if (activeRendering) {
    assertDefined(containerState.$renderPromise$, "render: while rendering, $renderPromise$ must be defined", containerState);
    containerState.$watchStaging$.add(watch);
  } else {
    containerState.$watchNext$.add(watch);
    scheduleFrame(containerState);
  }
};
const scheduleFrame = (containerState) => {
  if (containerState.$renderPromise$ === void 0) {
    containerState.$renderPromise$ = containerState.$platform$.nextTick(() => renderMarked(containerState));
  }
  return containerState.$renderPromise$;
};
const _hW = () => {
  const [watch] = useLexicalScope();
  notifyWatch(watch, getContainerState(getContainer(watch.$el$)));
};
const renderMarked = async (containerState) => {
  const hostsRendering = containerState.$hostsRendering$ = new Set(containerState.$hostsNext$);
  containerState.$hostsNext$.clear();
  await executeWatchesBefore(containerState);
  containerState.$hostsStaging$.forEach((host) => {
    hostsRendering.add(host);
  });
  containerState.$hostsStaging$.clear();
  const doc = getDocument(containerState.$containerEl$);
  const platform = containerState.$platform$;
  const renderingQueue = Array.from(hostsRendering);
  sortNodes(renderingQueue);
  const ctx = createRenderContext(doc, containerState);
  for (const el of renderingQueue) {
    if (!ctx.$hostElements$.has(el)) {
      ctx.$roots$.push(el);
      try {
        await renderComponent(ctx, getContext(el), getFlags(el.parentElement));
      } catch (e) {
        logError(codeToText(QError_errorWhileRendering), e);
      }
    }
  }
  if (ctx.$operations$.length === 0) {
    printRenderStats(ctx);
    postRendering(containerState, ctx);
    return ctx;
  }
  return platform.raf(() => {
    executeContextWithSlots(ctx);
    printRenderStats(ctx);
    postRendering(containerState, ctx);
    return ctx;
  });
};
const getFlags = (el) => {
  let flags = 0;
  if (el) {
    if (el.namespaceURI === SVG_NS) {
      flags |= IS_SVG;
    }
    if (el.tagName === "HEAD") {
      flags |= IS_HEAD$1;
    }
  }
  return flags;
};
const postRendering = async (containerState, ctx) => {
  await executeWatchesAfter(containerState, (watch, stage) => {
    if ((watch.$flags$ & WatchFlagsIsEffect) === 0) {
      return false;
    }
    if (stage) {
      return ctx.$hostElements$.has(watch.$el$);
    }
    return true;
  });
  containerState.$hostsStaging$.forEach((el) => {
    containerState.$hostsNext$.add(el);
  });
  containerState.$hostsStaging$.clear();
  containerState.$hostsRendering$ = void 0;
  containerState.$renderPromise$ = void 0;
  if (containerState.$hostsNext$.size + containerState.$watchNext$.size > 0) {
    scheduleFrame(containerState);
  }
};
const executeWatchesBefore = async (containerState) => {
  const resourcesPromises = [];
  const watchPromises = [];
  const isWatch = (watch) => (watch.$flags$ & WatchFlagsIsWatch) !== 0;
  const isResourceWatch2 = (watch) => (watch.$flags$ & WatchFlagsIsResource) !== 0;
  containerState.$watchNext$.forEach((watch) => {
    if (isWatch(watch)) {
      watchPromises.push(then(watch.$qrl$.$resolveLazy$(watch.$el$), () => watch));
      containerState.$watchNext$.delete(watch);
    }
    if (isResourceWatch2(watch)) {
      resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(watch.$el$), () => watch));
      containerState.$watchNext$.delete(watch);
    }
  });
  do {
    containerState.$watchStaging$.forEach((watch) => {
      if (isWatch(watch)) {
        watchPromises.push(then(watch.$qrl$.$resolveLazy$(watch.$el$), () => watch));
      } else if (isResourceWatch2(watch)) {
        resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(watch.$el$), () => watch));
      } else {
        containerState.$watchNext$.add(watch);
      }
    });
    containerState.$watchStaging$.clear();
    if (watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches);
      await Promise.all(watches.map((watch) => {
        return runSubscriber(watch, containerState);
      }));
      watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
  if (resourcesPromises.length > 0) {
    const resources = await Promise.all(resourcesPromises);
    sortWatches(resources);
    resources.forEach((watch) => runSubscriber(watch, containerState));
  }
};
const executeWatchesAfter = async (containerState, watchPred) => {
  const watchPromises = [];
  containerState.$watchNext$.forEach((watch) => {
    if (watchPred(watch, false)) {
      watchPromises.push(then(watch.$qrl$.$resolveLazy$(watch.$el$), () => watch));
      containerState.$watchNext$.delete(watch);
    }
  });
  do {
    containerState.$watchStaging$.forEach((watch) => {
      if (watchPred(watch, true)) {
        watchPromises.push(then(watch.$qrl$.$resolveLazy$(watch.$el$), () => watch));
      } else {
        containerState.$watchNext$.add(watch);
      }
    });
    containerState.$watchStaging$.clear();
    if (watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches);
      await Promise.all(watches.map((watch) => {
        return runSubscriber(watch, containerState);
      }));
      watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
};
const sortNodes = (elements) => {
  elements.sort((a, b) => a.compareDocumentPosition(getRootNode(b)) & 2 ? 1 : -1);
};
const sortWatches = (watches) => {
  watches.sort((a, b) => {
    if (a.$el$ === b.$el$) {
      return a.$index$ < b.$index$ ? -1 : 1;
    }
    return (a.$el$.compareDocumentPosition(getRootNode(b.$el$)) & 2) !== 0 ? 1 : -1;
  });
};
const CONTAINER_STATE = Symbol("ContainerState");
const getContainerState = (containerEl) => {
  let set = containerEl[CONTAINER_STATE];
  if (!set) {
    containerEl[CONTAINER_STATE] = set = {
      $containerEl$: containerEl,
      $proxyMap$: /* @__PURE__ */ new WeakMap(),
      $subsManager$: null,
      $platform$: getPlatform(containerEl),
      $watchNext$: /* @__PURE__ */ new Set(),
      $watchStaging$: /* @__PURE__ */ new Set(),
      $hostsNext$: /* @__PURE__ */ new Set(),
      $hostsStaging$: /* @__PURE__ */ new Set(),
      $renderPromise$: void 0,
      $hostsRendering$: void 0,
      $envData$: {},
      $elementIndex$: 0,
      $styleIds$: /* @__PURE__ */ new Set(),
      $mutableProps$: false
    };
    set.$subsManager$ = createSubscriptionManager(set);
  }
  return set;
};
const createSubscriptionManager = (containerState) => {
  const objToSubs = /* @__PURE__ */ new Map();
  const subsToObjs = /* @__PURE__ */ new Map();
  const clearSub = (sub) => {
    const subs = subsToObjs.get(sub);
    if (subs) {
      subs.forEach((s) => {
        s.delete(sub);
      });
      subsToObjs.delete(sub);
      subs.clear();
    }
  };
  const tryGetLocal = (obj) => {
    assertEqual(getProxyTarget(obj), void 0, "object can not be be a proxy", obj);
    return objToSubs.get(obj);
  };
  const trackSubToObj = (subscriber, map) => {
    let set = subsToObjs.get(subscriber);
    if (!set) {
      subsToObjs.set(subscriber, set = /* @__PURE__ */ new Set());
    }
    set.add(map);
  };
  const getLocal = (obj, initialMap) => {
    let local = tryGetLocal(obj);
    if (local) {
      assertEqual(initialMap, void 0, "subscription map can not be set to an existing object", local);
    } else {
      const map = !initialMap ? /* @__PURE__ */ new Map() : initialMap;
      map.forEach((_2, key) => {
        trackSubToObj(key, map);
      });
      objToSubs.set(obj, local = {
        $subs$: map,
        $addSub$(subscriber, key) {
          if (key == null) {
            map.set(subscriber, null);
          } else {
            let sub = map.get(subscriber);
            if (sub === void 0) {
              map.set(subscriber, sub = /* @__PURE__ */ new Set());
            }
            if (sub) {
              sub.add(key);
            }
          }
          trackSubToObj(subscriber, map);
        },
        $notifySubs$(key) {
          map.forEach((value, subscriber) => {
            if (value === null || !key || value.has(key)) {
              notifyChange(subscriber, containerState);
            }
          });
        }
      });
    }
    return local;
  };
  return {
    $tryGetLocal$: tryGetLocal,
    $getLocal$: getLocal,
    $clearSub$: clearSub
  };
};
const pauseContainer = async (elmOrDoc, defaultParentJSON) => {
  const doc = getDocument(elmOrDoc);
  const documentElement = doc.documentElement;
  const containerEl = isDocument(elmOrDoc) ? documentElement : elmOrDoc;
  if (directGetAttribute(containerEl, QContainerAttr) === "paused") {
    throw qError(QError_containerAlreadyPaused);
  }
  const parentJSON = defaultParentJSON != null ? defaultParentJSON : containerEl === doc.documentElement ? doc.body : containerEl;
  const data = await pauseFromContainer(containerEl);
  const script = doc.createElement("script");
  directSetAttribute(script, "type", "qwik/json");
  script.textContent = escapeText$1(JSON.stringify(data.state, void 0, "  "));
  parentJSON.appendChild(script);
  directSetAttribute(containerEl, QContainerAttr, "paused");
  return data;
};
const moveStyles = (containerEl, containerState) => {
  const head2 = containerEl.ownerDocument.head;
  containerEl.querySelectorAll("style[q\\:style]").forEach((el) => {
    containerState.$styleIds$.add(el.getAttribute(QStyle));
    head2.appendChild(el);
  });
};
const resumeContainer = (containerEl) => {
  if (!isContainer(containerEl)) {
    logWarn("Skipping hydration because parent element is not q:container");
    return;
  }
  const doc = getDocument(containerEl);
  const isDocElement = containerEl === doc.documentElement;
  const parentJSON = isDocElement ? doc.body : containerEl;
  const script = getQwikJSON(parentJSON);
  if (!script) {
    logWarn("Skipping hydration qwik/json metadata was not found.");
    return;
  }
  script.remove();
  const containerState = getContainerState(containerEl);
  moveStyles(containerEl, containerState);
  const meta = JSON.parse(unescapeText(script.textContent || "{}"));
  const elements = /* @__PURE__ */ new Map();
  const getObject = (id) => {
    return getObjectImpl(id, elements, meta.objs, containerState);
  };
  let maxId = 0;
  getNodesInScope(containerEl, hasQId).forEach((el) => {
    const id = directGetAttribute(el, ELEMENT_ID);
    assertDefined(id, `resume: element missed q:id`, el);
    const ctx = getContext(el);
    ctx.$id$ = id;
    ctx.$mounted$ = true;
    elements.set(ELEMENT_ID_PREFIX + id, el);
    maxId = Math.max(maxId, strToInt(id));
  });
  containerState.$elementIndex$ = ++maxId;
  const parser = createParser(getObject, containerState, doc);
  reviveValues(meta.objs, meta.subs, getObject, containerState, parser);
  for (const obj of meta.objs) {
    reviveNestedObjects(obj, getObject, parser);
  }
  Object.entries(meta.ctx).forEach(([elementID, ctxMeta]) => {
    const el = getObject(elementID);
    assertDefined(el, `resume: cant find dom node for id`, elementID);
    const ctx = getContext(el);
    const qobj = ctxMeta.r;
    const seq = ctxMeta.s;
    const host = ctxMeta.h;
    const contexts = ctxMeta.c;
    const watches = ctxMeta.w;
    if (qobj) {
      ctx.$refMap$.push(...qobj.split(" ").map((part) => getObject(part)));
    }
    if (seq) {
      ctx.$seq$ = seq.split(" ").map((part) => getObject(part));
    }
    if (watches) {
      ctx.$watches$ = watches.split(" ").map((part) => getObject(part));
    }
    if (contexts) {
      contexts.split(" ").map((part) => {
        const [key, value] = part.split("=");
        if (!ctx.$contexts$) {
          ctx.$contexts$ = /* @__PURE__ */ new Map();
        }
        ctx.$contexts$.set(key, getObject(value));
      });
    }
    if (host) {
      const [props, renderQrl] = host.split(" ");
      assertDefined(props, `resume: props missing in host metadata`, host);
      assertDefined(renderQrl, `resume: renderQRL missing in host metadata`, host);
      ctx.$props$ = getObject(props);
      ctx.$renderQrl$ = getObject(renderQrl);
    }
  });
  directSetAttribute(containerEl, QContainerAttr, "resumed");
  logDebug("Container resumed");
  emitEvent(containerEl, "qresume", void 0, true);
};
const pauseFromContainer = async (containerEl) => {
  const containerState = getContainerState(containerEl);
  const contexts = getNodesInScope(containerEl, hasQId).map(tryGetContext);
  return _pauseFromContexts(contexts, containerState);
};
const _pauseFromContexts = async (elements, containerState) => {
  const elementToIndex = /* @__PURE__ */ new Map();
  const collector = createCollector(containerState);
  const listeners = [];
  for (const ctx of elements) {
    if (ctx.$listeners$) {
      ctx.$listeners$.forEach((qrls, key) => {
        qrls.forEach((qrl) => {
          listeners.push({
            key,
            qrl,
            el: ctx.$element$
          });
        });
      });
    }
    for (const watch of ctx.$watches$) {
      collector.$watches$.push(watch);
    }
  }
  if (listeners.length === 0) {
    return {
      state: {
        ctx: {},
        objs: [],
        subs: []
      },
      objs: [],
      listeners: [],
      pendingContent: [],
      mode: "static"
    };
  }
  for (const listener of listeners) {
    assertQrl(listener.qrl);
    const captured = listener.qrl.$captureRef$;
    if (captured) {
      for (const obj of captured) {
        await collectValue(obj, collector, true);
      }
    }
    const ctx = tryGetContext(listener.el);
    for (const obj of ctx.$refMap$) {
      await collectValue(obj, collector, true);
    }
  }
  const canRender = collector.$elements$.length > 0;
  if (canRender) {
    for (const ctx of elements) {
      await collectProps(ctx.$element$, ctx.$props$, collector);
      if (ctx.$contexts$) {
        for (const item of ctx.$contexts$.values()) {
          await collectValue(item, collector, false);
        }
      }
    }
  }
  const objs = Array.from(new Set(collector.$objMap$.values()));
  const objToId = /* @__PURE__ */ new Map();
  const getElementID = (el) => {
    let id = elementToIndex.get(el);
    if (id === void 0) {
      if (el.isConnected) {
        id = getQId(el);
        if (!id) {
          console.warn("Missing ID", el);
        } else {
          id = ELEMENT_ID_PREFIX + id;
        }
      } else {
        id = null;
      }
      elementToIndex.set(el, id);
    }
    return id;
  };
  const getObjId = (obj) => {
    let suffix = "";
    if (isMutable(obj)) {
      obj = obj.v;
      suffix = "%";
    }
    if (isPromise(obj)) {
      obj = getPromiseValue(obj);
      suffix += "~";
    }
    if (isObject(obj)) {
      const target = getProxyTarget(obj);
      if (target) {
        suffix += "!";
        obj = target;
      }
      if (!target && isQwikElement(obj)) {
        const elID = getElementID(obj);
        if (elID) {
          return elID + suffix;
        }
        return null;
      }
    }
    if (collector.$objMap$.has(obj)) {
      const value = collector.$objMap$.get(obj);
      const id = objToId.get(value);
      assertTrue(typeof id === "number", "Can not find ID for object");
      return intToStr(id) + suffix;
    }
    return null;
  };
  const mustGetObjId = (obj) => {
    const key = getObjId(obj);
    if (key === null) {
      throw qError(QError_missingObjectId, obj);
    }
    return key;
  };
  const subsMap = /* @__PURE__ */ new Map();
  objs.forEach((obj) => {
    var _a2;
    const flags = getProxyFlags(containerState.$proxyMap$.get(obj));
    if (flags === void 0) {
      return;
    }
    const subsObj = [];
    if (flags > 0) {
      subsObj.push({
        subscriber: "$",
        data: flags
      });
    }
    const subs2 = (_a2 = containerState.$subsManager$.$tryGetLocal$(obj)) == null ? void 0 : _a2.$subs$;
    if (subs2) {
      subs2.forEach((set, key) => {
        if (isQwikElement(key)) {
          if (!collector.$elements$.includes(key)) {
            return;
          }
        }
        subsObj.push({
          subscriber: key,
          data: set ? Array.from(set) : null
        });
      });
    }
    if (subsObj.length > 0) {
      subsMap.set(obj, subsObj);
    }
  });
  objs.sort((a, b) => {
    const isProxyA = subsMap.has(a) ? 0 : 1;
    const isProxyB = subsMap.has(b) ? 0 : 1;
    return isProxyA - isProxyB;
  });
  let count = 0;
  for (const obj of objs) {
    objToId.set(obj, count);
    count++;
  }
  const subs = objs.map((obj) => {
    const sub = subsMap.get(obj);
    if (!sub) {
      return null;
    }
    const subsObj = {};
    sub.forEach(({ subscriber, data }) => {
      if (subscriber === "$") {
        subsObj[subscriber] = data;
      } else {
        const id = getObjId(subscriber);
        if (id !== null) {
          subsObj[id] = data;
        }
      }
    });
    return subsObj;
  }).filter(isNotNullable);
  const convertedObjs = objs.map((obj) => {
    const value = serializeValue(obj, getObjId, containerState);
    if (value !== void 0) {
      return value;
    }
    switch (typeof obj) {
      case "object":
        if (obj === null) {
          return null;
        }
        if (isArray(obj)) {
          return obj.map(mustGetObjId);
        }
        if (isSerializableObject(obj)) {
          const output = {};
          Object.entries(obj).forEach(([key, value2]) => {
            output[key] = mustGetObjId(value2);
          });
          return output;
        }
        break;
      case "string":
      case "number":
      case "boolean":
        return obj;
    }
    throw qError(QError_verifySerializable, obj);
  });
  const meta = {};
  elements.forEach((ctx) => {
    const node = ctx.$element$;
    assertDefined(ctx, `pause: missing context for dom node`, node);
    const ref = ctx.$refMap$;
    const props = ctx.$props$;
    const contexts = ctx.$contexts$;
    const watches = ctx.$watches$;
    const renderQrl = ctx.$renderQrl$;
    const seq = ctx.$seq$;
    const metaValue = {};
    const elementCaptured = collector.$elements$.includes(node);
    let add = false;
    if (ref.length > 0) {
      const value = ref.map(mustGetObjId).join(" ");
      if (value) {
        metaValue.r = value;
        add = true;
      }
    }
    if (canRender) {
      if (elementCaptured && props) {
        const objs2 = [props];
        if (renderQrl) {
          objs2.push(renderQrl);
        }
        const value = objs2.map(mustGetObjId).join(" ");
        if (value) {
          metaValue.h = value;
          add = true;
        }
      }
      if (watches.length > 0) {
        const value = watches.map(getObjId).filter(isNotNullable).join(" ");
        if (value) {
          metaValue.w = value;
          add = true;
        }
      }
      if (elementCaptured && seq.length > 0) {
        const value = seq.map(mustGetObjId).join(" ");
        if (value) {
          metaValue.s = value;
          add = true;
        }
      }
      if (contexts) {
        const serializedContexts = [];
        contexts.forEach((value2, key) => {
          serializedContexts.push(`${key}=${mustGetObjId(value2)}`);
        });
        const value = serializedContexts.join(" ");
        if (value) {
          metaValue.c = value;
          add = true;
        }
      }
    }
    if (add) {
      const elementID = getElementID(node);
      assertDefined(elementID, `pause: can not generate ID for dom node`, node);
      meta[elementID] = metaValue;
    }
  });
  const pendingContent = [];
  for (const watch of collector.$watches$) {
    {
      if (watch.$flags$ & WatchFlagsIsDirty) {
        logWarn("Serializing dirty watch. Looks like an internal error.");
      }
      if (!isConnected(watch)) {
        logWarn("Serializing disconneted watch. Looks like an internal error.");
      }
    }
    destroyWatch(watch);
  }
  {
    elementToIndex.forEach((value, el) => {
      if (!value) {
        logWarn("unconnected element", el.nodeName, "\n");
      }
    });
  }
  return {
    state: {
      ctx: meta,
      objs: convertedObjs,
      subs
    },
    pendingContent,
    objs,
    listeners,
    mode: canRender ? "render" : "listeners"
  };
};
const getQwikJSON = (parentElm) => {
  let child = parentElm.lastElementChild;
  while (child) {
    if (child.tagName === "SCRIPT" && directGetAttribute(child, "type") === "qwik/json") {
      return child;
    }
    child = child.previousElementSibling;
  }
  return void 0;
};
const SHOW_ELEMENT = 1;
const SHOW_COMMENT = 128;
const FILTER_ACCEPT = 1;
const FILTER_REJECT = 2;
const FILTER_SKIP = 3;
const getNodesInScope = (parent, predicate) => {
  if (predicate(parent))
    ;
  const walker = parent.ownerDocument.createTreeWalker(parent, SHOW_ELEMENT | SHOW_COMMENT, {
    acceptNode(node) {
      if (isContainer(node)) {
        return FILTER_REJECT;
      }
      return predicate(node) ? FILTER_ACCEPT : FILTER_SKIP;
    }
  });
  const pars = [];
  let currentNode = null;
  while (currentNode = walker.nextNode()) {
    pars.push(processVirtualNodes(currentNode));
  }
  return pars;
};
const reviveValues = (objs, subs, getObject, containerState, parser) => {
  for (let i = 0; i < objs.length; i++) {
    const value = objs[i];
    if (isString(value)) {
      objs[i] = parser.prepare(value);
    }
  }
  for (let i = 0; i < subs.length; i++) {
    const value = objs[i];
    const sub = subs[i];
    if (sub) {
      const converted = /* @__PURE__ */ new Map();
      let flags = 0;
      Object.entries(sub).forEach((entry) => {
        if (entry[0] === "$") {
          flags = entry[1];
          return;
        }
        const el = getObject(entry[0]);
        if (!el) {
          logWarn("QWIK can not revive subscriptions because of missing element ID", entry, value);
          return;
        }
        const set = entry[1] === null ? null : new Set(entry[1]);
        converted.set(el, set);
      });
      createProxy(value, containerState, flags, converted);
    }
  }
};
const reviveNestedObjects = (obj, getObject, parser) => {
  if (parser.fill(obj)) {
    return;
  }
  if (obj && typeof obj == "object") {
    if (isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const value = obj[i];
        if (typeof value == "string") {
          obj[i] = getObject(value);
        } else {
          reviveNestedObjects(value, getObject, parser);
        }
      }
    } else if (isSerializableObject(obj)) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value == "string") {
            obj[key] = getObject(value);
          } else {
            reviveNestedObjects(value, getObject, parser);
          }
        }
      }
    }
  }
};
const OBJECT_TRANSFORMS = {
  "!": (obj, containerState) => {
    var _a2;
    return (_a2 = containerState.$proxyMap$.get(obj)) != null ? _a2 : getOrCreateProxy(obj, containerState);
  },
  "%": (obj) => {
    return mutable(obj);
  },
  "~": (obj) => {
    return Promise.resolve(obj);
  }
};
const getObjectImpl = (id, elements, objs, containerState) => {
  if (id.startsWith(ELEMENT_ID_PREFIX)) {
    assertTrue(elements.has(id), `missing element for id:`, id);
    return elements.get(id);
  }
  const index2 = strToInt(id);
  assertTrue(objs.length > index2, "resume: index is out of bounds", id);
  let obj = objs[index2];
  for (let i = id.length - 1; i >= 0; i--) {
    const code = id[i];
    const transform = OBJECT_TRANSFORMS[code];
    if (!transform) {
      break;
    }
    obj = transform(obj, containerState);
  }
  return obj;
};
const collectProps = async (el, props, collector) => {
  var _a2;
  const subs = (_a2 = collector.$containerState$.$subsManager$.$tryGetLocal$(getProxyTarget(props))) == null ? void 0 : _a2.$subs$;
  if (subs && subs.has(el)) {
    await collectElement(el, collector);
  }
};
const createCollector = (containerState) => {
  return {
    $seen$: /* @__PURE__ */ new Set(),
    $seenLeaks$: /* @__PURE__ */ new Set(),
    $objMap$: /* @__PURE__ */ new Map(),
    $elements$: [],
    $watches$: [],
    $containerState$: containerState
  };
};
const collectElement = async (el, collector) => {
  if (collector.$elements$.includes(el)) {
    return;
  }
  const ctx = tryGetContext(el);
  if (ctx) {
    collector.$elements$.push(el);
    if (ctx.$props$) {
      await collectValue(ctx.$props$, collector, false);
    }
    if (ctx.$renderQrl$) {
      await collectValue(ctx.$renderQrl$, collector, false);
    }
    for (const obj of ctx.$seq$) {
      await collectValue(obj, collector, false);
    }
    for (const obj of ctx.$watches$) {
      await collectValue(obj, collector, false);
    }
    if (ctx.$contexts$) {
      for (const obj of ctx.$contexts$.values()) {
        await collectValue(obj, collector, false);
      }
    }
  }
};
const escapeText$1 = (str) => {
  return str.replace(/<(\/?script)/g, "\\x3C$1");
};
const unescapeText = (str) => {
  return str.replace(/\\x3C(\/?script)/g, "<$1");
};
const collectSubscriptions = async (target, collector) => {
  var _a2;
  const subs = (_a2 = collector.$containerState$.$subsManager$.$tryGetLocal$(target)) == null ? void 0 : _a2.$subs$;
  if (subs) {
    if (collector.$seen$.has(subs)) {
      return;
    }
    collector.$seen$.add(subs);
    for (const key of Array.from(subs.keys())) {
      if (isVirtualElement(key)) {
        await collectElement(key, collector);
      } else {
        await collectValue(key, collector, true);
      }
    }
  }
};
const PROMISE_VALUE = Symbol();
const resolvePromise = (promise) => {
  return promise.then((value) => {
    promise[PROMISE_VALUE] = value;
    return value;
  });
};
const getPromiseValue = (promise) => {
  assertTrue(PROMISE_VALUE in promise, "pause: promise was not resolved previously", promise);
  return promise[PROMISE_VALUE];
};
const collectValue = async (obj, collector, leaks) => {
  const input = obj;
  const seen = leaks ? collector.$seenLeaks$ : collector.$seen$;
  if (seen.has(obj)) {
    return;
  }
  seen.add(obj);
  if (!shouldSerialize(obj) || obj === void 0) {
    collector.$objMap$.set(obj, void 0);
    return;
  }
  if (obj != null) {
    if (isQrl$1(obj)) {
      collector.$objMap$.set(obj, obj);
      if (obj.$captureRef$) {
        for (const item of obj.$captureRef$) {
          await collectValue(item, collector, leaks);
        }
      }
      return;
    }
    if (typeof obj === "object") {
      if (isPromise(obj)) {
        const resolved = await resolvePromise(obj);
        await collectValue(resolved, collector, leaks);
        return;
      }
      const target = getProxyTarget(obj);
      if (!target && isNode(obj)) {
        if (isDocument(obj)) {
          collector.$objMap$.set(obj, obj);
        } else if (!isQwikElement(obj)) {
          throw qError(QError_verifySerializable, obj);
        }
        return;
      }
      if (target) {
        if (leaks) {
          await collectSubscriptions(target, collector);
        }
        obj = target;
        if (seen.has(obj)) {
          return;
        }
        seen.add(obj);
        if (isResourceReturn(obj)) {
          collector.$objMap$.set(target, target);
          await collectValue(obj.promise, collector, leaks);
          await collectValue(obj.resolved, collector, leaks);
          return;
        }
      }
      collector.$objMap$.set(obj, obj);
      if (isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          await collectValue(input[i], collector, leaks);
        }
      } else {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            await collectValue(input[key], collector, leaks);
          }
        }
      }
      return;
    }
  }
  collector.$objMap$.set(obj, obj);
};
const isContainer = (el) => {
  return isElement(el) && el.hasAttribute(QContainerAttr);
};
const hasQId = (el) => {
  const node = processVirtualNodes(el);
  if (isQwikElement(node)) {
    return node.hasAttribute(ELEMENT_ID);
  }
  return false;
};
const intToStr = (nu) => {
  return nu.toString(36);
};
const strToInt = (nu) => {
  return parseInt(nu, 36);
};
const WatchFlagsIsEffect = 1 << 0;
const WatchFlagsIsWatch = 1 << 1;
const WatchFlagsIsDirty = 1 << 2;
const WatchFlagsIsCleanup = 1 << 3;
const WatchFlagsIsResource = 1 << 4;
const useWatchQrl = (qrl, opts) => {
  const { get, set, ctx, i } = useSequentialScope();
  if (!get) {
    assertQrl(qrl);
    const el = ctx.$hostElement$;
    const containerState = ctx.$renderCtx$.$containerState$;
    const watch = new Watch(WatchFlagsIsDirty | WatchFlagsIsWatch, i, el, qrl, void 0);
    set(true);
    getContext(el).$watches$.push(watch);
    const previousWait = ctx.$waitOn$.slice();
    ctx.$waitOn$.push(Promise.all(previousWait).then(() => runSubscriber(watch, containerState)));
    const isServer2 = containerState.$platform$.isServer;
    if (isServer2) {
      useRunWatch(watch, opts == null ? void 0 : opts.eagerness);
    }
  }
};
const useClientEffectQrl = (qrl, opts) => {
  var _a2;
  const { get, set, i, ctx } = useSequentialScope();
  if (!get) {
    assertQrl(qrl);
    const el = ctx.$hostElement$;
    const watch = new Watch(WatchFlagsIsEffect, i, el, qrl, void 0);
    set(true);
    getContext(el).$watches$.push(watch);
    useRunWatch(watch, (_a2 = opts == null ? void 0 : opts.eagerness) != null ? _a2 : "visible");
    const doc = ctx.$doc$;
    if (doc["qO"]) {
      doc["qO"].observe(el);
    }
  }
};
const isResourceWatch = (watch) => {
  return !!watch.$resource$;
};
const runSubscriber = async (watch, containerState) => {
  assertEqual(!!(watch.$flags$ & WatchFlagsIsDirty), true, "Resource is not dirty", watch);
  if (isResourceWatch(watch)) {
    await runResource(watch, containerState);
  } else {
    await runWatch(watch, containerState);
  }
};
const runResource = (watch, containerState, waitOn) => {
  watch.$flags$ &= ~WatchFlagsIsDirty;
  cleanupWatch(watch);
  const el = watch.$el$;
  const doc = getDocument(el);
  const invokationContext = newInvokeContext(doc, el, void 0, "WatchEvent");
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.$invokeFn$(el, invokationContext, () => {
    subsManager.$clearSub$(watch);
  });
  const cleanups = [];
  const resource = watch.$resource$;
  assertDefined(resource, 'useResource: when running a resource, "watch.r" must be a defined.', watch);
  const track = (obj, prop) => {
    const target = getProxyTarget(obj);
    if (target) {
      const manager = subsManager.$getLocal$(target);
      manager.$addSub$(watch, prop);
    } else {
      logErrorAndStop(codeToText(QError_trackUseStore), obj);
    }
    if (prop) {
      return obj[prop];
    } else {
      return obj;
    }
  };
  const resourceTarget = unwrapProxy(resource);
  const opts = {
    track,
    cleanup(callback) {
      cleanups.push(callback);
    },
    previous: resourceTarget.resolved
  };
  let resolve;
  let reject;
  useInvoke(invokationContext, () => {
    resource.state = "pending";
    resource.resolved = void 0;
    resource.promise = new Promise((r, re) => {
      resolve = r;
      reject = re;
    });
  });
  watch.$destroy$ = noSerialize(() => {
    cleanups.forEach((fn) => fn());
    reject("cancelled");
  });
  let done = false;
  const promise = safeCall(() => then(waitOn, () => watchFn(opts)), (value) => {
    if (!done) {
      done = true;
      resource.state = "resolved";
      resource.resolved = value;
      resource.error = void 0;
      resolve(value);
    }
    return;
  }, (reason) => {
    if (!done) {
      done = true;
      resource.state = "rejected";
      resource.resolved = void 0;
      resource.error = noSerialize(reason);
      reject(reason);
    }
    return;
  });
  const timeout = resourceTarget.timeout;
  if (timeout) {
    return Promise.race([
      promise,
      delay(timeout).then(() => {
        if (!done) {
          done = true;
          resource.state = "rejected";
          resource.resolved = void 0;
          resource.error = "timeout";
          cleanupWatch(watch);
          reject("timeout");
        }
      })
    ]);
  }
  return promise;
};
const runWatch = (watch, containerState) => {
  watch.$flags$ &= ~WatchFlagsIsDirty;
  cleanupWatch(watch);
  const el = watch.$el$;
  const doc = getDocument(el);
  const invokationContext = newInvokeContext(doc, el, void 0, "WatchEvent");
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.$invokeFn$(el, invokationContext, () => {
    subsManager.$clearSub$(watch);
  });
  const track = (obj, prop) => {
    const target = getProxyTarget(obj);
    if (target) {
      const manager = subsManager.$getLocal$(target);
      manager.$addSub$(watch, prop);
    } else {
      logErrorAndStop(codeToText(QError_trackUseStore), obj);
    }
    if (prop) {
      return obj[prop];
    } else {
      return obj;
    }
  };
  const cleanups = [];
  watch.$destroy$ = noSerialize(() => {
    cleanups.forEach((fn) => fn());
  });
  const opts = {
    track,
    cleanup(callback) {
      cleanups.push(callback);
    }
  };
  return safeCall(() => watchFn(opts), (returnValue) => {
    if (isFunction(returnValue)) {
      cleanups.push(returnValue);
    }
  }, (reason) => {
    logError(reason);
  });
};
const cleanupWatch = (watch) => {
  const destroy = watch.$destroy$;
  if (destroy) {
    watch.$destroy$ = void 0;
    try {
      destroy();
    } catch (err) {
      logError(err);
    }
  }
};
const destroyWatch = (watch) => {
  if (watch.$flags$ & WatchFlagsIsCleanup) {
    watch.$flags$ &= ~WatchFlagsIsCleanup;
    const cleanup = watch.$qrl$.$invokeFn$(watch.$el$);
    cleanup();
  } else {
    cleanupWatch(watch);
  }
};
const useRunWatch = (watch, eagerness) => {
  if (eagerness === "load") {
    useOn("qinit", getWatchHandlerQrl(watch));
  } else if (eagerness === "visible") {
    useOn("qvisible", getWatchHandlerQrl(watch));
  }
};
const getWatchHandlerQrl = (watch) => {
  const watchQrl = watch.$qrl$;
  const watchHandler = createQRL(watchQrl.$chunk$, "_hW", _hW, null, null, [watch], watchQrl.$symbol$);
  return watchHandler;
};
const isSubscriberDescriptor = (obj) => {
  return isObject(obj) && obj instanceof Watch;
};
const serializeWatch = (watch, getObjId) => {
  let value = `${intToStr(watch.$flags$)} ${intToStr(watch.$index$)} ${getObjId(watch.$qrl$)} ${getObjId(watch.$el$)}`;
  if (isResourceWatch(watch)) {
    value += ` ${getObjId(watch.$resource$)}`;
  }
  return value;
};
const parseWatch = (data) => {
  const [flags, index2, qrl, el, resource] = data.split(" ");
  return new Watch(strToInt(flags), strToInt(index2), el, qrl, resource);
};
class Watch {
  constructor($flags$, $index$, $el$, $qrl$, $resource$) {
    this.$flags$ = $flags$;
    this.$index$ = $index$;
    this.$el$ = $el$;
    this.$qrl$ = $qrl$;
    this.$resource$ = $resource$;
  }
}
const useResourceQrl = (qrl, opts) => {
  const { get, set, i, ctx } = useSequentialScope();
  if (get != null) {
    return get;
  }
  assertQrl(qrl);
  const containerState = ctx.$renderCtx$.$containerState$;
  const resource = createResourceReturn(containerState, opts);
  const el = ctx.$hostElement$;
  const watch = new Watch(WatchFlagsIsDirty | WatchFlagsIsResource, i, el, qrl, resource);
  const previousWait = Promise.all(ctx.$waitOn$.slice());
  runResource(watch, containerState, previousWait);
  getContext(el).$watches$.push(watch);
  set(resource);
  return resource;
};
const Resource = (props) => {
  const isBrowser2 = !useIsServer();
  if (isBrowser2) {
    if (props.onRejected) {
      props.resource.promise.catch(() => {
      });
      if (props.resource.state === "rejected") {
        return props.onRejected(props.resource.error);
      }
    }
    if (props.onPending) {
      const state = props.resource.state;
      if (state === "pending") {
        return props.onPending();
      } else if (state === "resolved") {
        return props.onResolved(props.resource.resolved);
      }
    }
  }
  const promise = props.resource.promise.then(props.onResolved, props.onRejected);
  return jsx(Fragment, {
    children: promise
  });
};
const _createResourceReturn = (opts) => {
  const resource = {
    __brand: "resource",
    promise: void 0,
    resolved: void 0,
    error: void 0,
    state: "pending",
    timeout: opts == null ? void 0 : opts.timeout
  };
  return resource;
};
const createResourceReturn = (containerState, opts, initialPromise) => {
  const result = _createResourceReturn(opts);
  result.promise = initialPromise;
  const resource = createProxy(result, containerState, 0, void 0);
  return resource;
};
const useIsServer = () => {
  const ctx = getInvokeContext();
  assertDefined(ctx.$doc$, "doc must be defined", ctx);
  return isServer(ctx.$doc$);
};
const isResourceReturn = (obj) => {
  return isObject(obj) && obj.__brand === "resource";
};
const serializeResource = (resource, getObjId) => {
  const state = resource.state;
  if (state === "resolved") {
    return `0 ${getObjId(resource.resolved)}`;
  } else if (state === "pending") {
    return `1`;
  } else {
    return `2`;
  }
};
const parseResourceReturn = (data) => {
  const [first, id] = data.split(" ");
  const result = _createResourceReturn(void 0);
  result.promise = Promise.resolve();
  if (first === "0") {
    result.state = "resolved";
    result.resolved = id;
  } else if (first === "1") {
    result.state = "pending";
    result.promise = new Promise(() => {
    });
  } else if (first === "2") {
    result.state = "rejected";
    result.promise = Promise.reject();
  }
  return result;
};
const UndefinedSerializer = {
  test: (obj) => obj === void 0,
  prepare: () => void 0
};
const QRLSerializer = {
  test: (v) => isQrl$1(v),
  serialize: (obj, getObjId, containerState) => {
    return stringifyQRL(obj, {
      $platform$: containerState.$platform$,
      $getObjId$: getObjId
    });
  },
  prepare: (data, containerState) => {
    return parseQRL(data, containerState.$containerEl$);
  },
  fill: (qrl, getObject) => {
    if (qrl.$capture$ && qrl.$capture$.length > 0) {
      qrl.$captureRef$ = qrl.$capture$.map(getObject);
      qrl.$capture$ = null;
    }
  }
};
const DocumentSerializer = {
  test: (v) => isDocument(v),
  prepare: (_2, _c, doc) => {
    return doc;
  }
};
const ResourceSerializer = {
  test: (v) => isResourceReturn(v),
  serialize: (obj, getObjId) => {
    return serializeResource(obj, getObjId);
  },
  prepare: (data) => {
    return parseResourceReturn(data);
  },
  fill: (resource, getObject) => {
    if (resource.state === "resolved") {
      resource.resolved = getObject(resource.resolved);
      resource.promise = Promise.resolve(resource.resolved);
    }
  }
};
const WatchSerializer = {
  test: (v) => isSubscriberDescriptor(v),
  serialize: (obj, getObjId) => serializeWatch(obj, getObjId),
  prepare: (data) => parseWatch(data),
  fill: (watch, getObject) => {
    watch.$el$ = getObject(watch.$el$);
    watch.$qrl$ = getObject(watch.$qrl$);
    if (watch.$resource$) {
      watch.$resource$ = getObject(watch.$resource$);
    }
  }
};
const URLSerializer = {
  test: (v) => v instanceof URL,
  serialize: (obj) => obj.href,
  prepare: (data) => new URL(data)
};
const DateSerializer = {
  test: (v) => v instanceof Date,
  serialize: (obj) => obj.toISOString(),
  prepare: (data) => new Date(data)
};
const RegexSerializer = {
  test: (v) => v instanceof RegExp,
  serialize: (obj) => `${obj.flags} ${obj.source}`,
  prepare: (data) => {
    const space = data.indexOf(" ");
    const source = data.slice(space + 1);
    const flags = data.slice(0, space);
    return new RegExp(source, flags);
  }
};
const SERIALIZABLE_STATE = Symbol("serializable-data");
const ComponentSerializer = {
  test: (obj) => isQwikComponent(obj),
  serialize: (obj, getObjId, containerState) => {
    const [qrl] = obj[SERIALIZABLE_STATE];
    return stringifyQRL(qrl, {
      $platform$: containerState.$platform$,
      $getObjId$: getObjId
    });
  },
  prepare: (data, containerState) => {
    const optionsIndex = data.indexOf("{");
    const qrlString = optionsIndex == -1 ? data : data.slice(0, optionsIndex);
    const qrl = parseQRL(qrlString, containerState.$containerEl$);
    return componentQrl(qrl);
  },
  fill: (component, getObject) => {
    const [qrl] = component[SERIALIZABLE_STATE];
    if (qrl.$capture$ && qrl.$capture$.length > 0) {
      qrl.$captureRef$ = qrl.$capture$.map(getObject);
      qrl.$capture$ = null;
    }
  }
};
const PureFunctionSerializer = {
  test: (obj) => typeof obj === "function" && obj.__qwik_serializable__ !== void 0,
  serialize: (obj) => {
    return obj.toString();
  },
  prepare: (data) => {
    const fn = new Function("return " + data)();
    fn.__qwik_serializable__ = true;
    return fn;
  },
  fill: void 0
};
const serializers = [
  UndefinedSerializer,
  QRLSerializer,
  DocumentSerializer,
  ResourceSerializer,
  WatchSerializer,
  URLSerializer,
  RegexSerializer,
  DateSerializer,
  ComponentSerializer,
  PureFunctionSerializer
];
const canSerialize = (obj) => {
  for (const s of serializers) {
    if (s.test(obj)) {
      return true;
    }
  }
  return false;
};
const serializeValue = (obj, getObjID, containerState) => {
  for (let i = 0; i < serializers.length; i++) {
    const s = serializers[i];
    if (s.test(obj)) {
      let value = String.fromCharCode(i);
      if (s.serialize) {
        value += s.serialize(obj, getObjID, containerState);
      }
      return value;
    }
  }
  return void 0;
};
const createParser = (getObject, containerState, doc) => {
  const map = /* @__PURE__ */ new Map();
  return {
    prepare(data) {
      for (let i = 0; i < serializers.length; i++) {
        const s = serializers[i];
        const prefix = String.fromCodePoint(i);
        if (data.startsWith(prefix)) {
          const value = s.prepare(data.slice(prefix.length), containerState, doc);
          if (s.fill) {
            map.set(value, s);
          }
          return value;
        }
      }
      return data;
    },
    fill(obj) {
      const serializer = map.get(obj);
      if (serializer) {
        serializer.fill(obj, getObject, containerState);
        return true;
      }
      return false;
    }
  };
};
const QObjectRecursive = 1 << 0;
const QObjectImmutable = 1 << 1;
const getOrCreateProxy = (target, containerState, flags = 0) => {
  const proxy = containerState.$proxyMap$.get(target);
  if (proxy) {
    return proxy;
  }
  return createProxy(target, containerState, flags, void 0);
};
const createProxy = (target, containerState, flags, subs) => {
  assertEqual(unwrapProxy(target), target, "Unexpected proxy at this location", target);
  assertTrue(!containerState.$proxyMap$.has(target), "Proxy was already created", target);
  if (!isObject(target)) {
    throw qError(QError_onlyObjectWrapped, target);
  }
  if (target.constructor !== Object && !isArray(target)) {
    throw qError(QError_onlyLiteralWrapped, target);
  }
  const manager = containerState.$subsManager$.$getLocal$(target, subs);
  const proxy = new Proxy(target, new ReadWriteProxyHandler(containerState, manager, flags));
  containerState.$proxyMap$.set(target, proxy);
  return proxy;
};
const QOjectTargetSymbol = Symbol();
const QOjectFlagsSymbol = Symbol();
class ReadWriteProxyHandler {
  constructor($containerState$, $manager$, $flags$) {
    this.$containerState$ = $containerState$;
    this.$manager$ = $manager$;
    this.$flags$ = $flags$;
  }
  get(target, prop) {
    if (typeof prop === "symbol") {
      if (prop === QOjectTargetSymbol)
        return target;
      if (prop === QOjectFlagsSymbol)
        return this.$flags$;
      return target[prop];
    }
    let subscriber;
    const invokeCtx = tryGetInvokeContext();
    const recursive = (this.$flags$ & QObjectRecursive) !== 0;
    const immutable = (this.$flags$ & QObjectImmutable) !== 0;
    if (invokeCtx) {
      subscriber = invokeCtx.$subscriber$;
    }
    let value = target[prop];
    if (isMutable(value)) {
      value = value.v;
    } else if (immutable) {
      subscriber = null;
    }
    if (subscriber) {
      const isA = isArray(target);
      this.$manager$.$addSub$(subscriber, isA ? void 0 : prop);
    }
    return recursive ? wrap(value, this.$containerState$) : value;
  }
  set(target, prop, newValue) {
    if (typeof prop === "symbol") {
      target[prop] = newValue;
      return true;
    }
    const immutable = (this.$flags$ & QObjectImmutable) !== 0;
    if (immutable) {
      throw qError(QError_immutableProps);
    }
    const recursive = (this.$flags$ & QObjectRecursive) !== 0;
    const unwrappedNewValue = recursive ? unwrapProxy(newValue) : newValue;
    {
      verifySerializable(unwrappedNewValue);
      const invokeCtx = tryGetInvokeContext();
      if (invokeCtx && invokeCtx.$event$ === RenderEvent) {
        logWarn("State mutation inside render function. Move mutation to useWatch(), useClientEffect() or useServerMount()", invokeCtx.$hostElement$, prop);
      }
    }
    const isA = isArray(target);
    if (isA) {
      target[prop] = unwrappedNewValue;
      this.$manager$.$notifySubs$();
      return true;
    }
    const oldValue = target[prop];
    if (oldValue !== unwrappedNewValue) {
      target[prop] = unwrappedNewValue;
      this.$manager$.$notifySubs$(prop);
    }
    return true;
  }
  has(target, property) {
    if (property === QOjectTargetSymbol)
      return true;
    if (property === QOjectFlagsSymbol)
      return true;
    return Object.prototype.hasOwnProperty.call(target, property);
  }
  ownKeys(target) {
    let subscriber = null;
    const invokeCtx = tryGetInvokeContext();
    if (invokeCtx) {
      subscriber = invokeCtx.$subscriber$;
    }
    if (subscriber) {
      this.$manager$.$addSub$(subscriber);
    }
    return Object.getOwnPropertyNames(target);
  }
}
const wrap = (value, containerState) => {
  if (isQrl$1(value)) {
    return value;
  }
  if (isObject(value)) {
    if (Object.isFrozen(value)) {
      return value;
    }
    const nakedValue = unwrapProxy(value);
    if (nakedValue !== value) {
      return value;
    }
    if (isNode(nakedValue)) {
      return value;
    }
    if (!shouldSerialize(nakedValue)) {
      return value;
    }
    {
      verifySerializable(value);
    }
    const proxy = containerState.$proxyMap$.get(value);
    return proxy ? proxy : getOrCreateProxy(value, containerState, QObjectRecursive);
  } else {
    return value;
  }
};
const verifySerializable = (value) => {
  const seen = /* @__PURE__ */ new Set();
  return _verifySerializable(value, seen);
};
const _verifySerializable = (value, seen) => {
  const unwrapped = unwrapProxy(value);
  if (unwrapped == null) {
    return value;
  }
  if (shouldSerialize(unwrapped)) {
    if (seen.has(unwrapped)) {
      return value;
    }
    seen.add(unwrapped);
    if (canSerialize(unwrapped)) {
      return value;
    }
    switch (typeof unwrapped) {
      case "object":
        if (isPromise(unwrapped))
          return value;
        if (isQwikElement(unwrapped))
          return value;
        if (isDocument(unwrapped))
          return value;
        if (isArray(unwrapped)) {
          for (const item of unwrapped) {
            _verifySerializable(item, seen);
          }
          return value;
        }
        if (isSerializableObject(unwrapped)) {
          for (const item of Object.values(unwrapped)) {
            _verifySerializable(item, seen);
          }
          return value;
        }
        break;
      case "boolean":
      case "string":
      case "number":
        return value;
    }
    throw qError(QError_verifySerializable, unwrapped);
  }
  return value;
};
const noSerializeSet = /* @__PURE__ */ new WeakSet();
const shouldSerialize = (obj) => {
  if (isObject(obj) || isFunction(obj)) {
    return !noSerializeSet.has(obj);
  }
  return true;
};
const noSerialize = (input) => {
  if (input != null) {
    noSerializeSet.add(input);
  }
  return input;
};
const mutable = (v) => {
  return {
    [MUTABLE]: true,
    v
  };
};
const isConnected = (sub) => {
  if (isQwikElement(sub)) {
    return !!tryGetContext(sub) || sub.isConnected;
  } else {
    return isConnected(sub.$el$);
  }
};
const MUTABLE = Symbol("mutable");
const isMutable = (v) => {
  return isObject(v) && v[MUTABLE] === true;
};
const unwrapProxy = (proxy) => {
  var _a2;
  return (_a2 = getProxyTarget(proxy)) != null ? _a2 : proxy;
};
const getProxyTarget = (obj) => {
  if (isObject(obj)) {
    return obj[QOjectTargetSymbol];
  }
  return void 0;
};
const getProxyFlags = (obj) => {
  if (isObject(obj)) {
    return obj[QOjectFlagsSymbol];
  }
  return void 0;
};
const Q_CTX = "__ctx__";
const resumeIfNeeded = (containerEl) => {
  const isResumed = directGetAttribute(containerEl, QContainerAttr);
  if (isResumed === "paused") {
    resumeContainer(containerEl);
    {
      appendQwikDevTools(containerEl);
    }
  }
};
const appendQwikDevTools = (containerEl) => {
  containerEl["qwik"] = {
    pause: () => pauseContainer(containerEl),
    state: getContainerState(containerEl)
  };
};
const tryGetContext = (element) => {
  return element[Q_CTX];
};
const getContext = (element) => {
  let ctx = tryGetContext(element);
  if (!ctx) {
    element[Q_CTX] = ctx = {
      $dirty$: false,
      $mounted$: false,
      $id$: "",
      $element$: element,
      $cache$: null,
      $refMap$: [],
      $seq$: [],
      $watches$: [],
      $scopeIds$: null,
      $appendStyles$: null,
      $props$: null,
      $renderQrl$: null,
      $component$: null,
      $listeners$: null,
      $contexts$: null
    };
  }
  return ctx;
};
const cleanupContext = (ctx, subsManager) => {
  const el = ctx.$element$;
  ctx.$watches$.forEach((watch) => {
    subsManager.$clearSub$(watch);
    destroyWatch(watch);
  });
  if (ctx.$renderQrl$) {
    subsManager.$clearSub$(el);
  }
  ctx.$component$ = null;
  ctx.$renderQrl$ = null;
  ctx.$seq$.length = 0;
  ctx.$watches$.length = 0;
  ctx.$dirty$ = false;
  el[Q_CTX] = void 0;
};
const PREFIXES = ["document:on", "window:on", "on"];
const SCOPED = ["on-document", "on-window", "on"];
const normalizeOnProp = (prop) => {
  let scope = "on";
  for (let i = 0; i < PREFIXES.length; i++) {
    const prefix = PREFIXES[i];
    if (prop.startsWith(prefix)) {
      scope = SCOPED[i];
      prop = prop.slice(prefix.length);
    }
  }
  if (prop.startsWith("-")) {
    prop = prop.slice(1);
  } else {
    prop = prop.toLowerCase();
  }
  return `${scope}:${prop}`;
};
const createProps = (target, containerState) => {
  return createProxy(target, containerState, QObjectImmutable);
};
const getPropsMutator = (ctx, containerState) => {
  let props = ctx.$props$;
  if (!ctx.$props$) {
    ctx.$props$ = props = createProps({}, containerState);
  }
  const target = getProxyTarget(props);
  assertDefined(target, `props have to be a proxy, but it is not`, props);
  const manager = containerState.$subsManager$.$getLocal$(target);
  return {
    set(prop, value) {
      var _a2, _b;
      const didSet = prop in target;
      let oldValue = target[prop];
      let mut = false;
      if (isMutable(oldValue)) {
        oldValue = oldValue.v;
      }
      if (containerState.$mutableProps$) {
        mut = true;
        if (isMutable(value)) {
          value = value.v;
          target[prop] = value;
        } else {
          target[prop] = mutable(value);
        }
      } else {
        target[prop] = value;
        if (isMutable(value)) {
          value = value.v;
          mut = true;
        }
      }
      if (oldValue !== value) {
        {
          if (didSet && !mut && !isQrl$1(value)) {
            const displayName = (_b = (_a2 = ctx.$renderQrl$) == null ? void 0 : _a2.getSymbol()) != null ? _b : ctx.$element$.localName;
            logError(codeToText(QError_immutableJsxProps), `If you need to change a value of a passed in prop, please wrap the prop with "mutable()" <${displayName} ${prop}={mutable(...)}>`, "\n - Component:", displayName, "\n - Prop:", prop, "\n - Old value:", oldValue, "\n - New value:", value);
          }
        }
        manager.$notifySubs$(prop);
      }
    }
  };
};
const STYLE = `background: #564CE0; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`;
const logError = (message, ...optionalParams) => {
  const err = message instanceof Error ? message : new Error(message);
  console.error("%cQWIK ERROR", STYLE, err.message, ...printParams(optionalParams), err.stack);
  return err;
};
const logErrorAndStop = (message, ...optionalParams) => {
  const err = logError(message, ...optionalParams);
  debugger;
  return err;
};
const logWarn = (message, ...optionalParams) => {
  {
    console.warn("%cQWIK WARN", STYLE, message, ...printParams(optionalParams));
  }
};
const logDebug = (message, ...optionalParams) => {
  {
    console.debug("%cQWIK", STYLE, message, ...printParams(optionalParams));
  }
};
const printParams = (optionalParams) => {
  {
    return optionalParams.map((p) => {
      if (isElement(p)) {
        return printElement(p);
      }
      return p;
    });
  }
};
const printElement = (el) => {
  var _a2;
  const ctx = tryGetContext(el);
  const isServer2 = /* @__PURE__ */ (() => typeof process !== "undefined" && !!process.versions && !!process.versions.node)();
  return {
    tagName: el.tagName,
    renderQRL: (_a2 = ctx == null ? void 0 : ctx.$renderQrl$) == null ? void 0 : _a2.getSymbol(),
    element: isServer2 ? void 0 : el,
    ctx: isServer2 ? void 0 : ctx
  };
};
const QError_stringifyClassOrStyle = 0;
const QError_runtimeQrlNoElement = 2;
const QError_verifySerializable = 3;
const QError_errorWhileRendering = 4;
const QError_setProperty = 6;
const QError_onlyObjectWrapped = 8;
const QError_onlyLiteralWrapped = 9;
const QError_qrlIsNotFunction = 10;
const QError_notFoundContext = 13;
const QError_useMethodOutsideContext = 14;
const QError_immutableProps = 17;
const QError_hostCanOnlyBeAtRoot = 18;
const QError_immutableJsxProps = 19;
const QError_useInvokeContext = 20;
const QError_containerAlreadyPaused = 21;
const QError_invalidJsxNodeType = 25;
const QError_trackUseStore = 26;
const QError_missingObjectId = 27;
const QError_invalidContext = 28;
const qError = (code, ...parts) => {
  const text = codeToText(code);
  return logErrorAndStop(text, ...parts);
};
const codeToText = (code) => {
  var _a2;
  {
    const MAP = [
      "Error while serializing class attribute",
      "Can not serialize a HTML Node that is not an Element",
      "Rruntime but no instance found on element.",
      "Only primitive and object literals can be serialized",
      "Crash while rendering",
      "You can render over a existing q:container. Skipping render().",
      "Set property",
      "Only function's and 'string's are supported.",
      "Only objects can be wrapped in 'QObject'",
      `Only objects literals can be wrapped in 'QObject'`,
      "QRL is not a function",
      "Dynamic import not found",
      "Unknown type argument",
      "not found state for useContext",
      "Invoking 'use*()' method outside of invocation context.",
      "Cant access renderCtx for existing context",
      "Cant access document for existing context",
      "props are inmutable",
      "<div> component can only be used at the root of a Qwik component$()",
      "Props are immutable by default.",
      "use- method must be called only at the root level of a component$()",
      "Container is already paused. Skipping",
      'Components using useServerMount() can only be mounted in the server, if you need your component to be mounted in the client, use "useMount$()" instead',
      "When rendering directly on top of Document, the root node must be a <html>",
      "A <html> node must have 2 children. The first one <head> and the second one a <body>",
      "Invalid JSXNode type. It must be either a function or a string. Found:",
      "Tracking value changes can only be done to useStore() objects and component props",
      "Missing Object ID for captured object",
      "The provided Context reference is not a valid context created by createContext()"
    ];
    return `Code(${code}): ${(_a2 = MAP[code]) != null ? _a2 : ""}`;
  }
};
const isQrl$1 = (value) => {
  return typeof value === "function" && typeof value.getSymbol === "function";
};
const createQRL = (chunk, symbol, symbolRef, symbolFn, capture, captureRef, refSymbol) => {
  {
    verifySerializable(captureRef);
  }
  let cachedEl;
  const setContainer = (el) => {
    if (!cachedEl) {
      cachedEl = el;
    }
  };
  const resolve = async (el) => {
    if (el) {
      setContainer(el);
    }
    if (symbolRef) {
      return symbolRef;
    }
    if (symbolFn) {
      return symbolRef = symbolFn().then((module) => symbolRef = module[symbol]);
    } else {
      if (!cachedEl) {
        throw new Error(`QRL '${chunk}#${symbol || "default"}' does not have an attached container`);
      }
      const symbol2 = getPlatform(cachedEl).importSymbol(cachedEl, chunk, symbol);
      return symbolRef = then(symbol2, (ref) => {
        return symbolRef = ref;
      });
    }
  };
  const resolveLazy = (el) => {
    return isFunction(symbolRef) ? symbolRef : resolve(el);
  };
  const invokeFn = (el, currentCtx, beforeFn) => {
    return (...args) => {
      const fn = resolveLazy(el);
      return then(fn, (fn2) => {
        if (isFunction(fn2)) {
          const baseContext = currentCtx != null ? currentCtx : newInvokeContext();
          const context = {
            ...baseContext,
            $qrl$: QRL
          };
          if (beforeFn) {
            beforeFn();
          }
          return useInvoke(context, fn2, ...args);
        }
        throw qError(QError_qrlIsNotFunction);
      });
    };
  };
  const invoke = async function(...args) {
    const fn = invokeFn();
    const result = await fn(...args);
    return result;
  };
  const QRL = invoke;
  const methods = {
    getSymbol: () => refSymbol != null ? refSymbol : symbol,
    getHash: () => getSymbolHash$1(refSymbol != null ? refSymbol : symbol),
    resolve,
    $resolveLazy$: resolveLazy,
    $setContainer$: setContainer,
    $chunk$: chunk,
    $symbol$: symbol,
    $refSymbol$: refSymbol,
    $invokeFn$: invokeFn,
    $capture$: capture,
    $captureRef$: captureRef,
    $copy$() {
      return createQRL(chunk, symbol, symbolRef, symbolFn, null, qrl.$captureRef$, refSymbol);
    },
    $serialize$(options) {
      return stringifyQRL(QRL, options);
    }
  };
  const qrl = Object.assign(invoke, methods);
  return qrl;
};
const getSymbolHash$1 = (symbolName) => {
  const index2 = symbolName.lastIndexOf("_");
  if (index2 > -1) {
    return symbolName.slice(index2 + 1);
  }
  return symbolName;
};
const isSameQRL = (a, b) => {
  return a.getHash() === b.getHash();
};
function assertQrl(qrl) {
  {
    if (!isQrl$1(qrl)) {
      throw new Error("Not a QRL");
    }
  }
}
let runtimeSymbolId = 0;
const RUNTIME_QRL = "/runtimeQRL";
const INLINED_QRL = "/inlinedQRL";
const runtimeQrl = (symbol, lexicalScopeCapture = EMPTY_ARRAY) => {
  return createQRL(RUNTIME_QRL, "s" + runtimeSymbolId++, symbol, null, null, lexicalScopeCapture, null);
};
const inlinedQrl = (symbol, symbolName, lexicalScopeCapture = EMPTY_ARRAY) => {
  return createQRL(INLINED_QRL, symbolName, symbol, null, null, lexicalScopeCapture, null);
};
const stringifyQRL = (qrl, opts = {}) => {
  var _a2;
  assertQrl(qrl);
  let symbol = qrl.$symbol$;
  let chunk = qrl.$chunk$;
  const refSymbol = (_a2 = qrl.$refSymbol$) != null ? _a2 : symbol;
  const platform = opts.$platform$;
  const element = opts.$element$;
  if (platform) {
    const result = platform.chunkForSymbol(refSymbol);
    if (result) {
      chunk = result[1];
      if (!qrl.$refSymbol$) {
        symbol = result[0];
      }
    }
  }
  const parts = [chunk];
  if (symbol && symbol !== "default") {
    if (chunk === RUNTIME_QRL && qTest) {
      symbol = "_";
    }
    parts.push("#", symbol);
  }
  const capture = qrl.$capture$;
  const captureRef = qrl.$captureRef$;
  if (opts.$getObjId$) {
    if (captureRef && captureRef.length) {
      const capture2 = captureRef.map(opts.$getObjId$);
      parts.push(`[${capture2.join(" ")}]`);
    }
  } else if (opts.$addRefMap$) {
    if (captureRef && captureRef.length) {
      const capture2 = captureRef.map(opts.$addRefMap$);
      parts.push(`[${capture2.join(" ")}]`);
    }
  } else if (capture && capture.length > 0) {
    parts.push(`[${capture.join(" ")}]`);
  }
  const qrlString = parts.join("");
  if (qrl.$chunk$ === RUNTIME_QRL && element) {
    const qrls = element.__qrls__ || (element.__qrls__ = /* @__PURE__ */ new Set());
    qrls.add(qrl);
  }
  return qrlString;
};
const serializeQRLs = (existingQRLs, ctx) => {
  const opts = {
    $platform$: getPlatform(ctx.$element$),
    $element$: ctx.$element$,
    $addRefMap$: (obj) => addToArray(ctx.$refMap$, obj)
  };
  return existingQRLs.map((qrl) => stringifyQRL(qrl, opts)).join("\n");
};
const parseQRL = (qrl, el) => {
  const endIdx = qrl.length;
  const hashIdx = indexOf(qrl, 0, "#");
  const captureIdx = indexOf(qrl, hashIdx, "[");
  const chunkEndIdx = Math.min(hashIdx, captureIdx);
  const chunk = qrl.substring(0, chunkEndIdx);
  const symbolStartIdx = hashIdx == endIdx ? hashIdx : hashIdx + 1;
  const symbolEndIdx = captureIdx;
  const symbol = symbolStartIdx == symbolEndIdx ? "default" : qrl.substring(symbolStartIdx, symbolEndIdx);
  const captureStartIdx = captureIdx;
  const captureEndIdx = endIdx;
  const capture = captureStartIdx === captureEndIdx ? EMPTY_ARRAY : qrl.substring(captureStartIdx + 1, captureEndIdx - 1).split(" ");
  if (chunk === RUNTIME_QRL) {
    logError(codeToText(QError_runtimeQrlNoElement), qrl);
  }
  const iQrl = createQRL(chunk, symbol, null, null, capture, null, null);
  if (el) {
    iQrl.$setContainer$(el);
  }
  return iQrl;
};
const indexOf = (text, startIdx, char) => {
  const endIdx = text.length;
  const charIdx = text.indexOf(char, startIdx == endIdx ? 0 : startIdx);
  return charIdx == -1 ? endIdx : charIdx;
};
const addToArray = (array, obj) => {
  const index2 = array.indexOf(obj);
  if (index2 === -1) {
    array.push(obj);
    return array.length - 1;
  }
  return index2;
};
const $$1 = (expression) => {
  return runtimeQrl(expression);
};
const componentQrl = (onRenderQrl) => {
  function QwikComponent(props, key) {
    const hash = qTest ? "sX" : onRenderQrl.getHash();
    const finalKey = hash + ":" + (key ? key : "");
    return jsx(Virtual, { [OnRenderProp]: onRenderQrl, ...props }, finalKey);
  }
  QwikComponent[SERIALIZABLE_STATE] = [onRenderQrl];
  return QwikComponent;
};
const isQwikComponent = (component) => {
  return typeof component == "function" && component[SERIALIZABLE_STATE] !== void 0;
};
const Slot = (props) => {
  var _a2;
  const name = (_a2 = props.name) != null ? _a2 : "";
  return jsx(Virtual, {
    [QSlotName]: name
  }, name);
};
const version = "0.0.100";
const IS_HOST = 1 << 0;
const IS_HEAD = 1 << 1;
const IS_RAW_CONTENT = 1 << 2;
const renderSSR = async (doc, node, opts) => {
  const root = opts.containerTagName;
  const containerEl = doc.createElement(root);
  const containerState = getContainerState(containerEl);
  const rctx = createRenderContext(doc, containerState);
  const ssrCtx = {
    rctx,
    $contexts$: [],
    projectedChildren: void 0,
    projectedContext: void 0,
    hostCtx: void 0,
    invocationContext: void 0,
    headNodes: []
  };
  const beforeContent = opts.beforeContent;
  const beforeClose = opts.beforeClose;
  if (beforeContent) {
    ssrCtx.headNodes.push(...beforeContent);
  }
  const containerAttributes = {
    "q:container": "paused",
    "q:version": version,
    "q:render": "ssr"
  };
  if (opts.base) {
    containerAttributes["q:base"] = opts.base;
  }
  if (opts.url) {
    containerState.$envData$["url"] = opts.url;
  }
  if (opts.envData) {
    Object.assign(containerState.$envData$, opts.envData);
  }
  if (root === "html") {
    node = jsx(root, {
      ...containerAttributes,
      children: [node]
    });
  } else {
    node = jsx(root, {
      ...containerAttributes,
      children: [...ssrCtx.headNodes, node]
    });
  }
  await renderNode(node, ssrCtx, opts.stream, 0, (stream) => {
    const result = beforeClose == null ? void 0 : beforeClose(ssrCtx.$contexts$, containerState);
    if (result) {
      return processData(result, ssrCtx, stream, 0, void 0);
    }
  });
};
const renderNodeFunction = (node, ssrCtx, stream, flags, beforeClose) => {
  var _a2;
  if (node.type === SSRComment) {
    stream.write(`<!--${(_a2 = node.props.data) != null ? _a2 : ""}-->`);
    return;
  }
  if (node.type === Virtual) {
    const elCtx = getContext(ssrCtx.rctx.$doc$.createElement(":virtual"));
    return renderNodeVirtual(node, elCtx, void 0, ssrCtx, stream, flags, beforeClose);
  }
  const res = ssrCtx.invocationContext ? useInvoke(ssrCtx.invocationContext, () => node.type(node.props, node.key)) : node.type(node.props, node.key);
  return processData(res, ssrCtx, stream, flags, beforeClose);
};
const renderNodeVirtual = (node, elCtx, extraNodes, ssrCtx, stream, flags, beforeClose) => {
  var _a2;
  const props = node.props;
  const renderQrl = props[OnRenderProp];
  if (renderQrl) {
    elCtx.$renderQrl$ = renderQrl;
    return renderSSRComponent(ssrCtx, stream, elCtx, node, flags, beforeClose);
  }
  const { children, ...attributes } = node.props;
  const slotName = props[QSlotName];
  const isSlot = typeof slotName === "string";
  if (isSlot) {
    assertDefined((_a2 = ssrCtx.hostCtx) == null ? void 0 : _a2.$id$, "hostId must be defined for a slot");
    attributes[QSlotRef] = ssrCtx.hostCtx.$id$;
  }
  const key = node.key != null ? String(node.key) : null;
  if (key != null) {
    attributes["q:key"] = key;
  }
  const url = new Map(Object.entries(attributes));
  stream.write(`<!--qv ${serializeVirtualAttributes(url)}-->`);
  if (extraNodes) {
    for (const node2 of extraNodes) {
      renderNodeElementSync(node2.type, node2.props, stream);
    }
  }
  const promise = processData(props.children, ssrCtx, stream, flags);
  return then(promise, () => {
    var _a3;
    if (!isSlot && !beforeClose) {
      stream.write(CLOSE_VIRTUAL);
      return;
    }
    let promise2;
    if (isSlot) {
      const content = (_a3 = ssrCtx.projectedChildren) == null ? void 0 : _a3[slotName];
      if (content) {
        ssrCtx.projectedChildren[slotName] = void 0;
        promise2 = processData(content, ssrCtx.projectedContext, stream, flags);
      }
    }
    if (beforeClose) {
      promise2 = then(promise2, () => beforeClose(stream));
    }
    return then(promise2, () => {
      stream.write(CLOSE_VIRTUAL);
    });
  });
};
const CLOSE_VIRTUAL = `<!--/qv-->`;
const renderNodeElement = (node, extraAttributes, extraNodes, ssrCtx, stream, flags, beforeClose) => {
  var _a2;
  const key = node.key != null ? String(node.key) : null;
  const props = node.props;
  const textType = node.type;
  const elCtx = getContext(ssrCtx.rctx.$doc$.createElement(node.type));
  const hasRef = "ref" in props;
  const attributes = updateProperties(ssrCtx.rctx, elCtx, props);
  const hostCtx = ssrCtx.hostCtx;
  if (hostCtx) {
    attributes["class"] = joinClasses(hostCtx.$scopeIds$, attributes["class"]);
    const cmp = hostCtx.$component$;
    if (!cmp.$attachedListeners$) {
      cmp.$attachedListeners$ = true;
      (_a2 = hostCtx.$listeners$) == null ? void 0 : _a2.forEach((qrl, eventName) => {
        addQRLListener(elCtx, eventName, qrl);
      });
    }
  }
  if (textType === "head") {
    flags |= IS_HEAD;
  }
  const hasEvents = elCtx.$listeners$;
  const isHead = flags & IS_HEAD;
  if (key != null) {
    attributes["q:key"] = key;
  }
  if (hasRef || hasEvents) {
    const newID = getNextIndex(ssrCtx.rctx);
    attributes[ELEMENT_ID] = newID;
    elCtx.$id$ = newID;
    ssrCtx.$contexts$.push(elCtx);
  }
  if (isHead) {
    attributes["q:head"] = "";
  }
  if (extraAttributes) {
    Object.assign(attributes, extraAttributes);
  }
  if (elCtx.$listeners$) {
    elCtx.$listeners$.forEach((value, key2) => {
      attributes[fromCamelToKebabCase(key2)] = serializeQRLs(value, elCtx);
    });
  }
  if (renderNodeElementSync(textType, attributes, stream)) {
    return;
  }
  if (textType !== "head") {
    flags &= ~IS_HEAD;
  }
  if (hasRawContent[textType]) {
    flags |= IS_RAW_CONTENT;
  } else {
    flags &= ~IS_RAW_CONTENT;
  }
  if (extraNodes) {
    for (const node2 of extraNodes) {
      renderNodeElementSync(node2.type, node2.props, stream);
    }
  }
  const promise = processData(props.children, ssrCtx, stream, flags);
  return then(promise, () => {
    if (textType === "head") {
      ssrCtx.headNodes.forEach((node2) => {
        renderNodeElementSync(node2.type, node2.props, stream);
      });
    }
    if (!beforeClose) {
      stream.write(`</${textType}>`);
      return;
    }
    return then(beforeClose(stream), () => {
      stream.write(`</${textType}>`);
    });
  });
};
const renderNodeElementSync = (tagName, attributes, stream) => {
  stream.write(`<${tagName}`);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key !== "dangerouslySetInnerHTML" && key !== "children") {
      if (key === "class" && !value) {
        return;
      }
      const chunk = value === "" ? ` ${key}` : ` ${key}="${escapeAttr(value)}"`;
      stream.write(chunk);
    }
  });
  stream.write(`>`);
  const empty = !!emptyElements[tagName];
  if (empty) {
    return true;
  }
  const innerHTML = attributes.dangerouslySetInnerHTML;
  if (innerHTML) {
    stream.write(innerHTML);
    stream.write(`</${tagName}>`);
    return true;
  }
  return false;
};
const renderSSRComponent = (ssrCtx, stream, elCtx, node, flags, beforeClose) => {
  const attributes = updateComponentProperties(ssrCtx.rctx, elCtx, node.props);
  return then(executeComponent(ssrCtx.rctx, elCtx), (res) => {
    if (!res) {
      console.error("not rendered");
      return;
    }
    const hostElement = elCtx.$element$;
    const newCtx = res.rctx;
    let children = node.props.children;
    if (children) {
      if (isArray(children)) {
        if (children.filter(isNotNullable).length === 0) {
          children = void 0;
        }
      } else {
        children = [children];
      }
    }
    const invocationContext = newInvokeContext(newCtx.$doc$, hostElement, void 0);
    invocationContext.$subscriber$ = hostElement;
    invocationContext.$renderCtx$ = newCtx;
    const projectedContext = {
      ...ssrCtx,
      rctx: copyRenderContext(newCtx)
    };
    const newSSrContext = {
      ...ssrCtx,
      projectedChildren: splitProjectedChildren(children, ssrCtx),
      projectedContext,
      rctx: newCtx,
      invocationContext
    };
    const extraNodes = [];
    if (elCtx.$appendStyles$) {
      for (const style of elCtx.$appendStyles$) {
        extraNodes.push(jsx("style", {
          [QStyle]: style.styleId,
          dangerouslySetInnerHTML: style.content
        }));
      }
    }
    if (elCtx.$scopeIds$) {
      for (const styleId of elCtx.$scopeIds$) {
      }
      const value = serializeSStyle(elCtx.$scopeIds$);
      if (value) {
        attributes[QScopedStyle] = value;
      }
    }
    const newID = getNextIndex(ssrCtx.rctx);
    attributes[ELEMENT_ID] = newID;
    elCtx.$id$ = newID;
    ssrCtx.$contexts$.push(elCtx);
    const processedNode = jsx(node.type, {
      ...attributes,
      children: res.node
    }, node.key);
    flags |= IS_HOST;
    newSSrContext.hostCtx = elCtx;
    return renderNodeVirtual(processedNode, elCtx, extraNodes, newSSrContext, stream, flags, (stream2) => {
      return then(renderQTemplates(newSSrContext, stream2), () => {
        return beforeClose == null ? void 0 : beforeClose(stream2);
      });
    });
  });
};
const renderQTemplates = (ssrContext, stream) => {
  const projectedChildren = ssrContext.projectedChildren;
  if (projectedChildren) {
    const nodes = Object.keys(projectedChildren).map((slotName) => {
      const value = projectedChildren[slotName];
      if (value) {
        return jsx("q:template", {
          [QSlot]: slotName,
          hidden: "",
          "aria-hidden": "true",
          children: value
        });
      }
    });
    return processData(nodes, ssrContext, stream, 0, void 0);
  }
};
const splitProjectedChildren = (children, ssrCtx) => {
  var _a2;
  const flatChildren = flatVirtualChildren(children, ssrCtx);
  if (flatChildren === null) {
    return void 0;
  }
  const slotMap = {};
  for (const child of flatChildren) {
    let slotName = "";
    if (isJSXNode(child)) {
      slotName = (_a2 = child.props[QSlot]) != null ? _a2 : "";
    }
    let array = slotMap[slotName];
    if (!array) {
      slotMap[slotName] = array = [];
    }
    array.push(child);
  }
  return slotMap;
};
const renderNode = (node, ssrCtx, stream, flags, beforeClose) => {
  if (typeof node.type === "string") {
    return renderNodeElement(node, void 0, void 0, ssrCtx, stream, flags, beforeClose);
  } else {
    return renderNodeFunction(node, ssrCtx, stream, flags, beforeClose);
  }
};
const processData = (node, ssrCtx, stream, flags, beforeClose) => {
  if (node == null || typeof node === "boolean") {
    return;
  }
  if (isJSXNode(node)) {
    return renderNode(node, ssrCtx, stream, flags, beforeClose);
  } else if (isPromise(node)) {
    return node.then((node2) => processData(node2, ssrCtx, stream, flags, beforeClose));
  } else if (isArray(node)) {
    node = _flatVirtualChildren(node, ssrCtx);
    return walkChildren(node, ssrCtx, stream, flags);
  } else if (isString(node) || typeof node === "number") {
    if ((flags & IS_RAW_CONTENT) !== 0) {
      stream.write(String(node));
    } else {
      stream.write(escape(String(node)));
    }
  } else {
    logWarn("A unsupported value was passed to the JSX, skipping render. Value:", node);
  }
};
function walkChildren(children, ssrContext, stream, flags) {
  if (children == null) {
    return;
  }
  if (!isArray(children)) {
    return processData(children, ssrContext, stream, flags);
  }
  if (children.length === 1) {
    return processData(children[0], ssrContext, stream, flags);
  }
  if (children.length === 0) {
    return;
  }
  let currentIndex = 0;
  const buffers = [];
  return children.reduce((prevPromise, child, index2) => {
    const buffer = [];
    buffers.push(buffer);
    const localStream = {
      write(chunk) {
        if (currentIndex === index2) {
          stream.write(chunk);
        } else {
          buffer.push(chunk);
        }
      }
    };
    return then(processData(child, ssrContext, localStream, flags), () => {
      return then(prevPromise, () => {
        currentIndex++;
        if (buffers.length > currentIndex) {
          buffers[currentIndex].forEach((chunk) => stream.write(chunk));
        }
      });
    });
  }, void 0);
}
const flatVirtualChildren = (children, ssrCtx) => {
  if (children == null) {
    return null;
  }
  const result = _flatVirtualChildren(children, ssrCtx);
  const nodes = isArray(result) ? result : [result];
  if (nodes.length === 0) {
    return null;
  }
  return nodes;
};
const _flatVirtualChildren = (children, ssrCtx) => {
  if (children == null) {
    return null;
  }
  if (isArray(children)) {
    return children.flatMap((c) => _flatVirtualChildren(c, ssrCtx));
  } else if (isJSXNode(children) && isFunction(children.type) && children.type !== SSRComment && children.type !== Virtual) {
    const fn = children.type;
    const res = ssrCtx.invocationContext ? useInvoke(ssrCtx.invocationContext, () => fn(children.props, children.key)) : fn(children.props, children.key);
    return flatVirtualChildren(res, ssrCtx);
  }
  return children;
};
const updateProperties = (rctx, ctx, expectProps) => {
  const attributes = {};
  if (!expectProps) {
    return attributes;
  }
  const keys = Object.keys(expectProps);
  if (keys.length === 0) {
    return attributes;
  }
  const elm = ctx.$element$;
  for (const key of keys) {
    if (key === "children" || key === OnRenderProp) {
      continue;
    }
    const newValue = expectProps[key];
    if (key === "ref") {
      newValue.current = elm;
      continue;
    }
    if (key.startsWith("data-") || key.startsWith("aria-")) {
      attributes[key] = newValue;
      continue;
    }
    if (isOnProp(key)) {
      const attributeName = normalizeOnProp(key.slice(0, -1));
      addQRLListener(ctx, attributeName, newValue);
      continue;
    }
    setProperty(attributes, key, newValue);
  }
  return attributes;
};
const updateComponentProperties = (rctx, ctx, expectProps) => {
  const attributes = {};
  if (!expectProps) {
    return attributes;
  }
  const keys = Object.keys(expectProps);
  if (keys.length === 0) {
    return attributes;
  }
  const qwikProps = getPropsMutator(ctx, rctx.$containerState$);
  for (const key of keys) {
    if (key === "children" || key === OnRenderProp) {
      continue;
    }
    const newValue = expectProps[key];
    const skipProperty = ALLOWS_PROPS.includes(key);
    if (!skipProperty) {
      qwikProps.set(key, newValue);
      continue;
    }
    setProperty(attributes, key, newValue);
  }
  return attributes;
};
function setProperty(attributes, prop, value) {
  if (value != null && value !== false) {
    prop = processPropKey(prop);
    const attrValue = processPropValue(prop, value, attributes[prop]);
    if (attrValue !== null) {
      attributes[prop] = attrValue;
    }
  }
}
function processPropKey(prop) {
  if (prop === "className") {
    return "class";
  }
  return prop;
}
function processPropValue(prop, value, prevValue) {
  if (prop === "class") {
    const str = joinClasses(value, prevValue);
    return str === "" ? null : str;
  }
  if (prop === "style") {
    return stringifyStyle(value);
  }
  if (value === false || value == null) {
    return null;
  }
  if (value === true) {
    return "";
  }
  return String(value);
}
const hasRawContent = {
  style: true,
  script: true
};
const emptyElements = {
  area: true,
  base: true,
  basefont: true,
  bgsound: true,
  br: true,
  col: true,
  embed: true,
  frame: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};
const escape = (s) => {
  return s.replace(/[&<>\u00A0]/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "\xA0":
        return "&nbsp;";
      default:
        return "";
    }
  });
};
const escapeAttr = (s) => {
  const toEscape = /[&"\u00A0]/g;
  if (!toEscape.test(s)) {
    return s;
  } else {
    return s.replace(toEscape, (c) => {
      switch (c) {
        case "&":
          return "&amp;";
        case '"':
          return "&quot;";
        case "\xA0":
          return "&nbsp;";
        default:
          return "";
      }
    });
  }
};
const useStore = (initialState, opts) => {
  var _a2;
  const { get, set, ctx } = useSequentialScope();
  if (get != null) {
    return get;
  }
  const value = isFunction(initialState) ? initialState() : initialState;
  if ((opts == null ? void 0 : opts.reactive) === false) {
    set(value);
    return value;
  } else {
    const containerState = ctx.$renderCtx$.$containerState$;
    const recursive = (_a2 = opts == null ? void 0 : opts.recursive) != null ? _a2 : false;
    const flags = recursive ? QObjectRecursive : 0;
    const newStore = createProxy(value, containerState, flags, void 0);
    set(newStore);
    return newStore;
  }
};
const createContext = (name) => {
  return Object.freeze({
    id: fromCamelToKebabCase(name)
  });
};
const useContextProvider = (context, newValue) => {
  const { get, set, ctx } = useSequentialScope();
  if (get) {
    return;
  }
  {
    validateContext(context);
  }
  const hostElement = ctx.$hostElement$;
  const hostCtx = getContext(hostElement);
  let contexts = hostCtx.$contexts$;
  if (!contexts) {
    hostCtx.$contexts$ = contexts = /* @__PURE__ */ new Map();
  }
  {
    verifySerializable(newValue);
  }
  contexts.set(context.id, newValue);
  set(true);
};
const useContext = (context) => {
  const { get, set, ctx } = useSequentialScope();
  if (get) {
    return get;
  }
  {
    validateContext(context);
  }
  let hostElement = ctx.$hostElement$;
  const contexts = ctx.$renderCtx$.$localStack$;
  for (let i = contexts.length - 1; i >= 0; i--) {
    const ctx2 = contexts[i];
    hostElement = ctx2.$element$;
    if (ctx2.$contexts$) {
      const found = ctx2.$contexts$.get(context.id);
      if (found) {
        set(found);
        return found;
      }
    }
  }
  if (hostElement.closest) {
    const value = queryContextFromDom(hostElement, context.id);
    if (value !== void 0) {
      set(value);
      return value;
    }
  }
  throw qError(QError_notFoundContext, context.id);
};
const queryContextFromDom = (hostElement, contextId) => {
  var _a2;
  let element = hostElement;
  while (element) {
    let node = element;
    let virtual;
    while (node && (virtual = findVirtual(node))) {
      const contexts = (_a2 = tryGetContext(virtual)) == null ? void 0 : _a2.$contexts$;
      if (contexts) {
        if (contexts.has(contextId)) {
          return contexts.get(contextId);
        }
      }
      node = virtual;
    }
    element = element.parentElement;
  }
  return void 0;
};
const findVirtual = (el) => {
  let node = el;
  let stack = 1;
  while (node = node.previousSibling) {
    if (isComment(node)) {
      if (node.data === "/qv") {
        stack++;
      } else if (node.data.startsWith("qv ")) {
        stack--;
        if (stack === 0) {
          return getVirtualElement(node);
        }
      }
    }
  }
  return null;
};
const validateContext = (context) => {
  if (!isObject(context) || typeof context.id !== "string" || context.id.length === 0) {
    throw qError(QError_invalidContext, context);
  }
};
function useEnvData(key, defaultValue) {
  var _a2;
  const ctx = useInvokeContext();
  return (_a2 = ctx.$renderCtx$.$containerState$.$envData$[key]) != null ? _a2 : defaultValue;
}
var MODE;
(function(MODE2) {
  MODE2[MODE2["selector"] = 0] = "selector";
  MODE2[MODE2["media"] = 1] = "media";
  MODE2[MODE2["body"] = 2] = "body";
  MODE2[MODE2["stringSingle"] = 3] = "stringSingle";
  MODE2[MODE2["stringDouble"] = 4] = "stringDouble";
  MODE2[MODE2["commentMultiline"] = 5] = "commentMultiline";
  MODE2[MODE2["EXIT"] = 6] = "EXIT";
})(MODE || (MODE = {}));
var CHAR;
(function(CHAR2) {
  CHAR2[CHAR2["ANY"] = 0] = "ANY";
  CHAR2[CHAR2["IDENT"] = 1] = "IDENT";
  CHAR2[CHAR2["NOT_IDENT_AND_NOT_DOT"] = 2] = "NOT_IDENT_AND_NOT_DOT";
  CHAR2[CHAR2["SPACE"] = 32] = "SPACE";
  CHAR2[CHAR2["FORWARD_SLASH"] = 47] = "FORWARD_SLASH";
  CHAR2[CHAR2["DOUBLE_QUOTE"] = 34] = "DOUBLE_QUOTE";
  CHAR2[CHAR2["SINGLE_QUOTE"] = 39] = "SINGLE_QUOTE";
  CHAR2[CHAR2["STAR"] = 42] = "STAR";
  CHAR2[CHAR2["DASH"] = 45] = "DASH";
  CHAR2[CHAR2["DOT"] = 46] = "DOT";
  CHAR2[CHAR2["AT"] = 64] = "AT";
  CHAR2[CHAR2["A"] = 65] = "A";
  CHAR2[CHAR2["Z"] = 90] = "Z";
  CHAR2[CHAR2["_0"] = 48] = "_0";
  CHAR2[CHAR2["_9"] = 57] = "_9";
  CHAR2[CHAR2["BACKSLASH"] = 92] = "BACKSLASH";
  CHAR2[CHAR2["UNDERSCORE"] = 95] = "UNDERSCORE";
  CHAR2[CHAR2["a"] = 97] = "a";
  CHAR2[CHAR2["z"] = 122] = "z";
  CHAR2[CHAR2["OPEN_BRACE"] = 123] = "OPEN_BRACE";
  CHAR2[CHAR2["CLOSE_BRACE"] = 125] = "CLOSE_BRACE";
})(CHAR || (CHAR = {}));
[
  [
    [CHAR.IDENT, CHAR.NOT_IDENT_AND_NOT_DOT, MODE.selector],
    [CHAR.ANY, CHAR.AT, MODE.media],
    [CHAR.ANY, CHAR.OPEN_BRACE, MODE.body],
    [CHAR.FORWARD_SLASH, CHAR.STAR, MODE.commentMultiline]
  ],
  [
    [CHAR.ANY, CHAR.CLOSE_BRACE, MODE.EXIT],
    [CHAR.FORWARD_SLASH, CHAR.STAR, MODE.commentMultiline],
    [CHAR.ANY, CHAR.OPEN_BRACE, MODE.selector],
    [CHAR.FORWARD_SLASH, CHAR.STAR, MODE.commentMultiline]
  ],
  [
    [CHAR.ANY, CHAR.CLOSE_BRACE, MODE.EXIT],
    [CHAR.ANY, CHAR.SINGLE_QUOTE, MODE.stringSingle],
    [CHAR.ANY, CHAR.DOUBLE_QUOTE, MODE.stringDouble],
    [CHAR.FORWARD_SLASH, CHAR.STAR, MODE.commentMultiline]
  ],
  [[CHAR.ANY, CHAR.SINGLE_QUOTE, MODE.EXIT]],
  [[CHAR.ANY, CHAR.DOUBLE_QUOTE, MODE.EXIT]],
  [[CHAR.STAR, CHAR.FORWARD_SLASH, MODE.EXIT]]
];
const useStylesQrl = (styles2) => {
  _useStyles(styles2, (str) => str, false);
};
const _useStyles = (styleQrl, transform, scoped) => {
  const { get, set, ctx, i } = useSequentialScope();
  if (get) {
    return get;
  }
  const renderCtx = ctx.$renderCtx$;
  const styleId = styleKey(styleQrl, i);
  const hostElement = ctx.$hostElement$;
  const containerState = renderCtx.$containerState$;
  const elCtx = getContext(ctx.$hostElement$);
  set(styleId);
  if (!elCtx.$appendStyles$) {
    elCtx.$appendStyles$ = [];
  }
  if (!elCtx.$scopeIds$) {
    elCtx.$scopeIds$ = [];
  }
  if (scoped) {
    elCtx.$scopeIds$.push(styleContent(styleId));
  }
  if (!hasStyle(containerState, styleId)) {
    containerState.$styleIds$.add(styleId);
    ctx.$waitOn$.push(styleQrl.resolve(hostElement).then((styleText) => {
      elCtx.$appendStyles$.push({
        styleId,
        content: transform(styleText, styleId)
      });
    }));
  }
  return styleId;
};
const styles$6 = ".api {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  padding: 0;\n}\n\n.api-menu {\n  background: #eee;\n  padding-left: 20px;\n}\n\n.api-content {\n  padding-left: 20px;\n}\n";
const layoutApi = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesQrl(inlinedQrl(styles$6, "s_RFhYjQmG0bA"));
  return /* @__PURE__ */ jsx("div", {
    class: "api",
    children: [
      /* @__PURE__ */ jsx("aside", {
        class: "api-menu",
        children: [
          /* @__PURE__ */ jsx("h2", {
            children: "API"
          }),
          /* @__PURE__ */ jsx("ul", {
            children: [
              /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "/api/builder.io/oss.json",
                  children: "Org/User"
                })
              }),
              /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "/api/data.json",
                  children: "Data"
                })
              })
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsx("section", {
        class: "api-content",
        children: /* @__PURE__ */ jsx(Slot, {})
      })
    ]
  });
}, "s_EhNlYUEnlvI"));
const head$e = ({ pathname }) => {
  return {
    title: `API: ${pathname}`
  };
};
const ApiLayoutapi_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layoutApi,
  head: head$e
}, Symbol.toStringTag, { value: "Module" }));
const layout$1 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    children: [
      /* @__PURE__ */ jsx("section", {
        class: "blog-content",
        children: /* @__PURE__ */ jsx(Slot, {})
      }),
      /* @__PURE__ */ jsx("aside", {
        class: "blog-menu",
        children: /* @__PURE__ */ jsx("ul", {
          children: [
            /* @__PURE__ */ jsx("li", {
              children: /* @__PURE__ */ jsx("a", {
                href: "/blog/what-is-resumability",
                children: "What Is Resumability?"
              })
            }),
            /* @__PURE__ */ jsx("li", {
              children: /* @__PURE__ */ jsx("a", {
                href: "/blog/serializing-props",
                children: "Serializing Props"
              })
            })
          ]
        })
      })
    ]
  });
}, "s_5x9HjCGcVg4"));
const BlogLayout_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout$1
}, Symbol.toStringTag, { value: "Module" }));
const styles$5 = "footer {\n  border-top: 1px solid #ddd;\n  margin-top: 40px;\n  padding: 20px;\n}\n\nfooter a {\n  color: #949494;\n  font-size: 12px;\n}\n\nfooter ul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  text-align: center;\n}\n\nfooter li {\n  display: inline-block;\n  padding: 4px 12px;\n}\n";
const Footer = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesQrl(inlinedQrl(styles$5, "s_hCy6nq1xvQc"));
  return /* @__PURE__ */ jsx("footer", {
    children: /* @__PURE__ */ jsx("ul", {
      children: [
        /* @__PURE__ */ jsx("li", {
          children: /* @__PURE__ */ jsx("a", {
            href: "/blog",
            children: "Blog"
          })
        }),
        /* @__PURE__ */ jsx("li", {
          children: /* @__PURE__ */ jsx("a", {
            href: "/docs",
            children: "Docs"
          })
        }),
        /* @__PURE__ */ jsx("li", {
          children: /* @__PURE__ */ jsx("a", {
            href: "/about-us",
            children: "About Us"
          })
        }),
        /* @__PURE__ */ jsx("li", {
          children: /* @__PURE__ */ jsx("a", {
            class: "footer-home",
            href: "/",
            children: "Home"
          })
        })
      ]
    })
  });
}, "s_ahnZZnfc388"));
const isBrowser = false;
const M = /* @__PURE__ */ createContext("qc-c"), W = /* @__PURE__ */ createContext("qc-ic"), G = /* @__PURE__ */ createContext("qc-h"), B = /* @__PURE__ */ createContext("qc-l"), z = /* @__PURE__ */ createContext("qc-n"), st = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const { contents: t } = useContext(W);
  if (t && t.length > 0) {
    const n = t.length;
    let o = jsx(t[n - 1].default, {}), e = n - 2;
    for (; e >= 0; e--)
      o = jsx(t[e].default, {
        children: o
      });
    return o;
  }
  return jsx(SkipRerender, {});
}, "RouterOutlet_component_lGBxXp2t0Ss")), A = /* @__PURE__ */ new WeakMap(), ct = async (t, n, o, e) => {
  if (Array.isArray(t))
    for (const s of t) {
      const c = s[0].exec(e);
      if (c) {
        const r = s[1], i = it(s[2], c), p = new Array(r.length), a = [], E = rt(n, e);
        let l;
        return r.forEach((f, d) => {
          Q(f, a, (I) => p[d] = I, o);
        }), Q(E, a, (f) => l = f == null ? void 0 : f.default, o), a.length > 0 && await Promise.all(a), {
          params: i,
          mods: p,
          menu: l
        };
      }
    }
  return null;
}, Q = (t, n, o, e) => {
  if (typeof t == "function") {
    const s = A.get(t);
    if (s)
      o(s);
    else {
      const c = t();
      typeof c.then == "function" ? n.push(c.then((r) => {
        e !== false && A.set(t, r), o(r);
      })) : c && o(c);
    }
  }
}, rt = (t, n) => {
  if (t) {
    const o = t.find((e) => e[0] === n || n.startsWith(e[0] + "/"));
    if (o)
      return o[1];
  }
}, it = (t, n) => {
  const o = {};
  if (Array.isArray(t))
    for (let e = 0; e < t.length; e++)
      o[t[e]] = n ? n[e + 1] : "";
  return o;
}, at = (t, n, o) => {
  const e = V(), s = {
    data: t ? t.body : null,
    head: e,
    ...n
  };
  for (let c = o.length - 1; c >= 0; c--) {
    const r = o[c] && o[c].head;
    r && (typeof r == "function" ? D(e, r(s)) : typeof r == "object" && D(e, r));
  }
  return s.head;
}, D = (t, n) => {
  typeof n.title == "string" && (t.title = n.title), _(t.meta, n.meta), _(t.links, n.links), _(t.styles, n.styles);
}, _ = (t, n) => {
  if (Array.isArray(n))
    for (const o of n) {
      if (typeof o.key == "string") {
        const e = t.findIndex((s) => s.key === o.key);
        if (e > -1) {
          t[e] = o;
          continue;
        }
      }
      t.push(o);
    }
}, V = () => ({
  title: "",
  meta: [],
  links: [],
  styles: []
}), gt = () => useContext(M), kt = () => useContext(G), Z = () => useContext(B), lt = () => useContext(z), $ = () => noSerialize(useEnvData("qwikcity")), ft = (t, n) => {
  const o = t.location, e = x(n.path, o);
  T(o, e) && (U(t, o, e), t.history.pushState("", "", h(e))), t[H] || (t[H] = 1, t.addEventListener("popstate", () => {
    const s = t.location, c = x(n.path, s);
    T(s, c) && (U(t, c, s), n.path = h(s));
  }));
}, h = (t) => t.pathname + t.search + t.hash, x = (t, n) => new URL(t, n.href), F = (t, n) => t.origin === n.origin, J = (t, n) => h(t) === h(n), T = (t, n) => F(t, n) && !J(t, n), ut = (t, n) => {
  const o = t.href;
  if (typeof o == "string" && o.trim() !== "" && typeof t.target != "string")
    try {
      const e = x(o, n), s = x("", n);
      if (F(e, s))
        return h(e);
    } catch (e) {
      console.error(e);
    }
  return null;
}, U = async (t, n, o) => {
  const e = t.document, s = o.hash;
  if (J(n, o))
    n.hash !== s && (await j(), s ? q(e, s) : t.scrollTo(0, 0));
  else if (s)
    for (let c = 0; c < 24 && (await j(), !q(e, s)); c++)
      ;
}, j = () => new Promise((t) => setTimeout(t, 12)), q = (t, n) => {
  const o = n.slice(1), e = t.getElementById(o);
  return e && e.scrollIntoView(), e;
}, H = /* @__PURE__ */ Symbol(), ht = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const t = $(), n = useStore(() => {
    const r = t == null ? void 0 : t.route;
    if (!r)
      throw new Error("Missing Qwik City User Context");
    return r;
  }), o = useStore(() => {
    const r = t == null ? void 0 : t.route;
    return {
      path: h(new URL(r.href))
    };
  }), e = useStore(V), s = useStore({
    headings: void 0,
    menu: void 0
  }), c = useStore({
    contents: void 0
  });
  return useContextProvider(M, s), useContextProvider(W, c), useContextProvider(G, e), useContextProvider(B, n), useContextProvider(z, o), useWatchQrl(inlinedQrl(async ({ track: r }) => {
    const [i, p, a, E, l, f] = useLexicalScope(), { default: d } = await Promise.resolve().then(() => _qwikCityPlan), I = r(f, "path"), C = new URL(I, l.href), w = await ct(d.routes, d.menus, d.cacheModules, C.pathname);
    if (w) {
      const v = w.mods, X = v[v.length - 1], L = at(E == null ? void 0 : E.response, l, v);
      a.links = L.links, a.meta = L.meta, a.styles = L.styles, a.title = L.title, i.headings = X.headings, i.menu = w.menu, p.contents = noSerialize(v), l.href = C.href, l.pathname = C.pathname, l.params = {
        ...w.params
      }, l.query = Object.fromEntries(C.searchParams.entries()), isBrowser && ft(window, f);
    }
  }, "QwikCity_component_useWatch_0eTh051is3w", [
    s,
    c,
    e,
    t,
    n,
    o
  ])), /* @__PURE__ */ jsx(Slot, {});
}, "QwikCity_component_kFLTrp4IGhI")), wt = /* @__PURE__ */ componentQrl(inlinedQrl((t) => {
  const n = lt(), o = Z(), e = {
    ...t
  }, s = ut(e, o);
  return s && (e["preventdefault:click"] = true, e.href = s), /* @__PURE__ */ jsx("a", {
    ...e,
    onClick$: inlinedQrl(() => {
      const [c, r, i] = useLexicalScope();
      c && (i.path = r.href);
    }, "Link_component_a_onClick_2JCD0jbZplA", [
      s,
      e,
      n
    ]),
    children: /* @__PURE__ */ jsx(Slot, {})
  });
}, "Link_component_G2veQzc9pPo")), vt = () => {
  const t = Z(), n = $();
  return useResourceQrl(inlinedQrl(async ({ track: o, cleanup: e }) => {
    const [s, c] = useLexicalScope();
    o(c, "pathname");
    {
      if (!s)
        throw new Error("Endpoint response body is missing");
      return s.response.body;
    }
  }, "useEndpoint_useResource_3SNE8VxnEag", [
    n,
    t
  ]));
};
const styles$4 = "header {\n  background-color: #0093ee;\n}\n\nheader .header-inner {\n  display: grid;\n  grid-template-columns: 1fr auto auto;\n  padding: 10px;\n  max-width: 800px;\n  margin: 0 auto;\n}\n\n.full-screen header .header-inner {\n  max-width: 100%;\n}\n\nheader a {\n  color: white;\n  text-decoration: none;\n  padding: 4px 8px;\n  margin-right: 5px;\n  border-radius: 4px;\n}\n\nheader a:hover {\n  background-color: #ffffff50;\n}\n\nheader .active {\n  background-color: #ffffff30;\n}\n\n.theme-toggle {\n  background: transparent;\n  width: 30px;\n  border: none;\n  cursor: pointer;\n}\n\n.theme-light .theme-toggle::before {\n  content: '\u263D';\n}\n\n.theme-dark .theme-toggle::before {\n  content: '\u2600';\n}\n";
const Header = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesQrl(inlinedQrl(styles$4, "s_06CEeYFWfP4"));
  const pathname = Z().pathname;
  return /* @__PURE__ */ jsx("header", {
    children: /* @__PURE__ */ jsx("div", {
      class: "header-inner",
      children: [
        /* @__PURE__ */ jsx("section", {
          class: "logo",
          children: /* @__PURE__ */ jsx("a", {
            href: "/",
            children: "Qwik City \u{1F3D9}"
          })
        }),
        /* @__PURE__ */ jsx("nav", {
          children: [
            /* @__PURE__ */ jsx("a", {
              href: "/blog",
              class: {
                active: pathname.startsWith("/blog")
              },
              children: "Blog"
            }),
            /* @__PURE__ */ jsx("a", {
              href: "/docs",
              class: {
                active: pathname.startsWith("/docs")
              },
              children: "Docs"
            }),
            /* @__PURE__ */ jsx("a", {
              href: "/api",
              class: {
                active: pathname.startsWith("/api")
              },
              children: "API"
            }),
            /* @__PURE__ */ jsx("a", {
              href: "/products/hat",
              class: {
                active: pathname.startsWith("/products")
              },
              children: "Products"
            }),
            /* @__PURE__ */ jsx("a", {
              href: "/about-us",
              class: {
                active: pathname.startsWith("/about-us")
              },
              children: "About Us"
            })
          ]
        })
      ]
    })
  });
}, "s_jkud0AqUghc"));
const styles$3 = ".dashboard {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  padding: 0;\n}\n\n.dashboard-menu {\n  background: #eee;\n  padding-left: 20px;\n}\n\n.dashboard-content {\n  padding-left: 20px;\n}\n";
const layout_$1 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesQrl(inlinedQrl(styles$3, "s_453JRSMq0HE"));
  return /* @__PURE__ */ jsx("div", {
    children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", {
        class: "dashboard",
        children: [
          /* @__PURE__ */ jsx("aside", {
            class: "dashboard-menu",
            children: [
              /* @__PURE__ */ jsx("h5", {
                children: "Dashboard Menu"
              }),
              /* @__PURE__ */ jsx("ul", {
                children: [
                  /* @__PURE__ */ jsx("li", {
                    children: /* @__PURE__ */ jsx("a", {
                      href: "/dashboard/profile",
                      children: "Profile"
                    })
                  }),
                  /* @__PURE__ */ jsx("li", {
                    children: /* @__PURE__ */ jsx("a", {
                      href: "/dashboard/settings",
                      children: "Settings"
                    })
                  })
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsx("section", {
            class: "dashboard-content",
            children: /* @__PURE__ */ jsx(Slot, {})
          })
        ]
      }),
      /* @__PURE__ */ jsx(Footer, {})
    ]
  });
}, "s_wPgAA2dSM9I"));
const head$d = ({ head: head2 }) => {
  return {
    title: `Dashboard ${head2.title}`
  };
};
const DashboardLayout_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout_$1,
  head: head$d
}, Symbol.toStringTag, { value: "Module" }));
const styles$2 = "nav.breadcrumbs {\n  padding: 5px;\n  border-bottom: 1px solid #ddd;\n}\n\nnav.breadcrumbs > span {\n  display: inline-block;\n  padding: 5px 0;\n  font-size: 12px;\n}\n\nnav.breadcrumbs > span a {\n  text-decoration: none;\n  color: inherit;\n}\n\nnav.breadcrumbs > span::after {\n  content: '>';\n  padding: 0 5px;\n  opacity: 0.4;\n}\n\nnav.breadcrumbs > span:last-child::after {\n  display: none;\n}\n";
const Breadcrumbs = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesQrl(inlinedQrl(styles$2, "s_0HAW829NhVk"));
  const { menu } = gt();
  const loc = Z();
  const breadcrumbs = createBreadcrumbs(menu, loc.pathname);
  if (breadcrumbs.length === 0)
    return null;
  return /* @__PURE__ */ jsx("nav", {
    class: "breadcrumbs",
    children: breadcrumbs.map((b) => /* @__PURE__ */ jsx("span", {
      children: b.href ? /* @__PURE__ */ jsx("a", {
        href: b.href,
        children: b.text
      }) : b.text
    }))
  });
}, "s_KPD0c5iCcR4"));
function createBreadcrumbs(menu, pathname) {
  if (menu == null ? void 0 : menu.items)
    for (const indexA of menu.items) {
      const breadcrumbA = {
        text: indexA.text
      };
      if (typeof indexA.href === "string")
        breadcrumbA.href = indexA.href;
      if (indexA.href === pathname)
        return [
          breadcrumbA
        ];
      if (indexA.items)
        for (const indexB of indexA.items) {
          const breadcrumbB = {
            text: indexB.text
          };
          if (typeof indexB.href === "string")
            breadcrumbB.href = indexB.href;
          if (indexB.href === pathname)
            return [
              breadcrumbA,
              breadcrumbB
            ];
          if (indexB.items)
            for (const indexC of indexB.items) {
              const breadcrumbC = {
                text: indexC.text
              };
              if (typeof indexC.href === "string")
                breadcrumbC.href = indexC.href;
              if (indexC.href === pathname)
                return [
                  breadcrumbA,
                  breadcrumbB,
                  breadcrumbC
                ];
            }
        }
    }
  return [];
}
const styles$1 = ".menu {\n  background: #eee;\n  padding: 20px 10px;\n}\n\n.menu h5 {\n  margin: 0;\n}\n\n.menu ul {\n  padding-left: 20px;\n  margin: 5px 0 25px 0;\n}\n";
const Menu = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  var _a2;
  useStylesQrl(inlinedQrl(styles$1, "s_v6LX36JbZ0s"));
  const { menu } = gt();
  const loc = Z();
  return /* @__PURE__ */ jsx("aside", {
    class: "menu",
    children: menu ? (_a2 = menu.items) == null ? void 0 : _a2.map((item) => {
      var _a3;
      return /* @__PURE__ */ jsx(Fragment, {
        children: [
          /* @__PURE__ */ jsx("h5", {
            children: item.text
          }),
          /* @__PURE__ */ jsx("ul", {
            children: (_a3 = item.items) == null ? void 0 : _a3.map((item2) => /* @__PURE__ */ jsx("li", {
              children: /* @__PURE__ */ jsx(wt, {
                href: item2.href,
                class: {
                  "is-active": loc.pathname === item2.href
                },
                children: item2.text
              })
            }))
          })
        ]
      });
    }) : null
  });
}, "s_dhJZxl3w0Dw"));
const styles = ".docs main {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  padding: 0;\n  margin: 0;\n}\n\n.docs-content {\n  padding-left: 20px;\n}\n";
const layout_ = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesQrl(inlinedQrl(styles, "s_AtVJN4fMpY8"));
  return /* @__PURE__ */ jsx("div", {
    class: "docs full-screen",
    children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", {
        children: [
          /* @__PURE__ */ jsx(Menu, {}),
          /* @__PURE__ */ jsx("section", {
            class: "docs-content",
            children: [
              /* @__PURE__ */ jsx(Breadcrumbs, {}),
              /* @__PURE__ */ jsx(Slot, {}),
              /* @__PURE__ */ jsx(Footer, {})
            ]
          })
        ]
      })
    ]
  });
}, "s_OtsarNLw0k8"));
const head$c = ({ head: head2 }) => {
  return {
    title: `Docs: ${head2.title}`
  };
};
const DocsLayout_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout_,
  head: head$c
}, Symbol.toStringTag, { value: "Module" }));
const layout = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", {
        children: /* @__PURE__ */ jsx(Slot, {})
      }),
      /* @__PURE__ */ jsx(Footer, {})
    ]
  });
}, "s_PFPbsM5fCRI"));
const Layout_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout
}, Symbol.toStringTag, { value: "Module" }));
const index$8 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    children: /* @__PURE__ */ jsx("h1", {
      style: "font-size: 120px;",
      children: "RICH.ENGINEER"
    })
  });
}, "s_c7dtJCPFvdA"));
const head$b = {
  title: "Welcome to Qwik City"
};
const Index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$8,
  head: head$b
}, Symbol.toStringTag, { value: "Module" }));
const index$7 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    children: [
      /* @__PURE__ */ jsx("h1", {
        children: "About Us"
      }),
      /* @__PURE__ */ jsx("p", {
        children: /* @__PURE__ */ jsx("a", {
          href: "/",
          children: "Home"
        })
      })
    ]
  });
}, "s_SWlR1f9NpBM"));
const head$a = {
  title: "About Us"
};
const Aboutus = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$7,
  head: head$a
}, Symbol.toStringTag, { value: "Module" }));
const index_api = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const store = useStore({
    timestamp: ""
  });
  useClientEffectQrl(inlinedQrl(async () => {
    const [store2] = useLexicalScope();
    const url = `/api/builder.io/oss.json`;
    const rsp = await fetch(url);
    const data = await rsp.json();
    store2.timestamp = data.timestamp;
  }, "s_PQIEB1AoKPQ", [
    store
  ]));
  return /* @__PURE__ */ jsx("div", {
    children: [
      /* @__PURE__ */ jsx("h1", {
        children: "Qwik City Test API!"
      }),
      /* @__PURE__ */ jsx("ul", {
        children: [
          /* @__PURE__ */ jsx("li", {
            children: /* @__PURE__ */ jsx("a", {
              href: "/api/builder.io/oss.json",
              children: "/api/[org]/[user].json"
            })
          }),
          /* @__PURE__ */ jsx("li", {
            children: /* @__PURE__ */ jsx("a", {
              href: "/api/data.json",
              children: "/api/data.json"
            })
          })
        ]
      }),
      /* @__PURE__ */ jsx("p", {
        children: [
          "Timestamp: ",
          store.timestamp
        ]
      })
    ]
  });
}, "s_xkq1SDQ0ilU"));
const ApiIndexapi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index_api
}, Symbol.toStringTag, { value: "Module" }));
const headings$2 = [{
  "text": "Welcome to our Blog!",
  "id": "welcome-to-our-blog",
  "level": 1
}];
const head$9 = {
  "title": "Welcome to our Blog!",
  "meta": [],
  "styles": [],
  "links": []
};
function _createMdxContent$2(props) {
  const _components = Object.assign({
    h1: "h1",
    a: "a",
    span: "span",
    p: "p"
  }, props.components);
  return jsx(Fragment, {
    children: [jsx(_components.h1, {
      id: "welcome-to-our-blog",
      children: [jsx(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#welcome-to-our-blog",
        children: jsx(_components.span, {
          className: "icon icon-link"
        })
      }), "Welcome to our Blog!"]
    }), "\n", jsx(_components.p, {
      children: "Enjoy."
    })]
  });
}
function MDXContent$2(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, Object.assign({}, props, {
    children: jsx(_createMdxContent$2, props)
  })) : _createMdxContent$2(props);
}
const Blog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  headings: headings$2,
  head: head$9,
  default: MDXContent$2
}, Symbol.toStringTag, { value: "Module" }));
const index$6 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    children: [
      /* @__PURE__ */ jsx("h1", {
        children: "Dashboard"
      }),
      /* @__PURE__ */ jsx("p", {
        children: "Welcome to the dashboard."
      })
    ]
  });
}, "s_dMrB5dGrif4"));
const head$8 = {
  title: "Home"
};
const Dashboard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$6,
  head: head$8
}, Symbol.toStringTag, { value: "Module" }));
const index$5 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    children: /* @__PURE__ */ jsx("h1", {
      children: "Welcome to the Docs!"
    })
  });
}, "s_CMs83QdiiAM"));
const head$7 = {
  title: "Welcome!"
};
const Docs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$5,
  head: head$7
}, Symbol.toStringTag, { value: "Module" }));
const onGet$3 = ({ request }) => {
  return {
    timestamp: Date.now(),
    method: request.method,
    url: request.url
  };
};
const ApiData = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  onGet: onGet$3
}, Symbol.toStringTag, { value: "Module" }));
const index$4 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    children: [
      /* @__PURE__ */ jsx("h1", {
        children: "Profile"
      }),
      /* @__PURE__ */ jsx("p", {
        children: "My Profile"
      })
    ]
  });
}, "s_ep1NVkwbuQA"));
const head$6 = {
  title: "Profile"
};
const DashboardProfile = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$4,
  head: head$6
}, Symbol.toStringTag, { value: "Module" }));
const index$3 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx("div", {
    children: [
      /* @__PURE__ */ jsx("h1", {
        children: "Settings"
      }),
      /* @__PURE__ */ jsx("p", {
        children: "My Settings"
      })
    ]
  });
}, "s_TLsZLETEWJU"));
const head$5 = {
  title: "Settings"
};
const DashboardSettings = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$3,
  head: head$5
}, Symbol.toStringTag, { value: "Module" }));
const headings$1 = [{
  "text": "Getting Started",
  "id": "getting-started",
  "level": 1
}, {
  "text": "Creating an app using the CLI",
  "id": "creating-an-app-using-the-cli",
  "level": 2
}, {
  "text": "Running in development",
  "id": "running-in-development",
  "level": 2
}];
const head$4 = {
  "title": "Getting Started",
  "meta": [],
  "styles": [],
  "links": []
};
function _createMdxContent$1(props) {
  const _components = Object.assign({
    h1: "h1",
    a: "a",
    span: "span",
    h2: "h2",
    p: "p",
    ol: "ol",
    li: "li",
    code: "code",
    pre: "pre"
  }, props.components);
  return jsx(Fragment, {
    children: [jsx(_components.h1, {
      id: "getting-started",
      children: [jsx(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#getting-started",
        children: jsx(_components.span, {
          className: "icon icon-link"
        })
      }), "Getting Started"]
    }), "\n", jsx(_components.h2, {
      id: "creating-an-app-using-the-cli",
      children: [jsx(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#creating-an-app-using-the-cli",
        children: jsx(_components.span, {
          className: "icon icon-link"
        })
      }), "Creating an app using the CLI"]
    }), "\n", jsx(_components.p, {
      children: "The first step is to create an application. Qwik comes with a CLI that allows you to create a basic working skeleton of an application. We will use the CLI to create a Todo sample app, and we will use that application to do a walk-through of Qwik so that you can familiarize yourself with it."
    }), "\n", jsx(_components.h2, {
      id: "running-in-development",
      children: [jsx(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#running-in-development",
        children: jsx(_components.span, {
          className: "icon icon-link"
        })
      }), "Running in development"]
    }), "\n", jsx(_components.p, {
      children: "Once the application is download."
    }), "\n", jsx(_components.ol, {
      children: ["\n", jsx(_components.li, {
        children: ["Change into the directory created by the ", jsx(_components.code, {
          children: "npm create qwik@latest"
        }), "."]
      }), "\n"]
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-shell",
        children: [jsx(_components.span, {
          className: "token builtin class-name",
          children: "cd"
        }), " qwik-todo\n"]
      })
    }), "\n", jsx(_components.ol, {
      start: "2",
      children: ["\n", jsx(_components.li, {
        children: "Install NPM modules:"
      }), "\n"]
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-shell",
        children: [jsx(_components.span, {
          className: "token function",
          children: "npm"
        }), " ", jsx(_components.span, {
          className: "token function",
          children: "install"
        }), "\n"]
      })
    }), "\n", jsx(_components.ol, {
      start: "3",
      children: ["\n", jsx(_components.li, {
        children: "Invoke the dev server"
      }), "\n"]
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-shell",
        children: [jsx(_components.span, {
          className: "token function",
          children: "npm"
        }), " start\n"]
      })
    }), "\n", jsx(_components.ol, {
      start: "4",
      children: ["\n", jsx(_components.li, {
        children: "You should see a server running with your To-do application"
      }), "\n"]
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-shell",
        children: ["  vite v2.8.6 dev server running at:\n\n  ", jsx(_components.span, {
          className: "token operator",
          children: ">"
        }), " Local: http://localhost:3000/\n  ", jsx(_components.span, {
          className: "token operator",
          children: ">"
        }), " Network: use ", jsx(_components.span, {
          className: "token variable",
          children: [jsx(_components.span, {
            className: "token variable",
            children: "`"
          }), "--host", jsx(_components.span, {
            className: "token variable",
            children: "`"
          })]
        }), " to expose\n\n  ready ", jsx(_components.span, {
          className: "token keyword",
          children: "in"
        }), " 157ms.\n"]
      })
    }), "\n", jsx(_components.ol, {
      start: "5",
      children: ["\n", jsx(_components.li, {
        children: ["Visit ", jsx(_components.a, {
          href: "http://localhost:3000/",
          children: "http://localhost:3000/"
        }), " to explore the To-do app."]
      }), "\n"]
    })]
  });
}
function MDXContent$1(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, Object.assign({}, props, {
    children: jsx(_createMdxContent$1, props)
  })) : _createMdxContent$1(props);
}
const DocsGettingstarted = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  headings: headings$1,
  head: head$4,
  default: MDXContent$1
}, Symbol.toStringTag, { value: "Module" }));
const headings = [{
  "text": "Overview",
  "id": "overview",
  "level": 1
}];
const head$3 = {
  "title": "Overview",
  "meta": [],
  "styles": [],
  "links": []
};
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: "h1",
    a: "a",
    span: "span",
    p: "p",
    em: "em"
  }, props.components);
  return jsx(Fragment, {
    children: [jsx(_components.h1, {
      id: "overview",
      children: [jsx(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#overview",
        children: jsx(_components.span, {
          className: "icon icon-link"
        })
      }), "Overview"]
    }), "\n", jsx(_components.p, {
      children: ["Qwik is a new kind of web framework that can deliver instant loading web applications at any size or complexity. Your sites and apps can boot with less than 1kb of JS (", jsx(_components.em, {
        children: "including"
      }), " your code, regardless of complexity), and achieve unheard of performance at scale."]
    })]
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, Object.assign({}, props, {
    children: jsx(_createMdxContent, props)
  })) : _createMdxContent(props);
}
const DocsOverview = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  headings,
  head: head$3,
  default: MDXContent
}, Symbol.toStringTag, { value: "Module" }));
const index$2 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const { params } = Z();
  const resource = vt();
  return /* @__PURE__ */ jsx(Fragment, {
    children: [
      /* @__PURE__ */ jsx(Resource, {
        resource,
        onPending: () => /* @__PURE__ */ jsx("p", {
          children: "Loading"
        }),
        onResolved: (product) => {
          if (product == null)
            return /* @__PURE__ */ jsx("h1", {
              children: [
                'Product "',
                params.id,
                '" not found'
              ]
            });
          return /* @__PURE__ */ jsx(Fragment, {
            children: [
              /* @__PURE__ */ jsx("h1", {
                children: [
                  "Product: ",
                  product.productId
                ]
              }),
              /* @__PURE__ */ jsx("p", {
                children: [
                  "Price: ",
                  product.price
                ]
              }),
              /* @__PURE__ */ jsx("p", {
                children: product.description
              })
            ]
          });
        }
      }),
      /* @__PURE__ */ jsx("p", {
        children: "(Artificial response delay of 250ms)"
      }),
      /* @__PURE__ */ jsx("hr", {}),
      /* @__PURE__ */ jsx("ul", {
        children: [
          /* @__PURE__ */ jsx("li", {
            children: /* @__PURE__ */ jsx("a", {
              href: "/products/jacket",
              children: "Jacket"
            })
          }),
          /* @__PURE__ */ jsx("li", {
            children: /* @__PURE__ */ jsx("a", {
              href: "/products/hat",
              children: "Hat"
            })
          }),
          /* @__PURE__ */ jsx("li", {
            children: /* @__PURE__ */ jsx("a", {
              href: "/products/shirt",
              children: "T-Shirt (Redirect to /products/tshirt)"
            })
          }),
          /* @__PURE__ */ jsx("li", {
            children: /* @__PURE__ */ jsx("a", {
              href: "/products/hoodie",
              children: "Hoodie (404 Not Found)"
            })
          })
        ]
      })
    ]
  });
}, "s_dvw4So8VwWo"));
const head$2 = ({ data }) => {
  if (!data)
    return {
      title: `Product not found`
    };
  return {
    title: `Product ${data.productId}, ${data.price}`
  };
};
const onGet$2 = async ({ params, response }) => {
  if (params.id === "shirt")
    throw response.redirect("/products/tshirt");
  const productData = await loadProduct(params.id);
  if (!productData) {
    response.status = 404;
    return productData;
  }
  response.headers.set("Cache-Control", "no-cache, no-store, no-fun");
  return productData;
};
const loadProduct = (productId) => {
  return new Promise((resolve) => setTimeout(() => {
    const productPrice = PRODUCT_DB[productId];
    if (productPrice) {
      const productData = {
        productId,
        price: productPrice,
        description: `Product description here.`
      };
      resolve(productData);
    } else
      resolve(null);
  }, 250));
};
const PRODUCT_DB = {
  hat: "$21.96",
  jacket: "$48.96",
  tshirt: "$18.96"
};
const ProductsId = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$2,
  head: head$2,
  onGet: onGet$2
}, Symbol.toStringTag, { value: "Module" }));
const onGet$1 = ({ request, params }) => {
  return {
    timestamp: Date.now(),
    method: request.method,
    url: request.url,
    params
  };
};
const onPost = async ({ request, response }) => {
  response.headers.set("Content-Type", "text/plain");
  return `HTTP Method: ${request.method}`;
};
const ApiOrgUser = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  onGet: onGet$1,
  onPost
}, Symbol.toStringTag, { value: "Module" }));
const index$1 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const { pathname, params } = Z();
  return /* @__PURE__ */ jsx("div", {
    children: [
      /* @__PURE__ */ jsx("h1", {
        children: [
          "Docs: ",
          params.category,
          " ",
          params.id
        ]
      }),
      /* @__PURE__ */ jsx("p", {
        children: [
          "pathname: ",
          pathname
        ]
      }),
      /* @__PURE__ */ jsx("p", {
        children: [
          "category: ",
          params.category
        ]
      }),
      /* @__PURE__ */ jsx("p", {
        children: [
          "id: ",
          params.id
        ]
      })
    ]
  });
}, "s_3P2cm6Bp6OU"));
const head$1 = ({ params }) => {
  return {
    title: `${params.category} ${params.id}`
  };
};
const DocsCategoryId = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$1,
  head: head$1
}, Symbol.toStringTag, { value: "Module" }));
const index = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const resource = vt();
  return /* @__PURE__ */ jsx("div", {
    children: /* @__PURE__ */ jsx(Resource, {
      resource,
      onResolved: (blog) => /* @__PURE__ */ jsx(Fragment, {
        children: [
          /* @__PURE__ */ jsx("h1", {
            children: blog.blogTitle
          }),
          /* @__PURE__ */ jsx("p", {
            children: blog.blogContent
          })
        ]
      })
    })
  });
}, "s_c5Sx08Cyfjs"));
const onGet = async ({ params, url }) => {
  return {
    blogTitle: `Blog: ${params.slug}`,
    blogContent: `${params.slug}, ${url.pathname}`
  };
};
const head = ({ data }) => {
  return {
    title: data == null ? void 0 : data.blogTitle
  };
};
const BlogQ1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index,
  onGet,
  head
}, Symbol.toStringTag, { value: "Module" }));
const DocsMenu = {
  "text": "Docs",
  "items": [
    {
      "text": "Introduction",
      "items": [
        {
          "text": "Overview",
          "href": "/docs/overview"
        },
        {
          "text": "Getting Started",
          "href": "/docs/getting-started"
        }
      ]
    },
    {
      "text": "Components",
      "items": [
        {
          "text": "Basics",
          "href": "/docs/components/basics"
        },
        {
          "text": "Listeners",
          "href": "/docs/components/listeners"
        }
      ]
    }
  ]
};
const DocsMenu$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DocsMenu
}, Symbol.toStringTag, { value: "Module" }));
const ApiLayoutapi = () => ApiLayoutapi_;
const BlogLayout = () => BlogLayout_;
const DashboardLayout = () => DashboardLayout_;
const DocsLayout = () => DocsLayout_;
const Layout = () => Layout_;
const routes = [
  [/^\/$/, [Layout, () => Index]],
  [/^\/about-us\/?$/, [Layout, () => Aboutus]],
  [/^\/api\/?$/, [Layout, ApiLayoutapi, () => ApiIndexapi]],
  [/^\/blog\/?$/, [Layout, BlogLayout, () => Blog]],
  [/^\/dashboard\/?$/, [DashboardLayout, () => Dashboard]],
  [/^\/docs\/?$/, [DocsLayout, () => Docs]],
  [/^\/api\/data\.json$/, [() => ApiData]],
  [/^\/dashboard\/profile\/?$/, [DashboardLayout, () => DashboardProfile]],
  [/^\/dashboard\/settings\/?$/, [DashboardLayout, () => DashboardSettings]],
  [/^\/docs\/getting-started\/?$/, [DocsLayout, () => DocsGettingstarted]],
  [/^\/docs\/overview\/?$/, [DocsLayout, () => DocsOverview]],
  [/^\/products\/([^/]+?)\/?$/, [Layout, () => ProductsId], ["id"]],
  [/^\/api\/([^/]+?)\/([^/]+?)\.json$/, [() => ApiOrgUser], ["org", "user"]],
  [/^\/docs\/([^/]+?)\/([^/]+?)\/?$/, [DocsLayout, () => DocsCategoryId], ["category", "id"]],
  [/^\/blog(?:\/(.*))?\/?$/, [Layout, BlogLayout, () => BlogQ1], ["slug"]]
];
const menus = [
  ["/docs", () => DocsMenu$1]
];
const qwikCityPlan = {
  routes,
  menus
};
const cityPlan = qwikCityPlan;
const _qwikCityPlan = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cityPlan
}, Symbol.toStringTag, { value: "Module" }));
var HEADERS = Symbol("headers");
var _a;
var HeadersPolyfill = class {
  constructor() {
    this[_a] = {};
  }
  [(_a = HEADERS, Symbol.iterator)]() {
    return this.entries();
  }
  *keys() {
    for (const name of Object.keys(this[HEADERS])) {
      yield name;
    }
  }
  *values() {
    for (const value of Object.values(this[HEADERS])) {
      yield value;
    }
  }
  *entries() {
    for (const name of Object.keys(this[HEADERS])) {
      yield [name, this.get(name)];
    }
  }
  get(name) {
    return this[HEADERS][normalizeHeaderName(name)] || null;
  }
  set(name, value) {
    const normalizedName = normalizeHeaderName(name);
    this[HEADERS][normalizedName] = typeof value !== "string" ? String(value) : value;
  }
  append(name, value) {
    const normalizedName = normalizeHeaderName(name);
    const resolvedValue = this.has(normalizedName) ? `${this.get(normalizedName)}, ${value}` : value;
    this.set(name, resolvedValue);
  }
  delete(name) {
    if (!this.has(name)) {
      return;
    }
    const normalizedName = normalizeHeaderName(name);
    delete this[HEADERS][normalizedName];
  }
  all() {
    return this[HEADERS];
  }
  has(name) {
    return this[HEADERS].hasOwnProperty(normalizeHeaderName(name));
  }
  forEach(callback, thisArg) {
    for (const name in this[HEADERS]) {
      if (this[HEADERS].hasOwnProperty(name)) {
        callback.call(thisArg, this[HEADERS][name], name, this);
      }
    }
  }
};
var HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function normalizeHeaderName(name) {
  if (typeof name !== "string") {
    name = String(name);
  }
  if (HEADERS_INVALID_CHARACTERS.test(name) || name.trim() === "") {
    throw new TypeError("Invalid character in header field name");
  }
  return name.toLowerCase();
}
function createHeaders() {
  return new (typeof Headers === "function" ? Headers : HeadersPolyfill)();
}
var ErrorResponse = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
function notFoundHandler(requestCtx) {
  const status = 404;
  const message = "Not Found";
  return minimalHtmlResponse(requestCtx, status, message);
}
function errorHandler(requestCtx, e) {
  const status = 500;
  let message = "Server Error";
  let stack = void 0;
  if (e != null) {
    if (typeof e === "object") {
      if (typeof e.message === "string") {
        message = e.message;
      }
      if (e.stack != null) {
        stack = String(e.stack);
      }
    } else {
      message = String(e);
    }
  }
  return minimalHtmlResponse(requestCtx, status, message, stack);
}
function errorResponse(requestCtx, errorResponse2) {
  return minimalHtmlResponse(requestCtx, errorResponse2.status, errorResponse2.message, errorResponse2.stack);
}
function minimalHtmlResponse(requestCtx, status, message, stack) {
  const { response } = requestCtx;
  const width = typeof message === "string" ? "600px" : "300px";
  const color = status >= 500 ? COLOR_500 : COLOR_400;
  const html = `<!DOCTYPE html>
<html data-qwik-city-status="${status}">
<head>
  <meta charset="utf-8">
  <title>${status} ${message}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { color: ${color}; background-color: #fafafa; padding: 30px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
    p { max-width: ${width}; margin: 60px auto 30px auto; background: white; border-radius: 5px; box-shadow: 0px 0px 50px -20px ${color}; overflow: hidden; }
    strong { display: inline-block; padding: 15px; background: ${color}; color: white; }
    span { display: inline-block; padding: 15px; }
    pre { max-width: 580px; margin: 0 auto; }
  </style>
</head>
<body>
  <p>
    <strong>${status}</strong>
    <span>${message}</span>
  </p>
  ${stack ? `<pre><code>${stack}</code></pre>` : ``}
</body>
</html>
`;
  const headers = createHeaders();
  headers.set("Content-Type", "text/html; charset=utf-8");
  return response(status, headers, async (stream) => {
    stream.write(html);
  });
}
var COLOR_400 = "#5249d9";
var COLOR_500 = "#bd16bd";
var MODULE_CACHE = /* @__PURE__ */ new WeakMap();
var loadRoute = async (routes2, menus2, cacheModules, pathname) => {
  if (Array.isArray(routes2)) {
    for (const route of routes2) {
      const match = route[0].exec(pathname);
      if (match) {
        const loaders = route[1];
        const params = getRouteParams(route[2], match);
        const mods = new Array(loaders.length);
        const pendingLoads = [];
        const menuLoader = getMenuLoader(menus2, pathname);
        let menu = void 0;
        loaders.forEach((moduleLoader, i) => {
          loadModule(moduleLoader, pendingLoads, (routeModule) => mods[i] = routeModule, cacheModules);
        });
        loadModule(menuLoader, pendingLoads, (menuModule) => menu = menuModule == null ? void 0 : menuModule.default, cacheModules);
        if (pendingLoads.length > 0) {
          await Promise.all(pendingLoads);
        }
        return { params, mods, menu };
      }
    }
  }
  return null;
};
var loadModule = (moduleLoader, pendingLoads, moduleSetter, cacheModules) => {
  if (typeof moduleLoader === "function") {
    const loadedModule = MODULE_CACHE.get(moduleLoader);
    if (loadedModule) {
      moduleSetter(loadedModule);
    } else {
      const l = moduleLoader();
      if (typeof l.then === "function") {
        pendingLoads.push(l.then((loadedModule2) => {
          if (cacheModules !== false) {
            MODULE_CACHE.set(moduleLoader, loadedModule2);
          }
          moduleSetter(loadedModule2);
        }));
      } else if (l) {
        moduleSetter(l);
      }
    }
  }
};
var getMenuLoader = (menus2, pathname) => {
  if (menus2) {
    const menu = menus2.find((m) => m[0] === pathname || pathname.startsWith(m[0] + "/"));
    if (menu) {
      return menu[1];
    }
  }
  return void 0;
};
var getRouteParams = (paramNames, match) => {
  const params = {};
  if (Array.isArray(paramNames)) {
    for (let i = 0; i < paramNames.length; i++) {
      params[paramNames[i]] = match ? match[i + 1] : "";
    }
  }
  return params;
};
var RedirectResponse = class {
  constructor(url, status, headers) {
    this.url = url;
    this.location = url;
    this.status = isRedirectStatus(status) ? status : 307;
    this.headers = headers || createHeaders();
    this.headers.set("Location", this.location);
    this.headers.delete("Cache-Control");
  }
};
function redirectResponse(requestCtx, responseRedirect) {
  return requestCtx.response(responseRedirect.status, responseRedirect.headers, async () => {
  });
}
function isRedirectStatus(status) {
  return typeof status === "number" && status >= 301 && status <= 308;
}
async function loadUserResponse(requestCtx, params, routeModules, trailingSlash) {
  const { request, url } = requestCtx;
  const { pathname } = url;
  const userResponse = {
    type: "endpoint",
    url,
    params,
    status: 200,
    headers: createHeaders(),
    resolvedBody: void 0,
    pendingBody: void 0
  };
  let hasRequestMethodHandler = false;
  const hasPageRenderer = isLastModulePageRoute(routeModules);
  if (hasPageRenderer && pathname !== "/") {
    if (trailingSlash) {
      if (!pathname.endsWith("/")) {
        throw new RedirectResponse(pathname + "/" + url.search, 308);
      }
    } else {
      if (pathname.endsWith("/")) {
        throw new RedirectResponse(pathname.slice(0, pathname.length - 1) + url.search, 308);
      }
    }
  }
  let middlewareIndex = -1;
  const abort = () => {
    middlewareIndex = ABORT_INDEX;
  };
  const redirect = (url2, status) => {
    return new RedirectResponse(url2, status, userResponse.headers);
  };
  const error = (status, message) => {
    return new ErrorResponse(status, message);
  };
  const next = async () => {
    middlewareIndex++;
    while (middlewareIndex < routeModules.length) {
      const endpointModule = routeModules[middlewareIndex];
      let reqHandler = void 0;
      switch (request.method) {
        case "GET": {
          reqHandler = endpointModule.onGet;
          break;
        }
        case "POST": {
          reqHandler = endpointModule.onPost;
          break;
        }
        case "PUT": {
          reqHandler = endpointModule.onPut;
          break;
        }
        case "PATCH": {
          reqHandler = endpointModule.onPatch;
          break;
        }
        case "OPTIONS": {
          reqHandler = endpointModule.onOptions;
          break;
        }
        case "HEAD": {
          reqHandler = endpointModule.onHead;
          break;
        }
        case "DELETE": {
          reqHandler = endpointModule.onDelete;
          break;
        }
      }
      reqHandler = reqHandler || endpointModule.onRequest;
      if (typeof reqHandler === "function") {
        hasRequestMethodHandler = true;
        const response = {
          get status() {
            return userResponse.status;
          },
          set status(code) {
            userResponse.status = code;
          },
          get headers() {
            return userResponse.headers;
          },
          redirect,
          error
        };
        const requstEv = {
          request,
          url: new URL(url),
          params: { ...params },
          response,
          next,
          abort
        };
        const syncData = reqHandler(requstEv);
        if (typeof syncData === "function") {
          userResponse.pendingBody = createPendingBody(syncData);
        } else if (syncData !== null && typeof syncData === "object" && typeof syncData.then === "function") {
          const asyncResolved = await syncData;
          if (typeof asyncResolved === "function") {
            userResponse.pendingBody = createPendingBody(asyncResolved);
          } else {
            userResponse.resolvedBody = asyncResolved;
          }
        } else {
          userResponse.resolvedBody = syncData;
        }
      }
      middlewareIndex++;
    }
  };
  await next();
  if (isRedirectStatus(userResponse.status) && userResponse.headers.has("Location")) {
    throw new RedirectResponse(userResponse.headers.get("Location"), userResponse.status, userResponse.headers);
  }
  if (hasPageRenderer && request.headers.get("Accept") !== "application/json") {
    userResponse.type = "page";
  } else {
    if (!hasRequestMethodHandler) {
      throw new ErrorResponse(405, `Method Not Allowed`);
    }
  }
  return userResponse;
}
function createPendingBody(cb) {
  return new Promise((resolve, reject) => {
    try {
      const rtn = cb();
      if (rtn !== null && typeof rtn === "object" && typeof rtn.then === "function") {
        rtn.then(resolve, reject);
      } else {
        resolve(rtn);
      }
    } catch (e) {
      reject(e);
    }
  });
}
function isLastModulePageRoute(routeModules) {
  const lastRouteModule = routeModules[routeModules.length - 1];
  return lastRouteModule && typeof lastRouteModule.default === "function";
}
var ABORT_INDEX = 999999999;
function endpointHandler(requestCtx, userResponse) {
  const { pendingBody, resolvedBody, status, headers } = userResponse;
  const { response } = requestCtx;
  if (pendingBody === void 0 && resolvedBody === void 0) {
    return response(status, headers, asyncNoop);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  const isJson = headers.get("Content-Type").includes("json");
  return response(status, headers, async ({ write }) => {
    const body = pendingBody !== void 0 ? await pendingBody : resolvedBody;
    if (body !== void 0) {
      if (isJson) {
        write(JSON.stringify(body));
      } else {
        const type = typeof body;
        if (type === "string") {
          write(body);
        } else if (type === "number" || type === "boolean") {
          write(String(body));
        } else {
          write(body);
        }
      }
    }
  });
}
var asyncNoop = async () => {
};
function pageHandler(requestCtx, userResponse, render2, opts) {
  const { status, headers } = userResponse;
  const { response, url } = requestCtx;
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "text/html; charset=utf-8");
  }
  return response(status, headers, async (stream) => {
    const result = await render2({
      stream,
      url: url.href,
      envData: getQwikCityEnvData(userResponse),
      ...opts
    });
    if ((typeof result).html === "string") {
      stream.write(result.html);
    }
  });
}
function getQwikCityEnvData(userResponse) {
  const { url, params, pendingBody, resolvedBody, status } = userResponse;
  return {
    qwikcity: {
      route: {
        href: url.href,
        pathname: url.pathname,
        params: { ...params },
        query: Object.fromEntries(url.searchParams.entries())
      },
      response: {
        body: pendingBody || resolvedBody,
        status
      }
    }
  };
}
async function requestHandler(requestCtx, render2, opts) {
  try {
    const pathname = requestCtx.url.pathname;
    const { routes: routes2, menus: menus2, cacheModules, trailingSlash } = { ...cityPlan, ...opts };
    const loadedRoute = await loadRoute(routes2, menus2, cacheModules, pathname);
    if (loadedRoute) {
      const { mods, params } = loadedRoute;
      const userResponse = await loadUserResponse(requestCtx, params, mods, trailingSlash);
      if (userResponse.type === "endpoint") {
        return endpointHandler(requestCtx, userResponse);
      }
      return pageHandler(requestCtx, userResponse, render2, opts);
    }
  } catch (e) {
    if (e instanceof RedirectResponse) {
      return redirectResponse(requestCtx, e);
    }
    if (e instanceof ErrorResponse) {
      return errorResponse(requestCtx, e);
    }
    return errorHandler(requestCtx, e);
  }
  return null;
}
function qwikCity(render2, opts) {
  async function onRequest({ request, next, waitUntil }) {
    try {
      const url = new URL(request.url);
      const useCache = url.hostname !== "localhost" && request.method === "GET";
      const cacheKey = new Request(url.href, request);
      const cache = useCache ? await caches.open("custom:qwikcity") : null;
      if (cache) {
        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }
      }
      const requestCtx = {
        url,
        request,
        response: (status, headers, body) => {
          const { readable, writable } = new TransformStream();
          const writer = writable.getWriter();
          body({
            write: (chunk) => {
              if (typeof chunk === "string") {
                const encoder = new TextEncoder();
                writer.write(encoder.encode(chunk));
              } else {
                writer.write(chunk);
              }
            }
          }).finally(() => {
            writer.close();
          });
          const response = new Response(readable, { status, headers });
          if (response.ok && cache && response.headers.has("Cache-Control")) {
            waitUntil(cache.put(cacheKey, response.clone()));
          }
          return response;
        }
      };
      const handledResponse = await requestHandler(requestCtx, render2, opts);
      if (handledResponse) {
        return handledResponse;
      }
      const nextResponse = await next();
      if (nextResponse.status === 404) {
        const notFoundResponse = await notFoundHandler(requestCtx);
        return notFoundResponse;
      }
      return nextResponse;
    } catch (e) {
      return new Response(String(e || "Error"), {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
  return onRequest;
}
/**
 * @license
 * @builder.io/qwik/server 0.0.100
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
if (typeof global == "undefined") {
  const g = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {};
  g.global = g;
}
var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x2)(function(x2) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x2 + '" is not supported');
});
function createTimer() {
  if (typeof performance === "undefined") {
    return () => 0;
  }
  const start = performance.now();
  return () => {
    const end = performance.now();
    const delta = end - start;
    return delta / 1e6;
  };
}
function getBuildBase(opts) {
  let base = opts.base;
  if (typeof base === "string") {
    if (!base.endsWith("/")) {
      base += "/";
    }
    return base;
  }
  return "/build/";
}
function createPlatform(document2, opts, mapper) {
  if (!document2 || document2.nodeType !== 9) {
    throw new Error(`Invalid Document implementation`);
  }
  const mapperFn = opts.symbolMapper ? opts.symbolMapper : (symbolName) => {
    if (mapper) {
      const hash = getSymbolHash(symbolName);
      const result = mapper[hash];
      if (!result) {
        console.error("Cannot resolve symbol", symbolName, "in", mapper);
      }
      return result;
    }
  };
  const serverPlatform = {
    isServer: true,
    async importSymbol(_element, qrl, symbolName) {
      let [modulePath] = String(qrl).split("#");
      if (!modulePath.endsWith(".js")) {
        modulePath += ".js";
      }
      const module = __require(modulePath);
      if (!(symbolName in module)) {
        throw new Error(`Q-ERROR: missing symbol '${symbolName}' in module '${modulePath}'.`);
      }
      const symbol = module[symbolName];
      return symbol;
    },
    raf: () => {
      console.error("server can not rerender");
      return Promise.resolve();
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol(symbolName) {
      return mapperFn(symbolName, mapper);
    }
  };
  return serverPlatform;
}
async function setServerPlatform(document2, opts, mapper) {
  const platform = createPlatform(document2, opts, mapper);
  setPlatform(document2, platform);
}
var getSymbolHash = (symbolName) => {
  const index2 = symbolName.lastIndexOf("_");
  if (index2 > -1) {
    return symbolName.slice(index2 + 1);
  }
  return symbolName;
};
var QWIK_LOADER_DEFAULT_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>c(t,e,n,o)))},s=(e,t,n)=>e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0})),i=e=>{throw Error("QWIK "+e)},a=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),c=async(n,r,c,b)=>{n.hasAttribute("preventdefault:"+c)&&b.preventDefault();const u=n.getAttribute("on"+r+":"+c);if(u)for(const r of u.split("\\n")){const c=a(n,r);if(c){const r=l(c),a=(window[c.pathname]||(d=await import(c.href.split("#")[0]),Object.values(d).find(e)||d))[r]||i(c+" does not export "+r),u=t[o];if(n.isConnected)try{t[o]=[n,b,c],a(b,n,c)}finally{t[o]=u,s(n,"qsymbol",r)}}}var d},l=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",b=(e,t)=>{for(t=e.target,r("-document",e.type,e);t&&t.getAttribute;)c(t,"",e.type,e),t=e.bubbles?t.parentElement:null},u=e=>{e.target,r("-window",e.type,e)},d=e=>{if(e=t.readyState,!n&&("interactive"==e||"complete"==e)&&(n=1,r("","qinit",new CustomEvent("qinit")),"undefined"!=typeof IntersectionObserver)){const e=new IntersectionObserver((t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),c(n.target,"","qvisible",new CustomEvent("qvisible",{bubbles:!1,detail:n})))}));t.qO=e,t.querySelectorAll("[on\\\\:qvisible]").forEach((t=>e.observe(t)))}},f=e=>{document.addEventListener(e,b,{capture:!0}),window.addEventListener(e,u)};if(!t.qR){t.qR=1;{const e=t.querySelector("script[events]");if(e)e.getAttribute("events").split(/[\\s,;]+/).forEach(f);else for(const e in t)e.startsWith("on")&&f(e.slice(2))}t.addEventListener("readystatechange",d),d()}})(document)})();';
var QWIK_LOADER_DEFAULT_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized, prefetchWorker) => {\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const emitEvent = (el, eventName, detail) => el.dispatchEvent(new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: !0,\n            composed: !0\n        }));\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrValue = element.getAttribute("on" + onPrefix + ":" + eventName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (window[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                handler(ev, element, url);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                emitEvent(element, "qsymbol", symbolName);\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = (ev, element) => {\n            element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                dispatch(element, "", ev.type, ev);\n                element = ev.bubbles ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = (ev, element) => {\n            ev.target;\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = readyState => {\n            readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", new CustomEvent("qinit"));\n                if ("undefined" != typeof IntersectionObserver) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", new CustomEvent("qvisible", {\n                                    bubbles: !1,\n                                    detail: entry\n                                }));\n                            }\n                        }\n                    }));\n                    doc.qO = observer;\n                    doc.querySelectorAll("[on\\\\:qvisible]").forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addDocEventListener = eventName => {\n            document.addEventListener(eventName, processDocumentEvent, {\n                capture: !0\n            });\n            window.addEventListener(eventName, processWindowEvent);\n        };\n        if (!doc.qR) {\n            doc.qR = 1;\n            {\n                const scriptTag = doc.querySelector("script[events]");\n                if (scriptTag) {\n                    scriptTag.getAttribute("events").split(/[\\s,;]+/).forEach(addDocEventListener);\n                } else {\n                    for (const key in doc) {\n                        key.startsWith("on") && addDocEventListener(key.slice(2));\n                    }\n                }\n            }\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
var QWIK_LOADER_OPTIMIZE_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>c(t,e,n,o)))},s=(e,t,n)=>e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0})),i=e=>{throw Error("QWIK "+e)},a=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),c=async(n,r,c,b)=>{n.hasAttribute("preventdefault:"+c)&&b.preventDefault();const d=n.getAttribute("on"+r+":"+c);if(d)for(const r of d.split("\\n")){const c=a(n,r);if(c){const r=l(c),a=(window[c.pathname]||(u=await import(c.href.split("#")[0]),Object.values(u).find(e)||u))[r]||i(c+" does not export "+r),d=t[o];if(n.isConnected)try{t[o]=[n,b,c],a(b,n,c)}finally{t[o]=d,s(n,"qsymbol",r)}}}var u},l=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",b=(e,t)=>{for(t=e.target,r("-document",e.type,e);t&&t.getAttribute;)c(t,"",e.type,e),t=e.bubbles?t.parentElement:null},d=e=>{e.target,r("-window",e.type,e)},u=e=>{if(e=t.readyState,!n&&("interactive"==e||"complete"==e)&&(n=1,r("","qinit",new CustomEvent("qinit")),"undefined"!=typeof IntersectionObserver)){const e=new IntersectionObserver((t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),c(n.target,"","qvisible",new CustomEvent("qvisible",{bubbles:!1,detail:n})))}));t.qO=e,t.querySelectorAll("[on\\\\:qvisible]").forEach((t=>e.observe(t)))}};t.qR||(t.qR=1,window.qEvents.forEach((e=>{document.addEventListener(e,b,{capture:!0}),window.addEventListener(e,d)})),t.addEventListener("readystatechange",u),u())})(document)})();';
var QWIK_LOADER_OPTIMIZE_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized, prefetchWorker) => {\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const emitEvent = (el, eventName, detail) => el.dispatchEvent(new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: !0,\n            composed: !0\n        }));\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrValue = element.getAttribute("on" + onPrefix + ":" + eventName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (window[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                handler(ev, element, url);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                emitEvent(element, "qsymbol", symbolName);\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = (ev, element) => {\n            element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                dispatch(element, "", ev.type, ev);\n                element = ev.bubbles ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = (ev, element) => {\n            ev.target;\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = readyState => {\n            readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", new CustomEvent("qinit"));\n                if ("undefined" != typeof IntersectionObserver) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", new CustomEvent("qvisible", {\n                                    bubbles: !1,\n                                    detail: entry\n                                }));\n                            }\n                        }\n                    }));\n                    doc.qO = observer;\n                    doc.querySelectorAll("[on\\\\:qvisible]").forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addDocEventListener = eventName => {\n            document.addEventListener(eventName, processDocumentEvent, {\n                capture: !0\n            });\n            window.addEventListener(eventName, processWindowEvent);\n        };\n        if (!doc.qR) {\n            doc.qR = 1;\n            window.qEvents.forEach(addDocEventListener);\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
function getQwikLoaderScript(opts = {}) {
  if (Array.isArray(opts.events) && opts.events.length > 0) {
    const loader = opts.debug ? QWIK_LOADER_OPTIMIZE_DEBUG : QWIK_LOADER_OPTIMIZE_MINIFIED;
    return loader.replace("window.qEvents", JSON.stringify(opts.events));
  }
  return opts.debug ? QWIK_LOADER_DEFAULT_DEBUG : QWIK_LOADER_DEFAULT_MINIFIED;
}
function workerFetchScript() {
  const fetch2 = `Promise.all(e.data.map(u=>fetch(u))).finally(()=>{setTimeout(postMessage({}),9999)})`;
  const workerBody = `onmessage=(e)=>{${fetch2}}`;
  const blob = `new Blob(['${workerBody}'],{type:"text/javascript"})`;
  const url = `URL.createObjectURL(${blob})`;
  let s = `const w=new Worker(${url});`;
  s += `w.postMessage(u.map(u=>new URL(u,origin)+''));`;
  s += `w.onmessage=()=>{w.terminate()};`;
  return s;
}
function flattenPrefetchResources(prefetchResources) {
  const urls = [];
  const addPrefetchResource = (prefetchResources2) => {
    if (Array.isArray(prefetchResources2)) {
      for (const prefetchResource of prefetchResources2) {
        if (!urls.includes(prefetchResource.url)) {
          urls.push(prefetchResource.url);
          addPrefetchResource(prefetchResource.imports);
        }
      }
    }
  };
  addPrefetchResource(prefetchResources);
  return urls;
}
function applyPrefetchImplementation(opts, prefetchResources) {
  const { prefetchStrategy } = opts;
  if (prefetchStrategy !== null) {
    const prefetchImpl = normalizePrefetchImplementation(prefetchStrategy == null ? void 0 : prefetchStrategy.implementation);
    if (prefetchImpl.linkInsert === "html-append") {
      return linkHtmlImplementation(prefetchResources, prefetchImpl);
    } else if (prefetchImpl.linkInsert === "js-append") {
      return linkJsImplementation(prefetchResources, prefetchImpl);
    } else if (prefetchImpl.workerFetchInsert === "always") {
      return workerFetchImplementation(prefetchResources);
    }
  }
  return null;
}
function linkHtmlImplementation(prefetchResources, prefetchImpl) {
  const urls = flattenPrefetchResources(prefetchResources);
  const rel = prefetchImpl.linkRel || "prefetch";
  const children = [];
  for (const url of urls) {
    const attributes = {};
    attributes["href"] = url;
    attributes["rel"] = rel;
    if (rel === "prefetch" || rel === "preload") {
      if (url.endsWith(".js")) {
        attributes["as"] = "script";
      }
    }
    children.push(jsx("link", attributes, void 0));
  }
  if (prefetchImpl.workerFetchInsert === "always") {
    children.push(workerFetchImplementation(prefetchResources));
  }
  return jsx(Fragment, { children });
}
function linkJsImplementation(prefetchResources, prefetchImpl) {
  const rel = prefetchImpl.linkRel || "prefetch";
  let s = ``;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `let supportsLinkRel = true;`;
  }
  s += `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += `u.map((u,i)=>{`;
  s += `const l=document.createElement('link');`;
  s += `l.setAttribute("href",u);`;
  s += `l.setAttribute("rel","${rel}");`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(i===0){`;
    s += `try{`;
    s += `supportsLinkRel=l.relList.supports("${rel}");`;
    s += `}catch(e){}`;
    s += `}`;
  }
  s += `document.body.appendChild(l);`;
  s += `});`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(!supportsLinkRel){`;
    s += workerFetchScript();
    s += `}`;
  }
  if (prefetchImpl.workerFetchInsert === "always") {
    s += workerFetchScript();
  }
  return jsx("script", {
    type: "module",
    dangerouslySetInnerHTML: s
  });
}
function workerFetchImplementation(prefetchResources) {
  let s = `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += workerFetchScript();
  return jsx("script", {
    type: "module",
    dangerouslySetInnerHTML: s
  });
}
function normalizePrefetchImplementation(input) {
  if (typeof input === "string") {
    switch (input) {
      case "link-prefetch-html": {
        return {
          linkInsert: "html-append",
          linkRel: "prefetch",
          workerFetchInsert: null
        };
      }
      case "link-prefetch": {
        return {
          linkInsert: "js-append",
          linkRel: "prefetch",
          workerFetchInsert: "no-link-support"
        };
      }
      case "link-preload-html": {
        return {
          linkInsert: "html-append",
          linkRel: "preload",
          workerFetchInsert: null
        };
      }
      case "link-preload": {
        return {
          linkInsert: "js-append",
          linkRel: "preload",
          workerFetchInsert: "no-link-support"
        };
      }
      case "link-modulepreload-html": {
        return {
          linkInsert: "html-append",
          linkRel: "modulepreload",
          workerFetchInsert: null
        };
      }
      case "link-modulepreload": {
        return {
          linkInsert: "js-append",
          linkRel: "modulepreload",
          workerFetchInsert: "no-link-support"
        };
      }
    }
    return {
      linkInsert: null,
      linkRel: null,
      workerFetchInsert: "always"
    };
  }
  if (input && typeof input === "object") {
    return input;
  }
  const defaultImplementation = {
    linkInsert: "html-append",
    linkRel: "prefetch",
    workerFetchInsert: "always"
  };
  return defaultImplementation;
}
[
  "onClick$",
  "onDblClick$",
  "onContextMenu$",
  "onAuxClick$",
  "onPointerDown$",
  "onPointerUp$",
  "onPointerMove$",
  "onPointerOver$",
  "onPointerEnter$",
  "onPointerLeave$",
  "onPointerOut$",
  "onPointerCancel$",
  "onGotPointerCapture$",
  "onLostPointerCapture$",
  "onTouchStart$",
  "onTouchEnd$",
  "onTouchMove$",
  "onTouchCancel$",
  "onMouseDown$",
  "onMouseUp$",
  "onMouseMove$",
  "onMouseEnter$",
  "onMouseLeave$",
  "onMouseOver$",
  "onMouseOut$",
  "onWheel$",
  "onGestureStart$",
  "onGestureChange$",
  "onGestureEnd$",
  "onKeyDown$",
  "onKeyUp$",
  "onKeyPress$",
  "onInput$",
  "onChange$",
  "onSearch$",
  "onInvalid$",
  "onBeforeInput$",
  "onSelect$",
  "onFocusIn$",
  "onFocusOut$",
  "onFocus$",
  "onBlur$",
  "onSubmit$",
  "onReset$",
  "onScroll$"
].map((n) => n.toLowerCase());
[
  "useClientEffect$",
  "useEffect$",
  "component$",
  "useStyles$",
  "useStyles$"
].map((n) => n.toLowerCase());
function getValidManifest(manifest2) {
  if (manifest2 != null && manifest2.mapping != null && typeof manifest2.mapping === "object" && manifest2.symbols != null && typeof manifest2.symbols === "object" && manifest2.bundles != null && typeof manifest2.bundles === "object") {
    return manifest2;
  }
  return void 0;
}
function getPrefetchResources(snapshotResult, opts, mapper) {
  const manifest2 = getValidManifest(opts.manifest);
  if (manifest2 && mapper) {
    const prefetchStrategy = opts.prefetchStrategy;
    const buildBase = getBuildBase(opts);
    if (prefetchStrategy !== null) {
      if (!prefetchStrategy || !prefetchStrategy.symbolsToPrefetch || prefetchStrategy.symbolsToPrefetch === "auto") {
        return getAutoPrefetch(snapshotResult, manifest2, mapper, buildBase);
      }
      if (typeof prefetchStrategy.symbolsToPrefetch === "function") {
        try {
          return prefetchStrategy.symbolsToPrefetch({ manifest: manifest2 });
        } catch (e) {
          console.error("getPrefetchUrls, symbolsToPrefetch()", e);
        }
      }
    }
  }
  return [];
}
function getAutoPrefetch(snapshotResult, manifest2, mapper, buildBase) {
  const prefetchResources = [];
  const listeners = snapshotResult == null ? void 0 : snapshotResult.listeners;
  const stateObjs = snapshotResult == null ? void 0 : snapshotResult.objs;
  const urls = /* @__PURE__ */ new Set();
  if (Array.isArray(listeners)) {
    for (const prioritizedSymbolName in mapper) {
      const hasSymbol = listeners.some((l) => {
        return l.qrl.getHash() === prioritizedSymbolName;
      });
      if (hasSymbol) {
        addBundle(manifest2, urls, prefetchResources, buildBase, mapper[prioritizedSymbolName][1]);
      }
    }
  }
  if (Array.isArray(stateObjs)) {
    for (const obj of stateObjs) {
      if (isQrl(obj)) {
        const qrlSymbolName = obj.getHash();
        const resolvedSymbol = mapper[qrlSymbolName];
        if (resolvedSymbol) {
          addBundle(manifest2, urls, prefetchResources, buildBase, resolvedSymbol[0]);
        }
      }
    }
  }
  return prefetchResources;
}
function addBundle(manifest2, urls, prefetchResources, buildBase, bundleFileName) {
  const url = buildBase + bundleFileName;
  if (!urls.has(url)) {
    urls.add(url);
    const bundle = manifest2.bundles[bundleFileName];
    if (bundle) {
      const prefetchResource = {
        url,
        imports: []
      };
      prefetchResources.push(prefetchResource);
      if (Array.isArray(bundle.imports)) {
        for (const importedFilename of bundle.imports) {
          addBundle(manifest2, urls, prefetchResource.imports, buildBase, importedFilename);
        }
      }
    }
  }
}
var isQrl = (value) => {
  return typeof value === "function" && typeof value.getSymbol === "function";
};
function createEl(tagName, doc) {
  return {
    nodeType: tagName === ":virtual" ? 111 : 1,
    nodeName: tagName.toUpperCase(),
    localName: tagName,
    ownerDocument: doc,
    isConnected: true,
    ["__ctx__"]: null,
    ["q:id"]: null
  };
}
function createSimpleDocument() {
  const doc = {
    nodeType: 9,
    parentElement: null,
    ownerDocument: null,
    createElement(tagName) {
      return createEl(tagName, doc);
    }
  };
  return doc;
}
var DOCTYPE = "<!DOCTYPE html>";
async function renderToStream(rootNode, opts) {
  var _a2, _b, _c, _d, _e, _f;
  let stream = opts.stream;
  let bufferSize = 0;
  let totalSize = 0;
  let networkFlushes = 0;
  let firstFlushTime = 0;
  const doc = createSimpleDocument();
  const inOrderStreaming = (_b = (_a2 = opts.streaming) == null ? void 0 : _a2.inOrder) != null ? _b : {
    strategy: "auto",
    initialChunkSize: 3e4,
    minimunChunkSize: 1024
  };
  const containerTagName = (_c = opts.containerTagName) != null ? _c : "html";
  const buffer = [];
  const nativeStream = stream;
  const firstFlushTimer = createTimer();
  function flush() {
    buffer.forEach((chunk) => nativeStream.write(chunk));
    buffer.length = 0;
    bufferSize = 0;
    networkFlushes++;
    if (networkFlushes === 1) {
      firstFlushTime = firstFlushTimer();
    }
  }
  function enqueue(chunk) {
    bufferSize += chunk.length;
    totalSize += chunk.length;
    buffer.push(chunk);
  }
  switch (inOrderStreaming.strategy) {
    case "disabled":
      stream = {
        write: enqueue
      };
      break;
    case "auto":
      let count = 0;
      const minimunChunkSize = (_d = inOrderStreaming.minimunChunkSize) != null ? _d : 0;
      const initialChunkSize = (_e = inOrderStreaming.initialChunkSize) != null ? _e : 0;
      stream = {
        write(chunk) {
          enqueue(chunk);
          if (chunk === "<!--qkssr-pu-->") {
            count++;
          } else if (count > 0 && chunk === "<!--qkssr-po-->") {
            count--;
          }
          const chunkSize = networkFlushes === 0 ? initialChunkSize : minimunChunkSize;
          if (count === 0 && bufferSize >= chunkSize) {
            flush();
          }
        }
      };
      break;
  }
  if (containerTagName === "html") {
    stream.write(DOCTYPE);
  } else {
    if (opts.qwikLoader) {
      if (opts.qwikLoader.include === void 0) {
        opts.qwikLoader.include = "never";
      }
      if (opts.qwikLoader.position === void 0) {
        opts.qwikLoader.position = "bottom";
      }
    } else {
      opts.qwikLoader = {
        include: "never"
      };
    }
  }
  if (!opts.manifest) {
    console.warn("Missing client manifest, loading symbols in the client might 404");
  }
  const buildBase = getBuildBase(opts);
  const mapper = computeSymbolMapper(opts.manifest);
  await setServerPlatform(doc, opts, mapper);
  let prefetchResources = [];
  let snapshotResult = null;
  const injections = (_f = opts.manifest) == null ? void 0 : _f.injections;
  const beforeContent = injections ? injections.map((injection) => jsx(injection.tag, injection.attributes)) : void 0;
  const renderTimer = createTimer();
  let renderTime = 0;
  let snapshotTime = 0;
  await renderSSR(doc, rootNode, {
    stream,
    containerTagName,
    envData: opts.envData,
    url: opts.url instanceof URL ? opts.url.href : opts.url,
    base: buildBase,
    beforeContent,
    beforeClose: async (contexts, containerState) => {
      var _a3, _b2, _c2;
      renderTime = renderTimer();
      const snapshotTimer = createTimer();
      snapshotResult = await _pauseFromContexts(contexts, containerState);
      prefetchResources = getPrefetchResources(snapshotResult, opts, mapper);
      const children = [
        jsx("script", {
          type: "qwik/json",
          dangerouslySetInnerHTML: escapeText(JSON.stringify(snapshotResult.state))
        })
      ];
      if (prefetchResources.length > 0) {
        children.push(applyPrefetchImplementation(opts, prefetchResources));
      }
      const needLoader = !snapshotResult || snapshotResult.mode !== "static";
      const includeMode = (_b2 = (_a3 = opts.qwikLoader) == null ? void 0 : _a3.include) != null ? _b2 : "auto";
      const includeLoader = includeMode === "always" || includeMode === "auto" && needLoader;
      if (includeLoader) {
        const qwikLoaderScript = getQwikLoaderScript({
          events: (_c2 = opts.qwikLoader) == null ? void 0 : _c2.events,
          debug: opts.debug
        });
        children.push(jsx("script", {
          id: "qwikloader",
          dangerouslySetInnerHTML: qwikLoaderScript
        }));
      }
      snapshotTime = snapshotTimer();
      return jsx(Fragment, { children });
    }
  });
  flush();
  const result = {
    prefetchResources,
    snapshotResult,
    flushes: networkFlushes,
    size: totalSize,
    timing: {
      render: renderTime,
      snapshot: snapshotTime,
      firstFlush: firstFlushTime
    }
  };
  return result;
}
function computeSymbolMapper(manifest2) {
  if (manifest2) {
    const mapper = {};
    Object.entries(manifest2.mapping).forEach(([key, value]) => {
      mapper[getSymbolHash(key)] = [key, value];
    });
    return mapper;
  }
  return void 0;
}
var escapeText = (str) => {
  return str.replace(/<(\/?script)/g, "\\x3C$1");
};
const manifest = { "symbols": { "s_2JCD0jbZplA": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onClick", "canonicalFilename": "s_2jcd0jbzpla", "hash": "2JCD0jbZplA", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_G2veQzc9pPo" }, "s_PQIEB1AoKPQ": { "origin": "routes/api/index@api.tsx", "displayName": "index_api_component_useClientEffect", "canonicalFilename": "s_pqieb1aokpq", "hash": "PQIEB1AoKPQ", "ctxKind": "function", "ctxName": "useClientEffect$", "captures": true, "parent": "s_xkq1SDQ0ilU" }, "s_3P2cm6Bp6OU": { "origin": "routes/docs/[category]/[id]/index.tsx", "displayName": "_id__component", "canonicalFilename": "s_3p2cm6bp6ou", "hash": "3P2cm6Bp6OU", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_5x9HjCGcVg4": { "origin": "routes/blog/layout.tsx", "displayName": "layout_component", "canonicalFilename": "s_5x9hjcgcvg4", "hash": "5x9HjCGcVg4", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_CMs83QdiiAM": { "origin": "routes/docs/index.tsx", "displayName": "docs_component", "canonicalFilename": "s_cms83qdiiam", "hash": "CMs83QdiiAM", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_EhNlYUEnlvI": { "origin": "routes/api/layout-api.tsx", "displayName": "layout_api_component", "canonicalFilename": "s_ehnlyuenlvi", "hash": "EhNlYUEnlvI", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_KPD0c5iCcR4": { "origin": "components/breadcrumbs/breadcrumbs.tsx", "displayName": "Breadcrumbs_component", "canonicalFilename": "s_kpd0c5iccr4", "hash": "KPD0c5iCcR4", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_OtsarNLw0k8": { "origin": "routes/docs/layout!.tsx", "displayName": "layout__component", "canonicalFilename": "s_otsarnlw0k8", "hash": "OtsarNLw0k8", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_PFPbsM5fCRI": { "origin": "routes/layout.tsx", "displayName": "layout_component", "canonicalFilename": "s_pfpbsm5fcri", "hash": "PFPbsM5fCRI", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_SWlR1f9NpBM": { "origin": "routes/about-us/index.tsx", "displayName": "about_us_component", "canonicalFilename": "s_swlr1f9npbm", "hash": "SWlR1f9NpBM", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_TLsZLETEWJU": { "origin": "routes/dashboard/settings/index.tsx", "displayName": "settings_component", "canonicalFilename": "s_tlszletewju", "hash": "TLsZLETEWJU", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_aVbJRfXc4C8": { "origin": "components/head/head.tsx", "displayName": "Head_component", "canonicalFilename": "s_avbjrfxc4c8", "hash": "aVbJRfXc4C8", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_ahnZZnfc388": { "origin": "components/footer/footer.tsx", "displayName": "footer_component", "canonicalFilename": "s_ahnzznfc388", "hash": "ahnZZnfc388", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_c5Sx08Cyfjs": { "origin": "routes/blog/[...slug]/index.tsx", "displayName": "____slug__component", "canonicalFilename": "s_c5sx08cyfjs", "hash": "c5Sx08Cyfjs", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_c7dtJCPFvdA": { "origin": "routes/index.tsx", "displayName": "routes_component", "canonicalFilename": "s_c7dtjcpfvda", "hash": "c7dtJCPFvdA", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_dMrB5dGrif4": { "origin": "routes/dashboard/index.tsx", "displayName": "dashboard_component", "canonicalFilename": "s_dmrb5dgrif4", "hash": "dMrB5dGrif4", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_dhJZxl3w0Dw": { "origin": "components/menu/menu.tsx", "displayName": "Menu_component", "canonicalFilename": "s_dhjzxl3w0dw", "hash": "dhJZxl3w0Dw", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_dvw4So8VwWo": { "origin": "routes/products/[id]/index.tsx", "displayName": "_id__component", "canonicalFilename": "s_dvw4so8vwwo", "hash": "dvw4So8VwWo", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_eI6Q99oYUMo": { "origin": "root.tsx", "displayName": "root_component", "canonicalFilename": "s_ei6q99oyumo", "hash": "eI6Q99oYUMo", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_ep1NVkwbuQA": { "origin": "routes/dashboard/profile/index.tsx", "displayName": "profile_component", "canonicalFilename": "s_ep1nvkwbuqa", "hash": "ep1NVkwbuQA", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_jkud0AqUghc": { "origin": "components/header/header.tsx", "displayName": "header_component", "canonicalFilename": "s_jkud0aqughc", "hash": "jkud0AqUghc", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_wPgAA2dSM9I": { "origin": "routes/dashboard/layout!.tsx", "displayName": "layout__component", "canonicalFilename": "s_wpgaa2dsm9i", "hash": "wPgAA2dSM9I", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_xkq1SDQ0ilU": { "origin": "routes/api/index@api.tsx", "displayName": "index_api_component", "canonicalFilename": "s_xkq1sdq0ilu", "hash": "xkq1SDQ0ilU", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_06CEeYFWfP4": { "origin": "components/header/header.tsx", "displayName": "header_component_useStyles", "canonicalFilename": "s_06ceeyfwfp4", "hash": "06CEeYFWfP4", "ctxKind": "function", "ctxName": "useStyles$", "captures": false, "parent": "s_jkud0AqUghc" }, "s_0HAW829NhVk": { "origin": "components/breadcrumbs/breadcrumbs.tsx", "displayName": "Breadcrumbs_component_useStyles", "canonicalFilename": "s_0haw829nhvk", "hash": "0HAW829NhVk", "ctxKind": "function", "ctxName": "useStyles$", "captures": false, "parent": "s_KPD0c5iCcR4" }, "s_453JRSMq0HE": { "origin": "routes/dashboard/layout!.tsx", "displayName": "layout__component_useStyles", "canonicalFilename": "s_453jrsmq0he", "hash": "453JRSMq0HE", "ctxKind": "function", "ctxName": "useStyles$", "captures": false, "parent": "s_wPgAA2dSM9I" }, "s_AtVJN4fMpY8": { "origin": "routes/docs/layout!.tsx", "displayName": "layout__component_useStyles", "canonicalFilename": "s_atvjn4fmpy8", "hash": "AtVJN4fMpY8", "ctxKind": "function", "ctxName": "useStyles$", "captures": false, "parent": "s_OtsarNLw0k8" }, "s_RFhYjQmG0bA": { "origin": "routes/api/layout-api.tsx", "displayName": "layout_api_component_useStyles", "canonicalFilename": "s_rfhyjqmg0ba", "hash": "RFhYjQmG0bA", "ctxKind": "function", "ctxName": "useStyles$", "captures": false, "parent": "s_EhNlYUEnlvI" }, "s_hCy6nq1xvQc": { "origin": "components/footer/footer.tsx", "displayName": "footer_component_useStyles", "canonicalFilename": "s_hcy6nq1xvqc", "hash": "hCy6nq1xvQc", "ctxKind": "function", "ctxName": "useStyles$", "captures": false, "parent": "s_ahnZZnfc388" }, "s_v6LX36JbZ0s": { "origin": "components/menu/menu.tsx", "displayName": "Menu_component_useStyles", "canonicalFilename": "s_v6lx36jbz0s", "hash": "v6LX36JbZ0s", "ctxKind": "function", "ctxName": "useStyles$", "captures": false, "parent": "s_dhJZxl3w0Dw" }, "s_3SNE8VxnEag": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "useEndpoint_useResource", "canonicalFilename": "s_3sne8vxneag", "hash": "3SNE8VxnEag", "ctxKind": "function", "ctxName": "nt", "captures": true, "parent": null }, "s_G2veQzc9pPo": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component", "canonicalFilename": "s_g2veqzc9ppo", "hash": "G2veQzc9pPo", "ctxKind": "function", "ctxName": "S", "captures": false, "parent": null }, "s_kFLTrp4IGhI": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component", "canonicalFilename": "s_kfltrp4ighi", "hash": "kFLTrp4IGhI", "ctxKind": "function", "ctxName": "S", "captures": false, "parent": null }, "s_lGBxXp2t0Ss": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "RouterOutlet_component", "canonicalFilename": "s_lgbxxp2t0ss", "hash": "lGBxXp2t0Ss", "ctxKind": "function", "ctxName": "S", "captures": false, "parent": null }, "s_0eTh051is3w": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component_useWatch", "canonicalFilename": "s_0eth051is3w", "hash": "0eTh051is3w", "ctxKind": "function", "ctxName": "tt", "captures": true, "parent": "s_kFLTrp4IGhI" } }, "mapping": { "s_2JCD0jbZplA": "q-cebb3aee.js", "s_PQIEB1AoKPQ": "q-9add1657.js", "s_3P2cm6Bp6OU": "q-33864e26.js", "s_5x9HjCGcVg4": "q-b0c42146.js", "s_CMs83QdiiAM": "q-afe81c29.js", "s_EhNlYUEnlvI": "q-d8ad07f3.js", "s_KPD0c5iCcR4": "q-be979f2d.js", "s_OtsarNLw0k8": "q-7646166d.js", "s_PFPbsM5fCRI": "q-b0c42146.js", "s_SWlR1f9NpBM": "q-a8dbe070.js", "s_TLsZLETEWJU": "q-71139de3.js", "s_aVbJRfXc4C8": "q-62c0d8ba.js", "s_ahnZZnfc388": "q-97639de4.js", "s_c5Sx08Cyfjs": "q-a278e50a.js", "s_c7dtJCPFvdA": "q-89fc2fd3.js", "s_dMrB5dGrif4": "q-0b8acbe9.js", "s_dhJZxl3w0Dw": "q-7f9a232c.js", "s_dvw4So8VwWo": "q-33864e26.js", "s_eI6Q99oYUMo": "q-101b0798.js", "s_ep1NVkwbuQA": "q-6d7f432d.js", "s_jkud0AqUghc": "q-0bbd5207.js", "s_wPgAA2dSM9I": "q-7646166d.js", "s_xkq1SDQ0ilU": "q-9add1657.js", "s_06CEeYFWfP4": "q-0bbd5207.js", "s_0HAW829NhVk": "q-be979f2d.js", "s_453JRSMq0HE": "q-7646166d.js", "s_AtVJN4fMpY8": "q-7646166d.js", "s_RFhYjQmG0bA": "q-d8ad07f3.js", "s_hCy6nq1xvQc": "q-97639de4.js", "s_v6LX36JbZ0s": "q-7f9a232c.js", "s_3SNE8VxnEag": "q-1ec04fe2.js", "s_G2veQzc9pPo": "q-cebb3aee.js", "s_kFLTrp4IGhI": "q-b22b0eea.js", "s_lGBxXp2t0Ss": "q-9f31947d.js", "s_0eTh051is3w": "q-b22b0eea.js" }, "bundles": { "q-0b8acbe9.js": { "size": 175, "symbols": ["s_dMrB5dGrif4"], "imports": ["q-f064c970.js"] }, "q-0bbd5207.js": { "size": 1519, "symbols": ["s_06CEeYFWfP4", "s_jkud0AqUghc"], "imports": ["q-101b0798.js", "q-f064c970.js"] }, "q-0c098d4a.js": { "size": 228, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-7646166d.js"] }, "q-101b0798.js": { "size": 2985, "symbols": ["s_eI6Q99oYUMo"], "imports": ["q-f064c970.js"], "dynamicImports": ["q-1ec04fe2.js", "q-62c0d8ba.js", "q-9f31947d.js", "q-b22b0eea.js", "q-cebb3aee.js"] }, "q-138ff480.js": { "size": 189, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-afe81c29.js"] }, "q-1ec04fe2.js": { "size": 333, "symbols": ["s_3SNE8VxnEag"], "imports": ["q-f064c970.js"] }, "q-249946be.js": { "size": 158, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-9add1657.js"] }, "q-2e31cc83.js": { "size": 189, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-71139de3.js"] }, "q-33864e26.js": { "size": 1111, "symbols": ["s_3P2cm6Bp6OU", "s_dvw4So8VwWo"], "imports": ["q-101b0798.js", "q-f064c970.js"] }, "q-479d2435.js": { "size": 304, "symbols": [] }, "q-4cf15906.js": { "size": 185, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-0b8acbe9.js"] }, "q-575a25dc.js": { "size": 3219, "symbols": [], "imports": ["q-f064c970.js"] }, "q-5dce2d68.js": { "size": 239, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-0bbd5207.js", "q-97639de4.js"] }, "q-62c0d8ba.js": { "size": 816, "symbols": ["s_aVbJRfXc4C8"], "imports": ["q-101b0798.js", "q-f064c970.js"] }, "q-6d7f432d.js": { "size": 158, "symbols": ["s_ep1NVkwbuQA"], "imports": ["q-f064c970.js"] }, "q-6f835a0a.js": { "size": 1574, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-0c098d4a.js", "q-138ff480.js", "q-249946be.js", "q-2e31cc83.js", "q-479d2435.js", "q-4cf15906.js", "q-575a25dc.js", "q-9b41f4bf.js", "q-a12309d8.js", "q-a15abfc8.js", "q-aa2a1eac.js", "q-aba09b0d.js", "q-b6bc3973.js", "q-be052b7c.js", "q-c85a79d5.js", "q-caae9c5f.js", "q-de01940a.js", "q-e67e81bd.js", "q-ec6a1ba5.js"] }, "q-71139de3.js": { "size": 160, "symbols": ["s_TLsZLETEWJU"], "imports": ["q-f064c970.js"] }, "q-7646166d.js": { "size": 1880, "symbols": ["s_453JRSMq0HE", "s_AtVJN4fMpY8", "s_OtsarNLw0k8", "s_wPgAA2dSM9I"], "imports": ["q-5dce2d68.js", "q-f064c970.js"], "dynamicImports": ["q-7f9a232c.js", "q-be979f2d.js"] }, "q-7f9a232c.js": { "size": 816, "symbols": ["s_dhJZxl3w0Dw", "s_v6LX36JbZ0s"], "imports": ["q-101b0798.js", "q-f064c970.js"] }, "q-89fc2fd3.js": { "size": 157, "symbols": ["s_c7dtJCPFvdA"], "imports": ["q-f064c970.js"] }, "q-97639de4.js": { "size": 842, "symbols": ["s_ahnZZnfc388", "s_hCy6nq1xvQc"], "imports": ["q-f064c970.js"] }, "q-9add1657.js": { "size": 840, "symbols": ["s_PQIEB1AoKPQ", "s_xkq1SDQ0ilU"], "imports": ["q-f064c970.js"] }, "q-9b41f4bf.js": { "size": 201, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-89fc2fd3.js"] }, "q-9f31947d.js": { "size": 288, "symbols": ["s_lGBxXp2t0Ss"], "imports": ["q-101b0798.js", "q-f064c970.js"] }, "q-a12309d8.js": { "size": 879, "symbols": [], "imports": ["q-f064c970.js"] }, "q-a15abfc8.js": { "size": 659, "symbols": [], "imports": ["q-f064c970.js"] }, "q-a278e50a.js": { "size": 280, "symbols": ["s_c5Sx08Cyfjs"], "imports": ["q-101b0798.js", "q-f064c970.js"] }, "q-a3fe6bae.js": { "size": 58, "symbols": [], "imports": ["q-f064c970.js"] }, "q-a8dbe070.js": { "size": 180, "symbols": ["s_SWlR1f9NpBM"], "imports": ["q-f064c970.js"] }, "q-aa2a1eac.js": { "size": 158, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-b0c42146.js"] }, "q-aba09b0d.js": { "size": 203, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-d8ad07f3.js"] }, "q-afe81c29.js": { "size": 138, "symbols": ["s_CMs83QdiiAM"], "imports": ["q-f064c970.js"] }, "q-b0c42146.js": { "size": 537, "symbols": ["s_5x9HjCGcVg4", "s_PFPbsM5fCRI"], "imports": ["q-5dce2d68.js", "q-f064c970.js"] }, "q-b22b0eea.js": { "size": 1307, "symbols": ["s_0eTh051is3w", "s_kFLTrp4IGhI"], "imports": ["q-101b0798.js", "q-f064c970.js"], "dynamicImports": ["q-6f835a0a.js"] }, "q-b6bc3973.js": { "size": 218, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-33864e26.js"] }, "q-be052b7c.js": { "size": 237, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-a278e50a.js"] }, "q-be979f2d.js": { "size": 928, "symbols": ["s_0HAW829NhVk", "s_KPD0c5iCcR4"], "imports": ["q-101b0798.js", "q-5dce2d68.js", "q-7646166d.js", "q-f064c970.js"] }, "q-c85a79d5.js": { "size": 188, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-6d7f432d.js"] }, "q-caae9c5f.js": { "size": 158, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-b0c42146.js"] }, "q-cebb3aee.js": { "size": 551, "symbols": ["s_2JCD0jbZplA", "s_G2veQzc9pPo"], "imports": ["q-101b0798.js", "q-f064c970.js"] }, "q-d8ad07f3.js": { "size": 796, "symbols": ["s_EhNlYUEnlvI", "s_RFhYjQmG0bA"], "imports": ["q-f064c970.js"] }, "q-de01940a.js": { "size": 275, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-33864e26.js"] }, "q-e67e81bd.js": { "size": 224, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-7646166d.js"] }, "q-ec6a1ba5.js": { "size": 184, "symbols": [], "imports": ["q-f064c970.js"], "dynamicImports": ["q-a8dbe070.js"] }, "q-f064c970.js": { "size": 34385, "symbols": [], "dynamicImports": ["q-101b0798.js"] } }, "injections": [{ "tag": "link", "location": "head", "attributes": { "rel": "stylesheet", "href": "/build/q-a7f6219f.css" } }], "version": "1", "options": { "target": "client", "buildMode": "production", "forceFullBuild": true, "entryStrategy": { "type": "smart" } }, "platform": { "qwik": "0.0.100", "vite": "", "rollup": "2.78.1", "env": "node", "os": "win32", "node": "16.13.2" } };
const Analytics = ({ loc }) => {
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("script", {
      dangerouslySetInnerHTML: `console.log("\u{1F9E8} Analytics! ${loc.pathname}");`
    })
  });
};
const Social = () => {
  return /* @__PURE__ */ jsx(Fragment, {
    children: [
      /* @__PURE__ */ jsx("meta", {
        property: "og:site_name",
        content: "Qwik"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "twitter:card",
        content: "summary_large_image"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "twitter:site",
        content: "@QwikDev"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "twitter:title",
        content: "Qwik"
      })
    ]
  });
};
const Head = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const head2 = kt();
  const loc = Z();
  return /* @__PURE__ */ jsx("head", {
    children: [
      /* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }),
      /* @__PURE__ */ jsx("title", {
        children: head2.title ? `${head2.title} - Qwik` : `Qwik`
      }),
      /* @__PURE__ */ jsx("link", {
        rel: "canonical",
        href: loc.href
      }),
      head2.meta.map((m) => /* @__PURE__ */ jsx("meta", {
        ...m
      })),
      head2.links.map((l) => /* @__PURE__ */ jsx("link", {
        ...l
      })),
      head2.styles.map((s) => /* @__PURE__ */ jsx("style", {
        ...s.props,
        dangerouslySetInnerHTML: s.style
      })),
      /* @__PURE__ */ jsx(Social, {}),
      /* @__PURE__ */ jsx(Analytics, {
        loc
      })
    ]
  });
}, "s_aVbJRfXc4C8"));
const global$1 = "";
const Root = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx(ht, {
    children: [
      /* @__PURE__ */ jsx(Head, {}),
      /* @__PURE__ */ jsx("body", {
        lang: "en",
        children: /* @__PURE__ */ jsx(st, {})
      })
    ]
  });
}, "s_eI6Q99oYUMo"));
function render(opts) {
  return renderToStream(/* @__PURE__ */ jsx(Root, {}), {
    manifest,
    ...opts
  });
}
const qwikCityMiddleware = qwikCity(render);
const onRequestGet = [
  qwikCityMiddleware
];
export {
  onRequestGet
};
