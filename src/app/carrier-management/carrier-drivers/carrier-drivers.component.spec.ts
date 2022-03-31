import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierDriversComponent } from './carrier-drivers.component';

describe('CarrierDriversComponent', () => {
  let component: CarrierDriversComponent;
  let fixture: ComponentFixture<CarrierDriversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierDriversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
