export interface ParticipantAttempt {
    id: number;
    code: string;
    name: string;
    start_time?: Date;
    end_time?: Date;
    correct_count: number;
    percentage: number;
    total_questions: number;
    duration_seconds: number;
    duration?: Date;
    quiz: {
        id: number;
        title: string;
        description: string;
        time_allowed: number;
        start_time: Date;
        end_time: Date;
    }
}
