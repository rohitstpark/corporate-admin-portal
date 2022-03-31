import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverShipmentComponent } from './driver-shipment.component';

describe('DriverShipmentComponent', () => {
  let component: DriverShipmentComponent;
  let fixture: ComponentFixture<DriverShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
