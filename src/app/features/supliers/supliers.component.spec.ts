import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupliersComponent } from './supliers.component';

describe('SupliersComponent', () => {
  let component: SupliersComponent;
  let fixture: ComponentFixture<SupliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupliersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
