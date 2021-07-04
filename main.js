window.addEventListener('DOMContentLoaded', () => {

  let quantitySections = document.querySelector('#quantity-sections'),
      buttonDrawSections = document.querySelector('#draw-sections'),    
      buttonDrawDiagram = document.querySelector('#draw-diagram'),
      sectionValue = document.querySelectorAll('.section-value'),        
      selectValue = document.querySelectorAll('.color-input'),
      errorText = document.querySelector('#error'),     
      errorText2 = document.querySelector('#error2');


//набор данных для отрисовки
let data = {
  "1": 10,
  "2": 10,
  "3": 10,
  "4": 10,
};

let colorsData = ["#fde23e", "#f16e23", "#57d9ff","#937e88"];

function newDataAndColors(values, colorsSections, sectionValue) {   
  data = {};
  colorsData = [];
  for(let i = 0; i < values; i++) {
    if(sectionValue[i].value){
      data[`"${i}"`] = +sectionValue[i].value;
    }    
    colorsData.push( String(colorsSections[i].value));    
  }  
  return data, colorsData;
}

buttonDrawSections.addEventListener('click', () => {  
  for(let i = 0; i < 6; i++) {
    let section = document.querySelector(`#block${i+1}`);    
    section.classList.add('hide');    
    buttonDrawDiagram.classList.add('hide');
    sectionValue[i].value = '';
    selectValue[i].value = '';    
  }
    if(quantitySections.value > 6 || quantitySections.value < 1) { 
      errorText.classList.remove('hide');      
    } else {      
      errorText.classList.add('hide');
      for(let i = 0; i < quantitySections.value; i++) {
        let section = document.querySelector(`#block${i+1}`);
        section.classList.remove('hide');        
        buttonDrawDiagram.classList.remove('hide');           
    }  
  }
})

buttonDrawDiagram.addEventListener('click', () => {   
  newDataAndColors(quantitySections.value, selectValue, sectionValue);

  if(!isEmpty(data, quantitySections.value)) {
      errorText2.classList.remove('hide');
  } else {
    errorText2.classList.add('hide');

    var myPiechart2 = new Piechart(  
      {
          canvas: myCanvas,
          data: data,
          colors: colorsData
      }  
    );
    myPiechart2.draw();   
  }
   
})

//проверка объекта на пустоту
function isEmpty(obj, sizeObj) {
  let quantityKeys = 0;
  for (let key in obj) {
    quantityKeys++  
  }  
  if(+quantityKeys === +sizeObj) {
    return true;
  } else {
    return false;
  }
}

//----Диаграмма---Начало---

var myCanvas = document.getElementById("myCanvas");
myCanvas.width = 300;
myCanvas.height = 300;

//отрисовка линии
function drawLine(ctx, startX, startY, endX, endY){
  ctx.beginPath();
  ctx.moveTo(startX,startY);
  ctx.lineTo(endX,endY);
  ctx.stroke();
}

//отрисовка дуги
function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle){
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.stroke();
}

//отрисовка кусочка "пирога"
function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX,centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();
}

var Piechart = function(options){
  this.options = options;
  this.canvas = options.canvas;
  this.ctx = this.canvas.getContext("2d");
  this.colors = options.colors;

  this.draw = function(){
      var total_value = 0;
      var color_index = 0;
      for (var categ in this.options.data){
          var val = this.options.data[categ];
          total_value += val;
      }

      var start_angle = 0;
      for (categ in this.options.data){
          val = this.options.data[categ];
          var slice_angle = 2 * Math.PI * val / total_value;

          drawPieSlice(
              this.ctx,
              this.canvas.width/2,
              this.canvas.height/2,
              Math.min(this.canvas.width/2,this.canvas.height/2),
              start_angle,
              start_angle+slice_angle,
              this.colors[color_index%this.colors.length]
          );

          start_angle += slice_angle;
          color_index++;
      }

  }
}

//----Диаграмма---Конец---

var myPiechart = new Piechart(  
  {
      canvas: myCanvas,
      data: data,
      colors: colorsData
  }  
);
myPiechart.draw();
})