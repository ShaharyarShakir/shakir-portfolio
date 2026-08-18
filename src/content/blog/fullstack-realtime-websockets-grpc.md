---
title: Building Low-Latency Real-Time Dashboards using WebSockets and gRPC
date: 2026-07-16
description: Construct a low-latency live streaming telemetry platform pairing binary gRPC internal microservice streams with WebSocket client broadcast channels.
tags: [fullstack, websockets, grpc, typescript, backend]
---

## Real-Time Architecture Beyond REST Polling

Polling HTTP endpoints every second creates massive server overhead and network congestion. For live financial trading, telemetry dashboards, and collaborative tools, bi-directional streaming protocols are mandatory.

In this architecture, internal backend microservices communicate via high-performance binary **gRPC Streams**, while a Node.js API Gateway translates protocol streams to **WebSockets** for client UI browsers.

## End-to-End System Blueprint

```
 +------------------+           gRPC Stream          +-------------------+
 |  Telemetry Micro | -- (HTTP/2 Protocol Buffers) -> |  WebSocket Gateway|
 |  Service (Go/C++)|                                |  (Node.js / WS)   |
 +------------------+                                +---------+---------+
                                                               |
                                                       WebSocket Binary Frame
                                                               |
                                                               v
                                                     [ Client Web Dashboard ]
```

## Step 1 — Defining Protocol Buffer Schema (`telemetry.proto`)

Define binary serialization schemas with Protocol Buffers v3:

```protobuf
syntax = "proto3";

package telemetry;

option go_package = "github.com/company/telemetry/v1;telemetryv1";

service TelemetryService {
  rpc StreamSensorData (TelemetryRequest) returns (stream TelemetryFrame);
}

message TelemetryRequest {
  string device_id = 1;
  int32 sample_rate_hz = 2;
}

message TelemetryFrame {
  string device_id = 1;
  int64 timestamp_ms = 2;
  double temperature_celsius = 3;
  double pressure_kpa = 4;
  repeated float vibration_axis = 5;
}
```

## Step 2 — High-Throughput WebSocket API Gateway (`gateway.ts`)

Translate incoming gRPC data streams into WebSocket broad-casts:

```typescript
import WebSocket, { WebSocketServer } from 'ws';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Load gRPC Proto definition
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, 'telemetry.proto'),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

// Initialize WebSocket Gateway Server
const wss = new WebSocketServer({ port: 8080 });
console.log('WebSocket Gateway listening on ws://localhost:8080');

wss.on('connection', (ws: WebSocket) => {
  console.log('Client dashboard connected via WebSocket');

  // Initiate gRPC streaming connection to backend service
  const client = new proto.telemetry.TelemetryService(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );

  const grpcStream = client.StreamSensorData({
    device_id: 'turbine-generator-04',
    sample_rate_hz: 60
  });

  // Pipe gRPC frames directly to the connected browser client
  grpcStream.on('data', (frame: any) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        deviceId: frame.device_id,
        timestamp: frame.timestamp_ms,
        temp: frame.temperature_celsius,
        vibration: frame.vibration_axis
      }));
    }
  });

  grpcStream.on('error', (err: any) => {
    console.error('gRPC Stream Error:', err);
    ws.close();
  });

  ws.on('close', () => {
    console.log('Dashboard disconnected; cancelling gRPC stream');
    grpcStream.cancel();
  });
});
```

## Step 3 — Reactive Client Visualization Component

Subscribe to live telemetry streams in client UI applications:

```typescript
export class LiveTelemetryClient {
  private socket: WebSocket | null = null;

  public connect(url: string, onFrameReceived: (data: any) => void) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('Connected to real-time gateway');
    };

    this.socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      onFrameReceived(payload);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.socket.onclose = () => {
      console.log('Connection closed; attempting reconnect in 3s...');
      setTimeout(() => this.connect(url, onFrameReceived), 3000);
    };
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
```

## Architectural Highlights

- **HTTP/2 Multiplexing**: gRPC uses HTTP/2 streams for multi-channel communication over single TCP connections.
- **Compact Payloads**: Protobuf binary framing reduces payload sizes by up to 60% compared to standard JSON serialization over REST.
- **Resource Management**: Closing the client WebSocket automatically propagates stream cancellation to upstream microservices.
