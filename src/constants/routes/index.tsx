export class Routes {
  public static SIGN_IN = '/api/auth/signin';
  public static AUTHENTICATED = '/dashboard';
  public static EMPLOYEES = this.AUTHENTICATED + '/employees';
  public static COMMITTEES = this.AUTHENTICATED + '/committees';
}
