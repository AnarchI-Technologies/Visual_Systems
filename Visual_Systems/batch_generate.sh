#!/bin/bash
# ANARCHI BATCH PRODUCTION ENGINE
# Automates the production of unique zip collections using intensity variations.

BASE_THEME=${1:-"Industrial_Protocol"}
TIER=${2:-"standard"}
SERIAL_PREFIX="ANX-BATCH-$(date +%Y%m%d)"

echo "Starting batch production for: $BASE_THEME"

for i in {1..10}
do
   # Stepping intensity from 0.0 to 0.9
   INTENSITY=$(echo "scale=1; ($i-1)/10" | bc)
   
   [[ $INTENSITY == .* ]] && INTENSITY="0$INTENSITY"
   [[ $INTENSITY == "" ]] && INTENSITY="0.0"

   DROP_NAME="AnarchI_${BASE_THEME}_VAR_${i}"
   ts-node main.ts "$DROP_NAME" "$BASE_THEME" "$INTENSITY" "$SERIAL_PREFIX" "$TIER"
done