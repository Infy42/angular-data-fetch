import { HttpClient } from '@angular/common/http';
import { Component, NgModuleFactory } from '@angular/core';
import { Chart } from 'chart.js';

export interface EmployeeInfo {
  EmployeeName: string;
  StarTimeUtc: Date;
  EndTimeUtc: Date;
}

export interface EmployeeHours {
  EmployeeName: string;
  TotalHours: number;
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent {
  employeeHours: EmployeeHours[] = [];
  ctx: any;
  config: any;
  chartData: number[] = [];
  chartDatalabels: any[] = [];

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    const url = 'site.com{key}';
    const employees = await this.http.get<EmployeeInfo[]>(url).toPromise();

    if (employees?.length) {
      this.employeeHours = employees.reduce((acc: EmployeeHours[], cur) => {
        const existingEmployee = acc.find(e => e.EmployeeName === cur.EmployeeName);
        const startTimeUtc = new Date(cur.StarTimeUtc);
        const endTimeUtc = new Date(cur.EndTimeUtc);
        const durationMs = endTimeUtc.getTime() - startTimeUtc.getTime();
        const durationHours = durationMs / (1000 * 60 * 60)

        if (existingEmployee) {
          existingEmployee.TotalHours += durationHours;
        } else {
          acc.push({
            EmployeeName: cur.EmployeeName,
            TotalHours: durationHours
          });
        }
        return acc;
      }, []);

      const sortedEmployeeHours = this.employeeHours.sort((a, b) => b.TotalHours - a.TotalHours);

      this.employeeHours = sortedEmployeeHours.map((employee) => ({
        EmployeeName: employee.EmployeeName,
        TotalHours: parseInt(Math.trunc(employee.TotalHours).toString(), 10)
      }));

      this.employeeHours.forEach(hour => {
        this.chartData.push(hour.TotalHours);
      });

      this.employeeHours.forEach(hour => {
        this.chartDatalabels.push(hour.EmployeeName);
      });
    }

    this.ctx = document.getElementById('myChart');
    this.config = {
      type: 'pie',
      options: {
        responsive: false,
        aspectRatio: 0.7
      },
      data: {
        labels: this.chartDatalabels,
        datasets: [{
          label: 'Chart Data',
          data: this.chartData,
          borderColor: 'grey',
          backgroundColor: ['pink', 'yellow', 'red', "cyan", "green", "blue", "orange", "maroon", "turqiouse", "purple", "charcoal", "gray"]
        }],
      }
    }

    const myChart = new Chart(this.ctx, this.config);
  }
}
