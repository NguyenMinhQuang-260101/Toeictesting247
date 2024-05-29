export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  EmailVerifyToken,
  ForgotPasswordToken
}

export enum UserRuleType {
  Admin,
  User
}

export enum MediaType {
  Image,
  Audio,
  Video
}

export enum CourseType {
  Listening,
  Reading,
  Full
}

export enum DocumentType {
  Vocabulary,
  Grammar
}

export enum QuestionType {
  SimpleQuestion,
  QuoteQuestion,
  DoubleQuestion,
  TripleQuestion,
  QuadrupleQuestion,
  QuintupleQuestion
}

export enum QuestionContentType {
  Listening,
  Reading
}

export enum OperatingStatus {
  Active,
  Inactive,
  Updating
}

export enum TargetType {
  Document,
  Course,
  Other
}

export enum NotificationType {
  Update,
  Other
}

export enum CourseTypeQuery {
  Listening = 'listening',
  Reading = 'reading',
  Full = 'full'
}

export enum DocumentTypeQuery {
  Vocabulary = 'vocabulary',
  Grammar = 'grammar'
}

export enum QuestionTypeQuery {
  SimpleQuestion = 'simple_question',
  DoubleQuestion = 'double_question',
  TripleQuestion = 'triple_question',
  QuadrupleQuestion = 'quadruple_question',
  QuintupleQuestion = 'quintuple_question'
}

export enum QuestionContentTypeQuery {
  Listening = 'listening',
  Reading = 'reading'
}
