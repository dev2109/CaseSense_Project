export interface Document {
    id: string;
    case_id: string;
    filename: string;
    file_type: string;
    status: string; // 'pending', 'processing', 'completed', 'error'
    error_message?: string;
    created_at: string;
}
