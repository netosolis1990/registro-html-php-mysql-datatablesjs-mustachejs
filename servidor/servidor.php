<?php

//Le decimos a PHP que vamos a devolver objetos JSON
header('Content-type: application/json');

//Importamos la libreria de ActiveRecord
require_once 'php-activerecord/ActiveRecord.php';

//Configuracion de ActiveRecord
ActiveRecord\Config::initialize(function($cfg)
{
	//Ruta de una carpeta que contiene los modelos de la BD (tablas)
	$cfg->set_model_directory('models');
	//Creamos la conexion
	$cfg->set_connections(array(
		'development' => 'mysql://USUARIO:PASS@HOST/NOMBRE_BD'));
});

//

//Checamos si tenemos peticiones para realizar alguna operacion
if($_GET){
	//Verificamos si hay una peticion para un nuevo usuario
	if(isset($_GET['nombre']) && isset($_GET['profesion']) && isset($_GET['email']) && isset($_GET['pais'])){
		 try{
		 	//Creamos el nuevo usuario con los datos enviados desde el formulario
			 $usuario = Usuario::create($_GET);
			 //Si no hubo error al crear el usuario regresamos un mensage en formato JSON
			 if($usuario){
			 	$respuesta['exito'] = true;
			 	$respuesta['mensage'] = 'Usuario registrado correctamente';
			 	echo json_encode($respuesta);
			 	return;
			 }
			 //si ocurrio algun error al guardar al usuario regresamos el mensage
			 else{
			 	$respuesta['exito'] = false;
			 	$respuesta['mensage'] = 'Error al registrar.';
			 	echo json_encode($respuesta);
			 	return;
			 }
		}catch(Exception $e){
			//si ocurre esta excepcion es por que el correo ya fue registrado (el email en la BD es unico)
			$respuesta['exito'] = false;
		 	$respuesta['mensage'] = 'El email ya esta registrado';
		 	echo json_encode($respuesta);
		 	return;
		}
	}
	//Verificamos si el usuario hiso una peticion para ver los usuarios registrados
	if(isset($_GET['getusuarios'])){
		//con la siguiente sentencia la tomamos de la BD todos los registros de la tabla usuario
		$usuarios = Usuario::find('all');
		//convertimos los registros a JSON y los enviamos la respuesta
		$respuesta['usuarios'] = datosJSON($usuarios);
		echo json_encode($respuesta);
		return;
	}else{
		//respuesta para una operacion desconocida
		$respuesta['exito'] = false;
		$respuesta['mensage'] = 'Operación desconocida';
		echo json_encode($respuesta);
		return;
	}
}

//funcio que convierte objetos regresados por la BD a JSON
function datosJSON($data, $options = null) {
	$out = "[";
	foreach( $data as $row) { 
		if ($options != null)
			$out .= $row->to_json($options);
		else 
			$out .= $row->to_json();
		$out .= ",";
	}
	$out = rtrim($out, ',');
	$out .= "]";
	return $out;
}


?>