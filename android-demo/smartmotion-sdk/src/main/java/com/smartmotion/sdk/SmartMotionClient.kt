package com.smartmotion.sdk

import com.smartmotion.sdk.models.LocationData
import com.smartmotion.sdk.network.ApiService

class SmartMotionClient(
    private val config: SmartMotionConfig
) {

    private val apiService = ApiService(config)

    fun getApiKey(): String {
        return config.apiKey
    }

    fun getServerUrl(): String {
        return config.serverUrl
    }

    fun sendLocation(locationData: LocationData) {
        apiService.sendLocation(locationData)
    }
}