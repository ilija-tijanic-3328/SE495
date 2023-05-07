export interface AttemptQuestion {
    id: number;
    text: string;
    type: string;
    answers: {
        id: number;
        text: string;
    }[];
}
