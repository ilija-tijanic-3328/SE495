import {ParticipantAttempt} from "./participant-attempt";

export interface Leaderboard {
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
    participants: ParticipantAttempt[];
}
