
const {log,biglog, errorlog, colorize}=require("./out");

const model=require ('./model'); 

/**
* Muestra la ayuda
*/
exports.helpCmd = rl => {
	log('Comandos:');
	log("  h|help - Muestra esta ayuda.");
    log("  list - Listar los quizzes existentes");
    log("  show <id> - Muestra la pregunta y la respuesta del quiz indicado");
    log("  add - Añadir nuevo Quiz interactivamente. ");
    log("  delete <id> - Borrar el quiz indicado.");
	log("  edit <id> - Editar el quiz indicado");
	log("  test <id> - Probar el quiz indicado");
	log("  p|play - Jugar a una pregunta aleatoriamente todos los quizzes");
	log("  credits - Creditos");
	log("  q|quit - Salir del programa.");
	rl.prompt();
};
/**
* Salimos del programa
*/
exports.quitCmd = rl =>{
	rl.close();

};
/**
* Añadimos un nuevo quiz
*/
exports.addCmd = rl => {
	//log('Añadir un nuevo quiz', 'red');
	rl.question(colorize(' Introduzca una pregunta:  ', 'red'), question=>{
		rl.question(colorize(' Introduzca una respuesta: ', 'red'), answer=>{
			model.add(question,answer);
			log(`${colorize('Se ha añadido','magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
			rl.prompt();
		});
	});
	
};

/**
* Listamos todos los quizzes existentes
*/
exports.listCmd = rl =>{
	//log('Listar todos los quizzes existentes', 'red');
	model.getAll().forEach((quiz,id)=>{
		log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);
	});
	rl.prompt();
};

exports.showCmd = (rl,id)=>{
	//log('Mostrar el quiz indicado', 'red');
	if (typeof id=== "undefined"){
		errorlog(`Falta el parametro id`);
	}else{
		try{
			const quiz=model.getByIndex(id);
			log(`[${colorize(id,'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
		}catch(error){
			errorlog(error.message);
		}
	}
	rl.prompt();
};

/**
* probamos el Quiz indicado
*/
exports.testCmd = (rl,id) =>{
	//log('Probar el quiz indicado');
	if (typeof id=== "undefined"){
		errorlog(`Falta el parametro id`);
	}else{
		try{
			const quiz =model.getByIndex(id);
			rl.question(colorize(quiz.question.toString() +'=>','red'), respuesta =>{
				if(quiz.answer.toLowerCase().trim() === respuesta.toLowerCase().trim()){
					biglog('CORRECTO', 'green');
					rl.prompt();
				}else{
					biglog('INCORRECTO', 'red');
					rl.prompt();
				}
			});
		}catch(error)  {
			errorlog(error.message);

		}
	}
	rl.prompt();
};

/**
* Jugamos al Quiz indicado
*/
exports.playCmd =rl=>{
	//log('Jugar.');
	let score = 0;
	let toBeAsked=[];
	let i=0;
	//meter los ids de todas las preguntas que tengo
	for (i; i< model.count(); i++)
		toBeAsked[i]=i;

	const playOne=()=>{
		if(toBeAsked.length==0){
			log(`No hay nada mas que preguntar`);
			log(`Tu resultado ha sido:`);
			biglog(score ,'magenta');
			rl.prompt();
		}else{
			let id=  Math.floor((Math.random()*toBeAsked.length));
			if(id >=0){
				try{
					//cogemos ese quiz pregunta + respuesta
					let quiz =model.getByIndex(toBeAsked[id]);
					//borramos ese id del array
					toBeAsked.splice(id,1);
					rl.question(colorize(quiz.question.toString() +'=>','red'), resultado=>{
					if(resultado.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
						score++;
						log(`Correcto - Llevas ${score} aciertos`);
						playOne();
					}else{
						log(`INCORRECTO`);
						log(`Fin del examen, Aciertos:`);
						biglog(score, 'magenta');
						rl.prompt();
				    }
				    });    
				}catch(error){
					errorlog(error.message);
					rl.prompt();
				}
			}	
		}
	};
	playOne();
};

exports.deleteCmd =(rl,id)=>{
	//log('Borrar el quiz indicado');
	if (typeof id=== "undefined"){
		errorlog(`Falta el parametro id`);
	}else{
		try{
			model.deleteByIndex(id);
		}catch(error)  {
			errorlog(error.message);
		}
	}
	rl.prompt();
};

exports.editCmd =(rl, id)=>{
	// log('Editar el quiz indicado');
	if (typeof id=== "undefined"){
		errorlog(`Falta el parametro id`);
		rl.prompt();
	}else{
		try{
			const quiz =model.getByIndex(id);

			process.stdout.isTTY && setTimeout(() =>{rl.write(quiz.question)},0);

			rl.question(colorize(' Introduzca una pregunta:  ', 'red'), question=> {

				process.stdout.isTTY && setTimeout(() =>{rl.write(quiz.answer)},0);
				rl.question(colorize(' Introduzca una respuesta ', 'red'), answer=> {
					model.update(id,question,answer);
					log(`${colorize('Se ha cambiado el quiz ','magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
					rl.prompt();
		});//cerrar parentesis despues de corchete idk
	});// cerrar parentesis despues de corchete idk
		}catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}
	
};

exports.creditsCmd =rl=>{
	log('Autores de la practica');
	log('Maria del Pilar Aguilera Manzanera', 'green');
	log('Miguel Lahera Hervilla', 'green');
	rl.prompt();
};

