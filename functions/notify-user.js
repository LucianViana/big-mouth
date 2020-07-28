'use strict';

const _          = require('lodash');
const co         = require('co');
const Kinesis    = require('../lib/kinesis');
const sns        = require('../lib/sns');
const streamName = process.env.order_events_stream;
const topicArn   = process.env.user_notification_topic;
const sampleLogging = require('../middleware/sample-logging');
const flushMetrics  = require('../middleware/flush-metrics');
const captureCorrelationIds = require('../middleware/capture-correlation-ids');

const handler = co.wrap(function* (event, context, cb) {
  let events = context.parseKinesisEvents;
  let orderAccepted = events.filter(r => r.eventType === 'order_accepted');

  for (let order of orderAccepted) {
    order.scopeToThis();

    let snsReq = {
      Message: JSON.stringify(order),
      TopicArn: topicArn
    };
    yield sns.publish(snsReq).promise();
    console.log(`notified user [${order.userEmail}] of order [${order.orderId}] being accepted`);

    let data = _.clone(order);
    data.eventType = 'user_notified';

    let kinesisReq = {
      Data: JSON.stringify(data),
      PartitionKey: order.orderId,
      StreamName: streamName
    };
    yield Kinesis.putRecord(kinesisReq).promise();
    console.log(`published 'user_notified' event to Kinesis`);

    order.unscopeI();
  }

  cb(null, "all done");
});

module.exports.handler = middy(handler)
  .use(captureCorrelationIds({ sampleDebugLogRate: 0.01 }))
  .use(sampleLogging({ sampleRate: 0.01 }))
  .use(flushMetrics);