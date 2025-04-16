import pandas as pd

# Define the API data
api_data = [
    # Auth Routes
    {
        'Route': 'Auth',
        'API Endpoint': '/auth/profile',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get user profile'
    },
    {
        'Route': 'Auth',
        'API Endpoint': '/auth/registerStudent',
        'Method': 'POST',
        'Parameters': 'avatar (file), user data',
        'Purpose': 'Register new student'
    },
    {
        'Route': 'Auth',
        'API Endpoint': '/auth/registerTutor',
        'Method': 'POST',
        'Parameters': 'avatar, degreeFile, credentialFile, user data',
        'Purpose': 'Register new tutor'
    },
    {
        'Route': 'Auth',
        'API Endpoint': '/auth/login',
        'Method': 'POST',
        'Parameters': 'username/email, password',
        'Purpose': 'User login'
    },
    {
        'Route': 'Auth',
        'API Endpoint': '/auth/update-password',
        'Method': 'PUT',
        'Parameters': 'oldPassword, newPassword',
        'Purpose': 'Update user password'
    },

    # User Routes
    {
        'Route': 'User',
        'API Endpoint': '/user/getClass/:id?',
        'Method': 'GET',
        'Parameters': 'classID (optional)',
        'Purpose': 'Get class information'
    },
    {
        'Route': 'User',
        'API Endpoint': '/user/getAllClass',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get all classes'
    },
    {
        'Route': 'User',
        'API Endpoint': '/user/getTutor/:id',
        'Method': 'GET',
        'Parameters': 'tutorID',
        'Purpose': 'Get tutor information'
    },
    {
        'Route': 'User',
        'API Endpoint': '/user/getMessage/:senderID&:receiverID',
        'Method': 'GET',
        'Parameters': 'senderID, receiverID',
        'Purpose': 'Get messages between users'
    },
    {
        'Route': 'User',
        'API Endpoint': '/user/complain',
        'Method': 'POST',
        'Parameters': 'complain data',
        'Purpose': 'Send complaint'
    },
    {
        'Route': 'User',
        'API Endpoint': '/user/sendMessage/:senderID&:receiverID',
        'Method': 'POST',
        'Parameters': 'message content',
        'Purpose': 'Send message'
    },
    {
        'Route': 'User',
        'API Endpoint': '/user/update/:id',
        'Method': 'PUT',
        'Parameters': 'avatar (file), user data',
        'Purpose': 'Update user information'
    },

    # Tutor Routes
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/viewStudent/:classID',
        'Method': 'GET',
        'Parameters': 'classID',
        'Purpose': 'View students in a class'
    },
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/viewRequest/:tutorID',
        'Method': 'GET',
        'Parameters': 'tutorID',
        'Purpose': 'View tutor requests'
    },
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/viewFeedback/:classID',
        'Method': 'GET',
        'Parameters': 'classID',
        'Purpose': 'View class feedback'
    },
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/check-status/:id',
        'Method': 'GET',
        'Parameters': 'tutorID',
        'Purpose': 'Check tutor status'
    },
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/blogs/',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get all blogs'
    },
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/blogs/:id',
        'Method': 'GET',
        'Parameters': 'blogID',
        'Purpose': 'Get specific blog'
    },
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/createClasses',
        'Method': 'POST',
        'Parameters': 'class data',
        'Purpose': 'Create new class'
    },
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/updateClasses/:id',
        'Method': 'POST',
        'Parameters': 'classID, class data',
        'Purpose': 'Update class information'
    },
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/findClasses/:search',
        'Method': 'POST',
        'Parameters': 'search term',
        'Purpose': 'Find classes by tutor ID'
    },
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/activeClasses/:id',
        'Method': 'PUT',
        'Parameters': 'classID',
        'Purpose': 'Activate class'
    },
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/deleteClasses/:id',
        'Method': 'DELETE',
        'Parameters': 'classID',
        'Purpose': 'Delete class'
    },
    {
        'Route': 'Tutor',
        'API Endpoint': '/tutor/confirmRequest',
        'Method': 'DELETE',
        'Parameters': 'request data',
        'Purpose': 'Confirm tutor request'
    },

    # Student Routes
    {
        'Route': 'Student',
        'API Endpoint': '/student/classes',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get student\'s classes'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/getTutor/:search?',
        'Method': 'GET',
        'Parameters': 'search term (optional)',
        'Purpose': 'Search for tutors'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/searchClassByTutorName/:search',
        'Method': 'GET',
        'Parameters': 'search term',
        'Purpose': 'Search classes by tutor name'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/searchTutorByTutorName/:search',
        'Method': 'GET',
        'Parameters': 'search term',
        'Purpose': 'Search tutors by name'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/searchClassByClassName/:search',
        'Method': 'GET',
        'Parameters': 'search term',
        'Purpose': 'Search classes by class name'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/searchClassBySubject/:id',
        'Method': 'GET',
        'Parameters': 'subjectID',
        'Purpose': 'Search classes by subject'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/checkEnroll/:id',
        'Method': 'GET',
        'Parameters': 'classID',
        'Purpose': 'Check enrollment status'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/blogs/',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get all blogs'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/blogs/:id',
        'Method': 'GET',
        'Parameters': 'blogID',
        'Purpose': 'Get specific blog'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/viewRequest/:studentID',
        'Method': 'GET',
        'Parameters': 'studentID',
        'Purpose': 'View student requests'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/enrollClass/:id',
        'Method': 'POST',
        'Parameters': 'classID',
        'Purpose': 'Enroll in a class'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/unEnrollClass/:id',
        'Method': 'POST',
        'Parameters': 'classID',
        'Purpose': 'Unenroll from a class'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/feedback/:classID',
        'Method': 'POST',
        'Parameters': 'classID, feedback data',
        'Purpose': 'Submit class feedback'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/requestClass/:tutorID',
        'Method': 'POST',
        'Parameters': 'tutorID, request data',
        'Purpose': 'Request a class'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/blogs/',
        'Method': 'POST',
        'Parameters': 'blog data',
        'Purpose': 'Create blog'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/blogs/:id',
        'Method': 'PUT',
        'Parameters': 'blogID, blog data',
        'Purpose': 'Update blog'
    },
    {
        'Route': 'Student',
        'API Endpoint': '/student/blogs/:id',
        'Method': 'DELETE',
        'Parameters': 'blogID',
        'Purpose': 'Delete blog'
    },

    # Admin Routes
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/updateUsers/:id',
        'Method': 'PUT',
        'Parameters': 'userID, user data',
        'Purpose': 'Update user information'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/banUsers/:id',
        'Method': 'PUT',
        'Parameters': 'userID',
        'Purpose': 'Ban user'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/unbanUsers/:id',
        'Method': 'PUT',
        'Parameters': 'userID',
        'Purpose': 'Unban user'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/complainList',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get all complaints'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/classList',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get all classes'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/classListExisted',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get all existing classes'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/getRequest',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get tutor requests'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/getUser',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get all users'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/getUserActiveByMonthAndYear',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get active users by month and year'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/getActiveUser',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get active users'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/getPaymentInfoThisMonth',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get payment information for current month'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/handleTutor/:id',
        'Method': 'POST',
        'Parameters': 'tutorID, action data',
        'Purpose': 'Handle tutor request'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/registerStudent',
        'Method': 'POST',
        'Parameters': 'avatar, user data',
        'Purpose': 'Register student (admin)'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/registerTutor',
        'Method': 'POST',
        'Parameters': 'avatar, degreeFile, credentialFile, user data',
        'Purpose': 'Register tutor (admin)'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/deleteClass/:id',
        'Method': 'DELETE',
        'Parameters': 'classID',
        'Purpose': 'Delete class'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/deleteUser/:id',
        'Method': 'DELETE',
        'Parameters': 'userID',
        'Purpose': 'Delete user'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/deleteStudent/:id',
        'Method': 'DELETE',
        'Parameters': 'studentID',
        'Purpose': 'Delete student'
    },
    {
        'Route': 'Admin',
        'API Endpoint': '/admin/deleteComplains/:id',
        'Method': 'DELETE',
        'Parameters': 'complainID',
        'Purpose': 'Delete complaint'
    },

    # Payment Routes
    {
        'Route': 'Payment',
        'API Endpoint': '/payment/getPaymentInfo',
        'Method': 'GET',
        'Parameters': '-',
        'Purpose': 'Get payment information'
    },
    {
        'Route': 'Payment',
        'API Endpoint': '/payment/createPayment',
        'Method': 'POST',
        'Parameters': 'payment data',
        'Purpose': 'Create new payment'
    },
    {
        'Route': 'Payment',
        'API Endpoint': '/payment/checkPayment/:id',
        'Method': 'POST',
        'Parameters': 'paymentID',
        'Purpose': 'Check payment status'
    }
]

# Create DataFrame
df = pd.DataFrame(api_data)

# Create Excel writer
writer = pd.ExcelWriter('API_Documentation.xlsx', engine='xlsxwriter')

# Write DataFrame to Excel
df.to_excel(writer, sheet_name='API Documentation', index=False)

# Get the xlsxwriter workbook and worksheet objects
workbook = writer.book
worksheet = writer.sheets['API Documentation']

# Add some formatting
header_format = workbook.add_format({
    'bold': True,
    'text_wrap': True,
    'valign': 'top',
    'fg_color': '#D7E4BC',
    'border': 1
})

# Format the columns
for col_num, value in enumerate(df.columns.values):
    worksheet.write(0, col_num, value, header_format)
    worksheet.set_column(col_num, col_num, 30)  # Set column width

# Save the Excel file
writer.close()

print("Excel file 'API_Documentation.xlsx' has been created successfully!") 