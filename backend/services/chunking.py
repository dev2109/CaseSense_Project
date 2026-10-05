import re
from typing import List

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """
    Splits text into chunks of roughly `chunk_size` characters, with `overlap` characters of overlap.
    A simple approach using character limits, preferring to break at sentence boundaries if possible.
    """
    if not text:
        return []
        
    sentences = re.split(r'(?<=[.!?]) +', text.replace('\n', ' '))
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) < chunk_size:
            current_chunk += sentence + " "
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            # Start new chunk with overlap
            # A simple overlap strategy: take the last few words of the current chunk
            words = current_chunk.split()
            overlap_text = " ".join(words[-max(1, overlap // 5):]) # Roughly 5 chars per word
            current_chunk = overlap_text + " " + sentence + " "
            
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
        
    return chunks
