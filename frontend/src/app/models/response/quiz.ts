export interface Quiz {
    id?: number;
    title?: string;
    description?: string;
    status?: string;
    time_allowed?: number;
    start_time?: Date;
    end_time?: Date;
    submitted_count?: number;
    participants_count?: number;
}
