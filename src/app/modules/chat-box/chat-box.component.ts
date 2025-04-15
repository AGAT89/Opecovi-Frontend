import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {
  message: string = '';
  messages: any[] = [];
  isLoggedIn = false;
  isChatVisible = false; 
  constructor(private api: ApiService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.checkLoginStatus(); 
    setInterval(() => this.checkLoginStatus(), 1000);
  }
  
  checkLoginStatus(): void {
    const usuario = localStorage.getItem('usuario');
    const wasLoggedIn = this.isLoggedIn;
    this.isLoggedIn = !!usuario;
    
    if (this.isLoggedIn !== wasLoggedIn) {
      this.cd.detectChanges(); 
    }
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
    if (this.isChatVisible) {
      this.getMessages();
    }
  }
  
  sendMessage() {
    if (this.message.trim() === '') return;
    
    const body = { mensaje: this.message };
  
    this.api.consulta('chat/send', 'post', body).subscribe((res) => {
      
      if (res.user_message && res.auto_response && res.auto_response.mensaje) {
        this.messages.push({ mensaje: this.message, isUser: true });
        this.message = '';
        this.messages.push({ mensaje: res.auto_response.mensaje, isUser: false });
        console.log('Mensajes en el array:', this.messages);
      } else {
        console.error('Error en la respuesta del servidor', res);
      }
    });
  }
  
  getMessages() {
    this.api.consulta('chat/messages', 'get').subscribe((res) => {
      if (res.statusCode == 200) {
        this.messages = res.data;
      }
    });
  }
}