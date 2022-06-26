import { LightningElement, api, track, wire } from "lwc";
import getKeyInformationForRecord from "@salesforce/apex/KeyInformationController.getKeyInformationForRecord";
import { getRecord } from "lightning/uiRecordApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class KeyInformation extends LightningElement {
  @api recordId;
  @track keyInformations = [];
  @track fields;
  @track record;
  @track error;

  get hasKeyInformation() {
    return this.keyInformations.length > 0;
  }

  get hasRecord() {
    return this.record;
  }

  get hasObjectInfo() {
    return this.objectInfo && this.objectInfo.data;
  }

  get hasRecordAndObjectInfo() {
    return this.hasRecord && this.hasObjectInfo;
  }

  get objectApiName() {
    if (this.hasKeyInformation)
      return this.keyInformations[0].SalesforceObject__c;
  }

  get keyInformationsToDisplay() {
    return this.keyInformations.map(
      (keyInformation) => keyInformation.Field__c
    );
  }

  get hasKeyInfoAndRecord() {
    return this.hasKeyInformation && this.record;
  }

  getFields() {
    if (this.hasKeyInformation)
      return this.keyInformations.map(
        (keyInformation) =>
          `${keyInformation.SalesforceObject__c}.${keyInformation.Field__c}`
      );
    return [];
  }

  connectedCallback() {
    this.setKeyInformations(this.recordId);
  }

  @wire(getObjectInfo, { objectApiName: "$objectApiName" })
  objectInfo;

  @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
  handleRecord({ data, error }) {
    if (data) {
      this.record = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.record = undefined;
    }
  }

  get recordFields() {
    if (this.hasRecordAndObjectInfo) {
      let recordFields = [];
      for (let field in this.record.fields) {
        const label = this.objectInfo.data.fields[field].label;
        const value = this.record.fields[field].value;
        recordFields.push({
          label,
          value,
          field
        });
      }
      return recordFields;
    }
    return [];
  }

  handleSubmit(event) {
    event.preventDefault();
    const fields = event.detail.fields;
    if (this.isValidField(fields.Field__c)) {
      this.template.querySelector("lightning-record-edit-form").submit(fields);
    } else {
      this.showInvalidFieldToast();
    }
  }

  showInvalidFieldToast() {
    const event = new ShowToastEvent({
      title: "Error",
      message: "Invalid field on key information.",
      variant: "error"
    });
    this.dispatchEvent(event);
  }

  isValidField(field) {
    return this.hasObjectInfo && !!this.objectInfo.data.fields[field];
  }

  handleSuccess() {
    this.setKeyInformations(this.recordId);
  }

  setKeyInformations(recordId) {
    getKeyInformationForRecord({ recordId })
      .then((result) => {
        this.keyInformations = result;
        this.fields = this.getFields();
        this.error = undefined;
      })
      .catch((error) => {
        this.error = error;
        this.keyInformation = undefined;
      });
  }
}
