import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LearningModal extends LightningElement {
    @api recordId;
    @track isOpen = false;

    get modalTitle() {
        return this.recordId ? 'Edit Learning' : 'Add Learning';
    }

    @api openModal() {
        this.isOpen = true;
    }

    @api closeModal() {
        this.isOpen = false;
    }

    handleSuccess(event) {
        try {
            this.dispatchEvent(new CustomEvent('save'));
            this.closeModal();
        } catch (error) {
            console.error('Error in handleSuccess:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Unexpected Error',
                    message: error.message,
                    variant: 'error'
                })
            );
        }
    }
    

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
        this.closeModal();
    }

    handleError(event) {
        console.error('Save failed:', event.detail);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error saving record',
                message: 'Please check required fields or permissions.',
                variant: 'error'
            })
        );
    }
}