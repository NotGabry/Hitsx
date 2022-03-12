import { Document } from 'mongoose';

export interface HitsInterface extends Document {
    ID: string,
    BadgeHits: number
}