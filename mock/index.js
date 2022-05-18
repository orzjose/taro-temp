/* eslint-disable import/no-commonjs */
function connectMockRules() {
  const rules = []
  Array.prototype.forEach.call(arguments, (module) => {
    rules.push(...module.map((rule) => {
      const [regex, method, mockData] = rule
      return {
        regex,
        method,
        mockData
      }
    }))
  })
  return rules
}

module.exports = connectMockRules(
  require('./user/example')
)
