export const PASSWORD_RULE: RegExp =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const PASSWORD_RULE_MESSAGE: string =
  'Password should have 1 upper case, lowercase letter along with a number and special character.';
