export interface QuizStats {
    id: number;
    title: string;
    user_id: number;
    description?: string;
    status: string;
    time_allowed: number;
    start_time: Date;
    end_time: Date;
    configs: {
        config: string;
        value: string;
    }[];
    stats: {
        quiz_scores: { label: string, value: number }[],
        question_completion: { label: string, value: number }[]
    }
}
