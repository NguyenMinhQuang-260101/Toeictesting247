export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Confirm password length must be from 6 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  LOGOUT_SUCCESS: 'Logout success',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  GET_ME_SUCCESS: 'Get my profile success',
  USER_NOT_VERIFIED: 'User not verified',
  USER_NOT_ADMIN: 'User are not admin',
  RULE_MUST_BE_ADMIN_OR_USER: 'Rule must be 0(Amin) or 1(User)',
  USER_ID_MUST_BE_STRING: 'User id must be a string',
  USER_ID_IS_INFECTED: 'user id overlaps with your id',
  USERNAME_MUST_BE_STRING: 'Username must be a string',
  USERNAME_INVALID:
    'Username must be 4-15 characters long and contain only letters, numbers, underscores, not only numbers',
  USER_ID_INVALID: 'User id invalid',
  IMAGE_URL_MUST_BE_STRING: 'Avatar must be a string',
  IMAGE_URL_LENGTH: 'Avatar length must be from 1 to 200',
  LOCATION_MUST_BE_STRING: 'Location must be a string',
  LOCATION_LENGTH: 'Location length must be from 1 to 200',
  UPDATE_ME_SUCCESS: 'Update profile success',
  GET_PROFILE_SUCCESS: 'Get profile success',
  INVALID_USER_ID: 'Invalid user id',
  USERNAME_EXISTED: 'Username existed',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  GMAIL_NOT_VERIFIED: 'Gmail not verified',
  UPLOAD_SUCCESS: 'Upload success',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  GET_VIDEO_STATUS_SUCCESS: 'Get video status success'
} as const

export const COURSES_MESSAGES = {
  COURSE_MUST_NOT_BE_EMPTY: 'Course must not be empty',
  COURSE_ID_INVALID: 'Course id invalid',
  COURSE_NOT_FOUND: 'Course not found',
  COURSE_TYPE_INVALID: 'Course type invalid',
  TITLE_MUST_BE_STRING: 'Title must be a string',
  TITLE_MUST_NOT_BE_EMPTY: 'Title must not be empty',
  DESCRIPTION_MUST_BE_STRING: 'Description must be a string',
  DESCRIPTION_MUST_NOT_BE_EMPTY: 'Description must not be empty',
  CONTENT_MUST_BE_STRING: 'Content must be a string',
  CONTENT_MUST_NOT_BE_EMPTY: 'Content must not be empty',
  TEST_MUST_BE_AN_ARRAY_OF_TEST_ID: 'Test must be an array of test id',
  NOTIFICATION_MUST_BE_AN_OBJECT_ID: 'Notification must be an object id',
  THUMBNAILS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Thumbnails must be an array of media object',
  STATUS_INVALID: 'Status invalid',
  UPDATE_STATUS_CAN_ONLY_BE_SWITCHED_BY_CREATING_A_NOTIFICATION:
    'Update status can only be switched by creating a notification for this course',
  INACTIVE_STATUS_CAN_ONLY_BE_SWITCHED_BY_CREATING_A_NOTIFICATION:
    'The course is currently in Active status. The status can only be changed to Inactive by creating a notification',
  CANNOT_UPDATE_ACTIVE_COURSE: 'Cannot update active course. Can only update when the status is Updating',
  ACTIVE_STATUS_CAN_ONLY_BE_SWITCHED_WHEN_NOTIFICATION_EXPIRED:
    'The course is in updating status and cannot be changed to Active. The course will automatically switch to active status when a notification is created for the course to expire',
  COURSE_CANNOT_BE_DELETED_WHEN_IT_IS_ACTIVE: 'Course cannot be deleted when it is active'
} as const

export const DOCUMENTS_MESSAGES = {
  DOCUMENT_MUST_NOT_BE_EMPTY: 'Document must not be empty',
  DOCUMENT_ID_INVALID: 'Document id invalid',
  DOCUMENT_NOT_FOUND: 'Document not found',
  DOCUMENT_TYPE_INVALID: 'Document type invalid',
  TITLE_MUST_BE_STRING: 'Title must be a string',
  TITLE_MUST_NOT_BE_EMPTY: 'Title must not be empty',
  DESCRIPTION_MUST_BE_STRING: 'Description must be a string',
  DESCRIPTION_MUST_NOT_BE_EMPTY: 'Description must not be empty',
  CONTENT_MUST_BE_STRING: 'Content must be a string',
  CONTENT_MUST_NOT_BE_EMPTY: 'Content must not be empty',
  TEST_MUST_BE_AN_ARRAY_OF_TEST_ID: 'Test must be an array of test id',
  NOTIFICATION_MUST_BE_AN_OBJECT_ID: 'Notification must be an object id',
  THUMBNAILS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Thumbnails must be an array of media object',
  STATUS_INVALID: 'Status invalid',
  UPDATE_STATUS_CAN_ONLY_BE_SWITCHED_BY_CREATING_A_NOTIFICATION:
    'Update status can only be switched by creating a notification for this document ',
  INACTIVE_STATUS_CAN_ONLY_BE_SWITCHED_BY_CREATING_A_NOTIFICATION:
    'The document is currently in Active status. The status can only be changed to Inactive by creating a notification',
  CANNOT_UPDATE_ACTIVE_DOCUMENT: 'Cannot update active document. Can only update when the status is Updating',
  ACTIVE_STATUS_CAN_ONLY_BE_SWITCHED_WHEN_NOTIFICATION_EXPIRED:
    'The document is in updating status and cannot be changed to Active. The document will automatically switch to active status when a notification is created for the course to expire',
  COURSE_CANNOT_BE_DELETED_WHEN_IT_IS_ACTIVE: 'Document cannot be deleted when it is active',
  DOCUMENT_CANNOT_BE_DELETED_WHEN_IT_IS_ACTIVE: 'Document cannot be deleted when it is active'
} as const

export const TESTS_MESSAGES = {
  SOURCE_ID_INVALID: 'Source id invalid',
  TEST_ID_MUST_BE_AN_OBJECT_ID: 'Test id must be an ObjectId',
  TEST_ID_INVALID: 'Test id invalid',
  TEST_NOT_FOUND: 'Test not found',
  DOCUMENT_NOT_FOUND: 'Document not found',
  CAN_NOT_FOUND_COURSE_OR_DOCUMENT: 'Cannot found course or document',
  SOURCE_ID_MUST_NOT_BE_EMPTY: 'Source id must not be empty',
  SOURCE_ID_MUST_BE_AN_OBJECT_ID: 'Source id must be an ObjectId',
  TITLE_MUST_NOT_BE_EMPTY: 'Title must not be empty',
  TITLE_MUST_BE_STRING: 'Title must be a string',
  DESCRIPTION_MUST_NOT_BE_EMPTY: 'Description must not be empty',
  DESCRIPTION_MUST_BE_STRING: 'Description must be a string',
  TIMELINE_MUST_NOT_BE_EMPTY: 'Timeline must not be empty',
  TIMELINE_MUST_BE_A_NUMBER: 'Timeline must be a number',
  QUESTIONS_MUST_BE_AN_ARRAY_OF_QUESTION_ID: 'Questions must be an array of question id',
  CAN_NOT_CREATE_TEST_WHEN_COURSE_OR_DOCUMENT_IS_ACTIVE: 'Cannot create test when course or document is active',
  CAN_NOT_DELETE_TEST_WHEN_COURSE_OR_DOCUMENT_IS_ACTIVE: 'Cannot delete test when course or document is active',
  CAN_NOT_UPDATE_TEST_WHEN_COURSE_OR_DOCUMENT_IS_ACTIVE: 'Cannot update test when course or document is active'
} as const

export const QUESTIONS_MESSAGES = {
  QUESTION_ID_INVALID: 'Question id invalid',
  QUESTION_NOT_FOUND: 'Question not found',
  ORIGIN_NOT_FOUND: 'Origin not found. Meaning that cannot find the course or document that the question belongs to',
  TEST_ID_MUST_BE_STRING: 'Test id must be a string',
  TEST_ID_MUST_BE_AN_OBJECT_ID: 'Test id must be an ObjectId',
  NUM_QUEST_MUST_BE_A_NUMBER: 'Num quest must be a number',
  NUM_QUEST_MUST_NOT_BE_EMPTY: 'Num quest must not be empty',
  DESCRIPTION_MUST_BE_STRING: 'Description must be a string',
  DESCRIPTION_MUST_NOT_BE_EMPTY: 'Description must not be empty',
  CONTENT_MUST_BE_STRING_OR_MEDIA_OBJECT: 'Content must be a string or media object',
  CONTENT_MUST_BE_STRING: 'Content must be a string',
  CONTENT_MUST_NOT_BE_EMPTY: 'Content must not be empty',
  ANSWERS_MUST_BE_AN_ARRAY_OF_ANSWER_OBJECT: 'Answers must be an array of answer object',
  ANSWERS_MUST_NOT_BE_EMPTY: 'Answers must not be empty',
  CORRECT_AT_MUST_BE_AN_ANSWER_OBJECT: 'Correct at must be an answer object',
  CORRECT_AT_MUST_NOT_BE_EMPTY: 'Correct at must not be empty',
  SELECTED_AT_MUST_BE_AN_ANSWER_OBJECT: 'Selected at must be an answer object',
  SELECTED_AT_MUST_NOT_BE_EMPTY: 'Selected at must not be empty',
  SCORE_MUST_BE_A_NUMBER: 'Score must be a number',
  SCORE_MUST_NOT_BE_EMPTY: 'Score must not be empty',
  COURSE_OF_QUESTION_NOT_FOUND: 'Course of question not found',
  CAN_ONLY_CREATE_QUESTION_WHEN_COURSE_OR_DOCUMENT_IS_UPDATING_OR_INACTIVE:
    'Can only create question when course or document is updating or inactive',
  CAN_ONLY_UPDATE_QUESTION_WHEN_COURSE_OR_DOCUMENT_IS_UPDATING_OR_INACTIVE:
    'Can only update question when course or document is updating or inactive',
  CAN_ONLY_DELETE_QUESTION_WHEN_COURSE_OR_DOCUMENT_IS_UPDATING_OR_INACTIVE:
    'Can only delete question when course or document is updating or inactive'
} as const

export const NOTIFICATIONS_MESSAGES = {
  NOTIFICATION_ID_INVALID: 'Notification id invalid',
  NOTIFICATION_NOT_FOUND: 'Notification not found',
  NOTIFICATION_ID_NOT_EMPTY: 'Notification id not empty',
  TYPE_INVALID: 'Notification type invalid',
  TYPE_OF_NOTIFICATION_NOT_EMPTY: 'Notification type not empty',
  TITLE_NOT_EMPTY: 'Title not empty',
  TITLE_MUST_BE_STRING: 'Title must be a string',
  CONTENT_NOT_EMPTY: 'Content not empty',
  CONTENT_MUST_BE_STRING: 'Content must be a string',
  TARGET_TYPE_INVALID: 'Target type invalid',
  TARGET_TYPE_NOT_EMPTY: 'Target type not empty',
  TARGET_TYPE_OTHER_CANNOT_BE_USE_FOR_UPDATE_NOTIFICATION: 'Target type Other cannot be use for update notification',
  CAN_ONLY_USE_TARGET_TYPE_OTHER_FOR_OTHER_NOTIFICATION: 'Can only use target type Other for Other notification',
  DAY_MUST_BE_ISO8601: 'Day must be ISO8601',
  DAY_NOT_EMPTY: 'Day not empty',
  START_AT_MUST_BE_GREATER_THAN_CURRENT_DATE: 'Start at must be greater than current date',
  START_AT_MUST_BE_LESS_THAN_END_AT: 'Start at must be less than end at',
  END_AT_MUST_BE_GREATER_THAN_START_AT: 'End at must be greater than start at',
  TARGETS_MUST_BE_AN_ARRAY_OF_OBJECT_ID: 'Targets must be an array of ObjectId',
  CANNOT_UPDATE_NOTIFICATION_HAS_EXPIRED: 'Cannot update notification has expired'
} as const

export const SCORECARDS_MESSAGES = {
  SCORECARD_ID_INVALID: 'ScoreCard id invalid',
  SCORECARD_NOT_FOUND: 'ScoreCard not found',
  TOTAL_TIME_MUST_BE_A_NUMBER: 'Total time must be a number of seconds',
  QUESTIONS_MUST_BE_AN_ARRAY: 'Questions must be an array of question',
  QUESTION_ID_INVALID: 'Question id invalid',
  TOTAL_TIME_MUST_NOT_BE_EMPTY: 'Total time must not be empty',
  QUESTION_ID_MUST_NOT_BE_EMPTY: 'Question id must not be empty',
  TEST_ID_QUESTION_MUST_BE_THE_SAME_AS_THE_TEST_ID_IN_THE_BODY:
    'Test id question must be the same as the test id in the body'
} as const

export const SEARCH_MESSAGES = {
  TITLE_MUST_BE_STRING: 'Title must be a string',
  TITLE_MUST_NOT_BE_EMPTY: 'Title must not be empty',
  COURSE_TYPE_QUERY_MUST_BE_IN_ENUM_VALUES_COURSE_TYPE_QUERY:
    'Course type query must be in enum values CourseTypeQuery',
  DOCUMENT_TYPE_QUERY_MUST_BE_IN_ENUM_VALUES_DOCUMENT_TYPE_QUERY:
    'Document type query must be in enum values DocumentTypeQuery'
} as const
