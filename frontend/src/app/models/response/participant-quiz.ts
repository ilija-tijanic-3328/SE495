export interface ParticipantQuiz {
    id: number;
    name: string;
    start_time?: Date;
    quiz: {
        title: string;
        description?: string;
        time_allowed: number;
        start_time: Date;
        end_time: Date;
    }
}
