import Peer, { PeerConstructorOption } from 'skyway-js';
import { GLOBALCONSTANTS } from '../../../constant/GlobalConstants.config';
import { FunctionCall } from '@angular/compiler';
import { publish } from 'rxjs/operators';

export class SkywayStreamerHelper{
    once(arg0: string, arg1: (room: any) => void) {
      throw new Error("Method not implemented.");
    }
    on(arg0: string, arg1: (mediaConnection: any) => void) {
      throw new Error("Method not implemented.");
    }
    call(room: string, stream: any) {
      throw new Error("Method not implemented.");
    }
    private _peer: Peer;
    private _type: SkyWayType;
    private _room: string;
    private _option: PeerConstructorOption;
    private _streamSource: MediaStream;
    // private _viewerSource: MediaStream;

    public get Type(){
        return this._type;
    }  

    public get Room(){
        return this._room;
    }  

    public set Room(val){
        this._room = val;
    }  

    public get Option(){
        return this._option;
    }  

    public set Option(val){
        this._option = val;
    }  

    public get StreamSource(){
        return this._streamSource;
    }  

    public set StreamSource(val){
        this._streamSource = val;
    }  

    // public get ViewerSource(){
    //     return this._viewerSource;
    // }  

    // public set ViewerSource(val){
    //     this._viewerSource = val;
    // } 

    public Streamer: MediaConnectionEx; 
    public Viewer: MediaConnectionEx; 

    constructor(){
        this.Initialize();
    }

    private Initialize(){
        this.Option = {
            key: GLOBALCONSTANTS.SKYWAY_KEY,
            debug: 3
        }
    }

    public Connected(room, type: SkyWayType){
        this.Room = room;
        this._type = type;

        if (!this.Room && !this.Option) return;

        if (this._peer){
            this._peer.disconnect();
            this._peer = null;    
        }

        switch (type) {
            case SkyWayType.Streamer:
                this.openRoom();
                break;
            case SkyWayType.Viewer:
                this.callRoom();
                break;
        }
    }

    private openRoom(){
        this._peer = new Peer(this.Room, this.Option);
      
        this._peer.once('open', this.Streamer.Open);

        // Register callee handler
        this._peer.on('call', mediaConnection => {
            console.log("Streamer is called!");
            mediaConnection.answer(this.StreamSource);
            mediaConnection.on('stream', this.Viewer.Stream.bind(this));
            mediaConnection.once('close', this.Viewer.Close);
        });

        this._peer.on('error', this.Streamer.Error);
    }
    
    private callRoom(){
        this._peer = new Peer(this.Option);
    
        this._peer.once('open', this.Viewer.Open);
        this._peer.once('close', this.Viewer.Close);
    
        setTimeout(this.getStreamer.bind(this), 1000);
      }
    
    private getStreamer(){
        console.log("Viewer call!");
        const mediaConnection = this._peer.call(this.Room, this.StreamSource);
        mediaConnection.on('stream', this.Streamer.Stream);
        mediaConnection.once('close', this.Streamer.Close);

        // mediaConnection.on('stream', async stream => {
        //   // Render remote stream for caller
        //   this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'playsInline', true);
        //   this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'srcObject', stream);
        // });
    
        // mediaConnection.once('close', () => {
        //   this.renderer.setProperty(this.videoStreamerElement.nativeElement, 'srcObject', null);
        // });
      }
}

interface MediaConnectionEx{
    Open(room: string): void;    
    Stream(stream: MediaStream): void;
    Close(): void;
    Error(message?: any, ...optionalParams: any[]): void;
}

export enum SkyWayType {
    Streamer,
    Viewer
}