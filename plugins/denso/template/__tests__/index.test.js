import Template from '..'

describe('plugins/denso/template', () => {
  test('exists', () => {
    expect(Template).toEqual({
      key: 'denso',
      path: './plugins/denso/template',
      templates: [
        {
          key: 'solderFilling',
          file: 'solderFilling.edp.ejs'
        }
      ]
    })
  })
})
