package com.example.govgrwallet.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun BackgroundPattern() {
    Canvas(modifier = Modifier.fillMaxSize()) {
        val spacing = 40f
        val color = Color(0xFF00B2FF).copy(alpha = 0.12f)
        for (x in 0..size.width.toInt() step spacing.toInt()) {
            for (y in 0..size.height.toInt() step spacing.toInt()) {
                drawCircle(color = color, radius = 1.8f, center = Offset(x.toFloat(), y.toFloat()))
            }
        }
    }
}

@Composable
fun LogoSectionWithCorners() {
    val configuration = LocalConfiguration.current
    val screenWidth = configuration.screenWidthDp.dp
    val logoSize = (screenWidth * 0.45f).coerceIn(140.dp, 200.dp)

    Box(contentAlignment = Alignment.Center, modifier = Modifier.size(logoSize)) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val cornerLength = size.width * 0.12f
            val strokeWidth = 3.5f
            val color = Color(0xFF00B2FF).copy(alpha = 0.5f)

            drawLine(color, Offset(0f, 0f), Offset(cornerLength, 0f), strokeWidth)
            drawLine(color, Offset(0f, 0f), Offset(0f, cornerLength), strokeWidth)
            drawLine(color, Offset(size.width, 0f), Offset(size.width - cornerLength, 0f), strokeWidth)
            drawLine(color, Offset(size.width, 0f), Offset(size.width, cornerLength), strokeWidth)
            drawLine(color, Offset(0f, size.height), Offset(cornerLength, size.height), strokeWidth)
            drawLine(color, Offset(0f, size.height), Offset(0f, size.height - cornerLength), strokeWidth)
            drawLine(color, Offset(size.width, size.height), Offset(size.width - cornerLength, size.height), strokeWidth)
            drawLine(color, Offset(size.width, size.height), Offset(size.width, size.height - cornerLength), strokeWidth)
        }

        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(buildAnnotatedString {
                withStyle(style = SpanStyle(color = Color.White, fontWeight = FontWeight.Bold)) { append("gov") }
                withStyle(style = SpanStyle(color = Color(0xFF00B2FF), fontWeight = FontWeight.Bold)) { append(".gr") }
            }, fontSize = (logoSize.value * 0.22f).sp)
            Text("wallet", color = Color.White, fontSize = (logoSize.value * 0.2f).sp, fontWeight = FontWeight.ExtraBold)
        }
    }
}

@Composable
fun OutlinedActionButton(text: String, icon: @Composable () -> Unit, onClick: () -> Unit) {
    OutlinedButton(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth().height(52.dp),
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(2.dp, Color.White),
        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
            Box(modifier = Modifier.size(28.dp), contentAlignment = Alignment.Center) { icon() }
            Spacer(modifier = Modifier.weight(1f))
            Text(text, color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.weight(1f))
            Box(modifier = Modifier.size(28.dp))
        }
    }
}

@Composable
fun QrCodeIcon() {
    Canvas(modifier = Modifier.size(18.dp)) {
        val s = size.width * 0.42f
        drawRect(Color.White, Offset(0f, 0f), Size(s, s))
        drawRect(Color.White, Offset(size.width - s, 0f), Size(s, s))
        drawRect(Color.White, Offset(0f, size.height - s), Size(s, s))
        drawRect(Color.White, Offset(size.width - s, size.height - s), Size(s, s))
    }
}

@Composable
fun AgeVerificationIcon() {
    Box(contentAlignment = Alignment.Center, modifier = Modifier.size(24.dp)) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val radius = size.width / 2
            for (i in 0 until 12) {
                val angle = Math.toRadians((i * 30).toDouble())
                drawCircle(Color.White, 1.2f, Offset((size.width/2 + (radius-2) * cos(angle)).toFloat(), (size.height/2 + (radius-2) * sin(angle)).toFloat()))
            }
        }
        Text("18+", color = Color.White, fontSize = 8.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun FooterLogo() {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Canvas(modifier = Modifier.size(24.dp).padding(end = 6.dp)) {
            drawCircle(Color.White, radius = size.width / 2, style = Stroke(width = 1.8f))
            drawRect(Color.White, Offset(size.width / 2 - 1f, 5f), Size(2f, size.height - 10f))
            drawRect(Color.White, Offset(5f, size.height / 2 - 1f), Size(size.width - 10f, 2f))
        }
        Text(buildAnnotatedString {
            withStyle(style = SpanStyle(color = Color.White, fontWeight = FontWeight.Bold)) { append("gov") }
            withStyle(style = SpanStyle(color = Color(0xFF00B2FF), fontWeight = FontWeight.Bold)) { append("gr") }
        }, fontSize = 22.sp)
    }
}

@Composable
fun NonGreekResidentsSeparator() {
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
        Box(modifier = Modifier.weight(1f).height(1.dp).background(Color(0xFF00B2FF).copy(alpha = 0.3f)))
        Text("Non Greek residents", color = Color.White, fontSize = 13.sp, modifier = Modifier.padding(horizontal = 12.dp))
        Box(modifier = Modifier.weight(1f).height(1.dp).background(Color(0xFF00B2FF).copy(alpha = 0.3f)))
    }
}
