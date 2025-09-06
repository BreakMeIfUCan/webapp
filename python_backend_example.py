# Simple Python Backend for NLP Testing
# This is an example of how your Python backend should be structured

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import asyncio
import httpx
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Request/Response Models
class TestRequest(BaseModel):
    testId: str
    category: str  # 'white' or 'black'
    modelId: Optional[str] = None
    customDatasetPath: Optional[str] = None
    curlEndpoint: Optional[str] = None
    attackCategory: Optional[str] = None

class TestResponse(BaseModel):
    success: bool
    testId: str
    status: str  # 'completed' or 'failed'
    results: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# Webhook URL for updating test status
WEBHOOK_URL = "http://localhost:3000/api/webhooks/test-update"

async def update_test_status(test_id: str, status: str, results: Optional[Dict] = None, error: Optional[str] = None):
    """Update test status via webhook"""
    try:
        async with httpx.AsyncClient() as client:
            payload = {
                "testId": test_id,
                "status": status,
                "results": results,
                "error": error
            }
            response = await client.post(WEBHOOK_URL, json=payload)
            response.raise_for_status()
    except Exception as e:
        print(f"Failed to update test status: {e}")

async def run_white_box_test(test_id: str, model_id: str, dataset_path: str):
    """Simulate white box testing"""
    try:
        # Update status to running
        await update_test_status(test_id, "running", {"progress": 0})
        
        # Simulate processing time
        for progress in [25, 50, 75, 100]:
            await asyncio.sleep(1)  # Simulate work
            await update_test_status(test_id, "running", {"progress": progress})
        
        # Simulate results
        import random
        asr_value = round(random.uniform(0.4, 0.8), 3)  # Random ASR between 40% and 80%
        accuracy_value = round(random.uniform(0.85, 0.95), 3)  # Random accuracy between 85% and 95%
        recall_value = round(random.uniform(0.8, 0.9), 3)  # Random recall between 80% and 90%
        precision_value = round(random.uniform(0.8, 0.9), 3)  # Random precision between 80% and 90%
        f1_value = round((2 * precision_value * recall_value) / (precision_value + recall_value), 3)  # Calculate F1
        
        results = {
            "asr": asr_value,
            "accuracy": accuracy_value,
            "recall": recall_value,
            "precision": precision_value,
            "f1": f1_value
        }
        
        await update_test_status(test_id, "completed", results)
        
    except Exception as e:
        await update_test_status(test_id, "failed", error=str(e))

async def run_black_box_test(test_id: str, curl_endpoint: str, attack_category: str):
    """Simulate black box testing"""
    try:
        # Update status to running
        await update_test_status(test_id, "running", {"progress": 0})
        
        # Simulate processing time
        for progress in [20, 40, 60, 80, 100]:
            await asyncio.sleep(1)  # Simulate work
            await update_test_status(test_id, "running", {"progress": progress})
        
        # Simulate results - only one category ASR since each test is for one category
        import random
        asr_value = round(random.uniform(0.3, 0.9), 3)  # Random ASR between 30% and 90%
        latency_value = round(random.uniform(1.0, 5.0), 2)  # Random latency between 1-5 seconds
        token_usage = random.randint(500, 2000)  # Random token usage
        
        results = {
            "asr": asr_value,
            "latency": latency_value,
            "tokenUsage": token_usage,
            "categoryWiseASR": {
                attack_category: asr_value  # Use the actual attack category from the test
            }
        }
        
        await update_test_status(test_id, "completed", results)
        
    except Exception as e:
        await update_test_status(test_id, "failed", error=str(e))

@app.get("/")
async def root():
    return {"message": "Python Backend is running!", "status": "healthy"}

@app.options("/api/tests/submit")
async def options_submit_test():
    return {"message": "OK"}

@app.options("/api/tests/{test_id}/status")
async def options_test_status(test_id: str):
    return {"message": "OK"}

@app.post("/api/tests/submit")
async def submit_test(request: TestRequest):
    """Submit a new test for processing"""
    try:
        if request.category == "white":
            if not request.modelId or not request.customDatasetPath:
                raise HTTPException(status_code=400, detail="White box tests require modelId and customDatasetPath")
            
            # Start white box test asynchronously
            asyncio.create_task(run_white_box_test(request.testId, request.modelId, request.customDatasetPath))
            
        elif request.category == "black":
            if not request.curlEndpoint or not request.attackCategory:
                raise HTTPException(status_code=400, detail="Black box tests require curlEndpoint and attackCategory")
            
            # Start black box test asynchronously
            asyncio.create_task(run_black_box_test(request.testId, request.curlEndpoint, request.attackCategory))
            
        else:
            raise HTTPException(status_code=400, detail="Invalid category. Must be 'white' or 'black'")
        
        return {"success": True, "message": "Test submitted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tests/{test_id}/status")
async def get_test_status(test_id: str):
    """Get test status (optional endpoint)"""
    # This is optional - the webhook handles status updates
    return {"success": True, "testId": test_id, "status": "running"}

@app.get("/api/models")
async def get_available_models():
    """Get available models for white box testing"""
    models = [
        "gpt-2",
        "bert-base-uncased", 
        "roberta-base",
        "distilbert-base-uncased",
        "t5-small"
    ]
    return {"models": models}

@app.get("/api/attack-categories")
async def get_attack_categories():
    """Get available attack categories for black box testing"""
    categories = [
        "Phishing",
        "Prompt Injection", 
        "Jailbreaking",
        "Data Extraction"
    ]
    return {"categories": categories}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
