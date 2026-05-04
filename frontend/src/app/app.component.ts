import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Items</h1>

    <form (ngSubmit)="addItem()">
      <input
        type="text"
        name="itemName"
        [(ngModel)]="itemName"
        placeholder="Item name"
      />

      <input
        type="number"
        name="itemQuantity"
        [(ngModel)]="itemQuantity"
        placeholder="Quantity"
      />

      <button type="submit">Add Item</button>
    </form>

    <ul>
      <li *ngFor="let item of items">
        {{ item.name }} - {{ item.quantity }}
      </li>
    </ul>
  `
})
export class AppComponent implements OnInit {
  items: any[] = [];

  itemName = '';
  itemQuantity: number | null = null;

  async ngOnInit() {
    await this.loadItems();
  }

  async loadItems() {
    const response = await fetch('http://localhost:3000/api/items');
    this.items = await response.json();
  }

  async addItem() {
    const response = await fetch('http://localhost:3000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.itemName,
        quantity: this.itemQuantity
      })
    });

    const result = await response.json();
    console.log(result);

    this.itemName = '';
    this.itemQuantity = null;

    await this.loadItems();
  }
}