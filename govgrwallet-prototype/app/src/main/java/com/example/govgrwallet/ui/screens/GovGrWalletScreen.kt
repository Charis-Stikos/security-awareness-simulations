package com.example.govgrwallet.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.govgrwallet.ui.components.*

@Composable
fun GovGrWalletScreen(onOpenPortal: () -> Unit, onViewLogs: () -> Unit) {
    val backgroundGradient = Brush.verticalGradient(
        colors = listOf(Color(0xFF002B70), Color(0xFF00153D))
    )

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

            OutlinedButton(
                onClick = onViewLogs, // Change this to onViewLogs
                modifier = Modifier.fillMaxWidth().height(48.dp),
                shape = RoundedCornerShape(10.dp),
                border = BorderStroke(2.dp, Color.White)
            ) {
                Text("View Captured Data", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.weight(1f))

            FooterLogo()
        }
    }
}
