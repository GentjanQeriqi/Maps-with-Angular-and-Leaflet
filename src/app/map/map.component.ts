import { HostListener } from '@angular/core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import "leaflet/dist/images/marker-icon-2x.png";
import { MatDialog } from '@angular/material/dialog';
import { ShapeService } from '../shape.service';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnInit {

  private map;
  private states;
  private propertieOfFeature = null;
  constructor(private shapeService: ShapeService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initMap();
    this.propertieOfFeature = null;
  }

  ngAfterViewInit(): void {

    this.shapeService.getStateShapes().subscribe(states => {
      this.states = states;
      this.initStatesLayer();
    })

  }



  private initStatesLayer() {

    const stateLayer = L.geoJSON(this.states, {
      style: (feature) => ({
        weight: 0.5,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      }),
      onEachFeature: (feature, layer) => (
        this.colorLayer(layer),
        layer.on({
          mouseover: (e) => this.highlightFeature(e),
          mouseout: (e) => this.resetFeature(e),
          click: (e) => this.showClickPopup(e)
        })
      )
    });
    this.map.addLayer(stateLayer);
  }

  colorLayer(layer) {
    const short = layer.feature.properties;

    if (short.SV_Index2 >= 0 && short.SV_Index2 < 0.1) {
      layer.setStyle({
        color: 'white',
        fillColor: '#a90024'
      });

    } else if (short.SV_Index2 >= 0.1 && short.SV_Index2 < 0.2) {
      layer.setStyle({
        color: 'white',
        fillColor: '#d52f26'
      });

    } else if (short.SV_Index2 >= 0.2 && short.SV_Index2 < 0.3) {
      layer.setStyle({
        color: 'white',
        fillColor: '#e76b43'
      });

    } else if (short.SV_Index2 >= 0.3 && short.SV_Index2 < 0.4) {
      layer.setStyle({
        color: 'white',
        fillColor: '#f4aa5f'
      });

    } else if (short.SV_Index2 >= 0.4 && short.SV_Index2 < 0.5) {
      layer.setStyle({
        color: 'white',
        fillColor: '#ffe590'
      });

    } else if (short.SV_Index2 >= 0.5 && short.SV_Index2 < 0.6) {
      layer.setStyle({
        color: 'white',
        fillColor: '#ddf38f'
      });

    } else if (short.SV_Index2 >= 0.6 && short.SV_Index2 < 0.7) {
      layer.setStyle({
      
        fillColor: 'white',
        weight: 2,
        opacity: 1,
        color: 'white',
       	dashArray: '3',
      	fillOpacity: 0.7
      });
    } else if (short.SV_Index2 >= 0.7 && short.SV_Index2 < 0.8) {
      layer.setStyle({
        color: 'white',
        fillColor: '#64bb61'
      });
    } else if (short.SV_Index2 >= 0.8 && short.SV_Index2 < 0.9) {
      layer.setStyle({
        color: 'white',
        fillColor: '#14934c'
      });
    } else if (short.SV_Index2 >= 0.9 && short.SV_Index2 < 1) {
      layer.setStyle({
        color: 'white',
        fillColor: '#006531'
      });
    }
  }
  highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
      weight: 1,
      opacity: 1.0,
      // color: '#DFA612',
      // fillOpacity: 1.0,
      // fillColor: '#FAE042',
    });
  

 
    const short = layer.feature.properties;
    layer
      .bindPopup(
        `<center>
      <p>
      COUNTRY<br>
      <strong>${short.County}</strong><br><br>
      NAMELSAD10<br>
      <strong>${short.NAMELSAD10}</strong><br><br>
      REGION<br>
      <strong>${short.Region}</strong><br><br>
      SV_Index2<br>
      <strong>${short.SV_Index2}</strong><br>
      </p>
      </center>`
      ).openPopup();

  }
  showClickPopup(e) {
    this.propertieOfFeature = null;
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      opacity: 1.0
    });
    this.propertieOfFeature = layer.feature.properties;

    const content = `<div style="overflow: scroll; height: 250px; width:200px" >
  <center>
  <button style="background-color: blue; color:white;" class="chartbutton" id="btn-id">ShowChart</button>
  
    <p>
    COUNTRY<br>
    <strong>${this.propertieOfFeature.County}</strong><br><br>
    NAMELSAD10<br>
    <strong>${this.propertieOfFeature.NAMELSAD10}</strong><br><br>
    REGION<br>
    <strong>${this.propertieOfFeature.Region}</strong><br><br>
    SV_Index2<br>
    <strong>${this.propertieOfFeature.SV_Index2}</strong><br>
    </p>EMPLOYMENT<br>
    <strong>${this.propertieOfFeature.Employment}</strong><br>
    </p>RENTERS<br>
    <strong>${this.propertieOfFeature.Renters}</strong><br>
    </p>MINORITY<br>
    <strong>${this.propertieOfFeature.Minority}</strong><br>
    </center>
  </div>`;
    layer.bindPopup(content);
  }
  @HostListener('document: click', ['$event'])
  openClickEvent(event: MouseEvent) {
    let target = event.target || event.srcElement;
    let id = target['id'];
    if (id === 'btn-id') {
      this.openChart(this.propertieOfFeature);
    }
  }

  openChart(properties) {
    this.dialog.open(ChartComponent, {
      data: { propertieOfLayer: properties }
    });
  }
  resetFeature(e) {
    const layer = e.target;
    layer.setStyle({
      weight: 1,
      opacity: 0.5,

    });
  }
  private initMap(): void {
    this.map = L.map('map', { center: [40.71274, -74.005974], zoom: 10 });
  const tiles =  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2VudDE5OXgiLCJhIjoiY2tmZjN6ZTV3MDhvYjJ4bDRhcHZkNW5jcSJ9.l3k3oec8LCYglS5r5L4SFw", {
			id: 'mapbox/streets-v10',
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    });
    tiles.addTo(this.map);

    let legend = new L.Control({ position: 'bottomright' });
    legend.onAdd = (infoLegend) => {
      let div = L.DomUtil.create('div', 'info-legend'),
        svIndexGrades = ['0-0.1', '0.1-0.2', '0.2-0.3', '0.3-0.4', '0.4-0.5', '0.5-0.6', '0.6-0.7', '0.7-0.8', '0.9-1'],
        labels = ['<strong>Legend</strong>'],
        color = '#008010';
      console.log(svIndexGrades);
      for (let i = 0; i < svIndexGrades.length; i++) {
        color = this.getColor(svIndexGrades[i]);
        div.innerHTML += labels.push('<i style="height: 10px; width:10px; border-radius: 50%; display: inline-block; background:' + color + '"></i> ' +
          (svIndexGrades[i] ? svIndexGrades[i] : '+'));
      }
      div.innerHTML = labels.join('<br>');
      return div;

    }
    legend.addTo(this.map);

  }
  getColor(interval) {
    let color = null;
    if (interval !== null) {
      if (interval === '0-0.1') {
        color = "#a90024";
      }
      if (interval === '0.1-0.2') {
        color = "#d52f26";
      }
      if (interval === '0.2-0.3') {
        color = "#e76b43";
      }
      if (interval === '0.3-0.4') {
        color = "#f4aa5f";
      }
      if (interval === '0.4-0.5') {
        color = "#ffe590";
      }
      if (interval === '0.5-0.6') {
        color = "#ddf38f";
      }
      if (interval === '0.6-0.7') {
        color = "#a6da69";
      }
      if (interval === '0.7-0.8') {
        color = "#64bb61";
      }
      if (interval === '0.8-0.9') {
        color = "#14934c";
      }
      if (interval === '0.9-1') {
        color = "#006531";
      }
    }
    return color;
  }
}
