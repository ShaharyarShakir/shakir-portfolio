---
title: Sub-Second Boot Optimization for Embedded Linux Devices with Systemd
date: 2026-08-09
description: Techniques for trimming embedded Linux cold boot times down under 800 milliseconds using systemd-analyze, silent kernel command lines, and quiet U-Boot setups.
tags: [embedded-linux, systemd, boot-optimization, kernel, performance]
---

## The Sub-Second Boot Imperative

In automotive infotainment systems, reverse cameras must render video feeds on dashboard screens in under 1 second from key turning. Industrial safety hardware cannot wait 30 seconds for standard desktop Linux startup scripts to initialize.

Achieving sub-second cold boot times requires optimizing three boot stages: **U-Boot Bootloader**, **Kernel Initialization**, and **User-Space Systemd Daemon Execution**.

## Boot Sequence Optimization Breakdown

```
  Traditional Linux Boot (25.4 Seconds)
  [ U-Boot Delay (3s) ] ── [ Uncompressed Kernel (8s) ] ── [ Init Scripts (14.4s) ]

  Optimized Embedded Boot (0.78 Seconds / 780ms)
  [ Quiet U-Boot (80ms) ] ── [ XZ Kernel + Quiet (320ms) ] ── [ Systemd Native (380ms) ]
```

## Step 1 — Profiling Boot Bottlenecks with `systemd-analyze`

Analyze startup time graphs and critical chain bottlenecks:

```bash
# Display total boot duration
systemd-analyze

# Display startup duration by daemon
systemd-analyze blame | head -n 15

# Export SVG plot of boot sequence
systemd-analyze plot > boot_analysis.svg
```

## Step 2 — Silent U-Boot Configuration (`u-boot.cfg`)

Disable console serial printing and boot delay timers in U-Boot:

```text
# Disable 3-second boot wait prompt
CONFIG_BOOTDELAY=-2

# Disable serial debug printing during boot execution
CONFIG_SILENT_CONSOLE=y
CONFIG_SYS_DEVICE_NULLDEV=y
CONFIG_SILENT_CONSOLE_UPDATE_ON_SET=y

# Skip memory test checks on startup
CONFIG_SYS_MEMTEST_START=0x0
CONFIG_SYS_MEMTEST_END=0x0
```

## Step 3 — Stripped Down Linux Kernel Configuration (`.config`)

Remove unused kernel drivers, filesystems, and debug options:

```ini
# Quiet boot logs
CONFIG_CMDLINE="console=null quiet loglevel=0 lpj=3997696"

# Disable printk debugging
# CONFIG_PRINTK is not set
# CONFIG_BUG is not set

# Strip unused filesystems
# CONFIG_EXT2_FS is not set
# CONFIG_NTFS_FS is not set

# Build critical hardware drivers inline (obj-y), NOT as modules (obj-m)
CONFIG_MMC_BLOCK=y
CONFIG_MMC_SDHCI=y
```

## Step 4 — Optimizing Systemd Target Execution (`/etc/systemd/system/app.service`)

Bypass multi-user target setups to launch user application daemons instantly:

```ini
[Unit]
Description=Critical Rear-Camera Display Daemon
DefaultDependencies=no
Conflicts=shutdown.target
After=systemd-modules-load.service

[Service]
Type=simple
ExecStart=/usr/bin/camera_display_daemon
Restart=always
CPUSchedulingPolicy=rr
CPUSchedulingPriority=99

[Install]
WantedBy=sysinit.target
```

Link user daemon directly to `sysinit.target` to execute before network manager daemons boot!

## Final Boot Time Optimization Results

- **U-Boot Execution**: Reduced from 3000ms down to **80ms**.
- **Kernel Decompression**: Reduced from 8200ms down to **320ms**.
- **User Space Execution**: Reduced from 14200ms down to **380ms**.
- **Total Boot Time**: **780 milliseconds**!
