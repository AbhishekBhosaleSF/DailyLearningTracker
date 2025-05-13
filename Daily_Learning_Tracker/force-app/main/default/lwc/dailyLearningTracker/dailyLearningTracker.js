import { LightningElement, track } from 'lwc';
import getDailyLearnings from '@salesforce/apex/DailyLearningController.getDailyLearnings';
import createDailyLearning from '@salesforce/apex/DailyLearningController.createDailyLearning';
import updateDailyLearning from '@salesforce/apex/DailyLearningController.updateDailyLearning';
import deleteDailyLearning from '@salesforce/apex/DailyLearningController.deleteDailyLearning';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DailyLearningTracker extends LightningElement {
    @track learnings = [];
    @track showForm = false;
    @track form = {
        Id: null,
        Learning_Date__c: '',
        Topic__c: '',
        Concept__c: '',
        Description__c: '',
        Status__c: ''
    };

    topicOptions = [
        { label: 'Admin', value: 'Admin' },
        { label: 'Flows', value: 'Flows' },
        { label: 'LWC', value: 'LWC' },
        { label: 'API Integration', value: 'API Integration' }
    ];

    statusOptions = [
        { label: 'In progress', value: 'In progress' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Have to Learn', value: 'Have to Learn' },
        { label: 'Having Issue', value: 'Having Issue' }
    ];

    connectedCallback() {
        this.loadLearnings();
    }

    // Inject rich HTML from Description__c into the DOM after render
    renderedCallback() {
        this.learnings.forEach(learning => {
            const div = this.template.querySelector(`div[data-id="${learning.Id}"]`);
            if (div) {
                div.innerHTML = learning.Description__c || '';
            }
        });
    }

    loadLearnings() {
        getDailyLearnings()
            .then(data => this.learnings = data)
            .catch(error => {
                console.error('Error loading records', error);
                this.showToast('Error', 'Failed to load learning records.', 'error');
            });
    }

    handleAdd() {
        this.resetForm();
        this.showForm = true;
    }

    handleEdit(event) {
        const id = event.target.dataset.id;
        const record = this.learnings.find(l => l.Id === id);
        this.form = { ...record };
        this.showForm = true;
    }

    handleDelete(event) {
        const id = event.target.dataset.id;
        deleteDailyLearning({ recordId: id })
            .then(() => {
                this.showToast('Deleted', 'Learning entry deleted', 'success');
                this.loadLearnings();
            })
            .catch(error => {
                console.error('Delete error', error);
                this.showToast('Error', 'Failed to delete record.', 'error');
            });
    }

    handleInputChange(event) {
        const field = event.target.dataset.field;
        const value = event.target.value;

        this.form = {
            ...this.form,
            [field]: value
        };
    }

    handleSave() {
        const isUpdate = this.form.Id !== null;
        const action = isUpdate ? updateDailyLearning : createDailyLearning;

        const learningRecord = {
            ...this.form,
            Learning_Date__c: this.form.Learning_Date__c
                ? this.form.Learning_Date__c
                : null
        };

        action({ learning: learningRecord })
            .then(() => {
                const msg = isUpdate ? 'Learning updated' : 'New learning added';
                this.showToast('Success', msg, 'success');

                this.showForm = false;
                this.resetForm();
                this.loadLearnings();
            })
            .catch(error => {
                console.error('Save error', JSON.stringify(error));
                this.showToast('Error', 'Something went wrong while saving', 'error');
            });
    }

    handleCancel() {
        this.showForm = false;
        this.resetForm();
    }

    resetForm() {
        this.form = {
            Id: null,
            Learning_Date__c: '',
            Topic__c: '',
            Concept__c: '',
            Description__c: '',
            Status__c: ''
        };
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}