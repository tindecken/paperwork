export interface ChangePasswordRequestModel {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
