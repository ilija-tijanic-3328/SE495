export interface Invitation {
    participant_id: number;
    code: string;
    quiz_title: string;
    quiz_time_allowed: number;
    quiz_start_time: Date;
    quiz_end_time: Date;
    inviter: string;
}
