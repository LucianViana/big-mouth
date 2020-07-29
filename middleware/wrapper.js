'use strict';

const middy         = require('middy');
const sampleLogging = require('../middleware/sample-logging');
const correlationIds = require('../middleware/capture-correlation-ids');

module.exports = f => {
    return middy(f)
  .use(correlationIds({ sampleDebugLogRate: 0.01 }))
  .use(sampleLogging({ sampleRate: 0.01 }));
};
