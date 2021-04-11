document.addEventListener('DOMContentLoaded', function(){

    StartApp();
    let db;
    function StartApp(){
        const sectionBtn = {
            currentClients: document.querySelector('#clientsSectionBtn'),
            newClients: document.querySelector('#newClientsSectionBtn')
        }
        const newClientFields = document.querySelectorAll('#newClientSection form fieldset');

        Events(sectionBtn, newClientFields);

        CreateDB();


    }

    function CreateDB(){
        const request = window.indexedDB.open('Crm');
        request.onerror = () => {
            console.error("Error opening Database");
        };
        request.onsuccess = () => {
            db = request.result;
        };
        request.onupgradeneeded = () => {
            db = request.result;
            const clientsStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });
            clientsStore.createIndex('nombre', 'name', { unique: false });
            clientsStore.createIndex('email', 'email', { unique: true });
            clientsStore.createIndex('telefono', 'phone', { unique: false });
            clientsStore.createIndex('empresa', 'company', { unique: false });
            clientsStore.createIndex('identificacion', 'id', { unique: true });

            console.log('Tabla creada');

        };
    }


    function Events(p_sectionBtn, p_newClientFields){
        p_sectionBtn.currentClients.addEventListener('click', function(){
            SectionChanger('newClientsSectionBtn', this.id, 'newClientSection', 'currentClientsSection');
            document.querySelector('#mainHeader').textContent = 'Clients';
        });
        p_sectionBtn.newClients.addEventListener('click', function(){
            SectionChanger('clientsSectionBtn', this.id, 'currentClientsSection', 'newClientSection');
            document.querySelector('#mainHeader').textContent = 'New Client';
            document.querySelector('#name').value = "";
            document.querySelector('#email').value = "";
            document.querySelector('#phone').value = "";
            document.querySelector('#company').value = "";
            document.querySelector('#newClientForm').dataset.function = 'add';
        });
        p_newClientFields.forEach(p_field => {
            p_field.addEventListener('input', FieldAnim);
        });
        
    }

    
    
    function FieldAnim(p_field){
        const val = p_field.target.value;
        const fieldSet = p_field.target.parentNode;
        if(val.length > 0){
            fieldSet.classList.add('active');
        }else{
            fieldSet.classList.remove('active')
        }
    }


});

export function SectionChanger(p_oldBtn, p_newBtn, p_oldSection, p_newSection){
    document.querySelector(`#${p_oldBtn}`).classList.remove('active');
    document.querySelector(`#${p_newBtn}`).classList.add('active');
    document.querySelector(`#${p_oldSection}`).style.display = 'none';
    document.querySelector(`#${p_newSection}`).style.display = 'flex';
}
