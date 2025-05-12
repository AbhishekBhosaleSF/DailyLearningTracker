trigger ContactTrigger on contact (before insert){
    if(trigger.isBefore && trigger.isInsert){
        ContactTriggerHandler.handleBeforeInsert(trigger.new);
    }
}