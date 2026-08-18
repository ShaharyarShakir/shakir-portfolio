---
title: Writing Custom Linux Kernel Drivers for GPIO and Hardware Sensors
date: 2026-08-14
description: Write, compile, and debug custom Loadable Kernel Modules (LKM) in C to handle hardware interrupts, device tree overlays, and sysfs kernel-user interfaces.
tags: [embedded-linux, linux-kernel, driver, c, hardware]
---

## Why Kernel Space Code Matters

User-space applications cannot interact directly with physical memory addresses or CPU hardware interrupts. Operating system hardware drivers execute in **Kernel Space** (Ring 0 privileges), interfacing physical microchip registers with user-space applications via `/dev` character devices or `/sys` filesystem entries.

In this deep dive, we write a custom **Linux Loadable Kernel Module (LKM)** that manages physical hardware GPIO interrupts.

## Kernel-to-User Space Architecture

```
  +------------------------------------------------------------------+
  |                     Linux System Architecture                    |
  |                                                                  |
  |  [ User Space (Ring 3) ]                                         |
  |   C Application / Daemon ── open(), read(), write()              |
  |            |                                                     |
  |     System Call Interface                                        |
  |            v                                                     |
  |  [ Kernel Space (Ring 0) ]                                       |
  |   Custom LKM Driver (`gpio_button_driver.ko`)                    |
  |            ├── Character Device Registration (`/dev/custom_gpio`) |
  |            ├── Hardware Interrupt Handler (IRQ Line)             |
  |            └── Device Tree Binding (`of_match_table`)            |
  |            |                                                     |
  |     Physical Hardware Registers                                  |
  |            v                                                     |
  |  [ Hardware GPIO Pin ] (Physical Interrupt Edge Trigger)         |
  +------------------------------------------------------------------+
```

## Step 1 — Device Tree Overlay (`custom_gpio.dts`)

Describe hardware pin assignments declaratively to the kernel driver:

```dts
/dts-v1/;
/plugin/;

/ {
    compatible = "brcm,bcm2835";

    fragment@0 {
        target = <&gpio>;
        __overlay__ {
            custom_button_pins: custom_button_pins {
                brcm,pins = <23>;     /* GPIO Pin 23 */
                brcm,function = <0>;  /* Input mode */
                brcm,pull = <2>;      /* Pull-up resistor */
            };
        };
    };

    fragment@1 {
        target-path = "/";
        __overlay__ {
            custom_gpio_device {
                compatible = "custom,gpio-interrupt";
                gpios = <&gpio 23 0>;
                status = "okay";
            };
        };
    };
};
```

Compile the device tree overlay into `.dtbo`:

```bash
dtc -I dts -O dtb -o custom_gpio.dtbo custom_gpio.dts
sudo cp custom_gpio.dtbo /boot/overlays/
```

## Step 2 — Custom Linux Kernel Driver (`gpio_driver.c`)

Write a C kernel module handling IRQs and `/dev` file operations:

```c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/gpio/consumer.h>
#include <linux/interrupt.h>
#include <linux/platform_device.h>
#include <linux/uaccess.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Embedded Linux Engineer");
MODULE_DESCRIPTION("Custom GPIO Interrupt Driver");
MODULE_VERSION("1.0");

static int irq_number;
static int button_press_count = 0;
static struct gpio_desc *button_gpio = NULL;

// Hardware Interrupt Handler (Top Half)
static irqreturn_t gpio_irq_handler(int irq, void *dev_id) {
    button_press_count++;
    pr_info("Custom Driver: Hardware Interrupt Triggered! Count: %d\n", button_press_count);
    return IRQ_HANDLED;
}

// User-space read file operation
static ssize_t dev_read(struct file *filep, char __user *buffer, size_t len, loff_t *offset) {
    char msg[64];
    int msg_len;

    if (*offset > 0) return 0;

    msg_len = snprintf(msg, sizeof(msg), "Interrupt Count: %d\n", button_press_count);
    
    if (copy_to_user(buffer, msg, msg_len)) {
        return -EFAULT;
    }

    *offset += msg_len;
    return msg_len;
}

static struct file_operations fops = {
    .owner = THIS_MODULE,
    .read = dev_read,
};

static int custom_gpio_probe(struct platform_device *pdev) {
    int result = 0;
    struct device *dev = &pdev->dev;

    pr_info("Custom Driver: Probing hardware device...\n");

    // Acquire GPIO descriptor from Device Tree
    button_gpio = devm_gpiod_get(dev, NULL, GPIOD_IN);
    if (IS_ERR(button_gpio)) {
        pr_err("Custom Driver: Failed to acquire GPIO pin descriptor\n");
        return PTR_ERR(button_gpio);
    }

    // Map GPIO pin to kernel Interrupt Request (IRQ) number
    irq_number = gpiod_to_irq(button_gpio);
    pr_info("Custom Driver: Mapped GPIO to IRQ line %d\n", irq_number);

    // Request IRQ line (Falling Edge Trigger)
    result = request_irq(irq_number, gpio_irq_handler, IRQF_TRIGGER_FALLING, "custom_gpio_irq", NULL);
    if (result) {
        pr_err("Custom Driver: Cannot request IRQ line %d\n", irq_number);
        return result;
    }

    return 0;
}

static int custom_gpio_remove(struct platform_device *pdev) {
    pr_info("Custom Driver: Cleaning up driver resources...\n");
    free_irq(irq_number, NULL);
    return 0;
}

static const struct of_device_id custom_gpio_of_match[] = {
    { .compatible = "custom,gpio-interrupt", },
    { /* Sentinel */ }
};
MODULE_DEVICE_TABLE(of, custom_gpio_of_match);

static struct platform_driver custom_gpio_driver = {
    .probe = custom_gpio_probe,
    .remove = custom_gpio_remove,
    .driver = {
        .name = "custom_gpio_driver",
        .of_match_table = custom_gpio_of_match,
    },
};

module_platform_driver(custom_gpio_driver);
```

## Step 3 — Module Kernel Makefile (`Makefile`)

Compile the LKM against running kernel headers:

```makefile
obj-m += gpio_driver.o

KDIR ?= /lib/modules/$(shell uname -r)/build

all:
	make -C $(KDIR) M=$(PWD) modules

clean:
	make -C $(KDIR) M=$(PWD) clean
```

## Step 4 — Testing and Debugging Kernel Logs

Load module into the Linux kernel and inspect `dmesg` outputs:

```bash
# Build driver binary
make

# Insert module into running Linux kernel
sudo insmod gpio_driver.ko

# Inspect kernel log buffer
dmesg | tail -n 10

# Test hardware interrupt triggers
cat /proc/interrupts | grep custom_gpio_irq

# Remove module safely
sudo rmmod gpio_driver
```

## Critical Kernel Engineering Rules

1. **Never perform blocking operations inside IRQ handlers**: Keep interrupt routines fast; delegate heavy processing to Kernel Workqueues or Threaded IRQs.
2. **Always check copy_to_user return codes**: Failing to validate memory pointer boundaries causes kernel panics (oops).
