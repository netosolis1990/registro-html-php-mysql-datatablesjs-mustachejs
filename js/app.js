$(document).ready(function() {
	//Parte para validar los campos del formulario cuando lo enviamos
	fn = $('#form_registro');
    fn.bootstrapValidator({
        message: 'El valor no es valido.',
        //fields: name de los inputs del formulario, la regla que debe cumplir y el mensaje que mostrara si no cumple la regla
        fields: {
                nombre: {
                        validators: {
                                notEmpty: {
                                        message: 'Este campo es requerido.'
                                }
                        }
                },
                pais: {
                        validators: {
                                notEmpty: {
                                        message: 'Este campo es requerido.'
                                }
                        }
                },
                profesion: {
                      validators: {
                                notEmpty: {
                                        message: 'Este campo es requerido.'
                                }
                        }  
                },
                email: {
                	    validators: {
                                notEmpty: {
                                        message: 'Este campo es requerido.'
                                },
                                emailAddress:{
                                        message: 'El correo no es valido.'
                                }
                        }
                }
                
        },
        //cuando el formulario se lleno correctamente y lo enviamos nos dirijira a esta funcion
        submitHandler: function(validator, form, submitButton) {
            //mediante AJAX enviaremos el formulario serilizado al servidor
			$.get('servidor/servidor.php',fn.serialize(), function(data) {
            	//tomaremos la respuesta del servidor y mostraremos los datos correspondiente
            	//data es la respuesta, regresara 2 parametros exito y mensage
            	if(data.exito){
            		nota('success',data.mensage);
            		getUsuarios();
            		fn[0].reset();
            	}	
            	else{
            		nota('error',data.mensage);
            	}
            });
        }
    });

	getUsuarios();
});

//funcion para mostrar los usuarios registrados en la BD
function getUsuarios(){
	//Peticion AJAX al servidor para que nos devuelva los usuarios
	$.get('servidor/servidor.php',{getusuarios:true}, function(data) {

		//Esta parte creamos una tabla dinamica con mustacheJS https://github.com/janl/mustache.js
		var template = "<table id='table' class='table table-striped table-bordered' cellspacing='0' width='100%''><thead><th>Id</th><th>Nombre</th><th>Email</th><th>País</th><th>Profesión</th></thead><tbody>";
		template += "{{#usuarios}}<tr><td>{{id}}</td><td>{{nombre}}</td><td>{{email}}</td><td>{{pais}}</td><td>{{profesion}}</td></tr>{{/usuarios}}";
		template += "</tbody></table>";
		datos = '{"usuarios":'+data.usuarios+"}";
		var html = Mustache.to_html(template, $.parseJSON(datos));
		//actualizamos el div 'tabla' con el template creado por mustache
		$('#tabla').html(html);
		//usando la libreria DataTableJS para crear una paginacion y poder buscar los resgistros http://www.datatables.net/
		$('#table').DataTable();
	});
}

//funcion para enviar notificaciones al usuario la libreria la descargas de http://ned.im/noty/
function nota(op,msg,time){
    if(time == undefined)time = 5000;
    var n = noty({text:msg,maxVisible: 1,type:op,killer:true,timeout:time,layout: 'top'});
}