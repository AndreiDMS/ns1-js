"use strict";

let NS1        = require('../../lib'),
    record     = require('./record'),
    changeCase = require('change-case')

if (process.env.NS1_JS_TEST_API_KEY && process.env.NS1_JS_TEST_API_KEY !== NS1.Request.NS1_API_KEY) {
  NS1.setApiKey(process.env.NS1_JS_TEST_API_KEY)
} else {
  // TODO: Below error should probably come from lib internally.
  throw new Error("NS1 API key required. Please set env variable NS1_JS_TEST_API_KEY")
  process.exit(1)
}

module.exports = {

  setup_context(context_str, cb) {
    context(context_str, function() {
      let context_str_file = changeCase.snakeCase(context_str),
          recorder         = record(context_str_file)

      before(recorder.before)

      after(recorder.after)

      if (typeof cb === 'function') {
        cb.call(this)
      }
    })
  }

}