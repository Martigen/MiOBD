import { Address } from './address';
import { Room } from './room';

export class Hotel {
    _id: string;
    User: string;
    Type: string;
    Name: string;
    Stars: string;
    Region: string;
    Address: Address;
    Scores: number[];
    Rooms: Room[];
    Extras: string[];
    Images: string[];
    Views:number;
}
