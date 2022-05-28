# Bins App
Sends you push notifications when to put your bins out, lets you know when they're collected, and lets you report when they weren't collected.

## send notification when:
```
  bin collection is next day (cron every day at 5pm) (bin event date is tomorrow)
  bin collection was made (bin event status changed to 'Collection Made')
  bin collection was reported missed (bin event status changed to 'Reported Missed')
```

# App
```
  User enters postcode
  User selects Address
  Prompted to enable push notifications
    fake prompt then real one
  Home
    :thumbs-up: You'll get notifications the evening before your bins are collected / Enable notifications
    Area not supported
      We don't support your area yet, but we will soon!
      You'll get bin notifications automatically when we do, you don't have to do anything. 
    Bin Collection info
      grid of cards, one per bin
        displays:
          type of bin
          status: put out tonight/collection made/(reported missed | other issue)
          next collection date
        tap grid takes you to detail page
          report missed
          subsequent collections
          what to put in this bin
```

# System Design

## Cron:
```
  every hour:
    for each Address which has a Device
      update database with bin status (attempt to determine binRegionId too and update Address)
          if status changed, emit event

    check Notification table
      expo.chunkPushNotificationReceiptIds([...Notification.Id])
        if error DeviceNotRegistered then remove Device
        if error MismatchSenderId or InvalidCredentials flag to admin
      delete processed notifications

    if it's 5pm
      emit event for each bin collection that is next day
```

## Events:
```
  collection status changed:
    send notifications for all bins that were collected or reported missed in the past
```
```
  send notification
    check ticket for error, if error is DeviceNotRegistered remove Device
    record Notification in Notification table
```

## GraphQL API:

```gql
Query {
  findAddress(postcode: "ct11bl") {
    id: "uprn/usrn"
    supported : true/false
    address: "address"
  } # cache this
  findBins(addressId: "uprn/usrn") {
    id: "addressId/type"
    type
    status
    collectionDates
  } # when ran for the first time: determine binRegionId for Address, fetch data
}

Mutation {
  enableNotifications(token: "", addressId: "uprn/usrn")
  reportMissed(
    eventId: "addressId/type/date"
    // store below on device
    firstName: ""
    lastName: ""
    emailAddress: ""
    usuallyLeaveBins: ""
  )
}
```

## DB:
```
Address
  id (uprn/usrn)
  uprn 
  usrn
  postcode [idx]
  binRegionId

BinRegion
  id
  name

Bin
  id (addressId/type)
  type
  status

Collection
  id (binId/date)
  binId
  date

Device
  id
  addressId
  notificationToken

Notification
  id (ticketId)
  deviceId

```