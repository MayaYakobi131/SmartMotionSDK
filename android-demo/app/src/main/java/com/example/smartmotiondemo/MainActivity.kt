package com.example.smartmotiondemo

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.smartmotion.sdk.SmartMotion
import com.smartmotion.sdk.SmartMotionConfig
import java.util.UUID

class MainActivity : AppCompatActivity() {

    private val locationPermissionRequestCode = 1001
    private lateinit var demoUserId: String

    private lateinit var sdkStatusText: TextView
    private lateinit var trackingStatusText: TextView
    private lateinit var userText: TextView
    private lateinit var locationText: TextView
    private lateinit var updateText: TextView
    private lateinit var serverStatusText: TextView
    private lateinit var responseText: TextView
    private lateinit var startButton: Button
    private lateinit var stopButton: Button

    private var isTracking = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        demoUserId = getOrCreateUserId()

        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        setupWindowInsets()
        bindViews()
        setupInitialUi()
        setupButtons()
        requestLocationPermissionIfNeeded()
    }

    private fun setupWindowInsets() {
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(
                systemBars.left,
                systemBars.top,
                systemBars.right,
                systemBars.bottom
            )
            insets
        }
    }

    private fun bindViews() {
        sdkStatusText = findViewById(R.id.sdkStatusText)
        trackingStatusText = findViewById(R.id.trackingStatusText)
        userText = findViewById(R.id.userText)
        locationText = findViewById(R.id.locationText)
        updateText = findViewById(R.id.updateText)
        serverStatusText = findViewById(R.id.serverStatusText)
        responseText = findViewById(R.id.responseText)
        startButton = findViewById(R.id.startButton)
        stopButton = findViewById(R.id.stopButton)
    }

    private fun setupInitialUi() {
        sdkStatusText.text = "SDK Status\nNot Initialized"
        trackingStatusText.text = "Tracking Status\nStopped"
        userText.text = "Demo User\n$demoUserId"
        locationText.text = "Current Location\nLatitude: --\nLongitude: --"
        updateText.text = "Last Update\n--"
        serverStatusText.text = "Server Status\nWaiting for SDK"
        responseText.text = "Last SDK Event\nNo event yet"
    }

    private fun setupButtons() {
        startButton.setOnClickListener {
            startTracking()
        }

        stopButton.setOnClickListener {
            stopTracking()
        }
    }

    private fun requestLocationPermissionIfNeeded() {
        val hasPermission = ActivityCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        if (hasPermission) {
            initializeSmartMotion()
        } else {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                locationPermissionRequestCode
            )
        }
    }

    private fun initializeSmartMotion() {
        val config = SmartMotionConfig(
            apiKey = "sm_demo_key_123",
            serverUrl = "https://smartmotion-api.onrender.com"
        )

        SmartMotion.initialize(this, config)

        sdkStatusText.text = "SDK Status\nInitialized"
        serverStatusText.text = "Server Status\nConnected"
        responseText.text = "Last SDK Event\nSDK initialized successfully"
    }

    private fun startTracking() {
        if (!SmartMotion.isInitialized()) {
            initializeSmartMotion()
        }

        SmartMotion.startTracking(demoUserId)

        isTracking = true
        trackingStatusText.text = "Tracking Status\nActive"
        serverStatusText.text = "Server Status\nUploading locations"
        updateText.text = "Last Update\n${getCurrentTime()}"
        responseText.text = "Last SDK Event\nTracking started successfully"
    }

    private fun stopTracking() {
        if (SmartMotion.isInitialized()) {
            SmartMotion.stopTracking()
        }

        isTracking = false
        trackingStatusText.text = "Tracking Status\nStopped"
        serverStatusText.text = "Server Status\nConnected"
        updateText.text = "Last Update\n${getCurrentTime()}"
        responseText.text = "Last SDK Event\nTracking stopped"
    }

    private fun getCurrentTime(): String {
        val formatter = java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.getDefault())
        return formatter.format(java.util.Date())
    }

    private fun getOrCreateUserId(): String {
        val prefs = getSharedPreferences("smartmotion_prefs", MODE_PRIVATE)
        val existingUserId = prefs.getString("user_id", null)

        if (existingUserId != null) {
            return existingUserId
        }

        val newUserId = "user_" + UUID.randomUUID().toString().take(8)

        prefs.edit()
            .putString("user_id", newUserId)
            .apply()

        return newUserId
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(
            requestCode,
            permissions,
            grantResults
        )

        if (
            requestCode == locationPermissionRequestCode &&
            grantResults.isNotEmpty() &&
            grantResults[0] == PackageManager.PERMISSION_GRANTED
        ) {
            initializeSmartMotion()
        } else {
            sdkStatusText.text = "SDK Status\nPermission Missing"
            serverStatusText.text = "Server Status\nNot Connected"
            responseText.text = "Last SDK Event\nLocation permission denied"
        }
    }
}