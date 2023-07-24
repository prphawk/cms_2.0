export class Routes {
  public static SIGN_IN = '/api/auth/signin';
  public static AUTHENTICATED = '/dashboard';
  public static EMPLOYEES = this.AUTHENTICATED + '/employees';
  public static COMMITTEES = this.AUTHENTICATED + '/committees';
  public static TEMPLATES = this.AUTHENTICATED + '/templates';
  public static SETTINGS = this.AUTHENTICATED + '/settings';
}
