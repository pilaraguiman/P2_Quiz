
const fs= require("fs");

//Nombre del fichero donde se guardan las preguntas
const DB_FILENAME ="quizzes.json";


//Modelo de datos
// En esta variable tenemos todos los quizzes exiatentes
let quizzes =[
	{
		question: "Nombre del primo de Harry Potter",
		answer: "Dursley"
	},
	{
		question: "Forma de la cicatriz de Harry Potter",
		answer: "Rayo"
	},
	{
		question: "Nombre en clave que le dan los protagonistas a Sirius",
		answer: "Hocicos"
	},
	{
		question: "Cerveza de....",
		answer: "mantequilla"
	}
];


const load = () => {
	fs.readFile(DB_FILENAME, (err, data) => {
		if(err) {
			//la primera vez no existe el fichero
			if(err.code === "ENOENT"){
				save();//valores iniciales
				return;
			}
			throw err;
		}
		let json =JSON.parse(data);
		if(json){
			quizzes =json;
		}
	});
};

const save = () => {
	fs.writeFile(DB_FILENAME, 
		JSON.stringify(quizzes),
		err => {
			if(err) throw err;
		});
};

// Devuelve el numero total de preguntas existentes
exports.count=()=> quizzes.length;
/**Añade un nuevo quiz
*/
exports.add=(question,answer)=> {

	quizzes.push({
		question: (question || "").trim(),
		answer:(answer || "").trim()  
	});
	save();
};

/**Para actualizar un quiz
*/
exports.update=(id, question, answer) => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error(`El valor del parametro id no es valido`);
	}
	quizzes.splice(id, 1,{
		question: (question || "").trim(),
		answer:(answer || "").trim()
	});
	save();
};

/**Devuelve todos los quizzes existentes
*/
exports.getAll= ()=> JSON.parse(JSON.stringify(quizzes));

/** Devuelve un clon del quiz almacenado en la posicion dada*/
exports.getByIndex =id =>{
	const quiz = quizzes[id];
	if (typeof quiz=== "undefined"){
		throw new Error(`El valor del parametro id no es valido`);
	}
	return JSON.parse(JSON.stringify(quiz));
};

/** Elimina el quiz situado en la posicion dada*/

exports.deleteByIndex =id =>{
	const quiz = quizzes[id];
	if (typeof quiz=== "undefined"){
		throw new Error(`El valor del parametro id no es valido`);
	}
	quizzes.splice(id, 1);
	save();
};

//carga los quizzes almacenados en el fichero
load();
