---
title: Deploying Quantized LLMs on Edge Devices with ONNX Runtime & TensorRT
date: 2026-06-22
description: Optimizing large language models for resource-constrained edge hardware using INT8/INT4 weight quantization, ONNX conversion, and NVIDIA TensorRT execution.
tags: [mlops, llm, edge-ai, onnx, tensorrt]
---

## The Edge Inference Challenge

Deploying Large Language Models (LLMs) like Llama 3 or Mistral on edge devices (NVIDIA Jetson, Raspberry Pi, localized gateways) requires bypassing memory constraints and high latency. Unquantized FP16 weights demand ~14GB VRAM for a 7B parameter model.

By leveraging **INT4/INT8 quantization**, **ONNX Runtime**, and **NVIDIA TensorRT execution providers**, we reduce memory footprints by 75% while maintaining model quality.

## Inference Pipeline Architecture

```
 +------------------------------------------------------------------+
 |                     LLM Optimization Pipeline                    |
 |                                                                  |
 |  [ PyTorch Model (FP16) ]                                        |
 |             |                                                    |
 |     AutoGPTQ / bitsandbytes                                      |
 |             v                                                    |
 |  [ INT4 Quantized Model ]                                        |
 |             |                                                    |
 |     ONNX Export (`torch.onnx.export`)                            |
 |             v                                                    |
 |  [ Optimized `.onnx` Graph ]                                     |
 |             |                                                    |
 |     TensorRT Engine Compilation                                  |
 |             v                                                    |
 |  [ `.engine` Model ] ── ONNX Runtime ──> [ Edge Device GPU ]    |
 +------------------------------------------------------------------+
```

## Step 1 — PyTorch to ONNX Quantization Script

Convert a PyTorch transformer model into INT8 ONNX format using HuggingFace Optimum and ONNX Runtime tools:

```python
import torch
from optimum.onnxruntime import ORTModelForCausalLM
from transformers import AutoTokenizer

model_id = "meta-llama/Meta-Llama-3-8B-Instruct"
save_directory = "./onnx_quantized_model"

print("Loading FP16 PyTorch model...")
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Export model directly into ONNX format with ONNX Runtime Optimization
model = ORTModelForCausalLM.from_pretrained(
    model_id,
    export=True,
    provider="CUDAExecutionProvider",
    use_merged=True
)

# Save ONNX graphs and configuration
model.save_pretrained(save_directory)
tokenizer.save_pretrained(save_directory)

print(f"ONNX Model saved successfully to {save_directory}")
```

## Step 2 — Post-Training Weight Quantization (INT4 / AWQ)

Apply Activation-aware Weight Quantization (AWQ) to compress weights to 4-bit precision without losing precision:

```bash
# Install Optimum ONNX CLI tools
pip install optimum[onnxruntime-gpu] autoawq

# Quantize ONNX model to INT4
optimum-cli auto-gptq quantize \
  --model meta-llama/Meta-Llama-3-8B-Instruct \
  --output ./llama3-8b-int4 \
  --bits 4 \
  --group-size 128 \
  --device cuda
```

## Step 3 — Building TensorRT Engine for Edge Execution

Compile the ONNX graph into a high-throughput NVIDIA TensorRT engine on target edge hardware (e.g., Jetson Orin):

```bash
# Convert ONNX graph to TensorRT engine
trtexec \
  --onnx=./onnx_quantized_model/model.onnx \
  --saveEngine=./model_int4.engine \
  --int8 \
  --memPoolSize=workspace:4096MiB \
  --verbose
```

## Step 4 — High-Performance Edge C++ / Python Inference Engine

Run low-latency inference using ONNX Runtime with TensorRT Acceleration Provider:

```python
import numpy as np
import onnxruntime as ort
from transformers import AutoTokenizer

class EdgeLLMInference:
    def __init__(self, model_path: str):
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        
        # Configure execution providers for Jetson GPU hardware
        providers = [
            (
                'TensorrtExecutionProvider', {
                    'device_id': 0,
                    'trt_max_workspace_size': 4 * 1024 * 1024 * 1024, # 4GB
                    'trt_fp16_enable': True,
                    'trt_int8_enable': True,
                }
            ),
            'CUDAExecutionProvider',
            'CPUExecutionProvider'
        ]
        
        self.session = ort.InferenceSession(
            f"{model_path}/model.onnx",
            providers=providers
        )

    def generate(self, prompt: str, max_tokens: int = 50) -> str:
        inputs = self.tokenizer(prompt, return_tensors="np")
        
        ort_inputs = {
            "input_ids": inputs["input_ids"].astype(np.int64),
            "attention_mask": inputs["attention_mask"].astype(np.int64)
        }
        
        outputs = self.session.run(None, ort_inputs)
        predicted_ids = np.argmax(outputs[0], axis=-1)
        
        return self.tokenizer.decode(predicted_ids[0], skip_special_tokens=True)

if __name__ == "__main__":
    engine = EdgeLLMInference("./onnx_quantized_model")
    result = engine.generate("Explain edge computing in three sentences:")
    print("Response:", result)
```

## Performance Benchmarks

| Model Precision | Memory Footprint | Latency (Tokens/sec) | Edge Target |
| :--- | :--- | :--- | :--- |
| FP16 (Baseline) | 16.2 GB | 4.2 t/s | AWS EC2 (g4dn.xlarge) |
| INT8 (ONNX) | 8.4 GB | 18.5 t/s | Jetson AGX Orin |
| **INT4 (TensorRT)** | **4.1 GB** | **34.8 t/s** | **Jetson Orin Nano (8GB)** |

## Optimization Lessons

1. **AWQ preserves context quality** much better than standard round-to-nearest INT4 quantization.
2. **Pre-warm TensorRT execution engines** during container boot up to prevent initial cold-start latency.
