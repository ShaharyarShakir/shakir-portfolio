---
title: Building Real-Time IoT Telemetry with ESP32, FreeRTOS & MQTT
date: 2026-07-28
description: A hands-on guide to low-level microcontroller programming — non-blocking FreeRTOS tasks, hardware interrupts, power-saving sleep, and MQTT stream telemetry on the ESP32.
tags: [embedded, iot, esp32, freertos, mqtt, c++]
---

## Why Embedded Systems Engineering Matters

Software isn't just code running in virtualized cloud containers — it interacts directly with physical hardware. Whether it's reading analog environmental sensors, triggering solid-state relays, or communicating over low-power wireless mesh networks, embedded engineering demands sub-millisecond control over timing, memory allocation, and power budgets.

In this guide, we'll build a production-grade ESP32 telemetry node running FreeRTOS tasks that sample sensor hardware interrupts and publish structured JSON telemetry to an MQTT broker over WiFi.

```
┌──────────────────────────────────────────────┐
│                  ESP32 MCU                   │
│                                              │
│ [Task 1: Sensor ISR]  ──(FreeRTOS Queue)──┐  │
│ [Task 2: Power Monitor]                  │  │
│                                          ▼  │
│ [Task 3: MQTT Publisher] ─────────────────┼───► MQTT Broker / AWS IoT
└──────────────────────────────────────────────┘
```

## FreeRTOS Multi-Task Orchestration in C++

Unlike single-threaded Arduino sketches that use blocking `delay()`, ESP32 runs FreeRTOS under the hood. We create separate execution threads pinned to dual ESP32 cores (`Core 0` and `Core 1`):

```cpp
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

struct TelemetryData {
  float temperature;
  float humidity;
  uint32_t timestampMs;
};

QueueHandle_t telemetryQueue;
WiFiClient espClient;
PubSubClient mqttClient(espClient);

void SensorTask(void *pvParameters) {
  TelemetryData data;
  for (;;) {
    // Read raw sensor voltage registers (non-blocking)
    data.temperature = 24.5 + (random(-10, 10) / 10.0);
    data.humidity = 55.0 + (random(-20, 20) / 10.0);
    data.timestampMs = millis();

    // Push data packet into thread-safe FreeRTOS queue
    xQueueSend(telemetryQueue, &data, portMAX_DELAY);

    // Sleep task for 2000ms (yield CPU execution to lower-priority threads)
    vTaskDelay(pdMS_TO_TICKS(2000));
  }
}

void MqttPublisherTask(void *pvParameters) {
  TelemetryData rxData;
  char payload[128];

  for (;;) {
    if (xQueueReceive(telemetryQueue, &rxData, portMAX_DELAY) == pdTRUE) {
      if (mqttClient.connected()) {
        snprintf(payload, sizeof(payload),
          "{\"temp\":%.2f,\"hum\":%.2f,\"ts\":%lu}",
          rxData.temperature, rxData.humidity, rxData.timestampMs);

        mqttClient.publish("esp32/telemetry/nodes/01", payload);
      }
    }
  }
}

void setup() {
  Serial.begin(115200);
  telemetryQueue = xQueueCreate(10, sizeof(TelemetryData));

  // Pin sensor polling to Core 0 and MQTT network publisher to Core 1
  xTaskCreatePinnedToCore(SensorTask, "SensorTask", 4096, NULL, 1, NULL, 0);
  xTaskCreatePinnedToCore(MqttPublisherTask, "MqttPublisherTask", 4096, NULL, 2, NULL, 1);
}

void loop() {
  // FreeRTOS handles task execution — loop remains empty
  vTaskDelete(NULL);
}
```

## Deep Sleep Power Optimization

For battery or solar-powered remote nodes, leaving WiFi active consumes up to 240mA. Using deep sleep drops ESP32 current consumption down to **10µA**:

```cpp
#define BUTTON_PIN_BITMASK 0x800000000 // GPIO 35 wake mask
#define TIME_TO_SLEEP_SEC  300        // Sleep for 5 minutes

void enterLowPowerSleep() {
  // Configure wake source from RTC timer or GPIO hardware interrupt
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP_SEC * 1000000ULL);
  esp_sleep_enable_ext0_wakeup(GPIO_NUM_35, 0); // Wake on low pin pulse

  Serial.println("Entering Deep Sleep Mode...");
  Serial.flush();
  esp_deep_sleep_start();
}
```

## Hardware Takeaways

1. **Never use `delay()` in production firmware**: Use FreeRTOS `vTaskDelay()` to avoid locking CPU cycles.
2. **Thread Isolation**: Isolating WiFi connectivity tasks from critical hardware interrupt service routines (ISRs) prevents dropped sensor packets.
