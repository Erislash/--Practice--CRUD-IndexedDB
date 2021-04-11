import { PrintAlert } from './newClient.js';
import { EventsEdit, EventsDelete } from './editClient.js';


export let editBtns = [];

(function(){
    let db;
    document.addEventListener('DOMContentLoaded', () => {
        ConnectDB();
    });

    function ConnectDB(){
        const request = window.indexedDB.open('Crm');
        request.onsuccess = function(){
            const db = this.result;
            const getClientsTransaction = db.transaction('crm');
            const getClientsOS = getClientsTransaction.objectStore('crm');

            getClientsOS.getAll().onsuccess = function(){
                PrintClients(this.result);
            };
        };

        request.onerror = function(){
            console.error(this.error);
            PrintAlert('No se pudo obtener clientes', 'error');
        };

    }

})();

export function PrintClients(p_clients){
    const currentClientsTable = document.querySelector('#currentClientsTable');
    while(currentClientsTable.querySelector('tbody').children[1]){
        currentClientsTable.querySelector('tbody').removeChild(currentClientsTable.querySelector('tbody').children[1]);
    }
    
    p_clients.forEach(client => {
        const {name, email, phone, company, id} = client;

        const newClient = document.createElement('tr');
        newClient.dataset.id = client.id;
        newClient.innerHTML = `<td>
                                    <div class="name">${name}</div>
                                    <div class="email">${email}</div>
                                </td>
                                <td>
                                    ${phone}
                                </td>
                                <td>
                                    ${company}
                                </td>
                                <td class="editRow">
                                    <i class="editClient fas fa-pen"></i>
                                    <i class="removeClient fas fa-trash"></i>
                                </td>`;
                                // <button class="editClient"><i class="fas fa-pen"></i></button>
                                //     <button class="removeClient"><i class="fas fa-trash"></i></button>
        
        currentClientsTable.querySelector('tbody').appendChild(newClient);
    });
    EventsEdit(document.querySelectorAll('.editClient'));
    EventsDelete(document.querySelectorAll('.removeClient'));
    
}
