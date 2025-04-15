import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatBoxComponent } from './chat-box.component';

@NgModule({
  declarations: [ChatBoxComponent],
  imports: [CommonModule, FormsModule],
  exports: [ChatBoxComponent]
})
export class ChatBoxModule {}