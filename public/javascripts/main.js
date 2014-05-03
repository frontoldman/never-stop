(function(){
  var table = document.getElementById('content');
  var currentDom = document.getElementById('current');
  var historyDom = document.getElementById('history');
  var current = 0;
  var history = 0;
  var num = 4;

  var data = [];

  function render(){
    table.innerHTML = '';
    for(var i = 0;i<num;i++){
      var rowData = data[i];
      var rowElem = document.createElement('tr');
      for(var j = 0;j<num;j++){
        var cellElem = document.createElement('td');
        if(rowData[j] === null){
          cellElem.innerHTML = '&nbsp;'
        }else{
          cellElem.className = 'num-'+rowData[j];
          cellElem.innerHTML = rowData[j] ;
        }
        rowElem.appendChild(cellElem);
      }
      table.appendChild(rowElem);

    }
  }

  function probePosition(){
    var row = baseRandom(0,num-1),
        cell = baseRandom(0,num-1);

    if(data[row][cell] !== null){
      return probePosition();
    }
    return [row,cell];
  }

  function main(){
    data = [];
    current = 0;
    for(var i = 0;i<num;i++){
      var rowData = [];
      for(var j = 0;j<num;j++){
        rowData.push(null);
      }
      data.push(rowData);
    }

    fillEmpty();
    fillEmpty();

    render();

    bindEvent();
  }

  //先移动后合并
  function mv(direction){

    var lastLocation = null,currentLocation = null;
    switch(direction){
      case 1://上
        for(var i = 1;i<num;i++){
          for(var j = 0;j<num;j++){
            if(data[i][j] !== null){
              currentLocation = i;
              while(currentLocation>0&&data[--currentLocation][j]===null){
                lastLocation = currentLocation;
              }
              if(lastLocation !== null){
                data[lastLocation][j] = data[i][j];
                data[i][j] = null;
              }
            }
            lastLocation = null;
          }
        }
        break;
      case 2://右
        for(var i=0;i<num;i++){
          for(var j = num-1;j>=0;j--){
            if(data[i][j] !== null){
              currentLocation = j;
              while(currentLocation<num-1&&data[i][++currentLocation] === null){
                lastLocation = currentLocation;
              }
              if(lastLocation !== null){
                data[i][lastLocation] = data[i][j];
                data[i][j] = null;
              }
            }
            lastLocation = null;
          }
        }
        break;
      case 3://下
        for(var i = num-2;i>=0;i--){
          for(var j = 0;j<num;j++){
            if(data[i][j] !== null){
              currentLocation = i;
              while(currentLocation<num-1&&data[++currentLocation][j]===null){
                lastLocation = currentLocation;
              }

              if(lastLocation !== null){
                data[lastLocation][j] = data[i][j];
                data[i][j] = null;
              }
            }
            lastLocation = null;
          }
        }
        break;
      case 4://左
        for(var i = 0;i<num;i++){
          for(var j = 1;j<num;j++){
            if(data[i][j] !== null){
              currentLocation = j;
              while(currentLocation>0&&data[i][--currentLocation]===null){
                lastLocation = currentLocation;
              }
              if(lastLocation !== null){
                data[i][lastLocation] = data[i][j];
                data[i][j] = null;
              }
            }
            lastLocation = null;
          }
        }
        break;
    }

  }

  function sum(addend){
    current+=addend;
    if(current == 2048){
      alert('您赢了');
    }
    if(current>history){
      history = current;
    }
    currentDom.innerHTML = current;
    historyDom.innerHTML = history;
  }

  //合并需要传递方向参数
  function combine(direction){
    switch(direction){
      case 1://上
        for(var i = 0;i<num-1;i++){
          for(var j = 0;j<num;j++){
            if(data[i][j]!==null&&data[i][j]===data[i+1][j]){
              data[i][j] = data[i][j]*2;
              sum(data[i][j]);
              data[i+1][j] = null;
            }
          }
        }
        break;
      case 2://右
        for(var i = 0;i<num;i++){
          for(var j = num-1;j>0;j--){
            if(data[i][j]!==null&&data[i][j]===data[i][j-1]){
              data[i][j] = data[i][j]*2;
              sum(data[i][j]);
              data[i][j-1] = null;
            }
          }
        }
        break;
      case 3://下
        for(var i = num-1;i>0;i--){
          for(var j = 0;j<num;j++){
            if(data[i][j]!==null&&data[i][j]===data[i-1][j]){
              data[i][j] = data[i][j]*2;
              sum(data[i][j]);
              data[i-1][j] = null;
            }
          }
        }
        break;
      case 4://左
        for(var i = 0;i<num;i++){
          for(var j = 0;j<num-1;j++){
            if(data[i][j]!==null&&data[i][j]===data[i][j+1]){
              data[i][j] = data[i][j]*2;
              sum(data[i][j]);
              data[i][j+1] = null;
            }
          }
        }
        break;
    }
  }

  function fillEmpty(){
    var newP = probePosition();
    data[newP[0]][newP[1]] = 2;
  }

  function checkFail(){
    for(var i = 0;i<num;i++){
      for(var j = 0;j<num;j++){
        if(data[i][j] === null){
          return true;
        }
      }
    }
    return false;
  }

  function bindEvent(){
    var positionL,positionT;


    if ((navigator.userAgent.indexOf('iPhone') != -1)
        || (navigator.userAgent.indexOf('iPod') != -1)
        || (navigator.userAgent.indexOf('iPad') != -1)
        || navigator.userAgent.match(/Android/i)) {

        table.addEventListener('touchstart',function(e){
          positionL = e.changedTouches[0].clientX;
          positionT = e.changedTouches[0].clientY;
        },false)

        document.addEventListener('touchend',function(e){
          _positionL = e.changedTouches[0].clientX;
          _positionT = e.changedTouches[0].clientY;
          upEvent(_positionL,_positionT);
        },false)


    }else{
      table.onmousedown = function(e){
        e = e || window.event;
        if(e.preventDefault){
          e.preventDefault();
        }else{
          e.returnValue = false;
        }

        positionL = e.clientX;
        positionT = e.clientY;

      }

      document.onmouseup = function(e){
        e = e || window.event;
        var _positionL = e.clientX;
        var _positionT = e.clientY;

        upEvent(_positionL,_positionT);

      }
    }

    function upEvent(_positionL,_positionT){
      var disL = _positionL - positionL;
      var disT = _positionT - positionT;

      var absDisL = Math.abs(_positionL - positionL);
      var absDisT = Math.abs(_positionT - positionT);

      var direction;

      if(absDisL >= absDisT){    //方向
        if(disL > 0){    //向右
          direction = 2;
        }else{    //向左
          direction = 4;
        }
      }else{
        if(disT > 0){    //向下
          direction = 3;
        }else{    //向上
          direction = 1;
        }
      }

      mv(direction);
      combine(direction);
      mv(direction);

      fillEmpty();
      render();

      var isFail = checkFail();
      if(!isFail){
        if(confirm('您已经输了！！,请重新开始')){
          main();
        }
        return;
      }
    }

  }

  main();

  //utils
  function baseRandom(min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    }

})()
