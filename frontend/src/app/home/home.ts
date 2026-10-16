import { Component } from '@angular/core';
import { CardModule } from "primeng/card";
import { Button } from "primeng/button";

@Component({
  selector: 'app-home',
  imports: [CardModule, Button],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
