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
  private previousLoginStatus = false;

  constructor(
    private api: ApiService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    setInterval(() => this.checkLoginStatus(), 1000);
  }

  checkLoginStatus(): void {
    const usuario = localStorage.getItem('usuario');
    const currentlyLoggedIn = !!usuario;

    // Detecta cambio de estado de login
    if (currentlyLoggedIn !== this.previousLoginStatus) {
      this.isLoggedIn = currentlyLoggedIn;
      this.previousLoginStatus = currentlyLoggedIn;

      // Si se logueó, se reinicia el chat
      if (this.isLoggedIn) {
        this.resetChat();
      }

      this.cd.detectChanges();
    }
  }

  toggleChat(): void {
    this.isChatVisible = !this.isChatVisible;
  
    if (this.isChatVisible) {
      this.getMessages();
    } else {
      const usuario = JSON.parse(localStorage.getItem('usuario')!);
      this.api.consulta('chat/delete', 'post', { id_usuario: usuario?.id_usuario }).subscribe(() => {
        this.messages = [];
      });
    }
  }

  sendMessage(): void {
    const trimmedMessage = this.message.trim();
    if (!trimmedMessage) return;

    const usuario = JSON.parse(localStorage.getItem('usuario')!);
    const body = {
      mensaje: trimmedMessage,
      id_usuario: usuario?.id_usuario || null
    };

    this.api.consulta('chat/send', 'post', body).subscribe((res) => {
      if (res.user_message && res.auto_response?.mensaje) {
        this.messages.push({ mensaje: trimmedMessage, isUser: true });
        this.messages.push({ mensaje: res.auto_response.mensaje, isUser: false });
        this.message = '';
      } else {
        console.error('Error en la respuesta del servidor', res);
      }
    });
  }



  

  getMessages(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario')!);
    if (usuario) {
      this.api.consulta('chat/messages', 'get', { id_usuario: usuario.id_usuario }).subscribe((res) => {
        if (res.statusCode === 200) {
          this.messages = res.data;
        }
      });
    }
  }

  private resetChat(): void {
    this.messages = [];
    this.addBotMessage('Hola, ¿qué producto deseas buscar?');
  }

  private addBotMessage(text: string): void {
    this.messages.push({ mensaje: text, isUser: false });
  }
}
