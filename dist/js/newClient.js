import { SectionChanger } from './app.js';
import { PrintClients } from './getClients.js';
import { editID } from './editClient.js';
let form;
(function(){
    let db;
    
    document.addEventListener('DOMContentLoaded', ()=> {
        ConnectDB();

        form = document.querySelector('#newClientForm');
        form.addEventListener('submit', CheckNewClient);

    });

    function ConnectDB(){
        const request = window.indexedDB.open('Crm');

        request.onerror = function(){
            console.error(this.error);
        }
        request.onsuccess = function(){
            db = request.result;
        }
        request.onupgradeneeded = function(){
            console.error(this.error);
        }
    }
    function CheckNewClient(e){
        e.preventDefault();

        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value.toLowerCase();
        const phone = document.querySelector('#phone').value;
        const company = document.querySelector('#company').value;
    
        if(name == '' || email == '' || phone == '' || company == ''){
            PrintAlert('Todos los campos deben completarse', 'error');
            return;
        }

        if(form.dataset.function == 'add'){
            const id = Date.now();
            const client = {name, email, phone, company, id};
            CreateNewClient(client);
        }else if(form.dataset.function == 'edit'){
            const id = editID;
            const client = {name, email, phone, company, id};
            UpdateClient(client);
        }
    }
    function CreateNewClient(p_client){
        const newClientTransaction = db.transaction('crm', 'readwrite');
        const newClientObjectStore = newClientTransaction.objectStore('crm');
        const addNewClient = newClientObjectStore.add(p_client);

        addNewClient.onerror = () => {
            PrintAlert('No se pudo agregar este cliente', 'error');
            console.error(addNewClient.error);
        };

        addNewClient.onsuccess = () => {
            PrintAlert('Nuevo cliente agregado', 'success');
            console.log('Nuevo cliente agregado', p_client);
            ResetForm();
            SectionChanger('newClientsSectionBtn', 'clientsSectionBtn', 'newClientSection', 'currentClientsSection');

            const printClientTransaction = db.transaction('crm');
            const printClientObjectStore = printClientTransaction.objectStore('crm');

            printClientObjectStore.getAll().onsuccess = function(){
                PrintClients(this.result);
            };
            printClientObjectStore.getAll().onerror = function(){
                PrintAlert('No pudieron recuperarse los clientes', 'error');
            };
            
        };
    }
    function UpdateClient(p_client){

        const updateClientTransaction = db.transaction('crm', 'readwrite');
        const updateClientObjectStore = updateClientTransaction.objectStore('crm');
        const updateClient = updateClientObjectStore.put(p_client);
        updateClient.onsuccess = function(){
            PrintAlert('Contacto actualizado', 'success');

            console.log('Contacto actualizado', p_client);
            ResetForm();
            SectionChanger('newClientsSectionBtn', 'clientsSectionBtn', 'newClientSection', 'currentClientsSection');

            const printClientTransaction = db.transaction('crm');
            const printClientObjectStore = printClientTransaction.objectStore('crm');

            printClientObjectStore.getAll().onsuccess = function(){
                PrintClients(this.result);
            };
            printClientObjectStore.getAll().onerror = function(){
                PrintAlert('No pudieron recuperarse los clientes', 'error');
            };
        };

        
    }
    function ResetForm(){
        document.querySelector('#name').value = "";
        document.querySelector('#email').value = "";
        document.querySelector('#phone').value = "";
        document.querySelector('#company').value = "";
        document.querySelectorAll('#newClientSection form fieldset').forEach(p_field=>{
            p_field.classList.remove('active');
        });
    }
})();

export function PrintAlert(p_message, p_type){
    const divMessage = document.querySelector('#message');
    divMessage.textContent = p_message;
    

    if(p_type == 'success'){
        divMessage.classList.add('success');
        divMessage.classList.remove('error');
        divMessage.classList.remove('hint');
    }else if(p_type == 'error'){
        divMessage.classList.add('error');
        divMessage.classList.remove('succes');
        divMessage.classList.remove('hint');
    }else{
        divMessage.classList.add('hint');
        divMessage.classList.remove('succes');
        divMessage.classList.remove('error');
    }
}