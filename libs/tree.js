const canvas = document.querySelector('#draw_canvas') 
canvas.width = 500   
canvas.height= 500 
const c  = canvas.getContext('2d')        
const cH = canvas.height
const cW = canvas.width

const image_canvas = document.querySelector("#image_canvas")
const c_i  = image_canvas.getContext('2d')  
let image_width = 1080
let image_height = 1080
image_canvas.width = image_width     
image_canvas.height= image_height 

const r_alfa = document.getElementById("r_alfa")
const r_width = document.getElementById("r_width")
const r_width_dim = document.getElementById("r_width_dim")
const r_wind = document.getElementById("r_wind")
const r_iteration = document.getElementById("r_iteration")
const r_line_width = document.getElementById("r_line_width")

const s_alfa = document.getElementById("s_alfa")
const s_width = document.getElementById("s_width")
const s_width_dim = document.getElementById("s_width_dim")
const s_iteration = document.getElementById("s_iteration")
const s_wind = document.getElementById("s_wind")
const s_line_width = document.getElementById("s_line_width")

const background_color = document.getElementById("background_color")

const gradient_color_1 = document.getElementById("gradient_color_1")
const gradient_color_2 = document.getElementById("gradient_color_2")
const gradient_checkbox = document.getElementById("gradient_checkbox")

const file_name = document.getElementById("file_name")

const linear_gradient = {
    initial_vector: {r:50,g:60,b:160},
    final_vector: {r:250,g:160,b:10},
}
function get_gradient_color(linear_gradient,t){
    let r = (linear_gradient.final_vector.r - linear_gradient.initial_vector.r)*t + linear_gradient.initial_vector.r
    let g = (linear_gradient.final_vector.g - linear_gradient.initial_vector.g)*t + linear_gradient.initial_vector.g
    let b = (linear_gradient.final_vector.b - linear_gradient.initial_vector.b)*t + linear_gradient.initial_vector.b

    return `rgb(${r},${g},${b})`
}
let gradient_active = true


let fracParts = []
const fractalPart = function(x,y,len,ang,wid = 3,color = 'black',iteration_number = 1,id,id_reference){
    this.x           = x
    this.y           = y
    this.len         = len
    this.ang         = ang
    this.drawnLeft   = false
    this.drawnRigth  = false
    this.wid = wid
    this.inc = 1
    this.color = color
    this.id = id
    this.id_reference = id_reference
    this.iteration_number = iteration_number

    this.draw = function(){
        c.beginPath()
        c.moveTo(this.x,this.y)
        nX = this.x + Math.cos(this.ang)*(this.len + this.inc)
        nY = this.y + Math.sin(this.ang)*(this.len + this.inc)
        c.lineTo(nX,nY)
        c.lineWidth = this.wid
        c.strokeStyle = this.color
        c.stroke()
    }

    this.getXend = function(){
        return this.x + Math.cos(this.ang)*this.len
    }
    this.getYend = function(){
        return this.y + Math.sin(this.ang)*this.len
    }

}

let three_obj = []
const threePart = function(x1,y1,x2,y2,line_width = 3,color = 'black',iteration_number = 1){
    this.x1           = x1
    this.y1           = y1
    this.x2           = x2
    this.y2           = y2
    this.line_width = line_width
    this.color = color
    this.iteration_number = iteration_number

    this.draw = function(){
        c_i.beginPath()
        c_i.moveTo(this.x1*image_width,this.y1*image_height)
        c_i.lineTo(this.x2*image_width,this.y2*image_height)
        c_i.lineWidth = this.line_width*image_width
        c_i.strokeStyle = this.color
        c_i.stroke()
    }
}


function iteration(it,alfa,currentX,currentY,tam,shortenIndex,alfaRandInterval,lenRandInterval = 10,shortenRandInterval = 0.1,dir = null,color){    
    if(it>0){            
        let alfaIndex   = Math.PI/18 + Math.PI/(Math.random()*alfaRandInterval+6) 
        let len         = lenRandInterval/2-Math.random()*lenRandInterval    
        let shortenRand = Math.random()*shortenRandInterval
        if(gradient_active){
            fracParts.push(new fractalPart(currentX,currentY,tam+len+dir,alfa+alfaIndex,it*line_width,get_gradient_color(linear_gradient,it/iteration_number),it,alfa))
        }else{
            fracParts.push(new fractalPart(currentX,currentY,tam+len+dir,alfa+alfaIndex,it*line_width,color,it,alfa))
        }
        let xis = fracParts[fracParts.length-1].getXend()
        let yis = fracParts[fracParts.length-1].getYend()        
        iteration(it-1,alfa+alfaIndex,xis,yis,tam*(shortenIndex-shortenRand),shortenIndex,alfaRandInterval,lenRandInterval,shortenRandInterval,dir,color)
        
        if(gradient_active){
            fracParts.push(new fractalPart(currentX,currentY,tam+len-dir,alfa-alfaIndex,it*line_width,get_gradient_color(linear_gradient,it/iteration_number),it,alfa))
        }else{
            fracParts.push(new fractalPart(currentX,currentY,tam+len-dir,alfa-alfaIndex,it*line_width,color,it,alfa))
        }
        xis = fracParts[fracParts.length-1].getXend()
        yis = fracParts[fracParts.length-1].getYend()        
        iteration(it-1,alfa-alfaIndex,xis,yis,tam*(shortenIndex-shortenRand),shortenIndex,alfaRandInterval,lenRandInterval,shortenRandInterval,dir,color)        
    }else{
        return null
    }
}


const tam_inicial  = cH*0.057
let tam    = cH*0.057
let tamDim = 0.9
let xInic = cW/2
let yInic = cH*0.7
let alfaInic = Math.PI*3/2

let alfaRand        = 0         // entre 0 e 100  ++ 10
let lenInterval     = 0      // entre 0 e tam   ++ tam/10
let shortenInterval = 0      // entre 0.5 e 0    ++ 0.1
let DirEsq          = 0      // entre -15 e 15    ++ 3
let it              = 8     // entre   0 e 10     ++ 1
let line_width = 0.8
let color = `#ff3050`
let color2 = `#001450`
let background_color_value = "#000000"
let file = "randomthree"
let counter = 1

let iteration_number = it


function update_background_color(){
    canvas.style.backgroundColor = background_color.value
}
function update_gradient(){
    linear_gradient.initial_vector.r = parseInt(gradient_color_1.value.substr(1,2), 16)
    linear_gradient.initial_vector.g = parseInt(gradient_color_1.value.substr(3,2), 16)
    linear_gradient.initial_vector.b = parseInt(gradient_color_1.value.substr(5,2), 16)

    linear_gradient.final_vector.r = parseInt(gradient_color_2.value.substr(1,2), 16)
    linear_gradient.final_vector.g = parseInt(gradient_color_2.value.substr(3,2), 16)
    linear_gradient.final_vector.b = parseInt(gradient_color_2.value.substr(5,2), 16)
    
    color = gradient_color_1.value
    gradient_active = gradient_checkbox.checked
    
    line_width = parseFloat(r_line_width.value)    
    s_line_width.innerText = `Line: ${line_width}`

    fracParts.forEach( el =>{
        if(gradient_active){
            el.color = get_gradient_color(linear_gradient,el.iteration_number/iteration_number)
        }else{
            el.color = color
        }
        el.wid = el.iteration_number*line_width
    })
    three_obj.forEach( el =>{
        if(gradient_active){
            el.color = get_gradient_color(linear_gradient,el.iteration_number/iteration_number)
        }else{
            el.color = color
        }
        el.line_width = el.iteration_number*line_width/cW
    })

    c.clearRect(0,0,canvas.width,canvas.height)
    for(let i in fracParts){
        fracParts[i].draw()
    }
}
function atribute_values(){
    alfaRand        = parseFloat(r_alfa.value)         // entre 0 e 100  ++ 10
    lenInterval     = parseFloat(r_width.value)        // entre 0 e tam   ++ tam/10
    shortenInterval = parseFloat(r_width_dim.value)      // entre 0.5 e 0    ++ 0.1
    DirEsq          = parseFloat(r_wind.value)       // entre -15 e 15    ++ 3
    it              = parseFloat(r_iteration.value)     // entre   0 e 10     ++ 1
    line_width = parseFloat(r_line_width.value)
    iteration_number = it

    let inc = parseFloat(document.getElementById("increment").value)
    tam = tam_inicial+inc

    s_alfa.innerText = `Alfa: ${alfaRand}`
    s_width.innerText = `Width: ${lenInterval}`
    s_width_dim.innerText = `Short: ${shortenInterval}`
    s_iteration.innerText = `Iteration: ${iteration_number}`
    s_wind.innerText = `Wind: ${DirEsq}`
    s_line_width.innerText = `Line: ${line_width}`

    linear_gradient.initial_vector.r = parseInt(gradient_color_1.value.substr(1,2), 16)
    linear_gradient.initial_vector.g = parseInt(gradient_color_1.value.substr(3,2), 16)
    linear_gradient.initial_vector.b = parseInt(gradient_color_1.value.substr(5,2), 16)

    linear_gradient.final_vector.r = parseInt(gradient_color_2.value.substr(1,2), 16)
    linear_gradient.final_vector.g = parseInt(gradient_color_2.value.substr(3,2), 16)
    linear_gradient.final_vector.b = parseInt(gradient_color_2.value.substr(5,2), 16)
}
function atribute_values_to_range(){
    r_alfa.value = alfaRand                 // entre 0 e 100  ++ 10
    r_width.value = lenInterval             // entre 0 e tam   ++ tam/10
    r_width_dim.value = shortenInterval       // entre 0.5 e 0    ++ 0.1
    r_wind.value = DirEsq                 // entre -15 e 15    ++ 3
    r_iteration.value = it                   // entre   0 e 10     ++ 1
    r_line_width.value = line_width 

    gradient_color_1.value = color
    gradient_color_2.value = color2
    canvas.style.backgroundColor = background_color.value
    gradient_checkbox.checked = gradient_active
}
function generate_fractal_three(){    
    fracParts = []
    id_counter = 0
    iteration(it,alfaInic,xInic,yInic,tam,tamDim,alfaRand,lenInterval,shortenInterval,DirEsq,color)
    
    three_obj = fracParts.map( el =>{
        let x1 = el.x/cW
        let y1 = el.y/cH
        let x2 = (el.x + Math.cos(el.ang)*el.len)/cW
        let y2 = (el.y + Math.sin(el.ang)*el.len)/cH
        let wid = el.wid/cW
        return new threePart(x1,y1,x2,y2,wid,el.color,el.iteration_number)
    })
}
function random_color(){
    function c() {
        let hex = Math.floor(Math.random()*256).toString(16)
        return ("0"+String(hex)).substr(-2)
    }
    return "#"+c()+c()+c()
}
function randomize_tree(){
    it = (3+Math.floor(Math.random()*7))
    DirEsq = (15-Math.floor(Math.random()*30))
    alfaRand = (Math.floor(Math.random()*100))
    lenInterval = (Math.floor(Math.random()*tam))
    shortenInterval = (0.05+Math.floor(Math.random()*0.05))
    gradient_checkbox.checked = Math.random()>0.5
    gradient_active = gradient_checkbox.checked
    line_width = (0.3+Math.random()*0.9)
    
    gradient_color_1.value = random_color()
    gradient_color_2.value = random_color()
    linear_gradient.initial_vector.r = parseInt(gradient_color_1.value.substr(1,2), 16)
    linear_gradient.initial_vector.g = parseInt(gradient_color_1.value.substr(3,2), 16)
    linear_gradient.initial_vector.b = parseInt(gradient_color_1.value.substr(5,2), 16)
    linear_gradient.final_vector.r = parseInt(gradient_color_2.value.substr(1,2), 16)
    linear_gradient.final_vector.g = parseInt(gradient_color_2.value.substr(3,2), 16)
    linear_gradient.final_vector.b = parseInt(gradient_color_2.value.substr(5,2), 16)
    color = gradient_color_1.value
    atribute_values_to_range()
    render()
}
function randomize_color(){
    gradient_color_1.value = random_color()
    gradient_color_2.value = random_color()
    // background_color.value = random_color()

    linear_gradient.initial_vector.r = parseInt(gradient_color_1.value.substr(1,2), 16)
    linear_gradient.initial_vector.g = parseInt(gradient_color_1.value.substr(3,2), 16)
    linear_gradient.initial_vector.b = parseInt(gradient_color_1.value.substr(5,2), 16)
    linear_gradient.final_vector.r = parseInt(gradient_color_2.value.substr(1,2), 16)
    linear_gradient.final_vector.g = parseInt(gradient_color_2.value.substr(3,2), 16)
    linear_gradient.final_vector.b = parseInt(gradient_color_2.value.substr(5,2), 16)
    color = gradient_color_1.value
    gradient_checkbox.checked = Math.random()>0.5
    gradient_active = gradient_checkbox.checked
    console.log(background_color.value)
    atribute_values_to_range()
    update_gradient()
}



function update_file_name(){
    let alfabeto = "abcdefghijklmnopqrstuvwxyz_1234567890- "
    if(file_name.value.toLowerCase().split("").every(el => alfabeto.indexOf(el)!= -1) && !file_name.value==""){
        file = file_name.value
    }else{
        file = "randomthree"
    }
    file_name.value = file
}
function update_box_size(){
    image_width = parseInt(document.querySelector("#box_size").value)
    image_height = image_width
    image_canvas.width = image_width     
    image_canvas.height= image_height 

    document.getElementById("s_box_size").innerText = "Box size: "+image_width

}
function download_image(){  
    c_i.clearRect(0,0,image_width,image_height)   
    c_i.fillStyle = background_color.value
    c_i.fillRect(0,0,image_width,image_height)
    for(let i in three_obj){
        three_obj[i].draw()
    }   

    let canvasDataURL = image_canvas.toDataURL()
    let download = document.createElement('a')
    download.href = canvasDataURL
    download.download = `${file}${file=="randomthree"?counter:""}`
    counter+=1
    download.click()
}



function render(){    
    c.clearRect(0,0,canvas.width,canvas.height)

    atribute_values()

    generate_fractal_three()
    
    for(let i in fracParts){
        fracParts[i].draw()
    }    
} 

document.getElementById("increment").value = tam
file_name.value = file
document.querySelector("#box_size").value = image_width
atribute_values_to_range()
atribute_values()
randomize_tree()

render()


document.addEventListener("mousemove", (event)=>{
    if(event.clientX < 350){
        document.getElementById("btn-tutorial").style.opacity = "1"
        document.getElementById("btn-tutorial").style.transition = "1s"
    }else{
        document.getElementById("btn-tutorial").style.opacity = "0"
        document.getElementById("btn-tutorial").style.transition = "10s"
    }
})