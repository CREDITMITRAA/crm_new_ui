import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import leadsReducer from '../features/leads/leadsSlice'
import walkInsReducer from '../features/walk-ins/walkInsSlice'
import usersReducer from '../features/users/usersSlice'
import tasksReducer from '../features/tasks/tasksSlice'
import verificationRedcucer from '../features/verification/verificationSlice'
import employeesReducer from '../features/employee/employeeSlice'
import activityLogReducer from '../features/activity-logs/activityLogsSlice'
import leadDocumentsReducer from '../features/lead-documents/leadDocumentsSlice'
import loanReportsReducer from '../features/loan-reports/loanReportsSlice'
import creditReportsReducer from '../features/credit-reports/creditReportsSlice'
import activitiesReducer from '../features/activities/activitiesSlice'
import uiReducer from '../features/ui/uiSlice'
import onlinseUsersReducer from '../features/online-users/onlineUserSlice'
import notificationsReducer from '../features/notifications/notificationSlice'
import chartReducer from '../features/charts/chartsSlice'
import interactiveNotificationsReducer from '../features/interactive-notifications/interactiveNotificationsSlice'
import quoteDialogueSliceReducer from "../features/quote-dialogue/quoteDialogueSlice"

const store = configureStore({
    reducer:{
        auth: authReducer,
        users: usersReducer,
        leads: leadsReducer,
        walkIns: walkInsReducer,
        tasks: tasksReducer,
        verification: verificationRedcucer,
        employees: employeesReducer,
        activityLogs: activityLogReducer,
        leadDocuments: leadDocumentsReducer,
        loanReports: loanReportsReducer,
        creditReports: creditReportsReducer,
        activities: activitiesReducer,
        ui: uiReducer,
        onlineUsers: onlinseUsersReducer,
        notifications: notificationsReducer,
        charts: chartReducer,
        interactiveNotifications : interactiveNotificationsReducer,
        quoteDialogue: quoteDialogueSliceReducer
    }
})

export default store