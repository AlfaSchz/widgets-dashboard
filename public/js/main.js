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
            <p class="card-text">Contact widget, Drawing widget <span class="text-muted">(not available for mobile)</span>, haikus... you name it!</p>
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
            <button v-for="widget in widgets" type="button" class="btn btn-outline-info" @click="selectWidget(widget)" :disabled="mobilecheck() && widget === 'drawing'">{{widget.charAt(0).toUpperCase() + widget.slice(1)}}</button>
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


function mobilecheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};