import { Document } from 'mongoose';

export interface HitsInterface extends Document {
    [x: string]: any;
    ID: string,
    BadgeHits: number,
    Verified: boolean
}