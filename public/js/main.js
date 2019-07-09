function appendWidget(widget) {
  let widgetDiv = document.createElement('div');
  widgetDiv.id = widget['_id']['$oid'];
  widgetDiv.className = 'widget-card';
  widgetDiv.innerHTML = createWidget[widget.type](widget);
  widgetDiv.append(deleteWidgetButton());
  let vueApp = document.getElementById('savedWidgets');
  vueApp.insertBefore(widgetDiv, vueApp.firstChild);
}

function deleteWidgetButton() {
  let deleteDiv = document.createElement('div');
  deleteDiv.innerHTML = 'x';
  deleteDiv.className ='deleteWidget btn btn-outline-danger';
  deleteDiv.addEventListener('click', function() {
    let widget = this.parentElement;
    let params = {};
    params._id = widget.id;
    params['csrf_name'] = document.querySelector('input[name=csrf_name]').value;;
    params['csrf_value'] = document.querySelector('input[name=csrf_value]').value;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './widget-remove', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let response = JSON.parse(this.response); // parse response
        // update cfsr
        if (response.cfsr && response.cfsr.field) document.getElementById('csfr').innerHTML = response.cfsr.field;
        // Remove the widget
        widget.parentNode.removeChild(widget);
        // prepend new widgets
        console.log(response);
      }
    }
    xhr.send(JSON.stringify(params));
  })
  return deleteDiv;
}

var createWidget = {
  haiku: function(data) {
    return `<div class="card" id="${data.type}Widget">
        <div class="card-body">
            <p><i>-- haiku</i></p>
            <h3 class="card-title" style="color: ${data.color}">${data.haiku}</h3>
        </div>
      </div>`;
  },
  drawing: function (data) {
    return `<div class="card" id="${data.type}Widget">
        <div class="card-canvas">
          <img src="${data.dataImage}" style="width:300;height:300"/>
        </div>
        <div class="card-body">
          <h3 class="card-title">${data.title}</h3>
        </div>
      </div>`;
  },
  contact: function (data) {
    return `<div class="card" id="${data.type}Widget">
        <div class="card-body">
            <label for="name">Name:</label>
              <p>${data.name}</p>
            <label for="email">Email:</label>
              <p>${data.email}</p>
            <label for="notes">Notes:</label>
              <p>${data.notes}</p>
        </div>
      </div>`;
  }
}

Vue.component('saved-widgets', {
  props: ['widgets'],
  template: '<span id="savedWidgets"></span>',
  created: function() {
    $widgets = this.widgets;
    return setTimeout(function(){
      JSON.parse($widgets).forEach(function(widget) {
        appendWidget(widget);
      });
    },0);
  }
})

var App = new Vue({
  el: '#VueApp',
  data: {
    currentView: 'addWidget'
  },
  components: {
    addWidget: {
      template: `<div class="card" :id="card + 'Widget'">
          <div class="card-add">
            <button type="button" class="btn btn-outline-info" v-on:click="addWidget">+</button>
          </div>
          <div class="card-body">
            <h5 class="card-title">Add a new widget</h5>
            <p class="card-text">Story widget, Drawing widget, haikus... you name it!</p>
          </div>
        </div>`,
      data: function () {
        return {
          card: 'add'
        }
      },
      methods: {
        addWidget() {
          App.currentView = 'selectWidget';
        }
      }
    },
    selectWidget: {
      template: `<div class="card" :id="card + 'Widget'">
          <div class="card-add">
          <div class="card-body">
            <h5 class="card-title">Select widget type!</h5>
          </div>
            <button v-for="widget in widgets" type="button" class="btn btn-outline-info" @click="selectWidget(widget)">{{widget.charAt(0).toUpperCase() + widget.slice(1)}}</button>
          </div>
        </div>`,
        data: function () {
          return {
            card: 'select',
            widgets: [
              'haiku',
              'drawing',
              'contact'
            ]
          }
        },
      methods: {
        selectWidget(type) {
          App.currentView = type + 'Widget';
        }
      }
    },
    haikuWidget: {
      template: `<div class="card" :id="card + 'Widget'">
          <div class="card-add">
          <div class="card-body">
            <h3 class="card-title"><textarea :style="'color:' + color" class="form-control" id="haikuTextarea" name="haiku" v-model="haiku" placeholder="Write your haiku!" required rows="3"></textarea></h3>
            <div class="palette-color-picker-bubble"></div>
            <div class="widget-controllers">
              <button id="save" @click="saveWidget" type="button" class="btn btn-outline-success btn-sm">Save</button>
              <button id="cancel" @click="cancelWidget" type="button" class="btn btn-outline-danger btn-sm">Cancel</button></div>
            </div>
        </div>`,
        data: function () {
          return {
            card: 'haiku',
            color: '#536DFE',
            haiku: ''
          }
        },
      methods: {
        cancelWidget() {
          App.currentView = 'addWidget';
        },
        saveWidget() {
          sendWidget({ type: 'haiku', color: document.querySelector('.swatch.active').getAttribute('data-color'), haiku: this.haiku });
        }
      },
      created: function(){
        // Create palette
        setTimeout(function(){createPalette(function() {
          document.querySelector("#haikuTextarea").style.color = document.querySelector('.swatch.active').getAttribute('data-color');
        })}, 0);
      }
    },
    contactWidget: {
      template: `<div class="card" :id="card + 'Widget'">
          <div class="card-add">
          <div class="card-body">
              <label for="name">Name:</label>
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Contact's name" required name="name" v-model="name">
              </div>
              <label for="email">Email:</label>
              <div class="input-group mb-3">
                <input type="email" class="form-control" placeholder="example@email.com" required name="email" v-model="email">
              </div>
              <label for="notes">Notes:</label>
              <div class="input-group mb-3">
                <textarea type="text" class="form-control" placeholder="Notes" name="notes" required v-model="notes"></textarea>
              </div>
            <div class="palette-color-picker-bubble"></div>
            <div class="widget-controllers">
              <button id="save" @click="saveWidget" type="button" class="btn btn-outline-success btn-sm">Save</button>
              <button id="cancel" @click="cancelWidget" type="button" class="btn btn-outline-danger btn-sm">Cancel</button></div>
            </div>
        </div>`,
        data: function () {
          return {
            card: 'contact',
            email: '',
            notes: '',
            name: ''
          }
        },
      methods: {
        cancelWidget() {
          App.currentView = 'addWidget';
        },
        saveWidget() {
          sendWidget({ type: 'contact', name: this.name, email: this.email, notes: this.notes });
        }
      },
    },
    drawingWidget: {
      template: `<div class="card" :id="card + 'Widget'">
          <div class="card-canvas">
            <canvas id="drawCanvas" width="300" height="300"></canvas>
            <button id="resetCanvas" type="button" class="btn btn-outline-danger">X</button>
          </div>
          <div class="card-body">
            <h3 class="card-title"> <input type="text" class="form-control" placeholder="Choose a title!" required name="title" v-model="title"></h3>
            <div class="palette-color-picker-bubble"></div>
          <div class="widget-controllers">
            <button id="saveWidget" @click="saveWidget" type="button" class="btn btn-outline-success btn-sm">Save</button>
            <button id="cancelWidget" @click="cancelWidget" type="button" class="btn btn-outline-danger btn-sm">Cancel</button></div>
          </div>
        </div>`,
        data: function () {
          return {
            card: 'drawing',
            title: ''
          }
        },
      methods: {
        cancelWidget() {
          App.currentView = 'addWidget';
        },
        saveWidget() {
          params = {type: 'drawing', title: this.title };
          params.dataImage = document.querySelector('canvas').toDataURL("image/jpg");
          sendWidget(params);
        }
      },
      created: function() {
        setTimeout(function(){
          // When true, moving the mouse draws on the canvas
          var isDrawing = false;
          var color = '#536DFE';
          var x = 0;
          var y = 0;

          const canvas = document.getElementById('drawCanvas');
          const context = canvas.getContext('2d');
          reset(canvas);

          // The x and y offset of the canvas from the edge
          // of the page.


          // Add the event listeners for mousedown, mousemove, and mouseup
          canvas.addEventListener('mousedown', e => {
            color = document.querySelector('.swatch.active').getAttribute('data-color');
            const rect = canvas.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
            isDrawing = true;
          });

          canvas.addEventListener('mousemove', e => {
            if (isDrawing === true) {
              const rect = canvas.getBoundingClientRect();
              drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
              x = e.clientX - rect.left;
              y = e.clientY - rect.top;
            }
          });

          window.addEventListener('mouseup', e => {
            if (isDrawing === true) {
              const rect = canvas.getBoundingClientRect();
              drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
              x = 0;
              y = 0;
              isDrawing = false;
            }
          });

          function drawLine(context, x1, y1, x2, y2) {
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = 3;
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
            context.closePath();
          }
          // Create palette
          createPalette();

          // Reset canvas to white
          function reset(canvas){
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
          var resetButton = document.getElementById('resetCanvas');
          resetButton.addEventListener('click', function(){return reset(canvas);});
        }, 0);
      }
    }
  }
});

function createPalette(callback) {
  // Create palette
  var palette = document.createElement("div");
  palette.innerHTML = `<div class="palette-color-picker-bubble" style="">
    <span class="swatch active" title="#536DFE" data-color="#536DFE" style="background-color: rgb(83, 109, 254);"></span>
    <span class="swatch" title="#D50000" data-color="#D50000" style="background-color: rgb(213, 0, 0);"></span>
    <span class="swatch" title="#00E676" data-color="#00E676" style="background-color: rgb(0, 230, 118);"></span>
    <span class="swatch" title="#FF9100" data-color="#FF9100" style="background-color: rgb(255, 145, 0);"></span>
    <span class="swatch" title="#FFEA00" data-color="#FFEA00" style="background-color: rgb(255, 234, 0);"></span>
    <span class="swatch" title="primary" data-color="#E91E63" style="background-color: rgb(233, 30, 99);"></span>
    <span class="swatch" title="#000000" data-color="#000000" style="background-color: rgb(0, 0, 0);"></span>
  </div>`;
  document.querySelector('.palette-color-picker-bubble').append(palette);
  // Select the color
  const paletteNodes = palette.querySelectorAll('.swatch');
  for (let i = 0; i < paletteNodes.length; i++) {
      paletteNodes[i].addEventListener('click', function () {
        for (let j = 0; j < paletteNodes.length; j++) {
          paletteNodes[j].classList.remove('active');
        }
        this.classList.add('active');
        if (callback) return callback();
      });
  }
}

function sendWidget(params) {
  let valid = true;
  let inputs = document.querySelectorAll('.form-control');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].required && !inputs[i].value) {
      inputs[i].classList.add('is-invalid');
      valid = false;
    }
  }
  if (!valid) return;
  params['csrf_name'] = document.querySelector('input[name=csrf_name]').value;;
  params['csrf_value'] = document.querySelector('input[name=csrf_value]').value;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', './widgets', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let response = JSON.parse(this.response); // parse response
        // update cfsr
        if (response.cfsr && response.cfsr.field) document.getElementById('csfr').innerHTML = response.cfsr.field;
        // reset addWidget
        App.currentView = 'addWidget';
        // prepend new widgets
        appendWidget(response);
      }
  }
  xhr.send(JSON.stringify(params));
}
