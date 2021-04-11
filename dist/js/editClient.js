import { SectionChanger } from './app.js';
import { PrintAlert } from './newClient.js';
import { PrintClients } from './getClients.js';
export let editID = 0;

export function EventsEdit(p_editBtns){
    p_editBtns.forEach((btn) => {
        btn.addEventListener('click', EditClient);
    });
}
export function EventsDelete(p_deleteBtns){
    p_deleteBtns.forEach((btn) => {
        btn.addEventListener('click', RemoveClient);
    });
}



function EditClient(e){
    SectionChanger('clientsSectionBtn', 'newClientsSectionBtn', 'currentClientsSection', 'newClientSection');
    document.querySelector('#mainHeader').textContent = 'Edit Client';
    const ident = e.target.parentElement.parentElement.dataset.id;
    const request = window.indexedDB.open('Crm');

    request.onsuccess = function(){
        const db = this.result;
        const getTransaction = db.transaction('crm');
        const getObjectStore = getTransaction.objectStore('crm');

        getObjectStore.get(parseInt(ident)).onsuccess = function(){
            const {name, email, phone, company, id} = this.result;
            editID = id;
            document.querySelector('#newClientForm').dataset.function = 'edit';

            document.querySelector('#name').value = name;
            document.querySelector('#email').value = email;
            document.querySelector('#phone').value = phone;
            document.querySelector('#company').value = company;
            document.querySelectorAll('#newClientSection form fieldset').forEach((e)=>{
                e.classList.add('active');
            });


        };
    };
}
function RemoveClient(e){
    const ident = e.target.parentElement.parentElement.dataset.id;
    const request = window.indexedDB.open('Crm');

    request.onsuccess = function() {
        const deleteTransaction = this.result.transaction('crm', 'readwrite');
        const deleteObjectStore = deleteTransaction.objectStore('crm');
        deleteObjectStore.delete(parseInt(ident)).onsuccess = function(){
            PrintAlert('Contacto eliminado');
        };

        deleteObjectStore.getAll().onsuccess = function(){
            PrintClients(this.result);
        };
        deleteObjectStore.getAll().onerror = function(){
            PrintAlert('No pudieron recuperarse los clientes', 'error');
        };
    }
}
