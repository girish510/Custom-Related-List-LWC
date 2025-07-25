/**
* @File Name : ProjectTaskController.cls
* @Description : this controller is used to handle the all backend functionality for Project task List Lwc component.
* @Author : Girish Nagar
* @Last Modified By : Girish Nagar
* @Last Modified On : July 18, 2025
* @Modification Log : 
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | July 18, 2025 |   | Initial Version
**/

public with sharing class ProjectTaskController {
    @AuraEnabled(cacheable=true)
    public static List<Project_Task__c> getTasks(Id accountId) {
        return [SELECT Id, Name, Status__c, Due_Date__c FROM Project_Task__c WHERE Account__c = :accountId ORDER BY CreatedDate DESC];
    }

    @AuraEnabled
    public static void createTask(Project_Task__c task) {
        insert task;
    }
	
	 @AuraEnabled(cacheable=true)
    public static List<String> getStatusPicklist() {
        // Use DescribeFieldResult for picklist
        List<String> options = new List<String>();
        Schema.DescribeFieldResult fieldResult = Project_Task__c.Status__c.getDescribe();
        for (Schema.PicklistEntry entry : fieldResult.getPicklistValues()) {
            options.add(entry.getLabel());
        }
        return options;
    }

}