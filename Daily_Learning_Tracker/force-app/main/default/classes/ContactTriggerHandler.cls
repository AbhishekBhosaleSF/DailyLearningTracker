public class ContactTriggerHandler {
    public static void handleBeforeInsert(List<Contact> newContacts) {
        Map<Id, Account> contactToAccountMap = new Map<Id, Account>();
        List<Account> accountsToInsert = new List<Account>();

        for (Contact con : newContacts) {
            if (con.AccountId == null) {
                Account acct = new Account(Name = con.LastName + ' Household');
                accountsToInsert.add(acct);
                contactToAccountMap.put(con.Id, acct);
            }
        }

        if (!accountsToInsert.isEmpty()) {
            insert accountsToInsert;
            Integer i = 0;
            for (Contact con : newContacts) {
                if (contactToAccountMap.containsKey(con.Id)) {
                    con.AccountId = accountsToInsert[i].Id;
                    i++;
                }
            }
        }
    }
}
