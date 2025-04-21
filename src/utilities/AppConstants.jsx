export const BASE_URL = 'http://localhost:3000' // DEV
// export const BASE_URL = 'http://api.uat.crm.creditmitra.in' // UATt
// export const BASE_URL = 'https://api.crm.creditmitra.in' // PROD
export const ASSIGNED_TABLE = "ASSIGNED_TABLE";
export const NOT_ASSIGNED_TABLE = "NOT_ASSIGNED_TABLE";
export const INVALID_LEADS_TABLE = "INVALID_LEADS_TABLE";
export const EX_EMPLOYEES_LEADS_TABLE = "EX_EMPLOYEES_LEADS_TABLE";
export const EXPORT_LEADS = "EXPORT_LEADS";
export const UNDER_REVIEW = "Under Review";
export const ON_HOLD = "On Hold";
export const MANAGER_1_APPROVED = "Manager 1 Approved";
export const MANAGER_2_APPROVED = "Manager 2 Approved";
export const APPROVED_FOR_WALK_IN = "Approved for Walk-In";
export const REJECTED = "Rejected";
export const NORMAL_LOGIN = "Normal Login";
export const CLOSED = "Closed";
export const LOGIN = "Login";
export const SCHEDULED_FOR_WALK_IN = "Scheduled For Walk-In";
export const SCHEDULED_CALL_WITH_MANAGER = "Scheduled Call With Manager";
export const OKAY_FOR_POLICY = "Okay for Policy";
export const THINK_AND_GET_BACK = "Think and get back";
export const TWELVE_DOCUMENTS_COLLECTED = "12 documents collected";
export const NOT_OKAY_FOR_POLICY = "Not okay for Policy";
export const OTHERS = "Others";
export const ROLE_ADMIN = "ROLE_ADMIN";
export const ROLE_MANAGER = "ROLE_MANAGER";
export const ROLE_EMPLOYEE = "ROLE_EMPLOYEE";
export const ADMIN = "Admin";
export const MANAGER = "Manager";
export const EMPLOYEE = "Employee";
export const PAYSLIP = "payslip";
export const CREDIT_BUREAU = "creditBureau";
export const OTHER_DOCS = "otherDocs";
export const PERSONAL_LOAN = "Personal Loan";
export const HOME_LOAN = "Home Loan";
export const GOLD_LOAN = "Gold Loan";
export const INTERESTED = "Interested";
export const FOLLOW_UP = "Follow Up";
export const CALL_BACK = "Call Back";
export const RNR_RING_NO_RESPONSE = "RNR ( Ring No Response )";
export const SWITCHED_OFF = "Switched Off";
export const BUSY = "Busy";
export const NOT_INTERESTED = "Not Interested";
export const NOT_WORKING_NOT_REACHABLE = "Not Working / Not Reachable";
export const NOT_POSSIBLE = "Not Possible";
export const VERIFICATION_1 = "Verification 1";
export const SCHEDULE_FOR_WALK_IN = "Schedule For Walk-In";
export const SCHEDULE_CALL_WITH_MANAGER = "Schedule Call With Manager";
export const RESCHEDULE_WALK_IN = "Reschedule Walk-In"
export const RESCHEDULE_CALL_WITH_MANAGER = "Reschedule Call With Manager"
export const UPCOMING = "Upcoming"
export const PENDING = "Pending"
export const CANCELLED = "Cancelled"
export const LEADS = "Leads"
export const WALK_INS = "Walk-Ins"
export const EMPLOYEES = "Employees"
export const NOT_CONTACTED = "Not Contacted"
export const APPLICATION_CLOSED = "Closed"

export const terminologiesMap = new Map([
  [NOT_CONTACTED, 'Unattended'],
  [INTERESTED, 'Active Prospect'],
  [FOLLOW_UP, 'Ongoing Contact'],
  [CALL_BACK,'Re-call'],
  [RNR_RING_NO_RESPONSE, 'Non-responsive'],
  [SWITCHED_OFF, 'Unavailable'],
  [BUSY,'Line Engaged'],
  [NOT_INTERESTED,'Disengaged Lead'],
  [NOT_WORKING_NOT_REACHABLE,'Inactive'],
  [NOT_POSSIBLE,'Ineligible'],
  [SCHEDULE_FOR_WALK_IN, 'Book Appointment'],
  [VERIFICATION_1, 'Preliminary Approval'],
  [SCHEDULE_CALL_WITH_MANAGER, 'Executive Consultation'],
  [TWELVE_DOCUMENTS_COLLECTED, "Documentation Collected"],
  [SCHEDULED_FOR_WALK_IN, 'Appointment Booked'],
  [APPROVED_FOR_WALK_IN, "Paperwork Verified"],
  [SCHEDULED_CALL_WITH_MANAGER, 'Advisor Consultation'],
  [OTHERS, OTHERS],
  [UNDER_REVIEW, UNDER_REVIEW],
  [ON_HOLD, "Application on Hold"],
  [MANAGER_1_APPROVED, "Stage 1 Approved"],
  [MANAGER_2_APPROVED, "Supervisor Approved"],
  [REJECTED, REJECTED],
  [NORMAL_LOGIN, NORMAL_LOGIN],
  [OKAY_FOR_POLICY, "Policy Confirmation"],
  [THINK_AND_GET_BACK, "Under Consideration"],
  [NOT_OKAY_FOR_POLICY, "Policy Declined"],
  [RESCHEDULE_WALK_IN, "Reschedule Appointment"],
  [RESCHEDULE_CALL_WITH_MANAGER, "Advisor Call Rescheduled"],
  [CLOSED, "Application Closed"],
  [LOGIN, LOGIN],
  [WALK_INS, "Appointments"],
  [LEADS, "Pipeline Entries"]
])

export const verificationStatusOptions = [
  { label: "Filter by verification status", value: "" },
  { label: terminologiesMap.get(UNDER_REVIEW), value: UNDER_REVIEW },
  { label: terminologiesMap.get(ON_HOLD), value: ON_HOLD },
  { label: terminologiesMap.get(MANAGER_1_APPROVED), value: MANAGER_1_APPROVED },
  { label: terminologiesMap.get(MANAGER_2_APPROVED), value: MANAGER_2_APPROVED },
  { label: terminologiesMap.get(APPROVED_FOR_WALK_IN), value: APPROVED_FOR_WALK_IN },
  { label: terminologiesMap.get(REJECTED), value: REJECTED },
  { label: terminologiesMap.get(NORMAL_LOGIN), value: NORMAL_LOGIN },
];

export const applicationStatusOptionsForWalkInsPageFilters = [
  { label: "Select application status", value: "" },
  { label: terminologiesMap.get(MANAGER_1_APPROVED), value: MANAGER_1_APPROVED },
  { label: terminologiesMap.get(MANAGER_2_APPROVED), value: MANAGER_2_APPROVED },
  { label: terminologiesMap.get(REJECTED), value: REJECTED },
  { label: terminologiesMap.get(CLOSED), value: CLOSED },
  { label: terminologiesMap.get(LOGIN), value: LOGIN },
  { label: terminologiesMap.get(NORMAL_LOGIN), value: NORMAL_LOGIN },
];

export const leadStatusOptionsForWalkInsPageFilters = [
  { label: "Select lead status", value: "" },
  { label: terminologiesMap.get(SCHEDULED_FOR_WALK_IN), value: SCHEDULED_FOR_WALK_IN },
  { label: terminologiesMap.get(SCHEDULED_CALL_WITH_MANAGER), value: SCHEDULED_CALL_WITH_MANAGER },
  { label: terminologiesMap.get(OKAY_FOR_POLICY), value: OKAY_FOR_POLICY },
  { label: terminologiesMap.get(THINK_AND_GET_BACK), value: THINK_AND_GET_BACK },
  { label: terminologiesMap.get(TWELVE_DOCUMENTS_COLLECTED), value: TWELVE_DOCUMENTS_COLLECTED },
  { label: terminologiesMap.get(NOT_OKAY_FOR_POLICY), value: NOT_OKAY_FOR_POLICY },
  { label: terminologiesMap.get(OTHERS), value: OTHERS },
];

export const userRoleOptions = [
  { label: "Select Role", value: "", id: 0 },
  { label: ADMIN, value: ROLE_ADMIN, id: 1 },
  { label: MANAGER, value: ROLE_MANAGER, id: 2 },
  { label: EMPLOYEE, value: ROLE_EMPLOYEE, id: 3 },
];

export const loanTypeOptions = [
  { label: "Select Loan", value: "" },
  { label: PERSONAL_LOAN, value: PERSONAL_LOAN },
  { label: HOME_LOAN, value: HOME_LOAN },
  { label: GOLD_LOAN, value: GOLD_LOAN },
];

export const leadStatusOptionsForVerification1Table = [
  { label: "Filter by lead status", value: "", style:{color:'#464646',backgroundColor:'#F2F7FE', } }, // 808080
  { label: terminologiesMap.get(VERIFICATION_1), value: VERIFICATION_1 , style:{color:'#464646',backgroundColor:'#F2F7FE'}}, // FA913C
  { label: terminologiesMap.get(SCHEDULE_FOR_WALK_IN), value: SCHEDULE_FOR_WALK_IN , style:{color:'#464646',backgroundColor:'#F2F7FE'}}, // 0A509B
  { label: terminologiesMap.get(SCHEDULE_CALL_WITH_MANAGER), value: SCHEDULE_CALL_WITH_MANAGER , style:{color:'#464646',backgroundColor:'#F2F7FE'}}, // 968C41
  { label: terminologiesMap.get(OTHERS), value: OTHERS , style:{color:'#464646',backgroundColor:'#F2F7FE'}}, // FF0000
];

export const verificationStatusOptionsForVerificationTable = [
  { label: "Select Status", value: "", style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 808080
  { label: UNDER_REVIEW, value: UNDER_REVIEW, style:{color:'#464646',backgroundColor:'#F2F7FE'} }, // 0A509B
  { label: ON_HOLD, value: ON_HOLD, style:{color:'#464646',backgroundColor:'#F2F7FE'} }, // 37234B
  { label: MANAGER_1_APPROVED, value: MANAGER_1_APPROVED, style:{color:'#464646',backgroundColor:'#F2F7FE'} }, // 00A2A8
  { label: MANAGER_2_APPROVED, value: MANAGER_2_APPROVED, style:{color:'#464646',backgroundColor:'#F2F7FE'} }, // 3ECFA9
  { label: APPROVED_FOR_WALK_IN, value: APPROVED_FOR_WALK_IN, style:{color:'#464646',backgroundColor:'#F2F7FE'} }, // 00B90F
  { label: REJECTED, value: REJECTED, style:{color:'#464646',backgroundColor:'#F2F7FE'} }, // F01923
  { label: NORMAL_LOGIN, value: NORMAL_LOGIN, style:{color:'#464646',backgroundColor:'#F2F7FE'} }, // FF0000
];

export const leadStatusOptionsForWalkInsPageTable = [
  { label: "Select Status", value: "", style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 808080
  { label: OKAY_FOR_POLICY, value: OKAY_FOR_POLICY, style:{color:'#464646', backgroundColor:'#F2F7FE'} },//  0A509B
  { label: THINK_AND_GET_BACK, value: THINK_AND_GET_BACK, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 00A2A8
  { label: TWELVE_DOCUMENTS_COLLECTED, value: TWELVE_DOCUMENTS_COLLECTED, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 00B90F
  { label: NOT_OKAY_FOR_POLICY, value: NOT_OKAY_FOR_POLICY, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // F01923
  { label: RESCHEDULE_WALK_IN, value: RESCHEDULE_WALK_IN, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 37234B
  { label: RESCHEDULE_CALL_WITH_MANAGER, value: RESCHEDULE_CALL_WITH_MANAGER, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 3ECFA9
  { label: OTHERS, value: OTHERS, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // FF0000
]

export const applicationStatusOptionsForWalkInsPageTable = [
  { label: "Select Status", value: "", style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 808080
  { label: MANAGER_1_APPROVED, value: MANAGER_1_APPROVED, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 00A2A8
  { label: MANAGER_2_APPROVED, value: MANAGER_2_APPROVED, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 3ECFA9
  { label: REJECTED, value: REJECTED, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // F01923
  { label: CLOSED, value: CLOSED, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // FF0000
  { label: LOGIN, value: LOGIN, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // FF0000
  { label: NORMAL_LOGIN, value: NORMAL_LOGIN, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // FF0000
]

export const optionColors = [
  {optionName:VERIFICATION_1, optionColor:'#B878BC'},
  {optionName:SCHEDULE_FOR_WALK_IN, optionColor:'#00BC86'},
  {optionName:SCHEDULED_FOR_WALK_IN, optionColor:'#00BC86'},
  {optionName:SCHEDULE_CALL_WITH_MANAGER, optionColor:'#2B323B'},
  {optionName:SCHEDULED_CALL_WITH_MANAGER, optionColor:'#2B323B'},
  {optionName:OTHERS, optionColor:'#2B323B'},
  {optionName:UNDER_REVIEW, optionColor:'#A6B200'},
  {optionName:ON_HOLD, optionColor:'#FF7B0F'},
  {optionName:MANAGER_1_APPROVED, optionColor:'#2B323B'},
  {optionName:MANAGER_2_APPROVED, optionColor:'#2B323B'},
  {optionName:APPROVED_FOR_WALK_IN, optionColor:'#00B9AA'},
  {optionName:REJECTED, optionColor:'#FF4C36'},
  {optionName:NORMAL_LOGIN, optionColor:'#6053EB'},
  {optionName:OKAY_FOR_POLICY, optionColor:'#17C328'},
  {optionName:THINK_AND_GET_BACK, optionColor:'#2B323B'},
  {optionName:TWELVE_DOCUMENTS_COLLECTED, optionColor:'#D6A10F'},
  {optionName:NOT_OKAY_FOR_POLICY, optionColor:'#2B323B'},
  {optionName:RESCHEDULE_WALK_IN, optionColor:'#36B9DD'},
  {optionName:RESCHEDULE_CALL_WITH_MANAGER, optionColor:'#2B323B'},
  {optionName:APPLICATION_CLOSED, optionColor:'#FF79B5'},
]

export const activityOptions = [
  { label: "Select Status", value: "" },
  { label: terminologiesMap.get(INTERESTED), value: INTERESTED },
  { label: terminologiesMap.get(FOLLOW_UP), value: FOLLOW_UP },
  { label: terminologiesMap.get(CALL_BACK), value: CALL_BACK },
  { label: terminologiesMap.get(RNR_RING_NO_RESPONSE), value: RNR_RING_NO_RESPONSE },
  { label: terminologiesMap.get(SWITCHED_OFF), value: SWITCHED_OFF },
  { label: terminologiesMap.get(BUSY), value: BUSY },
  { label: terminologiesMap.get(NOT_INTERESTED), value: NOT_INTERESTED },
  { label: terminologiesMap.get(NOT_WORKING_NOT_REACHABLE), value: NOT_WORKING_NOT_REACHABLE },
  { label: terminologiesMap.get(NOT_POSSIBLE), value: NOT_POSSIBLE },
  { label: terminologiesMap.get(SCHEDULED_CALL_WITH_MANAGER), value: SCHEDULED_CALL_WITH_MANAGER },
  { label: terminologiesMap.get(OTHERS), value: OTHERS },
  // { label: terminologiesMap.get(VERIFICATION_1), value:VERIFICATION_1}
];

export const quotes = [
  "Success is no accident. It’s hard work, perseverance, learning, sacrifice, and most of all, love for what you are doing.–Pelé" ,
  "Dreams don’t work unless you do.–John C. Maxwell",
  "The only place where success comes before work is in the dictionary.–Vidal Sassoon",
  "Hard work beats talent when talent doesn’t work hard.–Tim Notke",
  "There are no shortcuts to any place worth going.–Beverly Sills",
  "Work hard in silence, let your success be the noise.–Frank Ocean",
  "Great things come from hard work and perseverance. No excuses.–Kobe Bryant",
  "Success is the sum of small efforts repeated day in and day out.–Robert Collier",
  "Don’t watch the clock; do what it does—keep going.–Sam Levenson",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Believe you can, and you’re halfway there.–Theodore Roosevelt",
  "Stay positive, work hard, and make it happen.",
  "Your only limit is your mind. Train it to see possibilities, not obstacles.",
  "Success is not just about making money. It’s about making a difference.",
  "Every day may not be good, but there’s something good in every day.",
  "Do what you love, love what you do, and success will follow.",
  "A positive mindset brings positive things.–Philipp Reiter",
  "Doubt kills more dreams than failure ever will.–Suzy Kassem",
  "Your attitude determines your direction.",
  "You are capable of more than you know. Keep going!"
]

export const companyCategoriesMap = new Map([
  [1, "SUPER CAT"],
  [2, "CAT A"],
  [3, "CAT B"],
  [4, "CAT C"],
  [5, "CAT D"]
])