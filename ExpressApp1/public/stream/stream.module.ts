import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamComponent } from './stream.component';
import { CameraComponent } from './camera/camera.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [StreamComponent, CameraComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    TranslateModule
  ]
})
export class StreamModule { }
