export class GlobalConstant {
  public static genericError: string =
    'Something went wrong. Please try agin later ';
  public static unauthorized: string =
    'You are not aithorized person to acess this page';
  public static nameRegex: string = '[a-zA-Z0-9 ]*';
  public static emailRegex: string =
    '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';

  public static contactNumberRegex: string = '^[e0-9]{10,10}$';

  public static error: string = 'error';
}
