export type RegistrationDTO = {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
};

export type AuthorizationDTO = {
  body: {
    email: string;
    password: string;
  };
};
