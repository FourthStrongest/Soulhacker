const url = "data1_0_0.json"
let currentDataState = null
let sortDirection = false
let percentTableToggle = true

const tableBody = document.querySelector('.tableBody')
const patchesDropbox = document.getElementById('patches')

const currArtAcqTd = document.getElementById("currArtAcq")
const currArtUpgTd = document.getElementById("currArtUpg")
const currSkillAcqTd = document.getElementById("currSkillAcq")
const currSkillUpgTd = document.getElementById("currSkillUpg")
const artPercentTd = document.getElementById("artPercent")
const skillPercentTd = document.getElementById("skillPercent")
const totalPercentTd = document.getElementById("totalPercent")

let patchDictionary = new Map()

let currArtAcq = 0
let currArtUpg = 0
let maxArt = 0
let currSkillAcq = 0
let currSkillUpg = 0
let maxSkill = 0

window.addEventListener('DOMContentLoaded', () => {
  loadPage()
})

function loadPage() {
  loadPatchData()
  loadData()
}

function loadPatchData() {
  return new Promise(() => {
    patchDictionary = new Map()
    for (let i = 0; i < patchesDropbox.options.length; i++) {
      const e = patchesDropbox.options[i]
      // skip first data set as it is the base of all data
      if (i !== 0) {
        const patchedDataUrl = `data${e.value}.json`
        fetch(patchedDataUrl).then(rep => rep.json())
        .then(data => {
          for (let j = 0; j < data.length; j++) {
            patchDictionary.set(data[j].old, data[j].new)
          }
        })
      }
      // only fills until current version
      if (e.value === patchesDropbox.value) {
        break
      }
    }
  })
}

function loadData() {
  return new Promise(() => {
    fetch(url).then(rep => rep.json())
    .then(data => {
      currentDataState = data
      loadTableData(data)
    })
  }) 
}

function loadTableData(data) {
  let dataHtml = ''
  currArtAcq = 0
  currArtUpg = 0
  maxArt = 0
  currSkillAcq = 0
  currSkillUpg = 0
  maxSkill = 0

  data.forEach(e => {
    const acquiredElement = document.createElement('td')
    const upgradedElement = document.createElement('td')
    const acquiredHtml = `<input type='checkbox' id='acquired' onclick='onClickAcqCheckbox(this.parentNode.parentNode)' ${localStorage.getItem(`${e.name}Acq`) === 'true' ? 'checked' : ''}>`
    const upgradedHtml = `<input type='checkbox' id='upgraded' onclick='onClickUpgCheckbox(this.parentNode.parentNode)' ${localStorage.getItem(`${e.name}Upg`) === 'true' ? 'checked' : ''}>`
    acquiredElement.innerHTML = acquiredHtml
    upgradedElement.innerHTML = upgradedHtml

    let trHtml = `
    <tr id=${e.name} style='background-color: ${setBackgroundColors(acquiredElement.firstChild, upgradedElement.firstChild)}'>
      <td id="type">${e.type}</td>
      <td id="name">${getPatchedName(e.name)}</td>
      <td>${e.umName}</td>
      <td>${e.level}</td>
      <td>${e.region}</td>
      <td><img src="${e.location}"</td>
      <td>${e.upgradeGoal}</td>
      <td><input id='prog' value=${localStorage.getItem(`${e.name}Prog`) || 0} oninput='onInputChange(this.parentNode.parentNode)'></td>
      <td>${e.maxProgress}</td>
      <td>${acquiredElement.innerHTML}</td>
      <td>${upgradedElement.innerHTML}</td></tr>
    `

    dataHtml += trHtml

    counter(e.type, e.name)
  })

  tableBody.innerHTML = dataHtml
}

function getPatchedName(name) {
  if (patchDictionary.has(name)) {
    name = patchDictionary.get(name)
  }

  return name.replaceAll('_', ' ')
}

function counter(type, name) {
  if (type === "Art") {
    ++maxArt
    if (localStorage.getItem(`${name}Acq`) === 'true') {
      ++currArtAcq
    }
    if (localStorage.getItem(`${name}Upg`) === 'true') {
      ++currArtUpg
    }
    currArtAcqTd.innerText = `${currArtAcq}/${maxArt}`
    currArtUpgTd.innerText = `${currArtUpg}/${maxArt}`
    artPercentTd.innerText = `${Math.round((currArtUpg / maxArt) * 100) / 100}%`
  }

  if (type === "Skill") {
    ++maxSkill
    if (localStorage.getItem(`${name}Acq`) === 'true') {
      ++currSkillAcq
    }
    if (localStorage.getItem(`${name}Upg`) === 'true') {
      ++currSkillUpg
    }
    currSkillAcqTd.innerText = `${currSkillAcq}/${maxSkill}`
    currSkillUpgTd.innerText = `${currSkillUpg}/${maxSkill}`
    skillPercentTd.innerText = `${Math.round((currSkillUpg / maxSkill) * 100) / 100}%`
  }
  totalPercentTd.innerText = `${Math.round(((currArtUpg + currSkillUpg) / (maxArt + maxSkill)) * 100) / 100}%`
}

function sortColumn(columnName) {
  const dataType = typeof currentDataState[0][columnName]
  
  sortDirection = !sortDirection

  switch(dataType) {
    case 'number':
      sortNumberColumn(columnName)
      break
    case 'string':
      sortTextColumn(columnName);
      break
  }

  loadTableData(currentDataState)
}

function sortNumberColumn(columnName) {
  currentDataState = currentDataState.sort((e1, e2) => {
    return sortDirection ? e1[columnName] - e2[columnName] : e2[columnName] - e1[columnName]
  })
}

function sortTextColumn(columnName) {
  currentDataState = currentDataState.sort((p1, p2) => {
    return sortDirection ? (p1[columnName] > p2[columnName]) - (p1[columnName] < p2[columnName]) : (p2[columnName] > p1[columnName]) - (p2[columnName] < p1[columnName])
  })
}

function onClickAcqCheckbox(tr) {
  const acq = tr.querySelector('#acquired')
  const type = tr.querySelector("#type")
  if (type.innerText === "Art") {
    acq.checked ? ++currArtAcq : --currArtAcq
    currArtAcqTd.innerText = `${currArtAcq}/${maxArt}`
  }

  if (type.innerText === "Skill") {
    acq.checked ? ++currSkillAcq : --currSkillAcq
    currSkillAcqTd.innerText = `${currSkillAcq}/${maxSkill}`
  }

  onClickCheckbox(tr)
}

function onClickUpgCheckbox(tr) {
  const upg = tr.querySelector('#upgraded')
  const type = tr.querySelector("#type")
  if (type.innerText === "Art") {
    upg.checked ? ++currArtUpg : --currArtUpg
    currArtUpgTd.innerText = `${currArtUpg}/${maxArt}`
    artPercentTd.innerText = `${Math.round((currArtUpg / maxArt) * 100) / 100}%`
  }

  if (type.innerText === "Skill") {
    upg.checked ? ++currSkillUpg : --currSkillUpg
    currSkillUpgTd.innerText = `${currSkillUpg}/${maxSkill}`
    skillPercentTd.innerText = `${Math.round((currSkillUpg / maxSkill) * 100) / 100}%`
  }
  totalPercentTd.innerText = `${Math.round(((currArtUpg + currSkillUpg) / (maxArt + maxSkill)) * 100) / 100}%`

  onClickCheckbox(tr)
}

function onClickCheckbox(tr) {
  const acq = tr.querySelector('#acquired')
  const upg = tr.querySelector('#upgraded')
  setRowStyle(tr, acq, upg)
  localStorage.setItem(`${tr.id}Acq`, acq.checked)
  localStorage.setItem(`${tr.id}Upg`, upg.checked)
}

function setRowStyle(tr, acq, upg) {
  tr.style.backgroundColor = setBackgroundColors(acq, upg)
}

function setBackgroundColors(acq, upg) {
  let color = setBackgroundColor(upg)
  if (color == 'red') color = setBackgroundColor(acq)
  return color
}

function setBackgroundColor(input) {
  const red = 'rgba(255, 0, 0, 0.5)'
  const green = 'rgba(0, 255, 0, 0.5)'
  const blue = 'rgba(0, 0, 255, 0.5)'
  if (input.id == 'upgraded' && input.checked) return blue
  if (input.id == 'acquired' && input.checked) return green
  return 'red'
}

function onInputChange(tr) {
  const val = tr.querySelector(`#prog`).value
  localStorage.setItem(`${tr.id}Prog`, val)
}

function clearLocalStorage() {
  localStorage.clear()
  loadData()
}

function togglePercentTable() {
  const percentDiv = document.getElementById("percentDiv")
  const percentButton = document.getElementById("percentButton")
  percentDiv.style.display = percentTableToggle ? "none" : "block"
  percentButton.innerText = `${percentTableToggle ? "Show" : "Hide"} Percent Tables`
  percentTableToggle = !percentTableToggle
}
