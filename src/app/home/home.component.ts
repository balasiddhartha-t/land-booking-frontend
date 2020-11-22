import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { RegistrationComponent } from '../registration/registration.component';
import { HttpClient } from '@angular/common/http';

interface Slot{
  slot: number;
  filled: boolean;
  customer: {
    name: string,
    contact: string
  };
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  firstSlot: Array<Slot> = new Array<Slot>(6);
  secondSlot: Array<Slot> = new Array<Slot>(12);
  thirdSlot: Array<Slot> = new Array<Slot>(12);
  fourthSlot: Array<Slot> = new Array<Slot>(12);
  fifthSlot: Array<Slot> = new Array<Slot>(6);

  constructor(public dialog: MatDialog, private http: HttpClient) {}

  async setData(): Promise<void>{
    const data = await this.http.get('https://hacker-housing-backend.herokuapp.com/slots/filled').toPromise();
    (data as any).forEach(ele => {
        console.log(ele);
        if (ele.slotNumber >= 1 && ele.slotNumber <= 6){
          this.firstSlot[ele.slotNumber - 1] = {slot: ele.slotNumber, filled: ele.filled, customer: ele.customer};
        }
        if (ele.slotNumber >= 7 && ele.slotNumber <= 18){
          this.secondSlot[ele.slotNumber - 1 - 6] = {slot: ele.slotNumber, filled: ele.filled, customer: ele.customer};
        }
        if (ele.slotNumber >= 19 && ele.slotNumber <= 30){
          this.thirdSlot[ele.slotNumber - 1 - 18] = {slot: ele.slotNumber, filled: ele.filled, customer: ele.customer};
        }
        if (ele.slotNumber >= 31 && ele.slotNumber <= 42){
          this.fourthSlot[ele.slotNumber - 1 - 30] = {slot: ele.slotNumber, filled: ele.filled, customer: ele.customer};
        }
        if (ele.slotNumber >= 43 && ele.slotNumber <= 48){
          this.fifthSlot[ele.slotNumber - 1 - 42] = {slot: ele.slotNumber, filled: ele.filled, customer: ele.customer};
        }
      });
  }

  async ngOnInit(): Promise<void> {
    for (let i = 0 ; i < 6; i++){
      this.firstSlot[i] = {slot: i + 1 , filled: false, customer: {name: '' , contact: ''}};
      this.fifthSlot[i] = {slot: i + 43 , filled: false,  customer: {name: '' , contact: ''}};
    }
    for (let i = 0 ; i < 12; i++){
      this.secondSlot[i] = {slot: i + 7 , filled: false,  customer: {name: '' , contact: ''}};
      this.thirdSlot[i] = {slot: i + 19 , filled: false,  customer: {name: '' , contact: ''}};
      this.fourthSlot[i] = {slot: i + 30 , filled: false,  customer: {name: '' , contact: ''}};
    }
    await this.setData();
  }

  async onClickPlot(slot: Slot): Promise<void>{
    if (slot.filled) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '500px',
        data: slot.customer
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed filled');
        console.log(result);
      });
    }
    else {
      const dialogRef = this.dialog.open(RegistrationComponent, {
        data: {name: '' , contact: '' , id : slot.slot}
      });

      dialogRef.afterClosed().subscribe(async result => {
        console.log('The dialog was closed not filled');
        console.log(result);
        if (result.name !== '' && result.contact !== ''){
        const data = await this.http.post('https://hacker-housing-backend.herokuapp.com/slots',
         {slotNumber: slot.slot, filled: true, customer: result}).toPromise();
        await this.setData();
        }
      });
    }
  }

}
