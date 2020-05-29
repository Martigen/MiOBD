import { Address } from './address';
import { Room } from './room';

export class Hotel {
    Type: string;
    Name: string;
    Address: Address;
    Scores: number[];
    Rooms: Room[];
    Extras: string[];
}
