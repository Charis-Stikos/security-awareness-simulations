#!/bin/bash

# Stop interfering services
echo "[*] Stopping NetworkManager..."
sudo systemctl stop NetworkManager
sudo airmon-ng check kill

# Set up the Wi-Fi Interface IP
echo "[*] Configuring wlan0 IP to 10.0.0.1..."
sudo ifconfig wlan0 10.0.0.1 netmask 255.255.255.0 up

# Clear old firewall rules to avoid duplicates
echo "[*] Clearing old firewall rules..."
sudo iptables --flush
sudo iptables -t nat --flush

# Add Port Forwarding (80 -> 3000)
echo "[*] Setting up Port Forwarding (80 -> 3000)..."
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

# Enable Internet Sharing (Masquerading)
# Change 'eth0' below to your internet interface name if different!
echo "[*] Enabling Internet Connection Sharing (eth0 -> wlan0)..."
sudo sysctl -w net.ipv4.ip_forward=1 > /dev/null
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# BLOCK Internet Access by default (Captive Portal Logic)
# 1. Allow DNS (UDP 53) so clients can resolve names (using Google DNS 8.8.8.8)
sudo iptables -A FORWARD -i wlan0 -p udp --dport 53 -j ACCEPT
sudo iptables -A FORWARD -i wlan0 -p tcp --dport 53 -j ACCEPT

# 2. Allow Traffic that we have explicitly authorized (handled by server.js later)
# (For now, we start with DROP policy effectively by not adding a generic ACCEPT)

# 3. Allow Established Connections (Responses from Internet)
sudo iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT

# 4. Drop everything else from wlan0 to internet (Forces CP detection or failure)
sudo iptables -A FORWARD -i wlan0 -j DROP

echo ""
echo "============================================"
echo "Network is ready! Now run these 3 commands"
echo "in SEPARATE terminal tabs:"
echo "============================================"
echo "TAB 1: sudo hostapd hostapd.conf"
echo "TAB 2: sudo dnsmasq -C dnsmasq.conf -d"
echo "TAB 3: sudo node server.js"
echo "============================================"
