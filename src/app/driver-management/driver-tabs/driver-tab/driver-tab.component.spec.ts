import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTabComponent } from './driver-tab.component';

describe('DriverTabComponent', () => {
  let component: DriverTabComponent;
  let fixture: ComponentFixture<DriverTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
