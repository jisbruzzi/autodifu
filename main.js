function arreglarTexto(texto,estilo,anchoMaximo){
    estilo = new PIXI.TextStyle(estilo)
    function ancho(texto){
        return new PIXI.TextMetrics.measureText(texto,estilo).width
    }
    function arreglarLinea(texto){
        let anchoTexto = ancho(texto)
        if(anchoTexto>anchoMaximo){
            let lineas = [""]

            for(let palabra of texto.split(" ")){
                if(ancho(lineas[lineas.length-1]+palabra)>anchoMaximo){
                    lineas.push("")
                }
                if(lineas[lineas.length-1]==""){
                    lineas[lineas.length-1]+=palabra
                }else{
                    lineas[lineas.length-1]+=" " + palabra
                }
            }
            return lineas.join("\n")

        }else{
            return texto
        }
    }

    return texto.split("\n").map(arreglarLinea).join("\n")
}

function textoDeFecha(fecha){
    console.log(fecha)
    fecha = new Date(Date.parse(fecha))
    let textoDia=""
    let dia = fecha.getUTCDate()
    if(dia<10){
        textoDia="0"+dia
    }else{
        textoDia=""+dia
    }
    let meses=[
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ]
    let textoMes=meses[fecha.getMonth()]
    
    return textoDia+" de "+textoMes
}

function deformarAnchoMaximo(elemento,anchoMaximo){
    if(elemento.width>anchoMaximo){
        elemento.height*=anchoMaximo/elemento.width
        elemento.width=anchoMaximo
    }
}

function deformarAltoMaximo(elemento,altoMaximo){
    if(elemento.height>altoMaximo){
        elemento.width*=altoMaximo/elemento.height
        elemento.height=altoMaximo
    }
}

function deformarAnchoMinimo(elemento,acnhoMinimo){
    if(elemento.width<acnhoMinimo){
        elemento.height*=acnhoMinimo/elemento.width
        elemento.width=acnhoMinimo
    }
}


function armarStage(stage, nombreDelSanto,  tituloDelSanto, fecha, descripcion, imagenSanto){

    //nubes
    let fondo = PIXI.Sprite.from("./fondo.png")
    stage.addChild(fondo)

    //imagen santo
    if(imagenSanto!=null){
        let elementoImagenSanto=PIXI.Sprite.from(PIXI.Texture.from(imagenSanto))

        deformarAnchoMinimo(elementoImagenSanto,1080*3/4)
        deformarAltoMaximo(elementoImagenSanto,1080*11/16)

        elementoImagenSanto.x=1080-elementoImagenSanto.width
        elementoImagenSanto.y=1080-elementoImagenSanto.height
        stage.addChild(elementoImagenSanto)
    }

    //nombre del santo
    let nombreDelSantoMayus=nombreDelSanto.toLocaleUpperCase()
    let nombre = new PIXI.Text(nombreDelSantoMayus,{
        fontFamily:"Roboto",
        fontWeight:900,
        fontSize:95,
        strokeThickness:2,
        fill:0xfe9717,
        stroke:0xfe9717
    });
    nombre.x=75
    nombre.y=132
    deformarAnchoMaximo(nombre,1080-75*2)
    stage.addChild(nombre);

    //titulo del santo
    let titulo=null
    if(tituloDelSanto.length>0){
        let tituloDelSantoMayus=tituloDelSanto.toLocaleUpperCase()
        titulo = new PIXI.Text(tituloDelSantoMayus,{
            fontFamily:"Roboto",
            fontWeight:900,
            fontSize:52,
            strokeThickness:2,
            fill:0xfe9717,
            stroke:0xfe9717
        });
        titulo.x=nombre.x
        titulo.y=nombre.y + nombre.height-15
        deformarAnchoMaximo(titulo,1080-75*2)
        stage.addChild(titulo);
    }


    //fondo de la fecha (rectángulo naranja)
   let fondoFecha=new PIXI.Graphics();
   fondoFecha.beginFill(0xfe9717)
   fondoFecha.moveTo(0,0)
   fondoFecha.lineTo(0,48)
   fondoFecha.lineTo(323,48)
   fondoFecha.lineTo(323,0)
   fondoFecha.lineTo(0,0)
   fondoFecha.x=71
   fondoFecha.y=72
   fondoFecha.endFill()

   stage.addChild(fondoFecha)

   //fecha
   let elementoFecha = new PIXI.Text(textoDeFecha(fecha)+" ",{
        fontFamily:"Yellowtail",
        fontSize:48,
        fill:"white",
    });
    elementoFecha.x = fondoFecha.x + (fondoFecha.width-elementoFecha.width)/2
    elementoFecha.y = 65

    stage.addChild(elementoFecha)

    //texto
    let estiloDescripcion={
        fontFamily:"Arial",
        fontSize:25,
        fill:"white",
        fontWeight:"bold",
    };
    let descripcionArreglada=arreglarTexto(descripcion,estiloDescripcion,1080-75*2)
    let elementoDescripcion = new PIXI.Text(descripcionArreglada,estiloDescripcion)
    elementoDescripcion.x=nombre.x
    elementoDescripcion.y=(titulo||nombre).y+(titulo||nombre).height
    stage.addChild(elementoDescripcion)


    //logo
    let logo = PIXI.Sprite.from("./logo.png")
    logo.x=71
    logo.y=883
    stage.addChild(logo)
}

function cargarImagen(id){
    let uploader = document.getElementById(id)
    if ( uploader.files && uploader.files[0] ) {

        return new Promise((resolve,reject)=>{

            let FR = new FileReader();
            FR.onload = function(e) {
                let img = new Image();
                img.addEventListener("load", function() {
                    resolve(img)
                });
                img.src = e.target.result;
            };       
            FR.readAsDataURL( uploader.files[0] );

        })
        
    }else{
        return Promise.resolve(null)
    }
}


function main (){
    let app = new PIXI.Application({width: 1080, height: 1080});
    //Add the canvas that Pixi automatically created for you to the HTML document
    
    document.getElementById("pixiContainer").appendChild(app.view);

    let descripcion=`El que madruga, Dios lo ayuda.
Al que no madruga, Dios también lo ayuda.
Porque Dios los ayuda a todos, aunque no madruguen.

Al que peca, Dios lo educa. Y si UD. no madruga porque peca, Dios lo está educando.
    `
    armarStage(app.stage,"San José","Obrero","2020-04-05",descripcion)

    let idControles=[
        "nombre",
        "titulo",
        "fecha",
        "descripcion",
        "imagenSanto"
    ]
    function eventoCambio(){
        let valores={}
        for(let idControl of idControles){
            valores[idControl]=document.getElementById(idControl).value
        }

        

        cargarImagen("imagenSanto").then((imagenSanto)=>{
            for(let child of app.stage.children){
                app.stage.removeChild(child)
            }

            armarStage(app.stage,valores["nombre"],valores["titulo"],valores["fecha"],valores["descripcion"],imagenSanto)

        })

        
        
    }
    for(let idControl of idControles){
        let ev = ()=>setTimeout(eventoCambio,10)
        document.getElementById(idControl).addEventListener("change",ev)
        document.getElementById(idControl).addEventListener("keydown",ev)
        document.getElementById(idControl).addEventListener("keyup",ev)
    }
    
}
window.onload = function(){
    WebFont.load({
        active:main,
        google:{families:["Roboto:black","Yellowtail"
        ]}
    })
    
}