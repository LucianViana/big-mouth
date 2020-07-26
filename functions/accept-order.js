'use strict';

const co         = require('co');
const kinesis    = require('../lib/kinesis');
const streamName = process.env.order_events_stream;

const middy         = require('middy');
const sampleLogging = require('../middleware/sample-logging');
const captureCorrelationIds = require('../middleware/capture-correlation-ids');


const handler = co.wrap(function* (event, context, cb) {
  let req = JSON.parse(event.body);
  log.debug(`request body is valid JSON`, { requestBody: event.body });

  let restaurantName = req.restaurantName;
  let orderId = req.orderId;
  let userEmail = req.userEmail;

  log.debug('restaurant accepted order', { orderId, restaurantName, userEmail });

  let data = {
    orderId,
    userEmail,
    restaurantName,
    eventType: 'order_accepted'
  }

  let kinesisReq = {
    Data: JSON.stringify(data), // the SDK would base64 encode this for us
    PartitionKey: orderId,
    StreamName: streamName
  };

  yield cloudwatch.trackExecTime(
    "KinesisPutRecordLatency",
    () => kinesis.putRecord(kinesisReq).promise()
  );

  log.debug(`published event into Kinesis`, { eventName: 'order_accepted' });

  let response = {
    statusCode: 200,
    body: JSON.stringify({ orderId })
  }

  cb(null, response);
});

module.exports.handler = middy(handler)
  .use(captureCorrelationIds({ sampleDebugLogRate: 0.01 }))
  .use(sampleLogging({ sampleRate: 0.01 }));