import { Component, OnInit } from '@angular/core';
import {Message} from "primeng";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'ngx-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {
  showMessage: boolean = false;
  message: Message;
  isHiddenSpinner: boolean = true;
  isSuccess: boolean;
  state: any;
  streamId: string;
  isStream: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // this.state = this.router.getCurrentNavigation().extras.state;
    const temp = JSON.stringify(this.state)
  }

  ngOnInit() {
    this.getParam();
    // window.Peer
    // const peerByOption: Peer = new Peer({
    //   key: GLOBALCONSTANTS.SKYWAY_KEY,
    //   debug: 3
    // });
  } 

  getParam() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.streamId = params['id'];
      this.isStream = params['isstream'];
    });
  }

}
