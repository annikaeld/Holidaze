export interface RegisterData {
  name: string;
  email: string;
  password: string;
  venueManager: boolean;
}

export interface RegisterResponse {
  data: {
    name: string;
    email: string;
    venueManager: boolean;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    name: string;
    email: string;
    venueManager: boolean;
    accessToken: string;
    avatar?: {
      url: string;
      alt: string;
    };
  };
}
