public with sharing class KeyInformationSelector {
  public List<KeyInformation__c> getKeyInformationWithObjectAndUser(
    String objectAPIName,
    Id userId
  ) {
    return [
      SELECT Id, Field__c, SalesforceObject__c
      FROM KeyInformation__c
      WHERE SalesforceObject__c = :objectAPIName AND User__c = :userId
      WITH SECURITY_ENFORCED
    ];
  }
}
