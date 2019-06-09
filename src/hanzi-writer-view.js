Component({
  properties: {
    height: {
      type: Number,
      value: 300,
    },
    width: {
      type: Number,
      value: 300,
    },
  },
  data: {
    isQuizzing: false,
  },
  methods: {
    connectContext(ctx) {
      this.ctx = ctx;
    },
    disconnectContext() {
      if (this.ctx) {
        this.ctx = undefined;
      }
    },
    _touchStart(evt) {
      if (this.ctx) this.ctx.trigger('pointerStart', evt);
    },
    _touchMove(evt) {
      if (this.ctx) this.ctx.trigger('pointerMove', evt);
    },
    _touchEnd(evt) {
      if (this.ctx) this.ctx.trigger('pointerEnd', evt);
    },
    getCanvasContext() {
      return wx.createCanvasContext('writer-canvas', this);
    },
    setIsQuizzing(isQuizzing) {
      this.setData({ isQuizzing });
    },
  },
  lifetimes: {
    detached() {
      if (this.ctx) {
        this.ctx.destroy();
      }
    },
  },
});
