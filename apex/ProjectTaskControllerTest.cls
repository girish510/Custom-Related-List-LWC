/**
* @File Name : ProjectTaskControllerTest.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : July 19, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | July 19, 2025 |   | Initial Version
**/

@isTest
public class ProjectTaskControllerTest {

    @testSetup
    static void setupData() {
        // Create test Account
        Account acc = new Account(Name = 'Test Account');
        insert acc;

        // Create test Project Task
        Project_Task__c task = new Project_Task__c(
            Name = 'Test Task',
            Account__c = acc.Id,
            Status__c = 'Not Started',  // Use one valid picklist value from your org
            Due_Date__c = Date.today().addDays(7)
        );
        insert task;
    }

    @isTest
    static void testGetTasks() {
        // Get test Account Id
        Account acc = [SELECT Id FROM Account LIMIT 1];

        // Call the method
        Test.startTest();
        List<Project_Task__c> tasks = ProjectTaskController.getTasks(acc.Id);
        Test.stopTest();

        System.assertNotEquals(null, tasks, 'Tasks list should not be null');
        System.assert(tasks.size() > 0, 'Should return at least one task');
    }

    @isTest
    static void testCreateTask() {
        // Get existing Account
        Account acc = [SELECT Id FROM Account LIMIT 1];

        // Create task to insert via Apex method
        Project_Task__c newTask = new Project_Task__c(
            Name = 'New Test Task',
            Account__c = acc.Id,
            Status__c = 'In Progress', // Use a valid status value
            Due_Date__c = Date.today().addDays(10)
        );

        Test.startTest();
        ProjectTaskController.createTask(newTask);
        Test.stopTest();

        Project_Task__c insertedTask = [SELECT Id, Name FROM Project_Task__c WHERE Name = 'New Test Task' LIMIT 1];
        System.assertEquals('New Test Task', insertedTask.Name);
    }

    @isTest
    static void testGetStatusPicklist() {
        Test.startTest();
        List<String> picklistValues = ProjectTaskController.getStatusPicklist();
        Test.stopTest();

        System.assertNotEquals(null, picklistValues, 'Picklist values should not be null');
        System.assert(picklistValues.size() > 0, 'There should be at least one picklist value');
    }
}