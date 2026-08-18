---
title: Fail-Safe Over-The-Air (OTA) Firmware Updates for Embedded Linux Devices
date: 2026-08-18
description: Implement bulletproof Dual A/B active-passive partition schemes, bootloader watchdog rollbacks, and cryptographically signed firmware bundles using RAUC.
tags: [embedded-linux, ota, rauc, mender, security]
---

## The Danger of Bricking Devices Field Deployments

Updating firmware on thousands of remote embedded Linux devices (IoT gateways, industrial machinery, automotive ECUs) poses catastrophic risks. If a power outage occurs midway through an update or a corrupted kernel binary fails to boot, a field technician must physically visit the device.

To guarantee zero field downtime, embedded devices rely on **Dual A/B Partition Schemes** paired with **RAUC (Robust Auto-Update Controller)** and **U-Boot Hardware Watchdog Rollbacks**.

## Dual A/B Partition Architecture

```
  Device Storage Partitioning (eMMC / NVMe)
  +-------------------------------------------------------------------+
  |  [ U-Boot Bootloader ] (Manages active partition environment)    |
  +-------------------------------------------------------------------+
  |  [ System Partition A ] (Active / Running OS v1.2)                |
  +-------------------------------------------------------------------+
  |  [ System Partition B ] (Passive Target for OTA Bundle Update v1.3)|
  +-------------------------------------------------------------------+
  |  [ Persistent Data ] (/data - Preserved across OS updates)        |
  +-------------------------------------------------------------------+

                       OTA Update Flow
                       ---------------
  1. RAUC Daemon verifies cryptographic signature of update bundle.
  2. Writes OS v1.3 image onto Passive Partition B.
  3. Sets U-Boot boot counter (`BOOT_B_LEFT=3`).
  4. Reboots device into Partition B.
  5. If Partition B boots successfully: Mark Partition B ACTIVE.
  6. If hardware watchdog triggers: U-Boot automatically rolls back to Partition A!
```

## Step 1 — Defining Partition Slots (`/etc/rauc/system.conf`)

Configure RAUC daemon slot definitions on the target embedded hardware:

```ini
[system]
channel=production
site=site-east
compatible=industrial-gateway-v2
bootloader=uboot

[keyring]
path=/etc/rauc/ca.cert.pem

[slot.rootfs.0]
device=/dev/mmcblk0p2
type=ext4
bootname=A

[slot.rootfs.1]
device=/dev/mmcblk0p3
type=ext4
bootname=B
```

## Step 2 — Cryptographically Signing RAUC Update Bundles (`manifest.raucm`)

Create the update bundle manifest on build servers:

```ini
[update]
compatible=industrial-gateway-v2
version=2026.08.18
description="Production Firmware Release v2.4.0 with Security Patches"

[bundle]
format=verity

[image.rootfs]
filename=rootfs.img
sha256=a8f5f167f44f4964e6c998dee827110c...
size=142608400
```

Sign the firmware bundle with OpenSSL PKI infrastructure:

```bash
# Package and cryptographically sign firmware bundle
rauc bundle \
  --cert=keys/production-release.cert.pem \
  --key=keys/production-release.key.pem \
  bundle-dir/ \
  deploy/firmware-v2.4.0.raucb

# Verify signature validity
rauc info deploy/firmware-v2.4.0.raucb
```

## Step 3 — U-Boot Automatic Rollback Script (`uboot.env`)

Configure the U-Boot environment script to handle hardware watchdog rollbacks:

```text
# Check boot trial counters
test_boot_a=if test "${BOOT_A_LEFT}" -gt 0; then setexpr BOOT_A_LEFT ${BOOT_A_LEFT} - 1; saveenv; run boot_a; fi
test_boot_b=if test "${BOOT_B_LEFT}" -gt 0; then setexpr BOOT_B_LEFT ${BOOT_B_LEFT} - 1; saveenv; run boot_b; fi

# Fallback sequence: Attempt active slot, else fall back to backup slot
bootcmd=run test_boot_a; run test_boot_b; reset;

boot_a=setenv bootargs console=ttyS0,115200 root=/dev/mmcblk0p2 rw rootwait; bootm ${kernel_addr}
boot_b=setenv bootargs console=ttyS0,115200 root=/dev/mmcblk0p3 rw rootwait; bootm ${kernel_addr}
```

## Step 4 — Executing & Confirming OTA Updates Programmatically

Trigger firmware installations via Python/Systemd service daemons:

```python
import subprocess
import json

def install_ota_update(bundle_path: str) -> bool:
    print(f"Verifying and installing firmware bundle: {bundle_path}")

    # Inspect RAUC bundle status
    info_cmd = subprocess.run(["rauc", "info", "--output-format=json", bundle_path], capture_output=True, text=True)
    if info_cmd.returncode != 0:
        print("Cryptographic verification failed! Rejecting payload.")
        return False

    bundle_info = json.loads(info_cmd.stdout)
    print(f"Compatible target: {bundle_info['compatible']}, Version: {bundle_info['version']}")

    # Install payload onto passive partition
    install_cmd = subprocess.run(["rauc", "install", bundle_path], capture_output=True, text=True)
    if install_cmd.returncode == 0:
        print("Firmware written successfully to passive partition! Triggering reboot...")
        subprocess.run(["reboot"])
        return True
    else:
        print(f"Installation failed: {install_cmd.stderr}")
        return False

def mark_system_healthy():
    # Called by systemd after successful boot & self-tests pass
    subprocess.run(["rauc", "status", "mark-good"])
    print("Partition marked GOOD in U-Boot environment.")

if __name__ == "__main__":
    mark_system_healthy()
```

## Production Reliability Guarantees

1. **Cryptographic Signing**: Devices reject unsigned or corrupted update bundles before flashing writes begin.
2. **Atomic Fail-Safe**: If power is cut midway through flashing, the active running system on Partition A remains untouched.
3. **Automatic Watchdog Rollback**: If a new kernel panics or fails to confirm `rauc status mark-good` within 3 minutes, the U-Boot watchdog reboots back into the previous stable partition automatically.
