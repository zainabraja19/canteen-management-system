import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.http.get('http://localhost:3000/employee/').subscribe((data) => {
      console.log('Data', data);
    });
  }
}
