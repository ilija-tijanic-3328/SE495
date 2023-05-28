export interface AttemptQuestion {
    id: number;
    text: string;
    type: string;
    correct_count: number;
    answers: {
        id: number;
        text: string;
    }[];
}
