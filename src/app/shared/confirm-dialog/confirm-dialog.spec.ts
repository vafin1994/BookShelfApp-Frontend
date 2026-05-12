import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialog } from './confirm-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ConfirmDialog', () => {
  let component: ConfirmDialog;
  let fixture: ComponentFixture<ConfirmDialog>;
  const mockDialogRef = { close: vi.fn() };
  beforeEach(async () => {
    mockDialogRef.close.mockReset();
    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: 'test' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have message from MAT_DIALOG_DATA', () => {
    const el = fixture.nativeElement.querySelector('mat-dialog-content');
    expect(el.textContent.trim()).toBe('test');
  });

  it('should pass true if Confirm button is clicked', () => {
    const onCloseSpy = vi.spyOn(component, 'onClose');
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();
    expect(onCloseSpy).toHaveBeenCalledWith(true);
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should pass false if Cancel button is clicked', () => {
    const onCloseSpy = vi.spyOn(component, 'onClose');
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();
    expect(onCloseSpy).toHaveBeenCalledWith(false);
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
