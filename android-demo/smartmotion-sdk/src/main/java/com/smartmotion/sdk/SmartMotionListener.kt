package com.smartmotion.sdk

import com.smartmotion.sdk.models.LocationData
import com.smartmotion.sdk.network.LocationResponse

interface SmartMotionListener {

    fun onTrackingStarted()

    fun onTrackingStopped()

    fun onLocationUpdated(locationData: LocationData)

    fun onLocationSent(response: LocationResponse)

    fun onError(errorMessage: String)
}