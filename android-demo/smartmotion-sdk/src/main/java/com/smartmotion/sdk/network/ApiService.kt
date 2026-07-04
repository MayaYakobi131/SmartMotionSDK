package com.smartmotion.sdk.network

import com.smartmotion.sdk.SmartMotionConfig
import com.smartmotion.sdk.models.LocationData
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

class ApiService(
    private val config: SmartMotionConfig
) {

    private val api: SmartMotionApi

    init {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(logging)
            .build()

        val retrofit = Retrofit.Builder()
            .baseUrl(normalizeBaseUrl(config.serverUrl))
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        api = retrofit.create(SmartMotionApi::class.java)
    }

    fun sendLocation(locationData: LocationData) {
        api.sendLocation(
            apiKey = config.apiKey,
            locationData = locationData
        ).enqueue(object : Callback<LocationResponse> {

            override fun onResponse(
                call: Call<LocationResponse>,
                response: Response<LocationResponse>
            ) {
                if (response.isSuccessful) {
                    println("Location sent successfully: ${response.body()}")
                } else {
                    println("Failed to send location. Code: ${response.code()}")
                    println("Error body: ${response.errorBody()?.string()}")
                }
            }

            override fun onFailure(call: Call<LocationResponse>, t: Throwable) {
                println("Network error while sending location: ${t.message}")
            }
        })
    }

    private fun normalizeBaseUrl(serverUrl: String): String {
        return if (serverUrl.endsWith("/")) {
            serverUrl
        } else {
            "$serverUrl/"
        }
    }
}

private interface SmartMotionApi {

    @POST("api/location")
    fun sendLocation(
        @Header("x-api-key") apiKey: String,
        @Body locationData: LocationData
    ): Call<LocationResponse>
}

data class LocationResponse(
    val success: Boolean,
    val message: String?,
    val data: ServerLocationData?
)

data class ServerLocationData(
    val id: String?,
    val userId: String?,
    val latitude: Double?,
    val longitude: Double?,
    val timestamp: String?,
    val appId: String?,
    val h3Index: String?,
    val receivedAt: String?
)