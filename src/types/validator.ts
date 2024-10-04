export interface RegisterUserRequestBody {
  name: string;
  email: string;
  password: string;
  _id: string;
  role: "admin" | "user";
}
