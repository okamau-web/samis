 const CASE_STATUS = {
  REPORTED: "Reported",
  ASSIGNED: "Assigned",
  UNDER_INVESTIGATION: "Under Investigation",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const CASE_STATUS_LIST = Object.values(CASE_STATUS);

const CASE_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

const CASE_PRIORITY_LIST = 
Object.values(CASE_PRIORITY);

module.exports = {
  CASE_STATUS,
  CASE_STATUS_LIST,
  CASE_PRIORITY,
  CASE_PRIORITY_LIST,
};