package com.example.govgrwallet

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import com.example.govgrwallet.ui.screens.GovGrWalletScreen
import com.example.govgrwallet.ui.screens.LocalCaptivePortal
import com.example.govgrwallet.ui.screens.CapturedLogsScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                AppNavigation()
            }
        }
    }
}

@Composable
fun AppNavigation() {
    var showLoginScreen by remember { mutableStateOf(false) }
    var showLogsScreen by remember { mutableStateOf(false) }

    if (showLogsScreen) {
        BackHandler { showLogsScreen = false }
        CapturedLogsScreen { showLogsScreen = false }
    } else if (showLoginScreen) {
        BackHandler { showLoginScreen = false }
        LocalCaptivePortal { showLoginScreen = false }
    } else {
        GovGrWalletScreen(
            onOpenPortal = { showLoginScreen = true },
            onViewLogs = { showLogsScreen = true }
        )
    }
}
