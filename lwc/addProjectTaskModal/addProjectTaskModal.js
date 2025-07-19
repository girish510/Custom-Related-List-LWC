import { LightningElement, api, track } from 'lwc';
import createTask from '@salesforce/apex/ProjectTaskController.createTask';
import getStatusPicklistValues from '@salesforce/apex/ProjectTaskController.getStatusPicklist';

export default class AddProjectTaskModal extends LightningElement {
    @api accountId;
    @track taskName = '';
    @track status = '';
    @track dueDate = '';
    @track statusOptions = [];

    connectedCallback() {
        getStatusPicklistValues()
            .then(result => {
                this.statusOptions = result.map(value => ({
                    label: value,
                    value: value
                }));
            })
            .catch(error => {
                console.error('Error retrieving status values:', error);
            });
    }

    handleChange(event) {
        const field = event.target.dataset.id;
        const value = event.target.value;

        if (field === 'Name') this.taskName = value;
        if (field === 'Status__c') this.status = value;
        if (field === 'Due_Date__c') this.dueDate = value;
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleSave() {
        const task = {
            Name: this.taskName,
            Status__c: this.status,
            Due_Date__c: this.dueDate,
            Account__c: this.accountId
        };
        console.log('task---->'+JSON.stringify(task));
        createTask({ task: task })
            .then(() => {
                this.dispatchEvent(new CustomEvent('taskcreated'));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}