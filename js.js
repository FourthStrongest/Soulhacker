const url = "data.json"

const output = document.querySelector('.output')
const outputDiv = document.createElement('div')
const ul = document.createElement('ul')
output.append(outputDiv)
output.append(ul)

window.addEventListener('DOMContentLoaded', () => {
  outputDiv.textContent = 'ready'
  loadData()
})

function loadData() {
  fetch(url).then(rep => rep.json())
  .then(data => {
    console.log(data)
    addToPage(data)
  })
}

function addToPage(arr) {
  arr.array.forEach(element => {
    console.log(element)
    const li = document.createElement('li')
    li.textContent = element.name

    if (element.upgrade.upgraded) {
      li.classList.add('upgraded')
    } else if (element.acquired) {
      li.classList.add('acquired')
    } else {
      li.classList.add('unacquired')
    }

    ul.append(li)
    li.addEventListener('click', e => {
      li.classList.toggle('active')
    })
  })
}