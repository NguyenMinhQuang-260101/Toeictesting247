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
  Course
}

export enum NotificationType {
  Update,
  Other
}
