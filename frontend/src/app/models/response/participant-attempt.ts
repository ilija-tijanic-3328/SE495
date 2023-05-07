export interface ParticipantAttempt {
    id: number;
    code: string;
    name: string;
    start_time: Date;
    end_time: Date;
    correct_count: number;
    percentage: number;
    quiz: {
        id: number;
        title: string;
        description: string;
        time_allowed: number;
        start_time: Date;
        end_time: Date;
        total_questions: number;
    }
}
