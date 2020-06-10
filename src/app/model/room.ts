import { reservation } from './reservation';

export class Room {
    Number : number;
    Size:number;
    NumberOfBeds:number;
    Price:number;
    Vip:boolean;
    Visible:boolean;
    Reservations:reservation[];
}
