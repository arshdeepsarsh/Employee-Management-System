const API_URL = "http://localhost:8080/employees"

loadEmployees()


function loadEmployees(){

fetch(API_URL)

.then(response => response.json())

.then(data => {

document.getElementById("totalEmployees").innerText = data.length

let table = document.getElementById("employeeTable")

table.innerHTML = ""

data.forEach(emp => {

table.innerHTML += `
<tr>
<td>${emp.id}</td>
<td>${emp.name}</td>
<td>${emp.email}</td>
<td>${emp.department}</td>
<td>

<button class="btn btn-warning"
onclick="editEmployee(${emp.id},'${emp.name}','${emp.email}','${emp.department}')">
Edit
</button>

<button class="btn btn-danger"
onclick="deleteEmployee(${emp.id})">
Delete
</button>

</td>
</tr>
`

})

})

}



function addEmployee(){

let name = document.getElementById("name").value
let email = document.getElementById("email").value
let department = document.getElementById("department").value

fetch(API_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name:name,
email:email,
department:department
})
})

.then(res => res.json())

.then(data => {

loadEmployees()

})

}



function deleteEmployee(id){

fetch(API_URL + "/" + id,{
method:"DELETE"
})

.then(()=>{

loadEmployees()

})

}
function searchEmployee(){

let input = document.getElementById("searchInput").value.toLowerCase()

let rows = document.querySelectorAll("#employeeTable tr")

rows.forEach(row => {

let name = row.children[1].innerText.toLowerCase()

if(name.includes(input)){
row.style.display = ""
}else{
row.style.display = "none"
}

})

}

function editEmployee(id,name,email,department){

document.getElementById("editModal").style.display="flex"

document.getElementById("editId").value=id
document.getElementById("editName").value=name
document.getElementById("editEmail").value=email
document.getElementById("editDepartment").value=department

}


function closeModal(){

document.getElementById("editModal").style.display="none"

}


function updateEmployee(){

let id = document.getElementById("editId").value
let name = document.getElementById("editName").value
let email = document.getElementById("editEmail").value
let department = document.getElementById("editDepartment").value

fetch(API_URL + "/" + id, {

method: "PUT",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
name: name,
email: email,
department: department
})

})

.then(response => response.json())

.then(data => {

closeModal()

loadEmployees()

})

}
function showSection(section){

document.getElementById("dashboard").style.display="none"
document.getElementById("employees").style.display="none"
document.getElementById("departments").style.display="none"
document.getElementById("reports").style.display="none"
document.getElementById("settings").style.display="none"

if(section==="dashboard"){
document.getElementById("dashboard").style.display="block"
}

if(section==="employees"){
document.getElementById("employees").style.display="block"
}

if(section==="departments"){
document.getElementById("departments").style.display="block"
}

if(section==="reports"){
document.getElementById("reports").style.display="block"
loadReportChart()
}

if(section==="settings"){
document.getElementById("settings").style.display="block"
}

}
function loadReportChart(){

fetch(API_URL)

.then(response => response.json())

.then(data => {

let deptCount = {}

data.forEach(emp => {

if(deptCount[emp.department]){
deptCount[emp.department]++
}else{
deptCount[emp.department] = 1
}

})

let labels = Object.keys(deptCount)
let values = Object.values(deptCount)

const ctx = document.getElementById('departmentChart')

new Chart(ctx, {

type: 'bar',

data: {

labels: labels,

datasets: [{
label: 'Employees per Department',
data: values
}]

}

})

})

}
let departments = []

function addDepartment(){

let name = document.getElementById("deptName").value

if(name === "") return

departments.push(name)

renderDepartments()

document.getElementById("deptName").value=""

}

function renderDepartments(){

let list = document.getElementById("departmentList")

list.innerHTML=""

departments.forEach(dept => {

list.innerHTML += `<li>${dept}</li>`

})

}
function toggleDarkMode(){

document.body.classList.toggle("dark-mode")

}
function exportPDF(){

fetch(API_URL)

.then(response => response.json())

.then(data => {

const { jsPDF } = window.jspdf

let doc = new jsPDF()

doc.text("Employee Report", 14, 15)

let rows = []

data.forEach(emp => {

rows.push([
emp.id,
emp.name,
emp.email,
emp.department
])

})

doc.autoTable({

head:[["ID","Name","Email","Department"]],

body:rows,

startY:20

})

doc.save("employees_report.pdf")

})

}