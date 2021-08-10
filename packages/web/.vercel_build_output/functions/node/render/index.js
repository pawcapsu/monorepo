var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/@sveltejs/kit/dist/install-fetch.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = src(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
var import_http, import_https, import_zlib, import_stream, import_util, import_crypto, import_url, src, Readable, wm, Blob, fetchBlob, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, carriage, dashes, carriageLength, getFooter, getBoundary, INTERNALS$2, Body, clone, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers, redirectStatus, isRedirect, INTERNALS$1, Response, getSearch, INTERNALS, isRequest, Request, getNodeRequestOptions, AbortError, supportedSchemas;
var init_install_fetch = __esm({
  "node_modules/@sveltejs/kit/dist/install-fetch.js"() {
    init_shims();
    import_http = __toModule(require("http"));
    import_https = __toModule(require("https"));
    import_zlib = __toModule(require("zlib"));
    import_stream = __toModule(require("stream"));
    import_util = __toModule(require("util"));
    import_crypto = __toModule(require("crypto"));
    import_url = __toModule(require("url"));
    src = dataUriToBuffer;
    ({ Readable } = import_stream.default);
    wm = new WeakMap();
    Blob = class {
      constructor(blobParts = [], options2 = {}) {
        let size = 0;
        const parts = blobParts.map((element) => {
          let buffer;
          if (element instanceof Buffer) {
            buffer = element;
          } else if (ArrayBuffer.isView(element)) {
            buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
          } else if (element instanceof ArrayBuffer) {
            buffer = Buffer.from(element);
          } else if (element instanceof Blob) {
            buffer = element;
          } else {
            buffer = Buffer.from(typeof element === "string" ? element : String(element));
          }
          size += buffer.length || buffer.size || 0;
          return buffer;
        });
        const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
        wm.set(this, {
          type: /[^\u0020-\u007E]/.test(type) ? "" : type,
          size,
          parts
        });
      }
      get size() {
        return wm.get(this).size;
      }
      get type() {
        return wm.get(this).type;
      }
      async text() {
        return Buffer.from(await this.arrayBuffer()).toString();
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of this.stream()) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        return Readable.from(read(wm.get(this).parts));
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = wm.get(this).parts.values();
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
            blobParts.push(chunk);
            added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
            relativeStart = 0;
            if (added >= span) {
              break;
            }
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        Object.assign(wm.get(blob), { size: span, parts: blobParts });
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    fetchBlob = Blob;
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    isBlob = (object) => {
      return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && object[NAME] === "AbortSignal";
    };
    carriage = "\r\n";
    dashes = "-".repeat(2);
    carriageLength = Buffer.byteLength(carriage);
    getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
    getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (Buffer.isBuffer(body))
          ;
        else if (import_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_stream.default)
          ;
        else if (isFormData(body)) {
          boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
          body = import_stream.default.Readable.from(formDataIterator(body, boundary));
        } else {
          body = Buffer.from(String(body));
        }
        this[INTERNALS$2] = {
          body,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_stream.default) {
          body.on("error", (err) => {
            const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
            this[INTERNALS$2].error = error3;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].body;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.buffer();
        return new fetchBlob([buf], {
          type: ct
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_stream.PassThrough({ highWaterMark });
        p2 = new import_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].body = p1;
        body = p2;
      }
      return body;
    };
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      }
      if (isFormData(body)) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body instanceof import_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request;
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      if (isFormData(body)) {
        return getFormDataLength(request[INTERNALS$2].boundary);
      }
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw err;
      }
    };
    validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const err = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
        throw err;
      }
    };
    Headers = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback) {
        for (const name of this.keys()) {
          callback(this.get(name), name);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key) => {
          result[key] = this.getAll(key);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key) => {
          const values = this.getAll(key);
          if (key === "host") {
            result[key] = values[0];
          } else {
            result[key] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response = class extends Body {
      constructor(body = null, options2 = {}) {
        super(body, options2);
        const status = options2.status || 200;
        const headers = new Headers(options2.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          url: options2.url,
          status,
          statusText: options2.statusText || "",
          headers,
          counter: options2.counter,
          highWaterMark: options2.highWaterMark
        };
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response(clone(this, this.highWaterMark), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    Request = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal !== null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      clone() {
        return new Request(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const requestOptions = {
        path: parsedURL.pathname + search,
        pathname: parsedURL.pathname,
        hostname: parsedURL.hostname,
        protocol: parsedURL.protocol,
        port: parsedURL.port,
        hash: parsedURL.hash,
        search: parsedURL.search,
        query: parsedURL.query,
        href: parsedURL.href,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return requestOptions;
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    supportedSchemas = new Set(["data:", "http:", "https:"]);
    Object.defineProperties(globalThis, {
      fetch: {
        enumerable: true,
        value: fetch
      },
      Response: {
        enumerable: true,
        value: Response
      },
      Request: {
        enumerable: true,
        value: Request
      },
      Headers: {
        enumerable: true,
        value: Headers
      }
    });
  }
});

// node_modules/@sveltejs/adapter-vercel/files/shims.js
var init_shims = __esm({
  "node_modules/@sveltejs/adapter-vercel/files/shims.js"() {
    init_install_fetch();
  }
});

// node_modules/feather-icons/dist/feather.js
var require_feather = __commonJS({
  "node_modules/feather-icons/dist/feather.js"(exports, module2) {
    init_shims();
    (function webpackUniversalModuleDefinition(root, factory) {
      if (typeof exports === "object" && typeof module2 === "object")
        module2.exports = factory();
      else if (typeof define === "function" && define.amd)
        define([], factory);
      else if (typeof exports === "object")
        exports["feather"] = factory();
      else
        root["feather"] = factory();
    })(typeof self !== "undefined" ? self : exports, function() {
      return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
          if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
          }
          var module3 = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
          };
          modules[moduleId].call(module3.exports, module3, module3.exports, __webpack_require__);
          module3.l = true;
          return module3.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports2, name, getter) {
          if (!__webpack_require__.o(exports2, name)) {
            Object.defineProperty(exports2, name, {
              configurable: false,
              enumerable: true,
              get: getter
            });
          }
        };
        __webpack_require__.r = function(exports2) {
          Object.defineProperty(exports2, "__esModule", { value: true });
        };
        __webpack_require__.n = function(module3) {
          var getter = module3 && module3.__esModule ? function getDefault() {
            return module3["default"];
          } : function getModuleExports() {
            return module3;
          };
          __webpack_require__.d(getter, "a", getter);
          return getter;
        };
        __webpack_require__.o = function(object, property) {
          return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = 0);
      }({
        "./dist/icons.json": function(module3) {
          module3.exports = { "activity": '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>', "airplay": '<path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon>', "alert-circle": '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>', "alert-octagon": '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>', "alert-triangle": '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>', "align-center": '<line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line>', "align-justify": '<line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line>', "align-left": '<line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line>', "align-right": '<line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line>', "anchor": '<circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>', "aperture": '<circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>', "archive": '<polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line>', "arrow-down-circle": '<circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line>', "arrow-down-left": '<line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline>', "arrow-down-right": '<line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline>', "arrow-down": '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>', "arrow-left-circle": '<circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line>', "arrow-left": '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>', "arrow-right-circle": '<circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line>', "arrow-right": '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>', "arrow-up-circle": '<circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line>', "arrow-up-left": '<line x1="17" y1="17" x2="7" y2="7"></line><polyline points="7 17 7 7 17 7"></polyline>', "arrow-up-right": '<line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline>', "arrow-up": '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>', "at-sign": '<circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>', "award": '<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>', "bar-chart-2": '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>', "bar-chart": '<line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line>', "battery-charging": '<path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><line x1="23" y1="13" x2="23" y2="11"></line><polyline points="11 6 7 12 13 12 9 18"></polyline>', "battery": '<rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect><line x1="23" y1="13" x2="23" y2="11"></line>', "bell-off": '<path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line>', "bell": '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>', "bluetooth": '<polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"></polyline>', "bold": '<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>', "book-open": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>', "book": '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>', "bookmark": '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>', "box": '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>', "briefcase": '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>', "calendar": '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>', "camera-off": '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path>', "camera": '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>', "cast": '<path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path><line x1="2" y1="20" x2="2.01" y2="20"></line>', "check-circle": '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>', "check-square": '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>', "check": '<polyline points="20 6 9 17 4 12"></polyline>', "chevron-down": '<polyline points="6 9 12 15 18 9"></polyline>', "chevron-left": '<polyline points="15 18 9 12 15 6"></polyline>', "chevron-right": '<polyline points="9 18 15 12 9 6"></polyline>', "chevron-up": '<polyline points="18 15 12 9 6 15"></polyline>', "chevrons-down": '<polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline>', "chevrons-left": '<polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline>', "chevrons-right": '<polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline>', "chevrons-up": '<polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline>', "chrome": '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>', "circle": '<circle cx="12" cy="12" r="10"></circle>', "clipboard": '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>', "clock": '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>', "cloud-drizzle": '<line x1="8" y1="19" x2="8" y2="21"></line><line x1="8" y1="13" x2="8" y2="15"></line><line x1="16" y1="19" x2="16" y2="21"></line><line x1="16" y1="13" x2="16" y2="15"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="12" y1="15" x2="12" y2="17"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>', "cloud-lightning": '<path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline>', "cloud-off": '<path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>', "cloud-rain": '<line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>', "cloud-snow": '<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="8" y1="20" x2="8.01" y2="20"></line><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="12" y1="22" x2="12.01" y2="22"></line><line x1="16" y1="16" x2="16.01" y2="16"></line><line x1="16" y1="20" x2="16.01" y2="20"></line>', "cloud": '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>', "code": '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>', "codepen": '<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line>', "codesandbox": '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>', "coffee": '<path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>', "columns": '<path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>', "command": '<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>', "compass": '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>', "copy": '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>', "corner-down-left": '<polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path>', "corner-down-right": '<polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path>', "corner-left-down": '<polyline points="14 15 9 20 4 15"></polyline><path d="M20 4h-7a4 4 0 0 0-4 4v12"></path>', "corner-left-up": '<polyline points="14 9 9 4 4 9"></polyline><path d="M20 20h-7a4 4 0 0 1-4-4V4"></path>', "corner-right-down": '<polyline points="10 15 15 20 20 15"></polyline><path d="M4 4h7a4 4 0 0 1 4 4v12"></path>', "corner-right-up": '<polyline points="10 9 15 4 20 9"></polyline><path d="M4 20h7a4 4 0 0 0 4-4V4"></path>', "corner-up-left": '<polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>', "corner-up-right": '<polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>', "cpu": '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>', "credit-card": '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>', "crop": '<path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>', "crosshair": '<circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line>', "database": '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>', "delete": '<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line>', "disc": '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>', "divide-circle": '<line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line><circle cx="12" cy="12" r="10"></circle>', "divide-square": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line><line x1="12" y1="8" x2="12" y2="8"></line>', "divide": '<circle cx="12" cy="6" r="2"></circle><line x1="5" y1="12" x2="19" y2="12"></line><circle cx="12" cy="18" r="2"></circle>', "dollar-sign": '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>', "download-cloud": '<polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>', "download": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>', "dribbble": '<circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>', "droplet": '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>', "edit-2": '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>', "edit-3": '<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>', "edit": '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>', "external-link": '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>', "eye-off": '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>', "eye": '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>', "facebook": '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>', "fast-forward": '<polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon>', "feather": '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line>', "figma": '<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path>', "file-minus": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line>', "file-plus": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line>', "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>', "file": '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline>', "film": '<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line>', "filter": '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>', "flag": '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>', "folder-minus": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="9" y1="14" x2="15" y2="14"></line>', "folder-plus": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line>', "folder": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>', "framer": '<path d="M5 16V9h14V2H5l14 14h-7m-7 0l7 7v-7m-7 0h7"></path>', "frown": '<circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>', "gift": '<polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>', "git-branch": '<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>', "git-commit": '<circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line>', "git-merge": '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path>', "git-pull-request": '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line>', "github": '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>', "gitlab": '<path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path>', "globe": '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>', "grid": '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>', "hard-drive": '<line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line>', "hash": '<line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>', "headphones": '<path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>', "heart": '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>', "help-circle": '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>', "hexagon": '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>', "home": '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>', "image": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>', "inbox": '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>', "info": '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>', "instagram": '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>', "italic": '<line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line>', "key": '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>', "layers": '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>', "layout": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>', "life-buoy": '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>', "link-2": '<path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line>', "link": '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>', "linkedin": '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>', "list": '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>', "loader": '<line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>', "lock": '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>', "log-in": '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line>', "log-out": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>', "mail": '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>', "map-pin": '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>', "map": '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>', "maximize-2": '<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>', "maximize": '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>', "meh": '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>', "menu": '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>', "message-circle": '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>', "message-square": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>', "mic-off": '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>', "mic": '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>', "minimize-2": '<polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line>', "minimize": '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>', "minus-circle": '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line>', "minus-square": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line>', "minus": '<line x1="5" y1="12" x2="19" y2="12"></line>', "monitor": '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>', "moon": '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>', "more-horizontal": '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>', "more-vertical": '<circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>', "mouse-pointer": '<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path>', "move": '<polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>', "music": '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>', "navigation-2": '<polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>', "navigation": '<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>', "octagon": '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>', "package": '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>', "paperclip": '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>', "pause-circle": '<circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line>', "pause": '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>', "pen-tool": '<path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle>', "percent": '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>', "phone-call": '<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', "phone-forwarded": '<polyline points="19 1 23 5 19 9"></polyline><line x1="15" y1="5" x2="23" y2="5"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', "phone-incoming": '<polyline points="16 2 16 8 22 8"></polyline><line x1="23" y1="1" x2="16" y2="8"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', "phone-missed": '<line x1="23" y1="1" x2="17" y2="7"></line><line x1="17" y1="1" x2="23" y2="7"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', "phone-off": '<path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line>', "phone-outgoing": '<polyline points="23 7 23 1 17 1"></polyline><line x1="16" y1="8" x2="23" y2="1"></line><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>', "pie-chart": '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>', "play-circle": '<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>', "play": '<polygon points="5 3 19 12 5 21 5 3"></polygon>', "plus-circle": '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>', "plus-square": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>', "plus": '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>', "pocket": '<path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path><polyline points="8 10 12 14 16 10"></polyline>', "power": '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line>', "printer": '<polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>', "radio": '<circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>', "refresh-ccw": '<polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>', "refresh-cw": '<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>', "repeat": '<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>', "rewind": '<polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon>', "rotate-ccw": '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>', "rotate-cw": '<polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>', "rss": '<path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle>', "save": '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>', "scissors": '<circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line>', "search": '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>', "send": '<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>', "server": '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>', "settings": '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>', "share-2": '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>', "share": '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line>', "shield-off": '<path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"></path><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"></path><line x1="1" y1="1" x2="23" y2="23"></line>', "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>', "shopping-bag": '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>', "shopping-cart": '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>', "shuffle": '<polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line>', "sidebar": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>', "skip-back": '<polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line>', "skip-forward": '<polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line>', "slack": '<path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"></path><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"></path><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"></path><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"></path><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"></path>', "slash": '<circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>', "sliders": '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>', "smartphone": '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>', "smile": '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>', "speaker": '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line>', "square": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>', "star": '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>', "stop-circle": '<circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect>', "sun": '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>', "sunrise": '<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="2" x2="12" y2="9"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline>', "sunset": '<path d="M17 18a5 5 0 0 0-10 0"></path><line x1="12" y1="9" x2="12" y2="2"></line><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line><line x1="1" y1="18" x2="3" y2="18"></line><line x1="21" y1="18" x2="23" y2="18"></line><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line><line x1="23" y1="22" x2="1" y2="22"></line><polyline points="16 5 12 9 8 5"></polyline>', "tablet": '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>', "tag": '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>', "target": '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>', "terminal": '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>', "thermometer": '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>', "thumbs-down": '<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>', "thumbs-up": '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>', "toggle-left": '<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="8" cy="12" r="3"></circle>', "toggle-right": '<rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle>', "tool": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>', "trash-2": '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>', "trash": '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>', "trello": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect>', "trending-down": '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline>', "trending-up": '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>', "triangle": '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>', "truck": '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>', "tv": '<rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>', "twitch": '<path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path>', "twitter": '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>', "type": '<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>', "umbrella": '<path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>', "underline": '<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line>', "unlock": '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>', "upload-cloud": '<polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline>', "upload": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>', "user-check": '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>', "user-minus": '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line>', "user-plus": '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>', "user-x": '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line>', "user": '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>', "users": '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>', "video-off": '<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>', "video": '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>', "voicemail": '<circle cx="5.5" cy="11.5" r="4.5"></circle><circle cx="18.5" cy="11.5" r="4.5"></circle><line x1="5.5" y1="16" x2="18.5" y2="16"></line>', "volume-1": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>', "volume-2": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>', "volume-x": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>', "volume": '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>', "watch": '<circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path>', "wifi-off": '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>', "wifi": '<path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>', "wind": '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>', "x-circle": '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>', "x-octagon": '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>', "x-square": '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line>', "x": '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>', "youtube": '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>', "zap-off": '<polyline points="12.41 6.75 13 2 10.57 4.92"></polyline><polyline points="18.57 12.91 21 10 15.66 10"></polyline><polyline points="8 8 3 14 12 14 11 22 16 16"></polyline><line x1="1" y1="1" x2="23" y2="23"></line>', "zap": '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>', "zoom-in": '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line>', "zoom-out": '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line>' };
        },
        "./node_modules/classnames/dedupe.js": function(module3, exports2, __webpack_require__) {
          var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
          (function() {
            "use strict";
            var classNames = function() {
              function StorageObject() {
              }
              StorageObject.prototype = Object.create(null);
              function _parseArray(resultSet, array) {
                var length = array.length;
                for (var i = 0; i < length; ++i) {
                  _parse(resultSet, array[i]);
                }
              }
              var hasOwn = {}.hasOwnProperty;
              function _parseNumber(resultSet, num) {
                resultSet[num] = true;
              }
              function _parseObject(resultSet, object) {
                for (var k in object) {
                  if (hasOwn.call(object, k)) {
                    resultSet[k] = !!object[k];
                  }
                }
              }
              var SPACE = /\s+/;
              function _parseString(resultSet, str) {
                var array = str.split(SPACE);
                var length = array.length;
                for (var i = 0; i < length; ++i) {
                  resultSet[array[i]] = true;
                }
              }
              function _parse(resultSet, arg) {
                if (!arg)
                  return;
                var argType = typeof arg;
                if (argType === "string") {
                  _parseString(resultSet, arg);
                } else if (Array.isArray(arg)) {
                  _parseArray(resultSet, arg);
                } else if (argType === "object") {
                  _parseObject(resultSet, arg);
                } else if (argType === "number") {
                  _parseNumber(resultSet, arg);
                }
              }
              function _classNames() {
                var len = arguments.length;
                var args = Array(len);
                for (var i = 0; i < len; i++) {
                  args[i] = arguments[i];
                }
                var classSet = new StorageObject();
                _parseArray(classSet, args);
                var list = [];
                for (var k in classSet) {
                  if (classSet[k]) {
                    list.push(k);
                  }
                }
                return list.join(" ");
              }
              return _classNames;
            }();
            if (typeof module3 !== "undefined" && module3.exports) {
              module3.exports = classNames;
            } else if (true) {
              !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
                return classNames;
              }.apply(exports2, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module3.exports = __WEBPACK_AMD_DEFINE_RESULT__));
            } else {
            }
          })();
        },
        "./node_modules/core-js/es/array/from.js": function(module3, exports2, __webpack_require__) {
          __webpack_require__("./node_modules/core-js/modules/es.string.iterator.js");
          __webpack_require__("./node_modules/core-js/modules/es.array.from.js");
          var path = __webpack_require__("./node_modules/core-js/internals/path.js");
          module3.exports = path.Array.from;
        },
        "./node_modules/core-js/internals/a-function.js": function(module3, exports2) {
          module3.exports = function(it) {
            if (typeof it != "function") {
              throw TypeError(String(it) + " is not a function");
            }
            return it;
          };
        },
        "./node_modules/core-js/internals/an-object.js": function(module3, exports2, __webpack_require__) {
          var isObject = __webpack_require__("./node_modules/core-js/internals/is-object.js");
          module3.exports = function(it) {
            if (!isObject(it)) {
              throw TypeError(String(it) + " is not an object");
            }
            return it;
          };
        },
        "./node_modules/core-js/internals/array-from.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          var bind = __webpack_require__("./node_modules/core-js/internals/bind-context.js");
          var toObject = __webpack_require__("./node_modules/core-js/internals/to-object.js");
          var callWithSafeIterationClosing = __webpack_require__("./node_modules/core-js/internals/call-with-safe-iteration-closing.js");
          var isArrayIteratorMethod = __webpack_require__("./node_modules/core-js/internals/is-array-iterator-method.js");
          var toLength = __webpack_require__("./node_modules/core-js/internals/to-length.js");
          var createProperty = __webpack_require__("./node_modules/core-js/internals/create-property.js");
          var getIteratorMethod = __webpack_require__("./node_modules/core-js/internals/get-iterator-method.js");
          module3.exports = function from(arrayLike) {
            var O = toObject(arrayLike);
            var C = typeof this == "function" ? this : Array;
            var argumentsLength = arguments.length;
            var mapfn = argumentsLength > 1 ? arguments[1] : void 0;
            var mapping = mapfn !== void 0;
            var index2 = 0;
            var iteratorMethod = getIteratorMethod(O);
            var length, result, step, iterator;
            if (mapping)
              mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : void 0, 2);
            if (iteratorMethod != void 0 && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
              iterator = iteratorMethod.call(O);
              result = new C();
              for (; !(step = iterator.next()).done; index2++) {
                createProperty(result, index2, mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index2], true) : step.value);
              }
            } else {
              length = toLength(O.length);
              result = new C(length);
              for (; length > index2; index2++) {
                createProperty(result, index2, mapping ? mapfn(O[index2], index2) : O[index2]);
              }
            }
            result.length = index2;
            return result;
          };
        },
        "./node_modules/core-js/internals/array-includes.js": function(module3, exports2, __webpack_require__) {
          var toIndexedObject = __webpack_require__("./node_modules/core-js/internals/to-indexed-object.js");
          var toLength = __webpack_require__("./node_modules/core-js/internals/to-length.js");
          var toAbsoluteIndex = __webpack_require__("./node_modules/core-js/internals/to-absolute-index.js");
          module3.exports = function(IS_INCLUDES) {
            return function($this, el, fromIndex) {
              var O = toIndexedObject($this);
              var length = toLength(O.length);
              var index2 = toAbsoluteIndex(fromIndex, length);
              var value;
              if (IS_INCLUDES && el != el)
                while (length > index2) {
                  value = O[index2++];
                  if (value != value)
                    return true;
                }
              else
                for (; length > index2; index2++)
                  if (IS_INCLUDES || index2 in O) {
                    if (O[index2] === el)
                      return IS_INCLUDES || index2 || 0;
                  }
              return !IS_INCLUDES && -1;
            };
          };
        },
        "./node_modules/core-js/internals/bind-context.js": function(module3, exports2, __webpack_require__) {
          var aFunction = __webpack_require__("./node_modules/core-js/internals/a-function.js");
          module3.exports = function(fn, that, length) {
            aFunction(fn);
            if (that === void 0)
              return fn;
            switch (length) {
              case 0:
                return function() {
                  return fn.call(that);
                };
              case 1:
                return function(a) {
                  return fn.call(that, a);
                };
              case 2:
                return function(a, b) {
                  return fn.call(that, a, b);
                };
              case 3:
                return function(a, b, c) {
                  return fn.call(that, a, b, c);
                };
            }
            return function() {
              return fn.apply(that, arguments);
            };
          };
        },
        "./node_modules/core-js/internals/call-with-safe-iteration-closing.js": function(module3, exports2, __webpack_require__) {
          var anObject = __webpack_require__("./node_modules/core-js/internals/an-object.js");
          module3.exports = function(iterator, fn, value, ENTRIES) {
            try {
              return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
            } catch (error3) {
              var returnMethod = iterator["return"];
              if (returnMethod !== void 0)
                anObject(returnMethod.call(iterator));
              throw error3;
            }
          };
        },
        "./node_modules/core-js/internals/check-correctness-of-iteration.js": function(module3, exports2, __webpack_require__) {
          var wellKnownSymbol = __webpack_require__("./node_modules/core-js/internals/well-known-symbol.js");
          var ITERATOR = wellKnownSymbol("iterator");
          var SAFE_CLOSING = false;
          try {
            var called = 0;
            var iteratorWithReturn = {
              next: function() {
                return { done: !!called++ };
              },
              "return": function() {
                SAFE_CLOSING = true;
              }
            };
            iteratorWithReturn[ITERATOR] = function() {
              return this;
            };
            Array.from(iteratorWithReturn, function() {
              throw 2;
            });
          } catch (error3) {
          }
          module3.exports = function(exec, SKIP_CLOSING) {
            if (!SKIP_CLOSING && !SAFE_CLOSING)
              return false;
            var ITERATION_SUPPORT = false;
            try {
              var object = {};
              object[ITERATOR] = function() {
                return {
                  next: function() {
                    return { done: ITERATION_SUPPORT = true };
                  }
                };
              };
              exec(object);
            } catch (error3) {
            }
            return ITERATION_SUPPORT;
          };
        },
        "./node_modules/core-js/internals/classof-raw.js": function(module3, exports2) {
          var toString = {}.toString;
          module3.exports = function(it) {
            return toString.call(it).slice(8, -1);
          };
        },
        "./node_modules/core-js/internals/classof.js": function(module3, exports2, __webpack_require__) {
          var classofRaw = __webpack_require__("./node_modules/core-js/internals/classof-raw.js");
          var wellKnownSymbol = __webpack_require__("./node_modules/core-js/internals/well-known-symbol.js");
          var TO_STRING_TAG = wellKnownSymbol("toStringTag");
          var CORRECT_ARGUMENTS = classofRaw(function() {
            return arguments;
          }()) == "Arguments";
          var tryGet = function(it, key) {
            try {
              return it[key];
            } catch (error3) {
            }
          };
          module3.exports = function(it) {
            var O, tag, result;
            return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) == "Object" && typeof O.callee == "function" ? "Arguments" : result;
          };
        },
        "./node_modules/core-js/internals/copy-constructor-properties.js": function(module3, exports2, __webpack_require__) {
          var has = __webpack_require__("./node_modules/core-js/internals/has.js");
          var ownKeys = __webpack_require__("./node_modules/core-js/internals/own-keys.js");
          var getOwnPropertyDescriptorModule = __webpack_require__("./node_modules/core-js/internals/object-get-own-property-descriptor.js");
          var definePropertyModule = __webpack_require__("./node_modules/core-js/internals/object-define-property.js");
          module3.exports = function(target, source) {
            var keys = ownKeys(source);
            var defineProperty = definePropertyModule.f;
            var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (!has(target, key))
                defineProperty(target, key, getOwnPropertyDescriptor(source, key));
            }
          };
        },
        "./node_modules/core-js/internals/correct-prototype-getter.js": function(module3, exports2, __webpack_require__) {
          var fails = __webpack_require__("./node_modules/core-js/internals/fails.js");
          module3.exports = !fails(function() {
            function F() {
            }
            F.prototype.constructor = null;
            return Object.getPrototypeOf(new F()) !== F.prototype;
          });
        },
        "./node_modules/core-js/internals/create-iterator-constructor.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          var IteratorPrototype = __webpack_require__("./node_modules/core-js/internals/iterators-core.js").IteratorPrototype;
          var create = __webpack_require__("./node_modules/core-js/internals/object-create.js");
          var createPropertyDescriptor = __webpack_require__("./node_modules/core-js/internals/create-property-descriptor.js");
          var setToStringTag = __webpack_require__("./node_modules/core-js/internals/set-to-string-tag.js");
          var Iterators = __webpack_require__("./node_modules/core-js/internals/iterators.js");
          var returnThis = function() {
            return this;
          };
          module3.exports = function(IteratorConstructor, NAME2, next) {
            var TO_STRING_TAG = NAME2 + " Iterator";
            IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
            setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
            Iterators[TO_STRING_TAG] = returnThis;
            return IteratorConstructor;
          };
        },
        "./node_modules/core-js/internals/create-property-descriptor.js": function(module3, exports2) {
          module3.exports = function(bitmap, value) {
            return {
              enumerable: !(bitmap & 1),
              configurable: !(bitmap & 2),
              writable: !(bitmap & 4),
              value
            };
          };
        },
        "./node_modules/core-js/internals/create-property.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          var toPrimitive = __webpack_require__("./node_modules/core-js/internals/to-primitive.js");
          var definePropertyModule = __webpack_require__("./node_modules/core-js/internals/object-define-property.js");
          var createPropertyDescriptor = __webpack_require__("./node_modules/core-js/internals/create-property-descriptor.js");
          module3.exports = function(object, key, value) {
            var propertyKey = toPrimitive(key);
            if (propertyKey in object)
              definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
            else
              object[propertyKey] = value;
          };
        },
        "./node_modules/core-js/internals/define-iterator.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          var $ = __webpack_require__("./node_modules/core-js/internals/export.js");
          var createIteratorConstructor = __webpack_require__("./node_modules/core-js/internals/create-iterator-constructor.js");
          var getPrototypeOf = __webpack_require__("./node_modules/core-js/internals/object-get-prototype-of.js");
          var setPrototypeOf = __webpack_require__("./node_modules/core-js/internals/object-set-prototype-of.js");
          var setToStringTag = __webpack_require__("./node_modules/core-js/internals/set-to-string-tag.js");
          var hide = __webpack_require__("./node_modules/core-js/internals/hide.js");
          var redefine = __webpack_require__("./node_modules/core-js/internals/redefine.js");
          var wellKnownSymbol = __webpack_require__("./node_modules/core-js/internals/well-known-symbol.js");
          var IS_PURE = __webpack_require__("./node_modules/core-js/internals/is-pure.js");
          var Iterators = __webpack_require__("./node_modules/core-js/internals/iterators.js");
          var IteratorsCore = __webpack_require__("./node_modules/core-js/internals/iterators-core.js");
          var IteratorPrototype = IteratorsCore.IteratorPrototype;
          var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
          var ITERATOR = wellKnownSymbol("iterator");
          var KEYS = "keys";
          var VALUES = "values";
          var ENTRIES = "entries";
          var returnThis = function() {
            return this;
          };
          module3.exports = function(Iterable, NAME2, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
            createIteratorConstructor(IteratorConstructor, NAME2, next);
            var getIterationMethod = function(KIND) {
              if (KIND === DEFAULT && defaultIterator)
                return defaultIterator;
              if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype)
                return IterablePrototype[KIND];
              switch (KIND) {
                case KEYS:
                  return function keys() {
                    return new IteratorConstructor(this, KIND);
                  };
                case VALUES:
                  return function values() {
                    return new IteratorConstructor(this, KIND);
                  };
                case ENTRIES:
                  return function entries() {
                    return new IteratorConstructor(this, KIND);
                  };
              }
              return function() {
                return new IteratorConstructor(this);
              };
            };
            var TO_STRING_TAG = NAME2 + " Iterator";
            var INCORRECT_VALUES_NAME = false;
            var IterablePrototype = Iterable.prototype;
            var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
            var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
            var anyNativeIterator = NAME2 == "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
            var CurrentIteratorPrototype, methods, KEY;
            if (anyNativeIterator) {
              CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
              if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
                if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
                  if (setPrototypeOf) {
                    setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
                  } else if (typeof CurrentIteratorPrototype[ITERATOR] != "function") {
                    hide(CurrentIteratorPrototype, ITERATOR, returnThis);
                  }
                }
                setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
                if (IS_PURE)
                  Iterators[TO_STRING_TAG] = returnThis;
              }
            }
            if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
              INCORRECT_VALUES_NAME = true;
              defaultIterator = function values() {
                return nativeIterator.call(this);
              };
            }
            if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
              hide(IterablePrototype, ITERATOR, defaultIterator);
            }
            Iterators[NAME2] = defaultIterator;
            if (DEFAULT) {
              methods = {
                values: getIterationMethod(VALUES),
                keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
                entries: getIterationMethod(ENTRIES)
              };
              if (FORCED)
                for (KEY in methods) {
                  if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
                    redefine(IterablePrototype, KEY, methods[KEY]);
                  }
                }
              else
                $({ target: NAME2, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
            }
            return methods;
          };
        },
        "./node_modules/core-js/internals/descriptors.js": function(module3, exports2, __webpack_require__) {
          var fails = __webpack_require__("./node_modules/core-js/internals/fails.js");
          module3.exports = !fails(function() {
            return Object.defineProperty({}, "a", { get: function() {
              return 7;
            } }).a != 7;
          });
        },
        "./node_modules/core-js/internals/document-create-element.js": function(module3, exports2, __webpack_require__) {
          var global2 = __webpack_require__("./node_modules/core-js/internals/global.js");
          var isObject = __webpack_require__("./node_modules/core-js/internals/is-object.js");
          var document2 = global2.document;
          var exist = isObject(document2) && isObject(document2.createElement);
          module3.exports = function(it) {
            return exist ? document2.createElement(it) : {};
          };
        },
        "./node_modules/core-js/internals/enum-bug-keys.js": function(module3, exports2) {
          module3.exports = [
            "constructor",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "toLocaleString",
            "toString",
            "valueOf"
          ];
        },
        "./node_modules/core-js/internals/export.js": function(module3, exports2, __webpack_require__) {
          var global2 = __webpack_require__("./node_modules/core-js/internals/global.js");
          var getOwnPropertyDescriptor = __webpack_require__("./node_modules/core-js/internals/object-get-own-property-descriptor.js").f;
          var hide = __webpack_require__("./node_modules/core-js/internals/hide.js");
          var redefine = __webpack_require__("./node_modules/core-js/internals/redefine.js");
          var setGlobal = __webpack_require__("./node_modules/core-js/internals/set-global.js");
          var copyConstructorProperties = __webpack_require__("./node_modules/core-js/internals/copy-constructor-properties.js");
          var isForced = __webpack_require__("./node_modules/core-js/internals/is-forced.js");
          module3.exports = function(options2, source) {
            var TARGET = options2.target;
            var GLOBAL = options2.global;
            var STATIC = options2.stat;
            var FORCED, target, key, targetProperty, sourceProperty, descriptor;
            if (GLOBAL) {
              target = global2;
            } else if (STATIC) {
              target = global2[TARGET] || setGlobal(TARGET, {});
            } else {
              target = (global2[TARGET] || {}).prototype;
            }
            if (target)
              for (key in source) {
                sourceProperty = source[key];
                if (options2.noTargetGet) {
                  descriptor = getOwnPropertyDescriptor(target, key);
                  targetProperty = descriptor && descriptor.value;
                } else
                  targetProperty = target[key];
                FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options2.forced);
                if (!FORCED && targetProperty !== void 0) {
                  if (typeof sourceProperty === typeof targetProperty)
                    continue;
                  copyConstructorProperties(sourceProperty, targetProperty);
                }
                if (options2.sham || targetProperty && targetProperty.sham) {
                  hide(sourceProperty, "sham", true);
                }
                redefine(target, key, sourceProperty, options2);
              }
          };
        },
        "./node_modules/core-js/internals/fails.js": function(module3, exports2) {
          module3.exports = function(exec) {
            try {
              return !!exec();
            } catch (error3) {
              return true;
            }
          };
        },
        "./node_modules/core-js/internals/function-to-string.js": function(module3, exports2, __webpack_require__) {
          var shared = __webpack_require__("./node_modules/core-js/internals/shared.js");
          module3.exports = shared("native-function-to-string", Function.toString);
        },
        "./node_modules/core-js/internals/get-iterator-method.js": function(module3, exports2, __webpack_require__) {
          var classof = __webpack_require__("./node_modules/core-js/internals/classof.js");
          var Iterators = __webpack_require__("./node_modules/core-js/internals/iterators.js");
          var wellKnownSymbol = __webpack_require__("./node_modules/core-js/internals/well-known-symbol.js");
          var ITERATOR = wellKnownSymbol("iterator");
          module3.exports = function(it) {
            if (it != void 0)
              return it[ITERATOR] || it["@@iterator"] || Iterators[classof(it)];
          };
        },
        "./node_modules/core-js/internals/global.js": function(module3, exports2, __webpack_require__) {
          (function(global2) {
            var O = "object";
            var check = function(it) {
              return it && it.Math == Math && it;
            };
            module3.exports = check(typeof globalThis == O && globalThis) || check(typeof window == O && window) || check(typeof self == O && self) || check(typeof global2 == O && global2) || Function("return this")();
          }).call(this, __webpack_require__("./node_modules/webpack/buildin/global.js"));
        },
        "./node_modules/core-js/internals/has.js": function(module3, exports2) {
          var hasOwnProperty = {}.hasOwnProperty;
          module3.exports = function(it, key) {
            return hasOwnProperty.call(it, key);
          };
        },
        "./node_modules/core-js/internals/hidden-keys.js": function(module3, exports2) {
          module3.exports = {};
        },
        "./node_modules/core-js/internals/hide.js": function(module3, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("./node_modules/core-js/internals/descriptors.js");
          var definePropertyModule = __webpack_require__("./node_modules/core-js/internals/object-define-property.js");
          var createPropertyDescriptor = __webpack_require__("./node_modules/core-js/internals/create-property-descriptor.js");
          module3.exports = DESCRIPTORS ? function(object, key, value) {
            return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
          } : function(object, key, value) {
            object[key] = value;
            return object;
          };
        },
        "./node_modules/core-js/internals/html.js": function(module3, exports2, __webpack_require__) {
          var global2 = __webpack_require__("./node_modules/core-js/internals/global.js");
          var document2 = global2.document;
          module3.exports = document2 && document2.documentElement;
        },
        "./node_modules/core-js/internals/ie8-dom-define.js": function(module3, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("./node_modules/core-js/internals/descriptors.js");
          var fails = __webpack_require__("./node_modules/core-js/internals/fails.js");
          var createElement = __webpack_require__("./node_modules/core-js/internals/document-create-element.js");
          module3.exports = !DESCRIPTORS && !fails(function() {
            return Object.defineProperty(createElement("div"), "a", {
              get: function() {
                return 7;
              }
            }).a != 7;
          });
        },
        "./node_modules/core-js/internals/indexed-object.js": function(module3, exports2, __webpack_require__) {
          var fails = __webpack_require__("./node_modules/core-js/internals/fails.js");
          var classof = __webpack_require__("./node_modules/core-js/internals/classof-raw.js");
          var split = "".split;
          module3.exports = fails(function() {
            return !Object("z").propertyIsEnumerable(0);
          }) ? function(it) {
            return classof(it) == "String" ? split.call(it, "") : Object(it);
          } : Object;
        },
        "./node_modules/core-js/internals/internal-state.js": function(module3, exports2, __webpack_require__) {
          var NATIVE_WEAK_MAP = __webpack_require__("./node_modules/core-js/internals/native-weak-map.js");
          var global2 = __webpack_require__("./node_modules/core-js/internals/global.js");
          var isObject = __webpack_require__("./node_modules/core-js/internals/is-object.js");
          var hide = __webpack_require__("./node_modules/core-js/internals/hide.js");
          var objectHas = __webpack_require__("./node_modules/core-js/internals/has.js");
          var sharedKey = __webpack_require__("./node_modules/core-js/internals/shared-key.js");
          var hiddenKeys = __webpack_require__("./node_modules/core-js/internals/hidden-keys.js");
          var WeakMap2 = global2.WeakMap;
          var set, get, has;
          var enforce = function(it) {
            return has(it) ? get(it) : set(it, {});
          };
          var getterFor = function(TYPE) {
            return function(it) {
              var state;
              if (!isObject(it) || (state = get(it)).type !== TYPE) {
                throw TypeError("Incompatible receiver, " + TYPE + " required");
              }
              return state;
            };
          };
          if (NATIVE_WEAK_MAP) {
            var store2 = new WeakMap2();
            var wmget = store2.get;
            var wmhas = store2.has;
            var wmset = store2.set;
            set = function(it, metadata) {
              wmset.call(store2, it, metadata);
              return metadata;
            };
            get = function(it) {
              return wmget.call(store2, it) || {};
            };
            has = function(it) {
              return wmhas.call(store2, it);
            };
          } else {
            var STATE = sharedKey("state");
            hiddenKeys[STATE] = true;
            set = function(it, metadata) {
              hide(it, STATE, metadata);
              return metadata;
            };
            get = function(it) {
              return objectHas(it, STATE) ? it[STATE] : {};
            };
            has = function(it) {
              return objectHas(it, STATE);
            };
          }
          module3.exports = {
            set,
            get,
            has,
            enforce,
            getterFor
          };
        },
        "./node_modules/core-js/internals/is-array-iterator-method.js": function(module3, exports2, __webpack_require__) {
          var wellKnownSymbol = __webpack_require__("./node_modules/core-js/internals/well-known-symbol.js");
          var Iterators = __webpack_require__("./node_modules/core-js/internals/iterators.js");
          var ITERATOR = wellKnownSymbol("iterator");
          var ArrayPrototype = Array.prototype;
          module3.exports = function(it) {
            return it !== void 0 && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
          };
        },
        "./node_modules/core-js/internals/is-forced.js": function(module3, exports2, __webpack_require__) {
          var fails = __webpack_require__("./node_modules/core-js/internals/fails.js");
          var replacement = /#|\.prototype\./;
          var isForced = function(feature, detection) {
            var value = data[normalize2(feature)];
            return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == "function" ? fails(detection) : !!detection;
          };
          var normalize2 = isForced.normalize = function(string) {
            return String(string).replace(replacement, ".").toLowerCase();
          };
          var data = isForced.data = {};
          var NATIVE = isForced.NATIVE = "N";
          var POLYFILL = isForced.POLYFILL = "P";
          module3.exports = isForced;
        },
        "./node_modules/core-js/internals/is-object.js": function(module3, exports2) {
          module3.exports = function(it) {
            return typeof it === "object" ? it !== null : typeof it === "function";
          };
        },
        "./node_modules/core-js/internals/is-pure.js": function(module3, exports2) {
          module3.exports = false;
        },
        "./node_modules/core-js/internals/iterators-core.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          var getPrototypeOf = __webpack_require__("./node_modules/core-js/internals/object-get-prototype-of.js");
          var hide = __webpack_require__("./node_modules/core-js/internals/hide.js");
          var has = __webpack_require__("./node_modules/core-js/internals/has.js");
          var wellKnownSymbol = __webpack_require__("./node_modules/core-js/internals/well-known-symbol.js");
          var IS_PURE = __webpack_require__("./node_modules/core-js/internals/is-pure.js");
          var ITERATOR = wellKnownSymbol("iterator");
          var BUGGY_SAFARI_ITERATORS = false;
          var returnThis = function() {
            return this;
          };
          var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;
          if ([].keys) {
            arrayIterator = [].keys();
            if (!("next" in arrayIterator))
              BUGGY_SAFARI_ITERATORS = true;
            else {
              PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
              if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
                IteratorPrototype = PrototypeOfArrayIteratorPrototype;
            }
          }
          if (IteratorPrototype == void 0)
            IteratorPrototype = {};
          if (!IS_PURE && !has(IteratorPrototype, ITERATOR))
            hide(IteratorPrototype, ITERATOR, returnThis);
          module3.exports = {
            IteratorPrototype,
            BUGGY_SAFARI_ITERATORS
          };
        },
        "./node_modules/core-js/internals/iterators.js": function(module3, exports2) {
          module3.exports = {};
        },
        "./node_modules/core-js/internals/native-symbol.js": function(module3, exports2, __webpack_require__) {
          var fails = __webpack_require__("./node_modules/core-js/internals/fails.js");
          module3.exports = !!Object.getOwnPropertySymbols && !fails(function() {
            return !String(Symbol());
          });
        },
        "./node_modules/core-js/internals/native-weak-map.js": function(module3, exports2, __webpack_require__) {
          var global2 = __webpack_require__("./node_modules/core-js/internals/global.js");
          var nativeFunctionToString = __webpack_require__("./node_modules/core-js/internals/function-to-string.js");
          var WeakMap2 = global2.WeakMap;
          module3.exports = typeof WeakMap2 === "function" && /native code/.test(nativeFunctionToString.call(WeakMap2));
        },
        "./node_modules/core-js/internals/object-create.js": function(module3, exports2, __webpack_require__) {
          var anObject = __webpack_require__("./node_modules/core-js/internals/an-object.js");
          var defineProperties = __webpack_require__("./node_modules/core-js/internals/object-define-properties.js");
          var enumBugKeys = __webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js");
          var hiddenKeys = __webpack_require__("./node_modules/core-js/internals/hidden-keys.js");
          var html = __webpack_require__("./node_modules/core-js/internals/html.js");
          var documentCreateElement = __webpack_require__("./node_modules/core-js/internals/document-create-element.js");
          var sharedKey = __webpack_require__("./node_modules/core-js/internals/shared-key.js");
          var IE_PROTO = sharedKey("IE_PROTO");
          var PROTOTYPE = "prototype";
          var Empty = function() {
          };
          var createDict = function() {
            var iframe = documentCreateElement("iframe");
            var length = enumBugKeys.length;
            var lt = "<";
            var script = "script";
            var gt = ">";
            var js = "java" + script + ":";
            var iframeDocument;
            iframe.style.display = "none";
            html.appendChild(iframe);
            iframe.src = String(js);
            iframeDocument = iframe.contentWindow.document;
            iframeDocument.open();
            iframeDocument.write(lt + script + gt + "document.F=Object" + lt + "/" + script + gt);
            iframeDocument.close();
            createDict = iframeDocument.F;
            while (length--)
              delete createDict[PROTOTYPE][enumBugKeys[length]];
            return createDict();
          };
          module3.exports = Object.create || function create(O, Properties) {
            var result;
            if (O !== null) {
              Empty[PROTOTYPE] = anObject(O);
              result = new Empty();
              Empty[PROTOTYPE] = null;
              result[IE_PROTO] = O;
            } else
              result = createDict();
            return Properties === void 0 ? result : defineProperties(result, Properties);
          };
          hiddenKeys[IE_PROTO] = true;
        },
        "./node_modules/core-js/internals/object-define-properties.js": function(module3, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("./node_modules/core-js/internals/descriptors.js");
          var definePropertyModule = __webpack_require__("./node_modules/core-js/internals/object-define-property.js");
          var anObject = __webpack_require__("./node_modules/core-js/internals/an-object.js");
          var objectKeys = __webpack_require__("./node_modules/core-js/internals/object-keys.js");
          module3.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
            anObject(O);
            var keys = objectKeys(Properties);
            var length = keys.length;
            var i = 0;
            var key;
            while (length > i)
              definePropertyModule.f(O, key = keys[i++], Properties[key]);
            return O;
          };
        },
        "./node_modules/core-js/internals/object-define-property.js": function(module3, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("./node_modules/core-js/internals/descriptors.js");
          var IE8_DOM_DEFINE = __webpack_require__("./node_modules/core-js/internals/ie8-dom-define.js");
          var anObject = __webpack_require__("./node_modules/core-js/internals/an-object.js");
          var toPrimitive = __webpack_require__("./node_modules/core-js/internals/to-primitive.js");
          var nativeDefineProperty = Object.defineProperty;
          exports2.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
            anObject(O);
            P = toPrimitive(P, true);
            anObject(Attributes);
            if (IE8_DOM_DEFINE)
              try {
                return nativeDefineProperty(O, P, Attributes);
              } catch (error3) {
              }
            if ("get" in Attributes || "set" in Attributes)
              throw TypeError("Accessors not supported");
            if ("value" in Attributes)
              O[P] = Attributes.value;
            return O;
          };
        },
        "./node_modules/core-js/internals/object-get-own-property-descriptor.js": function(module3, exports2, __webpack_require__) {
          var DESCRIPTORS = __webpack_require__("./node_modules/core-js/internals/descriptors.js");
          var propertyIsEnumerableModule = __webpack_require__("./node_modules/core-js/internals/object-property-is-enumerable.js");
          var createPropertyDescriptor = __webpack_require__("./node_modules/core-js/internals/create-property-descriptor.js");
          var toIndexedObject = __webpack_require__("./node_modules/core-js/internals/to-indexed-object.js");
          var toPrimitive = __webpack_require__("./node_modules/core-js/internals/to-primitive.js");
          var has = __webpack_require__("./node_modules/core-js/internals/has.js");
          var IE8_DOM_DEFINE = __webpack_require__("./node_modules/core-js/internals/ie8-dom-define.js");
          var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
          exports2.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
            O = toIndexedObject(O);
            P = toPrimitive(P, true);
            if (IE8_DOM_DEFINE)
              try {
                return nativeGetOwnPropertyDescriptor(O, P);
              } catch (error3) {
              }
            if (has(O, P))
              return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
          };
        },
        "./node_modules/core-js/internals/object-get-own-property-names.js": function(module3, exports2, __webpack_require__) {
          var internalObjectKeys = __webpack_require__("./node_modules/core-js/internals/object-keys-internal.js");
          var enumBugKeys = __webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js");
          var hiddenKeys = enumBugKeys.concat("length", "prototype");
          exports2.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
            return internalObjectKeys(O, hiddenKeys);
          };
        },
        "./node_modules/core-js/internals/object-get-own-property-symbols.js": function(module3, exports2) {
          exports2.f = Object.getOwnPropertySymbols;
        },
        "./node_modules/core-js/internals/object-get-prototype-of.js": function(module3, exports2, __webpack_require__) {
          var has = __webpack_require__("./node_modules/core-js/internals/has.js");
          var toObject = __webpack_require__("./node_modules/core-js/internals/to-object.js");
          var sharedKey = __webpack_require__("./node_modules/core-js/internals/shared-key.js");
          var CORRECT_PROTOTYPE_GETTER = __webpack_require__("./node_modules/core-js/internals/correct-prototype-getter.js");
          var IE_PROTO = sharedKey("IE_PROTO");
          var ObjectPrototype = Object.prototype;
          module3.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function(O) {
            O = toObject(O);
            if (has(O, IE_PROTO))
              return O[IE_PROTO];
            if (typeof O.constructor == "function" && O instanceof O.constructor) {
              return O.constructor.prototype;
            }
            return O instanceof Object ? ObjectPrototype : null;
          };
        },
        "./node_modules/core-js/internals/object-keys-internal.js": function(module3, exports2, __webpack_require__) {
          var has = __webpack_require__("./node_modules/core-js/internals/has.js");
          var toIndexedObject = __webpack_require__("./node_modules/core-js/internals/to-indexed-object.js");
          var arrayIncludes = __webpack_require__("./node_modules/core-js/internals/array-includes.js");
          var hiddenKeys = __webpack_require__("./node_modules/core-js/internals/hidden-keys.js");
          var arrayIndexOf = arrayIncludes(false);
          module3.exports = function(object, names) {
            var O = toIndexedObject(object);
            var i = 0;
            var result = [];
            var key;
            for (key in O)
              !has(hiddenKeys, key) && has(O, key) && result.push(key);
            while (names.length > i)
              if (has(O, key = names[i++])) {
                ~arrayIndexOf(result, key) || result.push(key);
              }
            return result;
          };
        },
        "./node_modules/core-js/internals/object-keys.js": function(module3, exports2, __webpack_require__) {
          var internalObjectKeys = __webpack_require__("./node_modules/core-js/internals/object-keys-internal.js");
          var enumBugKeys = __webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js");
          module3.exports = Object.keys || function keys(O) {
            return internalObjectKeys(O, enumBugKeys);
          };
        },
        "./node_modules/core-js/internals/object-property-is-enumerable.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
          var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
          var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);
          exports2.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
            var descriptor = getOwnPropertyDescriptor(this, V);
            return !!descriptor && descriptor.enumerable;
          } : nativePropertyIsEnumerable;
        },
        "./node_modules/core-js/internals/object-set-prototype-of.js": function(module3, exports2, __webpack_require__) {
          var validateSetPrototypeOfArguments = __webpack_require__("./node_modules/core-js/internals/validate-set-prototype-of-arguments.js");
          module3.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
            var correctSetter = false;
            var test = {};
            var setter;
            try {
              setter = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set;
              setter.call(test, []);
              correctSetter = test instanceof Array;
            } catch (error3) {
            }
            return function setPrototypeOf(O, proto) {
              validateSetPrototypeOfArguments(O, proto);
              if (correctSetter)
                setter.call(O, proto);
              else
                O.__proto__ = proto;
              return O;
            };
          }() : void 0);
        },
        "./node_modules/core-js/internals/own-keys.js": function(module3, exports2, __webpack_require__) {
          var global2 = __webpack_require__("./node_modules/core-js/internals/global.js");
          var getOwnPropertyNamesModule = __webpack_require__("./node_modules/core-js/internals/object-get-own-property-names.js");
          var getOwnPropertySymbolsModule = __webpack_require__("./node_modules/core-js/internals/object-get-own-property-symbols.js");
          var anObject = __webpack_require__("./node_modules/core-js/internals/an-object.js");
          var Reflect2 = global2.Reflect;
          module3.exports = Reflect2 && Reflect2.ownKeys || function ownKeys(it) {
            var keys = getOwnPropertyNamesModule.f(anObject(it));
            var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
            return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
          };
        },
        "./node_modules/core-js/internals/path.js": function(module3, exports2, __webpack_require__) {
          module3.exports = __webpack_require__("./node_modules/core-js/internals/global.js");
        },
        "./node_modules/core-js/internals/redefine.js": function(module3, exports2, __webpack_require__) {
          var global2 = __webpack_require__("./node_modules/core-js/internals/global.js");
          var shared = __webpack_require__("./node_modules/core-js/internals/shared.js");
          var hide = __webpack_require__("./node_modules/core-js/internals/hide.js");
          var has = __webpack_require__("./node_modules/core-js/internals/has.js");
          var setGlobal = __webpack_require__("./node_modules/core-js/internals/set-global.js");
          var nativeFunctionToString = __webpack_require__("./node_modules/core-js/internals/function-to-string.js");
          var InternalStateModule = __webpack_require__("./node_modules/core-js/internals/internal-state.js");
          var getInternalState = InternalStateModule.get;
          var enforceInternalState = InternalStateModule.enforce;
          var TEMPLATE = String(nativeFunctionToString).split("toString");
          shared("inspectSource", function(it) {
            return nativeFunctionToString.call(it);
          });
          (module3.exports = function(O, key, value, options2) {
            var unsafe = options2 ? !!options2.unsafe : false;
            var simple = options2 ? !!options2.enumerable : false;
            var noTargetGet = options2 ? !!options2.noTargetGet : false;
            if (typeof value == "function") {
              if (typeof key == "string" && !has(value, "name"))
                hide(value, "name", key);
              enforceInternalState(value).source = TEMPLATE.join(typeof key == "string" ? key : "");
            }
            if (O === global2) {
              if (simple)
                O[key] = value;
              else
                setGlobal(key, value);
              return;
            } else if (!unsafe) {
              delete O[key];
            } else if (!noTargetGet && O[key]) {
              simple = true;
            }
            if (simple)
              O[key] = value;
            else
              hide(O, key, value);
          })(Function.prototype, "toString", function toString() {
            return typeof this == "function" && getInternalState(this).source || nativeFunctionToString.call(this);
          });
        },
        "./node_modules/core-js/internals/require-object-coercible.js": function(module3, exports2) {
          module3.exports = function(it) {
            if (it == void 0)
              throw TypeError("Can't call method on " + it);
            return it;
          };
        },
        "./node_modules/core-js/internals/set-global.js": function(module3, exports2, __webpack_require__) {
          var global2 = __webpack_require__("./node_modules/core-js/internals/global.js");
          var hide = __webpack_require__("./node_modules/core-js/internals/hide.js");
          module3.exports = function(key, value) {
            try {
              hide(global2, key, value);
            } catch (error3) {
              global2[key] = value;
            }
            return value;
          };
        },
        "./node_modules/core-js/internals/set-to-string-tag.js": function(module3, exports2, __webpack_require__) {
          var defineProperty = __webpack_require__("./node_modules/core-js/internals/object-define-property.js").f;
          var has = __webpack_require__("./node_modules/core-js/internals/has.js");
          var wellKnownSymbol = __webpack_require__("./node_modules/core-js/internals/well-known-symbol.js");
          var TO_STRING_TAG = wellKnownSymbol("toStringTag");
          module3.exports = function(it, TAG, STATIC) {
            if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
              defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
            }
          };
        },
        "./node_modules/core-js/internals/shared-key.js": function(module3, exports2, __webpack_require__) {
          var shared = __webpack_require__("./node_modules/core-js/internals/shared.js");
          var uid = __webpack_require__("./node_modules/core-js/internals/uid.js");
          var keys = shared("keys");
          module3.exports = function(key) {
            return keys[key] || (keys[key] = uid(key));
          };
        },
        "./node_modules/core-js/internals/shared.js": function(module3, exports2, __webpack_require__) {
          var global2 = __webpack_require__("./node_modules/core-js/internals/global.js");
          var setGlobal = __webpack_require__("./node_modules/core-js/internals/set-global.js");
          var IS_PURE = __webpack_require__("./node_modules/core-js/internals/is-pure.js");
          var SHARED = "__core-js_shared__";
          var store2 = global2[SHARED] || setGlobal(SHARED, {});
          (module3.exports = function(key, value) {
            return store2[key] || (store2[key] = value !== void 0 ? value : {});
          })("versions", []).push({
            version: "3.1.3",
            mode: IS_PURE ? "pure" : "global",
            copyright: "\xA9 2019 Denis Pushkarev (zloirock.ru)"
          });
        },
        "./node_modules/core-js/internals/string-at.js": function(module3, exports2, __webpack_require__) {
          var toInteger = __webpack_require__("./node_modules/core-js/internals/to-integer.js");
          var requireObjectCoercible = __webpack_require__("./node_modules/core-js/internals/require-object-coercible.js");
          module3.exports = function(that, pos, CONVERT_TO_STRING) {
            var S = String(requireObjectCoercible(that));
            var position = toInteger(pos);
            var size = S.length;
            var first, second2;
            if (position < 0 || position >= size)
              return CONVERT_TO_STRING ? "" : void 0;
            first = S.charCodeAt(position);
            return first < 55296 || first > 56319 || position + 1 === size || (second2 = S.charCodeAt(position + 1)) < 56320 || second2 > 57343 ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 55296 << 10) + (second2 - 56320) + 65536;
          };
        },
        "./node_modules/core-js/internals/to-absolute-index.js": function(module3, exports2, __webpack_require__) {
          var toInteger = __webpack_require__("./node_modules/core-js/internals/to-integer.js");
          var max = Math.max;
          var min = Math.min;
          module3.exports = function(index2, length) {
            var integer = toInteger(index2);
            return integer < 0 ? max(integer + length, 0) : min(integer, length);
          };
        },
        "./node_modules/core-js/internals/to-indexed-object.js": function(module3, exports2, __webpack_require__) {
          var IndexedObject = __webpack_require__("./node_modules/core-js/internals/indexed-object.js");
          var requireObjectCoercible = __webpack_require__("./node_modules/core-js/internals/require-object-coercible.js");
          module3.exports = function(it) {
            return IndexedObject(requireObjectCoercible(it));
          };
        },
        "./node_modules/core-js/internals/to-integer.js": function(module3, exports2) {
          var ceil = Math.ceil;
          var floor = Math.floor;
          module3.exports = function(argument) {
            return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
          };
        },
        "./node_modules/core-js/internals/to-length.js": function(module3, exports2, __webpack_require__) {
          var toInteger = __webpack_require__("./node_modules/core-js/internals/to-integer.js");
          var min = Math.min;
          module3.exports = function(argument) {
            return argument > 0 ? min(toInteger(argument), 9007199254740991) : 0;
          };
        },
        "./node_modules/core-js/internals/to-object.js": function(module3, exports2, __webpack_require__) {
          var requireObjectCoercible = __webpack_require__("./node_modules/core-js/internals/require-object-coercible.js");
          module3.exports = function(argument) {
            return Object(requireObjectCoercible(argument));
          };
        },
        "./node_modules/core-js/internals/to-primitive.js": function(module3, exports2, __webpack_require__) {
          var isObject = __webpack_require__("./node_modules/core-js/internals/is-object.js");
          module3.exports = function(it, S) {
            if (!isObject(it))
              return it;
            var fn, val;
            if (S && typeof (fn = it.toString) == "function" && !isObject(val = fn.call(it)))
              return val;
            if (typeof (fn = it.valueOf) == "function" && !isObject(val = fn.call(it)))
              return val;
            if (!S && typeof (fn = it.toString) == "function" && !isObject(val = fn.call(it)))
              return val;
            throw TypeError("Can't convert object to primitive value");
          };
        },
        "./node_modules/core-js/internals/uid.js": function(module3, exports2) {
          var id = 0;
          var postfix = Math.random();
          module3.exports = function(key) {
            return "Symbol(".concat(key === void 0 ? "" : key, ")_", (++id + postfix).toString(36));
          };
        },
        "./node_modules/core-js/internals/validate-set-prototype-of-arguments.js": function(module3, exports2, __webpack_require__) {
          var isObject = __webpack_require__("./node_modules/core-js/internals/is-object.js");
          var anObject = __webpack_require__("./node_modules/core-js/internals/an-object.js");
          module3.exports = function(O, proto) {
            anObject(O);
            if (!isObject(proto) && proto !== null) {
              throw TypeError("Can't set " + String(proto) + " as a prototype");
            }
          };
        },
        "./node_modules/core-js/internals/well-known-symbol.js": function(module3, exports2, __webpack_require__) {
          var global2 = __webpack_require__("./node_modules/core-js/internals/global.js");
          var shared = __webpack_require__("./node_modules/core-js/internals/shared.js");
          var uid = __webpack_require__("./node_modules/core-js/internals/uid.js");
          var NATIVE_SYMBOL = __webpack_require__("./node_modules/core-js/internals/native-symbol.js");
          var Symbol2 = global2.Symbol;
          var store2 = shared("wks");
          module3.exports = function(name) {
            return store2[name] || (store2[name] = NATIVE_SYMBOL && Symbol2[name] || (NATIVE_SYMBOL ? Symbol2 : uid)("Symbol." + name));
          };
        },
        "./node_modules/core-js/modules/es.array.from.js": function(module3, exports2, __webpack_require__) {
          var $ = __webpack_require__("./node_modules/core-js/internals/export.js");
          var from = __webpack_require__("./node_modules/core-js/internals/array-from.js");
          var checkCorrectnessOfIteration = __webpack_require__("./node_modules/core-js/internals/check-correctness-of-iteration.js");
          var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function(iterable) {
            Array.from(iterable);
          });
          $({ target: "Array", stat: true, forced: INCORRECT_ITERATION }, {
            from
          });
        },
        "./node_modules/core-js/modules/es.string.iterator.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          var codePointAt = __webpack_require__("./node_modules/core-js/internals/string-at.js");
          var InternalStateModule = __webpack_require__("./node_modules/core-js/internals/internal-state.js");
          var defineIterator = __webpack_require__("./node_modules/core-js/internals/define-iterator.js");
          var STRING_ITERATOR = "String Iterator";
          var setInternalState = InternalStateModule.set;
          var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);
          defineIterator(String, "String", function(iterated) {
            setInternalState(this, {
              type: STRING_ITERATOR,
              string: String(iterated),
              index: 0
            });
          }, function next() {
            var state = getInternalState(this);
            var string = state.string;
            var index2 = state.index;
            var point;
            if (index2 >= string.length)
              return { value: void 0, done: true };
            point = codePointAt(string, index2, true);
            state.index += point.length;
            return { value: point, done: false };
          });
        },
        "./node_modules/webpack/buildin/global.js": function(module3, exports2) {
          var g;
          g = function() {
            return this;
          }();
          try {
            g = g || Function("return this")() || (1, eval)("this");
          } catch (e) {
            if (typeof window === "object")
              g = window;
          }
          module3.exports = g;
        },
        "./src/default-attrs.json": function(module3) {
          module3.exports = { "xmlns": "http://www.w3.org/2000/svg", "width": 24, "height": 24, "viewBox": "0 0 24 24", "fill": "none", "stroke": "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" };
        },
        "./src/icon.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key];
                }
              }
            }
            return target;
          };
          var _createClass = function() {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function(Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                defineProperties(Constructor, staticProps);
              return Constructor;
            };
          }();
          var _dedupe = __webpack_require__("./node_modules/classnames/dedupe.js");
          var _dedupe2 = _interopRequireDefault(_dedupe);
          var _defaultAttrs = __webpack_require__("./src/default-attrs.json");
          var _defaultAttrs2 = _interopRequireDefault(_defaultAttrs);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          var Icon2 = function() {
            function Icon3(name, contents) {
              var tags = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
              _classCallCheck(this, Icon3);
              this.name = name;
              this.contents = contents;
              this.tags = tags;
              this.attrs = _extends({}, _defaultAttrs2.default, { class: "feather feather-" + name });
            }
            _createClass(Icon3, [{
              key: "toSvg",
              value: function toSvg() {
                var attrs = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                var combinedAttrs = _extends({}, this.attrs, attrs, { class: (0, _dedupe2.default)(this.attrs.class, attrs.class) });
                return "<svg " + attrsToString(combinedAttrs) + ">" + this.contents + "</svg>";
              }
            }, {
              key: "toString",
              value: function toString() {
                return this.contents;
              }
            }]);
            return Icon3;
          }();
          function attrsToString(attrs) {
            return Object.keys(attrs).map(function(key) {
              return key + '="' + attrs[key] + '"';
            }).join(" ");
          }
          exports2.default = Icon2;
        },
        "./src/icons.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _icon = __webpack_require__("./src/icon.js");
          var _icon2 = _interopRequireDefault(_icon);
          var _icons = __webpack_require__("./dist/icons.json");
          var _icons2 = _interopRequireDefault(_icons);
          var _tags = __webpack_require__("./src/tags.json");
          var _tags2 = _interopRequireDefault(_tags);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          exports2.default = Object.keys(_icons2.default).map(function(key) {
            return new _icon2.default(key, _icons2.default[key], _tags2.default[key]);
          }).reduce(function(object, icon) {
            object[icon.name] = icon;
            return object;
          }, {});
        },
        "./src/index.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          var _icons = __webpack_require__("./src/icons.js");
          var _icons2 = _interopRequireDefault(_icons);
          var _toSvg = __webpack_require__("./src/to-svg.js");
          var _toSvg2 = _interopRequireDefault(_toSvg);
          var _replace = __webpack_require__("./src/replace.js");
          var _replace2 = _interopRequireDefault(_replace);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          module3.exports = { icons: _icons2.default, toSvg: _toSvg2.default, replace: _replace2.default };
        },
        "./src/replace.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key];
                }
              }
            }
            return target;
          };
          var _dedupe = __webpack_require__("./node_modules/classnames/dedupe.js");
          var _dedupe2 = _interopRequireDefault(_dedupe);
          var _icons = __webpack_require__("./src/icons.js");
          var _icons2 = _interopRequireDefault(_icons);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function replace() {
            var attrs = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            if (typeof document === "undefined") {
              throw new Error("`feather.replace()` only works in a browser environment.");
            }
            var elementsToReplace = document.querySelectorAll("[data-feather]");
            Array.from(elementsToReplace).forEach(function(element) {
              return replaceElement(element, attrs);
            });
          }
          function replaceElement(element) {
            var attrs = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            var elementAttrs = getAttrs(element);
            var name = elementAttrs["data-feather"];
            delete elementAttrs["data-feather"];
            var svgString = _icons2.default[name].toSvg(_extends({}, attrs, elementAttrs, { class: (0, _dedupe2.default)(attrs.class, elementAttrs.class) }));
            var svgDocument = new DOMParser().parseFromString(svgString, "image/svg+xml");
            var svgElement = svgDocument.querySelector("svg");
            element.parentNode.replaceChild(svgElement, element);
          }
          function getAttrs(element) {
            return Array.from(element.attributes).reduce(function(attrs, attr) {
              attrs[attr.name] = attr.value;
              return attrs;
            }, {});
          }
          exports2.default = replace;
        },
        "./src/tags.json": function(module3) {
          module3.exports = { "activity": ["pulse", "health", "action", "motion"], "airplay": ["stream", "cast", "mirroring"], "alert-circle": ["warning", "alert", "danger"], "alert-octagon": ["warning", "alert", "danger"], "alert-triangle": ["warning", "alert", "danger"], "align-center": ["text alignment", "center"], "align-justify": ["text alignment", "justified"], "align-left": ["text alignment", "left"], "align-right": ["text alignment", "right"], "anchor": [], "archive": ["index", "box"], "at-sign": ["mention", "at", "email", "message"], "award": ["achievement", "badge"], "aperture": ["camera", "photo"], "bar-chart": ["statistics", "diagram", "graph"], "bar-chart-2": ["statistics", "diagram", "graph"], "battery": ["power", "electricity"], "battery-charging": ["power", "electricity"], "bell": ["alarm", "notification", "sound"], "bell-off": ["alarm", "notification", "silent"], "bluetooth": ["wireless"], "book-open": ["read", "library"], "book": ["read", "dictionary", "booklet", "magazine", "library"], "bookmark": ["read", "clip", "marker", "tag"], "box": ["cube"], "briefcase": ["work", "bag", "baggage", "folder"], "calendar": ["date"], "camera": ["photo"], "cast": ["chromecast", "airplay"], "circle": ["off", "zero", "record"], "clipboard": ["copy"], "clock": ["time", "watch", "alarm"], "cloud-drizzle": ["weather", "shower"], "cloud-lightning": ["weather", "bolt"], "cloud-rain": ["weather"], "cloud-snow": ["weather", "blizzard"], "cloud": ["weather"], "codepen": ["logo"], "codesandbox": ["logo"], "code": ["source", "programming"], "coffee": ["drink", "cup", "mug", "tea", "cafe", "hot", "beverage"], "columns": ["layout"], "command": ["keyboard", "cmd", "terminal", "prompt"], "compass": ["navigation", "safari", "travel", "direction"], "copy": ["clone", "duplicate"], "corner-down-left": ["arrow", "return"], "corner-down-right": ["arrow"], "corner-left-down": ["arrow"], "corner-left-up": ["arrow"], "corner-right-down": ["arrow"], "corner-right-up": ["arrow"], "corner-up-left": ["arrow"], "corner-up-right": ["arrow"], "cpu": ["processor", "technology"], "credit-card": ["purchase", "payment", "cc"], "crop": ["photo", "image"], "crosshair": ["aim", "target"], "database": ["storage", "memory"], "delete": ["remove"], "disc": ["album", "cd", "dvd", "music"], "dollar-sign": ["currency", "money", "payment"], "droplet": ["water"], "edit": ["pencil", "change"], "edit-2": ["pencil", "change"], "edit-3": ["pencil", "change"], "eye": ["view", "watch"], "eye-off": ["view", "watch", "hide", "hidden"], "external-link": ["outbound"], "facebook": ["logo", "social"], "fast-forward": ["music"], "figma": ["logo", "design", "tool"], "file-minus": ["delete", "remove", "erase"], "file-plus": ["add", "create", "new"], "file-text": ["data", "txt", "pdf"], "film": ["movie", "video"], "filter": ["funnel", "hopper"], "flag": ["report"], "folder-minus": ["directory"], "folder-plus": ["directory"], "folder": ["directory"], "framer": ["logo", "design", "tool"], "frown": ["emoji", "face", "bad", "sad", "emotion"], "gift": ["present", "box", "birthday", "party"], "git-branch": ["code", "version control"], "git-commit": ["code", "version control"], "git-merge": ["code", "version control"], "git-pull-request": ["code", "version control"], "github": ["logo", "version control"], "gitlab": ["logo", "version control"], "globe": ["world", "browser", "language", "translate"], "hard-drive": ["computer", "server", "memory", "data"], "hash": ["hashtag", "number", "pound"], "headphones": ["music", "audio", "sound"], "heart": ["like", "love", "emotion"], "help-circle": ["question mark"], "hexagon": ["shape", "node.js", "logo"], "home": ["house", "living"], "image": ["picture"], "inbox": ["email"], "instagram": ["logo", "camera"], "key": ["password", "login", "authentication", "secure"], "layers": ["stack"], "layout": ["window", "webpage"], "life-bouy": ["help", "life ring", "support"], "link": ["chain", "url"], "link-2": ["chain", "url"], "linkedin": ["logo", "social media"], "list": ["options"], "lock": ["security", "password", "secure"], "log-in": ["sign in", "arrow", "enter"], "log-out": ["sign out", "arrow", "exit"], "mail": ["email", "message"], "map-pin": ["location", "navigation", "travel", "marker"], "map": ["location", "navigation", "travel"], "maximize": ["fullscreen"], "maximize-2": ["fullscreen", "arrows", "expand"], "meh": ["emoji", "face", "neutral", "emotion"], "menu": ["bars", "navigation", "hamburger"], "message-circle": ["comment", "chat"], "message-square": ["comment", "chat"], "mic-off": ["record", "sound", "mute"], "mic": ["record", "sound", "listen"], "minimize": ["exit fullscreen", "close"], "minimize-2": ["exit fullscreen", "arrows", "close"], "minus": ["subtract"], "monitor": ["tv", "screen", "display"], "moon": ["dark", "night"], "more-horizontal": ["ellipsis"], "more-vertical": ["ellipsis"], "mouse-pointer": ["arrow", "cursor"], "move": ["arrows"], "music": ["note"], "navigation": ["location", "travel"], "navigation-2": ["location", "travel"], "octagon": ["stop"], "package": ["box", "container"], "paperclip": ["attachment"], "pause": ["music", "stop"], "pause-circle": ["music", "audio", "stop"], "pen-tool": ["vector", "drawing"], "percent": ["discount"], "phone-call": ["ring"], "phone-forwarded": ["call"], "phone-incoming": ["call"], "phone-missed": ["call"], "phone-off": ["call", "mute"], "phone-outgoing": ["call"], "phone": ["call"], "play": ["music", "start"], "pie-chart": ["statistics", "diagram"], "play-circle": ["music", "start"], "plus": ["add", "new"], "plus-circle": ["add", "new"], "plus-square": ["add", "new"], "pocket": ["logo", "save"], "power": ["on", "off"], "printer": ["fax", "office", "device"], "radio": ["signal"], "refresh-cw": ["synchronise", "arrows"], "refresh-ccw": ["arrows"], "repeat": ["loop", "arrows"], "rewind": ["music"], "rotate-ccw": ["arrow"], "rotate-cw": ["arrow"], "rss": ["feed", "subscribe"], "save": ["floppy disk"], "scissors": ["cut"], "search": ["find", "magnifier", "magnifying glass"], "send": ["message", "mail", "email", "paper airplane", "paper aeroplane"], "settings": ["cog", "edit", "gear", "preferences"], "share-2": ["network", "connections"], "shield": ["security", "secure"], "shield-off": ["security", "insecure"], "shopping-bag": ["ecommerce", "cart", "purchase", "store"], "shopping-cart": ["ecommerce", "cart", "purchase", "store"], "shuffle": ["music"], "skip-back": ["music"], "skip-forward": ["music"], "slack": ["logo"], "slash": ["ban", "no"], "sliders": ["settings", "controls"], "smartphone": ["cellphone", "device"], "smile": ["emoji", "face", "happy", "good", "emotion"], "speaker": ["audio", "music"], "star": ["bookmark", "favorite", "like"], "stop-circle": ["media", "music"], "sun": ["brightness", "weather", "light"], "sunrise": ["weather", "time", "morning", "day"], "sunset": ["weather", "time", "evening", "night"], "tablet": ["device"], "tag": ["label"], "target": ["logo", "bullseye"], "terminal": ["code", "command line", "prompt"], "thermometer": ["temperature", "celsius", "fahrenheit", "weather"], "thumbs-down": ["dislike", "bad", "emotion"], "thumbs-up": ["like", "good", "emotion"], "toggle-left": ["on", "off", "switch"], "toggle-right": ["on", "off", "switch"], "tool": ["settings", "spanner"], "trash": ["garbage", "delete", "remove", "bin"], "trash-2": ["garbage", "delete", "remove", "bin"], "triangle": ["delta"], "truck": ["delivery", "van", "shipping", "transport", "lorry"], "tv": ["television", "stream"], "twitch": ["logo"], "twitter": ["logo", "social"], "type": ["text"], "umbrella": ["rain", "weather"], "unlock": ["security"], "user-check": ["followed", "subscribed"], "user-minus": ["delete", "remove", "unfollow", "unsubscribe"], "user-plus": ["new", "add", "create", "follow", "subscribe"], "user-x": ["delete", "remove", "unfollow", "unsubscribe", "unavailable"], "user": ["person", "account"], "users": ["group"], "video-off": ["camera", "movie", "film"], "video": ["camera", "movie", "film"], "voicemail": ["phone"], "volume": ["music", "sound", "mute"], "volume-1": ["music", "sound"], "volume-2": ["music", "sound"], "volume-x": ["music", "sound", "mute"], "watch": ["clock", "time"], "wifi-off": ["disabled"], "wifi": ["connection", "signal", "wireless"], "wind": ["weather", "air"], "x-circle": ["cancel", "close", "delete", "remove", "times", "clear"], "x-octagon": ["delete", "stop", "alert", "warning", "times", "clear"], "x-square": ["cancel", "close", "delete", "remove", "times", "clear"], "x": ["cancel", "close", "delete", "remove", "times", "clear"], "youtube": ["logo", "video", "play"], "zap-off": ["flash", "camera", "lightning"], "zap": ["flash", "camera", "lightning"], "zoom-in": ["magnifying glass"], "zoom-out": ["magnifying glass"] };
        },
        "./src/to-svg.js": function(module3, exports2, __webpack_require__) {
          "use strict";
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          var _icons = __webpack_require__("./src/icons.js");
          var _icons2 = _interopRequireDefault(_icons);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function toSvg(name) {
            var attrs = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            console.warn("feather.toSvg() is deprecated. Please use feather.icons[name].toSvg() instead.");
            if (!name) {
              throw new Error("The required `key` (icon name) parameter is missing.");
            }
            if (!_icons2.default[name]) {
              throw new Error("No icon matching '" + name + "'. See the complete list of icons at https://feathericons.com");
            }
            return _icons2.default[name].toSvg(attrs);
          }
          exports2.default = toSvg;
        },
        0: function(module3, exports2, __webpack_require__) {
          __webpack_require__("./node_modules/core-js/es/array/from.js");
          module3.exports = __webpack_require__("./src/index.js");
        }
      });
    });
  }
});

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});
init_shims();

// node_modules/@sveltejs/kit/dist/node.js
init_shims();
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      const [type] = h["content-type"].split(/;\s*/);
      if (type === "application/octet-stream") {
        return fulfil(data);
      }
      const encoding = h["content-encoding"] || "utf-8";
      fulfil(new TextDecoder(encoding).decode(data));
    });
  });
}

// .svelte-kit/output/server/app.js
init_shims();

// node_modules/@sveltejs/kit/dist/ssr.js
init_shims();
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  branch,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (branch) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${branch.map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2.path)},
						query: new URLSearchParams(${s$1(page2.query.toString())}),
						params: ${s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const { name, message, stack } = error3;
    serialized = try_serialize({ name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  if (loaded.error) {
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    const status = loaded.status;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error3 };
    }
    return { status, error: error3 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
function resolve(base, path) {
  const baseparts = path[0] === "/" ? [] : base.slice(1).split("/");
  const pathparts = path[0] === "/" ? path.slice(1).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  return `/${baseparts.join("/")}`;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  if (module2.load) {
    const load_input = {
      page: page2,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        if (options2.read && url.startsWith(options2.paths.assets)) {
          url = url.replace(options2.paths.assets, "");
        }
        if (url.startsWith("//")) {
          throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
        }
        let response;
        if (/^[a-zA-Z]+:/.test(url)) {
          const request2 = new (void 0)(url, opts);
          response = await options2.hooks.serverFetch.call(null, request2);
        } else {
          const [path, search] = url.split("?");
          const resolved = resolve(request.path, path);
          const filename = resolved.slice(1);
          const filename_html = `${filename}/index.html`;
          const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
          if (asset) {
            if (options2.read) {
              response = new (void 0)(options2.read(asset.file), {
                headers: {
                  "content-type": asset.type
                }
              });
            } else {
              response = await (void 0)(`http://${page2.host}/${asset.file}`, opts);
            }
          }
          if (!response) {
            const headers = { ...opts.headers };
            if (opts.credentials !== "omit") {
              uses_credentials = true;
              headers.cookie = request.headers.cookie;
              if (!headers.authorization) {
                headers.authorization = request.headers.authorization;
              }
            }
            if (opts.body && typeof opts.body !== "string") {
              throw new Error("Request body must be a string");
            }
            const rendered = await respond({
              host: request.host,
              method: opts.method || "GET",
              headers,
              path: resolved,
              rawBody: opts.body,
              query: new URLSearchParams(search)
            }, options2, {
              fetched: url,
              initiator: route
            });
            if (rendered) {
              if (state.prerender) {
                state.prerender.dependencies.set(resolved, rendered);
              }
              response = new (void 0)(rendered.body, {
                status: rendered.status,
                headers: rendered.headers
              });
            }
          }
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new (void 0)("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error3 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    context: {},
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded.context,
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page: page2
    });
  } catch (error4) {
    options2.handle_error(error4);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
async function respond$1({ request, options: options2, state, $session, route }) {
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id && options2.load_component(id)));
  } catch (error4) {
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  const page_config = {
    ssr: "ssr" in leaf ? leaf.ssr : options2.ssr,
    router: "router" in leaf ? leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? leaf.hydrate : options2.hydrate
  };
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: null
    };
  }
  let branch;
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      branch = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              request,
              options: options2,
              state,
              route,
              page: page2,
              node,
              $session,
              context,
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error3 } = loaded.loaded);
            }
          } catch (e) {
            options2.handle_error(e);
            status = 500;
            error3 = e;
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let error_loaded;
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  error_loaded = await load_node({
                    request,
                    options: options2,
                    state,
                    route,
                    page: page2,
                    node: error_node,
                    $session,
                    context: node_loaded.context,
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (e) {
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        branch.push(loaded);
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      options: options2,
      $session,
      page_config,
      status,
      error: error3,
      branch: branch && branch.filter(Boolean),
      page: page2
    });
  } catch (error4) {
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const $session = await options2.hooks.getSession(request);
  if (route) {
    const response = await respond$1({
      request,
      options: options2,
      state,
      $session,
      route
    });
    if (response) {
      return response;
    }
    if (state.fetched) {
      return {
        status: 500,
        headers: {},
        body: `Bad request in load function: failed to fetch ${state.fetched}`
      };
    }
  } else {
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 404,
      error: new Error(`Not found: ${request.path}`)
    });
  }
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
async function render_route(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (handler) {
    const match = route.pattern.exec(request.path);
    const params = route.params(match);
    const response = await handler({ ...request, params });
    if (response) {
      if (typeof response !== "object") {
        return error(`Invalid response from route ${request.path}: expected an object, got ${typeof response}`);
      }
      let { status = 200, body, headers = {} } = response;
      headers = lowercase_keys(headers);
      const type = headers["content-type"];
      if (type === "application/octet-stream" && !(body instanceof Uint8Array)) {
        return error(`Invalid response from route ${request.path}: body must be an instance of Uint8Array if content type is application/octet-stream`);
      }
      if (body instanceof Uint8Array && type !== "application/octet-stream") {
        return error(`Invalid response from route ${request.path}: Uint8Array body must be accompanied by content-type: application/octet-stream header`);
      }
      let normalized_body;
      if (typeof body === "object" && (!type || type === "application/json")) {
        headers = { ...headers, "content-type": "application/json" };
        normalized_body = JSON.stringify(body);
      } else {
        normalized_body = body;
      }
      return { status, body: normalized_body, headers };
    }
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        map.get(key).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield key;
      }
    }
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value;
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const [type, ...directives] = headers["content-type"].split(/;\s*/);
  if (typeof raw === "string") {
    switch (type) {
      case "text/plain":
        return raw;
      case "application/json":
        return JSON.parse(raw);
      case "application/x-www-form-urlencoded":
        return get_urlencoded(raw);
      case "multipart/form-data": {
        const boundary = directives.find((directive) => directive.startsWith("boundary="));
        if (!boundary)
          throw new Error("Missing boundary");
        return get_multipart(raw, boundary.slice("boundary=".length));
      }
      default:
        throw new Error(`Invalid Content-Type ${type}`);
    }
  }
  return raw;
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  const nope = () => {
    throw new Error("Malformed form data");
  };
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    nope();
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          nope();
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      nope();
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !incoming.path.split("/").pop().includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: null,
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            error: null,
            branch: [],
            page: null
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_route(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body)}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: null
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        return await render_page(request, null, options2, state);
      }
    });
  } catch (e) {
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// node_modules/svelte/internal/index.mjs
init_shims();
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal2(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
var tasks = new Set();
var active_docs = new Set();
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
var resolved_promise = Promise.resolve();
var seen_callbacks = new Set();
var outroing = new Set();
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const { on_mount } = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      this[attr] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop2;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index2 = callbacks.indexOf(callback);
        if (index2 !== -1)
          callbacks.splice(index2, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}

// node_modules/svelte/index.mjs
init_shims();

// .svelte-kit/output/server/app.js
var import_crypto2 = __toModule(require("crypto"));

// node_modules/svelte/store/index.mjs
init_shims();
var subscriber_queue2 = [];
function writable2(value, start = noop2) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal2(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue2.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue2.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue2.length; i += 2) {
            subscriber_queue2[i][0](subscriber_queue2[i + 1]);
          }
          subscriber_queue2.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop2;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}

// .svelte-kit/output/server/app.js
var import_feather_icons = __toModule(require_feather());
var css = {
  code: "#svelte-announcer.svelte-1pdgbjn{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>#svelte-announcer{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}</style>"],"names":[],"mappings":"AAqDO,gCAAiB,CAAC,KAAK,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,kBAAkB,MAAM,GAAG,CAAC,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,MAAM,CAAC,MAAM,GAAG,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        navigated = true;
        title = document.title || "untitled page";
      }
    });
    mounted = true;
    return unsubscribe;
  });
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${mounted ? `<div id="${"svelte-announcer"}" aria-live="${"assertive"}" aria-atomic="${"true"}" class="${"svelte-1pdgbjn"}">${navigated ? `${escape2(title)}` : ``}</div>` : ``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var decode = decodeURIComponent;
var encode = encodeURIComponent;
function daysToMaxage(days) {
  var today = new Date();
  var resultDate = new Date(today);
  resultDate.setDate(today.getDate() + days);
  return resultDate.getTime() / 1e3 - today.getTime() / 1e3;
}
var pairSplitRegExp = /; */;
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
function parse(str, options2) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  var obj = {};
  var opt = options2 || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf("=");
    if (eq_idx < 0) {
      continue;
    }
    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim();
    if (val[0] == '"') {
      val = val.slice(1, -1);
    }
    if (obj[key] == void 0) {
      obj[key] = tryDecode(val, dec);
    }
  }
  return obj;
}
function serialize(name, val, options2) {
  var opt = options2 || {};
  var enc = opt.encode || encode;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  var value = enc(val);
  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError("argument val is invalid");
  }
  var str = name + "=" + value;
  if (opt.maxAge != null) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== "function") {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch (e) {
    return str;
  }
}
var keyLengthHint = (algo) => {
  switch (algo) {
    case "aes-256-gcm":
      return 32;
    case "aes-192-gcm":
      return 24;
    case "aes-128-gcm":
      return 16;
    default:
      throw new Error(`Unsupported algorithm ${algo}`);
  }
};
var makeStringDecrypterSync = ({ algorithm, inputEncoding = "base64", stringEncoding = "utf8", ivLength = 12, authTagLength = 16, saltLength = 32, iterations = 1, digest = "sha256" }) => (text, password) => {
  const buffer = Buffer.from(text, inputEncoding);
  const tagStartIndex = saltLength + ivLength;
  const textStartIndex = tagStartIndex + authTagLength;
  const salt = buffer.slice(0, saltLength);
  const iv = buffer.slice(saltLength, tagStartIndex);
  const tag = buffer.slice(tagStartIndex, textStartIndex);
  const cipherText = buffer.slice(textStartIndex);
  const key = (0, import_crypto2.pbkdf2Sync)(password, salt, iterations, keyLengthHint(algorithm), digest);
  const decipher = (0, import_crypto2.createDecipheriv)(algorithm, key, iv, {
    authTagLength
  }).setAuthTag(tag);
  return `${decipher.update(cipherText, "binary", stringEncoding)}${decipher.final(stringEncoding)}`;
};
var makeStringEncrypterSync = ({ algorithm, outputEncoding = "base64", stringEncoding = "utf8", authTagLength = 16, ivLength = 12, saltLength = 32, iterations = 1, digest = "sha256" }) => (text, password) => {
  const iv = (0, import_crypto2.randomBytes)(ivLength);
  const salt = (0, import_crypto2.randomBytes)(saltLength);
  const key = (0, import_crypto2.pbkdf2Sync)(password, salt, iterations, keyLengthHint(algorithm), digest);
  const cipher = (0, import_crypto2.createCipheriv)(algorithm, key, iv, { authTagLength });
  const cipherText = Buffer.concat([
    cipher.update(text, stringEncoding),
    cipher.final()
  ]);
  return Buffer.concat([salt, iv, cipher.getAuthTag(), cipherText]).toString(outputEncoding);
};
var encryptString = makeStringEncrypterSync({ algorithm: "aes-256-gcm" });
var decryptString = makeStringDecrypterSync({ algorithm: "aes-256-gcm" });
function encrypt(encryptionKey) {
  return (text) => encryptString(text, encryptionKey);
}
function decrypt(encryptionKey) {
  return (encrypted_string) => decryptString(encrypted_string, encryptionKey);
}
var initialSecret;
var encoder;
var decoder;
function initializeSession(headers, options2) {
  var _a;
  const key = options2.key || "kit.session";
  const expires = daysToMaxage((_a = options2.expires) !== null && _a !== void 0 ? _a : 7);
  if (options2.secret == null) {
    throw new Error("Please provide at least one secret");
  }
  const secrets = Array.isArray(options2.secret) ? options2.secret : [{ id: 1, secret: options2.secret }];
  let changedSecrets = false;
  if (!initialSecret || initialSecret !== secrets[0].secret) {
    initialSecret = secrets[0].secret;
    changedSecrets = true;
  }
  if (!encoder || changedSecrets) {
    encoder = encrypt(secrets[0].secret);
  }
  if (!decoder || changedSecrets) {
    decoder = decrypt(secrets[0].secret);
  }
  const sessionOptions = {
    key,
    expires,
    cookie: options2.cookie || {}
  };
  sessionOptions.cookie.maxAge = expires;
  if (!sessionOptions.cookie.httpOnly) {
    sessionOptions.cookie.httpOnly = true;
  }
  if (!sessionOptions.cookie.sameSite) {
    sessionOptions.cookie.sameSite = true;
  }
  if (!sessionOptions.cookie.path) {
    sessionOptions.cookie.path = "/";
  }
  const cookies = parse(headers.cookie || headers.Cookie || "", {});
  let sessionCookie = cookies[sessionOptions.key] || "";
  let isInvalidDate = false;
  let shouldReEncrypt = false;
  let shouldDestroy = false;
  let sessionData;
  if (sessionCookie.length > 0) {
    const [_sessionCookie, id] = sessionCookie.split("&id=");
    const decodeID = id ? Number(id) : 1;
    let secret = secrets.find((sec) => sec.id === decodeID);
    if (!secret)
      secret = secrets[0];
    sessionCookie = _sessionCookie;
    if (secrets[0].id !== decodeID) {
      decoder = decrypt(secret.secret);
    }
    try {
      const decrypted = decoder(sessionCookie);
      if (decrypted && decrypted.length > 0) {
        sessionData = JSON.parse(decrypted);
        if (secrets[0].id !== decodeID) {
          shouldReEncrypt = true;
        }
      } else {
        shouldDestroy = true;
      }
    } catch (error22) {
      shouldDestroy = true;
    }
  }
  if (sessionData && sessionData.expires && new Date(sessionData.expires).getTime() < new Date().getTime()) {
    isInvalidDate = true;
  }
  const session = {};
  const sessionProxy = new Proxy(session, {
    set: function(obj, prop, value) {
      if (prop === "data") {
        if (sessionData && sessionData.expires) {
          const currentDate = new Date();
          if (typeof sessionData.expires === "string") {
            sessionData.expires = new Date(sessionData.expires);
          }
          const exp = sessionData.expires.getTime() / 1e3 - currentDate.getTime() / 1e3;
          sessionOptions.cookie.maxAge = exp;
        }
        sessionData = {
          ...value,
          expires: (sessionData === null || sessionData === void 0 ? void 0 : sessionData.expires) || new Date(Date.now() + expires * 1e3)
        };
        sessionCookie = serialize(sessionOptions.key, (encoder(JSON.stringify(sessionData)) || "") + "&id=" + secrets[0].id, sessionOptions.cookie);
        obj["set-cookie"] = sessionCookie;
      }
      return true;
    },
    get: function(obj, prop) {
      if (prop === "data") {
        return sessionData && !isInvalidDate ? sessionData : {};
      } else if (prop === "refresh") {
        return (expires_in_days) => {
          var _a2;
          if (!sessionData || isInvalidDate) {
            return false;
          }
          let new_expires = daysToMaxage((_a2 = options2.expires) !== null && _a2 !== void 0 ? _a2 : 7);
          if (expires_in_days) {
            new_expires = daysToMaxage(expires_in_days);
          }
          sessionData = {
            ...sessionData,
            expires: new Date(Date.now() + new_expires * 1e3)
          };
          sessionCookie = serialize(sessionOptions.key, (encoder(JSON.stringify(sessionData)) || "") + "&id=" + secrets[0].id, {
            ...sessionOptions.cookie,
            maxAge: new_expires
          });
          obj["set-cookie"] = sessionCookie;
          return true;
        };
      } else if (prop === "destroy") {
        return () => {
          if (sessionCookie.length === 0)
            return false;
          sessionData = void 0;
          sessionCookie = serialize(sessionOptions.key, "0", {
            ...sessionOptions.cookie,
            maxAge: void 0,
            expires: new Date(Date.now() - 36e7)
          });
          obj["set-cookie"] = sessionCookie;
          return true;
        };
      }
      return obj[prop];
    }
  });
  if (isInvalidDate || shouldDestroy) {
    sessionProxy.destroy();
  }
  if ((options2 === null || options2 === void 0 ? void 0 : options2.rolling) && !isInvalidDate && sessionData) {
    sessionProxy.refresh();
  }
  if (shouldReEncrypt && sessionData) {
    sessionProxy.data = { ...sessionData };
  }
  return sessionProxy;
}
function handleSession(options2, passedHandle = async ({ request, resolve: resolve2 }) => resolve2(request)) {
  return async function handle2({ request, resolve: resolve2 }) {
    const session = initializeSession(request.headers, options2);
    request.locals.session = session;
    const response = await passedHandle({ request, resolve: resolve2 });
    if (!session["set-cookie"] || !(response === null || response === void 0 ? void 0 : response.headers)) {
      return response;
    }
    if (response.headers["set-cookie"]) {
      if (typeof response.headers["set-cookie"] === "string") {
        response.headers["set-cookie"] = [
          response.headers["set-cookie"],
          session["set-cookie"]
        ];
      } else if (Array.isArray(response.headers["set-cookie"])) {
        response.headers["set-cookie"] = [
          ...response.headers["set-cookie"],
          session["set-cookie"]
        ];
      }
    } else {
      response.headers["set-cookie"] = [session["set-cookie"]];
    }
    return response;
  };
}
var getSession = function({ locals }) {
  return locals.session.data;
};
var handle = handleSession({
  secret: "A_VERY_SECRET_SECRET_32_CHARS_LONG"
}, async function({ request, resolve: resolve2 }) {
  var _a, _b;
  const response = await resolve2(request);
  if (!response.body || !response.headers) {
    return response;
  }
  if (response.headers["content-type"] === "text/html") {
    let theme = (_b = (_a = request.locals.session.data) == null ? void 0 : _a.theme) != null ? _b : "light";
    response.body = response.body.replace("%session.theme%", theme);
  }
  return response;
});
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  getSession,
  handle
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "/." } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-25b0ca60.js",
      css: ["/./_app/assets/start-0826e215.css"],
      js: ["/./_app/start-25b0ca60.js", "/./_app/chunks/vendor-d6ddf42e.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22) => {
      console.error(error22.stack);
      error22.stack = options.get_stack(error22);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var empty = () => ({});
var manifest = {
  assets: [{ "file": "cover.jpg", "size": 3180586, "type": "image/jpeg" }, { "file": "cover.mp4", "size": 38453149, "type": "video/mp4" }, { "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "icons/books.png", "size": 17250, "type": "image/png" }, { "file": "icons/eggplant.png", "size": 13349, "type": "image/png" }, { "file": "icons/hot-beverage.png", "size": 16681, "type": "image/png" }, { "file": "icons/newspaper.png", "size": 13315, "type": "image/png" }, { "file": "icons/victory-hand.png", "size": 13251, "type": "image/png" }, { "file": "icons/writing-hand.png", "size": 14212, "type": "image/png" }, { "file": "logotypes/odzi-dog-small-black.svg", "size": 1881, "type": "image/svg+xml" }, { "file": "logotypes/odzi-dog-small-white.svg", "size": 1881, "type": "image/svg+xml" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/second\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/second.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/app\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/app/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  serverFetch: hooks.serverFetch || void 0
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/second.svelte": () => Promise.resolve().then(function() {
    return second;
  }),
  "src/routes/app/index.svelte": () => Promise.resolve().then(function() {
    return index;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-a919dcdc.js", "css": ["/./_app/assets/pages/__layout.svelte-5b2d9978.css"], "js": ["/./_app/pages/__layout.svelte-a919dcdc.js", "/./_app/chunks/vendor-d6ddf42e.js"], "styles": null }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-4a399938.js", "css": [], "js": ["/./_app/error.svelte-4a399938.js", "/./_app/chunks/vendor-d6ddf42e.js"], "styles": null }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-437d29bd.js", "css": [], "js": ["/./_app/pages/index.svelte-437d29bd.js", "/./_app/chunks/vendor-d6ddf42e.js", "/./_app/chunks/Icon-312e996f.js"], "styles": null }, "src/routes/second.svelte": { "entry": "/./_app/pages/second.svelte-a45604d5.js", "css": [], "js": ["/./_app/pages/second.svelte-a45604d5.js", "/./_app/chunks/vendor-d6ddf42e.js"], "styles": null }, "src/routes/app/index.svelte": { "entry": "/./_app/pages/app/index.svelte-8656e534.js", "css": [], "js": ["/./_app/pages/app/index.svelte-8656e534.js", "/./_app/chunks/vendor-d6ddf42e.js", "/./_app/chunks/Icon-312e996f.js"], "styles": null } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${slots.default ? slots.default({}) : ``}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error22, status }) {
  return { props: { error: error22, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error22 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<p>${escape2(error22.message)}</p>


${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
var page = {
  subscribe(fn) {
    const store2 = getStores().page;
    return store2.subscribe(fn);
  }
};
function guard(name) {
  return () => {
    throw new Error(`Cannot call ${name}(...) on the server`);
  };
}
var goto = guard("goto");
var store = () => {
  const { subscribe: subscribe2, update } = writable2({});
  return {
    subscribe: subscribe2,
    loginUser: () => {
      page.subscribe((obj) => {
        goto(`https://auth.odzi.dog/callback/${encodeURIComponent("pawcapsu.ml/api/session")}`);
      });
    }
  };
};
store();
var Icon$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { attrs } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.attrs === void 0 && $$bindings.attrs && attrs !== void 0)
    $$bindings.attrs(attrs);
  return `<!-- HTML_TAG_START -->${import_feather_icons.default.icons[name].toSvg(attrs)}<!-- HTML_TAG_END -->`;
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let testData2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return `


<section class="${"bg-gray-900 w-full h-screen flex justify-center items-center relative"}">
  <div class="${"w-1/2 px-12"}">
    <div class="${"flex items-center"}"><img class="${"w-10 h-10"}" src="${"https://res.cloudinary.com/lococovu-cdn/image/upload/v1610810215/logotypes/pawcapsu-white-small.svg"}" alt="${""}">
   
      <p class="${"ml-2 text-3xl font-bold text-white"}">pawcapsu</p></div>

    
    <div class="${"my-6"}"><h1 class="${"text-5xl text-white font-bold"}">\u041D\u043E\u0432\u044B\u0439, <span class="${"bg-indigo-500 px-1"}">\u0421\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439</span> \u0444\u0438\u043A\u0440\u0430\u0439\u0442\u0438\u043D\u0433</h1>
    
      <p class="${"py-2 text-md text-white opacity-80"}">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo, delectus debitis ut excepturi repellat fuga sequi enim vero corporis dolores blanditiis pariatur reiciendis modi rerum! \u0410\u043D\u0438\u043C\u0435 \u043D\u0430 \u0430\u0432\u0435 \u043C\u0430\u0442\u044C \u0432 \u043A\u0430\u043D\u0430\u0432\u0435</p></div>

    
    <div class="${"w-full flex items-center justify-center relative"}"><button class="${"w-1/2 mr-4 bg-indigo-500 rounded-md py-2 flex items-center justify-center"}"><p class="${"text-white"}">\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u0442\u044C\u0441\u044F</p>

        ${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "user",
    attrs: { class: "w-4 h-4 text-white ml-2" }
  }, {}, {})}</button>

      <button class="${"w-1/2 bg-gray-800 rounded-md py-2 flex items-center justify-center"}"><p class="${"text-white"}">\u0425\u0437 \u0447\u0442\u043E</p></button></div></div>

  
  <div class="${"w-1/2 overflow-hidden overflow-y-auto ml-1 bg-gray-800 h-full flex flex-col relative"}">
    <div class="${"w-full flex flex-wrap flex-grow px-12 py-12"}">${each(testData2, (entry) => `<div class="${"w-1/2 p-2 relative"}"><div style="${"z-index: 2;"}" class="${"w-full h-full rounded-xl bg-gray-900 p-4"}">
            <div class="${"mb-2"}"><div class="${"flex items-center mt-0.5 opacity-70 text-white"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "link-2",
    attrs: { class: "w-4 h-4" }
  }, {}, {})}
                
                <p class="${"ml-1.5 text-xs"}">\u0413\u0430\u0440\u0440\u0438 \u041F\u043E\u0442\u0442\u0435\u0440</p></div>

              <h1 class="${"text-xl text-white font-medium"}">\u041D\u0435\u0432\u0435\u0440\u043E\u044F\u0442\u043D\u043E \u043A\u0440\u0443\u0442\u043E\u0439 \u0440\u0430\u0441\u0441\u043A\u0430\u0437 \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u0440\u044F\u043C \u0432\u0430\u0443...</h1></div>

            
            <div class="${"text-sm text-white opacity-70"}">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores, quo reprehenderit. Facere porro odio cum, repudiandae omnis ipsa amet corporis quos qui! Sed voluptatem dolorum repudiandae? Fugit rem aspernatur ratione.  
            </div></div>
        </div>`)}
      
      <div class="${"w-1/2 p-2 relative"}"><div style="${"z-index: 2;"}" class="${"w-full h-full rounded-xl border-4 border-dotted border-gray-900 bg-gray-900 bg-opacity-40 flex flex-col items-center justify-center p-4"}"><div class="${"text-center"}"><h1 class="${"text-xl text-white font-medium"}">\u0417\u0430\u0438\u043D\u0442\u0435\u0440\u0435\u0441\u043E\u0432\u0430\u043B\u0438?</h1>

            <p class="${"mt-4 text-sm text-white opacity-75"}">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum, nobis!</p></div>

          
          <div class="${"mt-4"}"><button class="${"px-4 py-2 rounded-md bg-indigo-500 flex items-center justify-center"}"><p class="${"text-white mr-2"}">\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430</p>

              ${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "chevron-right",
    attrs: { class: "w-5 h-5 text-white" }
  }, {}, {})}</button></div></div></div></div></div>

  
  <div class="${"absolute inset-x-0 bottom-0 w-full py-4 flex items-center justify-center"}"><div class="${"w-3 h-3 rounded-full bg-white mx-2"}"></div>
    <a href="${"#writings"}" class="${"w-2 h-2 rounded-full border-2 border-white mx-2"}"></a>
    <a href="${"#groups"}" class="${"w-2 h-2 rounded-full border-2 border-white mx-2"}"></a></div></section>`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var Second = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `
<section id="${"writings"}" class="${"bg-gray-800 overflow-hidden overflow-y-auto w-full h-screen flex justify-center items-center px-8"}">
  <div class="${"w-1/2 px-3"}"><h1 class="${"text-5xl text-gray-100 font-bold"}">\u041E\u0433\u0440\u043E\u043C\u043D\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u043E\u0432</h1>
    <p class="${"mt-2 text-xl text-gray-100 opacity-75"}">\u041D\u0430\u0448\u0430 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430 \u0441\u043E\u0431\u0438\u0440\u0430\u0435\u0442 \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u044B \u0441 \u0432\u0441\u0435 \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0445 \u0440\u0443\u0441\u0441\u043A\u043E\u044F\u0437\u044B\u0447\u043D\u044B\u0445 \u0441\u0430\u0439\u0442\u043E\u0432, \u0442\u0430\u043A \u0447\u0442\u043E \u0432\u044B \u0432\u0441\u0435\u0433\u0434\u0430 \u0441\u043C\u043E\u0436\u0435\u0442\u0435 \u0445\u043E\u0442\u044C \u0447\u0442\u043E-\u0442\u043E \u043D\u0430\u0439\u0442\u0438!</p>

    
    <div class="${"w-2/3 mt-6"}"><div class="${"flex justify-center items-center w-full relative"}">
        <button class="${"flex w-1/2 items-center justify-center py-2 rounded-md bg-indigo-400"}"><p class="${"text-sm text-white font-medium"}">\u041D\u0430\u0447\u0430\u0442\u044C \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C</p></button>

        
        <button class="${"cursor-not-allowed opacity-60 ml-4 w-1/2 flex items-center justify-center py-2 rounded-md bg-indigo-400"}"><p class="${"text-sm text-white font-medium"}">\u0423\u0437\u043D\u0430\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435</p></button></div>

      
      <p class="${"mt-1 text-xs text-gray-100 opacity-60"}">\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u044F, \u0432\u044B \u0441\u043E\u0433\u043B\u0430\u0448\u0430\u0435\u0442\u0435\u0441\u044C \u0441 \u041F\u0440\u0430\u0432\u0438\u043B\u0430\u043C\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F</p></div></div>

  
  <div class="${"w-1/2 h-full relative px-3"}"><div style="${"z-index: 2;"}" class="${"absolute inset-0 w-full h-full"}"></div>
    <div style="${"overflow: hidden; z-index: 1; width: 125%; right: 5vw;"}" id="${"content-container"}" class="${"transform -skew-y-12 rotate-12 flex flex-wrap absolute inset-0 h-full rounded-md bg-dark"}">${each(testData, (entry) => `<div class="${"w-1/2 p-2 relative"}"><div style="${"z-index: 2;"}" class="${"w-full h-full rounded-xl bg-gray-900 p-4"}">
            <div class="${"mb-2"}"><div class="${"flex items-center mt-0.5 opacity-70 text-white"}">${validate_component(Icon, "Icon").$$render($$result, {
    name: "link-2",
    attrs: { class: "w-4 h-4" }
  }, {}, {})}
                
                <p class="${"ml-1.5 text-xs"}">\u0413\u0430\u0440\u0440\u0438 \u041F\u043E\u0442\u0442\u0435\u0440</p></div>

              <h1 class="${"text-3xl text-white font-medium"}">\u041D\u0435\u0432\u0435\u0440\u043E\u044F\u0442\u043D\u043E \u043A\u0440\u0443\u0442\u043E\u0439 \u0440\u0430\u0441\u0441\u043A\u0430\u0437 \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u0440\u044F\u043C \u0432\u0430\u0443...</h1>
            
              
              <div class="${"w-full flex flex-wrap mt-2"}"><div class="${"m-0.5 px-2 py-1 rounded-full bg-pink-500 flex items-center justify-center"}">
                  <p class="${"text-white font-medium text-sm"}">\u26A3</p>
                
                  <p class="${"ml-1 text-xs text-white font-medium"}">\u0413\u0435\u0439</p></div>

                <div class="${"m-0.5 px-2 py-1 rounded-full bg-purple-600 flex items-center justify-center"}"><p class="${"text-xs text-white font-medium"}">\u0414\u0440\u0430\u043C\u0430</p></div>

                <div class="${"m-0.5 px-2 py-1 rounded-full bg-gray-500 flex items-center justify-center"}"><p class="${"text-xs text-white font-medium"}">\u0414\u043E 5000 \u0441\u043B\u043E\u0432</p></div>
              </div></div>

            
            <div class="${"text-sm text-white opacity-70"}">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores ipsam aliquam, atque eos hic autem tempore. Iusto ipsa sint laboriosam inventore dolor, illo ex cum vitae tenetur sed impedit ut modi veniam ducimus numquam vel dolores delectus aperiam cumque adipisci, nam placeat voluptatum sequi! Ex ipsam minus illo rem fugit.  
            </div></div>
        </div>`)}</div></div></section>


<section id="${"groups"}" class="${"bg-gray-800 w-full h-screen flex justify-center items-center"}"></section>`;
});
var second = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Second
});
var App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"flex"}">
  <div class="${"px-3 py-2 bg-gray-800 h-screen flex flex-col items-center justify-between"}"><div class="${"flex flex-col items-center"}">
      <div class="${"my-1.5 w-10 h-10 rounded-full flex items-center justify-center"}" style="${"background: url('https://cdn.discordapp.com/banners/155749532615966720/cac172ea1db4be9f83dfc7232062e944.png?size=512'); background-position: center; background-size: cover;"}"></div>
      
      
      <div class="${"my-1.5 w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "grid",
    attrs: {
      class: "w-5 h-5 text-white",
      "stroke-width": "2.5"
    }
  }, {}, {})}</div>

      
      <div class="${"my-1.5 w-10 h-10 ring-2 ring-blue-400 border-2 border-blue-500 rounded-full bg-gray-500 flex items-center justify-center relative"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "compass",
    attrs: {
      class: "w-5 h-5 text-white",
      "stroke-width": "3"
    }
  }, {}, {})}

        <div class="${"absolute top-0 right-0"}" style="${"margin-top: -5px; margin-right: -5px;"}"><div class="${"w-4 h-4 bg-red-400 rounded-full"}"></div></div></div>

      
      <div style="${"height: 3px;"}" class="${"my-1.5 opacity-30 w-10 bg-gray-600 rounded-full"}"></div>
    
      <div style="${"background: url('https://cdn.discordapp.com/icons/794490811639267339/f63b8efdecb1930a6ecfb98512547362.png?size=128'); background-size: cover; background-position: center;"}" class="${"rounded-full my-2 w-12 h-12 bg-gray-500 flex items-center justify-center relative"}"></div>
    
      <div style="${"background: url('https://cdn.discordapp.com/icons/846488670046781490/a_5830499ede6d67378121769c9a11027a.png?size=128'); background-size: cover; background-position: center;"}" class="${"rounded-full my-2 w-12 h-12 bg-gray-500 flex items-center justify-center relative"}"></div>
    
      <div class="${"my-2 w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center relative"}"><div style="${"background: url('https://res.cloudinary.com/lococovu-cdn/image/upload/v1610810215/logotypes/pawcapsu-white-small.svg'); background-position: center; background-size: 50%; background-repeat: no-repeat;"}" class="${"absolute rounded-full w-full h-full"}"></div></div>

      <div class="${"my-2 relative"}"><div style="${"background: url('https://cdn.discordapp.com/icons/733758953208676383/99ae171e7bdb006d6dcd0f5887ad3835.png?size=128'); background-size: cover; background-position: center;"}" class="${"rounded-full my-2 w-12 h-12 bg-gray-500 flex items-center justify-center relative"}"></div>

        
        <div style="${"z-index: 2; margin-right: -3.8rem; margin-top: 0.75rem;"}" class="${"rotate-45 top-0 right-0 w-10 h-10 bg-gray-900 absolute"}"></div>

        
        <div style="${"z-index: 2; margin-right: -14.5rem;"}" class="${"w-52 shadow-2xl absolute rounded-md p-2 top-0 right-0 bg-gray-900"}">
          <div><div class="${"flex items-center"}"><h1 class="${"text-md text-white font-bold"}">fictale</h1></div>

            <p class="${"text-xs text-white opacity-70"}">\u0423\u0431\u0438\u0439\u0446\u0430 \u0432\u0441\u0435\u0445 \u0438 \u0432\u0441\u044F. \u041E\u0442\u0435\u0446 \u0434\u0435\u043C\u043E\u043A\u0440\u0430\u0442\u0438\u0438 \u0438 \u043C\u0430\u0442\u044C \u0442\u0432\u043E...</p></div>

          
          <div class="${"my-4"}">
            <div class="${"flex items-center"}">
              <div class="${"flex items-center relative w-14"}">
                <div style="${""}" class="${"absolute rounded-full w-6 h-6 bg-red-500"}"></div>
                <div style="${"margin-left: 0.8rem;"}" class="${"absolute rounded-full w-6 h-6 bg-green-500"}"></div>
                <div style="${"margin-left: 1.8rem;"}" class="${"absolute rounded-full w-6 h-6 bg-blue-500"}"></div></div>

              
              <div class="${"ml-2"}"><h2 class="${"text-sm text-white font-medium"}">5000 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432</h2>
                <p class="${"text-xs text-white opacity-70"}">\u0418\u0437 \u043D\u0438\u0445 3 \u0434\u0440\u0443\u0433\u0430</p></div></div></div>

          
          <div class="${"w-full flex items-center justify-center relative"}">
            <div class="${"mr-1 w-1/2 rounded-md bg-gray-800 py-1 flex items-center justify-center text-white text-xs font-bold"}">\u0427\u0451\u0442\u043E
            </div>

            
            <div class="${"ml-1 w-1/2 rounded-md bg-gray-800 py-1 flex items-center justify-center text-white text-xs font-bold"}">\u0427\u0451\u0442\u043E #2
            </div></div></div></div></div>
      
    
    <div class="${"flex flex-col items-center"}"><div class="${"my-1.5 w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "settings",
    attrs: {
      class: "w-5 h-5 text-white",
      "stroke-width": "2.5"
    }
  }, {}, {})}</div></div></div>

  
  <div class="${"w-1/4 h-screen overflow-y-auto bg-gray-800 bg-opacity-95 flex flex-col"}">
    <div class="${"w-full px-3 pt-4"}"><h1 class="${"text-2xl text-white font-bold"}">\u0418\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C</h1>
      <p class="${"text-sm text-white opacity-70"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque.</p></div>
    
    
    <div class="${"pt-4 px-3 w-full relative"}"><div class="${"w-full rounded-lg bg-gray-900 bg-opacity-80 flex items-center px-3 py-2"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "search",
    attrs: {
      class: "mr-2 w-4 h-4 text-white opacity-60",
      "stroke-width": "3"
    }
  }, {}, {})}

        <p class="${"w-auto text-sm text-white opacity-60"}">\u041F\u043E\u0438\u0441\u043A...</p></div></div>

    
    <div class="${"px-2 py-4"}">
      <div class="${"px-2 mb-2"}"><div class="${"flex items-center"}"><h1 class="${"text-lg text-white font-bold"}">\u0422\u0438\u043F \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u0430</h1>
        
          <p class="${"mt-1 text-xs text-white opacity-50 ml-1.5"}">1 \u0438\u0437 3</p></div></div>

      
      <div class="${"flex flex-wrap"}"><div class="${"m-1 px-3 py-1.5 rounded-full bg-blue-500 flex items-center justify-center"}">
          <img class="${"w-4 h-4 mr-2"}" src="${"./icons/writing-hand.png"}" alt="${""}">
          
          <p class="${"text-sm text-white font-medium"}">\u041E\u0440\u0438\u0434\u0436\u0438\u043D\u0430\u043B</p>

          
          ${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "x",
    attrs: {
      class: "w-3 h-3 text-white ml-1",
      "stroke-width": "4"
    }
  }, {}, {})}</div>

        <div class="${"m-1 px-3 py-1.5 rounded-full bg-gray-500 flex items-center justify-center"}"><img class="${"w-4 h-4 mr-2"}" src="${"./icons/books.png"}" alt="${""}">
          
          <p class="${"text-sm text-white font-medium"}">\u0424\u0430\u043D\u0444\u0438\u043A</p></div>

        <div class="${"m-1 px-3 py-1.5 rounded-full bg-gray-500 flex items-center justify-center"}"><img class="${"w-4 h-4 mr-2"}" src="${"./icons/newspaper.png"}" alt="${""}">
          
          <p class="${"text-sm text-white font-medium"}">\u0421\u0442\u0430\u0442\u044C\u044F</p></div></div></div>

    <div class="${"mb-2 px-4 w-full relative"}"><div style="${"height: 3px;"}" class="${"w-full bg-gray-500 opacity-20 rounded-full"}"></div></div>

    
    <div class="${"px-2 py-4"}">
      <div class="${"px-2 mb-2"}"><div class="${"flex items-center"}"><h1 class="${"text-lg text-white font-bold"}">\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438</h1>
          <p class="${"mt-1 text-xs text-white opacity-50 ml-1.5"}">3 \u0438\u0437 69</p></div></div>

      <div class="${"flex flex-wrap"}"><div class="${"m-1 px-3 py-1.5 rounded-full bg-red-500 flex items-center justify-center"}">
          
          <p class="${"text-sm text-white font-medium"}">PWP</p>
        
          ${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "x",
    attrs: {
      class: "w-3 h-3 text-white ml-1",
      "stroke-width": "4"
    }
  }, {}, {})}</div>

        <div class="${"m-1 px-3 py-1.5 rounded-full bg-gray-500 flex items-center justify-center"}"><p class="${"text-sm text-white font-medium"}">\u0420\u043E\u043C\u0430\u043D\u0442\u0438\u043A\u0430</p></div>

        <div class="${"m-1 px-3 py-1.5 rounded-full bg-gray-500 flex items-center justify-center"}"><p class="${"text-sm text-white font-medium"}">\u042D\u043A\u0448\u043D</p></div>

        <div class="${"m-1 px-3 py-1.5 rounded-full bg-yellow-500 flex items-center justify-center"}"><p class="${"text-sm text-white font-medium"}">\u0413\u0435\u0439</p>

          ${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "x",
    attrs: {
      class: "w-3 h-3 text-white ml-1",
      "stroke-width": "4"
    }
  }, {}, {})}</div>

        <div class="${"m-1 px-3 py-1.5 rounded-full bg-gray-500 flex items-center justify-center"}"><p class="${"text-sm text-white font-medium"}">\u0414\u0440\u0430\u043C\u0430</p></div>

        <div class="${"m-1 px-3 py-1.5 rounded-full bg-indigo-400 flex items-center justify-center"}"><p class="${"text-sm text-white font-medium"}">\u0428\u043A\u0448\u043A\u0448\u043A\u0448</p>
        
          ${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "x",
    attrs: {
      class: "w-3 h-3 text-white ml-1",
      "stroke-width": "4"
    }
  }, {}, {})}</div>

        <div class="${"m-1 px-3 py-1.5 rounded-full flex bg-gray-500 items-center justify-center"}"><p class="${"text-sm text-white font-medium"}">\u0427\u0438\u043A\u0438</p></div>

        <div class="${"m-1 px-3 py-1.5 rounded-full flex bg-gray-500 items-center justify-center"}"><p class="${"text-sm text-white font-medium"}">\u041F\u0443\u043A\u0438</p></div>

        <div class="${"m-1 px-3 py-1.5 rounded-full flex bg-gray-500 items-center justify-center"}"><p class="${"text-sm text-white font-medium"}">\u041A\u0441\u043A\u0441\u043A\u0441</p></div>

        
        <div class="${"m-1 px-3 py-1.5 rounded-full flex bg-gray-900 bg-opacity-70 items-center justify-center"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "more-horizontal",
    attrs: {
      class: "mr-2 w-4 h-4 text-white",
      "stroke-width": "2.5"
    }
  }, {}, {})}
          
          <p class="${"text-sm text-white font-medium"}">\u0411\u043E\u043B\u044C\u0448\u0435</p></div></div></div>

    <div class="${"mb-2 px-4 w-full relative"}"><div style="${"height: 3px;"}" class="${"w-full bg-gray-500 opacity-20 rounded-full"}"></div></div>

    
    <div class="${"px-2 py-4"}">
      <div class="${"px-2 mb-2"}"><div><h1 class="${"text-lg text-white font-bold"}">\u0424\u0438\u043B\u044C\u0442\u0440\u0430\u0446\u0438\u044F</h1>
          <p class="${"text-xs text-white opacity-70"}">\u0423\u043B\u0443\u0447\u0448\u0435\u043D\u043D\u044B\u0435 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u0446\u0438\u0438</p></div></div>

      
      <div class="${"px-2 pt-1"}">
        <div class="${"my-2 py-1.5 flex items-center justify-between"}"><div class="${"flex items-center"}">
            ${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "calendar",
    attrs: {
      class: "w-5 h-5 text-white opacity-60 mr-2"
    }
  }, {}, {})}

            
            <h2 class="${"text-sm text-white font-medium"}">\u0414\u0430\u0442\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F</h2></div>

          <div>${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "chevron-right",
    attrs: { class: "w-5 h-5 text-white opacity-60" }
  }, {}, {})}</div></div>
        
        
        <div class="${"my-2 py-1.5 flex items-center justify-between"}"><div class="${"flex items-center"}">
            ${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "list",
    attrs: {
      class: "w-5 h-5 text-white opacity-60 mr-2"
    }
  }, {}, {})}

            
            <div><h2 class="${"text-sm text-white font-medium"}">\u0422\u044D\u0433\u0438</h2>
              <p class="${"text-xs text-white opacity-70"}">\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u043E 5 \u0442\u044D\u0433\u043E\u0432</p></div></div>

          <div>${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "chevron-right",
    attrs: { class: "w-5 h-5 text-white opacity-60" }
  }, {}, {})}</div></div>

        
        <div class="${"my-2 py-1.5 flex items-center justify-between"}"><div class="${"flex items-center"}">
            ${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "info",
    attrs: {
      class: "w-5 h-5 text-white opacity-60 mr-2"
    }
  }, {}, {})}

            
            <div><h2 class="${"text-sm text-white font-medium"}">\u0421\u0442\u0430\u0442\u0443\u0441</h2>
              <p class="${"text-xs text-white opacity-70"}">\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u043E: \u0437\u0430\u043A\u043E\u043D\u0447\u0435\u043D, \u0437\u0430\u043C\u043E\u0440\u043E\u0436\u0435\u043D</p></div></div>

          <div>${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "chevron-right",
    attrs: { class: "w-5 h-5 text-white opacity-60" }
  }, {}, {})}</div></div>

        
        <div class="${"my-2 py-1.5 flex items-center justify-between"}"><div class="${"flex items-center"}">
            ${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "align-center",
    attrs: {
      class: "w-5 h-5 text-white opacity-60 mr-2"
    }
  }, {}, {})}

            
            <h2 class="${"text-sm text-white font-medium"}">\u0420\u0430\u0437\u043C\u0435\u0440</h2></div>

          <div>${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "chevron-right",
    attrs: { class: "w-5 h-5 text-white opacity-60" }
  }, {}, {})}</div></div></div></div></div>

  
  <section class="${"w-full h-screen bg-gray-800 bg-opacity-90 p-4 overflow-y-scroll"}">
    <div class="${"w-full flex items-stretch p-6"}">
      <div class="${"w-full px-2 relative"}">
        <div class="${"w-full flex justify-between"}"><div><div class="${"flex items-center"}"><h1 class="${"text-3xl text-white font-bold"}">\u041A\u043D\u0438\u0433\u0430 \u0434\u043D\u044F</h1>
              <p class="${"mt-1 text-xs text-white opacity-50 ml-1.5"}">1 \u0438\u0437 3</p></div>
            
            <p class="${"text-sm text-white opacity-70"}">Lorem ipsum dolor sit amet.</p></div>

          <div class="${"flex items-center"}"><div class="${"mx-1 opacity-60 w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "chevron-left",
    attrs: {
      class: "w-4 h-4 text-white font-bold",
      "stroke-width": "3"
    }
  }, {}, {})}</div>

            <div class="${"mx-1 w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "chevron-right",
    attrs: {
      class: "w-4 h-4 text-white font-bold",
      "stroke-width": "3"
    }
  }, {}, {})}</div></div></div>

        
        <div class="${"w-full mt-6 flex items-stretch border-2 border-gray-600 rounded-2xl p-3"}">
          <div class="${"w-1/6"}"><div style="${"padding-top: 150%;"}" class="${"relative"}"><div class="${"absolute top-0 w-full h-full rounded-2xl bg-gray-900 shadow-md"}"></div></div>

            
            <div class="${"flex items-center justify-center bg-yellow-400 rounded-md mt-2 px-2 py-1.5"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "star",
    attrs: {
      class: "w-4 h-4 text-white",
      "stroke-width": "2.5"
    }
  }, {}, {})}

              <p class="${"text-base text-white font-bold ml-1.5"}">\u041B\u0443\u0447\u0448\u0438\u0439 \u044D\u043A\u0448\u043D</p></div></div>

          
          <div class="${"w-2/3 h-full px-4"}">
            <div class="${"flex items-center mt-0.5 opacity-70 text-white"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "link-2",
    attrs: { class: "w-5 h-5" }
  }, {}, {})}
              
              <p class="${"ml-1.5 text-sm"}">\u0413\u0430\u0440\u0440\u0438 \u041F\u043E\u0442\u0442\u0435\u0440</p></div>

            <h1 class="${"text-4xl text-white font-medium"}">Lorem ipsum dolor sit amet.</h1>
            
            <div class="${"w-full flex flex-wrap mt-2"}"><div class="${"m-0.5 px-2 py-1 rounded-full bg-pink-500 flex items-center justify-center"}">
                <p class="${"text-white font-medium text-sm"}">\u26A3</p>
               
                <p class="${"ml-1 text-xs text-white font-medium"}">\u0413\u0435\u0439</p></div>

              <div class="${"m-0.5 px-2 py-1 rounded-full bg-purple-600 flex items-center justify-center"}"><p class="${"text-xs text-white font-medium"}">\u0414\u0440\u0430\u043C\u0430</p></div>

              <div class="${"m-0.5 px-2 py-1 rounded-full bg-gray-500 flex items-center justify-center"}"><p class="${"text-xs text-white font-medium"}">\u0414\u043E 5000 \u0441\u043B\u043E\u0432</p></div></div>

            
            <div class="${"mt-2"}"><p class="${"text-base text-white opacity-70"}">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius illo vero minus hic neque necessitatibus delectus voluptas officiis numquam, ratione quod? Quas voluptates doloremque corrupti consequuntur impedit. Nulla libero minima, beatae, blanditiis odit ad recusandae quo perspiciatis iste nihil harum earum culpa error eius perferendis tempore porro sit reprehenderit nam.</p></div>

            </div></div></div></div>

    
    <div class="${"px-6 mt-4"}">
      <div class="${"mb-2 px-2 w-2/3"}"><h1 class="${"text-3xl text-white font-bold"}">\u0418\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u044C</h1>
        <p class="${"text-sm text-white opacity-70"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Est iusto quia odit nam exercitationem quae quis amet hic ratione ipsum!</p></div>

      
      <div class="${"w-full flex justify-between"}"><div class="${"flex"}"><div class="${"mx-1 px-4 py-2 rounded-full flex items-center justify-center bg-blue-500"}"><p class="${"mr-2 text-md text-white font-medium"}">\u041D\u043E\u0432\u044B\u0435 \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u044B</p>

            ${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "x",
    attrs: {
      class: "w-5 h-5 text-white",
      "stroke-width": "3"
    }
  }, {}, {})}</div>

          <div class="${"mx-1 px-4 py-2 rounded-full flex items-center justify-center bg-gray-500"}"><p class="${"text-md text-white font-medium"}">\u0421\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0435 \u0440\u0430\u0431\u043E\u0442\u044B</p></div>

          <div class="${"mx-1 px-4 py-2 rounded-full flex items-center justify-center bg-gray-500"}"><p class="${"text-md text-white font-medium"}">\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435</p></div>

          <div class="${"mx-1 px-4 py-2 rounded-full flex items-center justify-center bg-gray-500"}"><p class="${"text-md text-white font-medium"}">\u0418\u043D\u0442\u0435\u0440\u0435\u0441\u043D\u043E\u0435 \u0434\u043B\u044F \u0432\u0430\u0441</p></div></div>

        <div class="${""}"><div class="${"mx-1 px-4 py-2 rounded-full flex items-center justify-center bg-gray-900 bg-opacity-70"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "more-horizontal",
    attrs: {
      class: "w-4 h-4 text-white mr-2",
      "stroke-width": "3"
    }
  }, {}, {})}

            <p class="${"text-md text-white font-medium"}">\u0411\u043E\u043B\u044C\u0448\u0435</p></div></div></div></div>

    
    <div class="${"w-full flex items-stretch p-6"}">
      <div class="${"w-2/3 relative flex items-stretch"}">
        <div class="${"w-1/2 p-2 relative"}"><div style="${"z-index: 2;"}" class="${"w-full h-full rounded-xl bg-gray-900 p-4"}">
            <div class="${"w-full flex items-center justify-between"}">
              <div class="${"py-1.5 px-3"}">
                <div class="${"flex items-center"}"><div class="${"bg-red-500 rounded-full w-7 h-7"}"></div>

                  <div class="${"ml-2"}"><h2 class="${"text-sm text-white font-medium"}">\u041C\u0430\u0440\u0442 \u0414\u043E\u0433\u043B\u0438\u0448</h2>
                    <p class="${"text-xs text-white opacity-70"}">Lorem, ipsum dolor.</p></div></div></div>

              
              <div>${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "more-horizontal",
    attrs: {
      class: "w-5 h-5 text-white",
      "stroke-width": "3"
    }
  }, {}, {})}</div></div>

            
            <div class="${"mt-8 mb-2"}"><div class="${"flex items-center mt-0.5 opacity-70 text-white"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "link-2",
    attrs: { class: "w-4 h-4" }
  }, {}, {})}
                
                <p class="${"ml-1.5 text-xs"}">\u0413\u0430\u0440\u0440\u0438 \u041F\u043E\u0442\u0442\u0435\u0440</p></div>

              <h1 class="${"text-3xl text-white font-medium"}">\u041D\u0435\u0432\u0435\u0440\u043E\u044F\u0442\u043D\u043E \u043A\u0440\u0443\u0442\u043E\u0439 \u0440\u0430\u0441\u0441\u043A\u0430\u0437 \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u0440\u044F\u043C \u0432\u0430\u0443...</h1>
            
              
              <div class="${"w-full flex flex-wrap mt-2"}"><div class="${"m-0.5 px-2 py-1 rounded-full bg-pink-500 flex items-center justify-center"}">
                  <p class="${"text-white font-medium text-sm"}">\u26A3</p>
                 
                  <p class="${"ml-1 text-xs text-white font-medium"}">\u0413\u0435\u0439</p></div>

                <div class="${"m-0.5 px-2 py-1 rounded-full bg-purple-600 flex items-center justify-center"}"><p class="${"text-xs text-white font-medium"}">\u0414\u0440\u0430\u043C\u0430</p></div>

                <div class="${"m-0.5 px-2 py-1 rounded-full bg-gray-500 flex items-center justify-center"}"><p class="${"text-xs text-white font-medium"}">\u0414\u043E 5000 \u0441\u043B\u043E\u0432</p></div></div></div>

            
            <div class="${"text-sm text-white opacity-70"}">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores ipsam aliquam, atque eos hic autem tempore. Iusto ipsa sint laboriosam inventore dolor, illo ex cum vitae tenetur sed impedit ut modi veniam ducimus numquam vel dolores delectus aperiam cumque adipisci, nam placeat voluptatum sequi! Ex ipsam minus illo rem fugit.  
            </div>

            
            <div class="${"mt-8 w-full flex items-center"}"><div class="${"mr-1.5 w-1/2 rounded-xl bg-gray-800 bg-opacity-90 py-2 text-center"}"><p class="${"text-white font-medium"}">\u0427\u0438\u0442\u0430\u0442\u044C</p></div>

              <div class="${"ml-1.5 w-1/2 rounded-xl bg-gray-800 bg-opacity-90 py-2 text-center"}"><p class="${"text-white font-medium"}">\u041D\u0430 \u043F\u043E\u0442\u043E\u043C</p></div></div></div></div>

        
        <div class="${"w-1/2 p-2 relative"}"><div style="${"background-image: url('./cover.jpg'); background-repeat: no-repeat; background-size: cover; background-position: center;"}" class="${"w-full h-full rounded-xl bg-gray-900 p-4"}">
            <div class="${"w-full flex items-center justify-between"}">
              <div class="${"px-3 py-1.5 rounded-xl bg-gray-900 bg-opacity-60"}">
                <div class="${"flex items-center"}"><div class="${"bg-red-500 rounded-full w-7 h-7"}"></div>

                  <div class="${"ml-2"}"><h2 class="${"text-sm text-white font-medium"}">\u041C\u0430\u0440\u0442 \u0414\u043E\u0433\u043B\u0438\u0448</h2>
                    
                    <div class="${"flex items-center opacity-70 text-white"}">${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "link-2",
    attrs: { class: "w-4 h-4" }
  }, {}, {})}
                      
                      <p class="${"ml-1.5 text-xs"}">\u0413\u0430\u0440\u0440\u0438 \u041F\u043E\u0442\u0442\u0435\u0440</p></div></div></div></div>

              
              <div>${validate_component(Icon$1, "Icon").$$render($$result, {
    name: "more-horizontal",
    attrs: {
      class: "w-5 h-5 text-white",
      "stroke-width": "3"
    }
  }, {}, {})}</div></div></div></div></div>

      
      <div class="${"w-1/3 relative p-2"}"><div class="${"w-full bg-gray-900 h-full"}">da
        </div></div></div>

    
    <div class="${"flex flex-wrap"}"></div></section></div>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": App
});

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
