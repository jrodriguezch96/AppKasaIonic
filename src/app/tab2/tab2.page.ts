import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  data: any = {
    power: 0,
    total_kwh: 0,
    err_code: 0
  };
  errorMessage: string = '';

  constructor(private http: HttpClient, private loadingController: LoadingController) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();

    try {
      const response: any = await this.http.get('http://62.171.187.133:5000/get_real_time_data').toPromise();
      this.data = response;
      this.errorMessage = '';
      if (response.err_code !== 0) {
        this.data.power = 0;
        this.data.total_kwh = 0;
        this.errorMessage = 'El dispositivo no están en línea. Por favor, inténtelo más tarde.';
      }
    } catch (error) {
      console.error('Error al obtener los datos', error);
      this.data.power = 0;
      this.data.total_kwh = 0;
      this.errorMessage = 'Error al obtener los datos. El dispositivo no están en línea. Por favor, inténtelo más tarde.';
    } finally {
      await loading.dismiss();
    }
  }

  refreshData() {
    this.loadData();
  }
}
