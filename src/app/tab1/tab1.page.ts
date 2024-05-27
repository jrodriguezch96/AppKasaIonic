import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DatePickerModalComponent } from '../date-picker-modal/date-picker-modal.component';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import * as moment from 'moment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy {
  itemsTable: any = [];
  totalConsumo: number = 0;
  infoMessage: string = '';
  private updateSubscription: Subscription | undefined;
  private fechaDesde: string = '';
  private fechaHasta: string = '';

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private loadingController: LoadingController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    await this.loadStoredDates();
    this.loadData();
    this.infoMessage = 'El listado se recargará cada 10 minutos.';
    this.updateSubscription = interval(600000).subscribe(() => this.loadData()); // 600000 ms = 10 minutes
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  parseNumber(value: string): number {
    if (!value) return 0;
    return parseFloat(value.replace(/,/g, ''));
  }

  calculateTotalConsumo() {
    this.totalConsumo = this.itemsTable.reduce((acc: any, item: any) => acc + this.parseNumber(item.Consumo), 0);
  }

  async loadStoredDates() {
    const storedFechaDesde = await this.storage.get('fechaDesde');
    const storedFechaHasta = await this.storage.get('fechaHasta');
    if (storedFechaDesde && storedFechaHasta) {
      this.fechaDesde = storedFechaDesde;
      this.fechaHasta = storedFechaHasta;
    } else {
      this.setDefaultDates();
    }
  }

  setDefaultDates() {
    const today = moment().format('YYYY-MM-DD');
    const thirtyDaysAgo = moment().subtract(30, 'days').format('YYYY-MM-DD');
    this.fechaHasta = today;
    this.fechaDesde = thirtyDaysAgo;
  }

  async loadData() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();

    try {
      const response: any = await this.http.get(`http://62.171.187.133:5000/get_excel_data?fecha_desde=${this.fechaDesde}&fecha_hasta=${this.fechaHasta}`).toPromise();
      this.itemsTable = response; // Eliminar el primer objeto
      this.calculateTotalConsumo();
    } catch (error) {
      console.error('Error al obtener los datos', error);
      this.itemsTable = [];
      this.totalConsumo = 0;
      this.infoMessage = 'Error al obtener los datos. Por favor, inténtelo más tarde.';
      this.showDetailedError(error);
    } finally {
      await loading.dismiss();
    }
  }

  showDetailedError(error: any) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Error del lado del cliente:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(`Código de error del servidor: ${error.status}\nMensaje: ${error.message}\nDetalles: ${JSON.stringify(error.error)}`);
    }
  }

  async openDatePicker() {
    const modal = await this.modalController.create({
      component: DatePickerModalComponent,
      componentProps: {
        startDate: this.fechaDesde,
        endDate: this.fechaHasta
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.fechaDesde = moment(data.startDate).format('YYYY-MM-DD');
      this.fechaHasta = moment(data.endDate).format('YYYY-MM-DD');
      await this.storage.set('fechaDesde', this.fechaDesde);
      await this.storage.set('fechaHasta', this.fechaHasta);
      this.loadData();
    }
  }
}
