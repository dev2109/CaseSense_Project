import httpx
import time

API_URL = "http://localhost:8000"

def run_test():
    try:
        # 1. Create a Case
        print("Creating Case...")
        case_resp = httpx.post(f"{API_URL}/cases/", json={"title": "Automated Test Case"})
        case_resp.raise_for_status()
        case_id = case_resp.json()["id"]
        print(f"Case Created: {case_id}")

        # 2. Upload Document
        print("Uploading Document...")
        files = {'file': ('test_doc.txt', b'This is a test document. The secret code is 42.', 'text/plain')}
        doc_resp = httpx.post(f"{API_URL}/cases/{case_id}/documents/", files=files)
        doc_resp.raise_for_status()
        print(f"Document Uploaded: {doc_resp.json()}")

        # 3. Ask Question
        print("Asking Question...")
        qa_resp = httpx.post(f"{API_URL}/cases/{case_id}/qa/", json={"question": "What is the secret code?"})
        qa_resp.raise_for_status()
        print(f"Answer: {qa_resp.json()}")
        print("Test Passed!")

    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    run_test()
