public with sharing class KeyInformationService {
  public static List<KeyInformation__c> getKeyInformationForRecord(
    Id recordId
  ) {
    Id userId = UserInfo.getUserId();
    String objectAPIName = recordId.getSObjectType().getDescribe().getName();

    List<KeyInformation__c> keyInformationFromUser = new KeyInformationSelector()
      .getKeyInformationWithObjectAndUser(objectAPIName, userId);

    if (!keyInformationFromUser.isEmpty()) {
      return keyInformationFromUser;
    }

    KeyInformation__c keyInformation = KeyInformationDomain.createNewKeyInformationWithFieldName(
      objectAPIName,
      userId
    );
    return new List<KeyInformation__c>{ keyInformation };
  }
}
