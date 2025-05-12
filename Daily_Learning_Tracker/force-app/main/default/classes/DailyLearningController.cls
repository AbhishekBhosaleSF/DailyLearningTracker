public with sharing class DailyLearningController {
    
    @AuraEnabled(cacheable=true)
    public static List<Daily_Learning__c> getDailyLearnings() {
        return [SELECT Id, Learning_Date__c, Topic__c, Concept__c, Description__c, Status__c FROM Daily_Learning__c ORDER BY Learning_Date__c DESC];
    }

    @AuraEnabled
    public static Daily_Learning__c createDailyLearning(Daily_Learning__c learning) {
        insert learning;
        return learning;
    }

    @AuraEnabled
    public static Daily_Learning__c updateDailyLearning(Daily_Learning__c learning) {
        update learning;
        return learning;
    }

    @AuraEnabled
    public static void deleteDailyLearning(Id recordId) {
        delete [SELECT Id FROM Daily_Learning__c WHERE Id = :recordId];
    }
}