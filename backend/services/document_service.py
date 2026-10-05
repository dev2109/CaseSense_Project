import io
from pypdf import PdfReader

def extract_text_from_txt(file_bytes: bytes) -> str:
    try:
        return file_bytes.decode('utf-8')
    except UnicodeDecodeError:
        # Fallback if not utf-8
        return file_bytes.decode('latin-1')

def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(file_bytes))
    extracted_text = []
    
    for page in reader.pages:
        text = page.extract_text()
        if text:
            extracted_text.append(text)
            
    full_text = "\n".join(extracted_text).strip()
    
    if not full_text:
        raise ValueError("No selectable text found in PDF. It might be a scanned image.")
        
    return full_text
