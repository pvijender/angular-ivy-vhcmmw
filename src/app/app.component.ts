import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewContainerRef,
} from '@angular/core';
import { newInstance } from '@jsplumb/browser-ui';
// import { BezierConnector } from '@jsplumb/connector-bezier';
import { AnchorLocations, AnchorSpec } from '@jsplumb/common';

import { DotEndpoint, StraightConnector } from '@jsplumb/core';

import { FlowchartConnector } from '@jsplumb/connector-flowchart';
export interface Node {
  id: string;
  top?: number;
  left?: number;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef;
  instance;
  nodes: Node[] = [];
  constructor() {}
  connectorPaintStyle = {
    strokeWidth: 2,
    stroke: '#61B7CF',
    joinstyle: 'round',
  };
  // .. and this is the hover style.
  connectorHoverStyle = {
    strokeWidth: 3,
    stroke: '#216477',
  };
  endpointHoverStyle = {
    fill: '#216477',
    stroke: '#216477',
  };
  // the definition of source endpoints (the small blue ones)
  sourceEndpoint = {
    endpoint: {
      type: DotEndpoint.type,
      options: { radius: 7, cssClass: 'endpoint' },
    },
    paintStyle: {
      fill: '#7AB02C',
    },
    source: true,
    target: false,
    connector: {
      type: FlowchartConnector.type,
      options: {
        stub: [40, 60],
        gap: 10,
        cornerRadius: 5,
        alwaysRespectStubs: true,
      },
    },
    connectorStyle: this.connectorPaintStyle,
    hoverPaintStyle: this.endpointHoverStyle,
    connectorHoverStyle: this.connectorHoverStyle,
    maxConnections: 4,
    reattach: true,
  };
  // the definition of target endpoints (will appear when the user drags a connection)
  targetEndpoint = {
    endpoint: {
      type: DotEndpoint.type,
      options: { radius: 7, cssClass: 'endpoint' },
    },
    paintStyle: { fill: '#ffcb3a' },
    hoverPaintStyle: this.endpointHoverStyle,
    maxConnections: -1,
    source: false,
    target: true,
  };
  ngOnInit() {
    this.instance = newInstance({
      container: this.wrapper.nativeElement,
    });
  }
  ngAfterViewInit() {
    //
  }
  _addEndpoints(
    id: string,
    sourceAnchors: Array<AnchorSpec>,
    targetAnchors: Array<AnchorSpec>
  ) {
    const element = document.getElementById(id);
    for (let i = 0; i < sourceAnchors.length; i++) {
      const sourceUUID = id + sourceAnchors[i];
      this.instance.addEndpoint(element, this.sourceEndpoint, {
        anchor: sourceAnchors[i],
        uuid: sourceUUID,
      });
    }
    for (let j = 0; j < targetAnchors.length; j++) {
      const targetUUID = id + targetAnchors[j];
      this.instance.addEndpoint(element, this.targetEndpoint, {
        anchor: targetAnchors[j],
        uuid: targetUUID,
      });
    }
  }
  addConnections(id1: string, id2: string) {
    const element1 = document.getElementById(id1);
    const element2 = document.getElementById(id2);
    this.instance.connect({
      source: element1,
      target: element2,
      anchors: ['Right', 'Left'],
      connector: 'Straight',
    });
  }
  addNode() {
    const id = `node${this.nodes.length + 1}`;
    this.nodes.push({ id: id });
    setTimeout(() => this._addEndpoints(id, ['Right'], ['Left']));
  }
  saveConnections() {
    const nodes = Array.from(document.querySelectorAll('.box')).map(
      (node: HTMLDivElement) => {
        return {
          id: node.id,
          top: node.offsetTop,
          left: node.offsetLeft,
        };
      }
    );
    console.log(this.instance.connections);

    const connections = (this.instance.connections as any[]).map((conn) => ({
      uuids: conn.getUuids(),
    }));

    console.log({ nodes, connections });
  }
}
