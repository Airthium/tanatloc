import Template from '..'

describe('plugins/denso/template', () => {
  it('exists', () => {
    expect(Template).toEqual({
      key: 'denso',
      path: process.cwd() + '/plugins/denso/template',
      templates: [
        {
          key: 'solderFilling',
          file: 'solderFilling.edp.ejs'
        }
      ]
    })
  })
})
