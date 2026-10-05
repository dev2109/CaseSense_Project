export interface QAResponse {
    id: string;
    question: string;
    answer: string;
    citations: string[];
}

export interface QuestionRequest {
    question: string;
}
