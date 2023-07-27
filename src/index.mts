import * as dotenv from "dotenv";
import { NotificationDetails, NotificationHubsClient, NotificationOutcomeState, createAppleNotification } from "@azure/notification-hubs";
import { isRestError } from "@azure/core-rest-pipeline";
import { delay } from "@azure/core-util";

// Load the .env file if it exists
dotenv.config();

// Define connection string and hub name
const connectionString = process.env.NOTIFICATIONHUBS_CONNECTION_STRING || "<connection string>";
const hubName = process.env.NOTIFICATION_HUB_NAME || "<hub name>";

// Define message constants
const DUMMY_DEVICE = "00fc13adff785122b4ad28809a3420982341241421348097878e577c991de8f0";
const deviceHandle = process.env.APNS_DEVICE_TOKEN || DUMMY_DEVICE;

async function main() {
  const client = new NotificationHubsClient(connectionString, hubName);

  const messageBody = `{ "aps" : { "alert" : { title: "Hello", body: "Hello there SDK Review!" } } }`;
  const notification = createAppleNotification({
    body: messageBody,
    headers: {
      "apns-priority": "10",
      "apns-push-type": "alert",
    },
  });

  const result = await client.sendNotification(notification, { deviceHandle });

  console.log(`Direct send Tracking ID: ${result.trackingId}`);
  console.log(`Direct send Correlation ID: ${result.correlationId}`);

  // Only available in Standard SKU and above
  if (result.notificationId) {
    console.log(`Direct send Notification ID: ${result.notificationId}`);

    const results = await getNotificationDetails(client, result.notificationId);
    if (results) {
      console.log(JSON.stringify(results, null, 2));
    }
  }
}

async function getNotificationDetails(
  client: NotificationHubsClient,
  notificationId: string
): Promise<NotificationDetails | undefined> {
  let state: NotificationOutcomeState = "Enqueued";
  let count = 0;
  let result: NotificationDetails | undefined;
  while ((state === "Enqueued" || state === "Processing") && count++ < 10) {
    try {
      result = await client.getNotificationOutcomeDetails(notificationId);
      state = result.state!;
    } catch (e) {
      // Possible to get 404 for when it doesn't exist yet.
      if (isRestError(e) && e.statusCode === 404) {
        continue;
      } else {
        throw e;
      }
    }

    await delay(1000);
  }

  return result;
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
