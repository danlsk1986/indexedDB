let DB;

//Selectores de la interfaz

const formulario = document.querySelector('form'),
      nombreMascota = document.querySelector('#mascota'),
      nombreCliente = document.querySelector('#cliente'),
      telefono = document.querySelector('#telefono'),
      fecha = document.querySelector('#fecha'),
      hora = document.querySelector('#hora'),
      sintomas = document.querySelector('#sintomas'),
      citas = document.querySelector('#citas'),
      headingAdministra = document.querySelector('#administra');


// Esperar el DOM ready

document.addEventListener('DOMContentLoaded', () => {
    //Crear la Base de datos
    let crearDB = window.indexedDB.open('citas', 1);

    //Si hay un error enviarlo a la consola
    crearDB.onerror = function() {
        console.log('Hubo un error..');
    }

    crearDB.onsuccess = function() {
        //console.log('Todo listo!!');

        //Asignar a la variable
        DB = crearDB.result;
        //console.log(DB);
    }

    // este metodo solo corre una sola vez y es idea para crear el Schema
    crearDB.onupgradeneeded = function(e){
       //El evento es la misma base de Datos.
       let db = e.target.result;

      // definir el objectstore, toma 2 parametros el nombre de la base de datos y segundo las opciones\
      //keyPath es el indice de la base de datos
      let objectStore = db.createObjectStore('citas', {keyPath: 'key', autoIncrement: true });

      //Crear los indices y campos de la base datos
      objectStore.createIndex('mascota','mascota', {unique: false});
      objectStore.createIndex('cliente','cliente', {unique: false});
      objectStore.createIndex('telefono','telefono', {unique: false});
      objectStore.createIndex('fecha','fecha', {unique: false});
      objectStore.createIndex('hora','hora', {unique: false});
      objectStore.createIndex('sintomas','sintomas', {unique: false});

      console.log('Base de Datos creada y lista');

    }

    //Cuando el formulario se envia
    formulario.addEventListener('submit', agregarDatos);

    function agregarDatos(e){
        e.preventDefault();

        const nuevaCita = {
            mascota: nombreMascota.value,
            cliente: nombreCliente.value,
            telefono: telefono.value,
            fecha: fecha.value,
            hora: hora.value,
            sintomas: sintomas.value            
        }

        //En indexedDB se utilizan las trasacciones
        let transaction = DB.transaction(['citas'], 'readwrite');
        let objectStore = transaction.objectStore('citas');
        //console.log(objectStore);

        let peticion = objectStore.add(nuevaCita);

        console.log(peticion);

        peticion.onsuccess = () => {
            formulario.reset();
        }
        
        transaction.oncomplete = () => {
            console.log('Cita Agregada');
        }

        transaction.onerror = () => {
            console.log('Hubo un error!');
        }
    }
})