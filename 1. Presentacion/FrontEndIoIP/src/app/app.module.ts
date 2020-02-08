import { DialogService } from 'src/app/_services/dialog.service';
import { GestionCiudadComponent } from './componentes-prueba/gestion-ciudad/gestion-ciudad.component';
import { GestionDepartamentoComponent } from './componentes-prueba/gestion-departamento/gestion-departamento.component';
import { PaisComponent } from './componentes-prueba/pais/pais.component';
import { DepartamentoComponent } from './componentes-prueba/departamento/departamento.component';
import { CiudadComponent } from './componentes-prueba/ciudad/ciudad.component';
// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// // Material
import * as Material from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatExpansionModule } from '@angular/material/expansion';

// Externals
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';
import { appRoutes } from './routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// // Guards
import { CanDeactivateGuard } from './_guards/CanDeactivate.guard';

// // Components
import { AppComponent } from './app.component';
import { NavLeftComponent } from './arquitectura/nav-left/nav-left.component';
import { NavComponent } from './arquitectura/nav/nav.component';
import { FooterComponent } from './arquitectura/footer/footer.component';
import { Error404Component } from './componentes-prueba/error404/error404.component';
import { CiudadService } from './_services/ciudad.service';
import { DepartamentoService } from './_services/departamento.service';

// External
// // loading block screen
import { NgxLoadingModule } from 'ngx-loading';
// // drop down menu
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// // tooltip
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DashboardComponent } from './componentes-prueba/dashboard/dashboard.component';



@NgModule({

    declarations: [
        DashboardComponent,
        AppComponent,
        NavComponent,
        NavLeftComponent,
        FooterComponent,
        Error404Component,
        CiudadComponent,
        DepartamentoComponent,
        PaisComponent,
        DashboardComponent,
        GestionDepartamentoComponent,
        GestionCiudadComponent
    ],
    entryComponents: [
    ],
    imports: [
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy:
                //PreloadAllModules, //
                NoPreloading,
            scrollPositionRestoration: 'enabled'
        }),
        // Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),

        // // Material
        Material.MatButtonToggleModule,
        Material.MatSnackBarModule,
        Material.MatTooltipModule,
        Material.MatSliderModule,
        Material.MatToolbarModule,
        Material.MatGridListModule,
        Material.MatFormFieldModule,
        Material.MatInputModule,
        Material.MatRadioModule,
        Material.MatSelectModule,
        Material.MatCheckboxModule,
        Material.MatDatepickerModule,
        Material.MatNativeDateModule,
        Material.MatButtonModule,
        Material.MatTableModule,
        Material.MatIconModule,
        Material.MatPaginatorModule,
        Material.MatSortModule,
        Material.MatDialogModule,
        Material.MatCardModule,
        Material.MatSidenavModule,
        Material.MatTabsModule,
        Material.MatDividerModule,
        Material.MatSlideToggleModule,
        Material.MatMenuModule,
        NgxMaterialTimepickerModule,
        Material.MatBadgeModule,
        MatExpansionModule,
        Material.MatAutocompleteModule,

        // Externals
        NgxLoadingModule.forRoot({}),
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
    ],
    exports: [
        RouterModule,
        BrowserAnimationsModule,
        // Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // Modulos
        Material.MatButtonToggleModule,
        Material.MatSnackBarModule,
        Material.MatTooltipModule,
        Material.MatSliderModule,
        Material.MatToolbarModule,
        Material.MatGridListModule,
        Material.MatFormFieldModule,
        Material.MatInputModule,
        Material.MatRadioModule,
        Material.MatSelectModule,
        Material.MatCheckboxModule,
        Material.MatDatepickerModule,
        Material.MatNativeDateModule,
        Material.MatButtonModule,
        Material.MatTableModule,
        Material.MatIconModule,
        Material.MatPaginatorModule,
        Material.MatSortModule,
        Material.MatDialogModule,
        Material.MatCardModule,
        Material.MatSidenavModule,
        Material.MatTabsModule,
        Material.MatDividerModule,
        Material.MatSlideToggleModule,
        Material.MatMenuModule,
        NgxMaterialTimepickerModule,
        Material.MatBadgeModule,
        MatExpansionModule,
        Material.MatAutocompleteModule,

        // Externals
        NgxLoadingModule,
        BsDropdownModule,
        TooltipModule,
    ],
    providers: [
        CanDeactivateGuard,
        CiudadService,
        DepartamentoService,
        DialogService
    ],
    bootstrap: [AppComponent],
})

export class AppModule { }
