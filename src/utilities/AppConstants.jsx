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
export const TWELVE_DOCUMENTS_NOT_COLLECTED = "12 documents not collected";
export const NOT_OKAY_FOR_POLICY = "Not okay for Policy";
export const OTHERS = "Others";
export const ROLE_ADMIN = "ROLE_ADMIN";
export const ROLE_MANAGER = "ROLE_MANAGER";
export const ROLE_EMPLOYEE = "ROLE_EMPLOYEE";
export const ROLE_OPERATIONS_TEAM = "OPERATIONS_TEAM";
export const ADMIN = "Admin";
export const MANAGER = "Manager";
export const EMPLOYEE = "Employee";
export const OPERATIONS_TEAM = "Operations Team";
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
export const RESCHEDULED_CALL_WITH_MANAGER = "Re-Scheduled Call With Manager"
export const UPCOMING = "Upcoming"
export const PENDING = "Pending"
export const CANCELLED = "Cancelled"
export const LEADS = "Leads"
export const WALK_INS = "Walk-Ins"
export const EMPLOYEES = "Employees"
export const NOT_CONTACTED = "Not Contacted"
export const APPLICATION_CLOSED = "Closed"
export const RESCHEDULED_FOR_WALK_IN = "Re-Scheduled For Walk-In"
export const MALE = "male"
export const FEMALE = "female"
export const APPROVED_APPLICATIONS = "APPROVED_APPLICATIONS"
export const UNPAID = "UnPaid"
export const PAID = "Paid"
export const APPLICATION_APPROVED = "Application Approved"
export const CLOSING_DATE_CHANGED = "Closing Date Changed"
export const ADVANCE_AMOUNT_PAID = "Advance Amount Paid"
export const CLOSING_AMOUNT_PAID = "Closing Amount Paid"
export const ALL_CLEAR = "All Clear"
export const NEGATIVE_TRANSACTION = "Negative Transaction"
export const LOAN_DISBURSED_FROM_BANK = "Loans Disbursed From Bank"
export const APPLICATION_IS_CLOSED = "Application Closed"
export const LOGIN_STARTED = "Login Started"
export const ALL_POSITIVE = "All Positive"
export const ALL_LOANS_CLOSED = "All Loans Closed"
export const ALL_CLOSURE_DOCUMENTS_VERIFIED = "All Closure Documents Verified"
export const ALL_LOGIN_DOCUMENTS_VERIFIED = "All Login Documents Verified"
export const BUREAU_DISPUTE_RAISED = "Bureau Dispute Raised"
export const ALL_DISPUTES_UPDATED = "All Disputes Updated"
export const LOGIN_BANK_1 = "Login Bank 1"
export const LOGIN_BANK_2 = "Login Bank 2"
export const LOGIN_BANK_3 = "Login Bank 3"
export const LOGIN_BANK_4 = "Login Bank 4"
export const LOGIN_BANK_5 = "Login Bank 5"
export const LOGIN_BANK_6 = "Login Bank 6"
export const CLOSING_DATE = "closing_date"
export const VERIFICATION_DATE = "verification_date"
export const PRELIMINERY_CHECK = "PRELIMINERY_CHECK"
export const APPOINTMENTS = "APPOINTMENTS"
export const PIPELINE_ENTRIES = "PIPELINE_ENTRIES"
export const LOGIN_DATE_CHANGED = "Login Date Changed"
export const LOGIN_DATE = "login_date"

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
  [TWELVE_DOCUMENTS_NOT_COLLECTED, "Documentation Not Collected"],
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
  [LEADS, "Pipeline Entries"],
  [RESCHEDULED_FOR_WALK_IN, "Appointment Rescheduled"],
  [APPROVED_APPLICATIONS, "Approved Applications"],
  [APPLICATION_APPROVED, APPLICATION_APPROVED],
  [LOGIN_STARTED, LOGIN_STARTED],
  [ALL_POSITIVE, ALL_POSITIVE],
  [ALL_LOANS_CLOSED, ALL_LOANS_CLOSED],
  [ALL_CLOSURE_DOCUMENTS_VERIFIED, ALL_CLOSURE_DOCUMENTS_VERIFIED],
  [ALL_LOGIN_DOCUMENTS_VERIFIED, ALL_LOGIN_DOCUMENTS_VERIFIED],
  [BUREAU_DISPUTE_RAISED, BUREAU_DISPUTE_RAISED],
  [ALL_DISPUTES_UPDATED, ALL_DISPUTES_UPDATED],
  [LOGIN_BANK_1, LOGIN_BANK_1],
  [LOGIN_BANK_2, LOGIN_BANK_2],
  [LOGIN_BANK_3, LOGIN_BANK_3],
  [LOGIN_BANK_4, LOGIN_BANK_4],
  [LOGIN_BANK_5, LOGIN_BANK_5],
  [LOGIN_BANK_6, LOGIN_BANK_6],
  [ALL_CLEAR, ALL_CLEAR],
  [NEGATIVE_TRANSACTION, NEGATIVE_TRANSACTION],
  [APPLICATION_APPROVED,APPLICATION_APPROVED],
  [CLOSING_DATE_CHANGED,CLOSING_DATE_CHANGED],
  [ADVANCE_AMOUNT_PAID,ADVANCE_AMOUNT_PAID],
  [CLOSING_AMOUNT_PAID,CLOSING_AMOUNT_PAID],
  [LOAN_DISBURSED_FROM_BANK,LOAN_DISBURSED_FROM_BANK],
  [RESCHEDULED_CALL_WITH_MANAGER, "Advisor Call Rescheduled"],
  [APPLICATION_IS_CLOSED,APPLICATION_IS_CLOSED],
  [LOGIN_DATE_CHANGED,LOGIN_DATE_CHANGED]
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
  { label: OPERATIONS_TEAM, value: ROLE_OPERATIONS_TEAM, id: 4 },
];

export const userGenderOptions = [
  { label: "Select Role", value: "", id: 0 },
  { label: MALE, value: MALE, id: 1 },
  { label: FEMALE, value: FEMALE, id: 2 },
  // { label: EMPLOYEE, value: ROLE_EMPLOYEE, id: 3 },
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
  // { label: REJECTED, value: REJECTED, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // F01923
  // { label: CLOSED, value: CLOSED, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // FF0000
  // { label: LOGIN, value: LOGIN, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // FF0000
  // { label: NORMAL_LOGIN, value: NORMAL_LOGIN, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // FF0000
  { label: APPLICATION_APPROVED, value: APPLICATION_APPROVED, style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // FF0000
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
  "Success is no accident. It’s hard work, perseverance, learning, sacrifice, and most of all, love for what you are doing. – Pelé",
  "Dreams don’t work unless you do. – John C. Maxwell",
  "The only place where success comes before work is in the dictionary. – Vidal Sassoon",
  "Hard work beats talent when talent doesn’t work hard. – Tim Notke",
  "There are no shortcuts to any place worth going. – Beverly Sills",
  "Work hard in silence, let your success be the noise. – Frank Ocean",
  "Great things come from hard work and perseverance. No excuses. – Kobe Bryant",
  "Success is the sum of small efforts repeated day in and day out. – Robert Collier",
  "Don’t watch the clock; do what it does—keep going. – Sam Levenson",
  "Believe you can, and you’re halfway there. – Theodore Roosevelt",
  "A positive mindset brings positive things. – Philipp Reiter",
  "Doubt kills more dreams than failure ever will. – Suzy Kassem",
  "Success usually comes to those who are too busy to be looking for it. – Henry David Thoreau",
  "Don’t be afraid to give up the good to go for the great. – John D. Rockefeller",
  "I’m a greater believer in luck, and I find the harder I work the more I have of it. – Thomas Jefferson",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "Do not wait to strike till the iron is hot, but make it hot by striking. – William Butler Yeats",
  "What you get by achieving your goals is not as important as what you become by achieving your goals. – Zig Ziglar",
  "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
  "Positive anything is better than negative nothing. – Elbert Hubbard",
  "Energy and persistence conquer all things. – Benjamin Franklin"
];

export const companyCategoriesMap = new Map([
  [1, "SUPER CAT"],
  [2, "CAT A"],
  [3, "CAT B"],
  [4, "CAT C"],
  [5, "CAT D"]
])

export const getActivityOptions = (fromActivityLog = false) => {
  if (fromActivityLog) {
    return [
      { label: "Select Status", value: "" },
      { label: terminologiesMap.get(FOLLOW_UP), value: FOLLOW_UP },
      { label: terminologiesMap.get(CALL_BACK), value: CALL_BACK },
    ];
  }

  return [
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
  ];
};

export const leadStatusOptionsForUnPaidApprovedApplicationsPageTable = [
  { label: "Select Status", value: "", style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 808080
  {label: terminologiesMap.get(TWELVE_DOCUMENTS_COLLECTED), value: TWELVE_DOCUMENTS_COLLECTED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(ALL_CLEAR), value: ALL_CLEAR, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(NEGATIVE_TRANSACTION), value: NEGATIVE_TRANSACTION, style:{color:'#464646', backgroundColor:'#F2F7FE'}}
]

export const applicationStatusOptionsForUnPaidApprovedApplicationsPageTable = [
  { label: "Select Status", value: "", style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 808080
  {label: terminologiesMap.get(APPLICATION_APPROVED), value: APPLICATION_APPROVED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(CLOSING_DATE_CHANGED), value: CLOSING_DATE_CHANGED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(ADVANCE_AMOUNT_PAID), value: ADVANCE_AMOUNT_PAID, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(CLOSING_AMOUNT_PAID), value: CLOSING_AMOUNT_PAID, style:{color:'#464646', backgroundColor:'#F2F7FE'}}
]

export const leadStatusOptionsForPaidApprovedApplicationsPageTable = [
  { label: "Select Status", value: "", style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 808080
  {label: terminologiesMap.get(TWELVE_DOCUMENTS_COLLECTED), value: TWELVE_DOCUMENTS_COLLECTED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(ALL_CLEAR), value: ALL_CLEAR, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(NEGATIVE_TRANSACTION), value: NEGATIVE_TRANSACTION, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(ALL_CLOSURE_DOCUMENTS_VERIFIED), value: ALL_CLOSURE_DOCUMENTS_VERIFIED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(ALL_LOGIN_DOCUMENTS_VERIFIED), value: ALL_LOGIN_DOCUMENTS_VERIFIED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(OTHERS), value: OTHERS, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
]

export const leadStatusAfterClosingAmountPaidOptionsForPaidApprovedApplicationsPageTable = [
  {label: terminologiesMap.get(BUREAU_DISPUTE_RAISED), value: BUREAU_DISPUTE_RAISED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(ALL_DISPUTES_UPDATED), value: ALL_DISPUTES_UPDATED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(LOGIN_BANK_1), value: LOGIN_BANK_1, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(LOGIN_BANK_2), value: LOGIN_BANK_2, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(LOGIN_BANK_3), value: LOGIN_BANK_3, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(LOGIN_BANK_4), value: LOGIN_BANK_4, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(LOGIN_BANK_5), value: LOGIN_BANK_5, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(LOGIN_BANK_6), value: LOGIN_BANK_6, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
]

export const applicationStatusOptionsForPaidApprovedApplicationsPageTable = [
  { label: "Select Status", value: "", style:{color:'#464646', backgroundColor:'#F2F7FE'} }, // 808080
  {label: terminologiesMap.get(CLOSING_DATE_CHANGED), value: CLOSING_DATE_CHANGED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(ADVANCE_AMOUNT_PAID), value: ADVANCE_AMOUNT_PAID, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(CLOSING_AMOUNT_PAID), value: CLOSING_AMOUNT_PAID, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(OTHERS), value: OTHERS, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(LOGIN_DATE_CHANGED), value: LOGIN_DATE_CHANGED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  // {label: terminologiesMap.get(LOGIN_STARTED), value: LOGIN_STARTED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
]

export const applicationStatusBankLoginOptionsForPaidApprovedApplicationsPageTable = [
  {label: terminologiesMap.get(LOAN_DISBURSED_FROM_BANK), value: LOAN_DISBURSED_FROM_BANK, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
  {label: terminologiesMap.get(APPLICATION_IS_CLOSED), value: APPLICATION_IS_CLOSED, style:{color:'#464646', backgroundColor:'#F2F7FE'}},
]

export const leadStatusOptionsForUnPaidApprovedLeadsFilters = [
  { label: "Select lead status", value: "" },
  { label: terminologiesMap.get(ALL_CLEAR), value: ALL_CLEAR},
  { label: terminologiesMap.get(NEGATIVE_TRANSACTION), value: NEGATIVE_TRANSACTION },
];

export const leadStatusOptionsForPaidApprovedLeadsFilters = [
  { label: "Select lead status", value: "" },
  { label: terminologiesMap.get(ALL_CLEAR), value: ALL_CLEAR},
  { label: terminologiesMap.get(NEGATIVE_TRANSACTION), value: NEGATIVE_TRANSACTION },
  { label: terminologiesMap.get(ALL_LOGIN_DOCUMENTS_VERIFIED), value: ALL_LOGIN_DOCUMENTS_VERIFIED },
  { label: terminologiesMap.get(BUREAU_DISPUTE_RAISED), value: BUREAU_DISPUTE_RAISED },
  { label: terminologiesMap.get(ALL_DISPUTES_UPDATED), value: ALL_DISPUTES_UPDATED },
  { label: terminologiesMap.get(LOGIN_BANK_1), value: LOGIN_BANK_1 },
  { label: terminologiesMap.get(LOGIN_BANK_2), value: LOGIN_BANK_2 },
  { label: terminologiesMap.get(LOGIN_BANK_3), value: LOGIN_BANK_3 },
  { label: terminologiesMap.get(LOGIN_BANK_4), value: LOGIN_BANK_4 },
  { label: terminologiesMap.get(LOGIN_BANK_5), value: LOGIN_BANK_5 },
  { label: terminologiesMap.get(LOGIN_BANK_6), value: LOGIN_BANK_6 },
];

export const applicationStatusOptionsForUnPaidApprovedLeadsFilters = [
  { label: "Select application status", value: "" },
  { label: terminologiesMap.get(APPLICATION_APPROVED), value: APPLICATION_APPROVED},
  { label: terminologiesMap.get(CLOSING_DATE_CHANGED), value: CLOSING_DATE_CHANGED},
  { label: terminologiesMap.get(ADVANCE_AMOUNT_PAID), value: ADVANCE_AMOUNT_PAID},
  { label: terminologiesMap.get(CLOSING_AMOUNT_PAID), value: CLOSING_AMOUNT_PAID},
]

export const applicationStatusOptionsForPaidApprovedLeadsFilters = [
  { label: "Select application status", value: "" },
  { label: terminologiesMap.get(CLOSING_DATE_CHANGED), value: CLOSING_DATE_CHANGED},
  { label: terminologiesMap.get(ADVANCE_AMOUNT_PAID), value: ADVANCE_AMOUNT_PAID},
  { label: terminologiesMap.get(CLOSING_AMOUNT_PAID), value: CLOSING_AMOUNT_PAID},
  { label: terminologiesMap.get(LOAN_DISBURSED_FROM_BANK), value: LOAN_DISBURSED_FROM_BANK},
  { label: terminologiesMap.get(APPLICATION_IS_CLOSED), value: APPLICATION_IS_CLOSED},
  { label: terminologiesMap.get(OTHERS), value: OTHERS},
  { label: terminologiesMap.get(LOGIN_STARTED), value: LOGIN_STARTED},
]