import { Address } from './address';
import { Room } from './room';
import {Score} from "./score";

export class Hotel {
    _id: string;
    User: string;
    Type: string;
    Name: string;
    Stars: string;
    Region: string;
    Accepted: boolean;
    Address: Address;
    Scores: Score[];
    Rooms: Room[];
    Extras: string[];
    Images: string[];
    Views:number;
}
