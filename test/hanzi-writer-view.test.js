const _ = require('./utils')

test('render', async () => {
  const componentId = _.load('hanzi-writer-view', 'comp');
  const component = _.render(componentId, { width: 200, height: 200 });

  const parent = document.createElement('parent-wrapper');
  component.attach(parent);

  expect(_.match(component.dom, '<wx-view class="comp--container" style="width: 200px; height: 200px;"><wx-canvas style="width: 200px; height: 200px;"></wx-canvas></wx-view>')).toBe(true);
});

