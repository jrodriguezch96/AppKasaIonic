import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-date-picker-modal',
  templateUrl: './date-picker-modal.component.html',
  styleUrls: ['./date-picker-modal.component.scss'],
})
export class DatePickerModalComponent {
  @Input() startDate: string | undefined;
  @Input() endDate: string | undefined;

  constructor(private modalController: ModalController) {}

  dateChanged(type: string, event: any) {
    const selectedDate = event.detail.value;
    if (type === 'start') {
      this.startDate = selectedDate;
    } else {
      this.endDate = selectedDate;
    }
  }

  applyDateRange() {
    if (this.startDate && this.endDate) {
      console.log('Rango de fechas seleccionado:', this.startDate, this.endDate);
      // Aquí puedes enviar los datos al componente padre o realizar cualquier acción
      this.dismiss();
    }
  }

  dismiss() {
    this.modalController.dismiss({
      "startDate": this.startDate,
      "endDate": this.endDate
    });
  }
}
