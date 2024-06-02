export default [
  {
    url: '/api/test',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          name: 'vben'
        }
      }
    }
  }
]
