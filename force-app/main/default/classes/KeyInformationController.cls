public with sharing class KeyInformationController {
  @AuraEnabled
  public static List<KeyInformation__c> getKeyInformationForRecord(
    Id recordId
  ) {
    try {
      return KeyInformationService.getKeyInformationForRecord(recordId);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
