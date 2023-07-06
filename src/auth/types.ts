export type RegistrationDTO = {
  body: {
    firstName: string;
    lastName: string;
    userEmail: string;
    password: string;
  };
};

export type AuthorizationDTO = {
  body: {
    email: string;
    password: string;
  };
};
