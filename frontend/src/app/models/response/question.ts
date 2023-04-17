import {Answer} from "./answer";

export interface Question {
    id?: number;
    text?: string;
    type?: string;
    order?: number;
    answers?: Answer[];
}
