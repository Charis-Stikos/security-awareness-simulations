package com.example.govgrwallet.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.govgrwallet.ui.components.*

private const val SECRET_TAP_COUNT = 5

@Composable
fun GovGrWalletScreen(onOpenPortal: () -> Unit, onViewLogs: () -> Unit) {
    val backgroundGradient = Brush.verticalGradient(
        colors = listOf(Color(0xFF002B70), Color(0xFF00153D))
    )

    var footerTapCount by remember { mutableStateOf(0) }

    Box(modifier = Modifier.fillMaxSize().background(backgroundGradient)) {
        BackgroundPattern()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.weight(0.8f))

            LogoSectionWithCorners()

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = onOpenPortal,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00B2FF))
            ) {
                Text("Σύνδεση με κωδικούς TaxisNet", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedActionButton("Έλεγχος Εγγράφου", { QrCodeIcon() }, onOpenPortal)
            Spacer(modifier = Modifier.height(12.dp))
            OutlinedActionButton("Επαλήθευση ηλικίας", { AgeVerificationIcon() }, onOpenPortal)

            Spacer(modifier = Modifier.height(24.dp))

            NonGreekResidentsSeparator()

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedActionButton("Event Tickets", { EventTicketIcon() }, onOpenPortal)

            Spacer(modifier = Modifier.weight(1f))

            // Secret trigger: tap the footer logo 5 times to open the logs screen
            Box(
                modifier = Modifier.clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null
                ) {
                    footerTapCount++
                    if (footerTapCount >= SECRET_TAP_COUNT) {
                        footerTapCount = 0
                        onViewLogs()
                    }
                }
            ) {
                FooterLogo()
            }
        }
    }
}
