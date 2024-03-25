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
    'The course is in updating status and cannot be changed to Active. The course will automatically switch to active status when a notification is created for the course to expire'
} as const

export const TESTS_MESSAGES = {
  SOURCE_ID_INVALID: 'Source id invalid',
  TEST_ID_MUST_BE_AN_OBJECT_ID: 'Test id must be an ObjectId',
  TEST_ID_INVALID: 'Test id invalid',
  TEST_NOT_FOUND: 'Test not found',
  SOURCE_ID_MUST_NOT_BE_EMPTY: 'Source id must not be empty',
  SOURCE_ID_MUST_BE_AN_OBJECT_ID: 'Source id must be an ObjectId',
  TITLE_MUST_NOT_BE_EMPTY: 'Title must not be empty',
  TITLE_MUST_BE_STRING: 'Title must be a string',
  DESCRIPTION_MUST_NOT_BE_EMPTY: 'Description must not be empty',
  DESCRIPTION_MUST_BE_STRING: 'Description must be a string',
  TIMELINE_MUST_NOT_BE_EMPTY: 'Timeline must not be empty',
  TIMELINE_MUST_BE_A_NUMBER: 'Timeline must be a number',
  QUESTIONS_MUST_BE_AN_ARRAY_OF_QUESTION_ID: 'Questions must be an array of question id',
  CAN_ONLY_UPDATE_TEST_WHEN_COURSE_IS_UPDATING_OR_INACTIVE: 'Can only update test when course is updating or inactive'
} as const

export const QUESTIONS_MESSAGES = {
  QUESTION_ID_INVALID: 'Question id invalid',
  QUESTION_NOT_FOUND: 'Question not found',
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
  CORRECT_AT_MUST_BE_AN_ANSWER_OBJECT: 'Correct at must be an answer object',
  SELECTED_AT_MUST_BE_AN_ANSWER_OBJECT: 'Selected at must be an answer object',
  SCORE_MUST_BE_A_NUMBER: 'Score must be a number'
} as const

export const NOTIFICATIONS_MESSAGES = {
  NOTIFICATION_ID_INVALID: 'Notification id invalid',
  NOTIFICATION_NOT_FOUND: 'Notification not found',
  TYPE_INVALID: 'Notification type invalid',
  TITLE_NOT_EMPTY: 'Title not empty',
  TITLE_MUST_BE_STRING: 'Title must be a string',
  CONTENT_NOT_EMPTY: 'Content not empty',
  CONTENT_MUST_BE_STRING: 'Content must be a string',
  TARGET_TYPE_INVALID: 'Target type invalid',
  TARGET_TYPE_NOT_EMPTY: 'Target type not empty',
  DAY_MUST_BE_ISO8601: 'Day must be ISO8601',
  TARGETS_MUST_BE_AN_ARRAY_OF_OBJECT_ID: 'Targets must be an array of ObjectId'
} as const
