import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ObservationComponent } from './observation.component';
import { ExpandableComponent } from 'src/app/components/expandable/expandable.component';
import { ObservationUpdateComponent } from './observation-update/observation-update.component';
import { ObservationEndComponent } from './observation-end/observation-end.component';
import { SharedModule } from 'src/app/components/shared.module';
import { ObservationDiscussionComponent } from './observation-discussion/observation-discussion.component';
import { ObservationTeachingComponent } from './observation-teaching/observation-teaching.component';

const routes: Routes = [
  {
    path: '',
    component: ObservationComponent
  },
  {
    path:'observationDiscussion',
    component:ObservationDiscussionComponent,
  },
  {
    path: 'observationTeaching',
    component: ObservationTeachingComponent
  },
  {
    path: 'updateObservation',
    component: ObservationUpdateComponent
  },
  {
    path: 'endObservation',
    component: ObservationEndComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ObservationComponent,
    ObservationTeachingComponent,
    ObservationDiscussionComponent,
     ObservationEndComponent, 
     ObservationUpdateComponent, 
     ExpandableComponent,
    ],
    exports: [],
    entryComponents: []
})
export class ObservationModule {}
