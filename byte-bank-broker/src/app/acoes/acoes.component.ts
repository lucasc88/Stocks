import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Acoes } from './modelo/acoes';
import { AcoesService } from './acoes.service';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent implements OnInit, OnDestroy {

  acoesInput = new FormControl();

  // array of stocks and subscription.unsubscribe() were removed to use pipe async
  // stocks: Acoes;
  // private subscription: Subscription;
  stocks$ = this.acoesInput.valueChanges
    .pipe(tap(console.log),
      switchMap(valueTyped => this.stocksService.getAcoes(valueTyped)),
      tap(console.log)
    );

  constructor(private stocksService: AcoesService) { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }
}
