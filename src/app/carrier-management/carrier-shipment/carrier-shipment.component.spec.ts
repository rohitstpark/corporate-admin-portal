import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierShipmentComponent } from './carrier-shipment.component';

describe('CarrierShipmentComponent', () => {
  let component: CarrierShipmentComponent;
  let fixture: ComponentFixture<CarrierShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
