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

const eventify = (evt, boundingRect) => {
  const getPoint = () => {
    const x = evt.touches[0].clientX - boundingRect.left;
    const y = evt.touches[0].clientY - boundingRect.top;
    return { x, y };
  };

  return { preventDefault: () => { }, getPoint };
};

class RenderTarget {
  constructor(view) {
    this.view = view;
    this.eventEmitter = new EventEmitter();
    
    wx.createSelectorQuery()
      .in(view)
      .select('#writer-canvas')
      .fields({ node: true, size: true })
	    .exec((res) => {
            let info = res[0];
            const dpr = wx.getSystemInfoSync().pixelRatio;
            this.canvas = info.node;
            this.canvas.width = info.width * dpr;
            this.canvas.height = info.height * dpr;
            this.ctx = this.canvas.getContext('2d');
            this.ctx.scale(dpr, dpr);
      });
  }

  addPointerStartListener(callback) {
    this.eventEmitter.addListener('pointerStart', callback);
  }

  addPointerMoveListener(callback) {
    this.eventEmitter.addListener('pointerMove', callback);
  }

  addPointerEndListener(callback) {
    this.eventEmitter.addListener('pointerEnd', callback);
  }

  trigger(eventName, evt) {
    this._getClientBoundingRect().then(rect => {
      this.eventEmitter.trigger(eventName, eventify(evt, rect));
    });
  }

  removeAllListeners() {
    return this.eventEmitter.removeAllListeners();
  }

  getContext() {
    return this.ctx;
  }

  _getClientBoundingRect() {
    return new Promise(resolve => {
      this.view
        .createSelectorQuery()
        .select('#writer-canvas')
        .boundingClientRect(resolve)
        .exec();
    });
  }
}

RenderTarget.init = initData => new RenderTarget(initData);

module.exports = RenderTarget;
