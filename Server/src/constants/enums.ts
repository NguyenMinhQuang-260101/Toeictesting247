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
