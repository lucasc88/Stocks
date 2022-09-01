import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AcoesService } from './acoes.service';
import { merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

const TYPING_WAIT = 300;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent implements OnInit, OnDestroy {

  acoesInput = new FormControl();

  allStocks$ = this.stocksService.getAcoes()
    .pipe(
      tap(() => console.log("Initial flow"))
    );

  filterByInput$ = this.acoesInput.valueChanges
    .pipe(
      debounceTime(TYPING_WAIT),
      tap((typed) => console.log("Filtered flow by: " + typed)),
      tap(console.log),
      filter(filterTyped => filterTyped.length >= 3 || !filterTyped.length),
      distinctUntilChanged(),// to avoid request using same words
      switchMap(valueTyped => this.stocksService.getAcoes(valueTyped))
    );

  constructor(private stocksService: AcoesService) { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  // array of stocks and subscription.unsubscribe() were removed to use pipe async
  // stocks: Acoes;
  // private subscription: Subscription;
  // stocks$ = this.acoesInput.valueChanges
  //   .pipe(tap(console.log),
  //     switchMap(valueTyped => this.stocksService.getAcoes(valueTyped)),
  //     tap(console.log)
  //   );

  stocks$ = merge(this.allStocks$, this.filterByInput$);
}
