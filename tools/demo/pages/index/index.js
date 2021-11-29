/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-unresolved
import createHanziWriterContext from '../../components/index';

Page({
  onReady() {
    this.writerCtx = createHanziWriterContext({
      id: 'hz-writer',
      character: '你',
      page: this,
      drawingWidth: 20,
    });

    this.writerCtx.quiz();

    // 2d
    const comp = this.selectComponent('#hz-writer2');
    const query = comp.createSelectorQuery();

    query
      .select('#' + comp.data.canvasId)
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        this.writerCtx2 = createHanziWriterContext({
          id: 'hz-writer2',
          character: '你',
          page: this,
          drawingWidth: 30,
          renderCanvas: canvas,
        });

        this.writerCtx2.quiz();
      });
  },
});
