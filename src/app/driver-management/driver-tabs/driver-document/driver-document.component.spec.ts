import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDocumentComponent } from './driver-document.component';

describe('DriverDocumentComponent', () => {
  let component: DriverDocumentComponent;
  let fixture: ComponentFixture<DriverDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
