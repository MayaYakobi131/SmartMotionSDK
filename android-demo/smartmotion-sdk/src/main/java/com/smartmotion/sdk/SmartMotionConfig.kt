package com.smartmotion.sdk

data class SmartMotionConfig(
    val apiKey: String,
    val serverUrl: String = "http://10.0.2.2:3000/api"
)