# AI Under Attack Web Application
**GDG Bit n Build 2025**  

A web platform to **identify, demonstrate, and defend against vulnerabilities in AI models**. This project targets both NLP and Vision AI systems under multiple threat models, allowing users to simulate attacks, evaluate model robustness, and apply defenses.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Supported Modalities & Threat Models](#supported-modalities--threat-models)
- [Attack Techniques](#attack-techniques)
- [Evaluation Metrics](#evaluation-metrics)
- [Defense Techniques](#defense-techniques)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Ownership](#ownership)
- [Future Work](#future-work)
- [License](#license)

---

## Project Overview
Modern AI systems are vulnerable to subtle attacks that can compromise their accuracy, leak sensitive data, or manipulate outputs.  
This platform provides a **unified interface** for testing AI model security in a controlled environment:

1. **Identify**: Scan models/datasets for risks (bias, leakage, backdoors).  
2. **Demonstrate**: Run reproducible attacks like adversarial perturbations, poisoning, and prompt injections.  
3. **Defend**: Apply pluggable defenses to improve model robustness.

---

## Features
- Support for **NLP (LLMs)** and **Vision (CNNs, ResNet, etc.)** models.  
- Threat model selection: **White-box**, **Gray-box**, and **Black-box** attacks.  
- User-friendly interface to:
  - Select attack type and setup (model/dataset/API)  
  - Execute attack suite  
  - Generate evaluation reports  
  - Apply defense mechanisms where permitted  

---

## Supported Modalities & Threat Models

| Modality | Threat Model | Access | Attack Techniques |
|----------|--------------|--------|-----------------|
| Vision   | White-box    | Model weights, architecture | FGSM, PGD, Carlini-Wagner |
| Vision   | Gray-box     | Training pipeline | Data poisoning, backdoor injection |
| NLP      | Black-box    | API only | Jailbreaks, prompt-injection via external context |
| NLP      | White-box    | Model weights, dataset | Label-flip poisoning, meta-prompt attacks |

---

## Attack Techniques

### Vision
- **FGSM** (Fast Gradient Sign Method)  
- **PGD** (Projected Gradient Descent)  
- **Backdoor Trigger Injection**

### NLP
- **Label-flip poisoning**  
- **Jailbreak prompts**  
- **Prompt-injection via RAG or external tools**

---

## Evaluation Metrics
- **Attack Success Rate (ASR)**: % of inputs where attack flips model decision  
- **Robust Accuracy**: Accuracy on attacked inputs  
- **‖δ‖∞ (Perceptibility)**: Visual perturbation budget for adversarial images  
- **Leakage Rate (LLM)**: Secrets/instructions leaked per 100 trials  
- **Backdoor Trigger Success**: Targeted misclassification rate when trigger is present

---

## Defense Techniques

### Vision
- **Adversarial Training** (train-time)  
- **Random Resize + Crop** (inference-time)  
- **Confidence Thresholding** (post-predict)

### NLP / RAG
- **sanitize_text** (inference-time)  
- **Meta-prompt wrapper** (inference-time)  
- **Content-hash allowlist** (retrieval-time)

---

## Architecture

- **Frontend**: Attack selection, model/dataset setup, defense application, evaluation display.  
- **Backend**: Executes attacks, computes evaluation metrics, applies defenses.  
- **AI Models**: Pretrained NLP and Vision models ready for white/gray/black-box testing.  

---

## Getting Started

### Prerequisites
- Node.js 20+  
- Python 3.11+  
- Conda or virtualenv (recommended)  
- Docker (optional, for containerized model deployment)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/<your-org>/ai-under-attack.git
cd ai-under-attack
````

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

4. Run the application:

```bash
# Backend
uvicorn main:app --reload

# Frontend
npm run dev
```

5. Open `http://localhost:3000` in your browser.

---

## Usage

1. Select modality: **NLP** or **Vision**.
2. Choose threat model: **White**, **Gray**, or **Black**.
3. Select attack technique and configure model/dataset/API.
4. Run attack suite and view evaluation metrics.
5. Apply defense mechanisms (if allowed by threat model).
6. Compare pre/post-defense performance.

---

## Ownership

* **NLP Attacks**: Glen
* **Vision Attacks**: Vidya (primary), Glen (support)
* **Evaluation Metrics**: Vipin (primary), Glen (support)
* **End-to-End Web Application (UI + Backend)**: Vijay (primary), Vipin (support)

---

## Future Work

* Support more NLP and Vision attack techniques.
* Expand gray-box and black-box defenses.
* Integrate RAG-based prompt evaluation for LLMs.
* Real-time visualization of adversarial perturbations.

---

## License

MIT License © 2025 GDG Bit n Build Team
