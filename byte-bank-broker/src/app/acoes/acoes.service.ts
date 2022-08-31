import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, pluck } from 'rxjs/operators';
import { Acao, Acoes, AcoesAPI } from './modelo/acoes';

@Injectable({
  providedIn: 'root'
})
export class AcoesService {

  constructor(private httpClient: HttpClient) { }

  getAcoes(value?: string) {//? it's to be an optional parameter
    const params = value ? new HttpParams().append('valor', value) : undefined;//'valor' is the parameter name expected in API

    return this.httpClient.get<AcoesAPI>('http://localhost:3000/acoes', {
      params: params//add the optional parameter to filter in the API
    })
      .pipe(
        tap((value) => console.log(value)),//just to show that is returning payload.arrayOfStocks from API
        
        // map(api => api.payload),//extracting the payload to leave just the Stocks array
        // the same effect from the map operator above, but more elegant using pluck operator
        pluck("payload"),

        map(acoes => acoes.sort(
          (acaoA, acaoB) => this.ordenaPorCodigo(acaoA, acaoB)
        )
        )
      );
  }

  private ordenaPorCodigo(acaoA: Acao, acaoB: Acao) {
    if (acaoA.codigo > acaoB.codigo) {
      return 1;
    }
    if (acaoA.codigo < acaoB.codigo) {
      return -1;
    }
    return 0;
  }
}
