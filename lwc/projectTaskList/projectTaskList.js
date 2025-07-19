import { LightningElement, api, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/ProjectTaskController.getTasks';
import { updateRecord } from 'lightning/uiRecordApi';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProjectTaskList extends LightningElement {
    @api recordId;
    @track tasks = [];
    @track draftValues = [];
    @track isModalOpen = false;
    @track pageNumber = 1;
    pageSize = 5;
    wiredResult;

    get columns() {
        return [
            { label: 'Name', fieldName: 'Name', editable: true },
            { label: 'Status', fieldName: 'Status__c', editable: true },
            { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date-local', editable: true },
            {
        type: 'button-icon',
        typeAttributes: {
            iconName: 'utility:delete',
            name: 'delete',
            title: 'Delete',
            variant: 'bare',
            alternativeText: 'Delete'
        },
        fixedWidth: 50
    }
        ];
    }

    get cardTitle() {
        const count = this.tasks.length || 0;
        return `Project Tasks (${count})`;
    }

    get pagedTasks() {
        const start = (this.pageNumber - 1) * this.pageSize;
        return this.tasks.slice(start, start + this.pageSize);
        console.log('page task-->'+this.tasks);
    }

    get totalPages() {
        return Math.ceil(this.tasks.length / this.pageSize);
    }

    get disablePrev() {
        return this.pageNumber === 1;
    }

    get disableNext() {
        return this.pageNumber >= this.totalPages;
    }

    @wire(getTasks, { accountId: '$recordId' })
    wiredTasks(result) {
        this.wiredResult = result;
        if (result.data) {
            this.tasks = result.data;
        }
        console.log(' task-->'+JSON.stringify(this.tasks));
    }

    handleNext() {
        if (this.pageNumber < this.totalPages) {
            this.pageNumber++;
        }
    }

    handlePrevious() {
        if (this.pageNumber > 1) {
            this.pageNumber--;
        }
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleTaskCreated() {
        this.closeModal();
        refreshApex(this.wiredResult);
        this.showToast('Success', 'Task created successfully', 'success');
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'delete') {
            deleteRecord(row.Id)
                .then(() => {
                    this.showToast('Deleted', 'Task deleted successfully', 'success');
                    return refreshApex(this.wiredResult);
                })
                .catch(error => {
                    this.showToast('Error', error.body.message, 'error');
                });
        }
    }

    handleSave(event) {
        const updatedFields = event.detail.draftValues;

        const recordPromises = updatedFields.map(draft => {
            return updateRecord({ fields: draft });
        });

        Promise.all(recordPromises)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Records updated successfully',
                        variant: 'success'
                    })
                );
                this.draftValues = [];
                refreshApex(this.wiredResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}