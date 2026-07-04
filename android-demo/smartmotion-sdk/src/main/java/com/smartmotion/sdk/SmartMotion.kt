package com.smartmotion.sdk

import android.content.Context
import com.smartmotion.sdk.models.LocationData
import com.smartmotion.sdk.tracking.LocationTracker

object SmartMotion {

    private var config: SmartMotionConfig? = null
    private var client: SmartMotionClient? = null
    private var locationTracker: LocationTracker? = null

    fun initialize(context: Context, config: SmartMotionConfig) {
        this.config = config
        this.client = SmartMotionClient(config)

        this.locationTracker = LocationTracker(context.applicationContext) { locationData ->
            sendLocation(locationData)
        }
    }

    fun isInitialized(): Boolean {
        return config != null && client != null && locationTracker != null
    }

    fun getConfig(): SmartMotionConfig? {
        return config
    }

    fun getClient(): SmartMotionClient? {
        return client
    }

    fun sendLocation(locationData: LocationData) {
        if (!isInitialized()) {
            throw IllegalStateException("SmartMotion SDK is not initialized")
        }

        client?.sendLocation(locationData)
    }

    fun startTracking(userId: String) {
        if (!isInitialized()) {
            throw IllegalStateException("SmartMotion SDK is not initialized")
        }

        locationTracker?.startTracking(userId)
    }

    fun stopTracking() {
        if (!isInitialized()) {
            throw IllegalStateException("SmartMotion SDK is not initialized")
        }

        locationTracker?.stopTracking()
    }
}