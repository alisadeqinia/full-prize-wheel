// const SLICES = ["پول نقد", "بلیط کنسرت", "پوچ", "یک کتاب خوب", "کد تخفیف 10 درصد", "عضویت دائم"];
// const PROP = {0:.1, 1:.09, 2:.35, 3:.12, 4:.12, 5:.12, 6:.1,}
// let sliceArc = 360/SLICES.length;
const COLORS = ["#19c", "#16a085", '#2980b9', '#34495e', '#f39c12', '#d35400', '#34495e', 'rgb(14, 156, 14)'];
const spinner = document.getElementById('spinner');

async function getSlices() {
  const res = await fetch("/slice-api");
  const json = await res.json();
  const SLICES = json.docs[0].title;
  const PROP = {};
  for (let i=0; i < json.docs[0].prop.length; ++i) {
    PROP[i] = parseFloat(json.docs[0].prop[i]);
  }
  return [SLICES, PROP];
}

async function getName() {
  const response = await fetch('/cookie');
  const jsonObj = await response.json();
  return {name: jsonObj.name, time: jsonObj.time};
}

async function showWheel() {
  const sliceData = await getSlices();
  const SLICES = sliceData[0];
  const sliceArc = 360/SLICES.length;
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
 
async function startSpin() {
  const sliceData = await getSlices();
  const SLICES = sliceData[0];
  const PROP = sliceData[1];
  const sliceArc = 360/SLICES.length;
  const cookieData = await getName();
  const cookieName = cookieData.name;
  const expTime = cookieData.time;

  async function getPrize() {
    spinner.style.transition = "all 6s cubic-bezier(0, 0.99, 0.44, 0.99)";
    // Avoid spinning before the end of the current round
    document.getElementById('spin-btn').style.pointerEvents = 'none';
    // calculate spin degree
    let currentSlice = await weightedRandom(PROP);
    console.log(currentSlice);
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
  
  async function weightedRandom(prob) {
    let i, sum=0, r=Math.random();
    for (i in prob) {
      sum += prob[i];
      if (r <= sum) return i;
    }
  }
  
  function setCookie(cname, cvalue, extime) {
    const d = new Date();
    d.setTime(d.getTime() + (extime *60 * 60 * 1000));
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


  if (navigator.cookieEnabled) {
    let user = getCookie(cookieName);
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
            setCookie(cookieName, value, parseFloat(expTime));
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

