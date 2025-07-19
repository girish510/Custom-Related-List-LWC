# Project Task Related List - Lightning Web Component (LWC)

This Lightning Web Component (`projectTaskList`) provides a **custom related list** of `Project_Task__c` records related to an Account. It includes the following features:

- Display `Project_Task__c` records in a datatable.
- Inline **edit** and **delete** functionality.
- "Add New Task" via a modal form.
- Pagination support.
- Total record count display with title.

---

## 👨‍💻 Component Structure

### 1. `projectTaskList`
Main component that:
- Displays the datatable
- Handles inline actions (edit/save/delete)
- Supports pagination
- Opens the child modal for task creation

### 2. `addProjectTaskModal`
Child modal component to add a new task record.

---

## 🧾 Fields Displayed

| Field Label   | API Name        | Type      |
|---------------|------------------|-----------|
| Task Name     | `Name`           | Text      |
| Account       | `Account__c`     | Lookup    |
| Status        | `Status__c`      | Picklist  |
| Due Date      | `Due_Date__c`    | Date      |

---

## 🚀 Features

### ✅ Inline Edit
- Editable fields: `Name`, `Status__c`, `Due_Date__c`
- Uses `lightning/uiRecordApi`'s `updateRecord` for efficient updates.

### 🗑️ Inline Delete
- Each row has a delete icon.
- Uses `deleteRecord()` from `lightning/uiRecordApi`.

### ➕ Add New Task
- "Add New Task" button (top-right corner).
- Opens a modal to create a new task.
- On success, closes modal and refreshes the table.

### 📄 Pagination
- "Previous" and "Next" buttons
- Dynamically calculates total pages and disables when limits reached.

### 🔢 Total Count
- Title shows count: `Project Tasks ({totalCount})`

---

## 🔧 Setup Instructions

1. **Custom Object**
   - Ensure `Project_Task__c` exists with fields: `Name`, `Account__c`, `Status__c`, `Due_Date__c`.

2. **Metadata**
   - Expose `projectTaskList` to Account Record Page via `targetConfigs`.

3. **Apex Controller**
   - An Apex class (`ProjectTaskController`) fetches and inserts `Project_Task__c` records.

4. **Component Usage**
   - Drag `projectTaskList` onto Account Lightning Page.

---

## 📦 Technologies Used

- LWC (Lightning Web Components)
- SLDS (Salesforce Lightning Design System)
- Apex (for list and create only)
- `lightning/uiRecordApi` for updates and deletes

---
