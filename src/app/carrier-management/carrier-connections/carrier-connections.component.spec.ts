import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierConnectionsComponent } from './carrier-connections.component';

describe('CarrierConnectionsComponent', () => {
  let component: CarrierConnectionsComponent;
  let fixture: ComponentFixture<CarrierConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
