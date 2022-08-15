const url = "data.json"
let dataSet = null
let sortDirection = true

const tableBody = document.querySelector('.tableBody')
const type = document.createElement('td')
const asName = document.createElement('td')
const umName = document.createElement('td')
const umLevel = document.createElement('td')
const umRegion = document.createElement('td')
const umLocation = document.createElement('td')
const upgradeGoal = document.createElement('td')
const currentProgress = document.createElement('td')
const requirement = document.createElement('td')
const acquired = document.createElement('td')
const upgraded = document.createElement('td')

const editCurrentProgress = document.createElement('input')
const acquiredButton = document.createElement('input')
const upgradedButton = document.createElement('input')

window.addEventListener('DOMContentLoaded', () => {
  loadData()
})

function loadData() {
  fetch(url).then(rep => rep.json())
  .then(data => {
    dataSet = data
    loadTableData(data)
  })
}

function loadTableData(data) {
  let dataHtml = ''

  data.forEach(e => {
    //TODO
    saveLocalStorage(e.name, e.upgrade.currentProgress)

    dataHtml += `<tr>
      <td>${e.type}</td>
      <td>${e.name}</td>
      <td>${e.um.name}</td>
      <td>${e.um.level}</td>
      <td>${e.um.region}</td>
      <td>${e.um.location}</td>
      <td>${e.upgrade.upgradeGoal}</td>
      <td><input value=${localStorage.getItem(e.name + "prog")}></td>
      <td>${e.upgrade.maxProgress}</td>
      <td><input type='checkbox' id='acquired'></td>
      <td><input type='checkbox' id='upgraded'></td>
    </tr>`
  })

  acquiredButton.addEventListener('click', () => {
    //acquired.checked = true
    setRowStyle(tr, acquired)
  })
  upgradedButton.addEventListener('click', () => {
    console.log('hi')
    acquired.checked = true
    upgraded.checked = true
    //setRowStyle(tr)
  })

  tableBody.innerHTML = dataHtml
}

function setRowStyle(tr, td) {
  console.log(tr, td)
  if (td.id == "upgraded" && td.checked) {
    tr.style.backgroundColor = "green"
  } else if (td.id == "acquired" && td.checked) {
    tr.style.backgroundColor = "blue"
  } else {
    tr.style.backgroundColor = "red"
  }
}

function sortColumn(columnName) {
  const dataType = typeof dataSet[0][columnName]
  
  sortDirection = !sortDirection

  switch(dataType) {
    case 'number':
      sortNumberColumn(columnName)
      break
    case 'string':
      sortTextColumn(columnName);
      break
  }

  loadTableData(dataSet)
}

function sortNumberColumn(columnName) {
  dataSet = dataSet.sort((e1, e2) => {
    return sortDirection ? e1[columnName] - e2[columnName] : e2[columnName] - e1[columnName]
  })
}

function sortTextColumn(columnName) {
  dataSet = dataSet.sort((p1, p2) => {
   return sortDirection ? (p1[columnName] > p2[columnName]) - (p1[columnName] < p2[columnName]) : (p2[columnName] > p1[columnName]) - (p2[columnName] < p1[columnName])
  });
 }

 function saveLocalStorage(id, prog) {
  if (localStorage.getItem(id + "prog") === null) {
    localStorage.setItem(id + "prog", prog)
  }
 }
















 function addRowsToPage(arr) {
  arr.forEach(e => {
    const tr = document.createElement('tr')
    //const tr = tableBody.insertRow()

    type.textContent = e.type
    asName.textContent = e.name
    umName.textContent = e.um.name
    umLevel.textContent = e.um.level
    umRegion.textContent = e.um.region
    umLocation.textContent = e.um.location
    upgradeGoal.textContent = e.upgrade.upgradeGoal
    editCurrentProgress.setAttribute('value', e.upgrade.currentProgress)
    requirement.textContent = e.upgrade.maxProgress

    currentProgress.append(editCurrentProgress)
    acquiredButton.setAttribute('type', 'checkbox')
    acquiredButton.setAttribute('id', 'acquired')
    upgradedButton.setAttribute('type', 'checkbox')
    upgradedButton.setAttribute('id', 'upgraded')
    acquired.append(acquiredButton)
    upgraded.append(upgradedButton)

    tr.append(type)
    tr.append(asName)
    tr.append(umName)
    tr.append(umLevel)
    tr.append(umRegion)
    tr.append(umLocation)
    tr.append(upgradeGoal)
    tr.append(currentProgress)
    tr.append(requirement)
    tr.append(acquired)
    tr.append(upgraded)

    //setRowStyle(tr)

    acquiredButton.addEventListener('click', () => {
      //acquired.checked = true
      //setRowStyle(tr, acquired)
    })
    upgradedButton.addEventListener('click', () => {
      acquired.checked = true
      upgraded.checked = true
      //setRowStyle(tr)
    })

    tableBody.append(tr)
  })
}