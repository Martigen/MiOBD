import { reservation } from './reservation';

export class Room {
    _id : string;
    Number : number;
    Size:number;
    NumberOfBeds:number;
    Price:number;
    Vip:boolean;
    Visible:boolean;
    Reservations:reservation[];
}
