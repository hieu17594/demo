import { Component, ElementRef, Renderer2, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { GLOBALCONSTANTS } from '../../../constant/GlobalConstants.config';
import { setTimeout } from 'timers';
import { SkywayStreamerHelper, SkyWayType } from './skyway.helper';

@Component({
  selector: 'ngx-camera',
  templateUrl: './camera.component.html',
  // styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  @Input() room: string;
  @Input() istream: boolean;
  @ViewChild('videoStreamerElement', { static: true }) videoStreamerElement: ElementRef;
  @ViewChild('videoViewerElement', { static: true }) videoViewerElement: ElementRef;
  
  constraints = {
    video: {
      width: { min: 250, ideal: 1000 },
      height: { min: 200, ideal: 800 },
      aspectRatio: { ideal: 1.7777777778 }
    },
    audio: {
      sampleSize: 16,
      channelCount: 2
    }
  };

  peer: SkywayStreamerHelper;
  
  constructor(private renderer: Renderer2) {
    this.InitializeSkyway();
  }

  private InitializeSkyway(){
    this.peer = new SkywayStreamerHelper();
    this.peer.Streamer = {
      Open: this.streamerOpen,
      Stream: this.streamerLive.bind(this),
      Close: this.streamerClose,
      Error: this.streamError
    };

    this.peer.Viewer = {
      Open: this.viewerOpen,
      Stream: this.viewerLive.bind(this),
      Close: this.viewerClose,
      Error: this.viewerError
    };
  }

  private streamerOpen(room: string): void
  {
    console.log("Streamer - Open connect Skyway in room: " + room);
  }

  private streamerLive(stream: MediaStream): void 
  {
    this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'playsInline', true);
    this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'srcObject', stream);
  }

  private streamerClose(): void
  {
    this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'srcObject', null);
  }

  private streamError(message?: any, ...optionalParams: any[]):void{
    console.error(message, optionalParams);
  }

  private viewerOpen(room: string): void{
    console.log("Viewer - Open connect Skyway in room: " + room);
  }

  private viewerLive(stream: MediaStream):void
  {
      this.renderer.setProperty(this.videoViewerElement.nativeElement, 'playsInline', true);
      this.renderer.setProperty(this.videoViewerElement.nativeElement, 'srcObject', stream);
  }

  private viewerClose(): void{
    this.renderer.setProperty(this.videoViewerElement.nativeElement, 'srcObject', null);
  }
  private viewerError(message?: any, ...optionalParams: any[]): void{
    console.error(message, optionalParams);
  }

  ngOnInit() {    
    if(this.room){
      this.startCamera(this.istream);
      console.log("room " + this.room + " , stream  " + this.istream);
      this.peer.Connected(this.room, this.istream ? SkyWayType.Streamer : SkyWayType.Viewer);
    }
  }
  
  // =================== Open Camera =============== //
  startCamera(isStreamer) {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then( stream => {
        this.peer.StreamSource = stream;
        if (isStreamer){
          this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'playsInline', true);
          this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'srcObject', stream);
        }
        else{
          this.renderer.setProperty(this.videoViewerElement.nativeElement, 'playsInline', true);
          this.renderer.setProperty(this.videoViewerElement.nativeElement, 'srcObject', stream);
        }
      }).catch(console.error);
    } else {
      alert('Sorry, camera not available.');
    }
  }
  // ================================================ //
}


// export class CameraComponent {
//   @Input() room: string;
//   @Input() istream: boolean;
//   @ViewChild('videoStreamerElement', { static: true }) videoStreamerElement: ElementRef;
//   @ViewChild('videoViewerElement', { static: true }) videoViewerElement: ElementRef;
  
//   constraints = {
//     video: {
//       width: { min: 250, ideal: 1000 },
//       height: { min: 200, ideal: 800 },
//       aspectRatio: { ideal: 1.7777777778 }
//     },
//     audio: {
//       sampleSize: 16,
//       channelCount: 2
//     }
//   };

//   stream : MediaStream;

//   peer: Peer;

//   constructor(private renderer: Renderer2) {}

//   isPlaying = false;

//   displayControls = true;

//   ngOnInit() {    
//     if(this.room){
//       this.startCamera(this.istream);

//       console.log("room " + this.room + " , stream  " + this.istream);

//       if (this.istream)
//       {
//         this.openRoom();
//       }
//       else{
//         this.callRoom();
//       }
//     }
//   }
  
//   // =================== Open Camera =============== //
//   startCamera(isStreamer) {
//     if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
//       navigator.mediaDevices.getUserMedia(this.constraints).then( stream => {
//         this.stream = stream;
//         if (isStreamer){
//           this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'playsInline', true);
//           this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'srcObject', stream);
//         }
//         else{
//           this.renderer.setProperty(this.videoViewerElement.nativeElement, 'playsInline', true);
//           this.renderer.setProperty(this.videoViewerElement.nativeElement, 'srcObject', stream);
//         }
//       }).catch(console.error);
//     } else {
//       alert('Sorry, camera not available.');
//     }
//   }
//   // ================================================ //

//   openRoom() {
//     this.peer = new Peer(this.room, {
//       key: GLOBALCONSTANTS.SKYWAY_KEY,
//       debug: 3
//     });

//     this.peer.once('open', room => {
//       console.log("Open connect Skyway in room: " + room)
//     });

//     // Register callee handler
//     this.peer.on('call', mediaConnection => {
//       mediaConnection.answer(this.stream);

//       mediaConnection.on('stream', async stream => {
//         // Render remote stream for callee

//         this.renderer.setProperty(this.videoViewerElement.nativeElement, 'playsInline', true);
//         this.renderer.setProperty(this.videoViewerElement.nativeElement, 'srcObject', stream);
//       });

//       mediaConnection.once('close', () => {
//         this.renderer.setProperty(this.videoViewerElement.nativeElement, 'srcObject', null);
//       });

//     });

//     this.peer.on('error', console.error);
//   }

//   callRoom(){
//     this.peer = new Peer({
//       key: GLOBALCONSTANTS.SKYWAY_KEY,
//       debug: 3
//     });

//     this.peer.once('open', room => {
//       console.log("Open connect Skyway in room: " + room)
//     });

//     setTimeout(this.getStreamer.bind(this), 1000);

//     this.peer.once('close', () => {
//       this.renderer.setProperty(this.videoViewerElement.nativeElement, 'srcObject', null);
//     });
//   }

//   getStreamer(){
//     const mediaConnection = this.peer.call(this.room, this.stream);

//     mediaConnection.on('stream', async stream => {
//       // Render remote stream for caller
//       this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'playsInline', true);
//       this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'srcObject', stream);
//     });

//     mediaConnection.once('close', () => {
//       this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'srcObject', null);
//     });
//   }
// }