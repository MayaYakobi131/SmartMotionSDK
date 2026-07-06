# SmartMotion SDK Developer Guide

Welcome to the SmartMotion SDK Developer Guide.

This guide explains how to integrate the SmartMotion SDK into an Android application, configure the SDK, start location tracking, and monitor live data using the SmartMotion Dashboard.

The guide is intended for Android developers who want to integrate the SDK into their applications and understand how the SmartMotion platform works.

---

# Who Can Use SmartMotion SDK?

SmartMotion SDK can be integrated into Android applications that require real-time location tracking.

Typical use cases include:

- Delivery applications
- Bike and scooter sharing systems
- Navigation applications
- Tourist guide applications
- Smart city platforms
- Shopping malls and visitor analytics
- University campus applications
- Event management systems
- Dating applications

The SDK continuously collects location updates and sends them to the backend, making it suitable for applications that require live movement analytics.

---

# Before You Start

Before integrating the SDK, make sure the following requirements are met.

## Android Application

Your Android project should use:

- Android API 26 or higher
- Google Play Services Location
- Internet permission
- Fine Location permission

## Backend Server

Start the backend server before launching the Android application.

The SDK communicates with the backend using REST API requests.

## SmartMotion Dashboard

Verify that the dashboard is running before starting location tracking.

The dashboard displays incoming location events in real time.

### Live Dashboard

[Open SmartMotion Dashboard](https://smart-motion-f95mi8i9y-maya-yakobi.vercel.app/)

---

# Get Started

Integrating SmartMotion SDK requires only a few simple steps.

1. Add the SDK dependency.
2. Configure the SDK.
3. Initialize the SDK.
4. Grant location permission.
5. Start location tracking.
6. Open the SmartMotion Dashboard.
7. Monitor live location updates.

The following sections explain each step in detail.

---

# Installation

Add the SmartMotion SDK dependency to your Android project.

```gradle
dependencies {
    implementation("com.github.MayaYakobi131:smartmotion-sdk:1.0.0")
}
```

Required Android permissions:

```xml
<uses-permission android:name="android.permission.INTERNET"/>

<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>

<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

After completing these steps, the SDK is ready to be configured and initialized.

---

# Implementation

Integrating SmartMotion SDK into an Android application consists of four simple steps.

## Step 1 – Create the SDK Configuration

Create a `SmartMotionConfig` object containing the API Key and the backend server address.

```kotlin
val config = SmartMotionConfig(
    apiKey = "YOUR_API_KEY",
    serverUrl = "http://YOUR_SERVER:3000"
)
```

The API Key identifies the application, while the server URL specifies where location updates will be sent.

---

## Step 2 – Initialize the SDK

Initialize the SDK once after the application starts.

```kotlin
SmartMotion.initialize(
    context = this,
    config = config
)
```

During initialization the SDK:

- Stores the SDK configuration.
- Creates the networking client.
- Creates the location tracker.
- Prepares the SDK for receiving location updates.

After initialization the SDK is ready to start tracking.

---

## Step 3 – Grant Location Permission

Before tracking can begin, the application must receive the Android location permission.

If the permission is granted, the SDK can receive GPS updates.

If the permission is denied, location tracking cannot begin.

---

## Step 4 – Start Tracking

Start location tracking by calling:

```kotlin
SmartMotion.startTracking(
    userId = "user_123"
)
```

Once tracking starts, the SDK automatically:

- Requests GPS location updates.
- Creates a `LocationData` object.
- Sends every location update to the backend server.
- Continues tracking until `stopTracking()` is called.

No additional networking code is required.
---

# Android Demo Application

The project includes an Android demo application that demonstrates how to integrate and test the SDK.

<p align="center">
    <img src="../assets/android-demo.png" width="420"/>
</p>

The demo application displays:

- SDK Status
- Tracking Status
- User ID
- Current Location
- Last Update
- Server Status
- Last Server Response

The application also provides two actions:

- **Start Tracking**
- **Stop Tracking**

These buttons allow developers to test the complete SDK workflow.

---

# How to Use

## Start Tracking

Press **Start Tracking**.

The SDK begins requesting GPS updates from the device and automatically sends every new location to the backend.

---

## Stop Tracking

Press **Stop Tracking**.

The SDK stops requesting location updates and no additional location events are sent.

---

## Monitor Live Data

Open the SmartMotion Dashboard:

[Open SmartMotion Dashboard](https://smart-motion-f95mi8i9y-maya-yakobi.vercel.app/)

While tracking is active you can monitor:

- Live users
- Incoming location events
- Active H3 areas
- Heatmap updates
- Analytics charts
- Connected applications

The dashboard refreshes automatically every five seconds.

---

# Implementation Flow

The SmartMotion workflow is:

1. Initialize the SDK.
2. Grant location permission.
3. Start tracking.
4. Receive GPS updates.
5. Send location events to the backend.
6. Validate and store the data.
7. Display live information in the SmartMotion Dashboard.

# Creating a New Event

In SmartMotion SDK, every GPS location update is treated as a new location event.

When location tracking is active, the SDK automatically creates a `LocationData` object for each location received from the device.

Each event contains:

```json
{
  "userId": "user_123",
  "latitude": 32.0822,
  "longitude": 34.7688,
  "timestamp": "2026-07-05T12:30:00Z"
}
```

The SDK sends every event to the backend using the configured API Key.

The backend then:

- Validates the API Key
- Validates the location data
- Generates an H3 spatial index
- Stores the event in PostgreSQL
- Makes the new data available to the SmartMotion Dashboard

Every received location update is treated as an independent location event.

---

# Other SDK Functions

Besides starting and stopping location tracking, SmartMotion SDK provides several helper functions.

### Check SDK Status

```kotlin
SmartMotion.isInitialized()
```

Returns `true` if the SDK has already been initialized.

---

### Get Current Configuration

```kotlin
SmartMotion.getConfig()
```

Returns the current SDK configuration.

---

### Send a Location Manually

```kotlin
SmartMotion.sendLocation(locationData)
```

Sends a `LocationData` object directly to the backend.

This function can be useful when location information is collected from another source instead of the built-in location tracker.
# SmartMotion Dashboard

The SmartMotion Dashboard provides a real-time view of the information collected by the SDK.

### Live Dashboard

[Open SmartMotion Dashboard](https://smart-motion-f95mi8i9y-maya-yakobi.vercel.app/)

<p align="center">
    <img src="../assets/dashboard-overview.png" width="420"/>
</p>

The dashboard displays:

- Live Users
- History Events
- Active H3 Areas
- Connected Applications

The dashboard retrieves its data directly from the backend REST API and refreshes automatically every five seconds.

---

## Dashboard Sections

The dashboard is divided into several sections.

- Statistics cards summarize the current system status.
- The Heatmap visualizes active H3 cells.
- Analytics charts summarize the collected location events.
- Connected Applications displays registered applications.

---

# Live Heatmap

<p align="center">
    <img src="../assets/heatmap.png" width="420"/>
</p>

The heatmap groups nearby users into H3 spatial cells.

Each H3 cell represents an area containing active users.

The map allows developers to quickly identify areas with higher activity.

---

# Analytics

<p align="center">
    <img src="../assets/analytics.png" width="420"/>
</p>

The analytics page summarizes the location events received by the backend.

Current analytics include:

- Active users per H3 cell
- Crowd distribution
- Top active areas

Charts are refreshed automatically as new location events are received.

---

# Example Applications

SmartMotion SDK can be integrated into many different Android applications.

Examples include:

### Delivery Platforms

Monitor delivery drivers and visualize active delivery areas.

---

### Bike and Scooter Sharing

Track vehicle locations and identify high-demand zones.

---

### Navigation Applications

Display live user movement and improve route monitoring.

---

### Tourist Guide Applications

Monitor guided tours and visualize visitor locations.

---

### Smart City Solutions

Analyze movement patterns across different areas.

---

### Shopping Centers

Analyze visitor distribution and crowded areas inside large shopping complexes.

---

### Dating Applications

Visualize nearby users and location activity in different areas.

---

# Best Practices

To achieve the best results when using SmartMotion SDK, follow these recommendations.

- Initialize the SDK only once during the application lifecycle.
- Grant location permission before starting location tracking.
- Verify that the backend server is running.
- Use a valid API Key configured on the backend.
- Open the SmartMotion Dashboard to verify that new location events are being received.

Following these recommendations helps ensure reliable communication between the Android application, the backend server and the SmartMotion Dashboard.
# Troubleshooting

## The SDK is not initialized

**Possible cause**

`SmartMotion.initialize()` was not called before starting location tracking.

**Solution**

Initialize the SDK before calling any other SmartMotion function.

---

## No location updates are received

Verify that:

- Location permission has been granted.
- GPS is enabled on the device.
- Tracking has been started.
- The device has an internet connection.

---

## The dashboard does not display new events

Verify that:

- The backend server is running.
- The configured `serverUrl` is correct.
- A valid API Key is being used.
- The Android application is actively sending location updates.

---

# Demo Video

The recommended demonstration flow is:

1. Start the backend server.
2. Open the SmartMotion Dashboard.
3. Launch the Android Demo application.
4. Initialize the SDK.
5. Start location tracking.
6. Observe incoming location events.
7. View the updated Heatmap and Analytics pages.
8. Stop location tracking.

## Live Dashboard

[Open SmartMotion Dashboard](https://smart-motion-f95mi8i9y-maya-yakobi.vercel.app/)

## Demo Video

[Watch SmartMotion SDK Demo](https://www.renderforest.com/watch-117362347?queue_id=193896427&quality=0)

---

# Author

Developed by

**Maya Yakobi**