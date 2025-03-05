import { TestBed } from '@angular/core/testing';

import { NotasFiscaisService } from './notas-fiscais.service';

describe('NotasFiscaisService', () => {
  let service: NotasFiscaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotasFiscaisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
