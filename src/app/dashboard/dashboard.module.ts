import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from './dashboard.component';

/** Import any ng-zorro components as the module required except icon module */
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ThemeConstantService } from '../shared/services/theme-constant.service';
import { AppsService } from '../shared/services/apps.service';
import { TableService } from '../shared/services/table.service';

/** Assign all ng-zorro modules to this array*/
const antdModule = [
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzDropDownModule,
    NzSelectModule,
    NzTableModule
]

@NgModule({
    imports: [
        SharedModule,
        DashboardRoutingModule,
        ...antdModule
    ],
    exports: [],
    declarations: [
        DashboardComponent
    ],
    providers: [
      ThemeConstantService,
      AppsService,
      TableService
  ]
})
export class DashboardModule { }
