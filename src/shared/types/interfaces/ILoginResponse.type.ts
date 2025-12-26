// --------------------------------------------------
// LOGIN RESPONSE (matches LoginResponseDTO)
// --------------------------------------------------
export interface ILoginResponse {
    token: string;
    message: string;
    userId: number | null;
    name: string;
  }