function addRow() {
  const formBox = document.getElementById("form-box");
  const rowNo = formBox.querySelectorAll(".input-box");
  if (rowNo.length < 8) {
    const ROW = document.createElement('div');
    const title = document.createElement('input');
    const prop = document.createElement('input');
    ROW.className = "input-box";
    title.name = "title";
    title.type = "text";
    title.maxLength = "20";
    title.placeholder = "عنوان هدیه";
    title.required = true;
    prop.name = "prop";
    prop.type = "number";
    prop.min = "0"; prop.max = "1"; prop.step = ".1";
    prop.placeholder = "شانس";
    prop.required = true;
    ROW.append(title, prop);
    formBox.appendChild(ROW);
  } else {
    alert("حداکثر 8 ردیف می توانید ایجاد کنید.");
  }
}

function propSum() {
  const propBox = document.querySelectorAll(`div.input-box input[type = "number"]`);
  const propShow = document.getElementById('chance-summation');
  let sum = 0;
  for (const iterator of propBox) {
    if (iterator.value != "") {
      sum += parseFloat(iterator.value);
    }
  }
  propShow.textContent = sum.toFixed(1);
  if (sum <= 1) {
    propShow.style.color = 'black';
  } else {
    propShow.style.color = 'red';
    alert("مجموع شانس جوایز نباید بیشتر از 1 شود.")
  }
}
function validForm() {
  const propSum = document.getElementById("chance-summation").textContent;
  console.log(propSum);
  if (parseFloat(propSum) != 1) {
    alert("جمع شانس ها باید برابر 1 باشد.");
    return false;
  }
}