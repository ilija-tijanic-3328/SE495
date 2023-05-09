import {ParticipantAttempt} from "./participant-attempt";

export interface Leaderboard {
    id?: number;
    title?: string;
    description?: string;
    status?: string;
    time_allowed?: number;
    start_time: Date;
    end_time: Date;
    participants: ParticipantAttempt[];
}
