const SLICES = ["پول نقد", "بلیط کنسرت", "پوچ", "یک کتاب خوب", "کد تخفیف 10 درصد", "عضویت دائم"]; // number of slices: 8
const PROB = {0:.1, 1:.09, 2:.35, 3:.12, 4:.12, 5:.12, 6:.1,}
const COLORS = ["#19c", "#16a085", '#2980b9', '#34495e', '#f39c12', '#d35400', '#34495e', 'rgb(14, 156, 14)'];
let sliceArc = 360/SLICES.length;
const spinner = document.getElementById('spinner');

function showWheel() {
  let fraction = Math.tan((45-sliceArc/2)* (Math.PI/180));
  let edgeCoord = Math.ceil(100 * (1-fraction));
  for (let i=0; i<SLICES.length; ++i) {
    const sliceBar = document.createElement('span');
    sliceBar.className = "slice";
    sliceBar.style.clipPath = `polygon(${edgeCoord}% 0, 100% 100%, 0 ${edgeCoord}%)`;
    sliceBar.style.transform = `rotate(${sliceArc*(i) + 45}deg)`;
    sliceBar.style.backgroundColor = COLORS[i];
    sliceBar.innerHTML = `<span>${SLICES[i]}</span>`;
    spinner.appendChild(sliceBar);
  }
}

  
function startSpin() {
  function getPrize() {
    spinner.style.transition = "all 6s cubic-bezier(0, 0.99, 0.44, 0.99)";
    // Avoid spinning before the end of the current round
    document.getElementById('spin-btn').style.pointerEvents = 'none';
    // calculate spin degree
    let currentSlice = weightedRandom(PROB);
    let stepDeg = currentSlice * sliceArc;
    let degree = stepDeg + 3600;
    spinner.style.transform = `rotate(${-degree}deg)`;
    setTimeout(() => {
      document.getElementById('spin-btn').style.pointerEvents = 'visible';
      swal({
        title: "جایزه شما:",
        text: SLICES[currentSlice],
        button: "حله",
        icon: "success",
      });
    }, 6500);
  }
  
  function reset() {
    spinner.style.transition = "none";
    spinner.style.transform = "rotate(0deg)";
  }
  
  function weightedRandom(prob) {
    let i, sum=0, r=Math.random();
    for (i in prob) {
      sum += prob[i];
      if (r <= sum) return i;
    }
  }
  
  function setCookie(cname, cvalue, extime) {
    const d = new Date();
    d.setTime(d.getTime() + (extime * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  async function getName() {
    const response = await fetch('/cookie');
    const jsonObj = await response.json();
    return {name: jsonObj.name, time: jsonObj.time};
  }


  if (navigator.cookieEnabled) {
    let user = getCookie("wheelUser");
    if (user != "") {
      swal({
        title: `${user} عزیز`,
        text: "هنوز نوبت مجدد گردونه شما نشده",
        button: "حله",
        icon: "warning",
      });
    } else {
      reset();
      swal("سلام. اسمت چیه؟", {
        content: "input",
        closeOnClickOutside: false,
        className: 'firstSwal',
      })
      .then((value) => {
        swal(`خوش اومدی ${value}`)
        .then (() => {
          if (value != "" && value != null) {
            getName().then(res => {
              setCookie(res.name, value, parseFloat(res.time));
            });
          }
          getPrize();
        })
      });
    }
  } else {
    swal({
      title: "گردونه شانس",
      text: `برای بازی باید کوکی ها رو فعال کنید.`,
      button: "برم فعال کنم",
      icon: "warning",
    });
  }
}

