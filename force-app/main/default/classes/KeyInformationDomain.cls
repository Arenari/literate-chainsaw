public with sharing class KeyInformationDomain {
  public static KeyInformation__c createNewKeyInformationWithFieldName(
    String salesforceObject,
    Id userId
  ) {
    KeyInformation__c keyInformation = new KeyInformation__c(
      Field__c = 'Name',
      SalesforceObject__c = salesforceObject,
      User__c = userId
    );
    insert keyInformation;
    return keyInformation;
  }
}
