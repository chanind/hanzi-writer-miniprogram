import EventEmitter from './EventEmitter';

const polyfillCanvasCtx = (ctx) => {
  // need to polyfill missing setters from the wechat context...
  [
    'globalAlpha',
    'strokeStyle',
    'fillStyle',
    'lineWidth',
    'lineCap',
    'lineJoin',
  ].forEach(setter => {
    const setterMethod = `set${setter[0].toUpperCase()}${setter.slice(1)}`;
    Object.defineProperty(ctx, setter, { set: ctx[setterMethod].bind(ctx) });
  });
  return ctx;
};

function RenderTarget(ctx) {
  this.eventEmitter = new EventEmitter();
  this.ctx = polyfillCanvasCtx(ctx);
}

RenderTarget.prototype.addPointerStartListener = function (callback) {
  this.eventEmitter.addListener('pointerStart', callback);
};

RenderTarget.prototype.addPointerMoveListener = function (callback) {
  this.eventEmitter.addListener('pointerMove', callback);
};

RenderTarget.prototype.addPointerEndListener = function (callback) {
  this.eventEmitter.addListener('pointerEnd', callback);
};

RenderTarget.prototype.trigger = function (eventName, evt) {
  return this.eventEmitter.trigger(eventName, evt);
};

RenderTarget.prototype.removeAllListeners = function () {
  return this.eventEmitter.removeAllListeners();
};

RenderTarget.prototype.getContext = function () {
  return this.ctx;
};

RenderTarget.init = initData => new RenderTarget(initData);

module.exports = RenderTarget;
